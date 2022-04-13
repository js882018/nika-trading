import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, FormArray, FormControl, Validators, AbstractControl, ValidatorFn } from "@angular/forms";
import { Router, ActivatedRoute } from '@angular/router';
import { NgxSpinnerService } from "ngx-spinner";
import Swal from 'sweetalert2';

import { CommonService } from '../../services/common.service';
import { LoginService } from '../../services/login.service';

@Component({
  selector: 'app-my-wallet',
  templateUrl: './my-wallet.component.html',
  styleUrls: ['./my-wallet.component.css']
})
export class MyWalletComponent implements OnInit {

  public err: any = {};
  public result: any = {};
  public data: any = {};
  public search_form: any = {};
  public form: any = {};
  public datalist: any = [];
  public submitted = false;

  search_term = '';
  per_page = 10;
  page = 1;
  total = 0;
  public current_role: any;
  public wallet_balance: any;
  public showModal: boolean;
  constructor(public login: LoginService, private service: CommonService, private router: Router, public fb: FormBuilder, private spinner: NgxSpinnerService) {
    this.service.setTitle('My Wallet | Nika Trading');
    this.search_form = this.fb.group({ name: [''] });
    this.current_role = this.login.getSessionData('session_role');
    this.showModal = false;

    this.form = this.fb.group({
      user_id: this.login.getSessionData('session_id'),
      withdrawal_amount: ['', [Validators.required, Validators.pattern('\^([\\d]{0,10})(\\.|$)([\\d]{1,4}|)$'), this.checkWithdrawalAmount()]],
    });
  }

  ngOnInit(): void {
    this.data_list();
  }

  checkWithdrawalAmount(): ValidatorFn {
    return (control: AbstractControl): { [key: string]: boolean } | null => {
      if (control.value !== '' && this.wallet_balance < control.value) {
        return { 'checkWithdrawalAmount': true };
      }
      return null;
    };
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
      user_role: this.current_role
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
      this.wallet_balance = this.result.tot_wallet_balance;
    }
  }

  public pageChanged(page: any) {
    this.spinner.show();
    let total_pages = this.total / this.per_page;
    this.page = page;
    this.data_list();
  }

  get form_errors() {
    return this.form.controls;
  }

  form_validate_error(field: any, rule: any) {
    if ((this.submitted || this.form_errors[field].touched) && this.form_errors[field].errors && this.form_errors[field].errors[rule]) {
      return false;
    }
    return true;
  }

  validate_add_more_error(i: any, fieldset: any, field: any, rule: any) {
    if ((this.submitted || this.form_errors[fieldset].touched) && this.form_errors[fieldset].controls[i].controls[field].errors && this.form_errors[fieldset].controls[i].controls[field].errors[rule]) {
      return false;
    }
    return true;
  }

  public async show_modal() {
    this.showModal = true;
    console.log('test')
  }

  public hide_modal() {
    this.showModal = false;
  }

  public async doFormAction() {
    this.err = {};
    this, this.service._gotoTop();
    this.submitted = true;
    if (this.form.invalid) {
      return;
    }
    this.spinner.show();
    this.result = await this.service.form_action(this.form.value, '/withdrawal-request/send');
    this.showModal = false;
    if (this.result.status == true) {
      this.spinner.hide();
      setTimeout(() => {
        window.location.reload();
      }, 1000);
      Swal.fire({ icon: 'success', title: 'Success!', text: this.result.message, timer: 1500 });
    } else {
      this.spinner.hide();
      if (this.result.code == 202) {
        this.err = {};
        Swal.fire({ icon: 'error', title: 'Error!', text: this.result.message, timer: 1500 });
      } else {
        this.err = this.result.message;
      }
    }
  }

}
