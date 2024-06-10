import { Component, OnInit } from '@angular/core';
import { GuidanceVideoComponent } from 'app/guidance-video/guidance-video.component';
import { MasterDataService } from 'app/shared/master-data.service';
import { environment } from 'environments/environment';
import { MessageService } from 'primeng/api';
import { DialogService } from 'primeng/dynamicdialog';
import { Assessment, ClimateAction, CreateReportDto, MethodologyAssessmentControllerServiceProxy, ProjectControllerServiceProxy, ReportControllerServiceProxy } from 'shared/service-proxies/service-proxies';

@Component({
  selector: 'app-report',
  templateUrl: './report.component.html',
  styleUrls: ['./report.component.css']
})
export class ReportComponent implements OnInit {

  searchBy: any = {
    climateAction: null,
    text: null,
  };

  climateActions: any[]
  display:boolean 
  allSelect: boolean
  reportName: string;
  assessmentTypes: any[]
 reportTypes=['Assessment reports','Portfolio reports']
 selectedReportTypes:string='';
 tools=['Investment','General','Carbon market']
 selectedTool:string='';
  selectedClimateAction: ClimateAction
  selectedAssessment: Assessment
  selectedAssessmentType: any
  assessments: Assessment[] = []
  pdfFiles: any;
  SERVER_URL = environment.baseUrlAPI;
  DOWNLOAD_BY_NAMA_URL = environment.baseUrlAPI + "/document/downloadDocumentsFromFileName";

  constructor(
    private projectControllerServiceProxy: ProjectControllerServiceProxy,
    private methodologyAssessmentControllerServiceProxy: MethodologyAssessmentControllerServiceProxy,
    private reportControllerServiceProxy: ReportControllerServiceProxy,
    private masterDataService: MasterDataService,
    private messageService: MessageService,
    protected dialogService: DialogService,
  ) { }

  async ngOnInit(): Promise<void> {
    this.assessmentTypes = this.masterDataService.assessment_type
    await this.loadClimateActions()
    this.filterReportData()
  }

  async loadClimateActions(){
    this.climateActions = await this.projectControllerServiceProxy.findAllPolicies().toPromise()
  }

  async loadAssessmnets(e: any) {
    this.assessments = await this.methodologyAssessmentControllerServiceProxy.getAssessmentByClimateAction(this.selectedClimateAction.id).toPromise()
  } 

  onCAChange(e: any){
    this.selectedTool='';
    this.searchBy.climateAction = e.value
    this.filterReportData()
  }

  onSelectType(e: any){
    this.selectedReportTypes=this.selectedReportTypes||''
   this.selectedTool='';
   this.searchBy.climateAction =''
   this.filterReportData();
  }

  watchVideo(){
    let ref = this.dialogService.open(GuidanceVideoComponent, {
      header: 'Guidance Video',
      width: '60%',
      contentStyle: {"overflow": "auto"},
      baseZIndex: 10000,
      data: {
        sourceName: 'Reports',
      },
    });

    ref.onClose.subscribe(() => {
      
    })
  }

  onSelectTool(e: any){
    this.filterReportData()
   }
  generate(){
    this.display = true;
  }

  onSearch(){
    this.filterReportData()
  }

  confirm(){
    let body = new CreateReportDto()
    body.assessmentId = this.selectedAssessment.id
    body.climateAction = this.selectedClimateAction
    body.reportName = this.reportName
    this.reportControllerServiceProxy.generateReport(body).subscribe(res => {
      if (res) {
        this.messageService.add({
          severity: 'success',
          summary: 'Success',
          detail: 'Report generated successfully',
          closable: true,
        })
        this.display = false
        this.filterReportData()
      }
    }, error => {
      this.messageService.add({
        severity: 'error',
        summary: 'Error',
        detail: 'Failed to generate report',
        closable: true,
      })
    })
  }

  filterReportData() {
    let climateAction = this.searchBy.climateAction ? this.searchBy.climateAction.policyName.toString() : "";
    let reportName = this.searchBy.text ? this.searchBy.text : "";
    let reportType = this.mapReportType(this.selectedReportTypes)

    this.reportControllerServiceProxy.getReportData(climateAction, reportName,reportType,this.mapReportTool(this.selectedTool)).subscribe(res => {
      this.pdfFiles = res;
    })


  }

  view(path: string){
    window.open(this.DOWNLOAD_BY_NAMA_URL +"/"+ path, "_blank");
  }
  mapReportType(type: string ) : string {
    let returnType = ''

    if(type == 'Assessment reports'){
      returnType = 'Result'
    }
    else if(type == 'Portfolio reports'){
      returnType = 'Comparison'
    }
    else{
      returnType = ''
    }
    return returnType
  }

  mapReportTool(type: string ) : string {
    let returnType = ''

    if(type == 'Investment'){
      returnType = 'Investment tool'
    }
    else if(type == 'General'){
      returnType = 'General tool'
    }
    else if(type == 'Carbon market'){
      returnType = 'Carbon market tool'
    }
    else{
      returnType = ''
    }
    return returnType
  }


}
