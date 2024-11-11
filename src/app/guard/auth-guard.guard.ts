import { inject } from '@angular/core'; // Import 'inject' to inject dependencies
import { CanActivateFn } from '@angular/router'; // Import CanActivateFn for route guard
import { AuthService } from '../services/auth/auth.service'; // Import AuthService for authentication

// Define the authGuardGuard function to check authentication
export const authGuardGuard: CanActivateFn = () => {
  const authService = inject(AuthService); // Inject the AuthService

  // Check if the user is authenticated
  if(authService.isAuthenticated()){
    return true; // Allow access if authenticated
  } else {
    return false; // Deny access if not authenticated
  }
};
