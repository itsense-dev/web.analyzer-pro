import { Component } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { environment } from 'src/environments/environment';
import { CustomValidators } from 'src/services/validators/custom-validators';
import { CognitoUser, CognitoUserSession, CognitoUserPool } from 'amazon-cognito-identity-js';
import { Auth } from '@aws-amplify/auth';
import { NzNotificationService } from 'ng-zorro-antd/notification';
import { Router } from '@angular/router';
@Component({
  selector: 'app-forgot-password',
  templateUrl: './forgot-password.component.html',
  styleUrls: ['./forgot-password.component.scss'],
})
export class ForgotPasswordComponent {
  send = false;
  cognitoObject?: CognitoUser;
  sendEmailForm: FormGroup = new FormGroup({
    email: new FormControl('', [Validators.required, Validators.email]),
  });

  forgotPasswordForm: FormGroup = new FormGroup({
    code: new FormControl('', [Validators.required]),
    password: new FormControl('', [
      Validators.required,
      Validators.minLength(environment.security.passwordMinLength),
    ]),
  });

  newPasswordLogin: FormGroup = new FormGroup({
    code: new FormControl('', [Validators.required, Validators.minLength(4)]),
    password: new FormControl('', [
      Validators.required,
      Validators.minLength(environment.security.passwordMinLength),
    ]),
    passwordRetype: new FormControl('', [
      Validators.required,
      Validators.minLength(environment.security.passwordMinLength),
    ]),
  });

  invalidPassword: boolean = false;
  passwordMatch: boolean = false;
  email: string = '';
  constructor(private notification: NzNotificationService, private router: Router) {
    this.newPasswordLogin.get('password')?.valueChanges.subscribe((password) => {
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

  async sendEmail() {
    const credentials = this.sendEmailForm.value;
    this.email = credentials.email;
    this.send = true;
    try {
      const perform = await Auth.forgotPassword(this.email);
      if (!perform) throw new Error('Unhandled');
      this.send = false;
      this.cognitoObject = perform;
    } catch (error) {
      this.notification.error('Error', 'Usuario inválido');
      this.send = false;
    }
  }

  async updatePassword() {
    const credentials = this.newPasswordLogin.value;
    this.send = true;
    try {
      const perform = await Auth.forgotPasswordSubmit(
        this.email,
        credentials.code,
        credentials.password
      );
      if (!perform) throw new Error('Unhandled');
      this.notification.success('Contraseña actualizada', 'Inicia sesion');
      this.send = false;
      this.router.navigate(['/login']);
    } catch (error: any) {
      this.notification.error('Error', error?.message);
      this.send = false;
    }
  }
}
