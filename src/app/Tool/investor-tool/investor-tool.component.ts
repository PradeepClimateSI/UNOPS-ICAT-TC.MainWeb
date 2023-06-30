import { AfterContentChecked, ChangeDetectorRef, Component, OnInit, ViewChild } from '@angular/core';
import { NgForm } from '@angular/forms';
import { MasterDataService } from 'app/shared/master-data.service';
import * as moment from 'moment';
import { MessageService } from 'primeng/api';
import { Assessment, Characteristics, ClimateAction, CreateInvestorToolDto, ImpactCovered, IndicatorDetails, InstitutionControllerServiceProxy, InvestorAssessment, InvestorQuestions, InvestorTool, InvestorToolControllerServiceProxy, MethodologyAssessmentControllerServiceProxy, ProjectControllerServiceProxy, Sector, SectorControllerServiceProxy } from 'shared/service-proxies/service-proxies';
import decode from 'jwt-decode';
import { TabView } from 'primeng/tabview';
import { Router } from '@angular/router';
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
  approach:number=0;
  instiTutionList : any = []
  investorQuestions:InvestorQuestions[]=[];

  description = '';
  levelofImplementation:number=0;

  yesNoAnswer: any[] = [{ id: 1, name: "Yes" }, { id: 2, name: "No" },  { id: 3, name: "Maybe" }];
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



  ) { }
  async ngOnInit(): Promise<void> {
    this.categoryTabIndex =0;
   
    this.isLikelihoodDisabled=true;
    this.isRelavanceDisabled=true;
    this.assessment_types = this.masterDataService.assessment_type;
    this.levelOfImplementation = this.masterDataService.level_of_implemetation;
    this.geographicalAreasCovered = this.masterDataService.level_of_implemetation;
    this.likelihood = this.masterDataService.likelihood;
    this.relevance = this.masterDataService.relevance;

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


    if (countryId > 0) {
      this.sectorList = await this.sectorProxy.getCountrySector(countryId).toPromise()

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

    this.investorToolControllerproxy.findAllIndicatorquestions().subscribe((res3: any) => {
      this.investorQuestions  = res3
      // console.log("ressss3333",  this.investorQuestions)

    });
    this.methodologyAssessmentControllerServiceProxy.findAllCharacteristics().subscribe((res3: any) => {
      let res:Characteristics[] = res3
      for(let i of res){
          if ( !['Beneficiaries', 'Disincentives', 'Institutional and regulatory'].includes(i.name)) {
          this.characteristicsList.push(i)
        }
      }
      // console.log("charList",this.characteristicsList)
    });

    this.methodologyAssessmentControllerServiceProxy.findAllCategories().subscribe((res2: any) => {
      console.log("categoryList", res2)
      for (let x of res2) {
        let categoryArray: InvestorAssessment[] =[];
        for (let z of this.characteristicsList) {

          if (z.category.name === x.name) {
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


        }

      }
      console.log("processdata", this.processData)
    });


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

    console.log("assesssssssss", this.assessment)
    if(this.assessment.assessment_approach === 'Direct'){
      console.log("Directttt")
      let finalArray = this.processData.concat(this.outcomeData)
      finalArray.map(x => x.data.map(y => y.assessment = this.mainAssessment))
      // finalArray.map(x=>x.data.map(y=>y.investorTool=this.mainAssessment))
      console.log("finalArray", finalArray)
      //@ts-ignore
      this.investorToolControllerproxy.createFinalAssessment(finalArray)
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

       this.router.navigate(['/assessment-result-investor',this.mainAssessment.id], { queryParams: { assessmentId: this.mainAssessment.id} });

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


}
