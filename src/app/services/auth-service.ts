import { Injectable } from "@angular/core";
import { UserRepository, User } from "../storage/firestore/UserRepository";

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  user: User;

  constructor (
    private userRepository: UserRepository
  ) {}

  async loginUser(email: string) {
    let users = await this.userRepository.getByProperty('email', email);
    if (users.length) this.user = users[0];
  }

  logoutUser() {
    this.user = null;
  }
}