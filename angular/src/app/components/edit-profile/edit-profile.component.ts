import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, FormArray, FormControl, Validators } from "@angular/forms";
import { HttpClient, HttpEvent, HttpEventType } from '@angular/common/http';
import { Router, ActivatedRoute } from '@angular/router';
import { NgxSpinnerService } from "ngx-spinner";
import { DomSanitizer } from '@angular/platform-browser';
import Swal from 'sweetalert2';

import { CommonService } from '../../services/common.service';
import { LoginService } from '../../services/login.service';

@Component({
  selector: 'app-edit-profile',
  templateUrl: './edit-profile.component.html',
  styleUrls: ['./edit-profile.component.css']
})
export class EditProfileComponent implements OnInit {

  public id: any;
  public err: any = {};
  public result: any = {};
  public data: any = {};
  public form: any = {};
  public submitted = false;
  public agencies: any = [];
  public role: any;

  constructor(private service: CommonService, private router: Router, private activatedRouter: ActivatedRoute,
    public fb: FormBuilder, private loader: NgxSpinnerService, private sanitizer: DomSanitizer,
    public login: LoginService) {
    this.service.setTitle('Edit Profile | Nika Trading');
    this.id = this.login.getSessionData('session_id');
    this.role = this.login.getSessionData('session_role');
    this.form = this.fb.group({
      name: ['', Validators.required],
      email: [''],
      new_password: ['', [Validators.minLength(6), Validators.maxLength(12)]],
      confirm_password: [''],
      phone: ['', [Validators.required, Validators.pattern('^[0-9]*$')]],
      address: [''],
      bank_account: [''],
      ifsc: [''],
      branch: [''],
      agency_id: [''],
      user_details_id: ['']
    }, { validator: this.passwordMatchValidator });
  }

  passwordMatchValidator(group: FormGroup) {
    const newPass = group.controls['new_password'].value;
    const confirmPass = group.controls['confirm_password'].value;
    return newPass === confirmPass ? null : { notSame: true };
  }

  ngOnInit(): void {
    this.get_data();
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
          user_details_id: this.data.user_details_id === null ? '' : this.data.user_details_id
        });
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
    console.log(this.form.value)
    this.loader.show();
    this.result = await this.service.update_action(this.form.value, '/profile/update/' + this.id);
    if (this.result.status == true) {
      this.loader.hide();
      localStorage.setItem('session_name', this.result.data.name);
      setTimeout(() => {
        window.location.reload();
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
