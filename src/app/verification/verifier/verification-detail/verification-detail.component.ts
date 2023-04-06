import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Assessment, AssessmentControllerServiceProxy, MethodologyAssessmentControllerServiceProxy, MethodologyAssessmentParameters, ServiceProxy, VerificationControllerServiceProxy, VerificationDetail } from 'shared/service-proxies/service-proxies';

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

  constructor(
    private route: ActivatedRoute,
    private serviceProxy: ServiceProxy,
    private assessmentControllerServiceProxy: AssessmentControllerServiceProxy,
    private methodologyAssessmentControllerServiceProxy: MethodologyAssessmentControllerServiceProxy,
    private verificationControllerServiceProxy: VerificationControllerServiceProxy
  ) { }

  ngOnInit(): void {
    this.route.queryParams.subscribe(async (params) => {
      this.assessmentId = params['id'];
      this.verificationStatus = params['verificationStatus'];
      this.flag = params['flag'];

      // this.serviceProxy.getOneBase
      this.assessment = await this.assessmentControllerServiceProxy.findOne(this.assessmentId).toPromise()
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
    })

    this.getVerificationDetails()
  }

  getVerificationDetails() {
    this.verificationControllerServiceProxy.getVerificationDetails(this.assessment.id)
      .subscribe(res => {
        if (res) {
          this.verificationDetails = res
        }
      })
  }

}
