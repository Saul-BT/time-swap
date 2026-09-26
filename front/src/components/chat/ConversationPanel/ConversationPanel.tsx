"use client";

import Button from "@mui/material/Button";
import { type FormEvent, useEffect, useId, useRef, useState } from "react";
import type { ChatMessage } from "@/data/types";
import {
  ConversationPanelBack,
  ConversationPanelBar,
  ConversationPanelComposer,
  ConversationPanelComposerInput,
  ConversationPanelEmpty,
  ConversationPanelListingLink,
  ConversationPanelMessage,
  ConversationPanelMessageBody,
  ConversationPanelMessageMeta,
  ConversationPanelMeta,
  ConversationPanelPush,
  ConversationPanelRoot,
  ConversationPanelRow,
  ConversationPanelThread,
  ConversationPanelTitle,
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
  }, [messages]);

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
      <ConversationPanelBar className={conversationPanelClasses.bar}>
        <ConversationPanelRow className={conversationPanelClasses.row}>
          <ConversationPanelBack
            className={conversationPanelClasses.back}
            href={backHref}
          >
            {copy.backToInbox}
          </ConversationPanelBack>
          <ConversationPanelMeta
            className={conversationPanelClasses.meta}
            variant="body2"
            color="textSecondary"
          >
            {peerName}
            {" · "}
            {listingHours}
          </ConversationPanelMeta>
        </ConversationPanelRow>
        <ConversationPanelRow className={conversationPanelClasses.row}>
          <ConversationPanelTitle
            className={conversationPanelClasses.title}
            variant="h4"
            component="h1"
          >
            {listingTitle}
          </ConversationPanelTitle>
          <ConversationPanelListingLink
            className={conversationPanelClasses.listingLink}
            href={listingHref}
          >
            {copy.openListing}
          </ConversationPanelListingLink>
        </ConversationPanelRow>
      </ConversationPanelBar>

      <ConversationPanelThread
        ref={threadRef}
        className={conversationPanelClasses.thread}
        aria-label={copy.messagesLabel}
      >
        {messages.length === 0 ? (
          <ConversationPanelEmpty className={conversationPanelClasses.empty}>
            {copy.emptyThread}
          </ConversationPanelEmpty>
        ) : (
          <>
            <ConversationPanelPush
              className={conversationPanelClasses.push}
              aria-hidden
            />
            {messages.map((message) => (
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
            ))}
          </>
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
    </ConversationPanelRoot>
  );
}
