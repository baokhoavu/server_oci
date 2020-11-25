import { Component, OnInit } from '@angular/core';
import { DataService } from '../data.service';


@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']
})

export class HeaderComponent implements OnInit {

	// logoUrl = 'https://secure.onewalk.ca/ow19_oci/assets/images/OW_Rexall_Logo.svg';
	logoUrl = '/assets/images/OW_Rexall_Logo.svg';

	constructor(private data: DataService) {}

	ngOnInit() {}
	// Calling on the isLoggedIn() function from the global data service to check the logged in state
  isLoggedIn() {
	  return this.data.isLoggedIn();
	}

}
