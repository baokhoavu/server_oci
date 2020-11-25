  import {Component, OnInit, OnDestroy, AfterViewInit} from '@angular/core';
import {MatSnackBar} from '@angular/material';
import {Router} from '@angular/router';
import {FormGroup, FormControl, FormGroupDirective, NgForm, Validators} from '@angular/forms';
import {HttpClient, HttpRequest, HttpEvent, HttpEventType} from '@angular/common/http';
import {ErrorStateMatcher} from '@angular/material/core';

import {DataService} from '../data.service';

/** Error when invalid control is dirty, touched, or submitted. */
export class MyErrorStateMatcher implements ErrorStateMatcher {
  isErrorState(control : FormControl | null, form : FormGroupDirective | NgForm | null) : boolean {
    const isSubmitted = form && form.submitted;
    return !!(control && control.invalid && (control.dirty || control.touched || isSubmitted));
  }
}

@Component({selector: 'app-step-03', templateUrl: './step-03.component.html', styleUrls: ['./step-03.component.scss']})
export class Step03Component implements OnInit,
OnDestroy,
AfterViewInit {

  step03Form : FormGroup;

  matcher = new MyErrorStateMatcher();

  buttonStatus = true;

  // Flowstep
  flowStep = '2';
  flowStepResults : any = {};
  getFlowStepNumber : string;

  // Results from HTTP calls set as Objects for OOP
  surveyResults : any = {};
  regRes : any = {};

  // DOM Element Responses
  cancerRes : string;
  physicalRes: string;
  vegRes : string;
  shuttleRes : string;
  shuttleRes2 : string;
  shuttleRes3 : string;
  shuttleRes4 : string;
  shuttleRes5 : string;
  shuttleRes6 : string;
  bikeRes1 : string;
  bikeRes2 : string;
  bikeRes3 : string;
  jerseyRes : string;
  attendanceRes : string;
  routeRes : string;
  experiencedRiderRes : string;
  glutenRes : string;

  emergencyNameRes : string;
  emergencyPhoneRes : string;

  Error: boolean = false;
  Error2: boolean = false;
  Error3: boolean = false;
  Error4: boolean = false;
  Error5: boolean = false;
  Error6: boolean = false;
  Error7: boolean = false;
  Error8: boolean = false;
  Error9: boolean = false;

  // Variable to hide elements
  hideMe : boolean;
  hideMeNight : boolean;
  hideMeCrew : boolean;
  hideMeOthers : boolean;
  showRoute : boolean;

  // Participation Types
  partNight = this.dataService.participationType === '15 KM Night Walk';
  partCrew = this.dataService.participationType === 'Crew';

  // Select Options for Yes/No
  matSelect = [
    {
      value: 'Yes',
      viewValue: 'Yes'
    }, {
      value: 'No',
      viewValue: 'No'
    }
  ];

  noSelect = [
    {
      value: 'No',
      viewValue: 'No'
    }
  ];

  // Select Options for Jesey Sizes
  jerseySelect = [
    {
      value: 'XS',
      viewValue: 'XS'
    }, {
      value: 'S',
      viewValue: 'S'
    }, {
      value: 'M',
      viewValue: 'M'
    }, {
      value: 'L',
      viewValue: 'L'
    }, {
      value: 'XL',
      viewValue: 'XL'
    }, {
      value: '2XL',
      viewValue: '2XL'
    }, {
      value: '3XL',
      viewValue: '3XL'
    }
  ];

  // Radio Button Options
  routes = [
    {
      value: 'City Nights 15km',
      viewValue: 'City Nights 15km'
    }, {
      value: 'Day Trip 25km',
      viewValue: 'Day Trip 25km'
    }, {
      value: 'Day trip 15km',
      viewValue: 'Day trip 15km'
    }, {
      value: 'Both City Nights and Day Trip',
      viewValue: 'Both City Nights and Day Trip'
    }
  ];

  shuttleAnswer1 = [
    {
      value: '6:30 a.m. Departure: Toronto Union Station  65 Front Street West, Toronto, ON M5J 1E6',
      viewValue: '6:30 a.m. Departure: Toronto Union Station  65 Front Street West, Toronto, ON M5J 1E6'
    }, {
      value: '7:00 a.m. Departure: Agincourt GO Station  4100 Sheppard Avenue E, Scarborough, ON M1S 1T2',
      viewValue: '7:00 a.m. Departure: Agincourt GO Station  4100 Sheppard Avenue E, Scarborough, ON M1S 1T2'
    }, {
      value: '6:30 a.m. Departure: Holiday Inn Toronto Downtown  30 Carlton St, Toronto ON M5B 2E9',
      viewValue: '6:30 a.m. Departure: Holiday Inn Toronto Downtown  30 Carlton St, Toronto ON M5B 2E9'
    }, {
      value: '7:00 a.m. Departure: Novotel Toronto Vaughan Centre  200 Bass Pro Mills Drive, Vaughan ON, L4K OB9',
      viewValue: '7:00 a.m. Departure: Novotel Toronto Vaughan Centre  200 Bass Pro Mills Drive, Vaughan ON, L4K OB9'
    }, {
      value: `I don't need a shuttle`,
      viewValue: `I don't need a shuttle`
    }
  ];

  shuttleAnswer2 = [
    {
      value: 'Return shuttle (anytime between 2 p.m. and 5:30 p.m.) to Union Station - 65 Front Street West, Toronto, ON M5J 1E6?',
      viewValue: 'Return shuttle (anytime between 2 p.m. and 5:30 p.m.) to Union Station - 65 Front Street West, Toronto, ON M5J 1E6'
    }, {
      value: 'Return shuttle (anytime between 2 p.m. and 5:30 p.m.) to the Agincourt GO Station  4100 Sheppard Avenue E, Scarborough, ON M1S 1T2?',
      viewValue: 'Return shuttle (anytime between 2 p.m. and 5:30 p.m.) to the Agincourt GO Station  4100 Sheppard Avenue E, Scarborough, ON M1S 1T2'
    }, {
      value: `I don't need a shuttle`,
      viewValue: `I don't need a shuttle`
    }
  ];


  // Crew Member Only Routes
  routesCrew = [
    {
      value: '3',
      viewValue: 'Crew'
    }
  ];

  // Years attended Options
  years = [
    {
      value: '1',
      viewValue: '1'
    }, {
      value: '2',
      viewValue: '2'
    }, {
      value: '3',
      viewValue: '3'
    }, {
      value: '4',
      viewValue: '4'
    }, {
      value: '5',
      viewValue: '5'
    }, {
      value: '6',
      viewValue: '6'
    }, {
      value: '7',
      viewValue: '7'
    }, {
      value: '8',
      viewValue: '8'
    }, {
      value: '9',
      viewValue: '9'
    }, {
      value: '10',
      viewValue: '10'
    }, {
      value: '11',
      viewValue: '11'
    }, {
      value: '12',
      viewValue: '12'
    }, {
      value: '13',
      viewValue: '13'
    }, {
      value: '14',
      viewValue: '14'
    }, {
      value: '15',
      viewValue: '15'
    }, {
      value: '16',
      viewValue: '16'
    }
  ];

  // Specifying API Method Variable
  method : string;

  // Variable for Timeout
  timeOut : any;
  timeOut2 : any;

  constructor(public dataService : DataService, private route : Router, private http : HttpClient, public snackBar : MatSnackBar) {}

  ngOnInit() {

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
          .dataService
          .logOut();
      }, 240000);
    }, 858000);

    // console.log(this.dataService.participationType);

    if (this.dataService.participationType === 'Crew') {
      console.log('Crew Account');
    }

    this.step03Form = new FormGroup({
      emergencyName: new FormControl(this.emergencyNameRes, Validators.required),
      emergencyPhone: new FormControl(this.emergencyPhoneRes, Validators.required),
      yearsAttended: new FormControl(this.attendanceRes, Validators.required),
      // jerseySizes: new FormControl(this.jerseyRes, Validators.required),
      cancerSurvivor: new FormControl(this.cancerRes, Validators.required),
      physicalAilment: new FormControl(this.physicalRes, Validators.required),
      vegMeals: new FormControl(this.vegRes, Validators.required),
      routeSelect: new FormControl(this.routeRes, Validators.required),
      shuttle1: new FormControl(this.shuttleRes, Validators.required),
      shuttle2: new FormControl(this.shuttleRes2, Validators.required)
    });

    // Checking logged in state, if they are logged in run regInfo() and
    // getUserInfo() functions from the global dataService.
    if (this.dataService.isLoggedIn() === true && this.dataService.tokenExpired === false) {

      // Get the current flowstep
      this.getFlowStep();

      this
        .dataService
        .getParticipationType();

    } else if (this.dataService.storageToken === undefined) {
      this
        .snackBar
        .open('Login session expired, please login again.', 'Close', {
          duration: 3500,
          panelClass: ['error-info']
        });
      this
        .route
        .navigate(['/step-01']);

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

  }

  // Clear the timeout function upon entering a new route
  ngOnDestroy() {
    clearTimeout(this.timeOut);
  }

  ngAfterViewInit() {
    // console.log(this.dataService.participationType);
    // console.log(this.step03Form);
  }

  // Get the Survey Responses
  getSurveyRes() {
    this.method = 'CRTeamraiserAPI?method=getSurveyResponses&api_key=cfowca&v=1.0&fr_id=' + this.dataService.eventID + '&sso_auth_token=' + this.dataService.ssoToken + '&survey_id=' + this.dataService.surveyID + '&response_format=json';
    this
      .http
      .post(this.dataService.convioURL + this.method, null)
    // this.http.post(this.dataService.apiBase + 'getSurvey', {eventId:this.dataService.eventID, surveyId:this.dataService.surveyID, token: this.dataService.ssoToken })
      .subscribe(res => {
        this.surveyResults = res;

        // console.log(this.surveyResults);

        // For Loop to get Survey Data and set it to the correct variables (to prevent
        // data being saved as undefined or null)
        for (let res of this.surveyResults.getSurveyResponsesResponse.responses) {

          // Emergency Name
          if (res.questionId === this.dataService.question8) {
            if (this.emergencyNameRes === undefined || this.emergencyNameRes === null) {
              this.emergencyNameRes = '';
            }
            if (res.responseValue !== undefined || res.responseValue !== null) {
              this.emergencyNameRes = res.responseValue;
            }
            if (Object.keys(res.responseValue).length === 0) {
              this.emergencyNameRes = '';
            }
          }

          // Emergency Number
          if (res.questionId === this.dataService.question9) {
            if (this.emergencyPhoneRes === undefined || this.emergencyPhoneRes === null) {
              this.emergencyPhoneRes = '';
            }
            if (res.responseValue !== undefined || res.responseValue !== null) {
              this.emergencyPhoneRes = res.responseValue;
            }
            if (Object.keys(res.responseValue).length === 0) {
              this.emergencyPhoneRes = '';
            }
          }

          // Cancer Survivor
          if (res.questionId === this.dataService.question14) {

            if (this.cancerRes === undefined) {
              this.cancerRes = '';
            }
            if (res.responseValue !== undefined || res.responseValue !== null) {
              this.cancerRes = res.responseValue;
            }
            if (Object.keys(res.responseValue).length === 0) {
              this.cancerRes = '';
            }

            if (this.partCrew) {
              this.cancerRes = 'No';
            }
          }

          // Physical Ailment
          if (res.questionId === this.dataService.question13) {

            if (this.physicalRes === undefined) {
              this.physicalRes = '';
            }
            if (res.responseValue !== undefined || res.responseValue !== null) {
              this.physicalRes = res.responseValue;
            }
            if (Object.keys(res.responseValue).length === 0) {
              this.physicalRes = '';
            }
          }

          // Vegetarian Meals
          if (res.questionId === this.dataService.question15) {
            if (this.vegRes === undefined) {
              this.vegRes = '';
            }
            if (res.responseValue !== undefined || res.responseValue !== null) {
              this.vegRes = res.responseValue;
            }
            if (Object.keys(res.responseValue).length === 0) {
              this.vegRes = '';
            }
          }

          // How many years have you ridden with The Ride?
          if (res.questionId === this.dataService.question1) {
            if (this.attendanceRes === undefined) {
              this.attendanceRes = '';
            }
            if (res.responseValue !== undefined || res.responseValue !== null) {
              this.attendanceRes = res.responseValue;
            }
            if (Object.keys(res.responseValue).length === 0) {
              this.attendanceRes = '';
            }
          }

          // Jersey Selection
          // if (res.questionId === this.dataService.question18) {
          //   if (this.jerseyRes === '[object Object]') {
          //     this.jerseyRes = '';
          //   }
          //   if (this.jerseyRes === undefined) {
          //     this.jerseyRes = '';
          //     // this.jerseyRes = res.responseValue;
          //   }
          //   if (res.responseValue !== undefined || res.responseValue !== null) {
          //     this.jerseyRes = res.responseValue;
          //   }
          //   if (Object.keys(res.responseValue).length === 0) {
          //     this.jerseyRes = '';
          //   }
          // }

          // Shuttle 1 Selection
          if (res.questionId === this.dataService.question19) {
            if (this.shuttleRes === undefined || this.shuttleRes === null) {
              this.shuttleRes = '';
              // this.shuttleRes = res.responseValue;
            }
            if (res.responseValue !== undefined || res.responseValue !== null) {
              this.shuttleRes = res.responseValue;
            }
            if (Object.keys(res.responseValue).length === 0) {
              this.shuttleRes = '';
            }
            if (this.dataService.participationType === 'VIRTUAL WALKER' || this.dataService.participationType === 'ONEWALK CREW' || this.dataService.participationType === '15 KM ONEWALK CITY NIGHTS') {
              this.shuttleRes = `I don't need a shuttle`
            }
          }

          // Shuttle 2 Selection
          if (res.questionId === this.dataService.question20) {
            if (this.shuttleRes2 === undefined || this.shuttleRes2 === null) {
              this.shuttleRes2 = '';
              // this.shuttleRes2 = res.responseValue;
            }
            if (res.responseValue !== undefined || res.responseValue !== null) {
              this.shuttleRes2 = res.responseValue;
            }
            if (Object.keys(res.responseValue).length === 0) {
              this.shuttleRes2 = '';
            }
            if (this.dataService.participationType === 'VIRTUAL WALKER' || this.dataService.participationType === 'ONEWALK CREW' || this.dataService.participationType === '15 KM ONEWALK CITY NIGHTS') {
              this.shuttleRes2 = `I don't need a shuttle`
            }            
          }

          // Route Select
          if (res.questionId === this.dataService.question29) {
            if (this.routeRes === undefined || this.routeRes === null) {
              this.routeRes = '';
            }
            if (res.responseValue !== undefined || res.responseValue !== null) {
              this.routeRes = res.responseValue;
            }
            if (Object.keys(res.responseValue).length === 0) {
              this.routeRes = '';
            }
          }

          
        }
      });
  }

  // Update the Survey Responses
  updateSurveyRes() {
    if (this.dataService.participationType === 'VIRTUAL WALKER' || this.dataService.participationType === 'ONEWALK CREW' || this.dataService.participationType === '15 KM ONEWALK CITY NIGHTS') {
      this.shuttleRes = `I don't need a shuttle`
    }
    if (this.dataService.participationType === 'VIRTUAL WALKER' || this.dataService.participationType === 'ONEWALK CREW' || this.dataService.participationType === '15 KM ONEWALK CITY NIGHTS') {
      this.shuttleRes2 = `I don't need a shuttle`
    }            

    for (const resp of this.surveyResults.getSurveyResponsesResponse.responses) {

      // Emergency Name
      if (resp.questionId === this.dataService.question4) {
        if (this.cancerRes === undefined) {
          this.emergencyNameRes = resp.responseValue;
        }
      }

      // Emergency Number
      if (resp.questionId === this.dataService.question5) {
        if (this.cancerRes === undefined) {
          this.emergencyPhoneRes = resp.responseValue;
        }
      }

      // Cancer Survivor
      if (resp.questionId === this.dataService.question14) {
        if (this.cancerRes === undefined) {
          this.cancerRes = resp.responseValue;
        }
      }

      // Physical Ailment
      if (resp.questionId === this.dataService.question13) {
        if (this.physicalRes === undefined) {
          this.physicalRes = resp.responseValue;
        }
      }

      // Vegetarian Meals
      if (resp.questionId === this.dataService.question15) {
        if (this.vegRes === undefined) {
          this.vegRes = resp.responseValue;
        }
      }

      // How many years have you ridden with The Ride?
      if (resp.questionId === this.dataService.question1) {
        if (this.attendanceRes === undefined || this.attendanceRes === null) {
          this.attendanceRes = resp.responseValue;
        }
      }

      // Jersey Selection
      // if (resp.questionId === this.dataService.question18) {
      //   if (this.jerseyRes === undefined || this.jerseyRes === null) {
      //     this.jerseyRes = resp.responseValue;
      //   }
      // }

      // Shuttle 1 Selection
      if (resp.questionId === this.dataService.question19) {
        if (this.shuttleRes === undefined || this.shuttleRes === null) {
          this.shuttleRes = resp.responseValue;
        }
      }

      // Shuttle 2 Selection
      if (resp.questionId === this.dataService.question20) {
        if (this.shuttleRes2 === undefined || this.shuttleRes2 === null) {
          this.shuttleRes2 = resp.responseValue;
        }
      }

    }

    if ( this.emergencyNameRes === undefined || this.emergencyNameRes === null || this.emergencyNameRes.length < 5 ) {
      this.Error = true;
    } else {
      this.Error = false;
    }
    if ( this.emergencyPhoneRes === undefined || this.emergencyPhoneRes === null || this.emergencyPhoneRes.length === 0 ) {
      this.Error2 = true;
    } else {
      this.Error2 = false;
    }
    if ( this.attendanceRes === undefined || this.attendanceRes === null || this.attendanceRes.length === 0 ) {
      this.Error3 = true;
    } else {
      this.Error3 = false;
    }
    // if ( this.jerseyRes === undefined || this.jerseyRes === null || this.jerseyRes.length === 0 ) {
    //   this.Error4 = true;
    // } else {
    //   this.Error4 = false;
    // }
    if ( this.cancerRes === undefined || this.cancerRes === null || this.cancerRes.length === 0 ) {
      this.Error4 = true;
    } else {
      this.Error4 = false;
    }
    if ( this.physicalRes === undefined || this.physicalRes === null || this.physicalRes.length === 0 ) {
      this.Error5 = true;
    } else {
      this.Error5 = false;
    }
    if ( this.vegRes === undefined || this.vegRes === null || this.vegRes.length === 0 ) {
      this.Error6 = true;
    } else {
      this.Error6 = false;
    }
    // if ( this.routeRes === undefined || this.routeRes === null || this.routeRes.length === 0 ) {
    //   this.Error7 = true;
    // } else {
    //   this.Error7 = false;
    // }
    if ( this.shuttleRes === undefined || this.shuttleRes === null || this.shuttleRes.length === 0 ) {
      this.Error8 = true;
    } else {
      this.Error8 = false;
    }
    if ( this.shuttleRes2 === undefined || this.shuttleRes2 === null || this.shuttleRes2.length === 0 ) {
      this.Error9 = true;
    } else {
      this.Error9 = false;
    }

    const updateSurveyResponsesUrl = 'https://secure.weekendtoconquercancer.ca/site/CRTeamraiserAPI?method=updateSurveyResponses&api_' +
        'key=cfowca&v=1.0&response_format=json&fr_id=' + this.dataService.eventID + '&survey_id=' + this.dataService.surveyID;

    const question_ename = '&question_' + this.dataService.question4 + '=' + this.emergencyNameRes;
    const question_enum = '&question_' + this.dataService.question5 + '=' + this.emergencyPhoneRes;
    const question_attendance = '&question_' + this.dataService.question1 + '=' + this.attendanceRes;
    const question_cancer = '&question_' + this.dataService.question14 + '=' + this.cancerRes;
    const question_physical = '&question_' + this.dataService.question13 + '=' + this.physicalRes;
    const question_veg = '&question_' + this.dataService.question15 + '=' + this.vegRes;
    const question_route = '&question_' + this.dataService.question29 + '=' + this.routeRes;
    const question_shuttle1 = '&question_' + this.dataService.question19 + '=' + this.shuttleRes;
    const question_shuttle2 = '&question_' + this.dataService.question20 + '=' + this.shuttleRes2;

    // this
    //   .http
    //   .post(updateSurveyResponsesUrl + question_attendance + question_cancer + question_veg + question_route + question_shuttle1 + question_shuttle2 + '&sso_auth_token=' + this.dataService.ssoToken, null)


    if ( !this.Error && !this.Error2 && !this.Error3 && !this.Error4 && !this.Error5 && !this.Error6 && !this.Error8 && !this.Error9) {
      // console.log('test Validate Lock');

      this
      .http
      .post(updateSurveyResponsesUrl + question_attendance + question_cancer + question_veg + question_route + question_shuttle1 + question_shuttle2 + '&sso_auth_token=' + this.dataService.ssoToken, null)

      // this.http.post(this.dataService.apiBase + 'updateSurvey', {surveyId: this.dataService.surveyID, eventId: this.dataService.eventID, emname: this.emergencyNameRes, emnum: this.emergencyPhoneRes, year: this.attendanceRes, cancer: this.cancerRes, physical: this.physicalRes, veg: this.vegRes, shuttle1: this.shuttleRes, shuttle2: this.shuttleRes2, token: this.dataService.storageToken})

      .subscribe(res => {
        // console.log(res);
        this.updateReg();
        this
          .route
          .navigate(['/step-05']);
      }, (error) => {
        console.log(error);
        this
          .route
          .navigate(['/step-01']);
      });
    }
    
  }

  // Save Current Survey Answers (save for later)
  saveSurveyRes() {

    // Checking to see if data in the input is null or undefined, if so send as
    // blank (to prevent errors in survey)
    if (this.emergencyNameRes === null || undefined) {
      this.emergencyNameRes = '';
    }

    if (this.emergencyPhoneRes === null || undefined) {
      this.emergencyPhoneRes = '';
    }

    if (this.routeRes === '[object Object]') {
      this.routeRes = '';
    }

    if (this.dataService.participationType === 'VIRTUAL WALKER' || this.dataService.participationType === 'ONEWALK CREW' || this.dataService.participationType === '15 KM ONEWALK CITY NIGHTS') {
      this.shuttleRes = `I don't need a shuttle`
    }

    if (this.dataService.participationType === 'VIRTUAL WALKER' || this.dataService.participationType === 'ONEWALK CREW' || this.dataService.participationType === '15 KM ONEWALK CITY NIGHTS') {
      this.shuttleRes2 = `I don't need a shuttle`
    }


    const updateSurveyResponsesUrl = 'https://secure.weekendtoconquercancer.ca/site/CRTeamraiserAPI?method=updateSurveyResponses&api_' +
        'key=cfowca&v=1.0&response_format=json&fr_id=' + this.dataService.eventID + '&survey_id=' + this.dataService.surveyID;


    const question_emname = '&question_' + this.dataService.question4 + '=' + this.emergencyNameRes;
    const question_emnum = '&question_' + this.dataService.question5 + '=' + this.emergencyPhoneRes;
    const question_attendance = '&question_' + this.dataService.question1 + '=' + this.attendanceRes;
    const question_cancer = '&question_' + this.dataService.question14 + '=' + this.cancerRes;
    const question_physical = '&question_' + this.dataService.question13 + '=' + this.physicalRes;
    const question_veg = '&question_' + this.dataService.question15 + '=' + this.vegRes;
    const question_route = '&question_' + this.dataService.question29 + '=' + this.routeRes;
    const question_shuttle1 = '&question_' + this.dataService.question19 + '=' + this.shuttleRes;
    const question_shuttle2 = '&question_' + this.dataService.question20 + '=' + this.shuttleRes2;

    this
      .http
      .post(updateSurveyResponsesUrl + question_attendance + question_cancer + question_veg + question_route + question_shuttle1 + question_shuttle2 + '&sso_auth_token=' + this.dataService.ssoToken, null)

    // this.http.post(this.dataService.apiBase + 'misc', {url: updateSurveyResponsesUrl + question_ename + question_enum + question_attendance + question_cancer + question_veg + question_route + question_shuttle1 + question_shuttle2 + '&sso_auth_token=' + this.dataService.ssoToken})
    
    // this.http.post(this.dataService.apiBase + 'updateSurvey', {surveyId: this.dataService.surveyID, eventId: this.dataService.eventID, emname: this.emergencyNameRes, emnum: this.emergencyPhoneRes, year: this.attendanceRes, cancer: this.cancerRes, physical: this.physicalRes, veg: this.vegRes, shuttle1: this.shuttleRes, shuttle2: this.shuttleRes2, token: this.dataService.storageToken})

      .subscribe(res => {
        this.saveUpdateReg();
      }, (error) => {
        console.log(error);
        this
          .snackBar
          .open('There was an error while trying to save. Please check the form.', 'Close', {
            duration: 3500,
            panelClass: ['error-info']
          });
        this
          .route
          .navigate(['/step-01']);
      });
  }

  // Update the Registration Information
  updateReg() {
    if (this.emergencyNameRes === null || undefined) {
      this.emergencyNameRes = '';
    }

    if (this.emergencyPhoneRes === null || undefined) {
      this.emergencyPhoneRes = '';
    }

    this.flowStep = '4';

    const paidStatus = this.dataService.checkInStatus === 'Paid';
    const completeStatus = this.dataService.checkInStatus === 'Complete';
    const committedStatus = this.dataService.checkInStatus === 'Committed';

    
    if (paidStatus || completeStatus || committedStatus) {
      this.method = 'CRTeamraiserAPI?method=updateRegistration&api_key=cfowca&v=1.0&fr_id=' + this.dataService.eventID + '&sso_auth_token=' + this.dataService.ssoToken + '&checkin_status=' + this.dataService.checkInStatus + '&flow_step=' + this.flowStep + '&emergency_name=' + this.emergencyNameRes + '&emergency_phone=' + this.emergencyPhoneRes + '&response_format=json';
      
    } else {
      this.method = 'CRTeamraiserAPI?method=updateRegistration&api_key=cfowca&v=1.0&fr_id=' + this.dataService.eventID + '&sso_auth_token=' + this.dataService.ssoToken + '&flow_step=' + this.flowStep + '&emergency_name=' + this.emergencyNameRes + '&emergency_phone=' + this.emergencyPhoneRes + '&response_format=json';
    }

    this
      .http
      .post(this.dataService.convioURL + this.method, null)
    // this.http.post(this.dataService.apiBase + 'misc', {url: this.dataService.convioURL + this.method})
      .subscribe(res => {
        this
          .snackBar
          .open('Your information has been saved!', 'Close', {
            duration: 3500,
            panelClass: ['saved-info']
          });
      }, (error) => {
        if (error) {
          this
            .snackBar
            .open('Sorry, there was an error, please try again.', 'Close', {
              duration: 3500,
              panelClass: ['error-info']
            });
        }
      });
  }

  // Update the Registration Information
  saveUpdateReg() {
    if (this.emergencyNameRes === null || undefined) {
      this.emergencyNameRes = '';
    }

    if (this.emergencyPhoneRes === null || undefined) {
      this.emergencyPhoneRes = '';
    }

    this.flowStep = '2';

    const paidStatus = this.dataService.checkInStatus === 'Paid';
    const completeStatus = this.dataService.checkInStatus === 'Complete';
    const committedStatus = this.dataService.checkInStatus === 'Committed';

    if (paidStatus || completeStatus || committedStatus) {
      this.method = 'CRTeamraiserAPI?method=updateRegistration&api_key=cfowca&v=1.0&fr_id=' + this.dataService.eventID + '&sso_auth_token=' + this.dataService.storageToken + '&checkin_status=' + this.dataService.checkInStatus + '&flow_step=' + this.flowStep + '&emergency_name=' + this.emergencyNameRes + '&emergency_phone=' + this.emergencyPhoneRes + '&response_format=json';
    } else {
      this.method = 'CRTeamraiserAPI?method=updateRegistration&api_key=cfowca&v=1.0&fr_id=' + this.dataService.eventID + '&sso_auth_token=' + this.dataService.storageToken + '&flow_step=' + this.flowStep + '&emergency_name=' + this.emergencyNameRes + '&emergency_phone=' + this.emergencyPhoneRes + '&response_format=json';
    }

    this
      .http
      .post(this.dataService.convioURL + this.method, null)
    // this.http.post(this.dataService.apiBase + 'misc', {url: this.dataService.convioURL + this.method})
      .subscribe(res => {
        this
          .snackBar
          .open('Your information has been saved!', 'Close', {
            duration: 3500,
            panelClass: ['saved-info']
          });
      }, (error) => {
        if (error) {
          this
            .snackBar
            .open('Sorry, there was an error, please try again.', 'Close', {
              duration: 3500,
              panelClass: ['error-info']
            });
        }
      });
  }

  // Get the current Flowstep
  getFlowStep() {
    const token = localStorage.getItem('token');
    this.method = 'CRTeamraiserAPI?method=getFlowStep&api_key=cfowca&v=1.0&response_format=json&fr_' +
        'id=' + this.dataService.eventID + '&sso_auth_token=' + token;
    this
      .http
      .post(this.dataService.convioURL + this.method, null)
    // this.http.post(this.dataService.apiBase + 'step', {eventId: this.dataService.eventID, token:token})
      .subscribe(res => {
        this.flowStepResults = res;
        this.getFlowStepNumber = this.flowStepResults.getFlowStepResponse.flowStep;

        // Checking the participants flow step to prevent user from skipping a flowstep
        if (this.getFlowStepNumber === this.flowStep) {
          // If the flow step matches to where they are supposed to be, then run the
          // functions for the page below
          this
            .dataService
            .getRegInfo();
          this.getSurveyRes();

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
        // console.log(err);
        this
          .snackBar
          .open('There was an error, please login again.', 'Close', {
            duration: 3500,
            panelClass: ['error-info']
          });
        this
          .dataService
          .logOut();
      });
  }

  // Update the current Flowstep
  previousFlowStep() {
    // this.flowStep = '1';

    const paidStatus = this.dataService.checkInStatus === 'Paid';
    const completeStatus = this.dataService.checkInStatus === 'Complete';
    const committedStatus = this.dataService.checkInStatus === 'Committed';

    if (paidStatus || completeStatus || committedStatus) {
      this.dataService.method = 'CRTeamraiserAPI?method=updateRegistration&api_key=cfowca&v=1.0&fr_id=' + this.dataService.eventID + '&sso_auth_token=' + this.dataService.ssoToken + '&checkin_status=' + this.dataService.checkInStatus + '&flow_step=1&response_format=json';
    } else {
      this.dataService.method = 'CRTeamraiserAPI?method=updateRegistration&api_key=cfowca&v=1.0&fr_id=' + this.dataService.eventID + '&sso_auth_token=' + this.dataService.ssoToken + '&flow_step=1&response_format=json';
    }

    this
      .http
      .post(this.dataService.convioURL + this.dataService.method, null)
    // this.http.post(this.dataService.apiBase + 'misc', {url: this.dataService.convioURL + this.dataService.method})
      .subscribe(res => {
        // console.log('Flow step updated.')
        this
          .route
          .navigate(['/step-02']);
      }, (err) => {
        if (err) {
          this
            .snackBar
            .open('There was an unknown error.', 'Close', {
              duration: 3500,
              panelClass: ['error-info']
            });
          this
            .dataService
            .logOut();
        }
      });
  }

}
