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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoib3JkZXJCdWlsZGVyLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsib3JkZXJCdWlsZGVyLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBLE9BQU8sRUFBRSxnQkFBZ0IsRUFBRSxJQUFJLEVBQUUsR0FBRyxFQUFFLE1BQU0sS0FBSyxDQUFDO0FBQ2xELE9BQU8sRUFBRSxjQUFjLEVBQUUsTUFBTSxrQ0FBa0MsQ0FBQztBQUNsRSxPQUFPLEVBQUUsWUFBWSxFQUFFLE1BQU0sWUFBWSxDQUFDO0FBRTFDLDZCQUE2QjtBQUM3QixPQUFPLEVBQ0gsWUFBWSxFQUNaLFlBQVksRUFDWixZQUFZLEVBQ2YsTUFBTSx1QkFBdUIsQ0FBQztBQUUvQix5Q0FBeUM7QUFDekMsT0FBTyxFQUFFLFdBQVcsRUFBRSxNQUFNLGtCQUFrQixDQUFDO0FBQy9DLE9BQU8sYUFBYSxNQUFNLGdEQUFnRCxDQUFDO0FBRTNFLDRCQUE0QjtBQUM1QixPQUFPLGlCQUFpQixNQUFNLGtDQUFrQyxDQUFDO0FBQ2pFLE9BQU8sV0FBVyxNQUFNLDJDQUEyQyxDQUFDO0FBQ3BFLE9BQU8sYUFBYSxNQUFNLDZDQUE2QyxDQUFDO0FBQ3hFLE9BQU8sV0FBVyxNQUFNLDJDQUEyQyxDQUFDO0FBRXBFLHNFQUFzRTtBQUN0RSxNQUFNLFFBQVEsR0FBRyxHQUFHLENBQUM7QUFFckI7O0dBRUc7QUFDSCxTQUFTLFdBQVcsQ0FBQyxTQUF3QjtJQUN6QyxPQUFPLFNBQVMsQ0FBQyxRQUFRLEdBQUcsU0FBUyxDQUFDLFFBQVEsR0FBRyxTQUFTLENBQUMsUUFBUSxDQUFDO0FBQ3hFLENBQUM7QUFFRDs7R0FFRztBQUNILFNBQVMsUUFBUSxDQUFDLFNBQXdCLEVBQUUsUUFBZ0I7SUFDeEQsT0FBTyxTQUFTLENBQUMsUUFBUSxHQUFHLFFBQVEsQ0FBQztBQUN6QyxDQUFDO0FBRUQ7O0dBRUc7QUFDSCxTQUFTLHFCQUFxQixDQUFDLFVBQTJCO0lBQ3RELE1BQU0sT0FBTyxHQUFHLFVBQVUsQ0FBQyxN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