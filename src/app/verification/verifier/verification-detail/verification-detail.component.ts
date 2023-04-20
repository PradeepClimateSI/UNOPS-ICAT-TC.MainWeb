import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Assessment, AssessmentControllerServiceProxy, MethodologyAssessmentControllerServiceProxy, MethodologyAssessmentParameters, ServiceProxy, UpdateAssessmentDto, VerificationControllerServiceProxy, VerificationDetail } from 'shared/service-proxies/service-proxies';
import decode from 'jwt-decode';
import { MessageService } from 'primeng/api';
import * as moment from 'moment';

@Component({
  selector: 'app-verification-detail',
  templateUrl: './verification-detail.component.html',
  styleUrls: ['./verification-detail.component.css']
})
export class VerificationDetailComponent implements OnInit {

  public card: any[] = []
  assessmentId: any;
  assessment: Assessment
  verificationStatus: any;
  flag: any;
  public parameters: MethodologyAssessmentParameters[];
  isAccepted = true
  verificationDetails: VerificationDetail[]
  verificationRound: number;
  loggedUserRole: any
  averageOutcome: any
  averageProcess: any

  constructor(
    private route: ActivatedRoute,
    private serviceProxy: ServiceProxy,
    private assessmentControllerServiceProxy: AssessmentControllerServiceProxy,
    private methodologyAssessmentControllerServiceProxy: MethodologyAssessmentControllerServiceProxy,
    private verificationControllerServiceProxy: VerificationControllerServiceProxy,
    private router: Router,
    private messageService: MessageService
  ) { }

  ngOnInit(): void {
    const token = localStorage.getItem('ACCESS_TOKEN')!;
    const tokenPayload = decode<any>(token);
    console.log(tokenPayload)
    this.loggedUserRole=tokenPayload.role[0]

    console.log(this.loggedUserRole)

    this.route.queryParams.subscribe(async (params) => {
      this.assessmentId = params['id'];
      this.verificationStatus = params['verificationStatus'];
      this.flag = params['flag'];

      // this.serviceProxy.getOneBase
      this.assessment = await this.assessmentControllerServiceProxy.findOne(this.assessmentId).toPromise()
      console.log(this.assessment)
      this.card = [
        {title: 'Intervention', value: this.assessment.climateAction.policyName},
        {title: 'Assessment Type ', value: this.assessment.assessmentType},
        {title: 'Assessment Period ', value: this.assessment.from + '  to ' + this.assessment.to},
        {title: 'Barriers ', value: this.assessment.climateAction.barriers},
        {title: 'Methodology', value: this.assessment.methodology.methodology_name},
        {title: 'Assessment Method', value: 'Track 1'},
      ]
      
      this.parameters = await this.methodologyAssessmentControllerServiceProxy.findAssessmentParameters(this.assessment.id).toPromise()
      console.log(this.parameters)
      for (let para of this.parameters){
        if (para['isAcceptedByVerifier'] !== true){
          this.isAccepted = false
        }
      }

      this.getVerificationRound()
      this.getVerificationDetails()
      await this.getResult()
    })

  }

  getVerificationDetails() {
    this.verificationControllerServiceProxy.getVerificationDetails(this.assessment.id)
      .subscribe(res => {
        if (res) {
          this.verificationDetails = res
        }
      })
  }

  async getResult(){
   let result = await this.methodologyAssessmentControllerServiceProxy.getResultByAssessment(this.assessment.id).toPromise()
   this.averageOutcome = result.averageOutcome
   this.averageProcess = result.averageProcess
  }

  back() {
    this.router.navigate(['/app/verification/list']);
  }

  toNonConformance() {
    let data
    if (this.loggedUserRole === 'Sector Admin'){
      data = {
        id: this.assessment.id,
        flag: 'sec-admin'
      }
    } else {
      data = {
        id: this.assessment.id,
        isVerificationHistory: this.flag,
        vStatus: this.verificationStatus,
      }
    }
    this.router.navigate(['/app/non-conformance'], {
      queryParams: data,
    });
  }

  getVerificationRound() {
    if (this.assessment && this.assessment !== undefined) {
      if (
        this.assessment.verificationStatus === 1 ||
        this.assessment.verificationStatus === 2 ||
        this.assessment.verificationStatus === 3
      ) {
        this.verificationRound = 1;
      } else if (this.assessment.verificationStatus === 4) {
        this.verificationRound = 2;
      } else if (this.assessment.verificationStatus === 5)
        this.verificationRound = 3;
    }
  }

  sendForVerification() {
    this.assessment.verificationStatus = 2;
    // this.assementYear.assessmentAssumption = this.assumption;


    let dto = new UpdateAssessmentDto()
    dto.editedOn = moment()
    dto.verificationStatus = 2

    this.assessmentControllerServiceProxy.update(this.assessmentId, dto)
      .subscribe((a) => {

        this.messageService.add({ severity: 'success', summary: 'Confirmed', detail: 'Successfully sent to verification' });
        setTimeout(() => {
          window.location.reload();
        }, 1000);
      });
  }

  checkboxCheck(event: any) {
    // if (event.checked) {
    //   this.selectedParameter.push(param);
    // } else {
    //   const index = this.selectedParameter.indexOf(param);
    //   this.selectedParameter.splice(index, 1);
    // }
  }

}
