import { Component, OnInit } from '@angular/core';
import { MasterDataService } from 'app/shared/master-data.service';

@Component({
  selector: 'app-review-data-path',
  templateUrl: './review-data-path.component.html',
  styleUrls: ['./review-data-path.component.css']
})
export class ReviewDataPathComponent implements OnInit {

  constructor(
    public masterDataService: MasterDataService
  ) { }

  ngOnInit(): void {
  }

}
