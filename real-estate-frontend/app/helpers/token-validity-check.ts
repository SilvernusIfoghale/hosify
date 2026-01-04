/* eslint-disable @typescript-eslint/no-explicit-any */
import { jwtDecode } from "jwt-decode";
import LocalStorageService from "../services/storage.service";
// import LocalStorageService from "@/services/storage.service";

const TOKEN_KEY = "token";

/**
 * Checks if the token has expired.
 * @returns {boolean} - Returns true if the token is valid, false if expired.
 */
const checkTokenExpiry = (): boolean => {
  const token = LocalStorageService.getItem<string>(TOKEN_KEY);

  // If no token is found in localStorage, return false (token is missing)
  if (!token) return false;

  try {
    // Decode the JWT token
    const decoded: any = jwtDecode(token);

    // Check if the token has an 'exp' field (expiration time)
    const currentTime = Math.floor(Date.now() / 1000); // Current time in seconds
    if (decoded.exp < currentTime) {
      // Token has expired
      LocalStorageService.removeItem(TOKEN_KEY);
      LocalStorageService.removeItem("user"); // You can also remove the user data if needed
      console.log("Token has expired, removed from storage");
      return false; // Token is expired
    }

    // Token is still valid
    return true;
  } catch (error) {
    // In case of decoding error or invalid token format
    console.error("Error decoding token:", error);
    LocalStorageService.removeItem(TOKEN_KEY);
    LocalStorageService.removeItem("user");
    return false;
  }
};

export default checkTokenExpiry;
