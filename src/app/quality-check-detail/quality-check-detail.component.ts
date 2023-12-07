import { Component, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import * as moment from 'moment';
import {
  MethodologyAssessmentControllerServiceProxy,
  ParameterHistoryControllerServiceProxy,
  MethodologyAssessmentParameters as Parameters,
  ServiceProxy
} from 'shared/service-proxies/service-proxies';

@Component({
  selector: 'app-quality-check-detail',
  templateUrl: './quality-check-detail.component.html',
  styleUrls: ['./quality-check-detail.component.css']
})
export class QualityCheckDetailComponent implements OnInit {
  assesmentId: number = 0;
  param: Parameters[] = [];
  loading: boolean = false;
  commentRequried: boolean = false;
  headerlcimateActionName: string = '';
  drComment: string = '';
  headerAssessmentType: string = '';
  from: string = '';
  fromTo: string = '';
  @ViewChild('opDR') overlayDR: any;
  selectedParameters: any[] = [];
  selectedParam: any[] = [];

  isApprove: boolean;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private metAssesment: MethodologyAssessmentControllerServiceProxy,
    private dataReq: ParameterHistoryControllerServiceProxy,
    private service :ServiceProxy,
  ) { }

  ngOnInit(): void {

    this.route.queryParams.subscribe((params) => {
      this.assesmentId = params['id'];
      this.metAssesment.findByAssemeId(this.assesmentId).subscribe((res) => {
        this.param = res;
        this.headerlcimateActionName = res[0].assessment.climateAction.policyName;
        this.headerAssessmentType = res[0].assessment.assessmentType;
        this.from =  moment(res[0].assessment.from).format('YYYY-MM-DD');
        this.fromTo = moment(res[0].assessment.to).format('YYYY-MM-DD');

      })


    })
  }

  onAcceptClick() {

    this.selectedParam.push(...this.selectedParameters)
    for (let p of this.selectedParam) {
      p.parameterRequest.qaStatus = 4


    }
    this.selectedParam =[]

  }
  onRejectClick() {
    this.selectedParam.push(...this.selectedParameters)
    for (let p of this.selectedParam) {
      
      p.parameterRequest.qaStatus = 3
    }
    this.selectedParam =[]
  }


}
