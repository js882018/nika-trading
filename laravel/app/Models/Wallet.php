<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Support\Facades\DB;

class Wallet extends Model {

    use HasFactory;

    private static function __query() {
        $query = DB::table('wallet as wallet')
                ->leftJoin('users as users', 'users.id', '=', 'wallet.user_id')
                ->select('wallet.id', 'wallet.user_id', 'wallet.balance_amount as wallet_amount',
                'users.name as user_name');
        return $query;
    }

    public static function datatable($request) {
        $query = self::__query();
        $page = ($request->input('page') - 1) * $request->input('per_page');
        $length = $request->input('per_page');
        $order = array('wallet.id' => 'desc');
        $query->orderBy(key($order), $order[key($order)]);
        if ($request->input()['per_page'] != -1) {
            $query->offset($page);
            $query->limit($length);
        }
        return $query->get();
    }

    public static function count_filtered($request) {
        $query = self::__query();
        $result = $query->get();
        return count($result);
    }

}
