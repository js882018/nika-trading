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
  selector: 'app-add-item',
  templateUrl: './add-item.component.html',
  styleUrls: ['./add-item.component.css']
})
export class AddItemComponent implements OnInit {

  public err: any = {};
  public result: any = {};
  public data: any = {};
  public form: any = {};
  public submitted = false;

  public preview_image = 'assets/images/dummy.jpg';
  public image_validation: any;

  constructor(private service: CommonService, private router: Router, private activatedRouter: ActivatedRoute,
    public fb: FormBuilder, private loader: NgxSpinnerService, private sanitizer: DomSanitizer,
    public login: LoginService) {
    this.service.setTitle('Add Item | Nika Trading');
    this.form = this.fb.group({
      name: ['', Validators.required],
      hsn_sac: ['', Validators.required],
      price: ['', [Validators.required, Validators.pattern('\^([\\d]{0,10})(\\.|$)([\\d]{1,4}|)$')]],
      image: [''],
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
    this.result = await this.service.form_action(formData, '/items/add');
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
