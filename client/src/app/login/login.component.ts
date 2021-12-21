import { Component, OnInit, TemplateRef } from '@angular/core';
import { Router } from '@angular/router';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';

import { AuthService } from '../core/auth/auth.service';
import { storeUser, User } from '../User';
import { BrowserStorageFields, RoleEnum } from '../utils';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {
  private PWD_CHANGE = 'CHANGE_TMP_PASSWORD';
  public createNewPwd = false;
  public showStoreList = true;
  public role = '';
  public storeId = 0;
  public username = '';
  public pwd = '';
  public newPwd = '';
  public error = { message: '' };

  constructor(private authService: AuthService,
              private router: Router,
              private readonly modal: NgbModal
  ) { }

  ngOnInit(): void {
  }

  public resetFields(): void {
    this.role = '';
    this.storeId = 0;
    this.username = '';
    this.pwd = '';
    this.newPwd = '';
    this.createNewPwd = false;
    this.error.message = '';
  }

  public roleChanged(): void {
    this.showStoreList = this.role !== RoleEnum.DEVELOPER;
  }

  public loginUser(): void {
    switch (this.role) {
      case RoleEnum.ADMIN:
        this.authService.loginAdminUser(new storeUser(this.role, this.storeId, this.username, this.pwd))
          .subscribe(
            (res: any) => this.afterSuccessfulLogin(res),
            (err: any) => this.error.message = err.message
          );
        break;
      case RoleEnum.USER:
        this.authService.loginUser(new storeUser(this.role, this.storeId, this.username, this.pwd))
          .subscribe(
            (res: any) => this.afterSuccessfulLogin(res),
            (err: any) => this.error.message = err.message
          );
        break;
      case RoleEnum.DEVELOPER:
        this.authService.loginDeveloper(new User(this.role, this.username, this.pwd, this.newPwd))
          .subscribe(
            (res: any) => this.afterSuccessfulLogin(res),
            (err: any) => this.error.message = err.message
          );
        break;
    }
  }

  private afterSuccessfulLogin(res: any): void {
    if (res.success && res.success === this.PWD_CHANGE) {
      this.createNewPwd = true;

      return;
    } else if (!res.accessToken) {
      this.error.message = 'Token is missing.';

      return;
    }

    const role = this.role;
    const userId = this.username;
    const storeId = this.storeId;
    this.authService.setHeaders(res, role, storeId, userId);

    this.resetFields();

    this.router.navigate([ '/', role, userId]);
  }
}
