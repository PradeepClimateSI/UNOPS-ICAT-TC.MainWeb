import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-verification-detail',
  templateUrl: './verification-detail.component.html',
  styleUrls: ['./verification-detail.component.css']
})
export class VerificationDetailComponent implements OnInit {

  public card: any[] = []

  constructor() { }

  ngOnInit(): void {
    this.card = [
      {title: 'Intervention', value: 'Geothermal Energy Development Policy in Uganda'},
      {title: 'Assessment Type ', value: 'Ex-Post'},
      {title: 'Assessment Period ', value: '31/12/2022     to       31/12/2025'},
      {title: 'Barriers ', value: 'Barrier 1,Barrier 2'},
      {title: 'Methodology', value: 'Method 1'},
      {title: 'Assessment Method', value: 'Track 1'},
    ]
  }

}
