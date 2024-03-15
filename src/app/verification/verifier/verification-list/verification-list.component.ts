import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { VerificationStatus } from 'app/Model/VerificationStatus.enum';
import { LazyLoadEvent } from 'primeng/api';
import { VerificationControllerServiceProxy } from 'shared/service-proxies/service-proxies';
import decode from 'jwt-decode';
import { AppService } from 'shared/AppService';

@Component({
  selector: 'app-verification-list',
  templateUrl: './verification-list.component.html',
  styleUrls: ['./verification-list.component.css']
})
export class VerificationListComponent implements OnInit {
  totalRecords: number;
  assessments: any[]
  rows: number
  loading: boolean

  searchBy: any = {
    status: null,
    text: null,
  };

  VerificationStatusEnum = VerificationStatus;

  verificationStatus: string[] = [
    VerificationStatus[VerificationStatus.Pending],
    VerificationStatus[VerificationStatus['Pre Assessment']],
    VerificationStatus[VerificationStatus['NC Recieved']],
    VerificationStatus[VerificationStatus['Initial Assessment']],
    VerificationStatus[VerificationStatus['Final Assessment']],
    VerificationStatus[VerificationStatus.Fail],
    VerificationStatus[VerificationStatus['Pass']],
  ];
  loggedUserRole: any;

  constructor(
    private verificationControllerServiceProxy: VerificationControllerServiceProxy,
    private router: Router,
    private appService: AppService
  ) { }

  ngOnInit(): void {
    this.loggedUserRole = this.appService.getLoggedUserRole();
  }

  loadgridData = (event: LazyLoadEvent) => {
    this.loading = true;
    this.totalRecords = 0;

    let statusId = this.searchBy.status
      ? Number(VerificationStatus[this.searchBy.status])
      : 0;
    let filtertext = this.searchBy.text ? this.searchBy.text : '';
    let pageNumber =
      event.first === 0 || event.first === undefined
        ? 1
        : event.first / (event.rows === undefined ? 1 : event.rows) + 1;
    this.rows = event.rows === undefined ? 10 : event.rows;
    let Active = 0;
    if (this.loggedUserRole === 'Sector Admin'){
      this.verificationControllerServiceProxy.getVRParameters(pageNumber, this.rows, statusId, filtertext)
      .subscribe(res => {
        this.assessments = res.items
        this.totalRecords = res.meta.totalItems
        this.loading = false
      })
    } else {
      this.verificationControllerServiceProxy
        .getVerifierParameters(pageNumber, this.rows, statusId, filtertext)
        .subscribe(res => {
          this.assessments = res.items
          this.totalRecords = res.meta.totalItems
          this.loading = false
        })
    }
    
  };

  onStatusChange($event: any) {
    this.onSearch();
  }

  onSearch() {
    let event: any = {};
    event.rows = this.rows;
    event.first = 0;

    this.loadgridData(event);
  }

  statusClick(event: any, object: any) {
    this.router.navigate(['app/verification/detail'], {
      queryParams: {
        id: object.id,
        verificationStatus: object.verificationStatus,
      },
    });
  }

}
