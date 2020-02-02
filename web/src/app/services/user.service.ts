import { Injectable, OnDestroy } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/auth';
import { AngularFirestore } from '@angular/fire/firestore';
import { BehaviorSubject, Observable, Subscription } from 'rxjs';
import { User } from '../schemas';
import { async } from '@angular/core/testing';

@Injectable({
  providedIn: 'root'
})
export class UserService implements OnDestroy {
  private user$ = new BehaviorSubject<User|null>(null);
  private userId: string;
  private userSub: Subscription;

  constructor(
    private afAuth: AngularFireAuth,
    private afs: AngularFirestore
  ) { }

  async start() {
    return new Promise((resolve, reject) => {
      const sub = this.afAuth.user.subscribe(async user => {
        if (user) {
          await this.setUser(user.uid);
        }
        sub.unsubscribe();
        resolve();
      });
    });
  }

  async login(email: string, password: string) {
    const userCred = await this.afAuth.auth.signInWithEmailAndPassword(email, password);
    await this.setUser(userCred.user.uid);
  }

  async register(email: string, password: string, name: string, major: string, level: string) {
    const userCred = await this.afAuth.auth.createUserWithEmailAndPassword(email, password);
    await this.afs.collection('users').doc<User>(userCred.user.uid).set({
      email,
      name,
      major,
      level,
      avatar: false
    });
  }

  async signout() {
    await this.afAuth.auth.signOut();

    if (this.userSub) {
      this.userSub.unsubscribe();
    }

    this.user$.next(null);
  }

  private setUser(id: string) {
    return new Promise<void>((resolve, reject) => {
      if (this.userSub) {
        this.userSub.unsubscribe();
      }

      this.userSub = this.afs.collection('users').doc<User>(id).valueChanges()
      .subscribe(user => {
        user.id = id;
        this.userId = id;
        this.user$.next(user);
        resolve();
      });
    });
  }

  getUser$() {
    return this.user$.asObservable();
  }

  getUserId() {
    return this.userId;
  }

  ngOnDestroy() {
    if (this.userSub) {
      this.userSub.unsubscribe();
    }
  }
}
