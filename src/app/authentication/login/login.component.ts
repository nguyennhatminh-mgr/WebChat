import { Component, OnInit } from '@angular/core';
import {FormControl} from '@angular/forms'
import {AuthService} from '../../service/authentication/auth.service'
import{NgForm} from '@angular/forms';
@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
  providers:[AuthService]
})
export class LoginComponent implements OnInit {

  repass=false;
  appear=true;
  constructor(private auth:AuthService) { }

  ngOnInit() {
  }

  loginClick(formSignin: NgForm){
    // console.log("Log in is success");
    console.log(formSignin.value.email);
    this.auth.SignIn(formSignin.value.email,formSignin.value.password);
    formSignin.value.email="";
    formSignin.value.password="";
  }
  signupClick(){
    this.repass=true;
    this.appear=false;
  }
  backClick(){
    this.repass=false;
    this.appear=true;
  }
  
  onSubmit(formSign){
    console.log(formSign.value);
  }
  signup(formSignup:NgForm){
    this.auth.SignUp(formSignup.value.email,formSignup.value.password,formSignup.value.displayname);
    formSignup.value.email="";
    formSignup.value.password="";
    formSignup.value.displayname="";
    formSignup.value.repassword="";
  }
}
