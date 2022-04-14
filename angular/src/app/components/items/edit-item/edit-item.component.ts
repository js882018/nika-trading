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

  public preview_image: any;
  public image_validation: any;

  constructor(private service: CommonService, private router: Router, private activatedRouter: ActivatedRoute,
    public fb: FormBuilder, private loader: NgxSpinnerService, private sanitizer: DomSanitizer,
    public login: LoginService) {
    this.service.setTitle('Edit Item | Nika Trading');
    this.id = this.activatedRouter.snapshot.paramMap.get('id');
    this.form = this.fb.group({
      name: ['', Validators.required],
      hsn_sac: ['', Validators.required],
      price: ['', [Validators.required, Validators.pattern('\^([\\d]{0,10})(\\.|$)([\\d]{1,4}|)$')]],
      image: ['']
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
        this.preview_image = this.data.image_url != '' ? this.data.image_url : 'assets/images/dummy.jpg';
        this.form.patchValue({
          name: this.data.name,
          hsn_sac: this.data.hsn_sac,
          price: this.data.price,
          image: ''
        });
      }
    }
  }

  onFileChange(event: any) {
    this.image_validation = '';
    const reader = new FileReader();
    if (event.target.files && event.target.files.length) {
      const file: any = (event.target as HTMLInputElement)?.files?.[0];
      var mimeType = file.type;
      var fileSize = file.size;
      if (mimeType.match(/image\/*/) == null) {
        this.image_validation = 'Please upload the valid image(png/jpg).';
        return;
      }
      if (file < 5000000) {
        this.image_validation = 'Maximum video upload size is 5 MB.';
        return;
      }
      this.form.patchValue({
        image: file
      });
      console.log(fileSize);
      this.form.get('image').updateValueAndValidity();
      reader.readAsDataURL(file);
      reader.onload = () => {
        this.preview_image = reader.result as string;
      };
    }
  }

  public delete_item_image() {
    Swal.fire({
      title: 'Are you sure?',
      text: "You won't be able to revert this!",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Delete',
      cancelButtonText: 'Cancel',
    }).then((action) => {
      if (action.isConfirmed) {
        this.delete_image_action();
      }
    });
  }

  public async delete_image_action() {
    var formData = { id: this.id };
    this.loader.show();
    this.result = await this.service.form_action(formData, '/items/delete-image');
    if (this.result == 'unknown_error') {
      Swal.fire({ icon: 'error', title: 'Error!', text: 'Something went wrong. Please try again later.' });
      this.loader.hide();
    } else {
      this.loader.hide();
      if (this.result.status == false) {
        if (this.result.code == 202) {
          Swal.fire({ icon: 'error', title: 'Error!', text: this.result.message });
        } else {
          this.err = this.result.errors;
        }
      } else {
        Swal.fire({ icon: 'success', title: 'Success!', text: this.result.message, timer: 1500 });
        setTimeout(() => {
          this.get_data();
        }, 1500);
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
    var formData: any = new FormData();
    formData.append("name", this.form.value.name);
    formData.append("hsn_sac", this.form.value.hsn_sac);
    formData.append("price", this.form.value.price);
    formData.append("image", this.form.value.image);
    this.loader.show();
    this.result = await this.service.form_action(formData, '/items/edit/' + this.id);
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
