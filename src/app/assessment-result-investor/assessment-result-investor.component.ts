import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { InvestorToolControllerServiceProxy, MethodologyAssessmentControllerServiceProxy } from 'shared/service-proxies/service-proxies';
import { DatePipe } from '@angular/common';
import { DomSanitizer } from '@angular/platform-browser';
import { jsPDF } from "jspdf"
import html2canvas from 'html2canvas';
import * as XLSX from 'xlsx';


@Component({
  selector: 'app-assessment-result-investor',
  templateUrl: './assessment-result-investor.component.html',
  styleUrls: ['./assessment-result-investor.component.css']
})
export class AssessmentResultInvestorComponent implements OnInit {

  @ViewChild('content', { static: false }) el!: ElementRef;
  @ViewChild('content') content: ElementRef;

  title = "Angular CLI and isPDF"
  assessmentId: number
  averageProcess: number
  averageOutcome: number

  assessmentData: any = []
  assessmentParameters: any = []

  impactCoverList: any = []
  sectorList: any = []
  levelofImplementation: string
  areaCovered: string
  levelofImplemetation: string
  geographicalAreasCovered: string
  meth1Process: any = []
  meth1Outcomes: any = []
  categoryDataArray: any = []
  categoryDataArrayOutcome: any = []

  policyName: string
  assessmentType: string
  date1: any
  date2: any
  barriersList: any = []
  tool: string
  assessment_approach: string
  assessment_method: string
  filteredData: any = []
  barriersData: any = []

  processCategory: any = []
  outcomeCategory: any = []
  characteristicsList: any = []
  assessategory: any = []
  load: boolean

  investerTool: boolean;
  loadTitle: boolean = false;
  title2: string;

  SDGsList : any = [];
  card: any = []
  constructor(private route: ActivatedRoute,
    private methassess: MethodologyAssessmentControllerServiceProxy,
    private datePipe: DatePipe,
    private sanitizer: DomSanitizer,
    private investorToolControllerproxy: InvestorToolControllerServiceProxy,
  ) { }







