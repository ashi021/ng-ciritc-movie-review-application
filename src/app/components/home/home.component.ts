import { Component, OnInit } from '@angular/core';
import { MovieService } from '../../services/movie/movie.service';
import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import { Router, RouterLink, RouterLinkActive } from '@angular/router';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule, HttpClientModule, RouterLink, RouterLinkActive],
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {
  genres: any[] = [];
  genreMovies: { [key: string]: any[] } = {}; // Dictionary to hold movies by genre name

  constructor(private movieService: MovieService, private router: Router) {}

  ngOnInit(): void {
    this.movieService.getGenres().subscribe(data => {
      this.genres = data.genres || [];
      this.loadMoviesForAllGenres();
    });
  }

  loadMoviesForAllGenres(): void {
    this.genres.forEach(genre => {
      this.movieService.getMoviesByGenre(genre.id).subscribe(data => {
        const genreName = genre.name || 'Unknown Genre';
        if (!this.genreMovies[genreName]) {
          this.genreMovies[genreName] = [];
        }
        this.genreMovies[genreName].push(...data.results || []);
      });
    });
  }

  getGenreNames(): string[] {
    return Object.keys(this.genreMovies);
  }

  
}
