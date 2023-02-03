import { Component, Input, OnInit, ViewChild } from '@angular/core';
import { NgForm } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { MessageService, ConfirmationService } from 'primeng/api';
import { AppService, LoginRole, RecordStatus } from 'shared/AppService';
import { UsersControllerServiceProxy, ServiceProxy } from 'shared/service-proxies/service-proxies';
import {LoginProfile, LoginProfileControllerServiceProxy, UserType, ServiceProxy as AuthServiceProxy } from 'shared/service-proxies/auth-service-proxies';
import { UserDetailsFormComponent } from '../user-details-form/user-details-form.component';

@Component({
  selector: 'app-user-form',
  templateUrl: './user-form.component.html',
  styleUrls: ['./user-form.component.css']
})
export class UserFormComponent implements OnInit {

  @Input() isSetting: boolean = false;

  isView: boolean = false;
  isNewEntry: boolean = true;  
  editEntryId: number; // user id. not login profile id
  creating: boolean = false;


  password: string = "";
  loginProfile: LoginProfile = new LoginProfile();
  roles: UserType[] = [];


  @ViewChild(UserDetailsFormComponent) userDetailsFormComponent:UserDetailsFormComponent;
  
  constructor(
    private usersControllerServiceProxy: UsersControllerServiceProxy,
    private serviceProxy: ServiceProxy,
    private authServiceProxy: AuthServiceProxy,
    private route: ActivatedRoute,
    private messageService: MessageService,
    private router: Router,
    private confirmationService: ConfirmationService,
    private activatedRoute:ActivatedRoute, // {relativeTo:this.activatedRoute}
    private loginProfileControllerServiceProxy: LoginProfileControllerServiceProxy,
    private appService: AppService
  ) { }

  async ngOnInit() {
    this.route.url.subscribe(r => {
      if(r[0].path.includes("view")){
        this.isView =true;
      }
    });
    await this.getRoles();

    this.setInitialState();
  }

  setInitialState(){


    if(this.isSetting){
      const loginProfileId = this.appService.getProfileId();
      const userName = this.appService.getUserName();
      const role = this.appService.getRole();
      // if(loginProfileId && userName && role){
      //   this.loginProfile.userName = userName; 
      //   this.loginProfile.id = loginProfileId;
      //   const r = this.roles.find(r => r.code === role);
      //   if(r){
      //     this.loginProfile.role = r;
      //   }     

      //   console.log(this.loginProfile.id);
        
      //   this.serviceProxy.getManyBaseUsersControllerUser(
      //     undefined,
      //     undefined,
      //     [ "status||$ne||"+RecordStatus.Deleted, "loginProfile||$eq||"+this.loginProfile.id ],
      //     undefined,
      //     undefined,
      //     undefined,
      //     10,
      //     0,
      //     0,
      //     0
      //   ).subscribe(res => {
      //     console.log(res);
      //   })
      // }
    }else{
      this.route.queryParams.subscribe((params) => {
        if(params['id']){
          this.isNewEntry = false;
          this.editEntryId = params['id'];
          // this.getUserData();
        }
      });
    }

  }

  async getRoles(){
    const res = await this.authServiceProxy.getManyBaseRoleControllerUserType(
      undefined,
      undefined,
      [ "status||$ne||"+RecordStatus.Deleted],
      undefined,
      undefined,
      undefined,
      100,
      0,
      0,
      0
    ).toPromise();
    this.roles = res.data
  }

  // getUserData(){
  //   this.usersControllerServiceProxy.getUserDetailsWithLoginProfile(this.editEntryId)
  //   .subscribe(res => {
  //     this.loginProfile.userName = res.userName;
  //     this.loginProfile.id = res.user.loginProfile;
  //     const r = this.roles.find(r => r.code === res.role);
  //     if(r){
  //       this.loginProfile.userType = r;
  //     }    
  //     this.userDetailsFormComponent.initUser(res.user);  
  //   })
  // }

  // private isSupperRole(){
  //   return this.loginProfile.userType.code === LoginRole.MASTER_ADMIN || this.loginProfile.userType.code === LoginRole.CSI_ADMIN; 
  // }

  private abaleToSave(form: NgForm){
    return (form.valid || (!this.isNewEntry && this.loginProfile.userType && this.loginProfile.userName) ) 
    // &&      this.loginProfile.userType && this.userDetailsFormComponent.isValid() ;
  }

  async save(form: NgForm) {
    this.creating=true;    
    if(this.abaleToSave(form)){
      if(this.isNewEntry){        
        this.authServiceProxy.createOneBaseLoginProfileControllerLoginProfile(this.loginProfile)
          .subscribe(async (res: LoginProfile) => {
            // this.editEntryId = res.id;
            this.isNewEntry = false;
            this.loginProfile = res;
            let userSaved = true;
            // if(!this.isSupperRole()){
            //   userSaved = await this.userDetailsFormComponent.save(res.id, this.loginProfile.userName)
            // }
            if(!userSaved){
              // deleted login profile
            }
            if(res && userSaved){
              this.messageService.add({
                severity: 'success',
                summary: 'Success',
                detail: 'has saved successfully',
                closable: true,
              });
            }else{
              this.messageService.add({
                severity: 'error',
                summary: 'Error',
                detail: "Failed to save",
                closable: true,
              });
            }
          }, err => {
            this.messageService.add({
              severity: 'error',
              summary: 'Error',
              detail: 'An error occurred, please try again',
              closable: true,
            });
            console.log('Error', err);
          }, () => {this.creating=false;})
      }else{
        this.loginProfileControllerServiceProxy.updateOneLoginProfile(this.loginProfile)
        .subscribe(async res => {
          let userSaved = true;
          // if(!this.isSupperRole()){
          //   userSaved = await this.userDetailsFormComponent.save(res.id, this.loginProfile.userName)
          // }
          // if(res && userSaved){
          //   this.messageService.add({
          //     severity: 'success',
          //     summary: 'Success',
          //     detail: 'has updated successfully',
          //     closable: true,
          //   });
          // }else{
          //   this.messageService.add({
          //     severity: 'error',
          //     summary: 'Error',
          //     detail: "Failed to update",
          //     closable: true,
          //   });
          // }
        }, err=> {
          this.messageService.add({
            severity: 'error',
            summary: 'Error',
            detail: 'An error occurred, please try again',
            closable: true,
          });
          console.log('Error', err);
        })
      }
    }else{
      this.messageService.add({
        severity: 'warn',
        summary: 'Required',
        detail: 'Fill All Mandatory fields',
        closable: true,
      });
    }
  }

  onBackClick() {
    this.router.navigate(['../list'], {relativeTo:this.activatedRoute});
  }

  onDeleteClick() {
    this.confirmationService.confirm({
      message: 'Are you sure you want to delete the user?',
      header: 'Delete Confirmation',
      acceptIcon: 'icon-not-visible',
      rejectIcon: 'icon-not-visible',
      accept: () => {
        this.delete();
      },
      reject: () => { },
    });
  }

  delete() {
    //@ts-ignore
    this.loginProfileControllerServiceProxy.remove(this.loginProfile.id)
      .subscribe(async res => {
        await this.userDetailsFormComponent.remove();
        this.messageService.add({
          severity: 'success',
          summary: 'Success',
          detail: 'has deleted successfully',
          closable: true,
        });
      },error => {        
        this.messageService.add({
          severity: 'error',
          summary: 'Error',
          detail: 'An error occurred, please try again',
          closable: true,
        });
      }, ()=> {
        this.router.navigate(['../list'], {relativeTo:this.activatedRoute});
      })
  }

}
