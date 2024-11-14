// noinspection DuplicatedCode

import { createElement } from 'lwc';
import OrderBuilder from 'c/orderBuilder';
import getOrderItems from '@salesforce/apex/OrderController.getOrderItems';
import LightningFormattedNumber from 'lightning/formattedNumber';
import OrderItemTile from "c/orderItemTile";
import Placeholder from "c/placeholder";
import ErrorPanel from "c/errorPanel";
import { ApexTestWireAdapter } from '@salesforce/wire-service-jest-util';

// Mock realistic data for the getOrderItems adapter
import mockGetOrderItems from "./data/getOrderItems.json";
import mockGetOrderItemsEmpty from "./data/getOrderItemsEmpty.json";

// Mock realistic data for the public properties
const mockRecordId = '0031700000pHcf8AAC';

//Expected Wire Input
const WIRE_INPUT = {
    orderId: '0031700000pHcf8AAC'
};

// Mock getOrderItems Apex wire adapter
jest.mock(
    '@salesforce/apex/OrderController.getOrderItems',
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

describe('c-order-builder', () => {
    afterEach(() => {
        // The jsdom instance is shared across test cases in a single file so reset the DOM
        while (document.body.firstChild) {
            document.body.removeChild(document.body.firstChild);
        }
    });

    // Helper function to wait until the microtask queue is empty. This is needed for promise
    // timing when calling imperative Apex.
    async function flushPromises() {
        return Promise.resolve();
    }

    it('displays the correct number of tiles and their details', async () => {
        // Set values for validating component changes
        const expectedItems = 9;
        const expectedSum = 38880;

        const element = createElement<OrderBuilder>('c-order-builder', {
            is: OrderBuilder
        });
        element.recordId = mockRecordId;
        document.body.appendChild(element);

        // Emit Data from the Apex wire adapter.
        (<ApexTestWireAdapter><unknown>getOrderItems).emit(mockGetOrderItems);

        // Wait for any asynchronous DOM updates
        await flushPromises();

        // Check the wire parameters are correct
        expect((<ApexTestWireAdapter><unknown>getOrderItems).getLastConfig()).toEqual(WIRE_INPUT);
        // Select elements for validation
        const orderItemTileEl =
            element.shadowRoot.querySelectorAll('c-order-item-tile');
        expect(orderItemTileEl.length).toBe(mockGetOrderItems.length);
        // Get the order items to verify they have been set correctly
        // @ts-expect-error Not sure what's going on here
        const { orderItem } = orderItemTileEl[0];
        expect(orderItem).toEqual(
            expect.objectContaining(mockGetOrderItems[0])
        );
        // Get the formatted number to verify it has been calculated
        const formattedNumberEl = element.shadowRoot.querySelector<LightningFormattedNumber>(
            'lightning-formatted-number'
        );
        expect(formattedNumberEl.value).toBe(expectedSum);
        // Get the order total to verify it has been calculated
        const orderTotalDivEl = element.shadowRoot.querySelector('div.right');
        expect(orderTotalDivEl.textContent).toBe(
            `Total Items: ${expectedItems}`
        );
    });

    it('updates the component when an order has been updated', async () => {
        // Set values for validating component changes
        const mockRecordUpdate = { Id: 'a003B000004fG1VQAU', Qty_S__c: 3 };
        const expectedItems = 11;
        const expectedSum = 47280;

        const element = createElement<OrderBuilder>('c-order-builder', {
            is: OrderBuilder
        });
        element.recordId = mockRecordId;
        document.body.appendChild(element);

        // Emit Data from the Apex wire adapter.s
        (<ApexTestWireAdapter><unknown>getOrderItems).emit(mockGetOrderItems);

        // Wait for any asynchronous DOM updates
        await flushPromises();

        // Check the wire parameters are correct
        expect((<ApexTestWireAdapter><unknown>getOrderItems).getLastConfig()).toEqual(WIRE_INPUT);
        // Select elements for validation
        let orderItemTileEl =
            element.shadowRoot.querySelectorAll<OrderItemTile>('c-order-item-tile');
        orderItemTileEl[0].dispatchEvent(
            new CustomEvent('orderitemchange', {
                detail: mockRecordUpdate,
                bubbles: true
            })
        );

        // Wait for any asynchronous DOM updates
        await flushPromises();

        // noinspection ReuseOfLocalVariableJS
        orderItemTileEl =
            element.shadowRoot.querySelectorAll<OrderItemTile>('c-order-item-tile');
        // Get the first order item and check that the quantity has ben updated
        const orderItem = orderItemTileEl[0].orderItem.Qty_S__c;
        expect(orderItem).toEqual(mockRecordUpdate.Qty_S__c);
        // Get the formatted number to verify it has been updated
        const formattedNumberEl = element.shadowRoot.querySelector<LightningFormattedNumber>(
            'lightning-formatted-number'
        );
        expect(formattedNumberEl.value).toBe(expectedSum);
        // Get the order total to verify it has been updated
        const orderTotalDivEl = element.shadowRoot.querySelector('div.right');
        expect(orderTotalDivEl.textContent).toBe(
            `Total Items: ${expectedItems}`
        );
    });
    it('updates the component when an order has been deleted', async () => {
        // Set values for validating component changes
        const mockRecordToDeleteId = 'a003B000004fG1VQAU';
        const expectedItems = 6;
        const expectedSum = 26280;

        const element = createElement<OrderBuilder>('c-order-builder', {
            is: OrderBuilder
        });
        element.recordId = mockRecordId;
        document.body.appendChild(element);

        // Emit Data from the Apex wire adapter.
        (<ApexTestWireAdapter><unknown>getOrderItems).emit(mockGetOrderItems);

        // Wait for any asynchronous DOM updates
        await flushPromises();

        // Check the wire parameters are correct
        expect((<ApexTestWireAdapter><unknown>getOrderItems).getLastConfig()).toEqual(WIRE_INPUT);
        // Select elements for validation
        let orderItemTileEl =
            element.shadowRoot.querySelectorAll('c-order-item-tile');
        orderItemTileEl[0].dispatchEvent(
            new CustomEvent('orderitemdelete', {
                detail: { id: mockRecordToDeleteId }
            })
        );

        // Wait for any asynchronous DOM updates
        await flushPromises();

        // noinspection ReuseOfLocalVariableJS
        orderItemTileEl =
            element.shadowRoot.querySelectorAll('c-order-item-tile');
        // Get the first order item and check that the quantity has ben updated
        expect(orderItemTileEl.length).toBe(mockGetOrderItems.length - 1);
        // Get the formatted number to verify it has been updated
        const formattedNumberEl = element.shadowRoot.querySelector<LightningFormattedNumber>(
            'lightning-formatted-number'
        );
        expect(formattedNumberEl.value).toBe(expectedSum);
        // Get the order total to verify it has been updated
        const orderTotalDivEl = element.shadowRoot.querySelector('div.right');
        expect(orderTotalDivEl.textContent).toBe(
            `Total Items: ${expectedItems}`
        );
    });

    it('displays a panel when no data is returned', async () => {
        // Set values for validating component changes
        const expectedMessage = 'Drag products here to add items to the order';

        const element = createElement<OrderBuilder>('c-order-builder', {
            is: OrderBuilder
        });
        element.recordId = mockRecordId;
        document.body.appendChild(element);

        // Emit Data from the Apex wire adapter.
        (<ApexTestWireAdapter><unknown>getOrderItems).emit(mockGetOrderItemsEmpty);

        // Wait for any asynchronous DOM updates
        await flushPromises();

        // verify that the placeholder is showing the correct data
        const placeholderEl = element.shadowRoot.querySelector<Placeholder>('c-placeholder');
        expect(placeholderEl.message).toBe(expectedMessage);
    });

    it('displays a error when an error is returned', async () => {
        // Set values for validating component changes
        const mockError = { message: 'mockError' };

        const element = createElement<OrderBuilder>('c-order-builder', {
            is: OrderBuilder
        });
        element.recordId = mockRecordId;
        document.body.appendChild(element);

        // Emit Data from the Apex wire adapter.
        (<ApexTestWireAdapter><unknown>getOrderItems).error(mockError);

        // Wait for any asynchronous DOM updates
        await flushPromises();

        // Verify that the error panel is showing the correct data
        const errorPanelEl = element.shadowRoot.querySelector<ErrorPanel>('c-error-panel');
        expect(errorPanelEl).not.toBeNull();
        expect(errorPanelEl.errors.body).toStrictEqual(mockError);
    });

    it('is accessible when orders returned', async () => {
        const element = createElement<OrderBuilder>('c-order-builder', {
            is: OrderBuilder
        });
        element.recordId = mockRecordId;
        document.body.appendChild(element);

        // Emit Data from the Apex wire adapter.
        (<ApexTestWireAdapter><unknown>getOrderItems).emit(mockGetOrderItems);

        // Wait for any asynchronous DOM updates
        await flushPromises();

        await expect(element).toBeAccessible();
    });

    it('is accessible when no orders returned', async () => {
        const element = createElement<OrderBuilder>('c-order-builder', {
            is: OrderBuilder
        });
        element.recordId = mockRecordId;
        document.body.appendChild(element);

        // Emit Data from the Apex wire adapter.
        (<ApexTestWireAdapter><unknown>getOrderItems).emit(mockGetOrderItemsEmpty);

        // Wait for any asynchronous DOM updates
        await flushPromises();

        await expect(element).toBeAccessible();
    });

    it('is accessible when error returned', async () => {
        const mockError = { message: 'mockError' };

        const element = createElement<OrderBuilder>('c-order-builder', {
            is: OrderBuilder
        });
        element.recordId = mockRecordId;
        document.body.appendChild(element);

        // Emit Error from the Apex wire adapter.
        (<ApexTestWireAdapter><unknown>getOrderItems).error(mockError);

        // Wait for any asynchronous DOM updates
        await flushPromises();

        await expect(element).toBeAccessible();
    });
});
