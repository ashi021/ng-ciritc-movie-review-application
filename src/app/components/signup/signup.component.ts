import { Component } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterLink, RouterLinkActive } from '@angular/router';
import { AuthService } from '../../services/auth/auth.service';

@Component({
  selector: 'app-signup', // Defines the component selector
  standalone: true, // Marks this component as standalone
  imports: [ReactiveFormsModule, RouterLink, RouterLinkActive], // Imports necessary modules
  templateUrl: './signup.component.html', // Path to the component's HTML template
  styleUrls: ['./signup.component.css'] // Path to the component's CSS file
})
export class SignupComponent {

  constructor(private authService: AuthService, private router: Router) {}

  // Define form controls for username, email, and password
  username = new FormControl("", [
    Validators.required, // Username is required
  ]);

  email = new FormControl("", [
    Validators.required, // Email is required
    Validators.email, // Email must be a valid email format
  ]);

  password = new FormControl("", [
    Validators.required, // Password is required
    Validators.minLength(6), // Password must be at least 6 characters long
  ]);

  // Group the form controls into a form group
  signupForm = new FormGroup({
    username: this.username,
    email: this.email,
    password: this.password
  });

  // Async method to handle signup
  async signup() {
    if (this.signupForm.valid) { // Check if the form is valid
      const { username, email, password } = this.signupForm.value;
      try {
        // Call the authService to register the user
        await this.authService.registerUser(email!, password!, username!);
        this.router.navigate(['']); // Navigate to a different route on successful signup
      } catch (error) {
        console.error('Signup error:', error); // Log error if signup fails
      }
    } else {
      console.error('Please fill out all fields correctly.'); // Log message if form is invalid
    }
  }

  // Method to reset the form
  reset() {
    this.signupForm.reset(); // Reset the form values
  }
}
