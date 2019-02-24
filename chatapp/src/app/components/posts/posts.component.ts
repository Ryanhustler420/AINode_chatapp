import { Component, OnInit } from '@angular/core';
import { PostService } from 'src/app/services/post.service';
import * as moment from 'moment';
import io from 'socket.io-client';

@Component({
  selector: 'app-posts',
  templateUrl: './posts.component.html',
  styleUrls: ['./posts.component.scss']
})
export class PostsComponent implements OnInit {
  socket: any;
  posts = [];

  constructor(private postService: PostService) {
    this.socket = io('http://localhost:3000');
  }

  ngOnInit() {
    this.AllPosts();

    this.socket.on('refreshPage', data => {
      this.AllPosts();
    });
  }

  AllPosts() {
    this.postService.getAllPosts().subscribe(data => {
      // console.log(data);
      this.posts = data.posts;
    });
  }

  LikePost(post) {
    this.postService.addLike(post).subscribe(
      data => {
        console.log(data);
        this.socket.emit('refresh', {});
      },
      err => console.log(err)
    );
  }

  TimeFromNow(time) {
    return moment(time).fromNow();
  }
}
