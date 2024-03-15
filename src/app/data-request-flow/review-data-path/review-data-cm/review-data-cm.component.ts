import { Component, Input, OnInit } from '@angular/core';
import * as moment from 'moment';
import { ConfirmationService, LazyLoadEvent, MessageService } from 'primeng/api';
import { ParameterRequestControllerServiceProxy, ParameterRequestTool, ServiceProxy, UpdateDeadlineDto, UpdateDeadlineDtoTool, User, UsersControllerServiceProxy } from 'shared/service-proxies/service-proxies';
import decode from 'jwt-decode';
import { DataRequestPathService } from 'app/shared/data-request-path.service';

@Component({
  selector: 'app-review-data-cm',
  templateUrl: './review-data-cm.component.html',
  styleUrls: ['./review-data-cm.component.css']
})
export class ReviewDataCmComponent implements OnInit {

  @Input() tool: string
  loading: boolean;
  totalRecords: number;  
  searchBy: any = {
    text: null,
    year: null,
    climateaction: null,
    institution: null,
  };
  rows: number;
  userCountryId: any;
  userSectorId: any;
  minDate: Date;
  userName: any;
  dataRequestList: any;  
  selectedParameters: any[];
  confirm1: boolean;
  userList: User[];
  selectedUser: User;
  selectedDeadline: Date;
  reasonForReject: string;
  assignCAArray: any = []
  climateactionsList: any = []
  assessmentType: string[] = ['Ex-ante','Ex-post'];

  constructor(
    private parameterRequestControllerServiceProxy: ParameterRequestControllerServiceProxy,
    private serviceProxy: ServiceProxy,
    private messageService: MessageService,
    private usersControllerServiceProxy: UsersControllerServiceProxy,
    private confirmationService: ConfirmationService,
    public dataRequestPathService: DataRequestPathService
  ) { }

  async ngOnInit(): Promise<void> {
    const token = localStorage.getItem('ACCESS_TOKEN')!;
    const tokenPayload = decode<any>(token);
    this.userCountryId  = tokenPayload.countryId;
    this.userSectorId = tokenPayload.sectorId;
    this.minDate = new Date();

    this.userName = tokenPayload.username;


    this.userList = await this.usersControllerServiceProxy.usersByInstitution(1, 1000, '', 9, this.userName).toPromise()

    this.parameterRequestControllerServiceProxy
      .getReviewDataRequests(
        0,
        0,
        '',
        0,
        '',
        '',
        this.userName,
        ParameterRequestTool.Carbon_Market_Tool.toString(),
        "1234"
      )
      .subscribe((res: any) => {
        for (let a of res.items) {
          if (a.cmAssessmentAnswer.CMAssessmentQuestion.assessment !== null) {

            if (
              !this.assignCAArray.includes(
                a.cmAssessmentAnswer.CMAssessmentQuestion.assessment.climateAction.policyName
              )
            ) {

              this.assignCAArray.push(
                a.cmAssessmentAnswer.CMAssessmentQuestion.assessment.climateAction.policyName
              );
              this.climateactionsList.push(
                a.cmAssessmentAnswer.CMAssessmentQuestion.assessment.climateAction
              );
            }
          }
        }
      });
  
  }

