import { makeAutoObservable } from 'mobx';

export interface ICredentials {
  idInstance: string;
  apiTokenInstance: string;
}

export class UserStoreClass {
  credentials: ICredentials | null = null;

  constructor() {
    makeAutoObservable(this);
  }

  setCredentials(credentials: ICredentials) {
    this.credentials = credentials;
  }
}

const UserStore = new UserStoreClass();

export default UserStore;
