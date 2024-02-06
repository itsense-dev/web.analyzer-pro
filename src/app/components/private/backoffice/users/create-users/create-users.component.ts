import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import {
  Countries,
  LabelValue,
  NewClient,
  Person,
  Plan,
  ResponseGlobal,
  Rols,
  UserDetails,
} from 'src/models/clientes.interface';
import { AnalyzerProService } from 'src/app/services/apis/analyzer-pro/analyzer-pro.service';
import { SignUpParams } from 'src/models/cognito.interface';
import { Auth } from 'aws-amplify';
import { ISignUpResult } from 'amazon-cognito-identity-js';
import { ActivatedRoute, Router } from '@angular/router';
import { SessionService } from 'src/app/services/session/session.service';
import { Roles } from 'src/enum/roles.enum';
import { UserInfo } from 'src/models/response-api-analyzer.interface';
@Component({
  selector: 'app-create-users',
  templateUrl: './create-users.component.html',
  styleUrls: ['./create-users.component.scss'],
})
export class CreateUsersComponent implements OnInit {
  Roles = Roles;

  client?: NewClient;
  @Input() idUserEdit?: string;
  @Output() closeModal = new EventEmitter<boolean>();
  idShow?: string;
  checkbox1Value: boolean = false;
  checkbox2Value: boolean = false;
  userDetails?: UserDetails;
  validateForm: FormGroup;
  clientsList: Person[] = [];
  planList: Plan[] = [];
  rolsList: Rols[] = [];
  rolsListMaped: LabelValue[] = [];
  initialValues: number[] = [];
  avatarUrl?: string = '';
  size: number = 150;
  subscription_id: string[] = [];
  countryList: Countries[] = [];
  selectedValue = null;
  isClose: boolean = false;
  planListValues: Array<{ value: string; label: string }> = [];

  user?: UserInfo;
  userRol?: Roles;

  constructor(
    private readonly AnalyzerProService: AnalyzerProService,
    private readonly fb: FormBuilder,
    private readonly router: Router,
    private readonly route: ActivatedRoute,
    private readonly sessionService: SessionService
  ) {
    this.validateForm = this.fb.group({
      client_id: ['', [Validators.required]],
      subscription_id: [[''], [Validators.required]],
      name: ['', [Validators.required]],
      user_position: [''],
      email: ['', [Validators.email, Validators.required]],
      rol_id: ['', [Validators.required]],
      phone_number: [''],
      address: [''],
    });
  }
  async ngOnInit() {
    const user = this.sessionService.getSession();
    this.userRol = <Roles>user.user_info.rol_id;

    if (this.userRol == Roles.CLIENT_ADMIN) {
      const client = user.user_info.client_id;
      const form = {
        client_id: client,
      };

      this.validateForm.patchValue(form);
      this.getPlanByClientsList();
    }

    this.getAllClientsList();
    this.getRolsList();
    if (this.idUserEdit) {
      this.idShow = this.idUserEdit;
      this.getUserDetailsById();
    }
  }

  resetForm(event: MouseEvent): void {
    this.isClose = true;
    event.preventDefault();
    this.validateForm.reset();
    for (const key in this.validateForm.controls) {
      if (this.validateForm.controls.hasOwnProperty(key)) {
        this.validateForm.controls[key].markAsPristine();
        this.validateForm.controls[key].updateValueAndValidity();
      }
    }
    this.idShow = '';
    this.idUserEdit = '';
    this.closeModal.emit(false);
  }

  getUserDetailsById() {
    if (!this.idShow) return;
    this.AnalyzerProService.getUserById(this.idShow!).subscribe({
      next: (response: any) => {
        if (response) {
          this.userDetails = response.data;
          this.getAllClientsList();
          this.updateForm();
        }
      },
      error: (error) => {},
      complete: () => {},
    });
  }
  async updateForm() {
    if (!this.userDetails) return;
    this.avatarUrl = this.userDetails.logo;
    await this.validateForm.patchValue(this.userDetails);
    await this.validateForm.controls['client_id'].setValue(this.userDetails.client_id);
    const extractedParameter: string[] = [];
    for (const item of this.userDetails.plans) {
      extractedParameter.push(item['subscription_id']);
    }
    this.validateForm.controls['subscription_id'].setValue(
      this.userDetails.plans[0].subscription_id
    );
    this.subscription_id = extractedParameter;
    await this.initCheckboxes();
  }

