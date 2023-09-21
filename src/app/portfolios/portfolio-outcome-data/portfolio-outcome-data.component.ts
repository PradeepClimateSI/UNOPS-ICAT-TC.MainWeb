import { Component } from '@angular/core';

@Component({
  selector: 'app-portfolio-outcome-data',
  templateUrl: './portfolio-outcome-data.component.html',
  styleUrls: ['./portfolio-outcome-data.component.css']
})
export class PortfolioOutcomeDataComponent {
  //TODO sort outcome data by order before loop the table
  outcome_data = [
    {
      comparison_type: 'SCALE COMPARISON',
      col_set_1: [
        {label: 'INTERVENTION INFORMATION', colspan: 4},
        {label: 'GHG', colspan: 4}
      ],
      col_set_2: [
        {label: 'ID', code: 'id'},
        {label: 'INTERVENTION NAME', code: 'name'},
        {label: 'INTERVENTION TYPE', code: 'type'},
        {label: 'STATUS', code: 'status'},
        {label: 'INTERNATIONAL', code: 'international'},
        {label: 'NATIONAL/SECTORIAL', code: 'national'},
        {label: 'SUBNATIONAL/SUBSECTORIAL', code: 'subnational'},
        {label: 'CATEGORY SCORE', code: 'category_score'},
      ],
      interventions: [
        {
          id: '1',
          name: 'Test 1',
          type: 'Type 1',
          status: 'Complete',
          international: '2',
          national: '3',
          subnational: '4',
          category_score: '5'
        },
        {
          id: '1',
          name: 'Test 1',
          type: 'Type 1',
          status: 'Complete',
          international: '2',
          national: '3',
          subnational: '4',
          category_score: '5'
        },
      ],
      order: 1
    },
    {
      comaparison_type: 'SCALE COMPARISON',
      col_set_1: [
        {label: 'INTERVENTION INFORMATION', colspan: 4},
        {label: 'GHG', colspan: 1},
        {label: 'SDG-NO POVERTY', colspan: 1},
        {label: 'ADAPTATION', colspan: 1},
        {label: '', colspan: 1}
      ],
      col_set_2: [
        {label: 'ID', code: 'id'},
        {label: 'INTERVENTION NAME', code: 'name'},
        {label: 'INTERVENTION TYPE', code: 'type'},
        {label: 'STATUS', code: 'status'},
        {label: 'CATEGORY SCORE', code: 'ghg_score'},
        {label: 'CATEGORY SCORE', code: 'sdg_no_poverty_score'},
        {label: 'CATEGORY SCORE', code: 'adaption_score'},
        {label: 'CATEGORY SCORE', code: 'category_score'},
      ],
      interventions: [
        {
          id: '1',
          name: 'Test 1',
          type: 'Type 1',
          status: 'Complete',
          ghg_score: '2',
          sdg_no_poverty_score: '3',
          adaption_score: '4',
          category_score: '5'
        },
        {
          id: '1',
          name: 'Test 1',
          type: 'Type 1',
          status: 'Complete',
          ghg_score: '2',
          sdg_no_poverty_score: '3',
          adaption_score: '4',
          category_score: '5'
        }
      ],
      order: 2
    }
  ]
}
