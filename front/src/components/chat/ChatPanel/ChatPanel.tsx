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

const side = (from: ChatMessage["from"]) =>
  from === "self" ? "flex-end" : "flex-start";

export type ChatPanelProps = {
  peerName: string;
  listingTitle: string;
  listingSummary: string;
  listingHours: string;
  listingHref: string;
  backHref: string;
  initialMessages: readonly ChatMessage[];
  copy: Dictionary["chat"];
};

export default function ChatPanel({
  peerName,
  listingTitle,
  listingSummary,
  listingHours,
  listingHref,
  backHref,
  initialMessages,
  copy,
}: ChatPanelProps) {
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
          flexShrink: 0,
          display: "flex",
          alignItems: "baseline",
          gap: 2,
          px: { xs: 2, md: 3 },
          py: 1.5,
          borderBottom: rule(theme),
          bgcolor: "background.paper",
        })}
      >
        <Box
          component={NextLink}
          href={backHref}
          sx={(theme) => ({
            ...theme.typography.subtitle2,
            color: "primary.main",
            textDecoration: "none",
            "&:hover": { textDecoration: "underline" },
          })}
        >
          {copy.back}
        </Box>
        <Typography variant="h4" component="h1">
          {copy.threadTitle}
        </Typography>
      </Box>

      <Box
        sx={{
          flex: 1,
          minHeight: 0,
          display: "flex",
          flexDirection: { xs: "column", md: "row" },
        }}
      >
        <Box
          sx={(theme) => ({
            flexShrink: 0,
            display: "flex",
            flexDirection: "column",
            gap: 1,
            width: { md: 320 },
            p: { xs: 2, md: 3 },
            borderBottom: { xs: softRule(theme), md: "none" },
            borderRight: { md: softRule(theme) },
            bgcolor: "background.paper",
          })}
        >
          <Typography
            component={NextLink}
            href={listingHref}
            variant="h4"
            sx={{
              color: "inherit",
              textDecoration: "none",
              "&:hover": { textDecoration: "underline" },
            }}
          >
            {listingTitle}
          </Typography>
          <Typography variant="body2" color="textSecondary">
            {peerName}
            {" · "}
            {listingHours}
          </Typography>
          <Typography
            variant="body2"
            sx={{ display: { xs: "none", md: "block" } }}
          >
            {listingSummary}
          </Typography>
          <Box
            component={NextLink}
            href={listingHref}
            sx={(theme) => ({
              ...theme.typography.subtitle2,
              alignSelf: "flex-start",
              color: "primary.main",
              textDecoration: "underline",
            })}
          >
            {copy.openListing}
          </Box>
        </Box>

        <Box
          sx={{
            flex: 1,
            minWidth: 0,
            minHeight: 0,
            display: "flex",
            flexDirection: "column",
          }}
        >
          <Box
            component="ul"
            ref={threadRef}
            aria-label={copy.messagesLabel}
            sx={{
              listStyle: "none",
              m: 0,
              flex: 1,
              minHeight: 0,
              overflow: "auto",
              display: "flex",
              flexDirection: "column",
              gap: 2,
              px: { xs: 2, md: 3 },
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
              messages.map((message) => (
                <Box
                  key={message.id}
                  component="li"
                  sx={{
                    display: "flex",
                    flexDirection: "column",
                    alignItems: side(message.from),
                    alignSelf: side(message.from),
                    gap: 0.5,
                    maxWidth: "min(80%, 28rem)",
                  }}
                >
                  <Box
                    sx={(theme) => ({
                      px: 2,
                      py: 1.5,
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
                  <Typography
                    variant="caption"
                    component="p"
                    color="textSecondary"
                  >
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
      </Box>
    </Box>
  );
}
