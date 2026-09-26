import type { Dictionary } from "@/i18n/types";
import { createComponentClasses } from "@/lib/mui/componentClasses";

export type ChatCopy = Dictionary["chat"];

export const conversationPanelClasses = createComponentClasses(
  "ConversationPanel",
  [
    "root",
    "context",
    "contextBody",
    "thread",
    "empty",
    "message",
    "messageBody",
    "messageMeta",
    "composer",
    "composerInput",
    "hint",
  ],
);
