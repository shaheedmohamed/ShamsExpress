<nav class="bg-white shadow-lg">
    <div class="max-w-7xl mx-auto px-4">
        <div class="flex justify-between items-center h-16">
            <div class="flex items-center">
                <h1 class="text-2xl font-bold text-primary">
                    <i class="fas fa-shipping-fast"></i> Shams Express
                </h1>
            </div>
            
            @auth
            <div class="flex items-center space-x-4">
                <span class="text-gray-700">{{ auth()->user()->name }}</span>
                <span class="px-3 py-1 rounded-full text-xs font-semibold bg-primary text-white">
                    {{ ucfirst(auth()->user()->role) }}
                </span>
                <form method="POST" action="{{ route('logout') }}">
                    @csrf
                    <button type="submit" class="text-gray-700 hover:text-primary">
                        <i class="fas fa-sign-out-alt"></i> Logout
                    </button>
                </form>
            </div>
            @endauth
        </div>
    </div>
</nav>
