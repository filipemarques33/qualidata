import { Component } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';
import { AuthService } from 'src/app/services/auth-service';

@Component({
  selector: 'app-user-login-dialog',
  templateUrl: 'user-login.component.html',
})
export class UserLoginDialog {

  email: string;

  constructor(
    public dialogRef: MatDialogRef<UserLoginDialog>,
    public authService: AuthService,
    ) {}

  onNoClick(): void {
    this.dialogRef.close();
  }

  async loginUser() {
    await this.authService.loginUser(this.email);
    this.dialogRef.close();
  }

}