import { Component, ElementRef, OnInit ,ViewChild } from '@angular/core';
import { Chart, ChartType, registerables } from 'chart.js';
import { Assessment, AssessmentCMDetailControllerServiceProxy, ClimateAction, InvestorToolControllerServiceProxy, ProjectControllerServiceProxy } from 'shared/service-proxies/service-proxies';
import * as pluginDataLabels from 'chartjs-plugin-datalabels';
import decode from 'jwt-decode';
import { AppService, LoginRole, RecordStatus } from 'shared/AppService';
import { MasterDataService } from 'app/shared/master-data.service';
import { Paginator } from 'primeng/paginator';
import { LazyLoadEvent } from 'primeng/api';
import { OverlayPanel } from 'primeng/overlaypanel';

@Component({
  selector: 'app-investment-dashboard',
  templateUrl: './investment-dashboard.component.html',
  styleUrls: ['./investment-dashboard.component.css','../portfolio-dashboard/portfolio-dashboard.component.css']
})
export class InvestmentDashboardComponent implements OnInit {
  canvas: any;
  ctx: any;
 


  @ViewChild('investmentSDGsPieChart')
  canvasRefSDGsPieChart: ElementRef<HTMLCanvasElement>;


  @ViewChild('investmentSectorCountPieChart')
  canvasRefSectorCountPieChart: ElementRef<HTMLCanvasElement>;
  
  @ViewChild('op') op: OverlayPanel;

  interventions:any[]=[];
  investment:number[]=[];
  tc:number[]=[];
  tcLables:string[]=[]
  chart: any = [];

  userName: string = "";
 userRole: string = "";
 loginRole = LoginRole;
  pieChart2:Chart;
  pieChart1:Chart;

  slicedData:{
    assessment: number,
    process_score: number,
    outcome_score: number,
    intervention: string
  }[]=[];
  tcData: {
    x:number,
    y:number,
    data:string,
  }[]=[];
  sectorCount: {
    sector:string,
    count:number
    }[];


  averageTCValue:any;
  calResults: any;
  resultData : any = []
  resultData2 : any = []
  recentResult : any ;
  loading:boolean=false;
  tableData:any[]=[]
  pointTableDatas:Assessment[]=[]
  totalRecords: number = 0;
  xData: {label: string; value: number}[]
  yData: {label: string; value: number}[]
  rows :number;
  score={
    process_score: [], outcome_score: [] 
  }
  sdgDetailsList:any=[];
  constructor(
    private projectProxy: ProjectControllerServiceProxy,
    private investorProxy: InvestorToolControllerServiceProxy,
    private assessmentCMProxy:AssessmentCMDetailControllerServiceProxy,
    public masterDataService: MasterDataService
  ) {
    Chart.register(...registerables);
  
  }

  ngOnInit(): void {
    this.averageTCValue =75
    let tool ='Investment & Private Sector Tool'

    const token = localStorage.getItem('ACCESS_TOKEN')!;
    const tokenPayload = decode<any>(token);
    this.userRole = tokenPayload.role.code;
  
    this.xData = this.masterDataService.xData
    this.yData = this.masterDataService.yData
    this.investorProxy.findSectorCount(tool).subscribe((res: any) => {
      this.sectorCount = res
      console.log("sectorcount",this.sectorCount)
      setTimeout(() => {
       
        this.viewSecterTargetedPieChart();
      }, 100);
     
    });
    

    this.investorProxy.calculateAssessmentResults(tool).subscribe((res: any) => {
      this.calResults = res[0]
      console.log("assessdetails",this.calResults)
      const RecentInterventions = this.calResults.slice(0,10);
      this.recentResult = RecentInterventions


    });
    let event: any = {};
    event.rows = this.rows;
    event.first = 0;
    this.loadgridData(event);
    this.sdgResults();

  }
  loadgridData = (event: LazyLoadEvent) => {
    console.log('event Date', event);
    this.loading = true;
    this.totalRecords = 0;

    let pageNumber =
      event.first === 0 || event.first === undefined
        ? 1
        : event.first / (event.rows === undefined ? 1 : event.rows) + 1;
    this.rows = event.rows === undefined ? 10 : event.rows;
    this.investorProxy.getDashboardData(pageNumber,this.rows).subscribe((res) => {
      this.tableData=res.items;
      console.log("kkkkk : ", res)
      this.totalRecords= res.meta.totalItems
      this.loading = false;
    }, err => {
      this.loading = false;});

  
  };
  sdgResults(){
    this.sdgDetailsList=[]
    this.investorProxy.sdgSumCalculate('Investment & Private Sector Tool').subscribe(async (res: any) => {
      console.log("sdgDetailsList : ", res)
      this.sdgDetailsList = res;
     this.viewFrequencyofSDGsChart();
     });
  }

