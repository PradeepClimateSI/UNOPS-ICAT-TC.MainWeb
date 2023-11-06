import { AfterViewInit, ChangeDetectorRef, Component, ElementRef, HostListener, OnInit, Renderer2, ViewChild } from '@angular/core';
import { HeatMapScore, TableData } from 'app/charts/heat-map/heat-map.component';
import { MasterDataService } from 'app/shared/master-data.service';
import { Chart, ChartType } from 'chart.js';
import { LazyLoadEvent } from 'primeng/api';
import { OverlayPanel } from 'primeng/overlaypanel';
import { Paginator } from 'primeng/paginator';
import { Assessment, InvestorToolControllerServiceProxy, MethodologyAssessmentControllerServiceProxy, PortfolioControllerServiceProxy } from 'shared/service-proxies/service-proxies';

@Component({
  selector: 'app-portfolio-dashboard',
  templateUrl: './portfolio-dashboard.component.html',
  styleUrls: ['./portfolio-dashboard.component.css']
})
export class PortfolioDashboardComponent implements OnInit,AfterViewInit {
  loading: boolean;
  totalRecords: number;
  heatMapScore: HeatMapScore[];
  heatMapData: TableData[];


  constructor(
    private methassess: MethodologyAssessmentControllerServiceProxy,
    private investorProxy: InvestorToolControllerServiceProxy,
    private portfolioServiceProxy : PortfolioControllerServiceProxy,
    public masterDataService: MasterDataService,
    private cdr: ChangeDetectorRef,
    private renderer: Renderer2
  ) {
    this.test= [{data: 'AAA', x:2,y:3}, {data: 'BBB', x:3,y:3},{data: 'CCC', x:4,y:4}]
  }
  test :any = []

  @ViewChild('portfolioBarChart')
  canvasRefBarChart: ElementRef<HTMLCanvasElement>;
  @ViewChild('portfolioSDGsPieChart')
  canvasRefSDGsPieChart: ElementRef<HTMLCanvasElement>;


  @ViewChild('portfolioSectorCountPieChart')
  canvasRefSectorCountPieChart: ElementRef<HTMLCanvasElement>;
  @ViewChild('op') op: OverlayPanel;
  @ViewChild('sourceDiv', { read: ElementRef }) sourceDiv: ElementRef;
  @ViewChild('targetDiv', { read: ElementRef }) targetDiv: ElementRef;
  @ViewChild('targetDiv2', { read: ElementRef }) targetDiv2: ElementRef;
  targetDivHeight: any;
  tableData:any[]=[]
  pointTableDatas:Assessment[]=[]
  chart: Chart;
  chart2: Chart;
  tool : string;
  resultData : any = []
  resultData2 : any = []
  calResults: any;
  portfolioList : any= [];

  recentResult : any ;

  averageTCValue:any;
  selectedPortfolio : any

  processData: any = [];
  outcomeData: any[] = [];
  outcomeData2: any[] = [];
  allData : any = [];
  rows :number;
  loadSelectedTable : boolean = false;
  pieChart2: any;
  slicedData:{
    assessment: number,
    process_score: number,
    outcome_score: number,
    intervention: string
  }[]=[];
  /////
  portfolioSDGsPieChart:Chart;
  sectorCountPieChart:Chart;
  portfolioBarChart:Chart;
  barChartData:any=[];
  sdgDetailsList:any=[];
  loadLast2graphs:boolean=false;

  sectorCount: {
    sector:string,
    count:number
    }[];
  xData: {label: string; value: number}[]
  yData: {label: string; value: number}[]
  async ngOnInit(): Promise<void> {
    this.xData = this.masterDataService.xData
    this.yData = this.masterDataService.yData
    this.loadSelectedTable = false;
    this.loadSelectedTable =false;
    this.averageTCValue =63.78
    this.tool = 'PORTFOLIO'
  

  


    this.portfolioServiceProxy.getAll().subscribe(async (res: any) => {
      console.log("assesss : ", res)
      this.portfolioList = res;
     });

    

     this.getSectorCount(this.tool);
    //  this.sdgResults()
  
  }
  ngAfterViewInit(): void {
    this.cdr.detectChanges();
    // this.updateSourceDivHeight();
  }
  @HostListener('window:resize', ['$event'])
  onResize(event: Event): void {
    this.updateSourceDivHeight();
  }
  updateSourceDivHeight(): void {
    // console.log(".....",this.barChartData)
    if(this.barChartData.length==0){
      console.log(".....",this.barChartData)
      this.targetDivHeight = this.targetDiv.nativeElement.offsetHeight;
      this.renderer.setStyle(this.canvasRefSDGsPieChart.nativeElement, 'height', `400px`);
      this.renderer.setStyle(this.sourceDiv.nativeElement, 'height', `${this.targetDivHeight}px`);
      this.renderer.setStyle(this.sourceDiv.nativeElement, 'overflow-y', 'auto');
      this.cdr.detectChanges();
    }
    else{
      let newHeight = 250;
      // console.log(".....",this.barChartData)
      this.renderer.setStyle(this.canvasRefSDGsPieChart.nativeElement, 'height', `${newHeight}px`);
      
      // this.renderer.setStyle(this.sourceDiv.nativeElement, 'height', `${this.targetDivHeight}px`);
      // this.renderer.setStyle(this.sourceDiv.nativeElement, 'overflow-y', 'auto');
    }
   
  }


