import { Component, OnInit ,ViewChild } from '@angular/core';
import { Chart, registerables } from 'chart.js';
import { ClimateAction, ProjectControllerServiceProxy } from 'shared/service-proxies/service-proxies';


@Component({
  selector: 'app-investment-dashboard',
  templateUrl: './investment-dashboard.component.html',
  styleUrls: ['./investment-dashboard.component.css']
})
export class InvestmentDashboardComponent implements OnInit {
  canvas: any;
  ctx: any;
  @ViewChild('mychart') mychart: any;

  interventions:ClimateAction[]=[];
  investment:number[]=[];
  tc:number[]=[];
  tcLables:string[]=[]
  chart: any = [];
  tcData: {
    x:number,
    y:number,
    data:string,
  }[]=[];

  constructor(
    private projectProxy: ProjectControllerServiceProxy,
  ) { 
    Chart.register(...registerables);
  }

  ngOnInit(): void {

    this.projectProxy.findAllPolicies().subscribe((res: any) => {
      this.interventions = res
      // console.log("policyList : ", this.interventions)
      this.tcData=this.interventions.map(intervention=>({y:intervention?.tc_value,x:intervention?.initialInvestment,data:intervention?.policyName}))
      this.viewMainChart();
      console.log(this.tcData)

      
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
