import { HttpClient } from '@angular/common/http';
import { MatSnackBar } from '@angular/material';
import { Router } from '@angular/router';
import {Injectable, OnInit} from '@angular/core';

@Injectable()

export class DataService implements OnInit {
  /* ============  Global Variables Below ============*/

  /** Api base */
  apiBase:string = '/api/';

  // Event ID
  eventID: any = '1160';

  // Survey ID
  surveyID: any = '4026';

  // Survey Question ID(s) - below insert the Survey Question IDs
  question1 = '5005'; // How many years have you Walked?
  question2 = '5006'; // Waiver and Release Full Name
  question3 = '5007'; // 18 Years Check Box

  question4 = '5008'; // Health Insurance Company name
  question5 = '5009'; // Health Insurance Policy Number

  question6 = '5010'; // Accepted Upsell Offer
  question7 = '5347'; // Gender

  question8 = '5353'; // Emergency Name
  question9 = '5354'; // Emergency Number

  question13 = '5355'; // Physical Ailment
  question14 = '5013'; // Cancer
  question15 = '5014'; // Vegetarian

  question16 = '5015'; // Hidden Upsell Value
  question17 = '5016'; // Safety Video Watched

  question18 = '5348'; // Jersey 

  question19 = '5345'; // Shuttle Question 1
  question20 = '5346'; // Shuttle Question 2

  question21 = '5356'; // Packet Pickup

  question29 = '5351'; // Route

  // Additional Questions
  question30 = ''; // Gender Selection

  // Upsell IDs
  hiddenUpsellID = '1061'; // Upsell ID #1 copied from Teamraiser - $15
  hiddenUpsellID2 = '1062'; // Upsell ID #2 copied from Teamraiser - $150
  // hiddenUpsellID2 = '1443'; // Upsell ID #3 copied from Teamraiser - $250

  // Safety Video
  safetyVidURL = 'assets/videos/19OWTO-SAFETY-WEB.mp4';
  safetyVidWebmURL = 'assets/videos/19OWTO-SAFETY-WEB_1.webm';

  // Login Information
  username: string;
  password: string;

  loginErr: boolean;

  // API Call Information
  convioURL = 'https://secure.weekendtoconquercancer.ca/site/';
  loginMethod: string;
  method: string;

  // Setting logged in state (must be false initially)
  isloggedIn: any = false;

  // Registration Variables
  regResponse: any = {};
  checkInStatus: string;

  // Setting flow step state
  flowStepResults: any = {};
  flowStep: any;

  // Results from API Call
  loginRes: any = {};
  // Login Test
  loginTestRes: any = {};

  // Results from getSurveyRes
  surveyResults: any = {};

  // Sign-on Token
  ssoToken: any = localStorage.getItem('token');
  storageToken: string = localStorage.getItem('token');
  tokenExpired: boolean;

  // Used to check if visitor logged in manually or had their session carried over from a prior login on the LO platform (must be true initially)
  isManualLogin: any = true;

  // Constituent Information
  consID: any;
  storageConsID: any;
  getConsInfo: any;

  consUserName: string;
  firstName: string;
  lastName: string;
  primaryAddress1: string;
  primaryAddress2: string;
  primaryCity: string;
  primaryState: string;
  primaryZip: string;
  gender: string;

  emergencyName: string;
  emergencyPhone: string;

  // Participation Type
  participationID: string;
  storageParticipationID: string;
  participationRes: any;
  participationType: string;

  // Team
  getTeamRes: any = {};
  teamName: string;
  teamExist = false;

  show = true;

  // Tentmate Status Variable
  tentStatus: string;

  constructor(private http: HttpClient, private router: Router, public snackBar: MatSnackBar) {

    if (localStorage.getItem('token') !== undefined || null) {
      this.tokenExpired = false;
    }
    // If user's logged in state returns true set login state, and add constiuent ID from the the local storage into a global variable
    if (this.isLoggedIn() === true) {
      this.isloggedIn = true;
      this.storageConsID = localStorage.getItem('consID');
      this.storageParticipationID = localStorage.getItem('participationID');
    }
  }

  ngOnInit() {
    this.getCheckInStatus();
  }

