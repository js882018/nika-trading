<?php

namespace App\Http\Controllers;

use App\Http\Controllers\Controller;
use App\Models\Crud as crud_model;
use App\Models\Orders as orders_model;
use Illuminate\Support\Facades\Validator;
use Illuminate\Http\Request;

class Orders extends Controller {

    public function index(Request $request) {
        $data = orders_model::datatable($request);
        if (!empty($data)) {
            $rows = array();
            foreach ($data as $key => $value) {
                $row = array();
                $row['id'] = $value->id;
                $row['order_id'] = $value->reference_id;
                $row['customer_name'] = $value->customer_name;
                $row['user_name'] = $value->user_name;
                $row['total_amount'] = $value->total_amount;
                $row['shipment_date'] = $value->shipment_date != '0000-00-00' ? date('d-m-Y', strtotime($value->shipment_date)) : '--';
                $row['status'] = $value->status;
                $row['status_name'] = $this->order_status($value->status);
                $rows[] = $row;
            }
        }
        return response()->json(array(
                    'status' => true,
                    'data' => $rows,
                    'total' => orders_model::count_filtered($request),
                    'code' => 200
        ));
    }

    public function get_data(Request $request) {
        $result = orders_model::get_data($request->id);
        if (!empty($result)) {
            $result->shipment_date = $result->shipment_date != '0000-00-00' ? date('d-m-Y', strtotime($result->shipment_date)) : '';
            $result->created_date = $result->created_date != '' ? date('d-m-Y h:i:s a', strtotime($result->created_date)) : '--';
            $result->status_name = $this->order_status($result->status);
            $item_details = crud_model::get_result('order_items', array('order_id' => $request->id));
            return response()->json(array(
                        'status' => true,
                        'data' => $result,
                        'item_details' => $item_details,
                        'code' => 200
            ));
        } else {
            return response()->json(array(
                        'status' => false,
                        'message' => 'No Data Found',
                        'code' => 404
                            ), 404);
        }
    }

    public function action_add(Request $request) {
        $next_id = crud_model::getNextId('orders');
        $rules = [
            'customer_id' => 'required',
        ];
        if ($request->input('customer_type') == 1) {
            $rules['email'] = 'bail|nullable|email|unique:customers,email';
            $rules['phone'] = 'bail|required|regex:/^[0-9]*$/|unique:customers,phone';
        }
        $validation = Validator::make($request->all(), $rules);
        if ($validation->fails()) {
            return response()->json(array(
                        'status' => false,
                        'message' => array_combine($validation->errors()->keys(), $validation->errors()->all()),
                        'error_keys' => $validation->errors()->keys(),
                        'error_messages' => $validation->errors()->all(),
                        'code' => 200
            ));
        } else {
            if ($request->input('customer_type') == 1) {
                $customer_data = array(
                    'name' => $request->input('customer_id'),
                    'email' => $request->input('email'),
                    'phone' => $request->input('phone'),
                    'location' => $request->input('location'),
                    'gst_no' => $request->input('gst_no'),
                    'landmark' => $request->input('landmark'),
                    'address' => $request->input('address'),
                    'created_date' => date('Y-m-d h:i:s'),
                    'created_by' => $request->input('user_id')
                );
                $customer_id = crud_model::do_insert($customer_data, 'customers');
            }
            $data = array(
                'reference_id' => $this->get_order_reference($next_id),
                'customer_id' => $request->input('customer_type') == 2 ? $request->input('customer_id') : $customer_id,
                'total_amount' => $request->input('total_amount'),
                'shipment_date' => $request->input('shipment_date') != '' ? date('Y-m-d', strtotime($request->input('shipment_date'))) : '',
                'created_by' => $request->input('user_id'),
                'status' => 1, //open
                'created_date' => date('Y-m-d h:i:s')
            );
            if ($request->input('user_role') == 1) {//admin
                $data['status'] = 2; //approved
            } else {
                $data['status'] = 1; //open
            }
            $req = crud_model::do_insert($data, 'orders');
            if ($req) {
                $this->save_item_details($request->input('order_items'), $req);
//                if ($data['status'] == 2) {
//                    $this->action_credit_wallet($data['total_amount'], $data['created_by'], $req);
//                }
                return response()->json(array(
                            'status' => true,
                            'message' => 'Order has been created successfully.',
                            'code' => 200
                ));
            } else {
                return response()->json(array(
                            'status' => false,
                            'message' => 'Something went wrong! Please try again.',
                            'code' => 202
                ));
            }
        }
    }

    public function save_item_details($order_items, $order_id, $edit = false) {
        if ($edit == true) {
            crud_model::do_delete('order_items', array('order_id' => $order_id));
        }
        foreach ($order_items as $value) {
            $item_data = array(
                'order_id' => $order_id,
                'item_id' => $value['item_id'],
                'item_name' => $value['item_name'],
                'quantity' => $value['quantity'],
                'unit_price' => $value['unit_price'],
                'total_price' => $value['total_price']
            );
            crud_model::do_insert($item_data, 'order_items');
        }
    }

    public function action_credit_wallet($total_amount, $user, $order_id) {
        $existing_data = crud_model::get_row('wallet', array('user_id' => $user));
        $wallet_amount = self::get_wallet_amount($total_amount);
        if (!empty($existing_data)) {
            $existing_amount = $existing_data->balance_amount;
            $wallet_data = array(
                'user_id' => $user,
                'balance_amount' => $existing_amount + $wallet_amount
            );
            crud_model::do_update($wallet_data, 'wallet', array('user_id' => $user));
        } else {
            $wallet_data = array(
                'user_id' => $user,
                'balance_amount' => $wallet_amount
            );
            crud_model::do_insert($wallet_data, 'wallet');
        }
        $wallet_credit_data = array(
            'user_id' => $user,
            'order_id' => $order_id,
            'amount' => $wallet_amount,
            'transaction_type' => 1, //credit
            'status' => 2,
            'created_date' => date('Y-m-d h:i:s')
        );
        crud_model::do_insert($wallet_credit_data, 'wallet_transactions');
    }

