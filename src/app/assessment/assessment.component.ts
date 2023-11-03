import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { MasterDataService } from 'app/shared/master-data.service';
import { LazyLoadEvent } from 'primeng/api';
import { Table } from 'primeng/table';
import { MethodologyAssessmentControllerServiceProxy } from 'shared/service-proxies/service-proxies';

@Component({
  selector: 'app-assessment',
  templateUrl: './assessment.component.html',
  styleUrls: ['./assessment.component.css']
})
export class AssessmentComponent implements OnInit {

  resultsList: any = []
  assessmentData: any = []

  results: any = []
  data2: any
  loading: boolean;
  totalRecords: number
  load: boolean = false

  dt2: Table
  rows: number = 10;
  filterText: any = '';
  constructor(
    private methassess: MethodologyAssessmentControllerServiceProxy,
    private router: Router,
    private activatedRoute: ActivatedRoute,
    public masterDataService: MasterDataService
  ) { }




  async ngOnInit() {
    this.loading = true;
    await this.loadData({})
    
    // this.results = await this.methassess.results().toPromise()

   

    // this.methassess.assessmentDetails().subscribe(async (res: any) => {
    //   this.assessmentData = res

    //   for await (let x of this.assessmentData) {
    //     for await (let result of this.resultsList) {

    //       if (result.assessment?.id == x.id) {
    //         //  console.log("aaaaaaaaaaaaaaaa")
    //         let data: any = {
    //           id: result.id,
    //           assessId: x.id,
    //           meth: x.climateAction.policyName,
    //           method: result.assessment.assessment_method,
    //           approach: result.assessment.assessment_approach,
    //           tool: result.assessment.tool,
    //           assessmentType: result.assessment.assessmentType,
    //           averageOutcome: result.averageOutcome,
    //           averageProcess: result.averageProcess

    //         }

    //         this.results.push(data)
    //       }
    //     }
    //   }

      console.log("resultdataa", this.results)


      //  console.log("resultdataareverse",  this.results.reverse())


    // });



    // setTimeout(() => {
    //   this.load = true;
    //   this.loading = false;
    // }, 5000);

  }


  clear(table: Table) {
    table.clear();
  }

  onInput(event: any, dt: any) {
    // const value = event.target.value;
    // console.log(value)
    // dt.filterGlobal(value, 'contains');
    this.filterText = event.target.value
    this.loadData({})
  }

  async loadData(event: LazyLoadEvent) {
    this.totalRecords = 0;

    let pageNumber = (event.first === 0 || event.first == undefined) ? 0 : event.first / (event.rows == undefined ? 1 : event.rows) + 1;
    this.rows = event.rows == undefined ? 10 : event.rows;

    let skip = pageNumber * this.rows
    // if (skip > this.totalRecords) {
    //   skip = skip - (skip - this.totalRecords)
    // }
    let res = await this.methassess.getResultPageData(skip, this.rows, this.filterText).toPromise()

    this.results = res[0]
    this.totalRecords = res[1]
    console.log(this.totalRecords)

    this.resultsList = this.results.map ((res: any) => {
      return {
        meth: res.assessment.climateAction.policyName,
        approach: res.assessment.assessment_approach,
        assessmentType: res.assessment.assessmentType,
        tool: res.assessment.tool,
        id: res.assessment.id,
        averageOutcome: res.averageOutcome,
        method: res.assessment.assessment_method
      }
    })

   
    if (this.results){
      this.load = true
      this.loading = false
    }
  }



  myFunction(assessId: any, averageProcess: any, averageOutcome: any, tool: string, assessment_method: string) {
    console.log("dddd", assessId, tool, assessment_method, averageProcess, averageOutcome);

    if (tool === 'INVESTOR' || (tool === 'PORTFOLIO' && assessment_method === 'Track 4')) {
      this.router.navigate(['/app/assessment-result-investor', assessId], {
        queryParams: {
          assessmentId: assessId
        },
        relativeTo: this.activatedRoute
      });
    } else if (tool === 'CARBON_MARKET') {
      this.router.navigate(['../carbon-market-tool/result'], {
        queryParams: {
          id: assessId
        },
        relativeTo: this.activatedRoute
      });
    } else {
      this.router.navigate(['/assessment-result', assessId], {
        queryParams: {
          assessmentId: assessId,
          averageProcess: averageProcess,
          averageOutcome: averageOutcome
        }
      });
    }
  }


}


