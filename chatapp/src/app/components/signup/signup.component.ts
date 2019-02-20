import { Component, OnInit } from '@angular/core';
import { AuthService } from './../../services/auth.service';
import { FormGroup, FormBuilder, Validator, Validators } from '@angular/forms';
import { Router } from '@angular/router';

@Component({
  selector: 'app-signup',
  templateUrl: './signup.component.html',
  styleUrls: ['./signup.component.scss']
})
export class SignupComponent implements OnInit {
  signupForm: FormGroup;
  errorMessage: string;

  constructor(private authService: AuthService, private fb: FormBuilder, private router: Router) {}

  ngOnInit() {
    this.init();
  }

  init() {
    this.signupForm = this.fb.group({
      username: ['', Validators.required],
      email: ['', [Validators.email, Validators.required]],
      password: ['', Validators.required]
    });
  }

  signupUser() {
    // console.log(this.signupForm.value);
    this.authService.registerUser(this.signupForm.value).subscribe(
      data => {
        // console.log(data);
        this.signupForm.reset();
        this.router.navigate(['streams']);
      },
      err => {
        // console.log(err);
        if (err.error.msg) {
          this.errorMessage = err.error.msg[0].message;
        }

        if (err.error.message) {
          this.errorMessage = err.error.message;
        }
      }
    );
  }
}
