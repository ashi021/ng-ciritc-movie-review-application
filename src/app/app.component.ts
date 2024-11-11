import { Component } from '@angular/core'; // Import Component decorator from Angular
import { RouterOutlet } from '@angular/router'; // Import RouterOutlet to enable routing in the app
import { NavbarComponent } from './components/navbar/navbar.component'; // Import Navbar component
import { FooterComponent } from './components/footer/footer.component'; // Import Footer component
import { firebaseConfig } from '../firebaseConfig'; // Import Firebase configuration
import { initializeApp } from 'firebase/app'; // Import Firebase initialization function
import { MovieComponent } from './components/movie/movie.component'; // Import Movie component

@Component({
  selector: 'app-root', // Define the selector for the component
  standalone: true, // Set this component as standalone (no module required)
  imports: [RouterOutlet, NavbarComponent, FooterComponent, MovieComponent], // Import necessary components for this component
  templateUrl: './app.component.html', // Specify the HTML template file for the component
  styleUrl: './app.component.css' // Specify the CSS stylesheet for the component
})
export class AppComponent {
  title = 'Critic!'; // Define the title property for the app
  
  constructor(){
    // Initialize Firebase app with configuration
    initializeApp(firebaseConfig);
  }

}
