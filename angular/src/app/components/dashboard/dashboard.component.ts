import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, FormArray, FormControl, Validators } from "@angular/forms";
import { HttpClient, HttpEvent, HttpEventType } from '@angular/common/http';
import { Router, ActivatedRoute } from '@angular/router';
import { NgxSpinnerService } from "ngx-spinner";
import Swal from 'sweetalert2';

import { CommonService } from '../../services/common.service';
import { LoginService } from '../../services/login.service';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent implements OnInit {

  public err: any = {};
  public result: any = {};
  public data: any = {};
  public count: any = {};

  public search_form: any = {};
  public datalist: any = [];

  search_term = '';
  per_page = 10;
  page = 1;
  total = 0;

  public current_id: any;
  public current_role: any;

  constructor(private service: CommonService, private router: Router, public fb: FormBuilder, private spinner: NgxSpinnerService, public login: LoginService) {
    this.service.setTitle('Dashboard | Nika Trading');
    this.current_id = this.login.getSessionData('session_id');
    this.current_role = this.login.getSessionData('session_role');
  }

  ngOnInit(): void {
    this.get_box_counts();
    this.data_list();
  }

  public async get_box_counts() {
    var formData = {
      search: '',
      user_id: this.current_id,
      user_role: this.current_role
    };
    this.result = await this.service.form_action(formData, '/dashbord/get-counts');
    if (this.result == 'unknown_error') {
    } else {
      this.count = this.result;
    }
  }

  public async data_list() {
    this.err = {};
    var formData = {
      page: this.page,
      per_page: this.per_page,
      search: this.search_term,
      sort: 'id',
      dir: 'desc',
      user_id: this.current_id,
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

}
