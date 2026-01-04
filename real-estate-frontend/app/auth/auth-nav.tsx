"use client";

import { Button } from "@/components/ui/button";
import { AuthModals } from "./auth-modals";
import { useAuthModals } from "@/app/hooks/use-auth-modals";
import { useAuthStore } from "@/app/store/authStore";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
} from "@/components/ui/dropdown-menu";

import { useRouter } from "next/navigation";

const dashboardRoutes: Record<string, string> = {
  admin: "/admin",
  landlord: "/landlord",
  tenant: "/tenant",
};

export default function AuthNav() {
  const { openLogin, openSignup } = useAuthModals();
  const { user, logout, loading } = useAuthStore();
  const router = useRouter();

  const getRoleDisplay = (role: string): string => {
    const roleLetters: Record<string, string> = {
      Admin: "A",
      Landlord: "L",
      Tenant: "T",
    };
    return roleLetters[role] || role.charAt(0).toUpperCase();
  };

  const handleDashboardClick = () => {
    if (user?.role) {
      const destination = dashboardRoutes[user.role];

      if (destination) {
        router.push(destination);
      } else {
        console.error("No defined route for user role:", user.role);
        router.push("/"); // Redirect to a safe default page
      }
    }
  };

  const handleLogout = () => {
    logout();
    router.push("/"); // Redirect to a safe default page
  };

  return (
    <>
      <div className="flex gap-2 z-50">
        {!user?.role ? (
          <>
            <Button
              size="sm"
              onClick={openLogin}
              className="w-fit bg-green-600 hover:bg-green-700 text-white cursor-pointer"
            >
              Login
            </Button>

            <Button
              size="sm"
              onClick={openSignup}
              variant="outline"
              className="w-fit border-2 cursor-pointer bg-transparent"
            >
              Signup
            </Button>
          </>
        ) : (
          <>
            {user?.role && (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <div
                    className={`w-10 h-10 rounded-full  bg-green-600 text-white flex items-center justify-center cursor-pointer font-semibold transition-colors`}
                    title={`${user.role}`}
                  >
                    {getRoleDisplay(user.role)}
                  </div>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuItem onClick={handleDashboardClick}>
                    Dashboard
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={handleLogout}>
                    Logout
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            )}
          </>
        )}
      </div>
      <AuthModals />
    </>
  );
}
