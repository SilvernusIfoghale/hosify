"use client";

import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Building2, Eye, Hash, TrendingUp } from "lucide-react";
import {
  getLandlordProperties,
  calculateLandlordStats,
} from "@/app/api/landlord-client";
import { useAuthStore } from "@/app/store/authStore";

export function StatsCards() {
  const { user } = useAuthStore();
  const [stats, setStats] = useState({
    totalProperties: 0,
    activeProperties: 0,
    rentedProperties: 0,
    totalViews: 0,
    totalRevenue: 0,
    occupancyRate: 0,
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      if (!user?.id) return;

      try {
        setLoading(true);
        const response = await getLandlordProperties(user.id);
        if (response.success && response.properties) {
          const calculatedStats = calculateLandlordStats(response.properties);
          setStats(calculatedStats);
        }
      } catch (error) {
        console.error("Error fetching landlord statistics:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, [user?.id]);

  const statsData = [
    {
      title: "Total Properties",
      value: loading ? "..." : stats.totalProperties.toString(),
      change: `${stats.activeProperties} active`,
      icon: Building2,
      color: "text-chart-1",
    },
    {
      title: "Total Views",
      value: loading ? "..." : stats.totalViews.toLocaleString(),
      change: "Across all properties",
      icon: Eye,
      color: "text-chart-2",
    },
    {
      title: "Monthly Revenue",
      value: loading ? "..." : `₦${stats.totalRevenue.toLocaleString()}`,
      change: `${stats.rentedProperties} rented properties`,
      icon: Hash,
      color: "text-chart-3",
    },
    {
      title: "Occupancy Rate",
      value: loading ? "..." : `${stats.occupancyRate}%`,
      change: `${stats.rentedProperties}/${stats.totalProperties} occupied`,
      icon: TrendingUp,
      color: "text-chart-4",
    },
  ];

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
      {statsData.map((stat) => (
        <Card key={stat.title} className="bg-card border-border">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-card-foreground">
              {stat.title}
            </CardTitle>
            <stat.icon className={`h-4 w-4 ${stat.color}`} aria-hidden="true" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-card-foreground">
              {stat.value}
            </div>
            <p className="text-xs text-muted-foreground">{stat.change}</p>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
