import { ChangeDetectorRef, Component, OnInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { LazyLoadEvent } from 'primeng/api';
import { Table } from 'primeng/table';
import { AssessmentControllerServiceProxy, ClimateAction, ParameterRequestControllerServiceProxy, } from 'shared/service-proxies/service-proxies';
@Component({
  selector: 'app-managedatastatus',
  templateUrl: './managedatastatus.component.html',
  styleUrls: ['./managedatastatus.component.css']
})
export class ManagedatastatusComponent implements OnInit {

  projectApprovalStatusId: number = 1;
  searchText: string;
  countryId: any = 0;

  projects: ClimateAction[];

  loading: boolean;
  totalRecords: number = 0;
  rows: number = 10;
  last: number;
  event: any;

  searchBy: any = {
    text: null,
  };

  first = 0;
  sectorId: number = 1;


  constructor(
    private assessmentProxy: AssessmentControllerServiceProxy,
    private parameterProxy: ParameterRequestControllerServiceProxy,
    private cdr: ChangeDetectorRef,
    private router: Router,) { }
  ngAfterViewInit(): void {
    this.cdr.detectChanges();
  }
  @ViewChild("dt") table: Table;
  activeprojects: activeproject[] = [];
  activeprojectson: activeproject[] = [];
  activeprojectsload: activeproject[] = [];

  datarequests: datarequest[] = [];
  datarequests1: datarequest;
  asseYearId: any;
  alldatarequests: any;


  ngOnInit() {

  }





  onSearch() {
    let event: any = {};
    event.rows = this.rows;
    event.first = 0;

    this.loadgridData(event);
  }

  directToApprovePage(datarequests: any) {
    let assenmentYearId = datarequests.assenmentYearId
    this.router.navigate(['/app/app-approve-data'], {
      queryParams: { id: assenmentYearId },
    });
  }

  loadgridData(event: LazyLoadEvent) {


    this.loading = true;

    let filterText = this.searchBy.text ? this.searchBy.text : '';
    let projectStatusId = 0;

    this.countryId = 0;
    let pageNumber =
      event.first === 0 || event.first === undefined
        ? 1
        : (event.first / (event.rows === undefined ? 10 : event.rows)) + 1;
    this.rows = event.rows === undefined ? 10 : event.rows;

    this.assessmentProxy.assessmentYearForManageDataStatus(
      pageNumber,
      this.rows,
      filterText,
      projectStatusId,
      this.projectApprovalStatusId,
      0).subscribe(res => {
        this.loading = false;
        this.totalRecords = res.meta.totalItems;
        this.datarequests = [];
        for (let assessment of res.items) {
          let datarequests1: datarequest = {
            name: "",
            tool: "",
            type: '',
            year: "",
            assenmentYearId: 0,
            totalreqCount: 0,
            pendingreqCount: 0,
            pendingdataentries: 0,
            recieved: 0,
            qaStatus: 0
          };
          datarequests1.name = assessment.climateAction.policyName;
          datarequests1.tool = assessment.tool;
          datarequests1.year = assessment.assessmentYear ? assessment.year : "";
          datarequests1.type = assessment.assessmentType;
          datarequests1.assenmentYearId = assessment.id;
          this.parameterProxy
            .getDateRequestToManageDataStatus(assessment.id, 1, assessment.tool)
            .subscribe(re => {
              datarequests1.totalreqCount = re.length;

              for (let dr of re) {
                if (dr.dr_dataRequestStatus == -1 || dr.dr_dataRequestStatus == 1 || dr.dr_dataRequestStatus == 2) {
                  ++datarequests1.pendingreqCount;
                }
                if (dr.dr_dataRequestStatus == 3 || dr.dr_dataRequestStatus == -9 || dr.dr_dataRequestStatus == 4
                  || dr.dr_dataRequestStatus == 5 || dr.dr_dataRequestStatus == 6 || dr.dr_dataRequestStatus == -6 || dr.dr_dataRequestStatus == -8) {
                  ++datarequests1.pendingdataentries;
                }
                if (dr.dr_dataRequestStatus == 9 || dr.dr_dataRequestStatus == 8 || dr.dr_dataRequestStatus == 9 || dr.dr_dataRequestStatus == 11) {
                  ++datarequests1.recieved;
                }
              }
            })

          this.datarequests.push(datarequests1);
        }
      })

  }
  next() {
    this.first = this.first + this.rows;
  }

  prev() {
    this.first = this.first - this.rows;
  }

  reset() {
    this.first = 0;
  }


  status() { }

}

export interface activeproject {
  name: string,
  ertarget: number,
  targetyear: string,
  erarchievment: number,
  archivmentyear: string
};

export interface datarequest {
  name: string,
  tool: string,
  type: string,
  year: string,
  assenmentYearId: number,
  totalreqCount: number,
  pendingreqCount: number,
  pendingdataentries: number,
  recieved: number,
  qaStatus: number
};
