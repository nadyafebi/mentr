import { Component, OnInit, ViewChild, ViewChildren, QueryList } from '@angular/core';
import { FormControl } from '@angular/forms';
import { DataService, UserService } from '../../services';
import { Course, Match, Mentor, User } from '../../schemas';
import { Observable, Subscription } from 'rxjs';
import { MatAutocomplete, MatAutocompleteSelectedEvent } from '@angular/material';
import {
  Direction,
  StackConfig,
  Stack,
  Card,
  ThrowEvent,
  DragEvent,
  SwingStackComponent,
  SwingCardComponent
} from 'angular2-swing';

@Component({
  selector: 'app-find-page',
  templateUrl: './find-page.component.html',
  styleUrls: ['./find-page.component.scss'],
  host: {
    class: 'page-with-navbar'
  }
})
export class FindPageComponent implements OnInit {
  user$: Observable<User>;
  courses$: Observable<Course[]>;
  courseForm = new FormControl();
  pickedCourse: string;
  mentors$: Observable<Mentor[]>;
  menteeMatches$: Observable<Match[]>;
  courseFormSub: Subscription;
  @ViewChild('auto', { static: true }) autocomplete: MatAutocomplete;
  @ViewChild('mystack', { static: true }) stack: SwingStackComponent;
  @ViewChildren('mycards') cards: QueryList<SwingCardComponent>;

  stackConfig: StackConfig;

  constructor(
    private dataService: DataService,
    private userService: UserService
  ) { }

  ngOnInit() {
    this.user$ = this.userService.getUser$();
    this.courses$ = this.dataService.getCourses$();
    this.menteeMatches$ = this.dataService.findMenteeMatches$(this.userService.getUserId());

    this.stackConfig = {
      // Default setting only allows UP, LEFT and RIGHT so you can override this as below
      allowedDirections: [Direction.LEFT, Direction.RIGHT],
      // Now need to send offsetX and offsetY with element instead of just offset
      throwOutConfidence: (offsetX, offsetY, element) => {
        return Math.min(Math.max(Math.abs(offsetX) / (element.offsetWidth / 1.7), Math.abs(offsetY) / (element.offsetHeight / 2)), 1);
      },
      throwOutDistance: (d) => {
        return 800;
      }
    };
  }

  pickCourse(ev: MatAutocompleteSelectedEvent) {
    this.pickedCourse = ev.option.value.id;
    this.mentors$ = this.dataService.findMentors$(this.pickedCourse);
  }

  autoDisplay(course: Course) {
    if (course) {
      return `${course.code} - ${course.name}`;
    } else {
      return '';
    }
  }

  async onThrowOutRight(ev: ThrowEvent) {
    const mentorId = ev.target.id;
    await this.dataService.createMatch(
      this.userService.getUserId(),
      mentorId,
      this.pickedCourse
    );
  }
}
