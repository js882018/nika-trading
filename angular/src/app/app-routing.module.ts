import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LoginService as AuthGuard } from './services/login.service';
import { CommonService as DashboardGuard } from './services/common.service';

import { LoginComponent } from './components//login/login.component';
import { ForgotPasswordComponent } from './components/forgot-password/forgot-password.component';
import { ResetPasswordComponent } from './components/reset-password/reset-password.component';
import { DashboardComponent } from './components/dashboard/dashboard.component';
//import { AgencyComponent } from './components/agency/agency.component';
//import { AddAgencyComponent } from './components/agency/add-agency/add-agency.component';
//import { EditAgencyComponent } from './components/agency/edit-agency/edit-agency.component';
import { UserManagementComponent } from './components/user-management/user-management.component';
import { AddUserComponent } from './components/user-management/add-user/add-user.component';
import { EditUserComponent } from './components/user-management/edit-user/edit-user.component';
import { ItemsComponent } from './components/items/items.component';
import { AddItemComponent } from './components/items/add-item/add-item.component';
import { EditItemComponent } from './components/items/edit-item/edit-item.component';
import { CustomersComponent } from './components/customers/customers.component';
import { AddCustomerComponent } from './components/customers/add-customer/add-customer.component';
import { EditCustomerComponent } from './components/customers/edit-customer/edit-customer.component';
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

const routes: Routes = [
  { path: '', component: LoginComponent, canActivate: [DashboardGuard], data: { page: 'login' } },
  { path: 'login', component: LoginComponent, canActivate: [DashboardGuard], data: { page: 'login' } },
  { path: 'forgot-password', component: ForgotPasswordComponent, canActivate: [DashboardGuard], data: { page: 'login' } },
  { path: 'reset-password', component: ResetPasswordComponent, canActivate: [DashboardGuard], data: { page: 'login' } },
  { path: 'user-registration', component: UserRegistrationComponent, canActivate: [DashboardGuard], data: { page: 'login' } },
  { path: 'validate-registration-otp', component: ValidateRegistrationOtpComponent, canActivate: [DashboardGuard], data: { page: 'login' } },
  { path: 'dashboard', component: DashboardComponent, canActivate: [AuthGuard], data: { page: 'dashboard' } },
  //{ path: 'agencies', component: AgencyComponent, canActivate: [AuthGuard], data: { page: 'dashboard' } },
  //{ path: 'agencies/add', component: AddAgencyComponent, canActivate: [AuthGuard], data: { page: 'dashboard' } },
  //{ path: 'agencies/edit/:id', component: EditAgencyComponent, canActivate: [AuthGuard], data: { page: 'dashboard' } },
  { path: 'customers', component: CustomersComponent, canActivate: [AuthGuard], data: { page: 'dashboard' } },
  { path: 'customers/add', component: AddCustomerComponent, canActivate: [AuthGuard], data: { page: 'dashboard' } },
  { path: 'customers/edit/:id', component: EditCustomerComponent, canActivate: [AuthGuard], data: { page: 'dashboard' } },
  { path: 'user-management', component: UserManagementComponent, canActivate: [AuthGuard], data: { page: 'dashboard' } },
  { path: 'user-management/add', component: AddUserComponent, canActivate: [AuthGuard], data: { page: 'dashboard' } },
  { path: 'user-management/edit/:id', component: EditUserComponent, canActivate: [AuthGuard], data: { page: 'dashboard' } },
  { path: 'items', component: ItemsComponent, canActivate: [AuthGuard], data: { page: 'dashboard' } },
  { path: 'items/add', component: AddItemComponent, canActivate: [AuthGuard], data: { page: 'dashboard' } },
  { path: 'items/edit/:id', component: EditItemComponent, canActivate: [AuthGuard], data: { page: 'dashboard' } },
  { path: 'orders', component: OrdersComponent, canActivate: [AuthGuard], data: { page: 'dashboard' } },
  { path: 'orders/add', component: AddOrderComponent, canActivate: [AuthGuard], data: { page: 'dashboard' } },
  { path: 'orders/edit/:id', component: EditOrderComponent, canActivate: [AuthGuard], data: { page: 'dashboard' } },
  { path: 'orders/view/:id', component: ViewOrderComponent, canActivate: [AuthGuard], data: { page: 'dashboard' } },
  { path: 'user-wallet', component: UserWalletsComponent, canActivate: [AuthGuard], data: { page: 'dashboard' } },
  { path: 'withdrawal-requests', component: WithdrawalRequestsComponent, canActivate: [AuthGuard], data: { page: 'dashboard' } },
  { path: 'withdrawal-requests/view/:id', component: ViewRequestComponent, canActivate: [AuthGuard], data: { page: 'dashboard' } },
  { path: 'my-wallet', component: MyWalletComponent, canActivate: [AuthGuard], data: { page: 'dashboard' } },
  { path: 'edit-profile', component: EditProfileComponent, canActivate: [AuthGuard], data: { page: 'dashboard' } },
  { path: 'not-found', component: NotFoundComponent, canActivate: [AuthGuard], data: { page: 'dashboard' } },
  
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
