import { AfterViewInit, Component, ElementRef, Input, OnChanges, OnInit, SimpleChanges, ViewChild } from '@angular/core';
import { Chart } from 'chart.js';

@Component({
  selector: 'app-chart',
  templateUrl: './chart.component.html',
  styleUrls: ['./chart.component.css']
})
export class ChartComponent implements OnInit, AfterViewInit, OnChanges {
  @ViewChild('myCanvas', { static: true }) canvasRef!: ElementRef<HTMLCanvasElement>;

  @Input() averageOutcome: number;
  @Input() averageProcess: number;

  private chart: Chart;

  constructor() {}

  ngOnInit(): void {}

  ngAfterViewInit(): void {
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
      type: 'line',
      data: {
        datasets: [
          {
            label: 'My Dataset',
            data: [{ x: this.averageOutcome, y: this.averageProcess }],
            backgroundColor: gradient,
            borderColor: 'black',
            borderWidth: 1,
            pointRadius: 5,
            pointBackgroundColor: 'blue',
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
            max: 5,
            ticks: {
              stepSize: 1,
            },
            title: {
              display: true,
              text: 'OUTCOME - EXTENT OF TRANSFORMATION'
            },
          },
          y: {
            type: 'linear',
            min: 0,
            max: 5,
            ticks: {
              stepSize: 1,
            },
            title: {
              display: true,
              text: 'PROCESS - LIKELIHOOD OF TRANSFORMATIONAL OUTCOME'
            },
          },
        },
        plugins: {
          tooltip: {
            callbacks: {
              label: (context) => {
                const data = context.dataset.data[context.dataIndex];
                return `(${this.averageOutcome}, ${this.averageProcess})`;
              },
            },
          },
        },
      },
    });
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (this.chart && (changes['averageOutcome'] || changes['averageProcess'])) {
      const newData = [{ x: this.averageOutcome, y: this.averageProcess }];
      this.chart.data.datasets[0].data = newData;
      this.chart.update();
    }
  }
}
