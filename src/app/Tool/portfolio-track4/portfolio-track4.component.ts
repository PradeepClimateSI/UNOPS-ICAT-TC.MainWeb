import { Component, OnInit, ViewChild } from '@angular/core';
import { NgForm } from '@angular/forms';
import { MasterDataService } from 'app/shared/master-data.service';
import * as moment from 'moment';
import { MessageService } from 'primeng/api';
import { Assessment, Characteristics, ClimateAction, CreateInvestorToolDto, ImpactCovered, InstitutionControllerServiceProxy, InvestorAssessment, InvestorTool, InvestorToolControllerServiceProxy, MethodologyAssessmentControllerServiceProxy, ProjectControllerServiceProxy, Sector, SectorControllerServiceProxy } from 'shared/service-proxies/service-proxies';
import decode from 'jwt-decode';
import { TabView } from 'primeng/tabview';
import { Dropdown } from 'primeng/dropdown';
import { Router } from '@angular/router';


interface CharacteristicWeight {
  [key: string]: number;
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
  policies: ClimateAction[];
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
  relevance: any[] = [];
  selectedApproach: any

  description = ''
  load: boolean = false
  yesNoAnswer: any[] = [{ id: 1, name: "Yes" }, { id: 2, name: "No" }, { id: 3, name: "Maybe" }];
  assessmentApproach = [
    { name: 'Direct' },
    { name: 'Indirect' },
    // Add other options if needed
  ];


