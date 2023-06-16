import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import * as moment from 'moment';
import { LazyLoadEvent, MessageService } from 'primeng/api';
import { CMAnswer, CMAssessmentAnswer, CMAssessmentQuestion, CMQuestionControllerServiceProxy, ParameterRequest, ParameterRequestControllerServiceProxy, ParameterRequestTool, ServiceProxy, UpdateDeadlineDto, UpdateDeadlineDtoTool, UpdateValueEnterData } from 'shared/service-proxies/service-proxies';
import decode from 'jwt-decode';
import { DataRequestStatus } from 'app/Model/DataRequestStatus.enum';
import * as XLSX from 'xlsx';
import { environment } from 'environments/environment.prod';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-enter-data-cm',
  templateUrl: './enter-data-cm.component.html',
  styleUrls: ['./enter-data-cm.component.css']
})
export class EnterDataCmComponent implements OnInit {
  loading: boolean;
  totalRecords: number;
  searchBy: any = {
    text: null,
    year: null,
    climateaction: null,
    institution: null,
  };
  rows: number;
  userName: string;
  parameterList: any;
  userCountryId: any = 0;
  userSectorId: any = 0;
  user_role: string;
  selectedParameters: any[];
  selectedPara: any;
  isAddData: boolean = false;
  confirm2: boolean = false;
  isOpen: boolean;
  selectedDataRequestId: number;
  paraId: any;
  displayHistory: boolean;
  uploadFile: boolean;
  reasonForReject: string;
  fileData: any;
  requestHistoryList: any[] = [];
  selectedValue: any;
  selectedAssumption: string;
  answers: CMAnswer[] = []
  selectedParameter: any;
  selectedId: number;
  parameterListFilterData: any[];
  // SERVER_URL = environment.baseUrlExcelUpload; //'http://localhost:7080/parameter/upload'
  SERVER_URL = 'http://localhost:7080/cm-assessment-answer/upload'

  @ViewChild('myInput')
  myInputVariable: ElementRef;

  constructor(
    private parameterRequestControllerServiceProxy: ParameterRequestControllerServiceProxy,
    private cMQuestionControllerServiceProxy: CMQuestionControllerServiceProxy,
    private serviceProxy: ServiceProxy,
    private messageService: MessageService,
    private httpClient: HttpClient
  ) { }

  ngOnInit(): void {
    const token = localStorage.getItem('ACCESS_TOKEN')!;
    const tokenPayload = decode<any>(token);
    this.userCountryId = tokenPayload.countryId;
    this.userSectorId = tokenPayload.sectorId;
    this.user_role = tokenPayload.role.code;
    this.totalRecords = 0;
    this.userName = tokenPayload.username;

    this.loadgridData({})
  }

  loadgridData = (event: LazyLoadEvent) => {
    this.loading = true;
    this.totalRecords = 0;

    let climateActionId = this.searchBy.climateaction
      ? this.searchBy.climateaction.id
      : 0;
    let year = this.searchBy.year ? this.searchBy.year.assessmentYear : '';
    let filtertext = this.searchBy.text ? this.searchBy.text : '';

    let editedOn = this.searchBy.editedOn
      ? moment(this.searchBy.editedOn).format('YYYY-MM-DD')
      : '';

    let pageNumber =
      event.first === 0 || event.first === undefined
        ? 1
        : event.first / (event.rows === undefined ? 1 : event.rows) + 1;
    this.rows = event.rows === undefined ? 10 : event.rows;

    setTimeout(() => {
      this.parameterRequestControllerServiceProxy
        .getEnterDataParameters(
          pageNumber,
          this.rows,
          filtertext,
          climateActionId,
          year,
          this.userName,
          'Carbon Market Tool',
          '1234'
        )
        .subscribe((a) => {
          console.log('aa', a);
          if (a) {
            this.parameterList = a.items;
            this.totalRecords = a.meta.totalItems;
          }
          this.loading = false;
        });
    }, 1);
  };

  async onClickUpdateValue(parameterList: ParameterRequest) {
    this.selectedParameter = parameterList.cmAssessmentAnswer
    this.selectedId = parameterList.id

    this.answers = await this.cMQuestionControllerServiceProxy.getAnswersByQuestion(parameterList.cmAssessmentAnswer.assessment_question.question.id).toPromise()


    this.isAddData = true;
  }

