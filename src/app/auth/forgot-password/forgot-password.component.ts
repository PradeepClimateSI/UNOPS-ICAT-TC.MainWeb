import { Component, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { MessageService } from 'primeng/api';
import { ProfileStatus, RecordStatus } from 'shared/AppService';
import { AuthControllerServiceProxy } from 'shared/service-proxies/auth-service-proxies';
import { ServiceProxy, UsersControllerServiceProxy } from 'shared/service-proxies/service-proxies';

@Component({
  selector: 'app-forgot-password',
  templateUrl: './forgot-password.component.html',
  styleUrls: ['./forgot-password.component.css']
})
export class ForgotPasswordComponent implements OnInit {
  public isSubmitted: boolean=false;
  public userName: string="";

  constructor(
    private activatedRoute:ActivatedRoute,
    private router: Router,
    private authControllerServiceProxy: AuthControllerServiceProxy,
    private usersControllerServiceProxy: UsersControllerServiceProxy,
    private messageService: MessageService,
  ) { }

  ngOnInit(): void {
  }

  async requestOTP(form: NgForm){
    localStorage.setItem('reset-key', this.userName)
    let user = await this.usersControllerServiceProxy.findUserByUserNameEx(this.userName).toPromise()
    this.authControllerServiceProxy.forgotPassword(this.userName, user.firstName).subscribe((res:any) => {
      if(res.status){
        this.messageService.add({
          severity: 'success',
          summary: 'Success', 
          detail: res.message,
          closable: true,
        });
        this.goOTP();
      }else{
        this.messageService.add({
          severity: 'error',
          summary: 'Error',
          detail: res.message,
          closable: true,
        });
      }
    })
    
  }

  goOTP(){
    this.router.navigate(['../otp'], {relativeTo:this.activatedRoute});
  }

  goLogin(){
    this.router.navigate(['../login'], {relativeTo:this.activatedRoute});
  }

}
