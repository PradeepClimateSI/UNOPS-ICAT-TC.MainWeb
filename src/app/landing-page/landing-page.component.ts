import {
  AfterViewInit,
  ChangeDetectorRef,
  Component,
  OnInit,
  ViewChild,
} from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import {
  ConfirmationService,
  LazyLoadEvent,
  MessageService,
} from 'primeng/api';

import {
  ServiceProxy,
} from 'shared/service-proxies/service-proxies';

@Component({
  selector: 'app-landing-page',
  templateUrl: './landing-page.component.html',
  styleUrls: ['./landing-page.component.css'],
})
export class LandingPageComponent implements OnInit, AfterViewInit {
  ;
  imageObject: any[] = [];
  countryObject: any[] = [];
  reportObject: any[] = [];

  obj = {
    image: '',
    thumbImage: '',
    title: '',
    description: '',
    savedLocation: '',
  };

  responsiveOptions = [
    {
      breakpoint: '1024px',
      numVisible: 3,
      numScroll: 3,
    },
    {
      breakpoint: '768px',
      numVisible: 2,
      numScroll: 2,
    },
    {
      breakpoint: '560px',
      numVisible: 1,
      numScroll: 1,
    },
  ];

  @ViewChild('op') overlay: any;
  constructor(
    private router: Router,
    private serviceProxy: ServiceProxy,
    private cdr: ChangeDetectorRef,
    private route: ActivatedRoute
  ) {}

  ngAfterViewInit(): void {
    this.cdr.detectChanges();
  }

  ngOnInit(): void {
    let reportFilter: string[] = [];
    reportFilter.push('Report.isPublish||$eq||' + 1); //&
    // parameterFilter.push('Parameter.assessmentYear||$eq||');


    let countryFilter: string[] = [];
    countryFilter.push('Country.isSystemUse||$eq||' + 1); //&
    // parameterFilter.push('Parameter.assessmentYear||$eq||');


    let lmFilter: string[] = [];
    lmFilter.push('LearningMaterial.documentType||$eq||' + 'User Guidence') &
      lmFilter.push('LearningMaterial.isPublish||$eq||' + 1);

 ;
  }

  toNextPage() {
    this.router.navigate(['/loard-more']);
  }

  toView(lm: any) {
    console.log(lm);
    //alert("hellll");
    window.location.href = lm.document;
  }

  viewPdf(obj: any) {
    window.location.href = obj.savedLocation;
  }
}
