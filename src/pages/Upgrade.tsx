import { Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

const Upgrade = () => {
  const plans = [
    {
      name: "Free",
      price: "$0",
      description: "Perfect for getting started",
      features: [
        "Up to 3 projects",
        "Basic features",
        "Community support",
        "1GB storage",
      ],
      cta: "Current Plan",
      variant: "outline" as const,
      popular: false,
    },
    {
      name: "Pro",
      price: "$29",
      period: "/month",
      description: "For professionals and growing teams",
      features: [
        "Unlimited projects",
        "Advanced features",
        "Priority support",
        "50GB storage",
        "Custom domain",
        "Analytics dashboard",
        "API access",
      ],
      cta: "Upgrade to Pro",
      variant: "default" as const,
      popular: true,
    },
    {
      name: "Enterprise",
      price: "Custom",
      description: "For large organizations",
      features: [
        "Everything in Pro",
        "Unlimited storage",
        "24/7 dedicated support",
        "Custom integrations",
        "SLA guarantee",
        "Advanced security",
        "Team management",
        "Audit logs",
      ],
      cta: "Contact Sales",
      variant: "outline" as const,
      popular: false,
    },
  ];

  return (
    <div className="min-h-screen">
      <div className="container mx-auto px-4 py-16">
        {/* Header */}
        <div className="text-center mb-16 animate-fade-in">
          <h1 className="text-5xl font-bold mb-4 bg-gradient-secondary bg-clip-text text-transparent">
            Choose Your Plan
          </h1>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Unlock powerful features and scale your projects with our flexible
            pricing plans
          </p>
        </div>

        {/* Pricing Cards */}
        <div className="grid md:grid-cols-3 gap-8 max-w-7xl mx-auto mb-16">
          {plans.map((plan, index) => {
            // force stable button text color so it doesn't flip on hover/variant
            const btnTextClass =
              plan.variant === "default"
                ? "text-primary-foreground hover:text-primary-foreground"
                : "text-foreground hover:text-foreground hover:bg-sidebar-hover cursor-pointer";

            return (
              <Card
                key={plan.name}
                className={`relative p-8 hover:shadow-lg transition-all duration-300 animate-scale-in ${
                  plan.popular
                    ? "border-primary border-2 md:scale-105 shadow-glow"
                    : "border-border"
                }`}
                style={{ animationDelay: `${index * 100}ms` }}
              >
                {plan.popular && (
                  <Badge className="absolute -top-3 left-1/2 -translate-x-1/2 bg-gradient-primary border-0 text-primary-foreground">
                    Most Popular
                  </Badge>
                )}

                <div className="mb-6">
                  <h3 className="text-2xl font-bold mb-2">{plan.name}</h3>
                  <p className="text-muted-foreground text-sm mb-4">
                    {plan.description}
                  </p>
                  <div className="flex items-baseline gap-1">
                    <span className="text-4xl font-bold">{plan.price}</span>
                    {plan.period && (
                      <span className="text-muted-foreground">
                        {plan.period}
                      </span>
                    )}
                  </div>
                </div>

                <Button
                  className={`w-full mb-6 ${
                    plan.popular ? "shadow-glow" : ""
                  } ${btnTextClass}`}
                  variant={plan.variant}
                  size="lg"
                >
                  {plan.cta}
                </Button>

                <div className="space-y-3">
                  {plan.features.map((feature) => (
                    <div key={feature} className="flex items-start gap-3">
                      <Check className="h-5 w-5 text-primary shrink-0 mt-0.5" />
                      <span className="text-sm">{feature}</span>
                    </div>
                  ))}
                </div>
              </Card>
            );
          })}
        </div>

        {/* FAQ Section */}
        <div className="max-w-3xl mx-auto animate-fade-in">
          <h2 className="text-3xl font-bold text-center mb-8">
            Frequently Asked Questions
          </h2>
          <div className="space-y-6">
            <Card className="p-6 animate-slide-up">
              <h3 className="font-semibold mb-2">Can I change plans later?</h3>
              <p className="text-muted-foreground">
                Yes, you can upgrade or downgrade your plan at any time. Changes
                will be reflected in your next billing cycle.
              </p>
            </Card>
            <Card
              className="p-6 animate-slide-up"
              style={{ animationDelay: "100ms" }}
            >
              <h3 className="font-semibold mb-2">
                What payment methods do you accept?
              </h3>
              <p className="text-muted-foreground">
                We accept all major credit cards, PayPal, and bank transfers for
                Enterprise plans.
              </p>
            </Card>
            <Card
              className="p-6 animate-slide-up"
              style={{ animationDelay: "200ms" }}
            >
              <h3 className="font-semibold mb-2">Is there a free trial?</h3>
              <p className="text-muted-foreground">
                Yes! All paid plans come with a 14-day free trial. No credit
                card required.
              </p>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Upgrade;
