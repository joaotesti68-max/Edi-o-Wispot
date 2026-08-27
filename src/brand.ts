// Tokens tirados do "Brandbook ProAdvanced — Manual de Marca 2026".
// Cores institucionais (cap. 04), tipografia Montserrat (cap. 05) e as
// variações de transparência da cor principal que o manual define.
export const brand = {
  colors: {
    primary: "#3696cd",
    primaryLight: "#20a3d6",
    gray: "#676868",
    white: "#ffffff",
    ink: "#111417",
  },
  // O manual prevê 30% / 60% / 100% da cor principal para ampliar a paleta
  // sem sair da identidade. Prioridade sempre para 100%.
  alpha: {
    primary30: "rgba(54,150,205,0.3)",
    primary60: "rgba(54,150,205,0.6)",
    light30: "rgba(32,163,214,0.3)",
    light60: "rgba(32,163,214,0.6)",
  },
  gradient: "linear-gradient(135deg, #1c3f57 0%, #3696cd 55%, #20a3d6 100%)",
  fontFamily: "Montserrat",
  logo: {
    white: "brand/logo-white.png",
    color: "brand/logo-color.png",
    iconWhite: "brand/icon-white.png",
    iconColor: "brand/icon-color.png",
  },
  site: "proadvanced.com.br",
};