  goToFunction(){
this.selectedPortfolio = ''
this.loadLast2graphs=false;
 this.getSectorCount(this.tool);
this.selectPortfolio();
  }

  selectPortfolio(){
    console.log("portfolio : ", this.selectedPortfolio)

    this.sdgDetailsList=[];
    this.barChartData=[];


    let event: any = {};
    event.rows = this.rows;
    event.first = 0;
    this.loadgridData(event);

    
   
   if(this.selectedPortfolio){
    this.portfolioServiceProxy.assessmentsDataByAssessmentId(this.selectedPortfolio?this.selectedPortfolio.id:0).subscribe(async (res: any) => {
      console.log("arrayyy : ", res)
      
      this.barChartData=res;
      setTimeout(() => {
      this.viewPortfolioBarChart();
      this.updateSourceDivHeight()
   this.sdgResults()
    },300)
   


    });
   }


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
    this.portfolioServiceProxy.getDashboardData(this.selectedPortfolio?this.selectedPortfolio.id:0,pageNumber,this.rows).subscribe((res) => {
      this.tableData=res.items;
      this.heatMapScore = this.tableData.map(item => {return {processScore: item.process_score, outcomeScore: item.outcome_score}})
      this.heatMapData = this.tableData.map(item => {return {interventionId: item.climateAction?.intervention_id, interventionName: item.climateAction?.policyName, processScore: item.process_score, outcomeScore: item.outcome_score}}) 
      console.log("kkkkk : ", res, this.heatMapData)
      this.totalRecords= res.meta.totalItems
      this.loading = false;
    }, err => {
      this.loading = false;});

  
  };

 async getSectorCount(tool:string){
    this.investorProxy.findSectorCount(tool).subscribe((res: any) => {
      this.sectorCount = res
      console.log("sectorcount",this.sectorCount)
   
      setTimeout(() => {
        this.viewPortfolioSectorCountPieChart();
        this.updateSourceDivHeight();
      }, 20);
      
      this.sdgResults()
     
     
    });
  }


  async sdgResults(){
    this.sdgDetailsList=[]
    this.portfolioServiceProxy.sdgSumCalculate(this.selectedPortfolio?this.selectedPortfolio.id:0).subscribe(async (res: any) => {
      console.log("sdgDetailsList : ", res)
      this.sdgDetailsList = res;
      setTimeout(() => {
     this.viewPortfolioSDGsPieChart();
      },200);
     });
  }


  getColorClass(value: any) {
    let value2 = Number(value)
    if (value2 == 0) {
      return 'color-class-1';
    } else if (value2 == 1) {
      return 'color-class-2';
    } else if (value2 == 2 ) {
      return 'color-class-3';
   } else {
      return 'default-color-class';
    }
  }

  getColorClass2(value: any) {
    let value2 = Number(value)
    if (value2 == 0) {
      return 'color-class-21';
    } else if (value2 == 1) {
      return 'color-class-22';
    } else if (value2 == 2) {
      return 'color-class-23';
    }
    else if (value2 == 3) {
      return 'color-class-24';
    }
    else if (value2 == 4) {
      return 'color-class-25';
    }
    else {
      return 'default-color-class';
    }
  }

  getColorClass3(value: any) {
    let value2 = Number(value)
    if (value2 == -1) {
      return 'color-class-31';
    } else if (value2 == 0) {
      return 'color-class-32';
    } else if (value2 == 1) {
      return 'color-class-33';
    }
    else if (value2 == 2) {
      return 'color-class-34';
    }
    else if (value2 == 3) {
      return 'color-class-35';
    }
    else {
      return 'default-color-class';
    }
  }

 




