export class UserRegistrationDTO {
  email: string;
  password: string;
  name: string;
}

export class UserLoginDTO {
  email: string;
  password: string;
}

export class UpdateUserDTO {
  email: string;
  name: string;
}
