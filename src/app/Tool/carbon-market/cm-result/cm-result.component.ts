import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Assessment, AssessmentCMDetail, AssessmentCMDetailControllerServiceProxy, AssessmentControllerServiceProxy, CMAssessmentQuestionControllerServiceProxy, CMScoreDto, CalculateDto, Characteristics, ClimateAction } from 'shared/service-proxies/service-proxies';
import * as XLSX from 'xlsx-js-style';
import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';
import { MasterDataService } from 'app/shared/master-data.service';
import { environment } from 'environments/environment';
import { SDG } from '../cm-section-three/cm-section-three.component';
import { SelectedScoreDto } from 'app/shared/score.dto';

@Component({
  selector: 'app-cm-result',
  templateUrl: './cm-result.component.html',
  styleUrls: ['./cm-result.component.css']
})
export class CmResultComponent implements OnInit {

  assessment: Assessment
  assessmentCMDetail: AssessmentCMDetail
  intervention: ClimateAction
  card: any[] = []
  results: any;
  criterias: any;
  sections: string[]
  score: CMScoreDto = new CMScoreDto()
  expandedRows: any = {}
  isDownloading: boolean = false
  processData:any = {};
  outcomeData: { scale_GHGs: any[], sustained_GHGs: any[], scale_SDs: any[], sustained_SDs: any[], scale_adaptation: any[], sustained_adaptation: any[] } = { scale_GHGs: [], sustained_GHGs: [], scale_SDs: [], sustained_SDs: [], scale_adaptation:[], sustained_adaptation: [] };
  fileServerURL:any
  SDGs: SDG[]
  scale_GHG_score_macro:SelectedScoreDto[]
  scale_GHG_score_medium:SelectedScoreDto[]
  scale_GHG_score_micro:SelectedScoreDto[]
  sustained_GHG_score:SelectedScoreDto[]
  scale_SD_score:SelectedScoreDto[]
  sustained_SD_score:SelectedScoreDto[]
  relevances: any

  xData: {label: string; value: number}[]
  yData: {label: string; value: number}[]

  // heatmapData = [
  //   ['Not at all', 'Major negative outcome (90-100%)'],
  //   ['Minimally', 'Negative outcome (70-90%)'],
  //   ['Moderately', 'Mixed outcome (50-70%)'],
  //   ['Substantially', 'Positive outcome (30-50%)'],
  //   ['Fully', 'Major positive outcome (0-30%)'],
  // ];


  constructor(
    private route: ActivatedRoute,
    private assessmentControllerServiceProxy: AssessmentControllerServiceProxy,
    private assessmentCMDetailControllerServiceProxy: AssessmentCMDetailControllerServiceProxy,
    private cMAssessmentQuestionControllerServiceProxy: CMAssessmentQuestionControllerServiceProxy,
    public masterDataService: MasterDataService
  ) { }

  async ngOnInit(): Promise<void> {
    this.fileServerURL = environment.baseUrlAPI+'/uploads'
    this.route.queryParams.subscribe(async (params) => {
      let assessmentId = params['id']
      this.assessment = await this.assessmentControllerServiceProxy.findOne(assessmentId).toPromise()
      this.intervention = this.assessment.climateAction
      let cmApproaches = this.masterDataService.int_cm_approaches
      this.SDGs = this.masterDataService.SDGs
      this.scale_GHG_score_macro=this.masterDataService.GHG_scale_score_macro;
      this.scale_GHG_score_medium=this.masterDataService.GHG_scale_score_medium;
      this.scale_GHG_score_micro=this.masterDataService.GHG_scale_score_micro;
      this.sustained_GHG_score=this.masterDataService.GHG_sustained_score;
      this.scale_SD_score =this.masterDataService.SDG_scale_score;
      this.sustained_SD_score=this.masterDataService.SDG_sustained_score;
      this.relevances = this.masterDataService.relevance
      this.xData = this.masterDataService.xData
      this.yData = this.masterDataService.yData

      this.assessmentCMDetail = await this.assessmentCMDetailControllerServiceProxy.getAssessmentCMDetailByAssessmentId(assessmentId).toPromise()
      // let types: any = this.assessmentCMDetail.impact_types?.split(',')
      // if(types?.length > 0) types = [...types.map((type: string) => this.masterDataService.impact_types.find(o => o.code === type)?.name)]
      // let cats: any = this.assessmentCMDetail.impact_categories?.split(',')
      // if (cats?.length > 0) cats = [...cats.map((cat: string) => this.masterDataService.impact_categories.find(o => o.code === cat)?.name)]
      // let chara: any = this.assessmentCMDetail.impact_characteristics?.split(',')
      // if (chara?.length > 0) chara = [...chara.map((char: string) => this.masterDataService.impact_characteristics.find(o => o.code === char)?.name)]
      // console.log(chara)
      let cmApproache = cmApproaches.find(o => o.code === this.assessmentCMDetail.intCMApproach)
      this.card.push(
        ...[
          { title: 'Intervention', data: this.intervention.policyName },
          { title: 'Assessment Type', data: this.assessment.assessmentType },
          { title: 'Assessment Boundaries', data: this.assessmentCMDetail.boundraries },
          { title: 'International Carbon Market Approach Used', data: cmApproache?.name},
          { title: 'Baseline and monitoring methodology applied by the intervention', data: this.assessmentCMDetail.appliedMethodology}
        ])
      await this.getResult()
      this.criterias.forEach((c: any) => {
        this.expandedRows[c] = true
      })
    })

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
    if (this.score.process_score === y && this.score.outcome_score.outcome_score === x){
      return true
    } else {
      return false
    }
  }

