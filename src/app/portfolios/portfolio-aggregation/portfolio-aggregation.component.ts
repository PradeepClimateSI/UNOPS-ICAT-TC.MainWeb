import { Component } from '@angular/core';

@Component({
  selector: 'app-portfolio-aggregation',
  templateUrl: './portfolio-aggregation.component.html',
  styleUrls: ['./portfolio-aggregation.component.css']
})
export class PortfolioAggregationComponent {
  aggregation_data = {
    col_set_1: [
      {label: 'INTERVENTION INFORMATION', colspan: 4},
      {label: '', colspan: 1}
    ],
    col_set_2: [
      {label: 'ID', code: 'id'},
      {label: 'INTERVENTION NAME', code: 'name'},
      {label: 'INTERVENTION TYPE', code: 'type'},
      {label: 'STATUS', code: 'status'},
      {label: 'GHG MITIGATION (MT CO2-EG)', code: 'mitigation'},
    ],
    interventions: [
      {
        id: '1',
        name: 'Test 1',
        type: 'Test 1',
        status: 'Complete',
        mitigation: 12234
      }
    ],
    total: 23423423
  }

  alignment_data = {
    col_set_1: [
      {label: "INTERVENTION INFORMATION", colspan: 4},
      {label: '', colspan: 1},
      {label: '', colspan: 1},
      {label: '', colspan: 1}
    ],
    col_set_2: [
      {label: 'ID', code: 'id'},
      {label: 'INTERVENTION NAME', code: 'name'},
      {label: 'INTERVENTION TYPE', code: 'type'},
      {label: 'STATUS', code: 'status'},
      {label: 'SDG 1', code: 'SDG1'},
      {label: 'SDG 2', code: 'SDG2'},
      {label: 'SDG 3', code: 'SDG3'},
    ],
    interventions: [
      {
        id: '1',
        name: 'Test 1',
        type: 'Test 1',
        status: 'Complete',
        SDG1: 'Yes',
        SDG2: 'Yes',
        SDG3: 'Yes'
      }
    ],
    sdg_count: 3
  }
}
