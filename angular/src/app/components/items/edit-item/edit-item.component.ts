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
  selector: 'app-edit-item',
  templateUrl: './edit-item.component.html',
  styleUrls: ['./edit-item.component.css']
})
export class EditItemComponent implements OnInit {

  public id: any;
  public err: any = {};
  public result: any = {};
  public data: any = {};
  public form: any = {};
  public submitted = false;

  constructor(private service: CommonService, private router: Router, private activatedRouter: ActivatedRoute,
    public fb: FormBuilder, private loader: NgxSpinnerService, private sanitizer: DomSanitizer,
    public login: LoginService) {
    this.service.setTitle('Edit Item | Nika Trading');
    this.id = this.activatedRouter.snapshot.paramMap.get('id');
    this.form = this.fb.group({
      name: ['', Validators.required],
      hsn_sac: ['', Validators.required],
      price: ['', [Validators.required, Validators.pattern('\^([\\d]{0,10})(\\.|$)([\\d]{1,4}|)$')]]
    });
  }

  ngOnInit(): void {
    this.get_data();
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

  public async get_data() {
    this.loader.show();
    var formData = {
      id: this.id
    };
    this.result = await this.service.get_action(formData, '/items/get-data/' + this.id);
    if (this.result == 'unknown_error') {
      this.loader.hide();
    } else {
      this.loader.hide();
      if (this.result.status == true) {
        this.data = this.result.data;
        this.form.patchValue({
          name: this.data.name,
          hsn_sac: this.data.hsn_sac,
          price: this.data.price
        });
      }
    }
  }

  public async doFormAction() {
    this.err = {};
    this, this.service._gotoTop();
    this.submitted = true;
    if (this.form.invalid) {
      return;
    }
    this.loader.show();
    this.result = await this.service.update_action(this.form.value, '/items/edit/' + this.id);
    if (this.result.status == true) {
      this.loader.hide();
      setTimeout(() => {
        this.router.navigate(['/items']);
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