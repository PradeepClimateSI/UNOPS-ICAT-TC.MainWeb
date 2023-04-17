import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DashboardComponent } from './dashboard.component';

import { DropdownModule } from 'primeng/dropdown';
import { FormsModule } from '@angular/forms';
import { CASADashboardComponent } from './ca-sa-dashboard/ca-sa-dashboard.component';
import { TableModule } from 'primeng/table';
import { ChartModule } from 'primeng/chart';
import {NgxOrgChartModule} from "ngx-org-chart";
import { RouterModule, Routes } from '@angular/router';

import {
  NbLayoutDirectionService,
  NbMenuModule,
  NbOverlay,
  NbOverlayModule,
  NbOverlayService,
  NbPositionBuilderService,
  NbSidebarModule,
  NbThemeModule,
  NbToastrModule,
  NbToastrService,
  NbLayoutModule,
} from '@nebular/theme';
import { AccordionModule } from 'primeng/accordion';
import { InstitutionComponent } from 'app/institution/add-institution/institution.component';
import { InstitutionListComponent } from 'app/institution/institution-list/institution-list.component';
import { ViewInstitutionComponent } from 'app/institution/view-institution/view-institution.component';
import { ClimateActionComponent } from 'app/climate-action/climate-action/climate-action.component';
import { ViewComponent } from 'app/climate-action/view/view.component';
import { DataRequestComponent } from 'app/data-request-flow/data-request/data-request.component';
import { AssignDataRequestComponent } from 'app/data-request-flow/assign-data-request/assign-data-request.component';
import { EnterDataComponent } from 'app/data-request-flow/enter-data/enter-data.component';
import { ReviewDataComponent } from 'app/data-request-flow/review-data/review-data.component';
import { CarbonComponent } from 'app/Tool/carbon/carbon.component';
import { PortfolioComponent } from 'app/Tool/portfolio/portfolio.component';
import { InvestorComponent } from 'app/Tool/investor/investor.component';
import { AssessmentResultComponent } from 'app/assessment-result/assessment-result.component';
import { ManagedatastatusComponent } from 'app/data-request-flow/managedatastatus/managedatastatus.component';
import { ApproveDataComponent } from 'app/data-request-flow/approve-data/approve-data.component';
import { Assessment } from 'shared/service-proxies/service-proxies';
import { AssessmentComponent } from 'app/assessment/assessment.component';
import { QualityCheckComponent } from 'app/quality-check/quality-check.component';
import { QualityCheckDetailComponent } from 'app/quality-check-detail/quality-check-detail.component';
import { AcceptedPoliciesComponent } from 'app/climate-action/accepted-policies/accepted-policies.component';



const routes: Routes = [
  {
  path: '',
    component: DashboardComponent
  },
  {
    path: 'dashboard',
    component: DashboardComponent
  },
  {
    path: 'user',
    loadChildren: () => import('../user/user.module').then((m) => m.UserModule),
    canActivate: [],
    data: {}
  },
  {
    path: 'institutionlist',
    component: InstitutionListComponent,
    loadChildren: () => import('../dashboard/dashboard.module').then((m) => m.DashboardModule),
    canActivate: [],
    data: {}
  },
  {
    path: 'add-institution',
    component: InstitutionComponent,
    loadChildren: () => import('../dashboard/dashboard.module').then((m) => m.DashboardModule),
    canActivate: [],
    data: {}
  },
  {
    path: 'view-institution',
    component: ViewInstitutionComponent,
    loadChildren: () => import('../dashboard/dashboard.module').then((m) => m.DashboardModule),
    canActivate: [],
    data: {}
  },
  {
    path: 'add-polocies',
    component: ClimateActionComponent,
    loadChildren: () => import('../dashboard/dashboard.module').then((m) => m.DashboardModule),
    canActivate: [],
    data: {}
  },
  {
    path: 'accepted-policies',
    component: AcceptedPoliciesComponent,
    loadChildren: () => import('../dashboard/dashboard.module').then((m) => m.DashboardModule),
    canActivate: [],
    data: {}
  },
  {
    path: 'data-request',
    component: DataRequestComponent,
    loadChildren: () => import('../dashboard/dashboard.module').then((m) => m.DashboardModule),
    canActivate: [],
    data: {}
  },
  {
    path: 'assign-data-request',
    component: AssignDataRequestComponent,
    loadChildren: () => import('../dashboard/dashboard.module').then((m) => m.DashboardModule),
    canActivate: [],
    data: {}
  },
  {
    path: 'enter-data',
    component: EnterDataComponent,
    loadChildren: () => import('../dashboard/dashboard.module').then((m) => m.DashboardModule),
    canActivate: [],
    data: {}
  },
  {
    path: 'view-data',
    component: ReviewDataComponent,
    loadChildren: () => import('../dashboard/dashboard.module').then((m) => m.DashboardModule),
    canActivate: [],
    data: {}
  },
  {
    path: 'manage-data',
    component: ManagedatastatusComponent,
    loadChildren: () => import('../dashboard/dashboard.module').then((m) => m.DashboardModule),
    canActivate: [],
    data: {}
  },
  {
    path: 'app-approve-data',
    component: ApproveDataComponent,
    loadChildren: () => import('../dashboard/dashboard.module').then((m) => m.DashboardModule),
    canActivate: [],
    data: {}
  },
  {
    path: 'view-polocies',
    component: ViewComponent,
    loadChildren: () => import('../dashboard/dashboard.module').then((m) => m.DashboardModule),
    canActivate: [],
    data: {}
  },
  {
    path: 'carbon-market-tool',
    component: CarbonComponent,
    loadChildren: () => import('../dashboard/dashboard.module').then((m) => m.DashboardModule),
    canActivate: [],
    data: {}
  },
  {
    path: 'portfolio-tool',
    component: PortfolioComponent,
    loadChildren: () => import('../dashboard/dashboard.module').then((m) => m.DashboardModule),
    canActivate: [],
    data: {}
  },
  {
    path: 'investor-tool',
    component: InvestorComponent,
    loadChildren: () => import('../dashboard/dashboard.module').then((m) => m.DashboardModule),
    canActivate: [],
    data: {}
  },
  {
    path: 'assessment-result/:id',
    component: AssessmentResultComponent,
    loadChildren: () => import('../dashboard/dashboard.module').then((m) => m.DashboardModule),
    canActivate: [],
    data: {}
  },
  {
    path: 'assessment-results',
    component: AssessmentComponent,
    loadChildren: () => import('../dashboard/dashboard.module').then((m) => m.DashboardModule),
    canActivate: [],
    data: {}
  },
  {
    path: 'quality-controller',
    component: QualityCheckComponent,
    loadChildren: () => import('../dashboard/dashboard.module').then((m) => m.DashboardModule),
    canActivate: [],
    data: {}
  },
  {
    path: 'qc/detail',
    component: QualityCheckDetailComponent,
    loadChildren: () => import('../dashboard/dashboard.module').then((m) => m.DashboardModule),
    canActivate: [],
    data: {}
  },
]

@NgModule({
  declarations: [DashboardComponent, CASADashboardComponent,],
  imports: [
    RouterModule.forChild(routes),
    CommonModule,
    ChartModule,
    TableModule,
    ChartModule,
    DropdownModule,
    FormsModule,
    NgxOrgChartModule,
    NbLayoutModule,
    AccordionModule

  ]
})
export class DashboardModule { }
