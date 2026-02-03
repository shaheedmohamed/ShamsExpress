<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::table('users', function (Blueprint $table) {
            $table->decimal('pickup_commission_rate', 5, 2)->default(45.00)->after('is_guest'); // 40-50%
            $table->decimal('delivery_commission_rate', 5, 2)->default(45.00)->after('pickup_commission_rate'); // 40-50%
            $table->decimal('same_driver_commission_rate', 5, 2)->default(70.00)->after('delivery_commission_rate'); // 70% if same driver
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('users', function (Blueprint $table) {
            $table->dropColumn(['pickup_commission_rate', 'delivery_commission_rate', 'same_driver_commission_rate']);
        });
    }
};
