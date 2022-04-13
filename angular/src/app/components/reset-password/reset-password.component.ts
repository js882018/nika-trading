import { Component, OnInit } from '@angular/core';
import { Validators, FormBuilder, FormGroup } from "@angular/forms";
import { HttpClient, HttpEvent, HttpEventType } from '@angular/common/http';
import { Router, ActivatedRoute } from '@angular/router';
import Swal from 'sweetalert2';
import { NgxSpinnerService } from "ngx-spinner";

import { CommonService } from '../../services/common.service';

@Component({
  selector: 'app-reset-password',
  templateUrl: './reset-password.component.html',
  styleUrls: ['./reset-password.component.css']
})
export class ResetPasswordComponent implements OnInit {

  public err: any = {};
  public result: any = {};
  public form: any = {};
  public data: any = {};
  public submitted = false;

  public reset_code: any;
  public email: any;
  constructor(private activatedRoute: ActivatedRoute, private loader: NgxSpinnerService, private service: CommonService, private router: Router, public fb: FormBuilder) {
    this.service.setTitle('Reset Password | Nika Trading');

    this.form = this.fb.group({
      email: [""],
      password: ["", Validators.required],
      confirm_password: [""]
    });
  }

  ngOnInit(): void {
    this.activatedRoute.queryParams.subscribe(params => {
      this.reset_code = params['code'];
      this.email = params['email'];
      this.form.patchValue({
        email: this.email
      });
    });
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
    this.submitted = true;
    if (this.form.invalid) {
      return;
    }
    var formData = {
      email: this.email,
      reset_code: this.reset_code,
      password: this.form.value.password,
      confirm_password: this.form.value.confirm_password
    };
    this.loader.show();
    this.result = await this.service.form_action(formData, '/reset-password');
    if (this.result.status == true) {
      this.loader.hide();
      Swal.fire({ icon: 'success', title: 'Success!', text: this.result.message, timer: 1800 });
      setTimeout(() => {
        this.router.navigate(['/login']);
      }, 2000);
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
