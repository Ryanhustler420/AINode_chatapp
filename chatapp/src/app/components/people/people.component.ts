import { Component, OnInit } from '@angular/core';
import { UsersService } from 'src/app/services/users.service';
import _ from 'lodash';
import { TokenService } from 'src/app/services/token.service';

@Component({
  selector: 'app-people',
  templateUrl: './people.component.html',
  styleUrls: ['./people.component.scss']
})
export class PeopleComponent implements OnInit {
  users = [];
  loggedInUser: any;
  userArray = [];

  constructor(private userService: UsersService, private tokenService: TokenService) {}

  ngOnInit() {
    this.loggedInUser = this.tokenService.GetPayloadOfToken();
    this.GetUsers();
    this.GetUser();
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
      console.log(this.userArray);
    });
  }

  FollowUser(user) {
    this.userService.FollowUser(user).subscribe(data => {
      console.log(data);
    });
  }
}
