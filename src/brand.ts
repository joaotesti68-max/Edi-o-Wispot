/**
 * Manual de Identidade Wispot 2026 — cores institucionais e tipografia.
 * Azul e cinza são as cores da marca; o degradê é o oficial do manual.
 */
export const brand = {
  colors: {
    blue: "#25a8e0",
    blueDeep: "#0b91c1",
    white: "#ffffff",
    gray: "#514d4b",
  },
  // Degradê institucional #25a8e0 → #0b91c1.
  gradient: "linear-gradient(155deg, #25a8e0 0%, #1c9ed6 45%, #0b91c1 100%)",
  /** O manual pede prioridade para 100% e 80% da cor principal. */
  alpha: (hex: string, value: number) => {
    const n = parseInt(hex.slice(1), 16);
    return `rgba(${(n >> 16) & 255}, ${(n >> 8) & 255}, ${n & 255}, ${value})`;
  },
  // Adineue Pro é a outra família institucional, mas é licenciada; o manual
  // lista Montserrat com o mesmo peso de uso, e é a que temos empacotada.
  fontFamily: "Montserrat",
  site: "wispot.com.br",
};
