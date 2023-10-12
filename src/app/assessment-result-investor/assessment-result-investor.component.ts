import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ClimateAction, InvestorToolControllerServiceProxy, MethodologyAssessmentControllerServiceProxy } from 'shared/service-proxies/service-proxies';
import { DatePipe } from '@angular/common';
import { DomSanitizer } from '@angular/platform-browser';
import { jsPDF } from "jspdf"
import html2canvas from 'html2canvas';
import * as XLSX from 'xlsx-js-style';
import { MasterDataService } from 'app/shared/master-data.service';
import { ColorMap } from 'app/Tool/carbon-market/cm-result/cm-result.component';
import { HeatMapScore } from 'app/charts/heat-map/heat-map.component';


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
 
  ////
  intervention:ClimateAction;
  principles: string;
  opportunities:string;
  xData: {label: string; value: number}[];
  yData: {label: string; value: number}[];
  processData: any[] = []
  outcomeData: any[] = []
  processScore: number;
  outcomeScore: number;
  scale_GHGs: any;
  sustained_GHGs:any;
  sustained_SD:any;
  scale_SD: any;
  scale_adaptation: any;
  sustained_adaptation: any;
  loading: boolean = false;
  heatMapScore: HeatMapScore[];
  geographicalAreasList: any;


  constructor(private route: ActivatedRoute,
    private methassess: MethodologyAssessmentControllerServiceProxy,
    private datePipe: DatePipe,
    private sanitizer: DomSanitizer,
    private investorToolControllerproxy: InvestorToolControllerServiceProxy,
    public masterDataService: MasterDataService

  ) { }
  ngOnInit(): void {

    this.investerTool = true;
    this.loadTitle = false;
    this.route.queryParams.subscribe(params => {
      this.assessmentId = params['assessmentId'];
      this.averageProcess = params['averageProcess'];
      this.averageOutcome = params['averageOutcome'];
    });
    this.xData = this.masterDataService.xData
    this.yData = this.masterDataService.yData

    // console.log("daaaaa:", this.assessmentId)
    // console.log("daaaaa111:", this.averageProcess)
    // console.log("daaaaa222:", this.averageOutcome)
    this.investorToolControllerproxy.calculateFinalResults(this.assessmentId).subscribe((res: any) => {
      console.log(res)
      this.processData = res?.processData;
      this.outcomeData = res?.outcomeData;
      this.outcomeScore = res?.outcomeScore;
      this.processScore = res?.processScore;
      this.scale_GHGs = res?.outcomeData.find((item: { code: string; })=>item?.code=='SCALE_GHG')
      this.scale_SD = res?.outcomeData.find((item: { code: string; })=>item?.code=='SCALE_SD')
      this.sustained_GHGs = res?.outcomeData.find((item: { code: string; })=>item?.code=='SUSTAINED_GHG')
      this.sustained_SD = res?.outcomeData.find((item: { code: string; })=>item?.code=='SUSTAINED_SD')
      this.scale_adaptation = res?.outcomeData.find((item: { code: string; })=>item?.code=='SCALE_ADAPTATION')
      this.sustained_adaptation = res?.outcomeData.find((item: { code: string; })=>item?.code=='SUSTAINED_ADAPTATION')
      console.log("all: ",  this.scale_GHGs,this.scale_SD,this.sustained_GHGs ,this.sustained_SD,this.scale_adaptation,this.sustained_adaptation)
      // console.log("processData: ", this.processData)
      // console.log("outcomeData: ", this.outcomeData)
      // console.log("processData: ", this.processData)
      // console.log("rr: ", this.sustained_GHGs.category_score.value==null)
      this.heatMapScore = [{processScore: this.processScore, outcomeScore: this.outcomeScore}]
      this.loading=true 
    });


    this.methassess.assessmentData(this.assessmentId).subscribe((res: any) => {
      console.log("assessmentDataaaaa: ", res)
      for (let x of res) {
        // this.policyName = x.climateAction.policyName
        this.intervention = x.climateAction
        this.assessmentType = x.assessmentType
        this.date1 = x.from
        this.date2 = x.to
        this.tool = x.tool
        this.assessment_approach = x.assessment_approach
        this.assessment_method = x.assessment_method
        this.principles = x.principles
        this.opportunities = x.opportunities
        this.assessment_method = x.assessment_method
        
      }
      console.log("toool", this.tool)
      if (this.tool === 'PORTFOLIO') {
        this.investerTool = false;
        this.loadTitle = true;
        // this.title2 = 'Result - Assess the Transformational Change due to a Portfolio of Interventions'
        this.title2 ='Assessment results'
      }
      else if (this.tool === 'INVESTOR') {
        this.investerTool = true;
        this.loadTitle = true;
        // this.title2 = 'Result - Invesment & Private Sector Tool '
        this.title2 ='Assessment results'
      }

    });
   


    this.investorToolControllerproxy.getResultByAssessment(this.assessmentId).subscribe((res: any) => {
      // console.log("getResultByAssessment: ", res)
      // this.levelofImplemetation = res.level_of_implemetation
      // this.geographicalAreasCovered = res.geographical_areas_covered
      this.tool = res.assessment.tool

    });

    this.investorToolControllerproxy.findAllSectorData(this.assessmentId).subscribe((res: any) => {
      // console.log("findAllSectorData: ", res)
      for (let x of res) {
        this.sectorList.push(x.sector.name)
      }
    });

    this.investorToolControllerproxy.findAllGeographicalAreaData(this.assessmentId).subscribe((res: any) => {
        this.geographicalAreasList = res
        this.geographicalAreasCovered = this.geographicalAreasList.map((a: any) => a.name).join(',')
    });

    // this.investorToolControllerproxy.findAllImpactCoverData(this.assessmentId).subscribe((res: any) => {
    //   console.log("findAllImpactCoverData: ", res)
    //   for (let x of res) {
    //     this.impactCoverList.push(x.name)
    //   }
    // });


    // this.methassess.findAllCategories().subscribe((res2: any) => {
    //   console.log("categoryList", res2)
    //   for (let x of res2) {
    //     //this.categotyList.push(x);
    //     if (x.type === 'process') {
    //       this.meth1Process.push(x)
    //     }
    //     if (x.type === 'outcome') {
    //       this.meth1Outcomes.push(x)
    //     }
    //   }
    //   console.log("yyyy", this.meth1Process)
    // });



    // this.investorToolControllerproxy.findAllAssessData(this.assessmentId).subscribe(async (res: any) => {
    //   console.log("findAllAssessData: ", res)


    //   for (let category of this.meth1Process) {
    //     let categoryData: any = {
    //       categoryName: category.name,
    //       characteristics: [],
    //       categotyRelevance: 0,
    //       categoryLikelihood: 0
    //     };

    //     let totalRel = 0
    //     let countRel = 0
    //     let totalLikelihood = 0
    //     let countLikelihood = 0
    //     for (let x of res) {
    //       if (category.name === x.category.name) {
    //         categoryData.categoryName = category.name;
    //         categoryData.characteristics.push(
    //           {
    //             relevance: !x.relavance ? '-' : x.relavance,
    //             likelihood: !x.likelihood ? '-' : x.likelihood,
    //             name: x.characteristics.name
    //           }
    //         )

    //         totalRel = totalRel + x.relavance
    //         countRel++

    //         totalLikelihood = totalLikelihood + x.likelihood
    //         countLikelihood++

    //       }
    //     }

    //     categoryData.categotyRelevance = (totalRel / countRel).toFixed(3)
    //     categoryData.categoryLikelihood = (totalLikelihood / countLikelihood).toFixed(3)
    //     this.categoryDataArray.push(categoryData)

    //     // console.log("categoryDataArray: ", this.categoryDataArray)
    //   }

    //   for (let category of this.meth1Outcomes) {
    //     let categoryData: any = {
    //       categoryName: category.name,
    //       characteristics: [],
    //       categotyRelevance: 0,
    //       categoryLikelihood: 0,
    //       categoryScaleScore: 0,
    //       categorySustainedScore: 0
    //     };

    //     let totalScale = 0
    //     let countScale = 0
    //     let totalSustained = 0
    //     let countSustained = 0
    //     for (let x of res) {
    //       if (category.name === x.category.name && (x.category.name === 'GHG Scale of the Outcome' || x.category.name === 'SDG Scale of the Outcome')) {
    //         categoryData.categoryName = category.name;
    //         categoryData.characteristics.push(
    //           {
    //             scaleScore: x.score,
    //             sustainedScore: '-',
    //             name: x.characteristics.name
    //           }
    //         )

    //         totalScale = totalScale + x.score
    //         countScale++

    //       }
    //       if (category.name === x.category.name && (x.category.name === 'GHG Time frame over which the outcome is sustained' || x.category.name === 'SDG Time frame over which the outcome is sustained')) {
    //         categoryData.categoryName = category.name;
    //         categoryData.characteristics.push(
    //           {
    //             scaleScore: '-',
    //             sustainedScore: x.score,
    //             name: x.characteristics.name
    //           }
    //         )

    //         totalSustained = totalSustained + x.score
    //         countSustained++

    //       }
    //     }

    //     if (category.name === 'GHG Scale of the Outcome' || category.name === 'SDG Scale of the Outcome') {
    //       categoryData.categoryScaleScore = (totalScale / countScale).toFixed(3)
    //       categoryData.categorySustainedScore = '-'
    //     }

    //     if (category.name === 'GHG Time frame over which the outcome is sustained' || category.name === 'SDG Time frame over which the outcome is sustained') {
    //       categoryData.categorySustainedScore = (totalSustained / countSustained).toFixed(3)
    //       categoryData.categoryScaleScore = '-'
    //     }

    //     this.categoryDataArrayOutcome.push(categoryData)
    //   }

    //   console.log("categoryDataArrayOutcome: ", this.categoryDataArrayOutcome)

    //   /* Portfolio toolll */

    //   const data: any =  this.categoryDataArrayOutcome[1]

    //   const averages: any = {};

    //   data.characteristics.forEach((obj: { name: any; scaleScore: any; sustainedScore: any; }) => {
    //     if (obj.name in averages) {
    //       averages[obj.name].scaleScore += obj.scaleScore || 0;
    //       averages[obj.name].sustainedScore += obj.sustainedScore === '-' ? 0 : parseInt(obj.sustainedScore);
    //       averages[obj.name].count++;
    //     } else {
    //       averages[obj.name] = {
    //         scaleScore: obj.scaleScore || 0,
    //         sustainedScore: obj.sustainedScore === '-' ? 0 : parseInt(obj.sustainedScore),
    //         count: 1
    //       };
    //     }
    //   });

    //   const result = [];

    //   for (const name in averages) {
    //     const averageScaleScore = averages[name].scaleScore / averages[name].count;
    //     const averageSustainedScore = averages[name].sustainedScore / averages[name].count;

    //     result.push({
    //       scaleScore: averageScaleScore.toFixed(3),
    //       sustainedScore: '-',
    //       name: name
    //     });
    //   }

    //   console.log("resulttt", result);

    //    /* Portfolio toolll */
    //    const data2: any =  this.categoryDataArrayOutcome[3];

    //    const averages2: any = {};

    //    data2.characteristics.forEach((obj: { name: any; scaleScore: any; sustainedScore: any; }) => {
    //      if (obj.name in averages2) {
    //        averages2[obj.name].sustainedScore += obj.sustainedScore || 0;
    //        averages2[obj.name].scaleScore += obj.scaleScore === '-' ? 0 : parseInt(obj.scaleScore);
    //        averages2[obj.name].count++;
    //      } else {
    //        averages2[obj.name] = {
    //         sustainedScore: obj.sustainedScore || 0,
    //         scaleScore: obj.scaleScore === '-' ? 0 : parseInt(obj.scaleScore),
    //          count: 1
    //        };
    //      }
    //    });

    //    const result2 = [];

    //    for (const name in averages2) {
    //      const averageScaleScore2 = averages2[name].scaleScore / averages2[name].count;
    //      const averageSustainedScore2 = averages2[name].sustainedScore / averages2[name].count;

    //      result2.push({
    //        scaleScore: '-',
    //        sustainedScore: averageSustainedScore2.toFixed(3),
    //        name: name
    //      });
    //    }

    //    console.log("resulttt22", result2);


    //    if(!this.investerTool){
    //     this.categoryDataArrayOutcome[1].characteristics = []
    //     this.categoryDataArrayOutcome[1].characteristics = result

    //     this.categoryDataArrayOutcome[3].characteristics = []
    //     this.categoryDataArrayOutcome[3].characteristics = result2
    //    }

    //    console.log("categoryDataArrayOutcome222: ", this.categoryDataArrayOutcome)
    //     /* Portfolio toolll */
    // });


    // this.investorToolControllerproxy.findSDGs(this.assessmentId).subscribe((res: any) => {
    //   console.log("sdgssss: ", res)
    //   this.SDGsList = res
    // });

console.log(this.geographicalAreasList)

    setTimeout(() => {
      this.card.push(
        ...[
          { title: 'Intervention ID', data: (this.intervention.intervention_id)?(this.intervention.intervention_id):'-' },
          { title: 'Intervention Type', data: (this.intervention.typeofAction)?(this.intervention.typeofAction):'-' },
          { title: 'Intervention Status', data: (this.intervention.projectStatus)?(this.intervention.projectStatus.name):'-' },
          { title: 'Assessment Type', data: this.assessmentType },
          { title: 'Geographical Area Covered', data: this.geographicalAreasList.map((a: any) => a.name) },
          { title: 'Sectors Covered', data: this.sectorList.join(', ') },
          { title: 'From', data: this.datePipe.transform(this.date1, 'yyyy-MM-dd') },
          { title: 'To', data: this.datePipe.transform(this.date2, 'yyyy-MM-dd') },
          { title: 'Opportunities for stakeholders to participate in the assessment', data: (this.opportunities)?(this.opportunities):'-' },
          { title: 'Principles on which the assessment is based', data: (this.principles)?(this.principles):'-' },

        ])

      // console.log("cardddd", this.card)
      this.load = true;

    }, 1000);

  }
  getBackgroundColor(value: number): string {
    switch (value) {
      case -3:
        return '#ec6665';
      case -2:
        return '#ed816c';
      case -1:
        return '#f19f70';
      case 0:
        return '#f4b979';
      case 1:
        return '#f9d57f';
      case 2:
        return '#fcf084';
      case 3:
        return '#e0e885';
      case 4:
        return '#c1e083';
      case 5:
        return '#a3d481';
      case 6:
        return '#84cc80';
      case 7:
        return '#65c17e';
      default:
        return 'white';
    }
  }

  getIntervention(x:number, y: number){
    if (this.processScore === y && this.outcomeScore === x){
      return true
    } else {
      return false
    }
  }

  exportToExcel() {
    let colorMap = this.createColorMap()
    console.log(colorMap)
    // this.isDownloading = true
    
      let book_name = 'Results - ' + this.intervention.policyName
  
      const workbook = XLSX.utils.book_new();
      const ws: XLSX.WorkSheet = XLSX.utils.json_to_sheet(this.card, { skipHeader: true });
      let table = document.getElementById('allTables')
      let worksheet = XLSX.utils.table_to_sheet(table,{})
      // this.isDownloading = false
    
        let heatmap = XLSX.utils.table_to_sheet(document.getElementById('heatmap'),{})
        
        XLSX.utils.book_append_sheet(workbook, ws, 'Assessment Info');
        XLSX.utils.book_append_sheet(workbook, worksheet, 'Assessment Results');
        XLSX.utils.book_append_sheet(workbook, heatmap, 'Heat map');

        for (const itm of colorMap) {
          if (heatmap[itm.cell]) {
            heatmap[itm.cell].s = {
              fill: { fgColor: { rgb: itm.color } },
              font: { color: { rgb: itm.color } }
            };
          }
        }
  
        XLSX.writeFile(workbook, book_name + ".xlsx");
      
      // this.isDownloading = false
    
  }
  // public exportToExcel(): void {
  //   import("xlsx").then(xlsx => {
  //     // const ws = xlsx.utils.json_to_sheet(this.card, { skipHeader: true });
  //     // const worksheet = xlsx.utils.table_to_sheet(document.querySelector("#content"));

  //     // add existing data to worksheet
  //     // const existingData = xlsx.utils.sheet_to_json(worksheet, { header: 1 });
  //     // xlsx.utils.sheet_add_json(ws, existingData, { skipHeader: true, origin: -1 });

  //     // const workbook = xlsx.utils.book_new();
  //     // xlsx.utils.book_append_sheet(workbook, ws, "Sheet1");
  //     // xlsx.writeFile(workbook, "data.xlsx", { cellStyles: true });
  //     // const wb: XLSX.WorkBook = XLSX.utils.book_new();
  //     // const table1 = document.getElementById('table1');
  //     // const table2 = document.getElementById('table2');
  //     // const ws1: XLSX.WorkSheet = XLSX.utils.table_to_sheet([table1,table2], { cellStyles: true });
  //     // // const ws2: XLSX.WorkSheet = XLSX.utils.table_to_sheet(table2, { cellStyles: true });
  //   let book_name = 'Results - ' + this.intervention.policyName+'.xlsx'
  //   const workbook = XLSX.utils.book_new();
  //   const ws: XLSX.WorkSheet = XLSX.utils.json_to_sheet(this.card, { skipHeader: true });
  //   let table = document.getElementById('allTables')
  //   let worksheet = XLSX.utils.table_to_sheet(table,{})

  //   XLSX.utils.book_append_sheet(workbook, ws, 'Assessment Info');

  //   XLSX.utils.book_append_sheet(workbook, worksheet, 'Assessment Results');

  //   XLSX.writeFile(workbook, book_name);
   
     
  //   });
  // }
  createColorMap(){
    let colorMap = []
    let cols = 'CDEFGHI'
    let rows = '34567'
    let col_values = [3,2,1,0,-1,-2,-3]
    let row_values = [4,3,2,1,0]
    for (let [idx,row] of row_values.entries()){
      for (let [index, col] of col_values.entries()){
        let hasScore = this.getIntervention(col, row)
        let obj = new ColorMap()
        obj.cell = cols[index] + rows[idx]
        obj.value = row + col
        obj.color = hasScore ? '0000ff' : this.getBackgroundColor(row + col).replace('#', '')
        colorMap.push(obj)
      }
    }
    return colorMap
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
