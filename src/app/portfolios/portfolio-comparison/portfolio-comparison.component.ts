import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { PortfolioControllerServiceProxy } from 'shared/service-proxies/service-proxies';

@Component({
  selector: 'app-portfolio-comparison',
  templateUrl: './portfolio-comparison.component.html',
  styleUrls: ['./portfolio-comparison.component.css']
})
export class PortfolioComparisonComponent implements OnInit{
  portfolioId: number;
  assessmentList: any[];
  portfolio: any;
  card: any = [];
  noOfAssessments: any;

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
    });
  }

  async getAssessmentsByPortfolio(){
    this.assessmentList  = await this.portfolioServiceProxy.assessmentsByPortfolioId(this.portfolioId).toPromise()
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
        { title: 'Link to previous assessment', data: 'Link'},
        { title: 'Objective(s) of the assessment', data: this.portfolio.objectives },
        { title: 'Intended audience(s) of the assessment', data: this.portfolio.audience },
        { title: 'Number of Assessments', data: await this.noOfAssessments }
      ])
  }

  
}
