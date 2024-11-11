import { HttpClient } from '@angular/common/http'; // Import HttpClient for making HTTP requests
import { Injectable } from '@angular/core'; // Import Injectable decorator for the service
import { Observable } from 'rxjs'; // Import Observable for handling asynchronous operations

@Injectable({
  providedIn: 'root' // Provide the service at the root level
})
export class MovieService {
  private apiKey = '61775b8548018c250c432798190b913a'; // Replace with your TMDB API key
  private apiUrl = `https://api.themoviedb.org/3`; // The base URL for the TMDB API

  constructor(private http: HttpClient) { } // Inject HttpClient for making API requests

  // Search for movies based on a query string
  searchMovies(query: string): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/search/movie?api_key=${this.apiKey}&query=${encodeURIComponent(query)}&language=en-US&page=1`);
  }
  
  // Get movie details by movie ID
  getMovieById(id: string): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/movie/${id}?api_key=${this.apiKey}`);
  }
  
  // Get a list of movie genres
  getGenres(): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/genre/movie/list?api_key=${this.apiKey}`);
  }

  // Get a list of available languages
  getLanguages(): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/configuration/languages?api_key=${this.apiKey}`);
  }

  // Get movies by genre ID
  getMoviesByGenre(genreId: number): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/discover/movie?api_key=${this.apiKey}&with_genres=${genreId}`);
  }

  // Get movies by language code
  getMoviesByLanguage(languageCode: string): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/discover/movie?api_key=${this.apiKey}&with_original_language=${languageCode}`);
  }

  // Get a list of popular movies
  getPopularMovies(): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/movie/popular?api_key=${this.apiKey}`);
  }

  // Get movie videos (trailers, etc.) by movie ID
  getMovieVideos(id: string): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/movie/${id}/videos?api_key=${this.apiKey}`);
  }
}
