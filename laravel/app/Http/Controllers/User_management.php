<?php

namespace App\Http\Controllers;

use App\Http\Controllers\Controller;
use App\Models\Crud as crud_model;
use App\Models\User_management as users_model;
use Illuminate\Support\Facades\Validator;
use Illuminate\Http\Request;

class User_management extends Controller {

    public function index(Request $request) {
        $data = users_model::datatable($request);
        if (!empty($data)) {
            $rows = array();
            foreach ($data as $key => $value) {
                $row = array();
                $row['id'] = $value->id;
                $row['user_details_id'] = $value->user_details_id;
                $row['user_name'] = $value->user_name;
                $row['user_email'] = $value->user_email;
                $row['user_phone'] = $value->user_phone;
                $row['user_role'] = $this->get_role($value->user_role);
                $row['agency_name'] = $value->agency_name ?: '--';
                $row['status'] = $value->approved;
                $row['approved'] = $value->approved == 1 ? '<span class=btn_green>Approved</span>' : '<span class=btn_red>Pending</span>';
                $rows[] = $row;
            }
        }
        return response()->json(array(
                    'status' => true,
                    'data' => $rows,
                    'total' => users_model::count_filtered($request),
                    'code' => 200
        ));
    }

    public function get_data(Request $request) {
        $result = users_model::get_data($request->id);
        if (!empty($result)) {
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

    public function action_add(Request $request) {
        $rules = [
            'email' => 'unique:users,email',
            'password' => 'bail|required|min:6|max:12',
            'phone' => 'bail|regex:/^[0-9]*$/|unique:users,phone'
        ];
        if ($request->input('role') == 3) {//sales person
            //$rules['address'] = 'required';
            $rules['bank_account'] = 'bail|nullable|unique:user_details,bank_account';
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
            $data = array(
                'name' => $request->input('name'),
                'email' => $request->input('email'),
                'phone' => $request->input('phone'),
                'password' => md5($request->input('password')),
                'role' => $request->input('role'),
                'approved' => 1,
                'created_by' => $request->input('created_by'),
                'created_date' => date('Y-m-d h:i:s')
            );
            $req = crud_model::do_insert($data, 'users');
            if ($req) {
                if ($request->input('role') == 3) {//sales person
                    $user_details = array(
                        'user_id' => $req,
                        'address' => $request->input('address'),
                        'bank_account' => $request->input('bank_account'),
                        'ifsc' => $request->input('ifsc'),
                        'branch' => $request->input('branch'),
                        'agency_id' => $request->input('agency_id') ?: 0
                    );
                    crud_model::do_insert($user_details, 'user_details');
                }

                return response()->json(array(
                            'status' => true,
                            'message' => 'Data has been added successfully.',
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

    public function action_edit(Request $request) {
        $id = $request->id;
        $rules = [
            'email' => 'unique:users,email,' . $id . ',id',
            'phone' => 'bail|regex:/^[0-9]*$/|unique:users,phone,' . $id . ',id'
        ];
        if ($request->input('password')) {
            $rules['password'] = 'bail|min:6|max:12';
        }
        if ($request->input('role') == 3) {//sales person
            $rules['address'] = 'required';
            $rules['bank_account'] = 'bail|required|unique:user_details,bank_account,' . $id . ',user_id';
            $rules['ifsc'] = 'required';
            $rules['branch'] = 'required';
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
            $data = array(
                'name' => $request->input('name'),
                'email' => $request->input('email'),
                'phone' => $request->input('phone'),
                'role' => $request->input('role'),
                'updated_date' => date('Y-m-d h:i:s')
            );
            if (($request->input('password'))) {
                $data['password'] = md5($request->input('password'));
            }
            $req = crud_model::do_update($data, 'users', array('id' => $id));
            if ($req) {
                if ($request->input('role') == 3) {//sales person
                    $user_details = array(
                        'user_id' => $id,
                        'address' => $request->input('address'),
                        'bank_account' => $request->input('bank_account'),
                        'ifsc' => $request->input('ifsc'),
                        'branch' => $request->input('branch'),
                        'agency_id' => $request->input('agency_id')
                    );
                    if ($request->input('user_details_id')) {
                        crud_model::do_update($user_details, 'user_details', array('id' => $request->input('user_details_id')));
                    } else {
                        crud_model::do_insert($user_details, 'user_details');
                    }
                } else {
                    crud_model::do_delete('user_details', array('id' => $request->input('user_details_id')));
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
    }

    public function action_delete(Request $request) {
        $result = crud_model::do_delete('users', array('id' => $request->input('id')));
        if (!empty($result)) {
            crud_model::do_delete('user_details', array('id' => $request->input('user_details_id')));
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

    public function action_approve(Request $request) {
        $result = crud_model::do_update(array('approved' => 1), 'users', array('id' => $request->input('id')));
        if (!empty($result)) {
            crud_model::do_delete('user_details', array('id' => $request->input('user_details_id')));
            return response()->json(array(
                        'status' => true,
                        'message' => 'User has been approved successfully.',
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

    public function get_agencies(Request $request) {
        $result = users_model::get_all_data($role = 2);
        if (!empty($result)) {
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

    public function get_sales_person(Request $request) {
        $result = users_model::get_all_sales_person($request);
        if (!empty($result)) {
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

    public function action_register(Request $request) {
        $rules = [
            'email' => 'unique:users,email',
            'password' => 'bail|required|min:6|max:12',
            'phone' => 'bail|regex:/^[0-9]*$/|unique:users,phone',
            'bank_account' => 'bail|nullable|unique:user_details,bank_account',
        ];
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
            $get_otp = $this->get_random_numbers(6);
            $data = array(
                'name' => $request->input('name'),
                'email' => $request->input('email'),
                'password' => $request->input('password'),
                'phone' => $request->input('phone'),
                'address' => $request->input('address'),
                'bank_account' => $request->input('bank_account'),
                'ifsc' => $request->input('ifsc'),
                'branch' => $request->input('branch'),
                'otp' => $get_otp
            );
            $sent_otp = 1;
            if ($sent_otp) {
                return response()->json(array(
                            'status' => true,
                            'message' => 'We have sent otp to your phone number.',
                            'data' => $data,
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

    public function action_validate_otp(Request $request) {
        $rules = [
            'name' => 'required'
        ];
        $validation = Validator::make($request->all(), $rules);
        if ($validation->fails()) {
            return response()->json(array(
                        'status' => false,
                        'message' => 'Something went wrong! Please try again.',
                        'code' => 202
            ));
        } else {
            $data = array(
                'name' => $request->input('name'),
                'email' => $request->input('email'),
                'phone' => $request->input('phone'),
                'password' => md5($request->input('password')),
                'role' => 3, //sales person
                'approved' => 0,
                'created_by' => 0,
                'created_date' => date('Y-m-d h:i:s')
            );
            $req = crud_model::do_insert($data, 'users');
            if ($req) {
                $user_details = array(
                    'user_id' => $req,
                    'address' => $request->input('address'),
                    'bank_account' => $request->input('bank_account'),
                    'ifsc' => $request->input('ifsc'),
                    'branch' => $request->input('branch')
                );
                crud_model::do_insert($user_details, 'user_details');
                return response()->json(array(
                            'status' => true,
                            'message' => 'Otp has been validated successfully.',
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

}
