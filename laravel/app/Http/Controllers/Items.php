<?php

namespace App\Http\Controllers;

use App\Http\Controllers\Controller;
use App\Models\Crud as crud_model;
use App\Models\Items as items_model;
use Illuminate\Support\Facades\Validator;
use Illuminate\Http\Request;
use File;

class Items extends Controller {

    public function index(Request $request) {
        $data = items_model::datatable($request);
        if (!empty($data)) {
            $rows = array();
            foreach ($data as $key => $value) {
                $row = array();
                $row['id'] = $value->id;
                $row['name'] = $value->name;
                $row['hsn_sac'] = $value->hsn_sac;
                $row['price'] = $value->price;
                $rows[] = $row;
            }
        }
        return response()->json(array(
                    'status' => true,
                    'data' => $rows,
                    'total' => items_model::count_filtered($request),
                    'code' => 200
        ));
    }

    public function get_all_data(Request $request) {
        $result = items_model::get_all_data($request);
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
        $result = items_model::get_data($request->id);
        if (!empty($result)) {
            if (($_SERVER['SERVER_NAME']) == "127.0.0.1") {
                $result->image_url = $result->image_path ? url($result->image_path) : '';
            } else {
                $result->image_url = $result->image_path ? url('public/' . $result->image_path) : '';
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

    public function action_add(Request $request) {
        $next_id = crud_model::getNextId('orders');
        $rules = [
            'name' => 'unique:items,name',
            'hsn_sac' => 'unique:items,hsn_sac',
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
            $uploaded_data = $this->fileUpload($request, 'image', 'uploads/items/' . $next_id);
            $data = array(
                'name' => $request->input('name'),
                'hsn_sac' => $request->input('hsn_sac'),
                'price' => $request->input('price'),
                'image_name' => $uploaded_data != '' ? $uploaded_data['file_name'] : '',
                'image_path' => $uploaded_data != '' ? $uploaded_data['file_path'] : '',
                'created_date' => date('Y-m-d h:i:s')
            );
            $req = crud_model::do_insert($data, 'items');
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
            'name' => 'unique:items,name,' . $id . ',id',
            'hsn_sac' => 'unique:items,hsn_sac,' . $id . ',id'
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
            $uploaded_data = $this->fileUpload($request, 'image', 'uploads/items/' . $id);
            $data = array(
                'name' => $request->input('name'),
                'hsn_sac' => $request->input('hsn_sac'),
                'price' => $request->input('price'),
                'updated_date' => date('Y-m-d h:i:s')
            );
            if ($uploaded_data != '') {
                $data['image_name'] = $uploaded_data['file_name'];
                $data['image_path'] = $uploaded_data['file_path'];
            }
            $req = crud_model::do_update($data, 'items', array('id' => $id));
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
        $result = crud_model::do_delete('items', array('id' => $request->id));
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

    public function action_delete_image(Request $request) {
        $result = crud_model::do_update(array('image_name' => '', 'image_path' => ''), 'items', array('id' => $request->id));
        if (!empty($result)) {
            File::deleteDirectory(public_path('uploads/items/' . $request->id));
            return response()->json(array(
                        'message' => 'Item image has been deleted successfully.',
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
