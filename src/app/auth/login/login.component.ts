import { Component, OnInit } from '@angular/core';
import {NgForm} from "@angular/forms";
import { ActivatedRoute, Router } from '@angular/router';
import { MessageService } from 'primeng/api';
import decode from 'jwt-decode';
import { AppService } from 'shared/AppService';
import { AuthControllerServiceProxy, AuthCredentialDto, ServiceProxy } from 'shared/service-proxies/auth-service-proxies';
import { UsersControllerServiceProxy } from 'shared/service-proxies/service-proxies';
import { GuidanceVideoComponent } from 'app/guidance-video/guidance-video.component';
import { DialogService } from 'primeng/dynamicdialog';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {
  public passwordType: string = "password";
  public isSubmitted: boolean=false;
  public userName: string="";
  public password: string="";
  public countryId: string="";
  public insId: string="";

  constructor(
    private messageService: MessageService,
    private router: Router,
    private authControllerServiceProxy: AuthControllerServiceProxy,
    private appService: AppService,
    private activatedRoute:ActivatedRoute,
    private userControllerService: UsersControllerServiceProxy,
    protected dialogService: DialogService,
  ) { }

  ngOnInit(): void {
  }

  watchVideo(){
    let ref = this.dialogService.open(GuidanceVideoComponent, {
      header: 'Guidance Video',
      width: '60%',
      contentStyle: {"overflow": "auto"},
      baseZIndex: 10000,
      data: {
        sourceName: 'Landing',
      },
    });

    ref.onClose.subscribe(() => {
      
    })
  }

  togglePassword(){
    if (this.passwordType=="text"){
      this.passwordType="password"
    }else {
      this.passwordType="text";
    }
  }

  toLanding() {
    this.router.navigate(['/landing-page']);
  }

  showPasswordResetForm() {
    this.router.navigate(['../forgot'], {relativeTo:this.activatedRoute});
  }

  async login(form: NgForm) {
    const a = new AuthCredentialDto();
    if(!this.password  || !this.userName){
      this.messageService.add({
        severity: 'warn',
        summary: 'Required',
        detail: 'Fill All the fields',
        closable: true,
      });
    }else{
      a.password = this.password;
      a.username = this.userName;
      try{
        const res = await this.authControllerServiceProxy.login(a).toPromise();
       
        if(res.isEmailConfirmed){

        this.appService.steToken(res.accessToken);
        this.appService.steRefreshToken(res.refreshToken);
        this.appService.steProfileId(res.loginProfileId);
        this.appService.steUserName(this.userName);
        this.appService.steRole(res.roles)
        this.appService.startRefreshTokenTimer();
        this.appService.startIdleTimer();
        this.router.navigate(['../../app'], {});
        }
        else{
          this.messageService.add({
            severity: 'error',
            summary: 'Error',
            detail: 'Please verify email before login',
            closable: true,
          });

        }
        
       
      }catch(err){
        this.messageService.add({
          severity: 'error',
          summary: 'Error',
          detail: 'Please check email and password',
          closable: true,
        });
      }
    }
  }
}
