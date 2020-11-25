import { Component, OnInit, OnDestroy, AfterViewInit, ViewChild, ElementRef, Renderer2 } from '@angular/core';
import { Router } from '@angular/router';

/* HTTP Client to retrieve data */
import { HttpClient, HttpRequest, HttpEvent, HttpEventType } from '@angular/common/http';

/* Data Service */
import { DataService } from '../data.service';

/* Angular Material */
import { MatSnackBar } from '@angular/material';


@Component({
  selector: 'app-step-08',
  templateUrl: './step-08.component.html',
  styleUrls: ['./step-08.component.scss']
})
export class Step08Component implements OnInit, OnDestroy, AfterViewInit {

  // Setting the FlowStep
  flowStep = '7';
  flowStepResults: any= {};
  getFlowStepNumber: string;

  // Survey Data and Variables
  surveyResults: any = {};
  preReg: string;
  shuttle1: string;
  shuttle2: string;
  jersey: string;
  vege: string;
  cancer: string;
  year: string;
  route: string;
  gender: string;

  show: boolean = false;
  show2: boolean = false;

  // Registration Data
  regData: any = {};

  // Tentstatus Variable
  tentStatus: string;

  // Check-in Status Data
  updateRegRes: any = {};

  // Variable for Timeout Function
  timeOut: any;
  timeOut2: any;

  constructor(public data: DataService,
              private http: HttpClient,
              private router: Router,
              public snackBar: MatSnackBar) { }

  ngOnInit() {
    window.scrollTo(0, 0);

    // Setting a timeout function to log inactive users out (for privacy protection)
    this.timeOut = setTimeout(() => {

      this.snackBar.open('Need more time? For your security, you\'ve been logged out of your check-in session. To continue your online check-in, simply return to the login screen.', 'Close', {
        duration: 15000,
        panelClass: ['error-info']
      });

      this.timeOut2 = setTimeout(() => {
        this.data.logOut();
      }, 240000);
    }, 858000);

    // Checking logged in state, and running correct functions
    if (this.data.isLoggedIn() === true && this.data.tokenExpired === false) {

      // If user is logged in, then get the current flowStep (to prevent people from skipping pages)
      this.getFlowStep();
    } else if (this.data.storageToken === undefined) {
      // console.log('Auth Token Expired.');

      this.snackBar.open('Login session expired, please login again.', 'Close', {
        duration: 3500,
        panelClass: ['error-info']
      });

      this.router.navigate(['/step-01']);

    } else {
      // if not logged in, go back to step 1 (login page)
      this.snackBar.open('You are not logged in, please login.', 'Close', {
        duration: 3500,
        panelClass: ['error-info']
      });

      this.router.navigate(['/step-01']);
    }

  }

  ngAfterViewInit() {}

  // Clear the timeout function upon entering a new route
  ngOnDestroy() {
    clearTimeout(this.timeOut);
  }

  // Get the Survey Responses
  getSurveyRes() {
    this.data.method = 'CRTeamraiserAPI?method=getSurveyResponses&api_key=cfowca&v=1.0&fr_id=' + this.data.eventID + '&sso_auth_token=' + this.data.ssoToken + '&survey_id=' + this.data.surveyID + '&response_format=json';
    // this.http.post(this.data.convioURL + this.data.method, null)
    this.http.post(this.data.apiBase + 'getSurvey', {eventId:  this.data.eventID, surveyId: this.data.surveyID , token: this.data.ssoToken})
      .subscribe(res => {

        // console.log(res)

        this.surveyResults = res;

        console.log(this.surveyResults);

        // Accepted Upsell Offer (for Pre-register question)
        for (const result of this.surveyResults.getSurveyResponsesResponse.responses) {
          if (result.questionId === this.data.question6) {
            this.preReg = result.responseValue;
          }

          // Year
          if (result.questionId === this.data.question1) {
            this.year = result.responseValue;
          }

          // Vegetarian
          if (result.questionId === this.data.question15) {
            this.vege = result.responseValue;
          }

          // Cancer
          if (result.questionId === this.data.question14) {
            this.cancer = result.responseValue;
          }    

          // Jersey
          if (result.questionId === this.data.question18) {
            this.jersey = result.responseValue;
          }
          
          // Route
          if (result.questionId === this.data.question29) {
            this.route = result.responseValue;
          }

          // Gender
          if (result.questionId === this.data.question7) {
            this.gender = result.responseValue;
          }

          // Shuttle 1
          if (result.questionId === this.data.question19) {
            if (result.responseValue !== `I don't need a shuttle`) {
              this.shuttle1 = result.responseValue;
              this.show = true;
            }
          }

          // Shuttle 2
          if (result.questionId === this.data.question20) {
            if (result.responseValue !== `I don't need a shuttle`) {
              this.shuttle2 = result.responseValue;
              this.show2 = true;
            }
          }


        }

      }, (err) => {
        // console.log(err);
      });
  }

