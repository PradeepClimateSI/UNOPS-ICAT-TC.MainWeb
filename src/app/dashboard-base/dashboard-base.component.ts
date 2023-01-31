import { Component, OnInit } from '@angular/core';
import { ConfirmationService } from 'primeng/api';
import { AppService, RecordStatus } from 'shared/AppService';
import { Role, ServiceProxy } from 'shared/service-proxies/auth-service-proxies';

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
  roles: Role[] = [];

  constructor(
    private confirmationService: ConfirmationService,
    private appService: AppService, 
    private authServiceProxy: ServiceProxy
    ) { }

  ngOnInit() {
    this.userName = `${this.appService.getUserName()}`;
    this.getRoles();''
  }

  async getRoles(){
    const r = this.appService.getRole();
    if(r){
      const res = await this.authServiceProxy.getManyBaseRoleControllerRole(
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
      this.roles = res.data;
      const rr = this.roles.find(role => role.code === r)    
      if(rr){
        this.userRole = rr.name;
      }
    }
  }

  logout(){

    this.confirmationService.confirm({
      message: 'Are you sure you want to login out?',
      header: 'Confirmation',
      acceptIcon: 'icon-not-visible',
      rejectIcon: 'icon-not-visible',
      accept: () => {
        this.appService.logout();
      },
      reject: () => { },
    });
  }

}
