import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-verify-parameter',
  templateUrl: './verify-parameter.component.html',
  styleUrls: ['./verify-parameter.component.css']
})
export class VerifyParameterComponent implements OnInit {

  parameters: any[]
  loading: boolean = false

  flag: number;

  constructor() { }

  ngOnInit(): void {
  }

}
