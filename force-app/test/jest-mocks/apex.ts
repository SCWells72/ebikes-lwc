// noinspection JSUnusedGlobalSymbols

import { FieldId } from "@salesforce/schema";

// Mocking how getSObjectValue retrieves the field value.
export const getSObjectValue = (object: SObject, field: FieldId) => {
    return object[field.fieldApiName];
};
