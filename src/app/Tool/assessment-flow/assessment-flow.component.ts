import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { MasterDataService } from 'app/shared/master-data.service';
import { MessageService } from 'primeng/api';
import { ClimateAction, MethodologyAssessmentControllerServiceProxy, ProjectControllerServiceProxy } from 'shared/service-proxies/service-proxies';

@Component({
  selector: 'app-assessment-flow',
  templateUrl: './assessment-flow.component.html',
  styleUrl: './assessment-flow.component.css'
})
export class AssessmentFlowComponent implements OnInit {

  isShowQ2: boolean = false;
  isShowQ3: boolean = false
  flowConditions = FlowConditions;
  rows: number = 10;
  filterText: any = '';
  searchSectors: string = '';
  type: string = '';
  totalRecords: number = 0;
  loading: boolean = false;
  intervention: ClimateAction = new ClimateAction()
  policies: ClimateAction[] = [];
  assessment_types: any[];
  assessmentType: string
  isShowInternvention: boolean = false;

  constructor(
    private router: Router,
    private methassess: MethodologyAssessmentControllerServiceProxy,
    private messageService: MessageService,
    private projectControllerServiceProxy: ProjectControllerServiceProxy,
    public masterDataService: MasterDataService,
  ) { }

  async ngOnInit(): Promise<void> {
    this.assessment_types = this.masterDataService.assessment_type;
    await this.methassess.getAssessmentCount().subscribe(res => {
      if (res) {
        this.loading = true
        this.totalRecords = res
      }
    })
    await this.getPolicies();


  }
  async getPolicies() {
    this.policies = await this.projectControllerServiceProxy.findAllPolicies().toPromise();
  }

  onClick(input: FlowConditions) {
    switch (input) {
      case FlowConditions.Q1_YES: {
        this.goToPortfolio();
        break
      }
      case FlowConditions.Q1_NO: {
        this.isShowInternvention = true;
        break
      }
      case FlowConditions.Q2_YES: {
        this.goToCarbonMarket();
        break
      }
      case FlowConditions.Q2_NO: {
        this.isShowQ3 = true;
        break
      }
      case FlowConditions.Q3_YES: {
        this.goToInvestment();
        break
      }
      case FlowConditions.Q3_NO: {
        this.goToGeneral()
        break
      }
      default:
        break;
    }

  }
  onChangeInterventionAndType() {
    if (this.intervention.id && this.assessmentType) {
      this.isShowQ2 = true
    }
  }

  goToCarbonMarket() {
    this.router.navigate(['app/carbon-market-tool'], {
      queryParams: { interventionId: this.intervention.id, assessmentType: this.assessmentType },
    })
  }

  goToGeneral() {
    this.router.navigate(['app/portfolio-tool'], {
      queryParams: { interventionId: this.intervention.id, assessmentType: this.assessmentType, },
    })
  }

  goToInvestment() {
    this.router.navigate(['app/investor-tool-new'], {
      queryParams: { interventionId: this.intervention.id, assessmentType: this.assessmentType },
    })
  }
  goToPortfolio() {
    if (this.totalRecords && this.totalRecords > 0) {
      this.router.navigate(['app/portfolio-add'], {
        queryParams: { interventionId: this.intervention.id, assessmentType: this.assessmentType },
      }
      )
    }
    else {
      this.messageService.add({
        severity: 'info',
        summary: 'Info',
        detail: 'Before compiling a portfolio of interventions, first You need to be individually assessed using one of the three other tools',
        closable: true,
      })

    }

  }

}




export enum FlowConditions {
  Q1_YES = 1,
  Q1_NO = 2,
  Q2_YES = 3,
  Q2_NO = 4,
  Q3_YES = 5,
  Q3_NO = 6,
}
