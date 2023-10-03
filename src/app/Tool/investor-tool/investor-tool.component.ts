import { AfterContentChecked, ChangeDetectorRef, Component, OnInit, ViewChild } from '@angular/core';
import { NgForm } from '@angular/forms';
import { MasterDataService } from 'app/shared/master-data.service';
import * as moment from 'moment';
import { MessageService } from 'primeng/api';
import { Assessment, Characteristics, ClimateAction, CreateInvestorToolDto, ImpactCovered, IndicatorDetails, InstitutionControllerServiceProxy, InvestorAssessment, InvestorQuestions, InvestorTool, InvestorToolControllerServiceProxy, MethodologyAssessmentControllerServiceProxy, ProjectControllerServiceProxy, Sector, SectorControllerServiceProxy } from 'shared/service-proxies/service-proxies';
import decode from 'jwt-decode';
import { TabView } from 'primeng/tabview';
import { ActivatedRoute, Router } from '@angular/router';
import { environment } from 'environments/environment';
import { HttpResponse } from '@angular/common/http';
// import { IndicatorDetails } from './IndicatorDetails';


interface  CharacteristicWeight {
  [key: string]: number;
}

interface ChaCategoryWeightTotal {
  [key: string]: number;
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
  policies: ClimateAction[];
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

  //Newww
  sdgList : any = []
  selectedSDGs : any = []
  sdgDataSendArray: any = [];
  sdgDataSendArray3: any= [];
  sdgDataSendArray4: any = [];
  sdgDataSendArray2: any = [];
  outcomeScaleScore: any[] = [];
  outcomeSustainedScore : any[] = [];
  sdg_answers: any[];

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
    data: InvestorAssessment[],

  }[] = [];

  outcomeData: {
    type: string,
    CategoryName: string,
    categoryID: number,
    data: InvestorAssessment[]
  }[] = [];
  //class variable
  @ViewChild(TabView) tabView: TabView;

  tabName: string = '';
  mainAssessment: Assessment;
  mainTabIndex: any;
  categoryTabIndex: any;


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
    private activatedRoute: ActivatedRoute


  ) {
     this.uploadUrl = environment.baseUrlAPI + '/investor-tool/upload-file-investment'
    this.fileServerURL = environment.baseUrlAPI+'/uploads'

  }
  async ngOnInit(): Promise<void> {
    this.categoryTabIndex =0;
    this.approach=1
    this.assessment.assessment_approach = 'Direct'
    this.isLikelihoodDisabled=true;
    this.isRelavanceDisabled=true;
    this.assessment_types = this.masterDataService.assessment_type;
    this.levelOfImplementation = this.masterDataService.level_of_implemetation;
    this.geographicalAreasCovered = this.masterDataService.level_of_implemetation;
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

    this.instituionProxy.getInstituion(3,countryId,1000,0).subscribe((res: any) => {
      this.instiTutionList = res;
      console.log( "listtt",this.instiTutionList)
    });
    // this.getSelectedHeader();

    this.investorToolControllerproxy.findAllSDGs().subscribe((res: any) => {
      console.log("ressssSDGs", res)
      this.sdgList = res
     });

    if (countryId > 0) {
      // this.sectorList = await this.sectorProxy.getCountrySector(countryId).toPromise()
      this.sectorProxy.getSectorDetails(1,100,'').subscribe((res:any) =>{
        res.items.forEach((re:any)=>{
          if(re.id !=6){
            this.sectorList.push(re)
          }
        })
      })

      // console.log("++++", this.sectorList)

    } // countryid = 0

    await this.getPolicies();
    await this.getAllImpactsCovered();
    await this.getCharacteristics();
    // await this.getInvestorQuestions();
    console.log(this.policies)
    console.log(this.assessment)



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


  async getCharacteristics() {
   
    try{
      this.investorQuestions= await this.investorToolControllerproxy.findAllIndicatorquestions().toPromise();
      // console.log("ressss3333",  this.investorQuestions)
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
            data:categoryArray
          })


        }
        if (x.type === 'outcome') {
          this.meth1Outcomes.push(x);

          this.outcomeData.push({
            type: 'outcome', CategoryName: x.name, categoryID: x.id,
            data:categoryArray
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
    // this.showSections = true
    //save assessment
    this.assessment.tool = 'Investment & Private Sector Tool'
    this.assessment.year = moment(new Date()).format("YYYY-MM-DD")

    if (form.valid) {
      this.methodologyAssessmentControllerServiceProxy.saveAssessment(this.assessment)
        .subscribe(res => {
          console.log("res", res)

          if (res) {


            this.investorAssessment.assessment = res;
            this.mainAssessment =res
            this.createInvestorToolDto.sectors = this.sectorArray;
            this.createInvestorToolDto.impacts = this.impactArray;
            this.createInvestorToolDto.investortool = this.investorAssessment;
             this.createInvestorToolDto.investortool = this.investorAssessment;
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
    if(this.mainTabIndex==1){
      this.activeIndex2=0;
    }
    console.log("main index", this.mainTabIndex)
  }
  onCategoryTabChange(event: any, tabview: TabView) {
    console.log("mainTabIndexArray",this.mainTabIndexArray,this.activeIndex)

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

  onsubmit(form: NgForm) {
    for(let item of this.processData){
      for(let item2 of item.data){
        if(item2.likelihood == null || item2.relavance == null){
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

    console.log("assesssssssss", this.assessment)
    console.log("finallsdgDataSendArray4", this.sdgDataSendArray4)
    console.log("finallsdgDataSendArray2", this.sdgDataSendArray2)

    if(this.assessment.assessment_approach === 'Direct'){
      console.log("Directttt")
      let finalArray = this.processData.concat(this.outcomeData)
      finalArray.map(x => x.data.map(y => y.assessment = this.mainAssessment))
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
        sdgs : this.selectedSDGs
      }

      //@ts-ignore
      this.investorToolControllerproxy.createFinalAssessment(data)
        .subscribe(_res => {
          console.log("res final", _res)

          console.log(_res)
          this.messageService.add({
            severity: 'success',
            summary: 'Success',
            detail: 'Assessment created successfully',
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

  showResults(){
    setTimeout(() => {

       this.router.navigate(['../assessment-result-investor',this.mainAssessment.id], { queryParams: { assessmentId: this.mainAssessment.id}, relativeTo: this.activatedRoute });

       }, 2000);

  }
  next(){

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
onUpload(event:UploadEvent, data : InvestorAssessment) {
  if(event.originalEvent.body){
    data.uploadedDocumentPath = event.originalEvent.body.fileName
  }

  this.messageService.add({severity: 'info', summary: 'File Uploaded', detail: ''});

}

addNewline(text : any) {
  if (!text) {
    return '';
  }
  return text.replace(/--/g, '\n--');
}

assignSDG(sdg : any , data : any){
  console.log("sdgs", sdg)
  console.log("data", data)

  data.portfolioSdg = sdg

  console.log("data22", data)
}

    onItemSelectSDGs(event: any) {
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


}
interface UploadEvent {
  originalEvent: HttpResponse<FileDocument>;
  files: File[];
  }

  interface FileDocument {
  fileName: string
  }

