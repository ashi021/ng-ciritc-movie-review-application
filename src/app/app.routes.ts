import { Routes } from '@angular/router';
import { LoginComponent } from './components/login/login.component';
import { SignupComponent } from './components/signup/signup.component';
import { AboutComponent } from './components/about/about.component';
import { ProfileComponent } from './components/profile/profile.component';
import { HomeComponent } from './components/home/home.component';
import { NotfoundComponent } from './components/notfound/notfound.component';
import { FavoriteComponent } from './components/favorite/favorite.component';
import { MovieComponent } from './components/movie/movie.component';
import { CommentsComponent } from './components/comments/comments.component';
import { authGuardGuard } from './guard/auth-guard.guard';

export const routes: Routes = [
  { path: '', component: HomeComponent},
  { path: 'login', component: LoginComponent},
  { path: 'signup', component: SignupComponent},
  { path: 'about', component: AboutComponent},
  { path: 'profile', component: ProfileComponent },
  { path: 'movie/:id', component: MovieComponent},
  { path: 'comments', component: CommentsComponent, canActivate: [authGuardGuard]  },
  { path: 'favorite', component: FavoriteComponent},
  { path: '**', component: NotfoundComponent}
];
