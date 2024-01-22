import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import * as moment from 'moment';
import { MessageService } from 'primeng/api';
import decode from 'jwt-decode';
import {
  Assessment,
  AssessmentControllerServiceProxy,
  DataVerifierDto,
  InstitutionControllerServiceProxy,
  MethodologyAssessmentParameters as Parameter,
  MethodologyAssessmentControllerServiceProxy as ParameterControllerServiceProxy,
  ParameterHistoryControllerServiceProxy,
  ParameterRequestControllerServiceProxy,
  ServiceProxy,
  UpdateAssessmentDto,
  UpdateDeadlineDto,
  UpdateValueEnterData,
} from 'shared/service-proxies/service-proxies';

@Component({
  selector: 'app-approve-data',
  templateUrl: './approve-data.component.html',
  styleUrls: ['./approve-data.component.css'],
})
export class ApproveDataComponent implements OnInit {
  assessmentYearId: number = 0;
  assessmentYear: any;
  assessmentYearDetails: Assessment = new Assessment();
  parameters: Parameter[] = [];
  baselineParameters: Parameter[] = [];
  projectParameters: Parameter[] = [];
  lekageParameters: Parameter[] = [];
  projectionParameters: Parameter[] = [];
  loading: boolean = false;
  confirm1: boolean;
  institutionList: any[] = [];
  selectedInstitution: any;
  selectedDeadline: Date;
  selectedQCDeadline: Date;
  reasonForReject: string;
  minDate: Date;
  selectedParameters: any[] = [];
  selectedBaselineParameters: any[] = [];
  selectedProjectParameters: any[] = [];
  selectedLeakageParameters: any[] = [];
  selectedProjectionParameters: any[] = [];

  headerlcimateActionName: string;
  headerAssessmentType: string;
  headerNDCName: string;
  headerSubNDCName: string;
  headerBaseYear: string;
  headerAssessmentYear: number;
  userName: string;
  enableQCButton: boolean = false;
  isRejectButtonDisable: boolean = false;
  paraId: number;
  requestHistoryList: any[] = [];
  displayHistory: boolean = false;
  buttonLabel: string = 'Send to QC';
  isOpenPopUp: boolean = false;
  isHideRejectButton: boolean = false;
  hideAllButtons: any;
  finalQC: any;

  constructor(
    private route: ActivatedRoute,
    private assessmentProxy: AssessmentControllerServiceProxy,
    private parameterProxy: ParameterRequestControllerServiceProxy,
    private messageService: MessageService,
    private parameterControlProxy: ParameterControllerServiceProxy,
    private prHistoryProxy: ParameterHistoryControllerServiceProxy,
    private instProxy: InstitutionControllerServiceProxy
  ) { }

  ngOnInit(): void {
    const token = localStorage.getItem('ACCESS_TOKEN')!;
    const tokenPayload = decode<any>(token);
    this.userName =tokenPayload.username;
    this.route.queryParams.subscribe((params) => {
      this.assessmentYearId = params['id'];
    });

    this.assessmentProxy.findOne( this.assessmentYearId)
      .subscribe((res: any) => {
        this.finalQC = res;
        this.headerlcimateActionName = res.climateAction?.policyName;
        this.headerAssessmentType = res.assessmentType;
        if (this.finalQC != null) {
          if (this.finalQC.qaStatus != 4) {
            this.isRejectButtonDisable = false;
            if(this.finalQC.qaStatus==1){
              this.isHideRejectButton = true;
            }
            else {this.isHideRejectButton = false;}
          }
        }
      });
      this.parameterControlProxy.findByAssemeId(this.assessmentYearId)
      .subscribe((res)=>{
        this.baselineParameters  =res;
        if (this.finalQC?.qaStatus == null) {
          this.checkQC();
        }
      })

    let filter2: string[] = new Array();

    filter2.push('type.id||$eq||' + 3);

    this.instProxy.getInstitutionforApproveData().subscribe((a: any) => {
      this.institutionList = a;
    });
  }



  getAssesment() {
    this.assessmentProxy
      .getAssessmentsForApproveData(
        this.finalQC.id,
        this.userName
      )
      .subscribe((res) => {
        this.assessmentYearDetails = res;
      });
  }

