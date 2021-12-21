export class User {
  role: string;
  username: string;
  password: string;
  newPassword = '';

  constructor(role: string, username: string, pwd: string, newPwd = '') {
    this.role = role;
    this.username = username;
    this.password = pwd;
    this.newPassword = newPwd;
  }
}

export class StoreUser extends User {
  storeId: number;

  constructor(role: string, storeId: number, username: string, pwd: string) {
    super(role, username, pwd);
    this.storeId = storeId;
  }
}
