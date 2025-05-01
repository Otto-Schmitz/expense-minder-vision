
import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useLanguage } from "@/contexts/LanguageContext";

const SignUp = () => {
  const navigate = useNavigate();
  const { signup, loading } = useAuth();
  const { t } = useLanguage();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      await signup(name, email, password);
      // Redirect to payment plans page instead of dashboard
      navigate("/payment-plans");
    } catch (error) {
      // Error is handled in the auth context
      console.error("Signup error:", error);
    }
  };

  return (
    <div className="min-h-screen grid lg:grid-cols-2">
      {/* Left Side - Form */}
      <div className="flex flex-col justify-center py-12 px-4 sm:px-6 lg:px-20 xl:px-24">
        <div className="mx-auto w-full max-w-sm">
          <div className="mb-10">
            <Link 
              to="/" 
              className="inline-flex items-center text-sm text-gray-500 hover:text-gray-700 transition-colors"
            >
              <ArrowLeft size={16} className="mr-1" />
              {t("home.hero.getStarted")}
            </Link>
          </div>
          
          <div className="text-center mb-10">
            <h2 className="text-3xl font-bold">{t("signup.createAccount")}</h2>
            <p className="text-gray-600 mt-2">{t("signup.getStarted")}</p>
          </div>
          
          <form onSubmit={handleSubmit} className="space-y-6 animate-slide-in">
            <div className="space-y-2">
              <label htmlFor="name" className="text-sm font-medium">
                {t("signup.fullName")}
              </label>
              <Input
                id="name"
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder={t("signup.fullNamePlaceholder")}
                required
                className="h-12"
              />
            </div>
            
            <div className="space-y-2">
              <label htmlFor="email" className="text-sm font-medium">
                {t("login.email")}
              </label>
              <Input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder={t("login.emailPlaceholder")}
                required
                className="h-12"
              />
            </div>
            
            <div className="space-y-2">
              <label htmlFor="password" className="text-sm font-medium">
                {t("login.password")}
              </label>
              <Input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder={t("login.passwordPlaceholder")}
                required
                minLength={6}
                className="h-12"
              />
              <p className="text-xs text-gray-500">
                {t("signup.passwordRequirement")}
              </p>
            </div>
            
            <Button type="submit" className="w-full h-12" disabled={loading}>
              {loading ? t("signup.creatingAccount") : t("signup.createAccountButton")}
            </Button>
            
            <div className="text-center text-sm">
              <p className="text-gray-600">
                {t("signup.haveAccount")}{" "}
                <Link to="/login" className="text-primary hover:text-primary/90 font-medium">
                  {t("nav.signIn")}
                </Link>
              </p>
            </div>
          </form>
        </div>
      </div>
      
      {/* Right Side - Image/Design */}
      <div className="hidden lg:block relative">
        <div className="absolute inset-0 bg-gradient-to-br from-primary/90 to-blue-700 opacity-90"></div>
        <div className="absolute inset-0 flex flex-col items-center justify-center text-white p-12">
          <div className="w-full max-w-md text-center">
            <h3 className="text-2xl font-bold mb-4">{t("signup.sidebarTitle")}</h3>
            <p className="text-white/80">
              {t("signup.sidebarDescription")}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SignUp;
