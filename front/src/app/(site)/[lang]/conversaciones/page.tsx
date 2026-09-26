import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Typography from "@mui/material/Typography";
import type { Metadata } from "next";
import ConversationList from "@/components/chat/ConversationList/ConversationList";
import SiteFooter from "@/components/layout/SiteFooter";
import SiteHeader from "@/components/layout/SiteHeader";
import { CONVERSATIONS } from "@/data/conversations";
import { getListingById } from "@/data/listings";
import { PATH } from "@/data/navigation";
import { getDictionary, getLocale } from "@/i18n/dictionary";

export async function generateMetadata(): Promise<Metadata> {
  const { chat } = await getDictionary();
  return { title: chat.inboxTitle };
}

export default async function ConversationsPage() {
  const { chat } = await getDictionary();
  const locale = await getLocale();

  const items = CONVERSATIONS.flatMap((conversation) => {
    const listing = getListingById(conversation.id);
    if (!listing) return [];

    const last = conversation.messages.at(-1);
    return [
      {
        id: conversation.id,
        href: `/${locale}${PATH.conversation(conversation.id)}`,
        listingTitle: listing.title,
        peerName: conversation.peerName,
        preview: last?.body ?? chat.emptyThread,
        sentAt: last?.sentAt,
      },
    ];
  });

  return (
    <>
      <SiteHeader />
      <Box
        component="main"
        sx={{
          width: "100%",
          maxWidth: 1240,
          mx: "auto",
          px: { xs: 3, md: 7 },
          pt: 3,
          pb: 6,
        }}
      >
        <Typography variant="h2" gutterBottom>
          {chat.inboxTitle}
        </Typography>
        <Typography variant="body1" color="textSecondary" sx={{ mb: 3 }}>
          {chat.inboxLead}
        </Typography>
        <ConversationList
          items={items}
          emptyLabel={chat.inboxEmpty}
          label={chat.inboxTitle}
        />
        <Box sx={{ mt: 3 }}>
          <Button variant="outlined" href={`/${locale}${PATH.loggedHome}`}>
            {chat.back}
          </Button>
        </Box>
      </Box>
      <SiteFooter />
    </>
  );
}
