import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-portfolio-aggregation',
  templateUrl: './portfolio-aggregation.component.html',
  styleUrls: ['./portfolio-aggregation.component.css']
})
export class PortfolioAggregationComponent {
  @Input() aggregation_data: any = {};

}
