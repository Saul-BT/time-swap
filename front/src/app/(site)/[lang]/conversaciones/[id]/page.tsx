import { Button, Stack, Typography } from "@mui/material";
import type { Metadata } from "next";
import { notFound } from "next/navigation";
import ConversationPanel from "@/components/chat/ConversationPanel";
import Section from "@/components/layout/Section";
import SiteFooter from "@/components/layout/SiteFooter";
import SiteHeader from "@/components/layout/SiteHeader";
import { CONVERSATIONS, getConversationById } from "@/data/conversations";
import { getListingById } from "@/data/listings";
import { PATH } from "@/data/navigation";
import { getDictionary, getLocale } from "@/i18n/dictionary";

type ConversationPageProps = {
  params: Promise<{ id: string }>;
};

export function generateStaticParams() {
  return CONVERSATIONS.map((conversation) => ({ id: conversation.id }));
}

export async function generateMetadata({
  params,
}: ConversationPageProps): Promise<Metadata> {
  const { id } = await params;
  const conversation = getConversationById(id);
  const listing = conversation
    ? getListingById(conversation.listingId)
    : undefined;
  return { title: listing?.title ?? "Chat" };
}

/** Temporary listing chat: local composer only, no messaging backend. */
export default async function ConversationPage({
  params,
}: ConversationPageProps) {
  const { id } = await params;
  const conversation = getConversationById(id);

  if (!conversation) {
    notFound();
  }

  const listing = getListingById(conversation.listingId);
  if (!listing) {
    notFound();
  }

  const { chat } = await getDictionary();
  const locale = await getLocale();
  const inboxHref = `/${locale}${PATH.conversations}`;
  const listingHref = `/${locale}${PATH.listingDetail(listing.id)}`;

  return (
    <>
      <SiteHeader />
      <main>
        <Section>
          <Typography variant="overline" component="p" color="textSecondary">
            {conversation.peerName}
          </Typography>
          <Typography variant="h2" gutterBottom sx={{ mt: 1 }}>
            {listing.title}
          </Typography>

          <ConversationPanel
            peerName={conversation.peerName}
            listingTitle={listing.title}
            listingHours={listing.hours}
            listingHref={listingHref}
            initialMessages={conversation.messages}
            copy={chat}
          />

          <Stack
            direction={{ xs: "column", sm: "row" }}
            spacing={2}
            sx={{ mt: 4 }}
          >
            <Button variant="outlined" href={inboxHref}>
              {chat.backToInbox}
            </Button>
            <Button variant="text" href={listingHref}>
              {chat.openListing}
            </Button>
          </Stack>
        </Section>
      </main>
      <SiteFooter />
    </>
  );
}
