import { useTranslation } from "react-i18next";
import { HiInbox, HiMiniBell, HiMiniHome } from "react-icons/hi2";
import { Link } from "react-router";

import {
  CommandDialog,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "./ui/command";

interface SearchDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const SearchDialog = ({ open, onOpenChange }: SearchDialogProps) => {
  const { t } = useTranslation();

  return (
    <CommandDialog open={open} onOpenChange={onOpenChange}>
      <CommandInput placeholder="Type a command or search..." />
      <CommandList>
        <CommandEmpty>No results found.</CommandEmpty>
        <CommandGroup heading="Suggestions">
          <CommandItem>
            <HiMiniHome />
            <Link to="/">{t("sidebar.home")}</Link>
          </CommandItem>
          <CommandItem>
            <HiInbox />
            <Link to="/inbox">{t("sidebar.inbox")}</Link>
          </CommandItem>
          <CommandItem>
            <HiMiniBell />
            <Link to="/notifications">{t("sidebar.notifications")}</Link>
          </CommandItem>
        </CommandGroup>
      </CommandList>
    </CommandDialog>
  );
};

export { SearchDialog };
