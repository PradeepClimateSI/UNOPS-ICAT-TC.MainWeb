import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { VerificationStatus } from 'app/Model/VerificationStatus.enum';
import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';
import * as moment from 'moment';
import { MessageService } from 'primeng/api';
import { Assessment, AssessmentControllerServiceProxy, ServiceProxy, UpdateAssessmentDto, VerificationControllerServiceProxy, VerificationDetail } from 'shared/service-proxies/service-proxies';

@Component({
  selector: 'app-nonconformance-report',
  templateUrl: './nonconformance-report.component.html',
  styleUrls: ['./nonconformance-report.component.css']
})
export class NonconformanceReportComponent implements OnInit {

  
  c = {name: 'ovindu',age:'25'};

  assmentYearList:any;
  
  assessment: Assessment;
  assessments : Assessment[] = [];
  verificationList :VerificationDetail[] = [];
  verificationList2 :VerificationDetail[] = [];

  roundOneList:VerificationDetail[] = [];
  roundTwoList:VerificationDetail[] = [];
  roundThreeList:VerificationDetail[] = [];

  roundOnendcList:any;
  roundOnemethodologyList:any;
  roundOneprojectList:any;
  roundOneprojectionList:any;
  roundOnelekageList:any;
  roundOnebaseleineList:any;
  roundOneAssumptionList:any;

  roundTwondcList:any;
  roundTwomethodologyList:any;
  roundTwoprojectList:any;
  roundTwoprojectionList:any;
  roundTwolekageList:any;
  roundTwobaseleineList:any;
  roundTwoAssumptionList:any;

  roundThreendcList:any;
  roundThreemethodologyList:any;
  roundThreeprojectList:any;
  roundThreeprojectionList:any;
  roundThreelekageList:any;
  roundThreebaseleineList:any;
  roundThreeAssumptionList:any;

  roundOneHeadTable:any;
  roundTwoHeadTable:any;
  roundThreeHeadTable:any;

  ndcList :any;
  methodologyList:any;
  projectList:any;
  projectionList:any;
  lekageList:any;
  baseleineList:any;
  mydate:any = '2022-02-29';
  dateGenerated:any;
  assumptionList:any;

  recievdAssementYear:any;
  assessmentId:any;
  flag:string;
  isVerificationHistory:number;

  roundOneVerifier:any;
  roundTwoVerifier:any;
  roundThreeVerifier:any;
  vStatus:number;
  VerificationStatusEnum = VerificationStatus;

  verificationStatus: string[] = [
   
    VerificationStatus[VerificationStatus['Pre Assessment']],
    VerificationStatus[VerificationStatus['Initial Assessment']],
    VerificationStatus[VerificationStatus['Final Assessment']],

  ];
 
  
  constructor(
    private serviceProxy: ServiceProxy,
    private cdr: ChangeDetectorRef,
    private route: ActivatedRoute,
    private router: Router,
    private messageService :MessageService,
    private assessmentControllerServiceProxy: AssessmentControllerServiceProxy,
    private verificationControllerServiceProxy: VerificationControllerServiceProxy
    
  ) { }

  ngAfterViewInit(): void {
    this.cdr.detectChanges();
  }

