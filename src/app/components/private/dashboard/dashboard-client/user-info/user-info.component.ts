import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'app-user-info',
  templateUrl: './user-info.component.html',
  styleUrls: ['./user-info.component.scss'],
})
export class UserInfoComponent implements OnInit {
  @Input() logo?: string;
  @Input() name?: string = '';
  @Input() email?: string = '';

  constructor() {}

  ngOnInit() {
    if (!this.logo) this.logo = '../../../../../../assets/images/client-profile-logo.png';
  }
}
