import { api, LightningElement, wire } from 'lwc';
import { getRecord } from 'lightning/uiRecordApi';
import getSimilarProducts from '@salesforce/apex/ProductController.getSimilarProducts';
import PRODUCT_FAMILY_FIELD from '@salesforce/schema/Product__c.Product_Family__c';
const fields = [PRODUCT_FAMILY_FIELD];
export default class SimilarProducts extends LightningElement {
    @api
    recordId;
    @api
    familyId;
    // Track changes to the Product_Family__c field that could be made in other components.
    // If Product_Family__c is updated in another component, getSimilarProducts
    // is automatically re-invoked with the new this.familyId parameter
    @wire(getRecord, { recordId: '$recordId', fields })
    product;
    @wire(getSimilarProducts, {
        productId: '$recordId',
        familyId: '$product.data.fields.Product_Family__c.value'
    })
    similarProducts;
    get errors() {
        const errors = [this.product.error, this.similarProducts.error].filter((error) => error);
        return errors.length ? errors : undefined;
    }
    get hasNoSimilarProducts() {
        return this.similarProducts.data.length === 0;
    }
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoic2ltaWxhclByb2R1Y3RzLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsic2ltaWxhclByb2R1Y3RzLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBLE9BQU8sRUFBRSxHQUFHLEVBQUUsZ0JBQWdCLEVBQUUsSUFBSSxFQUFFLE1BQU0sS0FBSyxDQUFDO0FBQ2xELE9BQU8sRUFBRSxTQUFTLEVBQXdCLE1BQU0sdUJBQXVCLENBQUM7QUFDeEUsT0FBTyxrQkFBa0IsTUFBTSx1REFBdUQsQ0FBQztBQUN2RixPQUFPLG9CQUFvQixNQUFNLGlEQUFpRCxDQUFDO0FBRW5GLE1BQU0sTUFBTSxHQUFHLENBQUMsb0JBQW9CLENBQUMsQ0FBQztBQUV0QyxNQUFNLENBQUMsT0FBTyxPQUFPLGVBQWdCLFNBQVEsZ0JBQWdCO0lBQ3pELENBQUMsR0FBRztJQUFDLFFBQVEsQ0FBUztJQUN0QixDQUFDLEdBQUc7SUFBQyxRQUFRLENBQVM7SUFFdEIsdUZBQXVGO0lBQ3ZGLDJFQUEyRTtJQUMzRSxtRUFBbUU7SUFDbkUsQ0FBQyxJQUFJLENBQUMsU0FBUyxFQUFFLEVBQUUsUUFBUSxFQUFFLFdBQVcsRUFBRSxNQUFNLEVBQUUsQ0FBQztJQUNuRCxPQUFPLENBQW1DO0lBRTFDLENBQUMsSUFBSSxDQUFDLGtCQUFrQixFQUFFO1FBQ3RCLFNBQVMsRUFBRSxXQUFXO1FBQ3RCLFFBQVEsRUFBRSw4Q0FBOEM7S0FDM0QsQ0FBQztJQUNGLGVBQWUsQ0FBMkI7SUFFMUMsSUFBSSxNQUFNO1FBQ04sTUFBTSxNQUFNLEdBQUcsQ0FBQyxJQUFJLENBQUMsT0FBTyxDQUFDLEtBQUssRUFBRSxJQUFJLENBQUMsZUFBZSxDQUFDLEtBQUssQ0FBQyxDQUFDLE1BQU0sQ0FDbEUsQ0FBQyxLQUFLLEVBQUUsRUFBRSxDQUFDLEtBQUssQ0FDbkIsQ0FBQztRQUNGLE9BQU8sTUFBTSxDQUFDLE1BQU0sQ0FBQyxDQUFDLENBQUMsTUFBTSxDQUFDLENBQUMsQ0FBQyxTQUFTLENBQUM7SUFDOUMsQ0FBQztJQUVELElBQUksb0JBQW9CO1FBQ3BCLE9BQU8sSUFBSSxDQUFDLGVBQWUsQ0FBQyxJQUFJLENBQUMsTUFBTSxLQUFLLENBQUMsQ0FBQztJQUNsRCxDQUFDO0NBQ0oifQ==