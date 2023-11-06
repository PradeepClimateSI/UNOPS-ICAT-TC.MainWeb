import { AfterViewInit, ChangeDetectorRef, Component, ElementRef, HostListener, OnInit, Renderer2, ViewChild } from '@angular/core';
import { MasterDataService } from 'app/shared/master-data.service';
import { OverlayPanel } from 'primeng/overlaypanel';
import { LazyLoadEvent } from 'primeng/api';
import { Assessment, InvestorToolControllerServiceProxy } from 'shared/service-proxies/service-proxies';
import decode from 'jwt-decode';
import { Chart, ChartType } from 'chart.js';
import { HeatMapScore, TableData } from 'app/charts/heat-map/heat-map.component';

@Component({
  selector: 'app-all-too-dashbord',
  templateUrl: './all-too-dashbord.component.html',
  styleUrls: ['./all-too-dashbord.component.css']
})
export class AllTooDashbordComponent implements OnInit,AfterViewInit  {
  calResults: any;

  @ViewChild('investmentSDGsPieChart2')
  canvasRefSDGsPieChart: ElementRef<HTMLCanvasElement>;
  @ViewChild('sourceDiv', { read: ElementRef }) sourceDiv: ElementRef;
  @ViewChild('targetDiv', { read: ElementRef }) targetDiv: ElementRef;
  targetDivHeight: any;

  @ViewChild('investmentSectorCountPieChart')
  canvasRefSectorCountPieChart: ElementRef<HTMLCanvasElement>;

  @ViewChild('op') op: OverlayPanel;
  loading: boolean;
  totalRecords: number;
  pointTableDatas: Assessment[] = []
  userRole: string = "";

  sectorCount: {
    sector: string,
    count: number
  }[];

  pieChart1: Chart;
  pieChart2: Chart;
  tool: string;
  tableData: any[] = []
  xData: { label: string; value: number }[]
  yData: { label: string; value: number }[]
  rows: number = 5;
  sdgDetailsList: any = [];
  heatMapScore: HeatMapScore[];
  heatMapData: TableData[];

  constructor(
    private investorProxy: InvestorToolControllerServiceProxy,
    public masterDataService: MasterDataService,
    private cdr: ChangeDetectorRef,
    private renderer: Renderer2
  ) {
  }
  ngOnInit(): void {
    // let tool = 'All Option'
    const token = localStorage.getItem('ACCESS_TOKEN')!;
    const tokenPayload = decode<any>(token);
    this.userRole = tokenPayload.role.code;


    this.xData = this.masterDataService.xData
    this.yData = this.masterDataService.yData
    // this.investorProxy.findSectorCount(tool).subscribe((res: any) => {
    //   this.sectorCount = res;
    //   setTimeout(() => {

    //     this.viewSecterTargetedPieChart();
    //   }, 100);

    // });
    let event: any = {};
    event.rows = this.rows;
    event.first = 0;
    this.loadgridData(event);
    // this.sdgResults();
    this.sectorCountResult();

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
    this.targetDivHeight = this.targetDiv.nativeElement.offsetHeight;
    this.renderer.setStyle(this.sourceDiv.nativeElement, 'height', `${this.targetDivHeight}px`);
    this.renderer.setStyle(this.sourceDiv.nativeElement, 'overflow-y', 'auto');
    // this.targetDivHeightofMeetingEnvironmental = this.targetDiv2.nativeElement.offsetHeight;
    // this.renderer.setStyle(this.sourceDiv2.nativeElement, 'height', `${this.targetDivHeightofMeetingEnvironmental}px`);
    // this.renderer.setStyle(this.sourceDiv2.nativeElement, 'overflow-y', 'auto');
    this.cdr.detectChanges();
  }
  sectorCountResult(){
    let tool = 'All Option'
    this.investorProxy.findSectorCount(tool).subscribe((res: any) => {
      this.sectorCount = res;
      setTimeout(() => {

        this.viewSecterTargetedPieChart();
        this.updateSourceDivHeight();
      }, 20);
      this.sdgResults()

    });
   }


