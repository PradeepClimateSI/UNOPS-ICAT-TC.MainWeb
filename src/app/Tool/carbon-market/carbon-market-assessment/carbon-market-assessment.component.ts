import { Component, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import { MasterDataService } from 'app/shared/master-data.service';
import * as moment from 'moment';
import { MessageService } from 'primeng/api';
import { Assessment, AssessmentCMDetail, ClimateAction, GeographicalAreasCovered, InvestorSector, InvestorToolControllerServiceProxy, MethodologyAssessmentControllerServiceProxy, ProjectControllerServiceProxy, Sector, SectorControllerServiceProxy, ServiceProxy, ToolsMultiselectDto } from 'shared/service-proxies/service-proxies';
import decode from 'jwt-decode';

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

  constructor(
    private projectControllerServiceProxy: ProjectControllerServiceProxy,
    private methodologyAssessmentControllerServiceProxy: MethodologyAssessmentControllerServiceProxy,
    private masterDataService: MasterDataService,
    private serviceProxy: ServiceProxy,
    private messageService: MessageService,
    private sectorProxy: SectorControllerServiceProxy,
    private investorToolControllerServiceProxy: InvestorToolControllerServiceProxy
  ) { }

  async ngOnInit(): Promise<void> {
    this.assessment_types = this.masterDataService.assessment_type
    this.impact_types = this.masterDataService.impact_types
    this.sectorial_boundires = this.masterDataService.sectorial_boundries
    this.assessment_approaches = this.masterDataService.assessment_approach
    this.int_cm_approches = this.masterDataService.int_cm_approaches
    this.levelOfImplementation = this.masterDataService.level_of_implemetation;

    await this.getPolicies()
    await this.getSetors()
  }

  async getSetors() {
    const token = localStorage.getItem('ACCESS_TOKEN')!;
    const countryId = token ? decode<any>(token).countryId : 0;
    this.countryId = countryId;
    if (countryId > 0) {
      this.sectorList = await this.sectorProxy.getCountrySector(countryId).toPromise()
    } 
  }

  async getPolicies() {
    this.policies = await this.projectControllerServiceProxy.findAllPolicies().toPromise()
  }

  save(form: NgForm) {
    this.assessment.tool = 'Carbon Market Tool'
    this.assessment.year = moment(new Date()).format("YYYY-MM-DD")
    this.assessment.assessment_approach = 'DIRECT'

    if (form.valid) {
      this.methodologyAssessmentControllerServiceProxy.saveAssessment(this.assessment)
        .subscribe(res => {
          if (res) {
            this.cm_detail.cmassessment = res

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
                  console.log(this.geographicalAreasCoveredArr)
                  for (let geo of this.geographicalAreasCoveredArr){
                    let area = new GeographicalAreasCovered()
                    area.assessment= res
                    area.assessmentCMDetail = _res
                    area.name = geo.name
                    area.code = geo.code
                    toolsMultiselectDto.geographicalAreas.push(area)
                  }
                  let res_sec = await this.investorToolControllerServiceProxy.saveToolsMultiSelect(toolsMultiselectDto).toPromise()
                  if (res_sec) {
                    this.messageService.add({
                      severity: 'success',
                      summary: 'Success',
                      detail: 'Assessment created successfully',
                      closable: true,
                    })
                    this.isSavedAssessment = true
                    this.assessmentres = res
                    this.showSections = true
                  } else {
                    this.messageService.add({
                      severity: 'error',
                      summary: 'Error',
                      detail: 'Secotrs covered saving failed.',
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

  onItemSelectSectors($event: any) {
   
  }

}
