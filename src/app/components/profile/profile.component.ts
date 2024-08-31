import { Component } from '@angular/core';
import { AuthService } from '../../services/auth/auth.service';

@Component({
  selector: 'app-profile',
  standalone: true,
  imports: [],
  templateUrl: './profile.component.html',
  styleUrl: './profile.component.css'
})
export class ProfileComponent {

  username? : string
  email? : string
  profilePhoto?: any
  constructor(public authService: AuthService){
    this.username = this.authService.getUsername()
    this.email = this.authService.getEmail()
   }

}
