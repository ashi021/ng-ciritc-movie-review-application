import { Injectable } from '@angular/core'; // Import Injectable decorator for the service
import { Router } from '@angular/router'; // Import Router for navigation
import { BehaviorSubject } from 'rxjs'; // Import BehaviorSubject to handle state changes
import { getAuth, createUserWithEmailAndPassword, signInWithEmailAndPassword, signOut, onAuthStateChanged, User, updateProfile as firebaseUpdateProfile } from 'firebase/auth'; // Import Firebase authentication methods

@Injectable({
  providedIn: 'root' // Provide the service at the root level
})
export class AuthService {

  private auth = getAuth(); // Get the Firebase Auth instance
  private uidSubject = new BehaviorSubject<string | null>(null); // Initialize BehaviorSubject to track UID
  uid$ = this.uidSubject.asObservable();  // Observable to listen to UID changes

  constructor(private router: Router) {
    // Listen to authentication state changes and update UID accordingly
    onAuthStateChanged(this.auth, (user) => {
      if (user) {
        this.uidSubject.next(user.uid); // Set UID if user is authenticated
        console.log("User is logged in with UID:", user.uid);
      } else {
        this.uidSubject.next(null); // Reset UID if user is logged out
        console.log("User logged out");
      }
    });
  }

  // Check if the user is authenticated
  isAuthenticated(): boolean {
    return !!this.uidSubject.value;  // Return true if UID is not null
  }

  // Get the current user's UID
  getUid(): string | null {
    const user = this.auth.currentUser; // Get the current user
    return user ? user.uid : null; // Return the UID if user exists, otherwise null
  }

  // Get the current user's username
  getUsername(): string {
    const user = this.auth.currentUser; // Get the current user
    return user ? user.displayName || 'Anonymous' : 'Anonymous'; // Return display name if available, else 'Anonymous'
  }

  // Get the current user's email
  getEmail() : string {
    const user  = this.auth.currentUser; // Get the current user
    return user ? user.email || 'undefined' : 'undefined'; // Return email if available, else 'undefined'
  }

  // Register a new user
  async registerUser(email: string, password: string, displayName: string): Promise<void> {
    try {
      const userCredential = await createUserWithEmailAndPassword(this.auth, email, password); // Register the user with email and password
      const user = userCredential.user;
      if (user) {
        // Update profile if user is successfully registered
        await this.updateUserProfile(user, displayName);
        console.log("User registered:", user);
        await this.router.navigate(['']); // Navigate to home page after successful signup
      }
    } catch (error) {
      console.error("Error during signup:", error); // Log error if signup fails
      alert("Something went wrong while signing up.");
    }
  }

  // Helper function to update user profile
  private async updateUserProfile(user: User, displayName: string): Promise<void> {
    try {
      await firebaseUpdateProfile(user, { displayName }); // Update the user's display name in Firebase
    } catch (error) {
      console.error("Error updating profile:", error); // Log error if profile update fails
      throw new Error('Failed to update profile.');
    }
  }

  // Login a user
  async loginUser(email: string, password: string): Promise<void> {
    try {
      const userCredential = await signInWithEmailAndPassword(this.auth, email, password); // Log the user in with email and password
      console.log("User logged in:", userCredential.user);
      await this.router.navigate(['']); // Navigate to home page after successful login
    } catch (error) {
      console.error("Error during login:", error); // Log error if login fails
      alert("Something went wrong while logging in.");
    }
  }

  // Logout the current user
  async logout(): Promise<void> {
    try {
      await signOut(this.auth); // Sign out the user
      console.log("User logged out successfully");
      await this.router.navigate(['/']); // Redirect to login page after successful logout
    } catch (error) {
      console.error("Error during logout:", error); // Log error if logout fails
      alert("Something went wrong while logging out.");
    }
  }
}
