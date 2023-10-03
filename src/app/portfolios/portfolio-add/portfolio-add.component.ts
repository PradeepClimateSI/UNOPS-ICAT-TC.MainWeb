import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { MessageService } from 'primeng/api';
import {  GetAssessmentDetailsDto, MethodologyAssessmentControllerServiceProxy, Portfolio, PortfolioControllerServiceProxy } from 'shared/service-proxies/service-proxies';

@Component({
  selector: 'app-portfolio-add',
  templateUrl: './portfolio-add.component.html',
  styleUrls: ['./portfolio-add.component.css']
})
export class PortfolioAddComponent implements OnInit {

  constructor(
    private methassess : MethodologyAssessmentControllerServiceProxy,
    private portfolioServiceProxy : PortfolioControllerServiceProxy,
    private messageService: MessageService,
    private router: Router,
    private route: ActivatedRoute,
  ) { }

  portfolio : Portfolio = new Portfolio();
  tool : string;
  tools: string[];
  addLink: boolean = false;

  optionList = [
    { name: 'Yes' },
    { name: 'No' },
    // Add other options if needed
  ];

  assessList : any = []
  loading: boolean = true;
  statuses: any[];
  apporoachList : any[];
  interventionsList: any = [];
  selectedValues: any = [];
  select : any;
  dataObj : any = []
  lastId : any ;
  resultsList : any = []
  assessmentData :any =[]
  async ngOnInit(): Promise<void> {
    this.tool = 'Portfolio Tool';
    this.tools = ['Portfolio Tool', 'Carbon Market Tool', 'Investment & Private Sector Tool']
    this.addLink=false;
   /*  this.methassess.assessmentDetails().subscribe(async (res: any) => {
       console.log("assessmentData : ", res)
      }); */
      this.resultsList = await this.methassess.results().toPromise()
      this.methassess.assessmentDetails().subscribe(async (res: any) => {
        //  console.log("assessmentData : ", res)
          this.assessmentData = res
    
    
          for await (let x of this.assessmentData){
            for await (let result of this.resultsList){
    
              if(result.assessment?.id == x.id){
    
                this.assessList.push(result.assessment)
              }
            }
          }
    
          console.log("resultdataa",this.assessList)
          const uniqueNamesSet = new Set<string>(this.assessList.map((item: { climateAction: { typeofAction: any; }; })=> item.climateAction.typeofAction));
          this.interventionsList = Array.from(uniqueNamesSet, value => ({ value, label: value }));
    
        });
    
      this.portfolioServiceProxy.getLastID().subscribe(async (res: any) => {
        console.log("iddd : ", res)
        this.lastId = res[0].portfolioId;

        this.portfolio.portfolioId = this.getNext();

        console.log("nexttt : ",  this.portfolio.portfolioId)
       });

      let req = new GetAssessmentDetailsDto()
      req.tools = this.tools

      // this.methassess.assessmentDetailsforTool(req).subscribe(async (res: any) => {
      //   console.log("assessmentData : ", res)
      //   // this.assessList = res;

      //   const uniqueNamesSet = new Set<string>(this.assessList.map((item: { climateAction: { typeofAction: any; }; })=> item.climateAction.typeofAction));
      //   this.interventionsList = Array.from(uniqueNamesSet, value => ({ value, label: value }));

      //   console.log("distinctNames : ", this.interventionsList)

      //  });

       this.statuses = [
        { label: 'Ex-post', value: 'Ex-post' },
        { label: 'Ex-ante', value: 'Ex-ante' },
    ];

    this.apporoachList = [
      { label: 'Direct', value: 'Direct' },
      { label: 'Indirect', value: 'Indirect' },
  ];
  }


  getNext(){
    const lastNumber = parseInt(this.lastId.substr(6), 10);

    // Generate the next number by incrementing the last number
    const nextNumber = lastNumber + 1;

    // Pad the next number with zeros to ensure it has three digits
    const paddedNumber = nextNumber.toString().padStart(3, '0');

    // Construct the nextId in the format "2023PTxxx"
    const nextId = "2023PT" + paddedNumber;

    return nextId
  }

  sendData(){
    console.log("werr", this.selectedValues)
  }

  save( data : any){
    console.log("aa", data)
    console.log("werr", this.selectedValues)
    console.log("kkkkkk", this.portfolio.portfolioId)

    data.portfolioId = this.portfolio.portfolioId

    console.log("aa22", data)

    if(this.selectedValues.length < 1){
      this.messageService.add({
        severity: 'error',
        summary: 'Warning',
        detail: 'Please select at least one assessment',
        closable: true,
      })
      return
    }

    this.dataObj = {
      formData : data,
      tableData : this.selectedValues
    }
    console.log("uuu", this.dataObj)

    this.portfolioServiceProxy.create(this.dataObj).subscribe(async (res: any) => {
      console.log("assessmentData : ", res)

        this.messageService.add({
          severity: 'success',
          summary: 'Success',
          detail: 'Portfolio created successfully',
          closable: true,
        })

       // this.router.navigate(['/app/portfolio-list'],);
        this.router.navigate(['app/portfolio-view'], { queryParams: { id: res } });

     },error => {
      console.log(error)
      this.messageService.add({
        severity: 'error',
        summary: 'Error',
        detail: 'Portfolio detail saving failed',
        closable: true,
      })
    }

     );
  }

  onInput(event: any, dt: any) {
    const value = event.target.value;
    dt.filterGlobal(value, 'contains');
  }

  onCheckboxChange(event: any, assessList: any) {
    console.log("event", event)
    console.log("assessList", assessList)
     if (event) {
      this.selectedValues.push(assessList);
    } else {
      const index = this.selectedValues.findIndex((item: any) => item === assessList);
      if (index !== -1) {
        this.selectedValues.splice(index, 1);
      }
    }


    console.log("aaaa", this.selectedValues)
  }

  onChangePreviousAssessment(option:any){

    console.log("optionnn", option)
    if(option === "Yes"){
      this.addLink = true;
    }
    if(option === "No"){
      this.addLink = false;
    }
  }


}
