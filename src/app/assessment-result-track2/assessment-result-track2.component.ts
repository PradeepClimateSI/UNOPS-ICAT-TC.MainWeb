import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { MethodologyAssessmentControllerServiceProxy } from 'shared/service-proxies/service-proxies';
import { DatePipe } from '@angular/common';
import { DomSanitizer } from '@angular/platform-browser';
import  {jsPDF} from "jspdf"
import html2canvas from 'html2canvas';

@Component({
  selector: 'app-assessment-result-track2',
  templateUrl: './assessment-result-track2.component.html',
  styleUrls: ['./assessment-result-track2.component.css']
})
export class AssessmentResultTrack2Component implements OnInit {

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
  barriersData : any = []

  processCategory : any = []
  outcomeCategory : any = []
  characteristicsList  : any = []
  assessategory : any = []
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


      this.methassess.getAssessCategory(this.assessmentId).subscribe((res3: any) => {
        console.log("getAssessCategory", res3)
        this.assessategory = res3

      });


      //new
      this.methassess.findAllBarrierData( this.assessmentId).subscribe((res: any) => {
        console.log("findAllBarrierData : ", res)
        this.barriersData =res
      });

      //new
      this.methassess.assessmentParameters( this.assessmentId).subscribe((res: any) => {
        console.log("assessmentParameters : ", res)
        console.log("assessategory2222 : ", res)
        for(let x of res){
          if(x.isCategory == 1)
          {
            for(let y of this.assessategory){
              if(x.category.id == y.category.id){
                x.score = y.categoryScore
              }
            }

          }

          this.filteredData.push(x)
        }

        console.log("fffffilteredData", this.filteredData)

        this.myFunction();
      });

      this.methassess.findAllCharacteristics().subscribe((res3: any) => {
        console.log("ressss3333", res3)
        this.characteristicsList = res3

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

      console.log("processCategory: ", this.processCategory)
      console.log("outcomeCategory: ", this.outcomeCategory)

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
          relevance : data.relevance,
          weight : data.weight
        }
        this.processCategory.push(value)
       }

       if(!data.characteristics){
        let value3 : any = {}
        value3 = {
          category : data.category.name,
          /* chaName : "Null", */
          score : data.score,
          relevance : data.relevance,
          weight : data.weight
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
           relevance : data.relevance,
           weight : data.weight
         }
         this.outcomeCategory.push(value2)
        }

        if(!data.characteristics){
         let value4 : any = {}
         value4 = {
           category : data.category.name,
           /* chaName : "Null", */
           score : data.score,
           relevance : data.relevance,
           weight : data.weight
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
        const imgHeight = (canvas.height * imgWidth / canvas.width)-75;
        const contentDataURL = canvas.toDataURL('image/jpeg', 1.0);
        const pdf = new jsPDF('p', 'mm', 'a4', true); // set the last parameter to true to enable adding more pages
        const marginTop = 6;
        const marginBottom = 10;
        const position = marginTop;
        let currentPage = 1;
        const totalPages = Math.ceil((canvas.height - marginTop - marginBottom) / pdf.internal.pageSize.getHeight());

        pdf.addImage(contentDataURL, 'JPEG', 0, position, imgWidth, imgHeight);
        if (totalPages > 1) {
          pdf.addPage();
          pdf.addImage(contentDataURL, 'JPEG', 0, -pdf.internal.pageSize.getHeight() + marginTop, imgWidth, imgHeight);
        }

        // Delete extra pages
        const totalPdfPages = pdf.getNumberOfPages();
        for (let i = 5; i <= totalPdfPages; i++) {
          pdf.deletePage(i);
        }

        pdf.save('assessment-result.pdf');
      });
    }
  }


hasMatchingBarriers(cha: any) {
  return this.barriersData.some((ba: { characteristics: { id: any; }; }) => cha.id == ba.characteristics.id);
}

getMatchingBarriers(cha : any) {
  return this.barriersData.filter((ba: { characteristics: { id: any; }; }) => cha.id == ba.characteristics.id);
}


getCharacteristicScore(characteristicId: any) {
  let totalScore = 0;
  this.barriersData.forEach((ba: { characteristics: { id: any; }; barrier_score: number; barrier_weight: number; }) => {
    if (ba.characteristics.id === characteristicId) {
      totalScore += ba.barrier_score * ba.barrier_weight;
    }
  });
  return totalScore;
}



}



