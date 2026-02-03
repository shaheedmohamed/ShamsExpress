<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('delivery_orders', function (Blueprint $table) {
            $table->foreignId('shipment_type_id')->nullable()->after('driver_id')->constrained('shipment_types')->onDelete('set null');
            $table->foreignId('delivery_zone_id')->nullable()->after('shipment_type_id')->constrained('delivery_zones')->onDelete('set null');
            $table->decimal('product_value', 10, 2)->nullable()->after('delivery_fee');
            $table->string('sender_phone')->nullable()->after('recipient_phone');
        });
    }

    public function down(): void
    {
        Schema::table('delivery_orders', function (Blueprint $table) {
            $table->dropForeign(['shipment_type_id']);
            $table->dropForeign(['delivery_zone_id']);
            $table->dropColumn(['shipment_type_id', 'delivery_zone_id', 'product_value', 'sender_phone']);
        });
    }
};
