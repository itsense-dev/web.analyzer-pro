export const environment = {
  production: false,
  availableLanguages: ['es', 'en'],
  defaultLanguage: 'es',
  country: {
    code: 'CO',
  },
  api: 'https://ozujxe4oc5.execute-api.us-east-1.amazonaws.com/prod',
  apiAdmin: 'https://7p680oe6na.execute-api.us-east-1.amazonaws.com/prod',
  apiAndicom: 'https://andicom.analyzerinc.com/api/',
  amplify: {
    auth: {
      mandatorySignIn: true,
      region: 'us-east-1',
      userPoolId: 'us-east-1_JGcdptZC4',
      userPoolWebClientId: '3c2rrf147f8ii0iupe9fiovkb8',
      authenticationFlowType: 'USER_PASSWORD_AUTH',
      oauth: {
        domain: 'users.analyzerinc.com',
        scope: ['email', 'openid', 'profile', 'aws.cognito.signin.user.admin'],
        redirectSignIn: 'https://users.analyzerinc.com/load-session',
        redirectSignOut: 'https://users.analyzerinc.com/',
        responseType: 'code',
      },
      federationTarget: 'COGNITO_USER_POOLS',
      aws_cognito_username_attributes: ['EMAIL'],
      aws_cognito_social_providers: [],
      aws_cognito_signup_attributes: ['EMAIL'],
      aws_cognito_mfa_configuration: 'OFF',
      aws_cognito_mfa_types: ['SMS'],
      aws_cognito_password_protection_settings: {
        passwordPolicyMinLength: 8,
        passwordPolicyCharacters: [],
      },
      aws_cognito_verification_mechanisms: ['EMAIL'],
    },
  },
  security: {
    passwordMinLength: 8,
    randomNameLength: 32,
    verificationCodeLength: 6,
  },
  socket: {
    interval: 10000,
    timeOut: 180000,
  },
  socketApi: 'wss://375tfziudk.execute-api.us-east-1.amazonaws.com/prod',
  andinacom: {
    subscription_id: '2bc0d507-6990-4658-a6e1-ceeb4b6e9a76',
    packages: '2',
    userCognito: 'sergio.galvis@itsense.com.co',
    passwsordCgonito: 'Qwerty123**',
    defaultCountry: 'CO',
  },
  amplifyAndicom: {
    auth: {
      mandatorySignIn: true,
      region: 'us-east-1',
      userPoolId: 'us-east-1_jAIudOyp6',
      userPoolWebClientId: '4mj6fgg2ifquh9tbf3k3b17l4t',
      authenticationFlowType: 'USER_PASSWORD_AUTH',
      oauth: {
        domain: 'analyzer-andicom-sept.auth.us-east-1.amazoncognito.com',
        scope: ['email', 'openid', 'profile', 'aws.cognito.signin.user.admin'],
        redirectSignIn: 'http://localhost:4200/load-session',
        redirectSignOut: 'http://localhost:4200/',
        responseType: 'code',
      },
      federationTarget: 'COGNITO_USER_POOLS',
      aws_cognito_username_attributes: ['EMAIL'],
      aws_cognito_social_providers: [],
      aws_cognito_signup_attributes: ['EMAIL'],
      aws_cognito_mfa_configuration: 'OFF',
      aws_cognito_mfa_types: ['SMS'],
      aws_cognito_password_protection_settings: {
        passwordPolicyMinLength: 8,
        passwordPolicyCharacters: [],
      },
      aws_cognito_verification_mechanisms: ['EMAIL'],
    },
  },
  webSiteUrl: 'https://marketing.itsense.com.co/analyzer',
  cryptToken: 'S9h#u3U2&bHDEgD7wSJV2iREc9YR4Pn',
  loadMassiveTemplateFilename: 'load_massive_template_{country}.csv',
};
