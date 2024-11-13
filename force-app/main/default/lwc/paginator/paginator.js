import { LightningElement, api } from 'lwc';
export default class Paginator extends LightningElement {
    /** The current page number. */
    @api
    pageNumber;
    /** The number of items on a page. */
    @api
    pageSize;
    /** The total number of items in the list. */
    @api
    totalItemCount;
    handlePrevious() {
        this.dispatchEvent(new CustomEvent('previous'));
    }
    handleNext() {
        this.dispatchEvent(new CustomEvent('next'));
    }
    get currentPageNumber() {
        return this.totalItemCount === 0 ? 0 : this.pageNumber;
    }
    get isNotFirstPage() {
        return this.pageNumber !== 1;
    }
    get isNotLastPage() {
        return this.pageNumber !== this.totalPages;
    }
    get totalPages() {
        return Math.ceil(this.totalItemCount / this.pageSize);
    }
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoicGFnaW5hdG9yLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsicGFnaW5hdG9yLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBLE9BQU8sRUFBRSxnQkFBZ0IsRUFBRSxHQUFHLEVBQUUsTUFBTSxLQUFLLENBQUM7QUFFNUMsTUFBTSxDQUFDLE9BQU8sT0FBTyxTQUFVLFNBQVEsZ0JBQWdCO0lBQ25ELCtCQUErQjtJQUMvQixDQUFDLEdBQUc7SUFBQyxVQUFVLENBQVM7SUFFeEIscUNBQXFDO0lBQ3JDLENBQUMsR0FBRztJQUFDLFFBQVEsQ0FBUztJQUV0Qiw2Q0FBNkM7SUFDN0MsQ0FBQyxHQUFHO0lBQUMsY0FBYyxDQUFTO0lBRTVCLGNBQWM7UUFDVixJQUFJLENBQUMsYUFBYSxDQUFDLElBQUksV0FBVyxDQUFDLFVBQVUsQ0FBQyxDQUFDLENBQUM7SUFDcEQsQ0FBQztJQUVELFVBQVU7UUFDTixJQUFJLENBQUMsYUFBYSxDQUFDLElBQUksV0FBVyxDQUFDLE1BQU0sQ0FBQyxDQUFDLENBQUM7SUFDaEQsQ0FBQztJQUVELElBQUksaUJBQWlCO1FBQ2pCLE9BQU8sSUFBSSxDQUFDLGNBQWMsS0FBSyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsSUFBSSxDQUFDLFVBQVUsQ0FBQztJQUMzRCxDQUFDO0lBRUQsSUFBSSxjQUFjO1FBQ2QsT0FBTyxJQUFJLENBQUMsVUFBVSxLQUFLLENBQUMsQ0FBQztJQUNqQyxDQUFDO0lBRUQsSUFBSSxhQUFhO1FBQ2IsT0FBTyxJQUFJLENBQUMsVUFBVSxLQUFLLElBQUksQ0FBQyxVQUFVLENBQUM7SUFDL0MsQ0FBQztJQUVELElBQUksVUFBVTtRQUNWLE9BQU8sSUFBSSxDQUFDLElBQUksQ0FBQyxJQUFJLENBQUMsY0FBYyxHQUFHLElBQUksQ0FBQyxRQUFRLENBQUMsQ0FBQztJQUMxRCxDQUFDO0NBQ0oifQ==