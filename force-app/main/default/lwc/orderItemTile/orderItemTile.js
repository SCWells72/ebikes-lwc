import { LightningElement, api } from 'lwc';
/**
 * Displays an Order_Item__c SObject. Note that this component does not use schema imports and uses dynamic
 * references to the schema instead. For example, orderItem.Price__c (see template). The dynamic approach is
 * less verbose but does not provide referential integrity. The schema imports approach is more verbose but
 * enforces referential integrity: 1) The existence of the fields you reference is checked at compile time.
 * 2) Fields that are statically imported in a component cannot be deleted in the object model.
 */
export default class OrderItemTile extends LightningElement {
    /** Order_Item__c SObject to display. */
    @api
    orderItem;
    /** Whether the component has unsaved changes. */
    isModified = false;
    /** Mutated/unsaved Order_Item__c values. */
    form = {};
    /** Handles form input. */
    handleFormChange(evt) {
        this.isModified = true;
        const field = evt.detail.dataset.fieldName;
        let value = parseInt(evt.detail.value.trim(), 10);
        if (!Number.isInteger(value)) {
            value = 0;
        }
        this.form[field] = value;
    }
    /** Fires event to update the Order_Item__c SObject.  */
    saveOrderItem() {
        const event = new CustomEvent('orderitemchange', {
            detail: Object.assign({}, { Id: this.orderItem.Id }, this.form)
        });
        this.dispatchEvent(event);
        this.isModified = false;
    }
    /** Fires event to delete the Order_Item__c SObject.  */
    deleteOrderItem() {
        const event = new CustomEvent('orderitemdelete', {
            detail: { id: this.orderItem.Id }
        });
        this.dispatchEvent(event);
    }
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoib3JkZXJJdGVtVGlsZS5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIm9yZGVySXRlbVRpbGUudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUEsT0FBTyxFQUFFLGdCQUFnQixFQUFFLEdBQUcsRUFBRSxNQUFNLEtBQUssQ0FBQztBQUc1Qzs7Ozs7O0dBTUc7QUFDSCxNQUFNLENBQUMsT0FBTyxPQUFPLGFBQWMsU0FBUSxnQkFBZ0I7SUFDdkQsd0NBQXdDO0lBQ3hDLENBQUMsR0FBRztJQUFDLFNBQVMsQ0FBZ0I7SUFFOUIsaURBQWlEO0lBQ2pELFVBQVUsR0FBRyxLQUFLLENBQUM7SUFFbkIsNENBQTRDO0lBQzVDLElBQUksR0FBRyxFQUFFLENBQUM7SUFFViwwQkFBMEI7SUFDMUIsZ0JBQWdCLENBQUMsR0FBZ0M7UUFDN0MsSUFBSSxDQUFDLFVBQVUsR0FBRyxJQUFJLENBQUM7UUFDdkIsTUFBTSxLQUFLLEdBQUcsR0FBRyxDQUFDLE1BQU0sQ0FBQyxPQUFPLENBQUMsU0FBUyxDQUFDO1FBQzNDLElBQUksS0FBSyxHQUFHLFFBQVEsQ0FBQyxHQUFHLENBQUMsTUFBTSxDQUFDLEtBQUssQ0FBQyxJQUFJLEVBQUUsRUFBRSxFQUFFLENBQUMsQ0FBQztRQUNsRCxJQUFJLENBQUMsTUFBTSxDQUFDLFNBQVMsQ0FBQyxLQUFLLENBQUMsRUFBRSxDQUFDO1lBQzNCLEtBQUssR0FBRyxDQUFDLENBQUM7UUFDZCxDQUFDO1FBQ0QsSUFBSSxDQUFDLElBQUksQ0FBQyxLQUFLLENBQUMsR0FBRyxLQUFLLENBQUM7SUFDN0IsQ0FBQztJQUVELHdEQUF3RDtJQUV4RCxhQUFhO1FBQ1QsTUFBTSxLQUFLLEdBQUcsSUFBSSxXQUFXLENBQUMsaUJBQWlCLEVBQUU7WUFDN0MsTUFBTSxFQUFFLE1BQU0sQ0FBQyxNQUFNLENBQUMsRUFBRSxFQUFFLEVBQUUsRUFBRSxFQUFFLElBQUksQ0FBQyxTQUFTLENBQUMsRUFBRSxFQUFFLEVBQUUsSUFBSSxDQUFDLElBQUksQ0FBQztTQUNsRSxDQUFDLENBQUM7UUFDSCxJQUFJLENBQUMsYUFBYSxDQUFDLEtBQUssQ0FBQyxDQUFDO1FBQzFCLElBQUksQ0FBQyxVQUFVLEdBQUcsS0FBSyxDQUFDO0lBQzVCLENBQUM7SUFFRCx3REFBd0Q7SUFDeEQsZUFBZTtRQUNYLE1BQU0sS0FBSyxHQUFHLElBQUksV0FBVyxDQUFDLGlCQUFpQixFQUFFO1lBQzdDLE1BQU0sRUFBRSxFQUFFLEVBQUUsRUFBRSxJQUFJLENBQUMsU0FBUyxDQUFDLEVBQUUsRUFBRTtTQUNwQyxDQUFDLENBQUM7UUFDSCxJQUFJLENBQUMsYUFBYSxDQUFDLEtBQUssQ0FBQyxDQUFDO0lBQzlCLENBQUM7Q0FDSiJ9