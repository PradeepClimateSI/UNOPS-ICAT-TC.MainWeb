import { Component, OnInit } from '@angular/core';
import { ConfirmationService } from 'primeng/api';
import { AppService, LoginRole, RecordStatus } from 'shared/AppService';
import { UserType, ServiceProxy } from 'shared/service-proxies/auth-service-proxies';
import decode from 'jwt-decode';
@Component({
  selector: 'app-dashboard-base',
  templateUrl: './dashboard-base.component.html',
  styleUrls: ['./dashboard-base.component.css']
})
export class DashboardBaseComponent implements OnInit {

  title = 'SCC ';
  togglemenu: boolean = true;
  innerWidth = 0;


  userName: string = "";
  userRole: string = "";
  roles: UserType[] = [];
  loginRole = LoginRole;

  constructor(
    private confirmationService: ConfirmationService,
    private appService: AppService, 
    // private authServiceProxy: ServiceProxy,
    ) { }

  ngOnInit() {
    const token = localStorage.getItem('ACCESS_TOKEN')!;
    const tokenPayload = decode<any>(token);
    this.userRole = tokenPayload.role[0];
    console.log('aaaa',    this.userRole)
    // this.sectorId = tokenPayload.sectorId;
    // this.getRoles();''
  }

  // async getRoles(){
  //   const r = this.appService.getRole();
  //   if(r){
  //     const res = await this.authServiceProxy.getManyBaseRoleControllerUserType(
  //       undefined,
  //       undefined,
  //       [ "status||$ne||"+RecordStatus.Deleted],
  //       undefined,
  //       undefined,
  //       undefined,
  //       100,
  //       0,
  //       0,
  //       0
  //     ).toPromise();
  //     this.roles = res.data;
  //     const rr = this.roles.find(role => role.code === r)    
  //     if(rr){
  //       this.userRole = rr.name;
  //     }
  //   }
  // }

  logout(){
this.appService.logout();
    // this.confirmationService.confirm({
      
    //   message: 'Are you sure you want to login out?',
    //   header: 'Confirmation',
    //   acceptIcon: 'icon-not-visible',
    //   rejectIcon: 'icon-not-visible',
    //   accept: () => {
    //     console.log('aaaa')
        
    //   },
    //   reject: () => { },
    // });
    
  }

}
