import { Component } from '@angular/core';

@Component({
  selector: 'app-portfolio-process-data',
  templateUrl: './portfolio-process-data.component.html',
  styleUrls: ['./portfolio-process-data.component.css']
})
export class PortfolioProcessDataComponent {
  //TODO sort process data by order before loop the table
  process_data = [
    {
      col_set_1: [
        {label: 'INTERVENTION INFORMATION', colspan: 4},
        {label: 'Technology', colspan: 4},
      ],
      col_set_2: [
        {label: 'ID', code: 'id'},
        {label: 'Intervention Name', code: 'name'},
        {label: 'Intervention Type', code: 'type'},
        {label: 'Status', code: 'status'},
        {label: 'R&D', code: 'R_&_D'},
        {label: 'Adoption', code: 'ADOPTION'},
        {label: 'Category score', code: 'category_score'}
      ],
      interventions: [
        {
          id: '1',
          name: 'Test 1',
          type: 'Type 1',
          status: 'Complete',
          'R_&_D': '2',
          ADOPTION: '3',
          category_score: '4'
        },
        {
          id: '2',
          name: 'Test 2',
          type: 'Type 2',
          status: 'Complete',
          'R_&_D': '2',
          ADOPTION: '3',
          category_score: '4'
        }
      ],
      characteristic_count: 2,
      order: 1
    },
  ]
}

