import { Component, OnInit, ViewChild } from '@angular/core';
import { NgForm } from '@angular/forms';
import { MasterDataDto, MasterDataService } from 'app/shared/master-data.service';
import * as moment from 'moment';
import { MessageService } from 'primeng/api';
import { AllBarriersSelected, Assessment, AssessmentControllerServiceProxy, BarrierSelected, Characteristics, ClimateAction, CreateInvestorToolDto, GeographicalAreasCoveredDto, ImpactCovered, IndicatorDetails, InstitutionControllerServiceProxy, InvestorAssessment, InvestorTool, InvestorToolControllerServiceProxy, MethodologyAssessmentControllerServiceProxy, PolicyBarriers, PortfolioQuestionDetails, PortfolioQuestions, ProjectControllerServiceProxy, Sector, SectorControllerServiceProxy } from 'shared/service-proxies/service-proxies';
import decode from 'jwt-decode';
import { TabView } from 'primeng/tabview';
import { Dropdown } from 'primeng/dropdown';
import { environment } from 'environments/environment';
import { HttpResponse } from '@angular/common/http';
import { ActivatedRoute, Router } from '@angular/router';
import { DomSanitizer } from '@angular/platform-browser';


interface CharacteristicWeight {
  [key: string]: number;
}

interface SelectedSDG {
  id: number;
  answer: string;
  name: string;
  number: number;
}
interface ChaCategoryWeightTotal {
  [key: string]: number;
}

interface ChaCategoryTotalEqualsTo1 {
  [key: string]: boolean;
}

@Component({
  selector: 'app-portfolio-track4',
  templateUrl: './portfolio-track4.component.html',
  styleUrls: ['./portfolio-track4.component.css']
})
export class PortfolioTrack4Component implements OnInit {

  assessment: Assessment = new Assessment();
  investorAssessment: InvestorTool = new InvestorTool();
  sectorArray: Sector[] = [];
  impactArray: ImpactCovered[] = [];
  assessment_types: any[];
  sdg_answers: any[];
  policies: ClimateAction[]=[];
  isSavedAssessment: boolean = false;
  levelOfImplementation: any[] = [];
  geographicalAreasCovered: any[] = [];
  sectorsCovered: any[] = [];
  impactCovered: any[] = [];
  assessmentMethods: any[] = [];
  countryID: number;
  sectorList: any[] = [];
  createInvestorToolDto: CreateInvestorToolDto = new CreateInvestorToolDto();
  meth1Process: Characteristics[] = [];
  meth1Outcomes: Characteristics[] = [];
  characteristicsList: Characteristics[] = [];
  characteristicsArray: Characteristics[] = [];
  selectedIndex = 0;
  activeIndex = 0;
  activeIndexMain = 0;
  activeIndex2: number = 0;
  likelihood: any[] = [];
  outcomeScaleScore: any[] = [];
  outcomeSustainedScore : any[] = [];
  relevance: any[] = [];
  selectedApproach: any;
  fileServerURL: string;
  uploadUrl: string;
  acceptedFiles: string = ".pdf, .jpg, .png, .doc, .docx, .xls, .xlsx, .csv";
  portfolioQuestions:PortfolioQuestions[]=[];
  description = ''
  load: boolean = false
  yesNoAnswer: any[] = [{ id: 1, name: "Yes" }, { id: 2, name: "No" }, { id: 3, name: "Maybe" }];
  assessmentApproach = [
    { name: 'Direct' },
    { name: 'Indirect' },
    // Add other options if needed
  ];

  assessmentMethodList: any[] = [
    // { name: 'Track 1' },
    // { name: 'Track 2' },
    // { name: 'Track 3' },
    { name: 'Track 4' }
  ];

  filePath : any

