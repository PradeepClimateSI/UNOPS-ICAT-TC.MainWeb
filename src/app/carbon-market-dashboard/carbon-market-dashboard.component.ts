import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { Chart } from 'chart.js';
import { AssessmentCMDetailControllerServiceProxy, ClimateAction, ProjectControllerServiceProxy } from 'shared/service-proxies/service-proxies';

@Component({
  selector: 'app-carbon-market-dashboard',
  templateUrl: './carbon-market-dashboard.component.html',
  styleUrls: ['./carbon-market-dashboard.component.css']
})
export class CarbonMarketDashboardComponent implements OnInit {

  constructor(
    private projectProxy: ProjectControllerServiceProxy,
    private assessmentCMProxy:AssessmentCMDetailControllerServiceProxy,
  ) { }

 // @ViewChild('canvas', { static: false }) canvas: ElementRef;

  interventions:ClimateAction[]=[];
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


  CMBarChart:any =[];
  pieChartCM:any=[];

  ngOnInit(): void {

    this.projectProxy.findAllPolicies().subscribe((res: any) => {
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
    });

    this.assessmentCMProxy.getSectorCount().subscribe((res: any) => {
      console.log("CMsectorCount",res)
      this.CMsectorCount = res
       this.viewCMBarChart();
    })

    this.assessmentCMProxy.getPrerequisite().subscribe((res:any)=>{
      
      this.CMPrerequiste=res
      console.log("CMPrerequiste",res)
      this.viewPieChartCM();
    })

  }

 /*  ngAfterViewInit(): void {
    this.viewMainChart();
  } */

  viewMainChart(){
   // const canvas = this.canvas.nativeElement.getContext('2d');
    this.chart =new Chart('canvas', {
      type: 'line',

      data: {

          datasets: [
            {
              label:'TC change with investments',
              data: this.tcData,
              backgroundColor: 'blue',
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
              text: 'Interventions',
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
              text: 'Transformational Change (%)',
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
                  `Intervention Id: ${this.tcData[context.dataIndex].x}`,
                  `TC value: ${this.tcData[context.dataIndex].y}%`
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

  getRandomColors(count: number): string[] {
    const colors: string[] = [];
    for (let i = 0; i < count; i++) {
      const randomColor = '#' + Math.floor(Math.random() * 16777215).toString(16);
      colors.push(randomColor);
    }
    return colors;
  }

  viewCMBarChart(){
    let label =this.CMsectorCount.map((item) => item.sectoral_boundary);
    let data =this.CMsectorCount.map((item) => item.average_tc_value);
    console.log("label",label,"data",data)
    this.CMBarChart =new Chart('CMBarCahart', {
      type: 'bar',
     
      data: {
        labels: label, 
        datasets: [{
          label: 'Bar Chart',
          data: data, 
          backgroundColor: [
            'rgba(153, 102, 255, 1)',
            'rgba(75, 192, 192,1)',
            'rgba(54, 162, 235, 1)',
            'rgba(123, 122, 125, 1)',
            'rgba(255, 99, 132, 1)',
            'rgba(255, 205, 86, 1)',
            'rgba(255, 99, 132, 1)',
            
          ],
          borderColor:[
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
            beginAtZero: true,
            title: {
              display: true,
              text: 'Sectors',
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
              text: 'Average Transformational Change (%)',
              font: {
                size: 14,
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
                  
                  `Average TC value: ${data[context.dataIndex]}`,
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
    
  });
  
  }


}
