import { Component, OnInit, AfterViewInit } from '@angular/core';
import * as M from 'materialize-css';

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

  constructor() { }

  ngOnInit() {
    this.postsTab = true;
    const tabs = document.querySelector('.tabs');
    M.Tabs.init(tabs, {});
    this.tabEl = document.querySelectorAll('.couldBeHide');
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

}
