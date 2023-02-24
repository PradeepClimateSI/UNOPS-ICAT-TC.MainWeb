import { Component, OnInit, ViewChild } from '@angular/core';
import { IDropdownSettings } from 'ng-multiselect-dropdown';
import { MethodologyAssessmentControllerServiceProxy, ServiceProxy } from 'shared/service-proxies/service-proxies';


@Component({
  selector: 'app-methodology',
  templateUrl: './methodology.component.html',
  styleUrls: ['./methodology.component.css']
})
export class MethodologyComponent implements OnInit {

  constructor(
    private methassess : MethodologyAssessmentControllerServiceProxy,

  ) { }

  selectedType = 'opentype';
  meth1:boolean;

  methList: any= [];
  categotyList :any = [];
  meth1Process :any = [];
  meth1Outcomes :any = [];
  meth2Process :any = [];
  meth2Outcomes :any = [];



//Processess of change
  dropdownList: { item_id: number, item_text: string }[] = [];
  selectedItems: { id: number, name: string }[] = [];
  dropdownSettings: IDropdownSettings = {};

//Outcomes of change
  dropdownList2: { item_id: number, item_text: string }[] = [];
  selectedItems2: { item_id: number, item_text: string }[] = [];


  dropdownList3: { item_id: number, item_text: string }[] = [];
  selectedItems3: { item_id: number, item_text: string }[] = [];


  dropdownList4: { item_id: number, item_text: string }[] = [];
  selectedItems4: { item_id: number, item_text: string }[] = [];



  categories = [
    {name: 'Category 1', characteristics: [
      {name: 'Characteristic 1', score: 0, relevance: '', selected:''},
      {name: 'Characteristic 2', score: 0, relevance: '', selected:''},
      {name: 'Characteristic 3', score: 0, relevance: '', selected:''}
    ]},
    {name: 'Category 2', characteristics: [
      {name: 'Characteristic 4', score: 0, relevance: '', selected:''},
      {name: 'Characteristic 5', score: 0, relevance: '', selected:''},
      {name: 'Characteristic 6', score: 0, relevance: '', selected:''}
    ]},
    {name: 'Category 3', characteristics: [
      {name: 'Characteristic 7', score: 0, relevance: '', selected:''},
      {name: 'Characteristic 8', score: 0, relevance: '', selected:''},
      {name: 'Characteristic 9', score: 0, relevance: '', selected:''}
    ]},
    {name: 'Category 4', characteristics: [
      {name: 'Characteristic 10', score: 0, relevance: '', selected:''},
      {name: 'Characteristic 11', score: 0, relevance: '', selected:''},
      {name: 'Characteristic 12', score: 0, relevance: '', selected:''}
    ]}
  ];


  categories2 = [
    {name: 'Category 5', characteristics: [
      {name: 'Characteristic 13', score: 0, relevance: '', selected:''},
      {name: 'Characteristic 14', score: 0, relevance: '', selected:''},
      {name: 'Characteristic 15', score: 0, relevance: '', selected:''}
    ]},
    {name: 'Category 6', characteristics: [
      {name: 'Characteristic 16', score: 0, relevance: '', selected:''},
      {name: 'Characteristic 17', score: 0, relevance: '', selected:''},
      {name: 'Characteristic 18', score: 0, relevance: '', selected:''}
    ]},
    {name: 'Category 7', characteristics: [
      {name: 'Characteristic 19', score: 0, relevance: '', selected:''},
      {name: 'Characteristic 20', score: 0, relevance: '', selected:''},
      {name: 'Characteristic 21', score: 0, relevance: '', selected:''}
    ]},
    {name: 'Category 8', characteristics: [
      {name: 'Characteristic 22', score: 0, relevance: '', selected:''},
      {name: 'Characteristic 23', score: 0, relevance: '', selected:''},
      {name: 'Characteristic 24', score: 0, relevance: '', selected:''}
    ]}
  ];


