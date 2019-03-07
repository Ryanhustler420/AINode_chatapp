import { Component, OnInit, AfterViewInit } from '@angular/core';

@Component({
  selector: 'app-chat',
  templateUrl: './chat.component.html',
  styleUrls: ['./chat.component.scss']
})
export class ChatComponent implements OnInit, AfterViewInit {
  tabElement: any;
  _OutputOnlineUsers = [];

  constructor() {}

  ngOnInit() {
    this.tabElement = document.querySelectorAll('.couldBeHide');
  }

  ngAfterViewInit() {
    this.tabElement.forEach(element => {
      element.style.display = 'none';
    });
  }

  online(event) {
    // console.log(event);
    this._OutputOnlineUsers = event;
  }
}
