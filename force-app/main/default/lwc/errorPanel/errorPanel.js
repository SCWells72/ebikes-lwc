import { LightningElement, api } from 'lwc';
import { reduceErrors } from 'c/ldsUtils';
import noDataIllustration from './templates/noDataIllustration.html';
import inlineMessage from './templates/inlineMessage.html';
export default class ErrorPanel extends LightningElement {
    /** Single or array of LDS errors */
    @api
    errors;
    /** Generic / user-friendly message */
    @api
    friendlyMessage = 'Error retrieving data';
    /** Type of error message **/
    @api
    type;
    viewDetails = false;
    get errorMessages() {
        return reduceErrors(this.errors);
    }
    handleShowDetailsClick() {
        this.viewDetails = !this.viewDetails;
    }
    render() {
        // noinspection NonBlockStatementBodyJS
        if (this.type === 'inlineMessage')
            return inlineMessage;
        return noDataIllustration;
    }
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZXJyb3JQYW5lbC5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbImVycm9yUGFuZWwudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUEsT0FBTyxFQUFFLGdCQUFnQixFQUFFLEdBQUcsRUFBRSxNQUFNLEtBQUssQ0FBQztBQUM1QyxPQUFPLEVBQUUsWUFBWSxFQUFFLE1BQU0sWUFBWSxDQUFDO0FBQzFDLE9BQU8sa0JBQWtCLE1BQU0scUNBQXFDLENBQUM7QUFDckUsT0FBTyxhQUFhLE1BQU0sZ0NBQWdDLENBQUM7QUFFM0QsTUFBTSxDQUFDLE9BQU8sT0FBTyxVQUFXLFNBQVEsZ0JBQWdCO0lBQ3BELG9DQUFvQztJQUNwQyxDQUFDLEdBQUc7SUFBQyxNQUFNLENBQU07SUFDakIsc0NBQXNDO0lBQ3RDLENBQUMsR0FBRztJQUFDLGVBQWUsR0FBRyx1QkFBdUIsQ0FBQztJQUMvQyw2QkFBNkI7SUFDN0IsQ0FBQyxHQUFHO0lBQUMsSUFBSSxDQUFTO0lBRWxCLFdBQVcsR0FBRyxLQUFLLENBQUM7SUFFcEIsSUFBSSxhQUFhO1FBQ2IsT0FBTyxZQUFZLENBQUMsSUFBSSxDQUFDLE1BQU0sQ0FBQyxDQUFDO0lBQ3JDLENBQUM7SUFFRCxzQkFBc0I7UUFDbEIsSUFBSSxDQUFDLFdBQVcsR0FBRyxDQUFDLElBQUksQ0FBQyxXQUFXLENBQUM7SUFDekMsQ0FBQztJQUVELE1BQU07UUFDRix1Q0FBdUM7UUFDdkMsSUFBSSxJQUFJLENBQUMsSUFBSSxLQUFLLGVBQWU7WUFBRSxPQUFPLGFBQWEsQ0FBQztRQUN4RCxPQUFPLGtCQUFrQixDQUFDO0lBQzlCLENBQUM7Q0FDSiJ9