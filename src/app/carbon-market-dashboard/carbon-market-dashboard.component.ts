import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { Chart } from 'chart.js';
import { ClimateAction, ProjectControllerServiceProxy } from 'shared/service-proxies/service-proxies';

@Component({
  selector: 'app-carbon-market-dashboard',
  templateUrl: './carbon-market-dashboard.component.html',
  styleUrls: ['./carbon-market-dashboard.component.css']
})
export class CarbonMarketDashboardComponent implements OnInit {

  constructor(
    private projectProxy: ProjectControllerServiceProxy,
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


}
