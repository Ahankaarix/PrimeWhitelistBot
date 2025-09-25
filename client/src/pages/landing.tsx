import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useAuth } from "@/components/auth-provider";
import { 
  Users, 
  Shield, 
  Clock, 
  Star, 
  CheckCircle, 
  Award, 
  Heart,
  UserCheck,
  MapPin,
  Calendar,
  MessageSquare,
  Play,
  FileCheck,
  Zap,
  Globe,
  Crown
} from "lucide-react";
import { Link } from "wouter";

export default function Landing() {
  const { user, login, isAuthenticated } = useAuth();

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-indigo-900">
      {/* Navigation Header */}
      <nav className="border-b border-white/10 backdrop-blur-sm bg-black/20 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-white font-bold text-xl shadow-lg">
                PC
              </div>
              <div>
                <h1 className="text-xl font-bold text-white">Prime City RP</h1>
                <p className="text-blue-200 text-sm">Los Santos Roleplay Server</p>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              {isAuthenticated ? (
                <div className="flex items-center space-x-4">
                  <div className="flex items-center space-x-2">
                    <img 
                      src={user?.avatar ? `https://cdn.discordapp.com/avatars/${user.id}/${user.avatar}.png` : '/default-avatar.png'} 
                      alt="Profile" 
                      className="w-8 h-8 rounded-full"
                    />
                    <span className="text-white font-medium">{user?.displayName || user?.username}</span>
                    {user?.isAdmin && <Badge variant="destructive">Admin</Badge>}
                  </div>
                  {user?.isAdmin && (
                    <Link href="/admin">
                      <Button className="bg-red-600 hover:bg-red-700 text-white">
                        <Crown className="h-4 w-4 mr-2" />
                        Admin Panel
                      </Button>
                    </Link>
                  )}
                  <Link href="/dashboard">
                    <Button variant="outline" className="text-white border-white/20 hover:bg-white/10">
                      Dashboard
                    </Button>
                  </Link>
                </div>
              ) : (
                <Button 
                  onClick={login}
                  className="bg-[#5865F2] hover:bg-[#4752C4] text-white font-semibold shadow-lg"
                >
                  <MessageSquare className="h-4 w-4 mr-2" />
                  Login with Discord
                </Button>
              )}
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative min-h-[80vh] flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-black/50 via-transparent to-black/50"></div>
        <div className="relative z-10 text-center max-w-4xl mx-auto px-6">
          <div className="mb-6">
            <Badge className="bg-gradient-to-r from-blue-500 to-purple-600 text-white border-0 text-lg px-4 py-2 mb-4">
              🎭 Prime City Roleplay
            </Badge>
          </div>
          <h1 className="text-6xl md:text-7xl font-bold text-white mb-6 leading-tight">
            Step into the
            <span className="bg-gradient-to-r from-blue-400 to-purple-500 bg-clip-text text-transparent"> Boundless </span>
            World of Los Santos
          </h1>
          <p className="text-xl text-blue-100 mb-8 max-w-3xl mx-auto leading-relaxed">
            Immerse yourself in a universe of endless roleplay possibilities. Create your story, forge alliances, 
            and experience life like never before on Prime City RP. Join our passionate community today and start your journey!
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            {isAuthenticated ? (
              <Link href="/apply">
                <Button size="lg" className="bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 text-white font-semibold text-lg px-8 py-4 shadow-xl">
                  <FileCheck className="h-5 w-5 mr-2" />
                  Apply for Whitelist
                </Button>
              </Link>
            ) : (
              <Button 
                onClick={login}
                size="lg" 
                className="bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white font-semibold text-lg px-8 py-4 shadow-xl"
              >
                <Play className="h-5 w-5 mr-2" />
                Start Your Journey
              </Button>
            )}
            <Button 
              size="lg" 
              variant="outline" 
              className="border-white/30 text-white hover:bg-white/10 font-semibold text-lg px-8 py-4"
              onClick={() => window.open('https://discord.gg/primecityrp', '_blank')}
            >
              <MessageSquare className="h-5 w-5 mr-2" />
              Join Discord
            </Button>
          </div>
        </div>
      </section>

      {/* Community Stats */}
      <section className="py-16 bg-black/20 backdrop-blur-sm border-y border-white/10">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
            <div>
              <div className="text-4xl font-bold text-white mb-2">500+</div>
              <div className="text-blue-200">Community Members</div>
            </div>
            <div>
              <div className="text-4xl font-bold text-white mb-2">24/7</div>
              <div className="text-blue-200">Server Uptime</div>
            </div>
            <div>
              <div className="text-4xl font-bold text-white mb-2">150+</div>
              <div className="text-blue-200">Custom Scripts</div>
            </div>
            <div>
              <div className="text-4xl font-bold text-white mb-2">99%</div>
              <div className="text-blue-200">Satisfaction Rate</div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-gradient-to-b from-transparent to-black/20">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-white mb-4">Our Commitment to Excellence</h2>
            <p className="text-xl text-blue-100 max-w-3xl mx-auto">
              We are dedicated to fostering a welcoming environment where every player can find inspiration. 
              Our goal is to empower roleplayers to explore new horizons, embrace their creativity, and share unforgettable stories.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            <Card className="bg-white/5 backdrop-blur-sm border-white/10 hover:bg-white/10 transition-all duration-300">
              <CardHeader>
                <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-purple-600 rounded-lg flex items-center justify-center mb-4">
                  <Zap className="h-6 w-6 text-white" />
                </div>
                <CardTitle className="text-white">Dynamic Roleplay Experience</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription className="text-blue-100">
                  Immerse yourself in a constantly evolving world where your choices matter. Prime City RP offers unique scenarios 
                  that allow you to shape your character's destiny and explore various storylines.
                </CardDescription>
              </CardContent>
            </Card>

            <Card className="bg-white/5 backdrop-blur-sm border-white/10 hover:bg-white/10 transition-all duration-300">
              <CardHeader>
                <div className="w-12 h-12 bg-gradient-to-r from-green-500 to-emerald-600 rounded-lg flex items-center justify-center mb-4">
                  <Users className="h-6 w-6 text-white" />
                </div>
                <CardTitle className="text-white">Engaged Community</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription className="text-blue-100">
                  Connect with a diverse group of passionate roleplayers who are eager to share their creativity and 
                  collaborate on exciting adventures. Our supportive environment encourages friendships and teamwork.
                </CardDescription>
              </CardContent>
            </Card>

            <Card className="bg-white/5 backdrop-blur-sm border-white/10 hover:bg-white/10 transition-all duration-300">
              <CardHeader>
                <div className="w-12 h-12 bg-gradient-to-r from-purple-500 to-pink-600 rounded-lg flex items-center justify-center mb-4">
                  <Crown className="h-6 w-6 text-white" />
                </div>
                <CardTitle className="text-white">Custom Features & Mechanics</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription className="text-blue-100">
                  Enjoy tailored gameplay elements designed to enhance your roleplaying experience. From unique character 
                  abilities to innovative game mechanics, Prime City RP provides the tools you need to bring your vision to life.
                </CardDescription>
              </CardContent>
            </Card>

            <Card className="bg-white/5 backdrop-blur-sm border-white/10 hover:bg-white/10 transition-all duration-300">
              <CardHeader>
                <div className="w-12 h-12 bg-gradient-to-r from-orange-500 to-red-600 rounded-lg flex items-center justify-center mb-4">
                  <Calendar className="h-6 w-6 text-white" />
                </div>
                <CardTitle className="text-white">Regular Events & Contests</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription className="text-blue-100">
                  Participate in fun community events, roleplay contests, and interactive challenges that keep the experience 
                  fresh and exciting. Engage with fellow players and showcase your creativity in various formats.
                </CardDescription>
              </CardContent>
            </Card>

            <Card className="bg-white/5 backdrop-blur-sm border-white/10 hover:bg-white/10 transition-all duration-300">
              <CardHeader>
                <div className="w-12 h-12 bg-gradient-to-r from-cyan-500 to-blue-600 rounded-lg flex items-center justify-center mb-4">
                  <Shield className="h-6 w-6 text-white" />
                </div>
                <CardTitle className="text-white">Professional Moderation</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription className="text-blue-100">
                  Our dedicated team ensures a safe and enjoyable environment for all players. With experienced moderators 
                  and clear guidelines, we maintain the highest standards of roleplay quality.
                </CardDescription>
              </CardContent>
            </Card>

            <Card className="bg-white/5 backdrop-blur-sm border-white/10 hover:bg-white/10 transition-all duration-300">
              <CardHeader>
                <div className="w-12 h-12 bg-gradient-to-r from-yellow-500 to-orange-600 rounded-lg flex items-center justify-center mb-4">
                  <Globe className="h-6 w-6 text-white" />
                </div>
                <CardTitle className="text-white">Global Community</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription className="text-blue-100">
                  Join players from around the world in our international community. Experience diverse perspectives and 
                  cultures while building lasting friendships through shared adventures.
                </CardDescription>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Application Process */}
      <section className="py-20 bg-black/30 backdrop-blur-sm">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-white mb-4">Join Prime City RP Today</h2>
            <p className="text-xl text-blue-100 max-w-3xl mx-auto">
              Ready to begin your roleplay journey? Follow these simple steps to join our community and start creating your story.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="w-16 h-16 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center mx-auto mb-6 text-2xl font-bold text-white">
                1
              </div>
              <h3 className="text-xl font-bold text-white mb-4">Authenticate with Discord</h3>
              <p className="text-blue-100">
                Connect your Discord account to verify your identity and join our community server for important updates and announcements.
              </p>
            </div>

            <div className="text-center">
              <div className="w-16 h-16 bg-gradient-to-r from-green-500 to-emerald-600 rounded-full flex items-center justify-center mx-auto mb-6 text-2xl font-bold text-white">
                2
              </div>
              <h3 className="text-xl font-bold text-white mb-4">Submit Your Application</h3>
              <p className="text-blue-100">
                Fill out our comprehensive whitelist application with your character details, background story, and roleplay experience.
              </p>
            </div>

            <div className="text-center">
              <div className="w-16 h-16 bg-gradient-to-r from-purple-500 to-pink-600 rounded-full flex items-center justify-center mx-auto mb-6 text-2xl font-bold text-white">
                3
              </div>
              <h3 className="text-xl font-bold text-white mb-4">Start Playing</h3>
              <p className="text-blue-100">
                Once approved, you'll receive server access and can begin your adventure in Los Santos with fellow roleplayers.
              </p>
            </div>
          </div>

          <div className="text-center mt-12">
            {isAuthenticated ? (
              <Link href="/apply">
                <Button size="lg" className="bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 text-white font-semibold text-lg px-8 py-4 shadow-xl">
                  <FileCheck className="h-5 w-5 mr-2" />
                  Apply for Whitelist Now
                </Button>
              </Link>
            ) : (
              <Button 
                onClick={login}
                size="lg" 
                className="bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white font-semibold text-lg px-8 py-4 shadow-xl"
              >
                <MessageSquare className="h-5 w-5 mr-2" />
                Get Started with Discord
              </Button>
            )}
          </div>
        </div>
      </section>

      {/* Server Rules & Guidelines */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-4xl font-bold text-white mb-6">Server Rules & Guidelines</h2>
              <p className="text-xl text-blue-100 mb-8">
                To ensure a positive experience for everyone, please familiarize yourself with our community rules and guidelines. 
                These standards help maintain the quality of roleplay and create a welcoming environment for all players.
              </p>
              <div className="space-y-4">
                <div className="flex items-center space-x-3">
                  <CheckCircle className="h-6 w-6 text-green-400" />
                  <span className="text-white">Respectful communication at all times</span>
                </div>
                <div className="flex items-center space-x-3">
                  <CheckCircle className="h-6 w-6 text-green-400" />
                  <span className="text-white">Stay in character during roleplay</span>
                </div>
                <div className="flex items-center space-x-3">
                  <CheckCircle className="h-6 w-6 text-green-400" />
                  <span className="text-white">No metagaming or powergaming</span>
                </div>
                <div className="flex items-center space-x-3">
                  <CheckCircle className="h-6 w-6 text-green-400" />
                  <span className="text-white">Follow realistic character development</span>
                </div>
              </div>
              <div className="mt-8">
                <Button variant="outline" className="border-white/30 text-white hover:bg-white/10">
                  <FileCheck className="h-4 w-4 mr-2" />
                  Read Full Rules
                </Button>
              </div>
            </div>

            <Card className="bg-white/5 backdrop-blur-sm border-white/10">
              <CardHeader>
                <CardTitle className="text-white flex items-center space-x-2">
                  <Award className="h-6 w-6 text-yellow-400" />
                  <span>Community Standards</span>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="flex items-start space-x-3">
                  <Heart className="h-5 w-5 text-red-400 mt-1" />
                  <div>
                    <h4 className="text-white font-semibold">Respect & Inclusion</h4>
                    <p className="text-blue-100 text-sm">We welcome players from all backgrounds and promote an inclusive environment.</p>
                  </div>
                </div>
                <div className="flex items-start space-x-3">
                  <Star className="h-5 w-5 text-yellow-400 mt-1" />
                  <div>
                    <h4 className="text-white font-semibold">Quality Roleplay</h4>
                    <p className="text-blue-100 text-sm">We maintain high standards for roleplay quality and character development.</p>
                  </div>
                </div>
                <div className="flex items-start space-x-3">
                  <UserCheck className="h-5 w-5 text-green-400 mt-1" />
                  <div>
                    <h4 className="text-white font-semibold">Fair Play</h4>
                    <p className="text-blue-100 text-sm">Everyone gets equal opportunities to participate and enjoy the experience.</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-black/40 backdrop-blur-sm border-t border-white/10 py-12">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid md:grid-cols-3 gap-8">
            <div>
              <div className="flex items-center space-x-3 mb-4">
                <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-white font-bold">
                  PC
                </div>
                <span className="text-xl font-bold text-white">Prime City RP</span>
              </div>
              <p className="text-blue-100">
                Los Santos' premier roleplay community. Join hundreds of players in creating unforgettable stories and experiences.
              </p>
            </div>
            
            <div>
              <h4 className="text-white font-semibold mb-4">Community</h4>
              <div className="space-y-2">
                <div className="text-blue-100 hover:text-white cursor-pointer">Discord Server</div>
                <div className="text-blue-100 hover:text-white cursor-pointer">Community Forums</div>
                <div className="text-blue-100 hover:text-white cursor-pointer">Player Guide</div>
                <div className="text-blue-100 hover:text-white cursor-pointer">Support</div>
              </div>
            </div>
            
            <div>
              <h4 className="text-white font-semibold mb-4">Quick Links</h4>
              <div className="space-y-2">
                <div className="text-blue-100 hover:text-white cursor-pointer">Server Rules</div>
                <div className="text-blue-100 hover:text-white cursor-pointer">Application Status</div>
                <div className="text-blue-100 hover:text-white cursor-pointer">Whitelist Guide</div>
                <div className="text-blue-100 hover:text-white cursor-pointer">Contact Staff</div>
              </div>
            </div>
          </div>
          
          <div className="border-t border-white/10 mt-8 pt-8 text-center">
            <p className="text-blue-100">
              © 2024 Prime City RP. All rights reserved. Built with passion for the roleplay community.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}