import {
  House,
  type LucideIcon,
  MessageCircle,
  Plus,
  Search,
  User,
} from "lucide-react";
import type { MemberNavId } from "@/data/types";
import { createComponentClasses } from "@/lib/mui/componentClasses";

export const MEMBER_NAV_ICON: Record<MemberNavId, LucideIcon> = {
  home: House,
  discover: Search,
  publish: Plus,
  messages: MessageCircle,
  profile: User,
};

export const memberTabBarClasses = createComponentClasses("MemberTabBar", [
  "root",
  "list",
  "item",
  "tab",
  "badge",
]);
