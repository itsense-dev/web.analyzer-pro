import { Router } from '@angular/router';
import { Messages } from 'src/enum/messages.enum';
import { NgxSpinnerService } from 'ngx-spinner';
import { Component, OnInit } from '@angular/core';
import { NzNotificationService } from 'ng-zorro-antd/notification';
import { AdminService } from 'src/app/services/apis/admin/admin.service';
import { ListResponse } from 'src/enum/list-response.enum';
import { Plan } from 'src/models/plan.model';
import { CryptsService } from 'src/services/utils/crypts.service';
import { Routes } from 'src/enum/routes.enum';

@Component({
  selector: 'app-single-query',
  templateUrl: './single-query.component.html',
  styleUrls: ['./single-query.component.scss'],
})
export class SingleQueryComponent implements OnInit {
  plans: Array<Plan> = [];

  expirationDate: Date = new Date();
  constructor(
    private readonly notificationService: NzNotificationService,
    private readonly cryptService: CryptsService,
    private readonly adminService: AdminService,
    private readonly spinnerService: NgxSpinnerService,
    private readonly router: Router
  ) {}

  ngOnInit(): void {
    const userInfo = this.cryptService.decryptData(ListResponse.USER);
    const userId: string = userInfo.user_info.user_id;

    this.getAllPlansByUser(userId);
  }

  getAllPlansByUser(userId: string) {
    this.spinnerService.show();
    this.adminService.getAllPlansByUser(userId).subscribe({
      next: (response) => {
        this.spinnerService.hide();
        this.plans = <Array<Plan>>response.data;
      },
      error: () => {
        this.notificationService.error(
          Messages.SYSTEM_NOT_AVAILABLE,
          Messages.SYSTEM_NOT_AVAILABLE_MESSAGE
        );
      },
    });
  }

  redirectQuery(plan: Plan) {
    this.cryptService.cryptData(ListResponse.PLAN, plan);
    this.router.navigate([Routes.GENERATE_REPORT]);
  }
}
