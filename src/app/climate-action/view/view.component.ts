import {
  AfterViewInit,
  ChangeDetectorRef,
  Component,
  OnInit,
} from '@angular/core';
import { Router } from '@angular/router';
import * as moment from 'moment';
import { LazyLoadEvent } from 'primeng/api';
// import { strictEqual } from 'assert';
import {
  // MitigationActionType,
  ClimateAction as Project,
  ProjectControllerServiceProxy,
  ProjectOwner,
  ProjectStatus,
  Sector,
  SectorControllerServiceProxy,
  CountryControllerServiceProxy,
  ServiceProxy,
  User,
  ProjectApprovalStatus,
} from 'shared/service-proxies/service-proxies';
import decode from 'jwt-decode';

@Component({
  selector: 'app-view',
  templateUrl: './view.component.html',
  styleUrls: ['./view.component.css']
})
export class ViewComponent implements OnInit, AfterViewInit {
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
  // sectorList: string[] = new Array();
  sectorList: Sector[] = [];
  projectStatusList: ProjectStatus[] = [];
  //mitigationActionList: MitigationActionType[] = [];

  selectedSectorType: Sector;
  //selectedMitigationType: MitigationActionType;
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

  first = 0;
  userName: string;
  cities: { name: string; id: number }[] = [
    { name: 'test', id: 1 },
    { name: 'test 2', id: 2 },
  ];

  // migrationActionList: string[] = new Array();
  statusList: string[] = new Array();
  // migrationAction: any;
  loggedUser: User;
  // products: { code: string; name: string }[] = [
  //   { code: 'test A', name: 'test 2' },
  //   { code: 'test B', name: 'test 3' },
  //   { code: 'test C', name: 'test 4' },
  // ];
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
    // this.totalRecords = 0;

    this.projectProxy.findAllPolicies().subscribe((res: any) => {
        // this.climateactions = res

      console.log("policyList : ", this.climateactions)

    });

    this.userName = localStorage.getItem('user_name')!;
    const token = localStorage.getItem('access_token')!;
    const currenyUser=decode<any>(token);
    this.userRole = currenyUser.roles[0];
    // this.userName = currenyUser.fname;
    console.log("currenyUser",this.userRole);
    console.log("this.userName...",this.userName);
    let filter1: string[] = [];
    filter1.push('username||$eq||' + this.userName);
    // lmFilter.push('LearningMaterial.isPublish||$eq||' + 1);

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
        console.log("this.loggedUser...",this.loggedUser);

      });


    // this.serviceProxy
    //   .getManyBaseProjectControllerProject(
    //     undefined,
    //     undefined,
    //     undefined,
    //     undefined,
    //     ['editedOn,DESC'],
    //     undefined,
    //     1000,
    //     0,
    //     0,
    //     0
    //   )
    //   .subscribe((res: any) => {
    //     this.climateactions = res.data;
    //     this.totalRecords = res.totalRecords;
    //     if (res.totalRecords !== null) {
    //       this.last = res.count;
    //     } else {
    //       this.last = 0;
    //     }

    //     console.log('climateactions', res.data);
    //     // for(let project of res.data){
    //     //   this.migrationActionList.push(project.migrationAction);
    //     //   console.log("111",this.migrationActionList)
    //     //   console.log("222",project.migrationAction)
    //     //   // console.log("M-action",project.migrationAction)
    //     // }
    //     // this.migrationActionList.map(this.climateaction)
    //   });
    let event: any = {};
    event.rows = this.rows;
    event.first = 0;

    this.loadgridData(event);

    this.sectorProxy.getCountrySector(currenyUser.countryId).subscribe((res: any) => {
      this.sectorList =res;
    });

    // this.serviceProxy
    //   .getManyBaseSectorControllerSector(
    //     ['name'],
    //     undefined,
    //     undefined,
    //     undefined,
    //     ['name,ASC'],
    //     undefined,
    //     1000,
    //     0,
    //     0,
    //     0
    //   )
    //   .subscribe((res: any) => {
    //     // for(let x of res.data){
    //     //   console.log("sectornames"+x)
    //     // }
    //     this.sectorList = res.data;
    //     console.log('sectorList', this.sectorList);
    //   });

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
        console.log('projectStatusList', res.data);
      });

    // this.serviceProxy
    //   .getManyBaseMitigationActionControllerMitigationActionType(
    //     ['name'],
    //     undefined,
    //     undefined,
    //     undefined,
    //     ['name,ASC'],
    //     undefined,
    //     1000,
    //     0,
    //     0,
    //     0
    //   )
    //   .subscribe((res: any) => {
    //     this.mitigationActionList = res.data;
    //     console.log('mitigationList', this.mitigationActionList);
    //   });
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

  // /////////////////////////////////////////////

  loadgridData = (event: LazyLoadEvent) => {
    console.log('event Date', event);
    this.loading = true;
    this.totalRecords = 0;

    let sectorId = this.searchBy.sector ? this.searchBy.sector.id : 0;
    let statusId = this.searchBy.status ? this.searchBy.status.id : 0;
    let filtertext = this.searchBy.text ? this.searchBy.text : '';
    let mitTypeId = this.searchBy.mitigationAction
      ? this.searchBy.mitigationAction.id
      : 0;

    let editedOn = this.searchBy.editedOn
      ? moment(this.searchBy.editedOn).format('YYYY-MM-DD')
      : '';

    let pageNumber =
      event.first === 0 || event.first === undefined
        ? 1
        : event.first / (event.rows === undefined ? 1 : event.rows) + 1;
    this.rows = event.rows === undefined ? 10 : event.rows;
    setTimeout(() => {
      this.projectProxy
        .getAllClimateActionList(
          pageNumber,
          this.rows,
          filtertext,
          statusId,
          0,
          0,
          sectorId,

        )

        .subscribe((a) => {
          console.log( a," this.climateactions")
         this.climateactions = a.items
           this.totalRecords=a.meta.totalItems
          this.loading = false;
        }, err => {this.loading = false;});
    }, 1000);

  };
  addproject() {
    this.router.navigate(['/add-polocies']);
  }


  detail(climateactions: Project) {
    console.log("climateactions",climateactions )
    this.router.navigate(['/add-polocies'], {

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

    // this.onClimateActionStatusChange(a);
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

  onInput(event: any, dt: any) {
    const value = event.target.value;
    console.log("aaa",value)
    dt.filterGlobal(value, 'contains');
  }


}

