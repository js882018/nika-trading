<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Support\Facades\DB;

class Customers extends Model {

    use HasFactory;

    private static function __query() {
        $query = DB::table('customers as customers')
                ->select('customers.id', 'customers.name', 'customers.email', 'customers.phone',
                'customers.gst_no', 'customers.landmark', 'customers.location', 'customers.address', 'customers.created_date');
        return $query;
    }
    
    public static function __search_qry($request, $query) {
//        if ($request->input('user_role') != 1)
//            $query->where('customers.created_by', '=', $request->input('user_id'));
    }

    public static function datatable($request) {
        $query = self::__query();
        self::__search_qry($request, $query);
        $page = ($request->input('page') - 1) * $request->input('per_page');
        $length = $request->input('per_page');
        $order = array('customers.id' => 'desc');
        $query->orderBy(key($order), $order[key($order)]);
        if ($request->input()['per_page'] != -1) {
            $query->offset($page);
            $query->limit($length);
        }
        return $query->get();
    }

    public static function count_filtered($request) {
        $query = self::__query();
        self::__search_qry($request, $query);
        $result = $query->get();
        return count($result);
    }

    public static function get_data($id) {
        $query = self::__query();
        $query->where('customers.id', $id);
        return $query->first();
    }

    public static function get_all_data($request) {
        $query = self::__query();
        self::__search_qry($request, $query);
        return $query->get();
    }

}
