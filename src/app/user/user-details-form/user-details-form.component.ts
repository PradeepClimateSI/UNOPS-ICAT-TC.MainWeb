import { Component, OnInit, ViewChild } from '@angular/core';
import { NgForm } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { MasterDataService } from 'app/shared/master-data.service';
import { MessageService, ConfirmationService ,ConfirmEventType} from 'primeng/api';
import { RecordStatus } from 'shared/AppService';
import { Institution, ServiceProxy, User, UsersControllerServiceProxy } from 'shared/service-proxies/service-proxies';
import decode from 'jwt-decode';

@Component({
  selector: 'app-user-details-form',
  templateUrl: './user-details-form.component.html',
  styleUrls: ['./user-details-form.component.css']
})
export class UserDetailsFormComponent implements OnInit {
  isView: boolean = false;
  isNewEntry: boolean = true;
  editEntryId: number;
  creating: boolean = false;
  isSubmitted: boolean = false;
  institutions: Institution[] = [];


  isNewUser: boolean = true;
  editUserId: number;
  isActive:number=0;
  itsMe:boolean=false;
  checkRole:boolean=false

  public user: User = new User();


  @ViewChild('fData', { static: true }) form: NgForm;
  
  constructor(
    private masterDataService: MasterDataService,
    private activatedRoute:ActivatedRoute, 
    private serviceProxy: ServiceProxy,
    private route: ActivatedRoute,
    private messageService: MessageService,
    private router: Router,
    private userControllerService: UsersControllerServiceProxy,
    private confirmationService: ConfirmationService
  ) { }

  ngOnInit(): void {
    this.route.url.subscribe(r => {
      if(r[0].path.includes("view")){
        this.isView =true;
      }
    });
    const token = localStorage.getItem('ACCESS_TOKEN')!;

    const tokenPayload = decode<any>(token);
    
    this.user.userType = undefined!;
    this.user.mobile = '';
    this.user.landline = '';

 
    this.route.queryParams.subscribe((params) => {
      this.editUserId = params['id'];

      if (this.editUserId && this.editUserId > 0) {
        this.isNewUser = false;
        this.serviceProxy
          .getOneBaseUsersControllerUser(
            this.editUserId,
            undefined,
            undefined,
            0
          )
          .subscribe((res: any) => {
            this.user = res;
           

            this.isActive=this.user.status;
            this.itsMe=this.user.username==tokenPayload.usr;
            let loggedUserRole=tokenPayload.roles.code;
            if (this.user.userType.name == "Country Admin") {
   
              }
              else if (this.user.userType.name == "Sector Admin") {
               
                this.checkRole=loggedUserRole !="Country Admin"
               
              }
              else if (this.user.userType.name == "MRV Admin") {
                this.checkRole=loggedUserRole!="Sector Admin"||loggedUserRole!="MRV Admin"
               
              }
              else if (this.user.userType.name == "Country User" ||this.user.userType.name ==   "QC Team" ||this.user.userType.name == "Data Collection Team") {
                this.checkRole=loggedUserRole!="Sector Admin"&&loggedUserRole!="MRV Admin"
               
              }
              else if ( this.user.userType.name ==   "Institution Admin"||this.user.userType.name == "Data Entry Operator") {
                this.checkRole=loggedUserRole!="Sector Admin"&&loggedUserRole!="MRV Admin"&&loggedUserRole!="Country User"&&loggedUserRole!="Data Collection Team"
             
              }
              
              else {
              
               
              }

            this.institutions.forEach((ins) => {
              if (ins.id == this.user.institution.id) {
                this.user.institution = ins;
              }
            });
          });
      }
    });
  }

  async save(loginProfileId: string, email: string): Promise<boolean>{
    this.user.email = email;
    this.user.loginProfile = loginProfileId;
    if(this.isNewEntry){
      try{
        const res = await this.serviceProxy.createOneBaseUsersControllerUser(this.user).toPromise();
        this.editEntryId = res.id;
        this.isNewEntry = false;
        this.user = res;
        return res !== undefined
      }catch(err){
        return false
      }
    }else{
      try{
        const res = await this.serviceProxy.updateOneBaseUsersControllerUser(this.editEntryId, this.user).toPromise();
        return res !== undefined        
      }catch(err){
        return false;
      }
    }
  }

  async remove(){
    this.user.status = RecordStatus.Deleted;
    await this.serviceProxy.updateOneBaseUsersControllerUser(this.user.id, this.user).toPromise();
  }
  onBackClick() {
    this.router.navigate(['../list'], { relativeTo:this.activatedRoute});
  }
  onDeleteClick(){
   
  this.userControllerService.changeStatus(this.user.id, this.isActive==0?1:0 ).subscribe(res=>{
    this.messageService.add({severity:'success', summary: 'Success', detail:`Successfully ${ this.isActive==0?'Deactivate':'activate'}`});
   this.user=res;
   this.isActive=this.user.status;


  });
   

  }

 

  confirmDeletUser() {
    this.confirmationService.confirm({
        message: `Are you sure that you want to ${ this.isActive==0?'deactivate':'activate'} this User?`,
        header: 'Confirmation',
        icon: 'pi pi-exclamation-triangle',
        accept: () => {
         this.onDeleteClick()
            
        },
        reject: (type: ConfirmEventType) => {
        }
    });
}

}
