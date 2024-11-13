import { LightningElement, wire, api } from 'lwc';
import { ShowToastEvent } from 'lightning/platformShowToastEvent';
import { reduceErrors } from 'c/ldsUtils';

/** Record DML operations. */
import {
    createRecord,
    updateRecord,
    deleteRecord
} from 'lightning/uiRecordApi';

/** Use Apex to fetch related records. */
import { refreshApex } from '@salesforce/apex';
import getOrderItems from '@salesforce/apex/OrderController.getOrderItems';

/** Order_Item__c Schema. */
import ORDER_ITEM_OBJECT from '@salesforce/schema/Order_Item__c';
import ORDER_FIELD from '@salesforce/schema/Order_Item__c.Order__c';
import PRODUCT_FIELD from '@salesforce/schema/Order_Item__c.Product__c';
import PRICE_FIELD from '@salesforce/schema/Order_Item__c.Price__c';

/** Discount for resellers. TODO - move to custom field on Account. */
const DISCOUNT = 0.6;

/**
 * Gets the quantity of all items in an Order_Item__c SObject.
 */
function getQuantity(orderItem: Order_Item__c): number {
    return orderItem.Qty_S__c + orderItem.Qty_M__c + orderItem.Qty_M__c;
}

/**
 * Gets the price for the specified quantity of Order_Item__c SObject.
 */
function getPrice(orderItem: Order_Item__c, quantity: number): number {
    return orderItem.Price__c * quantity;
}

/**
 * Calculates the quantity and price of all Order_Item__c SObjects.
 */
function calculateOrderSummary(orderItems: Order_Item__c[]) {
    const summary = orderItems.reduce(
        (acc, orderItem) => {
            const quantity = getQuantity(orderItem);
            const price = getPrice(orderItem, quantity);
            acc.quantity += quantity;
            acc.price += price;
            return acc;
        },
        { quantity: 0, price: 0 }
    );
    return summary;
}

/**
 * Builds Order__c by CRUD'ing the related Order_Item__c SObjects.
 */
export default class OrderBuilder extends LightningElement {
    /** Id of Order__c SObject to display. */
    @api recordId: string;

    /** The Order_Item__c SObjects to display. */
    orderItems: Order_Item__c[];

    /** Total price of the Order__c. Calculated from this.orderItems. */
    orderPrice = 0;

    /** Total quantity of the Order__c. Calculated from this.orderItems. */
    orderQuantity = 0;

    error: any;

    /** Wired Apex result so it may be programmatically refreshed. */
    wiredOrderItems: WireResult<Order_Item__c[]>;

    /** Apex load the Order__c's Order_Item_c[] and their related Product__c details. */
    @wire(getOrderItems, { orderId: '$recordId' })
    wiredGetOrderItems(value: WireResult<Order_Item__c[]>) {
        this.wiredOrderItems = value;
        if (value.error) {
            this.error = value.error;
        } else if (value.data) {
            this.setOrderItems(value.data);
        }
    }

    /** Updates the order items, recalculating the order quantity and price. */
    setOrderItems(orderItems: Order_Item__c[]) {
        this.orderItems = orderItems.slice();
        const summary = calculateOrderSummary(this.orderItems);
        this.orderQuantity = summary.quantity;
        this.orderPrice = summary.price;
    }

    /** Handles drag-and-dropping a new product to create a new Order_Item__c. */
    handleDrop(event: DragEvent) {
        event.preventDefault();
        // Product__c from LDS
        const product = <Product__c>JSON.parse(event.dataTransfer.getData('product'));

        // build new Order_Item__c record
        const fields = {};
        fields[ORDER_FIELD.fieldApiName] = this.recordId;
        fields[PRODUCT_FIELD.fieldApiName] = product.Id;
        fields[PRICE_FIELD.fieldApiName] = Math.round(
            product.MSRP__c * DISCOUNT
        );

        // create Order_Item__c record on server
        const recordInput = {
            apiName: ORDER_ITEM_OBJECT.objectApiName,
            fields
        };
        createRecord(recordInput)
            .then(() => {
                // refresh the Order_Item__c SObjects
                return refreshApex(this.wiredOrderItems);
            })
            .catch((e) => {
                this.dispatchEvent(
                    new ShowToastEvent({
                        title: 'Error creating order',
                        message: reduceErrors(e).join(', '),
                        variant: 'error'
                    })
                );
            });
    }

    // noinspection JSMethodCanBeStatic
    /** Handles for dragging events. */
    handleDragOver(event: DragEvent) {
        event.preventDefault();
    }

    /** Handles event to change Order_Item__c details. */
    handleOrderItemChange(evt: {detail: {} & {Id: any} & any}) {
        const orderItemChanges = evt.detail;

        // optimistically make the change on the client
        const previousOrderItems = this.orderItems;
        const orderItems = this.orderItems.map((orderItem) => {
            if (orderItem.Id === orderItemChanges.Id) {
                // synthesize a new Order_Item__c SObject
                return Object.assign({}, orderItem, orderItemChanges);
            }
            return orderItem;
        });
        this.setOrderItems(orderItems);

        // update Order_Item__c on the server
        const recordInput = { fields: orderItemChanges };
        updateRecord(recordInput)
            .then(() => {
                // if there were triggers/etc that invalidate the Apex result then we'd refresh it
                // return refreshApex(this.wiredOrderItems);
            })
            .catch((e) => {
                // error updating server so rollback to previous data
                this.setOrderItems(previousOrderItems);
                this.dispatchEvent(
                    new ShowToastEvent({
                        title: 'Error updating order item',
                        message: reduceErrors(e).join(', '),
                        variant: 'error'
                    })
                );
            });
    }

    /** Handles event to delete Order_Item__c. */
    handleOrderItemDelete(evt: {detail: {id: any}}) {
        const id = evt.detail.id;

        // optimistically make the change on the client
        const previousOrderItems = this.orderItems;
        const orderItems = this.orderItems.filter(
            (orderItem) => orderItem.Id !== id
        );
        this.setOrderItems(orderItems);

        // delete Order_Item__c SObject on the server
        deleteRecord(id)
            .then(() => {
                // if there were triggers/etc that invalidate the Apex result then we'd refresh it
                // return refreshApex(this.wiredOrderItems);
            })
            .catch((e) => {
                // error updating server so rollback to previous data
                this.setOrderItems(previousOrderItems);
                this.dispatchEvent(
                    new ShowToastEvent({
                        title: 'Error deleting order item',
                        message: reduceErrors(e).join(', '),
                        variant: 'error'
                    })
                );
            });
    }

    get hasNoOrderItems() {
        return this.orderItems.length === 0;
    }
}