  ngOnInit(): void {

    this.investerTool = true;
    this.loadTitle = false;
    this.route.queryParams.subscribe(params => {
      this.assessmentId = params['assessmentId'];
      this.averageProcess = params['averageProcess'];
      this.averageOutcome = params['averageOutcome'];
    });

    console.log("daaaaa:", this.assessmentId)
    console.log("daaaaa111:", this.averageProcess)
    console.log("daaaaa222:", this.averageOutcome)


    this.methassess.assessmentData(this.assessmentId).subscribe((res: any) => {
      console.log("assessmentDataaaaa: ", res)
      for (let x of res) {
        this.policyName = x.climateAction.policyName
        this.assessmentType = x.assessmentType
        this.date1 = x.from
        this.date2 = x.to
        this.tool = x.tool
        this.assessment_approach = x.assessment_approach
        this.assessment_method = x.assessment_method
      }
      console.log("toool", this.tool)
      if (this.tool === 'Portfolio Tool') {
        this.investerTool = false;
        this.loadTitle = true;
        this.title2 = 'Result - Assess the Transformational Change due to a Portfolio of Interventions'
      }
      else if (this.tool === 'Investment & Private Sector Tool') {
        this.investerTool = true;
        this.loadTitle = true;
        this.title2 = 'Result - Invesment & Private Sector Tool - Nitric Acid Climate Action Group Initiative'
      }

    });




    this.investorToolControllerproxy.getResultByAssessment(this.assessmentId).subscribe((res: any) => {
      console.log("getResultByAssessment: ", res)
      this.levelofImplemetation = res.level_of_implemetation
      this.geographicalAreasCovered = res.geographical_areas_covered
      this.tool = res.assessment.tool

    });

    this.investorToolControllerproxy.findAllSectorData(this.assessmentId).subscribe((res: any) => {
      console.log("findAllSectorData: ", res)
      for (let x of res) {
        this.sectorList.push(x.sector.name)
      }
    });

    this.investorToolControllerproxy.findAllImpactCoverData(this.assessmentId).subscribe((res: any) => {
      console.log("findAllImpactCoverData: ", res)
      for (let x of res) {
        this.impactCoverList.push(x.name)
      }
    });


    this.methassess.findAllCategories().subscribe((res2: any) => {
      console.log("categoryList", res2)
      for (let x of res2) {
        //this.categotyList.push(x);
        if (x.type === 'process') {
          this.meth1Process.push(x)
        }
        if (x.type === 'outcome') {
          this.meth1Outcomes.push(x)
        }
      }
      console.log("yyyy", this.meth1Process)
    });



    this.investorToolControllerproxy.findAllAssessData(this.assessmentId).subscribe(async (res: any) => {
      console.log("findAllAssessData: ", res)


      for (let category of this.meth1Process) {
        let categoryData: any = {
          categoryName: category.name,
          characteristics: [],
          categotyRelevance: 0,
          categoryLikelihood: 0
        };

        let totalRel = 0
        let countRel = 0
        let totalLikelihood = 0
        let countLikelihood = 0
        for (let x of res) {
          if (category.name === x.category.name) {
            categoryData.categoryName = category.name;
            categoryData.characteristics.push(
              {
                relevance: !x.relavance ? '-' : x.relavance,
                likelihood: !x.likelihood ? '-' : x.likelihood,
                name: x.characteristics.name
              }
            )

            totalRel = totalRel + x.relavance
            countRel++

            totalLikelihood = totalLikelihood + x.likelihood
            countLikelihood++

          }
        }

        categoryData.categotyRelevance = (totalRel / countRel).toFixed(3)
        categoryData.categoryLikelihood = (totalLikelihood / countLikelihood).toFixed(3)
        this.categoryDataArray.push(categoryData)

        // console.log("categoryDataArray: ", this.categoryDataArray)
      }

      for (let category of this.meth1Outcomes) {
        let categoryData: any = {
          categoryName: category.name,
          characteristics: [],
          categotyRelevance: 0,
          categoryLikelihood: 0,
          categoryScaleScore: 0,
          categorySustainedScore: 0
        };

        let totalScale = 0
        let countScale = 0
        let totalSustained = 0
        let countSustained = 0
        for (let x of res) {
          if (category.name === x.category.name && (x.category.name === 'GHG Scale of the Outcome' || x.category.name === 'SDG Scale of the Outcome')) {
            categoryData.categoryName = category.name;
            categoryData.characteristics.push(
              {
                scaleScore: x.score,
                sustainedScore: '-',
                name: x.characteristics.name
              }
            )

            totalScale = totalScale + x.score
            countScale++

          }
          if (category.name === x.category.name && (x.category.name === 'GHG Time frame over which the outcome is sustained' || x.category.name === 'SDG Time frame over which the outcome is sustained')) {
            categoryData.categoryName = category.name;
            categoryData.characteristics.push(
              {
                scaleScore: '-',
                sustainedScore: x.score,
                name: x.characteristics.name
              }
            )

            totalSustained = totalSustained + x.score
            countSustained++

          }
        }

        if (category.name === 'GHG Scale of the Outcome' || category.name === 'SDG Scale of the Outcome') {
          categoryData.categoryScaleScore = (totalScale / countScale).toFixed(3)
          categoryData.categorySustainedScore = '-'
        }

        if (category.name === 'GHG Time frame over which the outcome is sustained' || category.name === 'SDG Time frame over which the outcome is sustained') {
          categoryData.categorySustainedScore = (totalSustained / countSustained).toFixed(3)
          categoryData.categoryScaleScore = '-'
        }

        this.categoryDataArrayOutcome.push(categoryData)
      }

      console.log("categoryDataArrayOutcome: ", this.categoryDataArrayOutcome)

      /* Portfolio toolll */

      const data: any =  this.categoryDataArrayOutcome[1]

      const averages: any = {};

      data.characteristics.forEach((obj: { name: any; scaleScore: any; sustainedScore: any; }) => {
        if (obj.name in averages) {
          averages[obj.name].scaleScore += obj.scaleScore || 0;
          averages[obj.name].sustainedScore += obj.sustainedScore === '-' ? 0 : parseInt(obj.sustainedScore);
          averages[obj.name].count++;
        } else {
          averages[obj.name] = {
            scaleScore: obj.scaleScore || 0,
            sustainedScore: obj.sustainedScore === '-' ? 0 : parseInt(obj.sustainedScore),
            count: 1
          };
        }
      });

      const result = [];

      for (const name in averages) {
        const averageScaleScore = averages[name].scaleScore / averages[name].count;
        const averageSustainedScore = averages[name].sustainedScore / averages[name].count;

        result.push({
          scaleScore: averageScaleScore.toFixed(3),
          sustainedScore: '-',
          name: name
        });
      }

      console.log("resulttt", result);

       /* Portfolio toolll */
       const data2: any =  this.categoryDataArrayOutcome[3];

       const averages2: any = {};

       data2.characteristics.forEach((obj: { name: any; scaleScore: any; sustainedScore: any; }) => {
         if (obj.name in averages2) {
           averages2[obj.name].sustainedScore += obj.sustainedScore || 0;
           averages2[obj.name].scaleScore += obj.scaleScore === '-' ? 0 : parseInt(obj.scaleScore);
           averages2[obj.name].count++;
         } else {
           averages2[obj.name] = {
            sustainedScore: obj.sustainedScore || 0,
            scaleScore: obj.scaleScore === '-' ? 0 : parseInt(obj.scaleScore),
             count: 1
           };
         }
       });

       const result2 = [];

       for (const name in averages2) {
         const averageScaleScore2 = averages2[name].scaleScore / averages2[name].count;
         const averageSustainedScore2 = averages2[name].sustainedScore / averages2[name].count;

         result2.push({
           scaleScore: '-',
           sustainedScore: averageSustainedScore2.toFixed(3),
           name: name
         });
       }

       console.log("resulttt22", result2);


       if(!this.investerTool){
        this.categoryDataArrayOutcome[1].characteristics = []
        this.categoryDataArrayOutcome[1].characteristics = result

        this.categoryDataArrayOutcome[3].characteristics = []
        this.categoryDataArrayOutcome[3].characteristics = result2
       }

       console.log("categoryDataArrayOutcome222: ", this.categoryDataArrayOutcome)
        /* Portfolio toolll */
    });


    this.investorToolControllerproxy.findSDGs(this.assessmentId).subscribe((res: any) => {
      console.log("sdgssss: ", res)
      this.SDGsList = res
    });



    setTimeout(() => {
      this.card.push(
        ...[
          { title: 'Assessment Type', data: this.assessmentType },
          { title: 'Level of Implementation', data: this.levelofImplemetation },
          { title: 'Geographical Area Covered', data: this.geographicalAreasCovered },
          { title: 'Sectors Covered', data: this.sectorList.join(', ') },
          { title: 'Impact Covered', data: this.impactCoverList.join(', ') },
          { title: 'Date From', data: this.datePipe.transform(this.date1, 'yyyy-MM-dd') },
          { title: 'To', data: this.datePipe.transform(this.date2, 'yyyy-MM-dd') },

        ])

      console.log("cardddd", this.card)
      this.load = true;

    }, 1000);

  }


