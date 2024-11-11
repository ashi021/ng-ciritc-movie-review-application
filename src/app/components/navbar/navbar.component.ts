import { Component } from '@angular/core';
import { RouterLink, RouterLinkActive } from '@angular/router';  // For navigation links
import { AuthService } from '../../services/auth/auth.service';  // Service to manage authentication
import { SearchBarComponent } from '../search-bar/search-bar.component';  // Search bar component

@Component({
  selector: 'app-navbar',  // Component selector
  standalone: true,  // This component is standalone
  imports: [RouterLink, RouterLinkActive, SearchBarComponent],  // Modules and components used in this component
  templateUrl: './navbar.component.html',  // Path to the template HTML file
  styleUrls: ['./navbar.component.css']  // Path to the CSS file for styling
})
export class NavbarComponent {
  // Injecting the AuthService into the constructor
  constructor(public authService: AuthService) {}
}
