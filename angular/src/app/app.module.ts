import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { CommonModule, HashLocationStrategy, LocationStrategy } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { BrowserModule, Title } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { NgxSpinnerModule } from "ngx-spinner";
import { NgxPaginationModule } from 'ngx-pagination';
import { AutocompleteLibModule } from 'angular-ng-autocomplete';
import { DpDatePickerModule } from 'ng2-date-picker';
import { SelectDropDownModule } from 'ngx-select-dropdown';

import { NotFoundInterceptor } from './not-found.interceptor';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { LoginComponent } from './components/login/login.component';
import { DashboardComponent } from './components/dashboard/dashboard.component';
import { HeaderComponent } from './components/header/header.component';
import { UserManagementComponent } from './components/user-management/user-management.component';
import { AddUserComponent } from './components/user-management/add-user/add-user.component';
import { EditUserComponent } from './components/user-management/edit-user/edit-user.component';
import { ItemsComponent } from './components/items/items.component';
import { CustomersComponent } from './components/customers/customers.component';
import { AddCustomerComponent } from './components/customers/add-customer/add-customer.component';
import { EditCustomerComponent } from './components/customers/edit-customer/edit-customer.component';
import { AddItemComponent } from './components/items/add-item/add-item.component';
import { EditItemComponent } from './components/items/edit-item/edit-item.component';
import { ForgotPasswordComponent } from './components/forgot-password/forgot-password.component';
import { ResetPasswordComponent } from './components/reset-password/reset-password.component';
import { UserRegistrationComponent } from './components/user-registration/user-registration.component';
import { ValidateRegistrationOtpComponent } from './components/validate-registration-otp/validate-registration-otp.component';
import { OrdersComponent } from './components/orders/orders.component';
import { AddOrderComponent } from './components/orders/add-order/add-order.component';
import { EditOrderComponent } from './components/orders/edit-order/edit-order.component';
import { UserWalletsComponent } from './components/user-wallets/user-wallets.component';
import { WithdrawalRequestsComponent } from './components/withdrawal-requests/withdrawal-requests.component';
import { MyWalletComponent } from './components/my-wallet/my-wallet.component';
import { ViewRequestComponent } from './components/withdrawal-requests/view-request/view-request.component';
import { EditProfileComponent } from './components/edit-profile/edit-profile.component';
import { ViewOrderComponent } from './components/orders/view-order/view-order.component';
import { NotFoundComponent } from './components/not-found/not-found.component';
import { SettingsComponent } from './components/settings/settings.component';


@NgModule({
  declarations: [
    AppComponent,
    LoginComponent,
    DashboardComponent,
    HeaderComponent,
    UserManagementComponent,
    AddUserComponent,
    EditUserComponent,
    ItemsComponent,
    CustomersComponent,
    AddCustomerComponent,
    EditCustomerComponent,
    AddItemComponent,
    EditItemComponent,
    ForgotPasswordComponent,
    ResetPasswordComponent,
    UserRegistrationComponent,
    ValidateRegistrationOtpComponent,
    OrdersComponent,
    AddOrderComponent,
    EditOrderComponent,
    UserWalletsComponent,
    WithdrawalRequestsComponent,
    MyWalletComponent,
    ViewRequestComponent,
    EditProfileComponent,
    ViewOrderComponent,
    NotFoundComponent,
    SettingsComponent,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    HttpClientModule,
    BrowserAnimationsModule,
    NgxSpinnerModule,
    NgxPaginationModule,
    AutocompleteLibModule,
    DpDatePickerModule,
    SelectDropDownModule
  ],
  providers: [
    Title,
    { provide: LocationStrategy, useClass: HashLocationStrategy },
    { provide: HTTP_INTERCEPTORS, useClass: NotFoundInterceptor, multi: true }
  ],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
  bootstrap: [AppComponent]
})
export class AppModule { }
