import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { BehaviorSubject } from 'rxjs';
import { getAuth, createUserWithEmailAndPassword, signInWithEmailAndPassword, signOut, onAuthStateChanged, User, updateProfile as firebaseUpdateProfile } from 'firebase/auth';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  private auth = getAuth();
  private uidSubject = new BehaviorSubject<string | null>(null);
  uid$ = this.uidSubject.asObservable();  // Observable for UID changes

  constructor(private router: Router) {
    // Listen to authentication state changes
    onAuthStateChanged(this.auth, (user) => {
      if (user) {
        this.uidSubject.next(user.uid);
        console.log("User is logged in with UID:", user.uid);
      } else {
        this.uidSubject.next(null);
        console.log("User logged out");
      }
    });
  }

  // Check if the user is authenticated
  isAuthenticated(): boolean {
    return !!this.uidSubject.value;  // Check if UID is not null
  }

  // Get the current user's UID
  getUid(): string | null {
    const user = this.auth.currentUser;
    return user ? user.uid : null;
  }

  // Method to get the current user's username
  getUsername(): string {
    const user = this.auth.currentUser;
    return user ? user.displayName || 'Anonymous' : 'Anonymous';
  }

  getEmail() : string {
    const user  = this.auth.currentUser;
    return user ? user.email || 'undefined' : 'undefined';
  }

  // Register a new user
  async registerUser(email: string, password: string, displayName: string): Promise<void> {
    try {
      const userCredential = await createUserWithEmailAndPassword(this.auth, email, password);
      const user = userCredential.user;
      if (user) {
        // Ensure the user is defined and update profile
        await this.updateUserProfile(user, displayName);
        console.log("User registered:", user);
        await this.router.navigate(['']);
      }
    } catch (error) {
      console.error("Error during signup:", error);
      alert("Something went wrong while signing up.");
    }
  }

  // Helper function to update user profile
  private async updateUserProfile(user: User, displayName: string): Promise<void> {
    try {
      await firebaseUpdateProfile(user, { displayName });
    } catch (error) {
      console.error("Error updating profile:", error);
      throw new Error('Failed to update profile.');
    }
  }

  // Login a user
  async loginUser(email: string, password: string): Promise<void> {
    try {
      const userCredential = await signInWithEmailAndPassword(this.auth, email, password);
      console.log("User logged in:", userCredential.user);
      await this.router.navigate(['']);
    } catch (error) {
      console.error("Error during login:", error);
      alert("Something went wrong while logging in.");
    }
  }

  // Logout the current user
  async logout(): Promise<void> {
    try {
      await signOut(this.auth);
      console.log("User logged out successfully");
      await this.router.navigate(['/']); // Redirect to login after logout
    } catch (error) {
      console.error("Error during logout:", error);
      alert("Something went wrong while logging out.");
    }
  }
}
