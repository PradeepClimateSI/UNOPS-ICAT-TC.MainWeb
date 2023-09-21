import { AfterViewInit, ChangeDetectorRef, Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { Chart } from 'chart.js';
import { AssessmentCMDetailControllerServiceProxy, CMAssessmentAnswerControllerServiceProxy, CMAssessmentQuestionControllerServiceProxy, CMScoreDto, ClimateAction, InvestorToolControllerServiceProxy, MethodologyAssessmentControllerServiceProxy, ProjectControllerServiceProxy } from 'shared/service-proxies/service-proxies';
import decode from 'jwt-decode';
import { AppService, LoginRole, RecordStatus } from 'shared/AppService';
import { MasterDataService } from 'app/shared/master-data.service';
import ChartDataLabels from 'chartjs-plugin-datalabels';
import { Paginator } from 'primeng/paginator';
import { LazyLoadEvent } from 'primeng/api';
@Component({
  selector: 'app-carbon-market-dashboard',
  templateUrl: './carbon-market-dashboard.component.html',
  styleUrls: ['./carbon-market-dashboard.component.css']
})
export class CarbonMarketDashboardComponent implements OnInit,AfterViewInit {

  constructor(
    // private projectProxy: ProjectControllerServiceProxy,
    private assessmentCMProxy:AssessmentCMDetailControllerServiceProxy,
    // private methassess : MethodologyAssessmentControllerServiceProxy,
    // private investorProxy: InvestorToolControllerServiceProxy,
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
    }[];

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
   
      //   console.log("kkkkk : ", res)
    // this.methassess.getTCForTool(this.tool).subscribe((res: any) => {
    //   console.log("kkkkk : ", res)

    //   this.interventions = res;
    // //  console.log("policyList:", this.interventions);
    //   this.averageTCValue= (res.reduce((total:number, next:any) => total + Number(next.y), 0) / res.length).toFixed(2);
    //   console.log( "averageTCValue :",this.averageTCValue)

    //   // Sort interventions based on id in descending order
    //   this.interventions.sort((a: { id: number; }, b: { id: number; }) => b.id - a.id);

    //   // Get the last 5 interventions
    //   const lastFiveInterventions = this.interventions.slice(0,5);

    //   this.tcData = lastFiveInterventions
    //  /*  this.tcData = lastFiveInterventions.map(intervention => ({
    //     y: intervention?.tc_value,
    //     x: intervention?.intervention_id,
    //     data: intervention?.data
    //   }));

    //   this.tcTableData = this.interventions.map(intervention => ({
    //     y: intervention?.tc_value,
    //     x: intervention?.intervention_id,
    //     data: intervention?.policyName
    //   })); */

    //   this.tcTableData = this.interventions

    //   // this.viewMainChart();
    //   console.log("aaa", this.tcData);
    //   console.log("bbb", this.tcTableData);

    // });


/*     this.projectProxy.findAllPolicies().subscribe((res: any) => {
      this.interventions = res;
      console.log("policyList:", this.interventions);

      // Sort interventions based on id in descending order
      this.interventions.sort((a, b) => b.id - a.id);

      // Get the last 5 interventions
      const lastFiveInterventions = this.interventions.slice(0,10);

      this.tcData = lastFiveInterventions.map(intervention => ({
        y: intervention?.tc_value,
        x: intervention?.intervention_id,
        data: intervention?.policyName
      }));

      this.tcTableData = this.interventions.map(intervention => ({
        y: intervention?.tc_value,
        x: intervention?.intervention_id,
        data: intervention?.policyName
      }));

      this.viewMainChart();
      console.log("aaa", this.tcData);
      console.log("bbb", this.tcTableData);
    }); */

    // this.assessmentCMProxy.getSectorCount().subscribe((res: any) => {
    //   console.log("CMsectorCount",res)
    //   this.CMsectorCount = res
    //   setTimeout(() => {
    //     this.viewCMBarChart();
    //   }, 500);
       
    // })
    
    this.xData = this.masterDataService.xData
    this.yData = this.masterDataService.yData
    this.assessmentCMProxy.getPrerequisite().subscribe((res:any)=>{

      this.CMPrerequiste=res
      // console.log("CMPrerequiste",res, this.CMPrerequiste[0]?.count, this.CMPrerequiste[1]?.count)
      setTimeout(() => {
        this.viewPieChartCM();
      }, 200);
      
    })

    // this.investorProxy.getSectorCountByTool(this.tool).subscribe((res: any) => {
    //   this.sectorCount = res
    //   console.log("sectorcount",this.sectorCount)
    //   setTimeout(() => {
    //   }, 100);
      
    // });

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

  // viewPieChart(){
  //   const labels = this.sectorCount.map((item) => item.sector);
  //   let counts:number[] = this.sectorCount.map((item) => item.count);
  //   const total = counts.reduce((acc, val) => acc + val, 0);
  //   const percentages = counts.map(count => ((count / total) * 100).toFixed(2));
  //   this.pieChart2 =new Chart('pieChart2', {
  //     type: 'pie',

  //     data: {
  //       labels: labels,
  //       datasets: [{
  //         data: counts,
  //         backgroundColor: [
  //           'rgba(153, 102, 255, 1)',
  //           'rgba(75, 192, 192,1)',
  //           'rgba(54, 162, 235, 1)',
  //           'rgba(123, 122, 125, 1)',
  //           'rgba(255, 99, 132, 1)',
  //           'rgba(255, 205, 86, 1)',
  //           'rgba(255, 99, 132, 1)',

  //         ],

  //       }]
  //     },
  //     options: {
  //       responsive: true,
  //       maintainAspectRatio: false,
  //       plugins:{
  //         legend:{
  //           position: 'bottom',
  //           labels: {
  //             padding: 20
  //           }
  //         },
  //         datalabels: {
  //           color: '#fff',
  //           font: {
  //             size: 12
  //           },
  //           formatter: (value, ctx) => {
  //             const label = ctx.chart.data.labels![ctx.dataIndex];
  //             const percentage = percentages[ctx.dataIndex];
  //             return `${label}: ${value} (${percentage}%)`;
  //           },

  //         },
  //         tooltip:{
  //           position:'average',
  //           boxWidth:10,
  //           callbacks:{

  //             label:(ctx)=>{
  //               // console.log(ctx)
  //               // let sum = ctx.dataset._meta[0].total;
  //               // let percentage = (value * 100 / sum).toFixed(2) + "%";
  //               // return percentage;
  //               let sum = 0;
  //               let array =counts
  //               array.forEach((number) => {
  //                 sum += Number(number);
  //               });
  //               // console.log(sum, counts[ctx.dataIndex])
  //               let percentage = (counts[ctx.dataIndex]*100 / sum).toFixed(2)+"%";

  //               return[
  //                 `Sector: ${labels[ctx.dataIndex]}`,
  //                 `Count: ${counts[ctx.dataIndex]}`,
  //                 `Percentage: ${percentage}`
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
  //      }

  //     },

  // });

  // }

  // viewMainChart(){
  //  // const canvas = this.canvas.nativeElement.getContext('2d');
  //   this.chart =new Chart('canvas', {
  //     type: 'line',

  //     data: {

  //         datasets: [
  //           {
  //             label:'TC change with investments',
  //             data: this.tcData,
  //             backgroundColor: 'blue',
  //             borderColor: "#black",
  //             pointRadius:10,
  //             borderWidth: 0,
  //         }],
  //     },
  //     options:{
  //       scales: {
  //         x: {
  //           beginAtZero: true,
  //           title: {
  //             display: true,
  //             text: 'Intervention ID',
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
  //             text: 'Transformational Change (%)',
  //             font: {
  //               size: 16,
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
  //                 `Intervention: ${this.tcData[context.dataIndex].data}`,
  //                 `Intervention Id: ${this.tcData[context.dataIndex].x}`,
  //                 `TC value: ${this.tcData[context.dataIndex].y}%`
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

}
