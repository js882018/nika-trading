<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Support\Facades\DB;

class User_management extends Model {

    use HasFactory;

    private static function __query() {
        $query = DB::table('users as users')
                ->leftJoin('user_details as user_details', 'user_details.user_id', '=', 'users.id')
                ->leftJoin('users as agency', 'agency.id', '=', 'user_details.agency_id')
                ->select('users.id', 'users.name as user_name', 'users.email as user_email', 'users.phone as user_phone',
                'users.role as user_role', 'users.approved', 'users.image as user_image',
                'user_details.id as user_details_id', 'user_details.address as user_address',
                'user_details.bank_account', 'user_details.ifsc', 'user_details.branch',
                'agency.id as agency_id', 'agency.name as agency_name');
        return $query;
    }

    public static function __search_qry($request, $query) {
        if ($request->input('user_name'))
            $query->where('users.name', 'LIKE', "%" . $request->input('user_name') . "%");
        if ($request->input('current_role') != 1)
            $query->where('users.created_by', '=', $request->input('user_id'));
        if ($request->input('current_role') == 1 && $request->input('user_role'))
            $query->where('users.role', '=', $request->input('user_role'));
    }

    public static function datatable($request) {
        $query = self::__query();
        $query->where('users.role', '!=', 1);
        self::__search_qry($request, $query);
        $page = ($request->input('page') - 1) * $request->input('per_page');
        $length = $request->input('per_page');
        $order = array('users.id' => 'desc');
        $query->orderBy(key($order), $order[key($order)]);
        if ($request->input()['per_page'] != -1) {
            $query->offset($page);
            $query->limit($length);
        }
        return $query->get();
    }

    public static function count_filtered($request) {
        $query = self::__query();
        $query->where('users.role', '!=', 1);
        self::__search_qry($request, $query);
        $result = $query->get();
        return count($result);
    }

    public static function get_data($id) {
        $query = self::__query();
        $query->where('users.id', $id);
        return $query->first();
    }

    public static function get_all_data($role = false) {
        $query = self::__query();
        if ($role)
            $query->where('users.role', '=', $role);
        return $query->get();
    }

}
