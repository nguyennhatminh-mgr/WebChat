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

  async loginClick(formSignin: NgForm){
    let code = await this.auth.SignIn(formSignin.value.email,formSignin.value.password);
    switch(code){
      case ("no err"): this.router.navigate(['/home']);break;
      case("auth/invalid-email"): console.log("err 1");break;
      case("auth/user-disabled"): console.log("err 2");break;
      case("auth/user-not-found"): console.log("err 3");break;
      case("auth/wrong-password"): console.log("err 4");break;
      default: console.log('something is wrong');break;
    }
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
  async signup(formSignup:NgForm){
    let errorCode = await this.auth.SignUp(formSignup.value.email,formSignup.value.password,formSignup.value.displayname);
    switch(errorCode){
      case ("no err"): this.router.navigate(['/home']);break;
      case("auth/email-already-in-use"): console.log("err 1");break;
      case("auth/invalid-email"): console.log("err 2");break;
      case("auth/operation-not-allowed"): console.log("err 3");break;
      case("auth/weak-password"): console.log("err 4");break;
      default: console.log('something is wrong');break;
    }
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
