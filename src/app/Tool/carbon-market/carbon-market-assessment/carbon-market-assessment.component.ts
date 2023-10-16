import { Component, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import { MasterDataService } from 'app/shared/master-data.service';
import * as moment from 'moment';
import { MessageService } from 'primeng/api';
import { AllBarriersSelected, Assessment, AssessmentCMDetail, AssessmentCMDetailControllerServiceProxy, AssessmentControllerServiceProxy, BarrierSelected, Characteristics, ClimateAction, GeographicalAreasCovered, InvestorSector, InvestorToolControllerServiceProxy, MethodologyAssessmentControllerServiceProxy, PolicyBarriers, ProjectControllerServiceProxy, Sector, SectorControllerServiceProxy, ServiceProxy, ToolsMultiselectDto } from 'shared/service-proxies/service-proxies';
import decode from 'jwt-decode';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-carbon-market-assessment',
  templateUrl: './carbon-market-assessment.component.html',
  styleUrls: ['./carbon-market-assessment.component.css']
})
export class CarbonMarketAssessmentComponent implements OnInit {
  countryId: any;
  visible_ex_ante: any;


  policies: ClimateAction[]
  assessment: Assessment = new Assessment()
  cm_detail: AssessmentCMDetail = new AssessmentCMDetail()
  assessment_types: any[]
  assessment_approaches: any[]
  impact_types: any[] = []
  impact_categories: any[] = []
  impact_characteristics: any[] = []
  sectorial_boundires: any[] = []
  int_cm_approches: any[] = []

  selected_impact_types: string[] = []
  selected_impact_categories: string[] = []
  selected_impact_characteristics: string[] = []

  showSections: boolean = false
  isSavedAssessment: boolean = false

  date1: any
  date2: any

  assessmentres: Assessment
  levelOfImplementation: any[] = [];
  sectorArray: Sector[] = [];
  geographicalAreasCoveredArr: any[] = []
  sectorList: any[] = [];
  international_tooltip:string;
  
  barrierBox: boolean = false;
  barrierSelected: BarrierSelected = new BarrierSelected();
  finalBarrierList: BarrierSelected[] = [];
  barrierArray: PolicyBarriers[];
  isDownloading: boolean = true;
  isDownloadMode: number = 0;
  sectorsJoined: string = '';
  finalSectors: Sector[] = []
  characteristicsList: Characteristics[] = [];
  isStageDisble:boolean=false;
  tableData : any;
  isEditMode: boolean 
  assessmentId: number 

  constructor(
    private projectControllerServiceProxy: ProjectControllerServiceProxy,
    private methodologyAssessmentControllerServiceProxy: MethodologyAssessmentControllerServiceProxy,
    private masterDataService: MasterDataService,
    private serviceProxy: ServiceProxy,
    private messageService: MessageService,
    private sectorProxy: SectorControllerServiceProxy,
    private investorToolControllerServiceProxy: InvestorToolControllerServiceProxy,
    private assessmentControllerServiceProxy: AssessmentControllerServiceProxy,
    private assessmentCMDetailControllerServiceProxy: AssessmentCMDetailControllerServiceProxy,
    private route: ActivatedRoute
  ) { }

  async ngOnInit(): Promise<void> {
    this.tableData =  this.getProductsData();
    this.assessment_types = this.masterDataService.assessment_type
    this.impact_types = this.masterDataService.impact_types
    this.sectorial_boundires = this.masterDataService.sectorial_boundries
    this.assessment_approaches = this.masterDataService.assessment_approach
    this.int_cm_approches = this.masterDataService.int_cm_approaches
    this.levelOfImplementation = this.masterDataService.level_of_implemetation;

    await this.getPolicies()
    await this.getSetors()
    this.route.queryParams.subscribe(params => {
      this.assessmentId = params['id']
      this.isEditMode = params['isEdit']
    })
    await this.setInitialStates()

    this.international_tooltip = 'Name of international or private carbon market standard under which the intervention is registered.'
    await this.getCharacteristics();
  }

