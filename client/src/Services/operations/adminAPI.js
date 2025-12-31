import { toast } from "react-hot-toast"
import { apiconnector } from "../apiconnector"
import { adminEndpoints } from "../apis"

const {
  GET_DASHBOARD_STATS_API,
  GET_ALL_USERS_API,
  GET_ALL_GRIEVANCES_ADMIN_API,
  ASSIGN_GRIEVANCE_API,
  UPDATE_USER_ROLE_API,
} = adminEndpoints

// Get Dashboard Statistics
export const getDashboardStats = async (token) => {
  const toastId = toast.loading("Loading dashboard stats...")
  try {
    const response = await apiconnector("GET", GET_DASHBOARD_STATS_API, null, {
      Authorization: `Bearer ${token}`,
    })
    
    console.log("GET DASHBOARD STATS API RESPONSE............", response)

    if (!response.data.success) {
      throw new Error(response.data.message)
    }

    return response.data.data
  } catch (error) {
    console.log("GET DASHBOARD STATS API ERROR............", error)
    toast.error("Could Not Fetch Dashboard Statistics")
    return null
  } finally {
    toast.dismiss(toastId)
  }
}

// Get All Users (Admin)
export const getAllUsers = async (token) => {
  const toastId = toast.loading("Loading users...")
  try {
    const response = await apiconnector("GET", GET_ALL_USERS_API, null, {
      Authorization: `Bearer ${token}`,
    })
    
    console.log("GET ALL USERS API RESPONSE............", response)

    if (!response.data.success) {
      throw new Error(response.data.message)
    }

    return response.data.data
  } catch (error) {
    console.log("GET ALL USERS API ERROR............", error)
    toast.error("Could Not Fetch Users")
    return []
  } finally {
    toast.dismiss(toastId)
  }
}

// Get All Grievances (Admin)
export const getAllGrievancesAdmin = async (token, params = {}) => {
  const toastId = toast.loading("Loading grievances...")
  try {
    const response = await apiconnector(
      "GET",
      GET_ALL_GRIEVANCES_ADMIN_API,
      null,
      {
        Authorization: `Bearer ${token}`,
      },
      params
    )
    
    console.log("GET ALL GRIEVANCES ADMIN API RESPONSE............", response)

    if (!response.data.success) {
      throw new Error(response.data.message)
    }

    return response.data.data
  } catch (error) {
    console.log("GET ALL GRIEVANCES ADMIN API ERROR............", error)
    toast.error("Could Not Fetch Grievances")
    return []
  } finally {
    toast.dismiss(toastId)
  }
}

// Assign Grievance
export const assignGrievance = async (assignData, token) => {
  const toastId = toast.loading("Assigning grievance...")
  try {
    const response = await apiconnector(
      "POST",
      ASSIGN_GRIEVANCE_API,
      assignData,
      {
        Authorization: `Bearer ${token}`,
      }
    )
    
    console.log("ASSIGN GRIEVANCE API RESPONSE............", response)

    if (!response.data.success) {
      throw new Error(response.data.message)
    }

    toast.success("Grievance Assigned Successfully!")
    return response.data.data
  } catch (error) {
    console.log("ASSIGN GRIEVANCE API ERROR............", error)
    toast.error(error?.response?.data?.message || "Failed to Assign Grievance")
    throw error
  } finally {
    toast.dismiss(toastId)
  }
}

// Update User Role
export const updateUserRole = async (roleData, token) => {
  const toastId = toast.loading("Updating user role...")
  try {
    const response = await apiconnector(
      "PUT",
      UPDATE_USER_ROLE_API,
      roleData,
      {
        Authorization: `Bearer ${token}`,
      }
    )
    
    console.log("UPDATE USER ROLE API RESPONSE............", response)

    if (!response.data.success) {
      throw new Error(response.data.message)
    }

    toast.success("User Role Updated Successfully!")
    return response.data.data
  } catch (error) {
    console.log("UPDATE USER ROLE API ERROR............", error)
    toast.error(error?.response?.data?.message || "Failed to Update User Role")
    throw error
  } finally {
    toast.dismiss(toastId)
  }
}
