"use client";

import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  Star,
  MessageSquare,
  TrendingUp,
  Users,
  MoreHorizontal,
} from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { getLandlordReviews, type Review } from "@/app/api/landlord-client";
import { useAuthStore } from "@/app/store/authStore";

const ReviewPage = () => {
  const { user } = useAuthStore();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Calculate stats from reviews
  const [reviewsData, setReviewsData] = useState({
    averageRating: 0,
    totalReviews: 0,
    ratingDistribution: {
      5: 0,
      4: 0,
      3: 0,
      2: 0,
      1: 0,
    },
    recentReviews: [] as Review[],
  });

  useEffect(() => {
    const fetchReviews = async () => {
      const userId = user?.id;
      if (!userId) return;

      try {
        setLoading(true);
        const reviewsResponse = await getLandlordReviews(userId);

        // Calculate statistics
        const totalReviews = reviewsResponse.length;
        const ratingDistribution = { 5: 0, 4: 0, 3: 0, 2: 0, 1: 0 };
        let totalRating = 0;

        reviewsResponse.forEach((review) => {
          totalRating += review.rating;
          ratingDistribution[
            review.rating as keyof typeof ratingDistribution
          ]++;
        });

        const averageRating = totalReviews > 0 ? totalRating / totalReviews : 0;

        setReviewsData({
          averageRating: Math.round(averageRating * 10) / 10,
          totalReviews,
          ratingDistribution,
          recentReviews: reviewsResponse.slice(0, 10), // Show last 10 reviews
        });
      } catch (err: unknown) {
        console.error("Error fetching reviews:", err);
        const error = err as { response?: { data?: { message?: string } } };
        setError(error.response?.data?.message || "Failed to load reviews");
      } finally {
        setLoading(false);
      }
    };

    fetchReviews();
  }, [user?.id]);

  if (loading) {
    return (
      <div className="text-center py-8">
        <p className="text-muted-foreground">Loading reviews...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-8">
        <p className="text-destructive">{error}</p>
      </div>
    );
  }

  const renderStars = (rating: number) => {
    return Array.from({ length: 5 }, (_, i) => (
      <Star
        key={i}
        className={`h-4 w-4 ${
          i < rating ? "fill-warning text-warning" : "text-muted-foreground"
        }`}
      />
    ));
  };

  const getRatingColor = (rating: number) => {
    if (rating >= 4.5) return "text-success";
    if (rating >= 3.5) return "text-warning";
    return "text-destructive";
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });
  };

  const getInitials = (username: string) => {
    return username
      .split("_")
      .map((part) => part[0])
      .join("")
      .toUpperCase()
      .slice(0, 2);
  };

  const calculatePercentage = (count: number) => {
    if (reviewsData.totalReviews === 0) return 0;
    return Math.round((count / reviewsData.totalReviews) * 100);
  };

  return (
    <div className="space-y-6">
      {/* Reviews Overview */}
      <Card className="bg-card border-border">
        <CardHeader>
          <CardTitle className="text-lg font-semibold text-card-foreground">
            Reviews Overview
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {/* Average Rating */}
            <div className="flex items-center gap-4">
              <div className="text-center">
                <div
                  className={`text-3xl font-bold ${getRatingColor(
                    reviewsData.averageRating
                  )}`}
                >
                  {reviewsData.averageRating}
                </div>
                <div className="flex items-center justify-center gap-1 mt-1">
                  {renderStars(Math.round(reviewsData.averageRating))}
                </div>
              </div>
              <div className="flex-1">
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <Users className="h-4 w-4" />
                  <span>{reviewsData.totalReviews} total reviews</span>
                </div>
                <div className="flex items-center gap-2 text-sm text-success mt-1">
                  <TrendingUp className="h-4 w-4" />
                  <span>+3 this month</span>
                </div>
              </div>
            </div>

            {/* Rating Distribution */}
            <div className="space-y-2">
              {[5, 4, 3, 2, 1].map((stars) => (
                <div key={stars} className="flex items-center gap-2 text-sm">
                  <span className="w-8 text-muted-foreground">{stars}★</span>
                  <div className="flex-1 bg-muted rounded-full h-2">
                    <div
                      className="bg-warning rounded-full h-2 transition-all"
                      style={{
                        width: `${calculatePercentage(
                          reviewsData.ratingDistribution[
                            stars as keyof typeof reviewsData.ratingDistribution
                          ]
                        )}%`,
                      }}
                    />
                  </div>
                  <span className="w-12 text-right text-muted-foreground">
                    {
                      reviewsData.ratingDistribution[
                        stars as keyof typeof reviewsData.ratingDistribution
                      ]
                    }
                  </span>
                </div>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Recent Reviews */}
      <Card className="bg-card border-border">
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="text-lg font-semibold text-card-foreground">
              Recent Reviews
            </CardTitle>
            <Button variant="outline" size="sm">
              View All Reviews
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {reviewsData.recentReviews.map((review) => (
              <div
                key={review._id}
                className="border border-border rounded-lg p-4 bg-accent/5 hover:bg-accent/10 transition-colors"
              >
                <div className="flex items-start justify-between gap-4">
                  <div className="flex items-start gap-3 flex-1">
                    <Avatar className="h-10 w-10">
                      <AvatarImage
                        src="/placeholder.svg"
                        alt={review.reviewer?.username || "Reviewer"}
                      />
                      <AvatarFallback className="text-sm">
                        {getInitials(review.reviewer?.username || "User")}
                      </AvatarFallback>
                    </Avatar>

                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-2">
                        <span className="font-medium text-card-foreground">
                          {review.reviewer?.username || "Anonymous"}
                        </span>
                        <div className="flex items-center gap-1">
                          {renderStars(review.rating || 0)}
                        </div>
                        <span className="text-xs text-muted-foreground">
                          {formatDate(review.createdAt || "")}
                        </span>
                      </div>

                      <p className="text-sm text-card-foreground mb-2 text-pretty">
                        {review.comment || "No comment provided"}
                      </p>

                      <div className="flex items-center gap-2">
                        <Badge variant="outline" className="text-xs">
                          {review.rating || 0}{" "}
                          {(review.rating || 0) === 1 ? "Star" : "Stars"}
                        </Badge>
                      </div>
                    </div>
                  </div>

                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="icon" className="h-8 w-8">
                        <MoreHorizontal className="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem>
                        <MessageSquare className="h-4 w-4 mr-2" />
                        Reply to Review
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
              </div>
            ))}

            {reviewsData.recentReviews.length === 0 && (
              <div className="text-center py-8">
                <p className="text-muted-foreground">No reviews yet</p>
              </div>
            )}
          </div>

          {reviewsData.recentReviews.length > 0 && (
            <div className="mt-6 text-center">
              <Button variant="outline" className="w-full bg-transparent">
                Load More Reviews
              </Button>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default ReviewPage;
