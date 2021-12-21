import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute, Params } from '@angular/router';

import { Observable, Subscription } from 'rxjs';

import { DeveloperService } from '../developer/developer.service';
import { DisplayVal, DeveloperAdminViewRecord, DeveloperViewRecord } from '../developer/Developer';

@Component({
  selector: 'app-admin',
  templateUrl: './admin.component.html',
  styleUrls: ['./admin.component.scss']
})
export class AdminComponent implements OnInit, OnDestroy {
  public adminId: any;
  public DeveloperRecords$?: Observable<Array<DeveloperAdminViewRecord>>;
  private sub?: Subscription;
  public headerNames = [
    new DisplayVal(DeveloperViewRecord.prototype.DeveloperId, 'Developer Id'),
    new DisplayVal(DeveloperViewRecord.prototype.firstName, 'Name'),
    new DisplayVal(DeveloperViewRecord.prototype.lastName, 'Email')
  ];

  constructor(
    private readonly route: ActivatedRoute,
    private readonly DeveloperService: DeveloperService
  ) { }

  ngOnInit(): void {
    this.sub = this.route.params
      .subscribe((params: Params) => {
        this.adminId = params.adminId;
      });
  }

  ngOnDestroy(): void {
    this.sub?.unsubscribe();
  }

}
