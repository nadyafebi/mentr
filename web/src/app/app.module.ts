import { BrowserModule } from '@angular/platform-browser';
import { NgModule, APP_INITIALIZER } from '@angular/core';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { AngularFireModule } from '@angular/fire';
import { AngularFireAuthModule } from '@angular/fire/auth';
import { AngularFireStorageModule } from '@angular/fire/storage';
import { AngularFirestoreModule } from '@angular/fire/firestore';

import { MaterialModule } from './material';

import { environment } from '../environments/environment';

import { UserService } from './services';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { LoginPageComponent } from './page/login-page/login-page.component';
import { FindPageComponent } from './page/find-page/find-page.component';
import { FiredocPipe } from './firedoc.pipe';
import { ChatPageComponent } from './page/chat-page/chat-page.component';

export function initApp(userService: UserService) {
  return () => {
    return userService.start();
  };
}

@NgModule({
  declarations: [
    AppComponent,
    LoginPageComponent,
    FindPageComponent,
    FiredocPipe,
    ChatPageComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    FormsModule,
    ReactiveFormsModule,
    AngularFireModule.initializeApp(environment.firebaseConfig),
    AngularFireAuthModule,
    AngularFireStorageModule,
    AngularFirestoreModule,
    MaterialModule
  ],
  providers: [
    {
      provide: APP_INITIALIZER,
      useFactory: initApp,
      multi: true,
      deps: [UserService]
    }
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
