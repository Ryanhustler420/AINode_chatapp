import { Component, OnInit } from '@angular/core';
import { UsersService } from 'src/app/services/users.service';
import { TokenService } from 'src/app/services/token.service';
import * as moment from 'moment';
import _ from 'lodash';
import { Router } from '@angular/router';
import io from 'socket.io-client';
import { PostService } from 'src/app/services/post.service';

@Component({
  selector: 'app-my-post',
  templateUrl: './my-post.component.html',
  styleUrls: ['./my-post.component.scss']
})
export class MyPostComponent implements OnInit {
  myPost = [];
  user: any;
  socket: any;

  constructor(
    private userService: UsersService,
    private postService: PostService,
    private tokenService: TokenService,
    private router: Router
  ) {
    this.socket = io('http://localhost:3000');
  }

  ngOnInit() {
    this.user = this.tokenService.GetPayloadOfToken();
    this.GetUser();
    this.socket.on('refreshPage', data => {
      this.GetUser();
    });
  }

  GetUser() {
    this.userService.GetUserById(this.user._id).subscribe(data => {
      this.myPost = data.result.posts;
      // console.log(this.myPost);
    });
  }

  CheckInLikesArray(arr, username) {
    return _.some(arr, { username: username });
  }

  TimeFromNow(time) {
    return moment(time).fromNow();
  }

  OpenCommentBox(post) {
    this.router.navigate(['post', post._id]);
  }

  LikePost(post) {
    this.postService.addLike(post).subscribe(
      data => {
        // console.log(data);
        this.socket.emit('refresh', {});
      },
      err => console.log(err)
    );
  }
}
