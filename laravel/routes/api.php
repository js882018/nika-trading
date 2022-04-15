<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\Login;
use App\Http\Controllers\Customers;
use App\Http\Controllers\Items;
use App\Http\Controllers\User_management;
use App\Http\Controllers\Orders;
use App\Http\Controllers\Dashboard;
use App\Http\Controllers\Wallet;
use App\Http\Controllers\Profile;

/*
  |--------------------------------------------------------------------------
  | API Routes
  |--------------------------------------------------------------------------
  |
  | Here is where you can register API routes for your application. These
  | routes are loaded by the RouteServiceProvider within a group which
  | is assigned the "api" middleware group. Enjoy building your API!
  |
 */

Route::middleware('auth:sanctum')->get('/user', function (Request $request) {
    return $request->user();
});

Route::group(['middleware' => 'api'], function () {
    Route::get('/clear-cache', function () {
        Artisan::call('cache:clear');
        return "Cache is cleared";
    });
    /* login */
    Route::post('/login', [Login::class, 'action_login']);
    Route::post('/send-reset-code', [Login::class, 'action_send_reset_code']);
    Route::post('/reset-password', [Login::class, 'action_reset_password']);
    Route::post('/dashbord/get-counts', [Dashboard::class, 'get_counts']);
    /* Customers */
    Route::post('/customers', [Customers::class, 'index']);
    Route::post('/customers/get-all-data', [Customers::class, 'get_all_data']);
    Route::get('/customers/get-data/{id}', [Customers::class, 'get_data']);
    Route::post('/customers/add', [Customers::class, 'action_add']);
    Route::put('/customers/edit/{id}', [Customers::class, 'action_edit']);
    Route::delete('/customers/{id}', [Customers::class, 'action_delete']);
    /* user-management */
    Route::post('/user-management', [User_management::class, 'index']);
    Route::get('/users/get-agencies', [User_management::class, 'get_agencies']);
    Route::get('/user-management/get-data/{id}', [User_management::class, 'get_data']);
    Route::post('/user-management/add', [User_management::class, 'action_add']);
    Route::put('user-management/edit/{id}', [User_management::class, 'action_edit']);
    Route::post('/user-management/delete', [User_management::class, 'action_delete']);
    Route::post('/user-management/approve', [User_management::class, 'action_approve']);
    Route::post('/user-management/register', [User_management::class, 'action_register']);
    Route::post('/user-management/validate-otp', [User_management::class, 'action_validate_otp']);
    /* Ietms */
    Route::post('/items', [Items::class, 'index']);
    Route::get('/items/get-all-data', [Items::class, 'get_all_data']);
    Route::get('/items/get-data/{id}', [Items::class, 'get_data']);
    Route::post('/items/add', [Items::class, 'action_add']);
    Route::post('/items/edit/{id}', [Items::class, 'action_edit']);
    Route::delete('/items/{id}', [Items::class, 'action_delete']);
    Route::post('/items/delete-image', [Items::class, 'action_delete_image']);
    /* Orders */
    Route::post('/orders', [Orders::class, 'index']);
    Route::post('/orders/add', [Orders::class, 'action_add']);
    Route::put('/orders/edit/{id}', [Orders::class, 'action_edit']);
    Route::get('/orders/get-data/{id}', [Orders::class, 'get_data']);
    Route::delete('/orders/{id}', [Orders::class, 'action_delete']);
    Route::post('/orders/update-status', [Orders::class, 'action_update_status']);
    /* Wallet */
    Route::post('/user-wallets', [Wallet::class, 'action_user_wallets']);
    Route::delete('/user-wallets/{id}', [Wallet::class, 'delete_user_wallet']);
    Route::post('/withdrawal-request/approve', [Wallet::class, 'action_withdrawal_approve']);
    Route::post('/withdrawal-request/send', [Wallet::class, 'action_withdrawal_send']);
    Route::post('/wallet-transactions', [Wallet::class, 'action_wallet_transactions']);
    Route::get('/wallet-transactions/get-data/{id}', [Wallet::class, 'get_wallet_transactions_data']);
    Route::post('/withdrawal-request/delete-attachment', [Wallet::class, 'action_delete_attachment']);
    /* Profile */
    Route::put('/profile/update/{id}', [Profile::class, 'action_edit']);
});
