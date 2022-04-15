<?php

namespace App\Http\Controllers;

use App\Http\Controllers\Controller;
use App\Models\Crud as crud_model;
use App\Models\Wallet as wallet_model;
use App\Models\Transactions as transactions_model;
use Illuminate\Support\Facades\Validator;
use Illuminate\Http\Request;
use File;

class Wallet extends Controller {

    public function action_user_wallets(Request $request) {
        $data = wallet_model::datatable($request);
        if (!empty($data)) {
            $rows = array();
            foreach ($data as $key => $value) {
                $row = array();
                $row['id'] = $value->id;
                $row['user_id'] = $value->user_id;
                $row['user_name'] = $value->user_name;
                $row['wallet_amount'] = $value->wallet_amount;
                $rows[] = $row;
            }
        }
        return response()->json(array(
                    'status' => true,
                    'data' => $rows,
                    'total' => wallet_model::count_filtered($request),
                    'code' => 200
        ));
    }

    public function action_wallet_transactions(Request $request) {
        $data = transactions_model::datatable($request);
        if (!empty($data)) {
            $rows = array();
            foreach ($data as $key => $value) {
                $row = array();
                $row['id'] = $value->id;
                $row['user_id'] = $value->user_id;
                $row['user_name'] = $value->user_name;
                $row['status'] = $value->status == 1 ? '<span class="btn_pending">Pending</span>' : '<span class="btn_success">Success</span>';
                $row['type'] = $value->transaction_type == 1 ? '<span class="btn_credit">Credit</span>' : '<span class="btn_debit">Debit</span>';
                $row['amount'] = $value->amount;
                $row['created_date'] = date('d-m-Y', strtotime($value->created_date));
                $rows[] = $row;
            }
        }
        return response()->json(array(
                    'status' => true,
                    'data' => $rows,
                    'total' => transactions_model::count_filtered($request),
                    'tot_wallet_balance' => transactions_model::get_tot_wallet_balance($request),
                    'code' => 200
        ));
    }

    public function get_wallet_transactions_data(Request $request) {
        $result = transactions_model::get_data($request->id);
        if (!empty($result)) {
            if (($_SERVER['SERVER_NAME']) == "127.0.0.1") {
                $result->attachment_url = $result->attachment_path ? url($result->attachment_path) : '';
            } else {
                $result->attachment_url = $result->attachment_path ? url('public/' . $result->attachment_path) : '';
            }
            return response()->json(array(
                        'status' => true,
                        'data' => $result,
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

    public function action_withdrawal_approve(Request $request) {
        $requesed_data = crud_model::get_row('wallet_transactions', array('id' => $request->id));
        $uploaded_data = $this->fileUpload($request, 'attachment', 'uploads/attachments/' . $request->id);
        $data = array(
            'status' => $request->input('status'),
            'comments' => $request->input('comments'),
            'attachment_name' => $uploaded_data != '' ? $uploaded_data['file_name'] : '',
            'attachment_path' => $uploaded_data != '' ? $uploaded_data['file_path'] : '',
            'approved_date' => date('Y-m-d h:i:s')
        );
        $req = crud_model::do_update($data, 'wallet_transactions', array('id' => $request->id));
        if ($req) {
            if ($data['status'] == 2 && $requesed_data->status == 1) {
                $this->update_wallet_amount($request->input('amount'), $request->input('user_id'));
            }
            return response()->json(array(
                        'status' => true,
                        'message' => 'Data has been updated successfully.',
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

    public function action_withdrawal_send(Request $request) {
        if ($request->input('withdrawal_amount') > $request->input('wallet_balance')) {
            return response()->json(array(
                        'status' => false,
                        'message' => array('withdrawal_amount' => 'Not sufficient balance to withdraw'),
                        'code' => 200
            ));
        } else {
            $data = array(
                'user_id' => $request->input('user_id'),
                'amount' => $request->input('withdrawal_amount'),
                'transaction_type' => 2,
                'status' => 1,
                'created_date' => date('Y-m-d h:i:s')
            );
            $req = crud_model::do_insert($data, 'wallet_transactions');
            if ($req) {
                return response()->json(array(
                            'status' => true,
                            'message' => 'Withdrawal request has been sent!.',
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

    private function update_wallet_amount($requested_amount, $user_id) {
        $existing_data = crud_model::get_row('wallet', array('user_id' => $user_id));
        $existing_amount = $existing_data->balance_amount;
        $wallet_data = array(
            'user_id' => $user_id,
            'balance_amount' => $existing_amount - $requested_amount
        );
        crud_model::do_update($wallet_data, 'wallet', array('user_id' => $user_id));
    }

    public function delete_user_wallet(Request $request) {
        $wallet = crud_model::get_row('wallet', array('id' => $request->id));
        $result = crud_model::do_delete('wallet', array('id' => $request->id));
        if (!empty($result)) {
            crud_model::do_delete('wallet_transactions', array('user_id' => $wallet->user_id));
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
    
    public function action_delete_attachment(Request $request) {
        $result = crud_model::do_update(array('attachment_name' => '', 'attachment_path' => ''), 'wallet_transactions', array('id' => $request->id));
        if (!empty($result)) {
            File::deleteDirectory(public_path('uploads/attachment/' . $request->id));
            return response()->json(array(
                        'message' => 'Attachment has been deleted successfully.',
                        'status' => true,
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
