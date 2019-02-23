import { Component, OnInit } from '@angular/core';
import { PostService } from 'src/app/services/post.service';

@Component({
  selector: 'app-posts',
  templateUrl: './posts.component.html',
  styleUrls: ['./posts.component.scss']
})
export class PostsComponent implements OnInit {
  constructor(private postService: PostService) {}

  ngOnInit() {
    this.postService.getAllPosts().subscribe(data => {
      console.log(data);
    });
  }
}
