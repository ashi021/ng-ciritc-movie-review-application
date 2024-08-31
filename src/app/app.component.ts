import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { NavbarComponent } from './components/navbar/navbar.component';
import { FooterComponent } from './components/footer/footer.component';
import { firebaseConfig } from '../firebaseConfig';
import { initializeApp } from 'firebase/app';
import { MovieComponent } from './components/movie/movie.component';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, NavbarComponent, FooterComponent, MovieComponent] ,
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent {
  title = 'Critic!'
  
  constructor(){
    initializeApp(firebaseConfig);
  }

}
