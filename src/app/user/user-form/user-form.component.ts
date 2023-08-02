import { AfterViewInit, ChangeDetectorRef, Component, Input, OnInit, ViewChild } from '@angular/core';
import { NgForm } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { MessageService, ConfirmationService } from 'primeng/api';
import { AppService, LoginRole, RecordStatus } from 'shared/AppService';
import { UsersControllerServiceProxy, ServiceProxy, User, Institution, InstitutionControllerServiceProxy, UserTypeControllerServiceProxy, Country, InstitutionType, InstitutionCategory, UserType, CountryControllerServiceProxy } from 'shared/service-proxies/service-proxies';
import { CreateManyUserTypeDto, LoginProfile, UserType as AuthUserType, LoginProfileControllerServiceProxy, ServiceProxy as authServiceProxy } from 'shared/service-proxies/auth-service-proxies';
import { UserDetailsFormComponent } from '../user-details-form/user-details-form.component';
import decode from 'jwt-decode';

@Component({
  selector: 'app-user-form',
  templateUrl: './user-form.component.html',
  styleUrls: ['./user-form.component.css']
})

export class UserFormComponent implements OnInit, AfterViewInit {
  temp1: string;
  temp2: string;
  temp3: string;

  user: User = new User();
  userInstitution: Institution;
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
  country: Country = new Country();

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
    private countryProxy: CountryControllerServiceProxy,
    private ref: ChangeDetectorRef
  ) { }
  ngAfterViewInit(): void {
    this.ref.detectChanges();
  }

  ngOnInit(): void {


    const token = localStorage.getItem('ACCESS_TOKEN')!;
    const tokenPayload = decode<any>(token);
    const username = tokenPayload.usr;

 this.countryId = tokenPayload.countryId;
    this.countryProxy.getCountrySector(this.countryId).subscribe((res: any) => {
      this.country = res;
    });

    let country = new Country()
    country.id = this.countryId;
    this.sectorId = tokenPayload.sectorId;
    this.userRole = tokenPayload.role.code

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
            this.onInstitutionChange2(res);
            this.user = res;
            this.selecteduserType = {
              "ae_name": this.user.userType.description,
              "ae_id": this.user.userType.id
            }


          });
      }
    });
    console.log('working');
    this.UserTypeServiceProxy.getUserTypes().subscribe((res: any) => {
      this.userTypes = res;
    });

    this.instProxy.getInstitutionForManageUsers(0, 0)
      .subscribe((res) => {
        this.institutions = res.items;

        if (this.user?.institution) {
          this.institutions.forEach((ins: Institution) => {
            if (ins.id == this.user.institution.id) {
              let cat = ins.category;
              let type = ins.type;
              ins.category = new InstitutionCategory(cat)
              ins.type = new InstitutionType(type)
              let _ins = new Institution(ins)
              this.user.institution = _ins;
            }
          });
        }

        if (this.userRole == 'Data Collection Team') {
          this.institutions = this.institutions.filter((o) => o.country.id == this.countryId && o.sectorId == this.sectorId && o.type.id == 3);
        }


      });
  }

  onChangeUser(event: any) {
  }

  async saveUser(userForm: NgForm) {
    console.log('userForm================', userForm);


    if (userForm.valid) {
      if (this.isNewUser) {
        this.isEmailUsed = false;
        this.usedEmail = '';

        this.user.username = this.user.email;
        this.user.status = 0;

        let userType = new UserType;
        userType.init(this.selecteduserType);


        this.user.country = new Country();
        this.user.country.id =this.countryId;
        this.user.userType = new UserType();
        this.user.userType.id = this.selecteduserType.id;

        let insTemp = this.user.institution;
        this.user.institution = new Institution();
        this.user.institution.id = insTemp.id;
        this.coreatingUser = true;

        let authUser = new LoginProfile();
        authUser.userName = this.user.email;
        let authUserType = new AuthUserType;
        authUserType.id = this.selecteduserType.id;
        authUser.userType = authUserType;
        authUser.coutryId = this.countryId;
        authUser.insId = this.user.institution.id;


        this.authServiceProxy.createOneBaseLoginProfileControllerLoginProfile(authUser).subscribe(
          (res) => {
            let sa
            this.authUser.getById(res.id).subscribe((res) => {

            })
            this.user.loginProfile = res.id;
            this.user.password = res.password;
            this.user.salt = res.salt;
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

      } else {
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
              }, 1000);


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
    console.log('event====1', event.type.id, this.userRole);
    let tempList = this.userTypes
    if (event.type.id == 1) {
      this.selectedUserTypesFordrop = tempList.filter((a) => (a.id == 2))
    }
    if (event.type.id == 3) {
      this.selectedUserTypesFordrop = tempList.filter((a) => (a.id == 8 || a.id == 9))
    }
    else if (event.type.id == 2) {
      this.selectedUserTypesFordrop = tempList.filter((a) => (a.id == 2 || a.id == 3 || a.id == 4 || a.id == 5 || a.id == 6 || a.id == 7))

    }
    if (event.type.id == 4) {
      this.selectedUserTypesFordrop = tempList.filter((a) => (a.id == 5))
    }
    if (event.type.id == 5) {
      this.selectedUserTypesFordrop = tempList.filter((a) => (a.id == 6))
    }
    if (event.type.id == 6) {
      this.selectedUserTypesFordrop = tempList.filter((a) => (a.id == 7))
    }

    console.log('eventtypeID===', tempList);
    console.log('eventtypeID===', event.type.id);
    console.log('selectedUserTypesFordrop=====', this.selectedUserTypesFordrop);
  }

  onInstitutionChange2(aaa: any) {
    let ty=[];
    console.log('event====', aaa.institution);
    console.log('selectedUserTypesFordrop=====', this.selectedUserTypesFordrop);

    let tempList = this.userTypes
    if (aaa.institution.type.id == 1) {
      ty = tempList.filter((a) => (a.id == 2))
    }
    if (aaa.institution.type.id == 3) {
      ty = tempList.filter((a) => (a.id == 8 || a.id == 9))
    }
    else if (aaa.institution.type.id == 2) {
      ty = tempList.filter((a) => (a.id == 2 || a.id == 3 || a.id == 5 || a.id == 6 || a.id == 7))
    }
    if (aaa.institution.type.id == 5) {
      ty = tempList.filter((a) => (a.id == 6))
    }
    if (aaa.institution.type.id == 6) {
      ty= tempList.filter((a) => (a.id == 7))
    }

    this.selectedUserTypesFordrop= ty   
    console.log('selectedUserTypesFordrop=====', this.selectedUserTypesFordrop);

  }

}

