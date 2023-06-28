import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';
import { Portfolio, PortfolioControllerServiceProxy } from 'shared/service-proxies/service-proxies';

@Component({
  selector: 'app-portfolio-result',
  templateUrl: './portfolio-result.component.html',
  styleUrls: ['./portfolio-result.component.css']
})
export class PortfolioResultComponent implements OnInit {

  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private portfolioServiceProxy: PortfolioControllerServiceProxy,
  ) { }

  portfolioId: number;
  portfolio: Portfolio;
  card: any[] = [];
  assessList: any = [];
  load: boolean = false;

  processData: any = [];
  outcomeData: any[] = [];
  outcomeData2: any[] = [];
  allData : any = [];

  tableShow : boolean =false;
  tableShow2 : boolean =false;
  tableShow3 : boolean =false;
  tableShow4 : boolean =false;

  @ViewChild('content', { static: false }) el!: ElementRef;
  @ViewChild('content') content: ElementRef;

  ngOnInit(): void {

    this.tableShow = false;
    this.tableShow2 = false;
    this.tableShow3 = false;
    this.tableShow4 = false;
    this.route.queryParams.subscribe((params: { [x: string]: number; }) => {
      this.portfolioId = params['id'];
    });

    console.log("hhh", this.portfolioId)

    this.portfolioServiceProxy.getPortfolioById(this.portfolioId).subscribe(async (res: any) => {
      console.log("assesss : ", res)
      //  this.portfolioList = res;
      this.portfolio = res[0];

      this.card.push(
        ...[
          { title: 'Portfolio ID', data: this.portfolio.portfolioId },
          { title: 'Name of the Portfolio', data: this.portfolio.portfolioName },
          { title: 'Description', data: this.portfolio.description },
          { title: 'Person(s)/ organization(s) doing the assessment', data: this.portfolio.person },
          { title: 'Is this assessment an update of a previous assessment?', data: res[0].IsPreviousAssessment },
          { title: 'Objective(s) of the assessment', data: this.portfolio.objectives },
          { title: 'Intended audience(s) of the assessment', data: this.portfolio.audience },
          { title: 'Opportunities for stakeholders to participate in the assessment', data: this.portfolio.opportunities },
          { title: 'Principles on which the assessment is based', data: this.portfolio.principles }
        ])


    });


    this.portfolioServiceProxy.assessmentsByPortfolioId(this.portfolioId).subscribe(async (res: any) => {
      console.log("assesssListt : ", res)
      this.assessList = res;

      setTimeout(() => {
        this.load = true;
      }, 1000);
    });


    this.portfolioServiceProxy.assessmentsDataByAssessmentId(this.portfolioId).subscribe(async (res: any) => {
      console.log("arrayyy : ", res)
      this.processData = [];
      this.outcomeData = [];
      this.outcomeData2 = [];

      for (let data of res) {
      this.processData = [];
      this.outcomeData = [];
      this.outcomeData2 = [];
        for (let x of data.result) {
          if (x.type === 'process') {
            this.processData.push(x);
          }

          if (x.type === 'outcome' && (x.name === 'Scale GHGs' || x.name === 'Scale SD')) {

            this.outcomeData.push(x);
          }

          if (x.type === 'outcome' && (x.name === 'Sustained nature-GHGs' || x.name === 'Sustained nature-SD')) {

            this.outcomeData2.push(x);
          }
        }

        let obj = {
          assess : data.assessment,
          process : this.processData,
          scale : this.outcomeData,
          sustained : this.outcomeData2,
          ghgValue : data.ghgValue,
        }

        this.allData.push(obj)
      }

      console.log("this.allData : ", this.allData)

     // console.log("this.processData : ", this.processData)
     // console.log(" this.outcomeData : ",  this.outcomeData)


     /* Portfolio toolll */

     for(let assessment of this.allData){

      const data: any = assessment.scale[1]

      const averages: any = {};

     data.characteristics.forEach((obj: { name: string; score: any; }) => {
       if (obj.name in averages) {
         averages[obj.name].score += obj.score || 0;
       //  averages[obj.name].sustainedScore += obj.sustainedScore === '-' ? 0 : parseInt(obj.sustainedScore);
         averages[obj.name].count++;
       } else {
         averages[obj.name] = {
          score: obj.score || 0,
         //  sustainedScore: obj.sustainedScore === '-' ? 0 : parseInt(obj.sustainedScore),
           count: 1
         };
       }
     });

     const result = [];

     for (const name in averages) {
       const averageScaleScore = averages[name].score / averages[name].count;
       //const averageSustainedScore = averages[name].sustainedScore / averages[name].count;

       result.push({
        score: averageScaleScore.toFixed(3),
        // sustainedScore: '-',
         name: name
       });
     }

     console.log("resulttt", result);

      /* Portfolio toolll */
      const data2: any =  assessment.sustained[1]

      const averages2: any = {};

      data2.characteristics.forEach((obj: { name: string; score: any; }) => {
        if (obj.name in averages2) {
          averages2[obj.name].score += obj.score || 0;
          //averages2[obj.name].scaleScore += obj.scaleScore === '-' ? 0 : parseInt(obj.scaleScore);
          averages2[obj.name].count++;
        } else {
          averages2[obj.name] = {
            score: obj.score || 0,
         //  scaleScore: obj.scaleScore === '-' ? 0 : parseInt(obj.scaleScore),
            count: 1
          };
        }
      });

      const result2 = [];

      for (const name in averages2) {
      //  const averageScaleScore2 = averages2[name].scaleScore / averages2[name].count;
        const averageSustainedScore2 = averages2[name].score / averages2[name].count;

        result2.push({
         // scaleScore: '-',
          score: averageSustainedScore2.toFixed(3),
          name: name
        });
      }

      console.log("resulttt22", result2);

     /*  assessment.scale[1].characteristics = []
      assessment.scale[1].characteristics = result
      assessment.sustained[1].characteristics = []
      assessment.sustained[1].characteristics = result2 */

     }




    });


  }

  calculateAverage(data: any[]) {
    const sum = data.reduce((accumulator, item) => accumulator + parseFloat(item.likelihoodAverage), 0);
    const average = sum / data.length;
    return average.toFixed(3);
  }

  calculateAverageRelevance(data: any[]) {
    const sum = data.reduce((accumulator, item) => accumulator + parseFloat(item.relevanceAverage), 0);
    const average = sum / data.length;
    return average.toFixed(3);
  }

  calculateAverageScale(data: any[]) {
    const sum = data.reduce((accumulator, item) => accumulator + parseFloat(item.scoreAverage), 0);
    const average = sum / data.length;
    return average.toFixed(3);
  }

  calculateAverageSustained(data: any[]) {
    const sum = data.reduce((accumulator, item) => accumulator + parseFloat(item.scoreAverage), 0);
    const average = sum / data.length;
    return average.toFixed(3);
  }


  getColorClass(value: any) {
    let value2 = Number(value)
    if (value2 >= 0 && value2 < 1) {
      return 'color-class-1';
    } else if (value2 >= 1 && value2 < 2) {
      return 'color-class-2';
    } else if (value2 >= 2 && value2 < 3) {
      return 'color-class-3';
    } else if (value2 >= 3 && value2 <= 4) {
      return 'color-class-4';
    } else {
      return 'default-color-class';
    }
  }

  getColorClass2(value: any) {
    let value2 = Number(value)
    if (value2 >= -1 && value2 < 0) {
      return 'color-class-5';
    } else if (value2 >= 0 && value2 < 1) {
      return 'color-class-6';
    } else if (value2 >= 1 && value2 < 2) {
      return 'color-class-7';
    } else if (value2 >= 2 && value2 < 3) {
      return 'color-class-8';
    }  else if (value2 >= 3 && value2 <= 4) {
      return 'color-class-9';
    } else {
      return 'default-color-class';
    }
  }

  clickData : any = [];
  clickData2 : any = [];
  clickData3 : any = [];
  clickData4 : any = [];

  handleClick(cha : any){
    console.log("chaa", cha)
    this.clickData = cha;
    this.tableShow = true;
  }

  handleClick2(cha : any){
    console.log("chaa22", cha)
    this.clickData2 = cha;
    this.tableShow2 = true;
  }

  handleClick3(cha : any){
    console.log("chaa33", cha)
    this.clickData3 = cha;
    this.tableShow3 = true;
  }

  handleClick4(cha : any){
    console.log("chaa44", cha)
    this.clickData4 = cha;
    this.tableShow4 = true;
  }


  public async showTable() {
    // this.ngOnInit();
    this.tableShow = false;
}

  public async showTable2() {
    // this.ngOnInit();
    this.tableShow2 = false;
  }

  public async showTable3() {
    // this.ngOnInit();
    this.tableShow3 = false;
  }

  public async showTable4() {
    // this.ngOnInit();
    this.tableShow4 = false;
  }


  makePDF() {

    var data = document.getElementById('content')!;

    html2canvas(data).then((canvas) => {
      const componentWidth = data.offsetWidth
      const componentHeight = data.offsetHeight

      const orientation = componentWidth >= componentHeight ? 'l' : 'p'

      const imgData = canvas.toDataURL('image/png')
      const pdf = new jsPDF({
        orientation,
        unit: 'px'
      })

      pdf.internal.pageSize.width = componentWidth
      pdf.internal.pageSize.height = componentHeight

      pdf.addImage(imgData, 'PNG', 0, 0, componentWidth, componentHeight)
      pdf.save('portfolio-result.pdf')
    })

  }


  Back(){
    this.router.navigate(['/app/portfolio-list'],);
  }
}
