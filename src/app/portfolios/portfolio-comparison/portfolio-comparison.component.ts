import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { MasterDataService } from 'app/shared/master-data.service';
import { MessageService } from 'primeng/api';
import { CreateComparisonReportDto, PortfolioControllerServiceProxy, ReportControllerServiceProxy } from 'shared/service-proxies/service-proxies';

import * as XLSX from 'xlsx';
@Component({
  selector: 'app-portfolio-comparison',
  templateUrl: './portfolio-comparison.component.html',
  styleUrls: ['./portfolio-comparison.component.css']
})
export class PortfolioComparisonComponent implements OnInit {
  portfolioId: number;
  assessmentList: any[];
  portfolio: any;
  card: any = [];
  noOfAssessments: any;
  process_data: any;
  outcome_data: any;
  aggregation_data: any;
  alignment_data: any;
  isLoaded: boolean = false;
  hasCMToolAssessments: boolean = false
  isDownloading: boolean;

  constructor(
    private route: ActivatedRoute,
    private portfolioServiceProxy: PortfolioControllerServiceProxy,
    private reportControllerServiceProxy: ReportControllerServiceProxy,
    private masterDataService: MasterDataService,
    private messageService: MessageService
  ) { }

  ngOnInit(): void {
    this.route.queryParams.subscribe(async (params: { [x: string]: number; }) => {
      this.portfolioId = params['id'];
      await this.getAssessmentsByPortfolio()
      await this.getPortfolioData()
      await this.getDummyData()
      this.hasCMTool()
      this.isLoaded = true
    });
  }

  async getAssessmentsByPortfolio() {
    this.assessmentList = await this.portfolioServiceProxy.assessmentsByPortfolioId(this.portfolioId).toPromise()
  }

  async getPortfolioData() {
    this.portfolio = (await this.portfolioServiceProxy.getPortfolioById(this.portfolioId).toPromise())[0]
    this.noOfAssessments = (await this.portfolioServiceProxy.assessmentsDataByAssessmentId(this.portfolioId).toPromise()).length
console.log(this.portfolio)
    this.card.push(
      ...[
        { title: 'Portfolio ID', data: this.portfolio.portfolioId },
        { title: 'Name of the Portfolio', data: this.portfolio.portfolioName },
        { title: 'Description', data: this.portfolio.description },
        { title: 'Person(s)/ organization(s) doing the assessment', data: this.portfolio.person },
        { title: 'Date', data: this.portfolio.date },
        { title: 'Is this assessment an update of a previous assessment?', data: this.portfolio.IsPreviousAssessment },
        { title: 'Link to previous assessment', data: this.portfolio.link },
        { title: 'Objective(s) of the assessment', data: this.portfolio.objectives },
        { title: 'Intended audience(s) of the assessment', data: this.portfolio.audience },
        { title: 'Number of Assessments', data: await this.noOfAssessments }
      ])
  }

  hasCMTool(){
    if (this.assessmentList.find(o => o.assessment.tool === 'Carbon Market Tool')) this.hasCMToolAssessments = true
    else this.hasCMToolAssessments = false
  }

  async getDummyData() {
    let interventions = await this.portfolioServiceProxy.getPortfolioComparisonData(this.portfolioId).toPromise()

    this.process_data = interventions.process_data
    this.outcome_data = interventions.outcome_data
    this.alignment_data = interventions.alignment_data

    this.aggregation_data = {
      col_set_1: [
        { label: 'INTERVENTION INFORMATION', colspan: 4 },
        { label: '', colspan: 1 }
      ],
      col_set_2: [
        { label: 'ID', code: 'id' },
        { label: 'INTERVENTION NAME', code: 'name' },
        { label: 'INTERVENTION TYPE', code: 'type' },
        { label: 'STATUS', code: 'status' },
        { label: 'GHG MITIGATION (MT CO2-EG)', code: 'mitigation' },
      ],
      interventions:interventions.aggregation_data.interventions,
      total: interventions.aggregation_data.total
    }
  }
  genarateExcel() {
    this.isDownloading = true

    setTimeout(() => {
      let tabledetail = document.getElementById('one')
      let tableComparison = document.getElementById('two')
      let workSheettabledetai = XLSX.utils.table_to_sheet(tabledetail, {})
      let workSheettableComparison = XLSX.utils.table_to_sheet(tableComparison, {});

      // let workbook = XLSX.utils.table_to_book(table,{})
      let workbook = XLSX.utils.book_new()
      XLSX.utils.book_append_sheet(workbook, workSheettabledetai, 'Details')
      XLSX.utils.book_append_sheet(workbook, workSheettableComparison, 'Comparison')
      XLSX.writeFile(workbook, "Report.xlsx");
    }, 1000);
  }
  genarateReport() {
    
    let body = new CreateComparisonReportDto()
    body.portfolioId = this.portfolioId
    // body.climateAction = this.selectedClimateAction
    body.reportName = 'report'
    this.reportControllerServiceProxy.generateComparisonReport(body).subscribe(res => {
      console.log("generated repotr", res)
      if (res) {
        this.messageService.add({
          severity: 'success',
          summary: 'Success',
          detail: 'Report generated successfully',
          closable: true,
        })
        
      }
    }, error => {
      this.messageService.add({
        severity: 'error',
        summary: 'Error',
        detail: 'Failed to generate report',
        closable: true,
      })
    })
  }

}
