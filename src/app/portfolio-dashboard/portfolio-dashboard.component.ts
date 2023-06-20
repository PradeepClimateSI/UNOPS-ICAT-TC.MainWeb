import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { Chart } from 'chart.js';
import { InvestorToolControllerServiceProxy, MethodologyAssessmentControllerServiceProxy, PortfolioControllerServiceProxy } from 'shared/service-proxies/service-proxies';

@Component({
  selector: 'app-portfolio-dashboard',
  templateUrl: './portfolio-dashboard.component.html',
  styleUrls: ['./portfolio-dashboard.component.css']
})
export class PortfolioDashboardComponent implements OnInit {

  constructor(
    private methassess : MethodologyAssessmentControllerServiceProxy,
    private investorProxy: InvestorToolControllerServiceProxy,
    private portfolioServiceProxy : PortfolioControllerServiceProxy,
  ) {
    this.test= [{data: 'AAA', x:2,y:3}, {data: 'BBB', x:3,y:3},{data: 'CCC', x:4,y:4}]
  }
  test :any = []

  @ViewChild('myCanvas', { static: true }) canvasRef!: ElementRef<HTMLCanvasElement>;
  @ViewChild('myCanvas2', { static: true }) canvasRef2!: ElementRef<HTMLCanvasElement>;
  chart: any = [];
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

  loadSelectedTable : boolean = false;


  /////
  portfolioPieChart:any=[];
  portfolioBarChart:any =[];

  ngOnInit(): void {
    this.loadSelectedTable = false;
    this.averageTCValue =63.78
    this.tool = 'Portfolio Tool'
    this.methassess.getResultForTool(this.tool).subscribe((res: any) => {
      console.log("resulttt : ", res)
    //  this.resultData = res
    //  this.viewResults();
    });

    this.investorProxy.calculateAssessmentResults(this.tool).subscribe((res: any) => {
      this.calResults = res[0]
      console.log("assessdetails",  this.calResults)

      const RecentInterventions = this.calResults.slice(0,10);
      this.recentResult = RecentInterventions

      this.resultData= this.recentResult.map((intervention: { likelihood: any; relevance: any; assesment: { climateAction: { policyName: any; }; }; })=>({
        y:intervention?.likelihood,
        x:intervention?.relevance,
        data:intervention?.assesment?.climateAction?.policyName}))

        this.resultData2= this.recentResult.map((a: { scaleScore: any; sustainedScore: any; assesment: { climateAction: { policyName: any; }; }; })=>({
          y:a?.scaleScore,
          x:a?.sustainedScore,
          data:a?.assesment?.climateAction?.policyName}))

        console.log("kkkkkk : ",   this.resultData)
        console.log("kkkkkk2 : ",   this.resultData2)
        this.viewResults();
        this.viewResults2();
    });


    this.portfolioServiceProxy.getAll().subscribe(async (res: any) => {
      console.log("assesss : ", res)
      this.portfolioList = res;
     });



  }

  selectPortfolio(portfolio : any){
    console.log("portfolio : ", this.selectedPortfolio)

    this.portfolioServiceProxy.assessmentsDataByAssessmentId(this.selectedPortfolio.id).subscribe(async (res: any) => {
      console.log("arrayyy : ", res)
      this.processData = [];
      this.outcomeData = [];
      this.outcomeData2 = [];

      for (let data of res) {
      this.processData = [];
      this.outcomeData = [];
      this.outcomeData2 = [];
        for (let x of data.result) {
          if (x.type === 'process') {
            this.processData.push(x);
          }

          if (x.type === 'outcome' && (x.name === 'Scale GHGs' || x.name === 'Scale SD')) {

            this.outcomeData.push(x);
          }

          if (x.type === 'outcome' && (x.name === 'Sustained nature-GHGs' || x.name === 'Sustained nature-SD')) {

            this.outcomeData2.push(x);
          }
        }

        let obj = {
          assess : data.assessment,
          process : this.processData,
          scale : this.outcomeData,
          sustained : this.outcomeData2,
          ghgValue : data.ghgValue,
        }

        this.allData.push(obj)
      }

      console.log("this.allData : ", this.allData)

     // console.log("this.processData : ", this.processData)
     // console.log(" this.outcomeData : ",  this.outcomeData)

     this.loadSelectedTable = true;

    });

  }

  viewResults(): void {
    if (!this.canvasRef) {
      console.error('Could not find canvas element');
      return;
    }

    const canvas = this.canvasRef.nativeElement;
    const ctx = canvas.getContext('2d');

    if (!ctx) {
      console.error('Could not get canvas context');
      return;
    }

    const gradient = ctx.createLinearGradient(0, 0, 500, 500);
    gradient.addColorStop(0, 'red');
    gradient.addColorStop(0.5, 'yellow');
    gradient.addColorStop(1, 'green');

    this.chart = new Chart(ctx, {
      type: 'scatter',
      data: {
        datasets: [
          {
            label: '',
            data: this.resultData,
            backgroundColor: gradient,
            borderColor: 'black',
            borderWidth: 1,
            pointRadius: 8,
            pointBackgroundColor: ['#0000FF','#FF6384', '#36A2EB', '#FFCE56', '#800000', '#66BB6A', '#FF7043', '#9575CD'],
            pointBorderColor: 'black',
            pointBorderWidth: 1,
          },
        ],
      },
      options: {
        scales: {
          x: {
            type: 'linear',
            min: 0,
            max: 4,
            ticks: {
              stepSize: 1,
           /*    callback: (value, index, ticks) => {
                 if (value === 0) {
                  return 'Major 4';
                } else if (value === 1) {
                  return 'Moderate 3';
                } else if (value === 2) {
                  return 'Minor 2';
                } else if (value === 3) {
                  return 'None 1';
                }  else if (value === 4) {
                  return 'Negative 0';
                }
                else {
                  return value;
                }
              }, */
            },
            title: {
              display: true,
              text: 'Relevance',
              font: {
                weight: 'bold',
                size: 16, // Adjust the font size as desired
              },
            },
          },
          y: {
            type: 'linear',
            min: 0,
            max: 4,
            ticks: {
              stepSize: 1,
            },
            title: {
              display: true,
              text: 'Likelihood',
              font: {
                weight: 'bold',
                size: 16, // Adjust the font size as desired
              },
            },
          },
        },
        plugins: {
          tooltip: {
            callbacks: {
              label: (context) => {
                const data = context.dataset.data[context.dataIndex];
                return[
                  `Intervention: ${this.resultData[context.dataIndex].data}`,
                  `Likelihood: ${this.resultData[context.dataIndex].y}`,
                  `Relevance: ${this.resultData[context.dataIndex].x}`

                ];
              },
            },
          },
          legend: {
            display: false, // Hide the legend
          },
        },
      },
    });
  }

