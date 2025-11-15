import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { TrendingUp } from "lucide-react";
import { useNavigate } from "react-router-dom";

const WhatsNew = () => {
  const navigate = useNavigate();
  const handleClick = () => {
    navigate("/mobile");
  };

  return (
    <Card className="bg-white shadow-md p-4">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-xl font-semibold">
          <TrendingUp />
          What's New
        </CardTitle>
        <div className="text-md">PassVault Goes Mobile!</div>
      </CardHeader>
      <CardContent>
        <p>
          Enjoy safety on the go with our brand-new mobile experience. Access
          your secure credentials anytime, anywhere! Available for iOS and
          Android.
        </p>
      </CardContent>
      <CardContent className="text-sm text-muted-foreground">
        <button
          onClick={handleClick}
          className="relative inline-block cursor-pointer font-medium group"
        >
          Check it out now
          <span className="absolute left-0 -bottom-0.5 h-0.5 w-0 bg-current transition-all duration-300 group-hover:w-full"></span>
        </button>
      </CardContent>
    </Card>
  );
};

export default WhatsNew;
