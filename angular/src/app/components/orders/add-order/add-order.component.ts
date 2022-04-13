import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, FormArray, FormControl, Validators, AbstractControl, ValidatorFn } from "@angular/forms";
import { HttpClient, HttpEvent, HttpEventType } from '@angular/common/http';
import { Router, ActivatedRoute } from '@angular/router';
import { NgxSpinnerService } from "ngx-spinner";
import { DomSanitizer } from '@angular/platform-browser';
import Swal from 'sweetalert2';

import { DatePipe, formatDate } from '@angular/common';

import { CommonService } from '../../../services/common.service';
import { LoginService } from '../../../services/login.service';

@Component({
  selector: 'app-add-order',
  templateUrl: './add-order.component.html',
  styleUrls: ['./add-order.component.css'],
  providers: [DatePipe]
})
export class AddOrderComponent implements OnInit {

  public err: any = {};
  public result: any = {};
  public data: any = {};
  public form: any = {};
  public submitted = false;

  public items_data: any = [];
  public itmes_selected_array: any = [];

  public customers_data: any = [];
  public total_amount: any;
  public datePickerConfig: any = {};
  public itemSelectSettings: any = {};
  public curentDate: any = new Date();
  public current_id: any;
  public current_role: any;

  public keyword = 'name';
  public show_existing: boolean = true;
  constructor(private service: CommonService, private router: Router, private activatedRouter: ActivatedRoute,
    public fb: FormBuilder, private loader: NgxSpinnerService, private sanitizer: DomSanitizer,
    public login: LoginService, private datePipe: DatePipe) {
    this.service.setTitle('Add Order | Nika Trading');
    this.total_amount = '0';
    this.curentDate = this.datePipe.transform(this.curentDate, 'dd-MM-yyy');
    this.current_id = this.login.getSessionData('session_id');
    this.current_role = this.login.getSessionData('session_role');
    this.form = this.fb.group({
      customer_name: [''],
      customer_id: [''],
      email: [''],
      phone: [''],
      customer_type: ['2'],//1 - New, 2 -Existing
      total_amount: ['', [Validators.required, Validators.pattern('\^([\\d]{0,10})(\\.|$)([\\d]{1,4}|)$')]],
      shipment_date: [this.curentDate],
      order_items: this.fb.array([]),
      user_id: this.current_id,
      user_role: this.current_role
    });
  }

  ngOnInit(): void {
    this.get_item_lists();
    this.add_more_items();
    this.get_customer_lists();
    this.datePickerConfig = {
      'format': 'DD-MM-YYYY',
      'mode': 'month',
      'disableKeypress': true,
      'enableMonthSelector': true,
      'showGoToCurrent': false,
      'showMultipleYearsNavigation': true,
      'min': this.curentDate
    };

    this.itemSelectSettings = {
      displayKey: "name", //if objects array passed which key to be displayed defaults to description
      search: true, //true/false for the search functionlity defaults to false,
      height: 'auto', //height of the list so that if there are more no of items it can show a scroll defaults to auto. With auto height scroll will never appear
      placeholder: 'Select', // text to be displayed when no item is selected defaults to Select,
      noResultsFound: 'No results found!', // text to be displayed when no items are found while searching
      searchPlaceholder: 'Search', // label thats displayed in search input,
      searchOnKey: 'name', // key on which search should be performed this will be selective search. if undefined this will be extensive search on all keys
      clearOnSelection: true // clears search criteria when an option is selected if set to true, default is false
    }
  }

  public async get_customer_lists() {
    this.loader.show();
    var formData = {
      user_id: this.login.getSessionData('session_id'),
      user_role: this.login.getSessionData('session_role')
    };
    this.result = await this.service.form_action(formData, '/customers/get-all-data');
    if (this.result == 'unknown_error') {
      this.loader.hide();
    } else {
      this.loader.hide();
      this.customers_data = this.result.data;
    }
  }

  public async get_item_lists() {
    var formData = {
      search: ''
    };
    this.result = await this.service.get_action(formData, '/items/get-all-data');
    if (this.result == 'unknown_error') {
    } else {
      if (this.result.status == true) {
        this.items_data = this.result.data;
      }
    }
  }

  public filter_selected_items() {
    this.itmes_selected_array = [];
    this.order_items.controls.forEach((element: any, i: any) => {
      let item_id = this.form.controls['order_items'].at(i).controls.item_id.value;
      this.itmes_selected_array.push(item_id);
    });
  }

  select_customer(data: any) {
    this.form.patchValue({
      customer_id: data.id,
      customer_name: data.name
    });
  }

