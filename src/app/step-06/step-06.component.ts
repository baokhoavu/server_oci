import {Component, OnInit, OnDestroy, AfterViewInit, ViewChild} from '@angular/core';

/* Routing */
import {Router} from '@angular/router';

/* FormControl, FormGroup and Validators */
import {FormControl, FormGroup, FormGroupDirective, NgForm, Validators} from '@angular/forms';

/* HTTP Client */
import {HttpClient, HttpRequest, HttpEvent, HttpEventType} from '@angular/common/http';

/* Angular Material */
import {MatSnackBar} from '@angular/material';
import {ErrorStateMatcher} from '@angular/material/core';

/* Animations */
import {trigger, state, style, animate, transition} from '@angular/animations';

/* Data Service */
import {DataService} from '../data.service';

/** Error when invalid control is dirty, touched, or submitted. */
export class MyErrorStateMatcher implements ErrorStateMatcher {
  isErrorState(control : FormControl | null, form : FormGroupDirective | NgForm | null) : boolean {
    const isSubmitted = form && form.submitted;
    return !!(control && control.invalid && (control.dirty || control.touched || isSubmitted));
  }
}

@Component({
  selector: 'app-step-06',
  templateUrl: './step-06.component.html',
  styleUrls: ['./step-06.component.scss'],
  animations: [trigger('flyInOut', [
      state('in', style({transform: 'translateY(0)'})),
      transition('void => *', [
        style({transform: 'translateY(100%)', opacity: '1'}),
        animate(300)
      ]),
      transition('* => void', [animate(300, style({transform: 'translateX(-12rem)', opacity: '0'}))])
    ])]
})
export class Step06Component implements OnInit,
OnDestroy,
AfterViewInit {

  // Setting the FlowStep
  flowStep = '5';
  flowStepResults : any = {};
  getFlowStepNumber : string;

  Error: boolean = false;

  // Error state matcher for the form validation
  matcher = new MyErrorStateMatcher();

  // Defining variables tied with the DOfM
  upsellResults : string;
  upsellHiddenResult : string;
  hiddenUpsellValue : string;

  // Defining the formgroup
  upsellForm : FormGroup;

  // Radio Button Options
  upsells = [
    {
      value: '1061',
      viewValue: 'Register for $10 and receive a free limited-edition tee on event day and one entry into our Grand Prize'
    }, {
      value: '1062',
      viewValue: 'Self- Donate $150 and your registration fee is waived! Plus receive a free limited-edition tee on event day and two entries into our Grand Prize'
    }, {
      value: '0',
      viewValue: 'No thank you, I do not wish to register at this time.'
    }
  ];

  // Radio Button Options
  routes = [
    {
      value: '1',
      viewValue: 'NightWalk'
    }, {
      value: '2',
      viewValue: '15k'
    }, {
      value: '3',
      viewValue: '25k'
    }, {
      value: '3',
      viewValue: '40k'
    }
  ];

  // Results from getSurvey
  surveyResults : any = {};

  // Token from the Storage
  storageToken : string = localStorage.getItem('token');

  // Variable for Timeout
  timeOut : any;
  timeOut2 : any;

  constructor(public data : DataService, private http : HttpClient, private route : Router, public snackBar : MatSnackBar) {}

  ngOnInit() {

    console.log(this.upsellResults)

    window.scrollTo(0, 0);

    // Setting a timeout function to log inactive users out (for privacy protection)
    this.timeOut = setTimeout(() => {

      this
        .snackBar
        .open('Need more time? For your security, you\'ve been logged out of your check-in sess' +
            'ion. To continue your online check-in, simply return to the login screen.',
        'Close', {
          duration: 15000,
          panelClass: ['error-info']
        });
      this.timeOut2 = setTimeout(() => {
        this
          .data
          .logOut();
      }, 240000);
    }, 858000);

    // Checking logged in state, and running correct functions
    if (this.data.isLoggedIn() === true && this.data.tokenExpired === false) {
      // console.log('You are logged in!');
      this
        .data
        .getRegInfo();
      this.getFlowStep();
      // this.dataService.getParticipationType();
    } else if (this.data.storageToken === undefined) {
      this
        .data
        .logOut();
      this
        .snackBar
        .open('Login session expired, please login again.', 'Close', {
          duration: 3500,
          panelClass: ['error-info']
        });

    } else {
      // if not logged in, go back to step 1 (login page)
      this
        .snackBar
        .open('You are not logged in, please login.', 'Close', {
          duration: 3500,
          panelClass: ['error-info']
        });
      this
        .route
        .navigate(['/step-01']);
    }
    // Defining Upsell FormGroup

    this.upsellForm = new FormGroup({
      upsellSelect: new FormControl(this.upsellResults, Validators.required),
      routeSelect: new FormControl(null)
    });
    // console.log(this.upsellForm);

  }

  // Clear the timeout function upon entering a new route
  ngOnDestroy() {
    clearTimeout(this.timeOut);
    clearTimeout(this.timeOut2);
  }

  ngAfterViewInit() {
    // console.log(this.upsellForm);
  }

  animationStarted() {
    // console.log('Animation Started');
  }
  animationDone() {
    // console.log('Animation is done.');
  }

  getSurveyRes() {
    this.data.method = 'CRTeamraiserAPI?method=getSurveyResponses&api_key=cfowca&v=1.0&fr_id=' + this.data.eventID + '&survey_id=' + this.data.surveyID + '&sso_auth_token=' + this.data.ssoToken + '&response_format=json';
    // this
    //   .http
    //   .post(this.data.convioURL + this.data.method, null)
    this.http.post(this.data.apiBase + 'getSurvey', {eventId: this.data.eventID, surveyId: this.data.surveyID, token: this.data.ssoToken})
      .subscribe(res => {
        this.surveyResults = res;

        // For loop to loop through the responded data from API call
        for (let data of this.surveyResults.getSurveyResponsesResponse.responses) {
          // If questionId is same as waiver question ID in Survey then check if fullName
          // variable is undefined or null, if so set it as the response value else if
          // it's length is equil to 0 or no reponseValue, then set it to a blank string
          // Upsell Questions
          if (data.questionId === this.data.question16) {
            if (data.responseValue === '[object Object]') {
              this.upsellResults = '';
            }
            if (this.upsellResults === undefined || this.upsellResults === null) {
              this.upsellResults = data.responseValue;
            }

            if (data.responseValue === this.data.hiddenUpsellID || data.responseValue === this.data.hiddenUpsellID2) {
              this.upsellHiddenResult = 'Yes';
            }

            if (data.responseValue === '0') {
              this.upsellHiddenResult = 'No';
            }

            if (Object.keys(data.responseValue).length === 0) {
              this.upsellResults = null;
              // console.log('Nothing has been selected for upsell.');
            }

          }
        }
      }, (err) => {
        if (err.status === 403) {
          // console.log(err);
          this
            .data
            .logOut();
          this
            .snackBar
            .open('Login session expired, please login again.', 'Close', {
              duration: 3500,
              panelClass: ['error-info']
            });

          this
            .route
            .navigate(['/step-01']);
        }
      });
  }

  updateSurveyRes() {
    if (this.upsellResults === this.data.hiddenUpsellID || this.upsellResults === this.data.hiddenUpsellID2) {
      this.upsellHiddenResult = 'Yes';
    }
    if (this.upsellResults === '0') {
      this.upsellHiddenResult = 'No';
    }

    if (this.upsellResults === undefined || this.upsellResults === 'User Provided No Response') {
      this.Error = true;
    } else {
      this.Error = false;
    }

    if (!this.Error) {     

      // Constant variable for the upsell question response and 2ID to send to API
      // end-point
      const question_hidden_upsell = '&question_' + this.data.question16 + '=' + this.upsellResults;
      const question_accepted_upsell = '&question_' + this.data.question6 + '=' + this.upsellHiddenResult;

      const updateSurveyResponsesUrl = 'https://secure.onewalk.ca/site/CRTeamraiserAPI?method=updateSurveyResponses&api_' +
          'key=cfowca&v=1.0&response_format=json&fr_id=' + this.data.eventID;
          
      // this
      //   .http
      //   .post(updateSurveyResponsesUrl + question_hidden_upsell + question_accepted_upsell + '&survey_id=' + this.data.surveyID + '&sso_auth_token=' + this.data.ssoToken, null)
      this.http.post(this.data.apiBase + 'misc', {url: updateSurveyResponsesUrl + question_hidden_upsell + question_accepted_upsell + '&survey_id=' + this.data.surveyID + '&sso_auth_token=' + this.data.ssoToken})
        .subscribe(res => {
          this.surveyResults = res;

          this
            .snackBar
            .open('Your information has been saved!', 'Close', {
              duration: 3500,
              panelClass: ['saved-info']
            });

          // Route user to next route once http post is successful
          this.nextFlowStep();
        }, (error) => {
          this
            .data
            .logOut();
          console.log(error);
        });
    }
  }

  // Save the current Survey Responses
  saveSurveyResponses() {
    if (this.upsellResults === this.data.hiddenUpsellID || this.upsellResults === this.data.hiddenUpsellID2) {
      this.upsellHiddenResult = 'Yes';
    }
    if (this.upsellResults === '0') {
      this.upsellHiddenResult = 'No';
    }
    // console.log(this.upsellHiddenResult); Constant variable for the upsell
    // question response and ID
    const question_hidden_upsell = '&question_' + this.data.question16 + '=' + this.upsellResults;
    const question_accepted_upsell = '&question_' + this.data.question6 + '=' + this.upsellHiddenResult;
    const updateSurveyResponsesUrl = 'https://secure.onewalk.ca/site/CRTeamraiserAPI?method=updateSurveyResponses&api_' +
        'key=cfowca&v=1.0&response_format=json&fr_id=' + this.data.eventID;

    // this
    //   .http
    //   .post(updateSurveyResponsesUrl + question_hidden_upsell + question_accepted_upsell + '&survey_id=' + this.data.surveyID + '&sso_auth_token=' + this.data.ssoToken, null)
    this.http.post(this.data.apiBase + 'misc', {url: updateSurveyResponsesUrl + question_hidden_upsell + question_accepted_upsell + '&survey_id=' + this.data.surveyID + '&sso_auth_token=' + this.data.ssoToken})
      .subscribe(res => {
        this.surveyResults = res;

        this
          .snackBar
          .open('Your information has been saved!', 'Close', {
            duration: 3500,
            panelClass: ['saved-info']
          });

        window
          .location
          .reload();
      }, error => {
        console.log('There was an error');
      });
  }

  // Update the current Flowstep
  updateFlowStep() {
    this.data.method = 'CRTeamraiserAPI?method=updateRegistration&api_key=cfowca&v=1.0&fr_id=' + this.data.eventID + '&sso_auth_token=' + this.storageToken + '&checkin_status=' + this.data.checkInStatus + '&flow_step=' + this.flowStep + '&response_format=json';
    // this
    //   .http
    //   .post(this.data.convioURL + this.data.method, null)
    this.http.post(this.data.apiBase + 'updateStep', {eventId: this.data.eventID, token: this.data.ssoToken, status: this.data.checkInStatus, step: this.flowStep})
      .subscribe(res => {
        // console.log('Flow step updated.')
      }, (err) => {
        if (err) {
          // console.log(err);
          this
            .snackBar
            .open('There was an unknown error.', 'Close', {
              duration: 3500,
              panelClass: ['error-info']
            });

          this
            .data
            .logOut();
        }
      });
  }

  // Update the flowStep to the next flowStep once everything checks out
  nextFlowStep() {
    this.flowStep = '6';
    this.data.method = 'CRTeamraiserAPI?method=updateRegistration&api_key=cfowca&v=1.0&fr_id=' + this.data.eventID + '&sso_auth_token=' + this.storageToken + '&checkin_status=' + this.data.checkInStatus + '&flow_step=' + this.flowStep + '&response_format=json';
    // this
    //   .http
    //   .post(this.data.convioURL + this.data.method, null)
    this.http.post(this.data.apiBase + 'updateStep', {eventId: this.data.eventID, token: this.storageToken, status: this.data.checkInStatus, step: this.flowStep})
      .subscribe(res => {
        // Update the flowStep to the next flowstep once everything checks out properly
        this
          .route
          .navigate(['/step-07']);
      }, (err) => {
        if (err) {
          this
            .snackBar
            .open('There was an unknown error.', 'Close', {
              duration: 3500,
              panelClass: ['error-info']
            });

          this
            .data
            .logOut();
        }
      });
  }

  // Update to the previous Flowstep
  previousFlowStep() {
    this.flowStep = '4';
    this.data.method = 'CRTeamraiserAPI?method=updateRegistration&api_key=cfowca&v=1.0&fr_id=' + this.data.eventID + '&sso_auth_token=' + this.storageToken + '&checkin_status=' + this.data.checkInStatus + '&flow_step=' + this.flowStep + '&response_format=json';
    // this
    //   .http
    //   .post(this.data.convioURL + this.data.method, null)
    this.http.post(this.data.apiBase + 'updateStep', {eventId: this.data.eventID, token: this.storageToken, status: this.data.checkInStatus, step: this.flowStep})
      .subscribe(res => {

        // Route user to previous flow step
        this
          .route
          .navigate(['/step-05']);
      }, (err) => {
        if (err) {
          this
            .snackBar
            .open('There was an unknown error.', 'Close', {
              duration: 3500,
              panelClass: ['error-info']
            });

          this
            .data
            .logOut();
        }
      });
  }

  // Get the current Flowstep
  getFlowStep() {
    this.data.method = 'CRTeamraiserAPI?method=getFlowStep&api_key=cfowca&v=1.0&response_format=json&fr_' +
        'id=' + this.data.eventID + '&sso_auth_token=' + this.storageToken;
    // this
    //   .http
    //   .post(this.data.convioURL + this.data.method, null)
    this.http.post(this.data.apiBase + 'step', {eventId: this.data.eventID, token: this.storageToken})
      .subscribe(res => {
        this.flowStepResults = res;
        this.getFlowStepNumber = this.flowStepResults.getFlowStepResponse.flowStep;

        // Checking the participants flow step to prevent user from skipping a flowstep
        if (this.getFlowStepNumber === this.flowStep) {
          // If the flow step matches to where they are supposed to be, then run the
          // functions for the page below
          this.getSurveyRes();
          this.updateFlowStep();
        } else {
          // If flowstep does not match, show error message and send them back to the
          // previous page/flowstep.
          this
            .snackBar
            .open('You have been redirected to your previously saved location.', 'Close', {
              duration: 3500,
              panelClass: ['routing-info']
            });

          // Check the Flowstep, if matched, send them to the proper route
          if (this.getFlowStepNumber === '0') {
            this
              .route
              .navigate(['/step-02']);
          }
          if (this.getFlowStepNumber === '1') {
            this
              .route
              .navigate(['/step-02']);
          }
          if (this.getFlowStepNumber === '2') {
            this
              .route
              .navigate(['/step-03']);
          }
          if (this.getFlowStepNumber === '3') {
            this
              .route
              .navigate(['/step-04']);
          }
          if (this.getFlowStepNumber === '4') {
            this
              .route
              .navigate(['/step-05']);
          }
          if (this.getFlowStepNumber === '5') {
            this
              .route
              .navigate(['/step-06']);
          }
          if (this.getFlowStepNumber === '6') {
            this
              .route
              .navigate(['/step-07']);
          }
          if (this.getFlowStepNumber === '7') {
            this
              .route
              .navigate(['/step-08']);
          }
          if (this.getFlowStepNumber === '8') {
            this
              .route
              .navigate(['/step-08']);
          }
        }

      }, (err) => {
        console.log(err);

        // If flowstep has error, log out the user (to prevent API errors)
        this
          .data
          .logOut();
      });
  }

}
