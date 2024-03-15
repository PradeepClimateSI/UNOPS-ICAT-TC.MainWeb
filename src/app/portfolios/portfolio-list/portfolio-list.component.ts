import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { GuidanceVideoComponent } from 'app/guidance-video/guidance-video.component';
import { DialogService } from 'primeng/dynamicdialog';
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
    protected dialogService: DialogService,
  ) { }

  portfolioList : any= [];

  ngOnInit(): void {

    this.portfolioServiceProxy.getAll().subscribe(async (res: any) => {
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
      this.router.navigate(['app/portfolio-view'], { queryParams: { id: portfolio.id } });

  }

  watchVideo(){
    let ref = this.dialogService.open(GuidanceVideoComponent, {
      header: 'Guidance Video',
      width: '60%',
      contentStyle: {"overflow": "auto"},
      baseZIndex: 10000,
      data: {
        sourceName: 'Portfolios',
      },
    });

    ref.onClose.subscribe(() => {
      
    })
  }
}
