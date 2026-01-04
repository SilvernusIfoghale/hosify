"use client";

import { useEffect, useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Star, ThumbsUp, MessageSquare } from "lucide-react";
import { getTenantReviews, type Review } from "@/app/api/tenant-client";
import { useAuthStore } from "@/app/store/authStore";

export function TenantReviews() {
  const { user } = useAuthStore();
  const [reviews, setReviews] = useState<Review[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchReviews = async () => {
      if (!user?.id) return;

      try {
        setLoading(true);
        const response = await getTenantReviews(user.id);
        if (response && Array.isArray(response)) {
          setReviews(response);
        }
      } catch (error) {
        console.error("Error fetching tenant reviews:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchReviews();
  }, [user?.id]);

  const averageRating =
    reviews.length > 0
      ? (
          reviews.reduce((sum, review) => sum + review.rating, 0) /
          reviews.length
        ).toFixed(1)
      : "0";

  const recommendationRate =
    reviews.length > 0
      ? Math.round(
          (reviews.filter((r) => r.rating >= 4).length / reviews.length) * 100
        )
      : 0;

  if (loading) {
    return (
      <div className="space-y-4">
        <h2 className="text-2xl font-semibold text-foreground">Reviews</h2>
        <p className="text-center text-muted-foreground py-8">
          Loading reviews...
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Reviews About Me */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-semibold text-foreground">
              Reviews About You
            </h2>
            <p className="text-sm text-muted-foreground mt-1">
              What landlords say about you
            </p>
          </div>
        </div>

        <div className="grid gap-4 md:grid-cols-3 mb-6">
          <Card className="p-5 bg-card border-border">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-yellow-500/10">
                <Star className="h-5 w-5 text-yellow-600 fill-yellow-600" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Average Rating</p>
                <p className="text-2xl font-semibold text-foreground">
                  {averageRating}
                </p>
              </div>
            </div>
          </Card>

          <Card className="p-5 bg-card border-border">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-blue-500/10">
                <MessageSquare className="h-5 w-5 text-blue-600" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Total Reviews</p>
                <p className="text-2xl font-semibold text-foreground">
                  {reviews.length}
                </p>
              </div>
            </div>
          </Card>

          <Card className="p-5 bg-card border-border">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-green-500/10">
                <ThumbsUp className="h-5 w-5 text-green-600" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">
                  Recommendation Rate
                </p>
                <p className="text-2xl font-semibold text-foreground">
                  {recommendationRate}%
                </p>
              </div>
            </div>
          </Card>
        </div>

        {reviews.length === 0 ? (
          <Card className="p-5 bg-card border-border">
            <p className="text-center text-muted-foreground py-8">
              No reviews yet. Complete a rental to receive reviews from
              landlords.
            </p>
          </Card>
        ) : (
          <div className="space-y-4">
            {reviews.map((review) => (
              <Card
                key={review._id}
                className="p-6 bg-card border-border hover:border-muted transition-colors"
              >
                <div className="flex items-start gap-4">
                  <Avatar className="h-12 w-12">
                    <AvatarFallback>
                      {(review.reviewer?.username || "User")[0]}
                    </AvatarFallback>
                  </Avatar>

                  <div className="flex-1 space-y-3">
                    <div className="flex items-start justify-between">
                      <div>
                        <h3 className="text-base font-semibold text-foreground">
                          {review.reviewer?.username || "Anonymous"}
                        </h3>
                        <p className="text-sm text-muted-foreground">
                          Landlord Review
                        </p>
                      </div>
                      <div className="flex items-center gap-1">
                        {Array.from({ length: 5 }).map((_, i) => (
                          <Star
                            key={i}
                            className={`h-4 w-4 ${
                              i < review.rating
                                ? "text-yellow-600 fill-yellow-600"
                                : "text-muted-foreground"
                            }`}
                          />
                        ))}
                      </div>
                    </div>

                    <p className="text-sm text-foreground leading-relaxed">
                      {review.comment}
                    </p>

                    <div className="flex items-center gap-4 text-sm text-muted-foreground">
                      <span>
                        {new Date(review.createdAt).toLocaleDateString(
                          "en-US",
                          {
                            year: "numeric",
                            month: "short",
                            day: "numeric",
                          }
                        )}
                      </span>
                    </div>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        )}
      </div>

      {/* Add Review Section */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-semibold text-foreground">
              Write a Review
            </h2>
            <p className="text-sm text-muted-foreground mt-1">
              Share your experience with landlords
            </p>
          </div>
        </div>

        <Card className="p-6 bg-card border-border">
          <div className="space-y-4">
            <p className="text-sm text-muted-foreground">
              After completing a rental, you&apos;ll be able to write reviews
              for landlords to help other tenants make informed decisions.
            </p>
            <Button disabled={reviews.length === 0} className="w-full">
              Write a Review
            </Button>
          </div>
        </Card>
      </div>
    </div>
  );
}
