import { Component, OnInit } from '@angular/core';
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

  constructor(
    private userService: UserService
  ) { }

  ngOnInit() {
    this.user$ = this.userService.getUser();
  }

  login() {
    const { email, password } = this.loginForm.value;
    this.userService.login(email, password);
  }

  async register() {
    const { email, password } = this.loginForm.value;
    await this.userService.register(email, password);
  }

  signout() {
    this.userService.signout();
  }

}