  initCheckboxes(): void {
    this.initialValues = [this.userDetails!.rol_id];
    this.rolsListMaped.forEach((checkbox) => {
      checkbox.checked = this.initialValues.includes(checkbox.value);
    });
  }
  getAllClientsList() {
    this.AnalyzerProService.getClientsList().subscribe({
      next: (response: any) => {
        if (response) {
          this.clientsList = response.data;
        }
      },
      error: (error) => {},
      complete: () => {},
    });
  }
  getPlanByClientsList() {
    if (this.isClose) return;
    const clientSelected = this.validateForm.controls['client_id'].value || '';
    this.AnalyzerProService.getPlansByClient(clientSelected).subscribe({
      next: (response: ResponseGlobal<Plan[]>) => {
        if (response) {
          this.planList = response.data;
          this.getClientById(clientSelected);
          /*this.planListValues = this.planList?.map((item) => {
            return {
              label: item.plan_name,
              value: item.subscription_id,
            };
          });*/
        }
      },
      error: (error) => {},
      complete: () => {},
    });
  }
  getRolsList() {
    this.AnalyzerProService.getRols().subscribe({
      next: (response: any) => {
        if (response) {
          this.rolsList = response.data;
          this.rolsListMaped = this.rolsList.map((item) => {
            return {
              label: item.rol_name,
              value: item.rol_id,
              checked: false,
            };
          });
        }
      },
      error: (error) => {},
      complete: () => {},
    });
  }
  createRandomPassword() {
    const randomstring = Math.random().toString(36);
    return randomstring;
  }

  async createUserCognito() {
    const password = this.createRandomPassword();
    const payload: SignUpParams = {
      username: this.validateForm.controls['email'].value,
      password: password,
    };
    try {
      const perform: ISignUpResult = await Auth.signUp(payload);
      this.createUser(perform.userSub);
    } catch (error) {}
  }

  saveChanges() {
    this.getCheckedValues();
    if (this.idUserEdit) {
      this.updateUser();
    } else {
      //this.createUser('f8645564-eac6-4e0a-8c7d-4a3cc5391663');
      this.createUserCognito();
    }
  }

  createUser(user_id: string) {
    if (!this.validateForm.valid) return;
    this.validateForm.removeControl('client_id');
    const payload: UserDetails = this.validateForm.value;
    payload.user_id = user_id;
    payload.subscription_id = [this.validateForm.controls['subscription_id'].value];
    this.AnalyzerProService.setNewUser(payload).subscribe({
      next: (response: any) => {
        if (response) {
          this.closeModal.emit(false);
        }
      },
      error: (error) => {},
      complete: () => {
        this.validateForm.reset();
      },
    });
  }
  updateUser() {
    if (!this.idUserEdit) return;
    const name = this.validateForm.controls['name'].value || '';
    const email = this.validateForm.controls['email'].value || '';
    const rol_id = this.validateForm.controls['rol_id'].value || '';
    const user_position = this.validateForm.controls['user_position'].value || '';
    const phone_number = this.validateForm.controls['phone_number'].value || 0;
    const address = this.validateForm.controls['address'].value || '';
    const subscription_id = this.validateForm.controls['subscription_id'].value || '';

    const payload = {
      name: name,
      email: email,
      rol_id: rol_id,
      subscription_id: [subscription_id],
      user_position: user_position,
      phone_number: phone_number,
      address: address,
      active_record: '1',
    } as UserDetails;
    this.AnalyzerProService.updateUser(this.idUserEdit, payload).subscribe({
      next: (response: any) => {
        if (response) {
          this.closeModal.emit(false);
        }
      },
      error: (error) => {},
      complete: () => {
        this.validateForm.reset();
      },
    });
  }

  checkboxChanged(checked: boolean, index: number): void {
    if (this.isClose) return;
    this.rolsListMaped.forEach((checkbox, i) => {
      if (i !== index) {
        checkbox.checked = false;
      }
    });
    this.getCheckedValues();
  }
  deleteUserById(userId: string) {
    this.AnalyzerProService.deleteUserById(userId).subscribe({
      next: (response: any) => {
        if (response) {
          this.clientsList = response.data;
        }
      },
      error: (error) => {},
      complete: () => {},
    });
  }
  getCheckedValues(): void {
    const checkedValues = this.rolsListMaped
      .filter((checkbox) => checkbox.checked)
      .map((checkbox) => checkbox.value);
    this.validateForm.controls['rol_id'].setValue(checkedValues[0]);
  }

  getClientById(client_id: number) {
    this.AnalyzerProService.getClientById(client_id).subscribe({
      next: (response) => {
        this.client = response.data;
        this.avatarUrl = this.client.logo;
      },
      error: (error) => {},
      complete: () => {},
    });
  }
}
