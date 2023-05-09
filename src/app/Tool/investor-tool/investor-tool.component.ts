import { Component, OnInit, ViewChild } from '@angular/core';
import { NgForm } from '@angular/forms';
import { MasterDataService } from 'app/shared/master-data.service';
import * as moment from 'moment';
import { MessageService } from 'primeng/api';
import { Assessment, Characteristics, ClimateAction, CreateInvestorToolDto, ImpactCovered, InvestorAssessment, InvestorTool, InvestorToolControllerServiceProxy, MethodologyAssessmentControllerServiceProxy, ProjectControllerServiceProxy, Sector, SectorControllerServiceProxy } from 'shared/service-proxies/service-proxies';
import decode from 'jwt-decode';
import { TabView } from 'primeng/tabview';

@Component({
  selector: 'app-investor-tool',
  templateUrl: './investor-tool.component.html',
  styleUrls: ['./investor-tool.component.css']
})
export class InvestorToolComponent implements OnInit {

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
  characteristicsList: Characteristics[]=[];
  characteristicsArray : Characteristics[] = [];
  selectedIndex = 0;
  activeIndex = 0;
  likelihood:any[]=[];
  relevance:any[]=[];

  yesNoAnswer:any[] =[{id:1,name:"Yes"},{id:2,name:"No"}];


  processData: {
    type: string,
    CategoryName: string,
    categoryID: number,
    data: any[]
  }[] = [];

  outcomeData: {
    type: string,
    CategoryName: string,
    categoryID: number,
    data: any[]
  }[] = [];
  //class variable
  @ViewChild(TabView) tabView: TabView;

  tabName: string = '';


  constructor(
    private projectControllerServiceProxy: ProjectControllerServiceProxy,
    private masterDataService: MasterDataService,
    private messageService: MessageService,
    private methodologyAssessmentControllerServiceProxy: MethodologyAssessmentControllerServiceProxy,
    private sectorProxy: SectorControllerServiceProxy,
    private investorToolControllerproxy: InvestorToolControllerServiceProxy,
  ) { }

  async ngOnInit(): Promise<void> {

    this.assessment_types = this.masterDataService.assessment_type;
    this.levelOfImplementation = this.masterDataService.level_of_implemetation;
    this.geographicalAreasCovered = this.masterDataService.level_of_implemetation;
    this.likelihood = this.masterDataService.likelihood;
    this.relevance = this.masterDataService.relevance;

    this.assessmentMethods = this.masterDataService.assessment_method;
    

    const token = localStorage.getItem('ACCESS_TOKEN')!;
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
    this.methodologyAssessmentControllerServiceProxy.findAllCategories().subscribe((res2: any) => {
      console.log("categoryList", res2)
      for (let x of res2) {
        //this.categotyList.push(x);
        if (x.type === 'process') {
          this.meth1Process.push(x)

          this.processData.push({
            type: 'process', CategoryName: x.name, categoryID: x.id,
            data: []
          })



        }
        if (x.type === 'outcome') {
          this.meth1Outcomes.push(x);

          this.outcomeData.push({
            type: 'outcome', CategoryName: x.name, categoryID: x.id,
            data: []
          })


        }

      }
      console.log("processdata", this.processData)
    });

    this.methodologyAssessmentControllerServiceProxy.findAllCharacteristics().subscribe((res3: any) => {
      // console.log("ressss3333", res3)
      this.characteristicsList = res3

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

            this.createInvestorToolDto.sectors = this.sectorArray;
            this.createInvestorToolDto.impacts = this.impactArray;
            this.createInvestorToolDto.investortool = this.investorAssessment;

            this.investorToolControllerproxy.createinvestorToolAssessment(this.createInvestorToolDto)
              .subscribe(_res => {
                console.log("res final", _res)
                if (_res) {
                  console.log(_res)
                  this.messageService.add({
                    severity: 'success',
                    summary: 'Success',
                    detail: 'Assessment created successfully',
                    closable: true,
                  })
                  this.isSavedAssessment = true
                  this.onCategoryTabChange('',this.tabView);

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
    console.log("maintab", event.index)
  }
  onCategoryTabChange(event: any, tabview: TabView) {
    console.log("tabview",tabview)
    this.tabName = (event!==undefined && tabview !==undefined)? tabview.tabs[event.index].header:'Research and Development'
    this.processData.map(x=>x.data.length=0)
    this.outcomeData.map(x=>x.data.length=0)
    
    for (let x of this.characteristicsList) {
      if (x.category.name === this.tabName) {
        let newCharData = new InvestorAssessment();
        newCharData.characteristics =x;
        // this.characteristicsArray.push(x)
        this.processData.map(y=>y.data.push(newCharData))
        this.outcomeData.map(y=>y.data.push(newCharData))
      }
    }
   
    console.log("processdata", this.processData,this.outcomeData)

  }
  getSelectedHeader() {
    console.log("tabnaaame", this.tabView.tabs[this.selectedIndex].header);
  }

}
