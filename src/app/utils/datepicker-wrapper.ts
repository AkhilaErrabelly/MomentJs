import {Component,OnInit, AfterViewInit, Input, Output, EventEmitter} from '@angular/core';
import {DATEPICKER_DIRECTIVES, TimepickerComponent} from '../../ng2-bootstrap/ng2-bootstrap';
import {NgModel,NgIf, NgFor} from "@angular/common";
import {TimerWrapper} from '@angular/core/src/facade/async';

@Component({
    selector: 'datepicker-wrapper',
    template: '<datepicker [(ngModel)]="ngModel" > </datepicker>',
    directives: [DATEPICKER_DIRECTIVES, TimepickerComponent]
})

export class DatepickerWrapperComponent implements AfterViewInit{
    calendarClicked:boolean = false;
    jQuery: any;
    @Input() ngModel:any;
    @Output() ngModelChange: EventEmitter<any> = new EventEmitter<any>();

    constructor(){
      this.jQuery = $ || {};
      var comp = this;

      this.jQuery(document.body).click(function(event) {
        TimerWrapper.setTimeout(() => {
          if(comp.calendarClicked) {
            comp.calendarClicked = false;
          } else {
          }
        }, 100);
      });
    }

    ngAfterViewInit() {
      var comp = this;
      TimerWrapper.setTimeout(() => {
        this.jQuery('datepicker').parent().on('click', function() {
          comp.calendarClicked = true;
        });
        this.jQuery('.input-group-addon').on('click', function() {
          comp.calendarClicked = true;
        });
      }, 2000);

    }

    getFormattedDate(dt) {
      if(dt) {
        return (dt.getMonth() + 1) + '/' + dt.getDate() + '/' + dt.getFullYear();
      }
      return;
    }

    getTimeComponent(dateObj) {
      if(dateObj) {
        let hours = ('0' + dateObj.getHours()).slice(-2);
        let minutes = ('0' + dateObj.getMinutes()).slice(-2);
        let seconds = ('0' + dateObj.getSeconds()).slice(-2);
        return hours + ' : ' +  minutes + ' : ' + seconds;
      }
      return;
    }
}
