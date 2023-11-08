import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { MessageService } from 'primeng/api';
import { Assessment, CMAnswer, CMAssessmentQuestion, CMAssessmentQuestionControllerServiceProxy, CMQuestionControllerServiceProxy, CMResultDto, Institution, SaveCMResultDto, ScoreDto, ServiceProxy } from 'shared/service-proxies/service-proxies';

@Component({
  selector: 'app-cm-section',
  templateUrl: './cm-section.component.html',
  styleUrls: ['./cm-section.component.css']
})
export class CmSectionComponent implements OnInit {

  @Input() assessment: Assessment
  @Input() approach: string
  @Input() isEditMode: boolean;
 
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
  isPassed: boolean = false
  preQuestionIdx: number | undefined

  message: string
  defaultMessage = 'The preconditions for transformational change have not been met. <br> Transformational change = 0'
  assessmentQuestions: CMAssessmentQuestion[]
  isFirstLoading: boolean = false

  constructor(
    private cMQuestionControllerServiceProxy: CMQuestionControllerServiceProxy,
    private cMAssessmentQuestionControllerServiceProxy: CMAssessmentQuestionControllerServiceProxy,
    private messageService: MessageService,
    private activatedRoute: ActivatedRoute,
    private router: Router,
    private serviceProxy: ServiceProxy
  ) { }

  async ngOnInit(): Promise<void> {
    await this.getSections()
    this.onOpenTab({ index: 0 })
    this.shownQuestions[0] = []
    this.shownQuestions[0].push([])
    this.shownQuestions[0][0] = []
    this.shownQuestions[0][0].push(true)
    this.shownCriterias[0] = []
    this.shownCriterias[0].push(true)
    this.shownSections.push(true)
    if (this.assessment.processDraftLocation || this.assessment.outcomeDraftLocation) {
      this.openAccordion=1;
      this.shownSections.push(true)
    }
    if (this.isEditMode) this.isFirstLoading = true

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

    await this.setInitialState()

  }

  async setInitialState() {
    if (this.isEditMode) {
      this.assessmentQuestions = await this.cMAssessmentQuestionControllerServiceProxy.getAssessmentQuestionsByAssessmentId(this.assessment.id).toPromise()
    }
  }

  async getSections() {
    let res = await this.cMQuestionControllerServiceProxy.getAllSection().toPromise()
    this.sections = res.sort((a, b) => a.order - b.order)
    
  }

