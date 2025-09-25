import { useState } from "react";
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
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";
import type { InsertApplication } from "@shared/schema";

export default function ApplicationForm() {
  const [isSubmitted, setIsSubmitted] = useState(false);
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const form = useForm<InsertApplication>({
    resolver: zodResolver(insertApplicationSchema),
    defaultValues: {
      userId: "",
      username: "",
      discordId: "",
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
      <Card className="success-card max-w-2xl mx-auto">
        <CardContent className="pt-6">
          <div className="text-center space-y-4">
            <div className="text-6xl">✅</div>
            <h2 className="text-2xl font-bold text-green-600">Application Submitted!</h2>
            <p className="text-muted-foreground">
              Thank you for your application! Our admin team will review it and get back to you soon.
            </p>
            <Button onClick={() => setIsSubmitted(false)} data-testid="button-submit-another">
              Submit Another Application
            </Button>
          </div>
        </CardContent>
      </Card>
    );
  }

  const aboutWordsCount = form.watch("aboutYourself").split(/\s+/).filter(word => word.length > 0).length;
  const rpWordsCount = form.watch("rpExperience").split(/\s+/).filter(word => word.length > 0).length;

  return (
    <Card className="discord-message max-w-4xl mx-auto">
      <CardHeader>
        <CardTitle className="text-2xl text-center">📝 Prime City Whitelist Application</CardTitle>
        <p className="text-center text-muted-foreground">
          Welcome to Prime City Roleplay! Please fill out all required fields to apply for whitelist access.
        </p>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
            {/* Personal Information */}
            <div className="space-y-6">
              <h3 className="text-lg font-semibold border-b border-border pb-2">📋 Personal Information</h3>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="userId"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>User ID</FormLabel>
                      <FormControl>
                        <Input placeholder="Your unique user ID" {...field} data-testid="input-user-id" />
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
                      <FormLabel>Username</FormLabel>
                      <FormControl>
                        <Input placeholder="Your username" {...field} data-testid="input-username" />
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
                    <FormLabel>Tell us about yourself (50 words minimum)</FormLabel>
                    <FormControl>
                      <Textarea
                        placeholder="Share your interests, gaming background, and what draws you to roleplay..."
                        className="min-h-[120px]"
                        {...field}
                        data-testid="textarea-about-yourself"
                      />
                    </FormControl>
                    <div className="text-xs text-muted-foreground">
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
                    <FormLabel>RP Experience & Motivation (50 words minimum)</FormLabel>
                    <FormControl>
                      <Textarea
                        placeholder="Describe your roleplay experience and what inspired you to join FiveM RP..."
                        className="min-h-[120px]"
                        {...field}
                        data-testid="textarea-rp-experience"
                      />
                    </FormControl>
                    <div className="text-xs text-muted-foreground">
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
                      <FormLabel>Discord ID</FormLabel>
                      <FormControl>
                        <Input placeholder="781463891985669475" {...field} data-testid="input-discord-id" />
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
                      <FormLabel>Steam Hex ID</FormLabel>
                      <FormControl>
                        <Input placeholder="110000146218998" {...field} data-testid="input-steam-id" />
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
  );
}
