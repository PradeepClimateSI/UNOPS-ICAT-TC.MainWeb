import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import * as moment from 'moment';
import { HttpClient } from '@angular/common/http';
import { DatePipe } from '@angular/common';
import { LazyLoadEvent } from 'primeng/api';
import decode from 'jwt-decode';
import {
  ServiceProxy,
  UserType,
} from 'shared/service-proxies/service-proxies';

import { Audit as audit, AuditControllerServiceProxy as auditControllerServiceProxy } from 'shared/service-proxies-auditlog/service-proxies'

@Component({
  selector: 'app-audit',
  templateUrl: './audit.component.html',
  styleUrls: ['./audit.component.css'],
})
export class AuditComponent implements OnInit {
  loading: boolean;
  totalRecords: number = 0;
  rows: number = 10;
  last: number;
  event: any;
  Date = new Date();
  searchText: string;
  status: string[] = [];
  activityList: string[] = [];
  userTypeList: string[] = [];
  userTypes: UserType[] = [];

 countryId:number;
 userType:string;

  searchBy: any = {
    text: null,
    usertype: null,
    activity: null,
    editedOn: null,
  };

  first = 0;
  activities: audit[];
  dateList: Date[] = [];
  institutionId: number;
  loggeduserType: any;

  constructor(
    private router: Router,
    private serviceProxy: ServiceProxy,
    private auditserviceproxy: auditControllerServiceProxy,
    private cdr: ChangeDetectorRef,
    private http: HttpClient
  ) { }
  ngAfterViewInit(): void {
    this.cdr.detectChanges();
  }

  async ngOnInit(): Promise<void> {

    const token = localStorage.getItem('ACCESS_TOKEN')!;
    const tokenPayload = decode<any>(token);
    const username = tokenPayload.usr;
    this.countryId = tokenPayload.countryId;
   this.userType = tokenPayload.role.code;
    const userTypeId = tokenPayload.role.id;

    let filters: string[] = [];
    filters.push('username||$eq||' + username);

    this.institutionId = tokenPayload.insId;
    this.loggeduserType = tokenPayload.role.name

    await this.serviceProxy.getManyBaseUserTypeControllerUserType(
      undefined,
      undefined,
      undefined,
      undefined,
      ['name,ASC'],
      undefined,
      1000,
      0,
      1,
      0
    ).subscribe((res) => {
      if (userTypeId == 1) {
        this.userTypes = res.data.filter((a) => (a.id == 1 || a.id == 2 || a.id == 3 || a.id == 5 || a.id == 6 || a.id == 7 || a.id == 8 || a.id == 9 || a.id == 11));
      }
      else if (userTypeId == 2) {
        this.userTypes = res.data.filter((a) => (a.id == 2));
      }
      else if (userTypeId == 3) {
        this.userTypes = res.data.filter((a) => (a.id == 2 || a.id == 3 || a.id == 5 || a.id == 6 || a.id == 7 || a.id == 8 || a.id == 9 || a.id == 11));
      }
      else if (userTypeId == 5) {
        this.userTypes = res.data.filter((a) => (a.id == 2 || a.id == 5 || a.id == 6 || a.id == 7 || a.id == 9 || a.id == 11));
      }
      else if (userTypeId == 6) {
        this.userTypes = res.data.filter((a) => (a.id == 2 || a.id == 6 || a.id == 7 || a.id == 8 || a.id == 9 || a.id == 11));
      }
      else if (userTypeId == 7) {
        this.userTypes = res.data.filter((a) => (a.id == 7));
      }
      else if (userTypeId == 8) {
        this.userTypes = res.data.filter((a) => (a.id == 8 || a.id == 9));
      }
      else if (userTypeId == 9) {
        this.userTypes = res.data.filter((a) => (a.id == 9));
      }
      else if (userTypeId == 10) {
        this.userTypes = res.data.filter((a) => (a.id == 1 || a.id == 2 || a.id == 3 || a.id == 5 || a.id == 6 || a.id == 7 || a.id == 8 || a.id == 9 || a.id == 10 || a.id == 11));
      }
      else if (userTypeId == 11) {
        this.userTypes = res.data.filter((a) => (a.id == 11));
      }
      else if (userTypeId == 12) {
        this.userTypes = res.data.filter((a) => (a.id == 12));
      }
      console.log(this.userTypes)
    });

  }

  onactivityChange(event: any) {
    this.onSearch();
  }
  ondateChange(event: any) {
    this.onSearch();
  }
  onUTChange(event: any) {
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


    let usertype = this.searchBy.usertype ? this.searchBy.usertype.name : '';
    let action = this.searchBy.activity ? this.searchBy.activity : '';
    let filtertext = this.searchBy.text ? this.searchBy.text : '';

    console.log(this.searchBy)
    if (this.searchBy.usertype) {
      let type = UserTypes.find(o => o.name === this.searchBy.usertype.name)
      if (type) {
        usertype = type.code
      } else {
        usertype = this.searchBy.usertype.name
      }
    }


    let editedOn = this.searchBy.editedOn
      ? moment(this.searchBy.editedOn).format('YYYY-MM-DD')
      : '';

    let pageNumber =
      event.first === 0 || event.first === undefined
        ? 1
        : event.first / (event.rows === undefined ? 1 : event.rows) + 1;
    this.rows = event.rows === undefined ? 10 : event.rows;

    setTimeout(() => {
      this.auditserviceproxy
        .getAuditDetailsCountry(
          pageNumber,
          this.rows,
          usertype,
          action,
          editedOn,
          filtertext,
          this.institutionId,
          this.countryId,
          this.loggeduserType
        )

        .subscribe((a) => {

          this.activities = a.items;

          this.totalRecords = a.meta.totalItems;
          this.loading = false;

          for (let d of a.items) {
            if (!this.status.includes(d.description)) {
              this.status.push(d.description);
            }

            if (!this.userTypeList.includes(d.userType)) {
              this.userTypeList.push(d.userType);
            }

          }
        });
    }, 1000);
  };

  getUserTypeName(code: string) {
    let type = UserTypes.find(o => o.code === code)
    if (type) {
      return type.name
    } else {
      return code
    }
  }
}

export enum UserTypesEnum {
  COUNTRY_ADMIN = "COUNTRY_ADMIN",
  COUNTRY_USER = "COUNTRY_USER",
  MASTER_ADMIN = "MASTER_ADMIN",
  EXTERNAL = "EXTERNAL"
}
export const UserTypes =  [
  {name: "Country Admin", code: UserTypesEnum.COUNTRY_ADMIN},
  {name: "Country User", code: UserTypesEnum.COUNTRY_USER},
  {name: "Master Admin", code: UserTypesEnum.MASTER_ADMIN},
  {name: "External", code: UserTypesEnum.EXTERNAL}
]
