import { Component, OnInit } from '@angular/core';
import { MasterDataService } from 'app/shared/master-data.service';
import { InvestorToolControllerServiceProxy, PortfolioSdg, SdgPriority, SdgPriorityDto, ServiceProxy } from 'shared/service-proxies/service-proxies';
import decode from 'jwt-decode';
import { MessageService } from 'primeng/api';

@Component({
  selector: 'app-sdg-priority',
  templateUrl: './sdg-priority.component.html',
  styleUrls: ['./sdg-priority.component.css']
})
export class SdgPriorityComponent implements OnInit{

  allSdgs: PortfolioSdg[]
  priorities: any[]
  sdgPriorities: SdgPriority[] = []
  countryId: any;
  country: import("/Users/sanduni/Documents/ClimateSI/TC_Tools/tc-web/src/shared/service-proxies/service-proxies").Country;
  savedPriorities: any;

  constructor(
    private investorToolControllerServiceProxy: InvestorToolControllerServiceProxy,
    private masterDataService: MasterDataService,
    private serviceProxy: ServiceProxy,
    private messageService: MessageService
  ){

  }

  async ngOnInit(): Promise<void> {
    const token = localStorage.getItem('ACCESS_TOKEN')!;
    const tokenPayload = decode<any>(token);
    this.countryId = tokenPayload.countryId;
    this.priorities = this.masterDataService.sdg_priorities
    await this.getCountry()
    await this.getAllSdgs()
  }

  async getCountry(){
    this.country = await this.serviceProxy.getOneBaseCountryControllerCountry(this.countryId, undefined, undefined, 0).toPromise()
  }

  async getAllSdgs() {
    this.allSdgs = await this.investorToolControllerServiceProxy.findAllSDGs().toPromise()
    this.savedPriorities = await this.investorToolControllerServiceProxy.getSdgPrioritiesByCountryId(this.countryId).toPromise()
    for (let sdg of this.allSdgs){
      let exist = this.savedPriorities.find((o: any) => o.sdg.id === sdg.id)
      let priority = new SdgPriority()
      let sd = new PortfolioSdg()
      sd.id = sdg.id
      sd.name = sdg.name
      if (exist){
        priority.id = exist.id
        priority.priority = exist.priority
        priority.value = exist.value
      } 
      priority.sdg = sd
      priority.country = this.country
      this.sdgPriorities.push(priority)
    }
  }

  updateValue(event: any, priority: SdgPriority){
    let p = this.priorities.find(o => o.code === event.value)
    if (p) {
      priority.value = p.value
    }
  }

  async save(){
    let priority = new SdgPriorityDto()
    priority.priorities = this.sdgPriorities
    let res = await this.investorToolControllerServiceProxy.saveSdgPriorities(priority).toPromise()
    if (res){
      this.messageService.add({
        severity: 'success',
        summary: 'Success', 
        detail: 'Save successfully',
        closable: true,
      })
    } else {
      this.messageService.add({
        severity: 'error',
        summary: 'Error', 
        detail: 'Error occured',
        closable: true,
      })
    }
  }

}
