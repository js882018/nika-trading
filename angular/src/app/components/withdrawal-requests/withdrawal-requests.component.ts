import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, FormArray, FormControl, Validators } from "@angular/forms";
import { Router, ActivatedRoute } from '@angular/router';
import { NgxSpinnerService } from "ngx-spinner";
import Swal from 'sweetalert2';

import { CommonService } from '../../services/common.service';
import { LoginService } from '../../services/login.service';

@Component({
  selector: 'app-withdrawal-requests',
  templateUrl: './withdrawal-requests.component.html',
  styleUrls: ['./withdrawal-requests.component.css']
})
export class WithdrawalRequestsComponent implements OnInit {

  public err: any = {};
  public result: any = {};
  public data: any = {};
  public search_form: any = {};
  public datalist: any = [];

  search_term = '';
  per_page = 10;
  page = 1;
  total = 0;
  public current_role: any;
  constructor(public login: LoginService, private service: CommonService, private router: Router, public fb: FormBuilder, private spinner: NgxSpinnerService) {
    this.service.setTitle('All Withdrawal Requests | Nika Trading');
    this.search_form = this.fb.group({ name: [''] });

    this.current_role = this.login.getSessionData('session_role');
  }

  ngOnInit(): void {
    this.data_list();
  }

  public async data_list() {
    this.err = {};
    var formData = {
      page: this.page,
      per_page: this.per_page,
      search: this.search_term,
      sort: 'id',
      dir: 'desc',
      user_id: this.login.getSessionData('session_id'),
      user_role: this.current_role,
      type: 2
    };
    this.spinner.show();
    this.result = await this.service.form_action(formData, '/wallet-transactions');
    if (this.result == 'unknown_error') {
      Swal.fire({ icon: 'error', title: 'Error!', text: 'Something went wrong. Please try again later.' });
      this.spinner.hide();
    } else {
      this.spinner.hide();
      this.datalist = this.result.data;
      this.total = this.result.total;
    }
  }

  public pageChanged(page: any) {
    this.spinner.show();
    let total_pages = this.total / this.per_page;
    this.page = page;
    this.data_list();
  }

}
