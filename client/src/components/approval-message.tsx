import { Card } from "@/components/ui/card";
import type { Application } from "@shared/schema";

interface ApprovalMessageProps {
  application: Application;
  adminUsername: string;
}

export default function ApprovalMessage({ application, adminUsername }: ApprovalMessageProps) {
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
            <Card className="discord-success p-6 rounded-lg border-l-4 border-green-600 font-bold text-black">
              <div className="text-sm mb-2">Accepted By</div>
              <div className="text-lg mb-4">{adminUsername}</div>
              <div className="text-center">
                <div className="text-2xl mb-2">WELCOME TO LOS SANTOS!</div>
                <div className="text-4xl font-black">YOUR VISA HAS BEEN GRANTED</div>
              </div>
              <div className="absolute right-4 top-4 bottom-4 w-1 bg-green-600"></div>
              <div className="absolute right-2 top-4 bottom-4 flex flex-col justify-between">
                {Array(20).fill(0).map((_, i) => (
                  <div key={i} className="w-1 h-2 bg-green-600"></div>
                ))}
              </div>
            </Card>
            <div className="mt-3 text-sm text-muted-foreground">
              <p>{application.username}</p>
              <div className="mt-2 space-y-1">
                <p><strong>Welcome to Prime City RP!</strong> Your application has been approved. Please read the server rules and join our Discord for further instructions.</p>
                <p><strong>Character:</strong> {application.characterName}</p>
                <p><strong>Approved by:</strong> {application.reviewedBy}</p>
                <p><strong>Approval Date:</strong> {application.reviewedAt ? new Date(application.reviewedAt).toLocaleString() : "Now"}</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
