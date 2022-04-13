<?php

namespace App\Http\Controllers;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\Items as items_model;
use App\Models\Orders as orders_model;

class Dashboard extends Controller {

    public function get_counts(Request $request) {
        $total_items = items_model::count_filtered($request);
        if (!empty($total_items)) {
            $total_orders = orders_model::count_filtered($request);
            $date = date('Y-m-d');
            $todays_order = orders_model::dashbard_count($request, $date);
            return response()->json(array(
                        'status' => true,
                        'total_items' => $total_items,
                        'total_orders' => $total_orders,
                        'todays_order' => $todays_order,
                        'code' => 200
            ));
        } else {
            return response()->json(array(
                        'status' => false,
                        'message' => 'No Data Found',
                        'code' => 202
            ));
        }
    }

}
