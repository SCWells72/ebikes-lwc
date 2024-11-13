import { LightningElement, api, wire } from 'lwc';
// Lightning Message Service and message channels
import { publish, subscribe, MessageContext } from 'lightning/messageService';
import PRODUCTS_FILTERED_MESSAGE from '@salesforce/messageChannel/ProductsFiltered__c';
import PRODUCT_SELECTED_MESSAGE from '@salesforce/messageChannel/ProductSelected__c';
// getProducts() method in ProductController Apex class
import getProducts from '@salesforce/apex/ProductController.getProducts';
// noinspection JSUnusedGlobalSymbols
/**
 * Container component that loads and displays a list of Product__c records.
 */
export default class ProductTileList extends LightningElement {
    /**
     * Whether to display the search bar.
     */
    @api
    searchBarIsVisible = false;
    /**
     * Whether the product tiles are draggable.
     */
    @api
    tilesAreDraggable = false;
    /** Current page in the product list. */
    pageNumber = 1;
    /** The number of items on a page. */
    pageSize;
    /** The total number of items matching the selection. */
    totalItemCount = 0;
    /** JSON.stringified version of filters to pass to apex */
    filters = {};
    /** Load context for Lightning Messaging Service */
    @wire(MessageContext)
    messageContext;
    /** Subscription for ProductsFiltered Lightning message */
    productFilterSubscription;
    /**
     * Load the list of available products.
     */
    @wire(getProducts, { filters: '$filters', pageNumber: '$pageNumber' })
    products;
    connectedCallback() {
        // Subscribe to ProductsFiltered message
        this.productFilterSubscription = subscribe(this.messageContext, PRODUCTS_FILTERED_MESSAGE, (message) => this.handleFilterChange(message));
    }
    handleProductSelected(event) {
        // Published ProductSelected message
        publish(this.messageContext, PRODUCT_SELECTED_MESSAGE, {
            productId: event.detail
        });
    }
    handleSearchKeyChange(event) {
        this.filters = {
            searchKey: event.target.value.toLowerCase()
        };
        this.pageNumber = 1;
    }
    handleFilterChange(message) {
        this.filters = { ...message.filters };
        this.pageNumber = 1;
    }
    handlePreviousPage() {
        this.pageNumber -= 1;
    }
    handleNextPage() {
        this.pageNumber += 1;
    }
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoicHJvZHVjdFRpbGVMaXN0LmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsicHJvZHVjdFRpbGVMaXN0LnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBLE9BQU8sRUFBRSxnQkFBZ0IsRUFBRSxHQUFHLEVBQUUsSUFBSSxFQUFFLE1BQU0sS0FBSyxDQUFDO0FBRWxELGlEQUFpRDtBQUNqRCxPQUFPLEVBQ0gsT0FBTyxFQUNQLFNBQVMsRUFDVCxjQUFjLEVBR2pCLE1BQU0sMEJBQTBCLENBQUM7QUFDbEMsT0FBTyx5QkFBeUIsTUFBTSxnREFBZ0QsQ0FBQztBQUN2RixPQUFPLHdCQUF3QixNQUFNLCtDQUErQyxDQUFDO0FBRXJGLHVEQUF1RDtBQUN2RCxPQUFPLFdBQVcsTUFBTSxnREFBZ0QsQ0FBQztBQUl6RSxxQ0FBcUM7QUFDckM7O0dBRUc7QUFDSCxNQUFNLENBQUMsT0FBTyxPQUFPLGVBQWdCLFNBQVEsZ0JBQWdCO0lBQ3pEOztPQUVHO0lBQ0gsQ0FBQyxHQUFHO0lBQUMsa0JBQWtCLEdBQUcsS0FBSyxDQUFDO0lBRWhDOztPQUVHO0lBQ0gsQ0FBQyxHQUFHO0lBQUMsaUJBQWlCLEdBQUcsS0FBSyxDQUFDO0lBRS9CLHdDQUF3QztJQUN4QyxVQUFVLEdBQUcsQ0FBQyxDQUFDO0lBRWYscUNBQXFDO0lBQ3JDLFFBQVEsQ0FBUztJQUVqQix3REFBd0Q7SUFDeEQsY0FBYyxHQUFHLENBQUMsQ0FBQztJQUVuQiwwREFBMEQ7SUFDMUQsT0FBTyxHQUE4QixFQUFFLENBQUM7SUFFeEMsbURBQW1EO0lBQ25ELENBQUMsSUFBSSxDQUFDLGNBQWMsQ0FBQztJQUFDLGNBQWMsQ0FBcUI7SUFFekQsMERBQTBEO0lBQzFELHlCQUF5QixDQUE2QjtJQUV0RDs7T0FFRztJQUNILENBQUMsSUFBSSxDQUFDLFdBQVcsRUFBRSxFQUFFLE9BQU8sRUFBRSxVQUFVLEVBQUUsVUFBVSxFQUFFLGFBQWEsRUFBRSxDQUFDO0lBQ3RFLFFBQVEsQ0FBMEI7SUFFbEMsaUJBQWlCO1FBQ2Isd0NBQXdDO1FBQ3hDLElBQUksQ0FBQyx5QkFBeUIsR0FBRyxTQUFTLENBQ3RDLElBQUksQ0FBQyxjQUFjLEVBQ25CLHlCQUF5QixFQUN6QixDQUFDLE9BQTRCLEVBQUUsRUFBRSxDQUFDLElBQUksQ0FBQyxrQkFBa0IsQ0FBQyxPQUFPLENBQUMsQ0FDckUsQ0FBQztJQUNOLENBQUM7SUFFRCxxQkFBcUIsQ0FBQyxLQUEyQjtRQUM3QyxvQ0FBb0M7UUFDcEMsT0FBTyxDQUFDLElBQUksQ0FBQyxjQUFjLEVBQUUsd0JBQXdCLEVBQUU7WUFDbkQsU0FBUyxFQUFFLEtBQUssQ0FBQyxNQUFNO1NBQzFCLENBQUMsQ0FBQztJQUNQLENBQUM7SUFFRCxxQkFBcUIsQ0FBQyxLQUFrQztRQUNwRCxJQUFJLENBQUMsT0FBTyxHQUFHO1lBQ1gsU0FBUyxFQUFtQixLQUFLLENBQUMsTUFBTyxDQUFDLEtBQUssQ0FBQyxXQUFXLEVBQUU7U0FDaEUsQ0FBQztRQUNGLElBQUksQ0FBQyxVQUFVLEdBQUcsQ0FBQyxDQUFDO0lBQ3hCLENBQUM7SUFFRCxrQkFBa0IsQ0FBQyxPQUE0QjtRQUMzQyxJQUFJLENBQUMsT0FBTyxHQUFHLEVBQUUsR0FBRyxPQUFPLENBQUMsT0FBTyxFQUFFLENBQUM7UUFDdEMsSUFBSSxDQUFDLFVBQVUsR0FBRyxDQUFDLENBQUM7SUFDeEIsQ0FBQztJQUVELGtCQUFrQjtRQUNkLElBQUksQ0FBQyxVQUFVLElBQUksQ0FBQyxDQUFDO0lBQ3pCLENBQUM7SUFFRCxjQUFjO1FBQ1YsSUFBSSxDQUFDLFVBQVUsSUFBSSxDQUFDLENBQUM7SUFDekIsQ0FBQztDQUNKIn0=