import { AfterViewInit, ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { ConfirmationService, Message } from 'primeng/api';
import { AppService, LoginRole } from 'shared/AppService';
import { UserType } from 'shared/service-proxies/auth-service-proxies';
import { NotificationControllerServiceProxy, UsersControllerServiceProxy,Notification, CountryControllerServiceProxy, SystemStatusControllerServiceProxy } from 'shared/service-proxies/service-proxies';
import decode from 'jwt-decode';
import { MasterDataService } from 'app/shared/master-data.service';
import { map } from 'rxjs/operators';
import { BehaviorSubject } from 'rxjs';

@Component({
  selector: 'app-dashboard-base',
  templateUrl: './dashboard-base.component.html',
  styleUrls: ['./dashboard-base.component.css']
})
export class DashboardBaseComponent implements OnInit,AfterViewInit {

  title = 'SCC ';
  togglemenu: boolean = true;
  innerWidth = 0;
  userId: number;
  notification:Notification[] =[];
  notificationViewCount:number=0;
  userName: string = "";
  userRole: string = "";
  roles: UserType[] = [];
  confirm: boolean = false;
  loginRole = LoginRole;
  isInvesmentTool : boolean = false;
  isCarbonMarketTool : boolean = false;
  isPortfolioTool : boolean = false;
  messages: Message[] | undefined;
  private systemTimer: any;
  isDeploying: boolean=false;
  isAutoSaveDone: boolean = true;

  constructor(
    private confirmationService: ConfirmationService,
    private appService: AppService,
    private userProxy: UsersControllerServiceProxy,
    private cdr: ChangeDetectorRef,
    private notificationServiceProxy: NotificationControllerServiceProxy,
    private countryProxy: CountryControllerServiceProxy,
    public masterDataService: MasterDataService,
    private systemStatusProxy: SystemStatusControllerServiceProxy,
  ) { }
  ngAfterViewInit(): void {
    this.cdr.detectChanges();
  }
  async ngOnInit() {
    this.startSystemStatusTimer(true);

    this.messages = [
      { severity: 'error', summary: '', detail: 'We are making some improvements to the tool. Please refrain from entering data until this message disappears' },
    ];

    const token = localStorage.getItem('ACCESS_TOKEN')!;
   
    const tokenPayload = decode<any>(token);
    this.userName = tokenPayload.username;
    
    this.userName = `${this.appService.getUserName()}`;
    this.userRole = tokenPayload.role.code;;


    this.countryProxy.getCountry(tokenPayload.countryId).subscribe((res:any)=>{
         this.isCarbonMarketTool = res.carboneMarketTool;
         this.isInvesmentTool = res.investmentTool;
         this.isPortfolioTool = res.portfoloaTool;    
         
       })


    this.userProxy.findUserByUserName(
      this.userName
    ).subscribe((res: any) => {
      this.userId = res;

      let notis = this.notificationServiceProxy.findByUserId(this.userId).subscribe((re:any)=>{
        this.notification =re;

        for(let x of this.notification){
          if(!x.is_viewed){
            this.notificationViewCount ++;
          }
        }
      })

    });

    this.appService.autoSavingDone.subscribe(res => {
      this.isAutoSaveDone = res;
    })


  }

  onHideDialog(){}

  viewPop(){
    this.confirm = !this.confirm
  }
  detail(note:Notification){
    note.is_viewed=true;
    this.notificationServiceProxy.updateNoti(note).subscribe((res:any)=>{
    })
  }

  logout() {
    this.appService.loginOut.next(true);
    let autoSub = this.appService.autoSavingDone.subscribe(res => {
      console.log("sub in logout", res)
      if (res) {
        this.confirmationService.confirm({
          message: 'Are you sure you want to logout?',
          key: 'logout',
          accept: () => {
            this.appService.logout();
            this.stopSystemStatusTimer();
          },
          reject: () => {
            autoSub.unsubscribe()
            this.appService.loginOut.next(false);
          }
        })
      } else {
        autoSub.unsubscribe()
        this.appService.loginOut.next(false);
      }
    }, () => {
      autoSub.unsubscribe()
      this.appService.loginOut.next(false);
    })



  }

  public startSystemStatusTimer(isFirst: boolean=false) {
    if(isFirst){
      this.checkSystemStatus().subscribe()
    }else{
      this.systemTimer = setTimeout(() => this.checkSystemStatus().subscribe(), 60000 * 5);
    }
  }

  private checkSystemStatus() {
    return this.systemStatusProxy.systemStatus()
    .pipe(map(res => {
      if(res === 1 ){        
        this.isDeploying=true;
      }else{
        this.isDeploying=false;
      }
      this.startSystemStatusTimer();
    }))
  }

  private stopSystemStatusTimer() {
    clearTimeout(this.systemTimer);
  }

  

}
