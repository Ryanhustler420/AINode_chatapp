import { Component, OnInit, AfterViewInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { PostService } from 'src/app/services/post.service';
import { ActivatedRoute } from '@angular/router';
import io from 'socket.io-client';
import * as moment from 'moment';

@Component({
  selector: 'app-comments',
  templateUrl: './comments.component.html',
  styleUrls: ['./comments.component.scss']
})
export class CommentsComponent implements OnInit, AfterViewInit {
  toolbarElement: any;
  commentForm: FormGroup;
  postId: any;
  commentArray = [];

  socket: any;

  constructor(private fb: FormBuilder, private postService: PostService, private route: ActivatedRoute) {
    this.socket = io('http://localhost:3000');
  }

  ngOnInit() {
    this.postId = this.route.snapshot.paramMap.get('id');
    this.toolbarElement = document.querySelectorAll('.couldBeHide');
    this.init();
    this.GetPost();
    this.socket.on('refreshPage', data => {
      this.GetPost();
    });
  }

  init() {
    this.commentForm = this.fb.group({
      comment: ['', Validators.required]
    });
  }

  ngAfterViewInit() {
    this.toolbarElement.forEach(element => {
      element.style.display = 'none';
    });
  }

  AddComment() {
    // console.log(this.commentForm.value);

    this.postService.addComment(this.postId, this.commentForm.value.comment).subscribe(data => {
      // console.log(data);
      this.socket.emit('refresh', {});
      this.commentForm.reset();
    });
  }

  GetPost() {
    this.postService.getPost(this.postId).subscribe(data => {
      // console.log(data);
      this.commentArray = data.post.comments.reverse();
    });
  }

  TimeFromNow(time) {
    return moment(time).fromNow();
  }
}
