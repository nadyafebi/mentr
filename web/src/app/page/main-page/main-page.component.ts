import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs';
import { DataService, UserService } from '../../services';
import { Match, User } from '../../schemas';

@Component({
  selector: 'app-main-page',
  templateUrl: './main-page.component.html',
  styleUrls: ['./main-page.component.scss'],
  host: {
    class: 'page-with-navbar'
  }
})
export class MainPageComponent implements OnInit {
  user$: Observable<User>;
  mentorMatches$: Observable<Match[]>;
  menteeMatches$: Observable<Match[]>

  constructor(
    private dataService: DataService,
    private userService: UserService
  ) { }

  ngOnInit() {
    this.user$ = this.userService.getUser$();

    const userId = this.userService.getUserId();
    this.mentorMatches$ = this.dataService.findMatchedMentors$(userId);
    this.menteeMatches$ = this.dataService.findMatchedMentees$(userId);
  }

}