  onRejectClick(id: number) {
    this.isOpen = false;
    this.confirm2 = true;
    this.selectedDataRequestId = id;
  }

  onRejectConfirm() {
    let inputParameters = new UpdateDeadlineDto();
    inputParameters.ids = [this.selectedDataRequestId];
    inputParameters.status = this.user_role == "Institution Admin" ? DataRequestStatus.Rejected_EnterData_IA : DataRequestStatus.Rejected_EnterData_DEO;
    inputParameters.comment = this.reasonForReject;
    // this.parameterRequestProxy.rejectEnterData(inputParameters).subscribe(
    //   (res) => {
    //     this.messageService.add({
    //       severity: 'success',
    //       summary: 'Success',
    //       detail: 'Data was rejected successfully',
    //     });
    //     this.confirm2 = false;

    //     this.onSearch();
    //   },
    //   (err) => {
    //     this.messageService.add({
    //       severity: 'error',
    //       summary: 'Error.',
    //       detail: 'Internal server error, please try again.',
    //     });
    //   }
    // );
  }

  onReject() {
    this.confirm2 = false;
  }

  onMouseOver() {
    this.isOpen = true;
  }

  onMouseleave() {
    this.isOpen = false;
  }

  getInfo(obj: any) {
    console.log('dataRequestList...', obj);
    this.paraId = obj.parameterId.id;
    console.log('this.paraId...', this.paraId);

    // let x = 602;
    // this.prHistoryProxy
    //   .getHistroyByid(this.paraId) // this.paraId
    //   .subscribe((res) => {
    //     this.requestHistoryList = res;

    //     console.log('this.requestHistoryList...', this.requestHistoryList);
    //   });

    this.displayHistory = true;
  }

  // On file Select
  onChange(event: any) {
    this.fileData = event.target.files[0];
  }

  paraListFilter() {
    console.log("paraListFilter")

    if(this.selectedParameters)
    {

      this.parameterListFilterData = [];


      this.selectedParameters.map((e) => {
        console.log("====== selected e",e);
        let id = e.cmAssessmentAnswer.id;
        let intervention = e.cmAssessmentAnswer.assessment_question.assessment.climateAction.policyName;
        let assesmentType = e.cmAssessmentAnswer.assessment_question.assessment.assessmentType;
        let questionId = e.cmAssessmentAnswer.assessment_question.question.id
        let question = e.cmAssessmentAnswer.assessment_question.question.label
        let answer = e.cmAssessmentAnswer.answer.label
  
        let obj = {
          id,
          intervention,
          assesmentType,
          questionId,
          question,
          answer
        };
  
        this.parameterListFilterData.push(obj);
  
        console.log('+++++++obj 1======', obj);
      })
    }
  }

  download() {
    console.log("download")
    this.paraListFilter();

    var d = new Date();
    var reportTime = this.formatDate(d);


    console.log(this.parameterListFilterData)
    const ws: XLSX.WorkSheet = XLSX.utils.json_to_sheet(
      this.parameterListFilterData
    );

    const wb: XLSX.WorkBook = XLSX.utils.book_new();

    // let dropdownOptions = ['Yes', 'No']

    // const dataValidation = {
    //   type: 'list',
    //   formula1: `"${dropdownOptions.join(',')}"`,
    //   showDropDown: true,
    // };

    console.log(ws)
    console.log(wb)
    // const cellAddress = 'F5'; // Change this to the desired cell address

    // ws['!dataValidations'] = [{
    //   sqref: cellAddress,
    //   ...dataValidation,
    // }];
    XLSX.utils.book_append_sheet(wb, ws, 'sheet1');


    XLSX.writeFile(wb, 'data_entry_template_' + reportTime + '.xlsx');

    this.onSearch();
    //
    this.messageService.add({
      severity: 'info',
      summary: 'Info',
      detail:
        'Please do not change the number of columns , column names  & selected units of the excel sheet if you want to re upload ',
      closable: true,
    });

    this.selectedParameters = []
  }

  formatDate(date: any) {
    var hours = date.getHours();
    var minutes = date.getMinutes();
    var ampm = hours >= 12 ? 'pm' : 'am';
    hours = hours % 12;
    hours = hours ? hours : 12; // the hour '0' should be '12'
    minutes = minutes < 10 ? '0' + minutes : minutes;
    var strTime = hours + ':' + minutes + ' ' + ampm;
    return (
      date.getMonth() +
      1 +
      '/' +
      date.getDate() +
      '/' +
      date.getFullYear() +
      '_' +
      strTime
    );
  }