  // Update the current Flowstep
  updateFlowStep() {
    this.data.method = 'CRTeamraiserAPI?method=updateRegistration&api_key=cfowca&v=1.0&fr_id=' + this.data.eventID + '&sso_auth_token=' + this.data.ssoToken + '&flow_step=' + this.flowStep + '&response_format=json';
    // this.http.post(this.data.convioURL + this.data.method, null)
    this.http.post(this.data.apiBase + 'updateStep', {eventId: this.data.eventID, token: this.data.ssoToken, status: null, step:  this.flowStep})
      .subscribe(res => {
        // console.log('Flow step updated.')
      }, (err) => {
        if (err) {
          // console.log('There was an error updating the flowstep.');
        }
      });
  }

  // Set checkInStatus as Complete
  updateCheckInStatusComplete() {
    this.data.method = 'CRTeamraiserAPI?method=updateRegistration&api_key=cfowca&v=1.0' + '&fr_id=' + this.data.eventID + '&sso_auth_token=' + this.data.ssoToken + '&checkin_status=complete' + '&response_format=json';
    // this.http.post(this.data.convioURL + this.data.method, null)
    this.http.post(this.data.apiBase + 'updateStep', {eventId: this.data.eventID, token: this.data.ssoToken, status: 'complete', step: ''})
      .subscribe(res => {
        this.updateRegRes = res;
        // console.log(this.updateRegRes);
        // window.location.reload();
      });
  }

  // Get the current Flowstep
  getFlowStep() {
    const token = localStorage.getItem('token');
    this.data.method = 'CRTeamraiserAPI?method=getFlowStep&api_key=cfowca&v=1.0&response_format=json&fr_id=' + this.data.eventID + '&sso_auth_token=' + token;
    // this.http.post(this.data.convioURL + this.data.method, null)
    this.http.post(this.data.apiBase + 'misc', {url: this.data.convioURL + this.data.method})
      .subscribe(res => {
        this.flowStepResults = res;
        this.getFlowStepNumber = this.flowStepResults.getFlowStepResponse.flowStep;

        // Checking the participants flow step to prevent user from skipping a flowstep
        if (this.getFlowStepNumber === this.flowStep) {

          // If the flow step matches to where they are supposed to be, then run the functions for the current route below
          this.updateFlowStep();
          this.updateCheckInStatusComplete();
          this.getSurveyRes();
          this.data.getUserInfo();
          this.data.getRegInfo();
          this.data.getTeam();
        } else {

          // If flowstep does not match, show error message and send them back to the previous page/flowstep.
          this.snackBar.open('You have been redirected to your previously saved location.', 'Close', {
            duration: 3500,
            panelClass: ['routing-info']
          });

          // Check the Flowstep, if matched, send them to the proper route
          if (this.getFlowStepNumber === '0') {
            this.router.navigate(['/step-02']);
          }
          if (this.getFlowStepNumber === '1') {
            this.router.navigate(['/step-02']);
          }
          if (this.getFlowStepNumber === '2') {
            this.router.navigate(['/step-03']);
          }
          if (this.getFlowStepNumber === '3') {
            this.router.navigate(['/step-04']);
          }
          if (this.getFlowStepNumber === '4') {
            this.router.navigate(['/step-05']);
          }
          if (this.getFlowStepNumber === '5') {
            this.router.navigate(['/step-06']);
          }
          if (this.getFlowStepNumber === '6') {
            this.router.navigate(['/step-07']);
          }
          if (this.getFlowStepNumber === '7') {
            this.router.navigate(['/step-08']);
          }
        }

      }, (err) => {
        // console.log(err);

        // If flowstep has error, log out the user (to prevent API errors)
        this.data.logOut();
      });
  }

  // Print Method
  print() {
    window.print();
  }

}
