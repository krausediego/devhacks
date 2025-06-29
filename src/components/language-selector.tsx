import { useTranslation } from "react-i18next";

import { useLocalStorage } from "@/hooks/use-local-storage";

import { Button } from "./ui/button";
import { Popover, PopoverContent, PopoverTrigger } from "./ui/popover";

const LanguageSelector = () => {
  const { i18n } = useTranslation();
  const [language, setLanguage] = useLocalStorage<string>("language", "pt");

  const handleChangeLanguage = (lang: "en" | "pt") => {
    setLanguage(lang);
    i18n.changeLanguage(lang);
  };

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button size="flag" variant="ghost">
          <img src={language === "pt" ? "brazil-flag.svg" : "eua-flag.svg"} />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="flex w-12 flex-col items-center justify-center gap-2 border px-0 py-2">
        <Button
          onClick={() => handleChangeLanguage("pt")}
          size="flag"
          variant="ghost"
        >
          <img src="brazil-flag.svg" />
        </Button>
        <Button
          onClick={() => handleChangeLanguage("en")}
          size="flag"
          variant="ghost"
        >
          <img src="eua-flag.svg" />
        </Button>
      </PopoverContent>
    </Popover>
  );
};

export { LanguageSelector };
