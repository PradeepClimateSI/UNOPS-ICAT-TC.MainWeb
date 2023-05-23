import { AfterViewInit, ChangeDetectorRef, Component, Input, OnInit, ViewChild } from '@angular/core';
import { NgForm } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { MessageService, ConfirmationService } from 'primeng/api';
import { AppService, LoginRole, RecordStatus } from 'shared/AppService';
import { UsersControllerServiceProxy, ServiceProxy, User, Institution, InstitutionControllerServiceProxy, UserTypeControllerServiceProxy, Country, InstitutionType, InstitutionCategory, UserType } from 'shared/service-proxies/service-proxies';
import { LoginProfile, LoginProfileControllerServiceProxy, ServiceProxy as authServiceProxy } from 'shared/service-proxies/auth-service-proxies';
import { UserDetailsFormComponent } from '../user-details-form/user-details-form.component';
import decode from 'jwt-decode';

@Component({
  selector: 'app-user-form',
  templateUrl: './user-form.component.html',
  styleUrls: ['./user-form.component.css']
})

export class UserFormComponent implements OnInit,AfterViewInit {
  temp1: string;
  temp2: string;
  temp3: string;

  user: User = new User();
  userInstitution:Institution;
  userTypes: any[] = [];
  selectedUserTypesFordrop: UserType[] = [];
  selecteduserType: any = {};

  sss: any = {
    ae_createdBy: null,
    ae_createdOn: null,
    ae_description: "MRV Admin",
    ae_editedBy: null,
    ae_editedOn: null,
    ae_id: 4,
    ae_name: "MRV Admin",
    ae_sortOrder: 4,
    ae_status: 0,
    int_institutionTypeId: 2,
    int_userTypeId: 4
  }

  institutions: Institution[] = [];

  userTitles: { id: number; name: string }[] = [
    { id: 1, name: 'Mr.' },
    { id: 2, name: 'Mrs.' },
    { id: 3, name: 'Ms.' },
    { id: 4, name: 'Dr.' },
    { id: 5, name: 'Professor' },
  ];
  selecteduserTitle: { id: number; name: string };

  isNewUser: boolean = true;
  editUserId: number;
  isEmailUsed: boolean = false;
  usedEmail: string = '';

  alertHeader: string = 'User';
  alertBody: string;
  showAlert: boolean = false;

  coreatingUser: boolean = false;
  countryId: number;
  sectorId: number;
  userRole: string;

  constructor(
    private serviceProxy: ServiceProxy,
    private route: ActivatedRoute,
    private messageService: MessageService,
    private router: Router,
    private confirmationService: ConfirmationService,
    private UserTypeServiceProxy: UserTypeControllerServiceProxy,
    private instProxy: InstitutionControllerServiceProxy,
    private userController: UsersControllerServiceProxy,
    private authUser: LoginProfileControllerServiceProxy,
    private authServiceProxy: authServiceProxy,
    private ref: ChangeDetectorRef
  ) { }
  ngAfterViewInit(): void {
    this.ref.detectChanges();
  }

