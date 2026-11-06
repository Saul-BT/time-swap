import Box from "@mui/material/Box";
import type { Metadata } from "next";
import { notFound } from "next/navigation";
import ConversationPanel from "@/components/chat/ConversationPanel/ConversationPanel";
import SiteHeader from "@/components/layout/SiteHeader";
import { getConversationById } from "@/data/conversations";
import { getListingById } from "@/data/listings";
import { getDictionary, getLocale } from "@/i18n/dictionary";
import { localizePath } from "@/i18n/routes";

type ConversationPageProps = {
  params: Promise<{ id: number }>;
};

export async function generateMetadata({
  params,
}: ConversationPageProps): Promise<Metadata> {
  const { id } = await params;
  const listing = await getListingById(id);
  return { title: listing?.title ?? "Chat" };
}

export default async function ConversationPage({
  params,
}: ConversationPageProps) {
  const { id } = await params;
  const conversation = await getConversationById(id);
  const listing = conversation ? await getListingById(conversation.id) : undefined;

  if (!conversation || !listing) {
    notFound();
  }

  const { chat } = await getDictionary();
  const locale = await getLocale();
  const backHref = localizePath(locale, "loggedHome");
  const listingHref = localizePath(locale, "loggedHome");
  //const listingHref = localizePath(locale, "listingDetail", {id: listing.id});//todo parametrize with id

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
        listingHref={listingHref}
        backHref={backHref}
        initialMessages={conversation.messages}
        copy={chat}
      />
    </Box>
  );
}
