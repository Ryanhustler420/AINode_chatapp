import { Component, OnInit } from '@angular/core';
import { PostService } from 'src/app/services/post.service';
import * as moment from 'moment';

@Component({
  selector: 'app-posts',
  templateUrl: './posts.component.html',
  styleUrls: ['./posts.component.scss']
})
export class PostsComponent implements OnInit {
  posts = [];

  constructor(private postService: PostService) {}

  ngOnInit() {
    this.AllPosts();
  }

  AllPosts() {
    this.postService.getAllPosts().subscribe(data => {
      // console.log(data);
      this.posts = data.posts;
    });
  }

  TimeFromNow(time) {
    return moment(time).fromNow();
  }
}
