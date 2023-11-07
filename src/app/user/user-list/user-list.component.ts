import { ServiceProxy, User, Institution, UsersControllerServiceProxy, UserType } from 'shared/service-proxies/service-proxies';
import { LoginProfileControllerServiceProxy } from 'shared/service-proxies/auth-service-proxies';
import decode from 'jwt-decode';
import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { ConfirmationService, LazyLoadEvent, MessageService, SelectItem } from "primeng/api";
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



  customers: User[];

  itemsPerPage: number = 0;
  userTypeSliceArray: any = [];

  searchText: string = '';
  searchEmailText: string;
  searchLastText: string;

  instuitutionList: Institution[];
  selctedInstuitution: Institution;

  userTypes: UserType[] = [];
  selctedUserType: UserType;

  searchBy: any = {
    text: null,
    usertype: null,
  };

  constructor(
    private serviceProxy: ServiceProxy,
    private cdr: ChangeDetectorRef,
    private confirmationService: ConfirmationService,
    private router: Router,
    private messageService: MessageService,
    private activatedRoute: ActivatedRoute,
    private userControllerService: UsersControllerServiceProxy,
    // private loginProfileControllerServiceProxy: LoginProfileControllerServiceProxy,

  ) { }

  ngAfterViewInit(): void {
    this.cdr.detectChanges();
  }

  ngOnInit(): void {

    const token = localStorage.getItem('ACCESS_TOKEN')!;
    const tokenPayload = decode<any>(token);
    const userTypeId = tokenPayload.role.id;

    this.serviceProxy
      .getManyBaseInstitutionControllerInstitution(
        undefined,
        undefined,
        undefined,
        undefined,
        ['name,ASC'],
        undefined,
        1000,
        0,
        0,
        0
      )
      .subscribe((res) => {
        this.instuitutionList = res.data;
      });

    this.serviceProxy
      .getManyBaseUserTypeControllerUserType(
        undefined,
        undefined,
        undefined,
        undefined,
        ['name,ASC'],
        undefined,
        1000,
        0,
        0,
        0
      )
      .subscribe((res) => {
        // this.userTypes = res.data;
        console.log(userTypeId)
        console.log(res)
        if (userTypeId == 1) {
          // this.userTypes = res.data.filter((a) => (a.id == 1 || a.id == 2 || a.id == 3 || a.id == 5 || a.id == 6 || a.id == 7 || a.id == 8 || a.id == 9 || a.id == 11));
          this.userTypes = res.data.filter((a) => (a.id == 5 ));
        }
        else if (userTypeId == 2) {
          this.userTypes = res.data.filter((a) => (a.id == 2));
        }
        else if (userTypeId == 3) {
          this.userTypes = res.data.filter((a) => (a.id == 2 || a.id == 3 || a.id == 5 || a.id == 6 || a.id == 7 || a.id == 8 || a.id == 9 || a.id == 11));
        }
        else if (userTypeId == 5) {
          this.userTypes = res.data.filter((a) => (a.id == 5 || a.id == 6 || a.id == 7 || a.id == 9 || a.id == 11));
        }
        else if (userTypeId == 6) {
          this.userTypes = res.data.filter((a) => (a.id == 6 || a.id == 8 || a.id == 9 ));
        }
        else if (userTypeId == 7) {
          this.userTypes = res.data.filter((a) => (a.id == 7));
        }
        else if (userTypeId == 8) {
          this.userTypes = res.data.filter((a) => (a.id == 8 || a.id == 9));
        }
        else if (userTypeId == 9) {
          this.userTypes = res.data.filter((a) => (a.id == 9));
        }
        else if (userTypeId == 10) {
          this.userTypes = res.data.filter((a) => (a.id ==1 || a.id == 2 || a.id == 3 || a.id == 5 || a.id == 6 || a.id == 7 || a.id == 8 || a.id == 9 || a.id == 10 || a.id == 11));
        }
        else if (userTypeId == 11) {
          this.userTypes = res.data.filter((a) => (a.id == 11));
        }
        else if (userTypeId == 12) {
          this.userTypes = res.data.filter((a) => (a.id == 12));
        }
      });

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
      ["status||$ne||" + RecordStatus.Deleted],
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

  // new(){
  //   this.router.navigate(['../create'], {relativeTo:this.activatedRoute});
  // }

  edit(id: number) {
    this.router.navigate(['../edit'], { queryParams: { id: id }, relativeTo: this.activatedRoute });
  }

  view(id: number) {
    this.router.navigate(['../view'], { queryParams: { id: id }, relativeTo: this.activatedRoute });
  }

  onDeleteClick(id: number) {
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

  delete(id: number) {
    const u = this.userList.find(lp => lp.id === id);

    if (u) {
      this.deleteLoginProfile(u.loginProfile);
      u.status = RecordStatus.Deleted;
      this.serviceProxy.updateOneBaseUsersControllerUser(id, u)
        .subscribe(res => {
          this.load({ rows: this.rows, first: 0 });
          this.messageService.add({
            severity: 'success',
            summary: 'Success',
            detail: 'Deteled successfully',
            closable: true,
          });
        })
    }
  }

  deleteLoginProfile(id: string) {
    //@ts-ignore
    this.loginProfileControllerServiceProxy.remove(id)
      .subscribe((res: any) => {
        console.log(res)
      })
  }
  onSearch() {
    let event: any = {};
    event.rows = this.rows;
    event.first = 0;

    this.loadCustomers(event);
  }
  loadCustomers(event: LazyLoadEvent) {
    console.log('loadCustomers===', event);
    this.loading = true;
    this.totalRecords = 0;

    let typeId = this.searchBy.userType ? this.searchBy.userType.id : 0;
    console.log('eventby filter...', this.searchBy.userType);
    let filterText = this.searchBy.text ? this.searchBy.text : '';

    let pageNumber =
      event.first === 0 || event.first == undefined
        ? 1
        : event.first / (event.rows == undefined ? 1 : event.rows) + 1;
    this.rows = event.rows == undefined ? 10 : event.rows;
    setTimeout(() => {
      this.userControllerService
        .allUserDetails(pageNumber, this.rows, filterText, typeId)
        .subscribe((a) => {
          this.customers = a.items;
          this.totalRecords = a.meta.totalItems;
          this.loading = false;
          this.itemsPerPage = a.meta.itemsPerPage;
          console.log('new cutomersss', a);
          console.log('total..', this.totalRecords);
        });
    }, 1);
  }
  editUser(user: User) {
    console.log('edit user', user);

    this.router.navigate(['app/user/create'], { queryParams: { id: user.id } });
  }

  viewUser(user: User) {

    this.router.navigate(['app/user/view-user'], { queryParams: { id: user.id } });
    console.log('hit', user.id);
  }

  EditUser(user: User) {
    console.log('hit');
    this.router.navigate(['/app/user/create'], { queryParams: { id: user.id } });
  }
  new() {
    this.router.navigate(['/app/user/create']);
  }

  onTypeChange(event: any) {
    this.searchBy.userType = event;
    console.log('selesct from drop down...', event);
    //console.log('loading.....');
    this.onSearch();
    //console.log('resualt.....', event);
  }


}
