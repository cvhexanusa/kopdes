<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\URL;
use Symfony\Component\HttpFoundation\Response;

class HandleRolePrefix
{
    /**
     * Handle an incoming request.
     *
     * @param  \Closure(\Illuminate\Http\Request): (\Symfony\Component\HttpFoundation\Response)  $next
     */
    public function handle(Request $request, Closure $next): Response
    {
        $peranInUrl = $request->route('peran');
        $user = auth()->user();

        if ($user && $peranInUrl) {
            // Set global default for 'peran' parameter in route() helper
            URL::defaults(['peran' => $user->peran]);

            // Validate access
            if ($user->peran !== $peranInUrl) {
                // Redirect to the correct role path if they try to access another role's URL
                $newUrl = str_replace("/{$peranInUrl}/", "/" . $user->peran . "/", $request->getRequestUri());
                return redirect($newUrl);
            }

            // Forget 'peran' so it doesn't get passed as an argument to controller methods
            $request->route()->forgetParameter('peran');
        }

        return $next($request);
    }
}
