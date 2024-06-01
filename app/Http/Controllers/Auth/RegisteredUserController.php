<?php

namespace App\Http\Controllers\Auth;

use App\Http\Controllers\Controller;
use App\Models\Roles;
use App\Models\Sites;
use App\Models\User;
use Illuminate\Support\str;
use App\Providers\RouteServiceProvider;
use Illuminate\Auth\Events\Registered;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Storage;
use Illuminate\Validation\Rules;
use Inertia\Inertia;
use Inertia\Response;

class RegisteredUserController extends Controller
{
    /**
     * Display the registration view.
     */
    public function create(): Response
    {
        $role = "Lova";
        return Inertia::render('Auth/Register', [
            'var' => $role
        ]);
    }

    /**
     * Handle an incoming registration request.
     *
     * @throws \Illuminate\Validation\ValidationException
     */
    // public function store(Request $request): RedirectResponse
    // {
    //     $request->validate([
    //         'name' => 'required|string|max:255',
    //         'email' => 'required|string|lowercase|email|max:255|unique:'.User::class,
    //         'password' => ['required', 'confirmed', Rules\Password::defaults()],
    //         'role' => 'required',
    //         'site' => 'required',
    //         'image_profile' => 'nullable|image|mimes:jpeg,png,jpg,gif|max:2048'
    //     ]);

    //     //on teste si il l'image existe
    //     if ($request->hasFile('image_profile')) {
    //         $imageName = str::random(32).".".$request->image_profile->getClientOriginalExtension();
    //     }else {
    //         $imageName = null;
    //     }

    //     $user = User::create([
    //         'name' => $request->name,
    //         'email' => $request->email,
    //         'password' => Hash::make($request->password),
    //         'role' => $request->role,
    //         'site' => $request->site,
    //         'image_profile' => $imageName
    //         // 'approved' => $request->has('approved')
    //     ]);

    //     event(new Registered($user));
    //     Storage::disk('public')->put($imageName, file_get_contents($request->image_profile));
    //     Auth::login($user);

    //     return redirect(RouteServiceProvider::HOME);
    // }

    
    public function store(Request $request): RedirectResponse
    {
        $request->validate([
            'name' => 'required|string|max:255',
            'email' => 'required|string|lowercase|email|max:255|unique:' . User::class,
            'password' => ['required', 'confirmed', Rules\Password::defaults()],
            'role' => 'required',
            'site' => 'required',
            'image_profile' => 'nullable|image|mimes:jpeg,png,jpg,gif|max:2048'
        ]);

        $imageName = null;
        if ($request->hasFile('image_profile')) {
            $imageName = Str::random(32) . "." . $request->image_profile->getClientOriginalExtension();
            Storage::disk('public')->put($imageName, file_get_contents($request->file('image_profile')->getRealPath()));
        }

        $user = User::create([
            'name' => $request->name,
            'email' => $request->email,
            'password' => Hash::make($request->password),
            'role' => $request->role,
            'site' => $request->site,
            'image_profile' => $imageName,
        ]);

        event(new Registered($user));
        Auth::login($user);

        return redirect(RouteServiceProvider::HOME);
    }


}
