import { toast } from "react-hot-toast"
import { apiconnector } from "../apiconnector"
import { budgetEndpoints } from "../apis"

const {
  GET_BUDGET_OVERVIEW_API,
  GET_BUDGET_TRENDS_API,
  UPDATE_GRIEVANCE_BUDGET_API,
  ADD_EXPENSE_API,
} = budgetEndpoints

// Get Budget Overview
export const getBudgetOverview = async () => {
  try {
    const response = await apiconnector("GET", GET_BUDGET_OVERVIEW_API)
    
    console.log("GET BUDGET OVERVIEW API RESPONSE............", response)

    if (!response.data.success) {
      throw new Error(response.data.message)
    }

    return response.data.data
  } catch (error) {
    console.log("GET BUDGET OVERVIEW API ERROR............", error)
    toast.error("Could Not Fetch Budget Overview")
    return null
  }
}

// Get Budget Trends
export const getBudgetTrends = async (months = 6) => {
  try {
    const response = await apiconnector(
      "GET",
      GET_BUDGET_TRENDS_API,
      null,
      null,
      { months }
    )
    
    console.log("GET BUDGET TRENDS API RESPONSE............", response)

    if (!response.data.success) {
      throw new Error(response.data.message)
    }

    return response.data.data
  } catch (error) {
    console.log("GET BUDGET TRENDS API ERROR............", error)
    toast.error("Could Not Fetch Budget Trends")
    return {}
  }
}

// Update Grievance Budget (Admin/Engineer only)
export const updateGrievanceBudget = async (id, budgetData, token) => {
  const toastId = toast.loading("Updating budget...")
  try {
    const response = await apiconnector(
      "PUT",
      `${UPDATE_GRIEVANCE_BUDGET_API}/${id}`,
      budgetData,
      {
        Authorization: `Bearer ${token}`,
      }
    )
    
    console.log("UPDATE BUDGET API RESPONSE............", response)

    if (!response.data.success) {
      throw new Error(response.data.message)
    }

    toast.success("Budget Updated Successfully!")
    return response.data.data
  } catch (error) {
    console.log("UPDATE BUDGET API ERROR............", error)
    toast.error(error?.response?.data?.message || "Failed to Update Budget")
    throw error
  } finally {
    toast.dismiss(toastId)
  }
}

// Add Expense to Grievance (Admin/Engineer only)
export const addExpense = async (id, expenseData, token) => {
  const toastId = toast.loading("Adding expense...")
  try {
    const response = await apiconnector(
      "POST",
      `${ADD_EXPENSE_API}/${id}/expense`,
      expenseData,
      {
        Authorization: `Bearer ${token}`,
      }
    )
    
    console.log("ADD EXPENSE API RESPONSE............", response)

    if (!response.data.success) {
      throw new Error(response.data.message)
    }

    toast.success("Expense Added Successfully!")
    return response.data.data
  } catch (error) {
    console.log("ADD EXPENSE API ERROR............", error)
    toast.error(error?.response?.data?.message || "Failed to Add Expense")
    throw error
  } finally {
    toast.dismiss(toastId)
  }
}
