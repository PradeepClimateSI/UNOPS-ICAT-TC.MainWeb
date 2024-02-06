import { Component, OnInit } from '@angular/core';
import { MasterDataService } from 'app/shared/master-data.service';
import { Country, CountryControllerServiceProxy, InvestorToolControllerServiceProxy, PortfolioSdg, SdgPriority, SdgPriorityDto } from 'shared/service-proxies/service-proxies';
import decode from 'jwt-decode';
import { MessageService } from 'primeng/api';
import { DialogService } from 'primeng/dynamicdialog';
import { GuidanceVideoComponent } from 'app/guidance-video/guidance-video.component';

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
  country: Country;
  savedPriorities: any;

  constructor(
    private investorToolControllerServiceProxy: InvestorToolControllerServiceProxy,
    private countryServiceProxy: CountryControllerServiceProxy,
    private masterDataService: MasterDataService,
    private messageService: MessageService,
    protected dialogService: DialogService,
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
    this.countryServiceProxy.getCountry(this.countryId).subscribe((res) => {
      this.country = (res);
      console.log(this.country)
    });
  }
  watchVideo(){
    let ref = this.dialogService.open(GuidanceVideoComponent, {
      header: 'Guidance Video',
      width: '60%',
      contentStyle: {"overflow": "auto"},
      baseZIndex: 10000,
      data: {
        sourceName: 'AddSDG',
      },
    });

    ref.onClose.subscribe(() => {
      
    })
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
    priority.priorities = this.sdgPriorities;

    for(let p of priority.priorities){
      let  co = new Country();
      co.id= p.country.id;
      p.country=co;
    }
    console.log(priority)
    let res = await this.investorToolControllerServiceProxy.saveSdgPriorities(priority).toPromise();
    console.log(priority)
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
