import { Injectable } from "@angular/core";
import * as signalR from "@aspnet/signalr";
import { LoginModel } from "../../shared/model/loginModel";
import { BlockUserModel } from "src/app/shared/model/blockUserModel";
@Injectable({
  providedIn: "root"
})
export class SignalRService {
  public data: LoginModel[];

  private hubConnection: signalR.HubConnection;

  public startConnection = () => {
    this.hubConnection = new signalR.HubConnectionBuilder()
      .withUrl("http://localhost:8080/notify")
      .build();

    this.hubConnection
      .start()
      .then(() => console.log("Connection started"))
      .catch(err => console.log("Error while starting connection: " + err));
  };

  addAuthentUserListener(onCallBack: (data: LoginModel) => void) {
    this.hubConnection.on("authenUser", data => {
      this.data = data;
      onCallBack && onCallBack(data);
    });
  }
  addBlockUserListener(onCallBack: (data: BlockUserModel) => void) {
    this.hubConnection.on("blockUser", data => {
      this.data = data;
      onCallBack && onCallBack(data);
    });
  }
}
