import { Component, Input, OnInit } from '@angular/core';
import * as moment from 'moment';
import { ConfirmationService, MessageService } from 'primeng/api';
import { Assessment, MethodologyAssessmentControllerServiceProxy, MethodologyAssessmentParameters, ParameterHistoryControllerServiceProxy, ServiceProxy, UsersControllerServiceProxy, VerificationControllerServiceProxy, VerificationDetail } from 'shared/service-proxies/service-proxies';

@Component({
  selector: 'app-verify-parameter',
  templateUrl: './verify-parameter.component.html',
  styleUrls: ['./verify-parameter.component.css']
})
export class VerifyParameterComponent implements OnInit {

  @Input() parameters: MethodologyAssessmentParameters[]
  @Input() verificationStatus: any
  @Input() isAdmin: boolean;
  @Input() isAccepted: boolean;
  @Input() assessment: Assessment;
  @Input() verificationDetails: VerificationDetail[];
  loading: boolean = false

  flag: number;
  selectedParameter: any = [];
  public loggedUser: any;
  raiseConcernSection: any;
  isParameter: boolean;
  isValue: boolean;
  concernVerificationDetails: VerificationDetail[];
  concernParam: MethodologyAssessmentParameters | undefined;
  displayRaiseConcern: boolean = false;
  paraId: any;
  requestHistoryList: any;
  displayHistory: boolean;
  displayViewConcern: boolean;

  constructor(
    private confirmationService: ConfirmationService,
    private serviceProxy: ServiceProxy,
    private methodologyAssessmentControllerServiceProxy: MethodologyAssessmentControllerServiceProxy,
    private usersControllerServiceProxy: UsersControllerServiceProxy,
    private verificationProxy: VerificationControllerServiceProxy,
    private messageService: MessageService,
    private prHistoryProxy : ParameterHistoryControllerServiceProxy,
  ) { }

  async ngOnInit(): Promise<void> {
    await this.loadUser()
  }

  getInfo(obj: any)
  {
       console.log("dataRequestList...",obj)
       this.paraId = obj.id;
       console.log("this.paraId...",this.paraId)

       this.prHistoryProxy
       .getHistroyByid(this.paraId)  // this.paraId
       .subscribe((res) => {
         
        this.requestHistoryList =res;
         
       console.log('this.requestHistoryList...', this.requestHistoryList);
       
       });

       this.displayHistory = true;
  }

  async loadUser() {
    let userName = localStorage.getItem('USER_NAME')!;

    let user = await this.usersControllerServiceProxy.findUserByEmail(userName).toPromise()
    console.log("user", user)
    this.loggedUser = user
  }

  checkboxCheck(event: any, param: MethodologyAssessmentParameters) {
    if (event.checked) {
      this.selectedParameter.push(param);
    } else {
      const index = this.selectedParameter.indexOf(param);
      this.selectedParameter.splice(index, 1);
    }
  }

  raiseConcern(event: any, parameter: MethodologyAssessmentParameters, type: string) {
    // console.log("my para...",parameter);
    console.log(parameter)
    this.raiseConcernSection = parameter.category.name + ' - ' + parameter.characteristics.name
    this.isParameter = true;
    this.isValue = false;

    console.log('gggggggggggggggggggg');

    if (this.verificationDetails) {
      this.concernVerificationDetails = this.verificationDetails.filter(
        (a) => a.parameter && a.parameter.id == parameter.id
      );
    }

    this.concernParam = parameter;

    if (type === 'raise') {
      this.displayRaiseConcern = true;
    } else if (type === 'view'){
      this.displayViewConcern = true;
    }

  }

  parameterAccept() {
    // console.log("parameterAccept")
    // this.confirmationService.confirm({
    //   message: 'Are sure you want to accept the parameter(s) ?',
    //   header: 'Accept Confirmation',
    //   acceptIcon: 'icon-not-visible',
    //   rejectIcon: 'icon-not-visible',
    //   accept: () => {
    //     this.acceptParametrs();

    //   },
    //   reject: () => {},
    // });
    this.acceptParametrs();
  }

  acceptParametrs() {
    console.log("acceptParametrs")
    let verificationDetails: VerificationDetail[] = [];

    this.selectedParameter.map((v: any) => {

      v.isAcceptedByVerifier = true;

      this.methodologyAssessmentControllerServiceProxy
        .updateParameter(
          v.id,
          v
        )
        .subscribe(
          (res) => {

          });


      let verificationDetail = undefined;

      if (this.verificationDetails) {
        verificationDetail = this.verificationDetails.find(
          (a) => a.parameter && a.parameter.id == v.id
        );
      }
      let vd = new VerificationDetail();

      if (verificationDetail) {
        vd = verificationDetail;
      } else {
        vd.userVerifier = this.loggedUser.id;
        vd.assessment = this.assessment
        vd.year = Number(this.assessment.year.split('-')[0]);
        vd.createdOn = moment();

        let param = new MethodologyAssessmentParameters();
        param.id = v.id;
        vd.parameter = param;

        // if (this.header == 'Baseline Parameter') {
        //   vd.isBaseline = true;
        // }
      }

      vd.editedOn = moment();
      vd.updatedDate = moment();
      vd.isAccepted = true;
      vd.verificationStage = this.getverificationStage();
      vd.verificationStatus = Number(this.assessment.verificationStatus);

      verificationDetails.push(vd);
    });

    this.verificationProxy
      .saveVerificationDetails(verificationDetails)
      .subscribe((a) => {
        this.messageService.add({
          severity: 'success',
          summary: 'Success',
          detail: 'successfully Save.',
          closable: true,
        });
        this.isAccepted=true
      },error => {
        this.messageService.add({
          severity: 'error',
          summary: 'Error',
          detail: 'failed Save.',
          closable: true,
        });
      });
  }

  getverificationStage() {
    let stage = 0;
    if (
      this.assessment.verificationStatus === 1 ||
      this.assessment.verificationStatus === 2 ||
      this.assessment.verificationStatus === 3
    ) {
      stage = 1;
    } else if (this.assessment.verificationStatus === 4) {
      stage = 2;
    } else if (this.assessment.verificationStatus === 5) {
      stage = 3;
    }

    return stage;
  }

}
