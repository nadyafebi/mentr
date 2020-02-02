import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { FormControl, Validators } from '@angular/forms';
import { DataService, UserService } from '../../services';
import { Chat, Match } from '../../schemas';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-chat-page',
  templateUrl: './chat-page.component.html',
  styleUrls: ['./chat-page.component.scss'],
  host: {
    class: 'page-with-navbar'
  }
})
export class ChatPageComponent implements OnInit {
  userId: string;
  chatroomId: string;
  chats$: Observable<Chat[]>;
  match$: Observable<Match>;
  chatForm = new FormControl('', Validators.required);

  constructor(
    private route: ActivatedRoute,
    private dataService: DataService,
    private userService: UserService
  ) { }

  ngOnInit() {
    this.userId = this.userService.getUserId();
    this.chatroomId = this.route.snapshot.paramMap.get('chatroomId');
    this.chats$ = this.dataService.getChats$(this.chatroomId);
    this.match$ = this.dataService.getDoc$('matches', this.chatroomId);
  }

  async sendText() {
    if (this.chatForm.value) {
      await this.dataService.sendChat(this.chatroomId, this.userId, 'text', this.chatForm.value);
      this.chatForm.reset();
    }
  }

}