  viewFrequencyofSDGsChart(){
    let labels = this.sdgDetailsList.map((item:any) => 'SDG ' + item.number + ' - ' + item.sdg);
    let counts:number[] = this.sdgDetailsList.map((item:any) => item.count);
    let total = counts.reduce((acc, val) => acc + val, 0);
    let percentages = counts.map(count => ((count / total) * 100).toFixed(2));

    if (!this.canvasRefSDGsPieChart) {
      console.error('Could not find canvas element');
      return;
    }

    const canvas = this.canvasRefSDGsPieChart.nativeElement;
    const ctx = canvas.getContext('2d');

    if (!ctx) {
      console.error('Could not get canvas context');
      return;
    }

    if (this.pieChart1) {
      // Update the chart data
      this.pieChart1.data.datasets[0].data = counts;
      this.pieChart1.data.labels=labels
      this.pieChart1.update();
    }
    else{


    this.pieChart1 =new Chart(ctx, {
      type: 'pie' as ChartType,

      data: {
        labels: labels,
        datasets: [{
          data: counts,
          backgroundColor: [
            'rgba(153, 102, 255, 1)',
            'rgba(75, 192, 192,1)',
            'rgba(54, 162, 235, 1)',
            'rgba(123, 122, 125, 1)',
            'rgba(255, 99, 132, 1)',
            'rgba(255, 205, 86, 1)',
            'rgba(255, 99, 132, 1)',

          ],
         
        }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins:{
          legend:{
            position: 'bottom',
            labels: {
              padding: 20
            }
          },
          datalabels: {
            color: '#fff',
            font: {
              size: 12
            },
            formatter: (value, ctx) => {
              const label = ctx.chart.data.labels![ctx.dataIndex];
              const percentage = percentages[ctx.dataIndex];
              return `${label}: ${value} (${percentage}%)`;
            },

          },
          tooltip:{
            position:'average',
            boxWidth:10,
            callbacks:{
              
              label:(ctx)=>{ 
                // console.log(ctx)
                // let sum = ctx.dataset._meta[0].total;
                // let percentage = (value * 100 / sum).toFixed(2) + "%";
                // return percentage;
                let sum = 0;
                let array =counts
                array.forEach((number) => {
                  sum += Number(number);
                });
                // console.log(sum, counts[ctx.dataIndex])
                let percentage = (counts[ctx.dataIndex]*100 / sum).toFixed(2)+"%";

                return[
                  `SDG: ${labels[ctx.dataIndex]}`,
                  `Count: ${counts[ctx.dataIndex]}`,
                  `Percentage: ${percentage}`
                ];
               }
            },
            backgroundColor: 'rgba(0, 0, 0, 0.8)', // Set the background color of the tooltip box
              titleFont: {
                size: 14,
                weight: 'bold'
              },
              bodyFont: {
                size: 14
              },
              displayColors: true, // Hide the color box in the tooltip
              bodyAlign: 'left'
          }
       }

      },

  });}

  }

  viewSecterTargetedPieChart(){
    const labels = this.sectorCount.map((item) => item.sector);
    let counts:number[] = this.sectorCount.map((item) => item.count);
    const total = counts.reduce((acc, val) => acc + val, 0);
    const percentages = counts.map(count => ((count / total) * 100).toFixed(2));
    if (!this.canvasRefSectorCountPieChart) {
      console.error('Could not find canvas element');
      return;
    }

    const canvas = this.canvasRefSectorCountPieChart.nativeElement;
    const ctx = canvas.getContext('2d');

    if (!ctx) {
      console.error('Could not get canvas context');
      return;
    }

    if (this.pieChart2) {
      // Update the chart data
      this.pieChart2.data.datasets[0].data = counts;
      this.pieChart2.data.labels=labels
      this.pieChart2.update();
    }
    else{
    this.pieChart2 =new Chart(ctx, {
      type: 'pie' as ChartType,

      data: {
        labels: labels,
        datasets: [{
          data: counts,
          backgroundColor: [
            'rgb(250,227,114)',
              'rgb(51,51,51)',
              'rgb(0,170,187)',
              'rgb(227,120,42)',
              'rgb(150,131,141)',
              'rgb(42,61,227)',
              'rgba(153, 102, 255, 1)',
              'rgba(75, 192, 192,1)',
              'rgba(54, 162, 235, 1)',
              'rgba(123, 122, 125, 1)',
              'rgba(255, 99, 132, 1)',
              'rgba(255, 205, 86, 1)',
              'rgba(255, 99, 132, 1)',

          ],
         
        }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins:{
          legend:{
            position: 'bottom',
            labels: {
              padding: 20
            }
          },
          datalabels: {
            color: '#fff',
            font: {
              size: 12
            },
            formatter: (value, ctx) => {
              const label = ctx.chart.data.labels![ctx.dataIndex];
              const percentage = percentages[ctx.dataIndex];
              return `${label}: ${value} (${percentage}%)`;
            },

          },
          tooltip:{
            position:'average',
            boxWidth:10,
            callbacks:{
              
              label:(ctx)=>{ 
                // console.log(ctx)
                // let sum = ctx.dataset._meta[0].total;
                // let percentage = (value * 100 / sum).toFixed(2) + "%";
                // return percentage;
                let sum = 0;
                let array =counts
                array.forEach((number) => {
                  sum += Number(number);
                });
                // console.log(sum, counts[ctx.dataIndex])
                let percentage = (counts[ctx.dataIndex]*100 / sum).toFixed(2)+"%";

                return[
                  `Sector: ${labels[ctx.dataIndex]}`,
                  `Count: ${counts[ctx.dataIndex]}`,
                  `Percentage: ${percentage}`
                ];
               }
            },
            backgroundColor: 'rgba(0, 0, 0, 0.8)', // Set the background color of the tooltip box
              titleFont: {
                size: 14,
                weight: 'bold'
              },
              bodyFont: {
                size: 14
              },
              displayColors: true, // Hide the color box in the tooltip
              bodyAlign: 'left'
          }
       }

      },

  });}

  }
  getRandomColors(count: number): string[] {
    const colors: string[] = [];
    for (let i = 0; i < count; i++) {
      const randomColor = '#' + Math.floor(Math.random() * 16777215).toString(16);
      colors.push(randomColor);
    }
    return colors;
  }
  ngAfterViewInit() {

}
 getBackgroundColor(value: number): string {
    switch (value) {
      case -3:
        return '#ec6665';
      case -2:
        return '#ed816c';
      case -1:
        return '#f19f70';
      case 0:
        return '#f4b979';
      case 1:
        return '#f9d57f';
      case 2:
        return '#fcf084';
      case 3:
        return '#e0e885';
      case 4:
        return '#c1e083';
      case 5:
        return '#a3d481';
      case 6:
        return '#84cc80';
      case 7:
        return '#65c17e';
      default:
        return 'white';
    }
  }

  getDotColor(value: number): string {
    switch (value) {
      case -3:
        return '#004040';
      case -2:
        return '#00A0A0';
      case -1:
        return '#FFD700';
      case 0:
        return '#0080FF';
      case 1:
        return '#FF4136';
      case 2:
        return '#8000FF';
      case 3:
        return '#800000';
      case 4:
        return '#FF0000';
      case 5:
        return '#FF8000';
      case 6:
        return '#FFD700';
      case 7:
        return '#808000';
      default:
        return 'white';
    }
  }

  getIntervention(x:number, y: number){
    return this.tableData.some(item => item.outcome_score === x && item.process_score === y);
   

  }

enterHeatMapPoint(x:number, y: number,event:any){


  this.pointTableDatas=this.tableData.filter(item=> item.outcome_score === x && item.process_score === y)
  if(this.pointTableDatas.length>0){
    this.op.show(event);
  }

}
  leaveHeatMapPoint(){
 
     this.pointTableDatas=[];

  }

}
