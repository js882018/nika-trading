<?php

namespace App\Http\Controllers;

use App\Http\Controllers\Controller;
use App\Models\Crud as crud_model;
use Illuminate\Support\Facades\Validator;
use Illuminate\Http\Request;

class Profile extends Controller {

    public function action_edit(Request $request) {
        $id = $request->id;
        $rules = [
            'phone' => 'bail|regex:/^[0-9]*$/|unique:users,phone,' . $id . ',id'
        ];
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
                'phone' => $request->input('phone'),
                'updated_date' => date('Y-m-d h:i:s')
            );
            if (($request->input('new_password'))) {
                $data['password'] = md5($request->input('new_password'));
            }
            $req = crud_model::do_update($data, 'users', array('id' => $id));
            if ($req) {
                if ($request->input('role') == 3) {//sales person
                    $user_details = array(
                        'user_id' => $id,
                        'address' => $request->input('address'),
                        'bank_account' => $request->input('bank_account'),
                        'ifsc' => $request->input('ifsc'),
                        'branch' => $request->input('branch')
                    );
                    crud_model::do_update($user_details, 'user_details', array('id' => $request->input('user_details_id')));
                }
                return response()->json(array(
                            'status' => true,
                            'message' => 'Profile has been updated successfully.',
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

}
