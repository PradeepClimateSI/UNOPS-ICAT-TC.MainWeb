import { Component, Input, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { MessageService } from 'primeng/api';
import { Assessment, CMAnswer, CMAssessmentQuestion, CMAssessmentQuestionControllerServiceProxy, CMQuestion, CMQuestionControllerServiceProxy, CMResultDto, Criteria, Institution, SaveCMResultDto } from 'shared/service-proxies/service-proxies';

@Component({
  selector: 'app-cm-section',
  templateUrl: './cm-section.component.html',
  styleUrls: ['./cm-section.component.css']
})
export class CmSectionComponent implements OnInit {

  @Input() assessment: Assessment
  @Input() approach: string

  openAccordion = 0

  sections: any[] = []
  criterias: any[] = []

  prev_answer: CMAnswer

  shownQuestions: any[] = []
  shownCriterias: any[] = []
  shownSections: boolean[] = []

  recievedQuestions: number[] = []
  visible: boolean = false

  result: any

  message: string
  defaultMessage = 'The preconditions for transformational change have not been met. <br> Transformational change = 0'

  constructor(
    private cMQuestionControllerServiceProxy: CMQuestionControllerServiceProxy,
    private cMAssessmentQuestionControllerServiceProxy: CMAssessmentQuestionControllerServiceProxy,
    private messageService: MessageService,
    private activatedRoute:ActivatedRoute,
    private router: Router,
  ) { }

  async ngOnInit(): Promise<void> {
   // this.approach = 'INDIRECT' //TODO REMOVE ON COMMIT
    await this.getSections()
    this.onOpenTab({index: 0})
    this.shownQuestions[0] = []
    this.shownQuestions[0].push([])
    this.shownQuestions[0][0] = []
    this.shownQuestions[0][0].push(true)
    this.shownCriterias[0] = []
    this.shownCriterias[0].push(true)
    this.shownSections.push(true)


    this.result = {
      sections: [
        {
          id: 0,
          criteria: [
            {
              id: 0,
              questions: [
                {
                  id: 0
                }
              ]
            }
          ]
        }
      ]
    }

  }

  async getSections(){
    let res = await this.cMQuestionControllerServiceProxy.getAllSection().toPromise()
    this.sections = res.sort((a,b) => a.order - b.order)
  }

  async getCriteriaBySection(sectionId: number){
    let res = await this.cMQuestionControllerServiceProxy.getCriteriaBySectionId(sectionId).toPromise()
    let _criterias = res.sort((a,b) => a.order - b.order)
    _criterias = await Promise.all(
      _criterias.map(async criteria => {
        let q = await this.cMQuestionControllerServiceProxy.getQuestionsByCriteria(criteria.id).toPromise()
        criteria['questions'] = q
        return criteria
      })
    )
    this.criterias.push(_criterias)
    console.log(this.criterias)

  }

  async onOpenTab(e: any){
    let section = this.sections[e.index]
    await this.getCriteriaBySection(section.id)
  }

  onAnswer(e: any, message: string, criteria: any, sectionIdx: number, criteriaIdx: number, idx: number ) {
    this.prev_answer = e.answer
    let question = criteria.questions[idx]
    console.log("Indirectt222", e.type)
    if (e.type === 'COMMENT'){
      this.result.sections[sectionIdx].criteria[criteriaIdx].questions[idx]['comment'] = e.comment
    } else {
      if (e.type === 'INDIRECT'){
        this.result.sections[sectionIdx].criteria[criteriaIdx].questions[idx]['institution'] = e.answer
      } else {
        this.result.sections[sectionIdx].criteria[criteriaIdx].questions[idx]['answer'] = e.answer
      }
      this.result.sections[sectionIdx].criteria[criteriaIdx].questions[idx]['question'] = question
      this.result.sections[sectionIdx].criteria[criteriaIdx].questions[idx]['type'] = e.type

      if (criteria.questions.length === idx + 1 && !this.recievedQuestions.includes(idx)) {
        if (e.type === 'MULTI') {
          if (this.criterias[sectionIdx]?.length === this.shownCriterias[sectionIdx].length){
            // this.openAccordion = this.openAccordion + 1
            if (this.prev_answer.isPassing){
              this.shownSections.push(true)
              this.shownCriterias[sectionIdx+1] = [true]
              this.shownQuestions[sectionIdx+1][0] = [true]
              if (!this.result.sections[sectionIdx+1] && this.result.sections.length !== this.sections.length){
                this.result.sections.push({id: sectionIdx+1})
                this.result.sections[sectionIdx+1]['criteria'] = [{id: 0}]
                this.result.sections[sectionIdx+1].criteria[0]['questions'] = [{id: 0}]
              }
            } else {
              this.shownCriterias[sectionIdx].splice(criteriaIdx + 1, this.shownCriterias[sectionIdx].length - (criteriaIdx + 1))
              this.shownSections.splice(sectionIdx + 1, this.shownSections.length - (sectionIdx + 1))
            }
          } else {
            this.shownCriterias[sectionIdx].push(true)
            this.shownQuestions[sectionIdx][criteriaIdx + 1] = [true]
            if (!this.result.sections[sectionIdx].criteria[criteriaIdx + 1]) {
              this.result.sections[sectionIdx].criteria.push({ id: criteriaIdx + 1 })
              this.result.sections[sectionIdx].criteria[criteriaIdx + 1]['questions'] = [{ id: 0 }]
            }
          }

          this.recievedQuestions = []
        } else {
          console.log("Indirectt", e.type)
          if (this.prev_answer.isPassing || (e.type === "INDIRECT")){
            console.log("Insiddeee", e.type)

            if (this.criterias[sectionIdx]?.length === this.shownCriterias[sectionIdx].length){
              this.shownSections.push(true)
              this.shownCriterias[sectionIdx+1] = [true]
              this.shownQuestions[sectionIdx+1] = []
              this.shownQuestions[sectionIdx+1][0] = [true]
              if (!this.result.sections[sectionIdx+1] && this.result.sections.length !== this.sections.length){
                this.result.sections.push({id: sectionIdx+1})
                this.result.sections[sectionIdx+1]['criteria'] = [{id: 0}]
                this.result.sections[sectionIdx+1].criteria[0]['questions'] = [{id: 0}]
              }
            } else {
              this.shownCriterias[sectionIdx].push(true)
              this.shownQuestions[sectionIdx][criteriaIdx+1] = [true]
              // this.shownQuestions.push(true)
              if (!this.result.sections[sectionIdx].criteria[criteriaIdx+1]){
                this.result.sections[sectionIdx].criteria.push({id: criteriaIdx+1})
                this.result.sections[sectionIdx].criteria[criteriaIdx+1]['questions'] = [{id: 0}]
              }
            }

            this.recievedQuestions = []
          } else {
            // alert("TC score is 0")
            if (message){
              this.message = message
            } else {
              console.log("1111111111", e.type)
              this.message = this.defaultMessage
            }
            this.visible = true
            this.shownCriterias[sectionIdx].splice(criteriaIdx + 1, this.shownCriterias[sectionIdx].length - (criteriaIdx + 1))
            this.shownSections.splice(sectionIdx + 1, this.shownSections.length - (sectionIdx + 1))
          }
        }
      } else {
        if ((e.type === 'MULTI' || e.type === "INDIRECT") && !this.recievedQuestions.includes(idx)){
          this.shownQuestions[sectionIdx][criteriaIdx].push(true)
          if (!this.result.sections[sectionIdx].criteria[criteriaIdx].questions[idx+1]){
            this.result.sections[sectionIdx].criteria[criteriaIdx].questions.push({id: idx+1})
          }
        } else {
            if (this.prev_answer.isPassing) {
              this.shownQuestions[sectionIdx][criteriaIdx].push(true)
              if (!this.result.sections[sectionIdx].criteria[criteriaIdx].questions[idx+1]){
                this.result.sections[sectionIdx].criteria[criteriaIdx].questions.push({id: idx+1})
              }
            } else {
              this.visible = true
              if (message){
                this.message = message
              } else {
                console.log("222222", e.type)
                this.message = this.defaultMessage
              }
              this.shownQuestions[sectionIdx][criteriaIdx].splice(idx + 1, this.shownQuestions[sectionIdx][criteriaIdx].length - (idx + 1))
              this.shownCriterias[sectionIdx].splice(criteriaIdx + 1, this.shownCriterias[sectionIdx].length - (criteriaIdx + 1))
              this.shownSections.splice(sectionIdx + 1, this.shownSections.length - (sectionIdx + 1))
            }
        }
        this.recievedQuestions.push(idx)
      }
    }
  }


  save(){
    let result: SaveCMResultDto = new SaveCMResultDto()
    result.result = []
    this.result.sections.forEach((section: any) => {
      section.criteria.forEach((cr: any) => {
        cr.questions.forEach((q:any) => {
          let item = new CMResultDto()
          if (q.answer) item.answer = q.answer

          console.log("inss",q.institution)

          let ins = new Institution()
          ins.id = q.institution?.id
          if (q.institution) item.institution = ins
          item.comment = q.comment
          item.question = q.question
          item.type = q.type
          result.result.push(item)
        })
      })
    })
    result.assessment = this.assessment

    console.log("kkkkk",result)

    this.cMAssessmentQuestionControllerServiceProxy.saveResult(result)
    .subscribe(res => {
      if (res) {
        this.messageService.add({
          severity: 'success',
          summary: 'Success',
          detail: 'Assessment created successfully',
          closable: true,
        })
        // this.cMAssessmentQuestionControllerServiceProxy.saveTcValue(this.assessment.id).subscribe();
        
        if(result.assessment.assessment_approach=== 'DIRECT'){
          this.router.navigate(['../carbon-market-tool-result'], {queryParams: { id: this.assessment.id }, relativeTo:this.activatedRoute});
        }

      }
    }, error => {
      this.messageService.add({
        severity: 'error',
        summary: 'Error',
        detail: 'Error in result saving',
        closable: true,
      })
    })
  }
  okay(){
    this.visible=false
  }

}
