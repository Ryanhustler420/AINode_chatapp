import { Component, OnInit } from '@angular/core';
import { TokenService } from 'src/app/services/token.service';
import { UsersService } from 'src/app/services/users.service';
import io from 'socket.io-client';

@Component({
  selector: 'app-notifications',
  templateUrl: './notifications.component.html',
  styleUrls: ['./notifications.component.scss']
})
export class NotificationsComponent implements OnInit {
  loggedUser: any;
  notifications = [];

  socket: any;

  constructor(private tokenService: TokenService, private usersService: UsersService) {
    this.socket = io('http://localhost:3000');
  }

  ngOnInit() {
    this.loggedUser = this.tokenService.GetPayloadOfToken();
    this.GetUser();
    this.socket.on('refreshPage', () => {
      this.GetUser();
    });
  }

  GetUser() {
    this.usersService.GetUserById(this.loggedUser._id).subscribe(data => {
      this.notifications = data.result.notifications;
      console.log(this.notifications);
    });

    // OR BY USERNAME

    // this.usersService.GetUserByName(this.loggedUser.username).subscribe(data => {
    //   this.notifications = data.result.notifications;
    //   console.log(this.notifications);
    // });
  }
}
