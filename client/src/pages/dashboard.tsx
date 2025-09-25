import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Users, Clock, CheckCircle, XCircle, ExternalLink } from "lucide-react";
import type { Application } from "@shared/schema";
import { Link } from "wouter";

export default function Dashboard() {
  const { data: applications = [], isLoading } = useQuery<Application[]>({
    queryKey: ["/api/applications"],
  });

  if (isLoading) {
    return (
      <div className="min-h-screen discord-bg p-6">
        <div className="max-w-7xl mx-auto">
          <div className="text-center py-20">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
            <p className="text-muted-foreground mt-4">Loading dashboard...</p>
          </div>
        </div>
      </div>
    );
  }

  const pendingApplications = applications.filter(app => app.status === "pending");
  const approvedApplications = applications.filter(app => app.status === "approved");
  const rejectedApplications = applications.filter(app => app.status === "rejected");

  return (
    <div className="min-h-screen discord-bg">
      {/* Discord-like Header */}
      <div className="border-b border-border p-4">
        <div className="max-w-7xl mx-auto flex items-center space-x-4">
          <div className="w-12 h-12 bg-primary rounded-full flex items-center justify-center text-white font-bold text-xl">
            PC
          </div>
          <div>
            <h1 className="text-2xl font-bold text-foreground">Prime City RP - Admin Dashboard</h1>
            <p className="text-muted-foreground">Whitelist Application Management</p>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto p-6">
        {/* Navigation Links */}
        <div className="mb-6 flex space-x-4">
          <Link href="/applications">
            <Button variant="outline" data-testid="link-applications">
              <Users className="h-4 w-4 mr-2" />
              View Applications
            </Button>
          </Link>
          <Link href="/apply">
            <Button data-testid="link-apply">
              <ExternalLink className="h-4 w-4 mr-2" />
              Submit Application
            </Button>
          </Link>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <Card className="discord-message border-l-4 border-l-blue-500">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Applications</CardTitle>
              <Users className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{applications.length}</div>
              <p className="text-xs text-muted-foreground">All time submissions</p>
            </CardContent>
          </Card>

          <Card className="discord-message border-l-4 border-l-yellow-500">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Pending Review</CardTitle>
              <Clock className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{pendingApplications.length}</div>
              <p className="text-xs text-muted-foreground">Awaiting admin action</p>
            </CardContent>
          </Card>

          <Card className="discord-message border-l-4 border-l-green-500">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Approved</CardTitle>
              <CheckCircle className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{approvedApplications.length}</div>
              <p className="text-xs text-muted-foreground">Successful applications</p>
            </CardContent>
          </Card>

          <Card className="discord-message border-l-4 border-l-red-500">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Rejected</CardTitle>
              <XCircle className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{rejectedApplications.length}</div>
              <p className="text-xs text-muted-foreground">Declined applications</p>
            </CardContent>
          </Card>
        </div>

        {/* Discord Bot Info */}
        <Card className="discord-message mb-8">
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <div className="w-6 h-6 bg-primary rounded-full flex items-center justify-center text-white text-sm font-bold">
                PC
              </div>
              <span>Discord Bot Status</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="bg-muted/50 p-4 rounded-lg">
                <h3 className="font-semibold mb-2">🤖 Prime City Whitelist Bot</h3>
                <p className="text-muted-foreground text-sm mb-3">
                  The Discord bot handles whitelist applications through the <code className="bg-muted px-1 rounded">/whitelist</code> slash command.
                </p>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span>Command:</span>
                    <code className="bg-muted px-2 py-1 rounded">/whitelist</code>
                  </div>
                  <div className="flex justify-between">
                    <span>Restricted Channel:</span>
                    <span className="text-muted-foreground">Whitelist Applications Only</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Admin Notifications:</span>
                    <span className="text-green-400">✓ Enabled</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Auto Responses:</span>
                    <span className="text-green-400">✓ Enabled</span>
                  </div>
                </div>
              </div>
              
              <div className="bg-accent/10 border border-accent/20 p-4 rounded-lg">
                <h4 className="font-medium text-accent mb-2">📋 Application Process</h4>
                <ol className="text-sm text-muted-foreground space-y-1 ml-4 list-decimal">
                  <li>User runs <code>/whitelist</code> command in designated channel</li>
                  <li>Bot presents application modal with required fields</li>
                  <li>Submission creates entry in database and notifies admins</li>
                  <li>Admin reviews and approves/rejects via Discord buttons</li>
                  <li>User receives branded approval/rejection message</li>
                  <li>All actions logged to designated channels</li>
                </ol>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Recent Applications */}
        <Card className="discord-message">
          <CardHeader>
            <CardTitle>Recent Applications</CardTitle>
          </CardHeader>
          <CardContent>
            {applications.length === 0 ? (
              <div className="text-center py-8">
                <p className="text-muted-foreground">No applications yet. Discord bot is ready to receive submissions.</p>
              </div>
            ) : (
              <div className="space-y-4">
                {applications.slice(0, 5).map((application) => (
                  <div
                    key={application.id}
                    className="flex items-center justify-between p-4 bg-muted/30 rounded-lg"
                    data-testid={`application-summary-${application.id}`}
                  >
                    <div className="flex items-center space-x-4">
                      <div className="w-10 h-10 bg-primary rounded-full flex items-center justify-center text-white font-bold">
                        {application.characterName.charAt(0)}
                      </div>
                      <div>
                        <p className="font-medium" data-testid={`text-character-name-${application.id}`}>
                          {application.characterName}
                        </p>
                        <p className="text-sm text-muted-foreground" data-testid={`text-username-${application.id}`}>
                          {application.username}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center space-x-3">
                      <Badge
                        variant={
                          application.status === "approved"
                            ? "default"
                            : application.status === "rejected"
                            ? "destructive"
                            : "secondary"
                        }
                        data-testid={`badge-status-${application.id}`}
                      >
                        {application.status}
                      </Badge>
                      <span className="text-xs text-muted-foreground">
                        {new Date(application.createdAt).toLocaleDateString()}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
