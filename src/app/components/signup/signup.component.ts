import { Component } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterLink, RouterLinkActive } from '@angular/router';
import { AuthService } from '../../services/auth/auth.service';

@Component({
  selector: 'app-signup',
  standalone: true,
  imports: [ReactiveFormsModule, RouterLink, RouterLinkActive],
  templateUrl: './signup.component.html',
  styleUrls: ['./signup.component.css']
})
export class SignupComponent {

  constructor(private authService: AuthService, private router: Router) {}

  username = new FormControl("", [
    Validators.required,
  ]);

  email = new FormControl("", [
    Validators.required,
    Validators.email,
  ]);

  password = new FormControl("", [
    Validators.required,
    Validators.minLength(6),
  ]);

  signupForm = new FormGroup({
    username: this.username,
    email: this.email,
    password: this.password
  });

  async signup() {
    if (this.signupForm.valid) {
      const { username, email, password } = this.signupForm.value;
      try {
        await this.authService.registerUser(email!, password!, username!);
        this.router.navigate(['']); // Navigate to a different route on successful signup
      } catch (error) {
        console.error('Signup error:', error);
      }
    } else {
      console.error('Please fill out all fields correctly.');
    }
  }

  reset() {
    this.signupForm.reset();
  }
}