  viewPortfolioSDGsPieChart(){
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

    if (this.portfolioSDGsPieChart) {
      // Update the chart data
      this.portfolioSDGsPieChart.data.datasets[0].data = counts;
      this.portfolioSDGsPieChart.data.labels=labels
      this.portfolioSDGsPieChart.update();
    }
    else{
      this.portfolioSDGsPieChart =new Chart(ctx, {
        type: 'pie'as ChartType,

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
              'rgba(70, 51, 102, 1)',
              'rgba(40, 102, 102, 1)',
              'rgba(27, 74, 107, 1)',
              'rgba(75, 74, 77, 1)',
              'rgba(121, 27, 53, 1)',
              'rgba(121, 98, 20, 1)',
              'rgba(51, 0, 51, 1)',
              'rgba(25, 25, 112, 1)',
              'rgba(139, 0, 0, 1)',
              'rgba(0, 0, 139, 1)',
              'rgba(47, 79, 79, 1)',
              'rgba(139, 69, 19, 1)'

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
                 
                  let sum = 0;
                  let array =ctx.dataset.data
                  array.forEach((number) => {
                    sum += Number(number);
                  });
              
                  let percentage = (ctx.parsed/ sum*100).toFixed(2)+"%";

                  return[
                    `SDG: ${ctx.label}`,
                    `Count: ${ctx.raw}`,
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

    });
    }


  }
  viewPortfolioSectorCountPieChart(){
    let labels = this.sectorCount.map((item:any) => item.sector);
    let counts:number[] = this.sectorCount.map((item:any) => item.count);
    let total = counts.reduce((acc, val) => acc + val, 0);
    let percentages = counts.map(count => ((count / total) * 100).toFixed(2));

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

  
      this.sectorCountPieChart =new Chart(ctx, {
        type: 'pie'as ChartType,

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
              
                  let sum = 0;
                  let array =ctx.dataset.data
                  array.forEach((number) => {
                    sum += Number(number);
                  });
                 
                  let percentage = (ctx.parsed/ sum*100).toFixed(2)+"%";

                  return[
                    `Sector: ${ctx.label}`,
                    `Count: ${ctx.raw}`,
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

    });
  



  }
  viewPortfolioBarChart(){

    let label =this.barChartData.map((item:any) => item?.assessment?.climateAction?.policyName );
    let data =this.barChartData.map((item:any) => item.ghgValue?item.ghgValue:0);
    console.log("label",label,"data",data)


    if (!this.canvasRefBarChart) {
      console.error('Could not find canvas element');
      return;
    }

    const canvas = this.canvasRefBarChart.nativeElement;
    const ctx = canvas.getContext('2d');

    if (!ctx) {
      console.error('Could not get canvas context');
      return;
    }

    // if (this.portfolioBarChart) {
    //   // Update the chart data
    //   this.portfolioBarChart.data.datasets[0].data = data;
    //   this.portfolioBarChart.data.labels=label;
    //   this.portfolioBarChart.update();
    // }
    // else{
      if (this.portfolioBarChart) {
        this.portfolioBarChart.destroy();
       
    } 
      this.portfolioBarChart =new Chart(ctx, {
        type: 'bar',

        data: {
          labels: label,
          datasets: [{
            label: 'Bar Chart',
            data: data,
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
            borderColor:[
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
              'rgba(255, 99, 132, 1)',],

            borderWidth: 1
          }]
        },
        options:{
          scales: {
            x: {
              ticks: {
                callback: function(value:any, index, values) {
                  return value.length > 10 ? value.substring(0, 10) + '...' : value;
                },
                maxRotation: 90,

              },
              beginAtZero: true,
              title: {
                display: true,
                text: 'Interventions',
                font: {
                  size: 16,
                  weight: 'bold',

                }
              },

            },
            y: {
              beginAtZero: true,
              title: {
                display: true,
                text: 'Expected GHG reductions over intervention lifetime (Mt CO2-eq)',
                font: {
                  size: 10,
                  weight: 'bold',

                }
              }
            }
          },
          plugins:{
            legend: {
              display: false
            },
            tooltip:{
              position:'average',
              boxWidth:10,
              callbacks:{

                label:(context)=>{
                  // console.log("context",context,"4444",data[context.dataIndex])
                  return[

                    `Expected GHG reductions over intervention lifetime  (Mt CO2-eq): ${context.raw}`,
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

        }
    });

  // }


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
    return  this.tableData.some(item => item.outcome_score === x && item.process_score === y);


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
