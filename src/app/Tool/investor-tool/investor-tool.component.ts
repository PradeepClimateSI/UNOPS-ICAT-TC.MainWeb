import { AfterContentChecked, ChangeDetectorRef, Component, OnInit, ViewChild } from '@angular/core';
import { NgForm } from '@angular/forms';
import { MasterDataDto, MasterDataService } from 'app/shared/master-data.service';
import * as moment from 'moment';
import { MessageService } from 'primeng/api';
import {Any, AllBarriersSelected, Assessment, BarrierSelected, Characteristics, ClimateAction, CreateInvestorToolDto, GeographicalAreasCoveredDto, ImpactCovered, IndicatorDetails, InstitutionControllerServiceProxy, InvestorAssessment, InvestorQuestions, InvestorTool, InvestorToolControllerServiceProxy, MethodologyAssessmentControllerServiceProxy, PolicyBarriers, ProjectControllerServiceProxy, Sector, SectorControllerServiceProxy, AssessmentControllerServiceProxy, Category, PortfolioSdg } from 'shared/service-proxies/service-proxies';
import decode from 'jwt-decode';
import { TabView } from 'primeng/tabview';
import { ActivatedRoute, Router } from '@angular/router';
import { environment } from 'environments/environment';
import { HttpResponse } from '@angular/common/http';
import { Type } from '@angular/compiler';
// import { IndicatorDetails } from './IndicatorDetails';


interface  CharacteristicWeight {
  [key: string]: number;
}

interface ChaCategoryWeightTotal {
  [key: string]: number;
}

interface SelectedSDG {
  id: number;
  answer: string;
  name: string;
  number: number;
}

interface SelectItem<T = any>{
  label?:string;
  value: T;
  icon?:string;
}
interface ChaCategoryTotalEqualsTo1 {
  [key: string]: boolean;
}
@Component({
  selector: 'app-investor-tool',
  templateUrl: './investor-tool.component.html',
  styleUrls: ['./investor-tool.component.css']
})
export class InvestorToolComponent implements OnInit, AfterContentChecked {

  assessment: Assessment = new Assessment();
  investorAssessment: InvestorTool = new InvestorTool();
  sectorArray: Sector[] = [];
  impactArray: ImpactCovered[] = [];
  assessment_types: any[];
  policies: ClimateAction[]=[];
  isSavedAssessment: boolean = false;
  levelOfImplementation: any[] = [];
  geographicalAreasCovered: any[] = [];
  sectorsCovered: any[] = [];
  impactCovered: any[] = [];
  assessmentMethods: any[] = [];
  assessmentApproach:any[] =[];
  countryID: number;
  sectorList: any[] = [];
  createInvestorToolDto: CreateInvestorToolDto = new CreateInvestorToolDto();
  meth1Process: Characteristics[] = [];
  meth1Outcomes: Characteristics[] = [];
  characteristicsList: Characteristics[] = [];
  characteristicsArray: Characteristics[] = [];
  selectedIndex = 0;
  activeIndex = 0;
  activeIndexMain =0;
  activeIndex2 :number=0;
  likelihood: any[] = [];
  relevance: any[] = [];
  score: any[] = [];
  approach:number=0;
  instiTutionList : any = []
  investorQuestions:InvestorQuestions[]=[];
  geographicalAreasCoveredArr: any[] = []

  //Newww
  
  sdgList : any[];
  selectedSDGs : SelectedSDG[] = [];
  selectedSDGsWithAnswers : SelectedSDG[] = [];
  sdgDataSendArray: any = [];
  sdgDataSendArray3: any= [];
  sdgDataSendArray4: any = [];
  sdgDataSendArray2: any = [];
  outcomeScaleScore: any[] = [];
  outcomeSustainedScore : any[] = [];
  sdg_answers: any[]= [];
  draftLoading: boolean=false;

  description = '';
  levelofImplementation:number=0;

  // yesNoAnswer: any[] = [{ id: 1, name: "Yes" }, { id: 2, name: "No" },  { id: 3, name: "Maybe" }];
  yesNoAnswer: any[] = [{ id: 1, name: "Yes" }, { id: 2, name: "No" }];
  investmentType: any[] = [{ id: 1, name: "Type 01" }, { id: 2, name: "Type 02" },  { id: 3, name: "Type 03" }];
 angle:string

  processData: {
    type: string,
    CategoryName: string,
    categoryID: number,
    isValidated:boolean|null
    data: InvestorAssessment[],

  }[] = [];

  outcomeData: {
    type: string,
    CategoryName: string,
    categoryID: number,
    isValidated:boolean|null
    data: InvestorAssessment[]
  }[] = [];
  //class variable
  @ViewChild(TabView) tabView: TabView;

  tabName: string = '';
  mainAssessment: Assessment;
  mainTabIndex: any;
  categoryTabIndex: any;

  barrierBox:boolean=false;
  barrierSelected:BarrierSelected= new BarrierSelected();
  finalBarrierList :BarrierSelected[]=[];
  barrierArray:PolicyBarriers[];
  isDownloading: boolean = true;
  isDownloadMode: number = 0;
  sectorsJoined :string='';
  finalSectors:Sector[]=[]


  isLikelihoodDisabled:boolean=false;
  isRelavanceDisabled:boolean=false;
  mainTabIndexArray:number[]=[];
  initialLikelihood:number=0;
  initialRelevance:number=0;
  failedLikelihoodArray:{category:string,tabIndex:number}[]=[]
  failedRelevanceArray:{category:string,tabIndex:number}[]=[]

  uploadUrl: string;
  fileServerURL: string;
  acceptedFiles: string = ".pdf, .jpg, .png, .doc, .docx, .xls, .xlsx, .csv";
  tabLoading: boolean=false;
  characteristicsLoaded:boolean = false;
  categoriesLoaded:boolean = false;
  isStageDisble:boolean=false;
  tableData : any;
  assessmentId:number;
  isEditMode:boolean=false;
  isValidSCaleSD: boolean;
  isValidSustainedSD: boolean;
  // isValidated:boolean;

