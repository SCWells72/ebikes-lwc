import { LightningElement, wire } from 'lwc';
// Lightning Message Service and a message channel
import { NavigationMixin } from 'lightning/navigation';
import { subscribe, MessageContext } from 'lightning/messageService';
import PRODUCT_SELECTED_MESSAGE from '@salesforce/messageChannel/ProductSelected__c';
// Utils to extract field values
import { getFieldValue } from 'lightning/uiRecordApi';
// Product__c Schema
import PRODUCT_OBJECT from '@salesforce/schema/Product__c';
import NAME_FIELD from '@salesforce/schema/Product__c.Name';
import PICTURE_URL_FIELD from '@salesforce/schema/Product__c.Picture_URL__c';
import CATEGORY_FIELD from '@salesforce/schema/Product__c.Category__c';
import LEVEL_FIELD from '@salesforce/schema/Product__c.Level__c';
import MSRP_FIELD from '@salesforce/schema/Product__c.MSRP__c';
import BATTERY_FIELD from '@salesforce/schema/Product__c.Battery__c';
import CHARGER_FIELD from '@salesforce/schema/Product__c.Charger__c';
import MOTOR_FIELD from '@salesforce/schema/Product__c.Motor__c';
import MATERIAL_FIELD from '@salesforce/schema/Product__c.Material__c';
import FORK_FIELD from '@salesforce/schema/Product__c.Fork__c';
import FRONT_BRAKES_FIELD from '@salesforce/schema/Product__c.Front_Brakes__c';
import REAR_BRAKES_FIELD from '@salesforce/schema/Product__c.Rear_Brakes__c';
/**
 * Component to display details of a Product__c.
 */
