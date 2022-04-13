import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, FormArray, FormControl, Validators } from "@angular/forms";
import { Router, ActivatedRoute } from '@angular/router';
import { NgxSpinnerService } from "ngx-spinner";
import Swal from 'sweetalert2';

import { CommonService } from '../../services/common.service';
import { LoginService } from '../../services/login.service';

@Component({
  selector: 'app-user-management',
  templateUrl: './user-management.component.html',
  styleUrls: ['./user-management.component.css']
})
export class UserManagementComponent implements OnInit {

  public err: any = {};
  public result: any = {};
  public data: any = {};
  public search_form: any = {};
  public datalist: any = [];
  public current_role: any;

  search_term = '';
  per_page = 10;
  page = 1;
  total = 0;

  constructor(private service: CommonService, private router: Router, public fb: FormBuilder, private spinner: NgxSpinnerService, public login: LoginService) {
    this.service.setTitle('All Users | Nika Trading');
    this.current_role = this.login.getSessionData('session_role');
    this.search_form = this.fb.group({ user_name: [''], user_role: [''] });
  }

  ngOnInit(): void {
    this.data_list();
  }

  doSearch() {
    this.page = 0;
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
      user_name: this.search_form.value.user_name,
      user_role: this.search_form.value.user_role,
      current_role: this.current_role,
      user_id: this.login.getSessionData('session_id'),
    };
    this.spinner.show();
    this.result = await this.service.form_action(formData, '/user-management');
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

  public deleteRow(id: any, user_details_id: any) {
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
        this.deleteAction(id, user_details_id);
      }
    });
  }

  public async deleteAction(id: any, user_details_id: any) {
    var formData = {
      id: id,
      user_details_id: user_details_id
    };
    this.spinner.show();
    this.result = await this.service.form_action(formData, '/user-management/delete');
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

  public approveRow(id: any) {
    Swal.fire({
      title: 'Are you sure?',
      text: "You won't be able to revert this!",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Approve',
      cancelButtonText: 'Cancel',
    }).then((action) => {
      if (action.isConfirmed) {
        this.approveAction(id);
      }
    });
  }

  public async approveAction(id: any) {
    var formData = {
      id: id
    };
    this.spinner.show();
    this.result = await this.service.form_action(formData, '/user-management/approve');
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

}
