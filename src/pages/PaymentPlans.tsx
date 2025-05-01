
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { Check, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { useLanguage } from "@/contexts/LanguageContext";

interface PlanProps {
  title: string;
  price: string;
  description: string;
  features: string[];
  recommended?: boolean;
}

const PaymentPlans = () => {
  const { t } = useLanguage();
  const navigate = useNavigate();
  const [selectedPlan, setSelectedPlan] = useState<string | null>(null);
  
  const plans: PlanProps[] = [
    {
      title: t("plans.basic.title") || "Basic",
      price: "R$29,90",
      description: t("plans.basic.description") || "Good for individuals tracking personal expenses",
      features: [
        t("plans.basic.features.uploads") || "10 uploads per month",
        t("plans.basic.features.reports") || "Basic expense reports",
        t("plans.basic.features.export") || "CSV export",
      ]
    },
    {
      title: t("plans.pro.title") || "Pro",
      price: "R$59,90",
      description: t("plans.pro.description") || "Perfect for freelancers and professionals",
      features: [
        t("plans.pro.features.uploads") || "Unlimited uploads",
        t("plans.pro.features.analytics") || "Advanced analytics",
        t("plans.pro.features.categories") || "Custom categories",
        t("plans.pro.features.export") || "PDF & Excel export",
      ],
      recommended: true
    },
    {
      title: t("plans.enterprise.title") || "Enterprise",
      price: "R$149,90",
      description: t("plans.enterprise.description") || "For teams and businesses",
      features: [
        t("plans.enterprise.features.users") || "Multiple user accounts",
        t("plans.enterprise.features.integration") || "Accounting software integration",
        t("plans.enterprise.features.support") || "Priority support",
        t("plans.enterprise.features.api") || "API access",
        t("plans.enterprise.features.customization") || "Advanced customization",
      ]
    }
  ];

  const handlePlanSelection = (planTitle: string) => {
    setSelectedPlan(planTitle);
  };

  const handleContinue = () => {
    if (!selectedPlan) {
      toast.error(t("plans.errors.selectPlan") || "Please select a plan to continue");
      return;
    }
    
    // In a real implementation, you would process the plan selection
    // and possibly redirect to a payment processor
    toast.success(t("plans.success.selected") || `${selectedPlan} plan selected!`);
    
    // For now, just redirect to the dashboard
    navigate("/dashboard");
  };
  
  const handleSkip = () => {
    navigate("/dashboard");
  };

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4">
      <div className="max-w-7xl mx-auto text-center">
        <h1 className="text-4xl font-bold text-gray-900 mb-6">
          {t("plans.header.title") || "Choose Your Plan"}
        </h1>
        <p className="text-xl text-gray-600 max-w-3xl mx-auto mb-12">
          {t("plans.header.subtitle") || "Select the plan that best fits your needs to get started with ExpenseMinder"}
        </p>
        
        <div className="grid md:grid-cols-3 gap-8 mb-12">
          {plans.map((plan) => (
            <Card 
              key={plan.title}
              className={`border-2 transition-all ${
                selectedPlan === plan.title 
                  ? "border-primary shadow-lg transform scale-105" 
                  : plan.recommended 
                    ? "border-blue-200" 
                    : "border-gray-200"
              }`}
            >
              {plan.recommended && (
                <div className="bg-primary text-white text-sm font-medium py-1 px-4 absolute top-0 right-0 rounded-bl-lg rounded-tr-lg">
                  {t("plans.recommended") || "Recommended"}
                </div>
              )}
              <CardHeader>
                <CardTitle className="text-2xl">{plan.title}</CardTitle>
                <div className="text-3xl font-bold my-3">{plan.price}</div>
                <CardDescription>{plan.description}</CardDescription>
              </CardHeader>
              <CardContent>
                <ul className="space-y-3 text-left">
                  {plan.features.map((feature, i) => (
                    <li key={i} className="flex items-start">
                      <span className="mr-2 mt-0.5 text-green-500 flex-shrink-0">
                        <Check size={16} />
                      </span>
                      <span>{feature}</span>
                    </li>
                  ))}
                </ul>
              </CardContent>
              <CardFooter>
                <Button 
                  variant={selectedPlan === plan.title ? "default" : "outline"}
                  className="w-full"
                  onClick={() => handlePlanSelection(plan.title)}
                >
                  {selectedPlan === plan.title 
                    ? t("plans.buttons.selected") || "Selected" 
                    : t("plans.buttons.select") || "Select Plan"}
                </Button>
              </CardFooter>
            </Card>
          ))}
        </div>
        
        <div className="flex flex-col md:flex-row items-center justify-center gap-4">
          <Button onClick={handleContinue} className="px-8">
            {t("plans.buttons.continue") || "Continue"}
            <ArrowRight size={16} className="ml-2" />
          </Button>
          <Button variant="ghost" onClick={handleSkip}>
            {t("plans.buttons.skip") || "Skip for now"}
          </Button>
        </div>
      </div>
    </div>
  );
};

export default PaymentPlans;