export default class ProductCard extends NavigationMixin(LightningElement) {
    // Exposing fields to make them available in the template
    categoryField = CATEGORY_FIELD;
    levelField = LEVEL_FIELD;
    msrpField = MSRP_FIELD;
    batteryField = BATTERY_FIELD;
    chargerField = CHARGER_FIELD;
    motorField = MOTOR_FIELD;
    materialField = MATERIAL_FIELD;
    forkField = FORK_FIELD;
    frontBrakesField = FRONT_BRAKES_FIELD;
    rearBrakesField = REAR_BRAKES_FIELD;
    // Id of Product__c to display
    recordId;
    // Product fields displayed with specific format
    productName;
    productPictureUrl;
    /** Load context for Lightning Messaging Service */
    @wire(MessageContext)
    messageContext;
    /** Subscription for ProductSelected Lightning message */
    productSelectionSubscription;
    connectedCallback() {
        // Subscribe to ProductSelected message
        this.productSelectionSubscription = subscribe(this.messageContext, PRODUCT_SELECTED_MESSAGE, (message) => this.handleProductSelected(message.productId));
    }
    handleRecordLoaded(event) {
        const { records } = event.detail;
        const recordData = records[this.recordId];
        this.productName = getFieldValue(recordData, NAME_FIELD);
        this.productPictureUrl = getFieldValue(recordData, PICTURE_URL_FIELD);
    }
    /**
     * Handler for when a product is selected. When `this.recordId` changes, the
     * lightning-record-view-form component will detect the change and provision new data.
     */
    handleProductSelected(productId) {
        this.recordId = productId;
    }
    handleNavigateToRecord() {
        this[NavigationMixin.Navigate]({
            type: 'standard__recordPage',
            attributes: {
                recordId: this.recordId,
                objectApiName: PRODUCT_OBJECT.objectApiName,
                actionName: 'view'
            }
        });
    }
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoicHJvZHVjdENhcmQuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyJwcm9kdWN0Q2FyZC50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQSxPQUFPLEVBQUUsZ0JBQWdCLEVBQUUsSUFBSSxFQUFFLE1BQU0sS0FBSyxDQUFDO0FBRTdDLGtEQUFrRDtBQUNsRCxPQUFPLEVBQUUsZUFBZSxFQUFFLE1BQU0sc0JBQXNCLENBQUM7QUFDdkQsT0FBTyxFQUFFLFNBQVMsRUFBRSxjQUFjLEVBQWtELE1BQU0sMEJBQTBCLENBQUM7QUFDckgsT0FBTyx3QkFBd0IsTUFBTSwrQ0FBK0MsQ0FBQztBQUVyRixnQ0FBZ0M7QUFDaEMsT0FBTyxFQUFFLGFBQWEsRUFBRSxNQUFNLHVCQUF1QixDQUFDO0FBRXRELG9CQUFvQjtBQUNwQixPQUFPLGNBQWMsTUFBTSwrQkFBK0IsQ0FBQztBQUMzRCxPQUFPLFVBQVUsTUFBTSxvQ0FBb0MsQ0FBQztBQUM1RCxPQUFPLGlCQUFpQixNQUFNLDhDQUE4QyxDQUFDO0FBQzdFLE9BQU8sY0FBYyxNQUFNLDJDQUEyQyxDQUFDO0FBQ3ZFLE9BQU8sV0FBVyxNQUFNLHdDQUF3QyxDQUFDO0FBQ2pFLE9BQU8sVUFBVSxNQUFNLHVDQUF1QyxDQUFDO0FBQy9ELE9BQU8sYUFBYSxNQUFNLDBDQUEwQyxDQUFDO0FBQ3JFLE9BQU8sYUFBYSxNQUFNLDBDQUEwQyxDQUFDO0FBQ3JFLE9BQU8sV0FBVyxNQUFNLHdDQUF3QyxDQUFDO0FBQ2pFLE9BQU8sY0FBYyxNQUFNLDJDQUEyQyxDQUFDO0FBQ3ZFLE9BQU8sVUFBVSxNQUFNLHVDQUF1QyxDQUFDO0FBQy9ELE9BQU8sa0JBQWtCLE1BQU0sK0NBQStDLENBQUM7QUFDL0UsT0FBTyxpQkFBaUIsTUFBTSw4Q0FBOEMsQ0FBQztBQUc3RTs7R0FFRztBQUNILE1BQU0sQ0FBQyxPQUFPLE9BQU8sV0FBWSxTQUFRLGVBQWUsQ0FBQyxnQkFBZ0IsQ0FBQztJQUN0RSx5REFBeUQ7SUFDekQsYUFBYSxHQUFHLGNBQWMsQ0FBQztJQUMvQixVQUFVLEdBQUcsV0FBVyxDQUFDO0lBQ3pCLFNBQVMsR0FBRyxVQUFVLENBQUM7SUFDdkIsWUFBWSxHQUFHLGFBQWEsQ0FBQztJQUM3QixZQUFZLEdBQUcsYUFBYSxDQUFDO0lBQzdCLFVBQVUsR0FBRyxXQUFXLENBQUM7SUFDekIsYUFBYSxHQUFHLGNBQWMsQ0FBQztJQUMvQixTQUFTLEdBQUcsVUFBVSxDQUFDO0lBQ3ZCLGdCQUFnQixHQUFHLGtCQUFrQixDQUFDO0lBQ3RDLGVBQWUsR0FBRyxpQkFBaUIsQ0FBQztJQUVwQyw4QkFBOEI7SUFDOUIsUUFBUSxDQUFTO0lBRWpCLGdEQUFnRDtJQUNoRCxXQUFXLENBQVM7SUFDcEIsaUJBQWlCLENBQVM7SUFFMUIsbURBQW1EO0lBQ25ELENBQUMsSUFBSSxDQUFDLGNBQWMsQ0FBQztJQUFDLGNBQWMsQ0FBcUI7SUFFekQseURBQXlEO0lBQ3pELDRCQUE0QixDQUE2QjtJQUV6RCxpQkFBaUI7UUFDYix1Q0FBdUM7UUFDdkMsSUFBSSxDQUFDLDRCQUE0QixHQUFHLFNBQVMsQ0FDekMsSUFBSSxDQUFDLGNBQWMsRUFDbkIsd0JBQXdCLEVBQ3hCLENBQUMsT0FBMkIsRUFBRSxFQUFFLENBQUMsSUFBSSxDQUFDLHFCQUFxQixDQUFDLE9BQU8sQ0FBQyxTQUFTLENBQUMsQ0FDakYsQ0FBQztJQUNOLENBQUM7SUFFRCxrQkFBa0IsQ0FBQyxLQUEyQztRQUMxRCxNQUFNLEVBQUUsT0FBTyxFQUFFLEdBQUcsS0FBSyxDQUFDLE1BQU0sQ0FBQztRQUNqQyxNQUFNLFVBQVUsR0FBRyxPQUFPLENBQUMsSUFBSSxDQUFDLFFBQVEsQ0FBQyxDQUFDO1FBQzFDLElBQUksQ0FBQyxXQUFXLEdBQUcsYUFBYSxDQUFDLFVBQVUsRUFBRSxVQUFVLENBQUMsQ0FBQztRQUN6RCxJQUFJLENBQUMsaUJBQWlCLEdBQUcsYUFBYSxDQUFDLFVBQVUsRUFBRSxpQkFBaUIsQ0FBQyxDQUFDO0lBQzFFLENBQUM7SUFFRDs7O09BR0c7SUFDSCxxQkFBcUIsQ0FBQyxTQUFpQjtRQUNuQyxJQUFJLENBQUMsUUFBUSxHQUFHLFNBQVMsQ0FBQztJQUM5QixDQUFDO0lBRUQsc0JBQXNCO1FBQ2xCLElBQUksQ0FBQyxlQUFlLENBQUMsUUFBUSxDQUFDLENBQUM7WUFDM0IsSUFBSSxFQUFFLHNCQUFzQjtZQUM1QixVQUFVLEVBQUU7Z0JBQ1IsUUFBUSxFQUFFLElBQUksQ0FBQyxRQUFRO2dCQUN2QixhQUFhLEVBQUUsY0FBYyxDQUFDLGFBQWE7Z0JBQzNDLFVBQVUsRUFBRSxNQUFNO2FBQ3JCO1NBQ0osQ0FBQyxDQUFDO0lBQ1AsQ0FBQztDQUNKIn0=