export interface User {
  uid: string;
  isAnonymous: boolean;
  name: string;
  email: string;
  photoURL: string;
}

export interface UserError {
  message: string;
}
