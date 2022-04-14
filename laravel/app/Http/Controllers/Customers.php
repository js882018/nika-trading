<?php

namespace App\Http\Controllers;

use App\Http\Controllers\Controller;
use App\Models\Crud as crud_model;
use App\Models\Customers as customers_model;
use Illuminate\Support\Facades\Validator;
use Illuminate\Http\Request;

class Customers extends Controller {

    public function index(Request $request) {
        $data = customers_model::datatable($request);
        if (!empty($data)) {
            $rows = array();
            foreach ($data as $key => $value) {
                $row = array();
                $row['id'] = $value->id;
                $row['name'] = $value->name;
                $row['email'] = $value->email?:'--';
                $row['phone'] = $value->phone;
                $row['gst_no'] = $value->gst_no?:'--';
                $row['location'] = $value->location?:'--';
                $row['created_by'] = $value->user_name?:'--';
                $rows[] = $row;
            }
        }
        return response()->json(array(
                    'status' => true,
                    'data' => $rows,
                    'total' => customers_model::count_filtered($request),
                    'code' => 200
        ));
    }

    public function get_all_data(Request $request) {
        $result = customers_model::get_all_data($request);
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

    public function get_data(Request $request) {
        $result = customers_model::get_data($request->id);
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
            'email' => 'bail|nullable|unique:customers,email',
            'phone' => 'bail|regex:/^[0-9]*$/|unique:customers,phone',
            'gst_no' => 'bail|nullable|unique:customers,gst_no',
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
            $data = array(
                'name' => $request->input('name'),
                'email' => $request->input('email'),
                'phone' => $request->input('phone'),
                'gst_no' => $request->input('gst_no'),
                'location' => $request->input('location'),
                'landmark' => $request->input('landmark'),
                'address' => $request->input('address'),
                'created_by' => $request->input('created_by'),
                'created_date' => date('Y-m-d h:i:s')
            );
            $req = crud_model::do_insert($data, 'customers');
            if ($req) {
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
            'email' => 'bail|nullable|unique:customers,email,' . $id . ',id',
            'phone' => 'bail|regex:/^[0-9]*$/|unique:customers,phone,' . $id . ',id',
            'gst_no' => 'bail|nullable|unique:customers,gst_no,' . $id . ',id'
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
            $data = array(
                'name' => $request->input('name'),
                'email' => $request->input('email'),
                'phone' => $request->input('phone'),
                'gst_no' => $request->input('gst_no'),
                'location' => $request->input('location'),
                'landmark' => $request->input('landmark'),
                'address' => $request->input('address'),
                'updated_date' => date('Y-m-d h:i:s')
            );
            $req = crud_model::do_update($data, 'customers', array('id' => $id));
            if ($req) {
                return response()->json(array(
                            'status' => true,
                            'message' => 'Data has been updated successfully.',
                            'code' => 200
                ));
            } else {
                return response()->json(
                                array(
                                    'status' => false,
                                    'message' => 'Something went wrong! Please try again.',
                                    'code' => 202
                                )
                );
            }
        }
    }

    public function action_delete(Request $request) {
        $result = crud_model::do_delete('customers', array('id' => $request->id));
        if (!empty($result)) {
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
