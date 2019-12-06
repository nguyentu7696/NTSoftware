import { Component, OnInit, ViewChild, Inject } from "@angular/core";
import { AppService } from "src/app/common/services/app.service";
import { TranslateService } from "@ngx-translate/core";
import { CommonService } from "src/app/common/method";
import { MatDialogRef, MAT_DIALOG_DATA } from "@angular/material";
import { ContractAPIs } from "src/app/constants/api";
import { FormGroup, FormControl, Validators } from "@angular/forms";
import { StateMatcher, EmptyOrNull } from "src/app/shared/validate";

@Component({
  selector: "confirm-finish",
  templateUrl: "./confirm-finish.html"
})
export class ConfirmFinish {
  onRequest: boolean = false;
  reasonEnd: FormControl;
  isBreak = "0";
  constructor(
    private appService: AppService,
    public translate: TranslateService,
    private commonService: CommonService,
    public dialogRef: MatDialogRef<ConfirmFinish>,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {
    translate.setDefaultLang("vi");
    this.reasonEnd = new FormControl("Đã thống nhất kết thúc sớm hợp lệ", [
      EmptyOrNull.SpaceValidator,
      Validators.required
    ]);
  }
  matcher = new StateMatcher();
  reasonChange(e) {
    console.log(e);
    if (e.value) {
      this.reasonEnd.setValue(
        e.value == "1" ? "" : "Đã thống nhất kết thúc sớm hợp lệ"
      );
    }
  }
  onSubmit(): void {
    if (this.reasonEnd.invalid) {
      this.commonService.showAlert(
        "Vui lòng điền đủ thông tin",
        "danger",
        "Cảnh báo"
      );
      return;
    }

    this.data.reasonEnd = this.reasonEnd.value;
    this.data.isBreak = this.isBreak == "1" ? true : false;
    this.dialogRef.disableClose = true;
    console.log(this.data);
    this.toggleOnRequest();
    this.appService
      .put(ContractAPIs.UPDATE, this.toggleOnRequest, this.data)
      .subscribe((res: any) => {
        this.toggleOnRequest();
        if (res.success) {
          this.commonService.showAlert(
            "Cập nhật thành công",
            "success",
            "Thông báo"
          );
          this.dialogRef.close(true);
        } else {
          this.commonService.showAlert(res.message, "danger", "Cảnh báo");
        }
      });
  }
  toggleOnRequest = (): void => {
    this.onRequest = !this.onRequest;
  };
}