  async getResult() {
    let res = await this.cMAssessmentQuestionControllerServiceProxy.getResults(this.assessment.id).toPromise()
    if (res){
      this.results = res.result
      this.criterias = res.criteria
      this.processData =res.processData;
      this.outcomeData =res.outComeData;
      this.sections = Object.keys(this.results)
      this.sections = this.sections.filter(e => e !== "undefined")
      console.log("res",res)
      console.log("keys", this.sections)


      this.criterias.forEach((c: any) => {
        this.expandedRows[c] = false
      })

      let req = new CalculateDto()
      req.assessmentId = this.assessment.id

      let response = await this.cMAssessmentQuestionControllerServiceProxy.calculateResult(req).toPromise()
      this.score = response
    }
  }

  toDownloadExcel() {
    this.isDownloading = true
    setTimeout(() =>{
      let book_name = 'Results - ' + this.intervention.policyName
  
      const workbook = XLSX.utils.book_new();
      const ws: XLSX.WorkSheet = XLSX.utils.json_to_sheet(this.card, { skipHeader: true });
      let table = document.getElementById('cmtool')
      let worksheet = XLSX.utils.table_to_sheet(table,{})
      let heatmap = XLSX.utils.table_to_sheet(document.getElementById('heatmap'),{})
      
      XLSX.utils.book_append_sheet(workbook, ws, 'Assessment Info');
      XLSX.utils.book_append_sheet(workbook, worksheet, 'Assessment Results');
      XLSX.utils.book_append_sheet(workbook, heatmap, 'Heat map');

      XLSX.writeFile(workbook, book_name + ".xlsx");
      this.isDownloading = false
    }, 1000)
  }

