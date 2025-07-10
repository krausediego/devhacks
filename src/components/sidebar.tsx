import { ChevronDown } from "lucide-react";
import * as React from "react";
import { useTranslation } from "react-i18next";
import {
  HiInbox,
  HiMagnifyingGlass,
  HiMiniBell,
  HiMiniHome,
} from "react-icons/hi2";

import { SearchDialog } from "./search-dialog";
import { SidebarLink } from "./sidebar-link";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "./ui/accordion";

const Sidebar = () => {
  const [open, setOpen] = React.useState(false);

  const { t } = useTranslation();

  React.useEffect(() => {
    const down = (e: KeyboardEvent) => {
      if (e.key === "k" && (e.metaKey || e.ctrlKey)) {
        e.preventDefault();
        setOpen((open) => !open);
      }
    };
    document.addEventListener("keydown", down);
    return () => document.removeEventListener("keydown", down);
  }, []);

  return (
    <div className="bg-sidebar border-sidebar-border/50 h-screen w-full space-y-1.5 border-r px-4 py-4">
      <div className="flex items-center gap-2 px-4 pb-6">
        <div className="bg-foreground flex size-8 items-center justify-center rounded-xl">
          <span className="text-background">D</span>
        </div>
        <span className="text-sidebar-foreground truncate overflow-hidden font-semibold whitespace-nowrap">
          Dev Hacks
        </span>
        <ChevronDown className="text-muted-foreground size-4" />
      </div>

      <button
        onClick={() => setOpen(true)}
        className="text-muted-foreground hover:bg-sidebar-border/40 flex w-full cursor-pointer items-center gap-2 rounded-md px-5 py-2 font-medium"
      >
        <HiMagnifyingGlass className="text-muted-foreground/70 size-5" />
        <span className="truncate overflow-hidden whitespace-nowrap">
          {t("sidebar.search")}
        </span>
      </button>

      <SearchDialog open={open} onOpenChange={setOpen} />

      <SidebarLink
        to="/"
        Icon={<HiMiniHome className="text-muted-foreground/70 size-5" />}
      >
        {t("sidebar.home")}
      </SidebarLink>

      <SidebarLink
        to="/inbox"
        Icon={<HiInbox className="text-muted-foreground/70 size-5" />}
      >
        {t("sidebar.inbox")}
      </SidebarLink>

      <SidebarLink
        to="/notifications"
        Icon={<HiMiniBell className="text-muted-foreground/70 size-5" />}
      >
        {t("sidebar.notifications")}
      </SidebarLink>

      <Accordion type="single" defaultValue="productivity" collapsible>
        <AccordionItem value="productivity">
          <AccordionTrigger>
            <span className="text-muted-foreground/70">Productivity</span>
          </AccordionTrigger>
          <AccordionContent className="space-y-1.5">
            <SidebarLink
              to="/pomodoro"
              Icon={<span className="text-xl">🕜</span>}
            >
              Pomodoro
            </SidebarLink>

            <SidebarLink
              to="/kanban"
              Icon={<span className="text-xl">📝</span>}
            >
              Kanban
            </SidebarLink>
          </AccordionContent>
        </AccordionItem>
      </Accordion>
    </div>
  );
};

export { Sidebar };
