import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-portfolio-outcome-data',
  templateUrl: './portfolio-outcome-data.component.html',
  styleUrls: ['./portfolio-outcome-data.component.css']
})
export class PortfolioOutcomeDataComponent {
  @Input() outcome_data: any;
}
