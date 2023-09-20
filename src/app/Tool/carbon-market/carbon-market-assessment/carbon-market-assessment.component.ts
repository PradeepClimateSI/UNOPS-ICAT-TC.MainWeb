import { Component, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import { MasterDataService } from 'app/shared/master-data.service';
import * as moment from 'moment';
import { MessageService } from 'primeng/api';
import { Assessment, AssessmentCMDetail, ClimateAction, MethodologyAssessmentControllerServiceProxy, ProjectControllerServiceProxy, ServiceProxy } from 'shared/service-proxies/service-proxies';

@Component({
  selector: 'app-carbon-market-assessment',
  templateUrl: './carbon-market-assessment.component.html',
  styleUrls: ['./carbon-market-assessment.component.css']
})
export class CarbonMarketAssessmentComponent implements OnInit {
visible_ex_ante: any;


  policies: ClimateAction[]
  assessment: Assessment = new Assessment()
  cm_detail: AssessmentCMDetail = new AssessmentCMDetail()
  assessment_types: any[]
  assessment_approaches: any[]
  impact_types: any[] = []
  impact_categories: any[] = []
  impact_characteristics: any[] = []
  sectorial_boundires: any[] = []
  int_cm_approches: any[] = []

  selected_impact_types: string[] = []
  selected_impact_categories: string[] = []
  selected_impact_characteristics: string[] = []

  showSections: boolean = false
  isSavedAssessment: boolean = false

  date1: any
  date2: any

  assessmentres: Assessment

  constructor(
    private projectControllerServiceProxy: ProjectControllerServiceProxy,
    private methodologyAssessmentControllerServiceProxy: MethodologyAssessmentControllerServiceProxy,
    private masterDataService: MasterDataService,
    private serviceProxy: ServiceProxy,
    private messageService: MessageService
  ) { }

  async ngOnInit(): Promise<void> {
    this.assessment_types = this.masterDataService.assessment_type
    this.impact_types = this.masterDataService.impact_types
    this.sectorial_boundires = this.masterDataService.sectorial_boundries
    this.assessment_approaches = this.masterDataService.assessment_approach
    this.int_cm_approches = this.masterDataService.int_cm_approaches

    await this.getPolicies()
    console.log(this.policies)
    console.log(this.assessment)
  }

  async getPolicies(){
    this.policies = await this.projectControllerServiceProxy.findAllPolicies().toPromise()
  }

  save(form: NgForm) {
   // this.showSections = true //TODO comment this line in commit
    //save assessment
    this.assessment.tool = 'Carbon Market Tool'
    this.assessment.year = moment(new Date()).format("YYYY-MM-DD")
    this.assessment.assessment_approach = 'DIRECT'

    if (form.valid) {
      this.methodologyAssessmentControllerServiceProxy.saveAssessment(this.assessment)
        .subscribe(res => {
          console.log(res)
          if (res) {
            this.cm_detail.cmassessment = res

            this.serviceProxy.createOneBaseAssessmentCMDetailControllerAssessmentCMDetail(this.cm_detail)
              .subscribe(_res => {
                if (_res) {
                  console.log(_res)
                  this.messageService.add({
                    severity: 'success',
                    summary: 'Success',
                    detail: 'Assessment created successfully',
                    closable: true,
                  })
                  this.isSavedAssessment = true
                  this.assessmentres = res
                  this.showSections = true
                  console.log(this.assessmentres)
                }
              }, error => {
                console.log(error)
                this.messageService.add({
                  severity: 'error',
                  summary: 'Error',
                  detail: 'Assessment detail saving failed',
                  closable: true,
                })
              })
          }
        }, error => {
          console.log(error)
          this.messageService.add({
            severity: 'error',
            summary: 'Error',
            detail: 'Assessment creation failed',
            closable: true,
          })
        })
    } else {
      this.messageService.add({
        severity: 'error',
        summary: 'Error',
        detail: 'Fill all mandatory fields',
        closable: true,
      })
    }
    console.log(this.assessment)
    console.log(this.cm_detail)

    //save cmDetail

  }

  selectAssessmentType(e: any){
    if (e.value === 'Ex-ante') {
      this.visible_ex_ante = true
    }
  }

  selectAssessmentApproach(e: any){

  }

  onSelectType(e: any){
    this.impact_categories = []
    e.value.forEach((val: string) => {
      this.impact_categories.push(...this.masterDataService.impact_categories.filter(cat => cat.type === val))
    })
  }

  onSelectCategory(e: any){
    this.impact_characteristics = []
    e.value.forEach((val: string) => {
      this.impact_characteristics.push(...this.masterDataService.impact_characteristics.filter(cat => cat.type.includes(val)))
    })

    this.impact_characteristics = this.impact_characteristics.filter((v,i,a)=>a.findIndex(v2=>(v2.code===v.code))===i)
  }

  okay() {
    this.visible_ex_ante = false
  }

}
