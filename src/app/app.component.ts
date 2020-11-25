import {AfterViewInit, Component} from '@angular/core';
import { Router, NavigationEnd } from '@angular/router';
import { DataService } from './data.service';

import { routerTransitions } from './router.animation';

import {
  transition,
  trigger,
  query,
  style,
  animate,
  group,
  animateChild
} from '@angular/animations';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
  animations: [ routerTransitions ]
})
export class AppComponent implements AfterViewInit {
  title = 'Online Check-in';

  constructor(private data: DataService, private router: Router,){
    if (window.location.href.indexOf('?s_src') > -1) {
      console.log(window.location.href.split('?s_src='));
      console.log(window.location.href.split('&s_subsrc='));
      localStorage.setItem('source', window.location.href.substr(0, window.location.href.indexOf('&s_subsrc=')).split('?s_src=')[1].toString());
      localStorage.setItem('sub_source', window.location.href.split('&s_subsrc=')[1]);
    }

    this.router.events.subscribe(event => {
      if (event instanceof NavigationEnd) {
        (<any>window).ga('set', 'page', event.urlAfterRedirects);
        (<any>window).ga('send', 'pageview');
      }
    });
  }

  sendEvent = () => {
    (<any>window).ga('send', 'event', {
      eventCategory: 'eventCategory',
      eventLabel: 'eventLabel',
      eventAction: 'eventAction',
      eventValue: 10
    });
  }

  getPage(outlet) {
    return outlet.activatedRouteData['page'] || 'one';
  }

  ngAfterViewInit() {
    // this.data.updateConsSourceCode();
  }
}
