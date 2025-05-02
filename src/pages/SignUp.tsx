import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { ArrowLeft, Eye, EyeOff, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useLanguage } from "@/contexts/LanguageContext";
import { useToast } from "@/components/ui/use-toast";

const SignUp = () => {
  const { toast } = useToast();
  const navigate = useNavigate();
  const { signup, loading } = useAuth();
  const { t } = useLanguage();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [errors, setErrors] = useState({
    name: '',
    email: '',
    password: ''
  });

  const validateForm = () => {
    let valid = true;
    const newErrors = { name: '', email: '', password: '' };

    if (!name.trim()) {
      newErrors.name = t("signup.errors.nameRequired");
      valid = false;
    } else if (name.length < 2) {
      newErrors.name = t("signup.errors.nameTooShort");
      valid = false;
    }

    if (!email.includes('@') || !email.includes('.')) {
      newErrors.email = t("signup.errors.invalidEmail");
      valid = false;
    }

    if (password.length < 6) {
      newErrors.password = t("signup.errors.passwordLength");
      valid = false;
    }

    setErrors(newErrors);
    return valid;
  };

  const handleNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    if (/^[a-zA-ZÀ-ÿ\s]*$/.test(value)) {
      setName(value);
      setErrors(prev => ({ ...prev, name: '' }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) return;
    
    try {
      await signup(name, email, password);
      toast({
        title: t("signup.successTitle"),
        description: t("signup.successMessage"),
      });
      navigate("/payment-plans");
    } catch (error) {
      toast({
        title: t("signup.errorTitle"),
        description: t("signup.errorMessage"),
        variant: "destructive",
      });
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
          
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-2">
              <label htmlFor="name" className="text-sm font-medium">
                {t("signup.fullName")}
              </label>
              <Input
                id="name"
                type="text"
                value={name}
                onChange={handleNameChange}
                placeholder={t("signup.fullNamePlaceholder")}
                required
                className="h-12"
              />
              {errors.name && <p className="text-sm text-red-500 mt-1">{errors.name}</p>}
            </div>
            
            <div className="space-y-2">
              <label htmlFor="email" className="text-sm font-medium">
                {t("login.email")}
              </label>
              <Input
                id="email"
                type="email"
                value={email}
                onChange={(e) => {
                  setEmail(e.target.value);
                  setErrors(prev => ({ ...prev, email: '' }));
                }}
                placeholder={t("login.emailPlaceholder")}
                required
                className="h-12"
              />
              {errors.email && <p className="text-sm text-red-500 mt-1">{errors.email}</p>}
            </div>
            
            <div className="space-y-2">
              <label htmlFor="password" className="text-sm font-medium">
                {t("login.password")}
              </label>
              <div className="relative">
                <Input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => {
                    setPassword(e.target.value);
                    setErrors(prev => ({ ...prev, password: '' }));
                  }}
                  placeholder={t("login.passwordPlaceholder")}
                  required
                  minLength={6}
                  className="h-12"
                />
                <button
                  type="button"
                  className="absolute right-3 top-3 text-gray-500 hover:text-gray-700"
                  onClick={() => setShowPassword(!showPassword)}
                  aria-label={showPassword ? "Hide password" : "Show password"}
                >
                  {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
              {errors.password && <p className="text-sm text-red-500 mt-1">{errors.password}</p>}
              <p className="text-xs text-gray-500">
                {t("signup.passwordRequirement")}
              </p>
            </div>
            
            <Button 
              type="submit" 
              className="w-full h-12" 
              disabled={loading}
              aria-busy={loading}
            >
              {loading ? (
                <div className="flex items-center justify-center gap-2">
                  <Loader2 className="h-4 w-4 animate-spin" />
                  {t("signup.creatingAccount")}
                </div>
              ) : (
                t("signup.createAccountButton")
              )}
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
      <div className="hidden lg:block relative bg-cover bg-center">
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