  processData: {
    type: string,
    CategoryName: string,
    categoryID: number,
    isValidated:boolean|null
    data: InvestorAssessment[]
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
  track4Selectt: boolean = false

  ///bug fixing
  isLikelihoodDisabled:boolean=false;
  isRelavanceDisabled:boolean=false;
  mainTabIndexArray:number[]=[];
  initialLikelihood:number=0;
  initialRelevance:number=0;
  failedLikelihoodArray:{category:string,tabIndex:number}[]=[]
  failedRelevanceArray:{category:string,tabIndex:number}[]=[]
  tabLoading: boolean=false;
  characteristicsLoaded:boolean = false;
  categoriesLoaded:boolean = false;
  geographicalAreasCoveredArr: any[] = []

  barrierBox:boolean=false;
  barrierSelected:BarrierSelected= new BarrierSelected();
  finalBarrierList :BarrierSelected[]=[];
  barrierArray:PolicyBarriers[];
  isDownloading: boolean = true;
  isDownloadMode: number = 0;
  sectorsJoined :string='';
  finalSectors:Sector[]=[];
  isStageDisble:boolean=false;
  isValidSCaleSD: boolean;
  isValidSustainedSD: boolean;
  draftLoading: boolean=false;
  visionExample: { title: string; value: string; }[];
  barrierChList: any;

  constructor(
    private projectControllerServiceProxy: ProjectControllerServiceProxy,
    private masterDataService: MasterDataService,
    private messageService: MessageService,
    private methodologyAssessmentControllerServiceProxy: MethodologyAssessmentControllerServiceProxy,
    private sectorProxy: SectorControllerServiceProxy,
    private investorToolControllerproxy: InvestorToolControllerServiceProxy,
    private router: Router,
    private instituionProxy: InstitutionControllerServiceProxy,
    private activatedRoute: ActivatedRoute,
    public sanitizer: DomSanitizer,
    private assessmentControllerServiceProxy: AssessmentControllerServiceProxy,

  ) {
    this.uploadUrl = environment.baseUrlUploadByNamaAPI ;
    this.fileServerURL = environment.baseUrlDownloadByNamaAPI+'/uploads';

  }

  instiTutionList : any = []
  userCountryId:number = 0;
  sdgList : any = []
  selectedSDGs : SelectedSDG[] = [];
  selectedSDGsWithAnswers : SelectedSDG[] = [];

  sdgDataSendArray: any = [];

  sdgDataSendArray3: any= [];

  sdgDataSendArray4: any = [];

  sdgDataSendArray2: any = []
  tableData : any;

  assessmentId:number;
  isEditMode:boolean=false;

  async ngOnInit(): Promise<void> {
    this.sectorList = await this.sectorProxy.findAllSector().toPromise()
    console.log("sectors",this.sectorList)
    this.levelOfImplementation = this.masterDataService.level_of_implemetation;
    this.geographicalAreasCovered = this.masterDataService.level_of_implemetation;
    this.activatedRoute.queryParams.subscribe( params => {
      params['isEdit']=='true'?(this.isEditMode =true ):false
      this.assessmentId = params['id']
      if(!this.assessmentId && this.isEditMode ){
        window.location.reload()
      }
      
      //  console.log("params",params['id'],typeof(params['id']), params['isEdit'],typeof(params['isEdit']))
      // this.isEditMode = true
      // this.assessmentId = 415

    })
    if(this.isEditMode==false){
      await this.getPolicies();
      await this.getAllImpactsCovered();
      await this.getCharacteristics();
      this.sectorList = await this.sectorProxy.findAllSector().toPromise()
    }
    else{
      try{
        await this.getSavedAssessment()
      }
      catch (error) {
        console.log(error)
      }
    } 
     //this.load = true; //need to change as false
     //this.isSavedAssessment = true //need to change as false
     this.visionExample = [
      { title: 'Transformational Vision', value: 'Decarbonized electricity sector with a high % of Solar PV energy which will enable economic growth and will lead the shift of the labour market towards green jobs.' },
      { title: 'Long term ( > 15 years)', value: 'Zero-carbon electricity production. The 2050 vision is to achieve 60% solar PV in the national electricity mix and create 2 million new green jobs.' },
      { title: 'Medium term (> 5 years and  < 15 years)', value: 'Achieve 30% solar PV in the national electricity mix and create 1 million new green jobs. ' },
      { title: 'Short term (< 5 years)', value: 'Install 20 GW of rooftop solar PV and create 200,000 new green jobs in doing so. The solar PV policy is implemented at subnational levels, supported by incentives for private sector involvement and knowledge development.' },
      { title: 'Phase of transformation', value: 'Acceleration. Solar PV is widely accepted in the society and its use is spreading increasingly fast. Fossil-fuel based energy production is being challenged as the only way to ensure a reliable energy supply. Changes have already occurred in the economy, institutions and society as a result of the spreading of Solar PV.' },
      { title: 'Intervention contribution to change the system to achieve the vision', value: 'The intervention being assessed will facilitate the spreading of Solar PV installations and thus contribute to increase the penetration of solar PV in the national electricity mix.' },
    ]

    this.tableData = this.getProductsData();

    this.selectedApproach = 'Direct';
    this.assessment.assessment_approach = 'Direct';

    await this.getPortfolioQuestions();
    const token = localStorage.getItem('ACCESS_TOKEN')!;
    const tokenPayload = decode<any>(token);
    this.userCountryId  = tokenPayload.countryId;

    this.isLikelihoodDisabled=true;
    this.isRelavanceDisabled=true;

    let intTypeFilter: string[] = new Array();

    intTypeFilter.push('type.id||$eq||' + 3);

    this.instituionProxy.getInstituion(3,this.userCountryId,1000,0).subscribe((res: any) => {
      this.instiTutionList = res;
      console.log( "listtt",this.instiTutionList)
    });

    this.categoryTabIndex = 0;

    this.track4Selectt = true
    this.assessment.assessment_method = 'Track 4'

    this.assessment_types = this.masterDataService.assessment_type;
    this.sdg_answers = this.masterDataService.sdg_answers;
    this.levelOfImplementation = this.masterDataService.level_of_implemetation;
    this.geographicalAreasCovered = this.masterDataService.level_of_implemetation;
    this.likelihood = this.masterDataService.likelihood;
    this.outcomeScaleScore = this.masterDataService.outcomeScaleScore;
    this.outcomeSustainedScore= this.masterDataService.outcomeSustainedScore;
    this.relevance = this.masterDataService.relevance;

    this.assessmentMethods = this.masterDataService.assessment_method;


  //  const token = localStorage.getItem('ACCESS_TOKEN')!;
    const countryId = token ? decode<any>(token).countryId : 0;
    console.log("country", countryId)
    this.countryID = countryId;
    console.log("tabName", this.tabName)
    // this.getSelectedHeader();

    //this.sectorList = await this.sectorProxy.findAllSector().toPromise()
   // await this.getPolicies();
   // await this.getAllImpactsCovered();
   // await this.getCharacteristics();
    
    console.log(this.policies)
    console.log(this.assessment)

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

    console.log(this.processData)
    this.processData.forEach((d)=>{
      if(d.CategoryName == this.assessment.processDraftLocation){
        this.activeIndex = d.categoryID -1;
      }
    })
    console.log(this.outcomeData)
    this.outcomeData.forEach((d)=>{
      if(d.CategoryName == this.assessment.outcomeDraftLocation){
        this.activeIndex2 = d.categoryID -this.processData.length-1;
        console.log(this.activeIndex2,d.categoryID)
      }
    })
    // this.assessment = await this.assessmentControllerServiceProxy.findOne(this.assessmentId).toPromise()
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

  assignSDG(sdg : any , data : any){
    console.log("sdgs", sdg)
    console.log("data", data)

    data.portfolioSdg = sdg

    console.log("data22", data)
  }

  /* onItemSelectSDGs(event: any) {
    console.log("rrr", this.selectedSDGs);
    console.log("event", event);

    this.sdgDataSendArray2 = [];
    this.sdgDataSendArray4 = [];

    for (let index = 0; index < this.selectedSDGs.length; index++) {
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


    for (let index = 0; index < this.selectedSDGs.length; index++) {
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
  
  async getPolicies() {
    this.policies = await this.projectControllerServiceProxy.findAllPolicies().toPromise()

    console.log("this.policies",this.policies)
  }
  async getAllImpactsCovered() {
    this.impactCovered = await this.investorToolControllerproxy.findAllImpactCovered().toPromise()
  }

  async getPortfolioQuestions(){
    this.investorToolControllerproxy.findAllPortfolioquestions().subscribe((res3: any) => {
      this.portfolioQuestions  = res3
      console.log("portfolioQuestions", this.portfolioQuestions)
    });
  }

  async getCharacteristics() {
    this.characteristicsList = await this.methodologyAssessmentControllerServiceProxy.findAllCharacteristics().toPromise();
    this.barrierChList = [...this.characteristicsList]
    this.barrierChList = this.barrierChList.filter((ch: { category: { code: string; }; }) => {return !["SCALE_ADAPTATION", "SUSTAINED_ADAPTATION"].includes(ch.category.code)})
    this.barrierChList = this.barrierChList.filter((v: { code: any; }, i: any, a: any[]) => a.findIndex(v2 => (v2.code === v.code)) === i)
    this.characteristicsLoaded = true;
     console.log("11111")
   /*  this.methodologyAssessmentControllerServiceProxy.findAllCharacteristics().subscribe((res3: any) => {
      // console.log("ressss3333", res3)
      this.characteristicsList = res3
      console.log("11111")
    }); */

    // this.methodologyAssessmentControllerServiceProxy.findAllCategories().subscribe(async (res2: any) => {
      this.methodologyAssessmentControllerServiceProxy.findAllCategories().toPromise().then((res2: any) => {
      const customOrder = [1, 2, 3, 4, 5, 7, 6, 8, 9, 10];
      console.log("categoryList", res2)

      const sortedRes2 = res2.sort((a : any, b: any) => {
        const indexA = customOrder.indexOf(a.id);
        const indexB = customOrder.indexOf(b.id);
        return indexA - indexB;
      });

      console.log("categoryList222", sortedRes2);

      for (let x of res2) {
        let categoryArray: InvestorAssessment[] = [];
        for (let z of this.characteristicsList) {

          if (z.category.name === x.name) {
            let newCharData = new InvestorAssessment();
            newCharData.characteristics = z;

            for(let q of  this.portfolioQuestions){
              if(newCharData.characteristics.id ===q.characteristics.id){
                let portfolioQuestionDetails =new PortfolioQuestionDetails()
                portfolioQuestionDetails.type='question';
                portfolioQuestionDetails.question = q
                newCharData.portfolioQuestion_details.push(portfolioQuestionDetails)

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
      console.log("processData", this.processData)
      console.log("outcomeData", this.outcomeData)
      console.log("this.sdgDataSendArray", this.sdgDataSendArray)
    });
    //await this.spliFun();

  }


  save(form: NgForm) {
    console.log("form", form)
    this.isStageDisble =true;
    // this.showSections = true
    //save assessment

    this.assessment.tool = 'PORTFOLIO'
    this.assessment.year = moment(new Date()).format("YYYY-MM-DD")
    if (!this.assessment.id) this.assessment.createdOn = moment(new Date())
    this.assessment.editedOn = moment(new Date())

    if (form.valid) {
      this.methodologyAssessmentControllerServiceProxy.saveAssessment(this.assessment)
        .subscribe(res => {
          this.load = true
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
            this.mainAssessment = res
            this.createInvestorToolDto.sectors = this.sectorArray;
            this.createInvestorToolDto.impacts = this.impactArray;
            this.createInvestorToolDto.investortool = this.investorAssessment;
            this.createInvestorToolDto.geographicalAreas = this.geographicalAreasCoveredArr

            this.investorToolControllerproxy.createinvestorToolAssessment(this.createInvestorToolDto)
              .subscribe(_res => {
                console.log("res final", _res)
                if (_res) {
                  // console.log(_res)
                  // this.messageService.add({
                  //   severity: 'success',
                  //   summary: 'Success',
                  //   detail: 'Assessment created successfully',
                  //   closable: true,
                  // })
                  this.isSavedAssessment = true
                  // this.onCategoryTabChange('', this.tabView);

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
    console.log(this.barrierBox)  
  }
  selectedTrack: any

  onChangeTrack(event: any) {
    this.track4Selectt = true
    this.selectedTrack = event.value;
    console.log("selectedTrack : ", this.selectedTrack)

    if (this.selectedTrack === 'Track 1' || this.selectedTrack === 'Track 2' || this.selectedTrack === 'Track 3') {
      this.track4Selectt = false
    }
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

  mainTabIndex: any
  categoryTabIndex: any

  onMainTabChange(event: any) {
    this.mainTabIndex = event.index;
    // console.log(event)
    // if(this.mainTabIndex==1){
    //   this.activeIndex2=0;
    // }

    console.log("main index", this.mainTabIndex)
  }

  onCategoryTabChange(event: any, tabview: TabView) {
   // this.outcomeData[0].CategoryName = "tttttt";
   // this.outcomeData[0].data[0].justification = "heloooo";
   // this.outcomeData[0].data[0].score = 3;

console.log("wwwwww", this.outcomeData)
    
    this.categoryTabIndex = event.index;
    console.log("category index", this.categoryTabIndex)
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




  }

  getSelectedHeader() {
    console.log("tabnaaame", this.tabView.tabs[this.selectedIndex].header);
  }


  async saveDraft(category:any,processDraftLocation:string,type:string){
    
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
      isEdit : this.isEditMode,
      proDraftLocation: proDraftLocation,
      outDraftLocation: outDraftLocation,
      scaleSDGs : this.sdgDataSendArray2,
      sustainedSDGs : this.sdgDataSendArray4,
      sdgs : this.selectedSDGsWithAnswers
    }
    // this.assessmentControllerServiceProxy.update
    //@ts-ignore
    console.log("data",data)
    this.investorToolControllerproxy.createFinalAssessment2(data)
      .subscribe(async _res => {
        console.log("res final", _res)

        console.log(_res)
        this.messageService.add({
          severity: 'success',
          summary: 'Success',
          detail: 'Assessment draft has been saved successfully',
          closable: true,
        })
        if (data.isDraft) {
           this.setFrom()
           this.setTo()
        }
        if(this.isEditMode ==false){
          this.router.navigate(['app/portfolio-tool-edit'], {  
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

  async onsubmit(form: NgForm) {

    console.log("processData ---", this.processData)
      console.log("outcomeData ---", this.outcomeData)
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
          if(item2.justification == null || item2.justification === "" || item2.score === null || item2.score === undefined){
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
        if(item2.justification == null || item2.justification === "" || item2.score === null || item2.score === undefined){
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
        if(item2.justification == null || item2.justification === "" || item2.score === null || item2.score === undefined){
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

    console.log("formDataa", form.value)
    console.log("assesssssssss", this.assessment)
    console.log("finallsdgDataSendArray2", this.sdgDataSendArray2)
    console.log("finallsdgDataSendArray4", this.sdgDataSendArray4)

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

      console.log("finalArray", finalArray)
      //@ts-ignore

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
      this.investorToolControllerproxy.createFinalAssessment2(data)
        .subscribe(_res => {

          console.log("finalSentArray", data)
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
            detail: 'Assessment has been created successfully',
            closable: true,
          })
          this.showResults();

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


  async showResults() {
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

  // next() {

  //   if (this.activeIndexMain === 1) {

  //     this.activeIndex2 = this.activeIndex2 + 1;
  //     console.log("activeIndex2", this.activeIndex2)

  //   }
  //   if (this.activeIndex === 3 && this.activeIndexMain !== 1) {
  //     this.activeIndexMain = 1;
  //     this.activeIndex2=0;

  //   }
  //   if (this.activeIndex <= 2 && this.activeIndex >= 0 && this.activeIndexMain === 0) {
  //     this.activeIndex = this.activeIndex + 1;
  //     console.log(this.activeIndex)

  //   }

  // }
  next(data:{
    
    isValidated:boolean|null
    data: any[],

  },type:string){
    data.isValidated = false;
  console.log("category",data,type)
  // data?.filter(investorAssessment => console.log(investorAssessment.relavance,investorAssessment.relavance == 0))
  if((data.data?.filter(investorAssessment => 
      (investorAssessment.relavance !== undefined) && 
      (investorAssessment.likelihood !== undefined) && 
      (investorAssessment.likelihood_justification !== undefined && investorAssessment.likelihood_justification !== null && investorAssessment.likelihood_justification !== '') || 
      (investorAssessment.relavance == 0))?.length === data?.data?.length && type=='process')||
      (data?.data.filter(investorAssessment => 
        ((investorAssessment.justification !== undefined && investorAssessment.justification !== null && investorAssessment.justification !== '')&&
        (investorAssessment.score !== undefined && investorAssessment.score !== null )) 
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
      detail: 'Please fill all mandotory fields',
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
        (sdg.data?.filter((data: {
          score: null; justification: undefined; 
            } ) =>
          (data.justification!== undefined && data.justification !== null && data.justification !== '') &&
          (data.score !== undefined && data.score !== null))?.length === (sdg.data?.length)
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
      detail: 'Please fill all mandotory fields',
      closable: true,
    });
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


  characteristicWeightScore: CharacteristicWeight = {};
  chaCategoryWeightTotal: ChaCategoryWeightTotal = {};
  chaCategoryTotalEqualsTo1: ChaCategoryTotalEqualsTo1 = {};

  characteristicLikelihoodWeightScore: CharacteristicWeight = {};
  chaCategoryLikelihoodWeightTotal: ChaCategoryWeightTotal = {};
  chaCategoryLikelihoodTotalEqualsTo1: ChaCategoryTotalEqualsTo1 = {};

  /* characteristicWeightScoreOutcome :CharacteristicWeight = {};
  chaCategoryWeightTotalOutcome : ChaCategoryWeightTotal = {};
  chaCategoryTotalEqualsTo1Outcome : ChaCategoryTotalEqualsTo1 = {};

  characteristicLikelihoodWeightScoreOutcome :CharacteristicWeight = {};
  chaCategoryLikelihoodWeightTotalOutcome : ChaCategoryWeightTotal = {};
  chaCategoryLikelihoodTotalEqualsTo1Outcome : ChaCategoryTotalEqualsTo1 = {};
 */

  /*  onRelevanceWeightChangeOutcome(categoryName: string, characteristicName : string, chaWeight: number) {
     this.characteristicWeightScoreOutcome[characteristicName] = chaWeight
    this.chaCategoryWeightTotalOutcome[categoryName] = 0
    this.chaCategoryTotalEqualsTo1Outcome[categoryName] = false

   for(let cha of  this.getCategory(characteristicName, categoryName)) {
      this.chaCategoryWeightTotalOutcome[categoryName] =  this.chaCategoryWeightTotalOutcome[categoryName] +  this.characteristicWeightScoreOutcome[cha.name]

      console.log('Characteristicrrrrrrr:',  this.characteristicWeightScoreOutcome[cha.name]);
   }

   if( this.chaCategoryWeightTotalOutcome[categoryName] == 1){
    this.chaCategoryTotalEqualsTo1Outcome[categoryName] = true
   }
   console.log('Characteristic Name:',categoryName ,  characteristicName, 'chaWeight:', chaWeight);
    console.log( 'category :',categoryName,' Total: ',  this.chaCategoryWeightTotalOutcome[categoryName]);

  } */



  /*  onLikelihoodWeightChangeOutcome(categoryName: string, characteristicName : string, chaWeight: number) {
     this.characteristicLikelihoodWeightScoreOutcome[characteristicName] = chaWeight
    this.chaCategoryLikelihoodWeightTotalOutcome[categoryName] = 0
    this.chaCategoryLikelihoodTotalEqualsTo1Outcome[categoryName] = false

   for(let cha of  this.getCategory(characteristicName, categoryName)) {
      this.chaCategoryLikelihoodWeightTotalOutcome[categoryName] =  this.chaCategoryLikelihoodWeightTotalOutcome[categoryName] +  this.characteristicLikelihoodWeightScoreOutcome[cha.name]

      console.log('Characteristicrrrrrrr:',  this.characteristicLikelihoodWeightScoreOutcome[cha.name]);
   }

   if( this.chaCategoryLikelihoodWeightTotalOutcome[categoryName] == 1){
    this.chaCategoryLikelihoodTotalEqualsTo1Outcome[categoryName] = true
   }
   console.log('LL Characteristic Name:',categoryName ,  characteristicName, 'chaWeight:', chaWeight);
  console.log( 'LL category :',categoryName,' Total: ',  this.chaCategoryLikelihoodWeightTotalOutcome[categoryName]);

  } */



  onLikelihoodWeightChange(categoryName: string, characteristicName: string, chaWeight: number) {
    this.isLikelihoodDisabled=false;
    this.initialLikelihood=1
    this.characteristicLikelihoodWeightScore[characteristicName] = chaWeight
    this.chaCategoryLikelihoodWeightTotal[categoryName] = 0
    this.chaCategoryLikelihoodTotalEqualsTo1[categoryName] = false

    for (let cha of this.getCategory(characteristicName, categoryName)) {
      // this.chaCategoryLikelihoodWeightTotal[categoryName] = this.chaCategoryLikelihoodWeightTotal[categoryName] + this.characteristicLikelihoodWeightScore[cha.name]
      if(!isNaN(this.characteristicLikelihoodWeightScore[cha.name])){
        this.chaCategoryLikelihoodWeightTotal[categoryName] =  this.chaCategoryLikelihoodWeightTotal[categoryName] + this.characteristicLikelihoodWeightScore[cha.name]
      }
      console.log('Characteristicrrrrrrr:', this.characteristicLikelihoodWeightScore[cha.name]);
    }

    // if (this.chaCategoryLikelihoodWeightTotal[categoryName] == 100) {
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

      // this.chaCategoryLikelihoodTotalEqualsTo1[categoryName] = true
    }
    console.log('LL Characteristic Name:', categoryName, characteristicName, 'chaWeight:', chaWeight);
    console.log('LL category :', categoryName, ' Total: ', this.chaCategoryLikelihoodWeightTotal[categoryName]);

  }


  onRelevanceWeightChange(categoryName: string, characteristicName: string, chaWeight: number) {
    this.isRelavanceDisabled=false;
    this.initialRelevance=1;
    this.characteristicWeightScore[characteristicName] = chaWeight
    this.chaCategoryWeightTotal[categoryName] = 0
    this.chaCategoryTotalEqualsTo1[categoryName] = false

    for (let cha of this.getCategory(characteristicName, categoryName)) {
      // this.chaCategoryWeightTotal[categoryName] = this.chaCategoryWeightTotal[categoryName] + this.characteristicWeightScore[cha.name]
      if(!isNaN(this.characteristicWeightScore[cha.name])){
        this.chaCategoryWeightTotal[categoryName] =  this.chaCategoryWeightTotal[categoryName] +  this.characteristicWeightScore[cha.name]
      }
      console.log('Characteristicrrrrrrr:', this.characteristicWeightScore[cha.name]);
    }

    // if (this.chaCategoryWeightTotal[categoryName] == 100) {
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
    console.log('Characteristic Name:', categoryName, characteristicName, 'chaWeight:', chaWeight);
    console.log('category :', categoryName, ' Total: ', this.chaCategoryWeightTotal[categoryName]);

  }

  onChangeApproach(event: any) {
    this.selectedApproach = event.value;
    console.log("selectedApproach : ", this.selectedApproach)
  }

  onUpload(event:UploadEvent, data : InvestorAssessment) {
    if(event.originalEvent.body){
      data.uploadedDocumentPath = event.originalEvent.body.fileName
    }

    this.messageService.add({severity: 'info', summary: 'File Uploaded', detail: ''});
  }

  /* addNewline(text: any) {
    if (!text) {
      return '';
    }
    return text.replace(/@/g, '@<br>');
  } */

  addNewline(text: any) {
    if (!text) {
      return '';
    }
    // Replace three spaces with a line break
    return text.replace(/ {3}/g, '<br><br>');
  }
  

  /* spliFun() {
    for (let item of this.processData) {
      for (let item2 of item.data) {
        for (let question of item2.portfolioQuestion_details) {
          if (question.question.hint) {
            question.question.hint = question.question.hint.replace(/@/g, '@<br>');
          }
        }
      }
    }
    console.log("ppppp", this.processData)
  } */
  touchedState: { [key: string]: boolean } = {};

  onBlur(data: any) {
    this.touchedState[data.characteristics.name] = true;
  }

  onChangeRelevance(relevance : any , data : any ){
    this.touchedState[data.characteristics.name] = true;
    console.log("relevance", relevance)
    console.log("data22", data)
  
     if(relevance == 0){
      data.likelihood_justification = null;
      data.likelihood = null;
      data.uploadedDocumentPath = null;
    }
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

  barrierBox2: boolean = false; // Variable to control the dialog visibility

showBarrierDialog() {
  this.barrierBox2 = true;
  // You can initialize or reset the barrierSelected object here
}

hideBarrierDialog() {
  this.barrierBox2 = false;
  // You can perform any cleanup or reset actions here
}


}

interface UploadEvent {
  originalEvent: HttpResponse<FileDocument>;
  files: File[];
}

interface FileDocument {
  fileName: string
}
