import { AfterViewInit, ChangeDetectorRef, Component, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import {  ServiceProxy } from 'shared/service-proxies/service-proxies';

@Component({
  selector: 'app-loard-more',
  templateUrl: './loard-more.component.html',
  styleUrls: ['./loard-more.component.css']
})
export class LoardMoreComponent implements OnInit, AfterViewInit  {



reportObject : any[] = [];
preportObject : any[] = [];


totalRecords: number = 0;
rows: number = 6; 
first = 0;

obj = {
  image:'',
  thumbImage:'',
  title: '',
  description: '',
  savedLocation:'',
};

@ViewChild('op') overlay: any;
  constructor(
    private router: Router,
    private serviceProxy: ServiceProxy,
    
    private cdr: ChangeDetectorRef,
    private route: ActivatedRoute,

  ) { }

  ngAfterViewInit(): void {
    this.cdr.detectChanges();
  }

  ngOnInit(): void {

    let reportFilter: string[] = [];
    reportFilter.push('Report.isPublish||$eq||'+1); 
          


  }


  onPageChange(event :any)
  {
    this.first = event.first; 
     this.rows = event.rows;  
        this.preportObject = [];
      for(let x = this.first; x< (this.first+this.rows); x++)
      {
        this.preportObject.push(this.reportObject[x]);
      }
  }

  viewPdf(obj:any)
{
  window.location.href = obj.savedLocation;
}

}