  _toDownloadExcel(){ //Not using
    let length = 0
    let book_name = 'Results - ' + this.intervention.policyName
    const ws: XLSX.WorkSheet = XLSX.utils.json_to_sheet(this.card, { skipHeader: true });
    const wb: XLSX.WorkBook = XLSX.utils.book_new();

    length = length + this.card.length + 2

    this.sections.forEach(section => {
      XLSX.utils.sheet_add_json(ws, [{section: section}], { skipHeader: true, origin: "A" + length });
      length = length + 2
      XLSX.utils.sheet_add_json(ws, this.results[section], { skipHeader: false, origin: "A" + length });
      length = length + this.results[section].length + 2
    })
    XLSX.utils.sheet_add_json(ws, [{title: 'Transformational Change Criteria'}], { skipHeader: true, origin: "A" + length });
    length = length + 2

    let processData =  this._mapProcessData()

    if (processData.technology && processData.technology.length!=0){
      XLSX.utils.sheet_add_json(ws, [{title: 'Process of Change / Technology'}], { skipHeader: true, origin: "A" + length });
      length = length + 2
      XLSX.utils.sheet_add_json(ws, processData.technology, { skipHeader: false, origin: "A" + length });
      length = length + this.processData.technology.length + 2
    }
    if (processData.incentives && processData.incentives.length!=0){
      XLSX.utils.sheet_add_json(ws, [{title: 'Process of Change / Incentives'}], { skipHeader: true, origin: "A" + length });
      length = length + 2
      XLSX.utils.sheet_add_json(ws, processData.incentives, { skipHeader: false, origin: "A" + length });
      length = length + this.processData.incentives.length + 2
    }
    if (processData.norms && processData.norms.length!=0){
      XLSX.utils.sheet_add_json(ws, [{title: 'Process of Change / Norms'}], { skipHeader: true, origin: "A" + length });
      length = length + 2
      XLSX.utils.sheet_add_json(ws, processData.norms, { skipHeader: false, origin: "A" + length });
      length = length + this.processData.norms.length + 2
    }

    let outcomeData = this.mapOutcomeData()
    if (outcomeData.scaleGHGs && outcomeData.scaleGHGs.length!=0){
      XLSX.utils.sheet_add_json(ws, [{title: 'Outcome of Change / Scale GHGs'}], { skipHeader: true, origin: "A" + length });
      length = length + 2
      XLSX.utils.sheet_add_json(ws, outcomeData.scaleGHGs, { skipHeader: false, origin: "A" + length });
      length = length + outcomeData.scaleGHGs.length + 2
    }
    if (outcomeData.sustainedGHGs && outcomeData.sustainedGHGs.length!=0){
      XLSX.utils.sheet_add_json(ws, [{title: 'Outcome of Change / Sustained GHGs'}], { skipHeader: true, origin: "A" + length });
      length = length + 2
      XLSX.utils.sheet_add_json(ws, outcomeData.sustainedGHGs, { skipHeader: false, origin: "A" + length });
      length = length + outcomeData.scaleGHGs.length + 2
    }
    if (outcomeData.scaleSDs && outcomeData.scaleSDs.length!=0){
      XLSX.utils.sheet_add_json(ws, [{title: 'Outcome of Change / Scale SDs'}], { skipHeader: true, origin: "A" + length });
      length = length + 2
      XLSX.utils.sheet_add_json(ws, outcomeData.scaleSDs, { skipHeader: false, origin: "A" + length });
      length = length + outcomeData.scaleSDs.length + 2
    }
    if (outcomeData.sustainedSDs && outcomeData.sustainedSDs.length!=0){
      XLSX.utils.sheet_add_json(ws, [{title: 'Outcome of Change / Sustained SDs'}], { skipHeader: true, origin: "A" + length });
      length = length + 2
      XLSX.utils.sheet_add_json(ws, outcomeData.sustainedSDs, { skipHeader: false, origin: "A" + length });
      length = length + outcomeData.sustainedSDs.length + 2
    }

    XLSX.utils.sheet_add_json(ws, [{title: 'Transformational Change', value: this.score}], { skipHeader: true, origin: "A" + length });

    XLSX.utils.book_append_sheet(wb, ws, 'sheet1');

    XLSX.writeFile(wb, book_name + '.xlsx');
  }

  _mapProcessData(){ // Not using
    let data = new ProcessData()
    if (this.processData?.technology && this.processData?.technology?.length !== 0){
      data.technology = this.processData.technology.map((ele: { characteristic: string; question: string; score: number; justification: string; }) => {
        let _data = new ProcessTableData()
        _data.Characteristic = ele.characteristic
        _data.Question = ele.question
        _data.Score = ele.score
        _data.Justification = ele.justification
        return _data
      })
    }

    if (this.processData.incentives && this.processData.incentives.length !== 0){
      data.incentives = this.processData.incentives.map((ele: { characteristic: string; question: string; score: number; justification: string; }) => {
        let _data = new ProcessTableData()
        _data.Characteristic = ele.characteristic
        _data.Question = ele.question
        _data.Score = ele.score
        _data.Justification = ele.justification
        return _data
      })
    }
    if (this.processData.norms && this.processData.norms.length !== 0){
      data.norms = this.processData.norms.map((ele: { characteristic: string; question: string; score: number; justification: string; }) => {
        let _data = new ProcessTableData()
        _data.Characteristic = ele.characteristic
        _data.Question = ele.question
        _data.Score = ele.score
        _data.Justification = ele.justification
        return _data
      })
    }

    return data
  }

