<?php

namespace App\Http\Controllers;

use App\Http\Controllers\Controller;
use App\Models\Crud as crud_model;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Facades\Validator;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Mail;
use App\Mail\SendEmails;

class Login extends Controller {

    public function action_login(Request $request) {
        $validation = Validator::make($request->all(), [
                    'email' => 'required|min:2',
                    'password' => 'required|min:6',
        ]);
        if ($validation->fails()) {
            return response()->json(array(
                        'status' => false,
                        'message' => array_combine($validation->errors()->keys(), $validation->errors()->all()),
                        'error_keys' => $validation->errors()->keys(),
                        'error_messages' => $validation->errors()->all(),
                        'code' => 200
            ));
        } else {
            $email = $request->input('email');
            $password = md5($request->input('password'));
            $result = crud_model::get_row('users', array('email' => $email, 'password' => $password));
            if (!empty($result)) {
                if ($result->approved == 1) {
                    $result->password = '';
                    if ($result->image) {
                        if (($_SERVER['SERVER_NAME']) == "127.0.0.1") {
                            $result->image_url = url('uploads/profile/' . $result->image);
                        } else {
                            $result->image_url = Storage::disk('public')->url('uploads/profile/' . $result->image);
                        }
                    } else {
                        $result->image_url = '';
                    }
                    return response()->json(array(
                                'status' => true,
                                'message' => 'You have logged in successfully.',
                                'data' => $result,
                                'code' => 200
                    ));
                } else {
                    return response()->json(array(
                                'status' => true,
                                'message' => 'Your account is not activated!',
                                'data' => $result,
                                'code' => 200
                    ));
                }
            } else {
                return response()->json(array(
                            'status' => false,
                            'message' => 'Invalid email or password.',
                            'code' => 202
                ));
            }
        }
    }

    public function action_send_reset_code(Request $request) {
        $validation = Validator::make($request->all(), [
                    'email' => 'required|email|exists:users,email',
                        ], [
                    'email.exists' => 'This email address is not exists!',
        ]);
        if ($validation->fails()) {
            return response()->json(array(
                        'status' => false,
                        'message' => array_combine($validation->errors()->keys(), $validation->errors()->all()),
                        'error_keys' => $validation->errors()->keys(),
                        'error_messages' => $validation->errors()->all(),
                        'code' => 200
            ));
        } else {
            $sent = $this->send_reset_password_link($request->input('email'));
            if ($sent) {
                return response()->json(array(
                            'status' => false,
                            'message' => 'Reset password link has sent to your mail. Look in your Spam folder too',
                            'code' => 202
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

    private function send_reset_password_link($email) {
        $code = md5(time());
        crud_model::do_update(array('reset_code' => $code), 'users', array('email' => $email));
        $user = crud_model::get_row('users', array('email' => $email));
        $mail['to'] = $email;
        $data['subject'] = 'Reset Password - ' . config('constants.APP_TITLE');
        $data['name'] = $user->name;
        $data['link'] = config('constants.ADMIN_URL') . '#/reset-password?code=' . $code . '&email=' . $email;
        $data['blade_name'] = 'emails.reset_password';
        Mail::to($mail['to'])->send(new SendEmails($data));
        return true;
    }

    public function action_reset_password(Request $request) {
        $validation = Validator::make($request->all(), [
                    'password' => 'required|min:6|max:12',
                    'confirm_password' => 'required|same:password',
        ]);
        if ($validation->fails()) {
            return response()->json(array(
                        'status' => false,
                        'message' => array_combine($validation->errors()->keys(), $validation->errors()->all()),
                        'error_keys' => $validation->errors()->keys(),
                        'error_messages' => $validation->errors()->all(),
                        'code' => 200
            ));
        } else {
            $result = crud_model::get_row('users', array('email' => $request->input('email'), 'reset_code' => $request->input('reset_code')));
            if (!empty($result)) {
                $data = array(
                    'password' => md5($request->input('password')),
                    'updated_date' => date('Y-m-d h:i:s'),
                );
                $req = crud_model::do_update($data, 'users', array('email' => $request->input('email')));
                if ($req) {
                    return response()->json(array(
                                'status' => true,
                                'message' => 'Your password has been changed successfully.',
                                'code' => 200
                    ));
                } else {
                    return response()->json(array(
                                'status' => false,
                                'message' => 'Something went wrong! Please try again.',
                                'code' => 202
                    ));
                }
            } else {
                return response()->json(array(
                            'status' => false,
                            'message' => 'Invalid reset code. Please try again!',
                            'code' => 202
                ));
            }
        }
    }

}
