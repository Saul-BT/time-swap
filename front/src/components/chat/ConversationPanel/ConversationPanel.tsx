"use client";

import Button from "@mui/material/Button";
import Typography from "@mui/material/Typography";
import { type FormEvent, useId, useState } from "react";
import type { ChatMessage } from "@/data/types";
import {
  ConversationPanelComposer,
  ConversationPanelComposerInput,
  ConversationPanelContext,
  ConversationPanelContextBody,
  ConversationPanelEmpty,
  ConversationPanelHint,
  ConversationPanelMessage,
  ConversationPanelMessageBody,
  ConversationPanelMessageMeta,
  ConversationPanelRoot,
  ConversationPanelThread,
} from "./ConversationPanel.style";
import {
  type ChatCopy,
  conversationPanelClasses,
} from "./ConversationPanel.util";

export type ConversationPanelProps = {
  peerName: string;
  listingTitle: string;
  listingHours: string;
  listingHref: string;
  initialMessages: readonly ChatMessage[];
  copy: ChatCopy;
};

export default function ConversationPanel({
  peerName,
  listingTitle,
  listingHours,
  listingHref,
  initialMessages,
  copy,
}: ConversationPanelProps) {
  const [messages, setMessages] = useState<ChatMessage[]>([...initialMessages]);
  const [draft, setDraft] = useState("");
  const inputId = useId();

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const body = draft.trim();
    if (!body) return;

    setMessages((current) => [
      ...current,
      {
        id: `local-${current.length + 1}`,
        from: "self",
        body,
        sentAt: "Ahora",
      },
    ]);
    setDraft("");
  }

  return (
    <ConversationPanelRoot className={conversationPanelClasses.root}>
      <ConversationPanelContext
        className={conversationPanelClasses.context}
        href={listingHref}
        aria-label={copy.openListing}
      >
        <ConversationPanelContextBody
          className={conversationPanelClasses.contextBody}
        >
          <Typography variant="overline" component="p" color="textSecondary">
            {copy.listingLabel}
          </Typography>
          <Typography variant="h3" component="p">
            {listingTitle}
          </Typography>
          <Typography variant="subtitle2" color="textSecondary">
            {peerName}
            {" · "}
            {listingHours}
          </Typography>
        </ConversationPanelContextBody>
      </ConversationPanelContext>

      <ConversationPanelThread
        className={conversationPanelClasses.thread}
        aria-label={copy.messagesLabel}
      >
        {messages.length === 0 ? (
          <ConversationPanelEmpty className={conversationPanelClasses.empty}>
            {copy.emptyThread}
          </ConversationPanelEmpty>
        ) : (
          messages.map((message) => (
            <ConversationPanelMessage
              key={message.id}
              className={conversationPanelClasses.message}
              ownerState={{ from: message.from }}
            >
              <ConversationPanelMessageBody
                className={conversationPanelClasses.messageBody}
                ownerState={{ from: message.from }}
              >
                {message.body}
              </ConversationPanelMessageBody>
              <ConversationPanelMessageMeta
                className={conversationPanelClasses.messageMeta}
                variant="caption"
                component="p"
              >
                {message.sentAt}
              </ConversationPanelMessageMeta>
            </ConversationPanelMessage>
          ))
        )}
      </ConversationPanelThread>

      <ConversationPanelComposer
        className={conversationPanelClasses.composer}
        onSubmit={handleSubmit}
      >
        <ConversationPanelComposerInput
          className={conversationPanelClasses.composerInput}
          id={inputId}
          name="mensaje"
          value={draft}
          onChange={(event) => setDraft(event.target.value)}
          placeholder={copy.composerPlaceholder}
          inputProps={{ "aria-label": copy.composerLabel }}
          autoComplete="off"
        />
        <Button type="submit" variant="contained" sx={{ px: 4 }}>
          {copy.send}
        </Button>
      </ConversationPanelComposer>

      <ConversationPanelHint
        className={conversationPanelClasses.hint}
        variant="caption"
        component="p"
      >
        {copy.demoHint}
      </ConversationPanelHint>
    </ConversationPanelRoot>
  );
}
