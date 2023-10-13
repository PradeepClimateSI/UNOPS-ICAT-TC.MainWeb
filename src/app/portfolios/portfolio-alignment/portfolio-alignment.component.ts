import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-portfolio-alignment',
  templateUrl: './portfolio-alignment.component.html',
  styleUrls: ['./portfolio-alignment.component.css']
})
export class PortfolioAlignmentComponent {
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
          case -2:
            return '#f8696b';
          case -1:
            return '#fa9473';
          case 0:
            return '#fdbf7b';
          case 1:
            return '#ffeb84';
          case 2:
            return '#ccde82';
          case 3:
            return '#98ce7f';
          case 4:
            return '#63be7b';
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
