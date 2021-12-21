import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute, Params } from '@angular/router';

import { Observable, Subscription } from 'rxjs';

import { RoleEnum } from '../utils';
import { AuthService } from '../core/auth/auth.service';

import { userViewRecord } from './user';
import { userService } from './user.service';


@Component({
  selector: 'app-user',
  templateUrl: './user.component.html',
  styleUrls: ['./user.component.scss']
})
export class userComponent implements OnInit, OnDestroy {
  public userId: any;
  public userRecordObs?: Observable<userViewRecord>;
  private sub?: Subscription;

  constructor(
    private readonly route: ActivatedRoute,
    private readonly userService: userService,
    private readonly authService: AuthService
  ) { }

  ngOnInit(): void {
    this.sub = this.route.params
      .subscribe((params: Params) => {
        this.userId = params.userId;
        this.refresh();
      });
  }

  ngOnDestroy(): void {
    this.sub?.unsubscribe();
  }

  public refresh(): void {
    this.userRecordObs = this.userService.getuserByStoreId(this.authService.getStoreId(), this.userId);
  }

  public isUser(): boolean {
    return this.authService.getRole() === RoleEnum.USER;
  }
}
