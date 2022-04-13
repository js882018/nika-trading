import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, FormArray, FormControl, Validators } from "@angular/forms";
import { Router, ActivatedRoute } from '@angular/router';
import { NgxSpinnerService } from "ngx-spinner";
import Swal from 'sweetalert2';

import { CommonService } from '../../services/common.service';
import { LoginService } from '../../services/login.service';

@Component({
  selector: 'app-orders',
  templateUrl: './orders.component.html',
  styleUrls: ['./orders.component.css']
})
export class OrdersComponent implements OnInit {

  public err: any = {};
  public result: any = {};
  public data: any = {};
  public search_form: any = {};
  public form: any = {};
  public datalist: any = [];
  public submitted = false;

  search_term = '';
  per_page = 10;
  page = 1;
  total = 0;
  public current_role: any;
  public current_row_status: any;

  public showModal: boolean = false;
  constructor(public login: LoginService, private service: CommonService, private router: Router, public fb: FormBuilder, private spinner: NgxSpinnerService) {
    this.service.setTitle('All Orders | Nika Trading');
    this.search_form = this.fb.group({ name: [''] });

    this.current_role = this.login.getSessionData('session_role');
    this.form = this.fb.group({
      order_id: [''],
      order_status: ['', Validators.required],
    });
  }

  ngOnInit(): void {
    this.data_list();
  }

  public async data_list() {
    this.err = {};
    var formData = {
      page: this.page,
      per_page: this.per_page,
      search: this.search_term,
      sort: 'id',
      dir: 'desc',
      user_id: this.login.getSessionData('session_id'),
      user_role: this.current_role
    };
    this.spinner.show();
    this.result = await this.service.form_action(formData, '/orders');
    if (this.result == 'unknown_error') {
      Swal.fire({ icon: 'error', title: 'Error!', text: 'Something went wrong. Please try again later.' });
      this.spinner.hide();
    } else {
      this.spinner.hide();
      this.datalist = this.result.data;
      this.total = this.result.total;
    }
  }

  public pageChanged(page: any) {
    this.spinner.show();
    let total_pages = this.total / this.per_page;
    this.page = page;
    this.data_list();
  }

  public deleteRow(id: any) {
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
        this.deleteAction(id);
      }
    });
  }

  public async deleteAction(id: any) {
    this.spinner.show();
    this.result = await this.service.delete_action('/orders/' + id);
    if (this.result == 'unknown_error') {
      Swal.fire({ icon: 'error', title: 'Error!', text: 'Something went wrong. Please try again later.' });
      this.spinner.hide();
    } else {
      this.spinner.hide();
      if (this.result.status == false) {
        if (this.result.code == 202) {
          Swal.fire({ icon: 'error', title: 'Error!', text: this.result.message });
        } else {
          this.err = this.result.errors;
        }
      } else {
        Swal.fire({ icon: 'success', title: 'Success!', text: this.result.message, timer: 1500 });
        setTimeout(() => {
          this.data_list();
        }, 1500);
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

  public show_modal(id: any, status: any) {
    this.current_row_status = status;
    this.form = this.fb.group({
      order_id: [id],
      order_status: [status, Validators.required],
    });
    this.showModal = true;
  }

  public hide_modal() {
    this.showModal = false;
  }

  public async doFormAction() {
    this.err = {};
    this, this.service._gotoTop();
    this.submitted = true;
    if (this.form.invalid) {
      return;
    }
    this.spinner.show();
    this.result = await this.service.form_action(this.form.value, '/orders/update-status');
    this.showModal = false;
    if (this.result.status == true) {
      this.spinner.hide();
      setTimeout(() => {
        window.location.reload();
      }, 1000);
      Swal.fire({ icon: 'success', title: 'Success!', text: this.result.message, timer: 1500 });
    } else {
      this.spinner.hide();
      if (this.result.code == 202) {
        this.err = {};
        Swal.fire({ icon: 'error', title: 'Error!', text: this.result.message, timer: 1500 });
      } else {
        this.err = this.result.message;
      }
    }
  }

}
