import {Component, OnInit, ElementRef, Renderer2, ViewChild, AfterViewInit} from '@angular/core';
import { Router, RouterModule } from '@angular/router';

import { trigger, style, transition, animate, keyframes, query, stagger } from '@angular/animations';

@Component({
  selector: 'app-stepper',
  templateUrl: './stepper.component.html',
  styleUrls: ['./stepper.component.scss'],
  animations: [

    trigger('progress', [
      transition('* <=> *', [

        query(':enter', style({ opacity: 0 }), {optional: true}),

        query(':enter', stagger('300ms', [
          animate('.6s ease-in', keyframes([
            style({opacity: 0, transform: 'translateY(-75%)', offset: 0}),
            style({opacity: .5, transform: 'translateY(35px)',  offset: 0.3}),
            style({opacity: 1, transform: 'translateY(0)',     offset: 1.0}),
          ]))]), {optional: true})
        ,
        query(':leave', stagger('300ms', [
          animate('.6s ease-out', keyframes([
            style({opacity: 1, transform: 'translateY(0)', offset: 0}),
            style({opacity: .5, transform: 'translateY(35px)',  offset: 0.3}),
            style({opacity: 0, transform: 'translateY(-75%)',     offset: 1.0}),
          ]))]), {optional: true})
      ])
    ])

  ]
})
export class StepperComponent implements OnInit, AfterViewInit {
  @ViewChild('step01', { read:ElementRef, static: false }) el:ElementRef;
  @ViewChild('step02', { read:ElementRef, static: false }) el2: ElementRef;
  // @ViewChild('step03', { read:ElementRef, static: false }) el3:ElementRef;
  @ViewChild('step04', { read:ElementRef, static: false }) el3: ElementRef;
  @ViewChild('step05', { read:ElementRef, static: false }) el4: ElementRef;
  @ViewChild('step06', { read:ElementRef, static: false }) el5: ElementRef;
  @ViewChild('step07', { read:ElementRef, static: false }) el6: ElementRef;
  @ViewChild('step08', { read:ElementRef, static: false }) el7: ElementRef;

  @ViewChild('hideMe', { read:ElementRef, static: false }) hide: ElementRef;
  @ViewChild('txtActive', { read:ElementRef, static: false }) txtActive: ElementRef;

  // Locale Variable to switch out stepper
  checkLocale = false;

  constructor(private renderer: Renderer2, private router: Router) { }

  ngOnInit() {
    if (localStorage.getItem('localeFR') === 'true') {
      this.checkLocale = true;
    }
  }

  ngAfterViewInit() {
      // console.log(this.el);
      this.renderer.addClass(this.el.nativeElement, 'active');

    if (this.router.url === '/step-02') {
        this.renderer.addClass(this.el.nativeElement, 'active');

        this.el.nativeElement.classList.add('current');
    }

    if (this.router.url === '/step-03') {
      this.renderer.addClass(this.el.nativeElement, 'active');
        this.renderer.addClass(this.el2.nativeElement, 'active');

        this.el2.nativeElement.classList.add('current');
    }

    // if (this.router.url === '/step-04'){
    // 	this.renderer.addClass(this.el2.nativeElement, 'active');
    //     this.renderer.addClass(this.el3.nativeElement, 'active');
        //
    //     this.el3.nativeElement.classList.add('current');
    // }

    if (this.router.url === '/step-05') {
      this.renderer.addClass(this.el2.nativeElement, 'active');
        // this.renderer.addClass(this.el3.nativeElement, 'active');
        this.renderer.addClass(this.el3.nativeElement, 'active');

        this.el3.nativeElement.classList.add('current');
    }

    if (this.router.url === '/step-06') {
      this.renderer.addClass(this.el2.nativeElement, 'active');
        this.renderer.addClass(this.el3.nativeElement, 'active');
        this.renderer.addClass(this.el4.nativeElement, 'active');

        this.el4.nativeElement.classList.add('current');
    }

    if (this.router.url === '/step-07') {
      this.renderer.addClass(this.el2.nativeElement, 'active');
        this.renderer.addClass(this.el3.nativeElement, 'active');
        this.renderer.addClass(this.el4.nativeElement, 'active');
        this.renderer.addClass(this.el5.nativeElement, 'active');

        this.el5.nativeElement.classList.add('current');
    }

    if (this.router.url === '/step-08') {
      this.renderer.addClass(this.el2.nativeElement, 'active');
        this.renderer.addClass(this.el3.nativeElement, 'active');
        this.renderer.addClass(this.el4.nativeElement, 'active');
        this.renderer.addClass(this.el5.nativeElement, 'active');
        this.renderer.addClass(this.el6.nativeElement, 'active');

        this.el6.nativeElement.classList.add('current');
    }

    if (this.router.url === '/step-08') {
      this.renderer.addClass(this.el2.nativeElement, 'active');
        this.renderer.addClass(this.el3.nativeElement, 'active');
        this.renderer.addClass(this.el4.nativeElement, 'active');
        this.renderer.addClass(this.el5.nativeElement, 'active');
        this.renderer.addClass(this.el6.nativeElement, 'active');
        this.renderer.addClass(this.el7.nativeElement, 'active');

        this.el7.nativeElement.classList.add('current');
    }

    if (this.router.url === '/') {
        this.renderer.addClass(this.hide.nativeElement, 'hide');
    }
    // if (window.location.href.indexOf("step-02") > -1) {
    // 	console.log('you are in step 2');
    // 	this.renderer.addClass(this.el.nativeElement, 'active');
    // }

    // if (window.location.href.indexOf("step-03") > -1) {
    // 	console.log('you are in step 2');
    // 	this.renderer.addClass(this.el2.nativeElement, 'active');
    // }

    // if (window.location.href.indexOf("step-01") > -1) {
    // 	this.renderer.addClass(this.hide.nativeElement, 'hide');
    // }
  }

}