  ngOnInit(): void {


    this.route.queryParams.subscribe(async (params) => {
      this.assessmentId = params['id'];
      this.flag = params['flag'];
      this.isVerificationHistory = params['isVerificationHistory'];
      this.vStatus = params['vStatus'];
      console.log("this.flag..,,",params)

      this.assessment =  await this.assessmentControllerServiceProxy.findOne(this.assessmentId).toPromise()

      this.verificationList = await this.verificationControllerServiceProxy.getVerificationDetails(this.assessment.id).toPromise()

      this.roundOneList = this.verificationList.filter((o: any)=>o.verificationStage == 1 && o.isAccepted == 0);
      this.roundTwoList= this.verificationList.filter((o: any)=>o.verificationStage == 2 && o.isAccepted == 0);
      this.roundThreeList= this.verificationList.filter((o: any)=>o.verificationStage == 3 && o.isAccepted == 0);

      console.log("roundOneList", this.roundOneList)

      this.roundOneHeadTable = this.verificationList?.find((o: any)=>o.verificationStage == 1);
      if (this.roundOneHeadTable != null) {
        let verifierId = this.roundOneHeadTable.userVerifier;

        this.serviceProxy.
          getOneBaseUsersControllerUser(
            verifierId,
            undefined,
            undefined,
            undefined,
          ).subscribe((res: any) => {
            this.roundOneVerifier = res;
          });
      }

      this.roundTwoHeadTable = this.verificationList?.find((o: any) => o.verificationStage == 2);
      if (this.roundTwoHeadTable != null) {
        let verifierId = this.roundTwoHeadTable.userVerifier;

        this.serviceProxy.
          getOneBaseUsersControllerUser(
            verifierId,
            undefined,
            undefined,
            undefined,

          ).subscribe((res: any) => {
            this.roundTwoVerifier = res;
          });
      }

      this.roundThreeHeadTable = this.verificationList?.find((o: any) => o.verificationStage == 3);
      if (this.roundThreeHeadTable != null) {
        let verifierId = this.roundThreeHeadTable.userVerifier;

        this.serviceProxy.
          getOneBaseUsersControllerUser(
            verifierId,
            undefined,
            undefined,
            undefined,

          ).subscribe((res: any) => {
            this.roundThreeVerifier = res;
          });
      }
    });
  }

  toPopUp(item: any) {
    //console.log("click");
  }

  toDownload() {

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

  toChangeStatus() {
    if (this.flag == 'sec-admin') {
      this.assessment.verificationStatus = 2;
      this.assessment.editedOn = moment();

      if (this.roundOneHeadTable != undefined) {
        this.assessment.verificationStatus = 4;
      }

      if (this.roundTwoHeadTable != undefined) {
        this.assessment.verificationStatus = 5;
      }

      let dto = new UpdateAssessmentDto()
      dto.editedOn = this.assessment.editedOn
      dto.verificationStatus = this.assessment.verificationStatus
      

      this.assessmentControllerServiceProxy.update(this.assessmentId, dto)
        .subscribe(res => {
          this.messageService.add({ severity: 'success', summary: 'Success', detail: 'successfully updated !!' });
        })
    }
    else {
      // need to get relevent assse year row
      this.assessment.verificationStatus = 1; //Nc REcieved
      this.assessment.editedOn = moment();

      // then update the object
      // then need to send the updte crud
      if (this.roundOneHeadTable != undefined) {
        if (this.roundOneList.length != 0) {
          this.assessment.verificationStatus = 3; //Nc REcieved
        }
        else {
          this.assessment.verificationStatus = 7;
        }
      }

      if (this.roundTwoHeadTable != undefined) {
        if (this.roundTwoList.length != 0) {
          this.assessment.verificationStatus = 3; //Nc REcieved
        }
        else {
          this.assessment.verificationStatus = 7;
        }
      }

      if (this.roundThreeHeadTable != undefined) {
        if (this.roundThreeList.length != 0) {
          this.assessment.verificationStatus = 6; //Nc REcieved
        }
        else {
          this.assessment.verificationStatus = 7;
        }
      }
      let dto = new UpdateAssessmentDto()
      dto.editedOn = this.assessment.editedOn
      dto.verificationStatus = this.assessment.verificationStatus
      

      this.assessmentControllerServiceProxy.update(this.assessmentId, dto)
        .subscribe(res => {
          this.messageService.add({ severity: 'success', summary: 'Success', detail: 'successfully updated !!' });
        })

    }

  }

  toDetailPage() {

    if (this.flag == "sec-admin") {
      this.router.navigate(['/verification-sector-admin/detail'], {
        queryParams: {
          id: this.assessment.id,
          // verificationStatus: object.verificationStatus,
        },
      });

    }
    else {
      this.router.navigate(['/app/verification/detail'], {
        queryParams: {
          id: this.assessment.id,
          verificationStatus: this.assessment.verificationStatus,
        },
      });

    }


  }

  back(){
    this.router.navigate(['/app/verification/detail'], {
      queryParams: {
        id: this.assessment.id,
        verificationStatus: this.assessment.verificationStatus,
      },
    });
  }

}
