<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Support\Facades\DB;

class Crud extends Model
{
    use HasFactory;

    public static function do_insert($data, $table) {
        $id = DB::table($table)->insertGetId($data);
        return $id ? $id : false;
    }

    public static function do_update($data, $table, $where) {
        $affected = DB::table($table)->where($where)
                ->update($data);
        return $affected ? $affected : false;
    }

    public static function do_delete($table, $where) {
        $affected = DB::table($table)->where($where)
                ->delete();
        return $affected ? $affected : false;
    }

    public static function get_row($table, $where = false) {
        $query = DB::table($table);
        if (is_array($where)) {
            $query->where($where);
        }
        return $query->first();
    }

    public static function get_result($table, $where = false) {
        $query = DB::table($table);
        if (is_array($where)) {
            $query->where($where);
        }
        return $query->get()->toArray();
    }

    public static function getNextId($table) {
        $statement = DB::select("SHOW TABLE STATUS LIKE '" . $table . "'");
        $nextId = $statement[0]->Auto_increment;
        return $nextId;
    }
}
