import { Component, OnInit } from '@angular/core';
import { TokenService } from 'src/app/services/token.service';
import { MessageService } from 'src/app/services/message.service';
import { ActivatedRoute } from '@angular/router';
import { UsersService } from 'src/app/services/users.service';

@Component({
  selector: 'app-message',
  templateUrl: './message.component.html',
  styleUrls: ['./message.component.scss']
})
export class MessageComponent implements OnInit {
  receiverName: String;
  user: any;
  message: String;
  receiverData: any;

  constructor(
    private tokenService: TokenService,
    private messageService: MessageService,
    private route: ActivatedRoute,
    private userService: UsersService
  ) {}

  ngOnInit() {
    this.user = this.tokenService.GetPayloadOfToken();
    this.route.params.subscribe(usernameFromUrlAtTheAbove => {
      this.receiverName = usernameFromUrlAtTheAbove.name;
      this.GetUserByUsername(this.receiverName);
    });
  }

  GetUserByUsername(username) {
    this.userService.GetUserByName(username).subscribe(data => {
      this.receiverData = data.result;
    });
  }

  SendMessage() {
    this.messageService
      .SendMessage(this.user._id, this.receiverData._id, this.receiverData.username, this.message)
      .subscribe(data => {
        console.log(data);
      });
  }
}
