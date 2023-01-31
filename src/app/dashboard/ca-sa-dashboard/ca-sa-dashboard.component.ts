import { Component, OnInit } from '@angular/core';
import { LazyLoadEvent } from 'primeng/api';
import { Subscription } from 'rxjs';
import { ServiceProxy, } from 'shared/service-proxies/service-proxies';

@Component({
  selector: 'app-ca-sa-dashboard',
  templateUrl: './ca-sa-dashboard.component.html',
  styleUrls: ['./ca-sa-dashboard.component.css']
})

export class CASADashboardComponent implements OnInit {

  indtituteadmin: boolean = false;
  userType: string = "countryAdmin";
  countryAdmin: boolean = false;
  data: any;
  activeprojects1 = ["vv", "df", "d", "d"];
  loading: boolean;
  totalRecords: number = 0;
  rows: number = 10;
  last: number;
  event: any;
  chartOptions: any;
  searchBy: any = {
    sector: 0,
    ndc: 0,
    subndc: 0,
  };

  searchBy1: any = {
    sector: 0,
  }
  subscription: Subscription;
  public i: number = 0;
  public id: string = 'chart-container';
  public chartData: Object[];
  public marker: Object;
  public title: string;
  public items: any = [];
  data1: { labels: string[]; datasets: { label: string; data: number[]; fill: boolean; borderColor: string; }[]; };
  ind: number = 1;
  countryId = 1;
  sectorId: number = 1;
  proposedProjectsCount: number = 0;
  underConstructionCount: number = 0;
  operationalProjectsCount: number = 0;
  projectID: number = 0;
  ndcprojectset = new Map<string, number>();
  horizontalOptions: any;
  basicData: { labels: string[]; datasets: { label: string; backgroundColor: string; data: number[]; }[]; };
  basicOptions: any;
  project: number[] = [];
  projectemreduct: number[] = [];
  ndctotalemission: number[] = [];
  totalemission: number = 0;
  em: number[] = [];
  ndcname: string[] = [];
  totalem: number = 0;
  lineStylesData: any;
  total: number;
  num: number[] = [];
  emi: number[] = [];
  prnames: string[] = [];
  ndcprojectdetails: ndcdetails[] = [];
  datandc: ndcdetails;
  constructor(private serviceproxy: ServiceProxy) { }
  ndcids = new Set<number>();
  ndcem = new Map();
  data3: number[] = [];

  unconditionalValue: number;
  conditionalValue: number;

  activeprojects: activeproject[] = [];
  activeprojectson: activeproject[] = [];
  activeprojectsload: activeproject[] = [];
  ndcemMap = new Map();
  t: any = {};
  assessmentListId: number[] = new Array();
  yrGap: number;
  newYr: number;
  yrList: number[] = new Array();
  yrListGraph: string[] = new Array();
  postYrList: number[] = new Array();
  postresaultList: number[] = new Array();
  postIdLisst: number[] = new Array();
  ngOnInit(): void {
    this.onSearch1();
    //this.loadgridData1();
    this.basicOptions = {
      plugins: {
        legend: {
          labels: {
            color: '#495057'
          }
        }
      },
      scales: {
        x: {
          ticks: {
            color: '#495057'
          },
          grid: {
            color: '#ebedef'
          }
        },
        y: {
          ticks: {
            color: '#495057'
          },
          grid: {
            color: '#ebedef'
          }
        }
      }
    };



    
  }

  loadgridData = (event: LazyLoadEvent) => {
    console.log('event Date', event);
    this.loading = true;
    this.totalRecords = 0;

    let sectorId = this.searchBy1.sector ? this.searchBy1.sector.id : 0;
    let ndcId = this.searchBy.ndc ? this.searchBy.ndc.id : 0;
    let subNdcId = this.searchBy.subndc ? this.searchBy.subndc.id : 0;
    let projectApprovalStatusId = 1;
    console.log('ffsectorId', sectorId)
    console.log('fndcId', ndcId)
    console.log('fsubNdcId', subNdcId)
    let pageNumber =
      event.first === 0 || event.first === undefined
        ? 1
        : event.first / (event.rows === undefined ? 1 : event.rows) + 1;
    this.rows = event.rows === undefined ? 10 : event.rows;


    // if(this.activeprojects.length!=0){
    //   for(let em of this.activeprojects){
    //     this.emi.push(em.erarchievment + em.ertarget);
    //     this.prnames.push(em.name);
    //     console.log('ttttttttttttttttt1',em)
    //     console.log('ttttttttttttttttt2',this.emi)
    //   }
    // }  




  }

  onSearch() {
    let event: any = {};
    event.rows = this.rows;
    event.first = 0;

    this.loadgridData(event);
  }
  onsectorChange(event: any) {
    this.onSearch();
  }

  onsectorChange1(event: any) {
    this.onSearch();
  }
  onndcChange(event: any) {
    this.onSearch();
  }
  onsubndcChange(event: any) {
    this.onSearch();
  }

  onSearch1() {
    let event: any = {};
    event.rows = this.rows;
    event.first = 0;

    this.loadgridData1(event);
  }

  testoneeeaa() {
    // console.log('yr list..',this.yrList);
    // console.log('yr list..1111',this.yrList[0]);
    // console.log('total..',this.postYrList);
  }



  loadgridData1 = (event: LazyLoadEvent) => {
    console.log('event Date', event);
    this.loading = true;
    this.totalRecords = 0;

    let sectorId = this.searchBy1.sector ? this.searchBy.sector.id : 0;

    console.log('fsectorId', sectorId)

    let pageNumber =
      event.first === 0 || event.first === undefined
        ? 1
        : event.first / (event.rows === undefined ? 1 : event.rows) + 1;
    this.rows = event.rows === undefined ? 10 : event.rows;
    

  }


}

export interface activeproject {
  name: string,
  ertarget: number,
  targetyear: string,
  erarchievment: number,
  archivmentyear: string
};

export interface ndcdetails {
  name: string,
  cacount: number,

};
