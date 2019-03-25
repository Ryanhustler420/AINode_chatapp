import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { PostService } from 'src/app/services/post.service';
import * as io from 'socket.io-client';
import { FileUploader } from 'ng2-file-upload';

const URL = `http://localhost:3000/api/chatapp/v1/upload-image`;

@Component({
  selector: 'app-post-form',
  templateUrl: './post-form.component.html',
  styleUrls: ['./post-form.component.scss']
})
export class PostFormComponent implements OnInit {
  socket: any;
  postForm: FormGroup;

  uploader: FileUploader = new FileUploader({
    url: URL,
    disableMultipart: true
  });

  selectedFile: any;

  constructor(private fb: FormBuilder, private postService: PostService) {
    this.socket = io('http://localhost:3000');
  }

  ngOnInit() {
    this.init();
  }

  init() {
    this.postForm = this.fb.group({
      post: ['', Validators.required]
    });
  }

  SubmitPost() {
    let body;
    if (!this.selectedFile) {
      body = {
        post: this.postForm.value.post
      }
    } else {
      body = {
        post: this.postForm.value.post,
        image: this.selectedFile
      }
    }
    this.postService.addPost(body).subscribe(data => {
      // console.log(data);
      this.socket.emit('refresh', {
        /** you can pass data as an object from this event emit */
      });
      this.postForm.reset();
    });
    // console.log(this.postForm.value);
  }

  OnFileSelected(event) {
    const file: File = event[0];

    this.ReadAsBase64(file)
      .then(result => {
        this.selectedFile = result;
      })
      .catch(err => console.log(err));
  }

  ReadAsBase64(file): Promise<any> {
    const reader = new FileReader();
    const fileValue = new Promise((resolve, reject) => {
      reader.addEventListener('load', () => {
        resolve(reader.result);
      });

      reader.addEventListener('error', err => {
        reject(err);
      });

      reader.readAsDataURL(file);
    });

    return fileValue;
  }
}
