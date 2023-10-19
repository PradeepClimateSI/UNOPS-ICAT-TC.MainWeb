import { HttpClientModule, HTTP_INTERCEPTORS } from "@angular/common/http";
import { NgModule } from "@angular/core";
import { FormsModule } from "@angular/forms";
import { BrowserModule } from "@angular/platform-browser";
import { environment } from "environments/environment";
import { ButtonModule } from "primeng/button";
import { DropdownModule } from "primeng/dropdown";
import { StyleClassModule } from "primeng/styleclass";
// import { AppRoutingModule } from "./app-routing.module";
import { AppComponent } from "./app.component";
import { ChartComponent } from "./chart/chart.component";
import { ClimateActionComponent } from "./climate-action/climate-action/climate-action.component";
import { ViewComponent } from "./climate-action/view/view.component";
import { DashboardBaseComponent } from "./dashboard-base/dashboard-base.component";
import { InstitutionComponent } from "./institution/add-institution/institution.component";
import { EditInstitutionComponent } from "./institution/edit-institution/edit-institution.component";
import { InstitutionListComponent } from "./institution/institution-list/institution-list.component";
import { ViewInstitutionComponent } from "./institution/view-institution/view-institution.component";
import { MethodologyComponent } from "./methodology/methodology.component";
import { DocumentUploadComponent } from "./shared/document-upload/document-upload.component";
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { ToastModule } from 'primeng/toast';
import { RadioButtonModule } from 'primeng/radiobutton';
import { ToggleButtonModule } from 'primeng/togglebutton';
import { SplitButtonModule } from 'primeng/splitbutton';
import { SelectButtonModule } from 'primeng/selectbutton';
import { AutoCompleteModule } from 'primeng/autocomplete';
import { StepsModule } from 'primeng/steps';
import { CheckboxModule } from 'primeng/checkbox';
import { CalendarModule } from 'primeng/calendar';
import { DialogModule } from 'primeng/dialog';
import { ListboxModule } from 'primeng/listbox';
import { TableModule } from 'primeng/table';
import { InputNumberModule } from 'primeng/inputnumber';
import { InputMaskModule } from 'primeng/inputmask';
import { TabViewModule } from 'primeng/tabview';
import { AccordionModule } from 'primeng/accordion';
import { CardModule } from 'primeng/card';
import { SliderModule } from 'primeng/slider';
import { TooltipModule } from 'primeng/tooltip';
import { ProgressBarModule } from 'primeng/progressbar';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { ChartModule } from 'primeng/chart';
import { TreeModule } from 'primeng/tree';
import { ProgressSpinnerModule } from 'primeng/progressspinner';
import { OverlayPanelModule } from 'primeng/overlaypanel';
import { MessagesModule } from 'primeng/messages';
import {
  NbThemeModule,
  NbLayoutModule,
} from '@nebular/theme';
import { DynamicDialogModule } from 'primeng/dynamicdialog';
import { NbEvaIconsModule } from '@nebular/eva-icons';
//import { GMapModule } from 'primeng/gmap';
import { PaginatorModule } from 'primeng/paginator';
import { CarouselModule } from 'primeng/carousel';
import { DashboardModule } from './dashboard/dashboard.module';
import { FileUploadModule } from 'primeng/fileupload';
import { ConfirmationService } from "primeng/api";
// import { API_BASE_URL, AssessmentCMDetailControllerServiceProxy, AssessmentControllerServiceProxy, AuthControllerServiceProxy, CMAssessmentQuestionControllerServiceProxy, CMQuestionControllerServiceProxy, CountryControllerServiceProxy, DocumentControllerServiceProxy, InstitutionControllerServiceProxy, MethodologyAssessmentControllerServiceProxy, NdcControllerServiceProxy, ParameterHistoryControllerServiceProxy, ParameterRequestControllerServiceProxy, ProjectControllerServiceProxy, QualityCheckControllerServiceProxy, SectorControllerServiceProxy, ServiceProxy, UserTypeControllerServiceProxy, VerificationControllerServiceProxy } from "shared/service-proxies/service-proxies";
import { API_BASE_URL, AssessmentCMDetailControllerServiceProxy, AssessmentControllerServiceProxy, AuthControllerServiceProxy, CMAssessmentQuestionControllerServiceProxy, CMQuestionControllerServiceProxy, CountryControllerServiceProxy, DocumentControllerServiceProxy, InstitutionControllerServiceProxy, MethodologyAssessmentControllerServiceProxy, NdcControllerServiceProxy, ParameterHistoryControllerServiceProxy, ParameterRequestControllerServiceProxy, ProjectControllerServiceProxy, QualityCheckControllerServiceProxy, SectorControllerServiceProxy, ServiceProxy, UserTypeControllerServiceProxy, VerificationControllerServiceProxy, ReportControllerServiceProxy, NotificationControllerServiceProxy, InvestorToolControllerServiceProxy, PortfolioControllerServiceProxy } from "shared/service-proxies/service-proxies";
// import { API_BASE_URL, AssessmentCMDetailControllerServiceProxy, AssessmentControllerServiceProxy, AuthControllerServiceProxy, CMAssessmentQuestionControllerServiceProxy, CMQuestionControllerServiceProxy, CountryControllerServiceProxy, DocumentControllerServiceProxy, InstitutionControllerServiceProxy, MethodologyAssessmentControllerServiceProxy, NdcControllerServiceProxy, ParameterHistoryControllerServiceProxy, ParameterRequestControllerServiceProxy, ProjectControllerServiceProxy, QualityCheckControllerServiceProxy, ReportControllerServiceProxy, SectorControllerServiceProxy, ServiceProxy, UserTypeControllerServiceProxy, VerificationControllerServiceProxy } from "shared/service-proxies/service-proxies";
import { AUTH_API_BASE_URL, ServiceProxy as AuthServiceProxy, } from 'shared/service-proxies/auth-service-proxies';
import { BadgeModule } from 'primeng/badge';
import { RoleGuardService } from "./auth/role-guard.service";
import { DatePipe } from "@angular/common";
import { AuthInterceptor } from "./auth/auth.interceptor";
import { AuthGuard } from "./auth/auth.guard";
import { ErrorInterceptor } from "./auth/error.interceptor";
import { FlexLayoutModule } from "@angular/flex-layout";
import { RippleModule } from "primeng/ripple";
import { InputTextModule } from "primeng/inputtext";
import { AppRoutingModule } from "./app-routing.module";
import { UserModule } from "./user/user.module";
import { MultiSelectModule } from 'primeng/multiselect';
import { DataRequestComponent } from './data-request-flow/data-request/data-request.component';
import { AssignDataRequestComponent } from './data-request-flow/assign-data-request/assign-data-request.component';
import { ViewDatarequestHistoryComponent } from './component/view-datarequest-history/view-datarequest-history.component';
import { EnterDataComponent } from './data-request-flow/enter-data/enter-data.component';
import { ReviewDataComponent } from './data-request-flow/review-data/review-data.component';
import { PortfolioComponent } from "./Tool/portfolio/portfolio.component";
import { InvestorComponent } from "./Tool/investor/investor.component";
import { CarbonComponent } from "./Tool/carbon/carbon.component";
import { AssessmentResultComponent } from './assessment-result/assessment-result.component';
import { ManagedatastatusComponent } from './data-request-flow/managedatastatus/managedatastatus.component';
import { VerificationListComponent } from './verification/verifier/verification-list/verification-list.component';
import { ApproveDataComponent } from './data-request-flow/approve-data/approve-data.component';
import { QualityCheckComponent } from './quality-check/quality-check.component';
import { AssessmentComponent } from './assessment/assessment.component';
import { VerificationDetailComponent } from './verification/verifier/verification-detail/verification-detail.component';
import { VerifyParameterComponent } from './verification/verifier/verify-parameter/verify-parameter.component';
import { QualityCheckDetailComponent } from './quality-check-detail/quality-check-detail.component';
import { AssessmentResultTrack2Component } from './assessment-result-track2/assessment-result-track2.component';
import { AcceptedPoliciesComponent } from './climate-action/accepted-policies/accepted-policies.component';
import { RaiseConcernComponent } from './component/raise-concern/raise-concern.component';
import { RaiseConcernSectionComponent } from './component/raise-concern-section/raise-concern-section.component';
import { NonconformanceReportComponent } from './nonconformance-report/nonconformance-report.component';
import { InvestorToolComponent } from './Tool/investor-tool/investor-tool.component';
import { AssignVerifierComponent } from './data-request-flow/assign-verifier/assign-verifier.component';
import { CarbonMarketAssessmentComponent } from './Tool/carbon-market/carbon-market-assessment/carbon-market-assessment.component';
import { CmSectionComponent } from './Tool/carbon-market/cm-section/cm-section.component';
import { CmQuestionComponent } from './Tool/carbon-market/cm-question/cm-question.component';
import { CmResultComponent } from './Tool/carbon-market/cm-result/cm-result.component';
import { AuditComponent } from "./audit/audit.component";
import { API_BASE_AUDIT, AuditControllerServiceProxy } from "shared/service-proxies-auditlog/service-proxies";
import { ReportComponent } from './report/report.component';
import { AssessmentResultInvestorComponent } from './assessment-result-investor/assessment-result-investor.component';
import { PortfolioTrack4Component } from './Tool/portfolio-track4/portfolio-track4.component';
import { InvestmentDashboardComponent } from './investment-dashboard/investment-dashboard.component';
import { PortfolioDashboardComponent } from './portfolio-dashboard/portfolio-dashboard.component';
import { CarbonMarketDashboardComponent } from './carbon-market-dashboard/carbon-market-dashboard.component';
import { DashboardComponent } from "./dashboard/dashboard.component";
import { PortfolioListComponent } from './portfolios/portfolio-list/portfolio-list.component';
import { PortfolioAddComponent } from './portfolios/portfolio-add/portfolio-add.component';
import { PortfolioResultComponent } from './portfolios/portfolio-result/portfolio-result.component';
import { EnterDataCmComponent } from './data-request-flow/enter-data-path/enter-data-cm/enter-data-cm.component';
import { EnterDataInvestmentComponent } from "./data-request-flow/enter-data-path/enter-data-investment/enter-data-investment.component";
import { EnterDataPathComponent } from './data-request-flow/enter-data-path/enter-data-path/enter-data-path.component';
import { ReviewDataCmComponent } from './data-request-flow/review-data-path/review-data-cm/review-data-cm.component';
import { ReviewDataInvestmentComponent } from './data-request-flow/review-data-path/review-data-investment/review-data-investment.component';
import { ReviewDataPathComponent } from './data-request-flow/review-data-path/review-data-path/review-data-path.component';
import { CmSectionThreeComponent } from './Tool/carbon-market/cm-section-three/cm-section-three.component';
import { DataRequestPathService } from "./shared/data-request-path.service";
import { PortfolioProcessDataComponent } from "./portfolios/portfolio-process-data/portfolio-process-data.component";
import { PortfolioOutcomeDataComponent } from './portfolios/portfolio-outcome-data/portfolio-outcome-data.component';
import { PortfolioAggregationComponent } from './portfolios/portfolio-aggregation/portfolio-aggregation.component';
import { PortfolioComparisonComponent } from './portfolios/portfolio-comparison/portfolio-comparison.component';
import { HeatMapComponent } from './charts/heat-map/heat-map.component';
import { AllTooDashbordComponent } from './dashboard/all-too-dashbord/all-too-dashbord.component';
import { PortfolioAlignmentComponent } from './portfolios/portfolio-alignment/portfolio-alignment.component';
import { SdgPriorityComponent } from './sdg-priority/sdg-priority.component';
import { AssessmentInprogressComponent } from './assessment-inprogress/assessment-inprogress.component';




