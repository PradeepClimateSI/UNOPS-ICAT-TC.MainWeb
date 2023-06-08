import { Component, OnInit } from '@angular/core';
import {  Portfolio } from 'shared/service-proxies/service-proxies';

@Component({
  selector: 'app-portfolio-add',
  templateUrl: './portfolio-add.component.html',
  styleUrls: ['./portfolio-add.component.css']
})
export class PortfolioAddComponent implements OnInit {

  constructor() { }

  portfolio : Portfolio = new Portfolio();

  optionList = [
    { name: 'Yes' },
    { name: 'No' },
    // Add other options if needed
  ];



  ngOnInit(): void {
  }

  save( data : any){
    console.log("aa", data)
  }

}
