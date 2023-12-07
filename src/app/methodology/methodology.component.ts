
import { IDropdownSettings } from 'ng-multiselect-dropdown';
import { MethodologyAssessmentControllerServiceProxy, ProjectControllerServiceProxy } from 'shared/service-proxies/service-proxies';
import { HttpClient } from '@angular/common/http';
import {  Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import {Chart} from 'chart.js';
interface CategoryInput {
  id: number;
  category: string;
  characteristics: {
    name: string;
    relevance: string;
    score: number;
  }[];
}



@Component({
  selector: 'app-methodology',
  templateUrl: './methodology.component.html',
  styleUrls: ['./methodology.component.css']
})
export class MethodologyComponent implements OnInit {

  @ViewChild('myCanvas', { static: true }) canvasRef!: ElementRef<HTMLCanvasElement>;



  avg1 = 2;
  avg2 = 2;
selectedIndicator: string;

  constructor(
    private methassess : MethodologyAssessmentControllerServiceProxy,
    private http: HttpClient,
    private climateAction : ProjectControllerServiceProxy,
  ) { }

  selectedType = 'opentype';
  meth1:boolean;

  methList: any= [];
  methListAll :any = [];
  categotyList :any = [];
  meth1Process :any = [];
  meth1Outcomes :any = [];
  characteristicsList : any = []
  characteristicsArray : any= []
  methIndicatorsList :any = [];

  policyList : any = []
  policyId : number;

  filteredIndicatorList :any =[]
  selectedIndicatorValue :any

trigger : boolean = false;

  barriersList : any = []
  barrierId : number;

  indicatorList :any = []

   averageProcess : number

   averageOutcome : number

  relevantChaList : any = []

  methId :number;
  dropdownList: { item_id: number, item_text: string }[] = [];
  selectedItems: { id: number; name: string }[] = [];

  dropdownSettings: IDropdownSettings = {};
  dropdownSettings2: IDropdownSettings = {};
  dropdownSettings3: IDropdownSettings = {};
  dropdownSettings4: IDropdownSettings = {};

 dropdownList3: { item_id: number, item_text: string }[] = [];
  dropdownList2: { id: number, policyName: string }[] = [];

  selectedItems2: { id: number, name: string }[] = [];
  selectedItems3: { id: number, name: string }[] = [];
  selectedItems4: { id: number, name: string }[] = [];

  selectedBarriers: { id: number, name: string }[] = [];

  characAffectedByBarriers: { id: number, name: string }[] = [];

  selectedPolicy: any

  assessmentId :number;
  selectChaAffectByBarriers : any = []


  characteristics :any = [];

  selectedCategories: string[] = ['Category 1', 'Category 2'];




  chart(): void {
    if (!this.canvasRef) {
      return;
    }

    const canvas = this.canvasRef.nativeElement;
    const ctx = canvas.getContext('2d');

    if (!ctx) {
      return;
    }

    const gradient = ctx.createLinearGradient(0, 0, 500, 500);
    gradient.addColorStop(0, 'red');
    gradient.addColorStop(0.5, 'yellow');
    gradient.addColorStop(1, 'green');

    const chart = new Chart(ctx, {
      type: 'line',
      data: {
        datasets: [
          {
            label: 'My Dataset',
            data: [{ x: this.averageOutcome, y: this.averageProcess }],
            backgroundColor: gradient,
            borderColor: 'black',
            borderWidth: 1,
            pointRadius: 5,
            pointBackgroundColor: 'blue',
            pointBorderColor: 'black',
            pointBorderWidth: 1,
          },
        ],
      },
      options: {
        scales: {
          x: {
            type: 'linear',
            min: 0,
            max: 5,
            ticks: {
              stepSize: 1
            }
          },
          y: {
            type: 'linear',
            min: 0,
            max: 5,
            ticks: {
              stepSize: 1
            }
          }
        },
        plugins: {
          tooltip: {
            callbacks: {
              label: (context) => {
                const data = context.dataset.data[context.dataIndex];
                return `(${this.averageOutcome}, ${this.averageProcess})`;
              },
            },
          },
        },
      },
    });
  }


  ngOnInit(): void {

    this.policyList = [];
    this.barriersList = [];
    this.indicatorList = [];

    this.methassess.findAllBarriers().subscribe((res: any) => {
      this.barriersList = res;

    });

    this.methassess.findAllIndicators().subscribe((res: any) => {;
      this.indicatorList = res;

    });


    this.climateAction.findAllPolicies().subscribe((res: any) => {;
      for(let data of res){
        let policyObj = {
          id : data.id,
          policyName : data.policyName
        }

        this.policyList.push(policyObj)
      }
;

    });

    this.methList = [];
    this.methListAll = [];
    this.characteristicsList = [];
    this.methassess.findAllMethodologies().subscribe((res: any) => {
      for (let x of res) {
        this.methList.push(x.methodology_name);
        this.methListAll.push(x);
      }
;
    });



    this.categotyList = [];
    this.meth1Process = [];
    this.meth1Outcomes = [];
    this.methassess.findAllCategories().subscribe((res2: any) => {
      for (let x of res2) {;
          if(x.type === 'process'){
            this.meth1Process.push(x);
          }
          if(x.type === 'outcome'){
            this.meth1Outcomes.push(x);
          }
      };
    });

    this.methassess.findAllCharacteristics().subscribe((res3: any) => {
      this.characteristicsList = res3

    });

   this.methassess.findAllMethIndicators().subscribe((res: any) => {
    this.methIndicatorsList = res;

  });




    this.dropdownSettings = {
      singleSelection: false,
      idField: 'id',
      textField: 'name',
      selectAllText: 'Select All',
      unSelectAllText: 'UnSelect All',
      itemsShowLimit: 5,
      allowSearchFilter: true
    };

    this.dropdownSettings2 = {
      singleSelection: false,
      idField: 'id',
      textField: 'policyName',
      selectAllText: 'Select All',
      unSelectAllText: 'UnSelect All',
      itemsShowLimit: 5,
      allowSearchFilter: true
    };

    this.dropdownSettings3 = {
      singleSelection: false,
      idField: 'id',
      textField: 'barrier',
      selectAllText: 'Select All',
      unSelectAllText: 'UnSelect All',
      itemsShowLimit: 2,
      allowSearchFilter: true
    };

    this.dropdownSettings4 = {
      singleSelection: false,
      idField: 'id',
      textField: 'name',
      selectAllText: 'Select All',
      unSelectAllText: 'UnSelect All',
      itemsShowLimit: 2,
      allowSearchFilter: true
    };


  }

  onChange(event:any) {
    this.selectedType = event.target.value;
  }





  getCategory(characteristics: any, category: any) {

    this.characteristicsArray = [];
    for (let x of this.characteristicsList) {
      if (x.category.name === category) {
        this.characteristicsArray.push(x);
      }
    }
    return this.characteristicsArray;

  }

onItemSelect(item: any) {
  this.selectedItems = [];
  for(let x of item.value){
    this.selectedItems.push(x)
  }


}


onItemSelect2(item: any) {
  this.selectedItems2 = [];
  for(let x of item.value){
    this.selectedItems2.push(x)
  }

}


onItemSelect3(item: any) {
  this.selectedItems3 = [];
  for(let x of item.value){
    this.selectedItems3.push(x);
  }

}


onItemSelect4(item: any) {
  this.selectedItems4 = [];
  for(let x of item.value){
    this.selectedItems4.push(x);
  }


}

onItemSelectcha(item :any){
  this.selectChaAffectByBarriers = [];
  for(let x of item.value){
    this.selectChaAffectByBarriers.push(x);
  }


}


onItemSelect6(item: any) {
  this.selectedBarriers = [];
  for(let x of item.value){
    this.selectedBarriers.push(x)
  }

}

onItemSelect7(item: any) {
  this.characAffectedByBarriers = [];
  for(let x of item.value){
    this.characAffectedByBarriers.push(x)
  }

}

onSubmit(data: any) {

  this.assessmentId = 0;
  let categoryDataArray: any[] = [];
if( data.policy === 'TC Uganda Geothermal'){
  for (let category of this.selectedItems) {
    let categoryData: any = {
      categoryId :category.id,
      category: category.name,
      characteristics: []
    };

    for (let characteristic of this.getCategory(this.characteristicsList, category.name)) {
      let charName = `${category.name}_${characteristic.name}`;
      let charRelevance = `${category.name}_${characteristic.name}_relevance`;
      let charScore = `${category.name}_${characteristic.name}_score`;

      if (data[charName]) {
        categoryData.characteristics.push({
          id : characteristic.id,
          name: characteristic.name,
          relevance: data[charRelevance],
          score: data[charScore]
        });
      }
    }
    categoryDataArray.push(categoryData);
  }


  for (let category of this.selectedItems2) {
    let categoryData: any = {
      categoryId :category.id,
      category: category.name,
      characteristics: []
    };

    for (let characteristic of this.getCategory(this.characteristicsList, category.name)) {
      let charName = `${category.name}_${characteristic.name}`;
      let charRelevance = `${category.name}_${characteristic.name}_relevance`;
      let charScore = `${category.name}_${characteristic.name}_score`;

      if (data[charName]) {
        categoryData.characteristics.push({
          id : characteristic.id,
          name: characteristic.name,
          relevance: data[charRelevance],
          score: data[charScore]
        });
      }
    }
    categoryDataArray.push(categoryData);
  }
}


if( data.policy === 'TC NACAG Initiative'){
  for (let category of this.selectedItems3) {
    let categoryData: any = {
      categoryScore: data[`${category.name}_catscore`],
      categoryId :category.id,
      category: category.name,
      characteristics: []
    };

    for (let characteristic of this.getCategory(this.characteristicsList, category.name)) {
      let charName = `${category.name}_${characteristic.name}`;
      let charRelevance = `${category.name}_${characteristic.name}_relevance`;
      let charScore = `${category.name}_${characteristic.name}_score`;

      if (data[charName]) {
        categoryData.characteristics.push({
          id : characteristic.id,
          name: characteristic.name,
          relevance: data[charRelevance],
          score: data[charScore]
        });
      }
    }
    categoryDataArray.push(categoryData);
  }


  for (let category of this.selectedItems4) {
    let categoryData: any = {
      categoryScore: data[`${category.name}_catscore`],
      categoryId :category.id,
      category: category.name,
      characteristics: []
    };

    for (let characteristic of this.getCategory(this.characteristicsList, category.name)) {
      let charName = `${category.name}_${characteristic.name}`;
      let charRelevance = `${category.name}_${characteristic.name}_relevance`;
      let charScore = `${category.name}_${characteristic.name}_score`;

      if (data[charName]) {
        categoryData.characteristics.push({
          id : characteristic.id,
          name: characteristic.name,
          relevance: data[charRelevance],
          score: data[charScore]
        });
      }
    }
    categoryDataArray.push(categoryData);
  }
} for(let methdata of this.methListAll){
    if(data.methodology == methdata.methodology_name){
       this.methId = methdata.id
    }

  }

  for(let policydata of this.policyList){
    if(data.policy == policydata.policyName){
       this.policyId = policydata.id
    }

  }

  let allData: any = {
    methodology : this.methId,
    categoryData :categoryDataArray,
    policyId : this.policyId,
  };

   this.methassess.methAssignDataSave(allData).subscribe(res => {


    this.averageProcess = res.result.averageProcess;
    this.averageOutcome = res.result.averageOutcome;
    this.assessmentId = res.assesId;

    this.chart();


    this.methassess.findByAssessIdAndRelevanceNotRelevant(this.assessmentId).subscribe(res => {
      this.relevantChaList = res;
      } )


  } )

}

submitForm(){
  let sendData:any = {
    assessment : this.assessmentId,
    characteristics : this.characAffectedByBarriers
  }

  this.methassess.assessCharacteristicsDataSave(sendData).subscribe(res => {

  } )

  this.trigger = true;
}

filterMethList :any  = []

onIndicatorSelected( indicator: any) {
  this.filterMethList = [];

  for(let item of this.methIndicatorsList){
    if(item.indicator.name === indicator){
      this.filterMethList.push(item);
    }
  }

  return this.filterMethList;
}




handleSelectedCharacteristic(event: any) {
  this.filteredIndicatorList = []
  const selectedCharacteristic = event;

  for(let indicator of this.indicatorList){
    if(indicator.characteristics.name === selectedCharacteristic){
      this.filteredIndicatorList.push(indicator)
    }
  }

  return this.filteredIndicatorList

}




}
