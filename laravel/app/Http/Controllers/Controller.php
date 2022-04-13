<?php

namespace App\Http\Controllers;

use Illuminate\Foundation\Auth\Access\AuthorizesRequests;
use Illuminate\Foundation\Bus\DispatchesJobs;
use Illuminate\Foundation\Validation\ValidatesRequests;
use Illuminate\Routing\Controller as BaseController;
use File;

class Controller extends BaseController {

    use AuthorizesRequests,
        DispatchesJobs,
        ValidatesRequests;

    public function get_role($key = false) {
        $name = array(
            1 => 'Admin',
            2 => 'Agency',
            3 => 'Sales Person'
        );
        if ($key == true) {
            return $name[$key];
        } else {
            return $name;
        }
    }

    public function get_random_numbers($length) {
        return substr(str_shuffle('0123456789'), 1, $length);
    }

    public function get_order_reference($no) {
        return sprintf('%05d', $no);
    }

    public function order_status($key = false) {
        $name = array(
            1 => 'Open',
            2 => 'Approved',
            3 => 'Way to delivery',
            4 => 'Delivered',
            5 => 'Return',
            6 => 'Cancelled'
        );
        if ($key == true) {
            return $name[$key];
        } else {
            return $name;
        }
    }

    public function fileUpload($request, $field, $target_path, $extention = true) {
        if ($request->$field) {
            $isExists = file_exists($target_path);
            if ($isExists) {
                File::deleteDirectory($target_path);
            }
            if (!File::isDirectory($target_path)) {
                File::makeDirectory($target_path, 0777, true, true);
            }
            $file = $request->file($field);
            $original_name = $request->file($field)->getClientOriginalName();
            if ($extention == true) {
                $fileName = time() . '.' . $file->extension();
            } else {
                $path = $_FILES['file']['name'];
                $ext = pathinfo($path, PATHINFO_EXTENSION);
                $fileName = time() . '.' . $ext;
            }
            $file->move(public_path() . '/' . $target_path, $fileName);
            return array(
                'file_name' => $original_name,
                'file_path' => $target_path . '/' . $fileName,
            );
        } else {
            return '';
        }
    }

}
