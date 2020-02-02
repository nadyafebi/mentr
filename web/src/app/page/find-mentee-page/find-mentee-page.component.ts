import { Component, OnInit } from '@angular/core';
import { DataService, UserService } from '../../services';
import { Course, Match, Mentor, User } from '../../schemas';
import { Observable, Subscription } from 'rxjs';
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
  selector: 'app-find-mentee-page',
  templateUrl: './find-mentee-page.component.html',
  styleUrls: ['./find-mentee-page.component.scss'],
  host: {
    class: 'page-with-navbar'
  }
})
export class FindMenteePageComponent implements OnInit {
  stackConfig: StackConfig;
  matches$: Observable<Match[]>;

  constructor(
    private dataService: DataService,
    private userService: UserService
  ) { }

  ngOnInit() {
    this.matches$ = this.dataService.findMenteeMatches$(this.userService.getUserId());

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

  async onThrowOutRight(ev: ThrowEvent) {
    const matchId = ev.target.id;
    await this.dataService.acceptMatch(matchId);
  }

  async onThrowOutLeft(ev: ThrowEvent) {
    const matchId = ev.target.id;
    await this.dataService.rejectMatch(matchId);
  }

}
