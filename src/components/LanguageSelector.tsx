
import { useLanguage } from "@/contexts/LanguageContext";
import { Languages } from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

const LanguageSelector = () => {
  const { language, setLanguage, t } = useLanguage();

  return (
    <div className="flex items-center space-x-2">
      <Languages size={18} className="text-gray-500" />
      <Select value={language} onValueChange={(value: any) => setLanguage(value)}>
        <SelectTrigger className="h-9 w-[130px] border-none bg-transparent">
          <SelectValue />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="en-US">{t("language.english")}</SelectItem>
          <SelectItem value="pt-BR">{t("language.portuguese")}</SelectItem>
        </SelectContent>
      </Select>
    </div>
  );
};

export default LanguageSelector;