  processData: {
    type: string,
    CategoryName: string,
    categoryID: number,
    data: InvestorAssessment[]
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
  track4Selectt: boolean = false

  constructor(
    private projectControllerServiceProxy: ProjectControllerServiceProxy,
    private masterDataService: MasterDataService,
    private messageService: MessageService,
    private methodologyAssessmentControllerServiceProxy: MethodologyAssessmentControllerServiceProxy,
    private sectorProxy: SectorControllerServiceProxy,
    private investorToolControllerproxy: InvestorToolControllerServiceProxy,
    private router: Router,
    private instituionProxy: InstitutionControllerServiceProxy,

  ) {

  }

  instiTutionList : any = []
  userCountryId:number = 0;

  async ngOnInit(): Promise<void> {

    const token = localStorage.getItem('ACCESS_TOKEN')!;
    const tokenPayload = decode<any>(token);
    this.userCountryId  = tokenPayload.countryId;

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
    this.levelOfImplementation = this.masterDataService.level_of_implemetation;
    this.geographicalAreasCovered = this.masterDataService.level_of_implemetation;
    this.likelihood = this.masterDataService.likelihood;
    this.relevance = this.masterDataService.relevance;

    this.assessmentMethods = this.masterDataService.assessment_method;


  //  const token = localStorage.getItem('ACCESS_TOKEN')!;
    const countryId = token ? decode<any>(token).countryId : 0;
    console.log("country", countryId)
    this.countryID = countryId;
    console.log("tabName", this.tabName)
    // this.getSelectedHeader();


    if (countryId > 0) {
      this.sectorList = await this.sectorProxy.getCountrySector(countryId).toPromise()

      // console.log("++++", this.sectorList)

    } // countryid = 0

    await this.getPolicies();
    await this.getAllImpactsCovered();
    await this.getCharacteristics();
    console.log(this.policies)
    console.log(this.assessment)


  }
  async getPolicies() {
    this.policies = await this.projectControllerServiceProxy.findAllPolicies().toPromise()
  }
  async getAllImpactsCovered() {
    this.impactCovered = await this.investorToolControllerproxy.findAllImpactCovered().toPromise()
  }

  async getCharacteristics() {

    this.methodologyAssessmentControllerServiceProxy.findAllCharacteristics().subscribe((res3: any) => {
      // console.log("ressss3333", res3)
      this.characteristicsList = res3

    });

    this.methodologyAssessmentControllerServiceProxy.findAllCategories().subscribe((res2: any) => {
      console.log("categoryList", res2)
      for (let x of res2) {
        let categoryArray: InvestorAssessment[] = [];
        for (let z of this.characteristicsList) {

          if (z.category.name === x.name) {
            let newCharData = new InvestorAssessment();
            newCharData.characteristics = z;

            categoryArray.push(newCharData);

          }
        }

        //this.categotyList.push(x);
        if (x.type === 'process') {
          this.processData.push({
            type: 'process', CategoryName: x.name, categoryID: x.id,
            data: categoryArray
          })




        }
        if (x.type === 'outcome') {
          this.meth1Outcomes.push(x);

          this.outcomeData.push({
            type: 'outcome', CategoryName: x.name, categoryID: x.id,
            data: categoryArray
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
    this.load = true
    this.assessment.tool = 'Portfolio Tool'
    this.assessment.year = moment(new Date()).format("YYYY-MM-DD")

    if (form.valid) {
      this.methodologyAssessmentControllerServiceProxy.saveAssessment(this.assessment)
        .subscribe(res => {
          console.log("res", res)

          if (res) {


            this.investorAssessment.assessment = res;
            this.mainAssessment = res
            this.createInvestorToolDto.sectors = this.sectorArray;
            this.createInvestorToolDto.impacts = this.impactArray;
            this.createInvestorToolDto.investortool = this.investorAssessment;

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


  selectedTrack: any

  onChangeTrack(event: any) {
    this.track4Selectt = true
    this.selectedTrack = event.target.value;
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
    console.log("main index", this.mainTabIndex)
  }

  onCategoryTabChange(event: any, tabview: TabView) {
    this.categoryTabIndex = event.index;
    console.log("category index", this.categoryTabIndex)




  }

  getSelectedHeader() {
    console.log("tabnaaame", this.tabView.tabs[this.selectedIndex].header);
  }


  onsubmit(form: NgForm) {

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


    console.log("+++++++++++", this.processData)
    console.log("-----------", this.outcomeData)
  }


  showResults() {

    setTimeout(() => {
      this.router.navigate(['/assessment-result-investor', this.mainAssessment.id], { queryParams: { assessmentId: this.mainAssessment.id } });
    }, 2000);
  }

  next() {

    if (this.activeIndexMain === 1) {

      this.activeIndex2 = this.activeIndex2 + 1;
      console.log("activeIndex2", this.activeIndex2)

    }
    if (this.activeIndex === 3) {
      this.activeIndexMain = 1;

    }
    if (this.activeIndex <= 2 && this.activeIndex >= 0 && this.activeIndexMain === 0) {
      this.activeIndex = this.activeIndex + 1;
      console.log(this.activeIndex)

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
    this.characteristicLikelihoodWeightScore[characteristicName] = chaWeight
    this.chaCategoryLikelihoodWeightTotal[categoryName] = 0
    this.chaCategoryLikelihoodTotalEqualsTo1[categoryName] = false

    for (let cha of this.getCategory(characteristicName, categoryName)) {
      this.chaCategoryLikelihoodWeightTotal[categoryName] = this.chaCategoryLikelihoodWeightTotal[categoryName] + this.characteristicLikelihoodWeightScore[cha.name]

      console.log('Characteristicrrrrrrr:', this.characteristicLikelihoodWeightScore[cha.name]);
    }

    if (this.chaCategoryLikelihoodWeightTotal[categoryName] == 100) {
      this.chaCategoryLikelihoodTotalEqualsTo1[categoryName] = true
    }
    console.log('LL Characteristic Name:', categoryName, characteristicName, 'chaWeight:', chaWeight);
    console.log('LL category :', categoryName, ' Total: ', this.chaCategoryLikelihoodWeightTotal[categoryName]);

  }


  onRelevanceWeightChange(categoryName: string, characteristicName: string, chaWeight: number) {
    this.characteristicWeightScore[characteristicName] = chaWeight
    this.chaCategoryWeightTotal[categoryName] = 0
    this.chaCategoryTotalEqualsTo1[categoryName] = false

    for (let cha of this.getCategory(characteristicName, categoryName)) {
      this.chaCategoryWeightTotal[categoryName] = this.chaCategoryWeightTotal[categoryName] + this.characteristicWeightScore[cha.name]

      console.log('Characteristicrrrrrrr:', this.characteristicWeightScore[cha.name]);
    }

    if (this.chaCategoryWeightTotal[categoryName] == 100) {
      this.chaCategoryTotalEqualsTo1[categoryName] = true
    }
    console.log('Characteristic Name:', categoryName, characteristicName, 'chaWeight:', chaWeight);
    console.log('category :', categoryName, ' Total: ', this.chaCategoryWeightTotal[categoryName]);

  }

  onChangeApproach(event: any) {
    this.selectedApproach = event.value;
    console.log("selectedApproach : ", this.selectedApproach)
  }

}