  // Log out, clear out the local storage, forcing user to log in again
  logOut() {
    localStorage.clear();
    this.router.navigate(['/step-01']);
    this.show = true;

    this.convioURL = 'https://secure.weekendtoconquercancer.ca/site/';
    this.method = 'CRConsAPI?method=logout&api_key=cfowca&v=1.0&response_format=json';
    // this.http.post(this.convioURL + this.method, null)
    this.http.post(this.apiBase + 'logout', null)
      .subscribe(
        (data) => {

          this.snackBar.open('You have been successfully logged out. We look forward to seeing you at the f OneWalk!', 'Close', {
            duration: 3500,
            panelClass: ['error-info']
          });
        },
        (error) => {
          console.log(error);
        }
      );

    window.location.reload();
  }

  // Check logged in state by a token retrieved by loggin into the app
  isLoggedIn() {
    return localStorage.getItem('token') !== null;
  }

  // Log into the OCI Web App
  logMeIn() {
    this.loginMethod = 'CRConsAPI?method=login&api_key=cfowca&v=1.0&user_name=' + this.username + '&password=' + this.password + '&remember_me=true&response_format=json'
   this.http.post(this.convioURL + this.loginMethod, null)
    // this.http.post('/api/login', {username: this.username, password:this.password})
      .subscribe(res => {
        this.isManualLogin = true;
        this.loginRes = res;
        // console.log(this.loginRes);
        this.ssoToken = this.loginRes.loginResponse.token;
        this.consID = this.loginRes.loginResponse.cons_id;
        localStorage.setItem('consID', this.consID);

        this.storageConsID = localStorage.getItem('consID');
        // console.log(this.consID);

        localStorage.setItem('token', this.ssoToken);
        this.tokenExpired = false;

        this.storageToken = localStorage.getItem('token');

        const nonce = this.loginRes.loginResponse.nonce;
        localStorage.setItem('nonce', nonce);

        const jsession = this.loginRes.loginResponse.JSESSIONID;
        localStorage.setItem('jsession', jsession);
        // window.location.href = 'https://secure.weekendtoconquercancer.ca/site/' + 'EstablishSession?NONCE_TOKEN='+ nonce +'&NEXTURL=' + 'https://secure2.convio.net/cfowca/rcmo_oci_dev_moe/&NONCE_TOKEN='+ nonce;
        // window.location.href = 'https://secure.weekendtoconquercancer.ca/site/SPageServer?pagename=mo18_pc&pc2_page=center&fr_id=1651&jsessionid='+ jsession +'?pg=entry&fr_id=1651&NONCE_TOKEN='+ nonce + '&NEXTURL=https://secure2.convio.net/cfowca/rcmo_oci_dev/';

        // Get flow step
        this.getFlowStepLogin();
      }, (err) => {
        // console.log(err);
        this.loginErr = true;

        this.snackBar.open('Error with username or password.', 'Close', {
          duration: 3500,
          panelClass: ['error-info']
        });
      });
  }
  // Testing user's logged in state
  loginTest() {
    const redirectLink = '&sign_redirects=https://secure.weekendtoconquercancer.ca/site/CRConsAPI';
    this.loginMethod = 'CRConsAPI?method=loginTest&api_key=cfowca&v=1.0&response_format=json' + redirectLink;
    this.http.post(this.convioURL + this.loginMethod, null)
    // this.http.post(this.apiBase + 'loginTest', {redirect: 'https://secure.weekendtoconquercancer.ca/site/CRConsAPI'})
      .subscribe((res) => {
        this.loginTestRes = res;
        console.log(this.loginTestRes);
      }, (error) => {
        // console.log(error);
      });
  }

  getLoginUrl() {
    this.loginMethod =
      'CRConsAPI?method=getLoginUrl&api_key=cfowca&v=1.0&response_format=json';
    this.http.get(this.convioURL + this.loginMethod).subscribe(
      res => {
        this.isManualLogin = false;
        this.loginTestRes = res;
        console.log('getLoginUrl success: ', this.loginTestRes);
        localStorage.setItem(
          'token',
          this.loginTestRes.getLoginUrlResponse.token
        );
        localStorage.setItem(
          'jsession',
          this.loginTestRes.getLoginUrlResponse.JSESSIONID
        );
        this.ssoToken = this.loginTestRes.getLoginUrlResponse.token;
        this.tokenExpired = false;
        this.storageToken = localStorage.getItem('token');
        this.isloggedIn = true;
        this.getFlowStepLogin();
        return true;
      },
      error => {
        // console.log('getLoginUrl error: ', error);
        return false;
      }
    );
  }

