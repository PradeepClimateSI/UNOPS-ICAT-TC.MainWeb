
import { DashboardComponent } from './dashboard/dashboard.component';
import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { LandingPageComponent } from './landing-page/landing-page.component';
import { LoardMoreComponent } from './landing-page/loard-more/loard-more.component';
import { DashboardBaseComponent } from './dashboard-base/dashboard-base.component';
import { ClimateActionComponent } from './climate-action/climate-action/climate-action.component';
// import { UnitComponent } from './unit_/unit.component';

const routes: Routes = [
  { path: '', redirectTo: '/app', pathMatch: 'full' },

  { path: 'landing-page', component: LandingPageComponent },
  { path: 'loard-more', component: LoardMoreComponent },
  { path: 'climate-action', component: ClimateActionComponent },

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
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
