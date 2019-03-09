import { Component, OnInit } from '@angular/core';
import { FileUploader } from 'ng2-file-upload';
import { UsersService } from './../../services/users.service';
import { TokenService } from 'src/app/services/token.service';
import * as io from 'socket.io-client';

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

  selectedFile: any;
  user: any;
  images = [];

  socket: any;

  constructor(private userService: UsersService, private tokenService: TokenService) {
    this.socket = io('http://localhost:3000');
  }

  ngOnInit() {
    this.user = this.tokenService.GetPayloadOfToken();
    this.GetUser();

    this.socket.on('refreshPage', () => {
      this.GetUser();
    });
  }

  GetUser() {
    this.userService.GetUserById(this.user._id).subscribe(
      data => {
        this.images = data.result.images;
      },
      err => console.log(err)
    );
  }

  OnFileSelected(event) {
    const file: File = event[0];

    this.ReadAsBase64(file)
      .then(result => {
        this.selectedFile = result;
      })
      .catch(err => console.log(err));
  }

  Upload() {
    // console.log(this.selectedFile);
    if (this.selectedFile) {
      this.userService.AddImage(this.selectedFile).subscribe(
        data => {
          // console.log(data);
          this.socket.emit('refresh', {});
          const filePath = <HTMLInputElement>document.getElementById('file-path');
          filePath.value = '';
        },
        err => {
          console.log(err);
        }
      );
    }
  }

  SetProfile(image) {
    // console.log(image);
    this.userService.SetDefaultImage(image.imageId, image.imageVersion).subscribe(
      data => {
        this.socket.emit('refresh', {});
      },
      err => {
        console.log(err);
      }
    );
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
