import { HttpResponse } from '@angular/common/http';
import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { MasterDataService } from 'app/shared/master-data.service';
import { SelectedScoreDto } from 'app/shared/score.dto';
import { environment } from 'environments/environment';
import { MessageService } from 'primeng/api';
import { CMQuestion, CMQuestionControllerServiceProxy, CMResultDto, Characteristics, Institution, InstitutionControllerServiceProxy, InvestorToolControllerServiceProxy, MethodologyAssessmentControllerServiceProxy, OutcomeCategory, PortfolioSdg, ScoreDto } from 'shared/service-proxies/service-proxies';


interface UploadEvent {
  originalEvent: HttpResponse<FileDocument>;
  files: File[];
}

interface FileDocument {
  fileName: string
}
@Component({
  selector: 'app-cm-section-three',
  templateUrl: './cm-section-three.component.html',
  styleUrls: ['./cm-section-three.component.css']
})
export class CmSectionThreeComponent implements OnInit {


  @Input() approach: string
  @Output() onSubmit = new EventEmitter()

  comment: any;
  SDGs: SDG[]
  activeIndex: number = 0;
  processData: any;
  outcomeData: any;
  activeIndexMain: number = 0;
  mainTabIndex: any;
  categoryTabIndex: any;
  categories: any = {}
  types: any
  selectedType: any
  selectedCategory: any
  questions: any = {}
  outcome: any = []
  selectedSDGs: SDG[];
  results: CMResultDto[] = []
  activeIndex2: number = 0;
  sdgsToLoop: SDG[]
  uploadedFiles: any = [];
  uploadUrl: string;
  GHG_scale_score_macro: SelectedScoreDto[]
  GHG_scale_score_medium: SelectedScoreDto[]
  GHG_scale_score_micro: SelectedScoreDto[]
  GHG_sustained_score: SelectedScoreDto[]
  SDG_scale_score: SelectedScoreDto[]
  SDG_sustained_score: SelectedScoreDto[]
  adaptation_scale_score: SelectedScoreDto[]
  adaptation_sustained_score: SelectedScoreDto[]
  SDGScore: any = 0;
  adaptationScore: any = 0;
  SDGWeight: any = '10%';
  GHGScore: any;
  acceptedFiles: string = ".pdf, .jpg, .png, .doc, .docx, .xls, .xlsx, .csv";
  fileServerURL: string;
  institutions: Institution[] = [];
  relevance: any[];
  adaptation_tooltip: string
  starting_situation_tooltip: string
  expected_impact_tooltip: string
  sdgList: any;
  selectedSDGsList: PortfolioSdg[];

  constructor(
    private cMQuestionControllerServiceProxy: CMQuestionControllerServiceProxy,
    private methodologyAssessmentControllerServiceProxy: MethodologyAssessmentControllerServiceProxy,
    private masterDataService: MasterDataService,
    private messageService: MessageService,
    private institutionControllerServiceProxy: InstitutionControllerServiceProxy,
    private investorToolControllerServiceProxy: InvestorToolControllerServiceProxy
  ) {
    this.uploadUrl = environment.baseUrlAPI + '/cm-assessment-question/upload-file'
    this.fileServerURL = environment.baseUrlAPI + '/uploads'
  }

  async ngOnInit(): Promise<void> {
    this.types = [
      { name: 'Process of Change', code: 'process' },
      { name: 'Outcome of Change', code: 'outcome' }
    ]

    this.adaptation_tooltip = "Please describe the adaptation co-benefit resulting from the intervention and the approach for its determination.\n" +
      "An adaptation co-benefit is a measurable secondary outcome or impact of a climate change mitigation intervention that represents an increased resilience or reduced vulnerability to climate change impacts of a defined target system compared to a baseline scenario.\n" +
      "E.g.:\n" +
      "- maintained/increased crop production despite increase in floodings and/or droughts\n" +
      "- maintained/increased water availability despite a reduction in precipitation or increase in droughts\n" +
      "- Reduced/avoided loss of ecosystem services despite worsening climatic conditions";

    this.starting_situation_tooltip = "Please describe the baseline scenario on the indicated scale for the intervention, including the current and expected climate risks and impacts in the project area."
    this.expected_impact_tooltip = "Please describe the proposed technology/intervention (i.e. unit) in its technical parameters, e.g. size, volume, lifetime and its operational output that lead to adaptation co-benefit under the intervention on the indicated scale."

    this.GHG_scale_score_macro = this.masterDataService.GHG_scale_score_macro
    this.GHG_scale_score_medium = this.masterDataService.GHG_scale_score_medium
    this.GHG_scale_score_micro = this.masterDataService.GHG_scale_score_micro
    this.GHG_sustained_score = this.masterDataService.GHG_sustained_score
    this.SDG_scale_score = this.masterDataService.SDG_scale_score
    this.SDG_sustained_score = this.masterDataService.SDG_sustained_score
    this.adaptation_scale_score = this.masterDataService.adaptation_scale_score
    this.adaptation_sustained_score = this.masterDataService.adaptation_sustained_score
    this.SDGs = this.masterDataService.SDGs
    this.categories = await this.cMQuestionControllerServiceProxy.getUniqueCharacterisctics().toPromise()
    this.selectedType = this.types[0]
    this.selectedCategory = this.categories[this.selectedType.code][0]
    this.onMainTabChange({ index: 0 })
    this.onCategoryTabChange({ index: 0 })
    this.outcome = await this.methodologyAssessmentControllerServiceProxy.getAllOutcomeCharacteristics().toPromise()
    this.outcome = this.outcome.sort((a: any, b: any) => a.order - b.order)
    this.institutionControllerServiceProxy.getAllInstitutions().subscribe((res: any) => {
      this.institutions = res;
    });
    this.relevance = this.masterDataService.relevance;

    await this.getSDGList()
  }

