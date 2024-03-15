import {
  AfterViewInit,
  ChangeDetectorRef,
  Component,
  OnInit,
} from '@angular/core';
import { Router } from '@angular/router';
import { LazyLoadEvent } from 'primeng/api';
import {
  ClimateAction as Project,
  ProjectControllerServiceProxy,
  ProjectStatus,
  Sector,
  CountryControllerServiceProxy,
  ServiceProxy,
  User,
} from 'shared/service-proxies/service-proxies';
import decode from 'jwt-decode';


@Component({
  selector: 'app-accepted-policies',
  templateUrl: './accepted-policies.component.html',
  styleUrls: ['./accepted-policies.component.css']
})

export class AcceptedPoliciesComponent implements OnInit, AfterViewInit {
  climateactions: Project[];
  selectedClimateActions: Project[];
  climateaction: Project = new Project();
  relatedItems: Project[] = [];
  sectors: Sector[];
  sectorName: string[] = [];
  sector: Sector = new Sector();
  cols: any;
  columns: any;
  options: any;
  sectorList: Sector[] = [];
  projectStatusList: ProjectStatus[] = [];

  selectedSectorType: Sector;
  selectedstatustype: ProjectStatus;
  searchText: string;

  loading: boolean;
  totalRecords: number = 0;
  rows: number = 10;
  last: number;
  event: any;
  flag:number = 1;
  searchBy: any = {
    text: null,
    sector: null,
    status: null,
    mitigationAction: null,
    editedOn: null,
  };
  sectorId: number = 0;

  first = 0;
  userName: string;
  cities: { name: string; id: number }[] = [
    { name: 'test', id: 1 },
    { name: 'test 2', id: 2 },
  ];

  statusList: string[] = new Array();
  loggedUser: User;
  display: boolean = false;
  reason:string='';
  titleInDialog:string='';
  userRole:string='';

  constructor(
    private router: Router,
    private serviceProxy: ServiceProxy,
    private projectProxy: ProjectControllerServiceProxy,
    private sectorProxy: CountryControllerServiceProxy,
    private cdr: ChangeDetectorRef
  ) {}
  ngAfterViewInit(): void {
    this.cdr.detectChanges();
  }

  ngOnInit(): void {

    this.userName = localStorage.getItem('user_name')!;
    const token = localStorage.getItem('access_token')!;
    const currenyUser=decode<any>(token);
    this.userRole = currenyUser.roles.code;
    let filter1: string[] = [];
    filter1.push('username||$eq||' + this.userName);

    this.serviceProxy
      .getManyBaseUsersControllerUser(
        undefined,
        undefined,
        filter1,
        undefined,
        undefined,
        undefined,
        1000,
        0,
        0,
        0
      )
      .subscribe((res: any) => {
        this.loggedUser = res.data[0];
        
      });

    let event: any = {};
    event.rows = this.rows;
    event.first = 0;

    this.loadgridData(event);

    this.sectorProxy.getCountrySector(currenyUser.countryId).subscribe((res: any) => {
      this.sectorList =res;
    });


    this.serviceProxy
      .getManyBaseProjectStatusControllerProjectStatus(
        ['name'],
        undefined,
        undefined,
        undefined,
        ['name,ASC'],
        undefined,
        1000,
        0,
        0,
        0
      )
      .subscribe((res: any) => {
        this.projectStatusList = res.data;
      });

  }

  onMAChange(event: any) {
    this.onSearch();
  }

  onSectorChange(event: any) {
    this.onSearch();
  }

  onStatusChange(event: any) {
    this.onSearch();
  }
  onSearch() {
    let event: any = {};
    event.rows = this.rows;
    event.first = 0;

    this.loadgridData(event);
  }


 loadgridData = (event: LazyLoadEvent) => {
    let statusId = this.searchBy.status ? this.searchBy.status.id : 0;
    let currentProgress = this.searchBy.currentProgress ? this.searchBy.currentProgress : '';
    let projectApprovalStatusId = 1; 
    let filtertext = this.searchBy.text ? this.searchBy.text : '';
    let pageNumber =
      event.first === 0 || event.first === undefined
        ? 1
        : event.first / (event.rows === undefined ? 1 : event.rows) + 1;
    this.rows = event.rows === undefined ? 10 : event.rows;
    
    setTimeout(() => {
      this.projectProxy
        .getAllClimateActionList(pageNumber, this.rows, filtertext, statusId,projectApprovalStatusId,currentProgress,this.sectorId)
        .subscribe((a) => {
          this.climateactions = a.items;
          this.totalRecords = a.meta.totalItems;
          this.loading = false;
        });
    },1000);
   
  };
  addproject() {
    this.router.navigate(['/add-policies']);
  }


  detail(climateactions: Project) {
    this.router.navigate(['app/add-policies'], {
      
    queryParams: { id: climateactions.id ,flag:this.flag},
    
   
    });
    
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

  isLastPage(): boolean {
    return this.climateactions
      ? this.first === this.climateactions.length - this.rows
      : true;
  }

  isFirstPage(): boolean {
    return this.climateactions ? this.first === 0 : true;
  }

  search() {
    let a: any = {};
    a.rows = this.rows;
    a.first = 0;

  }

  removeFromString(arr: string[], str: string) {
    let escapedArr = arr.map((v) => escape(v));
    let regex = new RegExp(
      '(?:^|\\s)' + escapedArr.join('|') + '(?!\\S)',
      'gi'
    );
    return str.replace(regex, '');
  }

  showDialog(climateactions:any)
  {
   this.reason = "";
   this.titleInDialog=climateactions.climateActionName
    this.display = true;

  }
  hideDialog()
  {
    this.display = false;
  }

}
