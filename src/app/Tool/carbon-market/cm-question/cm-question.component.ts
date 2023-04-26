import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { CMAnswer, CMQuestion, CMQuestionControllerServiceProxy } from 'shared/service-proxies/service-proxies';

@Component({
  selector: 'app-cm-question',
  templateUrl: './cm-question.component.html',
  styleUrls: ['./cm-question.component.css']
})
export class CmQuestionComponent implements OnInit {

  @Input() question: CMQuestion
  @Output() prev_answer = new EventEmitter()

  answers: CMAnswer[] = []
  selectedAnswers: any
  comment: string

  constructor(
    private cMQuestionControllerServiceProxy: CMQuestionControllerServiceProxy
  ) { }

  async ngOnInit(): Promise<void> {
    await this.getAnswers()
  }

  async getAnswers(){
    this.answers = await this.cMQuestionControllerServiceProxy.getAnswersByQuestion(this.question.id).toPromise()
  }

  onSelectAnswer(e: any, type: string) {
    if (type === 'COMMENT'){
      this.prev_answer.emit({comment: this.comment, type: type})
    } else {
      this.prev_answer.emit({answer: e.value, type: type})
    }
  }

  keyup(e: any){
    alert(e)
  }

}
