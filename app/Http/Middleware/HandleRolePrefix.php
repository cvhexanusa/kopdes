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
            $correctPeran = trim(strtolower($user->peran));
            $currentPeran = trim(strtolower($peranInUrl));

            if ($correctPeran !== $currentPeran) {
                // Redirect to the correct role path
                $requestUri = $request->getRequestUri();
                $newUrl = preg_replace("/^\/{$peranInUrl}/", "/{$correctPeran}", $requestUri);
                return redirect($newUrl);
            }

        }

        return $next($request);
    }
}
