import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { Chart } from 'chart.js';
import { LazyLoadEvent } from 'primeng/api';
import { Subscription } from 'rxjs';
import { CountryControllerServiceProxy, ProjectControllerServiceProxy } from 'shared/service-proxies/service-proxies';
import decode from 'jwt-decode';
import { AppService, LoginRole, RecordStatus } from 'shared/AppService';
@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent implements OnInit {

  togglemenu: boolean = true;
  innerWidth = 0;

  clickcarbon: boolean = false;
  clickInvest: boolean = false;
  clickpor: boolean = false;

  isInvesmentTool : boolean = false;
  isCarbonMarketTool : boolean = false;
  isPortfolioTool : boolean = false;

  indtituteadmin: boolean = false;
  userType: string = "countryAdmin";
  countryAdmin : boolean = false;
  data: any;
  activeprojects=["vv","df","d","d"];
  loading: boolean =false;
  totalRecords: number = 0;
  rows: number = 10;
  last: number;
  event: any;
  chartOptions: any;
  searchBy: any = {
    text: null,
    sector: null,
    NDC: null,
    subNDC: null,
  };
  sectorList: string[] = [];
  subscription: Subscription;
  public i:number = 0;
  public id:string ='chart-container';
  public chartData: Object[];
  public marker: Object;
  public title: string;
  public items:any =[];
  userName: string = "";
  userRole: string = "";
  loginRole = LoginRole;
  typeofInterventionCount:  {
    name:string,
    count:number
    }[];

    chart: any = [];
    pieChart:any=[];


  options: any;

  SelectedTool : number;
  

  data1: { labels: string[]; datasets: { label: string; data: number[]; fill: boolean; borderColor: string; }[]; };
  constructor(
    private router: Router,
    private projectProxy: ProjectControllerServiceProxy,
    private countryProxy: CountryControllerServiceProxy,
  ) {}

  ngOnInit(): void {

    const token = localStorage.getItem('ACCESS_TOKEN')!;
    const tokenPayload = decode<any>(token);
    // this.userName = tokenPayload.username;
    // this.userName = `${this.appService.getUserName()}`;
    this.userRole = tokenPayload.role.code;
    console.log("++++++++++++++++++",tokenPayload);

    this.countryProxy.getCountry(tokenPayload.countryId).subscribe((res:any)=>{
      console.log('Countryy',res) 
      this.isCarbonMarketTool = res.carboneMarketTool;
      this.isInvesmentTool = res.investmentTool;
      this.isPortfolioTool = res.portfoloaTool;    
      
      console.log('tooll22',this.isCarbonMarketTool,this.isInvesmentTool,this.isPortfolioTool)

      if(this.userRole !=this.loginRole.External){
        if(this.isCarbonMarketTool){
           this.goToCarbonMarket()
         } else if(this.isInvesmentTool){
           this.goToInvestment();
         } else if (this.isPortfolioTool){
           this.goToPortfolio();
         }
      }else{
        this.clickcarbon = true;
        this.SelectedTool = 3;
      }
      
        
      
      
    })

    this.projectProxy.findTypeofAction().subscribe((res: any) => {
      this.typeofInterventionCount = res;
      console.log("typeofInterventionCount", res);
      this.loading =true
      setTimeout(() => {
        this.viewPieChart();
        this.viewbarChart();
      }, 200);
      
      
    });

   // this.SelectedTool = 3;

  }



  goToInvestment(){
    this.clickcarbon = false;
    this.clickInvest = true;
    this.clickpor= false;
   // this.router.navigate(['/app/investment-dashboard'],);

   this.SelectedTool =1;
  }

  goToPortfolio(){
    this.clickcarbon = false;
    this.clickInvest = false;
    this.clickpor= true;
    //this.router.navigate(['/app/portfolio-dashboard'],);
    this.SelectedTool = 2
  }

  goToCarbonMarket(){
    this.clickcarbon = true;
    this.clickInvest = false;
    this.clickpor= false;
    //this.router.navigate(['/app/carbon-dashboard'],);
    this.SelectedTool = 3
  }


  viewbarChart() {
    const documentStyle = getComputedStyle(document.documentElement);
    const textColor = documentStyle.getPropertyValue('--text-color');
    const textColorSecondary = documentStyle.getPropertyValue('--text-color-secondary');
    const surfaceBorder = documentStyle.getPropertyValue('--surface-border');
    const labels = this.typeofInterventionCount.map((item) => item.name);
    const counts: number[] = this.typeofInterventionCount.map((item) => item.count);

    this.data = {
      labels: labels,
      datasets: [
        {
          label: 'Type of Interventions',
          backgroundColor: ['#FF6384', '#36A2EB', '#FFCE56', '#66BB6A', '#FF7043', '#9575CD'],
          data: counts,
        },
      ],
    };

    this.options = {
      indexAxis: 'y',
      maintainAspectRatio: false,
      aspectRatio: 1.1,
      plugins: {
        legend: {
          display: false, // Set display to false to remove the legend
          labels: {
            color: textColor,
          },
        },
        tooltip: {
          callbacks: {
            label: (context: { raw: any; }) => {
              const count = context.raw;
              return `Count: ${count}`;
            },
          },
        },
      },
      scales: {
        x: {
          ticks: {
            color: textColorSecondary,
            font: {
              weight: 500,
            },
            stepSize: 1, // Set the step size to 1 to show only integer values
          },
          title: {
            display: true,
            text: 'Number of Interventions', // Set the X-axis label
            color: textColorSecondary,
            font: {
              weight: 'bold',
            },
          },
          grid: {
            color: surfaceBorder,
            drawBorder: false,
          },
        },
        y: {
          ticks: {
            color: textColorSecondary,
          },
          grid: {
            display: false, // Set display to false to remove horizontal grid lines
          },
        },
      },
    };
  }

  viewPieChart() {
    const labels = this.typeofInterventionCount.map((item) => item.name);
    let counts: number[] = this.typeofInterventionCount.map((item) => item.count);
    const total = counts.reduce((acc, val) => acc + val, 0);
    const percentages = counts.map((count) => ((count / total) * 100).toFixed(2));
    this.pieChart = new Chart('pieChart', {
      type: 'doughnut',
      data: {
        labels: labels,
        datasets: [
          {
            data: counts,
            backgroundColor: ['#FF6384', '#36A2EB', '#FFCE56', '#66BB6A', '#FF7043', '#9575CD'],
          },
        ],
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: {
            display: false, // Set display to false to remove the legend
          },
          datalabels: {
            color: '#fff',
            font: {
              size: 12,
            },
            formatter: (value, ctx) => {
              const label = ctx.chart.data.labels![ctx.dataIndex];
              const percentage = percentages[ctx.dataIndex];
              return `${label}: ${value} (${percentage}%)`;
            },
          },
          tooltip: {
            position: 'average',
            boxWidth: 10,
            callbacks: {
              label: (ctx) => {
                let sum = 0;
                let array = counts;
                array.forEach((number) => {
                  sum += Number(number);
                });
                let percentage = (counts[ctx.dataIndex] * 100 / sum).toFixed(2) + "%";
                return [
                  `Intervention: ${labels[ctx.dataIndex]}`,
                  `Count: ${counts[ctx.dataIndex]}`,
                  `Percentage: ${percentage}`,
                ];
              },
            },
            backgroundColor: 'rgba(0, 0, 0, 0.8)', // Set the background color of the tooltip box
            titleFont: {
              size: 14,
              weight: 'bold',
            },
            bodyFont: {
              size: 14,
            },
            displayColors: true, // Hide the color box in the tooltip
            bodyAlign: 'left',
          },
        },
      },
    });
  }

}
