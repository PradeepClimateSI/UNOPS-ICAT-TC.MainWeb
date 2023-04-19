import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import * as moment from 'moment';
import { MessageService } from 'primeng/api';
import decode from 'jwt-decode';
import {
  Assessment,
  AssessmentControllerServiceProxy,
  // AssessmentYear,
  // AssessmentYearControllerServiceProxy,
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
  assesmentYearId: number = 0;
  assementYear: any;
  assementYearDetails: Assessment = new Assessment();
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
    private proxy: ServiceProxy,
    private assesmentProxy: AssessmentControllerServiceProxy,
    // private assessmentYearProxy: AssessmentYearControllerServiceProxy,
    private parameterProxy: ParameterRequestControllerServiceProxy,
    private messageService: MessageService,
    private serviceProxy: ServiceProxy,
    private parameterControlProxy: ParameterControllerServiceProxy,
    private prHistoryProxy: ParameterHistoryControllerServiceProxy,
    private instProxy: InstitutionControllerServiceProxy
  ) { }

  ngOnInit(): void {
    const token = localStorage.getItem('ACCESS_TOKEN')!;
    const tokenPayload = decode<any>(token);
    this.userName =tokenPayload.username;
    // this.userName = localStorage.getItem('user_name')!;
    this.route.queryParams.subscribe((params) => {
      this.assesmentYearId = params['id'];
      console.log('my id..,,', this.assesmentYearId);
    });

    this.assesmentProxy.findOne( this.assesmentYearId)
      .subscribe((res: any) => {
        console.log('Asseyeaaaaar...', res);
        this.finalQC = res;
        this.headerlcimateActionName = res.climateAction?.policyName;
        this.headerAssessmentType = res.assessmentType;
        if (this.finalQC != null) {
          if (this.finalQC.qaStatus != 4) {
            console.log('Asseyear...', this.finalQC.qaStatus);
            this.isRejectButtonDisable = false;
            if(this.finalQC.qaStatus==1){
              this.isHideRejectButton = true;
            }
            else {this.isHideRejectButton = false;}
          }
        }
      });
      this.parameterControlProxy.findByAssemeId(this.assesmentYearId)
      .subscribe((res)=>{
        this.baselineParameters  =res
        console.log("LLLLLLLLLLLLLLLLLL",res)
        console.log("LLLLLLLLLLLLLLLLLL",this.finalQC?.qaStatus)
        if (this.finalQC?.qaStatus == null) {
          this.checkQC();
        }
      })

    let filter2: string[] = new Array();

    filter2.push('type.id||$eq||' + 3);

    this.instProxy.getInstitutionforApproveData().subscribe((a: any) => {
      console.log('my institutions', a);
      this.institutionList = a;
    });
  }

  

  getAssesment() {
    console.log('assessment', this.finalQC);
    this.assesmentProxy
      .getAssessmentsForApproveData(
        this.finalQC.id,
        this.userName
      )
      .subscribe((res) => {
        console.log('assessment', res);
        this.assementYearDetails = res;

        // this.parameters = this.assementYearDetails.assessment?.parameters;

        // this.baselineParameters =
        //   this.assementYearDetails.assessment?.parameters.filter(
        //     (p) => p.isBaseline
        //   );

        // this.projectParameters =
        //   this.assementYearDetails.assessment.parameters.filter(
        //     (p) => p.isProject
        //   );
        // this.lekageParameters =
        //   this.assementYearDetails.assessment.parameters.filter(
        //     (p) => p.isLekage
        //   );
        // this.projectionParameters =
        //   this.assementYearDetails.assessment.parameters.filter(
        //     (p) =>
        //       p.isProjection &&
        //       p.projectionBaseYear == this.headerAssessmentYear
        //   );
        console.log('projectionParameters', this.projectionParameters);
      });
  }

  checkQC() {
    console.log('checkAssessmentReadyForQC',this.assementYear);
    this.assesmentProxy
      .checkAssessmentReadyForQC(
        this.assementYear.id,
        this.assementYear.assessmentYear
      )
      .subscribe((r) => {
        console.log('checkAssessmentReadyForQC', r);
        if (r) {
          console.log('check res...', r);
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
    console.log('selected qc dead line..', this.selectedQCDeadline);
    let dto = new UpdateAssessmentDto()
    //@ts-ignore
    dto.deadline = this.selectedQCDeadline;
    console.log('qc dead line..', this.assementYear);
    this.assesmentProxy.update(this.assementYear.id,dto)
      .subscribe((res) => {
        console.log('my updatedt asse year..', res);
      });

    let inputParameters = new DataVerifierDto();
    inputParameters.ids = [this.assesmentYearId];
    inputParameters.status = 1;
    console.log('inputParameters', inputParameters);
    this.buttonLabel = 'Sent';
    this.enableQCButton = false;
    this.isRejectButtonDisable = false;
    console.log('sent');
    this.assesmentProxy.acceptQC(inputParameters).subscribe(
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
    console.log('dataRequestList...', obj);
    this.paraId = obj.id;
    console.log('this.paraId...', this.paraId);

    // let x = 602;
    this.prHistoryProxy
      .getHistroyByid(this.paraId) // this.paraId
      .subscribe((res) => {
        this.requestHistoryList = res;

        console.log('this.requestHistoryList...', this.requestHistoryList);
      });

    this.displayHistory = true;
  }

  onAcceptClick() {
    this.selectedParameters.push(...this.selectedBaselineParameters, ...this.selectedProjectParameters,
      ...this.selectedLeakageParameters, ...this.selectedProjectionParameters)
    console.log('selectedParameters', this.selectedParameters);
    if (this.selectedParameters.length > 0) {
      let idList = new Array<number>();
      for (let index = 0; index < this.selectedParameters.length; index++) {
        const element = this.selectedParameters[index];
        console.log('Review parameter Accept', element);
        if (element.parameterRequest.dataRequestStatus && element.parameterRequest.dataRequestStatus == 9 ) {
          idList.push(element.parameterRequest.id);
        }
      }
      console.log('Review parameter Accept', idList);
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
            // this.clearParameters();
            this.getAssesment();
            console.log('1111', inputParameters);
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
