import { Component, OnInit } from '@angular/core';  // Import Angular core modules
import { MovieService } from '../../services/movie/movie.service';  // Import Movie service for fetching data
import { CommonModule } from '@angular/common';  // Import CommonModule for Angular features
import { HttpClientModule } from '@angular/common/http';  // Import HttpClientModule for HTTP requests
import { Router, RouterLink, RouterLinkActive } from '@angular/router';  // Import Angular Router for navigation

@Component({
  selector: 'app-home',  // Define the component's selector name
  standalone: true,  // This component is standalone and doesn't depend on others
  imports: [CommonModule, HttpClientModule, RouterLink, RouterLinkActive],  // Import necessary modules
  templateUrl: './home.component.html',  // Path to the HTML template file
  styleUrls: ['./home.component.css']  // Path to the CSS file for styling
})
export class HomeComponent implements OnInit {
  genres: any[] = [];  // Array to store genres fetched from the API
  genreMovies: { [key: string]: any[] } = {};  // Dictionary to store movies by genre name

  constructor(private movieService: MovieService, private router: Router) {}

  ngOnInit(): void {
    // Fetch movie genres when the component is initialized
    this.movieService.getGenres().subscribe(data => {
      this.genres = data.genres || [];  // Store genres, defaulting to an empty array if none are found
      this.loadMoviesForAllGenres();  // Call the method to load movies for each genre
    });
  }

  // Method to load movies for all the genres
  loadMoviesForAllGenres(): void {
    this.genres.forEach(genre => {
      // Fetch movies for each genre
      this.movieService.getMoviesByGenre(genre.id).subscribe(data => {
        const genreName = genre.name || 'Unknown Genre';  // Get genre name or default to 'Unknown Genre'
        // Initialize the genreMovies dictionary if it doesn't exist for this genre
        if (!this.genreMovies[genreName]) {
          this.genreMovies[genreName] = [];
        }
        // Add the fetched movies to the genreMovies dictionary
        this.genreMovies[genreName].push(...data.results || []);
      });
    });
  }

  // Method to get all the genre names from the genreMovies dictionary
  getGenreNames(): string[] {
    return Object.keys(this.genreMovies);  // Return the keys (genre names) of the genreMovies dictionary
  }
}
