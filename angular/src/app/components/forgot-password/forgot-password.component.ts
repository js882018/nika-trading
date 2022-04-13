import { Component, OnInit } from '@angular/core';
import { Validators, FormBuilder, FormGroup } from "@angular/forms";
import { HttpClient, HttpEvent, HttpEventType } from '@angular/common/http';
import { Router, ActivatedRoute } from '@angular/router';
import Swal from 'sweetalert2';
import { NgxSpinnerService } from "ngx-spinner";

import { CommonService } from '../../services/common.service';

@Component({
  selector: 'app-forgot-password',
  templateUrl: './forgot-password.component.html',
  styleUrls: ['./forgot-password.component.css']
})
export class ForgotPasswordComponent implements OnInit {

  public err: any = {};
  public result: any = {};
  public form: any = {};
  public data: any = {};
  public submitted = false;
  constructor(private loader: NgxSpinnerService, private service: CommonService, private router: Router, public fb: FormBuilder) {
    this.service.setTitle('Forgot Password | Nika Trading');

    this.form = this.fb.group({
      email: ['', [Validators.required, Validators.email]]
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
    this.submitted = true;
    if (this.form.invalid) {
      return;
    }
    this.loader.show();
    this.result = await this.service.form_action(this.form.value, '/send-reset-code');
    if (this.result.status == true) {
      this.loader.hide();
      Swal.fire({ icon: 'success', title: 'Success!', text: this.result.message, timer: 1800 });
      setTimeout(() => {
        this.router.navigate(['/login'], { queryParams: { email: this.form.value.email } });
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
