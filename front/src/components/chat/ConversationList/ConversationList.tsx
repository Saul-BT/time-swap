import Typography from "@mui/material/Typography";
import {
  ConversationListItem,
  ConversationListLink,
  ConversationListMeta,
  ConversationListRoot,
} from "./ConversationList.style";
import { conversationListClasses } from "./ConversationList.util";

export type ConversationListEntry = {
  id: string;
  href: string;
  listingTitle: string;
  peerName: string;
  preview: string;
  sentAt?: string;
};

export type ConversationListProps = {
  items: readonly ConversationListEntry[];
  emptyLabel: string;
  label: string;
};

export default function ConversationList({
  items,
  emptyLabel,
  label,
}: ConversationListProps) {
  if (items.length === 0) {
    return (
      <Typography variant="body2" color="textSecondary" sx={{ maxWidth: 640 }}>
        {emptyLabel}
      </Typography>
    );
  }

  return (
    <ConversationListRoot
      className={conversationListClasses.root}
      aria-label={label}
    >
      {items.map((item) => (
        <ConversationListItem
          key={item.id}
          className={conversationListClasses.item}
        >
          <ConversationListLink
            className={conversationListClasses.link}
            href={item.href}
          >
            <ConversationListMeta className={conversationListClasses.meta}>
              <Typography variant="subtitle1">{item.listingTitle}</Typography>
              {item.sentAt ? (
                <Typography variant="caption" color="textSecondary">
                  {item.sentAt}
                </Typography>
              ) : null}
            </ConversationListMeta>
            <Typography variant="body2" color="textSecondary">
              {item.peerName}
            </Typography>
            <Typography
              className={conversationListClasses.preview}
              variant="body2"
              color="textSecondary"
              sx={{
                overflow: "hidden",
                textOverflow: "ellipsis",
                whiteSpace: "nowrap",
              }}
            >
              {item.preview}
            </Typography>
          </ConversationListLink>
        </ConversationListItem>
      ))}
    </ConversationListRoot>
  );
}
