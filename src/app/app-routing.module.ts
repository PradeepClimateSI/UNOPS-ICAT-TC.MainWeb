
import { DashboardComponent } from './dashboard/dashboard.component';
import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { LandingPageComponent } from './landing-page/landing-page.component';
import { LoardMoreComponent } from './landing-page/loard-more/loard-more.component';
import { DashboardBaseComponent } from './dashboard-base/dashboard-base.component';
import { RoleGuardService } from './auth/role-guard.service';
import { MethodologyComponent } from './methodology/methodology.component';
import { ChartComponent } from './chart/chart.component';
import { AuditComponent } from './audit/audit.component';
import { AuthGuard } from './auth/auth.guard';

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
  TT = 'Country User',
  DCT = 'Data Collection Team',
  QC = 'QC Team',
  INS_ADMIN = 'Institution Admin',
  DEO = 'Data Entry Operator',
}


export const routes: Routes = [
  { path: 'landing-page', component: LandingPageComponent },
  { path: '', redirectTo: 'landing-page', pathMatch: 'full' },
  
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
    canActivate: [AuthGuard],
    data: {}
  },
  {
    path: 'app/methodology',
    component: MethodologyComponent,
    loadChildren: () => import('./dashboard/dashboard.module').then((m) => m.DashboardModule),
    canActivate: [AuthGuard],
    data: {}
  },
  {
    path: 'app/chart',
    component: ChartComponent,
    loadChildren: () => import('./dashboard/dashboard.module').then((m) => m.DashboardModule),
    canActivate: [AuthGuard],
    data: {}
  },

];


@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
