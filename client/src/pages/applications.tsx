import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import ApplicationCard from "@/components/application-card";
import type { Application } from "@shared/schema";

export default function Applications() {
  const { data: applications = [], isLoading } = useQuery<Application[]>({
    queryKey: ["/api/applications"],
  });

  if (isLoading) {
    return (
      <div className="min-h-screen discord-bg p-6">
        <div className="max-w-7xl mx-auto">
          <div className="text-center py-20">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
            <p className="text-muted-foreground mt-4">Loading applications...</p>
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
      {/* Header */}
      <div className="border-b border-border p-4">
        <div className="max-w-7xl mx-auto flex items-center space-x-4">
          <div className="w-12 h-12 bg-primary rounded-full flex items-center justify-center text-white font-bold text-xl">
            PC
          </div>
          <div>
            <h1 className="text-2xl font-bold text-foreground">Whitelist Applications</h1>
            <p className="text-muted-foreground">Review and manage all applications</p>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto p-6">
        <Tabs defaultValue="pending" className="w-full">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="pending" data-testid="tab-pending">
              Pending ({pendingApplications.length})
            </TabsTrigger>
            <TabsTrigger value="approved" data-testid="tab-approved">
              Approved ({approvedApplications.length})
            </TabsTrigger>
            <TabsTrigger value="rejected" data-testid="tab-rejected">
              Rejected ({rejectedApplications.length})
            </TabsTrigger>
          </TabsList>

          <TabsContent value="pending" className="mt-6">
            <Card className="discord-message">
              <CardHeader>
                <CardTitle className="text-yellow-400">⏳ Pending Review</CardTitle>
              </CardHeader>
              <CardContent>
                {pendingApplications.length === 0 ? (
                  <div className="text-center py-8">
                    <p className="text-muted-foreground">No pending applications.</p>
                  </div>
                ) : (
                  <div className="space-y-6">
                    {pendingApplications.map((application) => (
                      <ApplicationCard key={application.id} application={application} />
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="approved" className="mt-6">
            <Card className="discord-message">
              <CardHeader>
                <CardTitle className="text-green-400">✅ Approved Applications</CardTitle>
              </CardHeader>
              <CardContent>
                {approvedApplications.length === 0 ? (
                  <div className="text-center py-8">
                    <p className="text-muted-foreground">No approved applications yet.</p>
                  </div>
                ) : (
                  <div className="space-y-6">
                    {approvedApplications.map((application) => (
                      <ApplicationCard key={application.id} application={application} />
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="rejected" className="mt-6">
            <Card className="discord-message">
              <CardHeader>
                <CardTitle className="text-red-400">❌ Rejected Applications</CardTitle>
              </CardHeader>
              <CardContent>
                {rejectedApplications.length === 0 ? (
                  <div className="text-center py-8">
                    <p className="text-muted-foreground">No rejected applications.</p>
                  </div>
                ) : (
                  <div className="space-y-6">
                    {rejectedApplications.map((application) => (
                      <ApplicationCard key={application.id} application={application} />
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
