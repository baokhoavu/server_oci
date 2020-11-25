import {Component, OnInit, OnDestroy, Inject, AfterViewInit} from '@angular/core';

/* FormGroup and Validators */
import {FormGroup, FormControl, FormGroupDirective, NgForm, Validators} from '@angular/forms';

/* Router */
import {Router} from '@angular/router';

/* HTTP Client */
import {HttpClient, HttpRequest, HttpEvent, HttpEventType} from '@angular/common/http';

/* Angular Material Compnents */
import {ErrorStateMatcher} from '@angular/material/core';
import {MatSnackBar, MatDialog, MatDialogRef, MAT_DIALOG_DATA} from '@angular/material';

/* Data Service */
import {DataService} from '../data.service';

/** Error when invalid control is dirty, touched, or submitted. */
export class MyErrorStateMatcher implements ErrorStateMatcher {
  isErrorState(control : FormControl | null, form : FormGroupDirective | NgForm | null) : boolean {
    const isSubmitted = form;
    return !!(control && control.invalid && (control.dirty || control.touched || isSubmitted));
  }
}

@Component({selector: 'app-step-02', templateUrl: './step-02.component.html', styleUrls: ['./step-02.component.scss']})
export class Step02Component implements OnInit,
OnDestroy,
AfterViewInit {

  step02Form : FormGroup;

  matcher = new MyErrorStateMatcher();

  // Variables
  updateRegRes : any = {};
  flowStep = '1';
  method : string;
  checkInStatus = 'started';

  firstName : string;
  lastName : string;
  primaryAddress1 : string;
  primaryAddress2 : string;
  primaryCity : string;
  primaryState : string;
  primaryZip : string;
  gender : string;

  Error: boolean = false;
  Error2: boolean = false;
  Error3: boolean = false;
  Error4: boolean = false;
  Error5: boolean = false;
  Error6: boolean = false;
  Error7: boolean = false;

  // Flowstep
  flowStepResults : any = {};
  getFlowStepNumber : string;

  hasPhoto: boolean = false;
  personalPhotoInfo: any = {};
  personalPhotoUrl: string;

  // Gender select
  genderSelecter = [
    {value: 'MALE', viewValue: 'Male'}, 
    {value: 'FEMALE', viewValue: 'Female'},
    {value: 'Prefer not to say', viewValue: 'Prefer not to say' }
  ];

  surveyResults : any = {};
  // Gender
  // genderRes : string;

  // Setting a variable for getUserInfo()'s response as any Object
  consData : any = {};

  updateUserResults : any = {};

  // Variable for Timeout
  timeOut : any;
  timeOut2 : any;

  // Invalidator
  invalidOnLoad = false;

  constructor(public dataService : DataService, private router : Router, private http : HttpClient, public snackBar : MatSnackBar, public dialog : MatDialog) {

    if (this.primaryAddress2 === null) {
      this.primaryAddress2 = '';
    }
  }

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

    // Checking logged in state, if they are logged in run regInfo() and
    // getUserInfo() functions from the global dataService.
    if (this.dataService.isLoggedIn() === true && this.dataService.tokenExpired === false) {
      // console.log('You are logged in!');

      this.getFlowStep();

      // this.getSurveyRes();
      this.getRegInfo();
      this.getUserInfo();
      this.getSurveyGender();
      this.getPersonalPhoto();

      // Open welcome dialog / modal if logged in and in correct route
      if (this.router.url === '/step-02') {
        this.openDialog();
      }

      // this.updateCheckInStatus();

    } else if (this.dataService.storageToken === undefined) {
      // console.log('Auth Token Expired.');
      this
        .snackBar
        .open('Login session expired, please login again.', 'Close', {
          duration: 3500,
          panelClass: ['error-info']
        });

      this
        .router
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
        .router
        .navigate(['/step-01']);
    }

    if (this.consData.getConsResponse) {

      if (this.firstName === undefined || null) {
        this.firstName = this.consData.getConsResponse.name.first;
      }

      if (this.lastName === undefined || null) {
        this.lastName = this.consData.getConsResponse.name.last;
      }

      if (this.primaryAddress1 === undefined || null) {
        this.primaryAddress1 = this.consData.getConsResponse.primary_address.street1;
      }

      if (this.primaryAddress2 === undefined || null) {
        this.primaryAddress2 = this.consData.getConsResponse.primary_address.street2;
      }

      if (this.primaryAddress2 === undefined || null) {
        this.primaryAddress2 = this.consData.getConsResponse.primary_address.street2;
      }

    }

    this.step02Form = new FormGroup({
      firstName: new FormControl(this.firstName, Validators.required),
      lastName: new FormControl(this.lastName, Validators.required),
      liveAddress1: new FormControl(this.primaryAddress1, Validators.required),
      liveAddress2: new FormControl(this.primaryAddress2),
      liveCity: new FormControl(this.primaryCity, Validators.required),
      liveState: new FormControl(this.primaryState, Validators.required),
      liveZip: new FormControl(this.primaryZip, Validators.required),
      genderSelect: new FormControl(this.gender, Validators.required)
    });

    if (this.step02Form.controls.firstName.invalid) {
      // console.log('Form invalid'); console.log(this.step02Form.controls);
      this.invalidOnLoad = true;
    }

  }

  // Clear the timeout function upon entering a new route
  ngOnDestroy() {
    clearTimeout(this.timeOut);
  }

  ngAfterViewInit() {
    // console.log(this.step02Form);
  }

  // Update the checkInStatus from Registration
  updateCheckInStatus() {
    this.method = 'CRTeamraiserAPI?method=updateRegistration&api_key=cfowca&v=1.0&fr_id=' + this.dataService.eventID + '&sso_auth_token=' + this.dataService.ssoToken + '&checkin_status=' + this.checkInStatus + '&response_format=json';
    
    this.http.post(this.dataService.convioURL + this.method, null)

    // this.http.post(this.dataService.apiBase + 'updateStep', {eventId: this.dataService.eventID, token: this.dataService.ssoToken, status: this.checkInStatus, step:''})
      .subscribe(res => {
        this.updateRegRes = res;
      });
  }

  // Gather Registration Information
  getRegInfo() {
    this.dataService.storageToken = localStorage.getItem('token');
    this.method = 'CRTeamraiserAPI?method=getRegistration&api_key=cfowca&v=1.0&response_format=json' +
        '&fr_id=' + this.dataService.eventID + '&sso_auth_token=' + this.dataService.storageToken;
    
    this.http.post(this.dataService.convioURL + this.method, null)

    // this.http.post(this.dataService.apiBase + 'regInfo', {eventId: this.dataService.eventID, token:this.dataService.storageToken})
      .subscribe(res => {
        this.dataService.regResponse = res;
        // console.log(this.dataService.regResponse); Setting the participation ID
        // Variables
        this.dataService.participationID = this.dataService.regResponse.getRegistrationResponse.registration.participationTypeId;
        localStorage.setItem('participationID', this.dataService.participationID);
        this.dataService.storageParticipationID = localStorage.getItem('participationID');

        // Setting the Emergency Name and Number Variables
        this.dataService.emergencyName = this.dataService.regResponse.getRegistrationResponse.registration.emergencyName;
        this.dataService.emergencyPhone = this.dataService.regResponse.getRegistrationResponse.registration.emergencyPhone;

        this
          .dataService
          .getParticipationType();

        // If participant is in a team, get the team information
        if (this.dataService.regResponse.getRegistrationResponse.registration.teamId > 0) {
          this
            .dataService
            .getTeam();
        }
      }, (err) => {
        console.log(err);
        this.dataService.tokenExpired = true;
        localStorage.clear();
        this
          .router
          .navigate(['/step-01']);
      });
  }

  // Gather Constituent Information
  getUserInfo() {
    this.dataService.storageToken = localStorage.getItem('token');
    this.method = 'CRConsAPI?method=getUser&api_key=cfowca&v=1.0&response_format=json&cons_id=' + this.dataService.storageConsID + '&sso_auth_token=' + this.dataService.storageToken;
    
    this.http.post(this.dataService.convioURL + this.method, null)

    // this.http.post(this.dataService.apiBase + 'userInfo', {consId: this.dataService.storageConsID, token:this.dataService.storageToken})
      .subscribe(res => {
        this.consData = res;
        console.log(this.consData);         
        this.firstName = this.consData.getConsResponse.name.first;
        this.lastName = this.consData.getConsResponse.name.last;
        this.primaryAddress1 = this.consData.getConsResponse.primary_address.street1;
        this.primaryAddress2 = this.consData.getConsResponse.primary_address.street2;
        this.primaryCity = this.consData.getConsResponse.primary_address.city;
        this.primaryState = this.consData.getConsResponse.primary_address.state;
        this.primaryZip = this.consData.getConsResponse.primary_address.zip;
        this.dataService.consUserName = this.consData.getConsResponse.user_name;

        // console.log(this.consData);
      }, (err) => {
        // console.log('There was an error getting the Cons Info:');
        console.log(err);
      });
  }
  
  getSurveyGender() {

    this.method = 'CRTeamraiserAPI?method=getSurveyResponses&api_key=cfowca&v=1.0&fr_id=' + this.dataService.eventID + '&sso_auth_token=' + this.dataService.ssoToken + '&survey_id=' + this.dataService.surveyID + '&response_format=json';

    this.http.post(this.dataService.convioURL + this.method, null)

    // this.http.post(this.dataService.apiBase + 'getSurvey', {eventId:this.dataService.eventID, surveyId:this.dataService.surveyID, token: this.dataService.ssoToken })
      .subscribe(res => {
        this.surveyResults = res;        
        
        for (let res of this.surveyResults.getSurveyResponsesResponse.responses) {

          // Shuttle 1 Selection
          if (res.questionId === this.dataService.question7) {            
            if (typeof res.responseValue  === 'object') {
               this.gender = '';
            } else if (typeof res.responseValue !== 'object' || res.responseValue.length >= 1) {
               this.gender = res.responseValue;
            }
          }
        }
      });
  }

  updateSurveyGender() {
    
    const updateSurveyResponsesUrl = 'https://secure.weekendtoconquercancer.ca/site/CRTeamraiserAPI?method=updateSurveyResponses&api_' +
        'key=cfowca&v=1.0&response_format=json&fr_id=' + this.dataService.eventID + '&survey_id=' + this.dataService.surveyID;

    const question_gender = '&question_' + this.dataService.question7 + '=' + this.gender;

    this.http.post(this.dataService.convioURL + this.method + question_gender, null)
    // this.http.post(this.dataService.apiBase + 'misc', {url: updateSurveyResponsesUrl + question_gender + '&sso_auth_token=' + this.dataService.ssoToken})
      .subscribe(res => {

      }, (error) => {
        console.log(error);
        
      });

  }

  // Update Constituent Information
  updateUser() {

    if ( this.firstName === undefined || this.firstName === null || this.firstName.length === 0 ) {
      this.Error = true;
    } else {
      this.Error = false;
    }
    if ( this.lastName === undefined || this.lastName === null || this.lastName.length === 0 ) {
      this.Error2 = true;
    } else {
      this.Error2 = false;
    }
    if ( this.primaryAddress1 === undefined || this.primaryAddress1 === null || this.primaryAddress1.length === 0 ) {
      this.Error3 = true;
    } else {
      this.Error3 = false;
    }
    if ( this.primaryCity === undefined || this.primaryCity === null || this.primaryCity.length === 0 ) {
      this.Error4 = true;
    } else {
      this.Error4 = false;
    }
    if ( this.primaryState === undefined || this.primaryState === null || this.primaryState.length === 0 ) {
      this.Error5 = true;
    } else {
      this.Error5 = false;
    }
    if ( this.primaryZip === undefined || this.primaryZip === null || this.primaryZip.length === 0 ) {
      this.Error6 = true;
    } else {
      this.Error6 = false;
    }
    if ( this.gender === undefined || this.gender === null || this.gender.length === 0 || this.gender === 'undefined' || this.gender === 'User Provided No Response' ) {
      this.Error7 = true;
    } else {
      this.Error7 = false;
    }

    if (this.primaryAddress2 === null) {
      this.primaryAddress2 = '';
    }

    const consUrl = '&cons_id=' + this.dataService.storageConsID;
    const ssoUrl = '&sso_auth_token=' + this.dataService.storageToken;
    const firstNameUrl = '&name.first=' + this.firstName;
    const lastNameUrl = '&name.last=' + this.lastName;
    const address1Url = '&primary_address.street1=' + this.primaryAddress1;
    const address2Url = '&primary_address.street2=' + this.primaryAddress2;
    const cityUrl = '&primary_address.city=' + this.primaryCity;
    const stateUrl = '&primary_address.state=' + this.primaryState;
    const zipUrl = '&primary_address.zip=' + this.primaryZip;

    this.method = 'CRConsAPI?method=update&api_key=cfowca&v=1.0&response_format=json' + consUrl + ssoUrl + firstNameUrl + lastNameUrl + address1Url + address2Url + cityUrl + stateUrl + zipUrl;

    
    if ( !this.Error && !this.Error2 && !this.Error3 && !this.Error4 && !this.Error5 && !this.Error6 && !this.Error7) {      

      this.http.post(this.dataService.convioURL + this.method, null)
      
      // this.http.post(this.dataService.apiBase + 'updateCons', {consId: this.dataService.storageConsID, token: this.dataService.storageToken, first: this.firstName, last: this.lastName, address1: this.primaryAddress1, address2: this.primaryAddress2, city: this.primaryCity, state: this.primaryState, zip: this.primaryZip})
        .subscribe(res => {
          this.updateUserResults = res;
          this.updateSurveyGender();
          this.updateFlowStepNext();
          // this.router.navigate(['/step-03']);
        }, (err) => {
          // console.log('There was an error getting the Participation Info:');
          console.log(err);
        });
    }
  }

  // Get Photo if exist
  getPersonalPhoto() {
    
    const consId = '&cons_id=' + this.dataService.storageConsID;

    this.method = 'CRTeamraiserAPI?method=getPersonalPhotos&api_key=cfowca&v=1.0&response_format=json' + consId + '&fr_id=' + this.dataService.eventID;
    
    this.http.post(this.dataService.convioURL + this.method, null)

    // this.http.post(this.dataService.apiBase + 'photoInfo', {consId: this.dataService.storageConsID, eventId: this.dataService.eventID})
      .subscribe(res => {
        // console.log(res);
        this.personalPhotoInfo = res;
        // console.log(this.personalPhotoInfo);

        if (this.personalPhotoInfo.getPersonalPhotosResponse.photoItem[0].customUrl = '../images/friendraiser_uploads/1895368406.custom.jpg') {
          this.hasPhoto = false;
        } else {
          this.hasPhoto = true;
          this.personalPhotoUrl = this.personalPhotoInfo.getPersonalPhotosResponse.photoItem[0].customUrl.replace('..', 'https://secure.weekendtoconquercancer.ca');
        }

      }, (err) => {
        console.log('There was an error getting the photo:');
        console.log(err);
      });
  }

  // Save Constituent Information
  updateUserSave() {

    if (this.primaryAddress2 === null) {
      this.primaryAddress2 = '';
    }

    const consUrl = '&cons_id=' + this.dataService.storageConsID;
    const ssoUrl = '&sso_auth_token=' + this.dataService.storageToken;
    const firstNameUrl = '&name.first=' + this.firstName;
    const lastNameUrl = '&name.last=' + this.lastName;
    const address1Url = '&primary_address.street1=' + this.primaryAddress1;
    const address2Url = '&primary_address.street2=' + this.primaryAddress2;
    const cityUrl = '&primary_address.city=' + this.primaryCity;
    const stateUrl = '&primary_address.state=' + this.primaryState;
    const zipUrl = '&primary_address.zip=' + this.primaryZip;
    // const genderUrl = '&gender=' + this.gender;

    this.method = 'CRConsAPI?method=update&api_key=cfowca&v=1.0&response_format=json' + consUrl + ssoUrl + firstNameUrl + lastNameUrl + address1Url + address2Url + cityUrl + stateUrl + zipUrl;
    
    this.http.post(this.dataService.convioURL + this.method, null)

    // this.http.post(this.dataService.apiBase + 'updateCons', {consId: this.dataService.storageConsID, token: this.dataService.storageToken, first: this.firstName, last: this.lastName, address1: this.primaryAddress1, address2: this.primaryAddress2, city: this.primaryCity, state: this.primaryState, zip: this.primaryZip})
      .subscribe(res => {
        this.updateUserResults = res;
        this.updateSurveyGender();
        // console.log(this.updateUserResults);

        this
          .snackBar
          .open('Your information has been saved!', 'Close', {
            duration: 3500,
            panelClass: ['saved-info']
          });

      }, (err) => {
        if (err) {
          this
            .snackBar
            .open('There was an error while trying to save. Please check the form.', 'Close', {
              duration: 3500,
              panelClass: ['error-info']
            });
        }
      });
  }

  // Check Logged In State
  isLoggedIn() {
    return this
      .dataService
      .isLoggedIn();
  }

  // Get the current Flowstep
  getFlowStep() {
    const token = localStorage.getItem('token');
    this.method = 'CRTeamraiserAPI?method=getFlowStep&api_key=cfowca&v=1.0&response_format=json&fr_' +
        'id=' + this.dataService.eventID + '&sso_auth_token=' + token;
    
    this.http.post(this.dataService.convioURL + this.method, null)

    // this.http.post(this.dataService.apiBase + 'step', {eventId: this.dataService.eventID, token: token})
      .subscribe(res => {
        this.flowStepResults = res;
        this.getFlowStepNumber = this.flowStepResults.getFlowStepResponse.flowStep;

        // console.log(this.getFlowStepNumber); Checking the participants flow step to
        // prevent user from skipping a flowstep
        if (this.getFlowStepNumber !== this.flowStep) {

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
              .router
              .navigate(['/step-02']);
          }
          if (this.getFlowStepNumber === '1') {
            this
              .router
              .navigate(['/step-02']);
          }
          if (this.getFlowStepNumber === '2') {
            this
              .router
              .navigate(['/step-03']);
          }
          if (this.getFlowStepNumber === '3') {
            this
              .router
              .navigate(['/step-04']);
          }
          if (this.getFlowStepNumber === '4') {
            this
              .router
              .navigate(['/step-05']);
          }
          if (this.getFlowStepNumber === '5') {
            this
              .router
              .navigate(['/step-06']);
          }
          if (this.getFlowStepNumber === '6') {
            this
              .router
              .navigate(['/step-07']);
          }
          if (this.getFlowStepNumber === '7') {
            this
              .router
              .navigate(['/step-08']);
          }
          if (this.getFlowStepNumber === '8') {
            
            this
              .router
              .navigate(['/step-08']);
          }
        } else {
          this.getCheckInStatus();
        }

      }, (err) => {
        // console.log(err);
        if (err) {
          this
            .snackBar
            .open('There was an error, please login again.', 'Close', {
              duration: 3500,
              panelClass: ['error-info']
            });
        }

        this
          .dataService
          .logOut();
      });
  }

  // Get user's checkin status
  getCheckInStatus() {
    this.method = 'CRTeamraiserAPI?method=getRegistration&api_key=cfowca&v=1.0&response_format=json' +
        '&fr_id=' + this.dataService.eventID + '&sso_auth_token=' + this.dataService.storageToken;
    
    this.http.post(this.dataService.convioURL + this.method, null)

    // this.http.post(this.dataService.apiBase + 'regInfo', {eventId: this.dataService.eventID, token: this.dataService.storageToken})
      .subscribe(res => {
        // Results from the API Call
        this.dataService.regResponse = res;

        this.dataService.checkInStatus = this.dataService.regResponse.getRegistrationResponse.registration.checkinStatus;

        // console.log(this.dataService.checkInStatus);

        this.updateFlowStep();
      }, (error) => {});
  }
  
  // } Update the Flow Step
  updateFlowStep() {
    if (this.dataService.getCheckInStatus) {
      // console.log(this.dataService.checkInStatus);
    }

    const paidStatus = this.dataService.checkInStatus === 'paid';
    const completeStatus = this.dataService.checkInStatus === 'complete';
    const committedStatus = this.dataService.checkInStatus === 'committed';
    let options:any = {};
    if (paidStatus || completeStatus || committedStatus) {
      options = {
        eventId: this.dataService.eventID,
        token: this.dataService.storageToken,
        status: this.dataService.checkInStatus,
        step: this.flowStep
      }
      // this.dataService.method = 'CRTeamraiserAPI?method=updateRegistration&api_key=cfowca&v=1.0&fr_id=' + this.dataService.eventID + '&sso_auth_token=' + this.dataService.storageToken + '&checkin_status=' + this.dataService.checkInStatus + '&flow_step=' + this.flowStep + '&response_format=json';
      this.dataService.method = 'CRTeamraiserAPI?method=updateRegistration&api_key=cfowca&v=1.0&fr_id=' + this.dataService.eventID + (this.dataService.isManualLogin === true ? '&sso_auth_token=' : '&auth=') + this.dataService.storageToken + '&checkin_status=' + this.dataService.checkInStatus + '&flow_step=2&response_format=json';
    } else {
      options = {
        eventId: this.dataService.eventID,
        token: this.dataService.storageToken,
        status: 'started',
        step: this.flowStep
      }
      // this.dataService.method = 'CRTeamraiserAPI?method=updateRegistration&api_key=cfowca&v=1.0&fr_id=' + this.dataService.eventID + '&sso_auth_token=' + this.dataService.storageToken + '&checkin_status=started&flow_step=' + this.flowStep + '&response_format=json';
      this.dataService.method = 'CRTeamraiserAPI?method=updateRegistration&api_key=cfowca&v=1.0&fr_id=' + this.dataService.eventID + (this.dataService.isManualLogin === true ? '&sso_auth_token=' : '&auth=') + this.dataService.storageToken + '&checkin_status=' + this.dataService.checkInStatus + '&flow_step=2&response_format=json';
    }

    this.http.post(this.dataService.convioURL + this.method, null)
    // this
    //   .http
    //   .post(this.dataService.apiBase + 'updateStep', options)
      .subscribe(res => {
        this.updateRegRes = res;
      });
  }

  updateFlowStepNext() {

    const paidStatus = this.dataService.checkInStatus === 'paid';
    const completeStatus = this.dataService.checkInStatus === 'complete';
    const committedStatus = this.dataService.checkInStatus === 'committed';
    this.flowStep = '2';
    let options:any = {};

    if (paidStatus || completeStatus || committedStatus) {
      options = {
        eventId: this.dataService.eventID,
        token: this.dataService.storageToken,
        status: this.dataService.checkInStatus,
        step: this.flowStep
      }
      // this.dataService.method = 'CRTeamraiserAPI?method=updateRegistration&api_key=cfowca&v=1.0&fr_id=' + this.dataService.eventID + '&sso_auth_token=' + this.dataService.storageToken + '&checkin_status=' + this.dataService.checkInStatus + '&flow_step=2&response_format=json';
      this.dataService.method = 'CRTeamraiserAPI?method=updateRegistration&api_key=cfowca&v=1.0&fr_id=' + this.dataService.eventID + (this.dataService.isManualLogin === true ? '&sso_auth_token=' : '&auth=') + this.dataService.storageToken + '&checkin_status=' + this.dataService.checkInStatus + '&flow_step=2&response_format=json';
    } else {
      options = {
        eventId: this.dataService.eventID,
        token: this.dataService.storageToken,
        status: 'started',
        step: this.flowStep
      }
      // this.dataService.method = 'CRTeamraiserAPI?method=updateRegistration&api_key=cfowca&v=1.0&fr_id=' + this.dataService.eventID + '&sso_auth_token=' + this.dataService.storageToken + '&checkin_status=started&flow_step=2&response_format=json';
      this.dataService.method = 'CRTeamraiserAPI?method=updateRegistration&api_key=cfowca&v=1.0&fr_id=' + this.dataService.eventID + (this.dataService.isManualLogin === true ? '&sso_auth_token=' : '&auth=') + this.dataService.storageToken + '&checkin_status=' + this.dataService.checkInStatus + '&flow_step=2&response_format=json';
    }

    this.http.post(this.dataService.convioURL + this.method, null)
    // this
    //   .http
    //   .post(this.dataService.apiBase + 'updateStep', options)
      .subscribe((res) => {
        this.updateRegRes = res;
        this
          .router
          .navigate(['/step-03']);
      }, (err) => {
        if (err) {
          this
            .snackBar
            .open('There was an error, please login again.', 'Close', {
              duration: 3500,
              panelClass: ['error-info']
            });
          this
            .dataService
            .logOut();
        }
      });
  }

  openDialog() {
    this
      .dialog
      .open(Step02DialogComponent, {width: '600px'});
  }
}

@Component({selector: 'app-step-02-dialog', templateUrl: './step-02-dialog.html', styleUrls: ['./step-02.component.scss']})
export class Step02DialogComponent {
  firstName : string;
  constructor(@Inject(MAT_DIALOG_DATA)public data : any, public dialogRef : MatDialogRef < Step02DialogComponent >, public dataService : DataService) {
    dataService.getUserInfo();
    this.firstName = dataService.firstName;
  }
  onNoClick() : void {
    this
      .dialogRef
      .close();
  }
}
