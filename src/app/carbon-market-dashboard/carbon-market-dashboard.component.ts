import { AfterViewInit, ChangeDetectorRef, Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { Chart, ChartType } from 'chart.js';
import { AssessmentCMDetailControllerServiceProxy, CMAssessmentAnswerControllerServiceProxy, CMAssessmentQuestionControllerServiceProxy, CMScoreDto, ClimateAction, InvestorToolControllerServiceProxy, MethodologyAssessmentControllerServiceProxy, ProjectControllerServiceProxy } from 'shared/service-proxies/service-proxies';
import decode from 'jwt-decode';
import { AppService, LoginRole, RecordStatus } from 'shared/AppService';
import { MasterDataService } from 'app/shared/master-data.service';
import ChartDataLabels from 'chartjs-plugin-datalabels';
import { Paginator } from 'primeng/paginator';
import { LazyLoadEvent } from 'primeng/api';
import { OverlayPanel } from 'primeng/overlaypanel';
@Component({
  selector: 'app-carbon-market-dashboard',
  templateUrl: './carbon-market-dashboard.component.html',
  styleUrls: ['./carbon-market-dashboard.component.css']
})
export class CarbonMarketDashboardComponent implements OnInit,AfterViewInit {
  @ViewChild('cmSDGsPieChart')
  canvascmRefSDGsPieChart: ElementRef<HTMLCanvasElement>;


  @ViewChild('cmSectorCountPieChart')
  canvascmRefSectorCountPieChart: ElementRef<HTMLCanvasElement>;

  @ViewChild('op') op: OverlayPanel;
  constructor(
    // private projectProxy: ProjectControllerServiceProxy,
    private assessmentCMProxy:AssessmentCMDetailControllerServiceProxy,
    // private methassess : MethodologyAssessmentControllerServiceProxy,
    private investorProxy: InvestorToolControllerServiceProxy,
    private cmAssessmentQuestionProxy : CMAssessmentQuestionControllerServiceProxy,
    public masterDataService: MasterDataService,
    private cdr: ChangeDetectorRef
  ) { 
    // Chart.register(ChartDataLabels)
  }

 // @ViewChild('canvas', { static: false }) canvas: ElementRef;
 totalRecords: number = 0;
 score: CMScoreDto = new CMScoreDto()
 userName: string = "";
 userRole: string = "";
 loginRole = LoginRole;
  interventions:any
  tcData: {
    x:string,
    y:number,
    data:string,
  }[]=[];
  chart: any = [];

  tcTableData: {
    x:string,
    y:number,
    data:string,
  }[]=[];
  pointTableDatas:any[]=[]
  CMsectorCount: {
    sectoral_boundary:number
    average_tc_value:string,

    }[];

CMPrerequiste: {
  sector:string,
  count:number
  }[];

  sectorCount: {
    sector:string,
    count:number
    }[]=[];
    cmPieChartSDG:Chart;
    cmPieChartSectorCount:Chart;
  CMBarChart:any =[];
  pieChartCM:any=[];
  averageTCValue:any;

  tool : string;

  pieChart2:any=[];
  loading:boolean=false;
  tableData:any[]=[]
    xData: {label: string; value: number}[]
    yData: {label: string; value: number}[]
    rows: number = 5;
    slicedData:{
      assessment: number,
      process_score: number,
      outcome_score: number,
      intervention: string
    }[]=[];
    sdgDetailsList:any=[];
  ngOnInit(): void {
    // this.averageTCValue =58.05;
    const token = localStorage.getItem('ACCESS_TOKEN')!;
    const tokenPayload = decode<any>(token);
    this.userRole = tokenPayload.role.code;

    this.tool = 'Carbon Market Tool';
    let event: any = {};
    event.rows = this.rows;
    event.first = 0;

    this.loadgridData(event);
   

    this.xData = this.masterDataService.xData
    this.yData = this.masterDataService.yData
    this.assessmentCMProxy.getPrerequisite().subscribe((res:any)=>{

      this.CMPrerequiste=res
      // console.log("CMPrerequiste",res, this.CMPrerequiste[0]?.count, this.CMPrerequiste[1]?.count)
      setTimeout(() => {
        this.viewPieChartCM();
      }, 200);
      
    })

    this.sdgResults();
    this.sectorCountResult();

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
    this.cmAssessmentQuestionProxy.getDashboardData(pageNumber,this.rows).subscribe((res) => {
      this.tableData=res.items;
      console.log("kkkkk : ", res)
      this.totalRecords= res.meta.totalItems
      this.loading = false;
    }, err => {
      this.loading = false;});

    // setTimeout(() => {
    // }, 1);
  };
  ngAfterViewInit(): void {
    this.cdr.detectChanges();
  }

  sdgResults(){
    this.sdgDetailsList=[]
    this.investorProxy.sdgSumCalculate('Carbon Market Tool').subscribe(async (res: any) => {
      console.log("sdgDetailsList : ", res)
      this.sdgDetailsList = res;
      setTimeout(() => {
        this.viewFrequencyofSDGsChart();
      }, 200);
     });

  
   
    
  }
sectorCountResult(){
 this.investorProxy.getSectorCountByTool(this.tool).subscribe((res: any) => {
      this.sectorCount = res
      console.log("sectorcount",this.sectorCount)
      setTimeout(() => {
       
        this.viewSecterTargetedPieChart();
      }, 200);
     
    });

    // this.sectorCount=[{sector:'test1',count:23},
    // {sector:'test2',count:10}]
  
    // setTimeout(() => {
    //   this.viewSecterTargetedPieChart();
    // }, 200);
}
  viewFrequencyofSDGsChart(){
    let labels = this.sdgDetailsList.map((item:any) => 'SDG ' + item.number + ' - ' + item.sdg);
    let counts:number[] = this.sdgDetailsList.map((item:any) => item.count);
    let total = counts.reduce((acc, val) => acc + val, 0);
    let percentages = counts.map(count => ((count / total) * 100).toFixed(2));

    if (!this.canvascmRefSDGsPieChart) {
      console.error('Could not find canvas element');
      return;
    }

    const canvas = this.canvascmRefSDGsPieChart.nativeElement;
    const ctx = canvas.getContext('2d');

    if (!ctx) {
      console.error('Could not get canvas context');
      return;
    }

    if (this.cmPieChartSDG) {
      // Update the chart data
      this.cmPieChartSDG.data.datasets[0].data = counts;
      this.cmPieChartSDG.data.labels=labels
      this.cmPieChartSDG.update();
    }
    else{


    this.cmPieChartSDG =new Chart(ctx, {
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
    if (!this.canvascmRefSectorCountPieChart) {
      console.error('Could not find canvas element');
      return;
    }

    const canvas = this.canvascmRefSectorCountPieChart.nativeElement;
    const ctx = canvas.getContext('2d');

    if (!ctx) {
      console.error('Could not get canvas context');
      return;
    }

    if (this.cmPieChartSectorCount) {
      // Update the chart data
      this.cmPieChartSectorCount.data.datasets[0].data = counts;
      this.cmPieChartSectorCount.data.labels=labels
      this.cmPieChartSectorCount.update();
    }
    else{
    this.cmPieChartSectorCount =new Chart(ctx, {
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

  // viewCMBarChart(){
  //   let label =this.CMsectorCount.map((item) => item.sectoral_boundary);
  //   let data =this.CMsectorCount.map((item) => item.average_tc_value);
  //   console.log("label",label,"data",data)
  //   this.CMBarChart =new Chart('CMBarCahart', {
  //     type: 'bar',

  //     data: {
  //       labels: label,
  //       datasets: [{
  //         label: 'Bar Chart',
  //         data: data,
  //         backgroundColor: [
  //           'rgba(153, 102, 255, 1)',
  //           'rgba(75, 192, 192,1)',
  //           'rgba(54, 162, 235, 1)',
  //           'rgba(123, 122, 125, 1)',
  //           'rgba(255, 99, 132, 1)',
  //           'rgba(255, 205, 86, 1)',
  //           'rgba(255, 99, 132, 1)',

  //         ],
  //         borderColor:[
  //           'rgba(153, 102, 255, 1)',
  //           'rgba(75, 192, 192,1)',
  //           'rgba(54, 162, 235, 1)',
  //           'rgba(123, 122, 125, 1)',
  //           'rgba(255, 99, 132, 1)',
  //           'rgba(255, 205, 86, 1)',
  //           'rgba(255, 99, 132, 1)',],

  //         borderWidth: 1
  //       }]
  //     },
  //     options:{
  //       scales: {
  //         x: {
  //           beginAtZero: true,
  //           title: {
  //             display: true,
  //             text: 'Sectors',
  //             font: {
  //               size: 16,
  //               weight: 'bold',

  //             }
  //           }
  //         },
  //         y: {
  //           beginAtZero: true,
  //           title: {
  //             display: true,
  //             text: 'Average Transformational Change (%)',
  //             font: {
  //               size: 12,
  //               weight: 'bold',

  //             }
  //           }
  //         }
  //       },
  //       plugins:{
  //         legend: {
  //           display: false
  //         },
  //         tooltip:{
  //           position:'average',
  //           boxWidth:10,
  //           callbacks:{

  //             label:(context)=>{

  //               return[

  //                 `Average TC value: ${data[context.dataIndex]}`,
  //               ];
  //              }
  //           },
  //           backgroundColor: 'rgba(0, 0, 0, 0.8)', // Set the background color of the tooltip box
  //             titleFont: {
  //               size: 14,
  //               weight: 'bold'
  //             },
  //             bodyFont: {
  //               size: 14
  //             },
  //             displayColors: true, // Hide the color box in the tooltip
  //             bodyAlign: 'left'
  //         }
  //       }

  //     }
  // });

  // }


  viewPieChartCM(){
    const labels = this.CMPrerequiste.map((item) => item.sector);
    let counts:number[] = this.CMPrerequiste.map((item) => item.count);
    const total = counts.reduce((acc, val) => acc + val, 0);
    const percentages = counts.map(count => ((count / total) * 100).toFixed(2));
    this.pieChartCM =new Chart('pieChartCM', {
      type: 'pie',

      data: {
        labels: labels,
        datasets: [{
          data: counts,
          backgroundColor: ['rgba(153, 102, 255, 1)','black'],
        }]
      },
      options: {
        responsive: true,
        // maintainAspectRatio: false,
        
        plugins:{
          legend:{
            position: 'bottom',
            labels: {
              padding: 20
            }
          },
          datalabels: {
            display: true,
            align: 'bottom',
            color:'#fff',
            // backgroundColor: '#fff',
            // borderRadius: 3,
            font: {
              size: 12,
            },
            formatter: (value, ctx) => {
              const label = ctx.chart.data.labels![ctx.dataIndex];
              const percentage = ((value / counts.reduce((a, b) => a + b, 0)) * 100).toFixed(2) + "%";
              return percentage;
            },
          },
          tooltip:{
            position:'average',
            boxWidth:10,
            callbacks:{

              label:(ctx)=>{
                let sum = 0;
                let array =counts
                array.forEach((number) => {
                  sum += Number(number);
                });
                // console.log(sum, counts[ctx.dataIndex])
                let percentage = (counts[ctx.dataIndex]*100 / sum).toFixed(2)+"%";

                return[
                  ` ${labels[ctx.dataIndex]}`,
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
      plugins:[ChartDataLabels]

  });

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
  // getCircleColor(): string {
  //   const randomColor = '#' + Math.floor(Math.random() * 16777215).toString(16);
  //   return randomColor
  // }

  getIntervention(p:number, q: number){
    return this.tableData.some(item => item.outcome_score === p && item.process_score === q);
  }
  paginate(event:Paginator|undefined) {
    if (event){
      console.log("paginate",event)
      this.slicedData = this.tableData.slice(event?.first,event?.first+this.rows)
    }
    else{
      this.slicedData = this.tableData.slice(0,this.rows)
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
