import type { Listing } from "./types";

/** Sample content, standing in for author-written text. Not translated. */
export const LISTINGS: readonly Listing[] = [
  {
    id: "companionship",
    kind: "offer",
    mode: "inPerson",
    title: "Acompaño a gestiones y consultas médicas",
    summary:
      "Tomo notas, pregunto lo que haga falta y te lo explico luego con calma.",
    byline: "[Nombre] · [Barrio]",
    hours: "1 h",
  },
  {
    id: "phone-lessons",
    kind: "request",
    mode: "remote",
    title: "Alguien con paciencia que me enseñe el móvil",
    summary:
      "Videollamadas, fotos y la app del banco. Puedo devolverlo cosiendo.",
    byline: "[Nombre] · [Barrio]",
    hours: "1 h",
  },
  {
    id: "bike-repair",
    kind: "offer",
    mode: "both",
    title: "Reparo bicicletas y enseño a hacerlo",
    summary: "Frenos, cambios y ruedas. Las piezas las pagas tú aparte.",
    byline: "[Nombre] · [Barrio]",
    hours: "1 h + material",
  },
  {
    id: "small-move",
    kind: "request",
    mode: "inPerson",
    title: "Dos manos para una mudanza pequeña",
    summary:
      "Un tercer piso sin ascensor, sábado por la mañana, unas tres horas.",
    byline: "[Nombre] · [Barrio]",
    hours: "3 h",
  },
  {
    id: "interview-prep",
    kind: "offer",
    mode: "remote",
    title: "Reviso tu currículum y ensayamos la entrevista",
    summary: "Una hora de repaso y otra de simulacro, por videollamada.",
    byline: "[Nombre] · remoto",
    hours: "2 h",
  },
  {
    id: "dog-walking",
    kind: "offer",
    mode: "inPerson",
    title: "Paseo perros entre semana por la mañana",
    summary:
      "De lunes a jueves, entre las 9 y las 11. Perros de cualquier tamaño.",
    byline: "[Nombre] · [Barrio]",
    hours: "1 h",
  },
];
