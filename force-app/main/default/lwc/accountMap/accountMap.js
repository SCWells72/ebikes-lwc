import { LightningElement, api, wire } from 'lwc';
import { getRecord, getFieldValue } from 'lightning/uiRecordApi';
import BILLING_CITY from '@salesforce/schema/Account.BillingCity';
import BILLING_COUNTRY from '@salesforce/schema/Account.BillingCountry';
import BILLING_POSTAL_CODE from '@salesforce/schema/Account.BillingPostalCode';
import BILLING_STATE from '@salesforce/schema/Account.BillingState';
import BILLING_STREET from '@salesforce/schema/Account.BillingStreet';
const fields = [
    BILLING_CITY,
    BILLING_COUNTRY,
    BILLING_POSTAL_CODE,
    BILLING_STATE,
    BILLING_STREET
];
export default class PropertyMap extends LightningElement {
    @api
    recordId;
    zoomLevel = 14;
    markers = [];
    error;
    @wire(getRecord, { recordId: '$recordId', fields })
    wiredRecord({ error, data }) {
        if (data) {
            this.markers = [];
            this.error = undefined;
            const street = getFieldValue(data, BILLING_STREET);
            if (street) {
                this.markers = [
                    {
                        location: {
                            City: getFieldValue(data, BILLING_CITY),
                            Country: getFieldValue(data, BILLING_COUNTRY),
                            PostalCode: getFieldValue(data, BILLING_POSTAL_CODE),
                            State: getFieldValue(data, BILLING_STATE),
                            Street: street
                        }
                    }
                ];
            }
        }
        else if (error) {
            this.markers = [];
            this.error = error;
        }
    }
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiYWNjb3VudE1hcC5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbImFjY291bnRNYXAudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUEsT0FBTyxFQUFFLGdCQUFnQixFQUFFLEdBQUcsRUFBRSxJQUFJLEVBQUUsTUFBTSxLQUFLLENBQUM7QUFDbEQsT0FBTyxFQUFFLFNBQVMsRUFBRSxhQUFhLEVBQUUsTUFBTSx1QkFBdUIsQ0FBQztBQUdqRSxPQUFPLFlBQVksTUFBTSx3Q0FBd0MsQ0FBQztBQUNsRSxPQUFPLGVBQWUsTUFBTSwyQ0FBMkMsQ0FBQztBQUN4RSxPQUFPLG1CQUFtQixNQUFNLDhDQUE4QyxDQUFDO0FBQy9FLE9BQU8sYUFBYSxNQUFNLHlDQUF5QyxDQUFDO0FBQ3BFLE9BQU8sY0FBYyxNQUFNLDBDQUEwQyxDQUFDO0FBRXRFLE1BQU0sTUFBTSxHQUFHO0lBQ1gsWUFBWTtJQUNaLGVBQWU7SUFDZixtQkFBbUI7SUFDbkIsYUFBYTtJQUNiLGNBQWM7Q0FDakIsQ0FBQztBQUVGLE1BQU0sQ0FBQyxPQUFPLE9BQU8sV0FBWSxTQUFRLGdCQUFnQjtJQUNyRCxDQUFDLEdBQUc7SUFBQyxRQUFRLENBQVM7SUFFdEIsU0FBUyxHQUFHLEVBQUUsQ0FBQztJQUNmLE9BQU8sR0FBeUIsRUFBRSxDQUFDO0lBQ25DLEtBQUssQ0FBTTtJQUVYLENBQUMsSUFBSSxDQUFDLFNBQVMsRUFBRSxFQUFFLFFBQVEsRUFBRSxXQUFXLEVBQUUsTUFBTSxFQUFFLENBQUM7SUFDbkQsV0FBVyxDQUFDLEVBQUUsS0FBSyxFQUFFLElBQUksRUFBRTtRQUN2QixJQUFJLElBQUksRUFBRSxDQUFDO1lBQ1AsSUFBSSxDQUFDLE9BQU8sR0FBRyxFQUFFLENBQUM7WUFDbEIsSUFBSSxDQUFDLEtBQUssR0FBRyxTQUFTLENBQUM7WUFDdkIsTUFBTSxNQUFNLEdBQUcsYUFBYSxDQUFDLElBQUksRUFBRSxjQUFjLENBQUMsQ0FBQztZQUNuRCxJQUFJLE1BQU0sRUFBRSxDQUFDO2dCQUNULElBQUksQ0FBQyxPQUFPLEdBQUc7b0JBQ1g7d0JBQ0ksUUFBUSxFQUFFOzRCQUNOLElBQUksRUFBRSxhQUFhLENBQUMsSUFBSSxFQUFFLFlBQVksQ0FBQzs0QkFDdkMsT0FBTyxFQUFFLGFBQWEsQ0FBQyxJQUFJLEVBQUUsZUFBZSxDQUFDOzRCQUM3QyxVQUFVLEVBQUUsYUFBYSxDQUNyQixJQUFJLEVBQ0osbUJBQW1CLENBQ3RCOzRCQUNELEtBQUssRUFBRSxhQUFhLENBQUMsSUFBSSxFQUFFLGFBQWEsQ0FBQzs0QkFDekMsTUFBTSxFQUFFLE1BQU07eUJBQ2pCO3FCQUNKO2lCQUNKLENBQUM7WUFDTixDQUFDO1FBQ0wsQ0FBQzthQUFNLElBQUksS0FBSyxFQUFFLENBQUM7WUFDZixJQUFJLENBQUMsT0FBTyxHQUFHLEVBQUUsQ0FBQztZQUNsQixJQUFJLENBQUMsS0FBSyxHQUFHLEtBQUssQ0FBQztRQUN2QixDQUFDO0lBQ0wsQ0FBQztDQUNKIn0=