import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { FormGroup, Validators, FormControl } from '@angular/forms';
import { UserService } from '../../services';

@Component({
  selector: 'app-register-page',
  templateUrl: './register-page.component.html',
  styleUrls: ['./register-page.component.scss'],
  host: {
    class: 'page'
  }
})
export class RegisterPageComponent implements OnInit {
  registerForm = new FormGroup({
    email: new FormControl('', [Validators.email, Validators.required]),
    password: new FormControl('', [Validators.minLength(8), Validators.required]),
    name: new FormControl('', Validators.required),
    major: new FormControl('', Validators.required),
    level: new FormControl('', Validators.required)
  });
  registerLoading = false;

  constructor(
    private router: Router,
    private userService: UserService
  ) { }

  ngOnInit() {
  }

  async register() {
    this.registerLoading = true;
    try {
      const { email, password, name, major, level } = this.registerForm.value;
      await this.userService.register(email, password, name, major, level);
      this.router.navigate(['login']);
    } catch (err) {
      console.error(err);
      alert(err);
    }
    this.registerLoading = false;
  }

}
