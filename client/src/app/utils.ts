export enum RoleEnum {
  ADMIN = 'admin',
  USER = 'user',
  DEVELOPER = 'developer'
}

export enum BrowserStorageFields {
  TOKEN = 'token',
  REFRESH_TOKEN = 'refreshToken',
  USER_ROLE = 'role',
  STORE_ID = 'storeId',
  USERNAME = 'username'
}
export class Utils {

  public static encode(data: string): string {
    return atob(data);
  }

  public static decode(data: string): string {
    return btoa(data);
  }
}
