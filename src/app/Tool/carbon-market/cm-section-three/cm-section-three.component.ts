import { Component, Input, OnInit } from '@angular/core';
import { TabView } from 'primeng/tabview';
import { CMQuestionControllerServiceProxy, MethodologyAssessmentControllerServiceProxy } from 'shared/service-proxies/service-proxies';

@Component({
  selector: 'app-cm-section-three',
  templateUrl: './cm-section-three.component.html',
  styleUrls: ['./cm-section-three.component.css']
})
export class CmSectionThreeComponent implements OnInit {

  @Input() approach: string

  activeIndex: number = 0;
  processData: any;
  outcomeData: any;
  activeIndexMain: number = 0;
  mainTabIndex: any;
  categoryTabIndex: any;
  categories: any
  types: any
  selectedType: any
  selectedCategory: any
  questions: any;


  constructor(
    private cMQuestionControllerServiceProxy: CMQuestionControllerServiceProxy,
    private methodologyAssessmentControllerServiceProxy: MethodologyAssessmentControllerServiceProxy
  ) { }

  async ngOnInit(): Promise<void> {
    this.types = [
      {name: 'Process of Change', code: 'process'},
      {name: 'Outcome of Change', code: 'outcome'}
    ]
    this.categories = await this.cMQuestionControllerServiceProxy.getUniqueCharacterisctics().toPromise()
    this.selectedType = this.types[0]
    this.selectedCategory = this.categories[this.selectedType.code].categories[0]
    console.log(this.categories)
    this.onMainTabChange({index: 0})
    this.onCategoryTabChange({index: 0})
    let outcome = await this.methodologyAssessmentControllerServiceProxy.getAllOutcomeCharacteristics().toPromise()
    console.log(outcome)
  }

  onMainTabChange(event: any) {
    this.selectedType = this.types[event.index]
    console.log(event, this.selectedType)
    this.mainTabIndex = event.index;
  }

  async onCategoryTabChange(event: any) {
    this.selectedCategory = this.categories[this.selectedType.code].categories[event.index]
    let ids = this.categories[this.selectedType.code].characteristic[this.selectedCategory.code].map((item: any) => {
      return item.id
    })
    this.questions = await this.cMQuestionControllerServiceProxy.getQuestionsByCharacteristic(ids).toPromise()
    console.log(this.questions)
    console.log(this.selectedCategory, ids)
    this.categoryTabIndex =event.index;
  }

}
