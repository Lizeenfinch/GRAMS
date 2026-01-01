const BASE_URL = import.meta.env.VITE_API_BASE_URL || "http://localhost:5000/api"

// AUTH ENDPOINTS
export const authEndpoints = {
  REGISTER_API: BASE_URL + "/auth/register",
  LOGIN_API: BASE_URL + "/auth/login",
  LOGOUT_API: BASE_URL + "/auth/logout",
  GET_ME_API: BASE_URL + "/auth/me",
  SEND_OTP_API: BASE_URL + "/auth/send-otp",
  VERIFY_OTP_API: BASE_URL + "/auth/verify-otp",
  GOOGLE_LOGIN_API: BASE_URL + "/auth/google-login",
}

// GRIEVANCE ENDPOINTS
export const grievanceEndpoints = {
  GET_ALL_GRIEVANCES_API: BASE_URL + "/grievances/all",
  GET_USER_GRIEVANCES_API: BASE_URL + "/grievances",
  GET_GRIEVANCE_BY_ID_API: BASE_URL + "/grievances", // append /:id
  CREATE_GRIEVANCE_API: BASE_URL + "/grievances",
  UPDATE_GRIEVANCE_API: BASE_URL + "/grievances", // append /:id
  DELETE_GRIEVANCE_API: BASE_URL + "/grievances", // append /:id
  ADD_COMMENT_API: BASE_URL + "/grievances", // append /:id/comment
  UPVOTE_GRIEVANCE_API: BASE_URL + "/grievances", // append /:id/upvote
}

// TRANSPARENCY ENDPOINTS
export const transparencyEndpoints = {
  GET_REPORT_API: BASE_URL + "/transparency/report",
  GET_OVERDUE_ISSUES_API: BASE_URL + "/transparency/overdue",
  UPVOTE_ISSUE_API: BASE_URL + "/transparency/upvote", // append /:id
  GET_CATEGORY_STATS_API: BASE_URL + "/transparency/categories",
  GET_MONTHLY_TRENDS_API: BASE_URL + "/transparency/trends",
  GET_OFFICER_STATS_API: BASE_URL + "/transparency/officers",
  GET_BUDGET_DETAILS_API: BASE_URL + "/transparency/budget",
  EXPORT_DATA_API: BASE_URL + "/transparency/export",
  GET_ISSUE_DETAILS_API: BASE_URL + "/transparency/issue", // append /:id
}

// ADMIN ENDPOINTS
export const adminEndpoints = {
  GET_DASHBOARD_STATS_API: BASE_URL + "/admin/dashboard",
  GET_ALL_USERS_API: BASE_URL + "/admin/users",
  GET_ALL_GRIEVANCES_ADMIN_API: BASE_URL + "/admin/grievances",
  ASSIGN_GRIEVANCE_API: BASE_URL + "/admin/assign-grievance",
  UPDATE_USER_ROLE_API: BASE_URL + "/admin/user-role",
}

// PHONE AUTH ENDPOINTS
export const phoneAuthEndpoints = {
  SEND_PHONE_OTP_API: BASE_URL + "/phone/send-otp",
  VERIFY_PHONE_OTP_API: BASE_URL + "/phone/verify-otp",
  PHONE_LOGIN_API: BASE_URL + "/phone/login",
}

// BUDGET ENDPOINTS
export const budgetEndpoints = {
  GET_BUDGET_OVERVIEW_API: BASE_URL + "/budget/overview",
  GET_BUDGET_TRENDS_API: BASE_URL + "/budget/trends",
  UPDATE_GRIEVANCE_BUDGET_API: BASE_URL + "/budget", // append /:id
  ADD_EXPENSE_API: BASE_URL + "/budget", // append /:id/expense
}
