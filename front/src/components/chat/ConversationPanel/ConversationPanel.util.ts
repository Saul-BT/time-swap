import type { Dictionary } from "@/i18n/types";
import { createComponentClasses } from "@/lib/mui/componentClasses";

export type ChatCopy = Dictionary["chat"];

export const conversationPanelClasses = createComponentClasses(
  "ConversationPanel",
  [
    "screen",
    "root",
    "bar",
    "row",
    "link",
    "title",
    "thread",
    "empty",
    "message",
    "messageBody",
    "composer",
    "composerInput",
  ],
);
