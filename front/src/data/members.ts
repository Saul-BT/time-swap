import type { Member } from "./types";

/** Sample content, standing in for member-written text. Not translated. */
export const MEMBERS: readonly Member[] = [
  {
    id: "member-1",
    name: "[Nombre]",
    initial: "A",
    context: "[Barrio] · [n] intercambios",
    quote:
      "Vine a que me arreglaran el ordenador y me he quedado dando clases de cocina.",
    skills: ["Cocina", "Costura"],
  },
  {
    id: "member-2",
    name: "[Nombre]",
    initial: "B",
    context: "[Barrio] · [n] intercambios",
    quote:
      "Me daba vergüenza pedir ayuda hasta que entendí que luego la devuelvo a otra persona.",
    skills: ["Idiomas", "Acompañamiento"],
  },
  {
    id: "member-3",
    name: "[Nombre]",
    initial: "C",
    context: "[Barrio] · [n] intercambios",
    quote:
      "Trabajo desde casa y salir a arreglar bicis un rato me ordena la semana.",
    skills: ["Reparaciones", "Bicicletas"],
  },
];
