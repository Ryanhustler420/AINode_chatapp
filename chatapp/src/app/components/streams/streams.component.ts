import { Component, OnInit } from '@angular/core';
import { TokenService } from './../../services/token.service';

@Component({
  selector: 'app-streams',
  templateUrl: './streams.component.html',
  styleUrls: ['./streams.component.scss']
})
export class StreamsComponent implements OnInit {
  token: any;

  constructor(private tokenService: TokenService) {}

  ngOnInit() {
    this.token = this.tokenService.getToken();
    console.log(this.token);
  }
}
