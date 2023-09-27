import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { PortfolioControllerServiceProxy } from 'shared/service-proxies/service-proxies';

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

  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private portfolioServiceProxy: PortfolioControllerServiceProxy,
  ) { }

  ngOnInit(): void {
    this.route.queryParams.subscribe(async (params: { [x: string]: number; }) => {
      this.portfolioId = params['id'];
      await this.getAssessmentsByPortfolio()
      await this.getPortfolioData()
      await this.getDummyData()
    });
  }

  async getAssessmentsByPortfolio() {
    this.assessmentList = await this.portfolioServiceProxy.assessmentsByPortfolioId(this.portfolioId).toPromise()
  }

  async getPortfolioData() {
    this.portfolio = (await this.portfolioServiceProxy.getPortfolioById(this.portfolioId).toPromise())[0]
    this.noOfAssessments = (await this.portfolioServiceProxy.assessmentsDataByAssessmentId(this.portfolioId).toPromise()).length

    this.card.push(
      ...[
        { title: 'Portfolio ID', data: this.portfolio.portfolioId },
        { title: 'Name of the Portfolio', data: this.portfolio.portfolioName },
        { title: 'Description', data: this.portfolio.description },
        { title: 'Person(s)/ organization(s) doing the assessment', data: this.portfolio.person },
        { title: 'Is this assessment an update of a previous assessment?', data: this.portfolio.IsPreviousAssessment },
        { title: 'Link to previous assessment', data: 'Link' },
        { title: 'Objective(s) of the assessment', data: this.portfolio.objectives },
        { title: 'Intended audience(s) of the assessment', data: this.portfolio.audience },
        { title: 'Number of Assessments', data: await this.noOfAssessments }
      ])
  }

  async getDummyData() {
    let interventions = await this.portfolioServiceProxy.getPortfolioComparisonData(this.portfolioId).toPromise()
    //TODO sort process data by order before loop the table
    // this.process_data = [
    //   {
    //     col_set_1: [
    //       { label: 'INTERVENTION INFORMATION', colspan: 4 },
    //       { label: 'Technology', colspan: 4 },
    //     ],
    //     col_set_2: [
    //       { label: 'ID', code: 'id' },
    //       { label: 'Intervention Name', code: 'name' },
    //       { label: 'Intervention Type', code: 'type' },
    //       { label: 'Status', code: 'status' },
    //       { label: 'R&D', code: 'R_&_D' },
    //       { label: 'Adoption', code: 'ADOPTION' },
    //       { label: 'Category score', code: 'category_score' }
    //     ],
    //     interventions: [
    //       {
    //         id: '1',
    //         name: 'Test 1',
    //         type: 'Type 1',
    //         status: 'Complete',
    //         'R_&_D': '2',
    //         ADOPTION: '3',
    //         category_score: '4'
    //       },
    //       {
    //         id: '2',
    //         name: 'Test 2',
    //         type: 'Type 2',
    //         status: 'Complete',
    //         'R_&_D': '2',
    //         ADOPTION: '3',
    //         category_score: '4'
    //       }
    //     ],
    //     characteristic_count: 2,
    //     order: 1
    //   },
    // ]

    this.process_data = interventions.process_data
    this.outcome_data = interventions.outcome_data

    //TODO sort outcome data by order before loop the table
    // this.outcome_data = [
    //   {
    //     comparison_type: 'SCALE COMPARISON',
    //     col_set_1: [
    //       { label: 'INTERVENTION INFORMATION', colspan: 4 },
    //       { label: 'GHG', colspan: 4 }
    //     ],
    //     col_set_2: [
    //       { label: 'ID', code: 'id' },
    //       { label: 'INTERVENTION NAME', code: 'name' },
    //       { label: 'INTERVENTION TYPE', code: 'type' },
    //       { label: 'STATUS', code: 'status' },
    //       { label: 'INTERNATIONAL', code: 'international' },
    //       { label: 'NATIONAL/SECTORIAL', code: 'national' },
    //       { label: 'SUBNATIONAL/SUBSECTORIAL', code: 'subnational' },
    //       { label: 'CATEGORY SCORE', code: 'category_score' },
    //     ],
    //     interventions: [
    //       {
    //         id: '1',
    //         name: 'Test 1',
    //         type: 'Type 1',
    //         status: 'Complete',
    //         international: '2',
    //         national: '3',
    //         subnational: '4',
    //         category_score: '5'
    //       },
    //       {
    //         id: '1',
    //         name: 'Test 1',
    //         type: 'Type 1',
    //         status: 'Complete',
    //         international: '2',
    //         national: '3',
    //         subnational: '4',
    //         category_score: '5'
    //       },
    //     ],
    //     order: 1
    //   },
    //   {
    //     comaparison_type: 'SCALE COMPARISON',
    //     col_set_1: [
    //       { label: 'INTERVENTION INFORMATION', colspan: 4 },
    //       { label: 'GHG', colspan: 1 },
    //       { label: 'SDG-NO POVERTY', colspan: 1 },
    //       { label: 'ADAPTATION', colspan: 1 },
    //       { label: '', colspan: 1 }
    //     ],
    //     col_set_2: [
    //       { label: 'ID', code: 'id' },
    //       { label: 'INTERVENTION NAME', code: 'name' },
    //       { label: 'INTERVENTION TYPE', code: 'type' },
    //       { label: 'STATUS', code: 'status' },
    //       { label: 'CATEGORY SCORE', code: 'ghg_score' },
    //       { label: 'CATEGORY SCORE', code: 'sdg_no_poverty_score' },
    //       { label: 'CATEGORY SCORE', code: 'adaption_score' },
    //       { label: 'CATEGORY SCORE', code: 'category_score' },
    //     ],
    //     interventions: [
    //       {
    //         id: '1',
    //         name: 'Test 1',
    //         type: 'Type 1',
    //         status: 'Complete',
    //         ghg_score: '2',
    //         sdg_no_poverty_score: '3',
    //         adaption_score: '4',
    //         category_score: '5'
    //       },
    //       {
    //         id: '1',
    //         name: 'Test 1',
    //         type: 'Type 1',
    //         status: 'Complete',
    //         ghg_score: '2',
    //         sdg_no_poverty_score: '3',
    //         adaption_score: '4',
    //         category_score: '5'
    //       }
    //     ],
    //     order: 2
    //   }
    // ]

    // this.aggregation_data = {
    //   col_set_1: [
    //     { label: 'INTERVENTION INFORMATION', colspan: 4 },
    //     { label: '', colspan: 1 }
    //   ],
    //   col_set_2: [
    //     { label: 'ID', code: 'id' },
    //     { label: 'INTERVENTION NAME', code: 'name' },
    //     { label: 'INTERVENTION TYPE', code: 'type' },
    //     { label: 'STATUS', code: 'status' },
    //     { label: 'GHG MITIGATION (MT CO2-EG)', code: 'mitigation' },
    //   ],
    //   interventions: [
    //     {
    //       id: '1',
    //       name: 'Test 1',
    //       type: 'Test 1',
    //       status: 'Complete',
    //       mitigation: 12234
    //     }
    //   ],
    //   total: 23423423
    // }
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

    this.alignment_data = {
      col_set_1: [
        { label: "INTERVENTION INFORMATION", colspan: 4 },
        { label: '', colspan: 1 },
        { label: '', colspan: 1 },
        { label: '', colspan: 1 }
      ],
      col_set_2: [
        { label: 'ID', code: 'id' },
        { label: 'INTERVENTION NAME', code: 'name' },
        { label: 'INTERVENTION TYPE', code: 'type' },
        { label: 'STATUS', code: 'status' },
        { label: 'SDG 1', code: 'SDG1' },
        { label: 'SDG 2', code: 'SDG2' },
        { label: 'SDG 3', code: 'SDG3' },
      ],
      interventions: [
        {
          id: '1',
          name: 'Test 1',
          type: 'Test 1',
          status: 'Complete',
          SDG1: 'Yes',
          SDG2: 'Yes',
          SDG3: 'Yes'
        }
      ],
      sdg_count: 3
    }
  }


}
