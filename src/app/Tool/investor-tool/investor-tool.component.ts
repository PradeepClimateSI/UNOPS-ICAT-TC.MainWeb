import { AfterContentChecked, ChangeDetectorRef, Component, OnInit, ViewChild } from '@angular/core';
import { NgForm } from '@angular/forms';
import { FieldNames, MasterDataDto, MasterDataService, chapter6_url } from 'app/shared/master-data.service';
import * as moment from 'moment';
import { ConfirmationService,MessageService } from 'primeng/api';
import {Any, AllBarriersSelected, Assessment, BarrierSelected, Characteristics, ClimateAction, CreateInvestorToolDto, GeographicalAreasCoveredDto, ImpactCovered, IndicatorDetails, InstitutionControllerServiceProxy, InvestorAssessment, InvestorQuestions, InvestorTool, InvestorToolControllerServiceProxy, MethodologyAssessmentControllerServiceProxy, PolicyBarriers, ProjectControllerServiceProxy, Sector, SectorControllerServiceProxy, AssessmentControllerServiceProxy, Category, PortfolioSdg, TotalInvestment, TotalInvestmentDto } from 'shared/service-proxies/service-proxies';
import decode from 'jwt-decode';
import { TabView } from 'primeng/tabview';
import { ActivatedRoute, Router } from '@angular/router';
import { environment } from 'environments/environment';
import { HttpResponse } from '@angular/common/http';
import { GuidanceVideoComponent } from 'app/guidance-video/guidance-video.component';
import { DialogService } from 'primeng/dynamicdialog';
import { of } from 'rxjs';
import { map } from 'rxjs/operators';
import { MultiSelect } from 'primeng/multiselect';


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

  @ViewChild('multiSelectComponent') multiSelectComponent: MultiSelect;
  geographicalArea:MasterDataDto = new MasterDataDto()
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
  totalInvestments: TotalInvestment[] = []

  
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
  levelofImplementation: number = 0;
  yesNoAnswer: any[] = [{ id: 1, name: "Yes" }, { id: 2, name: "No" }];
  investmentType: any[] = [{ id: 1, name: "Type 01" }, { id: 2, name: "Type 02" }, { id: 3, name: "Type 03" }];
  angle: string

  processData: {
    type: string,
    CategoryName: string,
    categoryID: number,
    isValidated:boolean|null
    data: InvestorAssessment[],
    id:number

  }[] = [];

  outcomeData: {
    type: string,
    CategoryName: string,
    categoryID: number,
    isValidated:boolean|null
    data: InvestorAssessment[]
    id:number
  }[] = [];
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
  visionExample: { title: string; value: string; }[];
  invest1: any;
  investment_instruments: MasterDataDto[];
  investment_instruments_1: MasterDataDto[];
  investment_instruments_2: MasterDataDto[];
  investment_instruments_3: MasterDataDto[];
  abatement: any;
  barrierChList: any;
  isExceeded: any;
  minDate: Date;
  relevance_tooltip: string;
  ghg_info: any
  sdg_info: any
  adaptation_info: any
  ghg_score_info: any
  tabIsValid: {[key: number]: boolean}= {}
  tab1IsValid: {[key: number]: boolean}= {}
  maintabIsValid: {[key: number]: boolean}= {}
  isFirstLoading0: boolean = true;
  isFirstLoading1: boolean = true;
  fieldNames = FieldNames
  minDateTo: Date;
  notFilledCategories: any[] = []
  chapter6_url = chapter6_url
  selectedInstruments: any[]
  show_less_message: boolean;
  phaseTransformExapmle: any[] = []
   from_date:Date
  to_date: Date

  constructor(
    private projectControllerServiceProxy: ProjectControllerServiceProxy,
    public masterDataService: MasterDataService,
    private messageService: MessageService,
    private methodologyAssessmentControllerServiceProxy: MethodologyAssessmentControllerServiceProxy,
    private sectorProxy: SectorControllerServiceProxy,
    private investorToolControllerproxy: InvestorToolControllerServiceProxy,
    private router: Router,
    private instituionProxy: InstitutionControllerServiceProxy,
    private changeDetector: ChangeDetectorRef,
    private activatedRoute: ActivatedRoute,
    private assessmentControllerServiceProxy: AssessmentControllerServiceProxy,
    protected dialogService: DialogService,
    private confirmationService: ConfirmationService,

  ) {
    this.uploadUrl = environment.baseUrlAPI + "/document/upload-file-by-name" ; 
    this.fileServerURL = environment.baseUrlAPI+'/document/downloadDocumentsFromFileName/uploads';

  }
  async ngOnInit(): Promise<void> {
    this.phaseTransformExapmle = this.masterDataService.phase_transfrom
    this.levelOfImplementation = this.masterDataService.level_of_implemetation;
    this.geographicalAreasCovered = this.masterDataService.level_of_implemetation;
    this.investment_instruments = this.masterDataService.investment_instruments
    this.ghg_info = this.masterDataService.other_invest_ghg_info
    this.sdg_info = this.masterDataService.other_invest_sdg_info
    this.adaptation_info = this.masterDataService.other_invest_adaptation_info
    this.ghg_score_info = this.masterDataService.other_invest_ghg_score_info

    this.relevance_tooltip = "Does the process characteristic affects/impacts any of the identified barriers? does the intervention affects/impacts the process characteristic?"

    this.activatedRoute.queryParams.subscribe(params => {
      params['isEdit'] == 'true' ? (this.isEditMode = true) : false
      this.assessmentId = params['id'];
      if (!this.assessmentId && this.isEditMode) {
        window.location.reload()
      }
    })
    if (this.isEditMode == false) {
      await this.getPolicies();
      await this.getAllImpactsCovered();
      await this.getCharacteristics();
      // for (let i = 0; i < 3; i++) {
      //   this.totalInvestments.push(new TotalInvestment)
      // }

    } else {
      try {
        await this.getSavedAssessment()
      }
      catch (error) {
      }

    }
    this.isFirstLoading0 = false


    this.visionExample = [
      { title: 'Transformational Vision', value: 'Decarbonized electricity sector with a high % of Solar PV energy which will enable economic growth and will lead the shift of the labour market towards green jobs.' },
      { title: 'Long term ( > 15 years)', value: 'Zero-carbon electricity production. The 2050 vision is to achieve 60% solar PV in the national electricity mix and create 2 million new green jobs.' },
      { title: 'Medium term (> 5 years and  < 15 years)', value: 'Achieve 30% solar PV in the national electricity mix and create 1 million new green jobs. ' },
      { title: 'Short term (< 5 years)', value: 'Install 20 GW of rooftop solar PV and create 200,000 new green jobs in doing so. The solar PV policy is implemented at subnational levels, supported by incentives for private sector involvement and knowledge development.' },
      { title: 'Phase of transformation', value: 'Acceleration. Solar PV is widely accepted in the society and its use is spreading increasingly fast. Fossil-fuel based energy production is being challenged as the only way to ensure a reliable energy supply. Changes have already occurred in the economy, institutions and society as a result of the spreading of Solar PV.' },
      { title: 'Intervention contribution to change the system to achieve the vision', value: 'The intervention being assessed will facilitate the spreading of Solar PV installations and thus contribute to increase the penetration of solar PV in the national electricity mix.' },
    ]

    this.tableData = this.getProductsData();
    this.categoryTabIndex = 0;
    this.approach = 1
    this.assessment.assessment_approach = 'Direct'
    this.isLikelihoodDisabled = true;
    this.isRelavanceDisabled = true;
    this.assessment_types = this.masterDataService.assessment_type;


    this.likelihood = this.masterDataService.likelihood;
    this.relevance = this.masterDataService.relevance;
    this.score = this.masterDataService.score;
    this.outcomeScaleScore = this.masterDataService.outcomeScaleScore;
    this.outcomeSustainedScore = this.masterDataService.outcomeSustainedScore;
    this.sdg_answers = this.masterDataService.sdg_answers;

    this.assessmentMethods = this.masterDataService.assessment_method;
    this.assessmentApproach = this.masterDataService.assessment_approach2;

    const token = localStorage.getItem('ACCESS_TOKEN')!;
    const countryId = token ? decode<any>(token).countryId : 0;
    this.countryID = countryId;

    let intTypeFilter: string[] = new Array();

    intTypeFilter.push('type.id||$eq||' + 3);

    this.investorToolControllerproxy.findAllSDGs().subscribe((res: any) => {
      this.sdgList = res;
    });

  }
  
     
    
    
  
  async getSavedAssessment(){
    await this.getCharacteristics();
    this.assessment = await this.assessmentControllerServiceProxy.findOne(this.assessmentId).toPromise();
    this.processData = await this.investorToolControllerproxy.getProcessData(this.assessmentId).toPromise();
    this.outcomeData = await this.investorToolControllerproxy.getOutcomeData(this.assessmentId).toPromise();
    this.sdgDataSendArray2 = await this.investorToolControllerproxy.getScaleSDGData(this.assessmentId).toPromise();
    this.sdgDataSendArray4 = await this.investorToolControllerproxy.getSustainedSDGData(this.assessmentId).toPromise();
    this.selectedSDGs = await this.investorToolControllerproxy.getSelectedSDGs(this.assessmentId).toPromise();
    this.selectedSDGsWithAnswers = await this.investorToolControllerproxy.getSelectedSDGsWithAnswers(this.assessmentId).toPromise();
    this.investorAssessment = await this.investorToolControllerproxy.getResultByAssessment(this.assessmentId).toPromise();
    this.from_date= new Date(
      this.assessment.from?.year(),
      this.assessment.from?.month(),
      this.assessment.from?.date()
    );
    this.to_date= new Date(
      this.assessment.to?.year(),
      this.assessment.to?.month(),
      this.assessment.to?.date()
    );

    this.processData.forEach((d)=>{
      if(d.CategoryName == this.assessment.processDraftLocation){
        this.activeIndex = d.categoryID -1;
      }
    })
    this.outcomeData.forEach((d)=>{
      if(d.CategoryName == this.assessment.outcomeDraftLocation){
        this.activeIndex2 = d.id ;
      }
    })
    if(this.assessment.lastDraftLocation =='out'){
      this.activeIndexMain =1;
    }

    this.outcomeData = this.outcomeData.map((d) => {
      if (d.CategoryName === 'GHG Scale of the Outcome') {
        d.data =  d.data.map(_d => {
          if (_d.characteristics.code === 'MICRO_LEVEL') {
            _d['abatement'] = _d.expected_ghg_mitigation * Math.pow(10, 3) / this.investorAssessment.total_investment 
          }
          return _d
        })
      }
      return d
    })

    this.totalInvestments = this.investorAssessment.total_investements

    this.assessment = await this.assessmentControllerServiceProxy.findOne(this.assessmentId).toPromise();
    this.policies.push(this.assessment.climateAction);
    this.finalBarrierList = this.assessment['policy_barrier'];
    let areas: MasterDataDto[] = []
    this.assessment['geographicalAreasCovered'].map((area: { code: any; }) => {
    let level = this.levelOfImplementation.find(o => o.code === area.code);
    if (level) {
      areas.push(level);
    }
    })
    this.geographicalAreasCoveredArr = areas;

    this.geographicalArea = this.geographicalAreasCoveredArr[0]
    this.assessment['sector'].map((sector: Sector) => {
      let sec = new Sector()
      sec.id = sector.id
      sec.name = sector.name
      this.sectorArray.push(sec)
    })
    this.sectorList = this.sectorArray
    this.processData = await this.investorToolControllerproxy.getProcessData(this.assessmentId).toPromise();
    this.setFrom();
    this.setTo();
    this.draftLoading = true;
  }

  onChangeSDGsAnswer(withAnswers:any , item : any){
  }

  ngAfterContentChecked(): void {
    this.changeDetector.detectChanges();
  }
  async getPolicies() {
    this.policies = await this.projectControllerServiceProxy.findAllPolicies().toPromise();
  }
  async getAllImpactsCovered() {
    this.impactCovered = await this.investorToolControllerproxy.findAllImpactCovered().toPromise();
  }

  setFrom(){
    if(this.assessment.from){  
      let convertTime = moment(this.assessment.from).format("DD/MM/YYYY HH:mm:ss");
      let convertTimeObject = new Date(convertTime);
      //@ts-ignore - We are accepting Date object in front-end
      this.assessment.from = convertTimeObject;
    }

  }

  watchVideo(){
    let ref = this.dialogService.open(GuidanceVideoComponent, {
      header: 'Guidance Video',
      width: '60%',
      contentStyle: {"overflow": "auto"},
      baseZIndex: 10000,
      data: {
        sourceName: 'Incestment',
      },
    });

    ref.onClose.subscribe(() => {
      
    })
  }

  setTo(){
    if(this.assessment.to){
      let convertTime = moment(this.assessment.to).format(" HH:mm:ss");
      let convertTimeObject = new Date(convertTime);
      //@ts-ignore - We are accepting Date object in front-end
      this.assessment.to = convertTimeObject;
    }

  }

  async getCharacteristics() {
   
    this.investorToolControllerproxy.findAllSDGs().subscribe((res: any[]) => {
      this.sdgList = res
     });

    try{
      this.investorQuestions= await this.investorToolControllerproxy.findAllIndicatorquestions().toPromise();

    this.characteristicsList = await this.methodologyAssessmentControllerServiceProxy.findAllCharacteristics().toPromise();
    this.barrierChList = [...this.characteristicsList];
    this.barrierChList = this.barrierChList.filter((ch: Characteristics) => {return ch.category.type === 'process' });
    this.characteristicsLoaded = true;
    this.methodologyAssessmentControllerServiceProxy.findAllCategories().toPromise().then((res2: any) => {

      const customOrder = [1, 2, 3, 4, 5, 7, 6, 8, 9, 10];


      const sortedRes2 = res2.sort((a : any, b: any) => {
        const indexA = customOrder.indexOf(a.id);
        const indexB = customOrder.indexOf(b.id);
        return indexA - indexB;
      });

      for (let x of res2) {
        let categoryArray: InvestorAssessment[] =[];
        for (let z of this.characteristicsList) {
          if (z.category.name === x.name) {
            let newCharData = new InvestorAssessment();
            newCharData.characteristics = z;

            for(let q of this.investorQuestions){
              if(newCharData.characteristics.id ===q.characteristics.id){
                let indicatorDetails =new IndicatorDetails();
                indicatorDetails.type='question';
                indicatorDetails.question = q;
                newCharData.indicator_details.push(indicatorDetails);

              }
            }

            categoryArray.push(newCharData);

          }

        }

        if (x.type === 'process') {
          this.processData.push({
            type: 'process', CategoryName: x.name, categoryID: x.id,
            data: categoryArray,
            isValidated: null,
            id: 0
          })


        }
        if (x.type === 'outcome') {
          this.meth1Outcomes.push(x);

          this.outcomeData.push({
            type: 'outcome', CategoryName: x.name, categoryID: x.id,
            data: categoryArray,
            isValidated: null,
            id: 0
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
      }
    });
    }
    catch (error) {
    }
   

   
  }

  save(form: NgForm) {
    this.isStageDisble =true;

    this.assessment.tool = 'INVESTOR'
    this.assessment.year = moment(new Date()).format("DD/MM/YYYY")
    if (!this.assessment.id) this.assessment.createdOn = moment(new Date())
    this.assessment.editedOn = moment(new Date())

    if (form.valid) {
      this.methodologyAssessmentControllerServiceProxy.saveAssessment(this.assessment)
        .subscribe(res => {

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
            this.geographicalAreasCoveredArr = []
            let _a = new GeographicalAreasCoveredDto()
            _a.id = this.geographicalArea.id
            _a.name = this.geographicalArea.name
            _a.code = this.geographicalArea.code
            this.geographicalAreasCoveredArr.push(_a) 

            this.investorAssessment.assessment = res;
            this.mainAssessment =res
            this.createInvestorToolDto.sectors = this.sectorArray;
            this.createInvestorToolDto.impacts = this.impactArray;
            this.createInvestorToolDto.investortool = this.investorAssessment;
             this.createInvestorToolDto.investortool = this.investorAssessment;
             this.createInvestorToolDto.geographicalAreas = this.geographicalAreasCoveredArr;
            this.investorToolControllerproxy.createinvestorToolAssessment(this.createInvestorToolDto)
              .subscribe(async _res => {
                if (_res) {
                  this.investorAssessment = _res
                  let investDto = new TotalInvestmentDto()
                  this.totalInvestments = this.totalInvestments.map(invest => {
                    let instrument = this.masterDataService.investment_instruments.find(o => o.code === invest.instrument_code)
                    if (instrument) {
                      invest.instrument_name = instrument.name
                    }
                    let tool = new InvestorTool()
                    tool.id = _res.id
                    invest.investor_tool = tool
                    return invest
                  })
                  investDto.totalInvestements = this.totalInvestments
                  await this.investorToolControllerproxy.saveTotalInvestments(investDto).toPromise();
                  this.isSavedAssessment = true

                }
              }, error => {
                this.messageService.add({
                  severity: 'error',
                  summary: 'Error',
                  detail: 'Assessment detail saving failed',
                  closable: true,
                })
              })
          }
        }, error => {
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
  async saveDraft(category:any,processDraftLocation:string,type:string){
    let finalArray = this.processData.concat(this.outcomeData)
    if(this.isEditMode ==true){
      this.assessment = await this.assessmentControllerServiceProxy.findOne(this.assessmentId).toPromise();
      finalArray.map(x => x.data.map(y => y.assessment = this.assessment));
    }
    else{
      finalArray.map(x => x.data.map(y => y.assessment = this.mainAssessment));
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
    let proDraftLocation =this.assessment.processDraftLocation;
    let outDraftLocation = this.assessment.outcomeDraftLocation;

    if(type =='pro'){
      proDraftLocation= processDraftLocation
    }
   if(type =='out'){
    outDraftLocation= processDraftLocation
    }

    let data : any ={
      finalArray : finalArray,
      isDraft : true,
      proDraftLocation: proDraftLocation,
      outDraftLocation: outDraftLocation,
      lastDraftLocation:type,
      isEdit : this.isEditMode,
      scaleSDGs : this.sdgDataSendArray2,
      sustainedSDGs : this.sdgDataSendArray4,
      sdgs : this.selectedSDGsWithAnswers
    }
    this.investorToolControllerproxy.createFinalAssessment(data)
      .subscribe(async _res => {

        this.messageService.add({
          severity: 'success',
          summary: 'Success',
          detail: 'Assessment draft has been saved successfully',
          closable: true,
        })
        this.setFrom()
        this.setTo()
        if(this.isEditMode ==false){
          this.router.navigate(['app/investor-tool-new-edit'], {  
            queryParams: { id: this.mainAssessment.id,isEdit:true},  
            });
        }
      }, error => {
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

  onSelectIntervention(event: any) {
    this.minDate = new Date(event.value.dateOfImplementation)
    this.geographicalArea = this.geographicalAreasCovered.find(item=>{
      if (item.name==this.assessment.climateAction.geographicalAreaCovered){
        return item
      }
    })
    this.sectorList = this.assessment.climateAction.policySector.map(i=> i.sector)
    this.sectorArray = this.sectorList
  }

  onChangeGeoAreaCovered(){
    if(this.assessment.climateAction.geographicalAreaCovered && this.geographicalArea.name !==this.assessment.climateAction.geographicalAreaCovered){
      this.confirmationService.confirm({
        message: `You selected a geographical scope that deviates from the one that was assigned to this intervention- ${this.assessment.climateAction.geographicalAreaCovered }. Are you sure you want to continue with this selection?`,
        header: 'Confirmation',
        acceptIcon: 'icon-not-visible',
        rejectIcon: 'icon-not-visible',
        acceptLabel: 'Continue',
        rejectLabel: 'Go back',
        key: 'geoConfirm',
        accept: () => {
        },
        reject: () => { 
          this.geographicalArea = this.geographicalAreasCovered.find(item=>{
            if (item.name==this.assessment.climateAction.geographicalAreaCovered){
              return item
            }
          })
        },
      });
    }
  }

  onItemSelectSectors(event: any) {
    if(this.assessment.climateAction.policySector){
      if(this.assessment.climateAction.policySector.length !=  this.sectorArray.length){
        this.closeMultiSelect();
        this.confirmationService.confirm({
          message: `You selected sectors that deviates from the one that was assigned to this intervention- ${ this.assessment.climateAction.policySector.map(i=> i.sector.name).join(",")}. Are you sure you want to continue with this selection?`,
          header: 'Confirmation',
          acceptIcon: 'icon-not-visible',
          rejectIcon: 'icon-not-visible',
          acceptLabel: 'Continue',
          rejectLabel: 'Go back',
          key: 'sectorConfirm',
          accept: () => {
          },
          reject: () => { 
            this.sectorArray = this.sectorList
          },
        });
      }
      
    }
    
  }
  closeMultiSelect() {
    if (this.multiSelectComponent) {
      this.multiSelectComponent.overlayVisible = false;
    }
  }
  onItemSelectImpacts(event: any) {

  }

  onMainTabChange(event: any) {
    this.mainTabIndex =event.index;
    for (let i = 0; i<2; i++) {
      if (i == 0) {
        if (!this.isFirstLoading0) {
          this.checkTab1Mandatory(4)
  
          this.maintabIsValid[i] = true
          for (let k of Object.keys(this.tab1IsValid)) {
            if (!this.tab1IsValid[parseInt(k)]){
              this.maintabIsValid[i] = false
              break
            }
          }
        }
      } else {
        if (!this.isFirstLoading1) {
          this.checkTab2Mandatory(6)
          this.maintabIsValid[i] = true
          for (let k of Object.keys(this.tabIsValid)) {
            if (!this.tabIsValid[parseInt(k)]){
              this.maintabIsValid[i] = false
              break
            }
          }
        } else {
          this.isFirstLoading1 = false
        }
      }
    }
  }

  onCategoryTabChange(event: any, tabview: TabView, type: string) {
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
    if (type === 'process'){
      this.checkTab1Mandatory(event.index)
    } else {
      this.checkTab2Mandatory(event.index)
    }
  }

  checkTab1Mandatory(idx: number) {
    for (const [index, category] of this.processData.entries()) {
      if (index < idx) {
        let validation = this.checkValidation(category.data, 'process')
        this.tab1IsValid[index] = validation
        if (!validation) {
          this.notFilledCategories.push(category)
        } else {
          this.notFilledCategories = this.notFilledCategories.filter(o => o.CategoryName !== category.CategoryName)
        }
      }
    }
  }

  checkTab2Mandatory(idx: number) {
    for (const [index, category] of this.outcomeData.entries()) {
      let validation = false
      if ((category.CategoryName ==='Adaptation Time frame over which the outcome is sustained' && index <= idx) || index < idx) {
        if(category.CategoryName === 'SDG Scale of the Outcome' ) {
          validation = this.sdgValidation(this.sdgDataSendArray2)
        } else if (category.CategoryName === 'SDG Time frame over which the outcome is sustained') {
          validation = this.sdgValidation(this.sdgDataSendArray4)
        } else {
          validation = this.checkValidation(category.data, 'outcome')
        }
        this.tabIsValid[index] = validation
        if (validation) {
          this.notFilledCategories = this.notFilledCategories.filter(o => o.categoryID !== category.categoryID)
        } else {
          this.notFilledCategories.push(category)
        }
      }
    }
  }

  getSelectedHeader() {
    this.tabView.tabs[this.selectedIndex].header;
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
          if(item2.justification == null || item2.justification === "" || item2.score == null || item2.score == undefined){
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
        if(item2.justification == null || item2.justification === ""|| item2.score == null || item2.score == undefined){
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
        if(item2.justification == null || item2.justification === "" || item2.score == null || item2.score == undefined){
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


    if(this.assessment.assessment_approach === 'Direct'){
      let finalArray = this.processData.concat(this.outcomeData)
      if(this.isEditMode ==true){
        this.assessment = await this.assessmentControllerServiceProxy.findOne(this.assessmentId).toPromise()
        finalArray.map(x => x.data.map(y => y.assessment = this.assessment));
      }
      else{
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
        scaleSDGs : this.sdgDataSendArray2,
        sustainedSDGs : this.sdgDataSendArray4,
        sdgs : this.selectedSDGsWithAnswers,
        isEdit:this.isEditMode,
        isDraft : false,

      }

      this.investorToolControllerproxy.createFinalAssessment(data)
        .subscribe(_res => {

          this.messageService.add({
            severity: 'success',
            summary: 'Success',
            detail: 'Assessment has been created successfully',
            closable: true,
          })
          this.showResults();
        }, error => {
          this.messageService.add({
            severity: 'error',
            summary: 'Error',
            detail: 'Assessment detail saving failed',
            closable: true,
          })
        })

    }
    else{
      let finalArray:any = this.processData.concat(this.outcomeData)
      finalArray.map((x: { data: any[]; }) => x.data.map(y => y.assessment = this.mainAssessment));
      this.investorToolControllerproxy.createFinalAssessmentIndirect(finalArray)
        .subscribe((_res:any) => {
          this.messageService.add({
            severity: 'success',
            summary: 'Success',
            detail: 'Successfully sent to Data Collection Team',
            closable: true,
          })
          this.router.navigate(['/app/investor-tool-new']);

        }, error => {
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
    }
    else{
      setTimeout(() => {
        this.router.navigate(['../assessment-result-investor', this.mainAssessment.id], { queryParams: { assessmentId: this.mainAssessment.id }, relativeTo: this.activatedRoute });
      }, 2000);
    }
  }

  checkValidation(data: any[], type: string){
    return (data?.filter(investorAssessment => 
      (investorAssessment.relavance !== undefined) && 
      (investorAssessment.likelihood !== undefined ) && 
      (investorAssessment.likelihood_justification !== undefined && investorAssessment.likelihood_justification !== null && investorAssessment.likelihood_justification !== '') &&
      (investorAssessment.indicator_details?.filter((indicator_details: IndicatorDetails ) =>
        (indicator_details.justification !== undefined && indicator_details.justification !== null && indicator_details.justification !== ''))?.length === (investorAssessment.indicator_details?.length-1)
      )||
       (investorAssessment.relavance == 0))?.length === data?.length && type=='process')||
      (data.filter(investorAssessment => 
        ((investorAssessment.justification !== undefined && investorAssessment.justification !== null && investorAssessment.justification !== '')&&
         (investorAssessment.score !== undefined && investorAssessment.score !== null )) 
       )?.length === data.length && type=='outcome')||
      (data.filter(sdg => 
        (sdg.data?.filter((data: { justification: undefined; } ) =>
          (data.justification!== undefined))?.length === (sdg.data?.length)
        ))?.length === data.length && type=='sdg')
  }

  sdgValidation(data: any[]) {
    return this.selectedSDGs.length > 0 && (data?.filter(sdg => 
      (sdg.data?.filter((data: {
        score: undefined; justification: undefined; 
          } ) =>
         (data.justification!== undefined && data.justification !== null && data.justification !== '') &&
         (data.score !== undefined && data.score !== null))?.length === (sdg.data?.length)
      ))?.length === data?.length )
  }
 
  next(data: {

    isValidated: boolean | null
    data: any[],

  }, type: string) {
    data.isValidated = false;
    if (this.checkValidation(data.data, type)) {
      data.isValidated = true;
      if (this.activeIndexMain === 1) {
        this.activeIndex2 = this.activeIndex2 + 1;
        this.checkTab2Mandatory(this.activeIndex2)

      }
      if (this.activeIndex === 3 && this.activeIndexMain !== 1) {
        this.activeIndexMain = 1;
        this.activeIndex2 = 0;

      }
      if (this.activeIndex <= 2 && this.activeIndex >= 0 && this.activeIndexMain === 0) {
        this.activeIndex = this.activeIndex + 1;
        this.checkTab1Mandatory(this.activeIndex)
      }
    } else {
      this.messageService.add({
        severity: 'error',
        summary: 'Error',
        detail: 'Please fill all mandatory fields',
        closable: true,
      });
    }
  }
  nextSDG(data: any[], type: string) {
    if (type == 'scaleSD') {
      this.isValidSCaleSD = false
    }
    if (type == 'sustainedSD') {
      this.isValidSustainedSD = false
    }
    
    if (this.sdgValidation(data)) {
      this.isValidSCaleSD = true
      if (type == 'scaleSD') {
        this.isValidSCaleSD = true
      }
      if (type == 'sustainedSD') {
        this.isValidSustainedSD = true
      }
      if (this.activeIndexMain === 1) {

        this.activeIndex2 = this.activeIndex2 + 1;

        this.checkTab2Mandatory(this.activeIndex2)

      }
      if (this.activeIndex === 3 && this.activeIndexMain !== 1) {
        this.activeIndexMain = 1;
        this.activeIndex2 = 0;

      }
      if (this.activeIndex <= 2 && this.activeIndex >= 0 && this.activeIndexMain === 0) {
        this.activeIndex = this.activeIndex + 1;

      }
    } else {
      this.messageService.add({
        severity: 'error',
        summary: 'Error',
        detail: 'Please fill all mandatory fields',
        closable: true,
      });
    }
  }
  onLevelofImplementationChange(event:any){
    if(event==='National')
    {
      this.levelofImplementation =1;
    }
    else if(event==='Sub-national')
    {
      this.levelofImplementation =2;
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

  }

  if( this.chaCategoryLikelihoodWeightTotal[categoryName] == 100|| this.chaCategoryLikelihoodWeightTotal[categoryName] ==0){
   this.chaCategoryLikelihoodTotalEqualsTo1[categoryName] = true
   this.initialLikelihood=0
   this.isLikelihoodDisabled=true;
    this.failedLikelihoodArray= this.failedLikelihoodArray.filter((element) => element.category !== categoryName);



  }
  else{
    if (!this.failedLikelihoodArray.some( (element) => element.category === categoryName)) {
      this.failedLikelihoodArray.push({category:categoryName,tabIndex:this.activeIndex});
    }

  }
 }


 onRelevanceWeightChange(categoryName: string, characteristicName : string, chaWeight: number) {
  this.isRelavanceDisabled=false;
  this.initialRelevance=1;
   this.characteristicWeightScore[characteristicName] = chaWeight
  this.chaCategoryWeightTotal[categoryName] = 0
  this.chaCategoryTotalEqualsTo1[categoryName] = false

 for(let cha of  this.getCategory(characteristicName, categoryName)) {
  if(!isNaN(this.characteristicWeightScore[cha.name])){
    this.chaCategoryWeightTotal[categoryName] =  this.chaCategoryWeightTotal[categoryName] +  this.characteristicWeightScore[cha.name]
  }

 }

 if( this.chaCategoryWeightTotal[categoryName] == 100|| this.chaCategoryWeightTotal[categoryName] == 0){
  this.chaCategoryTotalEqualsTo1[categoryName] = true

  this.initialRelevance=0
  this.isRelavanceDisabled=true
  this.failedRelevanceArray= this.failedRelevanceArray.filter((element) => element.category !== categoryName);
 }
 else{
  if (!this.failedRelevanceArray.some( (element) => element.category === categoryName)) {
    this.failedRelevanceArray.push({category:categoryName,tabIndex:this.activeIndex});
  }

}
}

onAssessmentApproachchange(approach:any){
  if (approach==='Direct'){
    this.approach=1;
  }
  if (approach==='Indirect'){
    this.approach=2;
  }
}

onRelavanceChange(data:any,ins:any){

}

pushBarriers(barrier:any){
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
}

onChangeRelevance(relevance : any , data : any){

  if(relevance == 0){
    data.likelihood_justification = null;
    data.likelihood = null;
    data.uploadedDocumentPath = null;

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
  return text.replace(/ {3}/g, '<br><br>');
}

assignSDG(sdg : any , data : any){

  data.portfolioSdg = sdg;
}

    onItemSelectSDGs(event: any) {
      const selectedIndexes = this.selectedSDGs.map(sdg => sdg.id);
      this.sdgDataSendArray2 = this.sdgDataSendArray2.filter((sdgData: { index: number; }) => selectedIndexes.includes(sdgData.index));
    
      this.sdgDataSendArray4 = this.sdgDataSendArray4.filter((sdgData: { index: number; }) => selectedIndexes.includes(sdgData.index));
    
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


  this.selectedSDGsWithAnswers = this.selectedSDGs.map(selectedSdg => {
    const existingAnswer = this.selectedSDGsWithAnswers.find(
      sdgWithAnswer => sdgWithAnswer.id === selectedSdg.id
    );

    if (existingAnswer) {
      return { ...selectedSdg, answer: existingAnswer.answer };
    } else {
      return { ...selectedSdg, answer: ""  };
    }
  });

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

  calculateAbatement(value: number, data: any) {
    if (this.investorAssessment?.total_investment) {
      data['abatement']= value  / this.investorAssessment.total_investment 
    } else {
      data['abatement'] = 0
    }
  }

  onSelectInstrument(event: any) {
    console.log(event)
    console.log(this.selectedInstruments)

    this.show_less_message = false
    this.selectedInstruments.map(_inst => {
      let investment = new TotalInvestment()
      investment.instrument_name = _inst.name
      investment.instrument_code = _inst.code
      if (!this.totalInvestments.find(o => o.instrument_code === _inst.code)) {
        this.totalInvestments.push(investment)
      }
    })
    if (this.totalInvestments.length > this.selectedInstruments.length) {
      this.totalInvestments = this.totalInvestments.filter(item => (this.selectedInstruments.map(ins => ins.code)).includes(item.instrument_code))
    }
    this.onInputChange({target: {value: 0}}) 
    console.log(this.totalInvestments)
    
  }

  onInputChange(event: any) {
    console.log("onInputChange")
    this.show_less_message = false
    const inputValue = event.target.value;
    const numericValue = parseFloat(inputValue);

    this.totalInvestments = this.totalInvestments.map(inv => {
      if (inv.instrument_code === 'OTHER') {
        //@ts-ignore
        inv.propotion = undefined
      }
      return inv
    })

    if ( numericValue > 100) {
      event.target.value = 100;
    }

    let tot = 0
    this.totalInvestments.forEach(invest => {
      if (invest.propotion) tot = tot + invest.propotion
    })

    let inst_to_check = [...this.totalInvestments.filter(o => o.instrument_code !== 'OTHER')]

    let all_proportion_filled = inst_to_check.every(i => i.propotion !== undefined)
    console.log(all_proportion_filled)

    if (tot > 100) this.isExceeded = true
    else this.isExceeded = false

    if (all_proportion_filled && !this.isExceeded) {
      this.show_less_message = true
        this.totalInvestments = this.totalInvestments.map(inv => {
          if (inv.instrument_code === 'OTHER') {
            inv.propotion = 100 - tot
            this.show_less_message = false
          }
          return inv
        })
    } else {
      this.show_less_message = false
    }
  }


  getTooltipData(ch: string) {
    switch (ch) {
      case 'International/global level':
        return this.ghg_score_info.macro
      case 'National/Sectorial level':
        return this.ghg_score_info.medium
      case 'Subnational/regional/municipal or sub sectorial level':
        return this.ghg_score_info.micro
      default:
        return ''
    }
  }

  onSelectFromDate(event: any) {
    this.minDateTo = new Date(event) 
  }

  getNotFilledCaution(): string {
    let str: string = 'Please fill '
    let sections: string[] = []
    for (let notFilled of this.notFilledCategories) {
      sections.push(notFilled.CategoryName)
    }
    sections = [... new Set(sections)]
    str = str + sections.join(', ') + ' sections before continue.'
    return str
  }

  adaptationJustificationChange(){
    this.checkTab2Mandatory(6)
  }

}
interface UploadEvent {
  originalEvent: HttpResponse<FileDocument>;
  files: File[];
  }

  interface FileDocument {
  fileName: string
  }

