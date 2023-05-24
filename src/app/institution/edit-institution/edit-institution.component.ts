import { Component, OnInit, ViewChild } from '@angular/core';
import { NgForm } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { ConfirmationService, MessageService } from 'primeng/api';
import { Institution, InstitutionCategory, InstitutionType, Sector, SectorControllerServiceProxy, ServiceProxy } from 'shared/service-proxies/service-proxies';

@Component({
  selector: 'app-edit-institution',
  templateUrl: './edit-institution.component.html',
  styleUrls: ['./edit-institution.component.css']
})
export class EditInstitutionComponent implements OnInit {

  isSaving: boolean = false;
  institution: Institution = new Institution();
  sectorList: Sector[] = [];
  typeList: InstitutionType[] = [];
  categoryList: InstitutionCategory[] = [];
  institutionId: number = 0;
  Deactivate:string = "Delete";

  rejectComment: string;
  rejectCommentRequried: boolean;
  selectedProject: Institution;
  @ViewChild('op') overlay: any;

  constructor(private serviceProxy: ServiceProxy,
    private confirmationService: ConfirmationService,
    private route: ActivatedRoute,
    private router: Router,
    private messageService: MessageService,
    private sectorProxy:SectorControllerServiceProxy) { }


    OnShowOerlay() {
      this.rejectComment = '';
      this.rejectCommentRequried = false;
    }

  ngOnInit(): void {


    this.serviceProxy
    .getManyBaseInstitutionTypeControllerInstitutionType(
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
    ).subscribe((res: any) => {
      this.typeList = res.data;
      console.log("typeList",this.typeList)
    });

    this.serviceProxy
    .getManyBaseInstitutionCategoryControllerInstitutionCategory(
      undefined,
      undefined,
      undefined,
      undefined,
      undefined,
      undefined,
      1000,
      0,
      0,
      0
    ).subscribe((res: any) => {
      console.log("category",res)
      this.categoryList = res.data;
    });

    this.sectorProxy
    .findAllSector(
     
    ).subscribe((res: any) => {
      this.sectorList = res;
      console.log('sector........',res)
    });

  this.route.queryParams.subscribe((params) => {
    this.institutionId = params['id'];
    this.serviceProxy
    .getOneBaseInstitutionControllerInstitution(
      this.institutionId,
      undefined,
      undefined,
      0
    ).subscribe((res) => {
      this.institution = res;
      console.log('rrrr',res);
    })
  })


  }
  saveForm(formData: NgForm) {

     if (formData.valid) {

      console.log("form validated")

    let sector = new Sector();
    sector.id = this.institution.sector?.id;
    this.institution.sector = sector;


    if (this.institution.type) {
      let type = new InstitutionType();
      type.id = this.institution.type?.id;
      this.institution.type = type; 
    }

    if (this.institution.category) {
      let category = new InstitutionCategory();
      category.id = this.institution.category?.id;
      this.institution.category = category;
    }

    if (this.institution.id > 0) {
      console.log("********",this.institution)
      this.serviceProxy
        .updateOneBaseInstitutionControllerInstitution(this.institution.id, this.institution)
        .subscribe(
          (res) => {
            this.messageService.add({
              severity: 'success',
              summary: 'Success',
              detail:
              this.institution.name +
                  ' is updated successfully ' ,
            closable: true,
            
            });
            setTimeout(() => {
              this.onBackClick();    
            },2000);
            
            
          },
          (err) => {
            this.messageService.add({
              severity: 'error',
              summary: 'Error.',
              detail: 'Internal server error, please try again.',
              sticky: true,
            });
          }
        );
        
        console.log(formData);
      
    }}

    else{
      this.messageService.add({
        severity: 'error',
        summary: 'Error.',
        detail: 'Fill all the mandetory fields in correct format',
        sticky: true,
      });
    }
  } 

  


  onConfirm() {
    this.messageService.clear('c');
  }

  onReject() {
    this.messageService.clear('c');
  }

 

  onBackClick() {
    this.router.navigate(['/app/institutionlist']);
  }

  // view(institution: Institution){
  //   this.router.navigate(['institution'],{
  //     queryParams: {  id: institution.id }
  //   })
  // }

} 
