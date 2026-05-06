<?php

namespace App\Http\Controllers;
use App\Models\User;

use App\Http\Requests\ProfileUpdateRequest;
use Illuminate\Contracts\Auth\MustVerifyEmail;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Redirect;
use Inertia\Inertia;
use Inertia\Response;
use Illuminate\Validation\Rule;
use Illuminate\Support\Facades\Hash;


class ProfileController extends Controller
{
    /**
     * Display the user's profile form.
     */
    public function edit(Request $request): Response
    {
        return Inertia::render('Profile/Edit', [
            'mustVerifyEmail' => $request->user() instanceof MustVerifyEmail,
            'status' => session('status'),
        ]);
    }

    /**
     * Update the user's profile information.
     */
    public function update(ProfileUpdateRequest $request): RedirectResponse
    {
        $request->user()->fill($request->validated());

        if ($request->user()->isDirty('email')) {
            $request->user()->email_verified_at = null;
        }

        $request->user()->save();

        return Redirect::route('profile.edit');
    }

    /**
     * Delete the user's account.
     */
    public function destroy(Request $request): RedirectResponse
    {
        $request->validate([
            'password' => ['required', 'current_password'],
        ]);

        $user = $request->user();

        Auth::logout();

        $user->delete();

        $request->session()->invalidate();
        $request->session()->regenerateToken();

        return Redirect::to('/');
    }

    //funciones del administrador
    /*
    public function Vendedores()
    {
    // Obtenemos todos los vendedores de la base de datos
        $vendedores= \App\Models\User::where('role', '=', 'vendedor')->get();

     // ¡IMPORTANTE! Debes retornar los datos
        return response()->json($users);
    }
        */

    public function storeVendedor(Request $request)
{
    // 1. Validamos los datos
    $validated = $request->validate([
        'name' => 'required|string|max:255',
        'email' => 'required|string|email|max:255|unique:users,email',
        'password' => 'required|string|min:8|max:8', 
    ]);
// 2. Creamos el vendedor inyectando el rol y encriptando el pass
    \App\Models\User::create([
        'name' => $validated['name'],
        'email' => $validated['email'],
        'password' => Hash::make($validated['password']), // ¡Fundamental!
        'role' => 'vendedor', // Forzamos el rol aquí
    ]);

    // 3. Redireccionamos
    return redirect()->back()->with('message', 'Vendedor creado con éxito');
}



public function updateVendedor(Request $request, $id)
{
    $vendedor = \App\Models\User::findOrFail($id);

    $validated = $request->validate([
        'name' => 'required|string|max:255',
        'email' => 'required|string|email|max:255|unique:users,email,' . $id,
        'contrasena' => 'nullable|string|min:8|max:8', // 'nullable' permite que llegue vacío
    ]);

    // Actualizamos los datos básicos
    $vendedor->name = $validated['name'];
    $vendedor->email = $validated['email'];

    // SOLO si el Admin escribió algo en el campo contrasena, la cambiamos
    if (!empty($validated['contrasena'])) {
        $vendedor->password = \Illuminate\Support\Facades\Hash::make($validated['contrasena']);
    }

    $vendedor->save();

    return redirect()->back();
}
     public function destroyVendedor($id)
    {
        $vendedor = \App\Models\User::findOrFail($id);
        $vendedor->delete();

        return redirect()->back();
    }
        
    
}
