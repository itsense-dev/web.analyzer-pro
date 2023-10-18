import { Component } from '@angular/core';
import { FormGroup, FormControl } from '@angular/forms';
import { environment } from 'src/environments/environment';
import { CustomValidators } from 'src/services/validators/custom-validators';
import { Auth } from '@aws-amplify/auth';
import { LoginForm } from 'src/models/login-form.model';
import { CognitoUser, CognitoUserSession, CognitoUserPool } from 'amazon-cognito-identity-js';
import { Validators } from '@angular/forms';
import { NzIconModule } from 'ng-zorro-antd/icon';
import { NzNotificationService } from 'ng-zorro-antd/notification';
import { CognitoUsersFlow } from 'src/enum/cognito-users-flow.enum';
import { CryptsService } from 'src/services/utils/crypts.service';
import { ListResponse } from 'src/enum/list-response.enum';
import { Router } from '@angular/router';
import { AnalyzerProService } from 'src/app/services/apis/analyzer-pro/analyzer-pro.service';
import { SessionService } from 'src/app/services/session/session.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
})
export class LoginComponent {
  send = false;
  cognitoObject?: CognitoUser;
  loginForm: FormGroup = new FormGroup({
    email: new FormControl('', [Validators.required, CustomValidators.email]),
    password: new FormControl('', [
      Validators.required,
      Validators.minLength(environment.security.passwordMinLength),
    ]),
  });

  newPasswordLogin: FormGroup = new FormGroup({
    password: new FormControl('', [
      Validators.required,
      Validators.minLength(environment.security.passwordMinLength),
    ]),
    name: new FormControl('', [Validators.required]),
    last_name: new FormControl('', [Validators.required]),
    passwordRetype: new FormControl('', [
      Validators.required,
      Validators.minLength(environment.security.passwordMinLength),
    ]),
  });

  invalidPassword: boolean = false;
  passwordMatch: boolean = false;

  constructor(
    private notification: NzNotificationService,
    private cryptService: CryptsService,
    private router: Router,
    private analyzerProService: AnalyzerProService,
    private sessionService: SessionService
  ) {
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

    this.newPasswordLogin.get('passwordRetype')?.valueChanges.subscribe((password) => {
      if (password !== this.newPasswordLogin.value.password) {
        this.passwordMatch = true;
      } else {
        this.passwordMatch = false;
      }
    });
  }

  async login() {
    const credentials: LoginForm = this.loginForm.value;
    this.send = true;
    try {
      const perform: CognitoUser = await Auth.signIn(credentials.email, credentials.password);
      const userSession: CognitoUserSession | null = perform.getSignInUserSession();
      if (perform?.challengeName === CognitoUsersFlow.NEW_PASSWORD_REQUIRE) {
        this.send = false;
        this.cognitoObject = perform;
        this.notification.warning('Advertencia', 'Es necesario actualizar tu contraseña');
        return;
      }
      if (userSession) {
        this.cryptService.cryptData(ListResponse.SESSION, userSession);
        this.getValidateUser();
      }
      this.send = false;
      if (!perform) throw 'CongnitoExceptions.UNHANDLED';
    } catch (error) {
      this.notification.error('Error', 'Usuario y/o contraseña inválidos');
      this.send = false;
    }
  }

  async updatePassword() {
    if (!this.newPasswordLogin.valid) return;

    const values = this.newPasswordLogin.value;

    if (values.password !== values.password) {
      this.notification.error('Error', 'Contraseñas no coinciden');
      return;
    }

    const perform = await Auth.completeNewPassword(this.cognitoObject, values.password, {});
    if (!perform) {
      this.notification.warning('Advertencia', 'Hubo un error, por favor intentalo nuevamente');
    }
    if (perform) {
      this.notification.success(
        'Exito!',
        'Contraseña actulizada correctamente, por favor inicia sesion'
      );
      this.cognitoObject = undefined;
    }
  }

  getValidateUser() {
    this.analyzerProService.getValidateUser().subscribe({
      next: (response) => {
        if (response.errorMessage || response.message === 'usuario o contraseña incorrectas') {
          this.notification.error('Error!', 'Algo sucedio por favor intentalo nuevmaente');
          this.cognitoObject = undefined;
          this.sessionService.logout();
          return;
        }
        this.cryptService.cryptData(ListResponse.USER, response);
        this.router.navigateByUrl('/dashboard');
      },
      error: () => {
        this.notification.error('Error!', 'Algo sucedio por favor intentalo nuevmaente');
        this.cognitoObject = undefined;
        this.sessionService.logout();
      },
    });
  }
}
