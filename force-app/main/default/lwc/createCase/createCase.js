import { LightningElement } from 'lwc';
import { ShowToastEvent } from 'lightning/platformShowToastEvent';
import CASE_OBJECT from '@salesforce/schema/Case';
import SUBJECT from '@salesforce/schema/Case.Subject';
import DESCRIPTION from '@salesforce/schema/Case.Description';
import PRODUCT from '@salesforce/schema/Case.Product__c';
import PRIORITY from '@salesforce/schema/Case.Priority';
import CASE_CATEGORY from '@salesforce/schema/Case.Case_Category__c';
import REASON from '@salesforce/schema/Case.Reason';
const TITLE_SUCCESS = 'Case Created!';
const MESSAGE_SUCCESS = 'You have successfully created a Case';
export default class CreateCase extends LightningElement {
    caseObject = CASE_OBJECT;
    subjectField = SUBJECT;
    productField = PRODUCT;
    descriptionField = DESCRIPTION;
    priorityField = PRIORITY;
    reasonField = REASON;
    categoryField = CASE_CATEGORY;
    handleCaseCreated() {
        // Fire event for Toast to appear that Order was created
        const evt = new ShowToastEvent({
            title: TITLE_SUCCESS,
            message: MESSAGE_SUCCESS,
            variant: 'success'
        });
        this.dispatchEvent(evt);
        const refreshEvt = new CustomEvent('refresh');
        // Fire the custom event
        this.dispatchEvent(refreshEvt);
    }
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiY3JlYXRlQ2FzZS5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbImNyZWF0ZUNhc2UudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUEsT0FBTyxFQUFFLGdCQUFnQixFQUFFLE1BQU0sS0FBSyxDQUFDO0FBQ3ZDLE9BQU8sRUFBRSxjQUFjLEVBQUUsTUFBTSxrQ0FBa0MsQ0FBQztBQUVsRSxPQUFPLFdBQVcsTUFBTSx5QkFBeUIsQ0FBQztBQUNsRCxPQUFPLE9BQU8sTUFBTSxpQ0FBaUMsQ0FBQztBQUN0RCxPQUFPLFdBQVcsTUFBTSxxQ0FBcUMsQ0FBQztBQUM5RCxPQUFPLE9BQU8sTUFBTSxvQ0FBb0MsQ0FBQztBQUN6RCxPQUFPLFFBQVEsTUFBTSxrQ0FBa0MsQ0FBQztBQUN4RCxPQUFPLGFBQWEsTUFBTSwwQ0FBMEMsQ0FBQztBQUNyRSxPQUFPLE1BQU0sTUFBTSxnQ0FBZ0MsQ0FBQztBQUVwRCxNQUFNLGFBQWEsR0FBRyxlQUFlLENBQUM7QUFDdEMsTUFBTSxlQUFlLEdBQUcsc0NBQXNDLENBQUM7QUFFL0QsTUFBTSxDQUFDLE9BQU8sT0FBTyxVQUFXLFNBQVEsZ0JBQWdCO0lBQ3BELFVBQVUsR0FBRyxXQUFXLENBQUM7SUFDekIsWUFBWSxHQUFHLE9BQU8sQ0FBQztJQUN2QixZQUFZLEdBQUcsT0FBTyxDQUFDO0lBQ3ZCLGdCQUFnQixHQUFHLFdBQVcsQ0FBQztJQUMvQixhQUFhLEdBQUcsUUFBUSxDQUFDO0lBQ3pCLFdBQVcsR0FBRyxNQUFNLENBQUM7SUFDckIsYUFBYSxHQUFHLGFBQWEsQ0FBQztJQUU5QixpQkFBaUI7UUFDYix3REFBd0Q7UUFDeEQsTUFBTSxHQUFHLEdBQUcsSUFBSSxjQUFjLENBQUM7WUFDM0IsS0FBSyxFQUFFLGFBQWE7WUFDcEIsT0FBTyxFQUFFLGVBQWU7WUFDeEIsT0FBTyxFQUFFLFNBQVM7U0FDckIsQ0FBQyxDQUFDO1FBQ0gsSUFBSSxDQUFDLGFBQWEsQ0FBQyxHQUFHLENBQUMsQ0FBQztRQUV4QixNQUFNLFVBQVUsR0FBRyxJQUFJLFdBQVcsQ0FBQyxTQUFTLENBQUMsQ0FBQztRQUM5Qyx3QkFBd0I7UUFDeEIsSUFBSSxDQUFDLGFBQWEsQ0FBQyxVQUFVLENBQUMsQ0FBQztJQUNuQyxDQUFDO0NBQ0oifQ==