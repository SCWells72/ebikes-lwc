import { LightningElement, api } from 'lwc';
import { reduceErrors } from 'c/ldsUtils';
// @ts-expect-error Import of HTML template
import noDataIllustration from './templates/noDataIllustration.html';
// @ts-expect-error Import of HTML template
import inlineMessage from './templates/inlineMessage.html';

export default class ErrorPanel extends LightningElement {
    /** Single or array of LDS errors */
    @api errors: any;
    /** Generic / user-friendly message */
    @api friendlyMessage = 'Error retrieving data';
    /** Type of error message **/
    @api type: string;

    viewDetails = false;

    get errorMessages() {
        return reduceErrors(this.errors);
    }

    handleShowDetailsClick() {
        this.viewDetails = !this.viewDetails;
    }

    render() {
        // noinspection NonBlockStatementBodyJS
        if (this.type === 'inlineMessage') return inlineMessage;
        return noDataIllustration;
    }
}