  // Get user's checkin status, this function will be ran on EVERY step
  getCheckInStatus() {
    this.method = 'CRTeamraiserAPI?method=getRegistration&api_key=cfowca&v=1.0&response_format=json&fr_id='+ this.eventID + '&sso_auth_token=' + this.storageToken;
    this.http.post(this.convioURL + this.method, null)
    // this.http.post(this.apiBase + 'status', {eventId: this.eventID, token:this.storageToken})
      .subscribe(res => {
        // Results from the API Call
        this.regResponse = res;

        this.checkInStatus = this.regResponse.getRegistrationResponse.registration.checkinStatus;

        // console.log(this.checkInStatus);
      }, (error) => {

      });
  }

  // Get the current Flowstep and Send them to the route
  getFlowStepLogin() {
    const token = localStorage.getItem('token');
    this.method = 'CRTeamraiserAPI?method=getFlowStep&api_key=cfowca&v=1.0&response_format=json&fr_id='+ this.eventID + '&sso_auth_token='+ this.ssoToken;
    this.http.post(this.convioURL + this.method, null)
    // this.http.post(this.apiBase + 'step', {eventId: this.eventID, token: this.ssoToken})
      .subscribe(res => {
        this.flowStepResults = res;
        this.flowStep = this.flowStepResults.getFlowStepResponse.flowStep;
        // console.log(this.flowStep);

        // Check the Flowstep, if matched, send them to the proper route
        if (this.flowStep === '0' || this.flowStep === '1') {
          this.router.navigate(['/step-02']);
        }
        if (this.flowStep === '2') {
          this.router.navigate(['/step-03']);
        }
        if (this.flowStep === '3') {
          this.router.navigate(['/step-04']);
        }
        if (this.flowStep === '4') {
          this.router.navigate(['/step-05']);
        }
        if (this.flowStep === '5') {
          this.router.navigate(['/step-06']);
        }
        if (this.flowStep === '6') {
          this.router.navigate(['/step-07']);
        }
        if (this.flowStep === '7') {
          this.router.navigate(['/step-08']);
        }
        if (this.flowStep === '8') {
          this.router.navigate(['/step-08']);
        }
      }, (err) => {
        // console.log(err);

        // If user tries to login with credentials from a different event display error message
        if (err.error.errorResponse.code === '2603') {
          localStorage.removeItem('token');
          this.snackBar.open('The username / password combination is incorrect for this event.', 'Close', {
            duration: 3500,
            panelClass: ['error-info']
          });
        }

      });
  }

