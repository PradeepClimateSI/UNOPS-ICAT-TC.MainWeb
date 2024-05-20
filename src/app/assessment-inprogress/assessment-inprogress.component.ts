import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { GuidanceVideoComponent } from 'app/guidance-video/guidance-video.component';
import { MasterDataService } from 'app/shared/master-data.service';
import { ConfirmationService, LazyLoadEvent, MessageService } from 'primeng/api';
import { DialogService } from 'primeng/dynamicdialog';
import { AppService } from 'shared/AppService';
import { Assessment, AssessmentControllerServiceProxy, User, UsersControllerServiceProxy } from 'shared/service-proxies/service-proxies';

@Component({
  selector: 'app-assessment-inprogress',
  templateUrl: './assessment-inprogress.component.html',
  styleUrls: ['./assessment-inprogress.component.css']
})
export class AssessmentInprogressComponent implements OnInit {


  loading: boolean = true ;
  totalRecords: number = 0;
  rows: number = 10;
  last: number;
  searchBy: any = {
    text: null,
    sector: null,
    status: null,
    mitigationAction: null,
    editedOn: null,
  };

  assessments: Assessment[];
  loggedUser: User

  constructor(
    private router: Router,
    private assessmentProxy: AssessmentControllerServiceProxy,
    public masterDataService: MasterDataService,
    protected dialogService: DialogService,
    private appService: AppService,
    private usersControllerServiceProxy: UsersControllerServiceProxy,
    private messageService: MessageService,
    private confirmationService: ConfirmationService,
  ) { }


  async ngOnInit(): Promise<void> { 
    let loginProfileId = this.appService.getProfileId()
    if (loginProfileId) {
      let user = await this.usersControllerServiceProxy.getUserLoginProfile(loginProfileId).toPromise()
      if (user) this.loggedUser = user
    }
    let event: any = {};
    event.rows = this.rows;
    event.first = 0;

    this.loadgridData(event);
  }

  watchVideo(){
    let ref = this.dialogService.open(GuidanceVideoComponent, {
      header: 'Guidance Video',
      width: '60%',
      contentStyle: {"overflow": "auto"},
      baseZIndex: 10000,
      data: {
        sourceName: 'assessmentInprogreass',
      },
    });

    ref.onClose.subscribe(() => {
      
    })
  }

  loadgridData = (event: LazyLoadEvent) => {
   
    let filterText = this.searchBy.text ? this.searchBy.text : '';
    let pageNumber = event.first === 0 || event.first === undefined ? 1 : (event.first / (event.rows === undefined ? 10 : event.rows)) + 1;
    this.rows = event.rows === undefined ? 10 : event.rows;
    this.assessmentProxy.assessmentInprogress(pageNumber,this.rows,filterText).subscribe(res => {
        this.assessments=res[1];
        this.totalRecords= res[0];
        this.loading = false
      })
      this.loading = false
  }
   setName(item:any){
    let name:string ='';
    if(item?.climateAction?.policySector.length>0){
      for(let data of item?.climateAction?.policySector){
        name =name + data.sector.name +", ";
      }
    }   
    return name.slice(0,-2);
  }

  onSearch() {

    let event: any = {};
    event.rows = this.rows;
    event.first = 0;

    this.loadgridData(event);
  }

  detail(assessment: Assessment, isContinue: boolean) {
    if (assessment.tool =="CARBON_MARKET"){
      this.router.navigate(['app/carbon-market-tool-edit'], {  
      queryParams: { id: assessment.id,isEdit:assessment.isDraft, isContinue: isContinue},  
      });
    }
    if (assessment.tool =="PORTFOLIO"){
      this.router.navigate(['app/portfolio-tool'], {  
      queryParams: { id: assessment.id,isEdit:assessment.isDraft, isContinue: isContinue},  
      });
    }

    if (assessment.tool =="INVESTOR"){
      this.router.navigate(['app/investor-tool-new'], {  
      queryParams: { id: assessment.id,isEdit:assessment.isDraft, isContinue: isContinue},  
      });
    }
    

  }

  async deleteAssessment(id: number, tool: string) {
    this.confirmationService.confirm({
      message: 'Are you sure you want to delete the assessment?',
      accept: () => {
        this.assessmentProxy.deleteAssessment(id, tool).subscribe(res => {
          if (res) {
            setTimeout(() => {
              this.messageService.add({
                severity: 'success',
                summary: 'Success',
                detail: 'Assessment deleted successfully',
                closable: true,
              })
            }, 1000);
            
            this.loadgridData({})
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

}
