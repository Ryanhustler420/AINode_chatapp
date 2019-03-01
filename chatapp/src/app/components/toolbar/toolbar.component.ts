import { Component, OnInit } from '@angular/core';
import { TokenService } from 'src/app/services/token.service';
import { Router } from '@angular/router';
import * as M from 'materialize-css';
import { UsersService } from 'src/app/services/users.service';
import * as moment from 'moment';
import io from 'socket.io-client';

@Component({
  selector: 'app-toolbar',
  templateUrl: './toolbar.component.html',
  styleUrls: ['./toolbar.component.scss']
})
export class ToolbarComponent implements OnInit {
  user: any;
  notifications = [];
  socket: any;

  constructor(private tokenService: TokenService, private router: Router, private userService: UsersService) {
    this.socket = io('http://localhost:3000');
  }

  ngOnInit() {
    this.user = this.tokenService.GetPayloadOfToken();
    const dropdownEl = document.querySelector('.dropdown-trigger');
    M.Dropdown.init(dropdownEl, {
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

  logout() {
    this.tokenService.deleteToken();
    this.router.navigate(['']);
  }

  TimeFromNow(time) {
    return moment(time).fromNow();
  }

  GoToHome() {
    this.router.navigate(['streams']);
  }

  GetUser() {
    this.userService.GetUserById(this.user._id).subscribe(data => {
      this.notifications = data.result.notifications.reverse();
      // console.log(this.notifications);
    });
  }

  MarkAll() {
    this.userService.MarkAllAsRead().subscribe(data => {
      // console.log(data);
      this.socket.emit('refresh', {});
    });
  }
}
