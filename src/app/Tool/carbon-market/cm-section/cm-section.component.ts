import { Component, OnInit } from '@angular/core';
import { CMAnswer, CMQuestion, CMQuestionControllerServiceProxy } from 'shared/service-proxies/service-proxies';

@Component({
  selector: 'app-cm-section',
  templateUrl: './cm-section.component.html',
  styleUrls: ['./cm-section.component.css']
})
export class CmSectionComponent implements OnInit {

  openAccordion = 0

  sections: any[] = []
  criterias: any[] = []

  prev_answer: CMAnswer

  shownQuestions: boolean[] = []
  shownCriterias: any[] = []
  shownSections: boolean[] = []

  recievedQuestions: number[] = []

  constructor(
    private cMQuestionControllerServiceProxy: CMQuestionControllerServiceProxy
  ) { }

  async ngOnInit(): Promise<void> {
    await this.getSections()
    this.onOpenTab({index: 0})
    this.shownQuestions.push(true)
    this.shownCriterias[0] = []
    this.shownCriterias[0].push(true)
    this.shownSections.push(true)

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
  }

  async onOpenTab(e: any){
    let section = this.sections[e.index]
    await this.getCriteriaBySection(section.id)
  }

  onAnswer(e: any, criteria: any, idx: number, sectionIdx: number) {
    this.prev_answer = e.answer
    let question = criteria.questions[idx + 1]
    
    if (criteria.questions.length === idx + 1 && !this.recievedQuestions.includes(idx)) {
      if (this.criterias[sectionIdx]?.length === this.shownCriterias[sectionIdx].length){
        // this.openAccordion = this.openAccordion + 1
        this.shownSections.push(true)
        this.shownCriterias[sectionIdx+1] = [true]
      }
      this.shownCriterias[sectionIdx].push(true)
      this.recievedQuestions = []
    } else {
      if (e.type === 'MULTI' && !this.recievedQuestions.includes(idx)){
        this.shownQuestions.push(true)
      } else {
        if (question && question.prev_answer_to_generate) {
          if (this.prev_answer.id === question.prev_answer_to_generate.id) {
            this.shownQuestions.push(true)
          } else {
            this.shownQuestions.splice(idx + 1, this.shownQuestions.length - (idx + 1) )
          }
        } else {
          this.shownQuestions.push(true)
        }
      }
      this.recievedQuestions.push(idx)
    }


  }

}
