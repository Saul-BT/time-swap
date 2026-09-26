import { LISTINGS } from "./listings";
import type { Conversation } from "./types";

const SEEDED: Readonly<
  Record<string, Pick<Conversation, "peerName" | "messages">>
> = {
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
  (listing) => ({
    id: listing.id,
    peerName: SEEDED[listing.id]?.peerName ?? "[Nombre]",
    messages: SEEDED[listing.id]?.messages ?? [],
  }),
);

export function getConversationById(id: string): Conversation | undefined {
  return CONVERSATIONS.find((conversation) => conversation.id === id);
}
