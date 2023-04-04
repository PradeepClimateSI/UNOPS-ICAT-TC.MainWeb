import { Component, Input, OnInit } from '@angular/core';
import { MethodologyAssessmentParameters } from 'shared/service-proxies/service-proxies';

@Component({
  selector: 'app-verify-parameter',
  templateUrl: './verify-parameter.component.html',
  styleUrls: ['./verify-parameter.component.css']
})
export class VerifyParameterComponent implements OnInit {

  @Input() parameters: MethodologyAssessmentParameters[]
  @Input() verificationStatus: any
  loading: boolean = false

  flag: number;

  constructor() { }

  ngOnInit(): void {
  }

}
