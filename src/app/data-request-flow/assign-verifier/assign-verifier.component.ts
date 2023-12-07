import { Component, OnInit } from '@angular/core';
import { VerificationStatus } from 'app/Model/VerificationStatus.enum';
import * as moment from 'moment';
import { LazyLoadEvent, MessageService } from 'primeng/api';
import { Assessment, AssessmentControllerServiceProxy, DataVerifierDto, MethodologyAssessmentControllerServiceProxy, UsersControllerServiceProxy } from 'shared/service-proxies/service-proxies';

@Component({
  selector: 'app-assign-verifier',
  templateUrl: './assign-verifier.component.html',
  styleUrls: ['./assign-verifier.component.css']
})
export class AssignVerifierComponent implements OnInit {
  VerificationStatusEnum = VerificationStatus;
  verificationStatus: string[] = [
  ];
  assesMentYearId: number = 0;
  assessment: Assessment = new Assessment();
  parameters: any[] = [];
  loading: boolean = false;
  confirm1: boolean;
  userList: any[] = [];
  selectedUser: any;
  selectedDeadline: Date;
  reasonForReject: string;
  minDate: Date;
  selectedParameters: any[] = [];
  totalRecords: number = 0;
  rows: number = 10;
  last: number;
  searchBy: any = {
    text: null,
    status: null,
  };

  constructor(
    private assesmentProxy: AssessmentControllerServiceProxy,
    private MethodologyAssessmentControllerServiceProxy: MethodologyAssessmentControllerServiceProxy,
    private messageService: MessageService,
    private usersControllerServiceProxy: UsersControllerServiceProxy
  ) {}

  ngOnInit(): void {
    let event: any = {};
    event.rows = this.rows;
    event.first = 0;

    this.usersControllerServiceProxy
      .allUserDetails(1, 1000, '', 2)
      .subscribe((res: any) => {
        this.userList = res.items;
        this.totalRecords = res.totalRecords;
      });
  }
  onSearch() {
    let event: any = {};
    event.rows = this.rows;
    event.first = 0;

    this.loadgridData(event);
  }
  onStatusChange($event: any) {
    this.onSearch();
  }
  loadgridData = (event: LazyLoadEvent) => {
    this.loading = true;
    this.totalRecords = 0;

    let pageNumber =
      event.first === 0 || event.first === undefined
        ? 1
        : event.first / (event.rows === undefined ? 1 : event.rows) + 1;
    this.rows = event.rows === undefined ? 10 : event.rows;

    let statusId = this.searchBy.status
      ? Number(VerificationStatus[this.searchBy.status])
      : 0;

    let filtertext = this.searchBy.text ? this.searchBy.text : '';
      this.MethodologyAssessmentControllerServiceProxy
        .getAssessmentForAssignVerifier(
          pageNumber,
          this.rows,
          statusId,
          filtertext
        )
        .subscribe((a) => {
          if (a) {
            this.parameters = a.items;
            this.totalRecords = a.meta.totalItems;
            const uniqueStatus = [
              ...new Set(a.items.map((obj: any) => obj.verificationStatus)),
            ];
            this.verificationStatus = [];
            uniqueStatus.forEach((element) => {
              this.verificationStatus.push(
                this.VerificationStatusEnum[Number(element)]
              );
            });
          }
          this.loading = false;
        }, error => {
          this.loading = false;
        });
  };

  onAcceptClick() {
    if (this.selectedParameters.length > 0) {
      this.confirm1 = true;
    }
  }

  onAcceptConfirm() {
    let idList = new Array<number>();
    for (let index = 0; index < this.selectedParameters.length; index++) {
      const element = this.selectedParameters[index];
      idList.push(element.id);
    }

    let inputParameters = new DataVerifierDto();
    inputParameters.ids = idList;
    inputParameters.userId = this.selectedUser?.id;
    inputParameters.deadline = moment(this.selectedDeadline);
    this.MethodologyAssessmentControllerServiceProxy.updateAssignVerifiers(inputParameters).subscribe(
      (res) => {
        this.messageService.add({
          severity: 'success',
          summary: 'Success',
          detail: 'Data verifiers asssigned successfully',
        });
        this.selectedParameters = [];
        this.selectedUser = '';
        this.onSearch();
      },
      (err) => {
        this.messageService.add({
          severity: 'error',
          summary: 'Error.',
          detail: 'Can not Assign Data verifiers, please try again.',
        });
      }
    );
    this.confirm1 = false;
  }

  onCancelConfirm() {
    this.confirm1 = false;
  }
}
