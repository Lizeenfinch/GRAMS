import { toast } from "react-hot-toast"
import { apiconnector } from "../apiconnector"
import { authEndpoints } from "../apis"

const {
  REGISTER_API,
  LOGIN_API,
  LOGOUT_API,
  GET_ME_API,
  SEND_OTP_API,
  VERIFY_OTP_API,
  GOOGLE_LOGIN_API,
} = authEndpoints

// Register User
export const register = async (userData, navigate) => {
  const toastId = toast.loading("Creating your account...")
  try {
    const response = await apiconnector("POST", REGISTER_API, userData)
    
    console.log("REGISTER API RESPONSE............", response)

    if (!response.data.success) {
      throw new Error(response.data.message)
    }

    toast.success("Registration Successful! Please login.")
    navigate("/login")
  } catch (error) {
    console.log("REGISTER API ERROR............", error)
    toast.error(error?.response?.data?.message || "Registration Failed")
  } finally {
    toast.dismiss(toastId)
  }
}

// Login User
export const login = async (credentials, navigate) => {
  const toastId = toast.loading("Logging in...")
  try {
    const response = await apiconnector("POST", LOGIN_API, credentials)
    
    console.log("LOGIN API RESPONSE............", response)

    if (!response.data.success) {
      throw new Error(response.data.message)
    }

    toast.success("Login Successful!")
    
    // Store token in localStorage
    localStorage.setItem("token", response.data.token)
    localStorage.setItem("user", JSON.stringify(response.data.user))
    
    navigate("/dashboard")
    return response.data
  } catch (error) {
    console.log("LOGIN API ERROR............", error)
    toast.error(error?.response?.data?.message || "Login Failed")
  } finally {
    toast.dismiss(toastId)
  }
}

// Google Login
export const googleLogin = async (googleData, navigate) => {
  const toastId = toast.loading("Logging in with Google...")
  try {
    const response = await apiconnector("POST", GOOGLE_LOGIN_API, googleData)
    
    console.log("GOOGLE LOGIN API RESPONSE............", response)

    if (!response.data.success) {
      throw new Error(response.data.message)
    }

    toast.success("Login Successful!")
    
    // Store token in localStorage
    localStorage.setItem("token", response.data.token)
    localStorage.setItem("user", JSON.stringify(response.data.user))
    
    navigate("/dashboard")
    return response.data
  } catch (error) {
    console.log("GOOGLE LOGIN API ERROR............", error)
    toast.error(error?.response?.data?.message || "Google Login Failed")
  } finally {
    toast.dismiss(toastId)
  }
}

// Send OTP
export const sendOTP = async (phoneNumber) => {
  const toastId = toast.loading("Sending OTP...")
  try {
    const response = await apiconnector("POST", SEND_OTP_API, { phoneNumber })
    
    console.log("SEND OTP API RESPONSE............", response)

    if (!response.data.success) {
      throw new Error(response.data.message)
    }

    toast.success("OTP sent successfully!")
    return response.data
  } catch (error) {
    console.log("SEND OTP API ERROR............", error)
    toast.error(error?.response?.data?.message || "Failed to send OTP")
    throw error
  } finally {
    toast.dismiss(toastId)
  }
}

// Verify OTP
export const verifyOTP = async (phoneNumber, otp, navigate) => {
  const toastId = toast.loading("Verifying OTP...")
  try {
    const response = await apiconnector("POST", VERIFY_OTP_API, { phoneNumber, otp })
    
    console.log("VERIFY OTP API RESPONSE............", response)

    if (!response.data.success) {
      throw new Error(response.data.message)
    }

    toast.success("OTP verified successfully!")
    
    // Store token in localStorage
    localStorage.setItem("token", response.data.token)
    localStorage.setItem("user", JSON.stringify(response.data.user))
    
    navigate("/dashboard")
    return response.data
  } catch (error) {
    console.log("VERIFY OTP API ERROR............", error)
    toast.error(error?.response?.data?.message || "Invalid OTP")
    throw error
  } finally {
    toast.dismiss(toastId)
  }
}

// Get User Details
export const getUserDetails = async (token) => {
  const toastId = toast.loading("Loading...")
  try {
    const response = await apiconnector("GET", GET_ME_API, null, {
      Authorization: `Bearer ${token}`,
    })
    
    console.log("GET USER DETAILS API RESPONSE............", response)

    if (!response.data.success) {
      throw new Error(response.data.message)
    }

    return response.data.user
  } catch (error) {
    console.log("GET USER DETAILS API ERROR............", error)
    toast.error("Could Not Get User Details")
    throw error
  } finally {
    toast.dismiss(toastId)
  }
}

// Logout
export const logout = (navigate) => {
  return async () => {
    try {
      await apiconnector("POST", LOGOUT_API)
      
      localStorage.removeItem("token")
      localStorage.removeItem("user")
      
      toast.success("Logged Out Successfully")
      navigate("/login")
    } catch (error) {
      console.log("LOGOUT API ERROR............", error)
      toast.error("Logout Failed")
    }
  }
}
