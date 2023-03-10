import { Component, OnInit } from '@angular/core';
import {NgForm} from "@angular/forms";
import { ActivatedRoute, Router } from '@angular/router';
import { MessageService } from 'primeng/api';
import { AppService } from 'shared/AppService';
import { AuthControllerServiceProxy, AuthCredentialDto } from 'shared/service-proxies/auth-service-proxies';

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

  constructor(
    private messageService: MessageService,
    private router: Router,
    private authControllerServiceProxy: AuthControllerServiceProxy,
    private appService: AppService,
    private activatedRoute:ActivatedRoute,
  ) { }

  ngOnInit(): void {
  }

  togglePassword(){
    if (this.passwordType=="text"){
      this.passwordType="password"
    }else {
      this.passwordType="text";
    }
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
        this.appService.steToken(res.accessToken);
        this.appService.steRefreshToken(res.refreshToken);
        // this.appService.steRole(res.role);
        this.appService.steProfileId(res.loginProfileId);
        this.appService.steUserName(this.userName);
        this.appService.startRefreshTokenTimer();
        this.appService.startIdleTimer();
        this.router.navigate(['../../app'], {});
      }catch(err){
        console.error(err);
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
