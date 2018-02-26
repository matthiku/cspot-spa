<?php

namespace App\Http\Controllers\Auth;

use Auth;
use App\Http\Controllers\Controller;
use Illuminate\Support\Facades\Redirect;
use Illuminate\Foundation\Auth\AuthenticatesUsers;

class LoginController extends Controller
{
    /*
    |--------------------------------------------------------------------------
    | Login Controller
    |--------------------------------------------------------------------------
    |
    | This controller handles authenticating users for the application and
    | redirecting them to your home screen. The controller uses a trait
    | to conveniently provide its functionality to your applications.
    |
    */

    use AuthenticatesUsers;

    /**
     * Where to redirect users after login.
     *
     * @var string
     */
    protected $redirectTo = '/';

    /**
     * Create a new controller instance.
     *
     * @return void
     */
    public function __construct()
    {
        $this->middleware('guest')->except('logout');
    }

    /**
     * The user has been authenticated.
     *
     * @param \Illuminate\Http\Request $request request
     * @param mixed                    $user    user object
     *
     * @return mixed various
     */
    protected function authenticated(\Illuminate\Http\Request $request, $user)
    {
        // we ONLY have ajax requests...
        // if ($request->ajax() || $request->expectsJson() || 'a'==='a') {

            $auth = auth()->check();
            $user = \App\Models\User::with('roles')->where('id', Auth::user()->id)->first();

            $url = Redirect::intended('/')->getTargetUrl();
            return response()->json(
                [
                    'auth' => $auth,
                    'user' => $user,
                    'intended' => $url,
                ]
            );

        // }
    }

    /**
     * Let the frontend handle the login form provisioning
     *
     * @return view
     */
    public function showLoginForm()
    {
        return view('app', ['data' => []]);
    }



    public function logout()
    {
        Auth::logout();
        return response()
        ->json([
            'logout' => true
        ]);
    }

}