  constructor(
    private projectControllerServiceProxy: ProjectControllerServiceProxy,
    private masterDataService: MasterDataService,
    private messageService: MessageService,
    private methodologyAssessmentControllerServiceProxy: MethodologyAssessmentControllerServiceProxy,
    private sectorProxy: SectorControllerServiceProxy,
    private investorToolControllerproxy: InvestorToolControllerServiceProxy,
    private router: Router,
    private instituionProxy: InstitutionControllerServiceProxy,
    private changeDetector: ChangeDetectorRef,
    private activatedRoute: ActivatedRoute,
    private assessmentControllerServiceProxy: AssessmentControllerServiceProxy,


  ) {
     this.uploadUrl = environment.baseUrlAPI + '/investor-tool/upload-file-investment'
    this.fileServerURL = environment.baseUrlAPI+'/uploads'

  }
  async ngOnInit(): Promise<void> {
    this.sectorList = await this.sectorProxy.findAllSector().toPromise()
    console.log("sectors",this.sectorList)
    this.levelOfImplementation = this.masterDataService.level_of_implemetation;
    this.geographicalAreasCovered = this.masterDataService.level_of_implemetation;

    this.activatedRoute.queryParams.subscribe( params => {
      params['isEdit']=='true'?(this.isEditMode =true ):false
      this.assessmentId = params['id']
      console.log("isEditMode",this.isEditMode,"assessmentId",this.assessmentId)
      if(!this.assessmentId && this.isEditMode ){
        window.location.reload()
      }
    })
    if(this.isEditMode==false){
      await this.getPolicies();
      await this.getAllImpactsCovered();
      await this.getCharacteristics();
     
    }
    else{
      try{
        await this.getSavedAssessment()
      }
      catch (error) {
        console.log(error)
      }
      

    } 

   
    //comment this
        /* await this.getCharacteristics();
        console.log(this.isEditMode,this.assessmentId)
        this.assessment = await this.assessmentControllerServiceProxy.findOne(this.assessmentId).toPromise()
        this.processData = await this.investorToolControllerproxy.getProcessData(this.assessmentId).toPromise();
        this.outcomeData = await this.investorToolControllerproxy.getOutcomeData(this.assessmentId).toPromise();
        this.sdgDataSendArray2 = await this.investorToolControllerproxy.getScaleSDGData(this.assessmentId).toPromise();
        this.sdgDataSendArray4 = await this.investorToolControllerproxy.getSustainedSDGData(this.assessmentId).toPromise();
        this.selectedSDGs = await this.investorToolControllerproxy.getSelectedSDGs(this.assessmentId).toPromise();
        this.selectedSDGsWithAnswers = await this.investorToolControllerproxy.getSelectedSDGsWithAnswers(this.assessmentId).toPromise();

        console.log("this.processData",this.processData,this.assessment)
        console.log("this.outcomeData",this.outcomeData)
        console.log("this.selectedSDGs", this.selectedSDGs)
        console.log("this.selectedSDGsWithAnswers", this.selectedSDGsWithAnswers)
        console.log("this.sdgDataSendArray2", this.sdgDataSendArray2)
        console.log("this.sdgDataSendArray4", this.sdgDataSendArray4)
        this.setFrom()
        this.setTo()  */
    //upto this

 // this.isSavedAssessment = true; this.tabLoading= true; // Need to remove  
  // this.isSavedAssessment = true // Need to remove  
  this.tableData =  this.getProductsData();
    this.categoryTabIndex =0;
    this.approach=1
    this.assessment.assessment_approach = 'Direct'
    this.isLikelihoodDisabled=true;
    this.isRelavanceDisabled=true;
    this.assessment_types = this.masterDataService.assessment_type;
  
   
    this.likelihood = this.masterDataService.likelihood;
    this.relevance = this.masterDataService.relevance;
    this.score = this.masterDataService.score;
    this.outcomeScaleScore = this.masterDataService.outcomeScaleScore;
    this.outcomeSustainedScore= this.masterDataService.outcomeSustainedScore;
    this.sdg_answers = this.masterDataService.sdg_answers;

    this.assessmentMethods = this.masterDataService.assessment_method;
    this.assessmentApproach =this.masterDataService.assessment_approach2;

    const token = localStorage.getItem('ACCESS_TOKEN')!;
    const countryId = token ? decode<any>(token).countryId : 0;
    console.log("country", countryId)
    this.countryID = countryId;
    console.log("tabName", this.tabName)

    let intTypeFilter: string[] = new Array();

    intTypeFilter.push('type.id||$eq||' + 3);

    // this.instituionProxy.getInstituion(3,countryId,1000,0).subscribe((res: any) => {
    //   this.instiTutionList = res;
    //   console.log( "listtt",this.instiTutionList)
    // });
    // this.getSelectedHeader();

    this.investorToolControllerproxy.findAllSDGs().subscribe((res: any) => {
      console.log("ressssSDGs", res)
      this.sdgList = res
     });

  }
  
     
    
    
  
  async getSavedAssessment(){
    await this.getCharacteristics();
    console.log(this.isEditMode,this.assessmentId)
    this.assessment = await this.assessmentControllerServiceProxy.findOne(this.assessmentId).toPromise()
    this.processData = await this.investorToolControllerproxy.getProcessData(this.assessmentId).toPromise();
    this.outcomeData = await this.investorToolControllerproxy.getOutcomeData(this.assessmentId).toPromise();
    this.sdgDataSendArray2 = await this.investorToolControllerproxy.getScaleSDGData(this.assessmentId).toPromise();
    this.sdgDataSendArray4 = await this.investorToolControllerproxy.getSustainedSDGData(this.assessmentId).toPromise();
    this.selectedSDGs = await this.investorToolControllerproxy.getSelectedSDGs(this.assessmentId).toPromise();
    this.selectedSDGsWithAnswers = await this.investorToolControllerproxy.getSelectedSDGsWithAnswers(this.assessmentId).toPromise();

    console.log("this.processData",this.processData,this.assessment)
    console.log("this.outcomeData",this.outcomeData)
    console.log("this.selectedSDGs", this.selectedSDGs)
    console.log("this.selectedSDGsWithAnswers", this.selectedSDGsWithAnswers)
    console.log("this.sdgDataSendArray2", this.sdgDataSendArray2)
    console.log("this.sdgDataSendArray4", this.sdgDataSendArray4)
    console.log(this.isEditMode,this.assessmentId)
    this.assessment = await this.assessmentControllerServiceProxy.findOne(this.assessmentId).toPromise()
    this.policies.push(this.assessment.climateAction)
    this.finalBarrierList = this.assessment['policy_barrier']
    let areas: MasterDataDto[] = []
    this.assessment['geographicalAreasCovered'].map((area: { code: any; }) => {
    let level = this.levelOfImplementation.find(o => o.code === area.code)
    if (level) {
      areas.push(level)
    }
    })
    this.geographicalAreasCoveredArr = areas
    let sectors: any[] = []
    // console.log(this.assessment['investor_sector'])
    this.assessment['sector'].map((sector: { name: any; }) => {
      sectors.push(this.sectorList.find(o => o.name === sector.name))
    })
    this.sectorArray = sectors
    this.processData = await this.investorToolControllerproxy.getProcessData(this.assessmentId).toPromise();
    console.log("this.processData",this.processData,this.assessment)
    this.setFrom()
    this.setTo()
    this.draftLoading = true
  }

