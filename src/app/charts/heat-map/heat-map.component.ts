import { Component, Input, ViewChild } from '@angular/core';
import { OverlayPanel } from 'primeng/overlaypanel';

@Component({
  selector: 'app-heat-map',
  templateUrl: './heat-map.component.html',
  styleUrls: ['./heat-map.component.css']
})
export class HeatMapComponent {

  @Input() xData: {label: string; value: number}[]
  @Input() yData: {label: string; value: number}[]
  @Input() score: HeatMapScore[]
  @Input() showOp?: boolean
  @Input() tableData?: TableData[]

  @ViewChild('op') op: OverlayPanel;
  pointTableDatas: TableData[];

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

  getIntervention(x: number, y: number) {
    return this.score?.some(item => item.processScore === y && item.outcomeScore === x);
  }

  enterHeatMapPoint(x: number, y: number, event: any) {
    console.log(this.tableData)
    if (this.tableData){
      this.pointTableDatas = this.tableData.filter(item => item.outcomeScore === x && item.processScore === y)
      if (this.pointTableDatas.length > 0) {
        this.op.show(event);
      }
    }
  }

  leaveHeatMapPoint() {
    this.pointTableDatas = [];
  }

}

export interface HeatMapScore {
  processScore: number
  outcomeScore: number
}

export interface TableData {
  interventionId: string
  interventionName: string
  processScore: number
  outcomeScore: number
}
