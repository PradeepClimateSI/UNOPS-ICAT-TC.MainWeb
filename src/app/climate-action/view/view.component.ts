import {
  AfterViewInit,
  ChangeDetectorRef,
  Component,
  OnInit,
} from '@angular/core';
import { Router } from '@angular/router';
import * as moment from 'moment';
import { ConfirmationService, LazyLoadEvent ,MessageService} from 'primeng/api';
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
import { GuidanceVideoComponent } from 'app/guidance-video/guidance-video.component';
import { DialogService } from 'primeng/dynamicdialog';

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
  flag: number = 1;
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

  statusList: string[] = new Array();
  loggedUser: User;
  display: boolean = false;
  reason: string = '';
  titleInDialog: string = '';
  userRole: string = '';

  constructor(
    private router: Router,
    private confirmationService: ConfirmationService,
    private projectProxy: ProjectControllerServiceProxy,
    private sectorProxy: CountryControllerServiceProxy,
    private cdr: ChangeDetectorRef,
    protected dialogService: DialogService,
    private messageService: MessageService,
  ) { }
  ngAfterViewInit(): void {
    this.cdr.detectChanges();
  }


  ngOnInit(): void {

    this.userName = localStorage.getItem('user_name')!;
    const token = localStorage.getItem('ACCESS_TOKEN')!;
    const currenyUser = decode<any>(token);
    this.userRole = currenyUser.role.code;
    let filter1: string[] = [];
    filter1.push('username||$eq||' + this.userName);

    let event: any = {};
    event.rows = this.rows;
    event.first = 0;

    this.loadgridData(event);

    this.sectorProxy.getCountrySector(currenyUser.countryId).subscribe((res: any) => {
      this.sectorList = res;
    });

  }

  onMAChange(event: any) {
    this.onSearch();
  }

  onSectorChange(event: any) {
    this.onSearch();
  }

  watchVideo() {
    let ref = this.dialogService.open(GuidanceVideoComponent, {
      header: 'Guidance Video',
      width: '60%',
      contentStyle: { "overflow": "auto" },
      baseZIndex: 10000,
      data: {
        sourceName: 'Interventions',
      },
    });

    ref.onClose.subscribe(() => {

    })
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
    this.loading = true;
    this.totalRecords = 0;

    let sectorId = this.searchBy.sector ? this.searchBy.sector.id : 0;
    let statusId = this.searchBy.status ? this.searchBy.status.id : 0;
    let filtertext = this.searchBy.text ? this.searchBy.text : '';
    let mitTypeId = this.searchBy.mitigationAction
      ? this.searchBy.mitigationAction.id
      : 0;

    let editedOn = this.searchBy.editedOn
      ? moment(this.searchBy.editedOn).format('DD/MM/YYYY')
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
          this.climateactions = a.items.filter((obj: any) => obj !== null);
          this.totalRecords = a.meta.totalItems
          this.loading = false;
        }, err => { this.loading = false; });
    }, 1000);

  };
  addproject() {
    this.router.navigate(['/add-interventions']);
  }


  detail(climateactions: Project) {
    this.router.navigate(['app/add-interventions'], {

      queryParams: { id: climateactions.id, flag: this.flag },


    });

  }

  delete(climateactions: Project) {
    if(climateactions){
      this.confirmationService.confirm({
        message: 'Are you sure you want to delete the intervention?',
        header: 'Delete Confirmation',
        acceptIcon: 'icon-not-visible',
        rejectIcon: 'icon-not-visible',
        accept: () => {
         this.deleteIN(climateactions)
        },
        reject: () => {
        },
      });
    }
   
  }

  deleteIN(climateactions: Project){
    this.projectProxy.delete(climateactions.id)
    .subscribe((a) => {
      this.messageService.add({
        severity: 'success',
        summary: 'Success',
        detail: 'Interventions  is deleted successfully!',
        closable: true,
      });
      let event: any = {};
      event.rows = this.rows;
      event.first = 0;

      this.loadgridData(event);
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

  showDialog(climateactions: any) {
    this.reason = "";
    this.titleInDialog = climateactions.climateActionName;
    this.display = true;

  }
  hideDialog() {
    this.display = false;
  }

  onInput(event: any, dt: any) {
    const value = event.target.value;
    dt.filterGlobal(value, 'contains');
  }


}

