import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute, Params, Router } from '@angular/router';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

import { Subscription } from 'rxjs';

import { DeveloperService } from '../developer.service';
import { DeveloperRecord } from '../developer';
import { RoleEnum } from '../../utils';
import { AuthService } from '../../core/auth/auth.service';

@Component({
  selector: 'app-developer-new',
  templateUrl: './developer-edit.component.html',
  styleUrls: ['./developer-edit.component.scss']
})
export class developerEditComponent implements OnInit, OnDestroy {
  public form: FormGroup;
  public error: any = null;
  public title = '';
  public developerId: any;
  public newdeveloperData: any;
  private allSub = new Subscription();

  constructor(
    private readonly route: ActivatedRoute,
    private readonly router: Router,
    private readonly fb: FormBuilder,
    private readonly developerService: DeveloperService,
    private readonly authService: AuthService
  ) {
    this.form = this.fb.group({
      name: ['', Validators.required],
      email: ['', Validators.required],
    });
  }

  ngOnInit(): void {
    this.allSub.add(
      this.route.params.subscribe((params: Params) => {
        this.developerId = params.self;
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
        this.developerService.getDeveloperByKey(this.developerId).subscribe(x => {
          const data = x as DeveloperRecord;
          this.loadRecord(data);
        })
      );
    }
    this.error = null;
  }

  public isNew(): boolean {
    return this.developerId === 'new';
  }

  public isdeveloper(): boolean {
    return this.authService.getRole() === RoleEnum.DEVELOPER;
  }

  public getAdminUsername(): string {
    return this.authService.getUsername();
  }

  public save(): void {
    if (this.isNew()) {
      this.allSub.add(
        this.developerService.createDeveloper(this.form.value).subscribe(x => this.newdeveloperData = x)
      );
    }
    else if (this.isdeveloper()) {
      this.allSub.add(
        this.developerService.updatedeAppDetails(this.developerId, this.form.value).subscribe(x => {
          const response = x;
          if (response.error) {
            this.error = response.error;
          }
          this.router.navigate(['/', 'developer', this.developerId]);
        })
      );
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
    this.newdeveloperData = null;
    this.router.navigate(['/', 'admin', this.getAdminUsername()]);
  }


  private setTitle(): void {
    this.title = (this.isNew() ? 'Create' : 'Edit') + ' developer';
  }

  private loadRecord(record: DeveloperRecord): void {
    this.clearValidators();
    if (this.isdeveloper()) {
      this.form.patchValue({
        name: record.name,
        email: record.email,
      });
    }
    else {
      this.form.patchValue({
        name: record.name,
        email: record.email,
      });
    }
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
