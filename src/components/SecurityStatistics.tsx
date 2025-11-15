import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Frown, Meh, Smile, Shield } from "lucide-react";
import { useMemo } from "react";
import { usePasswords } from "@/context/PasswordContext";

const SecurityStatistics = () => {
  const { passwords } = usePasswords();

  // Ensure passwords is an array before reducing (defensive guard for runtime data shape)
  const list = useMemo(() => {
    return Array.isArray(passwords) ? passwords : [];
  }, [passwords]);

  const { strong, good, weak } = useMemo(() => {
    return list.reduce(
      (acc, example) => {
        switch (example?.passwordStrength) {
          case "Strong":
            acc.strong += 1;
            break;
          case "Good":
            acc.good += 1;
            break;
          case "Weak":
            acc.weak += 1;
            break;
        }
        return acc;
      },
      { strong: 0, good: 0, weak: 0 }
    );
  }, [list]);

  const safeTotal = list.length || 1; // avoid division by zero

  const strongPercent = (strong / safeTotal) * 100;
  const goodPercent = (good / safeTotal) * 100;
  const weakPercent = (weak / safeTotal) * 100;

  return (
    <Card className="bg-white shadow-md p-4">
      <CardHeader className="border-b">
        <CardTitle className="flex items-center gap-2 text-xl font-semibold">
          <Shield />
          Security
        </CardTitle>
        <div className="text-sm text-muted-foreground">
          Monitor and improve your password security
        </div>
      </CardHeader>
      <CardContent>
        <div className="h-6 flex rounded-md overflow-hidden bg-none">
          <div
            className="bg-[#FF718B]"
            style={{ width: `${weakPercent}%` }}
            title={`Weak: ${weak} (${weakPercent.toFixed(0)}%)`}
          />
          <div
            className="bg-[#FFEB3A]"
            style={{ width: `${goodPercent}%` }}
            title={`Good: ${good} (${goodPercent.toFixed(0)}%)`}
          />
          <div
            className="bg-[#7FE47E]"
            style={{ width: `${strongPercent}%` }}
            title={`Strong: ${strong} (${strongPercent.toFixed(0)}%)`}
          />
        </div>
      </CardContent>
      <CardContent className="flex items-center justify-between mt-2">
        <div className="flex flex-col items-center">
          <span className="text-muted-foreground">Weak</span>
          <div className="flex items-center gap-2 mt-2">
            <Frown color="#FF718B" />
            <p>{weak}</p>
          </div>
        </div>

        <div className="flex flex-col items-center">
          <span className="text-muted-foreground">Good</span>
          <div className="flex items-center gap-2 mt-2">
            <Meh color="#FFEB3A" />
            <p>{good}</p>
          </div>
        </div>

        <div className="flex flex-col items-center">
          <span className="text-muted-foreground">Secure</span>
          <div className="flex items-center gap-2 mt-2">
            <Smile color="#7FE47E" />
            <p>{strong}</p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default SecurityStatistics;
