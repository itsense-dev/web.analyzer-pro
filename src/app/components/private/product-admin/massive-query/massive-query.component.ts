import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { NzNotificationService } from 'ng-zorro-antd/notification';
import { NgxSpinnerService } from 'ngx-spinner';
import { AdminService } from 'src/app/services/apis/admin/admin.service';
import { ListResponse } from 'src/enum/list-response.enum';
import { Messages } from 'src/enum/messages.enum';
import { Routes } from 'src/enum/routes.enum';
import { Plan } from 'src/models/plan.model';
import { CryptsService } from 'src/services/utils/crypts.service';

@Component({
  selector: 'app-massive-query',
  templateUrl: './massive-query.component.html',
  styleUrls: ['./massive-query.component.scss'],
})
export class MassiveQueryComponent implements OnInit {
  plans: Plan[] = [];

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
    this.router.navigate([Routes.GENERATE_MASSIVE_REPORT]);
  }
}
