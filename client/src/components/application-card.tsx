import { useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Textarea } from "@/components/ui/textarea";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";
import type { Application } from "@shared/schema";

interface ApplicationCardProps {
  application: Application;
}

export default function ApplicationCard({ application }: ApplicationCardProps) {
  const [rejectionReason, setRejectionReason] = useState("");
  const [isRejectDialogOpen, setIsRejectDialogOpen] = useState(false);
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const updateMutation = useMutation({
    mutationFn: async ({ status, reviewReason }: { status: string; reviewReason?: string }) => {
      return apiRequest("PATCH", `/api/applications/${application.id}`, {
        status,
        reviewedBy: "Admin User", // In a real app, this would come from auth
        reviewReason,
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/applications"] });
      toast({
        title: "Application Updated",
        description: "The application has been successfully reviewed.",
      });
      setIsRejectDialogOpen(false);
      setRejectionReason("");
    },
    onError: () => {
      toast({
        title: "Error",
        description: "Failed to update application. Please try again.",
        variant: "destructive",
      });
    },
  });

  const handleApprove = () => {
    updateMutation.mutate({ status: "approved" });
  };

  const handleReject = () => {
    if (!rejectionReason.trim()) {
      toast({
        title: "Rejection Reason Required",
        description: "Please provide a reason for rejection.",
        variant: "destructive",
      });
      return;
    }
    updateMutation.mutate({ status: "rejected", reviewReason: rejectionReason });
  };

  const getStatusBadge = () => {
    switch (application.status) {
      case "approved":
        return <Badge className="bg-green-600">✅ Approved</Badge>;
      case "rejected":
        return <Badge variant="destructive">❌ Rejected</Badge>;
      default:
        return <Badge variant="secondary">⏳ Pending</Badge>;
    }
  };

  return (
    <Card className="message-card fade-in" data-testid={`application-card-${application.id}`}>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-primary rounded-full flex items-center justify-center text-white font-bold">
              {application.characterName.charAt(0)}
            </div>
            <div>
              <h3 className="text-lg font-semibold text-foreground" data-testid={`text-character-name-${application.id}`}>
                {application.characterName}
              </h3>
              <p className="text-sm text-muted-foreground" data-testid={`text-username-${application.id}`}>
                {application.username}
              </p>
            </div>
          </div>
          <div className="flex items-center space-x-2">
            {getStatusBadge()}
            <span className="text-xs text-muted-foreground">
              {new Date(application.createdAt).toLocaleString()}
            </span>
          </div>
        </div>
      </CardHeader>

      <CardContent className="space-y-4">
        {/* Application Details Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
          <div>
            <span className="text-muted-foreground">Discord ID:</span>
            <code className="ml-2 bg-muted px-1 rounded text-foreground" data-testid={`text-discord-id-${application.id}`}>
              {application.discordId}
            </code>
          </div>
          <div>
            <span className="text-muted-foreground">Steam ID:</span>
            <code className="ml-2 bg-muted px-1 rounded text-foreground" data-testid={`text-steam-id-${application.id}`}>
              {application.steamId}
            </code>
          </div>
          <div>
            <span className="text-muted-foreground">Character Age:</span>
            <span className="ml-2 text-foreground" data-testid={`text-character-age-${application.id}`}>
              {application.characterAge}
            </span>
          </div>
          <div>
            <span className="text-muted-foreground">Nationality:</span>
            <span className="ml-2 text-foreground" data-testid={`text-character-nationality-${application.id}`}>
              {application.characterNationality}
            </span>
          </div>
        </div>

        {/* About Section */}
        <div>
          <h4 className="font-medium text-foreground mb-2">About Applicant:</h4>
          <p className="text-sm text-muted-foreground bg-muted/30 p-3 rounded" data-testid={`text-about-${application.id}`}>
            {application.aboutYourself}
          </p>
        </div>

        {/* RP Experience */}
        <div>
          <h4 className="font-medium text-foreground mb-2">RP Experience:</h4>
          <p className="text-sm text-muted-foreground bg-muted/30 p-3 rounded" data-testid={`text-rp-experience-${application.id}`}>
            {application.rpExperience}
          </p>
        </div>

        {/* Character Backstory */}
        <div>
          <h4 className="font-medium text-foreground mb-2">Character Backstory:</h4>
          <p className="text-sm text-muted-foreground bg-muted/30 p-3 rounded" data-testid={`text-character-backstory-${application.id}`}>
            {application.characterBackstory}
          </p>
        </div>

        {/* Additional Info */}
        {(application.contentCreation || application.previousServers) && (
          <div className="space-y-2">
            {application.contentCreation && (
              <div>
                <span className="text-muted-foreground text-sm">Content Creation:</span>
                <p className="text-sm text-foreground" data-testid={`text-content-creation-${application.id}`}>
                  {application.contentCreation}
                </p>
              </div>
            )}
            {application.previousServers && (
              <div>
                <span className="text-muted-foreground text-sm">Previous Servers:</span>
                <p className="text-sm text-foreground" data-testid={`text-previous-servers-${application.id}`}>
                  {application.previousServers}
                </p>
              </div>
            )}
          </div>
        )}

        {/* Requirements Check */}
        <div className="flex space-x-4 text-sm">
          <div className="flex items-center space-x-2">
            <span className={application.rulesRead ? "text-green-400" : "text-red-400"}>
              {application.rulesRead ? "✓" : "✗"}
            </span>
            <span className="text-muted-foreground">Rules Read</span>
          </div>
          <div className="flex items-center space-x-2">
            <span className={application.cfxLinked ? "text-green-400" : "text-red-400"}>
              {application.cfxLinked ? "✓" : "✗"}
            </span>
            <span className="text-muted-foreground">CFX Linked</span>
          </div>
        </div>

        {/* Review Information */}
        {application.status !== "pending" && (
          <div className="mt-4 p-3 bg-muted/30 rounded">
            <div className="text-sm space-y-1">
              <div>
                <span className="text-muted-foreground">Reviewed by:</span>
                <span className="ml-2 text-foreground" data-testid={`text-reviewed-by-${application.id}`}>
                  {application.reviewedBy}
                </span>
              </div>
              {application.reviewedAt && (
                <div>
                  <span className="text-muted-foreground">Review date:</span>
                  <span className="ml-2 text-foreground">
                    {new Date(application.reviewedAt).toLocaleString()}
                  </span>
                </div>
              )}
              {application.reviewReason && (
                <div>
                  <span className="text-muted-foreground">Reason:</span>
                  <p className="mt-1 text-sm text-foreground" data-testid={`text-review-reason-${application.id}`}>
                    {application.reviewReason}
                  </p>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Admin Actions */}
        {application.status === "pending" && (
          <div className="flex space-x-3 pt-4 border-t border-border">
            <Button
              onClick={handleApprove}
              disabled={updateMutation.isPending}
              className="bg-green-600 hover:bg-green-700 text-white"
              data-testid={`button-approve-${application.id}`}
            >
              ✅ Approve
            </Button>
            
            <Dialog open={isRejectDialogOpen} onOpenChange={setIsRejectDialogOpen}>
              <DialogTrigger asChild>
                <Button
                  variant="destructive"
                  disabled={updateMutation.isPending}
                  data-testid={`button-reject-${application.id}`}
                >
                  ❌ Reject
                </Button>
              </DialogTrigger>
              <DialogContent className="discord-message">
                <DialogHeader>
                  <DialogTitle>Reject Application</DialogTitle>
                </DialogHeader>
                <div className="space-y-4">
                  <p className="text-sm text-muted-foreground">
                    Please provide a reason for rejecting this application. This will be sent to the applicant.
                  </p>
                  <Textarea
                    placeholder="Enter rejection reason..."
                    value={rejectionReason}
                    onChange={(e) => setRejectionReason(e.target.value)}
                    className="min-h-[100px]"
                    data-testid={`textarea-rejection-reason-${application.id}`}
                  />
                  <div className="flex justify-end space-x-2">
                    <Button
                      variant="outline"
                      onClick={() => setIsRejectDialogOpen(false)}
                      data-testid={`button-cancel-reject-${application.id}`}
                    >
                      Cancel
                    </Button>
                    <Button
                      variant="destructive"
                      onClick={handleReject}
                      disabled={updateMutation.isPending || !rejectionReason.trim()}
                      data-testid={`button-confirm-reject-${application.id}`}
                    >
                      Reject Application
                    </Button>
                  </div>
                </div>
              </DialogContent>
            </Dialog>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
