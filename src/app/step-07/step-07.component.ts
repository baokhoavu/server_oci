import { Component, OnInit, OnDestroy, AfterViewInit, ChangeDetectorRef } from '@angular/core';
import { Router } from '@angular/router';

/* HTTP Client to retrieve data */
import { HttpClient } from '@angular/common/http';

/* Angular Material */
import { MatSnackBar } from '@angular/material';

/* Data Service */
import { DataService } from '../data.service';

@Component({ selector: 'app-step-07', templateUrl: './step-07.component.html', styleUrls: ['./step-07.component.scss'] })

export class Step07Component implements OnInit,
    OnDestroy,
    AfterViewInit {
    consID: string = '';
    totalTeamGoal: number = 0;
    totalTeamRaised: number = 0;
    totalTeamNeeded: number = 0;
    totalTeamSurplus: number = 0;
    totalUpsellNumber: number = 0;
    timeOut: any;
    timeOut2: any;
    teamName: any;
    loading: boolean = true;
    // Setting the FlowStep
    flowStep = '6';
    flowStepResults: any = {};
    getFlowStepNumber: string;

    // getSurvey Results Data
    surveyResults: any = {};
    upsellResponse: string;
    hiddenUpsellID: string;

    // Upsell Data / Response
    upsellInfo: any = {};
    upsellPriceNumber: number;
    upsellPrice: any;

    checkinStatus: string;
    inTeam: boolean;

    ispID: string;
    ispURL: string;
    ispURLNoTR: string;
    dspID: string;
    dspURL: string;
    dspURLNoTR: string;
    hideDSP: boolean = true;
    hideISP: boolean = true;
    checkInCommitted: boolean = true;
    fundsMet: boolean = true;
    noTeam: boolean = false;
    currentParticipantRaised: number = 0;
    currentParticipantGoal: number = 0;

    // 07/19/19
    totalDonation: number = 0;
    totalTeamRaisedAmountGlobal: number = 0;
    totalTeamRaisedAmount: number = 0;
    totalTeamRaisedAmountIncomplete: number = 0;
    totalTeamGoalAmount: number = 0;
    totalTeamSurplusAmount: number = 0;
    totalTeamSurplusAndDonations: number = 0;
    individualNeeded: number = 0;
    nextStepOk:boolean = false;
    tailISP:string = '';
    tailDSP:string = '';
    donationLevelID:string = '2161';

    constructor(public data: DataService, private cdr: ChangeDetectorRef, private http: HttpClient, private router: Router, public snackBar: MatSnackBar) { }

    /** On init method */
    ngOnInit() {

        // this.data.getRegDocument();

        this.data.getRegInfo();
        // First lets get the team to get the calculations right      

        this.getTeam();
      
        if ( this.noTeam = true ) {
            this.loading = false;            
        } 

        window.scrollTo(0, 0);
        // Checking logged in state, and running correct functions
        if (this.data.isLoggedIn() === true && this.data.tokenExpired === false) {
            // If logged in state is correct, run functions
            this.getFlowStep();
        } else if (this.data.storageToken === undefined) {
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
    }

    /** after init method */
    ngAfterViewInit() {
        if (this.upsellResponse === 'Yes' && this.hiddenUpsellID) {
            // console.log('I am inside the first dsp if statement');
            this.ispURL += '&DESIGNATED_ADDON_ID=' + this.hiddenUpsellID;
            // this.dspURL += '&DESIGNATED_ADDON_ID=' + this.hiddenUpsellID;

            this.hideDSP = false;
        } else if (this.upsellResponse === 'Yes'  && this.hiddenUpsellID) {
            // console.log('I am inside the second dsp if statement');
            this.ispURL += '&DESIGNATED_ADDON_ID=' + this.hiddenUpsellID;
          //  this.dspURL += '&DESIGNATED_ADDON_ID=' + this.hiddenUpsellID;
        }
    }

    /** On destroy method */
    ngOnDestroy() {
        clearTimeout(this.timeOut);
    }

    /** get step method */
    getFlowStep() {
        const token = localStorage.getItem('token');
        const method = `CRTeamraiserAPI?method=getFlowStep&api_key=cfowca&v=1.0&response_format=json&fr_id=${this.data.eventID}&sso_auth_token=${token}`;
        // this
        //     .http
        //     .post(this.data.convioURL + method, null)
        this.http.post(this.data.apiBase + 'step', { eventId: this.data.eventID, token: token })
            .subscribe((res: any) => {
                this.flowStepResults = res;
                this.getFlowStepNumber = res.getFlowStepResponse.flowStep;

                // Checking the participants flow step to prevent user from skipping a flowstep
                if (this.getFlowStepNumber === this.flowStep) {
                    // If the flow step matches to where they are supposed to be, then run the
                    // functions for the current route below
                    this.getSurvey();
                    this
                        .data
                        .getUserInfo();
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
                }

            }, (err) => {
                console.log(err);

                // If flowstep has error, log out the user (to prevent API errors)
                this
                    .data
                    .logOut();
            });
    }

    /** get registration info method */
    getRegInfo() {

        this.data.storageToken = localStorage.getItem('token');
        const method: string = `CRTeamraiserAPI?method=getRegistration&api_key=cfowca&v=1.0&response_format=json&fr_id=${this.data.eventID}&sso_auth_token=${this.data.storageToken}`;
        // this
        //     .http
        //     .post(this.data.convioURL + method, null)
        this.http.post(this.data.apiBase + 'regInfo', { eventId: this.data.eventID, token: this.data.storageToken })
            .subscribe((res: any) => {

                console.log(res)
                // console.log(res.getRegistrationResponse.registration.teamId)

                this.consID = res.getRegistrationResponse.registration.consId;
                this.checkinStatus = res.getRegistrationResponse.registration.checkinStatus;                

                if (this.checkinStatus === 'committed' || this.checkinStatus === 'paid' || this.checkinStatus === 'complete') {
                    this.checkInCommitted = true;
                    this.hideDSP = true;
                    this.hideISP = true;
                    this.fundsMet = false;
                } else {
                    this.checkInCommitted = false;
                    this.hideDSP = false;
                    this.hideISP = false;
                }

                if (res.getRegistrationResponse.registration.teamId > 0) {
                    this.inTeam = true;
                }

                if (res.getRegistrationResponse.registration.teamId === '-1') {
                    this.noTeam = true;
                } else {
                    this.noTeam = false;
                }

                console.log(this.checkinStatus)
                console.log(this.checkInCommitted)

                this.getFundraising();
                this.getIspDspID();
                this.updateFlowStep();

            }, (err) => {
                console.log(err);
                this.data.tokenExpired = true;
                this
                    .router
                    .navigate(['/step-01']);
            });
        this.data.getParticipationType();
        console.log(this.data.participationType);
    }

    /** get fundraising  method */
    getFundraising() {
        const method: string = `CRTeamraiserAPI?method=getFundraisingResults&api_key=cfowca&v=1.0&response_format=json&cons_id=${this.consID}&fr_id=${this.data.eventID}`;
        // this
        //     .http
        //     .get(this.data.convioURL + method)
        this.http.post(this.data.apiBase + 'getFundResults', { consId: this.consID, eventId: this.data.eventID })
            .subscribe((data: any) => {
                const goal: number = parseInt((parseInt(data.getFundraisingResponse.fundraisingRecord.minimumGoal, 10) / 100).toFixed(2), 10);
                const raised: number = parseInt((parseInt(data.getFundraisingResponse.fundraisingRecord.totalAmountIncludingUnconfirmed, 10) / 100).toFixed(2), 10);

                console.log(data)

                this.currentParticipantRaised = raised;
                this.currentParticipantGoal = goal;
                this.individualCalculation(goal, raised);
                console.log('Total Surplus and donations: ', this.totalTeamSurplusAndDonations, ' Total Needed: ', this.totalTeamNeeded, ' upsell : ', this.totalUpsellNumber, ' response: ', this.upsellResponse);

                
                /**
                 * Add logic for remaining payment if needed
                 */
                switch(true){
                    case this.totalTeamNeeded < 1 && this.upsellResponse === 'No':
                        this.nextStepOk = true;                        
                        break;
                    case this.totalTeamNeeded < 1 && this.upsellResponse === 'Yes':
                        this.tailISP = '&set.DonationLevel=' + this.donationLevelID + '&set.Value=' + this.totalTeamNeeded + '&DESIGNATED_ADDON_ID=' + this.hiddenUpsellID;
                        this.nextStepOk = false;
                        break;
                    case this.totalTeamNeeded > 0 && this.checkInCommitted === true:
                    case this.totalTeamNeeded < 1 && this.checkInCommitted === true:
                        this.nextStepOk = true;
                        break;
                    case this.totalTeamNeeded > 0 && this.upsellResponse === 'Yes':
                    case this.totalTeamNeeded > 0 && this.upsellResponse === 'No':                            
                            this.tailISP =  '&set.DonationLevel=' + this.donationLevelID + '&set.Value=' + this.totalTeamNeeded + '00' + '&DESIGNATED_ADDON_ID=' + this.hiddenUpsellID;
                            // this.tailDSP = '&DESIGNATED_ADDON_ID=' + this.hiddenUpsellID;
                            // this.tailDSP = '&set.Value=' + this.totalTeamNeeded + '00';
                            this.tailDSP = '&set.Value=' + ( this.totalTeamNeeded - 2 ) + '00' + '&DESIGNATED_ADDON_ID=' + this.hiddenUpsellID;;
                            this.nextStepOk = false;
                            break;
                    default:
                        console.log('Invalid validation for ISP and DSP');
                }
                if (this.checkinStatus === 'paid' && this.checkInCommitted === false) {
                    // console.log('Status is Paid and Has met funding requirements');
                    this.hideDSP = false;
                    this.hideISP = false;
                    this.fundsMet = false;
                }

                if (this.checkinStatus === 'paid' || this.checkinStatus === 'committed') {
                    this.nextStepOk = true;
                    this.checkInCommitted = true;
                }

                if (this.upsellResponse === 'No' && this.totalTeamNeeded < 1) {
                    this.hideDSP = false;
                    this.hideISP = false;
                    this.fundsMet = true;
                }

                if (this.upsellResponse === 'Yes' ) {
                    this.ispURL += '&DESIGNATED_ADDON_ID=' + this.hiddenUpsellID;
                    // this.dspURL += '&DESIGNATED_ADDON_ID=' + this.hiddenUpsellID;
                    this.hideDSP = false;
                    this.fundsMet = false;
                } 

                if (this.upsellResponse === 'Yes' && this.totalTeamNeeded < 1 && this.checkinStatus === 'paid') {
                    this.hideDSP = false;
                    this.hideISP = false;
                    this.fundsMet = true;
                }

                if (this.totalTeamNeeded < 1) {
                    console.log('Total funds needed: ' + this.totalTeamNeeded, ' founds met: ', this.fundsMet, this.checkinStatus );
                }
            });
    }

    /** get ispdspID  method */
    getIspDspID() {
        const method = `CRTeamraiserAPI?method=getEventDataParameter&api_key=cfowca&v=1.0&response_format=json&fr_id=${this.data.eventID}&edp_name=F2F_OCI_ISP_FORM_ID`;
        // this
        //     .http
        //     .post(this.data.convioURL + method, null)
        this.http.post(this.data.apiBase + 'getEventData', { eventId: this.data.eventID, edpName: 'F2F_OCI_ISP_FORM_ID' })
            .subscribe((res: any) => {

                // console.log(res)

                this.ispID = res.getEventDataParameterResponse.stringValue;
                this.ispURL = 'http://www.onewalk.ca/site/Donation2/Donation2?df_id=' + this.ispID + '&' + this.ispID + '.donation=form1&mfc_pref=T&FILL_AMOUNT=TR_REMAINDER&PROXY_ID=' + this.consID + '&PROXY_TYPE=20&FR_ID=' + this.data.eventID;

                // console.log(this.ispURL)

                this.ispURLNoTR = 'http://www.onewalk.ca/site/Donation2/Donation2?df_id=' + this.ispID + '&' + this.ispID + '.donation=form1&mfc_pref=T&PROXY_ID=' + this.consID + '&PROXY_TYPE=20&FR_ID=' + this.data.eventID;

                // console.log(this.ispURLNoTR)

            }, (err) => console.log('There was an error!'));

        const methodDSP = `CRTeamraiserAPI?method=getEventDataParameter&api_key=cfowca&v=1.0&response_format=json&fr_id=${this.data.eventID}&edp_name=F2F_OCI_DSP_FORM_ID`;
        // this
        //     .http
        //     .post(this.data.convioURL + methodDSP, null)
        this.http.post(this.data.apiBase + 'getEventData', { eventId: this.data.eventID, edpName: 'F2F_OCI_DSP_FORM_ID' })
            .subscribe((res: any) => {

                // console.log(res)

                this.dspID = res.getEventDataParameterResponse.stringValue;
                this.dspURL = 'http://www.onewalk.ca/site/Donation2/Donation2?df_id=' + this.dspID + '&' + this.dspID + '.donation=form1&mfc_pref=T&FILL_AMOUNT=TR_REMAINDER&PROXY_ID=' + this.consID + '&PROXY_TYPE=20&FR_ID=' + this.data.eventID;

                // console.log(this.dspURL)

                this.dspURLNoTR = 'http://www.onewalk.ca/site/Donation2/Donation2?df_id=' + this.dspID + '&' + this.dspID + '.donation=form1&mfc_pref=T&PROXY_ID=' + this.consID + '&PROXY_TYPE=20&FR_ID=' + this.data.eventID;

                // console.log(this.dspURLNoTR)

            }, (err) => console.log('There was an error!'));
    }

    /** get survey  method */
    getSurvey() {

        const method: string = `CRTeamraiserAPI?method=getSurveyResponses&api_key=cfowca&v=1.0&fr_id=${this.data.eventID}&survey_id=${this.data.surveyID}&sso_auth_token=${this.data.ssoToken}&response_format=json`;
        // this
        //     .http
        //     .post(this.data.convioURL + method, null)
        this.http.post(this.data.apiBase + 'getSurvey', { eventId: this.data.eventID, surveyId: this.data.surveyID, token: this.data.ssoToken })
            .subscribe((res: any) => {
                // console.log(this.surveyResults); For loop to loop through the responded data
                // from API call
                for (const data of res.getSurveyResponsesResponse.responses) {
                    // If questionId is same as waiver question ID in Survey then check if fullName
                    // variable is undefined or null, if so set it as the response value else if
                    // it's length is equil to 0 or no reponseValue, then set it to a blank string
                    if (data.questionId === this.data.question6) {
                        this.upsellResponse = data.responseValue;

                    }
                    if (data.questionId === this.data.question16) {
                        this.hiddenUpsellID = data.responseValue;
                    }
                }

                if (this.upsellResponse === 'Yes') {
                    this.getUpsell();
                }

                this.getRegInfo();

                // console.log(this.upsellHiddenResult);
            }, (err) => {
                if (err.status === 403) {

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
                        .router
                        .navigate(['/step-01']);
                }
            });
    }

    /** get team  method */
    getTeam() {
        const url = `CRTeamraiserAPI?method=getTeam&api_key=cfowca&v=1.0&response_format=json&fr_id=${this.data.eventID}&sso_auth_token=${this.data.storageToken}`;
        // this
        //     .http
        //     .post(this.data.convioURL + url, null)
        this.http.post(this.data.apiBase + 'getTeam', { eventId: this.data.eventID, token: this.data.storageToken })
            .subscribe(res => {
                const response: any = res;
                this.teamName = response.getTeamResponse.team.name;
                const teamId = response.getTeamResponse.team.id;

                this.http.post(this.data.apiBase + 'getTeamByInfo', { eventId: this.data.eventID, teamId: teamId, token: this.data.storageToken })
                    .subscribe(res => {
                        const response: any = res;
                        this.totalTeamRaisedAmountGlobal = parseInt((parseInt(response.getTeamSearchByInfoResponse.team.amountRaised, 10) / 100).toFixed(2), 10);
                        this.getParticipantsList();

                    }, (err) => {
                        if (err.error.errorResponse.code === '2618') {
                            console.log('not in a team!');
                        }
                    });
            }, (err) => {
                if (err.error.errorResponse.code === '2618') {
                    console.log('not in a team!');
                }
            });
    }


    /** get step  method */
    updateFlowStep() {
        const method = `CRTeamraiserAPI?method=updateRegistration&api_key=cfowca&v=1.0&fr_id=${this.data.eventID}&sso_auth_token=${this.data.ssoToken}&checkin_status=${this.checkinStatus}&flow_step=${this.flowStep}&response_format=json`;
        // this
        //     .http
        //     .post(this.data.convioURL + this.data.method, null)
        this.http.post(this.data.apiBase + 'updateStep', { eventId: this.data.eventID, token: this.data.ssoToken, status: this.checkinStatus, step: this.flowStep })
            .subscribe((res: any) => {
                // console.log('Flow step updated.')
            }, (err) => {
                this
                    .snackBar
                    .open('There was an unknown error.', 'Close', {
                        duration: 3500,
                        panelClass: ['error-info']
                    });

                this
                    .data
                    .logOut();
            });
    }

    /** get next step  method */
    nextFlowStep() {
        this.flowStep = '7';
        const method = `CRTeamraiserAPI?method=updateRegistration&api_key=cfowca&v=1.0&fr_id=${this.data.eventID}&sso_auth_token=${this.data.ssoToken}&checkin_status=${this.checkinStatus}&flow_step=${this.flowStep}&response_format=json`;
        // this
        //     .http
        //     .post(this.data.convioURL + this.data.method, null)
        this.http.post(this.data.apiBase + 'updateStep', { eventId: this.data.eventID, token: this.data.ssoToken, status: this.checkinStatus, step: this.flowStep })
            .subscribe((res: any) => {
                // Update the flowStep to the next flowstep once everything checks out properly
                this
                    .router
                    .navigate(['/step-08']);
            }, (err) => {
                this
                    .snackBar
                    .open('There was an unknown error.', 'Close', {
                        duration: 3500,
                        panelClass: ['error-info']
                    });
                this
                    .data
                    .logOut();
            });
    }

    /** get previous step  method */
    previousFlowStep() {
        this.flowStep = '5';
        const method = `CRTeamraiserAPI?method=updateRegistration&api_key=cfowca&v=1.0&fr_id=${this.data.eventID}&sso_auth_token=${this.data.ssoToken}&checkin_status=${this.checkinStatus}&flow_step=${this.flowStep}&response_format=json`;
        // this
        //     .http
        //     .post(this.data.convioURL + method, null)
        this.http.post(this.data.apiBase + 'updateStep', { eventId: this.data.eventID, token: this.data.ssoToken, status: this.checkinStatus, step: this.flowStep })
            .subscribe((res: any) => {

                // Route user to previous flow step
                this
                    .router
                    .navigate(['/step-06']);
            }, (err) => {
                this
                    .snackBar
                    .open('There was an unknown error.', 'Close', {
                        duration: 3500,
                        panelClass: ['error-info']
                    });

                this
                    .data
                    .logOut();
            });
    }

    /** reload window  method */
    reload() {
        window
            .location
            .reload();
    }

    /** get upsell  method */
    getUpsell() {

        const method: string = `CRTeamraiserAPI?method=getUpsell&api_key=cfowca&v=1.0&fr_id=${this.data.eventID}&upsell_id=${this.hiddenUpsellID}&response_format=json`;
        // this
        //     .http
        //     .post(this.data.convioURL + method, null)
        this.http.post(this.data.apiBase + 'getUpsell', { eventId: this.data.eventID, upsellId: this.hiddenUpsellID })
            .subscribe((res: any) => {

                this.upsellPriceNumber = parseInt(res.getUpsellResponse.upsell.price, 0);
                const newUpsellAmt = this.upsellPriceNumber / 100;
                const upsellFinalAmt = newUpsellAmt.toFixed(2);
                this.totalUpsellNumber = parseInt(upsellFinalAmt, 10);
                console.log(this.totalUpsellNumber);

                this.upsellPrice = upsellFinalAmt;
            }, (error) => {
                console.log(error);
            });
    }

    /**
         * Dev AG Block
         * @param goal
         * @param raised
         * @param id
         * @returns void;
    */
    teamCalculations(goal: number, raised: number, id: string = null): void {
        console.log(id, this.consID, 'participant goal: ', goal, 'participant raised: ', raised);

        // If this is the account we register at the beggining skip it here, It was
        // added earlier.
        // if (id && id === this.consID) {
        //     return console.log('This constituent has been skipped');
        // }

        this.totalTeamGoal += goal; // Generate the total goal of the team.
        this.totalTeamRaised += raised; // Generate the total raised by the team.

        // For each participant analize their output
        if (raised > goal) { // Add to the surplus.
            this.totalTeamSurplus += (raised - goal);
        } else if (goal > raised) { // substract from the surplus.
            this.totalTeamSurplus -= (goal - raised);
        }

        // Make sure to update the needed var
        if (this.totalTeamSurplus < 0) { // surplus in negative numbers then start adding negative numbers to the all team needed.
            this.totalTeamNeeded = -(this.totalTeamSurplus);
        } else if (this.totalTeamSurplus > 0) {
            this.totalTeamNeeded = 0;
        }
    }

    individualCalculation(goal: number, raised: number) {
        if (goal > raised) {
            this.individualNeeded = goal - raised;
            this.totalTeamNeeded = (this.totalTeamSurplusAndDonations > this.individualNeeded) ? 0 : this.individualNeeded - this.totalTeamSurplusAndDonations;
        } else {
            this.totalTeamNeeded = 0;
        }
    }

    getParticipantsList() {
        const participantTypes: any = ['paid', 'committed', 'complete', 'started', 'unknown', 'initial'];
        participantTypes.forEach((status: string) => {
            this.http.post(this.data.apiBase + 'getParticipants', { eventId: this.data.eventID, token: this.data.storageToken, teamName: this.teamName, status: status })
                .subscribe((response: any) => {
                    this.loading = false;
                    const participantCount = parseInt(response.getParticipantsResponse.totalNumberResults, 10) || 0;
                    if (participantCount > 1) {
                        response.getParticipantsResponse.participant.forEach((participant: any) => this.foundCalculations(participant, status));
                    }
                    else if (participantCount === 1) {
                        const participant = response.getParticipantsResponse.participant;
                        this.foundCalculations(participant, status);
                    }
                    else {
                        console.log('No participants rendered in this type:', status);
                    }

                    /*
                    * After finishing working the participant response recalculate values.
                    */
                    this.totalDonation = this.totalTeamRaisedAmountGlobal - this.totalTeamRaisedAmountIncomplete; // To get Donation total
                    this.totalTeamSurplusAmount = (this.totalTeamRaisedAmount > this.totalTeamGoalAmount) ? this.totalTeamRaisedAmount - this.totalTeamGoalAmount : 0; // Get any help from others
                    this.totalTeamSurplusAndDonations = this.totalDonation + this.totalTeamSurplusAmount;
                    return;
                });
        });


    }

    foundCalculations(participant: any, filter: string) {
        // Here compute the participants with a complete status
        if (filter === 'complete') {
            this.totalTeamRaisedAmount += parseInt((parseInt(participant.amountRaised, 10) / 100).toFixed(2), 10);
            this.totalTeamGoalAmount += parseInt((parseInt(participant.goal, 10) / 100).toFixed(2), 10);
        }
        // Here compute the participants with other status
        this.totalTeamRaisedAmountIncomplete += parseInt((parseInt(participant.amountRaised, 10) / 100).toFixed(2), 10);

    }

}