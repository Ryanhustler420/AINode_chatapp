import { Component, OnInit } from '@angular/core';
import { UsersService } from 'src/app/services/users.service';
import _ from 'lodash';
import { TokenService } from 'src/app/services/token.service';
import * as io from 'socket.io-client';

@Component({
  selector: 'app-people',
  templateUrl: './people.component.html',
  styleUrls: ['./people.component.scss']
})
export class PeopleComponent implements OnInit {
  users = [];
  loggedInUser: any;
  userArray = [];
  socket: any;
  onlineusers = [];

  constructor(private userService: UsersService, private tokenService: TokenService) {
    this.socket = io('http://localhost:3000');
  }

  ngOnInit() {
    this.loggedInUser = this.tokenService.GetPayloadOfToken();
    this.GetUser();
    this.GetUsers();

    this.socket.on('refreshPage', () => {
      this.GetUser();
      this.GetUsers();
    });
  }

  GetUsers() {
    this.userService.GetAllUsers().subscribe(data => {
      _.remove(data.result, { username: this.loggedInUser.username });
      this.users = data.result;
    });
  }

  GetUser() {
    this.userService.GetUserById(this.loggedInUser._id).subscribe(data => {
      this.userArray = data.result.following;
      // console.log(data.result.following);
    });
  }

  FollowUser(user) {
    this.userService.FollowUser(user).subscribe(data => {
      // console.log(data);
      this.socket.emit('refresh', {});
    });
  }

  CheckInArray(arr, id) {
    if (arr.length > 0) {
      const result = _.find(arr, ['userFollowed._id', id]);
      // console.log(arr);
      if (result) {
        return true;
      } else {
        return false;
      }
    }
  }

  online(event) {
    this.onlineusers = event;
  }

  checkIfOnline(username) {
    const result = _.indexOf(this.onlineusers, username);
    if (result > -1) {
      return true;
    } else {
      return false;
    }
  }
}
