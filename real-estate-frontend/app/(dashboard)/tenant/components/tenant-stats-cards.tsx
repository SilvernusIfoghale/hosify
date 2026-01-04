"use client";

import { useEffect, useState } from "react";
import { Card } from "@/components/ui/card";
import { Home, FileText, Star } from "lucide-react";
import {
  getTenantHistory,
  getTenantReviews,
  getTenantFavorites,
  calculateTenantStats,
  type TenantStats,
  type Property,
} from "@/app/api/tenant-client";
import { useAuthStore } from "@/app/store/authStore";

export function TenantStatsCards() {
  const { user } = useAuthStore();
  const [stats, setStats] = useState<TenantStats>({
    totalRentals: 0,
    activeRentals: 0,
    completedRentals: 0,
    averageRating: 0,
    totalReviews: 0,
    savedProperties: 0,
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      if (!user?.id) return;

      try {
        setLoading(true);
        // Fetch history and reviews (favorites is optional)
        const [historyResponse, reviewsResponse] = await Promise.all([
          getTenantHistory(),
          getTenantReviews(user.id),
        ]);

        // Try to get favorites, but don't fail if it errors
        let favoritesResponse: {
          success: boolean;
          count: number;
          favourites: Property[];
        } = { success: true, count: 0, favourites: [] };
        try {
          const fav = await getTenantFavorites();
          favoritesResponse = fav || {
            success: true,
            count: 0,
            favourites: [],
          };
        } catch (favError) {
          console.warn("Could not fetch favorites:", favError);
        }

        if (historyResponse.success && reviewsResponse) {
          const calculatedStats = calculateTenantStats(
            historyResponse.history || [],
            reviewsResponse || [],
            favoritesResponse.favourites || []
          );
          setStats(calculatedStats);
        }
      } catch (error) {
        console.error("Error fetching tenant statistics:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, [user?.id]);

  const statsData = [
    {
      name: "Active Rentals",
      value: loading ? "..." : stats.activeRentals.toString(),
      subtext: `${stats.totalRentals} total rentals`,
      icon: Home,
      color: "text-green-600",
    },
    {
      name: "Saved Properties",
      value: loading ? "..." : stats.savedProperties.toString(),
      subtext: "In your favorites",
      icon: FileText,
      color: "text-blue-600",
    },
    {
      name: "Your Rating",
      value: loading ? "..." : stats.averageRating.toFixed(1),
      subtext: `Based on ${stats.totalReviews} reviews`,
      icon: Star,
      color: "text-yellow-600",
    },
  ];

  return (
    <div className="grid gap-3 sm:gap-4 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
      {statsData.map((stat) => (
        <Card
          key={stat.name}
          className="p-4 sm:p-6 bg-card border-border hover:border-muted transition-colors"
        >
          <div className="flex items-start justify-between gap-3">
            <div className="flex-1 min-w-0">
              <p className="text-xs sm:text-sm text-muted-foreground">
                {stat.name}
              </p>
              <p className="text-xl sm:text-2xl font-semibold text-foreground mt-1 sm:mt-2 truncate">
                {stat.value}
              </p>
              <p className="text-xs text-muted-foreground mt-1 line-clamp-2">
                {stat.subtext}
              </p>
            </div>
            <div
              className={`p-2 rounded-lg bg-secondary ${stat.color} flex-shrink-0`}
            >
              <stat.icon className="h-4 w-4 sm:h-5 sm:w-5" />
            </div>
          </div>
        </Card>
      ))}
    </div>
  );
}
