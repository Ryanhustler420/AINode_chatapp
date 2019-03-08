import { Component, OnInit, AfterViewInit, Output, EventEmitter } from '@angular/core';
import { TokenService } from 'src/app/services/token.service';
import { Router } from '@angular/router';
import * as M from 'materialize-css';
import { UsersService } from 'src/app/services/users.service';
import * as moment from 'moment';
import * as io from 'socket.io-client';
import _ from 'lodash';
import { MessageService } from 'src/app/services/message.service';

@Component({
  selector: 'app-toolbar',
  templateUrl: './toolbar.component.html',
  styleUrls: ['./toolbar.component.scss']
})
export class ToolbarComponent implements OnInit, AfterViewInit {
  @Output() onlineUsers = new EventEmitter();
  user: any;
  notifications = [];
  socket: any;
  unreadNotifications = [];
  chatList = [];
  msgNumber = 0;
  imageId: any;
  imageVersion: any;

  constructor(
    private tokenService: TokenService,
    private router: Router,
    private userService: UsersService,
    private messageService: MessageService
  ) {
    this.socket = io('http://localhost:3000');
  }

  ngOnInit() {
    this.user = this.tokenService.GetPayloadOfToken();
    const dropdownEl = document.querySelectorAll('.dropdown-trigger');
    M.Dropdown.init(dropdownEl, {
      alignment: 'right',
      hover: true,
      coverTrigger: false,
      constrainWidth: true
    });
    this.socket.emit('online', { room: 'global', user: this.user.username });
    const dropdownElTwo = document.querySelectorAll('.dropdown-trigger1');
    M.Dropdown.init(dropdownElTwo, {
      alignment: 'right',
      hover: true,
      coverTrigger: false,
      constrainWidth: true
    });
    this.GetUser();
    this.socket.on('refreshPage', () => {
      this.GetUser();
    });
  }

  ngAfterViewInit() {
    this.socket.on('usersOnline', data => {
      // console.log(data);
      this.onlineUsers.emit(data);
    });
  }

  logout() {
    this.tokenService.deleteToken();
    this.router.navigate(['']);
  }

  TimeFromNow(time) {
    return moment(time).fromNow();
  }
  // check out momenjs docs
  MessageDate(date) {
    return moment(date).calendar(null, {
      sameDay: '[Today]',
      lastDay: '[Yesterday]',
      lastWeek: 'DD/MM/YYYY',
      sameElse: 'DD/MM/YYYY'
    });
  }

  GoToHome() {
    this.router.navigate(['streams']);
  }

  GoToChatPage(username) {
    this.router.navigate(['chat', username]);
    this.messageService.MarkMessages(this.user.username, username).subscribe(data => {
      // console.log(data);
      this.socket.emit('refresh', {});
    });
  }

  GetUser() {
    this.userService.GetUserById(this.user._id).subscribe(
      data => {
        this.imageId = data.result.picId;
        this.imageVersion = data.result.picVersion;
        this.notifications = data.result.notifications.reverse();
        // console.log(this.notifications);
        const value = _.filter(this.notifications, ['read', false]);
        this.unreadNotifications = value;
        this.chatList = data.result.chatList;
        // console.log(this.chatList);
        this.CheckIfRead(this.chatList);
      },
      err => {
        if (err.error.token === null) {
          this.tokenService.deleteToken();
          this.router.navigate(['']);
        }
      }
    );
  }

  CheckIfRead(arr) {
    const checkArray = [];
    for (let i = 0; i < arr.length; i++) {
      const receiver = arr[i].messageId.message[arr[i].messageId.message.length - 1];
      if (this.router.url !== `/chat/${receiver.senderName}`) {
        if (receiver.isRead === false && receiver.receiverName === this.user.username) {
          checkArray.push(1);
          this.msgNumber = _.sum(checkArray);
        }
      }
    }
  }

  MarkAll() {
    this.userService.MarkAllAsRead().subscribe(data => {
      // console.log(data);
      this.socket.emit('refresh', {});
    });
  }

  MarkAllMessages() {
    this.messageService.MarkAllMessages().subscribe(data => {
      this.socket.emit('refresh', {});
      this.msgNumber = 0;
    });
  }
}
