import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Copy,
  Star,
  Eye,
  EyeOff,
  Ellipsis,
  Meh,
  Frown,
  Smile,
} from "lucide-react";
import { useState } from "react";
import { CategoryMap } from "@/types/CategoryList";
import { toast } from "sonner";
import { usePasswords } from "@/context/PasswordContext";
import type { PasswordEntity } from "@/types/Passwords";

const PasswordCard = (props: PasswordEntity) => {
  const [visible, setVisible] = useState(true);
  const { toggleFavorite, markUsed } = usePasswords();
  const Icon = CategoryMap[props.category].icon;

  const handleCopy = async (value: string, label: string) => {
    try {
      await navigator.clipboard.writeText(value);
      toast.success(`${label} copied to clipboard`, {
        duration: 2000,
        position: "bottom-right",
      });

      try {
        await markUsed(props.id);
      } catch (err) {
        console.error("Failed to mark password as used:", err);
      }
    } catch (err) {
      console.error("Failed to copy to clipboard:", err);
      toast.error(`Failed to copy ${label}`);
    }
  };

  const strengthIcon = {
    Strong: <Smile color="#7FE47E" />,
    Good: <Meh color="#FFEB3A" />,
    Weak: <Frown color="#FF718B" />,
  }[props.passwordStrength] || <span className="text-gray-500">Unknown</span>;

  return (
    <Card className="bg-white shadow-md">
      <CardHeader className="h-3">
        <CardTitle>
          <div className="flex items-center justify-between">
            <div className="inline-flex items-center gap-2">
              <Icon className="w-5 h-5" />
              <span className="text-xl">{props.title}</span>
            </div>
            <div className="inline-flex items-center gap-2">
              <button
                className="cursor-pointer"
                onClick={() => toggleFavorite(props.id)}
              >
                <Star
                  className="w-5 h-5"
                  color={props.favorite ? "#FFEB3A" : undefined}
                  fill={props.favorite ? "#FFEB3A" : "none"}
                />
              </button>
              <Ellipsis className="w-5 h-5" />
            </div>
          </div>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="text-md text-muted-foreground mb-1">Username:</div>
        <div className="flex items-center gap-2">
          <div className="text-md font-semibold">{props.username}</div>
          <button
            onClick={() => handleCopy(props.username, "Username")}
            className="text-sm cursor-pointer"
          >
            <Copy className="inline h-4" />
          </button>
        </div>

        <div className="text-md text-muted-foreground">Password:</div>
        <div className="flex items-center gap-2">
          <span className="inline-flex items-center gap-2">
            <span className="text-md font-semibold">
              {visible ? "•".repeat(props.password.length) : props.password}
            </span>
            <button
              onClick={() => setVisible(!visible)}
              className="text-sm cursor-pointer"
            >
              {visible ? (
                <Eye className="inline h-4" />
              ) : (
                <EyeOff className="inline h-4" />
              )}
            </button>
          </span>
          <button
            onClick={() => handleCopy(props.password, "Password")}
            className="text-sm cursor-pointer"
          >
            <Copy className="inline h-4" />
          </button>
        </div>
        <div>{strengthIcon}</div>
      </CardContent>
    </Card>
  );
};
export default PasswordCard;