  loadgridData = (event: LazyLoadEvent) => {
    this.loading = true;
    this.totalRecords = 0;

    let climateActionId = this.searchBy.climateaction
      ? this.searchBy.climateaction.id
      : 0;
    let institutionId = this.searchBy.institution
      ? this.searchBy.institution.id
      : 0;
    let year = this.searchBy.year ? this.searchBy.year.assessmentYear : '';
    let type = this.searchBy.type ? this.searchBy.type : '';
    let filtertext = this.searchBy.text ? this.searchBy.text : '';

    let editedOn = this.searchBy.editedOn
      ? moment(this.searchBy.editedOn).format('DD/MM/YYYY')
      : '';

    let pageNumber =
      event.first === 0 || event.first === undefined
        ? 1
        : event.first / (event.rows === undefined ? 1 : event.rows) + 1;
    this.rows = event.rows === undefined ? 10 : event.rows;
    setTimeout(() => {
      this.parameterRequestControllerServiceProxy
        .getReviewDataRequests(
          pageNumber,
          this.rows,
          filtertext,
          climateActionId,
          year,
          type,
          this.userName,
          ParameterRequestTool.Carbon_Market_Tool.toString(),
          "1234"
        )
        .subscribe(async (a) => {
          if (a) {
            this.dataRequestList = a.items;
            this.totalRecords = a.meta.totalItems;
            this.dataRequestList = await Promise.all(this.dataRequestList.map(async (req: any) => {
              let userId = req.UserDataEntry
              if (userId){
                let user = await this.serviceProxy.getOneBaseUsersControllerUser(userId, undefined, undefined, 0).toPromise()
                req['user'] = user
              } 
              return req
            }))
          }
          this.loading = false;
        });
    }, 1);
  };

  onSearchClick(event: any) {
    this.onSearch();
  }

  onCAChange(event: any) {
    this.onSearch();
  }

  onYearChange(event: any) {
    this.onSearch();
  }


  getInfo(obj: any)
  {
  }

  onAcceptClick() {
    if (this.selectedParameters) {
      
      this.confirmationService.confirm({
        message: 'Are you sure you want to accept all the selected parameters?',
        accept: () => {
          let idList = new Array<number>();
          for (let index = 0; index < this.selectedParameters.length; index++) {
            const element = this.selectedParameters[index];
            idList.push(element.id);
          }

          let inputParameters = new UpdateDeadlineDto();
          inputParameters.ids = idList;
          inputParameters.status = 9;
          inputParameters.tool = UpdateDeadlineDtoTool.Carbon_Market_Tool;
          this.parameterRequestControllerServiceProxy.acceptReviewData(inputParameters).subscribe(
            (res) => {
              this.messageService.add({
                severity: 'success',
                summary: 'Success',
                detail: 'Data is reviewed successfully',
              });
              this.selectedParameters = [];
              this.onSearch();
            },
            (err) => {
              this.messageService.add({
                severity: 'error',
                summary: 'Error.',
                detail: 'Internal server error, please try again.',
              });
            }
          );
        },
      });
    }
  }

  onRejectClick() {
    if (this.selectedParameters?.length > 1) {
      this.messageService.add({
        severity: 'error',
        summary: 'Error.',
        detail: 'Only one parameter can be rejected at a time!',
      });
      return;
    }

    if (this.selectedParameters?.length > 0) {
      this.confirm1 = true;
    }
  }

  onRejectConfirm(status: number) {
    let idList = new Array<number>();
    for (let index = 0; index < this.selectedParameters.length; index++) {
      const element = this.selectedParameters[index];
      idList.push(element.id);
    }

    let inputParameters = new UpdateDeadlineDto();
    inputParameters.ids = idList;
    inputParameters.status = status;
    inputParameters.userId = this.selectedUser ? this.selectedUser.id : 0;
    inputParameters.comment = this.reasonForReject;
    inputParameters.deadline = moment(this.selectedDeadline);
    this.parameterRequestControllerServiceProxy.rejectReviewData(inputParameters).subscribe(
      (res) => {
        this.messageService.add({
          severity: 'success',
          summary: 'Success',
          detail: 'Successfully rejected the data',
        });
        this.selectedParameters = [];
        this.onSearch();
      },
      (err) => {
        this.messageService.add({
          severity: 'error',
          summary: 'Error.',
          detail: 'Internal server error, please try again.',
        });
      }
    );
    this.confirm1 = false;
  }

  onSearch() {
    let event: any = {};
    event.rows = this.rows;
    event.first = 0;

    this.loadgridData(event);
  }

  onReject() {
    this.confirm1 = false;
  }


}
