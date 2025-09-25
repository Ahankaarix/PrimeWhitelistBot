import { Switch, Route } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import Dashboard from "@/pages/dashboard";
import Applications from "@/pages/applications";
import NotFound from "@/pages/not-found";
import ApplicationForm from "@/components/application-form";

function Router() {
  return (
    <Switch>
      <Route path="/" component={Dashboard} />
      <Route path="/applications" component={Applications} />
      <Route path="/apply" component={ApplicationForm} />
      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <Router />
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;
