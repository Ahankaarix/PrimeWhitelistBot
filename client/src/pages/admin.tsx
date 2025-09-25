import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { useAuth } from "@/components/auth-provider";
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";
import { 
  Users, 
  Shield, 
  Clock, 
  CheckCircle, 
  XCircle, 
  ArrowLeft,
  Eye,
  UserCheck,
  UserX,
  Activity,
  AlertTriangle,
  Crown,
  Settings
} from "lucide-react";
import type { Application } from "@shared/schema";
import { Link } from "wouter";
import { useState } from "react";

export default function AdminPanel() {
  const { user, isAuthenticated, isAdmin } = useAuth();
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [selectedApplication, setSelectedApplication] = useState<Application | null>(null);
  const [reviewReason, setReviewReason] = useState("");

  const { data: applications = [], isLoading } = useQuery<Application[]>({
    queryKey: ["/api/applications"],
    enabled: isAuthenticated && isAdmin,
  });

  const reviewMutation = useMutation({
    mutationFn: async ({ id, status, reason }: { id: string, status: 'approved' | 'rejected', reason?: string }) => {
      return apiRequest("PATCH", `/api/applications/${id}`, {
        status,
        reviewedBy: user?.displayName || user?.username,
        reviewReason: reason,
      });
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ["/api/applications"] });
      toast({
        title: `Application ${variables.status}`,
        description: `The application has been ${variables.status} successfully.`,
      });
      setSelectedApplication(null);
      setReviewReason("");
    },
    onError: () => {
      toast({
        title: "Review Failed",
        description: "There was an error processing the review. Please try again.",
        variant: "destructive",
      });
    },
  });

  // Redirect if not authenticated or not admin
  if (!isAuthenticated || !isAdmin) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-indigo-900 p-6">
        <div className="max-w-4xl mx-auto">
          <div className="mb-6">
            <Link href="/">
              <Button variant="outline" className="text-white border-white/20 hover:bg-white/10">
                <ArrowLeft className="h-4 w-4 mr-2" />
                Back to Home
              </Button>
            </Link>
          </div>
          <Card className="bg-white/5 backdrop-blur-sm border-white/10">
            <CardContent className="pt-6">
              <div className="text-center space-y-4">
                <Shield className="text-6xl text-red-400 mx-auto" />
                <h2 className="text-2xl font-bold text-white">Access Denied</h2>
                <p className="text-blue-100">
                  You need administrator privileges to access this panel.
                </p>
                <Button onClick={() => window.location.href = '/'} className="bg-blue-600 hover:bg-blue-700 text-white">
                  Return Home
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-indigo-900 p-6">
        <div className="max-w-7xl mx-auto">
          <div className="text-center py-20">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-white mx-auto"></div>
            <p className="text-blue-100 mt-4">Loading admin panel...</p>
          </div>
        </div>
      </div>
    );
  }

  const pendingApplications = applications.filter(app => app.status === "pending");
  const approvedApplications = applications.filter(app => app.status === "approved");
  const rejectedApplications = applications.filter(app => app.status === "rejected");

  const handleApprove = (application: Application) => {
    reviewMutation.mutate({
      id: application.id,
      status: 'approved'
    });
  };

  const handleReject = (application: Application, reason: string) => {
    if (!reason.trim()) {
      toast({
        title: "Reason Required",
        description: "Please provide a reason for rejection.",
        variant: "destructive",
      });
      return;
    }
    
    reviewMutation.mutate({
      id: application.id,
      status: 'rejected',
      reason: reason.trim()
    });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-indigo-900">
      {/* Admin Header */}
      <nav className="border-b border-white/10 backdrop-blur-sm bg-black/20 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <div className="w-12 h-12 bg-gradient-to-r from-red-500 to-orange-600 rounded-full flex items-center justify-center text-white font-bold text-xl shadow-lg">
                <Crown className="h-6 w-6" />
              </div>
              <div>
                <h1 className="text-xl font-bold text-white">Prime City RP - Admin Panel</h1>
                <p className="text-orange-200 text-sm">Administrative Dashboard</p>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-2">
                <img 
                  src={user?.avatar ? `https://cdn.discordapp.com/avatars/${user.id}/${user.avatar}.png` : '/default-avatar.png'} 
                  alt="Profile" 
                  className="w-8 h-8 rounded-full"
                />
                <span className="text-white font-medium">{user?.displayName || user?.username}</span>
                <Badge className="bg-red-600 text-white">Admin</Badge>
              </div>
              <Link href="/">
                <Button variant="outline" className="text-white border-white/20 hover:bg-white/10">
                  <ArrowLeft className="h-4 w-4 mr-2" />
                  Exit Admin
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </nav>

      <div className="max-w-7xl mx-auto p-6">
        {/* Admin Stats */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <Card className="bg-white/5 backdrop-blur-sm border-white/10 border-l-4 border-l-yellow-500">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-white">Pending Review</CardTitle>
              <Clock className="h-4 w-4 text-yellow-400" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-white">{pendingApplications.length}</div>
              <p className="text-xs text-yellow-200">Requires attention</p>
            </CardContent>
          </Card>

          <Card className="bg-white/5 backdrop-blur-sm border-white/10 border-l-4 border-l-green-500">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-white">Approved</CardTitle>
              <CheckCircle className="h-4 w-4 text-green-400" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-white">{approvedApplications.length}</div>
              <p className="text-xs text-green-200">Successful applications</p>
            </CardContent>
          </Card>

          <Card className="bg-white/5 backdrop-blur-sm border-white/10 border-l-4 border-l-red-500">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-white">Rejected</CardTitle>
              <XCircle className="h-4 w-4 text-red-400" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-white">{rejectedApplications.length}</div>
              <p className="text-xs text-red-200">Declined applications</p>
            </CardContent>
          </Card>

          <Card className="bg-white/5 backdrop-blur-sm border-white/10 border-l-4 border-l-blue-500">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-white">Total Applications</CardTitle>
              <Users className="h-4 w-4 text-blue-400" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-white">{applications.length}</div>
              <p className="text-xs text-blue-200">All time submissions</p>
            </CardContent>
          </Card>
        </div>

        <Tabs defaultValue="pending" className="w-full">
          <TabsList className="grid w-full grid-cols-3 bg-white/5 border-white/10">
            <TabsTrigger value="pending" className="data-[state=active]:bg-yellow-600 data-[state=active]:text-white">
              ⏳ Pending ({pendingApplications.length})
            </TabsTrigger>
            <TabsTrigger value="approved" className="data-[state=active]:bg-green-600 data-[state=active]:text-white">
              ✅ Approved ({approvedApplications.length})
            </TabsTrigger>
            <TabsTrigger value="rejected" className="data-[state=active]:bg-red-600 data-[state=active]:text-white">
              ❌ Rejected ({rejectedApplications.length})
            </TabsTrigger>
          </TabsList>

          <TabsContent value="pending" className="mt-6">
            <Card className="bg-white/5 backdrop-blur-sm border-white/10">
              <CardHeader>
                <CardTitle className="text-yellow-400 flex items-center space-x-2">
                  <AlertTriangle className="h-6 w-6" />
                  <span>Applications Requiring Review</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                {pendingApplications.length === 0 ? (
                  <div className="text-center py-8">
                    <CheckCircle className="h-16 w-16 text-green-400 mx-auto mb-4" />
                    <p className="text-white text-lg font-semibold">All caught up!</p>
                    <p className="text-blue-100">No pending applications to review.</p>
                  </div>
                ) : (
                  <div className="space-y-6">
                    {pendingApplications.map((application) => (
                      <div
                        key={application.id}
                        className="bg-white/5 border border-white/10 rounded-lg p-6 hover:bg-white/10 transition-all duration-200"
                      >
                        <div className="flex items-start justify-between mb-4">
                          <div className="flex items-center space-x-4">
                            <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-white font-bold">
                              {application.characterName.charAt(0)}
                            </div>
                            <div>
                              <h3 className="text-xl font-bold text-white">{application.characterName}</h3>
                              <p className="text-blue-200">Applied by: {application.username}</p>
                              <p className="text-sm text-gray-400">ID: {application.id}</p>
                            </div>
                          </div>
                          <div className="flex space-x-2">
                            <Button
                              size="sm"
                              variant="outline"
                              className="text-white border-white/20 hover:bg-white/10"
                              onClick={() => setSelectedApplication(application)}
                            >
                              <Eye className="h-4 w-4 mr-2" />
                              Review
                            </Button>
                          </div>
                        </div>

                        <div className="grid md:grid-cols-2 gap-4 mb-4">
                          <div>
                            <h4 className="text-white font-semibold mb-2">About Themselves</h4>
                            <p className="text-blue-100 text-sm bg-white/5 p-3 rounded">
                              {application.aboutYourself.length > 200 
                                ? application.aboutYourself.substring(0, 200) + '...' 
                                : application.aboutYourself}
                            </p>
                          </div>
                          <div>
                            <h4 className="text-white font-semibold mb-2">RP Experience</h4>
                            <p className="text-blue-100 text-sm bg-white/5 p-3 rounded">
                              {application.rpExperience.length > 200 
                                ? application.rpExperience.substring(0, 200) + '...' 
                                : application.rpExperience}
                            </p>
                          </div>
                        </div>

                        <div className="flex justify-end space-x-3">
                          <Button
                            onClick={() => handleApprove(application)}
                            disabled={reviewMutation.isPending}
                            className="bg-green-600 hover:bg-green-700 text-white"
                          >
                            <UserCheck className="h-4 w-4 mr-2" />
                            Approve
                          </Button>
                          <Button
                            onClick={() => setSelectedApplication(application)}
                            disabled={reviewMutation.isPending}
                            variant="destructive"
                          >
                            <UserX className="h-4 w-4 mr-2" />
                            Reject
                          </Button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="approved" className="mt-6">
            <Card className="bg-white/5 backdrop-blur-sm border-white/10">
              <CardHeader>
                <CardTitle className="text-green-400">✅ Approved Applications</CardTitle>
              </CardHeader>
              <CardContent>
                {approvedApplications.length === 0 ? (
                  <div className="text-center py-8">
                    <p className="text-blue-100">No approved applications yet.</p>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {approvedApplications.map((application) => (
                      <div
                        key={application.id}
                        className="flex items-center justify-between p-4 bg-green-500/10 border border-green-500/20 rounded-lg"
                      >
                        <div className="flex items-center space-x-4">
                          <div className="w-10 h-10 bg-green-600 rounded-full flex items-center justify-center text-white font-bold">
                            {application.characterName.charAt(0)}
                          </div>
                          <div>
                            <p className="font-medium text-white">{application.characterName}</p>
                            <p className="text-sm text-green-200">{application.username}</p>
                          </div>
                        </div>
                        <div className="text-right">
                          <p className="text-sm text-green-100">Approved by: {application.reviewedBy}</p>
                          <p className="text-xs text-green-200">
                            {application.reviewedAt ? new Date(application.reviewedAt).toLocaleDateString() : 'Recently'}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="rejected" className="mt-6">
            <Card className="bg-white/5 backdrop-blur-sm border-white/10">
              <CardHeader>
                <CardTitle className="text-red-400">❌ Rejected Applications</CardTitle>
              </CardHeader>
              <CardContent>
                {rejectedApplications.length === 0 ? (
                  <div className="text-center py-8">
                    <p className="text-blue-100">No rejected applications.</p>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {rejectedApplications.map((application) => (
                      <div
                        key={application.id}
                        className="p-4 bg-red-500/10 border border-red-500/20 rounded-lg"
                      >
                        <div className="flex items-start justify-between mb-2">
                          <div className="flex items-center space-x-4">
                            <div className="w-10 h-10 bg-red-600 rounded-full flex items-center justify-center text-white font-bold">
                              {application.characterName.charAt(0)}
                            </div>
                            <div>
                              <p className="font-medium text-white">{application.characterName}</p>
                              <p className="text-sm text-red-200">{application.username}</p>
                            </div>
                          </div>
                          <div className="text-right">
                            <p className="text-sm text-red-100">Rejected by: {application.reviewedBy}</p>
                            <p className="text-xs text-red-200">
                              {application.reviewedAt ? new Date(application.reviewedAt).toLocaleDateString() : 'Recently'}
                            </p>
                          </div>
                        </div>
                        {application.reviewReason && (
                          <div className="mt-2 p-2 bg-red-500/5 rounded border border-red-500/10">
                            <p className="text-sm text-red-100">Reason: {application.reviewReason}</p>
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>

      {/* Review Modal */}
      {selectedApplication && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 z-50">
          <Card className="bg-white/10 backdrop-blur-sm border-white/20 max-w-4xl w-full max-h-[90vh] overflow-y-auto">
            <CardHeader>
              <CardTitle className="text-white flex items-center justify-between">
                <span>Review Application - {selectedApplication.characterName}</span>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setSelectedApplication(null)}
                  className="text-white border-white/20 hover:bg-white/10"
                >
                  ×
                </Button>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <h4 className="text-white font-semibold mb-2">Applicant Information</h4>
                  <div className="space-y-2 text-blue-100">
                    <p><strong>Username:</strong> {selectedApplication.username}</p>
                    <p><strong>Discord ID:</strong> {selectedApplication.discordId}</p>
                    <p><strong>Steam ID:</strong> {selectedApplication.steamId}</p>
                    <p><strong>Character Age:</strong> {selectedApplication.characterAge}</p>
                    <p><strong>Character Nationality:</strong> {selectedApplication.characterNationality}</p>
                  </div>
                </div>
                <div>
                  <h4 className="text-white font-semibold mb-2">Application Details</h4>
                  <div className="space-y-2 text-blue-100">
                    <p><strong>Application ID:</strong> {selectedApplication.id}</p>
                    <p><strong>Submitted:</strong> {new Date(selectedApplication.createdAt).toLocaleString()}</p>
                    <p><strong>Status:</strong> <Badge className="ml-2">{selectedApplication.status}</Badge></p>
                  </div>
                </div>
              </div>

              <div>
                <h4 className="text-white font-semibold mb-2">About Themselves</h4>
                <div className="bg-white/5 p-4 rounded border border-white/10">
                  <p className="text-blue-100">{selectedApplication.aboutYourself}</p>
                </div>
              </div>

              <div>
                <h4 className="text-white font-semibold mb-2">RP Experience</h4>
                <div className="bg-white/5 p-4 rounded border border-white/10">
                  <p className="text-blue-100">{selectedApplication.rpExperience}</p>
                </div>
              </div>

              <div>
                <h4 className="text-white font-semibold mb-2">Character Backstory</h4>
                <div className="bg-white/5 p-4 rounded border border-white/10">
                  <p className="text-blue-100">{selectedApplication.characterBackstory}</p>
                </div>
              </div>

              {selectedApplication.contentCreation && (
                <div>
                  <h4 className="text-white font-semibold mb-2">Content Creation</h4>
                  <div className="bg-white/5 p-4 rounded border border-white/10">
                    <p className="text-blue-100">{selectedApplication.contentCreation}</p>
                  </div>
                </div>
              )}

              {selectedApplication.previousServers && (
                <div>
                  <h4 className="text-white font-semibold mb-2">Previous Servers</h4>
                  <div className="bg-white/5 p-4 rounded border border-white/10">
                    <p className="text-blue-100">{selectedApplication.previousServers}</p>
                  </div>
                </div>
              )}

              <div>
                <h4 className="text-white font-semibold mb-2">Rejection Reason (if rejecting)</h4>
                <Textarea
                  placeholder="Provide a detailed reason for rejection..."
                  value={reviewReason}
                  onChange={(e) => setReviewReason(e.target.value)}
                  className="bg-white/5 border-white/10 text-white placeholder:text-gray-400"
                />
              </div>

              <div className="flex justify-end space-x-4">
                <Button
                  onClick={() => setSelectedApplication(null)}
                  variant="outline"
                  className="text-white border-white/20 hover:bg-white/10"
                >
                  Cancel
                </Button>
                <Button
                  onClick={() => handleApprove(selectedApplication)}
                  disabled={reviewMutation.isPending}
                  className="bg-green-600 hover:bg-green-700 text-white"
                >
                  <UserCheck className="h-4 w-4 mr-2" />
                  Approve Application
                </Button>
                <Button
                  onClick={() => handleReject(selectedApplication, reviewReason)}
                  disabled={reviewMutation.isPending || !reviewReason.trim()}
                  variant="destructive"
                >
                  <UserX className="h-4 w-4 mr-2" />
                  Reject Application
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
}