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
  selector: 'app-edit-user',
  templateUrl: './edit-user.component.html',
  styleUrls: ['./edit-user.component.css']
})
export class EditUserComponent implements OnInit {

  public id: any;
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
    this.service.setTitle('Edit User | Nika Trading');
    this.id = this.activatedRouter.snapshot.paramMap.get('id');
    this.role = this.login.getSessionData('session_role');
    this.form = this.fb.group({
      name: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      password: [''],
      phone: ['', [Validators.required, Validators.pattern('^[0-9]*$')]],
      role: ['', Validators.required],
      address: [''],
      bank_account: [''],
      ifsc: [''],
      branch: [''],
      agency_id: [''],
      agency_name: [''],
      user_details_id: ['']
    });
  }

  ngOnInit(): void {
    this.get_data();
    this.get_agencies();
  }

  public on_select_role(role: any) {
    if (role.value == "2") {
      this.is_show_details = false;
    } else {
      this.is_show_details = true;
    }
  }

  public async get_data() {
    this.loader.show();
    var formData = {
      id: this.id
    };
    this.result = await this.service.get_action(formData, '/user-management/get-data/' + this.id);
    if (this.result == 'unknown_error') {
      this.loader.hide();
    } else {
      this.loader.hide();
      if (this.result.status == true) {
        this.data = this.result.data;
        if (this.data.user_role == "2") {
          this.is_show_details = false;
        } else {
          this.is_show_details = true;
        }
        this.form.patchValue({
          name: this.data.user_name,
          email: this.data.user_email,
          phone: this.data.user_phone,
          role: this.data.user_role,
          address: this.data.user_address,
          bank_account: this.data.bank_account,
          ifsc: this.data.ifsc,
          branch: this.data.branch,
          agency_id: this.data.agency_id === null ? '' : this.data.agency_id,
          agency_name: this.data.agency_name === null ? '' : this.data.agency_name,
          user_details_id: this.data.user_details_id === null ? '' : this.data.user_details_id
        });
      }
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
    this.result = await this.service.update_action(this.form.value, '/user-management/edit/' + this.id);
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