  async setInitialStates() {
    if (this.isEditMode) {
      this.assessment = await this.assessmentControllerServiceProxy.findOne(this.assessmentId).toPromise()
      let policy = this.policies.find(o => o.id === this.assessment.climateAction.id)
      if (policy) this.assessment.climateAction = policy
      this.cm_detail = await this.assessmentCMDetailControllerServiceProxy.getAssessmentCMDetailByAssessmentId(this.assessmentId).toPromise()
      this.cm_detail.geographicalAreasCovered.map(area => {
        this.geographicalAreasCoveredArr.push(this.levelOfImplementation.find(o => o.code === area.code))
      })
      this.cm_detail.sectorsCovered.map(sector => {
        this.sectorArray.push(this.sectorList.find(o => o.name === sector.sector.name))
      })
      this.setFrom()
      this.setTo()
      this.assessmentres = this.assessment
      this.showSections = true
    }
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

  async getSetors() {
    const token = localStorage.getItem('ACCESS_TOKEN')!;
    const countryId = token ? decode<any>(token).countryId : 0;
    this.countryId = countryId;
    // if (countryId > 0) {
    //   this.sectorList = await this.sectorProxy.getCountrySector(countryId).toPromise()
    // } 
    this.sectorList = await this.sectorProxy.findAllSector().toPromise()
  }

  async getPolicies() {
    this.policies = await this.projectControllerServiceProxy.findAllPolicies().toPromise()
  }
  async getCharacteristics() {
   
    this.characteristicsList = await this.methodologyAssessmentControllerServiceProxy.findAllCharacteristics().toPromise();

   
  }

  save(form: NgForm) {
    this.assessment.tool = 'CARBON_MARKET'
    this.assessment.year = moment(new Date()).format("YYYY-MM-DD")
    this.assessment.assessment_approach = 'DIRECT'
    this.isStageDisble =true;

    if (form.valid) {
      this.methodologyAssessmentControllerServiceProxy.saveAssessment(this.assessment)
        .subscribe(res => {
          if (res) {
            this.cm_detail.cmassessment = res;

            let allBarriersSelected = new AllBarriersSelected()
              allBarriersSelected.allBarriers =this.finalBarrierList
              allBarriersSelected.climateAction =res.climateAction
              allBarriersSelected.assessment =res;

            this.projectControllerServiceProxy.policyBar(allBarriersSelected).subscribe((res) => {
            },
            (err) => {
              this.messageService.add({
                severity: 'error',
                summary: 'Error.',
                detail: 'Policy barriers saving failed',
                sticky: true,
              });
            })

            this.serviceProxy.createOneBaseAssessmentCMDetailControllerAssessmentCMDetail(this.cm_detail)
              .subscribe(async _res => {
                if (_res) {
                  let toolsMultiselectDto = new ToolsMultiselectDto()
                  toolsMultiselectDto.sectors = []

                  for (let sector of this.sectorArray) {
                    let sec = new InvestorSector()
                    sec.assessment = res
                    sec.assessmentCMDetail = _res
                    sec.sector = sector
                    toolsMultiselectDto.sectors.push(sec)
                  }
                  for (let geo of this.geographicalAreasCoveredArr){
                    let area = new GeographicalAreasCovered()
                    area.assessment= res
                    area.assessmentCMDetail = _res
                    area.name = geo.name
                    area.code = geo.code
                    toolsMultiselectDto.geographicalAreas.push(area)
                  }
                  let res_sec = await this.investorToolControllerServiceProxy.saveToolsMultiSelect(toolsMultiselectDto).toPromise()
                  if (res_sec['sector'] && res_sec['area']) {
                    this.messageService.add({
                      severity: 'success',
                      summary: 'Success',
                      detail: 'Assessment has been created successfully',
                      closable: true,
                    })
                    this.isSavedAssessment = true
                    this.assessmentres = res
                    this.showSections = true
                  } else if (!res_sec['sector']) {
                    this.messageService.add({
                      severity: 'error',
                      summary: 'Error',
                      detail: 'Secotrs covered saving failed.',
                      closable: true,
                    })
                  } else if (!res_sec['area']){
                    this.messageService.add({
                      severity: 'error',
                      summary: 'Error',
                      detail: 'Geographical area covered saving failed.',
                      closable: true,
                    })
                  }
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

  selectAssessmentType(e: any) {
    if (e.value === 'Ex-ante') {
      this.visible_ex_ante = true
    }
  }

  selectAssessmentApproach(e: any) {

  }

  onSelectType(e: any) {
    this.impact_categories = []
    e.value.forEach((val: string) => {
      this.impact_categories.push(...this.masterDataService.impact_categories.filter(cat => cat.type === val))
    })
  }

  onSelectCategory(e: any) {
    this.impact_characteristics = []
    e.value.forEach((val: string) => {
      this.impact_characteristics.push(...this.masterDataService.impact_characteristics.filter(cat => cat.type.includes(val)))
    })

    this.impact_characteristics = this.impact_characteristics.filter((v, i, a) => a.findIndex(v2 => (v2.code === v.code)) === i)
  }

  okay() {
    this.visible_ex_ante = false
  }

  pushBarriers(barrier:any){
    this.finalBarrierList.push(barrier)
  
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
  onItemSelectSectors($event: any) {
   
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
