import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { MessageService } from 'primeng/api';
import { MethodologyAssessmentControllerServiceProxy } from 'shared/service-proxies/service-proxies';

@Component({
  selector: 'app-assessment-flow',
  templateUrl: './assessment-flow.component.html',
  styleUrl: './assessment-flow.component.css'
})
export class AssessmentFlowComponent implements OnInit {

  isShowQ2: boolean = false;
  isShowQ3: boolean = false
  flowConditions=FlowConditions;
  rows: number = 10;
  filterText: any = '';
  searchSectors: string = '';
  type: string = '';
  totalRecords: number = 0;
  loading: boolean = false;

  constructor(
    private router: Router,
    private methassess : MethodologyAssessmentControllerServiceProxy,
    private messageService: MessageService,
    ) { }

  async ngOnInit(): Promise<void> {
    await this.methassess.getAssessmentCount().subscribe(res=>{
      if(res){
        this.loading = true
        this.totalRecords = res
      }
    })
    
    
  }

  onClick(input: FlowConditions) {
    switch (input) {
      case FlowConditions.Q1_YES: {
        this.goToPortfolio();
        break
      }
      case FlowConditions.Q1_NO: {
        this.isShowQ2 = true;
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

  goToCarbonMarket() {
    this.router.navigate(['app/carbon-market-tool'])
  }

  goToGeneral() {
    this.router.navigate(['app/portfolio-tool'])
  }

  goToInvestment() {
    this.router.navigate(['app/investor-tool-new']) 
  }
  goToPortfolio() {
    if(this.totalRecords && this.totalRecords>0){
      this.router.navigate(['app/portfolio-add']) 
    }
    else{
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