  mapOutcomeData(){
    let data = new OutcomeData()
    if (this.outcomeData.scale_GHGs.length !== 0){
      data.scaleGHGs = this.outcomeData.scale_GHGs.map(ele => {
        let _data = new ScaleTableData()
        _data.Characteristic = ele.characteristic
        _data['Starting Situation'] = ele.starting_situation
        _data['Expected Impact'] = ele.expected_impacts
        let score = this.getOutcomeScores(ele.outcome_score,'scale_GHGs', ele.characteristic)
        _data.Score = score ? score.toString() : '-'
        _data.Justification = ele.justification
        return _data
      })
    }
    if (this.outcomeData.sustained_GHGs.length !== 0){
      data.sustainedGHGs = this.outcomeData.sustained_GHGs.map(ele => {
        let _data = new ScaleTableData()
        _data.Characteristic = this.changeOutcomeCharacteristicsName(ele.characteristic)
        _data['Starting Situation'] = ele.starting_situation
        _data['Expected Impact'] = ele.expected_impacts
        let score = this.getOutcomeScores(ele.outcome_score,'sustained_GHGs', ele.characteristic)
        _data.Score = score ? score.toString() : '-'
        _data.Justification = ele.justification
        return _data
      })
    }
    if (this.outcomeData.scale_SDs.length !== 0){
      data.scaleSDs = this.outcomeData.scale_SDs.map(ele => {
        let _data = new ScaleTableData()
        _data.SDG = this.getSDGName(ele.SDG)
        _data.Characteristic = ele.characteristic
        _data['Starting Situation'] = ele.starting_situation
        _data['Expected Impact'] = ele.expected_impacts
        let score = this.getOutcomeScores(ele.outcome_score,'scale_SDs', ele.characteristic)
        _data.Score = score ? score.toString() : '-'
        _data.Justification = ele.justification
        return _data
      })
    }
    if (this.outcomeData.sustained_SDs.length !== 0){
      data.sustainedSDs = this.outcomeData.sustained_SDs.map(ele => {
        let _data = new ScaleTableData()
        _data.SDG = this.getSDGName(ele.SDG)
        _data.Characteristic = this.changeOutcomeCharacteristicsName(ele.characteristic)
        _data['Starting Situation'] = ele.starting_situation
        _data['Expected Impact'] = ele.expected_impacts
        let score = this.getOutcomeScores(ele.outcome_score,'sustained_SDs', ele.characteristic)
        _data.Score = score ? score.toString() : '-'
        _data.Justification = ele.justification
        return _data
      })
    }
    return data
  }

  async toDownloadPdf(){
    this.isDownloading = true
    this.criterias.forEach((c: any) => {
      this.expandedRows[c] = true
    })

    await new Promise(r => setTimeout(r, 1000));

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
      pdf.save('download.pdf')
    })
    this.isDownloading = false
  }

  getSDGName(code: any) {
    if (code){
      let sdg = this.SDGs.find(o => o.code === code)
      return sdg !== undefined ? sdg.name : '-'
    } else {
      return '-'
    }
  }
  getOutcomeScores(code: any, category: string, characteristic: Characteristics) {
    if (code) {
      if (category == 'scale_GHGs') {
        if (characteristic.code === 'MACRO_LEVEL') {
          return (this.scale_GHG_score_macro.find(o => o.code === code))?.value
        } else if (characteristic.code === 'MEDIUM_LEVEL') {
          return (this.scale_GHG_score_medium.find(o => o.code === code))?.value
        } else {
          return (this.scale_GHG_score_micro.find(o => o.code === code))?.value
        }
      }
      else if (category == 'sustained_GHGs') {
        return (this.sustained_GHG_score.find(o => o.code === code))?.value
      }
      else if (category == 'scale_SDs') {
        return (this.scale_SD_score.find(o => o.code === code))?.value
      }
      else if (category == 'sustained_SDs') {
        return (this.sustained_SD_score.find(o => o.code === code))?.value
      }
      else {
        return '-'
      }
    } else {
      return '-'
    }
  }

  changeOutcomeCharacteristicsName(name: string) {
    if (name == 'Long term (>15 years)') {
      return 'International Level';
    } else if (name == 'Medium term (5-15 years)') {
      return 'National/Sector Level'
    } else if (name == 'Short Term (<5 years)') {
      return 'Subnational/ subsectorial'
    } else if (name === 'Macro Level') {
      return 'International Level';
    } else if (name === 'Medium Level') {
      return 'National/Sector Level'
    } else if (name === 'Micro Level') {
      return 'Subnational/ subsectorial'
    } else {
      return name;
    }
  }

  getRelevance(relevance: number) {
    return this.relevances.find((o: any) => o.value === +relevance)?.name
  }
}

export class ProcessData{
  technology: ProcessTableData[]
  incentives: ProcessTableData[]
  norms: ProcessTableData[]
}

export class ProcessTableData {
  Characteristic: string
  Question: string
  Score: number
  Justification: string
}
export class OutcomeData{
  scaleGHGs: any[]
  sustainedGHGs: any[]
  scaleSDs: any[]
  sustainedSDs: any[]
}

export class SustainedTableData{
  SDG: string
  Characteristic: string
  Question: string
  Score: string
  Justification: string
}

export class ScaleTableData{
  SDG: string
  Characteristic: string
  'Starting Situation': string
  'Expected Impact': string
  Score: string
  Justification: string
}
