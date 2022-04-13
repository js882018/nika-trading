import { Component, OnInit } from '@angular/core';
import { Validators, FormBuilder, FormGroup, AbstractControl, ValidatorFn } from "@angular/forms";
import { HttpClient, HttpEvent, HttpEventType } from '@angular/common/http';
import { Router, ActivatedRoute } from '@angular/router';
import Swal from 'sweetalert2';
import { NgxSpinnerService } from "ngx-spinner";

import { CommonService } from '../../services/common.service';

@Component({
  selector: 'app-validate-registration-otp',
  templateUrl: './validate-registration-otp.component.html',
  styleUrls: ['./validate-registration-otp.component.css']
})
export class ValidateRegistrationOtpComponent implements OnInit {

  public err: any = {};
  public result: any = {};
  public form: any = {};
  public data: any = {};
  public submitted = false;


  constructor(private loader: NgxSpinnerService, private service: CommonService, private router: Router, public fb: FormBuilder) {
    this.service.setTitle('OTP Validation | Nika Trading');
    this.data = JSON.parse(localStorage.getItem('user_register_data') || '{}');
    this.form = this.fb.group({
      name: [this.data.name],
      email: [this.data.email],
      password: [this.data.password],
      phone: [this.data.phone],
      address: [this.data.address],
      bank_account: [this.data.bank_account],
      ifsc: [this.data.ifsc],
      branch: [this.data.branch],
      otp: ['', Validators.required]
      // otp: ['', [Validators.required, this.otpValidator(this.data.otp)]]
    });
  }

  ngOnInit(): void {

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

  otpValidator(valid_otp: number): ValidatorFn {
    return (control: AbstractControl): { [key: string]: boolean } | null => {
      //if (control.value !== '' && control.value !== valid_otp) {
      if (control.value !== '' && control.value !== '123456') {
        return { 'otpValidator': true };
      }
      return null;
    };
  }



  public async doFormAction() {
    this.err = {};
    this, this.service._gotoTop();
    this.submitted = true;
    if (this.form.invalid) {
      return;
    }
    this.loader.show();
    this.result = await this.service.form_action(this.form.value, '/user-management/validate-otp');
    if (this.result.status == true) {
      this.loader.hide();
      setTimeout(() => {
        this.router.navigate(['/login']);
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
