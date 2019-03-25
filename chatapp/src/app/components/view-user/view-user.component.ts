import { Component, OnInit, AfterViewInit } from '@angular/core';
import * as M from 'materialize-css';
import { ActivatedRoute } from '@angular/router';
import { UsersService } from './../../services/users.service';
import * as moment from 'moment';

@Component({
  selector: 'app-view-user',
  templateUrl: './view-user.component.html',
  styleUrls: ['./view-user.component.scss']
})
export class ViewUserComponent implements OnInit, AfterViewInit {
  tabEl: any;
  postsTab = false;
  followingTab = false;
  followersTab = false;
  posts = [];
  following = [];
  followers = [];
  user: any;
  name: any;

  constructor(private route: ActivatedRoute, private userService: UsersService) { }

  ngOnInit() {
    this.postsTab = true;
    const tabs = document.querySelector('.tabs');
    M.Tabs.init(tabs, {});
    this.tabEl = document.querySelectorAll('.couldBeHide');

    this.route.params.subscribe(params => {
      this.name = params.name;
      this.getUserData(this.name);
    })
  }

  changeTab(value) {
    if (value === 'posts') {
      this.postsTab = true;
      this.followersTab = false;
      this.followingTab = false;
    }
    if (value === 'following') {
      this.followingTab = true;
      this.postsTab = false;
      this.followersTab = false;
    }
    if (value === 'followers') {
      this.followersTab = true;
      this.followingTab = false;
      this.postsTab = false;
    }
  }

  ngAfterViewInit() {
    this.tabEl.forEach(element => {
      element.style.display = 'none';
    });
  }

  getUserData(name) {
    this.userService.GetUserByName(name).subscribe(data => {
      // console.log(data);
      this.user = data.result;
      this.posts = data.result.posts.reverse();
      this.followers = data.result.followers;
      this.following = data.result.following;
    }, err => {
      console.log(err);
    })
  }

  TimeFromNow(time) {
    return moment(time).fromNow();
  }

}
