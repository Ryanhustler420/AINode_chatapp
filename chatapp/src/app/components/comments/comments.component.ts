import { Component, OnInit, AfterViewInit } from '@angular/core';

@Component({
  selector: 'app-comments',
  templateUrl: './comments.component.html',
  styleUrls: ['./comments.component.scss']
})
export class CommentsComponent implements OnInit, AfterViewInit {
  toolbarElement: any;

  constructor() {}

  ngOnInit() {
    this.toolbarElement = document.querySelector('.nav-content');
  }

  ngAfterViewInit() {
    this.toolbarElement.style.display = 'none';
  }
}
