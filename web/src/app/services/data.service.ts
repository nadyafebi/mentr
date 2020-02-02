import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';
import { Chat, Course, Match, Mentor, User } from '../schemas';
import { map } from 'rxjs/operators';
import * as firebase from 'firebase/app';
import 'firebase/firestore';

@Injectable({
  providedIn: 'root'
})
export class DataService {

  constructor(
    private afs: AngularFirestore
  ) { }

  getCourses$() {
    return this.afs.collection<Course>('courses').snapshotChanges()
    .pipe(
      map(courseDocs => {
        return courseDocs.map(courseDoc => {
          const course = courseDoc.payload.doc.data();
          course.id = courseDoc.payload.doc.id;
          return course;
        });
      })
    );
  }

  findMentors$(courseId: string) {
    return this.afs.collection<Mentor>('mentors', ref => {
      return ref.where('course', '==', courseId);
    })
    .snapshotChanges()
    .pipe(
      map(mentorDocs => {
        return mentorDocs.map(mentorDoc => {
          const mentor = mentorDoc.payload.doc.data();
          mentor.id = mentorDoc.payload.doc.id;
          mentor.reviewCount = Math.floor((Math.random() * 100) + 1);
          mentor.reviewStars = Math.floor(Math.random() * (5 - 3 + 1) + 3);;
          return mentor;
        });
      })
    );
  }

  findMenteeMatches$(mentorId: string) {
    return this.afs.collection<Match>('matches', ref => {
      return ref
      .where('mentor', '==', mentorId)
      .where('status', '==', 'pending');
    })
    .snapshotChanges()
    .pipe(
      map(courseDocs => {
        return courseDocs.map(courseDoc => {
          const course = courseDoc.payload.doc.data();
          course.id = courseDoc.payload.doc.id;
          return course;
        });
      })
    );
  }

  findMatchedMentors$(userId: string) {
    return this.afs.collection<Match>('matches', ref => {
      return ref
      .where('mentee', '==', userId)
      .where('status', '==', 'accepted');
    }).snapshotChanges()
    .pipe(
      map(matchDocs => {
        return matchDocs.map(matchDoc => {
          const match = matchDoc.payload.doc.data();
          match.id = matchDoc.payload.doc.id;
          return match;
        });
      })
    );;
  }

  async createMatch(userId: string, mentorId: string, courseId: string) {
    await this.afs.collection('matches').add({
      mentee: userId,
      mentor: mentorId,
      course: courseId,
      status: 'pending'
    });
  }

  async acceptMatch(matchId: string) {
    await this.afs.collection('matches').doc<Match>(matchId).update({
      status: 'accepted'
    });
  }

  async rejectMatch(matchId: string) {
    await this.afs.collection('matches').doc<Match>(matchId).update({
      status: 'rejected'
    });
  }

  async sendChat(matchId: string, userId: string, type: 'text' | 'image', content: string) {
    await this.afs.collection('matches').doc(matchId).collection<Chat>('chats').add({
      user: userId,
      type,
      content,
      time: firebase.firestore.FieldValue.serverTimestamp()
    });
  }

  getChats$(matchId: string) {
    return this.afs
    .collection('matches')
    .doc(matchId)
    .collection<Chat>('chats')
    .valueChanges()
    .pipe(
      map(chats => {
        return chats.sort((a, b) => {
          const aTime = (a.time as firebase.firestore.Timestamp) || { seconds: Date.now() };
          const bTime = (b.time as firebase.firestore.Timestamp) || { seconds: Date.now() };
          return aTime.seconds - bTime.seconds;
        });
      })
    );
  }

  async getDoc<T extends {id?: string}>(collection: string, docId: string) {
    const doc = await this.afs.collection(collection).doc<T>(docId).ref.get();
    const obj = doc.data() as T;
    obj.id = doc.id;
    return obj;
  }

  getDoc$<T extends {id?: string}>(collection: string, docId: string) {
    return this.afs.collection(collection).doc<T>(docId).snapshotChanges()
    .pipe(
      map(snap => {
        const obj = snap.payload.data();
        obj.id = snap.payload.id;
        return obj;
      })
    );
  }
}
