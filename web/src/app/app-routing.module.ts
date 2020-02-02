import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { LoginPageComponent } from './page/login-page/login-page.component';
import { RegisterPageComponent } from './page/register-page/register-page.component';
import { FindPageComponent } from './page/find-page/find-page.component';
import { FindMenteePageComponent } from './page/find-mentee-page/find-mentee-page.component';
import { ChatPageComponent } from './page/chat-page/chat-page.component';
import { MainPageComponent } from './page/main-page/main-page.component';
import { LandingPageComponent } from './page/landing-page/landing-page.component';

const routes: Routes = [
  {
    path: 'login',
    component: LoginPageComponent
  },
  {
    path: 'register',
    component: RegisterPageComponent
  },
  {
    path: 'main',
    component: MainPageComponent
  },
  {
    path: 'find',
    component: FindPageComponent
  },
  {
    path: 'landing',
    component: LandingPageComponent
},
{
    path: 'find-mentee',
    component: FindMenteePageComponent
  },
  {
    path: 'chat/:chatroomId',
    component: ChatPageComponent
  },
  {
    path: '',
    redirectTo: 'login',
    pathMatch: 'full'
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes, { useHash: true })],
  exports: [RouterModule]
})
export class AppRoutingModule { }
