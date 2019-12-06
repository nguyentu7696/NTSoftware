export const BASE_API = "http://localhost:8080";
export const AccountAPIs = {
  REQUEST_PASSWORD: "/api/Account/RequestPassword",
  LOGIN: "/api/Account/Login",
  CHANGE_PASSWORD_WITH_CODE: "/api/Account/ChangePasswordWithCode",
  CHANGE_PASSWORD_WITHOUT_OLD_PASSWORD:
    "/api/Account/ChangePasswordWithoutOldPassword",
  CHANGE_PASSWORD_WITH_OLD_PASSWORD:
    "/api/Account/ChangePasswordWithOldPassword",
  LOG_OUT: "/api/Account/Logout",
  TOGGLE_USER: "/api/Account/ToggleEmployee"
};
export const UploadAPIs = {
  CHANGE_LOGO_ADMIN: "/api/Upload/ChangeLogoAdmin"
};
export const UserAPIs = {
  GET_BY_ID: "/api/AppUser/GetById",
  ADD: "/api/AppUser/Add",
  UPDATE: "/api/AppUser/Update"
};
export const CompanyAPIs = {
  GET_PAGING: "/api/Company/GetPaging",
  GET_LOG_USE: "/api/Company/GetLogUse",
  GET_TOTAL: "/api/LogUseTime/GetTotalByMonth",
  GET_BY_ID: "/api/Company/GetById",
  ADD: "/api/Company/AddCompany",
  ADD_EMPLOYEE: "/api/Company/AddEmployee",
  UPDATE: "/api/Company/Update",
  DELETE: "/api/Company/Delete",
  PAY: "/api/Company/Pay"
};
export const RuleAPIs = {
  GET_ALL: "/api/Rule/GetAll",
  GET_PAGING: "/api/Rule/GetPaging",
  GET_BY_ID: "/api/Rule/GetById",
  ADD: "/api/Rule/Add",
  UPDATE: "/api/Rule/Update",
  DELETE: "/api/Rule/Delete"
};
export const ContractAPIs = {
  GET_PAGING: "/api/Contract/GetPaging",
  GET_CURRENT: "/api/Contract/GetCurrentContract",
  GET_ALL_FUNCTION: "/api/Contract/GetAllFunction",
  GET_BY_ID: "/api/Contract/GetById",
  ADD: "/api/Contract/AddContractCompany",
  UPDATE: "/api/Contract/UpdateStatusContractCompany",
  DELETE: "/api/Contract/Delete"
};
export const DepartmentAPIs = {
  CHECK_PERMISSION: "/api/Department/CheckPermission",
  GET_PAGING: "/api/Department/GetPaging",
  GET_BY_ID: "/api/Department/GetById",
  ADD: "/api/Department/Add",
  UPDATE: "/api/Department/Update",
  DELETE: "/api/Department/Delete"
};
export const DetailUserAPIs = {
  GET_ALL: "/api/DetailUser/GetAll",
  GET_SELECT_DEPARTMENT: "/api/DetailUser/SelectDepartment",
  GET_SELECT_PROJECT: "/api/DetailUser/SelectProject",
  GET_BY_USER: "/api/DetailUser/GetByUser",
  UPDATE_ADMIN: "/api/DetailUser/UpdateAdmin",
  UPDATE_EMPLOYEE: "/api/DetailUser/UpdateEmployee",
  DELETE_EMPLOYEE: "/api/DetailUser/DeleteEmployee",
  GET_BY_PROJECT: "/api/DetailUser/GetAllByProject"
};
export const EmployeeContractAPIs = {
  GET_BY_ID: "/api/EmployeeContract/GetById",
  GET_BY_EMPLOYEE: "/api/EmployeeContract/GetByEmployee",
  UPDATE_STATUS: "/api/EmployeeContract/UpdateStatusEmployee",
  ADD: "/api/EmployeeContract/Add",
  DELETE: "/api/EmployeeContract/Delete"
};
export const ProjectAPIs = {
  CHECK_PERMISSION: "/api/Project/CheckPermission",
  GET_PAGING: "/api/Project/GetPaging",
  GET_BY_ID: "/api/Project/GetById",
  UPDATE: "/api/Project/Update",
  ADD: "/api/Project/Add",
  DELETE: "/api/Project/Delete"
};
export const PriceContractAPIs = {
  GET_ALL: "/api/OptionContract/GetAll",
  GET_PAGING: "/api/OptionContract/GetPaging",
  ADD: "/api/OptionContract/Add",
  UPDATE: "/api/OptionContract/Update",
  DELETE: "/api/OptionContract/Delete"
};
export const NotifyAPIs = {
  AUTHEN_USER: "/api/Notify/AuthenUser",
  BLOCK_USER: "/api/Notify/BlockUser"
};
