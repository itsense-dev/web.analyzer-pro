import { Component, OnInit } from '@angular/core';
import { AnalyzerProService } from 'src/app/services/apis/analyzer-pro/analyzer-pro.service';
import { Router } from '@angular/router';
import { Clients, NewClient, Plan, Users, usersPlan } from 'src/models/clientes.interface';
import { Routes } from 'src/enum/routes.enum';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { NzModalRef, NzModalService } from 'ng-zorro-antd/modal';
import { SessionService } from 'src/app/services/session/session.service';
import { UserInfo } from 'src/models/response-api-analyzer.interface';
import { Roles } from 'src/enum/roles.enum';

@Component({
  selector: 'app-users',
  templateUrl: './users.component.html',
  styleUrls: ['./users.component.scss'],
})
export class UsersComponent implements OnInit {
  Roles = Roles;

  isVisible = false;
  validateForm: FormGroup;
  log(): void {}
  selectedValue = null;
  filter: string = '';
  clientsList: Clients[] = [];
  usersList: Users[] = [];
  userPlansList: usersPlan[] = [];
  client?: NewClient;
  subscription?: Plan;
  subscriptions!: Plan[];
  idUserEdit?: string;
  isVisibleCreateUser = false;
  isConfirmLoading = false;
  clientPlans!: Plan[];

  user?: UserInfo;
  userRol?: Roles;

  constructor(
    private readonly analyzerProService: AnalyzerProService,
    private readonly fb: FormBuilder,
    private readonly router: Router,
    private readonly sessionService: SessionService
  ) {
    this.validateForm = this.fb.group({
      client: ['', [Validators.required]],
      suscription: [''],
    });
  }

  showModalCreateUser(): void {
    this.idUserEdit = '';
    this.isVisibleCreateUser = true;
  }

  ngOnInit() {
    const user = this.sessionService.getSession();
    this.userRol = <Roles>user.user_info.rol_id;

    if (this.userRol == Roles.CLIENT_ADMIN) {
      const client = user.user_info.client_id;
      const form = {
        client: client,
      };

      this.validateForm.patchValue(form);
      this.getPlansByClient(client);
    }

    this.getAllClientsList();
  }

  getPlansByClient(client_id: number) {
    this.validateForm.controls['suscription'].setValue('');
    this.analyzerProService.getPlansByClient(client_id).subscribe({
      next: (response) => {
        this.clientPlans = response.data;
        this.getClientById(client_id);
      },
    });
  }
  getClientById(client_id: number) {
    this.analyzerProService.getClientById(client_id).subscribe({
      next: (response) => {
        this.client = response.data;
        //this.subscription = this.client.subscriptions[0];
        //this.validateForm.controls['suscription'].setValue(this.subscription?.subscription_id);
      },
      error: (error) => {},
      complete: () => {},
    });
  }
  getSuscriptionDetails(subscription_id: any) {
    this.subscription = this.clientPlans.find((item) => item.subscription_id === subscription_id);
    this.getAllUsersByClientByPlan(this.subscription!.plan_id);
  }

  getAllUsersByClientByPlan(planId: number) {
    const clientId = this.validateForm.controls['client'].value || '';
    this.analyzerProService.getUsersByClientByPlan(clientId, planId).subscribe({
      next: (response: any) => {
        if (response) {
          this.usersList = response.data;
          this.getClientById(clientId);
        }
      },
      error: (error) => {},
      complete: () => {},
    });
  }
  showModal(id_user: string): void {
    this.getPlansByUsers(id_user);
    this.isVisible = true;
  }

  closeModal(): void {
    this.isVisible = false;
    this.ngOnInit();
  }

  getPlansByUsers(id_user: string) {
    this.analyzerProService.getPlansByUsers(id_user).subscribe({
      next: (response: any) => {
        if (response) {
          this.userPlansList = response.data;
        }
      },
      error: (error) => {},
      complete: () => {},
    });
  }

  getAllClientsList() {
    this.analyzerProService.getClientsList().subscribe({
      next: (response: any) => {
        if (response) {
          this.clientsList = response.data;
        }
      },
      error: (error) => {},
      complete: () => {},
    });
  }

  changeClientState(user: Users) {
    this.analyzerProService
      .setUserState(user.user_id, user.active_record == '1' ? '0' : '1')
      .subscribe({
        next: (response: any) => {},
        error: (error) => {},
        complete: () => {},
      });
  }
  createUser() {
    this.router.navigateByUrl(Routes.CREATE_USER);
  }

  redirectView(id: string) {
    this.idUserEdit = id;
    this.isVisibleCreateUser = true;
  }
  deleteUserById(clientId: string) {
    this.analyzerProService.deleteUserById(clientId).subscribe({
      next: (response: any) => {},
    });
  }
  okAction($event: boolean) {
    this.isVisibleCreateUser = $event;
  }
}
