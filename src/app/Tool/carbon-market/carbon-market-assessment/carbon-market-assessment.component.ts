import { Component, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import { MasterDataService } from 'app/shared/master-data.service';
import { Assessment, AssessmentCMDetail, ClimateAction, ProjectControllerServiceProxy } from 'shared/service-proxies/service-proxies';

@Component({
  selector: 'app-carbon-market-assessment',
  templateUrl: './carbon-market-assessment.component.html',
  styleUrls: ['./carbon-market-assessment.component.css']
})
export class CarbonMarketAssessmentComponent implements OnInit {

  policies: ClimateAction[]
  assessment: Assessment = new Assessment()
  cm_detail: AssessmentCMDetail = new AssessmentCMDetail()
  assessment_types: any[]
  impact_types: any[]
  impact_categories: any[]
  impact_characteristics: any[]

  selected_impact_types: string[] = []
  selected_impact_categories: string[] = []
  selected_impact_characteristics: string[] = []

  showSections: boolean = false

  constructor(
    private projectControllerServiceProxy: ProjectControllerServiceProxy,
    private masterDataService: MasterDataService
  ) { }

  async ngOnInit(): Promise<void> {
    this.assessment_types = this.masterDataService.assessment_type
    this.impact_types = this.masterDataService.impact_types
    this.impact_categories = this.masterDataService.impact_categories
    this.impact_characteristics = this.masterDataService.impact_characteristics

    await this.getPolicies()
    console.log(this.policies)
  }

  async getPolicies(){
    this.policies = await this.projectControllerServiceProxy.findAllPolicies().toPromise()
  }

  save(form: NgForm){
    this.showSections = true
  }

  selectAssessmentType(e: any){
   
  }

}
