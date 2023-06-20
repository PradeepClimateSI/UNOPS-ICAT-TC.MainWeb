import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { PortfolioControllerServiceProxy } from 'shared/service-proxies/service-proxies';

@Component({
  selector: 'app-portfolio-list',
  templateUrl: './portfolio-list.component.html',
  styleUrls: ['./portfolio-list.component.css']
})
export class PortfolioListComponent implements OnInit {

  constructor(
    private router: Router,
    private portfolioServiceProxy : PortfolioControllerServiceProxy,
  ) { }

  portfolioList : any= [];

  ngOnInit(): void {

    this.portfolioServiceProxy.getAll().subscribe(async (res: any) => {
      console.log("assesss : ", res)
      this.portfolioList = res;
     });

  }

  addPortfolios(){
      this.router.navigate(['/app/portfolio-add'],);
  }

  onInput(event: any, dt: any) {
    const value = event.target.value;
    dt.filterGlobal(value, 'contains');
  }


  viewPortfolio(portfolio : any){
    console.log("mmm : ", portfolio)

      this.router.navigate(['app/portfolio-view'], { queryParams: { id: portfolio.id } });
      console.log('hit', portfolio.id);

  }
}
