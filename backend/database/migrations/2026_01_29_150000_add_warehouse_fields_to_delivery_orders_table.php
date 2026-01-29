<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('delivery_orders', function (Blueprint $table) {
            $table->timestamp('delivered_to_warehouse_at')->nullable()->after('picked_up_at');
            $table->timestamp('picked_up_from_warehouse_at')->nullable()->after('delivered_to_warehouse_at');
        });
    }

    public function down(): void
    {
        Schema::table('delivery_orders', function (Blueprint $table) {
            $table->dropColumn(['delivered_to_warehouse_at', 'picked_up_from_warehouse_at']);
        });
    }
};
