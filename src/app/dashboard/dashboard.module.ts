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
    path: 'view-polocies',
    component: ViewComponent,
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
