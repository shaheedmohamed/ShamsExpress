<aside class="w-64 bg-white shadow-lg min-h-screen">
    <nav class="mt-6">
        <a href="{{ route('admin.dashboard') }}" class="flex items-center px-6 py-3 text-gray-700 hover:bg-gray-100 {{ request()->routeIs('admin.dashboard') ? 'bg-gray-100 border-l-4 border-primary' : '' }}">
            <i class="fas fa-chart-line mr-3"></i>
            Dashboard
        </a>
        <a href="{{ route('admin.orders') }}" class="flex items-center px-6 py-3 text-gray-700 hover:bg-gray-100 {{ request()->routeIs('admin.orders*') ? 'bg-gray-100 border-l-4 border-primary' : '' }}">
            <i class="fas fa-box mr-3"></i>
            Orders
        </a>
        <a href="/warehouse/products" class="flex items-center px-6 py-3 text-gray-700 hover:bg-gray-100 {{ request()->is('warehouse*') ? 'bg-gray-100 border-l-4 border-primary' : '' }}">
            <i class="fas fa-warehouse mr-3"></i>
            Warehouse Products
        </a>
        <a href="{{ route('admin.users') }}" class="flex items-center px-6 py-3 text-gray-700 hover:bg-gray-100 {{ request()->routeIs('admin.users*') ? 'bg-gray-100 border-l-4 border-primary' : '' }}">
            <i class="fas fa-users mr-3"></i>
            Users
        </a>
        <a href="{{ route('admin.drivers') }}" class="flex items-center px-6 py-3 text-gray-700 hover:bg-gray-100 {{ request()->routeIs('admin.drivers*') ? 'bg-gray-100 border-l-4 border-primary' : '' }}">
            <i class="fas fa-truck mr-3"></i>
            Drivers
        </a>
    </nav>
</aside>
