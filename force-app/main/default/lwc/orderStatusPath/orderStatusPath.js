/**
 * Consider using the native path component in production
 * This custom component adds support for the streaming API for the sake of a demo, it may not scale.
 */
/* eslint-disable no-console */
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoib3JkZXJTdGF0dXNQYXRoLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsib3JkZXJTdGF0dXNQYXRoLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBOzs7R0FHRztBQUNILCtCQUErQjtBQUMvQixPQUFPLEVBQUUsZ0JBQWdCLEVBQUUsR0FBRyxFQUFFLElBQUksRUFBRSxNQUFNLEtBQUssQ0FBQztBQUNsRCxPQUFPLEVBQUUsY0FBYyxFQUFFLE1BQU0sa0NBQWtDLENBQUM7QUFDbEUsT0FBTyxFQUFFLFNBQVMsRUFBNEIsWUFBWSxFQUFFLE1BQU0sdUJBQXVCLENBQUM7QUFDMUYsT0FBTyxFQUFFLGlCQUFpQixFQUFFLGFBQWEsRUFBaUMsTUFBTSwyQkFBMkIsQ0FBQztBQUM1RyxPQUFPLEVBQUUsWUFBWSxFQUFFLE1BQU0sWUFBWSxDQUFDO0FBQzFDLE9BQU8sRUFDSCxTQUFTLEVBQ1QsV0FBVyxFQUNYLE9BQU8sRUFDUCxZQUFZLEVBQ1osWUFBWSxFQUVmLE1BQU0sa0JBQWtCLENBQUM7QUFFMUIsT0FBTywyQkFBMkIsTUFBTSx1Q0FBdUMsQ0FBQztBQUVoRixNQUFNLGVBQWUsR0FBRywyQkFBMkIsQ0FBQyxhQUFhLENBQUM7QUFDbEUsTUFBTSxjQUFjLEdBQUcsMkJBQTJCLENBQUMsWUFBWSxDQUFDO0FBRWhFLE1BQU0sMkJBQTJCLEdBQUcsK0JBQStCLENBQUM7QUFRcEUsTUFBTSxDQUFDLE9BQU8sT0FBTyxlQUFnQixTQUFRLGdCQUFnQjtJQUN6RCxlQUFlO0lBQ2YsQ0FBQyxHQUFHO0lBQUMsUUFBUSxDQUFTO0lBRXRCLFlBQVksQ0FBUztJQUNyQixhQUFhLENBQVM7SUFDdEIsU0FBUyxHQUFHLEVBQUUsQ0FBQztJQUNmLFlBQVksQ0FBUztJQUNyQixjQUFjLENBQWtCO0lBQ2hDLHFDQUFxQztJQUNyQyxtQkFBbUIsQ0FBUztJQUM1QixZQUFZLENBQW9CO0lBRWhDLDhEQUE4RDtJQUM5RCxDQUFDLElBQUksQ0FBQyxhQUFhLEVBQUUs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