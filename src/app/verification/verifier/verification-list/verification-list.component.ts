import { Component, OnInit } from '@angular/core';
import { LazyLoadEvent } from 'primeng/api';
import { ServiceProxy } from 'shared/service-proxies/service-proxies';

@Component({
  selector: 'app-verification-list',
  templateUrl: './verification-list.component.html',
  styleUrls: ['./verification-list.component.css']
})
export class VerificationListComponent implements OnInit {
  totalRecords: number;
  assessments: any[]
  rows: number
  loading: boolean

  constructor(
    private serviceProxy: ServiceProxy
  ) { }

  ngOnInit(): void {
  }

  loadgridData = (event: LazyLoadEvent) => {
    // this.loading = true;
    this.totalRecords = 0;

    // let statusId = this.searchBy.status
    //   ? Number(VerificationStatus[this.searchBy.status])
    //   : 0;
    // let filtertext = this.searchBy.text ? this.searchBy.text : '';
    let pageNumber =
      event.first === 0 || event.first === undefined
        ? 1
        : event.first / (event.rows === undefined ? 1 : event.rows) + 1;
    this.rows = event.rows === undefined ? 10 : event.rows;
    let Active = 0;
    // this.vrServiceProxy
    //   .getVerifierParameters(pageNumber, this.rows, statusId, filtertext)
    //   .subscribe((a) => {
    //     console.log("hiii...hi", a.items)
    //     this.paras = a.items;
    //     // this.paras = a.items.filter((o: any)=>o.verificationStatus != 6 && o.verificationStatus != 7 && o.verificationUser == this.loggedUser[0]?.id );
    //     console.log('hey aassse year', this.paras)
    //     this.totalRecords = this.paras.length;
    //     // this.loading = false;
    //   });
    this.assessments = []

    this.serviceProxy.getManyBaseProjectControllerClimateAction(undefined, undefined, undefined, undefined, undefined, undefined, 1000, 0, 1, 0)
    .subscribe(res => {
      this.assessments = res.data
      this.totalRecords = res.total
      console.log(this.assessments)
    })
    
  };

  statusClick(event: any, object: any) {
    

    // this.router.navigate(['/verification-verifier/detail'], {
    //   queryParams: {
    //     id: object.id,
    //     verificationStatus: object.verificationStatus,
    //   },
    // });
  }

}
