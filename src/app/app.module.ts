import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule } from '@angular/forms';
import { NgImageSliderModule } from 'ng-image-slider';
import { CarouselModule } from 'primeng/carousel';
import { Location } from '@angular/common';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
// import { TokenInterceptor } from 'src/shared/token-interceptor ';
import { HTTP_INTERCEPTORS } from '@angular/common/http';
import { HttpClientModule } from '@angular/common/http';
import { PaginatorModule } from 'primeng/paginator';
import { AutoCompleteModule } from 'primeng/autocomplete';
import { ToastModule } from 'primeng/toast';
import { ButtonModule } from 'primeng/button';
import { DropdownModule } from 'primeng/dropdown';
import { StepsModule } from 'primeng/steps';
import { RadioButtonModule } from 'primeng/radiobutton';
import { CheckboxModule } from 'primeng/checkbox';
import { CalendarModule } from 'primeng/calendar';
import { DialogModule } from 'primeng/dialog';
import { ListboxModule } from 'primeng/listbox';
import { InputMaskModule } from 'primeng/inputmask';
import { TabViewModule } from 'primeng/tabview';
import { AccordionModule } from 'primeng/accordion';
import { CardModule } from 'primeng/card';
import { SliderModule } from 'primeng/slider';
import { ToggleButtonModule } from 'primeng/togglebutton';
import { SplitButtonModule } from 'primeng/splitbutton';
import { SelectButtonModule } from 'primeng/selectbutton';
import { TooltipModule } from 'primeng/tooltip';
import { ProgressBarModule } from 'primeng/progressbar';
import { InputNumberModule } from 'primeng/inputnumber';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { ConfirmationService } from 'primeng/api';
import { DynamicDialogModule } from 'primeng/dynamicdialog';
import { ChartModule } from 'primeng/chart';
import { TreeModule } from 'primeng/tree';


import { GMapModule } from 'primeng/gmap';
import { ProgressSpinnerModule } from 'primeng/progressspinner';
import { OverlayPanelModule } from 'primeng/overlaypanel';

import { environment } from '../environments/environment';
import { MultiSelectModule } from 'primeng/multiselect';
import { NbThemeModule,  NbLayoutModule,} from '@nebular/theme';
import { FlexLayoutModule } from '@angular/flex-layout';
import { MessagesModule } from 'primeng/messages';
import { TableModule } from 'primeng/table';

import { NbEvaIconsModule } from '@nebular/eva-icons';

import { DashboardModule } from './dashboard/dashboard.module';
import { LandingPageComponent } from './landing-page/landing-page.component';
import { LoardMoreComponent } from './landing-page/loard-more/loard-more.component';
import { DatePipe } from '@angular/common';
import {RippleModule} from "primeng/ripple";
import {InputTextModule} from "primeng/inputtext";
// import { DashboardBaseComponent } from './dashboard-base/dashboard-base.component';
import { AuthInterceptor } from './auth/auth.interceptor';
import { ErrorInterceptor } from './auth/error.interceptor';
import { AuthGuard } from './auth/auth.guard';



import {
  API_BASE_URL,
  DocumentControllerServiceProxy,
  ServiceProxy,
  ProjectControllerServiceProxy,
  CountryControllerServiceProxy,
  SectorControllerServiceProxy,
  NdcControllerServiceProxy,
  MethodologyAssessmentControllerServiceProxy,
  UserTypeControllerServiceProxy,
  InstitutionControllerServiceProxy,
} from 'shared/service-proxies/service-proxies';

import { AUTH_API_BASE_URL, ServiceProxy as AuthServiceProxy, AuthControllerServiceProxy } from 'shared/service-proxies/auth-service-proxies';
import { DashboardBaseComponent } from './dashboard-base/dashboard-base.component';
import { ClimateActionComponent } from './climate-action/climate-action/climate-action.component';
import { ViewComponent } from './climate-action/view/view.component';
import { DocumentUploadComponent } from './shared/document-upload/document-upload.component';
import {FileUploadModule} from 'primeng/fileupload';
import { MethodologyComponent } from './methodology/methodology.component';
import { NgMultiSelectDropDownModule } from 'ng-multiselect-dropdown';
import { ChartComponent } from './chart/chart.component';
//import { MethodologyControllerServiceProxy } from 'shared/service-proxies/meth-service-proxies';
import {StyleClassModule} from 'primeng/styleclass';
import { UserModule } from './user/user.module';
export function getRemoteServiceBaseUrl(): string {
  return environment.baseUrlAPI;
}
export function getRemoteServiceESBaseUrl(): string {
  return environment.esbaseUrlAPI;
}
export function getAuthRemoteServiceBaseUrl(): string {
  return environment.authBaseUrlAPI;
}
@NgModule({
    declarations: [
        AppComponent,
        DashboardBaseComponent,
        ClimateActionComponent,
        ViewComponent,
        DocumentUploadComponent,
        MethodologyComponent,
        ChartComponent,
    ],
    imports: [
        FormsModule,
        BrowserModule,
        AppRoutingModule,
        BrowserAnimationsModule,
        FormsModule,
        HttpClientModule,
        StyleClassModule,

        NgImageSliderModule,
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
        GMapModule,
        ChartModule,
        ProgressSpinnerModule,
        OverlayPanelModule,
        TreeModule,
        FlexLayoutModule,
        BrowserModule,
        BrowserAnimationsModule,
        AppRoutingModule,
        MessagesModule,        
        ToastModule,
        NbThemeModule.forRoot({name: 'default'}),
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
        NgMultiSelectDropDownModule.forRoot(),
        UserModule 
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
        //MethodologyControllerServiceProxy,
        UserTypeControllerServiceProxy,
        InstitutionControllerServiceProxy,
        DatePipe,
        {provide: API_BASE_URL, useFactory: getRemoteServiceBaseUrl},
        {provide: AUTH_API_BASE_URL, useFactory: getAuthRemoteServiceBaseUrl},
        HttpClientModule,
       
        Location,
        DynamicDialogModule,
        {provide: HTTP_INTERCEPTORS, useClass: AuthInterceptor, multi: true},
        {provide: HTTP_INTERCEPTORS, useClass: ErrorInterceptor, multi: true},
        AuthGuard
    ],
    bootstrap: [AppComponent],
    exports: [
    ]
})
export class AppModule {}
