import { Component, OnInit } from '@angular/core';
import {FormControl} from '@angular/forms'
import {AuthService} from '../../service/authentication/auth.service'
import{NgForm} from '@angular/forms';
import { Router } from '@angular/router';
@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
  providers:[AuthService]
})
export class LoginComponent implements OnInit {

  repass=false;
  appear=true;
  check=true;
  constructor(private auth:AuthService,private router:Router) { }

  ngOnInit() {
  }

  loginClick(formSignin: NgForm){
    // console.log("Log in is success");
    console.log(formSignin.value.email);
    console.log("test = " + this.auth.SignIn(formSignin.value.email,formSignin.value.password));
    // if(this.auth.SignIn(formSignin.value.email,formSignin.value.password)){
    //   this.check=true;
    // }
    // else{
    //   this.check=false;
    // }
    // this.checkInvalidAcount();
    formSignin.value.email="";
    formSignin.value.password="";
    // return this.check;
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
  checkInvalidAcount(){
    if(this.check){
      console.log("Login successful");
    }
    else{
      console.log("Error");
    }
  }
  loginwithGoogle(){
    this.auth.googleSignIn();
    // this.router.navigate(['/home']);
  }
}
