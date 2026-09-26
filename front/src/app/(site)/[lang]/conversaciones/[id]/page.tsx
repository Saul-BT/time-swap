import Box from "@mui/material/Box";
import type { Metadata } from "next";
import { notFound } from "next/navigation";
import ConversationPanel from "@/components/chat/ConversationPanel";
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
  const listing = getListingById(id);
  return { title: listing?.title ?? "Chat" };
}

export default async function ConversationPage({
  params,
}: ConversationPageProps) {
  const { id } = await params;
  const conversation = getConversationById(id);
  const listing = conversation ? getListingById(conversation.id) : undefined;

  if (!conversation || !listing) {
    notFound();
  }

  const { chat } = await getDictionary();
  const locale = await getLocale();

  return (
    <Box
      sx={{
        position: "fixed",
        inset: 0,
        zIndex: 1,
        display: "flex",
        flexDirection: "column",
        overflow: "hidden",
        bgcolor: "background.default",
      }}
    >
      <SiteHeader />
      <ConversationPanel
        peerName={conversation.peerName}
        listingTitle={listing.title}
        listingHours={listing.hours}
        listingHref={`/${locale}${PATH.listingDetail(listing.id)}`}
        backHref={`/${locale}${PATH.conversations}`}
        initialMessages={conversation.messages}
        copy={chat}
      />
    </Box>
  );
}
