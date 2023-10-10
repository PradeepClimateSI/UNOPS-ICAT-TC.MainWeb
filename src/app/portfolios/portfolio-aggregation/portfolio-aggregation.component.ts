import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-portfolio-aggregation',
  templateUrl: './portfolio-aggregation.component.html',
  styleUrls: ['./portfolio-aggregation.component.css']
})
export class PortfolioAggregationComponent {
  @Input() aggregation_data: any = {};
  @Input() alignment_data: any = {};

  getValue(data: any){
    if (data){
      if (data.name){
        return data.name
      } else if (!data.name){
        return data
      } 
    } else {
      return '-'
    }
  }

  getBackgroundColor(data: any): string {
    if (data){
      if (data.name){
        switch (data.value) {
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
      } else if (!data.name){
        return ''
      } else return ''
    } else {
      return ''
    }
    
  }

}
