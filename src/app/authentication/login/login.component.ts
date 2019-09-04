import { Component, OnInit } from '@angular/core';
import {FormControl} from '@angular/forms'
@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {

  repass=false;
  appear=true;
  constructor() { }

  ngOnInit() {
  }

  loginClick(){
    console.log("Log in is success");
  }
  signupClick(){
    this.repass=true;
    this.appear=false;
  }
  backClick(){
    this.repass=false;
    this.appear=true;
  }
}
