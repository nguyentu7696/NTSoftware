import { Router } from "@angular/router";
import { Injectable } from "@angular/core";
import { LOGIN_ROUTE_NAME } from "src/app/constants/routes";
import { NbToastrService } from "@nebular/theme";
import {
  LANGUAGE_LOCAL,
  CURRENT_USER,
  TOKEN_ADMIN,
  TOKEN_COMPANY,
  TOKEN_EMPLOYEE
} from "src/app/constants/localStorageKey";
import { ADMIN_ROLE } from "src/app/constants/roles";
import { AppService } from "../services/app.service";
import { AccountAPIs } from "src/app/constants/api";

interface Status {}
@Injectable({
  providedIn: "root"
})
export class CommonService {
  constructor(private route: Router, private toastService: NbToastrService) {}
  logout() {
    const language = localStorage.getItem(LANGUAGE_LOCAL);
    localStorage.clear();
    localStorage.setItem(LANGUAGE_LOCAL, language);
    this.route.navigate([LOGIN_ROUTE_NAME]);
  }
  showAlert(message: string, status, title?: string) {
    this.toastService.show(message, title, { status: status });
  }
  handleError(status: number) {
    switch (status) {
      case 0:
        return this.toastService.warning("Quá thời gian yêu cầu", "Cảnh báo", {
          icon: "alert-triangle"
        });
      case 400:
        return this.toastService.danger(
          "Lỗi trong quá trình gửi dữ liệu lên máy chủ",
          "Lỗi",

          {
            icon: "alert-circle"
          }
        );
      case 401:
        localStorage.clear();
        this.route.navigate([LOGIN_ROUTE_NAME]);
        return this.toastService.danger("Tài khoản chưa được xác thực", "Lỗi", {
          icon: "alert-circle"
        });

      case 402:
        return this.toastService.danger(
          "Bạn đã gửi quá nhiều yêu cầu đến máy chủ",
          "Lỗi",

          {
            icon: "alert-circle"
          }
        );
      case 403:
        localStorage.clear();
        this.route.navigate([LOGIN_ROUTE_NAME]);
        return this.toastService.danger(
          "Bạn không có quyền truy cập chức năng này",
          "Lỗi",

          {
            icon: "alert-circle"
          }
        );

      case 404:
        return this.toastService.danger("Không tìm thấy máy chủ", "Lỗi", {
          icon: "alert-circle"
        });
      case 405:
        return this.toastService.danger("Request không đúng", "Lỗi", {
          icon: "alert-circle"
        });
      case 406:
        return this.toastService.danger("Máy chủ không thể đáp ứng", "Lỗi", {
          icon: "alert-circle"
        });
      case 407:
        return this.toastService.danger("Bạn chưa xác thực proxy", "Lỗi", {
          icon: "alert-circle"
        });
      case 408:
        return this.toastService.info(
          "Quá thời gian máy chủ xử lý",
          "Cảnh báo",

          {
            icon: "alert-triangle"
          }
        );

      case 409:
        return this.toastService.danger(
          "Dữ liệu gửi lên không thống nhất",
          "Lỗi",

          {
            icon: "alert-circle"
          }
        );
      case 410:
        return this.toastService.info(
          "Dữ liệu không tồn tại trên máy chủ",
          "Cảnh báo",

          {
            icon: "alert-triangle"
          }
        );

      case 411:
        return this.toastService.danger(
          "Không thể xác định độ dài dữ liệu gửi lên",
          "Lỗi",

          {
            icon: "alert-circle"
          }
        );
      case 412:
        return this.toastService.danger(
          "Một số dữ liệu truyền lên không đúng",
          "Lỗi",

          {
            icon: "alert-circle"
          }
        );
      case 411:
        return this.toastService.danger(
          "Không thể xác định độ dài dữ liệu gửi lên",
          "Lỗi",

          {
            icon: "alert-circle"
          }
        );
      case 413:
        return this.toastService.danger(
          "Dữ liệu yêu cầu quá lớn, máy chủ không thể đáp ứng",
          "Lỗi",

          {
            icon: "alert-circle"
          }
        );
      case 414:
        return this.toastService.danger("Đường dẫn máy chủ quá lớn", "Lỗi", {
          icon: "alert-circle"
        });
      case 415:
        return this.toastService.danger(
          "Dữ liệu gửi lên không đúng định dạng",
          "Lỗi",

          {
            icon: "alert-circle"
          }
        );
      case 416:
        return this.toastService.danger(
          "Một số dữ liệu truyền lên không thể đáp ứng bởi máy chủ",
          "Lỗi",

          {
            icon: "alert-circle"
          }
        );
      case 417:
        return this.toastService.danger(
          "Máy chủ không đáp ứng yêu cầu chờ",
          "Lỗi",

          {
            icon: "alert-circle"
          }
        );
      case 500:
        return this.toastService.info("Cảnh báo", "Máy chủ không hoạt động", {
          icon: "alert-triangle"
        });
      case 501:
        return this.toastService.info(
          "Máy chủ không thể xử lý yêu cầu",
          "Lỗi",

          {
            icon: "alert-triangle"
          }
        );
      case 502:
        return this.toastService.info(
          "Máy chủ không đáp ứng yêu cầu chờ",
          "Lỗi",

          {
            icon: "alert-triangle"
          }
        );
      case 503:
        return this.toastService.info(
          "Máy chủ quá tải hoặc đang bảo trì",
          "Lỗi",

          {
            icon: "alert-triangle"
          }
        );
      case 504:
        return this.toastService.info(
          "Máy chủ không kết nối được để lấy dữ liệu",
          "Lỗi",

          {
            icon: "alert-triangle"
          }
        );
      case 505:
        return this.toastService.danger(
          "Máy chủ không hỗ trợ giao thức HTTP",
          "Lỗi",

          {
            icon: "alert-circle"
          }
        );
      default:
        if (status > 503) {
          return this.toastService.danger("Lỗi máy chủ", "Lỗi", {
            icon: "alert-circle"
          });
        } else if (status < 500 && status >= 400) {
          return this.toastService.danger(
            "Một lỗi xảy ra khi gửi yêu cầu",
            "Lỗi",

            {
              icon: "alert-circle"
            }
          );
        } else {
          return this.toastService.danger(
            "Một lỗi xảy ra khi xử lý dữ liệu",
            "Lỗi",

            {
              icon: "alert-circle"
            }
          );
        }
    }
  }
}