  ngOnInit(): void {

    console.log("ngonitit")
    // const token = localStorage.getItem('access_token')!;
    // console.log("token",token)

    const token = localStorage.getItem('ACCESS_TOKEN')!;
    const tokenPayload = decode<any>(token);
    const username = tokenPayload.usr;
    console.log('username=========', tokenPayload);


    //  const tokenPayload = token ? decode<any>(token):'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c3IiOiJzZWN0b3JhZG1pbjJAY2xpbWF0ZXNpLmNvbSIsImZuYW1lIjoiTWFkaHV3YW50aGEiLCJsbmFtZSI6IkhpbmRhZ29kYSIsImNvdW50cnlJZCI6MSwiaW5zdE5hbWUiOiJUcmFuc3BvcnQgTWluaXN0cnkiLCJtb2R1bGVMZXZlbHMiOlsxLDEsMSwxLDFdLCJzZWN0b3JJZCI6MSwicm9sZXMiOlsiU2VjdG9yIEFkbWluIl0sImlhdCI6MTY3ODE3MzM4MiwiZXhwIjoxNjc5MDM3MzgyfQ.0bpc5Jm3TxUhoOU8sNwnLGRtsonGAY4et1O2PlmicGA';
    this.countryId = tokenPayload.countryId;

    let country = new Country()
    country.id = this.countryId;
    // country.id=2;
    this.sectorId = tokenPayload.sectorId;
    this.userRole = tokenPayload.role[0]
    console.log("user role..", this.userRole)

    this.user.userType = undefined!;
    this.user.mobile = '';
    this.user.landline = '';
    //this.user.country=country;

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
            console.log('getUser====', res);
            //  this.onInstitutionChange2(res);
            //this.selecteduserType =
            this.onInstitutionChange2(res);
            this.user = res;
            this.selecteduserType = {
              "ae_name": this.user.userType.description,
              "ae_id": this.user.userType.id
            }

                                     
            this.selectedUserTypesFordrop.push(this.selecteduserType)
            console.log( "selectedUserTypesFordrop",this.selectedUserTypesFordrop )

          });
      }
    });
    console.log('working');
    this.UserTypeServiceProxy.getUserTypes().subscribe((res: any) => {
      this.userTypes = res;
    });

    this.instProxy.getAllInstitutions().subscribe((res: any) => {
      console.log('institutions res ============', res);
      this.institutions = res;
    });



    this.instProxy.getInstitutionForManageUsers(0, 0)
      .subscribe((res) => {
        console.log('institutions res ============', res);
        this.institutions = res.items;

        if (this.user?.institution) {
          this.institutions.forEach((ins: Institution) => {
            if (ins.id == this.user.institution.id) {
              let cat = ins.category;
              let type = ins.type;
              ins.category = new InstitutionCategory(cat)
              ins.type = new InstitutionType(type)
              let _ins = new Institution(ins)
              console.log(_ins)
              this.user.institution = _ins;
              console.log('ins set =======================');
            }
          });
        }
        console.log('institutions============', this.institutions);

        if (this.userRole == 'Data Collection Team') {
          this.institutions = this.institutions.filter((o) => o.country.id == this.countryId && o.sectorId == this.sectorId && o.type.id == 3);
        }


      });
  }

  onChangeUser(event: any) {
    //console.log(event);
    // this.user.title = event.value?.name;
  }

  async saveUser(userForm: NgForm) {
    console.log('userForm================', userForm);


    if (userForm.valid) {
      if (this.isNewUser) {
        this.isEmailUsed = false;
        this.usedEmail = '';

        /*  let tempUsers = await this.serviceProxy
           .getManyBaseUsersControllerUser(
             undefined,
             undefined,
             ['email||$eq||' + this.user.email],
             undefined,
             ['firstName,ASC'],
             ['institution'],
             1,
             0,
             0,
             0
           )
           .subscribe((res) => {
             if (res.data.length > 0) {
               this.isEmailUsed = true;
               this.usedEmail = res.data[0].email;
              
               this.messageService.add({
                 severity: 'error',
                 summary: 'Error.',
                 detail: 'Email address is already in use, please select a diffrent email address to create a new user.!',
                 sticky: true,
               });
             } else { */
        // create user
        this.user.username = this.user.email;
        this.user.status = 0;
        // this.user.status = 1;
        console.log("userd", this.selecteduserType)
        let userType = new UserType;
        userType.init(this.selecteduserType)
        this.user.userType = userType;
        //  userType =this.selecteduserType;
        // this.user.userType.id = userType.id;

        let insTemp = this.user.institution;
        this.user.institution = new Institution();
        this.user.institution.id = insTemp.id;
        this.coreatingUser = true;
        console.log("userd", this.user)

        let authUser = new LoginProfile();
        authUser.userName = this.user.email;
        // authUser.password = res.password;
        // authUser.salt = res.salt;
        authUser.userType = this.selecteduserType;
        authUser.coutryId = this.countryId;
        authUser.insId = this.user.institution.id;


        this.authServiceProxy.createOneBaseLoginProfileControllerLoginProfile(authUser).subscribe(
          (res) => {
            console.log(res)
            this.user.loginProfile =res.id;
            this.user.password = res.password;
            this.user.salt=res.salt;
            this.userController
              .create(this.user)
              .subscribe(
                (res) => {
                  console.log(res)


                  this.messageService.add({
                    severity: 'success',
                    summary: 'Success',
                    detail: 'User is created successfully!',
                    closable: true,
                  });
                },
                (error) => {
                  this.coreatingUser = false;
                  this.messageService.add({
                    severity: 'error',
                    summary: 'Error',
                    detail: 'An error occurred, please try again.',
                    closable: true,
                  });
                },
                () => {
                  this.coreatingUser = false;
                }
              );
          }
        )






        // setTimeout(() => {
        //   this.onBackClick();    
        // },1000);
        /*  }
       }); */

        // this.serviceProxy.createOneBaseUserv2ControllerUser(this.user).subscribe(res => {
        //   alert("User created !");
        //   //this.DisplayAlert('User created !', AlertType.Message);

        //   console.log("edit user", res.id);

        //   this.router.navigate(['/user'], { queryParams: { id: res.id } });

        // }, error => {
        //   alert("An error occurred, please try again.")
        //   // this.DisplayAlert('An error occurred, please try again.', AlertType.Error);

        //   console.log("Error", error);
        // });
      } else {
        console.log("update",this.user.id, this.user)
        // this.user.institution =new Institution()

        let userType = new UserType;
        userType.init(this.selecteduserType)
        this.user.userType = userType;

        let institute = new Institution;
        institute.init(this.userInstitution)
        this.user.institution = institute;
        this.serviceProxy
          .updateOneBaseUsersControllerUser(this.user.id, this.user)
          .subscribe(
            (res) => {
              // this.confirmationService.confirm({
              //   message: 'User is updated successfully!',
              //   header: 'Confirmation',
              //   //acceptIcon: 'icon-not-visible',
              //   rejectIcon: 'icon-not-visible',
              //   rejectVisible: false,
              //   acceptLabel: 'Ok',
              //   accept: () => {
              //     // this.onBackClick();
              //   },

              //   reject: () => {},
              // });
              this.messageService.add({
                severity: 'success',
                summary: 'Success',
                detail: 'Successfully Updated User',
                closable: true,
              });
              setTimeout(() => {
                this.router.navigate(['/app/user/list']);
              },1000);
      
              
            },
            (error) => {
              this.messageService.add({
                severity: 'error',
                summary: 'Error',
                detail: 'An error occurred, please try again.',
                closable: true,
              });
              // this.DisplayAlert('An error occurred, please try again.', AlertType.Error);

              console.log('Error', error);
            }
          );
        // setTimeout(() => {
        //   this.onBackClick();
        // },1000);
      }
    }
    else {
      this.messageService.add({
        severity: 'error',
        summary: 'Error',
        detail: 'Fill all the mandetory fields',
        closable: true,
      });
    }
  }

  onBackClick() {
    this.router.navigate(['/app']);
  }

  onDeleteClick() {
    this.confirmationService.confirm({
      message: 'Are you sure you want to delete the user?',
      header: 'Delete Confirmation',
      acceptIcon: 'icon-not-visible',
      rejectIcon: 'icon-not-visible',
      accept: () => {
        this.deleteUser();
      },
      reject: () => { },
    });
    // this.router.navigate(['/user-list']);
  }

  deleteUser() {
    this.serviceProxy
      .deleteOneBaseUsersControllerUser(this.user.id)
      .subscribe((res) => {
        //this.DisplayAlert('Deleted successfully.', AlertType.Message);
        // this.confirmationService.confirm({
        //   message: 'User is deleted successfully!',
        //   header: 'Delete Confirmation',
        //   //acceptIcon: 'icon-not-visible',
        //   rejectIcon: 'icon-not-visible',
        //   rejectVisible: false,
        //   acceptLabel: 'Ok',
        //   accept: () => {
        //     this.onBackClick();
        //   },

        //   reject: () => {},
        // });
        this.messageService.add({
          severity: 'success',
          summary: 'Success',
          detail: 'Delete deactivated user',
          closable: true,
        });
      });
  }


  async onInstitutionChange(event: any) {
    console.log('event====1', event);

    let tempList = this.userTypes

    //in here check if there are any users  for inst type 1,2,3 for that certent country

    // if(event.type.id==1){
    //   let res= await this.instProxy.getInstitutionForUsers(event.id,3).toPromise()
    // }


    if (event.type.id == 2) {
      let res = await this.instProxy.getInstitutionForUsers(event.id, 3).toPromise()

      if (res == 1) {

        tempList = tempList.filter((a) => a.ae_name != "Sector Admin")
      }
    }
    else if (event.type.id == 3) {

      let res = await this.instProxy.getInstitutionForUsers(event.id, 8).toPromise();

      if (res == 1) {
        tempList = tempList.filter((a) => a.ae_name != "Institution Admin")
      }
    }

    if (this.userRole === "Institution Admin") {
      this.selectedUserTypesFordrop = tempList.filter((a) => a.ae_name === "Data Entry Operator")
      // console.log(this.userTypes)
    }
    else {

      this.selectedUserTypesFordrop = tempList.filter(
        (a) => a.int_institutionTypeId === event.type.id
      );



    }

    console.log('eventtypeID===', event.type.id);
    console.log('selectedUserTypesFordrop=====', this.selectedUserTypesFordrop);

  }

  onInstitutionChange2(aaa: any) {
    console.log('event====', aaa.institution);


    this.selectedUserTypesFordrop = this.userTypes.filter(
      (a) => a.int_institutionTypeId === 1//aaa.institution.type.id
    );
    console.log('eventtypeID===', aaa.institution.type.id);
    console.log('selectedUserTypesFordrop=====', this.selectedUserTypesFordrop);

  }

}

