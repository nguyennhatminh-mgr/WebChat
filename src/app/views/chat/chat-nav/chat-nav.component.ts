import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-chat-nav',
  templateUrl: './chat-nav.component.html',
  styleUrls: ['./chat-nav.component.scss']
})
export class ChatNavComponent implements OnInit {

  user=[
    {name:"Nhat Minh"},
    {name:"Nhat Minh"},
    {name:"Nhat Minh"},
    {name:"Nhat Minh"},
    {name:"Nhat Minh"},
    {name:"Nhat Minh"},
    {name:"Nhat Minh"},
    {name:"Nhat Minh"},
    {name:"Nhat Minh"},
    {name:"Nhat Minh"},
    {name:"Nhat Minh"},
    {name:"Nhat Minh"},
    {name:"Nhat Minh"},
    {name:"Nhat Minh"},
    {name:"Nhat Minh"},
    {name:"Nhat Minh"},
    {name:"Nhat Minh 10"}
  ]

  url="../../../../assets/images/backgroundLogin.jpg";
  indexuser=-1;
  constructor() { }

  ngOnInit() {
  }

}
