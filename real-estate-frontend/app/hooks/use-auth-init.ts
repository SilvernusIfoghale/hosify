"use client"

import { useEffect } from "react"
import { useAuthStore } from "../store/authStore"


export function useAuthInit() {
  useEffect(() => {
    const initializeAuth = async () => {
      await useAuthStore.getState().initializeAuth()
    }

    // Only initialize if not already done
    if (!useAuthStore.getState().isInitialized) {
      initializeAuth()
    }
  }, [])
}
