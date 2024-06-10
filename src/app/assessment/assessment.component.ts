import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { GuidanceVideoComponent } from 'app/guidance-video/guidance-video.component';
import { MasterDataService } from 'app/shared/master-data.service';
import { ConfirmationService, LazyLoadEvent, MessageService } from 'primeng/api';
import { DialogService } from 'primeng/dynamicdialog';
import { Table } from 'primeng/table';
import { AppService } from 'shared/AppService';
import { Assessment, AssessmentControllerServiceProxy, MethodologyAssessmentControllerServiceProxy, User, UsersControllerServiceProxy } from 'shared/service-proxies/service-proxies';

@Component({
  selector: 'app-assessment',
  templateUrl: './assessment.component.html',
  styleUrls: ['./assessment.component.css']
})
export class AssessmentComponent implements OnInit {

  resultsList: any = []
  assessmentData: any = []

  results: AssessmentResultDataDto[] = []
  data2: any
  loading: boolean;
  totalRecords: number
  load: boolean = false
  loggedUser: User

  dt2: Table
  rows: number = 10;
  filterText: any = '';
  constructor(
    private methassess: MethodologyAssessmentControllerServiceProxy,
    private router: Router,
    private activatedRoute: ActivatedRoute,
    public masterDataService: MasterDataService,
    protected dialogService: DialogService,
    public assessmentServiceControllerProxy: AssessmentControllerServiceProxy,
    private messageService: MessageService,
    private confirmationService: ConfirmationService,
    private appService: AppService,
    private usersControllerServiceProxy: UsersControllerServiceProxy
  ) { }




  async ngOnInit() {
    this.loading = true;
    let loginProfileId = this.appService.getProfileId()
    if (loginProfileId) {
      let user = await this.usersControllerServiceProxy.getUserLoginProfile(loginProfileId).toPromise()
      if (user) this.loggedUser = user
    }

    await this.loadData({})

  }


  clear(table: Table) {
    table.clear();
  }

  watchVideo(){
    let ref = this.dialogService.open(GuidanceVideoComponent, {
      header: 'Guidance Video',
      width: '60%',
      contentStyle: {"overflow": "auto"},
      baseZIndex: 10000,
      data: {
        sourceName: 'Assessmentresults',
      },
    });

    ref.onClose.subscribe(() => {
      
    })
  }
  
  onInput(event: any, dt: any) {
    this.filterText = event.target.value;
    this.loadData({})
  }

  async loadData(event: LazyLoadEvent) {
    this.totalRecords = 0;

    let pageNumber = (event.first === 0 || event.first == undefined) ? 0 : event.first / (event.rows == undefined ? 1 : event.rows) + 1;
    this.rows = event.rows == undefined ? 10 : event.rows;

    let skip = pageNumber * this.rows;
    let res = await this.methassess.getResultPageData(skip, this.rows, this.filterText, '', '', event.sortField ? event.sortField : '', event.sortOrder === 1 ? 'ASC' : 'DESC').toPromise();

    this.results = []
    for await (let r of res[0]) {
      let _res = new AssessmentResultDataDto();
      _res.intervention = r.assessment.climateAction.policyName
      _res.assessment_type = r.assessment.assessmentType
      _res.tool = this.masterDataService.getToolName(r.assessment.tool)
      _res.assessment_tool = r.assessment.tool
      _res.created_date = r.assessment.createdOn
      _res.assessment_id = r.assessment.id
      _res.averageProcess = r.averageProcess
      _res.averageOutcome = r.averageOutcome
      _res.assessment_method = r.assessment.assessment_method
      _res.assessment = r.assessment
      _res.user_id = r.assessment.user.id
      this.results.push(_res)
    }

    this.totalRecords = res[1];
   
    if (this.results){
      this.load = true
      this.loading = false
    }
  }



  viewResult(assessId: any, averageProcess: any, averageOutcome: any, tool: string, assessment_method: string) {

    if (tool === 'INVESTOR' || (tool === 'PORTFOLIO' && assessment_method === 'Track 4')) {
      this.router.navigate(['/app/assessment-result-investor', assessId], {
        queryParams: {
          assessmentId: assessId
        },
        relativeTo: this.activatedRoute
      });
    } else if (tool === 'CARBON_MARKET') {
      this.router.navigate(['../carbon-market-tool-result'], {
        queryParams: {
          id: assessId
        },
        relativeTo: this.activatedRoute
      });
    } else {
      this.router.navigate(['/app/assessment-result', assessId], {
        queryParams: {
          assessmentId: assessId,
          averageProcess: averageProcess,
          averageOutcome: averageOutcome
        }
      });
    }
  }

  async deleteAssessment(id: number, tool: string) {
    this.confirmationService.confirm({
      message: 'Are you sure you want to delete the assessment?',
      key: 'delete',
      accept: () => {
        this.assessmentServiceControllerProxy.deleteAssessment(id, tool).subscribe(res => {
          if (res) {
            this.messageService.add({
              severity: 'success',
              summary: 'Success',
              detail: 'Assessment deleted successfully',
              closable: true,
            })
            this.loadData({})
          } else {
            this.messageService.add({
              severity: 'error',
              summary: 'Error',
              detail: 'Failed to delete assessment',
              closable: true,
            })
          }
        })
      }
    })
  }

  editAssessment(assessment: Assessment) {
    if(assessment.tool =="CARBON_MARKET"){
      this.router.navigate(['app/carbon-market-tool-edit'], {  
      queryParams: { id: assessment.id, isEdit: true,iscompleted:true},  
      });
    }
    if(assessment.tool =="PORTFOLIO"){
      this.router.navigate(['app/general-tool'], {  
      queryParams: { id: assessment.id, isEdit: true, iscompleted:true},  
      });
    }

    if(assessment.tool =="INVESTOR"){
      this.router.navigate(['app/investment-tool'], {  
      queryParams: { id: assessment.id, isEdit: true, iscompleted:true},  
      });
    }
    

  }


}

export class AssessmentResultDataDto {
  assessment_id: number
  averageProcess: number
  averageOutcome: number
  intervention: string
  assessment_type: string
  tool: string
  assessment_tool: string
  created_date: Date
  assessment_method: string
  assessment: Assessment
  user_id: number
}


