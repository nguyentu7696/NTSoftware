import { Component, OnInit, Inject } from "@angular/core";
import {
  StateMatcher,
  EmptyOrNull,
  DateGranter18
} from "src/app/shared/validate";
import { FormGroup, FormBuilder, Validators } from "@angular/forms";
import { TranslateService } from "@ngx-translate/core";
import {
  MatDialog,
  DateAdapter,
  MAT_DATE_FORMATS,
  MatDialogRef,
  MAT_DIALOG_DATA
} from "@angular/material";
import { AppService } from "src/app/common/services/app.service";
import { ActivatedRoute } from "@angular/router";
import { CommonService } from "src/app/common/method";
import { CURRENT_USER } from "src/app/constants/localStorageKey";
import * as moment from "moment";
import {
  AppDateAdapter,
  APP_DATE_FORMATS
} from "src/app/shared/validate/date.adapter";
import { DetailUserAPIs, AccountAPIs, UploadAPIs } from "src/app/constants/api";
import { JwtHelperService } from "@auth0/angular-jwt";
import { HttpRequest } from "@angular/common/http";
@Component({
  selector: "app-profile",
  templateUrl: "./profile.component.html",
  styleUrls: ["./profile.component.scss"],
  providers: [
    {
      provide: DateAdapter,
      useClass: AppDateAdapter
    },
    {
      provide: MAT_DATE_FORMATS,
      useValue: APP_DATE_FORMATS
    }
  ]
})
export class ProfileComponent implements OnInit {
  isEdit: boolean = false;
  file: any;
  currentUser: any;
  formCompany: FormGroup;
  gender: string;
  formUser: FormGroup;
  constructor(
    public translate: TranslateService,
    private JwtHelper: JwtHelperService,
    public dialog: MatDialog,
    private appService: AppService,
    private fb: FormBuilder,
    private commonService: CommonService
  ) {
    this.currentUser = JSON.parse(localStorage.getItem(CURRENT_USER));
    this.gender = "1";
    console.log(this.currentUser);
    this.initialForm();
  }
  matcher = new StateMatcher();
  ngOnInit() {}
  onConvertDate(date: any) {
    return moment(date).format("DD/MM/YYYY");
  }
  initialForm() {
    this.formCompany = this.fb.group({
      userId: [this.currentUser.UserId, Validators.required],
      name: [
        this.currentUser.Name,
        [Validators.required, EmptyOrNull.SpaceValidator]
      ],
      phoneNumber: [
        this.currentUser.PhoneNumber,
        [
          Validators.required,
          Validators.pattern(
            "^(08|09|03|07)([0|1|2|3|4|5|6|7|8|9])+[0-9]{7,8}$"
          ),
          EmptyOrNull.SpaceValidator
        ]
      ],
      birthday: [
        new Date(this.currentUser.Birthday.toString()),
        [Validators.required, DateGranter18.dateValidator]
      ],
      address: [
        this.currentUser.Address,
        [Validators.required, EmptyOrNull.SpaceValidator]
      ],
      email: [
        this.currentUser.Email,
        [
          Validators.required,
          Validators.pattern(
            "^[a-z][a-z0-9%_.]{3,32}@[a-z0-9]{3,}(.[a-z]{3,4}){1,2}$"
          ),
          EmptyOrNull.SpaceValidator
        ]
      ],
      gender: [
        this.currentUser.Gender == "Male" ? "1" : "0",
        Validators.required
      ],
      position: [
        this.currentUser.Position,
        [Validators.required, EmptyOrNull.SpaceValidator]
      ]
    });
  }
  enableEdit() {
    this.isEdit = true;
  }
  disableEdit() {
    this.isEdit = false;
  }
  onSaveCompany() {
    console.log(this.formCompany.value);
    this.appService
      .put(DetailUserAPIs.UPDATE_ADMIN, this.toggleRequest, {
        ...this.formCompany.value,
        gender: parseInt(this.formCompany.controls.gender.value)
      })
      .subscribe((res: any) => {
        if (res.success) {
          console.log(res);
          const user = this.JwtHelper.decodeToken(res.data);
          user.token = res.data;
          console.log(user);
          localStorage.setItem(CURRENT_USER, JSON.stringify(user));
          this.commonService.showAlert(
            "Cập nhật thành công",
            "success",
            "Thông báo báo"
          );
          setTimeout(() => {
            location.reload();
          }, 500);
        } else {
          this.commonService.showAlert(res.message, "danger", "Cảnh báo");
        }
      });
  }
  toggleRequest = (): any => {};
  onShowModalChangePassword() {
    const dialogRef = this.dialog.open(DialogChangePassword, {
      width: "750px"
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result === true) {
      }
    });
  }
  onShowModalChangeLogo() {
    const dialogRef = this.dialog.open(DialogChangeLogo, {
      width: "750px"
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result === true) {
      }
    });
  }
}
@Component({
  selector: "dialog-change-password",
  templateUrl: "./dialog-change-password.html"
})
export class DialogChangePassword implements OnInit {
  currentUser: any;

