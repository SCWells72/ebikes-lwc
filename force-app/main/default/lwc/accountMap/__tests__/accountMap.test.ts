import { createElement } from 'lwc';
import PropertyMap from 'c/accountMap';
import { getRecord } from 'lightning/uiRecordApi';
import LightningMap from 'lightning/map';
import ErrorPanel from 'c/errorPanel';

// Realistic data with an accounts address details
// @ts-expect-error Import of JSON data file
import mockGetRecordWithAddress from "./data/getRecordWithAddress.json";
// @ts-expect-error Import of JSON data file
import mockGetRecordWithoutAddress from "./data/getRecordWithoutAddress.json";

const mockRecordId = '0031700000pJRRSAA4';
const mockWireErrorMessage = 'Error retrieving record';

const getRecordMock = getRecord as unknown as ic.jest.MockTestWireAdapter;

describe('c-account-map', () => {
    afterEach(() => {
        // The jsdom instance is shared across test cases in a single file so reset the DOM
        while (document.body.firstChild) {
            document.body.removeChild(document.body.firstChild);
        }
    });

    it('displays a lightning-map when wire adaptor returns an account record with billing street data', async function () {
        // Create element
        const element = createElement<PropertyMap>('c-account-map', {
            is: PropertyMap
        });
        // Set public properties
        element.recordId = mockRecordId;
        document.body.appendChild(element);

        // Emit data from the get record adapter that includes billing street data
        getRecordMock.emit(mockGetRecordWithAddress);

        // Return a promise to wait for any asynchronous DOM updates. Jest
        // will automatically wait for the Promise chain to complete before
        // ending the test and fail the test if the promise rejects.
        await Promise.resolve();
        // Select elements for validation
        const mapEl = element.shadowRoot.querySelector<LightningMap>('lightning-map');
        expect(mapEl).not.toBeNull();
        // noinspection MagicNumberJS
        expect(mapEl.zoomLevel).toBe(14);
        // Get the map markers from mapEl to check that the location data has been populated
        const location = mapEl.mapMarkers[0].location;
        expect(location).toEqual(
            expect.objectContaining({
                City: 'San Francisco',
                Country: 'USA',
                PostalCode: '94105',
                State: 'California',
                Street: '415 Mission St.'
            })
        );
    });

    it('displays an error panel when the wire adaptor returns an empty array', async () => {
        // Create element
        const element = createElement<PropertyMap>('c-account-map', {
            is: PropertyMap
        });
        // Set public properties
        element.recordId = mockRecordId;
        document.body.appendChild(element);

        // Emit data from the get record adapter that does not include billing street data
        getRecordMock.emit(mockGetRecordWithoutAddress);

        // Return a promise to wait for any asynchronous DOM updates. Jest
        // will automatically wait for the Promise chain to complete before
        // ending the test and fail the test if the promise rejects.
        await Promise.resolve();
        // Select elements for validation
        const mapEl = element.shadowRoot.querySelector('lightning-map');
        expect(mapEl).toBeNull();
        const errorPanelEl = element.shadowRoot.querySelector<ErrorPanel>('c-error-panel');
        expect(errorPanelEl).not.toBeNull();
        expect(errorPanelEl.friendlyMessage).toBe('No address to map');
    });

    it('displays an error panel when wire adapter returns an error', async () => {
        // Create element
        const element = createElement<PropertyMap>('c-account-map', {
            is: PropertyMap
        });
        // Set public properties
        element.recordId = mockRecordId;
        document.body.appendChild(element);

        // Emit an error from the getRecord adapter.
        getRecordMock.error(mockWireErrorMessage);

        // Return a promise to wait for any asynchronous DOM updates. Jest
        // will automatically wait for the Promise chain to complete before
        // ending the test and fail the test if the promise rejects.
        await Promise.resolve();
        // Select elements for validation
        const errorPanelEl = element.shadowRoot.querySelectorAll<ErrorPanel>('c-error-panel');
        // There are two error panels in the component - we need the second to check
        // the wire errors are displaying correctly
        const errorPanel = errorPanelEl[1];
        expect(errorPanel).not.toBeNull();
        expect(errorPanel.errors.body).toBe(mockWireErrorMessage);
        expect(errorPanel.friendlyMessage).toBe(
            'Error retrieving map data'
        );
    });

    it('is accessible when showing map', async () => {
        const element = createElement<PropertyMap>('c-account-map', {
            is: PropertyMap
        });

        element.recordId = mockRecordId;
        document.body.appendChild(element);

        // Emit data from the get record adapter that includes billing street data
        getRecordMock.emit(mockGetRecordWithAddress);

        await Promise.resolve();
        return await expect(element).toBeAccessible();
    });

    it('is accessible when showing error', async () => {
        const element = createElement<PropertyMap>('c-account-map', {
            is: PropertyMap
        });

        element.recordId = mockRecordId;
        document.body.appendChild(element);

        // Emit an error from the getRecord adapter.
        getRecordMock.error(mockWireErrorMessage);

        await Promise.resolve();
        return await expect(element).toBeAccessible();
    });
});