  get order_items() {
    return this.form.get('order_items') as FormArray;
  }

  add_more_items() {
    this.order_items.push(this.fb.group({
      item_id: ['', this.checkDuplicateItem()],
      item_name: ['', Validators.required],
      quantity: ['', [Validators.required, Validators.pattern('^[0-9]*$')]],
      unit_price: ['', [Validators.required, Validators.pattern('\^([\\d]{0,10})(\\.|$)([\\d]{1,4}|)$')]],
      total_price: ['0.00']
    }));
  }

  remove_items(index: any) {
    this.order_items.removeAt(index);
  }

  checkDuplicateItem(): ValidatorFn {
    return (control: AbstractControl): { [key: string]: boolean } | null => {
      if (control.value !== '' && this.itmes_selected_array.includes(control.value)) {
        return { 'checkDuplicateItem': true };
      }
      return null;
    };
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

  validate_add_more_error(i: any, fieldset: any, field: any, rule: any) {
    if ((this.submitted || this.form_errors[fieldset].touched) && this.form_errors[fieldset].controls[i].controls[field].errors && this.form_errors[fieldset].controls[i].controls[field].errors[rule]) {
      return false;
    }
    return true;
  }

  // public on_select_item(event: any, index: any) {
  //   let selectedIndex: number = event.target["selectedIndex"];
  //   var price = event.target.options[selectedIndex].getAttribute("data-price");
  //   var unit_price_val = price != '' && price !== null ? price : '0.00';
  //   var unit_price_field = <HTMLInputElement>document.querySelector("#unit_price_" + index);
  //   unit_price_field.value = unit_price_val;
  //   this.form.controls['order_items'].at(index).controls.unit_price.setValue(unit_price_val);
  //   this.form.controls['order_items'].at(index).controls.quantity.setValue('');
  //   this.form.controls['order_items'].at(index).controls.total_price.setValue('0.00');
  // }

  public on_select_item(event: any, index: any) {
    /*first filter the selected items*/
    this.filter_selected_items();
    var price = event.value.price;
    var unit_price_val = price != '' && price !== null ? price : '0.00';
    this.form.controls['order_items'].at(index).controls.item_id.setValue(event.value.id);
    this.form.controls['order_items'].at(index).controls.item_name.setValue(event.value.name);
    this.form.controls['order_items'].at(index).controls.unit_price.setValue(unit_price_val);
    this.form.controls['order_items'].at(index).controls.quantity.setValue('');
    this.form.controls['order_items'].at(index).controls.total_price.setValue('0.00');
  }

  public numberOnly(event: any): boolean {
    const charCode = (event.which) ? event.which : event.keyCode;
    if (charCode == 46 || (charCode >= 48 && charCode <= 57)) {
      return true;
    }
    return false;
  }

  public change_item_price(event: any, index: any) {
    this.amount_calculation(index);
  }

  public change_item_quantity(event: any, index: any) {
    this.amount_calculation(index);
  }

  public amount_calculation(index: any) {
    this.total_amount = 0;

    let unit_price = this.form.controls['order_items'].at(index).controls.unit_price.value ? this.form.controls['order_items'].at(index).controls.unit_price.value : 0;
    let quantity = this.form.controls['order_items'].at(index).controls.quantity.value ? this.form.controls['order_items'].at(index).controls.quantity.value : 0;
    let price_total = parseFloat(quantity) * parseFloat(unit_price);
    let total_price = price_total.toFixed(1);
    this.form.controls['order_items'].at(index).controls.total_price.setValue(total_price);

    this.order_items.controls.forEach((element: any, i: any) => {
      let price = this.form.controls['order_items'].at(i).controls.total_price.value ? this.form.controls['order_items'].at(i).controls.total_price.value : 0;
      this.total_amount = parseFloat(price) + parseFloat(this.total_amount);
    });
    this.form.patchValue({ total_amount: this.total_amount.toFixed(2) });
  }

  public change_customer_type(value: any) {
    if (value == '1') {
      this.show_existing = false;
    } else {
      this.show_existing = true;
    }
    console.log(this.show_existing);
    this.form.patchValue({
      customer_id: '',
      customer_name: '',
      customer_type: value
    });
  }

  public async doFormAction() {
    this.err = {};
    this, this.service._gotoTop();
    this.submitted = true;
    if (this.form.invalid) {
      return;
    }
    this.loader.show();
    this.result = await this.service.form_action(this.form.value, '/orders/add');
    if (this.result.status == true) {
      this.loader.hide();
      setTimeout(() => {
        this.router.navigate(['/orders']);
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
