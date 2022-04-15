<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Support\Facades\DB;

class Transactions extends Model {

    use HasFactory;

    private static function __query() {
        $query = DB::table('wallet_transactions as wallet_trans')
                ->leftJoin('users as users', 'users.id', '=', 'wallet_trans.user_id')
                ->leftJoin('orders as orders', 'orders.id', '=', 'wallet_trans.order_id')
                ->select('wallet_trans.id', 'wallet_trans.order_id', 'wallet_trans.user_id', 'wallet_trans.amount as amount',
                'wallet_trans.status', 'wallet_trans.transaction_type', 'wallet_trans.created_date',
                'wallet_trans.approved_date', 'wallet_trans.attachment_name', 'wallet_trans.attachment_path',
                'wallet_trans.comments', 'users.name as user_name', 'orders.reference_id');
        return $query;
    }

    public static function __search_qry($request, $query) {
        if ($request->input('user_id') && $request->input('user_role') != 1)
            $query->where('wallet_trans.user_id', '=', $request->input('user_id'));
        if ($request->input('type'))
            $query->where('wallet_trans.transaction_type', '=', $request->input('type'));
    }

    public static function datatable($request) {
        $query = self::__query();
        self::__search_qry($request, $query);
        $page = ($request->input('page') - 1) * $request->input('per_page');
        $length = $request->input('per_page');
        $order = array('wallet_trans.id' => 'desc');
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

    public static function get_tot_wallet_balance($request) {
        $query = DB::table('wallet as wallet')
                ->select('wallet.id', 'wallet.user_id', 'wallet.balance_amount')
                ->where('wallet.user_id', '=', $request->input('user_id'));
        $result = $query->first();
        return empty($result->balance_amount) ? 0.00 : $result->balance_amount;
    }

    public static function get_data($id) {
        $query = self::__query();
        $query->where('wallet_trans.id', $id);
        return $query->first();
    }

}