    public static function get_wallet_amount($total_amount) {//5%
        $tot = ($total_amount * 5) / 100;
        return round($tot, 2);
    }

    public function action_edit(Request $request) {
        $existing_order = crud_model::get_row('orders', array('id' => $request->id));
        $data = array(
            'customer_id' => $request->input('customer_id'),
            'total_amount' => $request->input('total_amount'),
            'shipment_date' => $request->input('shipment_date') != '' ? date('Y-m-d', strtotime($request->input('shipment_date'))) : '',
            'updated_date' => date('Y-m-d h:i:s')
        );
        $req = crud_model::do_update($data, 'orders', array('id' => $request->id));
        if ($req) {
            $this->save_item_details($request->input('order_items'), $request->id, true);
            #If order amount has been updated, then update the wallet.
            if ($existing_order->total_amount != $data['total_amount'] && $existing_order->status != 1 && $existing_order->status != 6) {
                $this->action_update_wallet($existing_order->total_amount, $data['total_amount'], $existing_order->created_by, $request->id);
            }
            return response()->json(array(
                        'status' => true,
                        'message' => 'Order has been updated successfully.',
                        'code' => 200
            ));
        } else {
            return response()->json(array(
                        'status' => false,
                        'message' => 'Something went wrong! Please try again.',
                        'code' => 202
            ));
        }
    }

    private function action_update_wallet($existing_order_amount, $new_order_amount, $user, $order_id) {
        $existing_data = crud_model::get_row('wallet', array('user_id' => $user));
        $existing_wallet_amount = self::get_wallet_amount($existing_order_amount);
        $new_wallet_amount = self::get_wallet_amount($new_order_amount);
        $new_wallet_bal = $existing_data->balance_amount - $existing_wallet_amount;
        //First debit amount
        $debit_wallet_amount = array(
            'user_id' => $user,
            'balance_amount' => $new_wallet_bal
        );
        $res = crud_model::do_update($debit_wallet_amount, 'wallet', array('user_id' => $user));
        if ($res) {
            crud_model::do_delete('wallet_transactions', array('order_id' => $order_id));
            $credit_wallet_amount = array(
                'user_id' => $user,
                'balance_amount' => $new_wallet_bal + $new_wallet_amount
            );
            crud_model::do_update($credit_wallet_amount, 'wallet', array('user_id' => $user));
            $wallet_credit_data = array(
                'user_id' => $user,
                'order_id' => $order_id,
                'amount' => $new_wallet_amount,
                'transaction_type' => 1, //credit
                'status' => 2,
                'created_date' => date('Y-m-d h:i:s')
            );
            crud_model::do_insert($wallet_credit_data, 'wallet_transactions');
        }
    }

    public function action_update_status(Request $request) {
        $existing_order = crud_model::get_row('orders', array('id' => $request->input('order_id')));
        $data['status'] = $request->input('order_status');
        $data['updated_date'] = date('Y-m-d h:i:s');
        $req = crud_model::do_update($data, 'orders', array('id' => $request->input('order_id')));
        if ($req) {
            //Credit, when status is changed from open or cancelled 
            if ($data['status'] != 1 && $data['status'] != 6 && ($existing_order->status == 1 || $existing_order->status == 6)) {
                $this->action_credit_wallet($existing_order->total_amount, $existing_order->created_by, $request->input('order_id'));
            }
            //Debit already credited amount if the order is cancelled, but existing status should not open
            if ($data['status'] == 6 && $existing_order->status != 1) {
                $this->action_debit_wallet($existing_order->created_by, $request->input('order_id'));
            }
            return response()->json(array(
                        'status' => true,
                        'message' => 'Order status has been updated successfully.',
                        'code' => 200
            ));
        } else {
            return response()->json(array(
                        'status' => false,
                        'message' => 'Something went wrong! Please try again.',
                        'code' => 202
            ));
        }
    }

    public function action_debit_wallet($user_id, $order_id) {
        $wallet_data = crud_model::get_row('wallet', array('user_id' => $user_id));
        $trans_data = crud_model::get_row('wallet_transactions', array('order_id' => $order_id));
        if (!empty($trans_data)) {
            $deduction_amount = $trans_data->amount;
            crud_model::do_delete('wallet_transactions', array('id' => $trans_data->id));
        } else {
            $deduction_amount = 0;
        }
        if (!empty($wallet_data)) {
            $remaining_bal = $wallet_data->balance_amount - $deduction_amount;
            crud_model::do_update(array('balance_amount' => $remaining_bal), 'wallet', array('user_id' => $user_id));
        }
    }

    public function action_delete(Request $request) {
        $result = crud_model::do_delete('orders', array('id' => $request->id));
        if (!empty($result)) {
            crud_model::do_delete('order_items', array('order_id' => $request->id));
            return response()->json(array(
                        'status' => true,
                        'message' => 'Data has been deleted successfully.',
                        'code' => 200
            ));
        } else {
            return response()->json(array(
                        'status' => false,
                        'message' => 'Sorry! Something went wrong. Please try again later.',
                        'code' => 202
            ));
        }
    }

}
