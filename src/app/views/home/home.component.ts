import { Component, OnInit } from '@angular/core';
import { AuthService } from 'src/app/service/authentication/auth.service';
import { ChatService } from 'src/app/service/cloud firestore/chat.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit {
  userChats$;
  constructor(public auth: AuthService, public cs: ChatService) {}
  ngOnInit() {
    this.userChats$ = this.cs.getUserChats();
  }

}
