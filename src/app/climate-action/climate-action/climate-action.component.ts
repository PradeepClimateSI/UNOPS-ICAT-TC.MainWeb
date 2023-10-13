import { AfterContentChecked, ChangeDetectorRef, Component, ElementRef, OnChanges, OnInit, SimpleChanges, ViewChild } from '@angular/core';
import { NgForm } from '@angular/forms';
import { Location } from '@angular/common';
import { } from 'googlemaps';
import {
  //CaActionHistory,
  Country,
  Documents,
  DocumentsDocumentOwner,
  FinancingScheme,
  Institution,
  AggregatedAction as Ndc,
  NdcControllerServiceProxy,
  ClimateAction as Project,
  ProjectApprovalStatus,
  ProjectControllerServiceProxy,
  ProjectOwner,
  ProjectStatus,
  Sector,
  ServiceProxy,
  ActionArea as SubNdc,
  User,
  SectorControllerServiceProxy,
  UsersControllerServiceProxy,
  Barriers,
  AssessmentControllerServiceProxy,
  MethodologyAssessmentControllerServiceProxy,
  Category,
  BarriersCategory,
  PolicyBarriers,
  CountryControllerServiceProxy,
  AggregatedAction,
  ActionArea,
  Characteristics,
  PolicySector,
  DocumentControllerServiceProxy,
  DocOwnerUpdateDto,
  AllBarriersSelected,
  BarrierSelected,
  AllPolicySectors

} from 'shared/service-proxies/service-proxies';
import { ConfirmationService, ConfirmEventType, MessageService } from 'primeng/api';
import { ActivatedRoute, Router } from '@angular/router';
import * as moment from 'moment';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';
import decode from 'jwt-decode';
import { Token } from '@angular/compiler';
import { MasterDataService } from 'app/shared/master-data.service';
import { GlobalArrayService } from 'app/shared/global-documents/global-documents.service';

/// <reference types="googlemaps" />

@Component({
  selector: 'app-climate-action',
  templateUrl: './climate-action.component.html',
  styleUrls: ['./climate-action.component.css']
})
export class ClimateActionComponent implements OnInit  {
  isSaving: boolean = false;
  project: Project = new Project();
  policyBar: PolicyBarriers[] = [];
  selectedcitie: any = {};
  ndcList: Ndc[];
  SubndcList: SubNdc[] = [];
  options: any;
  relatedItem: Project[] = [];
  exsistingPrpject: boolean = false;
  countryList:Country[]= [];
  projectOwnerList: ProjectOwner[] = [];
  projectStatusList: ProjectStatus[] = [];
  sectorList: Sector[] = [];
  financingSchemeList: FinancingScheme[] = [];
  documents: Documents[] = [];
  documentsDocumentOwner: DocumentsDocumentOwner =
    DocumentsDocumentOwner.Project;
  editEntytyId: number = 0;
  anonymousEditEntytyId: number = 0;
  documentOwnerId: number = 0;
  proposeDateofCommence: any ='';
  dateOfCompletion: any='';
  dateOfImplementation:any='';

  isLoading: boolean = false;
  isDownloading: boolean = true;
  isDownloadMode: number = 0;
  flag: number = 0;
  isCity: number = 0;
  isMapped: number;
  likelyHood: number;
  isLikelyhoodFromDb: number;
  isPoliticalPreferenceFromDb: number;
  isFinancialFeciabilityFromDb: number;
  isAvailabiltyOfTEchFromDb: number;
  isPoliticalPreference: number = 1;
  isFinancialFeciability: number = 1;
  isAvailabiltyOfTEch: number = 1;
  selectedProject: Project;
  originalNdc: string = '';
  originalSubNdc: string = '';
  commentForJustification: string = '';
  originalApprovalStatus: string = '';
  updatedApprovalStatus: string = '';
  historyList: any[] = [];
  ndcupdatehistoryList: any[] = [];
  statusupdatehistoryList: any[] = [];
  proposedDate: string = '';
  isActionButtonSectionEnabled: boolean = false;
  userName: string = '';
  drCommentRequried: boolean;
  drComment: string;
  rejectCommentRequried: boolean;
  rejectComment: string;
  loggedUser: User;
  fullname: string = '';
  isGHG: number = 0;
  selectedApproch: string;
  barriers: Barriers[];
  setbarriers: any[] = [];
  selectbarriers: any;
  category: BarriersCategory[];
  selectCategory: any;
  approachList: string[] = ['AR1', 'AR2', 'AR3', 'AR4', 'AR5'];
  typeofAction: string[] = ['Investment','Carbon Market','Other Interventions']
  levelOfImplementation: any[] = [];
  characteristicsList: Characteristics[] = [];
  
  barrierBox:boolean=false;

  barrierSelected:BarrierSelected= new BarrierSelected();
  finalBarrierList :BarrierSelected[]=[];

  policySectorArray:PolicySector[]=[]
  sectornames:any[]=[];
  barrierArray:PolicyBarriers[]
  sectorsJoined :string='';

  finalSectors:Sector[]=[]
  userRole:any='';
  isExternalUser:boolean=false;
  showUpload:boolean=true;
  showDeleteButton:boolean=true

  proposingUser:User

  // institutionList: Institution[] = [];
  // institutionTypeID: number = 3;
  // selectedInstitution: Institution;
  selectedDocuments: Documents[] = [];
  counID: number;
  a = this.project.otherRelatedActivities
  isSector: boolean = false;
  loadingCountry:boolean = false
  loadProjectStatus:boolean = false
  @ViewChild('gmap') gmap: any;
  @ViewChild('op') overlay: any;
  @ViewChild('opDR') overlayDR: any;
  projectApprovalStatus: ProjectApprovalStatus[];
  overlays: any[];

  title = 'htmltopdf';
  wid: number;
  hgt: number;
  textdlod: any = 'Downloaded date ' + moment().format('YYYY-MM-DD HH:mm:ss');

  getUserEnterdCountry: any = '';
  disbaleNdcmappedFromDB: number;
  @ViewChild('pdfTable') pdfTable: ElementRef;
  lastId: any;
  int_id_sectors='Sector';
  int_id_year='YYYY';
  int_id_country='Country';
  constructor(
    private serviceProxy: ServiceProxy,
    private countryProxy: CountryControllerServiceProxy,
    private confirmationService: ConfirmationService,
    private router: Router,
    private route: ActivatedRoute,
    private location: Location,
    private messageService: MessageService,
    private projectProxy: ProjectControllerServiceProxy,
    private sectorProxy: SectorControllerServiceProxy,
    private ndcProxy: NdcControllerServiceProxy,
    private asses: MethodologyAssessmentControllerServiceProxy,
    private cdref: ChangeDetectorRef ,
    private masterDataService: MasterDataService,
    private docArrayforSave:GlobalArrayService,
    private docService: DocumentControllerServiceProxy,
    private userproxy:UsersControllerServiceProxy,
    
  ) // private usersControllerServiceProxy: UsersControllerServiceProxy,
  // private ndcProxy:NdcControllerServiceProxy
  { }
  ngAfterContentChecked() {
    
    this.cdref.detectChanges();
 }

