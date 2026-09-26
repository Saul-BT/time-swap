import { LISTINGS } from "./listings";
import type { Conversation } from "./types";

/**
 * Sample threads keyed by listing id. Empty `messages` means a fresh contact
 * from the listing detail CTA — the composer still works locally.
 */
const SEEDED: Readonly<Record<string, Omit<Conversation, "id" | "listingId">>> =
  {
    "bike-repair": {
      peerName: "[Nombre]",
      messages: [
        {
          id: "bike-1",
          from: "self",
          body: "Hola, ¿puedes mirarme los frenos esta semana?",
          sentAt: "Ayer · 18:12",
        },
        {
          id: "bike-2",
          from: "peer",
          body: "Sí. Tráela el jueves por la tarde y lo vemos.",
          sentAt: "Ayer · 18:40",
        },
      ],
    },
    companionship: {
      peerName: "[Nombre]",
      messages: [
        {
          id: "comp-1",
          from: "self",
          body: "Necesito compañía el martes a una revisión.",
          sentAt: "Hoy · 09:05",
        },
      ],
    },
  };

export const CONVERSATIONS: readonly Conversation[] = LISTINGS.map(
  (listing) => {
    const seeded = SEEDED[listing.id];
    return {
      id: listing.id,
      listingId: listing.id,
      peerName: seeded?.peerName ?? "[Nombre]",
      messages: seeded?.messages ?? [],
    };
  },
);

export function getConversationById(id: string): Conversation | undefined {
  return CONVERSATIONS.find((conversation) => conversation.id === id);
}

export function getConversationByListingId(
  listingId: string,
): Conversation | undefined {
  return CONVERSATIONS.find(
    (conversation) => conversation.listingId === listingId,
  );
}
