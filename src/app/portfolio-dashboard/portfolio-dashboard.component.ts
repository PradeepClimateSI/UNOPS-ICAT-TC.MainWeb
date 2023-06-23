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


  @ViewChild('myCanvas3', { static: true }) canvasRef3!: ElementRef<HTMLCanvasElement>;
  @ViewChild('myCanvas4', { static: true }) canvasRef4!: ElementRef<HTMLCanvasElement>;


  @ViewChild('portfolioBarChart', { static: true }) canvasRefBarChart!: ElementRef<HTMLCanvasElement>;
  @ViewChild('portfolioPieChart2', { static: true }) canvasRefPieChart!: ElementRef<HTMLCanvasElement>;


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

  loadSelectedTable : boolean = false;


  /////
  portfolioPieChart:Chart;
  portfolioBarChart:Chart;
  barChartData:any=[];
  sdgDetailsList:any=[];
  loadLast2graphs:boolean=false;
  ngOnInit(): void {
    this.loadSelectedTable = false;
    this.loadSelectedTable =false;
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

      const RecentInterventions = this.calResults.slice(29,32);
      this.recentResult = RecentInterventions

      console.log("RecentInterventions",  RecentInterventions)


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


  goToFunction(){
this.selectedPortfolio = ''
  }

  selectPortfolio(portfolio : any){
    console.log("portfolio : ", this.selectedPortfolio)
    this.loadLast2graphs=true;
    console.log("loadLast2graphs",this.loadLast2graphs)
    this.sdgDetailsList=[];
    this.barChartData=[];
    this.resultData = []
    this.resultData2 = []
    this.allData = []
    

    this.portfolioServiceProxy.assessmentsDataByAssessmentId(this.selectedPortfolio.id).subscribe(async (res: any) => {
      console.log("arrayyy : ", res)
     
      this.barChartData=res;
      this.viewPortfolioBarChart();

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

      for(let x of this.allData){
        let t1X = Number(this.calculateAverageRelevance(x.process.slice(0, 4)))
        let t1Y = Number(this.calculateAverage(x.process.slice(0, 4)))
        let t2X = Number(this.calculateAverageSustained(x.sustained.slice(0, 2)))
        let t2Y = Number(this.calculateAverageScale(x.scale.slice(0, 2)))

        let t1 = {
          x : t1X,
          y : t1Y,
          data : x.assess.climateAction?.policyName
        }
        let t2 = {
          x : t2X,
          y : t2Y,
          data : x.assess.climateAction?.policyName
        }

        this.resultData.push(t1)
        this.resultData2.push(t2)


        console.log("llll : ",   this.resultData)
        console.log("lllll11 : ",   this.resultData2)

      }





      this.viewResults();
      this.viewResults2();
     // console.log("this.processData : ", this.processData)
     // console.log(" this.outcomeData : ",  this.outcomeData)

     this.loadSelectedTable = true;
     

    });

  }
  sdgResults(portfolio : any){
    this.sdgDetailsList=[]
    this.portfolioServiceProxy.sdgSumCalculate(this.selectedPortfolio.id).subscribe(async (res: any) => {
      console.log("sdgDetailsList : ", res)
      this.sdgDetailsList = res;
      this.viewPortfolioPieChart();
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

    if (this.chart) {
      // Update the chart data
      this.chart.data.datasets[0].data = this.resultData;
      this.chart.update();
    } else{

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
            },
            title: {
              display: true,
              text: 'Process - Relevance',
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
              text: 'Process - Likelihood',
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

    if (this.chart2) {
      // Update the chart data
      this.chart2.data.datasets[0].data = this.resultData2;
      this.chart2.update();
    } else{
    const gradient = ctx.createLinearGradient(0, 0, 500, 500);
    gradient.addColorStop(0, 'red');
    gradient.addColorStop(0.5, 'yellow');
    gradient.addColorStop(1, 'green');

    this.chart2 = new Chart(ctx, {
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
            },
            title: {
              display: true,
              text: 'Outcomes - Sustained',
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
              text: 'Outcomes - Scaled',
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

  calculateAverage(data: any[]) {
    const sum = data.reduce((accumulator, item) => accumulator + parseFloat(item.likelihoodAverage), 0);
    const average = sum / data.length;
    return average.toFixed(0);
  }

  calculateAverageRelevance(data: any[]) {
    const sum = data.reduce((accumulator, item) => accumulator + parseFloat(item.relevanceAverage), 0);
    const average = sum / data.length;
    return average.toFixed(0);
  }

  calculateAverageScale(data: any[]) {
    const sum = data.reduce((accumulator, item) => accumulator + parseFloat(item.scoreAverage), 0);
    const average = sum / data.length;
    return average.toFixed(0);
  }

  calculateAverageSustained(data: any[]) {
    const sum = data.reduce((accumulator, item) => accumulator + parseFloat(item.scoreAverage), 0);
    const average = sum / data.length;
    return average.toFixed(0);
  }




  viewPortfolioPieChart(){
    let labels = this.sdgDetailsList.map((item:any) => item.sdg);
    let counts:number[] = this.sdgDetailsList.map((item:any) => item.count);
    let total = counts.reduce((acc, val) => acc + val, 0);
    let percentages = counts.map(count => ((count / total) * 100).toFixed(2));

    if (!this.canvasRefPieChart) {
      console.error('Could not find canvas element');
      return;
    }

    const canvas = this.canvasRefPieChart.nativeElement;
    const ctx = canvas.getContext('2d');

    if (!ctx) {
      console.error('Could not get canvas context');
      return;
    }

    if (this.portfolioPieChart) {
      // Update the chart data
      this.portfolioPieChart.data.datasets[0].data = counts;
      this.portfolioPieChart.data.labels=labels
      this.portfolioPieChart.update();
    }
    else{
      this.portfolioPieChart =new Chart(ctx, {
        type: 'pie',
  
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
                  // console.log(ctx)
                  // let sum = ctx.dataset._meta[0].total;
                  // let percentage = (value * 100 / sum).toFixed(2) + "%";
                  // return percentage;
                  let sum = 0;
                  let array =ctx.dataset.data
                  array.forEach((number) => {
                    sum += Number(number);
                  });
                  // console.log("sum",sum,ctx.parsed)
                  // console.log(sum, counts[ctx.dataIndex])
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

    if (this.portfolioBarChart) {
      // Update the chart data
      console.log("======", this.portfolioBarChart.data)
      this.portfolioBarChart.data.datasets[0].data = data;
      this.portfolioBarChart.data.labels=label;
      console.log("======", this.portfolioBarChart.data)
      this.portfolioBarChart.update();
    }
    else{
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
                text: 'Expected GHG Mitigation (Mt CO2-eq)',
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
  
                    `Expected GHG Mitigation (Mt CO2-eq): ${context.raw}`,
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
    

  }

}
