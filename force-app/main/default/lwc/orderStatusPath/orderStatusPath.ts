/**
 * Consider using the native path component in production
 * This custom component adds support for the streaming API for the sake of a demo, it may not scale.
 */
/* eslint-disable no-console */
import { LightningElement, api, wire } from 'lwc';
import { ShowToastEvent } from 'lightning/platformShowToastEvent';
import { getRecord, ObjectInfoRepresentation, updateRecord } from 'lightning/uiRecordApi';
import { getPicklistValues, getObjectInfo, PicklistValue, PicklistValues } from 'lightning/uiObjectInfoApi';
import { reduceErrors } from 'c/ldsUtils';
import {
    subscribe,
    unsubscribe,
    onError,
    setDebugFlag,
    isEmpEnabled,
    SubscribeResponse
} from 'lightning/empApi';

import ORDER_STATUS_FIELD_API_NAME from '@salesforce/schema/Order__c.Status__c';

const OBJECT_API_NAME = ORDER_STATUS_FIELD_API_NAME.objectApiName;
const FIELD_API_NAME = ORDER_STATUS_FIELD_API_NAME.fieldApiName;

const MANUFACTURING_EVENT_CHANNEL = '/event/Manufacturing_Event__e';

export interface ManufacturingEvent {
    data: {
        payload: Manufacturing_Event__e;
    };
}

export default class OrderStatusPath extends LightningElement {
    // Page context
    @api recordId: string;

    recordTypeId: string;
    picklistValue: string;
    pathItems = [];
    errorMessage: string;
    picklistValues: PicklistValue[];
    // noinspection JSUnusedGlobalSymbols
    defaultRecordTypeId: string;
    subscription: SubscribeResponse;

    // Extract object information including default record type id
    @wire(getObjectInfo, { objectApiName: OBJECT_API_NAME })
    objectInfo: WireResult<ObjectInfoRepresentation>;

    // Extract picklist values
    @wire(getPicklistValues, {
        recordTypeId: '$recordTypeId',
        fieldApiName: `${OBJECT_API_NAME}.${FIELD_API_NAME}`
    })
    getPicklistValueWired(wiredPicklistValues: WireResult<PicklistValues>) {
        if (wiredPicklistValues.data) {
            this.picklistValues = wiredPicklistValues.data.values;
            this.refreshPathItems();
        } else if (wiredPicklistValues.error) {
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
            } else {
                // Use default record type
                this.recordTypeId = this.objectInfo.data.defaultRecordTypeId;
            }
            // Get current picklist value
            this.picklistValue = data.fields[FIELD_API_NAME].value;
            this.refreshPathItems();
        } else if (error) {
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
        onError((error: any) => {
            this.reportError('EMP API error', error);
        });

        // Subscribe to Manufacturing Event platform event
        try {
            this.subscription = await subscribe(
                MANUFACTURING_EVENT_CHANNEL,
                -1,
                (event: ManufacturingEvent) => {
                    this.handleManufacturingEvent(event);
                }
            );
        } catch (error) {
            this.reportError('EMP API error: failed to subscribe', error);
        }
    }

    disconnectedCallback() {
        if (this.subscription) {
            // noinspection JSIgnoredPromiseFromCall
            unsubscribe(this.subscription);
        }
    }

    handleManufacturingEvent(event: ManufacturingEvent) {
        // Only handle events for the current record
        if (event.data.payload.Order_Id__c === this.recordId) {
            // noinspection JSIgnoredPromiseFromCall
            this.setPicklistValue(event.data.payload.Status__c);
        }
    }

    handlePathItemClick(event: MouseEvent) {
        event.preventDefault();
        event.stopPropagation();

        // Ignore clicks on current value
        const { value } = (<HTMLElement>event.currentTarget).dataset;
        if (value !== this.picklistValue) {
            // noinspection JSIgnoredPromiseFromCall
            this.setPicklistValue(value);
        }
    }

    async setPicklistValue(value: string) {
        // Prepare updated record fields
        const fields = {
            Id: this.recordId
        };
        fields[FIELD_API_NAME] = value;
        const recordInput = { fields };
        // Update record
        try {
            await updateRecord(recordInput);
            this.dispatchEvent(
                new ShowToastEvent({
                    title: 'Order Updated',
                    message: `Order status set to "${value}"`,
                    variant: 'success'
                })
            );
        } catch (error) {
            this.reportError(
                `Failed to update order status to "${value}"`,
                error
            );
        }
    }

    refreshPathItems() {
        // Do nothing if we haven't retrieved picklist values
        if (!this.picklistValues) {
            this.pathItems = [];
            return;
        }

        let isCompleted =
            this.picklistValue !== undefined && this.picklistValue !== null;
        this.pathItems = this.picklistValues.map((plValue) => {
            const { label, value } = plValue;
            const isCurrent =
                this.picklistValue && value === this.picklistValue;
            if (isCurrent) {
                // noinspection ReuseOfLocalVariableJS
                isCompleted = false;
            }
            const cssClasses = this.getPathItemCssClasses(
                isCurrent,
                isCompleted
            );
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
    getPathItemCssClasses(isCurrent: boolean, isCompleted: boolean) {
        let cssClasses = 'slds-path__item';
        if (isCurrent) {
            cssClasses += ' slds-is-current slds-is-active';
        }
        if (!isCurrent && isCompleted) {
            cssClasses += ' slds-is-complete';
        } else {
            cssClasses += ' slds-is-incomplete';
        }
        return cssClasses;
    }

    reportError(baseMessage: string, cause?: any) {
        let message = baseMessage;
        if (cause) {
            message += `: ${reduceErrors(cause).join(', ')}`;
        }
        this.errorMessage = message;
    }
}
