import { useState, useEffect } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { insertApplicationSchema } from "@shared/schema";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/components/auth-provider";
import { apiRequest } from "@/lib/queryClient";
import { ArrowLeft, Shield, CheckCircle } from "lucide-react";
import type { InsertApplication } from "@shared/schema";
import { Link } from "wouter";

export default function ApplicationForm() {
  const [isSubmitted, setIsSubmitted] = useState(false);
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const { user, isAuthenticated } = useAuth();

  // Redirect if not authenticated
  if (!isAuthenticated) {
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
                <Shield className="text-6xl text-blue-400 mx-auto" />
                <h2 className="text-2xl font-bold text-white">Authentication Required</h2>
                <p className="text-blue-100">
                  You must be logged in with Discord to submit a whitelist application.
                </p>
                <Button 
                  onClick={() => window.location.href = '/auth/discord'}
                  className="bg-[#5865F2] hover:bg-[#4752C4] text-white"
                >
                  Login with Discord
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  const form = useForm<InsertApplication>({
    resolver: zodResolver(insertApplicationSchema),
    defaultValues: {
      userId: user?.id || "",
      username: user?.username || "",
      discordId: user?.id || "",
      steamId: "",
      aboutYourself: "",
      rpExperience: "",
      characterName: "",
      characterAge: "",
      characterNationality: "",
      characterBackstory: "",
      contentCreation: "",
      previousServers: "",
      rulesRead: false,
      cfxLinked: false,
    },
  });

  // Auto-populate Discord information when user data is available
  useEffect(() => {
    if (user) {
      form.setValue('userId', user.id);
      form.setValue('username', user.displayName || user.username);
      form.setValue('discordId', user.id);
    }
  }, [user, form]);

  const mutation = useMutation({
    mutationFn: async (data: InsertApplication) => {
      return apiRequest("POST", "/api/applications", data);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/applications"] });
      setIsSubmitted(true);
      toast({
        title: "Application Submitted",
        description: "Your whitelist application has been submitted successfully!",
      });
    },
    onError: () => {
      toast({
        title: "Submission Failed",
        description: "There was an error submitting your application. Please try again.",
        variant: "destructive",
      });
    },
  });

  const onSubmit = (data: InsertApplication) => {
    mutation.mutate(data);
  };

  if (isSubmitted) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-indigo-900 p-6">
        <div className="max-w-4xl mx-auto">
          <div className="mb-6">
            <Link href="/">
              <Button variant="outline" className="text-white border-white/20 hover:bg-white/10" data-testid="link-back-dashboard">
                <ArrowLeft className="h-4 w-4 mr-2" />
                Back to Home
              </Button>
            </Link>
          </div>
          <Card className="bg-white/5 backdrop-blur-sm border-white/10">
            <CardContent className="pt-6">
              <div className="text-center space-y-6">
                <CheckCircle className="text-6xl text-green-400 mx-auto" />
                <h2 className="text-3xl font-bold text-white">Application Submitted Successfully!</h2>
                <div className="bg-green-500/10 border border-green-500/20 rounded-lg p-6">
                  <p className="text-green-100 text-lg mb-4">
                    🎉 Thank you for applying to Prime City RP!
                  </p>
                  <div className="space-y-2 text-green-100">
                    <p>✅ Your application has been submitted and is now under review</p>
                    <p>✅ You'll receive a Discord notification once it's reviewed</p>
                    <p>✅ Check our Discord server for updates and community news</p>
                  </div>
                </div>
                <div className="flex flex-col sm:flex-row gap-4 justify-center">
                  <Button 
                    onClick={() => window.open('https://discord.gg/primecityrp', '_blank')}
                    className="bg-[#5865F2] hover:bg-[#4752C4] text-white"
                  >
                    Join Discord Server
                  </Button>
                  <Button 
                    variant="outline" 
                    className="text-white border-white/20 hover:bg-white/10"
                    onClick={() => setIsSubmitted(false)} 
                    data-testid="button-submit-another"
                  >
                    Submit Another Application
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  const aboutWordsCount = form.watch("aboutYourself").split(/\s+/).filter(word => word.length > 0).length;
  const rpWordsCount = form.watch("rpExperience").split(/\s+/).filter(word => word.length > 0).length;

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-indigo-900 p-6">
      <div className="max-w-4xl mx-auto">
        <div className="mb-6">
          <Link href="/">
            <Button variant="outline" className="text-white border-white/20 hover:bg-white/10" data-testid="link-back-dashboard">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Home
            </Button>
          </Link>
        </div>
        
        {/* User Info Display */}
        <Card className="bg-white/5 backdrop-blur-sm border-white/10 mb-6">
          <CardContent className="pt-6">
            <div className="flex items-center space-x-4">
              <img 
                src={user?.avatar ? `https://cdn.discordapp.com/avatars/${user.id}/${user.avatar}.png` : '/default-avatar.png'} 
                alt="Profile" 
                className="w-12 h-12 rounded-full"
              />
              <div>
                <h3 className="text-white font-semibold">Applying as: {user?.displayName || user?.username}</h3>
                <p className="text-blue-200 text-sm">Discord ID: {user?.id}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card className="bg-white/5 backdrop-blur-sm border-white/10">
      <CardHeader>
        <CardTitle className="text-3xl text-center text-white">🎭 Prime City Whitelist Application</CardTitle>
        <p className="text-center text-blue-100 text-lg">
          Welcome to Prime City Roleplay! Please fill out all required fields to apply for whitelist access.
        </p>
        <Alert className="bg-blue-500/10 border-blue-500/20">
          <Shield className="h-4 w-4 text-blue-400" />
          <AlertDescription className="text-blue-100">
            Your Discord information has been automatically filled. Please complete the remaining fields with accurate information.
          </AlertDescription>
        </Alert>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
            {/* Personal Information */}
            <div className="space-y-6">
              <h3 className="text-xl font-semibold border-b border-white/20 pb-2 text-white">📋 Personal Information</h3>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="userId"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-white">User ID (Auto-filled)</FormLabel>
                      <FormControl>
                        <Input 
                          placeholder="Your unique user ID" 
                          {...field} 
                          disabled 
                          className="bg-white/5 border-white/10 text-gray-400" 
                          data-testid="input-user-id" 
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="username"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-white">Username (Auto-filled)</FormLabel>
                      <FormControl>
                        <Input 
                          placeholder="Your username" 
                          {...field} 
                          disabled 
                          className="bg-white/5 border-white/10 text-gray-400" 
                          data-testid="input-username" 
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <FormField
                control={form.control}
                name="aboutYourself"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-white">Tell us about yourself (50 words minimum)</FormLabel>
                    <FormControl>
                      <Textarea
                        placeholder="Share your interests, gaming background, and what draws you to roleplay..."
                        className="min-h-[120px] bg-white/5 border-white/10 text-white placeholder:text-gray-400"
                        {...field}
                        data-testid="textarea-about-yourself"
                      />
                    </FormControl>
                    <div className="text-xs text-blue-200">
                      {aboutWordsCount}/50 words {aboutWordsCount < 50 ? "minimum" : "✓"}
                    </div>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="rpExperience"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-white">RP Experience & Motivation (50 words minimum)</FormLabel>
                    <FormControl>
                      <Textarea
                        placeholder="Describe your roleplay experience and what inspired you to join FiveM RP..."
                        className="min-h-[120px] bg-white/5 border-white/10 text-white placeholder:text-gray-400"
                        {...field}
                        data-testid="textarea-rp-experience"
                      />
                    </FormControl>
                    <div className="text-xs text-blue-200">
                      {rpWordsCount}/50 words {rpWordsCount < 50 ? "minimum" : "✓"}
                    </div>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="discordId"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-white">Discord ID (Auto-filled)</FormLabel>
                      <FormControl>
                        <Input 
                          placeholder="781463891985669475" 
                          {...field} 
                          disabled 
                          className="bg-white/5 border-white/10 text-gray-400" 
                          data-testid="input-discord-id" 
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="steamId"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-white">Steam Hex ID</FormLabel>
                      <FormControl>
                        <Input 
                          placeholder="110000146218998" 
                          {...field} 
                          className="bg-white/5 border-white/10 text-white placeholder:text-gray-400" 
                          data-testid="input-steam-id" 
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            </div>

            {/* Character Information */}
            <div className="space-y-6">
              <h3 className="text-lg font-semibold border-b border-border pb-2">🎭 Character Information</h3>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <FormField
                  control={form.control}
                  name="characterName"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Character Full Name</FormLabel>
                      <FormControl>
                        <Input placeholder="John Smith" {...field} data-testid="input-character-name" />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="characterAge"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Character Age</FormLabel>
                      <FormControl>
                        <Input placeholder="25" {...field} data-testid="input-character-age" />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="characterNationality"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Character Nationality</FormLabel>
                      <FormControl>
                        <Input placeholder="American" {...field} data-testid="input-character-nationality" />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <FormField
                control={form.control}
                name="characterBackstory"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Character Backstory (minimum 3-4 sentences)</FormLabel>
                    <FormControl>
                      <Textarea
                        placeholder="Create a compelling backstory for your character including their background, motivations, and how they arrived in Los Santos..."
                        className="min-h-[150px]"
                        {...field}
                        data-testid="textarea-character-backstory"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            {/* Additional Information */}
            <div className="space-y-6">
              <h3 className="text-lg font-semibold border-b border-border pb-2">ℹ️ Additional Information</h3>
              
              <FormField
                control={form.control}
                name="contentCreation"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Content Creation (YouTube/Twitch)</FormLabel>
                    <FormControl>
                      <Textarea
                        placeholder="Do you stream or upload RP content? Share your channels or clips..."
                        className="min-h-[80px]"
                        {...field}
                        data-testid="textarea-content-creation"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="previousServers"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Previous RP Servers</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="List any other RP servers you've played on..."
                        {...field}
                        data-testid="input-previous-servers"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <FormField
                  control={form.control}
                  name="rulesRead"
                  render={({ field }) => (
                    <FormItem className="flex flex-row items-start space-x-3 space-y-0">
                      <FormControl>
                        <Checkbox
                          checked={field.value}
                          onCheckedChange={field.onChange}
                          data-testid="checkbox-rules-read"
                        />
                      </FormControl>
                      <div className="space-y-1 leading-none">
                        <FormLabel>I have read and understood the server rules</FormLabel>
                      </div>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="cfxLinked"
                  render={({ field }) => (
                    <FormItem className="flex flex-row items-start space-x-3 space-y-0">
                      <FormControl>
                        <Checkbox
                          checked={field.value}
                          onCheckedChange={field.onChange}
                          data-testid="checkbox-cfx-linked"
                        />
                      </FormControl>
                      <div className="space-y-1 leading-none">
                        <FormLabel>I have linked my CFX account to FiveM</FormLabel>
                      </div>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            </div>

            <div className="flex justify-end space-x-4 pt-6 border-t border-border">
              <Button
                type="button"
                variant="outline"
                onClick={() => form.reset()}
                data-testid="button-reset-form"
              >
                Reset Form
              </Button>
              <Button
                type="submit"
                disabled={mutation.isPending}
                className="discord-button"
                data-testid="button-submit-application"
              >
                {mutation.isPending ? "Submitting..." : "Submit Application"}
              </Button>
            </div>
          </form>
        </Form>
      </CardContent>
    </Card>
      </div>
    </div>
  );
}
