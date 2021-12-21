import {Component, OnDestroy, OnInit} from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';

import { Subscription } from 'rxjs';

import { UserService } from '../user.service';
import { AuthService } from '../../core/auth/auth.service';

@Component({
  selector: 'app-User-new',
  templateUrl: './user-register.component.html',
  styleUrls: ['./user-register.component.scss']
})
export class userRegisterComponent implements OnInit, OnDestroy {
  public form: FormGroup;
  public error: any = null;

  public storeList = [
    {id: '1', name: 'Store 1'},
    {id: '2', name: 'Store 2'},
    {id: '3', name: 'Store 3'}
  ];
  private sub?: Subscription;

  constructor(
    private readonly fb: FormBuilder,
    private readonly router: Router,
    private readonly authService: AuthService,
    private readonly UserService: UserService
  ) {
    this.form = this.fb.group({
      name: ['', Validators.required],
      email: ['', Validators.required],
      storeId: ['', Validators.required],
      username: ['', Validators.required],
      password: ['', Validators.required]
    });
  }

  ngOnInit(): void {
    this.refresh();
  }

  ngOnDestroy(): void {
    this.sub?.unsubscribe();
  }

  public refresh(): void {
    this.form.reset();
  }

  public getAdminUsername(): string {
    return this.authService.getUsername();
  }

  public save(): void {
    console.log(this.form.value);
    this.sub = this.UserService.createUser(this.form.value).subscribe(x => {
      const docRegResponse = x;
      if (docRegResponse.error) {
        this.error = docRegResponse.error;
      }
      this.router.navigate(['/', 'admin', this.getAdminUsername()]);
    });
  }
}
