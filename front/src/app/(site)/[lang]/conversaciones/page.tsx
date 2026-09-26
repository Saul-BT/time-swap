import { Button, Stack, Typography } from "@mui/material";
import type { Metadata } from "next";
import ConversationList from "@/components/chat/ConversationList";
import Section from "@/components/layout/Section";
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

/** Temporary inbox: sample threads only, no messaging backend. */
export default async function ConversationsPage() {
  const { chat } = await getDictionary();
  const locale = await getLocale();
  const backHref = `/${locale}${PATH.loggedHome}`;

  const items = CONVERSATIONS.flatMap((conversation) => {
    const listing = getListingById(conversation.listingId);
    if (!listing) {
      return [];
    }

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
      <main>
        <Section>
          <Typography variant="h2" gutterBottom>
            {chat.inboxTitle}
          </Typography>
          <Typography variant="body1" sx={{ mb: 4, maxWidth: 640 }}>
            {chat.inboxLead}
          </Typography>

          <ConversationList
            items={items}
            emptyLabel={chat.inboxEmpty}
            label={chat.inboxTitle}
          />

          <Stack direction="row" sx={{ mt: 4 }}>
            <Button variant="outlined" href={backHref}>
              {chat.back}
            </Button>
          </Stack>
        </Section>
      </main>
      <SiteFooter />
    </>
  );
}
