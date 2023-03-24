import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { MethodologyAssessmentControllerServiceProxy } from 'shared/service-proxies/service-proxies';

import { DatePipe } from '@angular/common';

@Component({
  selector: 'app-assessment-result',
  templateUrl: './assessment-result.component.html',
  styleUrls: ['./assessment-result.component.css']
})
export class AssessmentResultComponent implements OnInit {

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
    private datePipe: DatePipe
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

      this.methassess.assessmentDetails().subscribe((res: any) => {
        console.log("assessmentData : ", res)
        this.assessmentData = res

        for(let assess of res){
          if(assess.id == this.assessmentId){
            this.policyName= assess.climateAction.policyName
            this.assessmentType = assess.assessmentType
            this.date1 = assess.from
            this.date2 = assess.to
          }
        }
      });

      this.methassess.findByAllAssessmentData().subscribe( (res: any) => {
        console.log("assessmentParameters : ", res)
        this.assessmentParameters =res

        for(let data of res){
          if(data.assessment.id == this.assessmentId){
            this.tool = data.assessment.tool
            this.assessment_approach = data.assessment.assessment_approach
            this.assessment_method= data.assessment.assessment_method

            this.filteredData.push(data) //filter dataaaa

          }
        }

        // Move myFunction() call inside subscribe() callback function
        this.myFunction();
        console.log("filteredData : ", this.filteredData);
        console.log("processCategory : ", this.processCategory);
        console.log("outcomeCategory : ", this.outcomeCategory);
        this.load = true
      });

      setTimeout(() => {
        this.load = true;
      }, 5000);
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

}


