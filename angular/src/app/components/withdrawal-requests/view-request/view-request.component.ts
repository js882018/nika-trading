import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, FormArray, FormControl, Validators } from "@angular/forms";
import { HttpClient, HttpEvent, HttpEventType } from '@angular/common/http';
import { Router, ActivatedRoute } from '@angular/router';
import { NgxSpinnerService } from "ngx-spinner";
import { DomSanitizer } from '@angular/platform-browser';
import Swal from 'sweetalert2';
declare var require: any
const FileSaver = require('file-saver');

import { CommonService } from '../../../services/common.service';
import { LoginService } from '../../../services/login.service';

@Component({
  selector: 'app-view-request',
  templateUrl: './view-request.component.html',
  styleUrls: ['./view-request.component.css']
})
export class ViewRequestComponent implements OnInit {

  public id: any;
  public err: any = {};
  public result: any = {};
  public data: any = {};
  public form: any = {};
  public filename: any = {};
  public submitted = false;

  constructor(private service: CommonService, private router: Router, private activatedRouter: ActivatedRoute,
    public fb: FormBuilder, private loader: NgxSpinnerService, private sanitizer: DomSanitizer,
    public login: LoginService) {
    this.service.setTitle('View Withdrawal Request | Nika Trading');
    this.id = this.activatedRouter.snapshot.paramMap.get('id');

    this.form = this.fb.group({
      amount: [''],
      status: ['', Validators.required],
      comments: [''],
      attachment: ['']
    });
  }

  ngOnInit(): void {
    this.get_data();
  }

  public async get_data() {
    this.loader.show();
    var formData = {
      id: this.id
    };
    this.result = await this.service.get_action(formData, '/wallet-transactions/get-data/' + this.id);
    if (this.result == 'unknown_error') {
      this.loader.hide();
    } else {
      this.loader.hide();
      if (this.result.status == true) {
        this.data = this.result.data;

        this.form.patchValue({
          amount: this.data.amount,
          status: this.data.status,
          comments: this.data.comments
        });
      }
    }
  }

  onFileChange(event: any) {
    if (event.target.files[0].size < 5000000) {//10 mb
      const file = (event.target as HTMLInputElement)?.files?.[0];
      this.form.patchValue({
        attachment: file
      });
      // console.log(file);
      this.form.get('attachment').updateValueAndValidity()
      //this.filename = file.name;
    } else {
      Swal.fire({ icon: 'warning', title: 'Alert!', text: 'Maximum video upload size is 5 MB' });
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

  public downloadAttachments(fileUrl: string, fileName: string) {
    FileSaver.saveAs(fileUrl, fileName);
  }

  public async doFormAction() {
    this.err = {};
    this, this.service._gotoTop();
    this.submitted = true;
    if (this.form.invalid) {
      return;
    }
    var formData: any = new FormData();
    formData.append("id", this.id);
    formData.append("user_id", this.data.user_id);
    formData.append("amount", this.form.value.amount);
    formData.append("status", this.form.value.status);
    formData.append("comments", this.form.value.comments);
    formData.append("attachment", this.form.value.attachment);
    this.loader.show();
    this.result = await this.service.form_action(formData, '/withdrawal-request/approve');
    if (this.result.status == true) {
      this.loader.hide();
      setTimeout(() => {
        this.router.navigate(['/withdrawal-requests']);
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
