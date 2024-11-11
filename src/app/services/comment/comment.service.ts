import { Injectable } from '@angular/core'; // Import Injectable decorator for the service
import { AuthService } from '../auth/auth.service'; // Import AuthService to manage user authentication
import { Firestore, collection, addDoc, query, orderBy, getDocs, where, doc, updateDoc, QuerySnapshot, getFirestore } from 'firebase/firestore'; // Import Firestore functions for database operations
import { initializeApp } from 'firebase/app'; // Import Firebase initialization function
import { firebaseConfig } from '../../../firebaseConfig'; // Import Firebase configuration
import { Observable, from } from 'rxjs'; // Import Observable and from for handling asynchronous operations
import { map, catchError } from 'rxjs/operators'; // Import operators for mapping and handling errors

// Initialize Firebase app (ensure this is done only once in your app)
initializeApp(firebaseConfig);

interface Comment { // Define Comment interface
  id?: string; // Optional ID for the comment
  title: string; // Title of the comment
  rating: number; // Rating for the movie
  description: string; // Description of the comment
  movieId: string; // Movie ID associated with the comment
  uid: string; // User ID of the commenter
  timestamp: Date; // Timestamp when the comment was created
  username: string; // Username of the commenter
}

@Injectable({
  providedIn: 'root' // Provide the service at the root level
})
export class CommentService {
  private firestore: Firestore; // Declare Firestore instance

  constructor(private authService: AuthService) {
    this.firestore = getFirestore(); // Initialize Firestore
  }

  // Check if user has already commented on a movie
  async userHasCommented(movieId: string, uid: string | null): Promise<boolean> {
    if (!uid) return false; // If UID is null, the user cannot comment

    try {
      const commentsCollection = collection(this.firestore, 'comments'); // Get comments collection
      const q = query(commentsCollection, where('movieId', '==', movieId), where('uid', '==', uid)); // Query for comments with specific movieId and uid
      const querySnapshot = await getDocs(q); // Fetch query results
      return !querySnapshot.empty; // Return true if there are any comments, false otherwise
    } catch (error) {
      console.error('Error checking if user has commented:', error); // Log error if fetching comments fails
      return false; // Default to false in case of an error
    }
  }

  // Add a comment
  async addComment(title: string, rating: number, description: string, movieId: string): Promise<void> {
    const uid = this.authService.getUid(); // Get the current user's UID
    if (!uid) throw new Error('User is not authenticated.'); // Throw error if user is not authenticated

    const username = this.authService.getUsername(); // Get the current user's username
    if (!username) throw new Error('Username not found.'); // Throw error if username is not found

    const hasCommented = await this.userHasCommented(movieId, uid); // Check if user has already commented
    if (hasCommented) throw new Error('You have already commented on this movie.'); // Throw error if user has already commented

    const comment: Comment = { // Create the comment object
      title,
      rating,
      description,
      movieId,
      uid,
      timestamp: new Date(), // Store current date and time
      username // Include username in the comment object
    };

    try {
      await addDoc(collection(this.firestore, 'comments'), comment); // Add the comment to Firestore
    } catch (error) {
      console.error('Error adding comment:', error); // Log error if adding comment fails
      throw new Error('Failed to add comment.'); // Throw error if operation fails
    }
  }

  // Update a comment
  async updateComment(id: string, title: string, rating: number, description: string): Promise<void> {
    const commentRef = doc(this.firestore, 'comments', id); // Get reference to the comment document

    try {
      await updateDoc(commentRef, { title, rating, description }); // Update the comment in Firestore
    } catch (error) {
      console.error('Error updating comment:', error); // Log error if updating comment fails
      throw new Error('Failed to update comment.'); // Throw error if operation fails
    }
  }

  // Get all comments
  getAllComments(): Observable<Comment[]> {
    const commentsCollection = collection(this.firestore, 'comments'); // Get comments collection
    const q = query(commentsCollection, orderBy('timestamp', 'desc')); // Query to order comments by timestamp in descending order

    return from(getDocs(q)).pipe( // Convert the promise from getDocs to an observable
      map((querySnapshot: QuerySnapshot) => { // Map query result to an array of Comment objects
        const comments: Comment[] = [];
        querySnapshot.forEach((doc) => { // Iterate through the documents in the query result
          const data = doc.data(); // Get document data
          const timestamp = data['timestamp']?.toDate() || new Date(); // Ensure timestamp is correctly converted
          comments.push({ id: doc.id, ...data, timestamp } as Comment); // Push the formatted comment into the array
        });
        return comments; // Return the array of comments
      }),
      catchError((error) => { // Handle errors that occur during the operation
        console.error('Error fetching comments:', error); // Log error if fetching comments fails
        throw new Error('Failed to fetch comments.'); // Throw error if operation fails
      })
    );
  }
}
