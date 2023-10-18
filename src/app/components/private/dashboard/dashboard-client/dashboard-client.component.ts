import { Component, OnInit } from '@angular/core';
import { NzNotificationService } from 'ng-zorro-antd/notification';
import { NgxSpinnerService } from 'ngx-spinner';
import { AdminService } from 'src/app/services/apis/admin/admin.service';
import { ListResponse } from 'src/enum/list-response.enum';
import { Messages } from 'src/enum/messages.enum';
import { Plan } from 'src/models/plan.model';
import { UserProfile } from 'src/models/user.model';
import { CryptsService } from 'src/services/utils/crypts.service';

@Component({
  selector: 'app-dashboard-client',
  templateUrl: './dashboard-client.component.html',
  styleUrls: ['./dashboard-client.component.scss'],
})
export class DashboardClientComponent implements OnInit {
  plan?: Plan;
  userProfile?: UserProfile;

  constructor(
    private readonly notificationService: NzNotificationService,
    private readonly cryptService: CryptsService,
    private readonly adminService: AdminService,
    private readonly spinnerService: NgxSpinnerService
  ) {}

  ngOnInit(): void {
    const userInfo = this.cryptService.decryptData(ListResponse.USER);
    const userId: string = userInfo.user_info.user_id;

    this.getFirstPlanByUser(userId);
    this.getUserInfo(userId);
  }

  getFirstPlanByUser(userId: string) {
    this.spinnerService.show();
    this.adminService.getAllPlansByUser(userId).subscribe({
      next: (response) => {
        this.spinnerService.hide();
        const plans = <Array<Plan>>response.data;

        if (plans.length > 0) {
          this.plan = plans[0];
        }
      },
      error: () => {
        this.notificationService.error(
          Messages.SYSTEM_NOT_AVAILABLE,
          Messages.SYSTEM_NOT_AVAILABLE_MESSAGE
        );
      },
    });
  }

  getUserInfo(userId: string) {
    this.adminService.getUserById(userId).subscribe({
      next: (response) => {
        this.userProfile = <UserProfile>response.data;
      },
      error: () => {
        this.notificationService.error(
          Messages.SYSTEM_NOT_AVAILABLE,
          Messages.SYSTEM_NOT_AVAILABLE_MESSAGE
        );
      },
    });
  }
}
