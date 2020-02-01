import { Component, OnInit } from '@angular/core';
import { DataService, UserService } from '../../services';
import { Course, Match, Mentor, User } from '../../schemas';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-find-page',
  templateUrl: './find-page.component.html',
  styleUrls: ['./find-page.component.scss'],
  host: {
    class: 'page'
  }
})
export class FindPageComponent implements OnInit {
  user$: Observable<User>;
  courses$: Observable<Course[]>;
  pickedCourse: string;
  mentors$: Observable<Mentor[]>;
  menteeMatches$: Observable<Match[]>;

  constructor(
    private dataService: DataService,
    private userService: UserService
  ) { }

  ngOnInit() {
    this.user$ = this.userService.getUser$();
    this.courses$ = this.dataService.getCourses$();
    this.menteeMatches$ = this.dataService.findMenteeMatches$(this.userService.getUserId());
  }

  pickCourse(id: string) {
    this.pickedCourse = id;
    this.mentors$ = this.dataService.findMentors$(id);
  }

  async matchMentor(userId: string, mentorId: string) {
    await this.dataService.createMatch(userId, mentorId, this.pickedCourse);
  }

  async acceptMatch(matchId: string) {
    await this.dataService.acceptMatch(matchId);
  }
}
