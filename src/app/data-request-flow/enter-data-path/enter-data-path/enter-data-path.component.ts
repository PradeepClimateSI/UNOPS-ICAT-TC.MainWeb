import { Component, OnInit } from '@angular/core';
import { MasterDataService } from 'app/shared/master-data.service';

@Component({
  selector: 'app-enter-data-path',
  templateUrl: './enter-data-path.component.html',
  styleUrls: ['./enter-data-path.component.css']
})
export class EnterDataPathComponent implements OnInit {

  constructor(
    public masterDataService: MasterDataService
  ) { }

  ngOnInit(): void {
  }

}
