
import { DashboardComponent } from './dashboard/dashboard.component';
import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { LandingPageComponent } from './landing-page/landing-page.component';
import { LoardMoreComponent } from './landing-page/loard-more/loard-more.component';
import { DashboardBaseComponent } from './dashboard-base/dashboard-base.component';
import { ClimateActionComponent } from './climate-action/climate-action/climate-action.component';
import { ViewComponent } from './climate-action/view/view.component';
import { InstitutionComponent } from './institution/add-institution/institution.component';
import { InstitutionListComponent } from './institution/institution-list/institution-list.component';
import { EditInstitutionComponent } from './institution/edit-institution/edit-institution.component';
import { ViewInstitutionComponent } from './institution/view-institution/view-institution.component';
import { RoleGuardService } from './auth/role-guard.service';

export enum CountryModule {
  CLIMATE_ACTION_MODULE = 0,
  GHG_MODULE = 1,
  MAC_MODULE = 2,
  DATACOLLECTION_MODULE = 3,
  DATACOLLECTION_GHG_MODULE = 4
  
}

export enum UserRoles {
  COUNTRY_ADMIN = 'Country Admin',
  VERIFIER = 'Verifier',
  SECTOR_ADMIN = 'Sector Admin',
  MRV_ADMIN = 'MRV Admin',
  TT = 'Technical Team',
  DCT = 'Data Collection Team',
  QC = 'QC Team',
  INS_ADMIN = 'Institution Admin',
  DEO = 'Data Entry Operator',
}

const routes: Routes = [
  { path: '', redirectTo: '/app', pathMatch: 'full' },
  { path: 'landing-page', component: LandingPageComponent },
  { path: 'loard-more', component: LoardMoreComponent },
  {
    path: 'auth',
    loadChildren: () => import('./auth/auth.module').then((m) => m.AuthModule),
    canActivate: [],
    data: {}
  },
  {
    path: 'app',
    component: DashboardBaseComponent,
    loadChildren: () => import('./dashboard/dashboard.module').then((m) => m.DashboardModule),
    canActivate: [],
    data: {}
  },
  { path: 'landing-page', component: LandingPageComponent },
  { path: 'loard-more', component: LoardMoreComponent },
  { path: 'climate-action', component: ClimateActionComponent },
  { path: 'view-climate-action', component: ViewComponent },
  { path: 'institution', component: InstitutionComponent },
  { path: 'edit-institution', component: EditInstitutionComponent },
  { path: 'view-institution', component: ViewInstitutionComponent },
  {
    path: 'institution-list',
    component: InstitutionListComponent,
    canActivate: [RoleGuardService],
    // data: {
    //   expectedRoles: [
    //     UserRoles.COUNTRY_ADMIN,
    //     UserRoles.SECTOR_ADMIN,
    //     UserRoles.MRV_ADMIN,
    //     UserRoles.TT,
    //     UserRoles.DCT,
    //   ],
    // },
  },



];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
