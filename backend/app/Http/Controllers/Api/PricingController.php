<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\ShipmentType;
use App\Models\DeliveryZone;
use Illuminate\Http\Request;

class PricingController extends Controller
{
    public function getShipmentTypes()
    {
        $types = ShipmentType::active()->get();
        return response()->json($types);
    }

    public function getDeliveryZones()
    {
        $zones = DeliveryZone::active()->get();
        return response()->json($zones);
    }

    public function calculatePrice(Request $request)
    {
        $request->validate([
            'shipment_type_id' => 'required|exists:shipment_types,id',
            'delivery_zone_id' => 'required|exists:delivery_zones,id',
        ]);

        $shipmentType = ShipmentType::findOrFail($request->shipment_type_id);
        $deliveryZone = DeliveryZone::findOrFail($request->delivery_zone_id);

        $totalPrice = $shipmentType->base_price + $deliveryZone->additional_fee;

        return response()->json([
            'base_price' => $shipmentType->base_price,
            'zone_fee' => $deliveryZone->additional_fee,
            'total_price' => $totalPrice,
            'shipment_type' => $shipmentType->name,
            'delivery_zone' => $deliveryZone->name,
        ]);
    }
}
