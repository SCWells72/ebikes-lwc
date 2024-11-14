import { createElement } from 'lwc';
import SimilarProducts from 'c/similarProducts';
import { getRecord } from 'lightning/uiRecordApi';
import getSimilarProducts from '@salesforce/apex/ProductController.getSimilarProducts';
import ProductListItem from "c/productListItem";
import ErrorPanel from "c/errorPanel";
import { ApexTestWireAdapter, LdsTestWireAdapter } from '@salesforce/wire-service-jest-util';

// Mock realistic data for the getRecord adapter
import mockGetRecord from './data/getRecord.json';

// Mock realistic data for the getSimilarProducts adapter
import mockSimilarProducts from './data/similarProducts.json';

// Mock empty data for the getSimilarProducts adapter
import mockSimilarProductsWithoutData from './data/similarProductsWithoutData.json';

// Mock realistic data for the public properties
const mockRecordId = '0031700000pHcf8AAC';
const mockFamilyId = '0069500000pGbk8DDC';
const mockWireErrorMessage = 'Error retrieving records';

//Expected Wire Input
const WIRE_INPUT = {
    fields: [
        {
            fieldApiName: 'Product_Family__c',
            objectApiName: 'Product__c'
        }
    ],
    recordId: '0031700000pHcf8AAC'
};

// Mock getSimilarProducts Apex wire adapter
jest.mock(
    '@salesforce/apex/ProductController.getSimilarProducts',
    () => {
        const {
            createApexTestWireAdapter
            // eslint-disable-next-line @typescript-eslint/no-require-imports
        } = require('@salesforce/sfdx-lwc-jest');
        return {
            default: createApexTestWireAdapter(jest.fn())
        };
    },
    { virtual: true }
);

const getRecordMock = getRecord as unknown as jest.MockInstance<any, any> & LdsTestWireAdapter;
const getSimilarProductsMock = getSimilarProducts as unknown as jest.MockInstance<any, any> & ApexTestWireAdapter;

describe('c-similar-products', () => {
    afterEach(() => {
        // The jsdom instance is shared across test cases in a single file so reset the DOM
        while (document.body.firstChild) {
            document.body.removeChild(document.body.firstChild);
        }
    });

    it('displays a list of product tiles when the Apex wire adapter returns data', async () => {
        // noinspection DuplicatedCode
        const element = createElement<SimilarProducts>('c-similar-products', {
            is: SimilarProducts
        });
        element.recordId = mockRecordId;
        element.familyId = mockFamilyId;
        document.body.appendChild(element);

        // Emit data from getRecord
        getRecordMock.emit(mockGetRecord);

        // Emit Data from the Apex wire
        getSimilarProductsMock.emit(mockSimilarProducts);

        // Return a promise to wait for any asynchronous DOM updates. Jest
        // will automatically wait for the Promise chain to complete before
        // ending the test and fail the test if the promise rejects.
        await Promise.resolve();
        // Check the wire parameters are correct
        expect(getRecordMock.getLastConfig()).toEqual(WIRE_INPUT);
        // Select elements for validation
        const productListItemEl = element.shadowRoot.querySelectorAll<ProductListItem>(
            'c-product-list-item'
        );
        expect(productListItemEl.length).toBe(mockSimilarProducts.length);
        expect(productListItemEl[0].product).toStrictEqual(
            mockSimilarProducts[0]
        );
    });

    it('displays a placeholder when no similar products are returned', async () => {
        // noinspection DuplicatedCode
        const element = createElement<SimilarProducts>('c-similar-products', {
            is: SimilarProducts
        });
        element.recordId = mockRecordId;
        element.familyId = mockFamilyId;
        document.body.appendChild(element);

        // Emit data from getRecord
        getRecordMock.emit(mockGetRecord);

        // Emit an empty array from the Apex wire
        getSimilarProductsMock.emit(mockSimilarProductsWithoutData);

        // Return a promise to wait for any asynchronous DOM updates. Jest
        // will automatically wait for the Promise chain to complete before
        // ending the test and fail the test if the promise rejects.
        await Promise.resolve();
        // Check the wire parameters are correct
        expect(getRecordMock.getLastConfig()).toEqual(WIRE_INPUT);
        // Select elements for validation
        const placeholderEl = element.shadowRoot.querySelector('c-placeholder');
        expect(placeholderEl).not.toBeNull();
    });

    it('displays an error panel when the Apex wire adapter returns an error', async () => {
        const element = createElement<SimilarProducts>('c-similar-products', {
            is: SimilarProducts
        });
        element.recordId = mockRecordId;
        element.familyId = mockFamilyId;
        document.body.appendChild(element);

        // Emit data from getRecord
        getRecordMock.emit(mockGetRecord);

        // Emit an error from the Apex wire
        getSimilarProductsMock.error(mockWireErrorMessage);

        // Return a promise to wait for any asynchronous DOM updates. Jest
        // will automatically wait for the Promise chain to complete before
        // ending the test and fail the test if the promise rejects.

        await Promise.resolve();
        // Check the wire parameters are correct
        expect(getRecordMock.getLastConfig()).toEqual(WIRE_INPUT);
        // Select elements for validation
        const errorPanelEl = element.shadowRoot.querySelector<ErrorPanel>('c-error-panel');
        expect(errorPanelEl).not.toBeNull();
        expect(errorPanelEl.errors[0].body).toBe(mockWireErrorMessage);
        expect(errorPanelEl.friendlyMessage).toBe(
            'An error has occurred while retrieving similar products'
        );
    });

    it('is accessible when similar products returned', async () => {
        // noinspection DuplicatedCode
        const element = createElement<SimilarProducts>('c-similar-products', {
            is: SimilarProducts
        });

        element.recordId = mockRecordId;
        element.familyId = mockFamilyId;
        document.body.appendChild(element);

        // Emit data from getRecord
        getRecordMock.emit(mockGetRecord);

        // Emit Data from the Apex wire
        getSimilarProductsMock.emit(mockSimilarProducts);

        await Promise.resolve();
        return expect(element).toBeAccessible();
    });

    it('is accessible when no similar products returned', async () => {
        // noinspection DuplicatedCode
        const element = createElement<SimilarProducts>('c-similar-products', {
            is: SimilarProducts
        });

        element.recordId = mockRecordId;
        element.familyId = mockFamilyId;
        document.body.appendChild(element);

        // Emit data from getRecord
        getRecordMock.emit(mockGetRecord);

        // Emit an empty array from the Apex wire
        getSimilarProductsMock.emit(mockSimilarProductsWithoutData);

        await Promise.resolve();
        return expect(element).toBeAccessible();
    });

    it('is accessible when error returned', async () => {
        const element = createElement<SimilarProducts>('c-similar-products', {
            is: SimilarProducts
        });

        element.recordId = mockRecordId;
        element.familyId = mockFamilyId;
        document.body.appendChild(element);

        // Emit an error from the Apex wire
        getSimilarProductsMock.error(mockWireErrorMessage);

        await Promise.resolve();
        return expect(element).toBeAccessible();
    });
});