  async getSDGList(){
    this.sdgList =  await this.investorToolControllerServiceProxy.findAllSDGs().toPromise()
  }

  onMainTabChange(event: any) {
    this.selectedType = this.types[event.index]
    this.mainTabIndex = event.index;
  }

  async onCategoryTabChange(event: any) {
    this.categoryTabIndex = event.index;
  }

  onSelectSDG(event: any) {
    let scaleResults: CMResultDto[] = []
    let sustainResults: CMResultDto[] = []
    this.outcome.forEach((category: { type: string; results: any[]; method: string; }) => {
      if (category.type === 'SD') {
        category.results.forEach(ch => {
          let res = new CMResultDto()
          res.characteristic = ch.characteristic
          res.type = this.approach
          if (category.method === 'SCALE') scaleResults.push(res)
          if (category.method === 'SUSTAINED') sustainResults.push(res)
        })
      }
    })
    this.selectedSDGs = this.selectedSDGsList.map(sdg => {
      let pSdg = new PortfolioSdg()
      pSdg.id = sdg.id
      pSdg.name = sdg.name
      console.log("portfolio sdg", pSdg)
      let res: CMResultDto[] = scaleResults.map((o: any) => {
        let _r = new CMResultDto()
        Object.keys(_r).forEach(e => {
          _r[e] = o[e]
        })
        _r.selectedSdg = pSdg
        _r.isSDG = true
        return _r
      })
      let res2: CMResultDto[] = sustainResults.map((o: any) => {
        let _r = new CMResultDto()
        Object.keys(_r).forEach(e => {
          _r[e] = o[e]
        })
        _r.selectedSdg = pSdg
        _r.isSDG = true
        return _r
      })

      let _sdg: SDG = {
        name: sdg.name,
        code: (sdg.name.replace(/ /g, '')).toUpperCase(),
        number: sdg.number,
        scaleResult: res,
        sustainResult: res2
      }

      console.log(_sdg)
      
      return _sdg
    })
  }

  onCategoryTabChange2($event: any) {
    throw new Error('Method not implemented.');
  }

  next(characteristics?: any[]) {

    if (characteristics?.filter(o => o.relevance !== undefined)?.length === characteristics?.length) {
      if (this.activeIndexMain === 1) {
        this.activeIndex2 = this.activeIndex2 + 1;
      }
      if (this.activeIndex === this.categories.process.length - 1) {
        this.activeIndexMain = 1;
      }
      if (this.activeIndex <= this.categories.process.length - 2 && this.activeIndex >= 0 && this.activeIndexMain === 0) {
        this.activeIndex = this.activeIndex + 1;
      }
      if (this.activeIndexMain === 0) {
        this.onCategoryTabChange({ index: this.activeIndex })
      }
    } else {
      this.messageService.add({
        severity: 'error',
        summary: 'Error',
        detail: 'Please fill all mandotory fields',
        closable: true,
      });
    }

  }

