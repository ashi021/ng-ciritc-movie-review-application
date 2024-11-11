import { Component } from '@angular/core';
import { FormControl, FormControlName, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterLink, RouterLinkActive } from '@angular/router';
import { AuthService } from '../../services/auth/auth.service';

@Component({
  selector: 'app-login',  // The name of this component to be used in HTML
  standalone: true,  // This component is standalone and doesn't rely on others
  imports: [ReactiveFormsModule, RouterLink, RouterLinkActive],  // Import required modules for forms and routing
  templateUrl: './login.component.html',  // The HTML file for this component
  styleUrl: './login.component.css'  // The CSS file for this component
})
export class LoginComponent {

  // Injecting the AuthService and Router into the constructor for later use
  constructor(private authService: AuthService, private router: Router){}

  // Defining the 'email' form control with validation rules
  email = new FormControl("",[
    Validators.required,  // Email is required
    Validators.email,  // Email should be valid
  ])

  // Defining the 'password' form control with validation rules
  password = new FormControl("",[
    Validators.required,  // Password is required
    Validators.minLength(6),  // Password should be at least 6 characters long
  ])

  // Grouping the form controls together to form the login form
  loginForm = new FormGroup({
    email: this.email,  // Adding the email form control
    password: this.password  // Adding the password form control
  })

  // This method will be called when the login button is clicked
  login() {
    console.log(this.loginForm.value)  // Print form values in the console for debugging
    this.authService.loginUser(this.loginForm.value.email!, this.loginForm.value.password!)  // Call the login method in AuthService
  }

  // This method resets the form when the reset button is clicked
  reset() {
    this.loginForm.reset()  // Reset the form values
  }
}
