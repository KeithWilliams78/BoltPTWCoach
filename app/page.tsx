import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { ArrowRight, BookOpen, Target, TrendingUp } from "lucide-react";
import Link from "next/link";

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50">
      {/* Navigation */}
      <nav className="border-b bg-white/80 backdrop-blur-sm sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-2">
              <Target className="h-8 w-8 text-blue-600" />
              <span className="text-xl font-bold text-gray-900">AI Strategy Coach</span>
            </div>
            <div className="flex items-center space-x-4">
              <Link href="/app">
                <Button variant="outline">Get Started</Button>
              </Link>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto text-center">
          <div className="mb-8">
            <h1 className="text-4xl sm:text-6xl font-bold text-gray-900 mb-6">
              Master the Art of
              <span className="text-blue-600 block">Strategic Thinking</span>
            </h1>
            <p className="text-xl text-gray-600 mb-8 max-w-3xl mx-auto leading-relaxed">
              Build winning strategies using the proven <strong>"Playing to Win"</strong> framework. 
              Our AI coach guides you through five critical strategic choices that separate 
              winners from everyone else.
            </p>
          </div>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center mb-16">
            <Link href="/app">
              <Button size="lg" className="text-lg px-8 py-3 h-auto">
                Start Your Strategy
                <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
            </Link>
            <a 
              href="https://amazon.com/Playing-Win-Strategy-Really-Works/dp/142218739X" 
              target="_blank" 
              rel="noopener noreferrer"
            >
              <Button variant="outline" size="lg" className="text-lg px-8 py-3 h-auto">
                <BookOpen className="mr-2 h-5 w-5" />
                Get the Book
              </Button>
            </a>
          </div>

          {/* Feature Cards */}
          <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
            <Card className="border-0 shadow-lg bg-white/50 backdrop-blur-sm hover:shadow-xl transition-all duration-300">
              <CardHeader className="text-center pb-4">
                <div className="mx-auto w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mb-4">
                  <Target className="h-6 w-6 text-blue-600" />
                </div>
                <CardTitle className="text-xl">Strategic Framework</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription className="text-center text-base">
                  Follow the proven 5-choice cascade: Winning Aspiration, Where to Play, 
                  How to Win, Core Capabilities, and Management Systems.
                </CardDescription>
              </CardContent>
            </Card>

            <Card className="border-0 shadow-lg bg-white/50 backdrop-blur-sm hover:shadow-xl transition-all duration-300">
              <CardHeader className="text-center pb-4">
                <div className="mx-auto w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mb-4">
                  <TrendingUp className="h-6 w-6 text-green-600" />
                </div>
                <CardTitle className="text-xl">AI-Powered Coaching</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription className="text-center text-base">
                  Get intelligent feedback and challenging questions that help you 
                  think deeper about your strategic choices.
                </CardDescription>
              </CardContent>
            </Card>

            <Card className="border-0 shadow-lg bg-white/50 backdrop-blur-sm hover:shadow-xl transition-all duration-300">
              <CardHeader className="text-center pb-4">
                <div className="mx-auto w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center mb-4">
                  <BookOpen className="h-6 w-6 text-purple-600" />
                </div>
                <CardTitle className="text-xl">Export & Share</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription className="text-center text-base">
                  Generate professional PDF reports of your strategy cascade 
                  with AI coach insights for team alignment.
                </CardDescription>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* What is Playing to Win Section */}
      <section className="py-16 px-4 sm:px-6 lg:px-8 bg-white">
        <div className="max-w-4xl mx-auto">
          <Card className="border-0 shadow-xl">
            <CardHeader className="text-center">
              <CardTitle className="text-3xl mb-4">What is "Playing to Win"?</CardTitle>
            </CardHeader>
            <CardContent className="prose prose-lg max-w-none">
              <p className="text-gray-600 text-lg leading-relaxed mb-6">
                <strong>"Playing to Win"</strong> is a strategic framework developed by former P&G CEO 
                A.G. Lafley and strategy expert Roger Martin. It transforms strategy from abstract 
                concepts into five concrete, interconnected choices that every organization must make.
              </p>
              <p className="text-gray-600 text-lg leading-relaxed mb-6">
                The framework has been successfully applied by Fortune 500 companies to create 
                breakthrough strategies that deliver sustainable competitive advantage. Now, 
                with AI-powered coaching, you can apply these same principles to your business.
              </p>
              <div className="text-center mt-8">
                <Link href="/app">
                  <Button size="lg" className="text-lg px-8 py-3 h-auto">
                    Start Building Your Strategy
                    <ArrowRight className="ml-2 h-5 w-5" />
                  </Button>
                </Link>
              </div>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <div className="flex items-center justify-center space-x-2 mb-4">
              <Target className="h-6 w-6" />
              <span className="text-lg font-semibold">AI Strategy Coach</span>
            </div>
            <p className="text-gray-400">
              Master strategic thinking with AI-powered coaching
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}