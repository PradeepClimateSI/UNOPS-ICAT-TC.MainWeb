import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { UserListComponent } from './user-list/user-list.component';
import { UserFormComponent } from './user-form/user-form.component';
import { RouterModule, Routes } from '@angular/router';
import { DropdownModule } from 'primeng/dropdown';
import { ToastModule } from 'primeng/toast';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { FormsModule } from '@angular/forms';
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import { RippleModule } from 'primeng/ripple';
import { TableModule } from 'primeng/table';
import { TooltipModule } from 'primeng/tooltip';
import { UserDetailsFormComponent } from './user-details-form/user-details-form.component';
import {  UsersControllerServiceProxy } from 'shared/service-proxies/service-proxies';
import { LoginProfileControllerServiceProxy } from 'shared/service-proxies/auth-service-proxies';
import { AccountSettingComponent } from './account-setting/account-setting.component';
import { StyleClassModule } from 'primeng/styleclass';
import {InputMaskModule} from 'primeng/inputmask';

const routes: Routes = [
  { path: '', redirectTo: '/list', pathMatch: 'full' },
  {
    path: 'list',
    data: {
      title: 'User List',
    },
    component: UserListComponent
  },
  {
    path: 'create',
    data: {
      title: 'User Add',
    },
    component: UserFormComponent
  },
  {
    path: 'edit',
    data: {
      title: 'User Edit',
    },
    component: UserFormComponent
  },
  {
    path: 'view',
    data: {
      title: 'User View',
    },
    component: UserFormComponent
  },
  {
    path: 'setting',
    data: {
      title: 'Account Setting',
    },
    component: AccountSettingComponent
  }
]
@NgModule({
  declarations: [
    UserListComponent,
    UserFormComponent,
    UserDetailsFormComponent,
    AccountSettingComponent,
  ],
  imports: [
    CommonModule,
    RouterModule.forChild(routes),
    ToastModule,
    DropdownModule,
    ConfirmDialogModule,
    InputTextModule,
    ButtonModule,
    RippleModule,
    TableModule,
    TooltipModule,
    FormsModule,
    StyleClassModule,
    InputMaskModule,
  ],
  providers: [UsersControllerServiceProxy, LoginProfileControllerServiceProxy ]
})
export class UserModule { }
