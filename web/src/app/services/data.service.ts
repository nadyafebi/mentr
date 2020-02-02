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
    }).valueChanges();
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

    const match = await this.getDoc<Match>('matches', matchId);
    await this.afs.collection('chatrooms').add({
      users: [match.mentee, match.mentor],
      mentee: match.mentee,
      mentor: match.mentor,
      match: matchId
    });
  }

  async sendChat(chatroomId: string, userId: string, type: 'text' | 'image', content: string) {
    await this.afs.collection('chatrooms').doc(chatroomId).collection<Chat>('chats').add({
      user: userId,
      type,
      content,
      time: firebase.firestore.FieldValue.serverTimestamp()
    });
  }

  getChats$(chatroomId: string) {
    return this.afs
    .collection('chatrooms')
    .doc(chatroomId)
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
