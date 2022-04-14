<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Support\Facades\DB;

class Items extends Model {

    use HasFactory;

    private static function __query() {
        $query = DB::table('items as items')
                ->select('items.id', 'items.name', 'items.hsn_sac', 'items.price',
                'items.image_name', 'items.image_path', 'items.created_date');
        return $query;
    }

    public static function datatable($request) {
        $query = self::__query();
        $page = ($request->input('page') - 1) * $request->input('per_page');
        $length = $request->input('per_page');
        $order = array('items.id' => 'desc');
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

    public static function get_data($id) {
        $query = self::__query();
        $query->where('items.id', $id);
        return $query->first();
    }

    public static function get_all_data() {
        $query = self::__query();
        return $query->get();
    }

}
