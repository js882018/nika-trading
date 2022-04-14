import { Component, OnInit } from '@angular/core';
import { Validators, FormBuilder, FormGroup } from "@angular/forms";
import { HttpClient, HttpEvent, HttpEventType } from '@angular/common/http';
import { Router, ActivatedRoute } from '@angular/router';
import Swal from 'sweetalert2';
import { NgxSpinnerService } from "ngx-spinner";

import { LoginService } from '../../services/login.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {

  public err: any = {};
  public result: any = {};
  public form: any = {};
  public data: any = {};
  public submitted = false;
  constructor(private loader: NgxSpinnerService, private login: LoginService, private router: Router, public fb: FormBuilder) {
    this.login.setTitle('Login | Nika Trading');

    this.form = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', Validators.required]
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

  public async doLogin() {
    this.err = {};
    this.submitted = true;
    if (this.form.invalid) {
      return;
    }
    this.loader.show();
    this.result = await this.login.doLogin(this.form.value);
    if (this.result.status == true) {
      this.loader.hide();
      Swal.fire({ icon: 'success', title: 'Success!', text: this.result.message, timer: 1500 });
      setTimeout(() => {
        this.router.navigate(['/dashboard']);
      }, 1000);
    } else {
      this.loader.hide();
      if (this.result.code == 202) {
        this.err = {};
        Swal.fire({ icon: 'error', title: 'Error!', text: this.result.message, timer: 2000 });
      } else {
        this.err = this.result.message;
      }
    }
  }

}