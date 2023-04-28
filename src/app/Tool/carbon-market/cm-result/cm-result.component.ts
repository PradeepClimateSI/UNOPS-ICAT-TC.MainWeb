import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Assessment, AssessmentCMDetail, AssessmentCMDetailControllerServiceProxy, AssessmentControllerServiceProxy, CMAssessmentQuestionControllerServiceProxy, CalculateDto, ClimateAction } from 'shared/service-proxies/service-proxies';
import * as XLSX from 'xlsx'; 
import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';

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
  score: number
  expandedRows: any = {}

  constructor(
    private route: ActivatedRoute,
    private assessmentControllerServiceProxy: AssessmentControllerServiceProxy,
    private assessmentCMDetailControllerServiceProxy: AssessmentCMDetailControllerServiceProxy,
    private cMAssessmentQuestionControllerServiceProxy: CMAssessmentQuestionControllerServiceProxy
  ) { }

  async ngOnInit(): Promise<void> {
    this.route.queryParams.subscribe(async (params) => {
      let assessmentId = params['id']
      this.assessment = await this.assessmentControllerServiceProxy.findOne(assessmentId).toPromise()
      this.intervention = this.assessment.climateAction

      let filter = ['assessment.id||$eq||' + assessmentId]

      console.log(this.assessment)

      this.assessmentCMDetail = await this.assessmentCMDetailControllerServiceProxy.getAssessmentCMDetailByAssessmentId(assessmentId).toPromise()
      this.card.push(
        ...[
          { title: 'Intervention', data: this.intervention.policyName },
          { title: 'Assessment Type', data: this.assessment.assessmentType },
          { title: 'Assessment Boundaries', data: this.assessmentCMDetail.boundraries },
          { title: 'Impact Types', data: this.assessmentCMDetail.impact_types },
          { title: 'Impact Categories', data: this.assessmentCMDetail.impact_categories },
          { title: 'Impact Characteristics', data: this.assessmentCMDetail.impact_characteristics },
          { title: 'Impact Indicators', data: this.assessmentCMDetail.impact_indicators }
        ])
      await this.getResult()
    })
   
  }

  async getResult() {
    let res = await this.cMAssessmentQuestionControllerServiceProxy.getResults(this.assessment.id).toPromise()
    this.results = res.result
    this.criterias = res.criteria
    this.keys = Object.keys(this.results)


    this.criterias.forEach((c: any) => {
      this.expandedRows[c] = false
    })

    let req = new CalculateDto()
    req.assessmentId = this.assessment.id

    this.score = await this.cMAssessmentQuestionControllerServiceProxy.calculateResult(req).toPromise()
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
  }

}
