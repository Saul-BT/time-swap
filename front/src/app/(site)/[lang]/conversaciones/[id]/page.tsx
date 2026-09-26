import Box from "@mui/material/Box";
import type { Metadata } from "next";
import { notFound } from "next/navigation";
import ChatPanel from "@/components/chat/ChatPanel";
import { CONVERSATIONS, getConversationById } from "@/data/conversations";
import { getListingById } from "@/data/listings";
import { PATH } from "@/data/navigation";
import { getDictionary, getLocale } from "@/i18n/dictionary";

type ChatPageProps = {
  params: Promise<{ id: string }>;
};

export function generateStaticParams() {
  return CONVERSATIONS.map((conversation) => ({ id: conversation.id }));
}

export async function generateMetadata({
  params,
}: ChatPageProps): Promise<Metadata> {
  const { chat } = await getDictionary();
  const { id } = await params;
  const listing = getListingById(id);
  return {
    title: listing
      ? `${chat.threadTitle} · ${listing.title}`
      : chat.threadTitle,
  };
}

export default async function ChatPage({ params }: ChatPageProps) {
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
      <ChatPanel
        peerName={conversation.peerName}
        listingTitle={listing.title}
        listingSummary={listing.summary}
        listingHours={listing.hours}
        listingHref={`/${locale}${PATH.listingDetail(listing.id)}`}
        backHref={`/${locale}${PATH.conversations}`}
        initialMessages={conversation.messages}
        copy={chat}
      />
    </Box>
  );
}
