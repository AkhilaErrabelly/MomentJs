import {Component, Input, Output, EventEmitter, OnInit} from "@angular/core";
import {NgModel,NgIf, NgFor, NgClass,FORM_DIRECTIVES, ControlValueAccessor} from "@angular/common";

@Component({
  selector:'ng-pagination',
  styleUrls :['./app/outreach/outreach.css'],
  directives: [FORM_DIRECTIVES, NgIf, NgFor, NgClass],
  template:`
              <ul class="pagination">
                  <li  *ngIf="previousItemValid && firstText" (click)="firstPage()"><a [innerHTML]="firstText">First</a></li>
                  <li > <a *ngIf="previousItemValid" (click)="previousPage(previousItem)" aria-label="Previous"> <span aria-hidden="true">&laquo;</span> </a> </li>
                  <li  *ngFor="let pageNo of pageList" [ngClass]="{'active':seletedPage == pageNo}">
                      <a (click)="setCurrentPage(pageNo)">{{pageNo}}</a>
                  </li>
                  <li > <a  *ngIf="nextItemValid" (click)="nextPage(nextItem)" aria-label="Next"> <span aria-hidden="true">&raquo;</span> </a> </li>
                  <li ><a *ngIf="nextItemValid && lastText" (click)="lastPage()" [innerHTML]="lastText" >Last</a></li>
                </ul>

`
})
export class PaginationDirective implements OnInit{
  @Input("previous-text") previousText:string;
  @Input("next-text") nextText:string;
  @Input("first-text") firstText:string;
  @Input("last-text") lastText:string;
  @Input("maxSize") pageSize:number;
  @Input("boundaryLinks") boundaryLinks:boolean;
  @Output("pageChanged") pageChanged = new EventEmitter();
  @Input() currentPage:number;
  @Output() currentPageChange: EventEmitter<number> = new EventEmitter<number>();

  _totalItems: number;
  @Input()
  set totalItems(totalItems: number) {
   this._totalItems = totalItems;
   this.doPaging()
  }
  get totalItems() { return this._totalItems; }

  pageList:Array<number> = [];
  private onChange: Function;
  private onTouched: Function;
  private seletedPage: number;
  private nextItem: number;
  private previousItem: number;
  private nextItemValid: boolean;
  private previousItemValid: boolean;

  constructor() {
    //this.pageChangedNgModel.valueAccessor = this;

  }
  ngOnInit() {
    this.doPaging();
  }
  doPaging() {
     this.pageList = [];
     var i,count;
     this.seletedPage = this.currentPage;
     var remaining = this._totalItems % this.pageSize;
    var totalSize =((this._totalItems-remaining) / this.pageSize)+(remaining ===0 ? 0 : 1);
    var startingPageNo = (this.currentPage % this.pageSize) === 0 ? (this.currentPage - this.pageSize + 1): this.currentPage - (this.currentPage % this.pageSize) + 1;
    for (i = startingPageNo, count=0; i<= totalSize && count<this.pageSize; i++, count++) {
      this.pageList.push(i);
    }
    //next validation
    if(i-1<totalSize) {
      this.nextItemValid = true;
      this.nextItem = i;
    }else {
      this.nextItemValid = false;
    }
    //previous validation
    if((this.currentPage) >1) {
      this.previousItemValid = true;
      this.previousItem = (startingPageNo)-1;
    }else {
      this.previousItemValid = false;
    }

    if(this.currentPage > 10) {
      this.previousItem = this.currentPage;
    }
  }
  setCurrentPage(pageNo) {
    this.seletedPage = pageNo;
    this.currentPage = pageNo;
    this.currentPageChange.emit(this.currentPage);
    this.pageChageListner();
  }
  firstPage() {
     this.currentPage = 1;
     this.currentPageChange.emit(this.currentPage);
    //this.pageChangedNgModel.viewToModelUpdate(1);
    this.pageChageListner();
    this.doPaging()
  }
  lastPage() {
    var totalPages = (this._totalItems / this.pageSize);
    var lastPage = (totalPages) - (totalPages % this.pageSize === 0 ? this.pageSize : totalPages % this.pageSize)+1;
     this.currentPage = lastPage;
     this.currentPageChange.emit(this.currentPage);
    //this.pageChangedNgModel.viewToModelUpdate(lastPage);
    this.pageChageListner();
    this.doPaging()
  }
  nextPage(pageNo) {
    this.currentPage = pageNo;
    this.currentPageChange.emit(this.currentPage);
    //this.pageChangedNgModel.viewToModelUpdate(pageNo);
    this.pageChageListner();
    this.doPaging()
  }
  previousPage(pageNo) {
    var temp = pageNo - this.pageSize;
    this.currentPage = temp > 0 ?temp: 1;
    this.currentPageChange.emit(this.currentPage);
    //this.pageChangedNgModel.viewToModelUpdate(this.currentPage);
    this.pageChageListner();
    this.doPaging();
  }
  writeValue(value: string): void {
        if (!value) return;
        this.setValue(value);
    }

    registerOnChange(fn: (_: any) => {}): void {
        this.onChange = fn;
    }

    registerOnTouched(fn: (_: any) => {}): void {
        this.onTouched = fn;
    }
  setValue(currentValue){
    this.currentPage = currentValue;
    this.currentPageChange.emit(this.currentPage);
  }
  pageChageListner() {
    this.pageChanged.emit({
      itemsPerPage: this.currentPage
    })
  }
}
