import { Component, OnInit } from '@angular/core';
import { LoginService } from '../../services/login.service';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent implements OnInit {

  public role: any;
  public current_name: any;
  constructor(public login: LoginService) { 
    this.role = this.login.getSessionData('session_role');
    this.current_name = this.login.getSessionData('session_name');
  }

  ngOnInit(): void {
  }
  status: boolean =false;
	clickEvent(){
		this.status = !this.status;
	}
  public async doLogout() {
    await this.login.doLogout();
  }

}
