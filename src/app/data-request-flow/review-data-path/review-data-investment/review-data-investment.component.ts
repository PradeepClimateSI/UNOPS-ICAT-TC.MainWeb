import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'app-review-data-investment',
  templateUrl: './review-data-investment.component.html',
  styleUrls: ['./review-data-investment.component.css']
})
export class ReviewDataInvestmentComponent implements OnInit {

  @Input() tool: string

  constructor() { }

  ngOnInit(): void {
  }

}
