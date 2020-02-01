import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';
import { Course, Mentor, User } from '../schemas';
import { map } from 'rxjs/operators';

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

  async createMatch(userId: string, mentorId: string, courseId: string) {
    await this.afs.collection('matches').add({
      mentee: userId,
      mentor: mentorId,
      course: courseId,
      status: 'pending'
    });
  }

  getDoc$<T extends {id: string}>(collection: string, docId: string) {
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
