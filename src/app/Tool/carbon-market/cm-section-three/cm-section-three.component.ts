import { HttpResponse } from '@angular/common/http';
import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { MasterDataService } from 'app/shared/master-data.service';
import { SelectedScoreDto } from 'app/shared/score.dto';
import { environment } from 'environments/environment';
import { TabView } from 'primeng/tabview';
import { CMQuestion, CMQuestionControllerServiceProxy, CMResultDto, Characteristics, MethodologyAssessmentControllerServiceProxy, OutcomeCategory, ScoreDto } from 'shared/service-proxies/service-proxies';


interface UploadEvent {
  originalEvent: HttpResponse<string[]>;
  files: File[];
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
  // SDGsustained: SDG[] = [{name: 'No poverty', code: 'NO_POVERTY', result: []}, {name: 'Food', code: 'FOOD', result: []}];
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
  // selectedSDGsustained: SDG[];
  results: CMResultDto[] = []
  activeIndex2: number = 0;
  sdgsToLoop: SDG[]
  uploadedFiles: any = [];
  uploadUrl: string;
  GHG_scale_score: SelectedScoreDto[]
  GHG_sustained_score: SelectedScoreDto[]
  SDG_scale_score: SelectedScoreDto[]
  SDG_sustained_score: SelectedScoreDto[]
  SDGScore: any = 0;
  SDGWeight: any = '10%';
  GHGScore: any;

  constructor(
    private cMQuestionControllerServiceProxy: CMQuestionControllerServiceProxy,
    private methodologyAssessmentControllerServiceProxy: MethodologyAssessmentControllerServiceProxy,
    private masterDataService: MasterDataService
  ) { 
    this.uploadUrl = environment.baseUrlAPI + '/cm-assessment-question/upload-file'
  }

  async ngOnInit(): Promise<void> {
    this.types = [
      { name: 'Process of Change', code: 'process' },
      { name: 'Outcome of Change', code: 'outcome' }
    ]
    this.GHG_scale_score = this.masterDataService.GHG_scale_score
    this.GHG_sustained_score = this.masterDataService.GHG_sustained_score
    this.SDG_scale_score = this.masterDataService.SDG_scale_score
    this.SDG_sustained_score = this.masterDataService.SDG_sustained_score
    this.SDGs = this.masterDataService.SDGs
    this.categories = await this.cMQuestionControllerServiceProxy.getUniqueCharacterisctics().toPromise()
    this.selectedType = this.types[0]
    this.selectedCategory = this.categories[this.selectedType.code][0]
    console.log(this.categories)
    this.onMainTabChange({index: 0})
    this.onCategoryTabChange({index: 0})
    this.outcome = await this.methodologyAssessmentControllerServiceProxy.getAllOutcomeCharacteristics().toPromise()
    
  }

  onMainTabChange(event: any) {
    this.selectedType = this.types[event.index]
    console.log(event, this.selectedType)
    this.mainTabIndex = event.index;
  }

  async onCategoryTabChange(event: any) {
    this.selectedCategory = this.categories[this.selectedType.code][event.index]
    let ids = this.selectedCategory.characteristics.map((item: any) => {
      return item.id
    })
    this.questions = await this.cMQuestionControllerServiceProxy.getQuestionsByCharacteristic(ids).toPromise()
    console.log(this.questions)
    console.log(this.selectedCategory, ids)
    this.categoryTabIndex =event.index;
  }

  onSelectSDG(event: any) {
    let scaleResults: CMResultDto[] = []
    let sustainResults: CMResultDto[] = []
    this.outcome.forEach((category: { type: string; results: any[]; method: string; }) => {
      if (category.type === 'SD'){
        category.results.forEach(ch => {
          let res = new CMResultDto()
          res.characteristic = ch.characteristic
          res.type = this.approach
          if (category.method === 'SCALE') scaleResults.push(res)
          if (category.method === 'SUSTAINED') sustainResults.push(res)
        })
      }
    })
    this.selectedSDGs = this.selectedSDGs.map(sdg => {
      let res: CMResultDto[] = scaleResults.map((o:any) => {
        let _r = new CMResultDto()
        Object.keys(_r).forEach(e => {
          _r[e] = o[e]
        })
        _r.selectedSdg = sdg.code
        _r.isSDG = true
        return _r
      })
      let res2: CMResultDto[] = sustainResults.map((o:any) => {
        let _r = new CMResultDto()
        Object.keys(_r).forEach(e => {
          _r[e] = o[e]
        })
        _r.selectedSdg = sdg.code
        _r.isSDG = true
        return _r
      })
      sdg.scaleResult = res
      sdg.sustainResult = res2
      return sdg
    })
    console.log(this.selectedSDGs)
  }

