import { LightningElement, api } from 'lwc';
import { reduceErrors } from 'c/ldsUtils';
// @ts-expect-error Import of HTML template
import noDataIllustration from './templates/noDataIllustration.html';
// @ts-expect-error Import of HTML template
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZXJyb3JQYW5lbC5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbImVycm9yUGFuZWwudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUEsT0FBTyxFQUFFLGdCQUFnQixFQUFFLEdBQUcsRUFBRSxNQUFNLEtBQUssQ0FBQztBQUM1QyxPQUFPLEVBQUUsWUFBWSxFQUFFLE1BQU0sWUFBWSxDQUFDO0FBQzFDLDJDQUEyQztBQUMzQyxPQUFPLGtCQUFrQixNQUFNLHFDQUFxQyxDQUFDO0FBQ3JFLDJDQUEyQztBQUMzQyxPQUFPLGFBQWEsTUFBTSxnQ0FBZ0MsQ0FBQztBQUUzRCxNQUFNLENBQUMsT0FBTyxPQUFPLFVBQVcsU0FBUSxnQkFBZ0I7SUFDcEQsb0NBQW9DO0lBQ3BDLENBQUMsR0FBRztJQUFDLE1BQU0sQ0FBTTtJQUNqQixzQ0FBc0M7SUFDdEMsQ0FBQyxHQUFHO0lBQUMsZUFBZSxHQUFHLHVCQUF1QixDQUFDO0lBQy9DLDZCQUE2QjtJQUM3QixDQUFDLEdBQUc7SUFBQyxJQUFJLENBQVM7SUFFbEIsV0FBVyxHQUFHLEtBQUssQ0FBQztJQUVwQixJQUFJLGFBQWE7UUFDYixPQUFPLFlBQVksQ0FBQyxJQUFJLENBQUMsTUFBTSxDQUFDLENBQUM7SUFDckMsQ0FBQztJQUVELHNCQUFzQjtRQUNsQixJQUFJLENBQUMsV0FBVyxHQUFHLENBQUMsSUFBSSxDQUFDLFdBQVcsQ0FBQztJQUN6QyxDQUFDO0lBRUQsTUFBTTtRQUNGLHVDQUF1QztRQUN2QyxJQUFJLElBQUksQ0FBQyxJQUFJLEtBQUssZUFBZTtZQUFFLE9BQU8sYUFBYSxDQUFDO1FBQ3hELE9BQU8sa0JBQWtCLENBQUM7SUFDOUIsQ0FBQztDQUNKIn0=