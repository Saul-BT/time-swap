"use client";

import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import InputBase from "@mui/material/InputBase";
import Typography from "@mui/material/Typography";
import NextLink from "next/link";
import { type FormEvent, useEffect, useId, useRef, useState } from "react";
import type { ChatMessage } from "@/data/types";
import type { Dictionary } from "@/i18n/types";
import { rule, softRule } from "@/theme/rules";

const inset = { px: { xs: 3, md: 7 } };

const side = (from: ChatMessage["from"]) =>
  from === "self" ? "flex-end" : "flex-start";

export type ConversationPanelProps = {
  peerName: string;
  listingTitle: string;
  listingHours: string;
  listingHref: string;
  backHref: string;
  initialMessages: readonly ChatMessage[];
  copy: Dictionary["chat"];
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
  const threadRef = useRef<HTMLElement>(null);

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
    <Box
      sx={{ flex: 1, minHeight: 0, display: "flex", flexDirection: "column" }}
    >
      <Box
        sx={(theme) => ({
          ...inset,
          flexShrink: 0,
          display: "flex",
          flexDirection: "column",
          gap: 0.5,
          py: 2,
          borderBottom: softRule(theme),
          bgcolor: "background.paper",
        })}
      >
        <Box
          sx={{
            display: "flex",
            alignItems: "baseline",
            justifyContent: "space-between",
            flexWrap: "wrap",
            gap: 1,
            columnGap: 2,
            minWidth: 0,
          }}
        >
          <Box
            component={NextLink}
            href={backHref}
            sx={(theme) => ({
              ...theme.typography.subtitle2,
              flexShrink: 0,
              color: "primary.main",
              textDecoration: "none",
              "&:hover": { textDecoration: "underline" },
            })}
          >
            {copy.backToInbox}
          </Box>
          <Typography
            variant="body2"
            color="textSecondary"
            sx={{ flexShrink: 0, ml: "auto" }}
          >
            {peerName}
            {" · "}
            {listingHours}
          </Typography>
        </Box>
        <Box
          sx={{
            display: "flex",
            alignItems: "baseline",
            justifyContent: "space-between",
            flexWrap: "wrap",
            gap: 1,
            columnGap: 2,
            minWidth: 0,
          }}
        >
          <Typography
            variant="h4"
            component="h1"
            sx={{
              flex: "1 1 12rem",
              minWidth: 0,
              display: "-webkit-box",
              WebkitLineClamp: 2,
              WebkitBoxOrient: "vertical",
              overflow: "hidden",
            }}
          >
            {listingTitle}
          </Typography>
          <Box
            component={NextLink}
            href={listingHref}
            sx={(theme) => ({
              ...theme.typography.subtitle2,
              flexShrink: 0,
              color: "text.primary",
              textDecoration: "underline",
            })}
          >
            {copy.openListing}
          </Box>
        </Box>
      </Box>

      <Box
        component="ul"
        ref={threadRef}
        aria-label={copy.messagesLabel}
        sx={{
          ...inset,
          listStyle: "none",
          m: 0,
          flex: 1,
          minHeight: 0,
          overflow: "auto",
          display: "flex",
          flexDirection: "column",
          gap: 2,
          py: 2,
        }}
      >
        {messages.length === 0 ? (
          <Box
            component="li"
            sx={{ m: "auto", textAlign: "center", maxWidth: 420 }}
          >
            <Typography variant="body2" color="textSecondary">
              {copy.emptyThread}
            </Typography>
          </Box>
        ) : (
          messages.map((message, index) => (
            <Box
              key={message.id}
              component="li"
              sx={{
                display: "flex",
                flexDirection: "column",
                alignItems: side(message.from),
                alignSelf: side(message.from),
                gap: 0.5,
                maxWidth: "min(70%, 32rem)",
                mt: index === 0 ? "auto" : undefined,
              }}
            >
              <Box
                sx={(theme) => ({
                  p: 2,
                  border: rule(theme),
                  whiteSpace: "pre-wrap",
                  wordBreak: "break-word",
                  ...theme.typography.body2,
                  ...(message.from === "self"
                    ? {
                        bgcolor: "primary.main",
                        borderColor: "primary.main",
                        color: "primary.contrastText",
                      }
                    : { bgcolor: "background.paper" }),
                })}
              >
                {message.body}
              </Box>
              <Typography variant="caption" component="p" color="textSecondary">
                {message.sentAt}
              </Typography>
            </Box>
          ))
        )}
      </Box>

      <Box
        component="form"
        onSubmit={handleSubmit}
        sx={(theme) => ({
          ...inset,
          flexShrink: 0,
          display: "flex",
          alignItems: "stretch",
          bgcolor: "background.paper",
          borderTop: rule(theme),
        })}
      >
        <InputBase
          id={inputId}
          name="mensaje"
          value={draft}
          onChange={(event) => setDraft(event.target.value)}
          placeholder={copy.composerPlaceholder}
          inputProps={{ "aria-label": copy.composerLabel }}
          autoComplete="off"
          sx={(theme) => ({
            flex: 1,
            minWidth: 0,
            minHeight: theme.system.controlHeight,
            px: 2,
          })}
        />
        <Button type="submit" variant="contained" sx={{ px: 4 }}>
          {copy.send}
        </Button>
      </Box>
    </Box>
  );
}
