import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { LazyLoadEvent } from 'primeng/api';
import { Assessment, AssessmentControllerServiceProxy, ServiceProxy } from 'shared/service-proxies/service-proxies';

@Component({
  selector: 'app-assessment-inprogress',
  templateUrl: './assessment-inprogress.component.html',
  styleUrls: ['./assessment-inprogress.component.css']
})
export class AssessmentInprogressComponent implements OnInit {


  loading: boolean;
  totalRecords: number = 0;
  rows: number = 10;
  last: number;
  searchBy: any = {
    text: null,
    sector: null,
    status: null,
    mitigationAction: null,
    editedOn: null,
  };

  assesments: Assessment[];

  constructor(
    private router: Router,
    private serviceProxy: ServiceProxy,
    private assessmentProxy: AssessmentControllerServiceProxy,
    // private sectorProxy: CountryControllerServiceProxy,
    // private cdr: ChangeDetectorRef
  ) { }


  ngOnInit(): void { 
    let event: any = {};
    event.rows = this.rows;
    event.first = 0;

    this.loadgridData(event);
  }


  loadgridData = (event: LazyLoadEvent) => {
    let filterText = this.searchBy.text ? this.searchBy.text : '';
    let pageNumber = event.first === 0 || event.first === undefined ? 1 : (event.first / (event.rows === undefined ? 10 : event.rows)) + 1;
    this.rows = event.rows === undefined ? 10 : event.rows;
    console.log('event Date', event);

    this.assessmentProxy.assessmentInprogress(pageNumber,this.rows,filterText).subscribe(res => {
        this.assesments=res.items;
        this.totalRecords= res.meta.totalItems
      }
      )
  }

  onSearch() {

    let event: any = {};
    event.rows = this.rows;
    event.first = 0;

    this.loadgridData(event);
  }

  detail(assessment: Assessment) {
    console.log("climateactions", assessment)
    // this.router.navigate(['app/add-polocies'], {

    // queryParams: { id: climateactions.id ,flag:this.flag},


    // });

  }

}
