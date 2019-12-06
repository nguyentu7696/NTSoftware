import { AfterContentInit, Component, OnInit } from "@angular/core";
import {
  CURRENT_USER,
  LANGUAGE_LOCAL,
  TOKEN_EMPLOYEE
} from "src/app/constants/localStorageKey";
import { TranslateService } from "@ngx-translate/core";
import { NbMenuItem } from "@nebular/theme";
import { AppService } from "../../common/services/app.service";
import { SignalRService } from "src/app/common/services/signalR.service";
import { BlockUserModel } from "src/app/shared/model/blockUserModel";
import { MatDialogRef, MatDialog } from "@angular/material";
import { Router } from "@angular/router";

@Component({
  selector: "app-employee",
  templateUrl: "./employee.component.html",
  styleUrls: ["./employee.component.scss"]
})
export class EmployeeComponent implements OnInit, AfterContentInit {
  currentUser: any;
  dialogRef: any;
  MENU_ITEMS: NbMenuItem[] = [
    {
      title: "Thông tin phòng ban",
      icon: "home-outline",
      link: "/employee/department-info"
    },
    {
      title: "Thông tin dự án tham gia",
      icon: "home-outline",
      link: "/employee/project-employee/project-emp-list"
    }
  ];
  loaded: boolean = false;

  constructor(
    public translate: TranslateService,
    private appService: AppService,
    public dialog: MatDialog,
    private signalRService: SignalRService
  ) {
    translate.setDefaultLang("vi");
    this.currentUser = JSON.parse(localStorage.getItem(CURRENT_USER));
    console.log(this.currentUser);
  }

  ngOnInit() {
    this.signalRService.startConnection();
    this.signalRService.addBlockUserListener(this.onListenBlock);
  }

  onListenBlock = (data: BlockUserModel): void => {
    if (
      data.companyId == this.currentUser.CompanyId &&
      data.userId == this.currentUser.UserId
    ) {
      console.log(this.dialogRef);
      if (this.dialogRef != undefined) return;
      localStorage.removeItem(TOKEN_EMPLOYEE);
      localStorage.removeItem(CURRENT_USER);
      this.dialogRef = this.dialog.open(DialogLogout, {
        width: "350px",
        disableClose: true
      });

      this.dialogRef.afterClosed().subscribe((result: any) => {
        this.dialogRef = undefined;
      });
    }
  };
  ngAfterContentInit(): void {
    setTimeout(() => {
      this.loaded = true;
    }, 1000);
  }
}
@Component({
  selector: "dialog-logout.component",
  templateUrl: "./dialog-logout.html"
})
export class DialogLogout {
  onRequest: boolean = false;
  constructor(
    public translate: TranslateService,
    public dialogRef: MatDialogRef<DialogLogout>,
    private router: Router
  ) {
    translate.setDefaultLang("vi");
  }

  onSubmit(): void {
    this.router.navigate(["../../auth"]);
  }
}
