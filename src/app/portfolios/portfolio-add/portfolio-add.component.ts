import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { MasterDataService } from 'app/shared/master-data.service';
import * as moment from 'moment';
import { LazyLoadEvent, MessageService } from 'primeng/api';
import { GetAssessmentDetailsDto, MethodologyAssessmentControllerServiceProxy, Portfolio, PortfolioControllerServiceProxy, Sector, SectorControllerServiceProxy } from 'shared/service-proxies/service-proxies';

@Component({
  selector: 'app-portfolio-add',
  templateUrl: './portfolio-add.component.html',
  styleUrls: ['./portfolio-add.component.css']
})
export class PortfolioAddComponent implements OnInit {

  sectorList: any[];
  totalRecords: number;
  rows: number = 10;
  filterText: any = '';
  searchSectors: string = '';
  type: string = '';
  currentDate = new Date()

  constructor(
    private methassess : MethodologyAssessmentControllerServiceProxy,
    private portfolioServiceProxy : PortfolioControllerServiceProxy,
    private messageService: MessageService,
    private router: Router,
    private route: ActivatedRoute,
    public masterDataService: MasterDataService,
    private sectorControllerServiceProxy: SectorControllerServiceProxy,
  ) { }

  portfolio : Portfolio = new Portfolio();
  tool : string;
  tools: string[];
  addLink: boolean = false;

  optionList = [
    { name: 'Yes' },
    { name: 'No' },
  ];

  assessList : any = []
  loading: boolean = true;
  statuses: any[];
  apporoachList : any[];
  interventionsList: any = [];
  selectedValues: any = [];
  select : any;
  dataObj : any = []
  lastId : any ;
  resultsList : any = []
  assessmentData :any =[]
  async ngOnInit(): Promise<void> {
    this.tool = 'PORTFOLIO';
    this.tools = ['PORTFOLIO', 'CARBON_MARKET', 'INVESTOR']
    this.sectorList = await this.sectorControllerServiceProxy.findAllSector().toPromise()
    await this.loadData({})
    this.addLink=false;
    
      this.portfolioServiceProxy.getLastID().subscribe(async (res: any) => {
        this.lastId = res[0].portfolioId;

        this.portfolio.portfolioId = this.getNext();
       });

      let req = new GetAssessmentDetailsDto()
      req.tools = this.tools;

       this.statuses = [
        { label: 'Ex-post', value: 'Ex-post' },
        { label: 'Ex-ante', value: 'Ex-ante' },
    ];
    // this.portfolio.date = this.currentDate.toLocaleDateString()
    console.log(this.portfolio.date)

    this.apporoachList = [
      { label: 'Direct', value: 'Direct' },
      { label: 'Indirect', value: 'Indirect' },
  ];
  }

  async loadData(event: LazyLoadEvent) {
    this.totalRecords = 0;

    let pageNumber = (event.first === 0 || event.first == undefined) ? 0 : event.first / (event.rows == undefined ? 1 : event.rows) + 1;
    this.rows = event.rows == undefined ? 10 : event.rows;

    let skip = pageNumber * this.rows;
    let res = await this.methassess.getResultPageData(skip, this.rows, this.filterText, this.searchSectors, this.type).toPromise()

    this.resultsList = res[0];
    this.totalRecords = res[1];
   
    if (this.resultsList){
      this.loading = false;
    }
  }

  onSearch(value: any, type: string) {
    if (type === 'SECTOR') {
      let secs = value.map((v: Sector) => v.id);
      this.searchSectors = secs.join(',');
    } else if (type === 'TYPE') {
      this.type = value;
    } else if (type === 'TEXT') {
      this.filterText = value.target.value ? value.target.value : '';
    }
    this.searchSectors ? this.searchSectors : '' ;
    if (!this.type || this.type === null) this.type = '';
    this.filterText ? this.filterText : '' ;
    this.loadData({});
  }


  getNext(){
    const lastNumber = parseInt(this.lastId.substr(6), 10);

    const nextNumber = lastNumber + 1;

    const paddedNumber = nextNumber.toString().padStart(3, '0');

    const nextId = "2023PT" + paddedNumber;

    return nextId;
  }

  sendData(){
  }

  save( data : any){

    data.portfolioId = this.portfolio.portfolioId
    data.date = this.currentDate

    if(this.selectedValues.length < 2){
      this.messageService.add({
        severity: 'error',
        summary: 'Warning',
        detail: 'Please select at least two assessments',
        closable: true,
      })
      return;
    }

    this.dataObj = {
      formData : data,
      tableData : this.selectedValues
    }

    this.portfolioServiceProxy.create(this.dataObj).subscribe(async (res: any) => {

        this.messageService.add({
          severity: 'success',
          summary: 'Success',
          detail: 'Portfolio created successfully',
          closable: true,
        })

        this.router.navigate(['app/portfolio-view'], { queryParams: { id: res } });

     },error => {
      this.messageService.add({
        severity: 'error',
        summary: 'Error',
        detail: 'Portfolio detail saving failed',
        closable: true,
      })
    }

     );
  }

  onInput(event: any, dt: any) {
    const value = event.target.value;
    dt.filterGlobal(value, 'contains');
  }

  onCheckboxChange(event: any, assessList: any) {
     if (event) {
      this.selectedValues.push(assessList);
    } else {
      const index = this.selectedValues.findIndex((item: any) => item === assessList);
      if (index !== -1) {
        this.selectedValues.splice(index, 1);
      }
    }
  }

  onChangePreviousAssessment(option:any){
    if(option === "Yes"){
      this.addLink = true;
    }
    if(option === "No"){
      this.addLink = false;
    }
  }


}
