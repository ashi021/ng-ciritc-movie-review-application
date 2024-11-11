import { Component } from '@angular/core';
import { AuthService } from '../../services/auth/auth.service';

@Component({
  selector: 'app-profile', // Defines the component selector
  standalone: true, // Marks this component as standalone
  imports: [], // No additional imports needed
  templateUrl: './profile.component.html', // Path to the component's HTML template
  styleUrl: './profile.component.css' // Path to the component's CSS file
})
export class ProfileComponent {

  username? : string // The user's username, optional as it may be undefined
  email? : string // The user's email, optional as it may be undefined
  profilePhoto?: any // The user's profile photo, optional as it may be undefined

  constructor(public authService: AuthService) {
    // Initialize username and email by calling AuthService methods
    this.username = this.authService.getUsername() 
    this.email = this.authService.getEmail() 
  }

}
