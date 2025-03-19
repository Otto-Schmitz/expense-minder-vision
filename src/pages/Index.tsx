
import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { ArrowRight, CheckCircle, CreditCard, Zap } from "lucide-react";
import { Button } from "@/components/ui/button";
import Navbar from "@/components/Navbar";

const Index = () => {
  const { isAuthenticated } = useAuth();
  const [showAnimation, setShowAnimation] = useState(false);
  
  // Initialize animation after a small delay for smoother appearance
  useEffect(() => {
    const timer = setTimeout(() => {
      setShowAnimation(true);
    }, 100);
    
    return () => clearTimeout(timer);
  }, []);

  return (
    <div className="min-h-screen">
      <Navbar />
      
      <main className="pt-16">
        {/* Hero Section */}
        <section className="relative py-20 md:py-28 overflow-hidden">
          <div className="absolute inset-0 pointer-events-none">
            <div className="absolute -right-5 top-[10%] w-72 h-72 bg-primary/10 rounded-full blur-3xl opacity-70"></div>
            <div className="absolute -left-10 bottom-[20%] w-60 h-60 bg-blue-400/10 rounded-full blur-3xl opacity-70"></div>
          </div>
          
          <div className="container mx-auto px-4 relative">
            <div className="max-w-3xl mx-auto text-center">
              <div className={`transition-all duration-700 ${showAnimation ? "opacity-100 translate-y-0" : "opacity-0 translate-y-5"}`}>
                <span className="inline-block py-1 px-3 mb-4 bg-primary/10 text-primary rounded-full text-sm font-medium">
                  Effortless Expense Tracking
                </span>
                <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold leading-tight mb-6">
                  Manage expenses with AI-powered precision
                </h1>
                <p className="text-lg md:text-xl text-gray-600 mb-8 md:mb-10">
                  Track, analyze, and organize your expenses using intelligent invoice scanning. Get valuable insights into your spending habits.
                </p>
                
                <div className="flex flex-col sm:flex-row gap-4 justify-center">
                  <Button size="lg" asChild className="h-12 px-8 btn-hover">
                    <Link to={isAuthenticated ? "/dashboard" : "/signup"}>
                      {isAuthenticated ? "View Dashboard" : "Get Started"} 
                      <ArrowRight className="ml-2" size={18} />
                    </Link>
                  </Button>
                  <Button size="lg" variant="outline" asChild className="h-12 px-8 btn-hover">
                    <Link to="/login">
                      {isAuthenticated ? "Upload Invoice" : "Sign In"}
                    </Link>
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </section>
        
        {/* Features Section */}
        <section className="py-20 bg-gray-50">
          <div className="container mx-auto px-4">
            <div className="max-w-3xl mx-auto text-center mb-16">
              <span className="inline-block py-1 px-3 mb-4 bg-primary/10 text-primary rounded-full text-sm font-medium">
                Key Features
              </span>
              <h2 className="text-3xl md:text-4xl font-bold mb-6">
                Smart expense management made simple
              </h2>
              <p className="text-lg text-gray-600">
                Our intelligent platform simplifies financial tracking and provides insightful analytics.
              </p>
            </div>
            
            <div className="grid md:grid-cols-3 gap-8">
              <div className="glass-card rounded-xl p-6 flex flex-col items-center text-center animate-slide-in">
                <div className="w-14 h-14 bg-primary/10 rounded-full flex items-center justify-center text-primary mb-5">
                  <CreditCard size={24} />
                </div>
                <h3 className="text-xl font-semibold mb-3">AI-Powered Scanning</h3>
                <p className="text-gray-600">
                  Instantly extract and categorize data from receipts and invoices with advanced AI technology.
                </p>
              </div>
              
              <div className="glass-card rounded-xl p-6 flex flex-col items-center text-center animate-slide-in" style={{ animationDelay: "100ms" }}>
                <div className="w-14 h-14 bg-primary/10 rounded-full flex items-center justify-center text-primary mb-5">
                  <Zap size={24} />
                </div>
                <h3 className="text-xl font-semibold mb-3">Real-Time Dashboard</h3>
                <p className="text-gray-600">
                  Visualize your spending patterns and financial health with interactive charts and reports.
                </p>
              </div>
              
              <div className="glass-card rounded-xl p-6 flex flex-col items-center text-center animate-slide-in" style={{ animationDelay: "200ms" }}>
                <div className="w-14 h-14 bg-primary/10 rounded-full flex items-center justify-center text-primary mb-5">
                  <CheckCircle size={24} />
                </div>
                <h3 className="text-xl font-semibold mb-3">Simplified Organization</h3>
                <p className="text-gray-600">
                  Keep all your financial documents organized in one secure, easily accessible location.
                </p>
              </div>
            </div>
          </div>
        </section>
        
        {/* Call to Action */}
        <section className="py-20">
          <div className="container mx-auto px-4">
            <div className="max-w-4xl mx-auto glass-card rounded-xl p-8 md:p-12 text-center">
              <h2 className="text-2xl md:text-3xl font-bold mb-4">
                Ready to transform your expense management?
              </h2>
              <p className="text-lg text-gray-600 mb-8">
                Join thousands of users who have simplified their financial tracking.
              </p>
              <Button size="lg" asChild className="h-12 px-8 btn-hover">
                <Link to={isAuthenticated ? "/dashboard" : "/signup"}>
                  {isAuthenticated ? "View Dashboard" : "Get Started Today"}
                </Link>
              </Button>
            </div>
          </div>
        </section>
      </main>
      
      {/* Footer */}
      <footer className="bg-gray-50 py-12">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="mb-6 md:mb-0">
              <div className="flex items-center space-x-2">
                <div className="w-8 h-8 bg-primary rounded-md flex items-center justify-center">
                  <span className="text-white font-semibold text-lg">E</span>
                </div>
                <span className="font-medium text-xl">ExpenseMinder</span>
              </div>
              <p className="text-sm text-gray-500 mt-2">
                Simplifying expense management
              </p>
            </div>
            
            <div className="flex space-x-6">
              <Link to="/login" className="text-gray-600 hover:text-primary transition-colors">
                Sign In
              </Link>
              <Link to="/signup" className="text-gray-600 hover:text-primary transition-colors">
                Sign Up
              </Link>
              <a href="#" className="text-gray-600 hover:text-primary transition-colors">
                Privacy
              </a>
              <a href="#" className="text-gray-600 hover:text-primary transition-colors">
                Terms
              </a>
            </div>
          </div>
          <div className="border-t border-gray-200 mt-8 pt-8 text-center text-sm text-gray-500">
            <p>© {new Date().getFullYear()} ExpenseMinder. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Index;
