import { Card } from "@/components/ui/card";
import type { Application } from "@shared/schema";

interface RejectionMessageProps {
  application: Application;
  adminUsername: string;
}

export default function RejectionMessage({ application, adminUsername }: RejectionMessageProps) {
  const reapplicationDate = application.reviewedAt 
    ? new Date(new Date(application.reviewedAt).getTime() + 24 * 60 * 60 * 1000).toLocaleString()
    : new Date(Date.now() + 24 * 60 * 60 * 1000).toLocaleString();

  return (
    <div className="fade-in">
      <div className="flex items-start space-x-3">
        <div className="w-10 h-10 bg-primary rounded-full flex items-center justify-center text-white font-bold">
          PC
        </div>
        <div className="flex-1">
          <div className="flex items-center space-x-2 mb-2">
            <span className="text-white font-semibold">Prime City Bot</span>
            <span className="bg-primary text-white text-xs px-2 py-1 rounded">BOT</span>
            <span className="text-muted-foreground text-sm">
              {application.reviewedAt ? new Date(application.reviewedAt).toLocaleString() : "Now"}
            </span>
          </div>
          <div className="relative">
            <Card className="bg-red-600 text-white p-6 rounded-lg border-l-4 border-red-800 font-bold">
              <div className="text-sm mb-2">Application Response</div>
              <div className="text-sm mb-2">Your Visa Application Has Been Rejected</div>
              <div className="text-sm mb-4">
                <div>Rejected By</div>
                <div>{adminUsername}</div>
              </div>
              <div className="text-sm mb-4">
                <div>Reason: {application.reviewReason || "Application did not meet requirements"}</div>
              </div>
              <div className="text-center">
                <div className="text-lg mb-2">SORRY BUT WE DIDN'T MAKE IT</div>
                <div className="text-3xl font-black">YOUR VISA HAS BEEN REJECTED</div>
              </div>
              <div className="absolute right-4 top-4 bottom-4 w-1 bg-red-800"></div>
              <div className="absolute right-2 top-4 bottom-4 flex flex-col justify-between">
                {Array(20).fill(0).map((_, i) => (
                  <div key={i} className="w-1 h-2 bg-red-800"></div>
                ))}
              </div>
            </Card>
            <div className="mt-3 text-sm text-muted-foreground">
              <p>{application.username}</p>
              <div className="mt-2 space-y-1">
                <p><strong>Application Status:</strong> Rejected</p>
                <p><strong>Reason:</strong> {application.reviewReason || "Your application did not meet our requirements. Please review our guidelines and reapply."}</p>
                <p><strong>Rejected by:</strong> {application.reviewedBy}</p>
                <p><strong>Rejection Date:</strong> {application.reviewedAt ? new Date(application.reviewedAt).toLocaleString() : "Now"}</p>
                <p><strong>Reapplication Available:</strong> {reapplicationDate}</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
