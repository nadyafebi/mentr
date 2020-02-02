import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { UserService } from '../../services';
import { User } from '../../schemas';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-login-page',
  templateUrl: './login-page.component.html',
  styleUrls: ['./login-page.component.scss'],
  host: {
    class: 'page'
  }
})
export class LoginPageComponent implements OnInit {
  user$: Observable<User>;
  loginForm = new FormGroup({
    email: new FormControl('', [Validators.required, Validators.email]),
    password: new FormControl('', [Validators.required, Validators.minLength(8)])
  });
  loginLoading = false;

  constructor(
    private router: Router,
    private userService: UserService
  ) { }

  ngOnInit() {
    this.user$ = this.userService.getUser$();
  }

  async login() {
    this.loginLoading = true;

    try {
      const { email, password } = this.loginForm.value;
      await this.userService.login(email, password);
      this.router.navigate(['find']);
    } catch (err) {
      console.error(err);
      alert(err);
    }

    this.loginLoading = false;
  }

  register() {
    this.router.navigate(['register']);
  }

  signout() {
    this.userService.signout();
  }

}