  viewResults2(): void {
    if (!this.canvasRef2) {
      console.error('Could not find canvas element');
      return;
    }

    const canvas = this.canvasRef2.nativeElement;
    const ctx = canvas.getContext('2d');

    if (!ctx) {
      console.error('Could not get canvas context');
      return;
    }

    const gradient = ctx.createLinearGradient(0, 0, 500, 500);
    gradient.addColorStop(0, 'red');
    gradient.addColorStop(0.5, 'yellow');
    gradient.addColorStop(1, 'green');

    this.chart = new Chart(ctx, {
      type: 'scatter',
      data: {
        datasets: [
          {
            label: '',
            data: this.resultData2,
            backgroundColor: gradient,
            borderColor: 'black',
            borderWidth: 1,
            pointRadius: 8,
            pointBackgroundColor: ['#0000FF','#FF6384', '#36A2EB', '#FFCE56', '#800000', '#66BB6A', '#FF7043', '#9575CD'],
            pointBorderColor: 'black',
            pointBorderWidth: 1,
          },
        ],
      },
      options: {
        scales: {
          x: {
            type: 'linear',
            min: -1,
            max: 3,
            ticks: {
              stepSize: 1,
           /*    callback: (value, index, ticks) => {
                 if (value === 0) {
                  return 'Major 4';
                } else if (value === 1) {
                  return 'Moderate 3';
                } else if (value === 2) {
                  return 'Minor 2';
                } else if (value === 3) {
                  return 'None 1';
                }  else if (value === 4) {
                  return 'Negative 0';
                }
                else {
                  return value;
                }
              }, */
            },
            title: {
              display: true,
              text: 'Sustained',
              font: {
                weight: 'bold',
                size: 16, // Adjust the font size as desired
              },
            },
          },
          y: {
            type: 'linear',
            min: -1,
            max: 3,
            ticks: {
              stepSize: 1,
            },
            title: {
              display: true,
              text: 'Scaled',
              font: {
                weight: 'bold',
                size: 16, // Adjust the font size as desired
              },
            },
          },
        },
        plugins: {
          tooltip: {
            callbacks: {
              label: (context) => {
                const data = context.dataset.data[context.dataIndex];
                return[
                  `Intervention: ${this.resultData2[context.dataIndex].data}`,
                  `Scaled: ${this.resultData2[context.dataIndex].y}`,
                  `Sustained: ${this.resultData2[context.dataIndex].x}`

                ];
              },
            },
          },
          legend: {
            display: false, // Hide the legend
          },
        },
      },
    });
  }

  getColorClass(value: any) {
    let value2 = Number(value)
    if (value2 >= 0 && value2 < 1) {
      return 'color-class-1';
    } else if (value2 >= 1 && value2 < 2) {
      return 'color-class-2';
    } else if (value2 >= 2 && value2 < 3) {
      return 'color-class-3';
    } else if (value2 >= 3 && value2 <= 4) {
      return 'color-class-4';
    } else {
      return 'default-color-class';
    }
  }

  calculateAverage(data: any[]) {
    const sum = data.reduce((accumulator, item) => accumulator + parseFloat(item.likelihoodAverage), 0);
    const average = sum / data.length;
    return average.toFixed(3);
  }

  calculateAverageRelevance(data: any[]) {
    const sum = data.reduce((accumulator, item) => accumulator + parseFloat(item.relevanceAverage), 0);
    const average = sum / data.length;
    return average.toFixed(3);
  }

  calculateAverageScale(data: any[]) {
    const sum = data.reduce((accumulator, item) => accumulator + parseFloat(item.scoreAverage), 0);
    const average = sum / data.length;
    return average.toFixed(3);
  }

  calculateAverageSustained(data: any[]) {
    const sum = data.reduce((accumulator, item) => accumulator + parseFloat(item.scoreAverage), 0);
    const average = sum / data.length;
    return average.toFixed(3);
  }
  // viewPortfolioPieChart(){
  //   const labels = this.sectorCount.map((item) => item.sector);
  //   let counts:number[] = this.sectorCount.map((item) => item.count);
  //   const total = counts.reduce((acc, val) => acc + val, 0);
  //   const percentages = counts.map(count => ((count / total) * 100).toFixed(2));
  //   this.portfolioPieChart =new Chart('portfolioPieChart', {
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
  // viewPortfolioBarChart(){
  //   let label =this.CMsectorCount.map((item) => item.sectoral_boundary);
  //   let data =this.CMsectorCount.map((item) => item.average_tc_value);
  //   console.log("label",label,"data",data)
  //   this.portfolioBarChart =new Chart('portfolioBarChart', {
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

}