  categories3 = [
    {name: 'Category 1', cat_score: 0, characteristics: [
      {name: 'Characteristic 1', score: 0, relevance: '', selected:''},
      {name: 'Characteristic 2', score: 0, relevance: '', selected:''},
      {name: 'Characteristic 3', score: 0, relevance: '', selected:''}
    ]},
    {name: 'Category 2', cat_score: 0, characteristics: [
      {name: 'Characteristic 4', score: 0, relevance: '', selected:''},
      {name: 'Characteristic 5', score: 0, relevance: '', selected:''},
      {name: 'Characteristic 6', score: 0, relevance: '', selected:''}
    ]},
    {name: 'Category 3',cat_score: 0, characteristics: [
      {name: 'Characteristic 7', score: 0, relevance: '', selected:''},
      {name: 'Characteristic 8', score: 0, relevance: '', selected:''},
      {name: 'Characteristic 9', score: 0, relevance: '', selected:''}
    ]},
    {name: 'Category 4',cat_score: 0, characteristics: [
      {name: 'Characteristic 10', score: 0, relevance: '', selected:''},
      {name: 'Characteristic 11', score: 0, relevance: '', selected:''},
      {name: 'Characteristic 12', score: 0, relevance: '', selected:''}
    ]}
  ];


  categories4 = [
    {name: 'Category 5', cat_score: 0, characteristics: [
      {name: 'Characteristic 13', score: 0, relevance: '', selected:''},
      {name: 'Characteristic 14', score: 0, relevance: '', selected:''},
      {name: 'Characteristic 15', score: 0, relevance: '', selected:''}
    ]},
    {name: 'Category 6', cat_score: 0, characteristics: [
      {name: 'Characteristic 16', score: 0, relevance: '', selected:''},
      {name: 'Characteristic 17', score: 0, relevance: '', selected:''},
      {name: 'Characteristic 18', score: 0, relevance: '', selected:''}
    ]},
    {name: 'Category 7',cat_score: 0, characteristics: [
      {name: 'Characteristic 19', score: 0, relevance: '', selected:''},
      {name: 'Characteristic 20', score: 0, relevance: '', selected:''},
      {name: 'Characteristic 21', score: 0, relevance: '', selected:''}
    ]},
    {name: 'Category 8',cat_score: 0, characteristics: [
      {name: 'Characteristic 22', score: 0, relevance: '', selected:''},
      {name: 'Characteristic 23', score: 0, relevance: '', selected:''},
      {name: 'Characteristic 24', score: 0, relevance: '', selected:''}
    ]}
  ];



  characteristics :any = [];

  selectedCategories: string[] = ['Category 1', 'Category 2'];


/*   showSelectedItems() {
    console.log("aaa",this.categories);
  }
   */
 

  ngOnInit(): void {

    this.methList = [];
    this.methassess.findAllMethodologies().subscribe((res: any) => {
      console.log("ressss", res)
      for (let x of res) {
        this.methList.push(x.methodology_name);
      } 

    });

    this.categotyList = [];
    this.meth1Process = [];
    this.methassess.findAllCategories().subscribe((res2: any) => {
      console.log("categoryList", res2)
      for (let x of res2) {
        //this.categotyList.push(x);
        if( x.methodology.methodology_name=== 'Meth1'){
          if(x.type === 'process'){
            this.meth1Process.push(x)
          }
          if(x.type === 'outcome'){
            this.meth1Outcomes.push(x)
          }
        }
        if( x.methodology.methodology_name=== 'Meth2'){
          if(x.type === 'process'){
            this.meth2Process.push(x)
          }
          if(x.type === 'outcome'){
            this.meth2Outcomes.push(x)
          }
        }
          
      }  

      console.log("yyyy",this.selectedItems )



    });

    
    

   // console.log("categotyList", this.categotyList)

    this.dropdownList = [
      { item_id: 1, item_text: 'Category 1' },
      { item_id: 2, item_text: 'Category 2' },
      { item_id: 3, item_text: 'Category 3' },
      { item_id: 4, item_text: 'Category 4' }
    ];

    this.dropdownList2 = [
      { item_id: 1, item_text: 'Category 5' },
      { item_id: 2, item_text: 'Category 6' },
      { item_id: 3, item_text: 'Category 7' },
      { item_id: 4, item_text: 'Category 8' }
    ];

    this.dropdownList3 = [
      { item_id: 1, item_text: 'Category 1' },
      { item_id: 2, item_text: 'Category 2' },
      { item_id: 3, item_text: 'Category 3' },
      { item_id: 4, item_text: 'Category 4' }
    ];

    this.dropdownList4 = [
      { item_id: 1, item_text: 'Category 5' },
      { item_id: 2, item_text: 'Category 6' },
      { item_id: 3, item_text: 'Category 7' },
      { item_id: 4, item_text: 'Category 8' }
    ];
    
  
    this.dropdownSettings = {
      singleSelection: false,
      idField: 'id',
      textField: 'name',
      selectAllText: 'Select All',
      unSelectAllText: 'UnSelect All',
      itemsShowLimit: 5,
      allowSearchFilter: true
    };



     // Initialize the list of characteristics based on the selected category
     this.updateCharacteristics();
  }

