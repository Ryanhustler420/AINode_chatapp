import { Component, OnInit } from '@angular/core';
import { FileUploader } from 'ng2-file-upload';

const URL = `http://localhost:3000/api/chatapp/v1/upload-image`;

@Component({
  selector: 'app-images',
  templateUrl: './images.component.html',
  styleUrls: ['./images.component.scss']
})
export class ImagesComponent implements OnInit {
  uploader: FileUploader = new FileUploader({
    url: URL,
    disableMultipart: true
  });

  constructor() {}

  ngOnInit() {}

  OnFileSelected(event) {
    console.log(event);
  }
}
