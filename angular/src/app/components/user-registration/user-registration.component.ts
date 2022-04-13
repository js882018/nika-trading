import { Component, OnInit } from '@angular/core';
import { Validators, FormBuilder, FormGroup } from "@angular/forms";
import { HttpClient, HttpEvent, HttpEventType } from '@angular/common/http';
import { Router, ActivatedRoute } from '@angular/router';
import Swal from 'sweetalert2';
import { NgxSpinnerService } from "ngx-spinner";

import { CommonService } from '../../services/common.service';

@Component({
  selector: 'app-user-registration',
  templateUrl: './user-registration.component.html',
  styleUrls: ['./user-registration.component.css']
})
export class UserRegistrationComponent implements OnInit {

  public err: any = {};
  public result: any = {};
  public form: any = {};
  public data: any = {};
  public registration_data: any = {};
  public submitted = false;
  constructor(private loader: NgxSpinnerService, private service: CommonService, private router: Router, public fb: FormBuilder) {
    this.service.setTitle('User Registration | Nika Trading');

    this.form = this.fb.group({
      name: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      password: ['', Validators.required],
      phone: ['', [Validators.required, Validators.pattern('^[0-9]*$')]],
      address: [''],
      bank_account: [''],
      ifsc: [''],
      branch: ['']
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

  public async doFormAction() {
    this.err = {};
    this, this.service._gotoTop();
    this.submitted = true;
    if (this.form.invalid) {
      return;
    }
    this.loader.show();
    this.result = await this.service.form_action(this.form.value, '/user-management/register');
    if (this.result.status == true) {
      this.loader.hide();
      localStorage.setItem('user_register_data', JSON.stringify(this.result.data))
      setTimeout(() => {
        this.router.navigate(['/validate-registration-otp']);
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
