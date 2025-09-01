/**
 * Consider using the native path component in production
 * This custom component adds support for the streaming API for the sake of a demo, it may not scale.
 */
import { LightningElement, api, wire } from 'lwc';
import { ShowToastEvent } from 'lightning/platformShowToastEvent';
import { getRecord, updateRecord } from 'lightning/uiRecordApi';
import { getPicklistValues, getObjectInfo } from 'lightning/uiObjectInfoApi';
import { reduceErrors } from 'c/ldsUtils';
import { subscribe, unsubscribe, onError, setDebugFlag, isEmpEnabled } from 'lightning/empApi';
import ORDER_STATUS_FIELD_API_NAME from '@salesforce/schema/Order__c.Status__c';
const OBJECT_API_NAME = ORDER_STATUS_FIELD_API_NAME.objectApiName;
const FIELD_API_NAME = ORDER_STATUS_FIELD_API_NAME.fieldApiName;
const MANUFACTURING_EVENT_CHANNEL = '/event/Manufacturing_Event__e';
export default class OrderStatusPath extends LightningElement {
    // Page context
    @api
    recordId;
    recordTypeId;
    picklistValue;
    pathItems = [];
    errorMessage;
    picklistValues;
    // noinspection JSUnusedGlobalSymbols
    defaultRecordTypeId;
    subscription;
    // Extract object information including default record type id
    @wire(getObjectInfo, { objectApiName: OBJECT_API_NAME })
    objectInfo;
    // Extract picklist values
    @wire(getPicklistValues, {
        recordTypeId: '$recordTypeId',
        fieldApiName: `${OBJECT_API_NAME}.${FIELD_API_NAME}`
    })
    getPicklistValueWired(wiredPicklistValues) {
        if (wiredPicklistValues.data) {
            this.picklistValues = wiredPicklistValues.data.values;
            this.refreshPathItems();
        }
        else if (wiredPicklistValues.error) {
            this.reportError('Failed to retrieve picklist values', wiredPicklistValues.error);
        }
        return null;
    }
    // Extract current picklist value for this record
    @wire(getRecord, {
        recordId: '$recordId',
        fields: `${OBJECT_API_NAME}.${FIELD_API_NAME}`
    })
    getRecordWired({ error, data }) {
        if (data) {
            // Check if record data includes record type
            if (data.recordTypeInfo) {
                this.recordTypeId = data.recordTypeInfo.recordTypeId;
            }
            else {
                // Use default record type
                this.recordTypeId = this.objectInfo.data.defaultRecordTypeId;
            }
            // Get current picklist value
            this.picklistValue = data.fields[FIELD_API_NAME].value;
            this.refreshPathItems();
        }
        else if (error) {
            this.reportError('Failed to retrieve record data', error);
        }
    }
    async connectedCallback() {
        // Check if EMP API is available
        const isEmpApiEnabled = await isEmpEnabled();
        if (!isEmpApiEnabled) {
            this.reportError('The EMP API is not enabled.');
            return;
        }
        // Handle EMP API debugging and error reporting
        setDebugFlag(true);
        onError((error) => {
            this.reportError('EMP API error', error);
        });
        // Subscribe to Manufacturing Event platform event
        try {
            this.subscription = await subscribe(MANUFACTURING_EVENT_CHANNEL, -1, (event) => {
                this.handleManufacturingEvent(event);
            });
        }
        catch (error) {
            this.reportError('EMP API error: failed to subscribe', error);
        }
    }
    disconnectedCallback() {
        if (this.subscription) {
            // noinspection JSIgnoredPromiseFromCall
            unsubscribe(this.subscription);
        }
    }
    handleManufacturingEvent(event) {
        // Only handle events for the current record
        if (event.data.payload.Order_Id__c === this.recordId) {
            // noinspection JSIgnoredPromiseFromCall
            this.setPicklistValue(event.data.payload.Status__c);
        }
    }
    handlePathItemClick(event) {
        event.preventDefault();
        event.stopPropagation();
        // Ignore clicks on current value
        const { value } = event.currentTarget.dataset;
        if (value !== this.picklistValue) {
            // noinspection JSIgnoredPromiseFromCall
            this.setPicklistValue(value);
        }
    }
    async setPicklistValue(value) {
        // Prepare updated record fields
        const fields = {
            Id: this.recordId
        };
        fields[FIELD_API_NAME] = value;
        const recordInput = { fields };
        // Update record
        try {
            await updateRecord(recordInput);
            this.dispatchEvent(new ShowToastEvent({
                title: 'Order Updated',
                message: `Order status set to "${value}"`,
                variant: 'success'
            }));
        }
        catch (error) {
            this.reportError(`Failed to update order status to "${value}"`, error);
        }
    }
    refreshPathItems() {
        // Do nothing if we haven't retrieved picklist values
        if (!this.picklistValues) {
            this.pathItems = [];
            return;
        }
        let isCompleted = this.picklistValue !== undefined && this.picklistValue !== null;
        this.pathItems = this.picklistValues.map((plValue) => {
            const { label, value } = plValue;
            const isCurrent = this.picklistValue && value === this.picklistValue;
            if (isCurrent) {
                // noinspection ReuseOfLocalVariableJS
                isCompleted = false;
            }
            const cssClasses = this.getPathItemCssClasses(isCurrent, isCompleted);
            return {
                label,
                value,
                isCurrent,
                isCompleted,
                cssClasses
            };
        });
    }
    // noinspection JSMethodCanBeStatic
    getPathItemCssClasses(isCurrent, isCompleted) {
        let cssClasses = 'slds-path__item';
        if (isCurrent) {
            cssClasses += ' slds-is-current slds-is-active';
        }
        if (!isCurrent && isCompleted) {
            cssClasses += ' slds-is-complete';
        }
        else {
            cssClasses += ' slds-is-incomplete';
        }
        return cssClasses;
    }
    reportError(baseMessage, cause) {
        let message = baseMessage;
        if (cause) {
            message += `: ${reduceErrors(cause).join(', ')}`;
        }
        this.errorMessage = message;
    }
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoib3JkZXJTdGF0dXNQYXRoLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsib3JkZXJTdGF0dXNQYXRoLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBOzs7R0FHRztBQUNILE9BQU8sRUFBRSxnQkFBZ0IsRUFBRSxHQUFHLEVBQUUsSUFBSSxFQUFFLE1BQU0sS0FBSyxDQUFDO0FBQ2xELE9BQU8sRUFBRSxjQUFjLEVBQUUsTUFBTSxrQ0FBa0MsQ0FBQztBQUNsRSxPQUFPLEVBQUUsU0FBUyxFQUE0QixZQUFZLEVBQUUsTUFBTSx1QkFBdUIsQ0FBQztBQUMxRixPQUFPLEVBQUUsaUJBQWlCLEVBQUUsYUFBYSxFQUFpQyxNQUFNLDJCQUEyQixDQUFDO0FBQzVHLE9BQU8sRUFBRSxZQUFZLEVBQUUsTUFBTSxZQUFZLENBQUM7QUFDMUMsT0FBTyxFQUNILFNBQVMsRUFDVCxXQUFXLEVBQ1gsT0FBTyxFQUNQLFlBQVksRUFDWixZQUFZLEVBRWYsTUFBTSxrQkFBa0IsQ0FBQztBQUUxQixPQUFPLDJCQUEyQixNQUFNLHVDQUF1QyxDQUFDO0FBRWhGLE1BQU0sZUFBZSxHQUFHLDJCQUEyQixDQUFDLGFBQWEsQ0FBQztBQUNsRSxNQUFNLGNBQWMsR0FBRywyQkFBMkIsQ0FBQyxZQUFZLENBQUM7QUFFaEUsTUFBTSwyQkFBMkIsR0FBRywrQkFBK0IsQ0FBQztBQVFwRSxNQUFNLENBQUMsT0FBTyxPQUFPLGVBQWdCLFNBQVEsZ0JBQWdCO0lBQ3pELGVBQWU7SUFDZixDQUFDLEdBQUc7SUFBQyxRQUFRLENBQVM7SUFFdEIsWUFBWSxDQUFTO0lBQ3JCLGFBQWEsQ0FBUztJQUN0QixTQUFTLEdBQUcsRUFBRSxDQUFDO0lBQ2YsWUFBWSxDQUFTO0lBQ3JCLGNBQWMsQ0FBa0I7SUFDaEMscUNBQXFDO0lBQ3JDLG1CQUFtQixDQUFTO0lBQzVCLFlBQVksQ0FBb0I7SUFFaEMsOERBQThEO0lBQzlELENBQUMsSUFBSSxDQUFDLGFBQWEsRUFBRSxFQUFFLGFBQWEsRUFBRSxlQUFlLEVBQUUsQ0FBQztJQUN4RCxVQUFVLENBQXVDO0lBRWpELDBCQUEwQjtJQUMxQixDQUFDLElBQUksQ0FBQyxpQkFBaUIsRUFBRTtRQUNyQixZQUFZLEVBQUUsZUFBZTtRQUM3QixZQUFZLEVBQUUsR0FBRyxlQUFlLElBQUksY0FBYyxFQUFFO0tBQ3ZELENBQUM7SUFDRixxQkFBcUIsQ0FBQyxtQkFBK0M7UUFDakUsSUFBSSxtQkFBbUIsQ0FBQyxJQUFJLEVBQUUsQ0FBQztZQUMzQixJQUFJLENBQUMsY0FBYyxHQUFHLG1CQUFtQixDQUFDLElBQUksQ0FBQyxNQUFNLENBQUM7WUFDdEQsSUFBSSxDQUFDLGdCQUFnQixFQUFFLENBQUM7UUFDNUIsQ0FBQzthQUFNLElBQUksbUJBQW1CLENBQUMsS0FBSyxFQUFFLENBQUM7WUFDbkMsSUFBSSxDQUFDLFdBQVcsQ0FBQyxvQ0FBb0MsRUFBRSxtQkFBbUIsQ0FBQyxLQUFLLENBQUMsQ0FBQztRQUN0RixDQUFDO1FBQ0QsT0FBTyxJQUFJLENBQUM7SUFDaEIsQ0FBQztJQUVELGlEQUFpRDtJQUNqRCxDQUFDLElBQUksQ0FBQyxTQUFTLEVBQUU7UUFDYixRQUFRLEVBQUUsV0FBVztRQUNyQixNQUFNLEVBQUUsR0FBRyxlQUFlLElBQUksY0FBYyxFQUFFO0tBQ2pELENBQUM7SUFDRixjQUFjLENBQUMsRUFBRSxLQUFLLEVBQUUsSUFBSSxFQUFFO1FBQzFCLElBQUksSUFBSSxFQUFFLENBQUM7WUFDUCw0Q0FBNEM7WUFDNUMsSUFBSSxJQUFJLENBQUMsY0FBYyxFQUFFLENBQUM7Z0JBQ3RCLElBQUksQ0FBQyxZQUFZLEdBQUcsSUFBSSxDQUFDLGNBQWMsQ0FBQyxZQUFZLENBQUM7WUFDekQsQ0FBQztpQkFBTSxDQUFDO2dCQUNKLDBCQUEwQjtnQkFDMUIsSUFBSSxDQUFDLFlBQVksR0FBRyxJQUFJLENBQUMsVUFBVSxDQUFDLElBQUksQ0FBQyxtQkFBbUIsQ0FBQztZQUNqRSxDQUFDO1lBQ0QsNkJBQTZCO1lBQzdCLElBQUksQ0FBQyxhQUFhLEdBQUcsSUFBSSxDQUFDLE1BQU0sQ0FBQyxjQUFjLENBQUMsQ0FBQyxLQUFLLENBQUM7WUFDdkQsSUFBSSxDQUFDLGdCQUFnQixFQUFFLENBQUM7UUFDNUIsQ0FBQzthQUFNLElBQUksS0FBSyxFQUFFLENBQUM7WUFDZixJQUFJLENBQUMsV0FBVyxDQUFDLGdDQUFnQyxFQUFFLEtBQUssQ0FBQyxDQUFDO1FBQzlELENBQUM7SUFDTCxDQUFDO0lBRUQsS0FBSyxDQUFDLGlCQUFpQjtRQUNuQixnQ0FBZ0M7UUFDaEMsTUFBTSxlQUFlLEdBQUcsTUFBTSxZQUFZLEVBQUUsQ0FBQztRQUM3QyxJQUFJLENBQUMsZUFBZSxFQUFFLENBQUM7WUFDbkIsSUFBSSxDQUFDLFdBQVcsQ0FBQyw2QkFBNkIsQ0FBQyxDQUFDO1lBQ2hELE9BQU87UUFDWCxDQUFDO1FBQ0QsK0NBQStDO1FBQy9DLFlBQVksQ0FBQyxJQUFJLENBQUMsQ0FBQztRQUNuQixPQUFPLENBQUMsQ0FBQyxLQUFVLEVBQUUsRUFBRTtZQUNuQixJQUFJLENBQUMsV0FBVyxDQUFDLGVBQWUsRUFBRSxLQUFLLENBQUMsQ0FBQztRQUM3QyxDQUFDLENBQUMsQ0FBQztRQUVILGtEQUFrRDtRQUNsRCxJQUFJLENBQUM7WUFDRCxJQUFJLENBQUMsWUFBWSxHQUFHLE1BQU0sU0FBUyxDQUMvQiwyQkFBMkIsRUFDM0IsQ0FBQyxDQUFDLEVBQ0YsQ0FBQyxLQUF5QixFQUFFLEVBQUU7Z0JBQzFCLElBQUksQ0FBQyx3QkFBd0IsQ0FBQyxLQUFLLENBQUMsQ0FBQztZQUN6QyxDQUFDLENBQ0osQ0FBQztRQUNOLENBQUM7UUFBQyxPQUFPLEtBQUssRUFBRSxDQUFDO1lBQ2IsSUFBSSxDQUFDLFdBQVcsQ0FBQyxvQ0FBb0MsRUFBRSxLQUFLLENBQUMsQ0FBQztRQUNsRSxDQUFDO0lBQ0wsQ0FBQztJQUVELG9CQUFvQjtRQUNoQixJQUFJLElBQUksQ0FBQyxZQUFZLEVBQUUsQ0FBQztZQUNwQix3Q0FBd0M7WUFDeEMsV0FBVyxDQUFDLElBQUksQ0FBQyxZQUFZLENBQUMsQ0FBQztRQUNuQyxDQUFDO0lBQ0wsQ0FBQztJQUVELHdCQUF3QixDQUFDLEtBQXlCO1FBQzlDLDRDQUE0QztRQUM1QyxJQUFJLEtBQUssQ0FBQyxJQUFJLENBQUMsT0FBTyxDQUFDLFdBQVcsS0FBSyxJQUFJLENBQUMsUUFBUSxFQUFFLENBQUM7WUFDbkQsd0NBQXdDO1lBQ3hDLElBQUksQ0FBQyxnQkFBZ0IsQ0FBQyxLQUFLLENBQUMsSUFBSSxDQUFDLE9BQU8sQ0FBQyxTQUFTLENBQUMsQ0FBQztRQUN4RCxDQUFDO0lBQ0wsQ0FBQztJQUVELG1CQUFtQixDQUFDLEtBQWlCO1FBQ2pDLEtBQUssQ0FBQyxjQUFjLEVBQUUsQ0FBQztRQUN2QixLQUFLLENBQUMsZUFBZSxFQUFFLENBQUM7UUFFeEIsaUNBQWlDO1FBQ2pDLE1BQU0sRUFBRSxLQUFLLEVBQUUsR0FBaUIsS0FBSyxDQUFDLGFBQWMsQ0FBQyxPQUFPLENBQUM7UUFDN0QsSUFBSSxLQUFLLEtBQUssSUFBSSxDQUFDLGFBQWEsRUFBRSxDQUFDO1lBQy9CLHdDQUF3QztZQUN4QyxJQUFJLENBQUMsZ0JBQWdCLENBQUMsS0FBSyxDQUFDLENBQUM7UUFDakMsQ0FBQztJQUNMLENBQUM7SUFFRCxLQUFLLENBQUMsZ0JBQWdCLENBQUMsS0FBYTtRQUNoQyxnQ0FBZ0M7UUFDaEMsTUFBTSxNQUFNLEdBQUc7WUFDWCxFQUFFLEVBQUUsSUFBSSxDQUFDLFFBQVE7U0FDcEIsQ0FBQztRQUNGLE1BQU0sQ0FBQyxjQUFjLENBQUMsR0FBRyxLQUFLLENBQUM7UUFDL0IsTUFBTSxXQUFXLEdBQUcsRUFBRSxNQUFNLEVBQUUsQ0FBQztRQUMvQixnQkFBZ0I7UUFDaEIsSUFBSSxDQUFDO1lBQ0QsTUFBTSxZQUFZLENBQUMsV0FBVyxDQUFDLENBQUM7WUFDaEMsSUFBSSxDQUFDLGFBQWEsQ0FDZCxJQUFJLGNBQWMsQ0FBQztnQkFDZixLQUFLLEVBQUUsZUFBZTtnQkFDdEIsT0FBTyxFQUFFLHdCQUF3QixLQUFLLEdBQUc7Z0JBQ3pDLE9BQU8sRUFBRSxTQUFTO2FBQ3JCLENBQUMsQ0FDTCxDQUFDO1FBQ04sQ0FBQztRQUFDLE9BQU8sS0FBSyxFQUFFLENBQUM7WUFDYixJQUFJLENBQUMsV0FBVyxDQUNaLHFDQUFxQyxLQUFLLEdBQUcsRUFDN0MsS0FBSyxDQUNSLENBQUM7UUFDTixDQUFDO0lBQ0wsQ0FBQztJQUVELGdCQUFnQjtRQUNaLHFEQUFxRDtRQUNyRCxJQUFJLENBQUMsSUFBSSxDQUFDLGNBQWMsRUFBRSxDQUFDO1lBQ3ZCLElBQUksQ0FBQyxTQUFTLEdBQUcsRUFBRSxDQUFDO1lBQ3BCLE9BQU87UUFDWCxDQUFDO1FBRUQsSUFBSSxXQUFXLEdBQ1gsSUFBSSxDQUFDLGFBQWEsS0FBSyxTQUFTLElBQUksSUFBSSxDQUFDLGFBQWEsS0FBSyxJQUFJLENBQUM7UUFDcEUsSUFBSSxDQUFDLFNBQVMsR0FBRyxJQUFJLENBQUMsY0FBYyxDQUFDLEdBQUcsQ0FBQyxDQUFDLE9BQU8sRUFBRSxFQUFFO1lBQ2pELE1BQU0sRUFBRSxLQUFLLEVBQUUsS0FBSyxFQUFFLEdBQUcsT0FBTyxDQUFDO1lBQ2pDLE1BQU0sU0FBUyxHQUNYLElBQUksQ0FBQyxhQUFhLElBQUksS0FBSyxLQUFLLElBQUksQ0FBQyxhQUFhLENBQUM7WUFDdkQsSUFBSSxTQUFTLEVBQUUsQ0FBQztnQkFDWixzQ0FBc0M7Z0JBQ3RDLFdBQVcsR0FBRyxLQUFLLENBQUM7WUFDeEIsQ0FBQztZQUNELE1BQU0sVUFBVSxHQUFHLElBQUksQ0FBQyxxQkFBcUIsQ0FDekMsU0FBUyxFQUNULFdBQVcsQ0FDZCxDQUFDO1lBQ0YsT0FBTztnQkFDSCxLQUFLO2dCQUNMLEtBQUs7Z0JBQ0wsU0FBUztnQkFDVCxXQUFXO2dCQUNYLFVBQVU7YUFDYixDQUFDO1FBQ04sQ0FBQyxDQUFDLENBQUM7SUFDUCxDQUFDO0lBRUQsbUNBQW1DO0lBQ25DLHFCQUFxQixDQUFDLFNBQWtCLEVBQUUsV0FBb0I7UUFDMUQsSUFBSSxVQUFVLEdBQUcsaUJBQWlCLENBQUM7UUFDbkMsSUFBSSxTQUFTLEVBQUUsQ0FBQztZQUNaLFVBQVUsSUFBSSxpQ0FBaUMsQ0FBQztRQUNwRCxDQUFDO1FBQ0QsSUFBSSxDQUFDLFNBQVMsSUFBSSxXQUFXLEVBQUUsQ0FBQztZQUM1QixVQUFVLElBQUksbUJBQW1CLENBQUM7UUFDdEMsQ0FBQzthQUFNLENBQUM7WUFDSixVQUFVLElBQUkscUJBQXFCLENBQUM7UUFDeEMsQ0FBQztRQUNELE9BQU8sVUFBVSxDQUFDO0lBQ3RCLENBQUM7SUFFRCxXQUFXLENBQUMsV0FBbUIsRUFBRSxLQUFXO1FBQ3hDLElBQUksT0FBTyxHQUFHLFdBQVcsQ0FBQztRQUMxQixJQUFJLEtBQUssRUFBRSxDQUFDO1lBQ1IsT0FBTyxJQUFJLEtBQUssWUFBWSxDQUFDLEtBQUssQ0FBQyxDQUFDLElBQUksQ0FBQyxJQUFJLENBQUMsRUFBRSxDQUFDO1FBQ3JELENBQUM7UUFDRCxJQUFJLENBQUMsWUFBWSxHQUFHLE9BQU8sQ0FBQztJQUNoQyxDQUFDO0NBQ0oifQ==