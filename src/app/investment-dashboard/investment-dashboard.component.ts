import { Component, OnInit ,ViewChild } from '@angular/core';
import { Chart, registerables } from 'chart.js';
import { AssessmentCMDetailControllerServiceProxy, ClimateAction, InvestorToolControllerServiceProxy, ProjectControllerServiceProxy } from 'shared/service-proxies/service-proxies';
import * as pluginDataLabels from 'chartjs-plugin-datalabels';


@Component({
  selector: 'app-investment-dashboard',
  templateUrl: './investment-dashboard.component.html',
  styleUrls: ['./investment-dashboard.component.css']
})
export class InvestmentDashboardComponent implements OnInit {
  canvas: any;
  ctx: any;
  @ViewChild('mychart') mychart: any;

  interventions:any[]=[];
  investment:number[]=[];
  tc:number[]=[];
  tcLables:string[]=[]
  chart: any = [];
  pieChart2:any=[];
  CMBarChart:any =[];
  pieChartCM:any=[];
  tcData: {
    x:number,
    y:number,
    data:string,
  }[]=[];
  sectorCount: {
    sector:string,
    count:number
    }[];

  CMsectorCount: {
      sectoral_boundary:number
      average_tc_value:string,
      
      }[];

  CMPrerequiste: {
    sector:string,
    count:number
    }[];
  averageTCValue:any;
  calResults: any;


  constructor(
    private projectProxy: ProjectControllerServiceProxy,
    private investorProxy: InvestorToolControllerServiceProxy,
    private assessmentCMProxy:AssessmentCMDetailControllerServiceProxy,
  ) {
    Chart.register(...registerables);
  
  }

  ngOnInit(): void {
    this.averageTCValue =75
    let tool ='Investment & Private Sector Tool'
    // this.projectProxy.findAllPolicies().subscribe((res: any) => {
    //   this.interventions = res
    //   // console.log("policyList : ", this.interventions)
    //   this.tcData=this.interventions.map(intervention=>({y:intervention?.tc_value,x:intervention?.initialInvestment,data:intervention?.policyName}))
    //   this.viewMainChart();
    //   console.log("aaa",this.tcData)


    // });
    this.investorProxy.getTCValueByAssessment(tool).subscribe((res: any) => {
      console.log("policyList : ", res)
      this.interventions = res
      this.tcData=this.interventions.map(intervention=>({
        y:intervention?.tc_value,
        x:intervention?.climateAction?.initialInvestment,
        data:intervention?.climateAction?.policyName}))
        console.log("Tc data:",this.tcData)
      this.viewMainChart();
    })
  
    this.investorProxy.findSectorCount(tool).subscribe((res: any) => {
      this.sectorCount = res
      console.log("sectorcount",this.sectorCount)
      this.viewPieChart()
    });


    this.investorProxy.calculateAssessmentResults(tool).subscribe((res: any) => {
      this.calResults = res[0]
      console.log("assessdetails",this.calResults)
      


    });
     


  }
  viewMainChart(){
    this.chart =new Chart('canvas', {
      type: 'scatter',

      data: {

          datasets: [
            {
              label:'TC change with investments',
              data: this.tcData,
              backgroundColor: this.getRandomColors(this.tcData.length+1),
              borderColor: "#black",
              pointRadius:10,
          }],
      },
      options:{
        scales: {
          x: {
            beginAtZero: true,
            title: {
              display: true,
              text: 'Investments ($)',
              font: {
                size: 16,
                weight: 'bold',

              }
            }
          },
          y: {
            beginAtZero: true,
            title: {
              display: true,
              text: 'Transformational Change',
              font: {
                size: 16,
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

                return[
                  `Intervention: ${this.tcData[context.dataIndex].data}`,
                  `Investment: ${this.tcData[context.dataIndex].x}`,
                  `TC value: ${this.tcData[context.dataIndex].y}`
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

  }

  viewPieChart(){
    const labels = this.sectorCount.map((item) => item.sector);
    let counts:number[] = this.sectorCount.map((item) => item.count);
    const total = counts.reduce((acc, val) => acc + val, 0);
    const percentages = counts.map(count => ((count / total) * 100).toFixed(2));
    this.pieChart2 =new Chart('pieChart2', {
      type: 'pie',

      data: {
        labels: labels,
        datasets: [{
          data: counts,
          backgroundColor: ['#FF6384', '#36A2EB', '#FFCE56', '#66BB6A', '#FF7043', '#9575CD'],
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

  });

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



}
