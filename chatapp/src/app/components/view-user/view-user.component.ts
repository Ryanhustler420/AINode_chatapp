import { Component, OnInit, AfterViewInit } from '@angular/core';
import * as M from 'materialize-css';

@Component({
  selector: 'app-view-user',
  templateUrl: './view-user.component.html',
  styleUrls: ['./view-user.component.scss']
})
export class ViewUserComponent implements OnInit, AfterViewInit {
  tabEl: any;

  constructor() { }

  ngOnInit() {
    const tabs = document.querySelector('.tabs');
    M.Tabs.init(tabs, {});
    this.tabEl = document.querySelectorAll('.couldBeHide');
  }

  ngAfterViewInit() {
    this.tabEl.forEach(element => {
      element.style.display = 'none';
    });
  }

}
