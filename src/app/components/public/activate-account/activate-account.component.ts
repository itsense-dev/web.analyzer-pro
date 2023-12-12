import { Router } from '@angular/router';
import { ISignUpResult } from 'amazon-cognito-identity-js';
import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Auth } from 'aws-amplify';
import { environment } from 'src/environments/environment';
import { SignUpParams } from 'src/models/cognito.interface';
import { NzNotificationService } from 'ng-zorro-antd/notification';
import { Routes } from 'src/enum/routes.enum';

@Component({
  selector: 'app-activate-account',
  templateUrl: './activate-account.component.html',
  styleUrls: ['./activate-account.component.scss'],
})
export class ActivateAccountComponent implements OnInit {
  step: number = 1;

  confirmEmailForm: FormGroup = new FormGroup({
    email: new FormControl(null, [Validators.required, Validators.email]),
    code: new FormControl(null, [Validators.required]),
  });

  newPasswordForm: FormGroup = new FormGroup({
    code: new FormControl('', [Validators.required]),
    password: new FormControl('', [
      Validators.required,
      Validators.minLength(environment.security.passwordMinLength),
    ]),
    confirmPassword: new FormControl('', [
      Validators.required,
      Validators.minLength(environment.security.passwordMinLength),
    ]),
  });

  isSending: boolean = false;
  invalidPassword: boolean = false;
  passwordMatch: boolean = false;

  constructor(
    private readonly notification: NzNotificationService,
    private readonly router: Router
  ) {}

  ngOnInit(): void {
    this.newPasswordForm.get('password')?.valueChanges.subscribe((password) => {
      const isValid = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/.test(
        password
      );
      if (isValid) {
        this.invalidPassword = true;
      } else {
        this.invalidPassword = false;
      }
    });
  }
  /*
  async createUserCognito() {
    const payload: SignUpParams = {
      username: 'oscar.diaz@itsense.com.co',
      password: 'O@ds1233493546',
    };
    return await Auth.signUp(payload);
  }
  */
  /*
  async sendConfirmationEmail() {
    //const x = await this.createUserCognito();
    //console.log('create-test', x)
    //return;

    const email = this.confirmEmailForm.value.email;
    this.isSending = true;
    let signUpResponse;
    try {
      signUpResponse = await Auth.resendSignUp(email);
    } catch {
      this.notification.error('Usuario', 'Error. Usuario inválido.');
      this.isSending = false;
      return;
    }

    this.isSending = false;
    if (signUpResponse) {
      this.step = 2;
      this.isSending = false;
    }
  }
  */

  async sendConfirmationCode() {
    const email = this.confirmEmailForm.value.email;
    const code = this.confirmEmailForm.value.code;
    this.isSending = true;

    let signUpCode;
    try {
      signUpCode = await Auth.confirmSignUp(email, code);
    } catch {
      this.notification.error('Usuario', 'Error. Usuario o código inválidos.');
      this.isSending = false;
      return;
    }

    if (signUpCode) {
      const forgotPassword = await Auth.forgotPassword(email);
      if (forgotPassword) {
        this.step = 2;
        this.isSending = false;
      }
    }
  }

  async updatePassword() {
    const email = this.confirmEmailForm.value.email;
    const newPasswordFormValue = this.newPasswordForm.value;

    let forgotPasswordSubmit;
    try {
      forgotPasswordSubmit = await Auth.forgotPasswordSubmit(
        email,
        newPasswordFormValue.code,
        newPasswordFormValue.password
      );
    } catch {
      this.notification.error('Usuario', 'Error inesperado, intenta de nuevo.');
      this.isSending = false;
      return;
    }

    if (forgotPasswordSubmit) {
      this.notification.success('Usuario', 'Cambio de contraseña exitoso.');
      this.router.navigate([Routes.LOGIN]);
    }
  }
}
