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
  checkLogin=false;
  checkLoginUserNotFound=false;
  checkLoginWrongPass=false;
  checkSignupEmailInUse=false;
  checkSignupWeakPass=false;
  constructor(private auth:AuthService,private router:Router) { }

  ngOnInit() {
    this.constructCheck();
  }
  constructCheck(){
    this.checkLogin=false;
    this.checkLoginUserNotFound=false;
    this.checkLoginWrongPass=false;
    this.checkSignupEmailInUse=false;
    this.checkSignupWeakPass=false;
  }

  async loginClick(formSignin: NgForm){
    let code = await this.auth.SignIn(formSignin.value.email,formSignin.value.password);
    switch(code){
      case ("no err"): this.router.navigate(['/home']);break;
      case("auth/invalid-email"): {console.log("err 1"); this.checkLogin=true;}break;
      case("auth/user-disabled"): {console.log("err 2"); this.checkLogin=true;}break;
      case("auth/user-not-found"): {console.log("err 3"); this.checkLoginUserNotFound=true;} break;
      case("auth/wrong-password"): {console.log("err 4");this.checkLoginWrongPass=true;} break;
      default: {console.log('something is wrong');this.checkLogin=true;} break;
    }
   this.resetValue(formSignin);
  }
  signupClick(formSignup:NgForm){
    this.repass=true;
    this.appear=false;
    this.constructCheck();
    this.resetValue(formSignup);
  }
  backClick(formSignin:NgForm){
    this.repass=false;
    this.appear=true;
    this.constructCheck();
    this.resetValue(formSignin);
  }
  
  onSubmit(formSign){
    console.log(formSign.value);
  }
  async signup(formSignup:NgForm){
    let errorCode = await this.auth.SignUp(formSignup.value.email,formSignup.value.password,formSignup.value.displayname);
    switch(errorCode){
      case ("no err"): this.router.navigate(['/home']);break;
      case("auth/email-already-in-use"): {console.log("err 1");this.checkSignupEmailInUse=true;} break;
      case("auth/invalid-email"): {console.log("err 2"); this.checkLogin=true;} break;
      case("auth/operation-not-allowed"): {console.log("err 3");this.checkLogin=true;} break;
      case("auth/weak-password"): {console.log("err 4"); this.checkSignupWeakPass=true;} break;
      default: console.log('something is wrong');break;
    }
    this.resetValue(formSignup);
  }

  resetValue(form:NgForm){
    form.value.email="";
    form.value.password="";
    form.value.displayname="";
    form.value.repassword="";
  }
  loginwithGoogle(){
    this.auth.googleSignIn();
    // this.router.navigate(['/home']);
  }
}