  formChange: FormGroup;
  onSubmit: boolean = false;
  constructor(
    public translate: TranslateService,
    private appService: AppService,
    private fb: FormBuilder,
    private commonService: CommonService,
    public dialogRef: MatDialogRef<DialogChangePassword>,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {
    translate.setDefaultLang("vi");
    this.currentUser = JSON.parse(localStorage.getItem(CURRENT_USER));
    console.log(this.currentUser);
    this.initialForm();
  }
  initialForm() {
    this.formChange = this.fb.group({
      userId: [this.currentUser.UserId],
      oldPassword: ["", [Validators.required, EmptyOrNull.SpaceValidator]],
      newPassword: [
        "",
        [
          Validators.required,
          Validators.pattern(
            `^(?=.*[A-Z])(?=.*[a-z])(?=.*[0-9])(?=.*[\\W])(?!.*['"]).{8,}$`
          ),
          EmptyOrNull.SpaceValidator
        ]
      ],
      confirmPassword: ["", [EmptyOrNull.SpaceValidator, Validators.required]]
    });
  }
  ngOnInit() {}
  onChangePassword() {
    this.toggleCloseDialog();
    this.appService
      .put(
        AccountAPIs.CHANGE_PASSWORD_WITH_OLD_PASSWORD,
        this.toggleCloseDialog,
        this.formChange.value
      )
      .subscribe((res: any) => {
        this.toggleCloseDialog();
        if (res.success) {
          this.commonService.showAlert(
            "Đổi mật khẩu thành công",
            "success",
            "Thông báo"
          );
          setTimeout(() => {
            this.dialogRef.close();
          }, 500);
        } else {
          this.commonService.showAlert(res.message, "danger", "Cảnh báo");
        }
      });
  }

  toggleCloseDialog = (): any => {
    this.onSubmit = !this.onSubmit;
    this.dialogRef.disableClose = !this.dialogRef.disableClose;
  };
}

@Component({
  selector: "dialog-change-logo",
  templateUrl: "./dialog-change-logo.html"
})
export class DialogChangeLogo implements OnInit {
  onSubmit: boolean = false;
  public imagePath;
  file: any;
  pathLogo: any;
  constructor(
    public translate: TranslateService,
    private appService: AppService,
    private fb: FormBuilder,
    private commonService: CommonService,
    public dialogRef: MatDialogRef<DialogChangeLogo>,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {
    translate.setDefaultLang("vi");
    console.log(this.pathLogo);
  }
  ngOnInit(): void {}
  onSelectFile($event, file) {
    this.file = file;
    var reader = new FileReader();
    this.imagePath = file;
    reader.readAsDataURL(file[0]);
    reader.onload = _event => {
      this.pathLogo = reader.result;
    };
  }
  uploadImage() {
    if (this.file.length === 0) {
      return;
    }

    this.toggleSubmit();
    this.appService
      .uploadFile(UploadAPIs.CHANGE_LOGO_ADMIN, this.toggleSubmit, this.file)
      .subscribe((res: any) => {
        if (res.success) {
          console.log(res);
          this.commonService.showAlert(
            "Đổi logo thành công",
            "success",
            "Thông báo"
          );
          setTimeout(() => {
            location.reload();
          }, 500);
        } else {
          this.commonService.showAlert(res.message, "danger", "Cảnh báo");
        }
      });
  }
  toggleSubmit = (): any => {
    this.onSubmit = !this.onSubmit;
    this.dialogRef.disableClose = !this.dialogRef.disableClose;
  };
}