  // Gather Registration Information
  getRegInfo() {
    this.storageToken = localStorage.getItem('token');
    this.method = 'CRTeamraiserAPI?method=getRegistration&api_key=cfowca&v=1.0&response_format=json&fr_id='+ this.eventID + '&sso_auth_token='+ this.storageToken;
    this.http.post(this.convioURL + this.method, null)
    // this.http.post(this.apiBase + 'regInfo', {eventId: this.eventID, token:this.storageToken})
      .subscribe(res => {
        // Results from the API Call
        this.regResponse = res;
        console.log(this.regResponse);

        if (this.regResponse.getRegistrationResponse.registration.teamId === '-1') {
          this.teamExist === false;
        } else {
          this.teamExist === true;
        }

        this.participationID = this.regResponse.getRegistrationResponse.registration.participationTypeId;
        localStorage.setItem('participationID', this.participationID);
        this.storageParticipationID = localStorage.getItem('participationID');

        this.checkInStatus = this.regResponse.getRegistrationResponse.registration.checkinStatus;

        // console.log('Storage Participation ID: ' + this.storageParticipationID);
        // console.log('Login Participation ID: ' + this.participationID);
        // console.log(this.regResponse);

        this.emergencyName = this.regResponse.getRegistrationResponse.registration.emergencyName;
        this.emergencyPhone = this.regResponse.getRegistrationResponse.registration.emergencyPhone;
        // console.log(this.regResponse.getRegistrationResponse.registration.tentmateStatus);

        if (this.regResponse.getRegistrationResponse.registration.tentmateStatus === '1') {
          this.tentStatus = 'Eligible';
        } else if (this.regResponse.getRegistrationResponse.registration.tentmateStatus === '2') {
          this.tentStatus = 'Declined';
        } else if (this.regResponse.getRegistrationResponse.registration.tentmateStatus === '3') {
          this.tentStatus = 'Random';
        } else if (this.regResponse.getRegistrationResponse.registration.tentmateStatus === '0') {
          this.tentStatus = 'None';
        } else if (this.regResponse.getRegistrationResponse.registration.tentmateStatus === '4') {
          this.tentStatus = 'Sent Invite';
        } else if (this.regResponse.getRegistrationResponse.registration.tentmateStatus === '6') {
          this.tentStatus = 'Request Pending';
        }

        this.getParticipationType();
      }, (err) => {
        // console.log('There was an error getting the Registration:')
        // console.log(err);
        this.tokenExpired = true;
        this.router.navigate(['/step-01']);
      });
  }

  // Gather Constituent Information
  getUserInfo() {
    this.storageToken = localStorage.getItem('token');
    this.method = 'CRConsAPI?method=getUser&api_key=cfowca&v=1.0&response_format=json&cons_id='+ this.storageConsID + '&sso_auth_token=' + this.storageToken;
    this.http.post(this.convioURL + this.method, null)
    // this.http.post(this.apiBase + 'userInfo', {consId: this.consID, token: this.storageToken})
      .subscribe(res => {
        this.getConsInfo = res;
        // console.log(this.getConsInfo);
        this.firstName = this.getConsInfo.getConsResponse.name.first;
        this.lastName = this.getConsInfo.getConsResponse.name.last;
        this.primaryAddress1 = this.getConsInfo.getConsResponse.primary_address.street1;
        this.primaryAddress2 = this.getConsInfo.getConsResponse.primary_address.street2;
        this.primaryCity = this.getConsInfo.getConsResponse.primary_address.city;
        this.primaryState = this.getConsInfo.getConsResponse.primary_address.state;
        this.primaryZip = this.getConsInfo.getConsResponse.primary_address.zip;

        this.consUserName = this.getConsInfo.getConsResponse.user_name;

        this.gender = this.getConsInfo.getConsResponse.gender;
      }, (err) => {
        console.log(err);
      });
  }

  // Gather Participation Type
  getParticipationType() {
    this.method = 'CRTeamraiserAPI?method=getParticipationType&api_key=cfowca&v=1.0&response_format=json&fr_id=' + this.eventID + '&participation_type_id=' + this.storageParticipationID;

    this.http.post(this.convioURL + this.method, null)
    // this.http.post(this.apiBase + 'participantType', {eventId: this.eventID, participationId: this.participationID})
      .subscribe(res => {
        this.participationRes = res;
        // console.log(this.participationRes);
        this.participationType = this.participationRes.getParticipationTypeResponse.participationType.name;
        // localStorage.setItem('participationType', this.participationType);
      }, (err) => {
        // console.log(err);
      });
  }

  // Get Team Information
  getTeam() {
    this.method = 'CRTeamraiserAPI?method=getTeam&api_key=cfowca&v=1.0&response_format=json&fr_id=' + this.eventID + '&sso_auth_token=' + this.storageToken;
    this.http.post(this.convioURL + this.method, null)
    // this.http.post(this.apiBase + 'getTeam', {eventId: this.eventID, token: this.storageToken})
      .subscribe(res => {
        this.getTeamRes = res;
        // console.log(this.getTeamRes);
        this.teamName = this.getTeamRes.getTeamResponse.team.name;
        this.teamExist = true;
      }, (err) => {
        // console.log('There was an error getting the getTeam Info');
        // console.log(err);
        this.teamExist = false;
      });

  }

}
