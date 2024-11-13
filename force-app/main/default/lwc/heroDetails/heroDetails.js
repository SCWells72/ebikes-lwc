import { LightningElement, api, wire } from 'lwc';
import getRecordInfo from '@salesforce/apex/ProductRecordInfoController.getRecordInfo';
/**
 * Details component that is on top of the video.
 */
export default class HeroDetails extends LightningElement {
    @api
    title = 'Hero Details'; // Default title to comply with accessibility
    @api
    slogan;
    @api
    recordName;
    recordInfoData;
    hrefUrl;
    @wire(getRecordInfo, { productOrFamilyName: '$recordName' })
    recordInfo({ error, data }) {
        this.recordInfoData = { error, data };
        // Temporary workaround so that clicking on button navigates every time
        if (!error && data) {
            if (data[1] === 'Product__c') {
                this.hrefUrl = `product/${data[0]}`;
            }
            else {
                this.hrefUrl = `detail/${data[0]}`;
            }
        }
    }
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiaGVyb0RldGFpbHMuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyJoZXJvRGV0YWlscy50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQSxPQUFPLEVBQUUsZ0JBQWdCLEVBQUUsR0FBRyxFQUFFLElBQUksRUFBRSxNQUFNLEtBQUssQ0FBQztBQUNsRCxPQUFPLGFBQWEsTUFBTSw0REFBNEQsQ0FBQztBQUV2Rjs7R0FFRztBQUNILE1BQU0sQ0FBQyxPQUFPLE9BQU8sV0FBWSxTQUFRLGdCQUFnQjtJQUNyRCxDQUFDLEdBQUc7SUFBQyxLQUFLLEdBQUcsY0FBYyxDQUFDLENBQUMsNkNBQTZDO0lBQzFFLENBQUMsR0FBRztJQUFDLE1BQU0sQ0FBUztJQUNwQixDQUFDLEdBQUc7SUFBQyxVQUFVLENBQVM7SUFFeEIsY0FBYyxDQUF1QjtJQUNyQyxPQUFPLENBQVM7SUFFaEIsQ0FBQyxJQUFJLENBQUMsYUFBYSxFQUFFLEVBQUUsbUJBQW1CLEVBQUUsYUFBYSxFQUFFLENBQUM7SUFDNUQsVUFBVSxDQUFDLEVBQUUsS0FBSyxFQUFFLElBQUksRUFBRTtRQUN0QixJQUFJLENBQUMsY0FBYyxHQUFHLEVBQUUsS0FBSyxFQUFFLElBQUksRUFBRSxDQUFDO1FBQ3RDLHVFQUF1RTtRQUN2RSxJQUFJLENBQUMsS0FBSyxJQUFJLElBQUksRUFBRSxDQUFDO1lBQ2pCLElBQUksSUFBSSxDQUFDLENBQUMsQ0FBQyxLQUFLLFlBQVksRUFBRSxDQUFDO2dCQUMzQixJQUFJLENBQUMsT0FBTyxHQUFHLFdBQVcsSUFBSSxDQUFDLENBQUMsQ0FBQyxFQUFFLENBQUM7WUFDeEMsQ0FBQztpQkFBTSxDQUFDO2dCQUNKLElBQUksQ0FBQyxPQUFPLEdBQUcsVUFBVSxJQUFJLENBQUMsQ0FBQyxDQUFDLEVBQUUsQ0FBQztZQUN2QyxDQUFDO1FBQ0wsQ0FBQztJQUNMLENBQUM7Q0FDSiJ9