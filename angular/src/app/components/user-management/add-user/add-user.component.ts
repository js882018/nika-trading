import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, FormArray, FormControl, Validators } from "@angular/forms";
import { HttpClient, HttpEvent, HttpEventType } from '@angular/common/http';
import { Router, ActivatedRoute } from '@angular/router';
import { NgxSpinnerService } from "ngx-spinner";
import { DomSanitizer } from '@angular/platform-browser';
import Swal from 'sweetalert2';

import { CommonService } from '../../../services/common.service';
import { LoginService } from '../../../services/login.service';

@Component({
  selector: 'app-add-user',
  templateUrl: './add-user.component.html',
  styleUrls: ['./add-user.component.css']
})
export class AddUserComponent implements OnInit {

  public err: any = {};
  public result: any = {};
  public data: any = {};
  public form: any = {};
  public submitted = false;
  public agencies: any = [];
  public role: any;
  public is_show_details: boolean = true;

  constructor(private service: CommonService, private router: Router, private activatedRouter: ActivatedRoute,
    public fb: FormBuilder, private loader: NgxSpinnerService, private sanitizer: DomSanitizer,
    public login: LoginService) {
    this.service.setTitle('Add User | Nika Trading');
    this.role = this.login.getSessionData('session_role');
    this.form = this.fb.group({
      name: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      password: ['', Validators.required],
      phone: ['', [Validators.required, Validators.pattern('^[0-9]*$')]],
      role: ['', Validators.required],
      address: [''],
      bank_account: [''],
      ifsc: [''],
      branch: [''],
      agency_id: [this.role == 1 ? '' : this.login.getSessionData('session_id')],
      agency_name: [this.role == 1 ? '' : this.login.getSessionData('session_name')],
      created_by: this.login.getSessionData('session_id')
    });
  }

  ngOnInit(): void {
    this.get_agencies();
  }

  public on_select_role(role: any) {
    if (role.value == "2") {
      this.is_show_details = false;
    } else {
      this.is_show_details = true;
    }
  }

  public async get_agencies() {
    var formData = {
      search: ''
    };
    this.loader.show();
    this.result = await this.service.get_action(formData, '/users/get-agencies');
    if (this.result == 'unknown_error') {
      this.loader.hide();
    } else {
      this.loader.hide();
      if (this.result.status == true) {
        this.agencies = this.result.data;
      }
    }
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

  public async doFormAction() {
    this.err = {};
    this, this.service._gotoTop();
    this.submitted = true;
    if (this.form.invalid) {
      return;
    }
    this.loader.show();
    this.result = await this.service.form_action(this.form.value, '/user-management/add');
    if (this.result.status == true) {
      this.loader.hide();
      setTimeout(() => {
        this.router.navigate(['/user-management']);
      }, 1000);
      Swal.fire({ icon: 'success', title: 'Success!', text: this.result.message, timer: 1500 });
    } else {
      this.loader.hide();
      if (this.result.code == 202) {
        this.err = {};
        Swal.fire({ icon: 'error', title: 'Error!', text: this.result.message, timer: 1500 });
      } else {
        this.err = this.result.message;
      }
    }
  }

}
