/** Every string an error boundary can need, resolved on the server. */
export type ErrorCopy = {
  page: { title: string; body: string; retry: string; home: string };
  panel: { title: string; body: string; retry: string };
};

export const FALLBACK_ERROR_COPY: ErrorCopy = {
  page: {
    title: "Algo ha fallado",
    body: "No hemos podido montar esta página.",
    retry: "Reintentar",
    home: "Volver al inicio",
  },
  panel: {
    title: "No hemos podido cargar este apartado",
    body: "Nada se ha perdido. Vuelve a intentarlo.",
    retry: "Reintentar",
  },
};
