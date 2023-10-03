import { AfterViewInit, ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { ConfirmationService } from 'primeng/api';
import { AvatarModule } from 'primeng/avatar';
import { AppService, LoginRole, RecordStatus } from 'shared/AppService';
import { UserType, ServiceProxy } from 'shared/service-proxies/auth-service-proxies';
import { NotificationControllerServiceProxy, User, UsersControllerServiceProxy,Notification, CountryControllerServiceProxy } from 'shared/service-proxies/service-proxies';
import decode from 'jwt-decode';

@Component({
  selector: 'app-dashboard-base',
  templateUrl: './dashboard-base.component.html',
  styleUrls: ['./dashboard-base.component.css']
})
export class DashboardBaseComponent implements OnInit,AfterViewInit {

  title = 'SCC ';
  togglemenu: boolean = true;
  innerWidth = 0;
  // user: User = new User();
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

  constructor(
    private confirmationService: ConfirmationService,
    private appService: AppService,
    private userProxy: UsersControllerServiceProxy,
    private cdr: ChangeDetectorRef,
    private notificationServiceProxy: NotificationControllerServiceProxy,
    private countryProxy: CountryControllerServiceProxy,
  ) { }
  ngAfterViewInit(): void {
    this.cdr.detectChanges();
  }
  async ngOnInit() {

    const token = localStorage.getItem('ACCESS_TOKEN')!;
    const tokenPayload = decode<any>(token);
    this.userName = tokenPayload.username;
    this.userName = `${this.appService.getUserName()}`;
    this.userRole = tokenPayload.role.code;
    // this.userRole = tokenPayload.role[0];
    console.log("++++++++++++++++++",tokenPayload);

    this.countryProxy.getCountry(tokenPayload.countryId).subscribe((res:any)=>{
         console.log('Countryy',res) 
         this.isCarbonMarketTool = res.carboneMarketTool;
         this.isInvesmentTool = res.investmentTool;
         this.isPortfolioTool = res.portfoloaTool;    
         
         console.log('tooll',this.isCarbonMarketTool,this.isInvesmentTool,this.isPortfolioTool)
         
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
        console.log("++++++++++++++++++", this.notification );
      })

    });


  }

  onHideDialog(){}

  viewPop(){
    this.confirm = !this.confirm
  }
  detail(note:Notification){
    note.is_viewed=true;
    console.log("climateactions",note )
    this.notificationServiceProxy.updateNoti(note).subscribe((res:any)=>{
      console.log("11111111111",res)
    })
  }

  logout() {
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
