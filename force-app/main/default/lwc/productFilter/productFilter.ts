import { LightningElement, wire } from 'lwc';
import { getPicklistValues, PicklistValues } from 'lightning/uiObjectInfoApi';

// Product schema
import CATEGORY_FIELD from '@salesforce/schema/Product__c.Category__c';
import LEVEL_FIELD from '@salesforce/schema/Product__c.Level__c';
import MATERIAL_FIELD from '@salesforce/schema/Product__c.Material__c';

// Lightning Message Service and a message channel
import { publish, MessageContext, MessageContextType } from 'lightning/messageService';
import PRODUCTS_FILTERED_MESSAGE from '@salesforce/messageChannel/ProductsFiltered__c';
import LightningInput from 'lightning/input';
import LightningSlider from 'lightning/slider';

// The delay used when debouncing event handlers before firing the event
const DELAY = 350;

/**
 * Displays a filter panel to search for Product__c[].
 */
export default class ProductFilter extends LightningElement {
    // noinspection JSUnusedGlobalSymbols
    searchKey = '';
    maxPrice = 10000;

    filters = {
        searchKey: '',
        maxPrice: 10000
    };

    @wire(MessageContext)
    messageContext: MessageContextType;

    @wire(getPicklistValues, {
        recordTypeId: '012000000000000AAA',
        fieldApiName: CATEGORY_FIELD
    })
    categories: WireResult<PicklistValues>;

    @wire(getPicklistValues, {
        recordTypeId: '012000000000000AAA',
        fieldApiName: LEVEL_FIELD
    })
    levels: WireResult<PicklistValues>;

    @wire(getPicklistValues, {
        recordTypeId: '012000000000000AAA',
        fieldApiName: MATERIAL_FIELD
    })
    materials: WireResult<PicklistValues>;

    handleSearchKeyChange(event: CustomEvent<LightningInput>) {
        this.filters.searchKey = (<LightningInput>event.target).value;
        this.delayedFireFilterChangeEvent();
    }

    handleMaxPriceChange(event: CustomEvent<LightningSlider>) {
        // noinspection UnnecessaryLocalVariableJS
        const maxPrice = (<LightningSlider>event.target).value;
        this.filters.maxPrice = maxPrice;
        this.delayedFireFilterChangeEvent();
    }

    handleCheckboxChange(event: CustomEvent<LightningInput>) {
        // TODO: This should work with "event.detail" which is strongly-typed, but that's coming back null; likely an LWC bug
        const eventTarget = <LightningInput>event.target;

        // @ts-expect-error Not sure how to reconcile this
        if (!this.filters.categories) {
            // Lazy initialize filters with all values initially set
            // @ts-expect-error Not sure how to reconcile this
            this.filters.categories = this.categories.data.values.map(
                (item) => item.value
            );
            // @ts-expect-error Not sure how to reconcile this
            this.filters.levels = this.levels.data.values.map(
                (item) => item.value
            );
            // @ts-expect-error Not sure how to reconcile this
            this.filters.materials = this.materials.data.values.map(
                (item) => item.value
            );
        }
        const value = eventTarget.dataset.value;
        const filterArray = this.filters[eventTarget.dataset.filter];
        if (eventTarget.checked) {
            if (!filterArray.includes(value)) {
                filterArray.push(value);
            }
        } else {
            this.filters[(<LightningInput>event.target).dataset.filter] = filterArray.filter(
                (item: any) => item !== value
            );
        }
        // Published ProductsFiltered message
        publish(this.messageContext, PRODUCTS_FILTERED_MESSAGE, <ProductsFiltered__c>{
            filters: this.filters
        });
    }

    delayedFireFilterChangeEvent() {
        // Debouncing this method: Do not actually fire the event as long as this function is
        // being called within a delay of DELAY. This is to avoid a very large number of Apex
        // method calls in components listening to this event.
        // @ts-expect-error Where is delayTimeout defined?
        window.clearTimeout(this.delayTimeout);
        // @ts-expect-error Where is delayTimeout defined?
        this.delayTimeout = setTimeout(() => {
            // Published ProductsFiltered message
            publish(this.messageContext, PRODUCTS_FILTERED_MESSAGE, <ProductsFiltered__c>{
                filters: this.filters
            });
        }, DELAY);
    }
}
