import React, { createContext, useState, useContext, useEffect } from "react";
import axios from "../api/axios";
import toast from "react-hot-toast";

const AuthContext = createContext();

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const initAuth = async () => {
      const storedToken = localStorage.getItem("accessToken");
      const storedUser = localStorage.getItem("user");

      if (storedToken && storedUser) {
        try {
          const parsedUser = JSON.parse(storedUser);
          // Fix profile picture URL if needed
          if (
            parsedUser.profile_picture &&
            !parsedUser.profile_picture.startsWith("http")
          ) {
            parsedUser.profile_picture = `http://127.0.0.1:8000${parsedUser.profile_picture}`;
          }
          setUser(parsedUser);
          axios.defaults.headers.common["Authorization"] =
            `Bearer ${storedToken}`;
        } catch (e) {
          console.error("Error parsing user:", e);
          localStorage.removeItem("user");
          localStorage.removeItem("accessToken");
          localStorage.removeItem("refreshToken");
        }
      }
      setLoading(false);
    };

    initAuth();
  }, []);

  const login = async (username, password) => {
    try {
      const response = await axios.post("/users/login/", {
        username,
        password,
      });
      const { access, refresh, user: userData } = response.data;

      // Fix profile picture URL
      if (
        userData.profile_picture &&
        !userData.profile_picture.startsWith("http")
      ) {
        userData.profile_picture = `http://127.0.0.1:8000${userData.profile_picture}`;
      }

      localStorage.setItem("accessToken", access);
      localStorage.setItem("refreshToken", refresh);
      localStorage.setItem("user", JSON.stringify(userData));

      setUser(userData);
      axios.defaults.headers.common["Authorization"] = `Bearer ${access}`;

      toast.success(`Welcome back, ${userData.username}!`);
      return { success: true, user: userData };
    } catch (error) {
      const message = error.response?.data?.error || "Login failed";
      toast.error(message);
      return { success: false, error: message };
    }
  };

  // In register function, ensure role is not passed
  const register = async (userData) => {
    try {
      // Remove role if present (always traveller)
      const { role, ...travellerData } = userData;
      await axios.post(API_ENDPOINTS.REGISTER, travellerData);
      toast.success("Registration successful! Please login.");
      return { success: true };
    } catch (error) {
      const message = error.response?.data?.error || "Registration failed";
      toast.error(message);
      return { success: false, error: message };
    }
  };

  const logout = async () => {
    try {
      const refreshToken = localStorage.getItem("refreshToken");
      if (refreshToken) {
        await axios.post("/users/logout/", { refresh_token: refreshToken });
      }
    } catch (error) {
      console.error("Logout error:", error);
    } finally {
      localStorage.removeItem("accessToken");
      localStorage.removeItem("refreshToken");
      localStorage.removeItem("user");
      delete axios.defaults.headers.common["Authorization"];
      setUser(null);
      toast.success("Logged out successfully");
      window.location.href = "/";
    }
  };

  const updateUser = (updatedUser) => {
    // Fix profile picture URL
    if (
      updatedUser.profile_picture &&
      !updatedUser.profile_picture.startsWith("http")
    ) {
      updatedUser.profile_picture = `http://127.0.0.1:8000${updatedUser.profile_picture}`;
    }
    setUser(updatedUser);
    localStorage.setItem("user", JSON.stringify(updatedUser));
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        login,
        register,
        logout,
        updateUser,
        isAuthenticated: !!user,
        isAdmin: user?.role === "admin",
        isGuide: user?.role === "guide",
        isTraveller: user?.role === "traveller",
        isGuideVerified: user?.role === "guide" && user?.is_verified,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};
