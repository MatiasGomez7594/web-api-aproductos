<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;

class EnsureUserIsAdmin
{
    /**
     * Handle an incoming request.
     *
     * @param  \Closure(\Illuminate\Http\Request): (\Symfony\Component\HttpFoundation\Response)  $next
     */
    public function handle($request, Closure $next)
    {
        // Verificamos si el usuario está logueado y si su rol es 'admin'
        if (auth()->check() && auth()->user()->role === 'admin') {
            return $next($request);
        }

    // Si no es admin, lo mandamos de vuelta con un error
        abort(403, 'No tienes permisos de administrador.');
    }
}
