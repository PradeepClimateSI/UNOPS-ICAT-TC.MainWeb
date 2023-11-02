import { Component, OnInit } from '@angular/core';
import { MasterDataService } from 'app/shared/master-data.service';
import { environment } from 'environments/environment';
import { MessageService } from 'primeng/api';
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
 reportTypes=['Result','Comparison']
 selectedReportTypes:string='';
 tools=['Investment','Other Interventions']
 selectedTool:string='';
  selectedClimateAction: ClimateAction
  selectedAssessment: Assessment
  selectedAssessmentType: any
  assessments: Assessment[] = []
  pdfFiles: any;
  SERVER_URL = environment.baseUrlAPI;

  constructor(
    private projectControllerServiceProxy: ProjectControllerServiceProxy,
    private methodologyAssessmentControllerServiceProxy: MethodologyAssessmentControllerServiceProxy,
    private reportControllerServiceProxy: ReportControllerServiceProxy,
    private masterDataService: MasterDataService,
    private messageService: MessageService
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
    console.log(e)
    this.selectedTool='';
    this.searchBy.climateAction = e.value
    this.filterReportData()
  }

  onSelectType(e: any){
    this.selectedReportTypes=this.selectedReportTypes||''
   this.selectedTool='';
   this.searchBy.climateAction =''
   console.log(this.selectedReportTypes)
   this.filterReportData()
  }

  onSelectTool(e: any){
    console.log(this.selectedTool)
    this.filterReportData()
   }
  generate(){
    this.display = true;
  }

  onSearch(){
    this.filterReportData()
  }

  confirm(){
    console.log("confirm")
    let body = new CreateReportDto()
    body.assessmentId = this.selectedAssessment.id
    body.climateAction = this.selectedClimateAction
    body.reportName = this.reportName
    this.reportControllerServiceProxy.generateReport(body).subscribe(res => {
      console.log("generated repotr", res)
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
    console.log("this.searchBy", this.searchBy);
    let climateAction = this.searchBy.climateAction ? this.searchBy.climateAction.policyName.toString() : "";
    let reportName = this.searchBy.text ? this.searchBy.text : "";
    console.log(climateAction)

    this.reportControllerServiceProxy.getReportData(climateAction, reportName,this.selectedReportTypes,this.selectedTool).subscribe(res => {
      this.pdfFiles = res
      console.log('pdfFiles',res)
    })


  }

  view(url: string){
    window.open(this.SERVER_URL +"/"+ url, "_blank");
  }

}