  onChangeSDGsAnswer(withAnswers:any , item : any){
    console.log("withAnswers", withAnswers)
console.log("itemmmm", item)
  }

  ngAfterContentChecked(): void {
    this.changeDetector.detectChanges();
  }
  async getPolicies() {
    this.policies = await this.projectControllerServiceProxy.findAllPolicies().toPromise()
  }
  async getAllImpactsCovered() {
    this.impactCovered = await this.investorToolControllerproxy.findAllImpactCovered().toPromise()
  }

  setFrom(){
    if(this.assessment.from){  
      let convertTime = moment(this.assessment.from).format("YYYY-MM-DD HH:mm:ss");
      let convertTimeObject = new Date(convertTime);
      //@ts-ignore
      this.assessment.from = convertTimeObject;
    }

  }

 

  setTo(){
    if(this.assessment.to){
      let convertTime = moment(this.assessment.to).format("YYYY-MM-DD HH:mm:ss");
      let convertTimeObject = new Date(convertTime);
      //@ts-ignore
      this.assessment.to = convertTimeObject;
    }

  }

  async getCharacteristics() {
   
    this.investorToolControllerproxy.findAllSDGs().subscribe((res: any[]) => {
      console.log("ressssSDGs", res)
      this.sdgList = res
     });

    try{
      this.investorQuestions= await this.investorToolControllerproxy.findAllIndicatorquestions().toPromise();
       console.log("ressss3333",  this.investorQuestions)
      console.log("1111")

    // });
    this.characteristicsList = await this.methodologyAssessmentControllerServiceProxy.findAllCharacteristics().toPromise();
    this.characteristicsLoaded = true;
    console.log("22222")
    this.methodologyAssessmentControllerServiceProxy.findAllCategories().toPromise().then((res2: any) => {

      const customOrder = [1, 2, 3, 4, 5, 7, 6, 8, 9, 10];

      console.log("categoryList", res2)

      const sortedRes2 = res2.sort((a : any, b: any) => {
        const indexA = customOrder.indexOf(a.id);
        const indexB = customOrder.indexOf(b.id);
        return indexA - indexB;
      });

      console.log("categoryList222", sortedRes2);

      // console.log("categoryList", res2)
      for (let x of res2) {
        let categoryArray: InvestorAssessment[] =[];
        for (let z of this.characteristicsList) {
          // console.log(z.category.name,x.name,z.category.name === x.name)
          if (z.category.name === x.name) {
            // console.log("=========================",x.name)
            let newCharData = new InvestorAssessment();
            newCharData.characteristics = z;

            for(let q of this.investorQuestions){
              if(newCharData.characteristics.id ===q.characteristics.id){
                let indicatorDetails =new IndicatorDetails()
                indicatorDetails.type='question';
                indicatorDetails.question = q
                newCharData.indicator_details.push(indicatorDetails)

              }
            }

            categoryArray.push(newCharData);

          }

        }

        //this.categotyList.push(x);
        if (x.type === 'process') {
          this.processData.push({
            type: 'process', CategoryName: x.name, categoryID: x.id,
            data: categoryArray,
            isValidated: null
          })


        }
        if (x.type === 'outcome') {
          this.meth1Outcomes.push(x);

          this.outcomeData.push({
            type: 'outcome', CategoryName: x.name, categoryID: x.id,
            data: categoryArray,
            isValidated: null
          })

          if(x.name === 'SDG Scale of the Outcome'){
            this.sdgDataSendArray.push({
              type: 'outcome', CategoryName: x.name, categoryID: x.id,
              data: categoryArray
            })
          }

          if(x.name === 'SDG Time frame over which the outcome is sustained'){
            this.sdgDataSendArray3.push({
              type: 'outcome', CategoryName: x.name, categoryID: x.id,
              data: categoryArray
            })
          }

        }

      }
      this.categoriesLoaded = true;

      if (this.characteristicsLoaded && this.categoriesLoaded) {
        this.tabLoading = true; 
        console.log("33333")
      }
      console.log("processdata", this.processData)
      console.log("outcomeData", this.outcomeData)
      console.log("this.sdgDataSendArray", this.sdgDataSendArray)
    });
    }
    catch (error) {
      console.log(error)
    }
   

   
  }

