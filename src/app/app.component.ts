import { Component, HostListener } from '@angular/core';
import { MessageService } from 'primeng/api';
import { DialogService } from 'primeng/dynamicdialog';
import { AppService } from 'shared/AppService';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
  providers: [MessageService, DialogService],
})
export class AppComponent {
  title = 'icat-country-portal-web-app';
  togglemenu: boolean = true;
  innerWidth = 0;

  @HostListener('window:resize', ['$event'])
  onResize(event: any) {
    this.innerWidth = window.innerWidth;
  }

  constructor(private appService: AppService){
    this.appService.startRefreshTokenTimer();
    this.appService.startIdleTimer();
  }
}
