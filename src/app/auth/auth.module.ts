import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LoginComponent } from './login/login.component';
import { ForgotPasswordComponent } from './forgot-password/forgot-password.component';
import { RouterModule, Routes } from '@angular/router';
import { FormsModule } from '@angular/forms';
import {PasswordModule} from 'primeng/password';
import {DividerModule} from 'primeng/divider';
import {InputTextModule} from "primeng/inputtext";
import { ToastModule } from 'primeng/toast';
import { OtpComponent } from './otp/otp.component';
import { ResetComponent } from './reset/reset.component';
import { AuthControllerServiceProxy } from 'shared/service-proxies/auth-service-proxies';
import { RegisterUserComponent } from './register-user/register-user.component';


const routes: Routes = [
  { path: '', redirectTo: 'login', pathMatch: 'full' },
  {
    path: 'login',
    component: LoginComponent
  },
  {
    path: 'forgot',
    component: ForgotPasswordComponent
  },
  {
    path: 'otp',
    component: OtpComponent
  },
  {
    path: 'reset',
    component: ResetComponent
  },
  {
    path: 'register-user',
    component: RegisterUserComponent
  },
]

@NgModule({
  declarations: [
    LoginComponent,
    ForgotPasswordComponent,
    OtpComponent,
    ResetComponent,
    RegisterUserComponent
  ],
    imports: [
        CommonModule,
        RouterModule.forChild(routes),
        FormsModule,
        PasswordModule,
        DividerModule,
        InputTextModule,
        ToastModule
    ],
    providers: [AuthControllerServiceProxy]
})
export class AuthModule { }