  save(form: NgForm) {
    console.log("form", form)
    this.isStageDisble =true;
    // this.showSections = true
    //save assessment
    this.assessment.tool = 'INVESTOR'
    this.assessment.year = moment(new Date()).format("YYYY-MM-DD")
    if (!this.assessment.id) this.assessment.createdOn = moment(new Date())
    this.assessment.editedOn = moment(new Date())

    if (form.valid) {
      this.methodologyAssessmentControllerServiceProxy.saveAssessment(this.assessment)
        .subscribe(res => {
          console.log("res", res)

          if (res) {

            let allBarriersSelected = new AllBarriersSelected()
            allBarriersSelected.allBarriers =this.finalBarrierList
            allBarriersSelected.climateAction =res.climateAction
            allBarriersSelected.assessment =res;

          this.projectControllerServiceProxy.policyBar(allBarriersSelected).subscribe((res) => {
            this.messageService.add({
              severity: 'success',
              summary: 'Success',
              detail: 'Assessment has been created successfully',
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
            this.geographicalAreasCoveredArr = this.geographicalAreasCoveredArr.map(a => {
              let _a = new GeographicalAreasCoveredDto()
              _a.id = a.id
              _a.name = a.name
              _a.code = a.code
              return _a
            })  

            this.investorAssessment.assessment = res;
            this.mainAssessment =res
            this.createInvestorToolDto.sectors = this.sectorArray;
            this.createInvestorToolDto.impacts = this.impactArray;
            this.createInvestorToolDto.investortool = this.investorAssessment;
             this.createInvestorToolDto.investortool = this.investorAssessment;
             this.createInvestorToolDto.geographicalAreas = this.geographicalAreasCoveredArr;
            console.log("investorassessmet",this.createInvestorToolDto)
            this.investorToolControllerproxy.createinvestorToolAssessment(this.createInvestorToolDto)
              .subscribe(_res => {
                console.log("res final", _res)
                if (_res) {
                  console.log(_res)
                  // this.messageService.add({
                  //   severity: 'success',
                  //   summary: 'Success',
                  //   detail: 'Assessment created successfully',
                  //   closable: true,
                  // })
                  this.isSavedAssessment = true

                }
                // form.reset();
              }, error => {
                console.log(error)
                this.messageService.add({
                  severity: 'error',
                  summary: 'Error',
                  detail: 'Assessment detail saving failed',
                  closable: true,
                })
              })
          }
        }, error => {
          console.log(error)
          this.messageService.add({
            severity: 'error',
            summary: 'Error',
            detail: 'Assessment creation failed',
            closable: true,
          })
        })
    } else {
      this.messageService.add({
        severity: 'error',
        summary: 'Error',
        detail: 'Fill all mandatory fields',
        closable: true,
      })
    }

  }
  async saveDraft(category:any){
    
    let finalArray = this.processData.concat(this.outcomeData)
    if(this.isEditMode ==true){
      this.assessment = await this.assessmentControllerServiceProxy.findOne(this.assessmentId).toPromise()
      console.log("assessment",this.assessment.id)
      finalArray.map(x => x.data.map(y => y.assessment = this.assessment))
      console.log("finalArray33", finalArray)
    }
    else{
      console.log("mainAssessment",this.mainAssessment.id)
      finalArray.map(x => x.data.map(y => y.assessment = this.mainAssessment))
    }

    for(let i=0; i< this.sdgDataSendArray2.length; i++){
      for(let item of this.sdgDataSendArray2[i].data){
        item.portfolioSdg = this.selectedSDGs[i];
      }
      
    }

    for(let i=0; i< this.sdgDataSendArray4.length; i++){
      for(let item of this.sdgDataSendArray4[i].data){
        item.portfolioSdg = this.selectedSDGs[i];
      }
    }
    
    let data : any ={
      finalArray : finalArray,
      isDraft : true,
      isEdit : this.isEditMode,
      scaleSDGs : this.sdgDataSendArray2,
      sustainedSDGs : this.sdgDataSendArray4,
      sdgs : this.selectedSDGsWithAnswers
    }
    // this.assessmentControllerServiceProxy.update
    //@ts-ignore
    console.log("data",data)
    this.investorToolControllerproxy.createFinalAssessment(data)
      .subscribe(async _res => {
        console.log("res final", _res)

        console.log(_res)
        this.messageService.add({
          severity: 'success',
          summary: 'Success',
          detail: 'Assessment draft has been saved successfully',
          closable: true,
        })
        if(this.isEditMode ==false){
          console.log("mainAssessment",this.mainAssessment.id)
          this.router.navigate(['app/investor-tool-new-edit'], {  
            queryParams: { id: this.mainAssessment.id,isEdit:true},  
            });
          // window.location.reload();
        }
       
        
        // this.showResults();
        // this.isSavedAssessment = true
        // this.onCategoryTabChange('', this.tabView);


        // form.reset();
      }, error => {
        console.log(error)
        this.messageService.add({
          severity: 'error',
          summary: 'Error',
          detail: 'Assessment detail saving failed',
          closable: true,
        })
      })
  }


  selectAssessmentType(e: any) {

  }

  onItemSelectSectors(event: any) {
    // console.log("sector",this.sectorArray)
    // this.createInvestorToolDto.impacts =[]
    // this.createInvestorToolDto.impacts.push(event.value)
  }
  onItemSelectImpacts(event: any) {
    // console.log("ipacts",this.impactArray,this.impactCovered)

  }

  onMainTabChange(event: any) {
    this.mainTabIndex =event.index;
    // this.isValidated = true;
    // if(this.mainTabIndex==1){
    //   this.activeIndex2=0;
    // }
    console.log("main index", this.mainTabIndex)
  }
  onCategoryTabChange(event: any, tabview: TabView) {
    console.log("mainTabIndexArray",this.mainTabIndexArray,this.activeIndex)
    // this.isValidated=true
    this.categoryTabIndex =event.index;
    if(!this.failedLikelihoodArray.some(
      element  => element.tabIndex === this.categoryTabIndex
    )){
      this.isLikelihoodDisabled=true;
      this.initialLikelihood=0

    }
    else{
      this.isLikelihoodDisabled=false;
      this.initialLikelihood=1
    }

    if(!this.failedRelevanceArray.some(
      element  => element.tabIndex === this.categoryTabIndex
    )){
      this.isRelavanceDisabled=true;
      this.initialRelevance=0

    }
    else{
      this.isRelavanceDisabled=false;
      this.initialRelevance=1
    }
    console.log("category index", this.categoryTabIndex)

  }
  getSelectedHeader() {
    console.log("tabnaaame", this.tabView.tabs[this.selectedIndex].header);
  }

  async onsubmit(form: NgForm) {
    for(let item of this.processData){
      for(let item2 of item.data){
        if((item2.likelihood == null || item2.relavance == null) && item2.relavance != 0){
          this.messageService.add({
            severity: 'error',
            summary: 'Warning',
            detail: 'Fill all mandatory fields',
            closable: true,
          })

          return
        }
      }
    }

    for(let item of this.processData){
      for(let item2 of item.data){
        if((item2.likelihood_justification == null || item2.likelihood_justification === "") &&  item2.relavance != 0){
          this.messageService.add({
            severity: 'error',
            summary: 'Warning',
            detail: 'Fill all mandatory justification fields',
            closable: true,
          })

          return
        }
      }
    }

    for(let item of this.outcomeData){
      if(item.categoryID == 5 || item.categoryID ==7 || item.categoryID ==9 || item.categoryID ==10){

        for(let item2 of item.data){
          if(item2.justification == null || item2.justification === ""){
            this.messageService.add({
              severity: 'error',
              summary: 'Warning',
              detail: 'Fill all mandatory justification fields',
              closable: true,
            })
  
            return
          }
        }
      }
    }
    
    for(let item of this.sdgDataSendArray2){
      for(let item2 of item.data){
        if(item2.justification == null || item2.justification === ""){
          this.messageService.add({
            severity: 'error',
            summary: 'Warning',
            detail: 'Fill all mandatory justification fields',
            closable: true,
          })

          return
        }
      }
    }

    for(let item of this.sdgDataSendArray4){
      for(let item2 of item.data){
        if(item2.justification == null || item2.justification === ""){
          this.messageService.add({
            severity: 'error',
            summary: 'Warning',
            detail: 'Fill all mandatory justification fields',
            closable: true,
          })

          return
        }
      }
    }

    console.log("assesssssssss", this.assessment)
    console.log("finallsdgDataSendArray4", this.sdgDataSendArray4)
    console.log("finallsdgDataSendArray2", this.sdgDataSendArray2)

    if(this.assessment.assessment_approach === 'Direct'){
      console.log("Directttt")
      let finalArray = this.processData.concat(this.outcomeData)
      if(this.isEditMode ==true){
        this.assessment = await this.assessmentControllerServiceProxy.findOne(this.assessmentId).toPromise()
        console.log("assessment",this.assessment.id)
        finalArray.map(x => x.data.map(y => y.assessment = this.assessment))
        // console.log("finalArray33", finalArray)
      }
      else{
        console.log("mainAssessment",this.mainAssessment.id)
        finalArray.map(x => x.data.map(y => y.assessment = this.mainAssessment))
      }
      // finalArray.map(x => x.data.map(y => y.assessment = this.mainAssessment))
      // finalArray.map(x=>x.data.map(y=>y.investorTool=this.mainAssessment))
      console.log("finalArray", finalArray)

      for(let i=0; i< this.sdgDataSendArray2.length; i++){
        for(let item of this.sdgDataSendArray2[i].data){
          item.portfolioSdg = this.selectedSDGs[i];
        }
        
      }

      for(let i=0; i< this.sdgDataSendArray4.length; i++){
        for(let item of this.sdgDataSendArray4[i].data){
          item.portfolioSdg = this.selectedSDGs[i];
        }
        
      }

      let data : any ={
        finalArray : finalArray,
        scaleSDGs : this.sdgDataSendArray2,
        sustainedSDGs : this.sdgDataSendArray4,
        sdgs : this.selectedSDGsWithAnswers,
        isEdit:this.isEditMode,
        isDraft : false,

      }

      //@ts-ignore
      this.investorToolControllerproxy.createFinalAssessment(data)
        .subscribe(_res => {
          console.log("res final", _res)

          console.log(_res)
          this.messageService.add({
            severity: 'success',
            summary: 'Success',
            detail: 'Assessment has been created successfully',
            closable: true,
          })
          this.showResults();
          // this.isSavedAssessment = true
          // this.onCategoryTabChange('', this.tabView);


          // form.reset();
        }, error => {
          console.log(error)
          this.messageService.add({
            severity: 'error',
            summary: 'Error',
            detail: 'Assessment detail saving failed',
            closable: true,
          })
        })


     // console.log("+++++++++++", this.processData)
     // console.log("-----------", this.outcomeData)
    }
    else{
      console.log("Indirectttt")
      let finalArray = this.processData.concat(this.outcomeData)
      finalArray.map(x => x.data.map(y => y.assessment = this.mainAssessment))
      // finalArray.map(x=>x.data.map(y=>y.investorTool=this.mainAssessment))
      console.log("finalArray", finalArray)
      //@ts-ignore
      this.investorToolControllerproxy.createFinalAssessmentIndirect(finalArray)
        .subscribe(_res => {
          console.log("res final", _res)

          console.log(_res)
          this.messageService.add({
            severity: 'success',
            summary: 'Success',
            detail: 'Successfully sent to Data Collection Team',
            closable: true,
          })
          this.router.navigate(['/app/investor-tool-new'])
        //  this.showResults();

        }, error => {
          console.log(error)
          this.messageService.add({
            severity: 'error',
            summary: 'Error',
            detail: 'Assessment detail saving failed',
            closable: true,
          })
        })
    }


  }

  async showResults(){
    if(this.isEditMode ==true){
      this.assessment = await this.assessmentControllerServiceProxy.findOne(this.assessmentId).toPromise()
      setTimeout(() => {
        this.router.navigate(['../assessment-result-investor', this.assessment.id], { queryParams: { assessmentId: this.assessment.id }, relativeTo: this.activatedRoute });
      }, 2000);
      console.log("assessment",this.assessment.id)
      // console.log("finalArray33", finalArray)
    }
    else{
      console.log("mainAssessment",this.mainAssessment.id)
      setTimeout(() => {
        this.router.navigate(['../assessment-result-investor', this.mainAssessment.id], { queryParams: { assessmentId: this.mainAssessment.id }, relativeTo: this.activatedRoute });
      }, 2000);
    }
  }
  // next(data:any[],type:string){
  // console.log("category",data)
  // // data?.filter(investorAssessment => console.log(investorAssessment.likelihood_justification, investorAssessment.likelihood_justification !== undefined , investorAssessment.likelihood_justification !== ""))
  // data?.filter(investorAssessment => console.log(investorAssessment.indicator_details?.filter((indicator_details: IndicatorDetails ) =>
  // (indicator_details.justification !==""))?.length === (investorAssessment.indicator_details?.length) && this.isEditMode == true
  // ))
  // data?.filter(investorAssessment => console.log(investorAssessment.indicator_details?.filter((indicator_details: IndicatorDetails ) =>
  // (indicator_details.justification !=="")),(investorAssessment.indicator_details?.length) , this.isEditMode 
  // ))
  // if((data?.filter(investorAssessment => 
  //     (investorAssessment.relavance !== undefined) && 
  //     (investorAssessment.likelihood !== undefined) && 
  //     (investorAssessment.likelihood_justification !==undefined && investorAssessment.likelihood_justification !== "") &&
  //     ((investorAssessment.indicator_details?.filter((indicator_details: IndicatorDetails ) =>
  //       (indicator_details.justification !== undefined))?.length === (investorAssessment.indicator_details?.length-1) && this.isEditMode == false
  //     )||
  //     (investorAssessment.indicator_details?.filter((indicator_details: IndicatorDetails ) =>
  //       (indicator_details.justification !== undefined && indicator_details.justification !== ""))?.length === (investorAssessment.indicator_details?.length) && this.isEditMode == true
  //     ))||  
  //     (investorAssessment.relavance == 0))?.length === data?.length && type=='process')||
  //     (data?.filter(investorAssessment => 
  //       (investorAssessment.justification !== undefined) 
  //      )?.length === data?.data.length && type=='outcome')||
  //     (data?.data.filter(sdg => 
  //       (sdg.data?.filter((data: { justification: undefined; } ) =>
  //         (data.justification!== undefined))?.length === (sdg.data?.length)
  //       ))?.length === data?.data.length && type=='sdg')) {
  //         data.isValidated = true;
  //   if(this.activeIndexMain ===1 ){

  //     this.activeIndex2 =this.activeIndex2+1;
  //     console.log( "activeIndex2",this.activeIndex2)

  //   }
  //   if (this.activeIndex === 3 && this.activeIndexMain !== 1) {
  //     this.activeIndexMain = 1;
  //     this.activeIndex2=0;

  //   }
  //   if (this.activeIndex<=2 && this.activeIndex>=0 && this.activeIndexMain===0){
  //     this.activeIndex =this.activeIndex +1;
  //     console.log( this.activeIndex)

  //   }
  //   // return true
  // }else{
  //   this.messageService.add({
  //     severity: 'error',
  //     summary: 'Error',
  //     detail: 'Please fill all mandatory fields',
  //     closable: true,
  //   });
  // }
  //   // if(!this.mainTabIndexArray.includes(this.activeIndex)){
  //   //   console.log("mainTabIndexArray",this.mainTabIndexArray)
  //   //   this.isLikelihoodDisabled=false;
  //   //   this.isRelavanceDisabled=false;
  //   // }
  //   // if (this.mainTabIndexArray.includes(this.activeIndex)) {

  //   //   this.isLikelihoodDisabled=true;
  //   //   this.isRelavanceDisabled=true;
  //   // }
  // }
  next(data:{
    
    isValidated:boolean|null
    data: any[],

  },type:string){
    data.isValidated = false;
  console.log("category",data,type)
  // data.data?.filter(investorAssessment => console.log(investorAssessment.likelihood,investorAssessment.likelihood !== undefined , investorAssessment.likelihood !== null , investorAssessment.likelihood !== ''))
//   data.data?.filter(investorAssessment => console.log((investorAssessment.indicator_details?.filter((indicator_details: IndicatorDetails ) =>
//   (indicator_details.justification !== undefined && indicator_details.justification !== null))?.length
// ), (investorAssessment.indicator_details?.length-1)))
  if((data.data?.filter(investorAssessment => 
      (investorAssessment.relavance !== undefined) && 
      (investorAssessment.likelihood !== undefined ) && 
      (investorAssessment.likelihood_justification !== undefined && investorAssessment.likelihood_justification !== null && investorAssessment.likelihood_justification !== '') &&
      (investorAssessment.indicator_details?.filter((indicator_details: IndicatorDetails ) =>
        (indicator_details.justification !== undefined && indicator_details.justification !== null && indicator_details.justification !== ''))?.length === (investorAssessment.indicator_details?.length-1)
      )||
      // (investorAssessment.indicator_details?.filter((indicator_details: IndicatorDetails ) =>
      // (indicator_details.justification !== undefined))?.length === (investorAssessment.indicator_details?.length-1) && this.isEditMode==true
      // )||
       (investorAssessment.relavance == 0))?.length === data?.data?.length && type=='process')||
      (data?.data.filter(investorAssessment => 
        (investorAssessment.justification !== undefined && investorAssessment.justification !== null && investorAssessment.justification !== '') 
       )?.length === data?.data.length && type=='outcome')||
      (data?.data.filter(sdg => 
        (sdg.data?.filter((data: { justification: undefined; } ) =>
          (data.justification!== undefined))?.length === (sdg.data?.length)
        ))?.length === data?.data.length && type=='sdg')) {
          data.isValidated = true;
    if(this.activeIndexMain ===1 ){

      this.activeIndex2 =this.activeIndex2+1;
      console.log( "activeIndex2",this.activeIndex2)

    }
    if (this.activeIndex === 3 && this.activeIndexMain !== 1) {
      this.activeIndexMain = 1;
      this.activeIndex2=0;

    }
    if (this.activeIndex<=2 && this.activeIndex>=0 && this.activeIndexMain===0){
      this.activeIndex =this.activeIndex +1;
      console.log( this.activeIndex)

    }
    // return true
  }else{
    this.messageService.add({
      severity: 'error',
      summary: 'Error',
      detail: 'Please fill all mandatory fields',
      closable: true,
    });
  }
    // if(!this.mainTabIndexArray.includes(this.activeIndex)){
    //   console.log("mainTabIndexArray",this.mainTabIndexArray)
    //   this.isLikelihoodDisabled=false;
    //   this.isRelavanceDisabled=false;
    // }
    // if (this.mainTabIndexArray.includes(this.activeIndex)) {

    //   this.isLikelihoodDisabled=true;
    //   this.isRelavanceDisabled=true;
    // }
  }
  nextSDG(data:any[],type:string){
    console.log("category",data,type)
    if(type=='scaleSD'){
      this.isValidSCaleSD = false
    }
    if(type=='sustainedSD'){
      this.isValidSustainedSD = false
    }
    console.log("category",this.isValidSCaleSD,this.isValidSustainedSD)
    // this.isValidSustainedSD = false
    if((data?.filter(sdg => 
        (sdg.data?.filter((data: { justification: undefined; } ) =>
           (data.justification!== undefined && data.justification !== null && data.justification !== ''))?.length === (sdg.data?.length)
        ))?.length === data?.length )) {
          // data.isValidated = true;
          this.isValidSCaleSD=true
          if(type=='scaleSD'){
            this.isValidSCaleSD = true
          }
           if(type=='sustainedSD'){
            this.isValidSustainedSD = true
          }
    if(this.activeIndexMain ===1 ){

      this.activeIndex2 =this.activeIndex2+1;
      console.log( "activeIndex2",this.activeIndex2)

    }
    if (this.activeIndex === 3 && this.activeIndexMain !== 1) {
      this.activeIndexMain = 1;
      this.activeIndex2=0;

    }
    if (this.activeIndex<=2 && this.activeIndex>=0 && this.activeIndexMain===0){
      this.activeIndex =this.activeIndex +1;
      console.log( this.activeIndex)

    }
    // return true
  }else{
    this.messageService.add({
      severity: 'error',
      summary: 'Error',
      detail: 'Please fill all mandatory fields',
      closable: true,
    });
  }
  }
  onLevelofImplementationChange(event:any){
    console.log(event)
    if(event==='National')
    {
      this.levelofImplementation =1
      console.log("111")
    }
    else if(event==='Sub-national')
    {
      this.levelofImplementation =2
      console.log("222")
    }
    else{
      this.levelofImplementation =0
    }

  }

  getCategory(characteristics: any, category: any) {
    this.characteristicsArray = [];
    for (let x of this.characteristicsList) {
      if (x.category.name === category) {
        this.characteristicsArray.push(x)
      }
    }
    return this.characteristicsArray
  }

  characteristicWeightScore :CharacteristicWeight = {};
  chaCategoryWeightTotal : ChaCategoryWeightTotal = {};
  chaCategoryTotalEqualsTo1 : ChaCategoryTotalEqualsTo1 = {};

  characteristicLikelihoodWeightScore :CharacteristicWeight = {};
  chaCategoryLikelihoodWeightTotal : ChaCategoryWeightTotal = {};
  chaCategoryLikelihoodTotalEqualsTo1 : ChaCategoryTotalEqualsTo1 = {};



  onLikelihoodWeightChange(categoryName: string, characteristicName : string, chaWeight: number) {
    this.isLikelihoodDisabled=false;
    this.initialLikelihood=1
    this.characteristicLikelihoodWeightScore[characteristicName] = chaWeight
   this.chaCategoryLikelihoodWeightTotal[categoryName] = 0
   this.chaCategoryLikelihoodTotalEqualsTo1[categoryName] = false


  for(let cha of  this.getCategory(characteristicName, categoryName)) {
    if(!isNaN(this.characteristicLikelihoodWeightScore[cha.name])){
      this.chaCategoryLikelihoodWeightTotal[categoryName] =  this.chaCategoryLikelihoodWeightTotal[categoryName] + this.characteristicLikelihoodWeightScore[cha.name]
    }


     console.log('Characteristicrrrrrrr:',  this.characteristicLikelihoodWeightScore[cha.name],isNaN(this.characteristicLikelihoodWeightScore[cha.name]));
  }

  if( this.chaCategoryLikelihoodWeightTotal[categoryName] == 100|| this.chaCategoryLikelihoodWeightTotal[categoryName] ==0){
   this.chaCategoryLikelihoodTotalEqualsTo1[categoryName] = true
   this.initialLikelihood=0
   this.isLikelihoodDisabled=true;
    // if (!this.mainTabIndexArray.includes(this.activeIndex)) {
    //   this.mainTabIndexArray.push(this.activeIndex);

    // }
    this.failedLikelihoodArray= this.failedLikelihoodArray.filter((element) => element.category !== categoryName);
      console.log("failedLikelihoodArray",this.failedLikelihoodArray)



  }
  else{
    if (!this.failedLikelihoodArray.some( (element) => element.category === categoryName)) {
      this.failedLikelihoodArray.push({category:categoryName,tabIndex:this.activeIndex});
      console.log("failedLikelihoodArray",this.failedLikelihoodArray)
    }

  }
  console.log("failedLikelihoodArray444",this.failedLikelihoodArray)
  console.log('LL Characteristic Name:',categoryName ,  characteristicName, 'chaWeight:', chaWeight);
 console.log( 'LL category :',categoryName,' Total: ',  this.chaCategoryLikelihoodWeightTotal[categoryName]);


 }


 onRelevanceWeightChange(categoryName: string, characteristicName : string, chaWeight: number) {
  // console.log('Characteristicrrrrrrr:',  chaWeight);
  this.isRelavanceDisabled=false;
  this.initialRelevance=1;
   this.characteristicWeightScore[characteristicName] = chaWeight
  this.chaCategoryWeightTotal[categoryName] = 0
  this.chaCategoryTotalEqualsTo1[categoryName] = false

 for(let cha of  this.getCategory(characteristicName, categoryName)) {
  if(!isNaN(this.characteristicWeightScore[cha.name])){
    this.chaCategoryWeightTotal[categoryName] =  this.chaCategoryWeightTotal[categoryName] +  this.characteristicWeightScore[cha.name]
  }


    console.log('Characteristicrrrrrrr:',  this.characteristicWeightScore[cha.name]);
 }

 if( this.chaCategoryWeightTotal[categoryName] == 100|| this.chaCategoryWeightTotal[categoryName] == 0){
  this.chaCategoryTotalEqualsTo1[categoryName] = true

  this.initialRelevance=0
  this.isRelavanceDisabled=true
  this.failedRelevanceArray= this.failedRelevanceArray.filter((element) => element.category !== categoryName);
      console.log("failedRelevanceArray",this.failedRelevanceArray)
 }
 else{
  if (!this.failedRelevanceArray.some( (element) => element.category === categoryName)) {
    this.failedRelevanceArray.push({category:categoryName,tabIndex:this.activeIndex});
    console.log("failedRelevanceArray",this.failedRelevanceArray)
  }

}
 console.log('Characteristic Name:',categoryName ,  characteristicName, 'chaWeight:', chaWeight);
  console.log( 'category :',categoryName,' Total: ',  this.chaCategoryWeightTotal[categoryName]);
  console.log("+++++++++",this.characteristicWeightScore );
}

onAssessmentApproachchange(approach:any){
  console.log("approach",approach)
  if (approach==='Direct'){
    this.approach=1;
  }
  if (approach==='Indirect'){
    this.approach=2;
  }
}

onRelavanceChange(data:any,ins:any){
  console.log("========",this.processData,data,ins)
  // for (let i of object) {

  // }

}

pushBarriers(barrier:any){
  console.log("barrier",barrier)
  this.finalBarrierList.push(barrier)
  this.barrierSelected = new BarrierSelected()

}
barriersNameArray(Characteristics:any[]){
  if (Characteristics?.length>0){
    let charArray = Characteristics.map(x=>{return x.name});
    return charArray.join(", ")
  }
  else{
    return "-"
  }   

}

toDownload() {
  this.isDownloadMode = 1;
  
}
showDialog(){
  this.barrierBox =true;
  console.log(this.barrierBox)  
}

onChangeRelevance(relevance : any , data : any){
  console.log("relevance", relevance)
  console.log("data22", data)

  if(relevance == 0){
    data.likelihood_justification = null;
    data.likelihood = null;

    for(let item of data.indicator_details){
      item.value = null;
      item.justification = null;
    }

  }
}
onUpload(event:UploadEvent, data : InvestorAssessment) {
  if(event.originalEvent.body){
    data.uploadedDocumentPath = event.originalEvent.body.fileName
  }

  this.messageService.add({severity: 'info', summary: 'File Uploaded', detail: ''});

}

addNewline(text: any) {
  if (!text) {
    return '';
  }
  // Replace three spaces with a line break
  return text.replace(/ {3}/g, '<br><br>');
}

assignSDG(sdg : any , data : any){
  console.log("sdgs", sdg)
  console.log("data", data)

  data.portfolioSdg = sdg

  console.log("data22", data)
}


   /*  onItemSelectSDGs(event: any) {
      console.log("rrr", this.selectedSDGs);
      console.log("event", event);
     /// this.selectedSDGsWithAnswers = this.selectedSDGs;
     // console.log(" this.selectedSDGsWithAnswers", this.selectedSDGsWithAnswers);
     const len1 =  this.sdgDataSendArray2.length;
     const len2 =  this.sdgDataSendArray4.length;

     console.log("lengthh", len1);
     console.log("selectedSDGs.lengthh", this.selectedSDGs.length);
    //  this.sdgDataSendArray2 = [];
    //  this.sdgDataSendArray4 = [];

      for (let index = len1; index < this.selectedSDGs.length; index++) {
        const sdgData = JSON.parse(JSON.stringify(this.sdgDataSendArray[0]));

        const newObj = {
          CategoryName: sdgData.CategoryName,
          categoryID: sdgData.categoryID,
          type: sdgData.type,
          data: sdgData.data,
          index: index
        };

        this.sdgDataSendArray2.push(newObj);
      }


      for (let index = len2; index < this.selectedSDGs.length; index++) {
        const sdgData = JSON.parse(JSON.stringify(this.sdgDataSendArray3[0]));

        const newObj = {
          CategoryName: sdgData.CategoryName,
          categoryID: sdgData.categoryID,
          type: sdgData.type,
          data: sdgData.data,
          index: index
        };

        this.sdgDataSendArray4.push(newObj);
      }



      console.log("this.sdgDataSendArray2", this.sdgDataSendArray2);
      console.log("this.sdgDataSendArray4", this.sdgDataSendArray4);
    }
 */
    onItemSelectSDGs(event: any) {
      console.log("rrr", this.selectedSDGs);
      console.log("event", event);
    
      // Create an array of indexes for selected items
      const selectedIndexes = this.selectedSDGs.map(sdg => sdg.id);
    
      // Remove items from sdgDataSendArray2 that are not in the selectedSDGs
      this.sdgDataSendArray2 = this.sdgDataSendArray2.filter((sdgData: { index: number; }) => selectedIndexes.includes(sdgData.index));
    
      // Remove items from sdgDataSendArray4 that are not in the selectedSDGs
      this.sdgDataSendArray4 = this.sdgDataSendArray4.filter((sdgData: { index: number; }) => selectedIndexes.includes(sdgData.index));
    
      // Find items in selectedSDGs that are not in sdgDataSendArray2 and add them
      this.selectedSDGs.forEach(selectedSdg => {
        if (!this.sdgDataSendArray2.some((sdgData: { index: number; }) => sdgData.index === selectedSdg.id)) {
          const sdgData = JSON.parse(JSON.stringify(this.sdgDataSendArray[0]));
          const newObj = {
            CategoryName: sdgData.CategoryName,
            categoryID: sdgData.categoryID,
            type: sdgData.type,
            data: sdgData.data,
            index: selectedSdg.id
          };
          this.sdgDataSendArray2.push(newObj);
        }
      });
    
      // Find items in selectedSDGs that are not in sdgDataSendArray4 and add them
      this.selectedSDGs.forEach(selectedSdg => {
        if (!this.sdgDataSendArray4.some((sdgData: { index: number; }) => sdgData.index === selectedSdg.id)) {
          const sdgData = JSON.parse(JSON.stringify(this.sdgDataSendArray3[0]));
          const newObj = {
            CategoryName: sdgData.CategoryName,
            categoryID: sdgData.categoryID,
            type: sdgData.type,
            data: sdgData.data,
            index: selectedSdg.id
          };
          this.sdgDataSendArray4.push(newObj);
        }
      });


      // Update selectedSDGsWithAnswers based on the selectedSDGs
  this.selectedSDGsWithAnswers = this.selectedSDGs.map(selectedSdg => {
    const existingAnswer = this.selectedSDGsWithAnswers.find(
      sdgWithAnswer => sdgWithAnswer.id === selectedSdg.id
    );

    if (existingAnswer) {
      return { ...selectedSdg, answer: existingAnswer.answer };
    } else {
      // If the selected item is not in selectedSDGsWithAnswers, initialize it with a default answer
      return { ...selectedSdg, answer: ""  };
    }
  });

    
      console.log("this.sdgDataSendArray2", this.sdgDataSendArray2);
      console.log("this.sdgDataSendArray4", this.sdgDataSendArray4);
      console.log("this.selectedSDGsWithAnswers", this.selectedSDGsWithAnswers);
    }
    

    
    getProductsData() {
      return [
          {
              barrier: 'Lack of financial capacity',
              explanation: 'Some plant operators simply do not have the financial capacity to introduce the technology or to train staff adequately',
              cha: 'Scale up, Beneficiaries',
              ans: 'No',
          },
          {
            barrier: 'Lack of public awareness of environmental and private economy benefits of EE measures and conservation',
            explanation: 'Lack of awareness may also lead to reluctance to introduce low-carbon technologies, such as EV or HEV, which may disrupt conventional technologies',
            cha: 'Awareness, Behaviour',
            ans: 'Yes',
        },
        {
          barrier: 'Lack of institutional support',
          explanation: 'Insufficient support from municipal government authorities hinder the adoption and proper implementation of the initiative',
          cha: 'Institutional and regulatory',
          ans: 'No',
      },
      ]
    }
  
}
interface UploadEvent {
  originalEvent: HttpResponse<FileDocument>;
  files: File[];
  }

  interface FileDocument {
  fileName: string
  }

