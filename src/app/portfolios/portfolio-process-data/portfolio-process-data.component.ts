import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-portfolio-process-data',
  templateUrl: './portfolio-process-data.component.html',
  styleUrls: ['./portfolio-process-data.component.css']
})
export class PortfolioProcessDataComponent {
  @Input() process_data: any;
}