  async getCriteriaBySection(sectionId: number) {
    let res = await this.cMQuestionControllerServiceProxy.getCriteriaBySectionId(sectionId).toPromise()
    let _criterias = res.sort((a, b) => a.order - b.order)
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

  async onOpenTab(e: any) {
    let section = this.sections[e.index]
    await this.getCriteriaBySection(section.id)
  }

  onAnswer(e: any, message: string, criteria: any, sectionIdx: number, criteriaIdx: number, idx: number) {
    this.prev_answer = e.answer
    let question = criteria.questions[idx]
    if (e.type === 'COMMENT') {
      this.result.sections[sectionIdx].criteria[criteriaIdx].questions[idx]['comment'] = e.comment
    } else if (e.type === 'FILE') {
      this.result.sections[sectionIdx].criteria[criteriaIdx].questions[idx]['file'] = e.path
      criteria.questions[idx]['result'] = {}
      criteria.questions[idx]['result']['filePath'] = e.path
    } else {
      if (e.type === 'INDIRECT') {
        this.result.sections[sectionIdx].criteria[criteriaIdx].questions[idx]['institution'] = e.answer
      } else {
        this.result.sections[sectionIdx].criteria[criteriaIdx].questions[idx]['answer'] = e.answer
      }
      this.result.sections[sectionIdx].criteria[criteriaIdx].questions[idx]['question'] = question
      if (this.isEditMode) {
        let q = this.assessmentQuestions.find(o => o.question.id === question.id)
        if (q) {
          this.result.sections[sectionIdx].criteria[criteriaIdx].questions[idx]['assessmentQuestionId'] = q.id
          this.result.sections[sectionIdx].criteria[criteriaIdx].questions[idx]['assessmentAnswerId'] = q.assessmentAnswers[0].id
        }
      }
      this.result.sections[sectionIdx].criteria[criteriaIdx].questions[idx]['type'] = e.type

      if (criteria.questions.length === idx + 1 && !this.recievedQuestions.includes(idx)) {
        this.preQuestionIdx = undefined
        if (e.type === 'MULTI') {
          if (this.criterias[sectionIdx]?.length === this.shownCriterias[sectionIdx].length) {
            // this.openAccordion = this.openAccordion + 1
            if (this.prev_answer.isPassing) {
              this.shownSections.push(true)
              this.shownCriterias[sectionIdx + 1] = [true]
              this.shownQuestions[sectionIdx + 1][0] = [true]
              if (!this.result.sections[sectionIdx + 1] && this.result.sections.length !== this.sections.length) {
                this.result.sections.push({ id: sectionIdx + 1 })
                this.result.sections[sectionIdx + 1]['criteria'] = [{ id: 0 }]
                this.result.sections[sectionIdx + 1].criteria[0]['questions'] = [{ id: 0 }]
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
          if (this.prev_answer.isPassing || (e.type === "INDIRECT")) {
            if (e.answer.label === 'Unsure') {
              this.message = 'You are allowed to continue with the assessment, but we are strongly encouraged to evaluate all preconditions to ensure that they are met to enable transformational change.'
              if (!e.isLoading) {
                this.visible = true
              } 
            }
            if (this.criterias[sectionIdx]?.length === this.shownCriterias[sectionIdx].length) {
              this.shownSections.push(true)
              this.isPassed = true
              this.shownCriterias[sectionIdx + 1] = [true]
              this.shownQuestions[sectionIdx + 1] = []
              this.shownQuestions[sectionIdx + 1][0] = [true]
              if (!this.result.sections[sectionIdx + 1] && this.result.sections.length !== this.sections.length) {
                this.result.sections.push({ id: sectionIdx + 1 })
                this.result.sections[sectionIdx + 1]['criteria'] = [{ id: 0 }]
                this.result.sections[sectionIdx + 1].criteria[0]['questions'] = [{ id: 0 }]
              }
              this.preQuestionIdx = idx
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
            if (message) {
              this.message = message
            } else {
              this.message = this.defaultMessage
            }
            if (!this.isFirstLoading) {
              this.visible = true
            } else {
              this.isFirstLoading = false
            }
            this.shownCriterias[sectionIdx].splice(criteriaIdx + 1, this.shownCriterias[sectionIdx].length - (criteriaIdx + 1))
            this.shownSections.splice(sectionIdx + 1, this.shownSections.length - (sectionIdx + 1))
            this.isPassed = false
          }
        }
      } else {
        if ((e.type === 'MULTI' || e.type === "INDIRECT") && !this.recievedQuestions.includes(idx)) {
          this.shownQuestions[sectionIdx][criteriaIdx].push(true)
          if (!this.result.sections[sectionIdx].criteria[criteriaIdx].questions[idx + 1]) {
            this.result.sections[sectionIdx].criteria[criteriaIdx].questions.push({ id: idx + 1 })
          }
        } else {
          if (this.prev_answer.isPassing) {
            if (e.answer.label === 'Unsure') {
              this.message = 'You are allowed to continue with the assessment, but we are strongly encouraged to evaluate all preconditions to ensure that they are met to enable transformational change.'
              if (!e.isLoading) {
                this.visible = true
              } 
            }
            if (this.preQuestionIdx !== idx) this.shownQuestions[sectionIdx][criteriaIdx].push(true)
            this.preQuestionIdx = idx
            if (!this.result.sections[sectionIdx].criteria[criteriaIdx].questions[idx + 1]) {
              this.result.sections[sectionIdx].criteria[criteriaIdx].questions.push({ id: idx + 1 })
            }
          } else {
            if (!this.isFirstLoading) {
              this.visible = true
            } else {
              this.isFirstLoading = false
            }
            if (message) {
              this.message = message
            } else {
              this.message = this.defaultMessage
            }
            this.shownQuestions[sectionIdx][criteriaIdx].splice(idx + 1, this.shownQuestions[sectionIdx][criteriaIdx].length - (idx + 1))
            this.shownCriterias[sectionIdx].splice(criteriaIdx + 1, this.shownCriterias[sectionIdx].length - (criteriaIdx + 1))
            this.shownSections.splice(sectionIdx + 1, this.shownSections.length - (sectionIdx + 1))
            this.preQuestionIdx = undefined
          }
        }
        if (!this.recievedQuestions.includes(idx)) {
          this.recievedQuestions.push(idx)
        }
      }
    }
  }


  save(event: SaveDto) {
     if(event.type){
      this.shownSections.push(true)
     }
    console.log(event)
    let result: SaveCMResultDto = new SaveCMResultDto()
    result.result = []
    result.result = [...event.result]
    this.result.sections.forEach((section: any) => {
      section.criteria.forEach((cr: any) => {
        cr.questions.forEach((q: any) => {
          let item = new CMResultDto()
          if (q.answer) item.answer = q.answer
          let ins = new Institution()
          ins.id = q.institution?.id
          if (q.institution) item.institution = ins
          item.comment = q.comment
          item.question = q.question
          item.type = q.type
          item.filePath = q.file
          if (this.isEditMode){
            let assQ = this.assessmentQuestions.find(o => (o.question.id === q.question?.id))
            if (assQ) {
              item.assessmentQuestionId = assQ.id
              item.assessmentAnswerId = assQ.assessmentAnswers[0]?.id
            }
          }
          if (item.question) result.result.push(item)
        })
      })
    })
    result.assessment = this.assessment
    result.isDraft = event.isDraft
    result.type =event.type;
    result.name=event.name;
    this.cMAssessmentQuestionControllerServiceProxy.saveResult(result)
      .subscribe(res => {
        if (res) {
          let message = ''
          if (event.isDraft) {
            message = 'Assessment saved successfully. You will be able to continue the assessment from the “In progress” menu'
          } else {
            message = 'Assessment created successfully'
          }
          this.messageService.add({
            severity: 'success',
            summary: 'Success',
            detail: message,
            closable: true,
          })
          if (event.isDraft) {
            this.isEditMode = true
            this.setInitialState()
            this.router.navigate(['../carbon-market-tool-edit'], { queryParams: { id: this.assessment.id, isEdit: true }, relativeTo: this.activatedRoute });
            // window.location.reload()
          }
          if (result.assessment.assessment_approach === 'DIRECT' && !event.isDraft) {
            this.router.navigate(['../carbon-market-tool-result'], { queryParams: { id: this.assessment.id }, relativeTo: this.activatedRoute });
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
  okay() {
    this.visible = false
  }

  onSubmitSectionThree($event: any) {
    throw new Error('Method not implemented.');
  }

}

export class SaveDto {
  result: CMResultDto[]
  isDraft: boolean = false
  name:string
  type:string
}
