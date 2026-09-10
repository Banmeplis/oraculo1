const ZODIACO = [
  { signo: "Aries",       emoji: "♈", elemento: "Fuego",  arcangel: "Miguel",  color: "#e65463", mesIni: 3,  diaIni: 21, mesFin: 4,  diaFin: 19 },
  { signo: "Tauro",       emoji: "♉", elemento: "Tierra", arcangel: "Chamuel", color: "#d4af37", mesIni: 4,  diaIni: 20, mesFin: 5,  diaFin: 20 },
  { signo: "Géminis",     emoji: "♊", elemento: "Aire",   arcangel: "Gabriel", color: "#c9cf4b", mesIni: 5,  diaIni: 21, mesFin: 6,  diaFin: 20 },
  { signo: "Cáncer",      emoji: "♋", elemento: "Agua",   arcangel: "Rafael",  color: "#6fc3e8", mesIni: 6,  diaIni: 21, mesFin: 7,  diaFin: 22 },
  { signo: "Leo",         emoji: "♌", elemento: "Fuego",  arcangel: "Jofiel",  color: "#f0a93b", mesIni: 7,  diaIni: 23, mesFin: 8,  diaFin: 22 },
  { signo: "Virgo",       emoji: "♍", elemento: "Tierra", arcangel: "Uriel",   color: "#a3c26a", mesIni: 8,  diaIni: 23, mesFin: 9,  diaFin: 22 },
  { signo: "Libra",       emoji: "♎", elemento: "Aire",   arcangel: "Chamuel", color: "#e08fb3", mesIni: 9,  diaIni: 23, mesFin: 10, diaFin: 22 },
  { signo: "Escorpio",    emoji: "♏", elemento: "Agua",   arcangel: "Zadkiel", color: "#9b5de5", mesIni: 10, diaIni: 23, mesFin: 11, diaFin: 21 },
  { signo: "Sagitario",   emoji: "♐", elemento: "Fuego",  arcangel: "Jofiel",  color: "#8c6de0", mesIni: 11, diaIni: 22, mesFin: 12, diaFin: 21 },
  { signo: "Capricornio", emoji: "♑", elemento: "Tierra", arcangel: "Miguel",  color: "#8a949e", mesIni: 12, diaIni: 22, mesFin: 1,  diaFin: 19 },
  { signo: "Acuario",     emoji: "♒", elemento: "Aire",   arcangel: "Uriel",   color: "#5ea8e0", mesIni: 1,  diaIni: 20, mesFin: 2,  diaFin: 18 },
  { signo: "Piscis",      emoji: "♓", elemento: "Agua",   arcangel: "Rafael",  color: "#7fd4c8", mesIni: 2,  diaIni: 19, mesFin: 3,  diaFin: 20 }
];

function signoDeFecha(fecha) {
  if (!fecha) return null;
  const partes = String(fecha).split("-");
  const mes = Number(partes[1]);
  const dia = Number(partes[2]);
  if (!mes || !dia) return null;
  return ZODIACO.find(s => (mes === s.mesIni && dia >= s.diaIni) || (mes === s.mesFin && dia <= s.diaFin)) || ZODIACO[0];
}

function signoPublico(s) {
  return s ? { signo: s.signo, emoji: s.emoji, elemento: s.elemento, arcangel: s.arcangel, color: s.color } : null;
}

module.exports = { ZODIACO, signoDeFecha, signoPublico };