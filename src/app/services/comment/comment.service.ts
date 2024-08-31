import { Injectable } from '@angular/core';
import { AuthService } from '../auth/auth.service';
import { Firestore, collection, addDoc, query, orderBy, getDocs, where, doc, updateDoc, QuerySnapshot, getFirestore } from 'firebase/firestore';
import { initializeApp } from 'firebase/app';
import { firebaseConfig } from '../../../firebaseConfig';
import { Observable, from } from 'rxjs';
import { map, catchError } from 'rxjs/operators';

// Initialize Firebase app (ensure this is done only once in your app)
initializeApp(firebaseConfig);

interface Comment {
  id?: string;
  title: string;
  rating: number;
  description: string;
  movieId: string;
  uid: string;
  timestamp: Date;
  username: string;
}

@Injectable({
  providedIn: 'root'
})
export class CommentService {
  private firestore: Firestore;

  constructor(private authService: AuthService) {
    this.firestore = getFirestore(); // Initialize Firestore
  }

  // Check if user has already commented on a movie
  async userHasCommented(movieId: string, uid: string | null): Promise<boolean> {
    if (!uid) return false; // If UID is null, the user cannot comment

    try {
      const commentsCollection = collection(this.firestore, 'comments');
      const q = query(commentsCollection, where('movieId', '==', movieId), where('uid', '==', uid));
      const querySnapshot = await getDocs(q);
      return !querySnapshot.empty;
    } catch (error) {
      console.error('Error checking if user has commented:', error);
      return false; // Default to false in case of an error
    }
  }

  // Add a comment
  async addComment(title: string, rating: number, description: string, movieId: string): Promise<void> {
    const uid = this.authService.getUid();
    if (!uid) throw new Error('User is not authenticated.');

    const username = this.authService.getUsername(); // Get username

    if (!username) throw new Error('Username not found.');

    const hasCommented = await this.userHasCommented(movieId, uid);
    if (hasCommented) throw new Error('You have already commented on this movie.');

    const comment: Comment = {
      title,
      rating,
      description,
      movieId,
      uid,
      timestamp: new Date(), // Store current date and time
      username // Include username in the comment object
    };

    try {
      await addDoc(collection(this.firestore, 'comments'), comment);
    } catch (error) {
      console.error('Error adding comment:', error);
      throw new Error('Failed to add comment.');
    }
  }

  // Update a comment
  async updateComment(id: string, title: string, rating: number, description: string): Promise<void> {
    const commentRef = doc(this.firestore, 'comments', id);

    try {
      await updateDoc(commentRef, { title, rating, description });
    } catch (error) {
      console.error('Error updating comment:', error);
      throw new Error('Failed to update comment.');
    }
  }

  // Get all comments
  getAllComments(): Observable<Comment[]> {
    const commentsCollection = collection(this.firestore, 'comments');
    const q = query(commentsCollection, orderBy('timestamp', 'desc'));

    return from(getDocs(q)).pipe(
      map((querySnapshot: QuerySnapshot) => {
        const comments: Comment[] = [];
        querySnapshot.forEach((doc) => {
          const data = doc.data();
          const timestamp = data['timestamp']?.toDate() || new Date(); // Ensure timestamp is correctly converted
          comments.push({ id: doc.id, ...data, timestamp } as Comment);
        });
        return comments;
      }),
      catchError((error) => {
        console.error('Error fetching comments:', error);
        throw new Error('Failed to fetch comments.');
      })
    );
  }
}
