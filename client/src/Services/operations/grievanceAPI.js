import { toast } from "react-hot-toast"
import { apiconnector } from "../apiconnector"
import { grievanceEndpoints } from "../apis"

const {
  GET_ALL_GRIEVANCES_API,
  GET_USER_GRIEVANCES_API,
  GET_GRIEVANCE_BY_ID_API,
  CREATE_GRIEVANCE_API,
  UPDATE_GRIEVANCE_API,
  DELETE_GRIEVANCE_API,
  ADD_COMMENT_API,
} = grievanceEndpoints

// Get All Grievances (Public)
export const getAllGrievances = async () => {
  const toastId = toast.loading("Loading grievances...")
  try {
    const response = await apiconnector("GET", GET_ALL_GRIEVANCES_API)
    
    console.log("GET ALL GRIEVANCES API RESPONSE............", response)

    if (!response.data.success) {
      throw new Error(response.data.message)
    }

    return response.data.data
  } catch (error) {
    console.log("GET ALL GRIEVANCES API ERROR............", error)
    toast.error("Could Not Fetch Grievances")
    return []
  } finally {
    toast.dismiss(toastId)
  }
}

// Get User Grievances
export const getUserGrievances = async (token) => {
  const toastId = toast.loading("Loading your grievances...")
  try {
    const response = await apiconnector("GET", GET_USER_GRIEVANCES_API, null, {
      Authorization: `Bearer ${token}`,
    })
    
    console.log("GET USER GRIEVANCES API RESPONSE............", response)

    if (!response.data.success) {
      throw new Error(response.data.message)
    }

    return response.data.data
  } catch (error) {
    console.log("GET USER GRIEVANCES API ERROR............", error)
    toast.error("Could Not Fetch Your Grievances")
    return []
  } finally {
    toast.dismiss(toastId)
  }
}

// Get Grievance By ID
export const getGrievanceById = async (id, token) => {
  const toastId = toast.loading("Loading grievance details...")
  try {
    const response = await apiconnector(
      "GET",
      `${GET_GRIEVANCE_BY_ID_API}/${id}`,
      null,
      {
        Authorization: `Bearer ${token}`,
      }
    )
    
    console.log("GET GRIEVANCE BY ID API RESPONSE............", response)

    if (!response.data.success) {
      throw new Error(response.data.message)
    }

    return response.data.data
  } catch (error) {
    console.log("GET GRIEVANCE BY ID API ERROR............", error)
    toast.error("Could Not Fetch Grievance Details")
    throw error
  } finally {
    toast.dismiss(toastId)
  }
}

// Create Grievance
export const createGrievance = async (grievanceData, token) => {
  const toastId = toast.loading("Submitting grievance...")
  try {
    // Create FormData for file upload
    const formData = new FormData()
    
    // Append text fields
    formData.append('title', grievanceData.title)
    formData.append('description', grievanceData.description)
    formData.append('category', grievanceData.category)
    formData.append('priority', grievanceData.priority || 'medium')
    
    if (grievanceData.location) {
      formData.append('location', grievanceData.location)
    }
    
    // Append photo files
    if (grievanceData.photos && grievanceData.photos.length > 0) {
      grievanceData.photos.forEach((photo) => {
        formData.append('files', photo)
      })
    }
    
    // Append video files
    if (grievanceData.videos && grievanceData.videos.length > 0) {
      grievanceData.videos.forEach((video) => {
        formData.append('files', video)
      })
    }
    
    const response = await apiconnector(
      "POST",
      CREATE_GRIEVANCE_API,
      formData,
      {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'multipart/form-data',
      }
    )
    
    console.log("CREATE GRIEVANCE API RESPONSE............", response)

    if (!response.data.success) {
      throw new Error(response.data.message)
    }

    toast.success("Grievance Submitted Successfully!")
    return response.data.data
  } catch (error) {
    console.log("CREATE GRIEVANCE API ERROR............", error)
    toast.error(error?.response?.data?.message || "Failed to Submit Grievance")
    throw error
  } finally {
    toast.dismiss(toastId)
  }
}

// Update Grievance
export const updateGrievance = async (id, updateData, token) => {
  const toastId = toast.loading("Updating grievance...")
  try {
    const response = await apiconnector(
      "PUT",
      `${UPDATE_GRIEVANCE_API}/${id}`,
      updateData,
      {
        Authorization: `Bearer ${token}`,
      }
    )
    
    console.log("UPDATE GRIEVANCE API RESPONSE............", response)

    if (!response.data.success) {
      throw new Error(response.data.message)
    }

    toast.success("Grievance Updated Successfully!")
    return response.data.data
  } catch (error) {
    console.log("UPDATE GRIEVANCE API ERROR............", error)
    toast.error(error?.response?.data?.message || "Failed to Update Grievance")
    throw error
  } finally {
    toast.dismiss(toastId)
  }
}

// Delete Grievance
export const deleteGrievance = async (id, token) => {
  const toastId = toast.loading("Deleting grievance...")
  try {
    const response = await apiconnector(
      "DELETE",
      `${DELETE_GRIEVANCE_API}/${id}`,
      null,
      {
        Authorization: `Bearer ${token}`,
      }
    )
    
    console.log("DELETE GRIEVANCE API RESPONSE............", response)

    if (!response.data.success) {
      throw new Error(response.data.message)
    }

    toast.success("Grievance Deleted Successfully!")
    return true
  } catch (error) {
    console.log("DELETE GRIEVANCE API ERROR............", error)
    toast.error(error?.response?.data?.message || "Failed to Delete Grievance")
    return false
  } finally {
    toast.dismiss(toastId)
  }
}

// Add Comment to Grievance
export const addComment = async (id, commentData, token) => {
  const toastId = toast.loading("Adding comment...")
  try {
    const response = await apiconnector(
      "POST",
      `${ADD_COMMENT_API}/${id}/comment`,
      commentData,
      {
        Authorization: `Bearer ${token}`,
      }
    )
    
    console.log("ADD COMMENT API RESPONSE............", response)

    if (!response.data.success) {
      throw new Error(response.data.message)
    }

    toast.success("Comment Added Successfully!")
    return response.data.data
  } catch (error) {
    console.log("ADD COMMENT API ERROR............", error)
    toast.error(error?.response?.data?.message || "Failed to Add Comment")
    throw error
  } finally {
    toast.dismiss(toastId)
  }
}