export function getRemoteServiceBaseUrl(): string {
  return environment.baseUrlAPI;
}
export function getRemoteServiceESBaseUrl(): string {
  return environment.esbaseUrlAPI;
}
export function getAuthRemoteServiceBaseUrl(): string {
  return environment.authBaseUrlAPI;
}
export function getAuditRemoteServiceBaseUrl(): string {
  return environment.baseUrlAuditlog;
}



@NgModule({
  declarations: [
    AppComponent,
    DashboardBaseComponent,
    PortfolioTrack4Component,
    ClimateActionComponent,
    ViewComponent,
    DocumentUploadComponent,
    InstitutionComponent,
    InstitutionListComponent,
    EditInstitutionComponent,
    ViewInstitutionComponent,
    MethodologyComponent,
    ChartComponent,
    DataRequestComponent,
    EnterDataComponent,
    AssignDataRequestComponent,
    ViewDatarequestHistoryComponent,
    ReviewDataComponent,
    PortfolioComponent,
    CarbonComponent,
    InvestorComponent,
    AssessmentResultComponent,
    ManagedatastatusComponent,
    VerificationListComponent,
    ApproveDataComponent,
    QualityCheckComponent,
    AssessmentComponent,
    VerificationDetailComponent,
    VerifyParameterComponent,
    QualityCheckDetailComponent,
    AssessmentResultTrack2Component,
    AcceptedPoliciesComponent,
    RaiseConcernComponent,
    RaiseConcernSectionComponent,
    NonconformanceReportComponent,
    AssignVerifierComponent,
    CarbonMarketAssessmentComponent,
    CmSectionComponent,
    CmQuestionComponent,
    CmResultComponent,
    AuditComponent,
    ReportComponent,
    InvestorToolComponent,
    AssessmentResultInvestorComponent,
    InvestmentDashboardComponent,
    PortfolioDashboardComponent,
    CarbonMarketDashboardComponent,
    DashboardComponent,
    PortfolioListComponent,
    PortfolioAddComponent,
    PortfolioResultComponent,
    EnterDataCmComponent,
    EnterDataInvestmentComponent,
    EnterDataPathComponent,
    ReviewDataCmComponent,
    ReviewDataInvestmentComponent,
    ReviewDataPathComponent,
    CmSectionThreeComponent,
    PortfolioProcessDataComponent,
    PortfolioOutcomeDataComponent,
    PortfolioAggregationComponent,
    PortfolioComparisonComponent,
    HeatMapComponent,
    AllTooDashbordComponent,
    PortfolioAlignmentComponent,
    SdgPriorityComponent,
    AssessmentInprogressComponent,

  ],


  imports: [
    BadgeModule,
    FormsModule,
    BrowserModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    HttpClientModule,
    StyleClassModule,
    MultiSelectModule,
    ToastModule,
    ButtonModule,
    DropdownModule,
    AutoCompleteModule,
    StepsModule,
    RadioButtonModule,
    CheckboxModule,
    CalendarModule,
    DialogModule,
    ListboxModule,
    TableModule,
    InputNumberModule,
    InputMaskModule,
    TabViewModule,
    AccordionModule,
    CardModule,
    SliderModule,
    ToggleButtonModule,
    SplitButtonModule,
    SelectButtonModule,
    TooltipModule,
    ProgressBarModule,
    ConfirmDialogModule,
  //  GMapModule,
    ChartModule,
    ProgressSpinnerModule,
    OverlayPanelModule,
    TreeModule,
    FlexLayoutModule,
    BrowserModule,
    BrowserAnimationsModule,
    MessagesModule,
    NbThemeModule.forRoot({ name: 'default' }),
    NbLayoutModule,
    NbEvaIconsModule,
    PaginatorModule,
    CarouselModule,
    DynamicDialogModule,
    RippleModule,
    InputTextModule,
    DialogModule,
    DashboardModule,
    FileUploadModule,
    OverlayPanelModule,
    // NgMultiSelectDropDownModule.forRoot(),
    UserModule,
  ],
  providers: [
    ConfirmationService,
    ServiceProxy,
    AuthServiceProxy,
    DocumentControllerServiceProxy,
    ConfirmationService,
    AuthControllerServiceProxy,
    ProjectControllerServiceProxy,
    CountryControllerServiceProxy,
    SectorControllerServiceProxy,
    NdcControllerServiceProxy,
    MethodologyAssessmentControllerServiceProxy,
    ParameterRequestControllerServiceProxy,
    ParameterHistoryControllerServiceProxy,
    UserTypeControllerServiceProxy,
    InstitutionControllerServiceProxy,
    AssessmentControllerServiceProxy,
    VerificationControllerServiceProxy,
    QualityCheckControllerServiceProxy,
    NotificationControllerServiceProxy,
    InvestorToolControllerServiceProxy,
    PortfolioControllerServiceProxy,


    DatePipe,
    { provide: API_BASE_URL, useFactory: getRemoteServiceBaseUrl },
    { provide: AUTH_API_BASE_URL, useFactory: getAuthRemoteServiceBaseUrl },
    { provide: API_BASE_AUDIT, useFactory: getAuditRemoteServiceBaseUrl },
    HttpClientModule,
    RoleGuardService,
    Location,
    DynamicDialogModule,
    { provide: HTTP_INTERCEPTORS, useClass: AuthInterceptor, multi: true },
    { provide: HTTP_INTERCEPTORS, useClass: ErrorInterceptor, multi: true },
    AuthGuard,
    CMQuestionControllerServiceProxy,
    CMAssessmentQuestionControllerServiceProxy,
    AssessmentCMDetailControllerServiceProxy,
    AuditControllerServiceProxy,
    ReportControllerServiceProxy,
    DataRequestPathService
  ],
  bootstrap: [AppComponent],
  exports: [
  ]
})
export class AppModule { }
