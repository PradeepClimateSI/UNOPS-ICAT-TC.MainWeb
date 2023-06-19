import { Component, Input, OnInit } from '@angular/core';
import { ConfirmationService, LazyLoadEvent, MessageService } from 'primeng/api';
import { ParameterRequestControllerServiceProxy, ParameterRequestTool, ServiceProxy, UpdateDeadlineDto, UpdateDeadlineDtoTool, User, UsersControllerServiceProxy } from 'shared/service-proxies/service-proxies';
import decode from 'jwt-decode';
import * as moment from 'moment';
@Component({
  selector: 'app-review-data-investment',
  templateUrl: './review-data-investment.component.html',
  styleUrls: ['./review-data-investment.component.css']
})
export class ReviewDataInvestmentComponent implements OnInit {

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
    private confirmationService: ConfirmationService
  ) { }

  ngOnInit(): void {
    const token = localStorage.getItem('ACCESS_TOKEN')!;
    const tokenPayload = decode<any>(token);
    this.userCountryId = tokenPayload.countryId;
    this.userSectorId = tokenPayload.sectorId;
    // this.totalRecords = 0;
    this.minDate = new Date();

    this.userName = tokenPayload.username;

    this.usersControllerServiceProxy
      .usersByInstitution(1, 1000, '', 9, this.userName)
      .subscribe((res: any) => {
        this.userList = res.items;

        console.log('this.userList', this.userList);
      });

    this.parameterRequestControllerServiceProxy
      .getReviewDataRequests(
        0,
        0,
        '',
        0,
        '',
        '',
        this.userName,
        this.tool,
        "1234"
      )
      .subscribe((res: any) => {
        console.log('my list....s', res.items);
        for (let a of res.items) {
          if (a.investmentParameter.assessment !== null) {

            if (
              !this.assignCAArray.includes(
                a.investmentParameter.assessment.climateAction.policyName
              )
            ) {

              this.assignCAArray.push(
                a.investmentParameter.assessment.climateAction.policyName
              );
              this.climateactionsList.push(
                a.investmentParameter.assessment.climateAction
              );
            }
          }
        }
      });

  }

  loadgridData = (event: LazyLoadEvent) => {
    console.log('event Date', event);
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
      ? moment(this.searchBy.editedOn).format('YYYY-MM-DD')
      : '';

    let pageNumber =
      event.first === 0 || event.first === undefined
        ? 1
        : event.first / (event.rows === undefined ? 1 : event.rows) + 1;
    this.rows = event.rows === undefined ? 10 : event.rows;
    console.log('searchBy', this.searchBy);
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
          this.tool,
          "1234"
        )
        .subscribe(async (a) => {
          console.log('aa', a);
          if (a) {
            this.dataRequestList = a.items;
            console.log("this.dataRequestList...",this.dataRequestList)
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
          console.log(this.dataRequestList)
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
      //  console.log("dataRequestList...",obj)
      //  this.paraId = obj.parameter.id;
      //  console.log("this.paraId...",this.paraId)

      // // let x = 602;
      //  this.prHistoryProxy
      //  .getHistroyByid(this.paraId)  // this.paraId
      //  .subscribe((res) => {
         
      //   this.requestHistoryList =res;
         
      //  console.log('this.requestHistoryList...', this.requestHistoryList);
       
      //  });
      // //  let filter1: string[] = [];
      // //  filter1.push('parameter.id||$eq||' + this.paraId);
      // //  this.serviceProxy
      // //  .getManyBaseParameterRequestControllerParameterRequest(
      // //    undefined,
      // //    undefined,
      // //    filter1,
      // //    undefined,
      // //    undefined,
      // //    undefined,
      // //    1000,
      // //    0,
      // //    0,
      // //    0
      // //  )
      // //  .subscribe((res: any) => {
      // //    this.requestHistoryList =res.data;
         
      // //    console.log('this.requestHistoryList...', this.requestHistoryList);
      // //  });

      //  this.displayHistory = true;
  }

  onAcceptClick() {
    console.log('onAcceptClick');
    console.log(this.selectedParameters)
    if (this.selectedParameters) {
      
      this.confirmationService.confirm({
        message: 'Are you sure you want to accept all the selected parameters?',
        accept: () => {
          ////////Inside Accept////////
          console.log('Inside Accept');
          let idList = new Array<number>();
          for (let index = 0; index < this.selectedParameters.length; index++) {
            const element = this.selectedParameters[index];
            idList.push(element.id);
          }

          let inputParameters = new UpdateDeadlineDto();
          inputParameters.ids = idList;
          inputParameters.status = 9;
          inputParameters.tool = this.tool as unknown as UpdateDeadlineDtoTool
          console.log("inputParameters..",inputParameters)
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
          //////End Accept////////
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