  // onSelectSDGSustained(event: any, category: OutcomeCategory){
  //   let results: CMResultDto[] = []
  //   category.results.forEach(ch => {
  //     let res = new CMResultDto()
  //     res.characteristic = ch.characteristic
  //     res.type = this.approach
  //     results.push(res) 
  //   })
  //   this.selectedSDGsustained = this.selectedSDGsustained.map(sdg => {
  //     let res: CMResultDto[] = results.map((o: { [x: string]: any; }) => {
  //       let _r = new CMResultDto()
  //       Object.keys(_r).forEach(e => {
  //         _r[e] = o[e]
  //       })
  //       _r.selectedSdg = sdg.code
  //       return _r
  //     })
  //     sdg.result = res
  //     return sdg
  //   })
  // }

  onCategoryTabChange2($event: any) {
    throw new Error('Method not implemented.');
  }

  next() {
    console.log(this.outcome)

    console.log(this.selectedSDGs)
    
    if (this.activeIndexMain === 1) {
      this.activeIndex2 = this.activeIndex2 + 1;
    }
    if (this.activeIndex === this.categories.process.length-1) {
      this.activeIndexMain = 1;
    }
    if (this.activeIndex <= this.categories.process.length-2 && this.activeIndex >= 0 && this.activeIndexMain === 0) {
      this.activeIndex = this.activeIndex + 1;
    }
    if (this.activeIndexMain === 0){
      this.onCategoryTabChange({index: this.activeIndex})
    }
  }

  onSelectScore(event: any, char: CMResultDto) {
    console.log("onSelectScore", event)
    let score = new ScoreDto()
    score.name = event.value.name
    score.code = event.value.code
    score.value = event.value.value 
    char.selectedScore = score
  }

  onAnswer(event: any, question: any, characteristic: Characteristics) {
    let result = this.results.find(o => o.question.code === question.code)
    console.log(result)
    let isNew: boolean = false
    if (result === undefined){
      isNew = true
      result = new CMResultDto()
      let q = new CMQuestion()
      q.id = question.id
      result.question = q 
      let ch = new Characteristics()
      ch.id = characteristic.id 
      result.characteristic = ch
      result.type = this.approach
    } 
    console.log(result)

    if (event.type === 'COMMENT'){
      result.comment = event.comment
    } else {
      if (event.type === 'INDIRECT'){
        result.institution = event.answer
      } else {
        result.answer = event.answer
      }
    }

    if (isNew){
      this.results.push(result)
    }
    console.log(this.results)

  }

  async submit() {
    console.log(this.results)
    if (this.selectedSDGs?.length > 0){
      for await (let sd of this.selectedSDGs) {
        sd.scaleResult.forEach(res => {
          if (res.selectedScore){
            this.results.push(res)
          }
        })
        sd.sustainResult.forEach(res => {
          if (res.selectedScore){
            this.results.push(res)
          }
        })
        // this.results.push(...sd.result)
      }
    }

    // if (this.selectedSDGsustained?.length > 0){
    //   for await (let sd of this.selectedSDGsustained) {
    //     sd.result.forEach(res => {
    //       if (res.selectedScore){
    //         this.results.push(res)
    //       }
    //     })
    //     // this.results.push(...sd.result)
    //   }
    // }

    if (this.outcome?.length > 0){
      for await (let item of this.outcome) {
        if (item.type === 'GHG'){
          item.results.forEach((res:any) => {
            res.type = this.approach
            if (res.selectedScore){
              this.results.push(res)
            }
          })
          // this.results.push(...item.results)
        }
      }
    }
    console.log(this.results)
    this.onSubmit.emit(this.results)
  }

  onUpload(event:UploadEvent, res: CMResultDto) {
    console.log(event.originalEvent.body)
    if(event.originalEvent.body){

      // this.savedDocs = event.originalEvent.body;

    }
    let path = 'File Path'
    res.filePath = path
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
  scaleResult: CMResultDto[]
  sustainResult: CMResultDto[]
}