  async ngOnInit(): Promise<void> {

    // this.project=new Project()
    this.levelOfImplementation = this.masterDataService.level_of_implemetation;
    const token = localStorage.getItem('ACCESS_TOKEN')!;
    console.log("token--------",decode<any>(token)) 
    this.userRole =decode<any>(token).role?.code
    console.log("role",this.userRole)
    const countryId = token ? decode<any>(token).countryId : 0;
    console.log("country", countryId)
    this.counID = countryId;
 ;
    let filterUser: string[] = [];
    filterUser.push('username||$eq||' + this.userName);
    // let initialCountry= new Country()
    // initialCountry.name=''
    // this.project.country= initialCountry;

    if (countryId > 0) {
      // this.sectorProxy.getSectorDetails(1,100,'').subscribe((res:any) =>{
      //   console.log("++++", res)
      //   res.items.forEach((re:any)=>{
          
      //     if(re.id !=6){
      //       this.sectorList.push(re)
      //     }
      //   })
      // })
      this.sectorProxy.getCountrySector(countryId).subscribe((res: any) => {
        this.sectorList = res;
   
      });
    } // countryid = 0
    this.asses.findAllBarriers().subscribe((res: any) => {
      this.barriers = res;
    })

    this.asses.findByAllCategories().subscribe((res: any) => {
      this.category = res;
    })

    
 
    this.asses.findAllCharacteristics().subscribe((res3: any) => {
      // console.log("ressss3333", res3)
      this.characteristicsList = res3
      // console.log("ressss3333", this.characteristicsList)

    });

    this.userName = localStorage.getItem('USER_NAME')!
    this.userproxy.findUserByEmail(this.userName).subscribe((res3: any) => {
      // console.log("ressss3333", res3)
      this.proposingUser = res3
      console.log("ressss3333", this.proposingUser)

    });

     await this.projectProxy.getLastID().subscribe(async (res: any) => {
      // console.log("iddd : ", res)
      this.lastId = (res[0].id +1).toString().padStart(5, '0');
       console.log("iddd : ", this.lastId)
     });
    // this.countryProxy.getCountry(this.counID).subscribe((res:any)=>{
    //   console.log('++++++++++++++++',res)
    //   this.countryList.push(res);
    //   this.project.country =res

    //   console.log('++++++++++++++++',this.countryList)
    //   this.isSector = true;
      
    // })

    // this.serviceProxy
    //   .getManyBaseUsersControllerUser(
    //     undefined,
    //     undefined,
    //     filterUser,
    //     undefined,
    //     ['editedOn,DESC'],
    //     undefined,
    //     1000,
    //     0,
    //     0,
    //     0
    //   )
    //   .subscribe((res: any) => {
    //     this.loggedUser = res.data[0];
    //     this.fullname =
    //       this.loggedUser.firstName + ' ' + this.loggedUser.lastName;
    //     // console.log("this.loggedUser...",this.fullname)
    //   });

    this.route.queryParams.subscribe((params) => {
    
      this.editEntytyId = 0;
      this.anonymousEditEntytyId = 0;
      this.documentOwnerId = 0;
      this.editEntytyId = params['id'];
      this.anonymousEditEntytyId = params['anonymousId'];
      console.log("5555555",this.editEntytyId,this.anonymousEditEntytyId)
      if (this.editEntytyId > 0) {
        this.documentOwnerId = this.editEntytyId;
      } else if (this.anonymousEditEntytyId > 0) {
        this.documentOwnerId = this.anonymousEditEntytyId;
      }

      this.flag = params['flag'];
      if (this.flag == 1) {
        this.isDownloading = false;
        console.log("flag", this.flag, "this.editEntytyId", this.editEntytyId)

      }else{
        // console.log("............")
        
        this.project=new Project();
        this.showUpload=true
        this.showDeleteButton=true
        this.serviceProxy
        .getOneBaseCountryControllerCountry(
          countryId,
          undefined,
          undefined,
          undefined
        )
        .subscribe((res) => {
          // console.log("sss",res)
          this.countryList.push(res)
          console.log("this.countryList",this.countryList)
          if(this.userRole=='External'){
            this.isExternalUser=true
            console.log("external user")
           this.countryProxy.findall().subscribe((res) => {
            console.log("country",res)
            this.countryList=res;
            this.project.country= new Country()
            this.project.projectApprovalStatus = new ProjectApprovalStatus()
            this.loadingCountry =true
          })
          }else{
            this.project.country =res;
            this.isSector = true;
            this.loadingCountry =true
          }
          
          // console.log('tokenPayloadmasssge',res);
        });
        this.proposeDateofCommence=''
        this.dateOfImplementation =''
        this.dateOfCompletion =''
      }
    });

    if (countryId) {
      this.serviceProxy
        .getOneBaseCountryControllerCountry(
          countryId,
          undefined,
          undefined,
          undefined
        )
        .subscribe((res) => {
          if(this.userRole=='External'){
            this.isExternalUser=true
            console.log("external user")
            this.int_id_country='External'
            this.makeInterventionID();
          }else{
            console.log("sss",res)
          this.countryList.push(res)
          console.log("this.countryList",this.countryList)
          this.project.country =res;
          this.isSector = true;
          this.int_id_country =res.code;
          this.makeInterventionID();
          }
          
          // console.log('tokenPayloadmasssge',res);
        });
    } else {
      this.project.country = new Country();
      console.log("pr", this.project)   // working
    }
    // this.project.country = new Country();

    this.options = {
      center: { lat: 18.7322, lng: 15.4542 },
      zoom: 2,
    };

    this.project.longitude = 0.0;
    this.project.latitude = 0.0;

    let countryaFilter: string[] = new Array();

    countryaFilter.push('country.id||$eq||' + 1);
    // this.serviceProxy
    //   .getManyBaseProjectControllerProject(
    //     undefined,
    //     undefined,
    //     countryaFilter,
    //     undefined,
    //     ['climateActionName,ASC'],
    //     ['country'],
    //     1000,
    //     0,
    //     0,
    //     0
    //   )
    //   .subscribe((res: any) => {
    //     console.log('***************************');
    //     console.log(res.data);
    //   });
    // this.countryProxy.findall().subscribe((res:any)=>{
    //   this.countryList=res;
    // })

    // this.serviceProxy
    //   .getManyBaseCountryControllerCountry(
    //     undefined,
    //     undefined,
    //     undefined,
    //     undefined,
    //     ['name,ASC'],
    //     undefined,
    //     1000,
    //     0,
    //     0,
    //     0
    //   )
    //   .subscribe((res: any) => {

    //     this.countryList = res.data;
    //     console.log("countrylist all",this.countryList) //  working
    //   });


    this.serviceProxy
      .getManyBaseProjectOwnerControllerProjectOwner(
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
      .subscribe((res: any) => {
        this.projectOwnerList = res.data;
        // console.log("projectOwnerList all", this.projectOwnerList) //  working
      });

    this.serviceProxy
      .getManyBaseProjectStatusControllerProjectStatus(
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
      .subscribe((res: any) => {
        this.projectStatusList = res.data;
        // console.log("projectStatusList all", this.projectOwnerList) //  working
      });

        console.log("editEntytyId",this.editEntytyId)

        // if (token && this.editEntytyId && this.editEntytyId > 0) {
        if (this.editEntytyId && this.editEntytyId > 0) {
          console.log("woorking")
          this.showUpload=false;
          this.showDeleteButton=false;
          this.serviceProxy
            .getOneBaseProjectControllerClimateAction(
              this.editEntytyId,
              undefined,
              undefined,
              0
            )
            .subscribe(async (res1) => {
              console.log("project",res1)
              this.project = res1;
              this.loadProjectStatus= true
              this.loadingCountry= true
              
              // this.project.aggregatedAction = res1.aggregatedAction;
              // this.project.sector = res1.sector;
              // if(res1.subNationalLevl1||res1.subNationalLevl2||res1.subNationalLevl3){
              //   this.isCity =1
              // }
              this.isCity =res1.isCity;
              const latitude = parseFloat(this.project.latitude + '');
              const longitude = parseFloat(this.project.longitude + '');
              await this.addMarker(longitude, latitude);
              // console.log(latitude);
              // console.log(longitude);

             
              console.log('ths.project,,,..', this.project);
              this.likelyHood = this.project.likelyhood;
              this.isPoliticalPreference = this.project.politicalPreference;
              this.isFinancialFeciability = this.project.financialFecialbility;
              this.isAvailabiltyOfTEch = this.project.availabilityOfTechnology;
              this.originalApprovalStatus =
                this.project.projectApprovalStatus == undefined
                  ? 'Proposed'
                  : this.project.projectApprovalStatus?.description;
              this.proposedDate = this.project.proposeDateofCommence.toString();
              // this.isMapped = this.project?.isMappedCorrectly;
              // this.disbaleNdcmappedFromDB = this.project?.isMappedCorrectly;
              this.isLikelyhoodFromDb = this.project?.likelyhood;
              this.isPoliticalPreferenceFromDb =
                this.project?.politicalPreference;
              this.isFinancialFeciabilityFromDb =
                this.project?.financialFecialbility;
              this.isAvailabiltyOfTEchFromDb =
                this.project.availabilityOfTechnology;



              var sector = this.sectorList.find(
                (a) => a.id === this.project?.sector?.id
              );
              // this.project.sector = sector != undefined ? sector : new Sector();
              // console.log('this.project.sector...', this.project.sector);
              this.onSectorChange(true);
              this.proposeDateofCommence = new Date(
                this.project.proposeDateofCommence?.year(),
                this.project.proposeDateofCommence?.month(),
                this.project.proposeDateofCommence?.date()
              );
              // this.endDateofCommence = new Date(
              //   this.project.endDateofCommence.year(),
              //   this.project.endDateofCommence.month(),
              //   this.project.endDateofCommence.date()
              // );
              this.dateOfImplementation = new Date(
                this.project.dateOfImplementation?.year(),
                this.project.dateOfImplementation?.month(),
                this.project.dateOfImplementation?.date()
              );

              this.dateOfCompletion = new Date(
                this.project.dateOfCompletion?.year(),
                this.project.dateOfCompletion?.month(),
                this.project.dateOfCompletion?.date()
              );
              console.log("this.dateOfImplementation",this.dateOfImplementation, this.project.dateOfImplementation)

   

              this.isLoading = false;
              if (this.flag == 1) {
                //this.isDownloading = false;
                this.originalNdc = this.project.aggregatedAction?.name;
                this.originalSubNdc = this.project.actionArea?.name;
              }

              let histryFilter: string[] = new Array();
              histryFilter.push('project.id||$eq||' + this.project.id);

              this.projectProxy.findPolicyBarrierData(this.editEntytyId ).subscribe( (res) => {
                  this.barrierArray =res;
                   console.log("barriers",this.barrierArray)

                })
              this.projectProxy.findPolicySectorData(this.editEntytyId ).subscribe( (res) => {
                this.policySectorArray =res;
                for(let x of res){
                  this.sectornames.push(x.sector.name)
                }
                 this.sectorsJoined=this.sectornames.join(', ')
                //  console.log("sectors",this.policySectorArray, this.sectorsJoined)
                 })
              //console.log("id......",this.project.id)
              // this.serviceProxy
              //   .getManyBaseCaActionHistoryControllerCaActionHistory(
              //     undefined,
              //     undefined,
              //     histryFilter,
              //     undefined,
              //     ['createdOn,ASC'],
              //     undefined,
              //     1000,
              //     0,
              //     0,
              //     0
              //   )
              //   .subscribe((res: any) => {
              //     this.historyList = res.data;
              //     this.ndcupdatehistoryList = this.historyList.filter(
              //       (o) => o.isNdcAndSubNdc == 1
              //     );
              //     this.statusupdatehistoryList = this.historyList.filter(
              //       (o) => o.isApprovalAction == 1
              //     );
              //     console.log('this.historyList..', res.data);
              //   });
              setTimeout(() => {
                let map = this.gmap.getMap();
                this.updateMapBoundaries(map, longitude, latitude);
              }, 3000);
              

            });
        }
       

        //Anonymous form
        if (this.anonymousEditEntytyId && this.anonymousEditEntytyId > 0) {
          // this.serviceProxy
          //   .getOneBaseProjectControllerProject(
          //     this.anonymousEditEntytyId,
          //     undefined,
          //     undefined,
          //     0
          //   )
          // this.projectProxy
          //   .getProjectByIdAnonymous(this.anonymousEditEntytyId)
          //   .subscribe(async (res) => {
          //     this.project = res;
          //     const latitude = parseFloat(this.project.latitude + '');
          //     const longitude = parseFloat(this.project.longitude + '');
          //     await this.addMarker(longitude, latitude);
          //     // console.log(latitude);
          //     // console.log(longitude);

          //     let map = this.gmap.getMap();
          //     this.updateMapBoundaries(map, longitude, latitude);

          //     console.log('ths.project,,,..', this.project);
          //     this.likelyHood = this.project.likelyhood;
          //     this.isPoliticalPreference = this.project.politicalPreference;
          //     this.isFinancialFeciability = this.project.financialFecialbility;
          //     this.isAvailabiltyOfTEch = this.project.availabilityOfTechnology;
          //     this.originalApprovalStatus =
          //       this.project.projectApprovalStatus == undefined
          //         ? 'Propose'
          //         : this.project.projectApprovalStatus?.name;
          //     this.proposedDate = this.project.proposeDateofCommence.toString();
          //     this.isMapped = this.project?.isMappedCorrectly;
          //     this.disbaleNdcmappedFromDB = this.project?.isMappedCorrectly;
          //     this.isLikelyhoodFromDb = this.project?.likelyhood;
          //     this.isPoliticalPreferenceFromDb =
          //       this.project?.politicalPreference;
          //     this.isFinancialFeciabilityFromDb =
          //       this.project?.financialFecialbility;
          //     this.isAvailabiltyOfTEchFromDb =
          //       this.project.availabilityOfTechnology;
          //     var sector = this.sectorList.find(
          //       (a) => a.id === this.project?.sector?.id
          //     );
          //     // this.project.sector = sector != undefined ? sector : new Sector();
          //     // console.log('this.project.sector...', this.project.sector);
          //     // this.onSectorChange(true);
          //     // this.proposeDateofCommence = new Date(
          //     //   this.project.proposeDateofCommence.year(),
          //     //   this.project.proposeDateofCommence.month(),
          //     //   this.project.proposeDateofCommence.date()
          //     // );
          //     // this.endDateofCommence = new Date(
          //     //   this.project.endDateofCommence.year(),
          //     //   this.project.endDateofCommence.month(),
          //     //   this.project.endDateofCommence.date()
          //     // );
          //     this.project.climateActionName = '';
          //     this.project.telephoneNumber = '';

          //     if (countryId) {
          //       this.serviceProxy
          //         .getOneBaseCountryControllerCountry(
          //           countryId,
          //           undefined,
          //           undefined,
          //           undefined
          //         )
          //         .subscribe((res) => {
          //           this.project.country = res;
          //           this.isSector = true;
          //           this.getUserEnterdCountry = this.project.country;
          //         });
          //     } else {
          //       this.project.country = new Country();
          //     }

          //     this.isLoading = false;
          //     if (this.flag == 1) {
          //       //this.isDownloading = false;
          //       this.originalNdc = this.project.ndc?.name;
          //       this.originalSubNdc = this.project.subNdc?.name;
          //     }

          //     let histryFilter: string[] = new Array();
          //     histryFilter.push('project.id||$eq||' + this.project.id);
          //     //console.log("id......",this.project.id)
          //     this.serviceProxy
          //       .getManyBaseCaActionHistoryControllerCaActionHistory(
          //         undefined,
          //         undefined,
          //         histryFilter,
          //         undefined,
          //         ['createdOn,ASC'],
          //         undefined,
          //         1000,
          //         0,
          //         0,
          //         0
          //       )
          //       .subscribe((res: any) => {
          //         this.historyList = res.data;
          //         this.ndcupdatehistoryList = this.historyList.filter(
          //           (o) => o.isNdcAndSubNdc == 1
          //         );
          //         this.statusupdatehistoryList = this.historyList.filter(
          //           (o) => o.isApprovalAction == 1
          //         );
          //         console.log('this.historyList..', res.data);
          //       });
          //   });
        }
      // });

    this.serviceProxy
      .getManyBaseProjectApprovalStatusControllerProjectApprovalStatus(
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
      )
      .subscribe((res: any) => {
        this.projectApprovalStatus = res.data;


      });

    // this.serviceProxy
    //   .getManyBaseFinancingSchemeControllerFinancingScheme(
    //     undefined,
    //     undefined,
    //     undefined,
    //     undefined,
    //     ['name,ASC'],
    //     undefined,
    //     1000,
    //     0,
    //     0,
    //     0
    //   )
    //   .subscribe((res: any) => {
    //     this.financingSchemeList = res.data;
    //   });

    // let institutionListFilter: string[] = new Array();

    // institutionListFilter.push('type.Id||$eq||' + this.institutionTypeID);
    // console.log(institutionListFilter);
    // this.serviceProxy
    //   .getManyBaseInstitutionControllerInstitution(
    //     undefined,
    //     undefined,
    //     institutionListFilter,
    //     undefined,
    //     ['name,ASC'],
    //     undefined,
    //     1000,
    //     0,
    //     0,
    //     0
    //   )
    //   .subscribe((res: any) => {
    //     this.institutionList = res.data;
    //     console.log('list of institutions', this.institutionList);
    //     // this.project.mappedInstitution
    //   });

    if (this.editEntytyId && this.editEntytyId !== 0) {
      let docFilter: string[] = new Array();

      docFilter.push('documentOwnerId||$eq||' + this.editEntytyId);
      console.log("docFilter",docFilter)
      this.serviceProxy
        .getManyBaseDocumentControllerDocuments(
          undefined,
          undefined,
          docFilter,
          undefined,
          undefined,
          undefined,
          1000,
          0,
          0,
          0
        )
        .subscribe((res: any) => {
          this.selectedDocuments = res.data;
          console.log('selectedDocuments...', this.selectedDocuments, this.editEntytyId);
        });
    }

    //Anonymous form
    if (this.anonymousEditEntytyId && this.anonymousEditEntytyId != 0) {
      let docFilter: string[] = new Array();

      docFilter.push('documentOwnerId||$eq||' + this.anonymousEditEntytyId);
      this.serviceProxy
        .getManyBaseDocumentControllerDocuments(
          undefined,
          undefined,
          docFilter,
          undefined,
          undefined,
          undefined,
          1000,
          0,
          0,
          0
        )
        .subscribe((res: any) => {
          this.selectedDocuments = res.data;
          console.log('selectedDocuments...', this.selectedDocuments, this.anonymousEditEntytyId);
        });
    }
  }
  onImplementatonYearChange(date:Date){
    console.log("////////////")
    this.int_id_year=date.getFullYear().toString()
    this.makeInterventionID()
  }
   makeInterventionID(){
    if(!this.editEntytyId){
      console.log("changes",this.finalSectors.length)
      this.int_id_country=this.project.country.code;
      if(this.finalSectors.length==1){
        this.int_id_sectors=this.finalSectors[0].name
        // console.log("changes",this.sectorList[0].name)
      }
      else if(this.finalSectors.length>1){
        this.int_id_sectors='Multi'
        console.log("changes",'Multi')
      }
      else if(this.finalSectors.length==0){
        this.int_id_sectors='Sector'
        console.log("changes",'Multi')
      }
      // Do something when selectedVariable1 changes
      if(this.isExternalUser){
        this.int_id_country='External'
      }
      this.project.intervention_id=this.int_id_country+'-'+ this.int_id_sectors+'-'+this.int_id_year+'-'+this.lastId
  
    }
   
      
    
  }
  changInstitute(event: any) {
    console.log(this.project.mappedInstitution);
  }
  uploadedfiles(){
    console.log("called")
  }

  //
  saveForm(formData: NgForm) {
    console.log('hii');
    console.log(formData.form.valid)
    console.log(formData)
    if (this.exsistingPrpject) {
      return;
    }
    if (this.project.sector) {
      let sector = new Sector();
      sector.id = this.project.sector.id;
      this.project.sector = sector;
    }


    this.project.proposeDateofCommence = moment(new Date());
    this.project.dateOfImplementation = moment(this.dateOfImplementation);
    this.project.dateOfCompletion = moment(this.dateOfCompletion);
    console.log(this.project.dateOfImplementation, this.project.dateOfCompletion,this.project.proposeDateofCommence)
    //this.project.endDateofCommence = moment(this.endDateofCommence);
    // this.project.mappedInstitution=this.selectedInstitution;/

    //     console.log("project")
    //  console.log(this.project)
    //  console.log(this.selectedInstitution)

    if (this.project.aggregatedAction) {
      // this.project.currentNdc = this.project.ndc.name;
      // this.project.previousNdc = this.project.ndc.name;
      let ndc = new Ndc();
      ndc.id = this.project.aggregatedAction?.id;
      this.project.aggregatedAction = ndc;
      console.log("aggregatedAction", this.project.aggregatedAction)
    }

    if (this.project.actionArea) {
      // this.project.currentSubNdc = this.project.subNdc.name;
      // this.project.previousSubNdc = this.project.subNdc.name;
      let subned = new SubNdc();
      subned.id = this.project.actionArea?.id;
      this.project.actionArea = subned;
      console.log("action area", this.project.actionArea)
    }
    if (formData.form.valid && this.project.id > 0) {
      if (this.anonymousEditEntytyId > 0) {
        let prAprSts = new ProjectApprovalStatus();
        prAprSts.id = 4;
      } else {
        this.serviceProxy
          .updateOneBaseProjectControllerClimateAction(this.project.id, this.project)
          .subscribe(
            (res) => {
              this.isSaving = true;
              console.log('update', res);
              this.messageService.add({
                severity: 'success',
                summary: 'Success',
                detail: 'Intervention  has been updated successfully ',
                closable: true,
              });
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
      }
    } else {
      if (formData.form.valid) {
        console.log( "project",this.project)
        let projaprovalstatus = new  ProjectApprovalStatus()
        projaprovalstatus.id =4
        this.project.projectApprovalStatus= projaprovalstatus; // proposed
        this.messageService.clear();
        // this.projectProxy.createNewCA(this.project)
        this.project.aggregatedAction =new AggregatedAction()
        this.project.aggregatedAction.id =1;
        this.project.actionArea =new ActionArea()
        this.project.actionArea.id =1;
        this.project.sector = new Sector()
        this.project.sector.id =1;
        this.project.isCity =this.isCity
        this.project.user = new User()
        this.project.user.id =this.proposingUser.id;
        // let country = new Country();
        // country.id =this.counID
        // this.project.country =country
          this.serviceProxy.createOneBaseProjectControllerClimateAction(this.project)
          .subscribe(
            (res) => {
              let docUpdate:any={
                
              };
              docUpdate.ids=this.docArrayforSave.getArray();
              docUpdate.projectID=res.id;
              console.log("docUpload",docUpdate),
              this.docService.updateDocOwner(docUpdate).subscribe((res) => {
                console.log('docUploadfinal', res);
               
              })

              for (let sec of this.finalSectors) {
                let ps = new PolicySector();
                ps.intervention = res
                ps.sector =sec
                
                this.policySectorArray.push(ps);
              }
              let allSectors= new AllPolicySectors();
              allSectors.allSectors =this.policySectorArray;
              this.projectProxy.policySectors(allSectors).subscribe((res) => {
                console.log('save', res);
               
              })
              console.log(res)
              this.isSaving = true;
              // for (let b of this.finalBarrierList) {
              //   let pb = new PolicyBarriers();
              //   pb.climateAction = res
              //   // pb.barriers = b.barrier;
              //   // pb.characteristics=b.characteristics;
              //   pb.is_affected =b.affectedbyIntervention;
              //   this.policyBar.push(pb);
              // }
              let allBarriersSelected = new AllBarriersSelected()
              allBarriersSelected.allBarriers =this.finalBarrierList
              allBarriersSelected.climateAction =res
              console.log("allBarriersSelected",allBarriersSelected)
              //@ts-ignore
              this.projectProxy.policyBar(allBarriersSelected).subscribe((res) => {
                console.log('save', res);
                this.messageService.add({
                  severity: 'success',
                  summary: 'Success',
                  detail: 'Intervention  has been saved successfully',
                  closable: true,
                },
                
                
                );
              },
              (err) => {
                this.messageService.add({
                  severity: 'error',
                  summary: 'Error.',
                  detail: 'Internal server error in policy barriers',
                  sticky: true,
                });
              })
              
             
             
            },

            (err) => {
              this.messageService.add({
                severity: 'error',
                summary: 'Error.',
                detail: 'Internal server error',
                sticky: true,
              });
            }
          );

        console.log(formData);
      }
    }
  }
  getNext(){
    // const lastNumber = parseInt(this.lastId.substr(6), 10);

    // Generate the next number by incrementing the last number
    const nextNumber = this.lastId + 1;

    // Pad the next number with zeros to ensure it has three digits
    const paddedNumber = nextNumber.toString().padStart(4, '0');

    // Construct the nextId in the format "2023PTxxx"
    const nextId = this.project.country?.code +this.dateOfImplementation+ paddedNumber;

    return nextId
  }

  onnameKeyDown(event: any) {
    console.log('============= Event ===============');

    let skipWord = ['of', 'the', 'in', 'On', '-', '_', '/'];
    let searchText = this.removeFromString(
      skipWord,
      this.project.policyName
    ).trim();

    if (!searchText || searchText?.length < 4) {
      console.log('========== Return');
      this.relatedItem = [];
      return;
    }

    this.exsistingPrpject = false;

    let words = searchText.split(' ');

    let orfilter: string[] = new Array();
    // for (const w of words) {
    //   orfilter.push('climateActionName||$cont||' + w.trim());
    // }
    let filter: string[] = new Array();
    if (this.counID > 0) {
      filter.push('country.id||$eq||' + this.counID);
    }


    filter.push('climateActionName||$cont||' + searchText);

    this.serviceProxy
      .getManyBaseProjectControllerClimateAction(
        undefined,
        undefined,
        filter,
        undefined,
        undefined,
        undefined,
        10,
        0,
        0,
        0
      )
      .subscribe((res) => {
        if (this.project.policyName && res) {
          this.relatedItem = res.data;
          console.log(
            this.relatedItem.find(
              (a) => a.policyName === this.project.policyName
            )
          );
          if (
            this.relatedItem.find(
              (a) =>
                a.policyName.toLocaleLowerCase() ===
                this.project.policyName.toLocaleLowerCase()
            )
          ) {
            this.exsistingPrpject = true;
          }
        } else {
          this.relatedItem = [];
        }
      });

    setTimeout(() => {
      this.setMarkerOnUpdateInit();
    }, 3000);
  }
 
  onCountryChnage() {
    this.getUserEnterdCountry = this.project.country;

    this.onSectorChange(event);

    // this.sectorProxy.getSectorDetails(1,100,'').subscribe((res:any) =>{
    //   res.items.forEach((re:any)=>{
    //     if(re.id !=6){
    //       this.sectorList.push(re)
    //     }
    //   })
    // })

    this.sectorProxy.getCountrySector(this.project.country.id).subscribe((res: any) => {
      this.sectorList = res;
      console.log("++++", this.sectorList)
    });
  }

  onSectorChange(event: any) {
    console.log("event", event, "sector",this.project.sector, "country",this.project.country)
    this.makeInterventionID()
    // if (this.project.sector && this.project.country) {
    //   this.serviceProxy
    //     .getManyBaseNdcControllerAggregatedAction(
    //       undefined,
    //       undefined,
    //       [
    //         'sector.id||$eq||' + this.project.sector.id,
    //         'country.id||$eq||' + this.project.country.id,
    //       ],
    //       undefined,
    //       ['name,ASC'],
    //       ['subNdc'],
    //       1000,
    //       0,
    //       0,
    //       0
    //     )
    //     .subscribe((res: any) => {
    //       this.ndcList = res.data;
    //       // this.onNdcChnage(event);
    //       console.log("this.ndcList", this.ndcList)
    //       // console.log("event11",  event)
    //       if (event === true) {
    //         var ndc = this.ndcList?.find((a) => a.id === this.project?.aggregatedAction?.id);
    //         this.project.aggregatedAction = ndc !== undefined ? ndc : new Ndc();
    //         console.log("this.ndcList", this.project.aggregatedAction)
    //         if (this.project.actionArea) {
    //           console.log(" this.ndcList", this.ndcList)
    //           var subNdc: SubNdc = this.project.aggregatedAction.actionArea?.find(
    //             (a) => a.id === this.project.aggregatedAction.id
    //           )!;
    //           this.project.actionArea = subNdc;
    //         }
    //       }
    //     });
    // } else {
    //   this.ndcList = [];
    // }
  }
  onNdcChnage(event: any): void {
    console.log("this.project", this.project)

    // this.ndcProxy.getSubNdc(this.project.aggregatedAction?.id).subscribe((res: any) => {
    //   this.SubndcList = res;
    //   console.log("SubndcList", this.SubndcList)
    //   console.log("this.project", this.project)
    // });
  }

  escape(s: string) {
    return s.replace(/[-\/\\^$*+?.()|[\]{}]/g, '\\$&');
  }

  removeFromString(arr: string[], str: string) {
    let escapedArr = arr.map((v) => escape(v));
    let regex = new RegExp(
      '(?:^|\\s)' + escapedArr.join('|') + '(?!\\S)',
      'gi'
    );
    return str.replace(regex, '');
  }

  /**
   * set project location coordinates on select through map
   * @param longitude
   * @param latitude
   */
  setCoordinatesToProject = (longitude: number, latitude: number) => {
    this.project.latitude = latitude;
    this.project.longitude = longitude;
  };

  /**
   * on click on the map
   * @param event
   */
  async handleMapClick(event: any) {
    if (!this.editEntytyId || this.editEntytyId == 0) {
      const latitude = event.latLng.lat();
      const longitude = event.latLng.lng();
      await this.addMarker(longitude, latitude);
      this.setCoordinatesToProject(longitude, latitude);

      let map = this.gmap.getMap();
      this.updateMapBoundaries(map, longitude, latitude);
    }
  }

  /**
   * update coordinates on drop marker
   * @param event
   */
  handleMarkerDragEnd(event: any) {
    if (!this.editEntytyId || this.editEntytyId == 0) {
      const latitude = event.originalEvent.latLng.lat();
      const longitude = event.originalEvent.latLng.lng();
      //this.addMarker(longitude, latitude);
      this.setCoordinatesToProject(longitude, latitude);

      let map = this.gmap.getMap();
      this.updateMapBoundaries(map, longitude, latitude);
    }
  }

  async setMarkerOnUpdateInit() {
    const latitude = Number(this.project.latitude);
    const longitude = Number(this.project.longitude);
    await this.addMarker(longitude, latitude);
    console.log(latitude);
    console.log(longitude);

    let map = this.gmap.getMap();
    this.updateMapBoundaries(map, longitude, latitude);
  }

  /**
   * update map boundaries on coordinates change
   * @param map
   * @param longitude
   * @param latitude
   */
  updateMapBoundaries = (map: any, longitude: any, latitude: any) => {
    if (longitude && latitude) {
      map.setCenter({ lat: latitude, lng: longitude });
      if (map.getZoom() < 10) {
        map.setZoom(10);
      }

      if (!map.getZoom()) {
        map.setZoom(10);
      }
    } else {
      map.setCenter({ lat: 9, lng: 80 });
      map.setZoom(6);
      this.overlays = [];
    }
  };

  /**
   * add marker on map
   * @param longitude
   * @param latitude
   */
  async addMarker(longitude: number, latitude: number) {
    var marker = await new google.maps.Marker({
      position: { lat: latitude, lng: longitude },
      title: this.project.policyName,
      draggable: true,
    });
    this.overlays = [marker];
  }

  /**
   * on change the latitude input value
   * @param event
   */
  onLatitudeChange = async (event: any) => {
    let map = this.gmap.getMap();
    if (event.value && this.project.longitude) {
      const latitude = Number(event.value);
      const longitude = Number(this.project.longitude);
      await this.addMarker(longitude, latitude);
      this.updateMapBoundaries(map, longitude, latitude);
    } else {
      this.updateMapBoundaries(map, null, null);
    }
  };

  /**
   * on change the longitude input value
   * @param event
   */
  onLongitudeChange = async (event: any) => {
    let map = this.gmap.getMap();
    if (event.value && this.project.latitude) {
      const latitude = Number(this.project.latitude);
      const longitude = Number(event.value);
      await this.addMarker(longitude, latitude);
      this.updateMapBoundaries(map, longitude, latitude);
    } else {
      this.updateMapBoundaries(map, null, null);
    }
  };

  back() {
    this.location.back();
  }
  confirmBack(label: string) {
    if (label === 'back') {
      this.location.back();

    }
    else {
      this.confirmationService.confirm({
        message: (label == 'cancel' ? 'Your filled data will be lost. ' : '') + 'Are you sure that you want to proceed?',
        header: 'Confirmation',
        icon: 'pi pi-exclamation-triangle',
        accept: () => {
          this.location.back();
        },
        reject: (type: any) => {

        }
      });
    }

  }
  onRowSelect(event: any) {
    this.selectedProject = event;
  }

  onCategoryChange(event: any) {
    console.log("event",event)
    this.setbarriers = []
    
      let br = this.barriers.filter((a: any) => event.id == a.barriersCategory.id)
      console.log("selected barrier",br)
      for (let b of br) {
        this.setbarriers.push(b);
      }
  
}

enableActionButtonsarea() {
  this.isActionButtonSectionEnabled = true;
}

updateProjectApprovalStatus(project: Project, aprovalStatus: number) {
  if (project) {
    
    this.originalApprovalStatus =
      project.projectApprovalStatus === undefined
        ? 'Propose'
        : project.projectApprovalStatus.name;

    if (aprovalStatus == 1) {
      this.updatedApprovalStatus = 'Accept';
      console.log("333333333")
    }
    if (aprovalStatus == 2) {
      this.updatedApprovalStatus = 'Reject';
    }
    if (aprovalStatus == 3) {
      this.updatedApprovalStatus = 'Data Request';
    }

    let status = this.projectApprovalStatus.find(
      (a) => a.id === aprovalStatus
    );

    // project.projectApprovalStatus = status === undefined ? (null as any) : status;
    if (aprovalStatus === 1) {
      // window.alert(project.projectApprovalStatus.name)
      this.confirmationService.confirm({
        message:
          'Are you sure you want to approve ' +
          project.policyName +
          ' ?',
        accept: () => {
          //window.alert(project.projectApprovalStatus)
          project.projectApprovalStatus =
            status === undefined ? (null as any) : status;
          console.log('my project..,', project);
          this.updateStatus(project, aprovalStatus);
        },
        reject: () => { },
      });
    }
    if (aprovalStatus === 2) {
      this.confirmationService.confirm({
        message:
          'Are you sure you want to reject ' +
          project.policyName +
          ' ?',
        accept: () => {
          project.projectApprovalStatus =
            status === undefined ? (null as any) : status;
          this.updateStatus(project, aprovalStatus);
        },
        reject: () => { },
      });
    }
    if (aprovalStatus === 3) {
      this.confirmationService.confirm({
        message:
          'Are you sure you want to data request ' +
          project.policyName +
          ' ?',
        accept: () => {
          project.projectApprovalStatus =
            status === undefined ? (null as any) : status;
          this.updateStatus(project, aprovalStatus);
        },
        reject: () => { },
      });
    }
  } else {
    this.messageService.add({
      severity: 'error',
      summary: 'Error',
      detail:
        'Please check whether Aggregated Actions and Action areas is correctly mapped or not',
      closable: true,
    });
  }
}

updateStatus(project: Project, aprovalStatus: number) {
  let sector = new Sector();
  // sector.id = project.sector.id;
  project.sector = sector;

  project.proposeDateofCommence = moment(this.proposeDateofCommence);
  //project.endDateofCommence = moment(this.endDateofCommence);
  // this.project.mappedInstitution=this.selectedInstitution;/

  //     console.log("project")
  //  console.log(this.project)
  //  console.log(this.selectedInstitution)

  if (project.aggregatedAction) {
    let ndc = new Ndc();
    ndc.id = project.aggregatedAction?.id;
    project.aggregatedAction = ndc;
  }

  if (project.actionArea) {
    let subned = new SubNdc();
    subned.id = project.actionArea?.id;
    project.actionArea = subned;
  }

  // if (project.institution) {
  //   let insti = new Institution();
  //   insti.id = project.mappedInstitution?.id;
  //   project.mappedInstitution = insti;
  // }

  project.politicalPreference = this.isPoliticalPreference;
  project.likelyhood = this.likelyHood;
  project.availabilityOfTechnology = this.isAvailabiltyOfTEch;
  project.financialFecialbility = this.isFinancialFeciability;
  // project.actionJustification = this.commentForJustification;
  // project.isMappedCorrectly = this.isMapped;
  // console.log('project.actionJustification..', project.actionJustification);

  this.serviceProxy
    .updateOneBaseProjectControllerClimateAction(project.id, project)
  .subscribe(
    (res) => {
      // window.alert("yess..")
      // console.log(res);

      // let actionObject = new CaActionHistory();
      // actionObject.isApprovalAction = 1;
      // actionObject.previousAction = this.originalApprovalStatus;
      // actionObject.currentAction = this.updatedApprovalStatus;
      // actionObject.actionUser = this.fullname;
      //  actionObject.isNdcAndSubNdc = 1;
      //  actionObject.currentNdcs = this.project.currentNdc;
      //  actionObject.previousNdcs = this.project.previousNdc;
      //  actionObject.currentSubNdcs = this.project.currentSubNdc;
      //  actionObject.previousSubNdcs = this.project.previousSubNdc;
      // actionObject.project = this.project;

      // this.serviceProxy
      //   .createOneBaseCaActionHistoryControllerCaActionHistory(actionObject)
      //   .subscribe(
      //     (res) => {
      //       console.log('save', res);
      //       // this.messageService.add({
      //       //   severity: 'success',
      //       //   summary: 'Success',
      //       //   detail: 'project  has save successfully',
      //       //   closable: true,
      //       // });
      //     }

      //     // (err) => {
      //     //   this.messageService.add({
      //     //     severity: 'error',
      //     //     summary: 'Error.',
      //     //     detail: 'Internal server error, please try again.',
      //     //     sticky: true,
      //     //   });
      //     // }
      //   );

      this.messageService.add({
        severity: 'success',
        summary: 'Success',
        detail:
          aprovalStatus === 1 || aprovalStatus === 2
            ? project.policyName +
              ' is successfully ' +
              (aprovalStatus === 1 ? 'Approved.' : 'Rejected')
            : 'Data request sent successfully.',
        closable: true,
      });
    },
    (err) => {
      //window.alert("nooo..")
      this.messageService.add({
        severity: 'error',
        summary: 'Error.',
        detail: 'Internal server error, please try again.',
        sticky: true,
      });
    }
  );
}

drWithComment() {
  if (
    this.drComment === '' ||
    this.drComment === null ||
    this.drComment === undefined
  ) {
    this.drCommentRequried = true;
  } else {
    this.selectedProject.projectDataRequsetComment = this.drComment;

    if (this.isMapped != undefined) {
      this.updateProjectApprovalStatus(this.selectedProject, 3);
    } else {
      this.messageService.add({
        severity: 'error',
        summary: 'Error',
        detail:
          'Please check whether Aggregated Actions and Action Areas is correctly mapped or not',
        closable: true,
      });
    }
  }
}

rejectWithComment() {
  if (
    this.rejectComment === '' ||
    this.rejectComment === null ||
    this.rejectComment === undefined
  ) {
    this.rejectCommentRequried = true;
  } else {
    this.selectedProject.projectRejectComment = this.rejectComment;
    //this.updateProjectApprovalStatus(this.selectedProject, 2);
  }
}

OnShowOerlayDR() {
  this.drComment = '';
  this.drCommentRequried = false;
}
OnShowOerlay() {
  this.rejectComment = '';
  this.rejectCommentRequried = false;
}
onConfirm() {
  this.messageService.clear('c');
}

onReject() {
  this.messageService.clear('c');
}

showConfirm() {
  this.messageService.clear();
  this.messageService.add({
    key: 'c',
    sticky: true,
    severity: 'warn',
    summary: 'Are you sure?',
    detail: 'Confirm to proceed',
  });
}

toUpdateNdcs() {
  console.log('this.project....', this.project);

  let sector = new Sector();
  sector.id = this.project.sector.id;
  sector.name = this.project.sector.name;
  this.project.sector = sector;

  this.project.proposeDateofCommence = moment(this.proposeDateofCommence);
  //this.project.endDateofCommence = moment(this.endDateofCommence);
  // this.project.mappedInstitution=this.selectedInstitution;/

  //     console.log("project")
  //  console.log(this.project)
  //  console.log(this.selectedInstitution)

  if (this.project.aggregatedAction) {
    // this.project.currentNdc = this.project.aggregatedAction.name;
    // this.project.previousNdc = this.originalNdc;
    this.originalNdc = this.project.aggregatedAction.name;

    let ndc = new Ndc();
    ndc.id = this.project.aggregatedAction?.id;
    ndc.name = this.project.aggregatedAction?.name;
    this.project.aggregatedAction = ndc;
  }

  if (this.project.actionArea) {
    // this.project.currentSubNdc = this.project.subNdc.name;
    // this.project.previousSubNdc = this.originalSubNdc;
    this.originalSubNdc = this.project.actionArea.name;

    let subned = new SubNdc();
    subned.id = this.project.actionArea?.id;
    subned.name = this.project.actionArea?.name;
    this.project.actionArea = subned;
  }

  // if (this.project.institution) {
  //   let insti = new Institution();
  //   insti.id = this.project.mappedInstitution?.id;
  //   this.project.mappedInstitution = insti;
  // }


  if (this.project.id > 0) {
    this.serviceProxy
      .updateOneBaseProjectControllerClimateAction(this.project.id, this.project)
    // .subscribe(
    //   (res) => {
    //     let historyObject = new CaActionHistory();
    //     historyObject.isNdcAndSubNdc = 1;
    //     historyObject.currentNdcs = this.project.currentNdc;
    //     historyObject.previousNdcs = this.project.previousNdc;
    //     historyObject.currentSubNdcs = this.project.currentSubNdc;
    //     historyObject.previousSubNdcs = this.project.previousSubNdc;
    //     historyObject.actionUser = this.fullname;
    //     historyObject.project = this.project;

    //     this.serviceProxy
    //       .createOneBaseCaActionHistoryControllerCaActionHistory(
    //         historyObject
    //       )
    //       .subscribe(
    //         (res) => {
    //           console.log('save', res);
    //           // this.messageService.add({
    //           //   severity: 'success',
    //           //   summary: 'Success',
    //           //   detail: 'project  has save successfully',
    //           //   closable: true,
    //           // });
    //         }

    //         // (err) => {
    //         //   this.messageService.add({
    //         //     severity: 'error',
    //         //     summary: 'Error.',
    //         //     detail: 'Internal server error, please try again.',
    //         //     sticky: true,
    //         //   });
    //         // }
    //       );

    //     console.log('update....', res, this.project);
    //     this.isMapped = 1
    //     this.messageService.add({
    //       severity: 'success',
    //       summary: 'Success',
    //       detail: 'Aggregated Actions and SubNdc  has updated successfully ',
    //       closable: true,
    //     });
    //   },

    //   (err) => {
    //     this.messageService.add({
    //       severity: 'error',
    //       summary: 'Error.',
    //       detail: 'Internal server error, please try again.',
    //       sticky: true,
    //     });
    //   }
    // );
  }
}

showDialog(){
  this.barrierBox =true;
  console.log(this.barrierBox)

}

pushBarriers(barrier:any){
  console.log("barrier",barrier)
  this.finalBarrierList.push(barrier)
 this.barrierSelected = new BarrierSelected()

}
toDownload() {
  this.isDownloadMode = 1;
  this.isDownloading = true;

  setTimeout(() => {
    // var data = document.getElementById('content')!;

    //  html2canvas(data).then((canvas) => {
    //    var imaWidth = 120; //123
    //    var pageHeight = 400; //500
    //   // var imgHeight = (canvas.height * imaWidth) / canvas.width;
    //   var imgHeight = 800;
    //   // console.log('size', canvas.height); // 4346
    //   // console.log('size....', canvas.width); //2006
    //    var heightLeft = imgHeight;
    //    var text =
    //      'Downolad date ' +
    //      moment().format('YYYY-MM-DD HH:mm:ss');

    //    const contentDataURL = canvas.toDataURL('image/png');
    //    let pdf = new jsPDF('p', 'mm', 'a4');
    //    var position = 0;
    //    pdf.addImage(contentDataURL, 'PNG', 10, position, imaWidth, imgHeight);
    //    pdf.text(text, 297, 297);
    //    pdf.save('');
    //  });

    // var divHeight = $('#pdfTable').height();
    // var divWidth = $('#pdfTable').width();

    var data = document.getElementById('content')!;

    html2canvas(data).then((canvas) => {
      const componentWidth = data.offsetWidth;
      const componentHeight = data.offsetHeight;

      const orientation = componentWidth >= componentHeight ? 'l' : 'p';

      const imgData = canvas.toDataURL('image/png');
      const pdf = new jsPDF({
        orientation,
        unit: 'px',
      });

      pdf.internal.pageSize.width = componentWidth;
      pdf.internal.pageSize.height = componentHeight;

      pdf.addImage(imgData, 'PNG', 0, 0, componentWidth, componentHeight);
      pdf.save('download.pdf');
    });
  }, 1);
}

  barriersNameArray(Characteristics:any[]){
    if (Characteristics?.length>0){
      let charArray = Characteristics.map(x=>{return x.name})
      // console.log(charArray,charArray.join(", "))
      return charArray.join(", ")
    }
    else{
      return "-"
    }
    

  }
}
