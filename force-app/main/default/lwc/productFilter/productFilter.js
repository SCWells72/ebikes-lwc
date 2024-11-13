import { LightningElement, wire } from 'lwc';
import { getPicklistValues } from 'lightning/uiObjectInfoApi';
// Product schema
import CATEGORY_FIELD from '@salesforce/schema/Product__c.Category__c';
import LEVEL_FIELD from '@salesforce/schema/Product__c.Level__c';
import MATERIAL_FIELD from '@salesforce/schema/Product__c.Material__c';
// Lightning Message Service and a message channel
import { publish, MessageContext } from 'lightning/messageService';
import PRODUCTS_FILTERED_MESSAGE from '@salesforce/messageChannel/ProductsFiltered__c';
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
    messageContext;
    @wire(getPicklistValues, {
        recordTypeId: '012000000000000AAA',
        fieldApiName: CATEGORY_FIELD
    })
    categories;
    @wire(getPicklistValues, {
        recordTypeId: '012000000000000AAA',
        fieldApiName: LEVEL_FIELD
    })
    levels;
    @wire(getPicklistValues, {
        recordTypeId: '012000000000000AAA',
        fieldApiName: MATERIAL_FIELD
    })
    materials;
    handleSearchKeyChange(event) {
        this.filters.searchKey = event.target.value;
        this.delayedFireFilterChangeEvent();
    }
    handleMaxPriceChange(event) {
        // noinspection UnnecessaryLocalVariableJS
        const maxPrice = event.target.value;
        this.filters.maxPrice = maxPrice;
        this.delayedFireFilterChangeEvent();
    }
    handleCheckboxChange(event) {
        // TODO: This should work with "event.detail" which is strongly-typed, but that's coming back null; likely an LWC bug
        const eventTarget = event.target;
        // @ts-expect-error Not sure how to reconcile this
        if (!this.filters.categories) {
            // Lazy initialize filters with all values initially set
            // @ts-expect-error Not sure how to reconcile this
            this.filters.categories = this.categories.data.values.map((item) => item.value);
            // @ts-expect-error Not sure how to reconcile this
            this.filters.levels = this.levels.data.values.map((item) => item.value);
            // @ts-expect-error Not sure how to reconcile this
            this.filters.materials = this.materials.data.values.map((item) => item.value);
        }
        const value = eventTarget.dataset.value;
        const filterArray = this.filters[eventTarget.dataset.filter];
        if (eventTarget.checked) {
            if (!filterArray.includes(value)) {
                filterArray.push(value);
            }
        }
        else {
            this.filters[event.target.dataset.filter] = filterArray.filter((item) => item !== value);
        }
        // Published ProductsFiltered message
        publish(this.messageContext, PRODUCTS_FILTERED_MESSAGE, {
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
        // eslint-disable-next-line @lwc/lwc/no-async-operation
        this.delayTimeout = setTimeout(() => {
            // Published ProductsFiltered message
            publish(this.messageContext, PRODUCTS_FILTERED_MESSAGE, {
                filters: this.filters
            });
        }, DELAY);
    }
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoicHJvZHVjdEZpbHRlci5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbInByb2R1Y3RGaWx0ZXIudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUEsT0FBTyxFQUFFLGdCQUFnQixFQUFFLElBQUksRUFBRSxNQUFNLEtBQUssQ0FBQztBQUM3QyxPQUFPLEVBQUUsaUJBQWlCLEVBQWtCLE1BQU0sMkJBQTJCLENBQUM7QUFFOUUsaUJBQWlCO0FBQ2pCLE9BQU8sY0FBYyxNQUFNLDJDQUEyQyxDQUFDO0FBQ3ZFLE9BQU8sV0FBVyxNQUFNLHdDQUF3QyxDQUFDO0FBQ2pFLE9BQU8sY0FBYyxNQUFNLDJDQUEyQyxDQUFDO0FBRXZFLGtEQUFrRDtBQUNsRCxPQUFPLEVBQUUsT0FBTyxFQUFFLGNBQWMsRUFBc0IsTUFBTSwwQkFBMEIsQ0FBQztBQUN2RixPQUFPLHlCQUF5QixNQUFNLGdEQUFnRCxDQUFDO0FBSXZGLHdFQUF3RTtBQUN4RSxNQUFNLEtBQUssR0FBRyxHQUFHLENBQUM7QUFFbEI7O0dBRUc7QUFDSCxNQUFNLENBQUMsT0FBTyxPQUFPLGFBQWMsU0FBUSxnQkFBZ0I7SUFDdkQscUNBQXFDO0lBQ3JDLFNBQVMsR0FBRyxFQUFFLENBQUM7SUFDZixRQUFRLEdBQUcsS0FBSyxDQUFDO0lBRWpCLE9BQU8sR0FBRztRQUNOLFNBQVMsRUFBRSxFQUFFO1FBQ2IsUUFBUSxFQUFFLEtBQUs7S0FDbEIsQ0FBQztJQUVGLENBQUMsSUFBSSxDQUFDLGNBQWMsQ0FBQztJQUNyQixjQUFjLENBQXFCO0lBRW5DLENBQUMsSUFBSSxDQUFDLGlCQUFpQixFQUFFO1FBQ3JCLFlBQVksRUFBRSxvQkFBb0I7UUFDbEMsWUFBWSxFQUFFLGNBQWM7S0FDL0IsQ0FBQztJQUNGLFVBQVUsQ0FBNkI7SUFFdkMsQ0FBQyxJQUFJLENBQUMsaUJBQWlCLEVBQUU7UUFDckIsWUFBWSxFQUFFLG9CQUFvQjtRQUNsQyxZQUFZLEVBQUUsV0FBVztLQUM1QixDQUFDO0lBQ0YsTUFBTSxD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