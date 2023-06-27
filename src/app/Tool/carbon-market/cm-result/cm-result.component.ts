import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Assessment, AssessmentCMDetail, AssessmentCMDetailControllerServiceProxy, AssessmentControllerServiceProxy, CMAssessmentQuestionControllerServiceProxy, CalculateDto, ClimateAction } from 'shared/service-proxies/service-proxies';
import * as XLSX from 'xlsx'; 
import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';
import { MasterDataService } from 'app/shared/master-data.service';

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
  keys: string[]
  score: string
  expandedRows: any = {}
  isDownloading: boolean = false

  constructor(
    private route: ActivatedRoute,
    private assessmentControllerServiceProxy: AssessmentControllerServiceProxy,
    private assessmentCMDetailControllerServiceProxy: AssessmentCMDetailControllerServiceProxy,
    private cMAssessmentQuestionControllerServiceProxy: CMAssessmentQuestionControllerServiceProxy,
    public masterDataService: MasterDataService
  ) { }

  async ngOnInit(): Promise<void> {
    this.route.queryParams.subscribe(async (params) => {
      let assessmentId = params['id']
      this.assessment = await this.assessmentControllerServiceProxy.findOne(assessmentId).toPromise()
      this.intervention = this.assessment.climateAction

      this.assessmentCMDetail = await this.assessmentCMDetailControllerServiceProxy.getAssessmentCMDetailByAssessmentId(assessmentId).toPromise()
      // let types: any = this.assessmentCMDetail.impact_types?.split(',')
      // if(types?.length > 0) types = [...types.map((type: string) => this.masterDataService.impact_types.find(o => o.code === type)?.name)]
      // let cats: any = this.assessmentCMDetail.impact_categories?.split(',')
      // if (cats?.length > 0) cats = [...cats.map((cat: string) => this.masterDataService.impact_categories.find(o => o.code === cat)?.name)]
      // let chara: any = this.assessmentCMDetail.impact_characteristics?.split(',')
      // if (chara?.length > 0) chara = [...chara.map((char: string) => this.masterDataService.impact_characteristics.find(o => o.code === char)?.name)]
      // console.log(chara)
      this.card.push(
        ...[
          { title: 'Intervention', data: this.intervention.policyName },
          { title: 'Assessment Type', data: this.assessment.assessmentType },
          { title: 'Assessment Boundaries', data: this.assessmentCMDetail.boundraries },
          { title: 'International Carbon Market Approach Used', data: this.assessmentCMDetail.intCMApproach},
          { title: 'Baseline and monitoring methodology applied by the activity', data: this.assessmentCMDetail.appliedMethodology}
        ])
      await this.getResult()
    })
   
  }

  async getResult() {
    let res = await this.cMAssessmentQuestionControllerServiceProxy.getResults(this.assessment.id).toPromise()
    if (res){
      this.results = res.result
      this.criterias = res.criteria
      this.keys = Object.keys(this.results)
  
  
      this.criterias.forEach((c: any) => {
        this.expandedRows[c] = false
      })
  
      let req = new CalculateDto()
      req.assessmentId = this.assessment.id
  
      let response = await this.cMAssessmentQuestionControllerServiceProxy.calculateResult(req).toPromise()
      this.score = response.score
    }
  }

  toDownloadExcel(){
    let length = 0
    let book_name = 'Results - ' + this.intervention.policyName
    const ws: XLSX.WorkSheet = XLSX.utils.json_to_sheet(this.card, { skipHeader: true });
    const wb: XLSX.WorkBook = XLSX.utils.book_new();

    length = length + this.card.length + 2

    this.keys.forEach(key => {
      XLSX.utils.sheet_add_json(ws, [{section: key}], { skipHeader: true, origin: "A" + length });
      length = length + 2
      XLSX.utils.sheet_add_json(ws, this.results[key], { skipHeader: false, origin: "A" + length });
      length = length + this.results[key].length + 2
    })
    XLSX.utils.sheet_add_json(ws, [{title: 'Transformational Change', value: this.score}], { skipHeader: true, origin: "A" + length });

    XLSX.utils.book_append_sheet(wb, ws, 'sheet1');

    XLSX.writeFile(wb, book_name + '.xlsx');
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

}
