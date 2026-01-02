import { toast } from "react-hot-toast"
import { apiconnector } from "../apiconnector"
import { authEndpoints } from "../apis"
import useAuthStore from "../../store/authStore"

const {
  REGISTER_API,
  LOGIN_API,
  LOGOUT_API,
  GET_ME_API,
  SEND_OTP_API,
  VERIFY_OTP_API,
  GOOGLE_LOGIN_API,
  SEND_EMAIL_OTP_API,
  VERIFY_EMAIL_OTP_API,
  COMPLETE_REGISTRATION_API,
  RESEND_EMAIL_OTP_API,
  FORGOT_PASSWORD_API,
  VERIFY_RESET_OTP_API,
  RESET_PASSWORD_API,
  RESEND_RESET_OTP_API,
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

// Google Sign Up (Register with Google)
export const googleSignUp = async (googleData, navigate) => {
  const toastId = toast.loading("Creating your account with Google...")
  try {
    const response = await apiconnector("POST", GOOGLE_LOGIN_API, googleData)
    
    console.log("GOOGLE SIGNUP API RESPONSE............", response)

    if (!response.data.success) {
      throw new Error(response.data.message)
    }

    toast.success("Registration Successful!")
    
    // Store token in localStorage
    localStorage.setItem("token", response.data.token)
    localStorage.setItem("user", JSON.stringify(response.data.user))
    
    // Update authStore
    useAuthStore.getState().setToken(response.data.token)
    useAuthStore.getState().setUser(response.data.user)
    
    // Navigate after state is updated
    setTimeout(() => navigate("/dashboard"), 100)
    return response.data
  } catch (error) {
    console.log("GOOGLE SIGNUP API ERROR............", error)
    toast.error(error?.response?.data?.message || "Google Sign-up Failed")
    throw error
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
    
    // Update authStore
    useAuthStore.getState().setToken(response.data.token)
    useAuthStore.getState().setUser(response.data.user)
    
    // Navigate after state is updated
    setTimeout(() => navigate("/dashboard"), 100)
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
    const response = await apiconnector("POST", SEND_OTP_API, { phone: phoneNumber })
    
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
    const response = await apiconnector("POST", VERIFY_OTP_API, { phone: phoneNumber, otp })
    
    console.log("VERIFY OTP API RESPONSE............", response)

    if (!response.data.success) {
      throw new Error(response.data.message)
    }

    toast.success("OTP verified successfully!")
    
    // Store token in localStorage
    localStorage.setItem("token", response.data.token)
    localStorage.setItem("user", JSON.stringify(response.data.user))
    
    // Update authStore
    useAuthStore.getState().setToken(response.data.token)
    useAuthStore.getState().setUser(response.data.user)
    
    // Navigate after state is updated
    setTimeout(() => navigate("/dashboard"), 100)
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
// Send Email OTP for Registration
export const sendEmailOTP = async (email, name) => {
  try {
    const response = await apiconnector("POST", SEND_EMAIL_OTP_API, { email, name })
    
    console.log("SEND EMAIL OTP API RESPONSE............", response)

    if (!response.data.success) {
      throw new Error(response.data.message)
    }

    return response.data
  } catch (error) {
    console.log("SEND EMAIL OTP API ERROR............", error)
    const errorMessage = error?.response?.data?.message || "Failed to send OTP"
    throw new Error(errorMessage)
  }
}

// Verify Email OTP
export const verifyEmailOTP = async (email, otp) => {
  try {
    const response = await apiconnector("POST", VERIFY_EMAIL_OTP_API, { email, otp })
    
    console.log("VERIFY EMAIL OTP API RESPONSE............", response)

    if (!response.data.success) {
      throw new Error(response.data.message)
    }

    return response.data
  } catch (error) {
    console.log("VERIFY EMAIL OTP API ERROR............", error)
    const errorMessage = error?.response?.data?.message || "OTP verification failed"
    throw new Error(errorMessage)
  }
}

// Complete Registration after OTP verification
export const completeRegistration = async (userData) => {
  const toastId = toast.loading("Creating your account...")
  try {
    const response = await apiconnector("POST", COMPLETE_REGISTRATION_API, userData)
    
    console.log("COMPLETE REGISTRATION API RESPONSE............", response)

    if (!response.data.success) {
      throw new Error(response.data.message)
    }

    toast.dismiss(toastId)
    return response.data
  } catch (error) {
    console.log("COMPLETE REGISTRATION API ERROR............", error)
    toast.dismiss(toastId)
    const errorMessage = error?.response?.data?.message || "Registration failed"
    throw new Error(errorMessage)
  }
}

// Resend Email OTP
export const resendEmailOTP = async (email, name) => {
  try {
    const response = await apiconnector("POST", RESEND_EMAIL_OTP_API, { email, name })
    
    console.log("RESEND EMAIL OTP API RESPONSE............", response)

    if (!response.data.success) {
      throw new Error(response.data.message)
    }

    return response.data
  } catch (error) {
    console.log("RESEND EMAIL OTP API ERROR............", error)
    const errorMessage = error?.response?.data?.message || "Failed to resend OTP"
    throw new Error(errorMessage)
  }
}

// Forgot Password
export const forgotPassword = async (email) => {
  const toastId = toast.loading("Sending password reset email...")
  try {
    const response = await apiconnector("POST", FORGOT_PASSWORD_API, { email })
    
    console.log("FORGOT PASSWORD API RESPONSE............", response)

    if (!response.data.success) {
      throw new Error(response.data.message)
    }

    toast.success("Password reset OTP sent to your email!")
    return response.data
  } catch (error) {
    console.log("FORGOT PASSWORD API ERROR............", error)
    const errorMessage = error?.response?.data?.message || "Failed to send reset email"
    toast.error(errorMessage)
    throw new Error(errorMessage)
  } finally {
    toast.dismiss(toastId)
  }
}

// Verify Reset OTP
export const verifyResetOTP = async (email, otp) => {
  try {
    const response = await apiconnector("POST", VERIFY_RESET_OTP_API, { email, otp })
    
    console.log("VERIFY RESET OTP API RESPONSE............", response)

    if (!response.data.success) {
      throw new Error(response.data.message)
    }

    toast.success("OTP verified successfully!")
    return response.data
  } catch (error) {
    console.log("VERIFY RESET OTP API ERROR............", error)
    const errorMessage = error?.response?.data?.message || "Invalid OTP"
    toast.error(errorMessage)
    throw new Error(errorMessage)
  }
}

// Reset Password
export const resetPassword = async (email, password, navigate) => {
  const toastId = toast.loading("Resetting password...")
  try {
    const response = await apiconnector("POST", RESET_PASSWORD_API, { email, password })
    
    console.log("RESET PASSWORD API RESPONSE............", response)

    if (!response.data.success) {
      throw new Error(response.data.message)
    }

    toast.success("Password reset successfully! Please login.")
    navigate("/login")
    return response.data
  } catch (error) {
    console.log("RESET PASSWORD API ERROR............", error)
    const errorMessage = error?.response?.data?.message || "Failed to reset password"
    toast.error(errorMessage)
    throw new Error(errorMessage)
  } finally {
    toast.dismiss(toastId)
  }
}

// Resend Reset OTP
export const resendResetOTP = async (email) => {
  try {
    const response = await apiconnector("POST", RESEND_RESET_OTP_API, { email })
    
    console.log("RESEND RESET OTP API RESPONSE............", response)

    if (!response.data.success) {
      throw new Error(response.data.message)
    }

    return response.data
  } catch (error) {
    console.log("RESEND RESET OTP API ERROR............", error)
    const errorMessage = error?.response?.data?.message || "Failed to resend OTP"
    throw new Error(errorMessage)
  }
}