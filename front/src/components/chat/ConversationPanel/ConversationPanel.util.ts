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
    "back",
    "title",
    "meta",
    "listingLink",
    "thread",
    "push",
    "empty",
    "message",
    "messageBody",
    "messageMeta",
    "composer",
    "composerInput",
  ],
);
