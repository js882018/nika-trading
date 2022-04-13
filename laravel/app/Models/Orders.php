<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Support\Facades\DB;
use App\Models\Crud as crud_model;

class Orders extends Model {

    use HasFactory;

    private static function __query() {
        $query = DB::table('orders as orders')
                ->leftJoin('customers as customers', 'customers.id', '=', 'orders.customer_id')
                ->leftJoin('users as users', 'users.id', '=', 'orders.created_by')
                ->select('orders.id', 'orders.reference_id', 'orders.customer_id', 'orders.total_amount',
                'orders.shipment_date', 'orders.status', 'orders.created_date', 'users.name as user_name',
                'customers.name as customer_name');
        return $query;
    }

    public static function __search_qry($request, $query) {
        if ($request->input('user_role') == 2) {
            $agent_users = crud_model::get_result('users', array('created_by' => $request->input('user_id')));
            if (!empty($agent_users)) {
                $users_id = array_column($agent_users, 'id');
            } else {
                $users_id = array(0);
            }
            $query->where('orders.created_by', '=', $request->input('user_id'));
            $query->orWhereIn('orders.created_by', $users_id);
        }
        if ($request->input('user_role') == 3)
            $query->where('orders.created_by', '=', $request->input('user_id'));
    }

    public static function datatable($request) {
        $query = self::__query();
        self::__search_qry($request, $query);
        $page = ($request->input('page') - 1) * $request->input('per_page');
        $length = $request->input('per_page');
        $order = array('orders.id' => 'desc');
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
        $query->where('orders.id', $id);
        return $query->first();
    }

    public static function dashbard_count($request, $last_30_days) {
        $query = self::__query();
        self::__search_qry($request, $query);
        if ($last_30_days)
            $query->where('orders.created_date', '>', $last_30_days);
        $result = $query->get();
        return count($result);
    }

}