  onSubmit(data:any){
    console.log("dataaaa", data)

  }

  onChange(event:any) {
    this.selectedType = event.target.value;

    if (this.selectedType === 'Meth1') {      
      this.meth1=true;
    }
  }

  // Update the list of characteristics based on the selected category
  updateCharacteristics() {
    const selectedCategoryNames = new Set(this.selectedCategories);
    this.characteristics = this.categories
      .filter(category => selectedCategoryNames.has(category.name))
      .flatMap(category => category.characteristics);
  }
  
  
 getCategory(characteristics: any, category: any) {
  const foundCategory = this.categories.find(c => c.name === category);
  return foundCategory ? foundCategory.characteristics : [];
}

getCategory2(characteristics: any, category: any) {
  const foundCategory = this.categories2.find(c => c.name === category);
  return foundCategory ? foundCategory.characteristics : [];
}

getCategory3(characteristics: any, category: any) {
  const foundCategory = this.categories3.find(c => c.name === category);
  return foundCategory ? foundCategory.characteristics : [];
}

getCategory4(characteristics: any, category: any) {
  const foundCategory = this.categories4.find(c => c.name === category);
  return foundCategory ? foundCategory.characteristics : [];
}

//Processess of change
onItemSelect(item: any) {
  console.log(item);
  this.selectedItems.push(item)
  console.log("select", this.selectedItems);

}
onSelectAll(items: any) {
  this.selectedItems = [];
  for(let x of items){
    this.selectedItems.push(x)
  }
  console.log(items);
}

 onItemDeSelect(item: any) {
  // find the index of the deselected item in the selectedItems array
  const index = this.selectedItems.findIndex((selectedItem) => selectedItem.id === item.item_id);

  // remove the item from the selectedItems array
  this.selectedItems.splice(index, 1);
}


onDeSelectAll(item: any){
  this.selectedItems = [];
}

 

//Outcomes of change
onItemSelect2(item: any) {
  console.log(item);
  this.selectedItems2.push(item)
  console.log("select2", this.selectedItems2);

}
onSelectAll2(items: any) {
  this.selectedItems2 = [];
  for(let x of items){
    this.selectedItems2.push(x)
  }
  console.log(items);
}

 onItemDeSelect2(item: any) {
  const index = this.selectedItems2.findIndex((selectedItem2) => selectedItem2.item_id === item.item_id);
  this.selectedItems2.splice(index, 1);
}

onDeSelectAll2(item: any){
  this.selectedItems2 = [];
}


onItemSelect3(item: any) {
  console.log(item);
  this.selectedItems3.push(item)
  console.log("select3", this.selectedItems3);

}
onSelectAll3(items: any) {
  this.selectedItems3 = [];
  for(let x of items){
    this.selectedItems3.push(x)
  }
  console.log(items);
}

 onItemDeSelect3(item: any) {
  const index = this.selectedItems3.findIndex((selectedItem3) => selectedItem3.item_id === item.item_id);
  this.selectedItems3.splice(index, 1);
}


onDeSelectAll3(item: any){
  this.selectedItems3 = [];
}


onItemSelect4(item: any) {
  console.log(item);
  this.selectedItems4.push(item)
  console.log("select4", this.selectedItems4);

}
onSelectAll4(items: any) {
  this.selectedItems4 = [];
  for(let x of items){
    this.selectedItems4.push(x)
  }
  console.log(items);
}

 onItemDeSelect4(item: any) {
  const index = this.selectedItems4.findIndex((selectedItem4) => selectedItem4.item_id === item.item_id);
  this.selectedItems4.splice(index, 1);
}


onDeSelectAll4(item: any){
  this.selectedItems4 = [];
}


  
}
