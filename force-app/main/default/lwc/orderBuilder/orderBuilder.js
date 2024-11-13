import { LightningElement, wire, api } from 'lwc';
import { ShowToastEvent } from 'lightning/platformShowToastEvent';
import { reduceErrors } from 'c/ldsUtils';
/** Record DML operations. */
import { createRecord, updateRecord, deleteRecord } from 'lightning/uiRecordApi';
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
function getQuantity(orderItem) {
    return orderItem.Qty_S__c + orderItem.Qty_M__c + orderItem.Qty_M__c;
}
/**
 * Gets the price for the specified quantity of Order_Item__c SObject.
 */
function getPrice(orderItem, quantity) {
    return orderItem.Price__c * quantity;
}
/**
 * Calculates the quantity and price of all Order_Item__c SObjects.
 */
function calculateOrderSummary(orderItems) {
    // noinspection UnnecessaryLocalVariableJS
    const summary = orderItems.reduce((acc, orderItem) => {
        const quantity = getQuantity(orderItem);
        const price = getPrice(orderItem, quantity);
        acc.quantity += quantity;
        acc.price += price;
        return acc;
    }, { quantity: 0, price: 0 });
    return summary;
}
/**
 * Builds Order__c by CRUD'ing the related Order_Item__c SObjects.
 */
export default class OrderBuilder extends LightningElement {
    /** Id of Order__c SObject to display. */
    @api
    recordId;
    /** The Order_Item__c SObjects to display. */
    orderItems;
    /** Total price of the Order__c. Calculated from this.orderItems. */
    orderPrice = 0;
    /** Total quantity of the Order__c. Calculated from this.orderItems. */
    orderQuantity = 0;
    error;
    /** Wired Apex result so it may be programmatically refreshed. */
    wiredOrderItems;
    /** Apex load the Order__c's Order_Item_c[] and their related Product__c details. */
    @wire(getOrderItems, { orderId: '$recordId' })
    wiredGetOrderItems(value) {
        this.wiredOrderItems = value;
        if (value.error) {
            this.error = value.error;
        }
        else if (value.data) {
            this.setOrderItems(value.data);
        }
    }
    /** Updates the order items, recalculating the order quantity and price. */
    setOrderItems(orderItems) {
        this.orderItems = orderItems.slice();
        const summary = calculateOrderSummary(this.orderItems);
        this.orderQuantity = summary.quantity;
        this.orderPrice = summary.price;
    }
    /** Handles drag-and-dropping a new product to create a new Order_Item__c. */
    handleDrop(event) {
        event.preventDefault();
        // Product__c from LDS
        const product = JSON.parse(event.dataTransfer.getData('product'));
        // build new Order_Item__c record
        const fields = {};
        fields[ORDER_FIELD.fieldApiName] = this.recordId;
        fields[PRODUCT_FIELD.fieldApiName] = product.Id;
        fields[PRICE_FIELD.fieldApiName] = Math.round(product.MSRP__c * DISCOUNT);
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
            this.dispatchEvent(new ShowToastEvent({
                title: 'Error creating order',
                message: reduceErrors(e).join(', '),
                variant: 'error'
            }));
        });
    }
    // noinspection JSMethodCanBeStatic
    /** Handles for dragging events. */
    handleDragOver(event) {
        event.preventDefault();
    }
    /** Handles event to change Order_Item__c details. */
    handleOrderItemChange(evt) {
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
            this.dispatchEvent(new ShowToastEvent({
                title: 'Error updating order item',
                message: reduceErrors(e).join(', '),
                variant: 'error'
            }));
        });
    }
    /** Handles event to delete Order_Item__c. */
    handleOrderItemDelete(evt) {
        const id = evt.detail.id;
        // optimistically make the change on the client
        const previousOrderItems = this.orderItems;
        const orderItems = this.orderItems.filter((orderItem) => orderItem.Id !== id);
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
            this.dispatchEvent(new ShowToastEvent({
                title: 'Error deleting order item',
                message: reduceErrors(e).join(', '),
                variant: 'error'
            }));
        });
    }
    get hasNoOrderItems() {
        return this.orderItems.length === 0;
    }
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoib3JkZXJCdWlsZGVyLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsib3JkZXJCdWlsZGVyLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBLE9BQU8sRUFBRSxnQkFBZ0IsRUFBRSxJQUFJLEVBQUUsR0FBRyxFQUFFLE1BQU0sS0FBSyxDQUFDO0FBQ2xELE9BQU8sRUFBRSxjQUFjLEVBQUUsTUFBTSxrQ0FBa0MsQ0FBQztBQUNsRSxPQUFPLEVBQUUsWUFBWSxFQUFFLE1BQU0sWUFBWSxDQUFDO0FBRTFDLDZCQUE2QjtBQUM3QixPQUFPLEVBQ0gsWUFBWSxFQUNaLFlBQVksRUFDWixZQUFZLEVBQ2YsTUFBTSx1QkFBdUIsQ0FBQztBQUUvQix5Q0FBeUM7QUFDekMsT0FBTyxFQUFFLFdBQVcsRUFBRSxNQUFNLGtCQUFrQixDQUFDO0FBQy9DLE9BQU8sYUFBYSxNQUFNLGdEQUFnRCxDQUFDO0FBRTNFLDRCQUE0QjtBQUM1QixPQUFPLGlCQUFpQixNQUFNLGtDQUFrQyxDQUFDO0FBQ2pFLE9BQU8sV0FBVyxNQUFNLDJDQUEyQyxDQUFDO0FBQ3BFLE9BQU8sYUFBYSxNQUFNLDZDQUE2QyxDQUFDO0FBQ3hFLE9BQU8sV0FBVyxNQUFNLDJDQUEyQyxDQUFDO0FBRXBFLHNFQUFzRTtBQUN0RSxNQUFNLFFBQVEsR0FBRyxHQUFHLENBQUM7QUFFckI7O0dBRUc7QUFDSCxTQUFTLFdBQVcsQ0FBQyxTQUF3QjtJQUN6QyxPQUFPLFNBQVMsQ0FBQyxRQUFRLEdBQUcsU0FBUyxDQUFDLFFBQVEsR0FBRyxTQUFTLENBQUMsUUFBUSxDQUFDO0FBQ3hFLENBQUM7QUFFRDs7R0FFRztBQUNILFNBQVMsUUFBUSxDQUFDLFNBQXdCLEVBQUUsUUFBZ0I7SUFDeEQsT0FBTyxTQUFTLENBQUMsUUFBUSxHQUFHLFFBQVEsQ0FBQztBQUN6QyxDQUFDO0FBRUQ7O0dBRUc7QUFDSCxTQUFTLHFCQUFxQixDQUFDLFVBQTJCO0lBQ3RELDBDQUEwQztJQUMxQyxNQUFNLE9BQU8sR0FB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