import { Component, OnInit } from '@angular/core';
import { UsersService } from 'src/app/services/users.service';

@Component({
  selector: 'app-people',
  templateUrl: './people.component.html',
  styleUrls: ['./people.component.scss']
})
export class PeopleComponent implements OnInit {
  users = [];

  constructor(private userService: UsersService) {}

  ngOnInit() {
    this.userService.GetAllUsers().subscribe(data => {
      console.log(data);
    });
  }
}
