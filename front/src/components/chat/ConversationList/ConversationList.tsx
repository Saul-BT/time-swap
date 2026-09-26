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
      <Typography variant="body2" color="textSecondary">
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
              display: "grid",
              gridTemplateColumns: {
                xs: "1fr auto",
                md: "minmax(14rem, 1.2fr) 9rem minmax(0, 2fr) auto",
              },
              columnGap: { xs: 2, md: 3 },
              rowGap: 0.5,
              alignItems: "baseline",
              py: 2,
              color: "inherit",
              "&:hover .preview": { color: "text.primary" },
            }}
          >
            <Typography
              variant="subtitle1"
              noWrap
              sx={{ gridColumn: { md: 1 }, gridRow: 1 }}
            >
              {item.listingTitle}
            </Typography>
            <Typography
              variant="body2"
              color="textSecondary"
              noWrap
              sx={{
                gridColumn: { xs: "1 / -1", md: 2 },
                gridRow: { xs: 2, md: 1 },
              }}
            >
              {item.peerName}
            </Typography>
            <Typography
              className="preview"
              variant="body2"
              color="textSecondary"
              noWrap
              sx={{
                gridColumn: { xs: "1 / -1", md: 3 },
                gridRow: { xs: 3, md: 1 },
              }}
            >
              {item.preview}
            </Typography>
            {item.sentAt ? (
              <Typography
                variant="caption"
                color="textSecondary"
                sx={{
                  gridColumn: { xs: 2, md: 4 },
                  gridRow: 1,
                  justifySelf: "end",
                }}
              >
                {item.sentAt}
              </Typography>
            ) : null}
          </Link>
        </Box>
      ))}
    </Box>
  );
}
