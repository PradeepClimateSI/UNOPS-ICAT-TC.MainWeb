import { Component, OnInit } from '@angular/core';
import { environment } from 'environments/environment';
import { DynamicDialogConfig } from 'primeng/dynamicdialog';

@Component({
  selector: 'app-guidance-video',
  templateUrl: './guidance-video.component.html',
  styleUrls: ['./guidance-video.component.css']
})
export class GuidanceVideoComponent implements OnInit {
  sourceName: any;
  isNetZero: boolean=false;
  root: string = environment.videoURL +"/"
  link:string = "";
  constructor(
    public config: DynamicDialogConfig,
  ) { }

  ngOnInit(): void {
    if (this.config.data) {
      if (this.config.data.sourceName) {
        this.sourceName = this.config.data.sourceName;
        switch(this.sourceName){
          case 'assessmentInprogreass': {
            this.link =  this.root + "Assessment inprogress.mp4";
            break
          } 
          case 'institution': {
            this.link =  this.root + "TC - Insitutions.mp4";
            break
          } 
          case 'Overview': {
            this.link =  this.root + "TC - Overview.m4v";
            break
          } 
          case 'Landing': {
            this.link =  this.root + "TC - Landing page and login.mp4";
            break
          } 
          case 'Interventions': {
            this.link =  this.root + "TC - Interventions menu.mp4";
            break
          } 
          case 'CMtool': {
            this.link =  this.root + "TC - CM tool assessments.mp4";
            break
          } 
          case 'AddSDG': {
            this.link =  this.root + "TC - Add SDG Priorities.m4v";
            break
          } 
          case 'Reports': {
            this.link =  this.root + "Reports & reset passwords.mp4";
            break
          } 
          case 'Assessmentresults': {
            this.link =  this.root + "TC - Assessment results.mp4";
            break
          } 
          case 'Portfolios': {
            this.link =  this.root + "TC- Portfolios.m4v";
            break
          } 
          case 'General': {
            this.link =  this.root + "TC-General tool assesssment.m4v";
            break
          } 
          case 'Incestment': {
            this.link =  this.root + "TC-Incestment tool.m4v";
            break
          } 
          case 'User': {
            this.link =  this.root + "User.mp4";
            break
          } 
        }
      }
    }
  }

}
