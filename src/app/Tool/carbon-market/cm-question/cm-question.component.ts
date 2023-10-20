import { HttpResponse } from '@angular/common/http';
import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { environment } from 'environments/environment';
import { MessageService } from 'primeng/api';
import { CMAnswer, CMAssessmentAnswerControllerServiceProxy, CMAssessmentQuestion, CMQuestion, CMQuestionControllerServiceProxy, Institution, InstitutionControllerServiceProxy } from 'shared/service-proxies/service-proxies';

interface UploadEvent {
  originalEvent: HttpResponse<FileDocument>;
  files: File[];
}

interface FileDocument {
  fileName: string
}

@Component({
  selector: 'app-cm-question',
  templateUrl: './cm-question.component.html',
  styleUrls: ['./cm-question.component.css']
})
export class CmQuestionComponent implements OnInit {

  @Input() question: CMQuestion
  @Input() approach: string
  @Output() prev_answer = new EventEmitter()
  @Input() assessmentquestions: CMAssessmentQuestion[]
  @Input() isEditMode: boolean

  answers: CMAnswer[] = []
  selectedAnswers: any
  comment: string

  institutions: Institution[] = [];
  selectedInstitution: Institution

  tooltip: string = ''
  adoptionTooltip = 'High-hanging fruit are mitigation actions that are at the higher end of a marginal abatement cost curve (MACC).'
  tootltipCodes = ['S-3-ADOPTION-Q-1']
  weight = 0
  uploadUrl: string;
  uploadedFiles: any = [];
  acceptedFiles: string = ".pdf, .jpg, .png, .doc, .docx, .xls, .xlsx, .csv";
  fileServerURL: string;
  selectedAnswer: CMAnswer

  constructor(
    private cMQuestionControllerServiceProxy: CMQuestionControllerServiceProxy,
    private institutionControllerServiceProxy: InstitutionControllerServiceProxy,
    private messageService: MessageService,
  ) {
    this.uploadUrl = environment.baseUrlAPI + '/cm-assessment-question/upload-file'
    this.fileServerURL = environment.baseUrlAPI+'/uploads'
   }

  async ngOnInit(): Promise<void> {
    await this.getAnswers()
    this.answers.forEach(ans => {
      if(ans.weight !== 0){
        this.weight = ans.weight
      }
      if (this.weight !== 0) {
        this.tooltip = "Weight transformational change criteria is " + this.weight + '%'
      } else {
        this.tooltip = "No weight for this question"
      }
    })
    this.institutionControllerServiceProxy.getAllInstitutions().subscribe((res: any) => {
      this.institutions = res;
    });
    this.setInitialState()
    
  }

  setInitialState() {
    if (this.isEditMode) {
      let _question: any = this.assessmentquestions.find(o => o.question.id === this.question.id)
      if (_question) {
        let ans = this.answers.find(o => o.id === _question.assessmentAnswers[0].answer.id)
        if (ans) {
          this.selectedAnswer = ans
          this.comment = _question.comment
          this.onSelectAnswer({value: this.selectedAnswer}, _question.answer_type)
        }
      }
    }
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

  showAnswer(){
    if (this.approach === 'INDIRECT'){
      if (this.question.characteristic.id){
        return false
      } else {
        return true
      }
    } else {
      return true
    }
  }

  upload(type: string) {
    let filePath = 'File path'
    this.messageService.add({severity: 'info', summary: 'File Uploaded', detail: ''});
    this.prev_answer.emit({path: filePath, type: type})
  }

  onUpload(event:UploadEvent, type: string) {
    if(event.originalEvent.body){
      let filePath = event.originalEvent.body.fileName
      this.prev_answer.emit({path: filePath, type: type})
    }
  }

}
