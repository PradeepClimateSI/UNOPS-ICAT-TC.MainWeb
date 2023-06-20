import { Component, ElementRef, Input, OnInit, ViewChild } from '@angular/core';
import { LazyLoadEvent, MessageService } from 'primeng/api';
import { InvestorAssessment, InvestorToolControllerServiceProxy, ParameterRequest, ParameterRequestControllerServiceProxy, ParameterRequestTool, ServiceProxy, UpdateDeadlineDto, UpdateDeadlineDtoTool, UpdateInvestorToolDto } from 'shared/service-proxies/service-proxies';
import decode from 'jwt-decode';
import * as moment from 'moment';
import { DataRequestStatus } from 'app/Model/DataRequestStatus.enum';
import * as XLSX from 'xlsx';
import { HttpClient } from '@angular/common/http';
@Component({
  selector: 'app-enter-data-investment',
  templateUrl: './enter-data-investment.component.html',
  styleUrls: ['./enter-data-investment.component.css']
})
export class EnterDataInvestmentComponent implements OnInit {

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
  selectedParameter: any;
  selectedId: number;
  isDropdown: boolean;
  answers: any[] = ['Yes', 'No']
  parameterListFilterData: any[];
  SERVER_URL = 'http://localhost:7080/investor-tool/upload'  
  
  @ViewChild('myInput')
  myInputVariable: ElementRef;
  assignCAArray: any = []
  climateactions: any = []

  constructor(
    private parameterRequestControllerServiceProxy: ParameterRequestControllerServiceProxy,
    private serviceProxy: ServiceProxy,
    private messageService: MessageService,
    private investorToolControllerServiceProxy: InvestorToolControllerServiceProxy,
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

    this.parameterRequestControllerServiceProxy
    .getEnterDataParameters(
      0,
      0,
      '',
      0,
      '',
      this.userName,
      this.tool,
      '1234'
    )
    .subscribe((res: any) => {
      console.log(res)
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
            this.climateactions.push(
              a.investmentParameter.assessment.climateAction
            );
          }
        }
      }
    });

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
          this.tool,
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

  onCAChange(event: any) {
    console.log('searchby...', this.searchBy);
    this.onSearch();
  }

  onSearchClick(event: any) {
    this.onSearch();
  }

  async onClickUpdateValue(parameterList: ParameterRequest) {
    this.selectedParameter = parameterList.investmentParameter
    this.selectedId = parameterList.id
    if (!['likelihood', 'score', 'relavance'].includes(parameterList.investmentParameter.institutionDescription)){
      this.isDropdown = true
    }

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
    inputParameters.tool = this.tool as unknown as UpdateDeadlineDtoTool
    this.parameterRequestControllerServiceProxy.rejectEnterData(inputParameters).subscribe(
      (res) => {
        this.messageService.add({
          severity: 'success',
          summary: 'Success',
          detail: 'Data was rejected successfully',
        });
        this.confirm2 = false;

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

    if(this.selectedParameters)
    {
      this.parameterListFilterData = [];
      this.selectedParameters.map((e) => {
        let id = e.investmentParameter.id;
        let intervention = e.investmentParameter.assessment.climateAction.policyName;
        let assesmentType = e.investmentParameter.assessment.assessmentType;
        let assessmentPeriod = moment(e.investmentParameter.assessment.from).format('yy-MM-DD') + " - " + moment(e.investmentParameter.assessment.to).format('yy-MM-DD')
        let process_outcome = e.investmentParameter.type
        let category = e.investmentParameter.category.name
        let characteristic = e.investmentParameter.characteristics.name
        let indicator = (e?.investmentParameter?.question) ?(e?.investmentParameter?.question?.name): (e?.investmentParameter?.institutionDescription)
        let value = e.investmentParameter.parameter_value
  
        let obj = {
          id,
          intervention,
          assesmentType,
          assessmentPeriod,
          process_outcome,
          category,
          characteristic,
          indicator,
          value
        };
  
        this.parameterListFilterData.push(obj);
      })
    }
  }

  download() {
    this.paraListFilter();

    var d = new Date();
    var reportTime = this.formatDate(d);


    console.log(this.parameterListFilterData)
    const ws: XLSX.WorkSheet = XLSX.utils.json_to_sheet(
      this.parameterListFilterData
    );

    const wb: XLSX.WorkBook = XLSX.utils.book_new();

    console.log(ws)
    console.log(wb)
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

    let invest = new UpdateInvestorToolDto()
    invest.id = this.selectedParameter.id
    invest.parameter_value = this.selectedValue

    if (this.selectedAssumption) {
      invest.assumption = this.selectedAssumption
    }

    let res = await this.investorToolControllerServiceProxy.updateInvestorAssessment(invest).toPromise()

    let inputParameters = new UpdateDeadlineDto();
    inputParameters.ids = [this.selectedId];
    inputParameters.status = status;
    inputParameters.tool = this.tool as unknown as UpdateDeadlineDtoTool

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
    this.selectedValue = '';
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
        element.investmentParameter?.parameter_value != null 
        // && element.parameterId?.uomDataEntry != null
      ) {
        idList.push(element.id);
        console.log('element Pushed', element);
      } else {
        console.log('element', element);
        this.messageService.add({
          severity: 'error',
          summary: 'Error.',
          detail: 'Selected parameters must have a value.',
        });
        return;
      }
    }
    if (idList.length > 0) {
      let inputParameters = new UpdateDeadlineDto();
      inputParameters.ids = idList;
      inputParameters.status = 6;
      inputParameters.tool = this.tool as unknown as UpdateDeadlineDtoTool
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

  getValue(para: any){
    if (para.institutionDescription !== null){
      if (para.institutionDescription === 'likelihood'){
        return para.likelihood
      } else if (para.institutionDescription === 'relavance') {
        return para.relavance
      } else {
        // this.investorToolControllerServiceProxy.getInvestorQuestionById(para.institutionDescription)
        // .subscribe(res => {
        //   return 
        // })
      }
    }
  }


}
