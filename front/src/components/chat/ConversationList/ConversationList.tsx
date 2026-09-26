import Box from "@mui/material/Box";
import Link from "@mui/material/Link";
import Typography from "@mui/material/Typography";

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
    <Box
      component="ul"
      aria-label={label}
      sx={{
        listStyle: "none",
        m: 0,
        p: 0,
        maxWidth: 720,
        borderTop: "2px solid",
        borderColor: "divider",
      }}
    >
      {items.map((item) => (
        <Box
          key={item.id}
          component="li"
          sx={{ borderBottom: "2px solid", borderColor: "divider" }}
        >
          <Link
            href={item.href}
            underline="none"
            sx={{
              display: "flex",
              flexDirection: "column",
              gap: 1,
              py: 3,
              color: "inherit",
              "&:hover .preview": { color: "text.primary" },
            }}
          >
            <Box
              sx={{
                display: "flex",
                justifyContent: "space-between",
                gap: 2,
                alignItems: "baseline",
              }}
            >
              <Typography variant="subtitle1">{item.listingTitle}</Typography>
              {item.sentAt ? (
                <Typography variant="caption" color="textSecondary">
                  {item.sentAt}
                </Typography>
              ) : null}
            </Box>
            <Typography variant="body2" color="textSecondary">
              {item.peerName}
            </Typography>
            <Typography
              className="preview"
              variant="body2"
              color="textSecondary"
              noWrap
            >
              {item.preview}
            </Typography>
          </Link>
        </Box>
      ))}
    </Box>
  );
}
