import { ServiceProxy, User } from 'shared/service-proxies/service-proxies';
import { LoginProfileControllerServiceProxy } from 'shared/service-proxies/auth-service-proxies';

import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import {ConfirmationService, LazyLoadEvent, MessageService} from "primeng/api";
import { RecordStatus } from 'shared/AppService';
import { ActivatedRoute, Router } from '@angular/router';
@Component({
  selector: 'app-user-list',
  templateUrl: './user-list.component.html',
  styleUrls: ['./user-list.component.css']
})
export class UserListComponent implements OnInit {
  rows: number = 10;
  loading: boolean;
  userList: User[];
  totalRecords: number;


  constructor(
    private serviceProxy: ServiceProxy, 
    private cdr: ChangeDetectorRef,
    private confirmationService: ConfirmationService,
    private router: Router,
    private messageService: MessageService,
    private activatedRoute:ActivatedRoute,
    // private loginProfileControllerServiceProxy: LoginProfileControllerServiceProxy,

  ) { }

  ngAfterViewInit(): void {
    this.cdr.detectChanges();
  }
  
  ngOnInit(): void {
    
  }

  load(event: LazyLoadEvent) {

    console.log(event);

    this.loading = true;
    this.totalRecords = 0;

    // let pageNumber = event.first === 0 || event.first == undefined ? 1
    //   :event.first / (event.rows == undefined ? 1 : event.rows) + 1;

    let pageNumber = event.first;
    this.rows = event.rows == undefined ? 10 : event.rows;


    console.log(this.rows);
    this.serviceProxy.getManyBaseUsersControllerUser(
      undefined,
      undefined,
      [ "status||$ne||"+RecordStatus.Deleted],
      undefined,
      undefined,
      undefined,
      this.rows,
      0,
      pageNumber,
      0
    ).subscribe(res => {
      this.userList = res.data;
      this.totalRecords = res.data.length;
      this.loading = false;
    })

  }

  new(){
    this.router.navigate(['../create'], {relativeTo:this.activatedRoute});
  }

  edit(id: number) {
    this.router.navigate(['../edit'], {queryParams: { id: id }, relativeTo:this.activatedRoute });
  }

  view(id: number) {
    this.router.navigate(['../view'], { queryParams: { id: id } , relativeTo:this.activatedRoute });
  }

  onDeleteClick(id: number){
    this.confirmationService.confirm({
      message: 'Are you sure you want to delete the user?',
      header: 'Delete Confirmation',
      acceptIcon: 'icon-not-visible',
      rejectIcon: 'icon-not-visible',
      accept: () => {
        this.delete(id);
      },
      reject: () => { },
    });
  }

  delete(id: number){
    const u = this.userList.find(lp => lp.id  === id);
    
    if(u){
      this.deleteLoginProfile(u.loginProfile);
      u.status = RecordStatus.Deleted;
      this.serviceProxy.updateOneBaseUsersControllerUser(id, u)
        .subscribe(res => {
          this.load({rows: this.rows, first: 0});
          this.messageService.add({
            severity: 'success',
            summary: 'Success',
            detail: 'Deteled successfully',
            closable: true,
          });
        })
    }    
  }

  deleteLoginProfile(id: string){    
    //@ts-ignore
    this.loginProfileControllerServiceProxy.remove(id)
    .subscribe((res: any) => {
      console.log(res)
    })
  }

}
