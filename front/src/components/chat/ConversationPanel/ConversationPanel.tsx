"use client";

import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Typography from "@mui/material/Typography";
import { type FormEvent, useEffect, useId, useRef, useState } from "react";
import type { ChatMessage } from "@/data/types";
import {
  ConversationPanelBar,
  ConversationPanelComposer,
  ConversationPanelComposerInput,
  ConversationPanelEmpty,
  ConversationPanelLink,
  ConversationPanelMessage,
  ConversationPanelRoot,
  ConversationPanelRow,
  ConversationPanelThread,
  ConversationPanelTitle,
} from "./ConversationPanel.style";
import {
  type ChatCopy,
  conversationPanelClasses as classes,
} from "./ConversationPanel.util";

export type ConversationPanelProps = {
  peerName: string;
  listingTitle: string;
  listingHours: string;
  listingHref: string;
  backHref: string;
  initialMessages: readonly ChatMessage[];
  copy: ChatCopy;
};

export default function ConversationPanel({
  peerName,
  listingTitle,
  listingHours,
  listingHref,
  backHref,
  initialMessages,
  copy,
}: ConversationPanelProps) {
  const [messages, setMessages] = useState<ChatMessage[]>([...initialMessages]);
  const [draft, setDraft] = useState("");
  const inputId = useId();
  const threadRef = useRef<HTMLUListElement>(null);

  useEffect(() => {
    const node = threadRef.current;
    if (
      !node ||
      messages.length === 0 ||
      node.scrollHeight <= node.clientHeight
    ) {
      return;
    }
    node.scrollTop = node.scrollHeight;
  }, [messages.length]);

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
    <ConversationPanelRoot className={classes.root}>
      <ConversationPanelBar className={classes.bar}>
        <ConversationPanelRow className={classes.row}>
          <ConversationPanelLink
            className={classes.link}
            href={backHref}
            ownerState={{ tone: "accent" }}
          >
            {copy.backToInbox}
          </ConversationPanelLink>
          <Typography
            variant="body2"
            color="textSecondary"
            sx={{ flexShrink: 0, ml: "auto" }}
          >
            {peerName}
            {" · "}
            {listingHours}
          </Typography>
        </ConversationPanelRow>
        <ConversationPanelRow className={classes.row}>
          <ConversationPanelTitle
            className={classes.title}
            variant="h4"
            component="h1"
          >
            {listingTitle}
          </ConversationPanelTitle>
          <ConversationPanelLink
            className={classes.link}
            href={listingHref}
            ownerState={{ tone: "ink" }}
          >
            {copy.openListing}
          </ConversationPanelLink>
        </ConversationPanelRow>
      </ConversationPanelBar>

      <ConversationPanelThread
        ref={threadRef}
        className={classes.thread}
        aria-label={copy.messagesLabel}
      >
        {messages.length === 0 ? (
          <ConversationPanelEmpty className={classes.empty}>
            {copy.emptyThread}
          </ConversationPanelEmpty>
        ) : (
          messages.map((message, index) => (
            <ConversationPanelMessage
              key={message.id}
              className={classes.message}
              ownerState={{ from: message.from, lead: index === 0 }}
            >
              <Box className={classes.messageBody}>{message.body}</Box>
              <Typography variant="caption" component="p" color="textSecondary">
                {message.sentAt}
              </Typography>
            </ConversationPanelMessage>
          ))
        )}
      </ConversationPanelThread>

      <ConversationPanelComposer
        className={classes.composer}
        onSubmit={handleSubmit}
      >
        <ConversationPanelComposerInput
          className={classes.composerInput}
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
    </ConversationPanelRoot>
  );
}
