import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { InvestorToolControllerServiceProxy, MethodologyAssessmentControllerServiceProxy } from 'shared/service-proxies/service-proxies';
import { DatePipe } from '@angular/common';
import { DomSanitizer } from '@angular/platform-browser';
import  {jsPDF} from "jspdf"
import html2canvas from 'html2canvas';

@Component({
  selector: 'app-assessment-result-investor',
  templateUrl: './assessment-result-investor.component.html',
  styleUrls: ['./assessment-result-investor.component.css']
})
export class AssessmentResultInvestorComponent implements OnInit {

  @ViewChild('content', {static:false}) el! : ElementRef;
  title = "Angular CLI and isPDF"
  assessmentId: number
  averageProcess : number
  averageOutcome : number

  assessmentData :any = []
  assessmentParameters : any = []

  impactCoverList: any = []
  sectorList: any = []
  levelofImplementation: string
  areaCovered: string
  levelofImplemetation : string
  geographicalAreasCovered : string
  meth1Process : any = []
  meth1Outcomes : any = []
  categoryDataArray : any = []
  categoryDataArrayOutcome : any = []

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
    private sanitizer: DomSanitizer,
    private investorToolControllerproxy: InvestorToolControllerServiceProxy,
    ) { }

  ngOnInit(): void {

    this.route.queryParams.subscribe(params => {
      this.assessmentId = params['assessmentId'];
      this.averageProcess = params['averageProcess'];
      this.averageOutcome = params['averageOutcome'];
    });

    console.log("daaaaa:",this.assessmentId)
    console.log("daaaaa111:",this.averageProcess)
    console.log("daaaaa222:",this.averageOutcome)


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

    this.investorToolControllerproxy.getResultByAssessment( this.assessmentId).subscribe((res: any) => {
      console.log("getResultByAssessment: ", res)
      this.levelofImplemetation = res.level_of_implemetation
      this.geographicalAreasCovered = res.geographical_areas_covered

    });

    this.investorToolControllerproxy.findAllSectorData( this.assessmentId).subscribe((res: any) => {
      console.log("findAllSectorData: ", res)
      for(let x of res){
        this.sectorList.push(x.sector.name)
      }
    });

    this.investorToolControllerproxy.findAllImpactCoverData( this.assessmentId).subscribe((res: any) => {
      console.log("findAllImpactCoverData: ", res)
      for(let x of res){
        this.impactCoverList.push(x.name)
      }
    });


    this.methassess.findAllCategories().subscribe((res2: any) => {
      console.log("categoryList", res2)
      for (let x of res2) {
        //this.categotyList.push(x);
          if(x.type === 'process'){
            this.meth1Process.push(x)
          }
          if(x.type === 'outcome'){
            this.meth1Outcomes.push(x)
          }
      }
      console.log("yyyy",this.meth1Process )
    });


    this.investorToolControllerproxy.findAllAssessData( this.assessmentId).subscribe((res: any) => {
      console.log("findAllAssessData: ", res)


      for(let category of this.meth1Process){
        let categoryData: any = {
          categoryName: category.name ,
          characteristics: [],
          categotyRelevance : 0,
          categoryLikelihood : 0
        };

        let totalRel = 0
        let countRel = 0
        let totalLikelihood = 0
        let countLikelihood = 0
        for(let x of res ){
          if(category.name === x.category.name){
            categoryData.categoryName = category.name;
            categoryData.characteristics.push(
              {
                relevance : x.relavance,
                likelihood : x.likelihood,
                name : x.characteristics.name
              }
            )

             totalRel = totalRel +  x.relavance
             countRel ++

             totalLikelihood = totalLikelihood + x.likelihood
             countLikelihood ++

          }
        }

        categoryData.categotyRelevance = totalRel/countRel
        categoryData.categoryLikelihood = totalLikelihood/countLikelihood
        this.categoryDataArray.push(categoryData)
      }

      for(let category of this.meth1Outcomes){
        let categoryData: any = {
          categoryName: category.name ,
          characteristics: [],
          categotyRelevance : 0,
          categoryLikelihood : 0
        };

        let totalRel2 = 0
        let countRel2 = 0
        let totalLikelihood2 = 0
        let countLikelihood2 = 0
        for(let x of res ){
          if(category.name === x.category.name){
            categoryData.categoryName = category.name;
            categoryData.characteristics.push(
              {
                relevance : x.relavance,
                likelihood : x.likelihood,
                name : x.characteristics.name
              }
            )

             totalRel2 = totalRel2 +  x.relavance
             countRel2 ++

             totalLikelihood2 = totalLikelihood2 + x.likelihood
             countLikelihood2 ++

          }
        }

        categoryData.categotyRelevance = totalRel2/countRel2
        categoryData.categoryLikelihood = totalLikelihood2/countLikelihood2
        this.categoryDataArrayOutcome.push(categoryData)
      }

      console.log("categoryDataArrayOutcome: ", this.categoryDataArrayOutcome)

    });

    setTimeout(() => {
      this.load = true;
    }, 1000);

  }


  makePDF() {
    const element = document.getElementById('content');
    if (element) {
      html2canvas(element, {scale: 2}).then(canvas => {
        const imgWidth = 208;
        const imgHeight = canvas.height * imgWidth / canvas.width;
        const contentDataURL = canvas.toDataURL('image/jpeg', 1.0);
        const pdf = new jsPDF('p', 'mm', 'a4', true); // set the last parameter to true to enable adding more pages
        const position = 0;
        let currentPage = 1;
        const totalPages = Math.ceil(canvas.height / pdf.internal.pageSize.getHeight());

        pdf.addImage(contentDataURL, 'JPEG', 0, position, imgWidth, imgHeight);
        while (currentPage < totalPages) {
          currentPage++;
          pdf.addPage();
          const newHeight = (currentPage - 1) * pdf.internal.pageSize.getHeight();
          pdf.addImage(contentDataURL, 'JPEG', 0, -newHeight, imgWidth, imgHeight);
        }

        pdf.save('assessment-result.pdf');
      });
    }
  }


}
