import { api, LightningElement } from 'lwc';
import IMAGE_URL from '@salesforce/resourceUrl/bike_assets';
const VIDEO = 'Video';
const IMAGE = 'Image';
/**
 * A Hero component that can display a Video or Image.
 */
export default class Hero extends LightningElement {
    @api
    title;
    @api
    slogan;
    @api
    buttonText;
    @api
    heroDetailsPosition;
    @api
    resourceUrl;
    @api
    imgOrVideo;
    @api
    internalResource;
    @api
    overlay;
    @api
    opacity;
    @api
    buttonClickProductOrFamilyName;
    get resUrl() {
        if (this.isImg) {
            if (this.internalResource) {
                return IMAGE_URL + this.resourceUrl;
            }
        }
        return this.resourceUrl;
    }
    get isVideo() {
        return this.imgOrVideo === VIDEO;
    }
    get isImg() {
        return this.imgOrVideo === IMAGE;
    }
    get isOverlay() {
        return this.overlay === 'true';
    }
    // Apply CSS Class depending upon what position to put the hero text block
    get heroDetailsPositionClass() {
        if (this.heroDetailsPosition === 'left') {
            return 'c-hero-center-left';
        }
        else if (this.heroDetailsPosition === 'right') {
            return 'c-hero-center-right';
        }
        return 'c-hero-center-default';
    }
    renderedCallback() {
        // Update the overlay with the opacity configured by the admin in builder
        const overlay = this.template.querySelector('div');
        if (overlay) {
            overlay.style.opacity = String(this.opacity / 10);
        }
    }
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiaGVyby5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbImhlcm8udHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUEsT0FBTyxFQUFFLEdBQUcsRUFBRSxnQkFBZ0IsRUFBRSxNQUFNLEtBQUssQ0FBQztBQUM1QyxPQUFPLFNBQVMsTUFBTSxxQ0FBcUMsQ0FBQztBQUU1RCxNQUFNLEtBQUssR0FBRyxPQUFPLENBQUM7QUFDdEIsTUFBTSxLQUFLLEdBQUcsT0FBTyxDQUFDO0FBRXRCOztHQUVHO0FBQ0gsTUFBTSxDQUFDLE9BQU8sT0FBTyxJQUFLLFNBQVEsZ0JBQWdCO0lBQzlDLENBQUMsR0FBRztJQUFDLEtBQUssQ0FBUztJQUNuQixDQUFDLEdBQUc7SUFBQyxNQUFNLENBQVM7SUFDcEIsQ0FBQyxHQUFHO0lBQUMsVUFBVSxDQUFTO0lBQ3hCLENBQUMsR0FBRztJQUFDLG1CQUFtQixDQUFTO0lBQ2pDLENBQUMsR0FBRztJQUFDLFdBQVcsQ0FBUztJQUN6QixDQUFDLEdBQUc7SUFBQyxVQUFVLENBQVM7SUFDeEIsQ0FBQyxHQUFHO0lBQUMsZ0JBQWdCLENBQVU7SUFDL0IsQ0FBQyxHQUFHO0lBQUMsT0FBTyxDQUFTO0lBQ3JCLENBQUMsR0FBRztJQUFDLE9BQU8sQ0FBUztJQUNyQixDQUFDLEdBQUc7SUFBQyw4QkFBOEIsQ0FBUztJQUU1QyxJQUFJLE1BQU07UUFDTixJQUFJLElBQUksQ0FBQyxLQUFLLEVBQUUsQ0FBQztZQUNiLElBQUksSUFBSSxDQUFDLGdCQUFnQixFQUFFLENBQUM7Z0JBQ3hCLE9BQU8sU0FBUyxHQUFHLElBQUksQ0FBQyxXQUFXLENBQUM7WUFDeEMsQ0FBQztRQUNMLENBQUM7UUFDRCxPQUFPLElBQUksQ0FBQyxXQUFXLENBQUM7SUFDNUIsQ0FBQztJQUVELElBQUksT0FBTztRQUNQLE9BQU8sSUFBSSxDQUFDLFVBQVUsS0FBSyxLQUFLLENBQUM7SUFDckMsQ0FBQztJQUVELElBQUksS0FBSztRQUNMLE9BQU8sSUFBSSxDQUFDLFVBQVUsS0FBSyxLQUFLLENBQUM7SUFDckMsQ0FBQztJQUVELElBQUksU0FBUztRQUNULE9BQU8sSUFBSSxDQUFDLE9BQU8sS0FBSyxNQUFNLENBQUM7SUFDbkMsQ0FBQztJQUVELDBFQUEwRTtJQUMxRSxJQUFJLHdCQUF3QjtRQUN4QixJQUFJLElBQUksQ0FBQyxtQkFBbUIsS0FBSyxNQUFNLEVBQUUsQ0FBQztZQUN0QyxPQUFPLG9CQUFvQixDQUFDO1FBQ2hDLENBQUM7YUFBTSxJQUFJLElBQUksQ0FBQyxtQkFBbUIsS0FBSyxPQUFPLEVBQUUsQ0FBQztZQUM5QyxPQUFPLHFCQUFxQixDQUFDO1FBQ2pDLENBQUM7UUFFRCxPQUFPLHVCQUF1QixDQUFDO0lBQ25DLENBQUM7SUFFRCxnQkFBZ0I7UUFDWix5RUFBeUU7UUFDekUsTUFBTSxPQUFPLEdBQUcsSUFBSSxDQUFDLFFBQVEsQ0FBQyxhQUFhLENBQUMsS0FBSyxDQUFDLENBQUM7UUFDbkQsSUFBSSxPQUFPLEVBQUUsQ0FBQztZQUNWLE9BQU8sQ0FBQyxLQUFLLENBQUMsT0FBTyxHQUFHLE1BQU0sQ0FBQyxJQUFJLENBQUMsT0FBTyxHQUFHLEVBQUUsQ0FBQyxDQUFDO1FBQ3RELENBQUM7SUFDTCxDQUFDO0NBQ0oifQ==