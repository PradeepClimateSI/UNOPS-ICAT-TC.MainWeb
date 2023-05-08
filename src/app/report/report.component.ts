import { Component, OnInit } from '@angular/core';
import { MasterDataService } from 'app/shared/master-data.service';
import { environment } from 'environments/environment';
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
  display: true
  allSelect: true
  reportName: string;
  assessmentTypes: any[]

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
    private masterDataService: MasterDataService
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

  onCAChange(e: any){}

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
      console.log(res)
    })
  }

  filterReportData() {
    console.log("this.searchBy", this.searchBy);
    let climateAction = this.searchBy.ca ? this.searchBy.ca.policyName.toString() : "";
    let reportName = this.searchBy.text ? this.searchBy.text : "";

    this.reportControllerServiceProxy.getReportData(climateAction, reportName).subscribe(res => {
      this.pdfFiles = res
    })


  }

  view(url: string){
    window.open(this.SERVER_URL +"/"+ url, "_blank");
  }

}
