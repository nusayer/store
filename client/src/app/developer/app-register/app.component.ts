import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute, Params, Router } from '@angular/router';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

import { Subscription } from 'rxjs';

import { appService } from '../app.service';
import { appRecord } from '../app';
import { RoleEnum } from '../../utils';
import { AuthService } from '../../core/auth/auth.service';

@Component({
  selector: 'app-app-new',
  templateUrl: './app-edit.component.html',
  styleUrls: ['./app-edit.component.scss']
})
export class appComponent implements OnInit, OnDestroy {
  public form: FormGroup;
  public error: any = null;
  public title = '';
  public appId: any;
  public newappData: any;
  private allSub = new Subscription();

  public isdeveloper(): boolean {
    return this.authService.getRole() === RoleEnum.DEVELOPER;
  }

  constructor(
    private readonly route: ActivatedRoute,
    private readonly router: Router,
    private readonly fb: FormBuilder,
    private readonly appService: appService,
    private readonly authService: AuthService
  ) {
    this.form = this.fb.group({
      hash: ['', Validators.required],
      appName: ['', Validators.required],
      developerName: ['', Validators.required],
      version: ['', Validators.required],
      category: ['', Validators.required],
    });
  }

  ngOnInit(): void {
    this.allSub.add(
      this.route.params.subscribe((params: Params) => {
        this.appId = params.self;
        this.refresh();
      })
    );
  }

  ngOnDestroy(): void {
    this.allSub.unsubscribe();
  }

  public refresh(): void {
    this.setTitle();
    if (this.isNew()) {
      this.form.reset();
    }
    else {
      this.allSub.add(
        this.appService.getappByKey(this.appId).subscribe(x => {
          const data = x as appRecord;
          this.loadRecord(data);
        })
      );
    }
    this.error = null;
  }

  public getAdminUsername(): string {
    return this.authService.getUsername();
  }

  public save(): void {
    if(this.isdeveloper()) {
      this.appService.createApp(this.form.value).subscribe(x => this.newappData = x);
    }
  }

  public findInvalidControls(): void {
    const invalid = [];
    const controls = this.form.controls;
    for (const name in controls) {
      if (controls[name].invalid) {
        invalid.push(name);
      }
    }
    console.log(invalid);
  }

  public reset(): void {
    this.newappData = null;
    this.router.navigate(['/', 'admin', this.getAdminUsername()]);
  }

  private clearValidators(): void {
    // tslint:disable-next-line:forin
    for (const key in this.form.controls) {
      this.form.get(key)?.clearValidators();
      this.form.get(key)?.updateValueAndValidity();
    }
    // this.findInvalidControls();
  }
}