  viewSecterTargetedPieChart() {
    const labels = this.sectorCount.map((item) => item.sector);
    let counts: number[] = this.sectorCount.map((item) => item.count);
    const total = counts.reduce((acc, val) => acc + val, 0);
    const percentages = counts.map(count => ((count / total) * 100).toFixed(2));
    if (!this.canvasRefSectorCountPieChart) {
      return;
    }

    const canvas = this.canvasRefSectorCountPieChart.nativeElement;
    const ctx = canvas.getContext('2d');

    if (!ctx) {
      return;
    }

    if (this.pieChart2) {
      // Update the chart data
      this.pieChart2.data.datasets[0].data = counts;
      this.pieChart2.data.labels = labels
      this.pieChart2.update();
    }
    else {
      this.pieChart2 = new Chart(ctx, {
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
          plugins: {
            legend: {
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
            tooltip: {
              position: 'average',
              boxWidth: 10,
              callbacks: {

                label: (ctx) => {
                  // let sum = ctx.dataset._meta[0].total;
                  // let percentage = (value * 100 / sum).toFixed(2) + "%";
                  // return percentage;
                  let sum = 0;
                  let array = counts
                  array.forEach((number) => {
                    sum += Number(number);
                  });
                  let percentage = (counts[ctx.dataIndex] * 100 / sum).toFixed(2) + "%";

                  return [
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

  }

  loadgridData = (event: LazyLoadEvent) => {
    this.loading = true;
    this.totalRecords = 0;

    let pageNumber =
      event.first === 0 || event.first === undefined
        ? 1
        : event.first / (event.rows === undefined ? 1 : event.rows) + 1;
    this.rows = event.rows === undefined ? 10 : event.rows;
    this.investorProxy.getDashboardAllData(pageNumber,this.rows).subscribe((res) => {
      this.tableData=res.items;
      this.heatMapScore = this.tableData.map(item => {return {processScore: item.process_score, outcomeScore: item.outcome_score}})
      this.heatMapData = this.tableData.map(item => {return {interventionId: item.climateAction?.intervention_id, interventionName: item.climateAction?.policyName, processScore: item.process_score, outcomeScore: item.outcome_score}}) 
      this.totalRecords= res.meta.totalItems
      this.loading = false;
    }, err => {
      this.loading = false;});

  
  };


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

  enterHeatMapPoint(x: number, y: number, event: any) {
    this.pointTableDatas = this.tableData.filter(item => item.outcome_score === x && item.process_score === y)
    if (this.pointTableDatas.length > 0) {
      this.op.show(event);
    }
  }

  leaveHeatMapPoint() {
    this.pointTableDatas = [];
  }

  getIntervention(x: number, y: number) {
    return this.tableData.some(item => item.outcome_score === x && item.process_score === y);
  }

  sdgResults() {
    this.sdgDetailsList = []
    this.investorProxy.sdgSumAllCalculate().subscribe(async (res: any) => {
      this.sdgDetailsList = res;
      setTimeout(() => {
        this.viewFrequencyofSDGsChart();
        
      }, 200);
    });
  }

  viewFrequencyofSDGsChart() {
    let labels = this.sdgDetailsList.map((item: any) => item.sdg);
    let counts: number[] = this.sdgDetailsList.map((item: any) => item.count);
    let total = counts.reduce((acc, val) => acc + val, 0);
    let percentages = counts.map(count => ((count / total) * 100).toFixed(2));

    if (!this.canvasRefSDGsPieChart) {
      return;
    }

    const canvas = this.canvasRefSDGsPieChart.nativeElement;
    const ctx = canvas.getContext('2d');

    if (!ctx) {
      return;
    }

    if (this.pieChart1) {
      // Update the chart data
      this.pieChart1.data.datasets[0].data = counts;
      this.pieChart1.data.labels = labels
      this.pieChart1.update();
    }
    else {


      this.pieChart1 = new Chart(ctx, {
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
          plugins: {
            legend: {
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
            tooltip: {
              position: 'average',
              boxWidth: 10,
              callbacks: {

                label: (ctx) => {
                  // let sum = ctx.dataset._meta[0].total;
                  // let percentage = (value * 100 / sum).toFixed(2) + "%";
                  // return percentage;
                  let sum = 0;
                  let array = counts
                  array.forEach((number) => {
                    sum += Number(number);
                  });
                  let percentage = (counts[ctx.dataIndex] * 100 / sum).toFixed(2) + "%";

                  return [
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

      });
    }

  }

}
