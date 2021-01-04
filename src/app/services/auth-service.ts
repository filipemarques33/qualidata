import { Injectable } from "@angular/core";
import { User } from "../storage/firestore/UserRepository";
import { DatabaseService } from "./database-service";
import { NetworkService } from "./network-service";

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  user: User;

  constructor (private databaseService: DatabaseService, private networkService: NetworkService) {}

  async loginUser(email: string) {
    let users = await this.databaseService.getUserByEmail(email);
    if (users.length) {
      this.user = users[0];
      let project = await this.databaseService.getProjectById(this.user.projectIds[0]);
      let network = await this.databaseService.getNetworkById(project.networks[0].id);
      let categories = await this.databaseService.getCategoriesByIds(network.categories);
      let codes = await this.databaseService.getCodesByIds(network.codes);
      this.networkService.setupStructures(network, categories, codes);
    };
  }

  logoutUser() {
    this.user = null;
  }
}
