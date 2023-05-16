import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Table } from 'primeng/table';
import { MethodologyAssessmentControllerServiceProxy } from 'shared/service-proxies/service-proxies';

@Component({
  selector: 'app-assessment',
  templateUrl: './assessment.component.html',
  styleUrls: ['./assessment.component.css']
})
export class AssessmentComponent implements OnInit {

  resultsList : any = []
  assessmentData :any =[]

  results : any = []
data2 : any
loading: boolean ;
totalRecords : number
load : boolean = false

dt2 : Table
  constructor(
    private methassess : MethodologyAssessmentControllerServiceProxy,
    private router: Router,
  ) { }




  ngOnInit() {

    this.methassess.results().subscribe((res: any) => {
      console.log("resultsss : ", res)
      this.resultsList = res

    });


    this.methassess.assessmentDetails().subscribe((res: any) => {
      console.log("assessmentData : ", res)
      this.assessmentData = res


      for(let x of this.assessmentData){
        for(let result of this.resultsList){

          if(result.assessment.id == x.id){
            console.log("aaaaaaaaaaaaaaaa")
            let data : any = {
              assessId : x.id,
              meth : x.climateAction.policyName,
              method : result.assessment.assessment_method,
              approach : result.assessment.assessment_approach,
              tool : result.assessment.tool,
              assessmentType : result.assessment.assessmentType,
              averageOutcome : result.averageOutcome,
              averageProcess : result.averageProcess

            }

            this.results.push(data)
          }
        }
      }

    });


      console.log("resultdataa",this.results)

      setTimeout(() => {
        this.load = true;
      }, 1000);

  }

  clear(table: Table) {
    table.clear();
}

onInput(event: any, dt: any) {
  const value = event.target.value;
  dt.filterGlobal(value, 'contains');
}

tool :string
assessment_method : string

myFunction(assessId : any, averageProcess: any, averageOutcome: any){

  this.methassess.assessmentData(assessId).subscribe((res: any) => {
    console.log("assessmentDataaaaa: ", res)
    for (let x of res) {
      this.tool = x.tool
      this.assessment_method = x.assessment_method
    }

  });

  setTimeout(() => {


  console.log("dddd", assessId, this.tool, this.assessment_method)

  if (this.tool === 'Investment & Private Sector Tool' || (this.tool === 'Portfolio Tool' && this.assessment_method === 'Track 4')) {

    this.router.navigate(['/assessment-result-investor', assessId], {
      queryParams: {
        assessmentId: assessId
      }
    });
  }
  else {
   // console.log("dddd", assessId, averageOutcome, averageProcess)
    this.router.navigate(['/assessment-result', assessId], {
      queryParams: {
        assessmentId: assessId,
        averageProcess: averageProcess, averageOutcome: averageOutcome
      }
    });
  }

}, 1000);


}

}