  public exportToExcel(): void {
    import("xlsx").then(xlsx => {
      const ws = xlsx.utils.json_to_sheet(this.card, { skipHeader: true });
      const worksheet = xlsx.utils.table_to_sheet(document.querySelector("#content"));

      // add existing data to worksheet
      const existingData = xlsx.utils.sheet_to_json(worksheet, { header: 1 });
      xlsx.utils.sheet_add_json(ws, existingData, { skipHeader: true, origin: -1 });

      const workbook = xlsx.utils.book_new();
      xlsx.utils.book_append_sheet(workbook, ws, "Sheet1");
      xlsx.writeFile(workbook, "data.xlsx", { cellStyles: true });
    });
  }




  makePDF() {

    var data = document.getElementById('content')!;

    html2canvas(data).then((canvas) => {
      const componentWidth = data.offsetWidth
      const componentHeight = data.offsetHeight

      const orientation = componentWidth >= componentHeight ? 'l' : 'p'

      const imgData = canvas.toDataURL('image/png')
      const pdf = new jsPDF({
        orientation,
        unit: 'px'
      })

      pdf.internal.pageSize.width = componentWidth
      pdf.internal.pageSize.height = componentHeight

      pdf.addImage(imgData, 'PNG', 0, 0, componentWidth, componentHeight)
      pdf.save('assessment-result.pdf')
    })

  }


}
