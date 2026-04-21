<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;

class AdminMiddleware
{

public function handle(Request $request, Closure $next)
{
    // Verificamos si el usuario está logueado y si es admin
    // Ajusta 'admin' al valor que uses en tu base de datos (ej: 1, 'administrador', etc.)
    if (auth()->check() && auth()->user()->role === 'admin') {
        return $next($request);
    }

    // Si no es admin, lo mandamos al home o dashboard con un error
    return redirect('/')->with('error', 'No tienes permisos de administrador.');
}
}
