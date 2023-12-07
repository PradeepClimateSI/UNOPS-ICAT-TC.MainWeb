import { Component, Input, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import * as moment from 'moment';
import { MessageService } from 'primeng/api';
import { Assessment, MethodologyAssessmentParameters, ServiceProxy, User, UsersControllerServiceProxy, VerificationControllerServiceProxy, VerificationDetail } from 'shared/service-proxies/service-proxies';

@Component({
  selector: 'app-raise-concern',
  templateUrl: './raise-concern.component.html',
  styleUrls: ['./raise-concern.component.css']
})
export class RaiseConcernComponent implements OnInit {

  @Input()
  area: string;

  @Input()
  verificationDetails: VerificationDetail[] | undefined;

  @Input()
  assessment: Assessment;

  @Input()
  isNdC: boolean;

  @Input()
  isMethodology: boolean;

  @Input()
  isParameter: boolean;

  @Input()
  isResult: boolean;

  @Input()
  parameter: MethodologyAssessmentParameters;

  @Input()
  isView: boolean

  lastConcernDate: Date = new Date();

  commentRequried: boolean = false;
  comment: string = '';
  rootCause: string = '';
  correctiveAction: string = ''
  verificationRound: number = 0;
  verificationDetail: VerificationDetail | undefined;
  loggedUser: User;
  isSubmit = false
  hasVerificationDetail: boolean = false

  constructor(
    private verificationProxy: VerificationControllerServiceProxy,
    private messageService: MessageService,
    private router: Router,
    private serviceProxy: ServiceProxy,
    private usersControllerServiceProxy: UsersControllerServiceProxy
  ) {}

  async ngOnInit(): Promise<void> {
    let userName = localStorage.getItem('USER_NAME')!;

    let user = await this.usersControllerServiceProxy.findUserByEmail(userName).toPromise();
    this.loggedUser = user;
    
  }

  ngOnChanges(changes: any) {
    this.commentRequried = false;
    this.comment = '';
    this.rootCause = '';
    this.correctiveAction = '';
    if (this.assessment && this.assessment !== undefined) {
      if (
        this.assessment.verificationStatus === 1 ||
        this.assessment.verificationStatus === 2 ||
        this.assessment.verificationStatus === 3
      ) {
        this.verificationRound = 1;
      } else if (this.assessment.verificationStatus === 4) {
        this.verificationRound = 2;
      } else if (this.assessment.verificationStatus === 5)
        this.verificationRound = 3;
    }

    if (this.verificationDetails && this.verificationDetails.length > 0) {
      let concernDetails = this.verificationDetails.find(
        (a) => a.explanation !== undefined && a.explanation !== null
      );

      if (concernDetails && concernDetails.updatedDate !== undefined) {
        this.lastConcernDate = concernDetails.updatedDate.toDate();
      }

      this.verificationDetail = this.verificationDetails.find(
        (a) => a.verificationStage == this.verificationRound
      );

      if (this.verificationDetail) {
        this.hasVerificationDetail = true
        this.comment = this.verificationDetail.explanation;
        this.rootCause = this.verificationDetail.rootCause;
        this.correctiveAction = this.verificationDetail.correctiveAction
      } else {
        this.hasVerificationDetail = false
      }
    }
  }

  onComplete() {
    this.isSubmit = true
    if (this.isView && this.hasVerificationDetail){
      this.onCompleteView()
    } else {
      if (!this.comment || this.comment == '') {
        this.commentRequried = true;
        return;
      } else {
        this.commentRequried = false;
      }
  
      let verificationDetails: VerificationDetail[] = [];
  
      let vd = new VerificationDetail();
  
      if (this.verificationDetail) {
        vd = this.verificationDetail;
        vd.updatedDate = moment();
      } else {
        vd.createdOn = moment();
        vd.assessment = this.assessment;
        vd.userVerifier = this.loggedUser.id;
        vd.year = Number(this.assessment.year.split('-')[0]);
        vd.updatedDate = moment();
  
        if (this.isParameter) {
          let param = new MethodologyAssessmentParameters();
          param.id = this.parameter.id;
          vd.parameter = param;
        }
  
        vd.verificationStatus = Number(this.assessment.verificationStatus);
      }
  
      vd.explanation = this.comment;
      vd.verificationStage = this.verificationRound;
      vd.isAccepted = false;
  
      verificationDetails.push(vd);
  
      this.verificationProxy
        .saveVerificationDetails(verificationDetails)
        .subscribe((a) => {
  
          this.messageService.add({
            severity: 'success',
            summary: 'Success',
            detail: 'successfully Save.',
            closable: true,
          });
        });
      this.isSubmit = false
    }

  }

  onCompleteView(){

    let verificationDetails: VerificationDetail[] = [];
  
    let vd: VerificationDetail
    if (this.verificationDetail) {
      vd = this.verificationDetail;
      vd.updatedDate = moment();
      vd.rootCause = this.rootCause
      vd.correctiveAction = this.correctiveAction
      vd.verificationStage = this.verificationRound;
      vd.isAccepted = false;
  
      verificationDetails.push(vd);
  
      this.verificationProxy
        .saveVerificationDetails(verificationDetails)
        .subscribe((a) => {
  
          this.messageService.add({
            severity: 'success',
            summary: 'Success',
            detail: 'successfully Save.',
            closable: true,
          });
        });
    } 

  }

}
