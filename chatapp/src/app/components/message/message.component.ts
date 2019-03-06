import { Component, OnInit, AfterViewInit } from '@angular/core';
import { TokenService } from 'src/app/services/token.service';
import { MessageService } from 'src/app/services/message.service';
import { ActivatedRoute } from '@angular/router';
import { UsersService } from 'src/app/services/users.service';
import io from 'socket.io-client';
import { CaretEvent, EmojiEvent } from 'ng2-emoji-picker';

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

  // https://github.com/lsharir/angular2-emoji-picker/blob/master/demo/src/app/app.component.ts

  public eventMock;
  public eventPosMock;

  public direction =
    Math.random() > 0.5 ? (Math.random() > 0.5 ? 'top' : 'bottom') : Math.random() > 0.5 ? 'right' : 'left';
  public toggled = false;
  public content = ' ';

  private _lastCaretEvent: CaretEvent;

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

    this.socket.on('has_stopped_typing', data => {
      if (data.sender === this.receiverName) {
        this.typing = false;
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

  handleSelection(event: EmojiEvent) {
    this.content =
      this.content.slice(0, this._lastCaretEvent.caretOffset) +
      event.char +
      this.content.slice(this._lastCaretEvent.caretOffset);
    this.eventMock = JSON.stringify(event);
    this.message = this.content;
    this.Toggled();
    this.content = '';
  }

  handleCurrentCaret(event: CaretEvent) {
    this._lastCaretEvent = event;
    this.eventPosMock = `{ caretOffset : ${event.caretOffset}, caretRange: Range{...}, textContent: ${
      event.textContent
    } }`;
  }

  Toggled() {
    this.toggled = !this.toggled;
  }

  isTyping() {
    this.socket.emit('start_typing', {
      sender: this.user.username,
      receiver: this.receiverName
    });

    if (this.typingMessage) {
      clearTimeout(this.typingMessage);
    }

    this.typingMessage = setTimeout(() => {
      this.socket.emit('stop_typing', {
        sender: this.user.username,
        receiver: this.receiverName
      });
    }, 1500);
  }
}