  onSelectScore(event: any, char: CMResultDto, index: number, type: string) {
    let score = new ScoreDto()

    if (index === 2) {
      if (char.characteristic.category.code === 'SUSTAINED_GHG') {
        let score = 0
        this.outcome.forEach((category: OutcomeCategory) => {
          category.results.forEach((result) => {
            if (result.selectedScore.value) score = score + result.selectedScore.value
          })
        })
        this.GHGScore = Math.round(score / 6)
      } else if (char.characteristic.category.code === 'SUSTAINED_SD') {
        let score = 0
        this.selectedSDGs.forEach(sdg => {
          sdg.scaleResult.forEach(sr => {
            if (sr.selectedScore.value) score = score + sr.selectedScore.value
          })
          sdg.sustainResult.forEach(susr => {
            if (susr.selectedScore.value) score = score + susr.selectedScore.value
          })
        })
        this.SDGScore = Math.round(score / 6 / this.selectedSDGs.length)
      } else if (char.characteristic.category.code === 'ADAPTATION') {
        let score = 0
        this.outcome.forEach((category: OutcomeCategory) => {
          category.results.forEach((result) => {
            if (result.selectedScore.value) score = score + result.selectedScore.value
          })
        })
        this.GHGScore = Math.round(score / 6)
      }
    }
  }

  onAnswer(event: any, question: any, characteristic: Characteristics) {
    let q = new CMQuestion()
    q.id = question.id

    question.result.question = q
    question.result.type = this.approach

    if (event.type === 'COMMENT') {
      question.result.comment = event.comment
    } else if (event.type === 'FILE') {
      question.result.filePath = event.path
    }
    else {
      if (event.type === 'INDIRECT') {
        question.result.institution = event.answer
      } else {
        question.result.answer = event.answer
      }
    }

  }

  async submit() {
    for await (let category of this.categories['process']) {
      for await (let char of category.characteristics) {
        for await (let q of char.questions) {
          let res = new CMResultDto()
          Object.keys(q.result).forEach(e => {
            res[e] = q.result[e]
          })
          let ch = new Characteristics()
          ch.id = q.characteristic.id
          res.characteristic = ch
          res.relevance = char.relevance
          if (res.institution?.id) {
            let inst = new Institution()
            inst.id = res.institution.id
            res.institution = inst
          }
          res.type = this.approach
          res.selectedSdg = new PortfolioSdg()
          this.results.push(res)
        }
      }
    }

    if (this.selectedSDGs?.length > 0) {
      for await (let sd of this.selectedSDGs) {
        sd.scaleResult.forEach(res => {
          if (res.selectedScore) {
            if (res.institution?.id) {
              let inst = new Institution()
              inst.id = res.institution.id
              res.institution = inst
            }
            let score = new ScoreDto()
            score.name = res.selectedScore.name
            score.code = res.selectedScore.code
            score.value = res.selectedScore.value
            res.selectedScore = score
            res.type = this.approach

          console.log("scale result SDG", res)
            this.results.push(res)
          }
        })
        sd.sustainResult.forEach(res => {
          if (res.selectedScore) {
            if (res.institution?.id) {
              let inst = new Institution()
              inst.id = res.institution.id
              res.institution = inst
            }
            let susScore = new ScoreDto()
            susScore.name = res.selectedScore.name
            susScore.code = res.selectedScore.code
            susScore.value = res.selectedScore.value
            res.selectedScore = susScore
            res.type = this.approach
            this.results.push(res)
          }
        })
      }
    }

    if (this.outcome?.length > 0) {
      for await (let item of this.outcome) {
        if (item.type === 'GHG' || item.type === 'ADAPTATION') {
          item.results.forEach((res: any) => {
            res.type = this.approach
            if (res.institution?.id) {
              let inst = new Institution()
              inst.id = res.institution.id
              res.institution = inst
            }
            if (res.selectedScore) {
              let score = new ScoreDto()
              score.name = res.selectedScore.name
              score.code = res.selectedScore.code
              score.value = res.selectedScore.value
              res.selectedScore = score
              res.type = this.approach
              res.selectedSdg = new PortfolioSdg()
              this.results.push(res)
            }
          })
        }
      }
    }
    this.onSubmit.emit(this.results)
  }

  onUpload(event: UploadEvent, res: CMResultDto) {
    if (event.originalEvent.body) {
      res.filePath = event.originalEvent.body.fileName
    }

    this.messageService.add({ severity: 'info', summary: 'File Uploaded', detail: '' });
  }

  checkRelevance(index: number, categories: any[]): boolean {
    if (index === 0) {
      return false
    } else {
      for (let i = 0; i < index + 1; i++) {
        if (categories[i].characteristics.filter((o: { relevance: undefined; }) => o.relevance !== undefined).length !== categories[i].characteristics.length) {
          return true
        }
      }
      return false
    }
  }
}


export interface OutcomeResult {
  GHG: {
    scale: { [key: string]: any };
  };
}

export interface SDG {
  name: string
  code: string
  number: number
  scaleResult: CMResultDto[]
  sustainResult: CMResultDto[]
}
