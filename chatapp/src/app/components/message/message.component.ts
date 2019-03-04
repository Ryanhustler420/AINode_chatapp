import { Component, OnInit, AfterViewInit } from '@angular/core';
import { TokenService } from 'src/app/services/token.service';
import { MessageService } from 'src/app/services/message.service';
import { ActivatedRoute } from '@angular/router';
import { UsersService } from 'src/app/services/users.service';
import io from 'socket.io-client';

@Component({
  selector: 'app-message',
  templateUrl: './message.component.html',
  styleUrls: ['./message.component.scss']
})
export class MessageComponent implements OnInit, AfterViewInit {
  receiverName: String;
  user: any;
  message: String;
  receiverData: any;
  messagesArray = [];
  socket: any;
  typingMessage;
  typing = false;

  constructor(
    private tokenService: TokenService,
    private messageService: MessageService,
    private route: ActivatedRoute,
    private userService: UsersService
  ) {
    this.socket = io('http://localhost:3000/');
  }

  ngOnInit() {
    this.user = this.tokenService.GetPayloadOfToken();
    this.route.params.subscribe(usernameFromUrlAtTheAbove => {
      this.receiverName = usernameFromUrlAtTheAbove.name;
      this.GetUserByUsername(this.receiverName);
    });

    this.socket.on('refreshPage', () => {
      this.GetUserByUsername(this.receiverName);
    });

    this.socket.on('is_Typing', data => {
      if (data.sender === this.receiverName) {
        this.typing = true;
      }
    });
  }

  ngAfterViewInit() {
    const params = {
      room1: this.user.username,
      room2: this.receiverName
    };

    this.socket.emit('join chat', params);
  }

  GetUserByUsername(username) {
    this.userService.GetUserByName(username).subscribe(data => {
      this.receiverData = data.result;
      this.GetMessages(this.user._id, data.result._id);
    });
  }

  GetMessages(senderId, receiverId) {
    this.messageService.GetAllMessages(senderId, receiverId).subscribe(data => {
      this.messagesArray = data.messages.message;
      // console.log(this.messagesArray);
    });
  }

  SendMessage() {
    if (!this.message) {
      return;
    }
    this.messageService
      .SendMessage(this.user._id, this.receiverData._id, this.receiverData.username, this.message)
      .subscribe(data => {
        // console.log(data);
        this.socket.emit('refresh', {});
        this.message = '';
      });
  }

  isTyping() {
    this.socket.emit('start_typing', {
      sender: this.user.username,
      receiver: this.receiverName
    });
  }
}
