export interface SignUpParams {
  username: string;
  password: string;
  attributes?: SignUpAttributes;
}

export interface SignUpAttributes {
  email: string;
  name: string;
  family_name: string;
  profile: string;
}
