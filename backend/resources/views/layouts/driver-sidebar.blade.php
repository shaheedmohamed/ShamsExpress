<aside class="w-64 bg-white shadow-lg min-h-screen">
    <nav class="mt-6">
        <a href="{{ route('driver.dashboard') }}" class="flex items-center px-6 py-3 text-gray-700 hover:bg-gray-100 {{ request()->routeIs('driver.dashboard') ? 'bg-gray-100 border-l-4 border-primary' : '' }}">
            <i class="fas fa-chart-line mr-3"></i>
            Dashboard
        </a>
        <a href="{{ route('driver.available-orders') }}" class="flex items-center px-6 py-3 text-gray-700 hover:bg-gray-100 {{ request()->routeIs('driver.available-orders') ? 'bg-gray-100 border-l-4 border-primary' : '' }}">
            <i class="fas fa-list mr-3"></i>
            Available Orders
        </a>
        <a href="{{ route('driver.my-orders') }}" class="flex items-center px-6 py-3 text-gray-700 hover:bg-gray-100 {{ request()->routeIs('driver.my-orders') ? 'bg-gray-100 border-l-4 border-primary' : '' }}">
            <i class="fas fa-box mr-3"></i>
            My Orders
        </a>
    </nav>
</aside>
