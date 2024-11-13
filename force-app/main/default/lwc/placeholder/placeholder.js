import { LightningElement, api } from 'lwc';
/** Static Resources. */
import BIKE_ASSETS_URL from '@salesforce/resourceUrl/bike_assets';
export default class Placeholder extends LightningElement {
    @api
    message;
    /** Url for bike logo. */
    logoUrl = `${BIKE_ASSETS_URL}/logo.svg`;
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoicGxhY2Vob2xkZXIuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyJwbGFjZWhvbGRlci50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQSxPQUFPLEVBQUUsZ0JBQWdCLEVBQUUsR0FBRyxFQUFFLE1BQU0sS0FBSyxDQUFDO0FBRTVDLHdCQUF3QjtBQUN4QixPQUFPLGVBQWUsTUFBTSxxQ0FBcUMsQ0FBQztBQUVsRSxNQUFNLENBQUMsT0FBTyxPQUFPLFdBQVksU0FBUSxnQkFBZ0I7SUFDckQsQ0FBQyxHQUFHO0lBQUMsT0FBTyxDQUFTO0lBRXJCLHlCQUF5QjtJQUN6QixPQUFPLEdBQUcsR0FBRyxlQUFlLFdBQVcsQ0FBQztDQUMzQyJ9