  uploadDialog() {
    this.uploadFile = true;
  }

  uploadDialogCancel() {
    this.uploadFile = false;
  }

  // OnClick of button Upload
  onUpload() {
    const formData = new FormData();
    formData.append('file', this.fileData);
    let fullUrl = this.SERVER_URL;
    this.httpClient.post<any>(fullUrl, formData).subscribe(
      (res) => {
        this.messageService.add({
          severity: 'success',
          summary: 'Success',
          detail: 'Excel Data Uploaded successfully',
        });

        this.myInputVariable.nativeElement.value = '';
        this.uploadFile = false;
      },
      (err) => {
        this.messageService.add({
          severity: 'error',
          summary: 'Error.',
          detail: 'Internal server error, please try again.',
        });
      }
    );
    setTimeout(() => {
      this.onSearch();
      //location.reload();
    }, 1000);
  }

  async onClickSendNow(status: number) {
    // let inputValues = new UpdateValueEnterData();
    // inputValues.id = this.selectedParameterId;
    // inputValues.value = this.selectedValue;
    // inputValues.assumptionParameter = this.selectedAssumption;

    let assessmentAnswer = new CMAssessmentAnswer()
    assessmentAnswer.id = this.selectedParameter.id
    assessmentAnswer.answer = this.selectedValue
    assessmentAnswer.score = this.selectedValue.score_portion / 100 * this.selectedValue.weight / 100

    if (this.selectedAssumption) {
      let assessmentQuestion = new CMAssessmentQuestion()
      assessmentQuestion.id = this.selectedParameter.assessment_question.id
      assessmentQuestion.enterDataAssumption = this.selectedAssumption

      let res = await this.serviceProxy.updateOneBaseCMAssessmentQuestionControllerCMAssessmentQuestion(
        assessmentQuestion.id, assessmentQuestion
      ).toPromise()
    }

    let res1 = await this.serviceProxy.updateOneBaseCMAssessmentAnswerControllerCMAssessmentAnswer(
      assessmentAnswer.id, assessmentAnswer
    ).toPromise()

    let inputParameters = new UpdateDeadlineDto();
    inputParameters.ids = [this.selectedId];
    inputParameters.status = status;
    inputParameters.tool = UpdateDeadlineDtoTool.Carbon_Market_Tool

    console.log('inputParameters', inputParameters);
    this.parameterRequestControllerServiceProxy.acceptReviewData(inputParameters).subscribe(res => {
      this.messageService.add({
        severity: 'success',
        summary: 'Success',
        detail: status == 5 ? 'Successfully saved the value' : 'Successfully sent the value',
      });
    }, error => {
      this.messageService.add({
        severity: 'error',
        summary: 'Error',
        detail: 'Internal server error',
      });
    });
    this.selectedValue = new CMAnswer();
    this.selectedAssumption = '';
    this.selectedParameter = [];
    this.onSearch();
    this.isAddData = false;

  }

  onSearch() {
    let event: any = {};
    event.rows = this.rows;
    event.first = 0;

    this.loadgridData(event);
  }


  onClickSendNowAll() {
    let idList = new Array<number>();
    for (let index = 0; index < this.selectedParameters.length; index++) {
      let element = this.selectedParameters[index];
      console.log('++++',element)
      if (
        element.cmAssessmentAnswer?.answer != null 
        // && element.parameterId?.uomDataEntry != null
      ) {
        idList.push(element.id);
        console.log('element Pushed', element);
      } else {
        console.log('element', element);
        this.messageService.add({
          severity: 'error',
          summary: 'Error.',
          detail: 'Selected parameters must have a answer.',
        });
        return;
      }
    }
    if (idList.length > 0) {
      let inputParameters = new UpdateDeadlineDto();
      inputParameters.ids = idList;
      inputParameters.status = 6;
      this.parameterRequestControllerServiceProxy.acceptReviewData(inputParameters).subscribe(
        (res) => {
          this.isAddData = false;
          this.messageService.add({
            severity: 'success',
            summary: 'Success',
            detail: 'Successfully sent the Value',
          });
          this.parameterList = [];
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
    }
  }

  onCancel() {
    this.isAddData = false;
  }

  onHideDialog() {
    // this.isHistorical = false
  }


}
