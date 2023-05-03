import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { MethodologyAssessmentControllerServiceProxy } from 'shared/service-proxies/service-proxies';

import { DatePipe } from '@angular/common';
import { DomSanitizer } from '@angular/platform-browser';
import  {jsPDF} from "jspdf"
import html2canvas from 'html2canvas';

@Component({
  selector: 'app-assessment-result',
  templateUrl: './assessment-result.component.html',
  styleUrls: ['./assessment-result.component.css']
})
export class AssessmentResultComponent implements OnInit {

  @ViewChild('content', {static:false}) el! : ElementRef;
  title = "Angular CLI and isPDF"
  assessmentId: number
  averageProcess : number
  averageOutcome : number

  assessmentData :any = []
  assessmentParameters : any = []

  policyName : string
  assessmentType: string
  date1 : any
  date2: any
  barriersList : any =[]
  tool :string
  assessment_approach : string
  assessment_method : string
  filteredData : any = []

  processCategory : any = []
  outcomeCategory : any = []
load: boolean
  constructor( private route: ActivatedRoute,
    private methassess : MethodologyAssessmentControllerServiceProxy,
    private datePipe: DatePipe,
    private sanitizer: DomSanitizer
    ) { }

    ngOnInit() {

      this.route.queryParams.subscribe(params => {
        this.assessmentId = params['assessmentId'];
        this.averageProcess = params['averageProcess'];
        this.averageOutcome = params['averageOutcome'];
      });

      console.log("daaaaa:",this.assessmentId)
      console.log("daaaaa111:",this.averageProcess)
      console.log("daaaaa222:",this.averageOutcome)


      //new
      this.methassess.barriesByassessId( this.assessmentId).subscribe((res: any) => {
        console.log("barriesByassessId : ", res)
        for(let x of res){
          this.barriersList.push(x.barriers.barrier)
        }

      });

      //new
      this.methassess.findAllBarrierData( this.assessmentId).subscribe((res: any) => {
        console.log("findAllBarrierData : ", res)
      });

      //new
      this.methassess.assessmentParameters( this.assessmentId).subscribe((res: any) => {
        console.log("assessmentParameters : ", res)
        this.filteredData = res
        this.myFunction();
      });


      //new
      this.methassess.assessmentData( this.assessmentId).subscribe((res: any) => {
        console.log("assessmentDataaaaa: ", res)
        for (let x of res){
          this.policyName = x.climateAction.policyName
          this.assessmentType = x.assessmentType
          this.date1 = x.from
            this.date2 = x.to
            this.tool = x.tool
            this.assessment_approach = x.assessment_approach
            this.assessment_method= x.assessment_method

        }

      });

      setTimeout(() => {
        this.load = true;
      }, 1000);
    }




  myFunction() {
    for(let data of this.filteredData){
      console.log("3")
      if(data.category.type === 'process' ){
       if(data.characteristics){
        let value : any = {}
        value = {
          category : data.category.name,
          chaName : data.characteristics.name,
          score : data.score,
          relevance : data.relevance
        }
        this.processCategory.push(value)
       }

       if(!data.characteristics){
        let value3 : any = {}
        value3 = {
          category : data.category.name,
          /* chaName : "Null", */
          score : data.score,
          relevance : data.relevance
        }
        this.processCategory.push(value3)
       }

      }


      if(data.category.type === 'outcome' ){
        if(data.characteristics){
         let value2 : any = {}
         value2 = {
           category : data.category.name,
           chaName : data.characteristics.name,
           score : data.score,
           relevance : data.relevance
         }
         this.outcomeCategory.push(value2)
        }

        if(!data.characteristics){
         let value4 : any = {}
         value4 = {
           category : data.category.name,
           /* chaName : "Null", */
           score : data.score,
           relevance : data.relevance
         }
         this.outcomeCategory.push(value4)
        }

       }

    }


  }

  makePDF() {
    const element = document.getElementById('content');
    if (element) {
      html2canvas(element, { scale: 2 }).then(canvas => {
        const imgWidth = 208;
        const imgHeight = canvas.height * imgWidth / canvas.width;
        const contentDataURL = canvas.toDataURL('image/jpeg', 1.0);
        const pdf = new jsPDF('p', 'mm', 'a4', false);
        const position = 0;
        pdf.addImage(contentDataURL, 'JPEG', 0, position, imgWidth, imgHeight);
        pdf.save('assessment-result.pdf');
      });
    }
  }




}


