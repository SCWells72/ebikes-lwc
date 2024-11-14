/**
 * Accessibility tests reside in a different test file in this case
 * because there's an open issue on jest (https://github.com/facebook/jest/issues/8726)
 * because of which fake timers leak into all the tests in the same file,
 * while Axe doesn't work when using fake timers.
 **/
import { createElement } from 'lwc';
import ProductFilter from 'c/productFilter';
import { getPicklistValues } from 'lightning/uiObjectInfoApi';
import { TestWireAdapter } from '@salesforce/wire-service-jest-util';

/*
 * Import a snapshot of getPicklistValues' response for functional verification. This eliminates
 * the need to connect to an org to retrieve data, which allows for running all unit tests
 * on localhost (aka offline).
 *
 * This data can be captured using a REST client accessing the UI API resource which the
 * @wire(getPicklistValues) represents:
 * /ui-api/object-info/{objectApiName}/picklist-values/{recordTypeId}/{fieldApiName}
 * Documentation for this UI API resource is at
 * https://developer.salesforce.com/docs/atlas.en-us.uiapi.meta/uiapi/ui_api_resources_picklist_values.htm
 *
 * Community-provided instructions for access Salesforce REST resources is at
 * https://blog.mkorman.uk/using-postman-to-explore-salesforce-restful-web-services/
 */

import mockGetPicklistValues from './data/getPicklistValues.json';

const getPicklistValuesMock = getPicklistValues as unknown as jest.MockInstance<any, any> & TestWireAdapter;

describe('c-product-filter-accessibility', () => {
    afterEach(() => {
        // The jsdom instance is shared across test cases in a single file so reset the DOM
        while (document.body.firstChild) {
            document.body.removeChild(document.body.firstChild);
        }
        // Prevent data saved on mocks from leaking between tests
        jest.clearAllMocks();
    });
    it('is accessible when picklist values returned', async () => {
        const element = createElement('c-product-filter', {
            is: ProductFilter
        });
        document.body.appendChild(element);

        getPicklistValuesMock.emit(mockGetPicklistValues);

        await Promise.resolve();
        return expect(element).toBeAccessible();
    });

    it('is accessible when error returned', async () => {
        const element = createElement('c-product-filter', {
            is: ProductFilter
        });
        document.body.appendChild(element);

        getPicklistValuesMock.error();

        await Promise.resolve();
        return expect(element).toBeAccessible();
    });
});