  checkQC() {
    this.assessmentProxy
      .checkAssessmentReadyForQC(
        this.assessmentYear.id,
        this.assessmentYear.assessmentYear
      )
      .subscribe((r) => {
        if (r) {
          this.enableQCButton = r;
          this.isRejectButtonDisable = !r;
        }
      });
  }
  onRejectClick() {
    this.selectedParameters.push(...this.selectedBaselineParameters, ...this.selectedProjectParameters,
      ...this.selectedLeakageParameters, ...this.selectedProjectionParameters)
    if (this.selectedParameters.length > 1) {
      this.messageService.add({
        severity: 'error',
        summary: 'Warning',
        detail: 'Only one Parameter can be selected at a time for Rejection!',
      });
      this.clearParameters()
      return;
    }

    if (this.selectedParameters.length > 0) {
      this.confirm1 = true;
    } else {
      this.clearParameters();
    }
  }

  onRejectConfirm() {
    this.selectedParameters.push(...this.selectedBaselineParameters, ...this.selectedProjectParameters,
      ...this.selectedLeakageParameters, ...this.selectedProjectionParameters)
    let idList = new Array<number>();
    for (let index = 0; index < this.selectedParameters.length; index++) {
      const element = this.selectedParameters[index];
      if (
        element.parameterRequest.dataRequestStatus &&
        element.parameterRequest.dataRequestStatus == 9
      ) {
        idList.push(element.parameterRequest.id);
      }
    }
    if (idList.length > 0) {
      let inputParameters = new UpdateDeadlineDto();
      inputParameters.ids = idList;
      inputParameters.status = -9;
      inputParameters.comment = this.reasonForReject;
      inputParameters.deadline = moment(this.selectedDeadline);
      this.parameterProxy.rejectReviewData(inputParameters).subscribe(
        (res) => {
          this.messageService.add({
            severity: 'success',
            summary: 'Success',
            detail: 'Data was rejected successfully',
          });
          let updateInstitutionDto = new UpdateValueEnterData();
          updateInstitutionDto.id = idList[0];
          updateInstitutionDto.institutionId = this.selectedInstitution.id;
          this.parameterControlProxy
            .updateInstitution(updateInstitutionDto)
            .subscribe();
          this.clearParameters();
          this.getAssesment();
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
    this.confirm1 = false;
    this.clearParameters();
  }

  onClickQC() {
    this.isHideRejectButton = true;
    let dto = new UpdateAssessmentDto();
    //@ts-ignore
    dto.deadline = this.selectedQCDeadline;
    this.assessmentProxy.update(this.assessmentYear.id,dto)
      .subscribe((res) => {
      });

    let inputParameters = new DataVerifierDto();
    inputParameters.ids = [this.assessmentYearId];
    inputParameters.status = 1;
    this.buttonLabel = 'Sent';
    this.enableQCButton = false;
    this.isRejectButtonDisable = false;
    this.assessmentProxy.acceptQC(inputParameters).subscribe(
      (res) => {
        this.messageService.add({
          severity: 'success',
          summary: 'Success',
          detail: 'Data is sent to QC successfully',
        });

      },
      (err) => {
        this.messageService.add({
          severity: 'error',
          summary: 'Error.',
          detail: 'Internal server error, please try again.',
        });
      }
    );
    this.isRejectButtonDisable = true;
    this.isOpenPopUp = false;
  }

  onOpenPopUP() {
    this.isOpenPopUp = true;
  }

  getInfo(obj: any) {
    this.paraId = obj.id;

    this.prHistoryProxy
      .getHistroyByid(this.paraId)
      .subscribe((res) => {
        this.requestHistoryList = res;
      });

    this.displayHistory = true;
  }

  onAcceptClick() {
    this.selectedParameters.push(...this.selectedBaselineParameters, ...this.selectedProjectParameters,
      ...this.selectedLeakageParameters, ...this.selectedProjectionParameters)
    if (this.selectedParameters.length > 0) {
      let idList = new Array<number>();
      for (let index = 0; index < this.selectedParameters.length; index++) {
        const element = this.selectedParameters[index];
        if (element.parameterRequest.dataRequestStatus && element.parameterRequest.dataRequestStatus == 9 ) {
          idList.push(element.parameterRequest.id);
        }
      }
      if (idList.length > 0) {
        let inputParameters = new UpdateDeadlineDto();
        inputParameters.ids = idList;
        inputParameters.status = 11;
        
        this.parameterProxy.acceptReviewData(inputParameters).subscribe(
          (res) => {
            this.messageService.add({
              severity: 'success',
              summary: 'Success',
              detail: 'Data is approved successfully',
            });
            this.getAssesment();
            this.checkQC();
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
    this.selectedParameters = []
  }

  clearParameters() {
    this.selectedParameters = [];
    this.selectedBaselineParameters = [];
    this.selectedLeakageParameters = [];
    this.selectedProjectParameters = [];
    this.selectedProjectionParameters = [];
  }
}
