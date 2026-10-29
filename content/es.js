// Spanish pack: same keys as en.js (interface labels, standard replies). Markup: `Orden` → <ORDEN>; {etiqueta|id} → clickable object.

// Las respuestas normales concuerdan con la cosa de la que hablan. `w` es su `words` ({ g: "m" | "f", pl }), que el motor
// da a cada línea normal dicha sobre el objeto de la acción (`who`); sin género conocido, masculino.
const ending = (w) => (w?.g === "f" ? "a" : "o") + (w?.pl ? "s" : "");                          // cogid-o / -a / -os / -as
const it = (w) => (w?.pl ? (w?.g === "f" ? "las" : "los") : w?.g === "f" ? "la" : "lo");     // lo / la / los / las
const num = (w, one, many) => (w?.pl ? many : one);                                            // "se abre" / "se abren"
const article = (w) => (w?.pl ? (w?.g === "f" ? "las" : "los") : w?.g === "f" ? "la" : "el");    // la / el / las / los, en una frase
const Article = (w) => article(w).charAt(0).toUpperCase() + article(w).slice(1);                 // La / El / Las / Los, al empezar

// El tiempo jugado en palabras, para la nota del final: "menos de un minuto", "23 minutos", "1 hora y 5 minutos".
const playedFor = (ms) => {
  const m = Math.floor(ms / 60000), h = Math.floor(m / 60), r = m % 60;
  const unit = (n, one, many) => `${n} ${n === 1 ? one : many}`;
  return !m ? "menos de un minuto" : !h ? unit(m, "minuto", "minutos") : unit(h, "hora", "horas") + (r ? " y " + unit(r, "minuto", "minutos") : "");
};

export default {
  hint: "Escribe `Ayuda` si la necesitas",
  or: " o ",
  and: " y ",
  // El final de la historia (cualquier final): no se pregunta nada. Primero una nota breve en gris, una sola vez (d = { ms:
  // tiempo jugado, rooms: salas vistas }), y luego esta línea, que recibe cualquier otra orden; `Empezar de nuevo` (o
  // reiniciar, partida nueva…) empieza otra partida del mismo mundo, desde su apertura, y dice againYes. Son las tres maneras de seguir:
  // `Deshacer` retira el último movimiento; `Salir` vuelve a la lista de juegos.
  endNote: (d) => `Has jugado ${playedFor(d.ms)}. Has visto ${d.rooms} ${d.rooms === 1 ? "sala" : "salas"}.`,
  gameOver: "La historia ha terminado. `Deshacer` tu último movimiento, `Empezar de nuevo` o `Salir`.",
  againYes: "Todo se oscurece. Luego, despacio, vuelve a empezar…",
  hintNone: "Nada más. Solo una especie de paciencia.",
  hintDo: (cmds) => "Prueba " + cmds.join(", y luego ") + ".",
  askAbout: (l) => `Preguntar por ${l}`,
  talkedOut: (d) => `No tienes nada más de lo que hablar con ${d.name}${d.forNow ? " (por ahora)" : ""}.`,
  noWay: ["Por ahí no se puede ir.", "No hay paso por ahí.", "Por ahí no se va a ninguna parte."],
  // Cuando nada da sentido a lo escrito: con la voz del mundo, nunca hablando de palabras (varias, alternadas).
  unsure: ["No sabes muy bien cómo hacer eso.", "No sale nada de ahí.", "Eso no te lleva a ninguna parte.",
           "Nada de aquí parece reaccionar a eso."],

  // Respuestas del intérprete (js/parser.js): el problema, con nombre
  didYouMean: (w) => `¿Querías decir \`${w}\`?`,                  // solo para una errata clara
  // Cosas que menciona el texto de la sala pero que no están para usarse (su `scenery`, en los textos de la sala): w = "las paredes".
  sceneryLook: [(w) => `No ves nada especial en ${w}.`, (w) => `Nada fuera de lo normal en ${w}.`,
            (w) => `Nada que destacar en ${w}.`],
  sceneryOther: [(w) => `No puedes hacer gran cosa con ${w}.`, (w) => `Mejor no tocar ${w}.`],
  noVerb: "¿Qué quieres hacer? Empieza con un verbo, como `Examinar` o `Coger`.",
  whatTo: (v) => `¿Qué quieres ${v}?`,
  notHere: (w) => `No ves ningún «${w}» aquí.`,
  noWait: ["Aquí no hay nada que valga la pena esperar.", "Aquí no va a venir nada.", "Podrías esperar. Aquí no saldría nada de ello."],
  // La hora del mundo en palabras, para [time] en un texto: { hour, minute } → "las cinco y cuarto".
  timeWords({ hour, minute }) {
    const n = ["", "una", "dos", "tres", "cuatro", "cinco", "seis", "siete", "ocho", "nueve", "diez", "once", "doce",
               "trece", "catorce", "quince", "dieciséis", "diecisiete", "dieciocho", "diecinueve", "veinte", "veintiuno",
               "veintidós", "veintitrés", "veinticuatro", "veinticinco", "veintiséis", "veintisiete", "veintiocho", "veintinueve"];
    const h = (x) => { const k = x % 12 || 12; return (k === 1 ? "la " : "las ") + n[k]; };
    const min = (m) => (m === 1 ? "uno" : n[m]);
    if (minute === 0) return hour === 0 ? "medianoche" : hour === 12 ? "mediodía" : h(hour) + " en punto";
    if (minute === 15) return h(hour) + " y cuarto";
    if (minute === 30) return h(hour) + " y media";
    if (minute === 45) return h(hour + 1) + " menos cuarto";
    return minute < 30 ? h(hour) + " y " + min(minute) : h(hour + 1) + " menos " + min(60 - minute);
  },
  timeNow(d) {
    const day = d.day <= 3 ? `el ${["primer", "segundo", "tercer"][d.day - 1]} día` : `el día ${d.day}`;
    return d.weekday ? `Hoy es ${d.weekday}, ${d.time}, ${day} de tu aventura.` : `Son las ${d.time}, ${day} de tu aventura.`;
  },
  // Una frase por paso de salud (índice 1 a 5), común a STATUS y a los ecos (INTERFACE.md §6c). Ninguna nombra una causa.
  health: [null, "Apenas te tienes en pie", "Te sientes fatal", "Te encuentras mal", "No estás del todo bien", "Te sientes muy bien"],
  // STATUS: d = { health: el paso, de 5 a 1 }.
  statusNow(d) { return this.health[d.health] + "."; },
  weekdays: { mon: "lunes", tue: "martes", wed: "miércoles", thu: "jueves", fri: "viernes", sat: "sábado", sun: "domingo" },
  onlyMentioned: () => "No hay nada más que hacer con eso.",   // nombrado en el texto, sin más que contar
  noIt: "No sé muy bien a qué te refieres.",
  which: (list) => `¿Cuál quieres decir: ${list}?`,
  whoMean: (list) => `¿A quién te refieres: ${list}?`,
  noPerson: "No sé muy bien a quién te refieres.",
  useUp: "Usa ↑ para recuperar tu última orden.",
  nothingToFix: "No hay nada que corregir: la última orden no tenía palabras desconocidas.",
  undone: "Deshaces tu último movimiento.",
  cantUndo: "No hay nada que deshacer.",
  askUndo: "¿Deshacer tu último movimiento?",
  saved: "Partida grabada. `Cargar` te trae de vuelta aquí.",
  loaded: "De vuelta a donde grabaste.",
  noSave: "Todavía no hay ninguna partida grabada. `Grabar` guarda una.",
  askSave: "¿Grabar encima de tu partida grabada? Solo hay una por partida.",
  askLoad(d) { return `Tu partida grabada:\n\n${d.place}, Día ${d.day} a las ${d.time}. Grabada ${this.savedWhen(d.saved, d.now)}.\n\n¿Volver a ella? Lo que has hecho desde entonces se perderá.`; },
  savedWhen(t, now) {
    const hm = String(t.getHours()).padStart(2, "0") + ":" + String(t.getMinutes()).padStart(2, "0");
    const day = (x) => new Date(x.getFullYear(), x.getMonth(), x.getDate()).getTime(), diff = Math.round((day(now) - day(t)) / 864e5);
    const months = ["enero", "febrero", "marzo", "abril", "mayo", "junio", "julio", "agosto", "septiembre", "octubre", "noviembre", "diciembre"];
    return diff === 0 ? "hoy a las " + hm : diff === 1 ? "ayer a las " + hm : `el ${t.getDate()} de ${months[t.getMonth()]} a las ${hm}`;
  },
  askRestart: "¿Reiniciar la partida? Volverás a empezar desde el principio. Una partida que hayas grabado se puede seguir cargando.",
  saveFailed: "No se ha podido guardar la partida aquí (el navegador está bloqueando el almacenamiento).",
  yesNo: "`Sí` / `No`",
  confirmNo: "De acuerdo.",
  help: "Escribe lo que quieres hacer en pocas palabras, como «abre la puerta» o «coge la lámpara». Haz clic en un objeto+ para examinarlo, o en una orden en mayúsculas para hacerla al momento.\n\nAcciones comunes: `Mirar`, `Examinar`, `Coger`, `Dejar`, `Abrir`, `Inventario`, `Hora`, `Estado`, `Hablar con`, `Esperar`.\n\nDirecciones: `N`, `S`, `E`, `O`, `Arriba`, `Abajo`, `Dentro`, `Fuera`. `Mapa` muestra por dónde has estado, y un clic en una sala te lleva hasta ella.\n\nPartida: `Deshacer`, `Grabar`, `Cargar`, `Salir` (vuelve a la lista de juegos).",
  hintCarried: (n) => `Algo que llevas quizá sepa más. Prueba \`Escuchar ${n}\`.`,
  hintHere: (n) => `Algo de aquí quizá sepa más. Prueba \`Escuchar ${n}\`.`,
  hintAway: "En algún sitio dejaste algo que escucha. Quizá sepa más.",
  hintNone: "Nadie escucha. Todavía no.",

  // Standard verbs (js/verbs.js), for objects without their own rule
  locked: (_, w) => `${num(w, "Está", "Están")} cerrad${ending(w)} con llave.`, unlocked: (_, w) => num(w, "Se abre.", "Se abren."),
  noTopic: ["No parece saber nada de eso.", "Ninguna respuesta que valga la pena.", "Se encoge de hombros."],
  // Estar dentro o encima de algo (js/verbs.js). Sin artículo, para no equivocar el género.
  gotIn: () => "Te metes dentro.", gotOn: () => "Te subes encima.",
  gotOut: () => "Sales.", gotOff: () => "Te bajas.", outFirst: () => "Primero sales.",
  alreadyIn: () => "Ya estás ahí.", notIn: () => "No estás dentro de eso.",
  youAreIn: (n) => `Estás dentro: ${n}.`, youAreOn: (n) => `Estás encima: ${n}.`,
  waysOut: function (dirs) {
    const ways = (dirs || []).map(d => "`" + this.dirs[d] + "`");
    if (!ways.length) return "No hay por dónde salir.";
    return "Puedes ir: " + (ways.length > 1 ? ways.slice(0, -1).join(", ") + this.or + ways.at(-1) : ways[0]) + ".";
  },
  // Ecos (INTERFACE.md §6c): una línea corta bajo el texto tras un cambio en tu salud, para el paso al que
  // llegas (salud 5–0), del color de su clase y con las cinco barras delante. Los elige js/narrator.js.
  // hurt: la frase propia de un paso al herirte; null, la de `health`.
  echo: {
    healed: [null, "Te sientes un poco mejor", "Te sientes mejor", "Te sientes mucho mejor", "Te sientes bien", "Te sientes muy bien"],
    hurt: [null, null, null, null, "Te has hecho daño", null]
  },
  // Perder lo último de tu salud (js/engine.js, `hurt`): primero las palabras de lo que te ha herido (s), si las tiene.
  hurt: {
    // El final: una de estas, al azar.
    dead: [
      (s) => (s ? s + " " : "") + "Este es el final, piensas un instante, antes de desvanecerte para siempre.",
      (s) => (s ? s + " " : "") + "El mundo se queda en silencio, un sonido cada vez, hasta que no queda nada que oír.",
      (s) => (s ? s + " " : "") + "Te tumbas, aunque no recuerdas haberlo decidido. Todo se aleja mucho, y luego ya no está.",
      (s) => (s ? s + " " : "") + "En algún sitio se cierra una puerta, despacio, como se cierran las de las habitaciones que nadie volverá a usar. Era la tuya.",
      (s) => (s ? s + " " : "") + "Tenías pensado hacer tantas cosas. El pensamiento se queda un momento más que tú."
    ]
  },
  took: (_, w) => `Cogid${ending(w)}.`, dropped: (_, w) => `Dejad${ending(w)}.`, cantTake: "No se puede coger.", nothingSpecial: "No ves nada especial.",
  notCarried: "No llevas eso.",
  // USAR y sus palabras solas (js/view.js, useLine): d = { name: la cosa, list: las órdenes que ofrece, como una frase }; w = su género.
  useHow: (d, w) => `¿Usar ${article(w)} ${d.name} cómo? ${d.list}.`,
  // Las órdenes de dos cosas que ofrece USAR solo, como las escribiría un jugador (nombres, sin artículos).
  useWith: { unlock: (door, key) => `Abrir ${door} con ${key}`, put: (thing, into) => `Meter ${thing} en ${into}`, give: (thing, who) => `Dar ${thing} a ${who}` },
  // Meter una cosa en otra (js/verbs.js): n = [la cosa, dónde va], nombres en minúscula; w = su género y número.
  putIn: [(n, w) => `Metes ${article(w[0])} ${n[0]} en ${article(w[1])} ${n[1]}.`, (n, w) => `Pones ${article(w[0])} ${n[0]} en ${article(w[1])} ${n[1]}.`,
          (n, w) => `Dejas ${article(w[0])} ${n[0]} en ${article(w[1])} ${n[1]}.`],
  // Coger una cosa de donde no está: n = [la cosa, el sitio].
  notInside: [(n, w) => `${Article(w[0])} ${n[0]} no ${num(w[0], "está", "están")} en ${article(w[1])} ${n[1]}.`,
              (n, w) => `Miras en ${article(w[1])} ${n[1]}, pero ${article(w[0])} ${n[0]} no ${num(w[0], "está", "están")} ahí.`,
              (n, w) => `No hay nada que coger de ${article(w[1])} ${n[1]}: ${article(w[0])} ${n[0]} no ${num(w[0], "está", "están")} ahí.`],
  closed: [(n, w) => `${Article(w[0])} ${n[0]} ${num(w[0], "está", "están")} cerrad${ending(w[0])}.`,
           (n, w) => `${Article(w[0])} ${n[0]} ${num(w[0], "está", "están")} cerrad${ending(w[0])}: primero hay que abrir${it(w[0])}.`,
           (n, w) => `Tendrías que abrir ${article(w[0])} ${n[0]} primero.`],
  invEmpty: "No llevas nada.", invList: (list) => "Llevas: " + list + ".",

  // Lo que dicen las mecánicas de la apertura (js/opening.js): el mundo escribe el resto con su propia voz.
  already: (_, w) => `Ya ${it(w)} tienes, a salvo en el bolsillo.`,
  cantDrop: (_, w) => `Mejor quedárte${it(w)}. Puede que ${it(w)} necesites.`,
  takeFirst: (_, w) => `Tendrás que coger${it(w)} primero.`,
  // Una pista, dicha con la línea propia del mundo (`hintFrame` de la apertura): la línea y la pista entre comillas.
  framed: (frame, hint) => `${frame} «${hint.replace(/\.$/, "")}».`,
  // El artículo y un nombre, para [way] en un texto: el camino de la apertura ("la puerta giratoria").
  the: (name, o) => (o?.words?.g === "f" ? "la " : "el ") + name,
  // Un idioma sin mundo todavía: una sola sala, para que la partida tenga dónde estar.
  noWorld: { place: "NINGUNA PARTE", alt: "Un dibujo en blanco.",
             text: "Todavía no hay ningún mundo que jugar en este idioma. Vuelve a la lista de juegos y elige otro idioma." },

  // Interface
  music: "Música", on: "activada", off: "desactivada", options: "Opciones",
  a11y: { story: "Historia", command: "Escribe una orden" },
  panel: { title: "OPCIONES", restart: "Reiniciar partida", quit: "Salir" },
  // La página de inicio (ui/home.js). El nombre del juego no se traduce. Los botones salen en mayúsculas (home.css).
  home: { subtitle: "Ficción Artificial Interactiva", newGame: "Nueva partida", resume: "Continuar", version: "Versión",
          language: (l) => `Idioma: ${{ en: "inglés", es: "español" }[l]}`,   // los botones del selector, arriba a la derecha
          none: "Todavía no hay juegos en español." },
  labels: { directions: "DIRECCIONES", inv: "INVENTARIO", day: "Día", map: "Mapa" },
  // El mapa (js/map.js, ui/map.js): su hoja de estilos lo muestra en mayúsculas. `level(n)` nombra una planta que no es la baja.
  map: { title: "Mapa", close: "Cerrar el mapa", hint: "Arrastra para mover el mapa", ground: "Planta baja",
         level: (n) => `Planta ${n < 0 ? "−" : ""}${Math.abs(n)}`, rooms: "Salas de esta planta", here: "estás aquí" },
  dirs: { n: "Norte", s: "Sur", e: "Este", w: "Oeste", u: "Arriba", d: "Abajo", in: "Dentro", out: "Fuera" }, noExit: "sin salida",
  // Los nombres de los botones de la brújula: su tooltip, lo que dice el lector de pantalla y lo que escribe un clic (el mapa camina con dirs, arriba).
  dirTips: { n: "Norte", s: "Sur", e: "Este", w: "Oeste", u: "Subir", d: "Bajar", in: "Entrar", out: "Salir" },

  objects: {},
  items: {},
  // Respuestas normales, por acción (js/actions.js): lo que dice una acción cuando ninguna regla le da sentido.
  // Neutras, para cualquier partida; 2–3 versiones, nunca la misma dos veces seguidas.
  replies: {
    read: ["No hay nada escrito.", "No ves nada que leer."],
    search: ["No encuentras nada interesante.", "No aparece nada.", "Un registro cuidadoso no revela nada."],
    listen: ["No oyes nada especial.", "Escuchas. Nada fuera de lo normal.", "Solo los ruidos de siempre."],
    smell: ["No hueles nada especial.", "Ningún olor en particular.", "Nada que le interese a tu nariz."],
    taste: [(_, w) => `Mejor no metérte${it(w)} en la boca.`, (_, w) => `Decides no probar${it(w)}.`, "No es buena idea."],
    touch: ["Al tacto es lo que esperabas.", (_, w) => `Nada raro al tocar${it(w)}.`, "No notas nada especial."],
    put: ["Eso no cabe ahí.", (_, w) => `No tiene sentido poner${it(w)} ahí.`, (_, w) => `No puedes poner${it(w)} ahí.`],
    give: ["No parece interesarle a nadie.", (_, w) => `Nadie aquí ${it(w)} quiere.`, (_, w) => `No hay nadie a quien dárse${it(w)}.`],
    show: ["Nadie reacciona.", "A nadie parece interesarle.", (_, w) => `No hay nadie a quien enseñárse${it(w)}.`],
    throw: ["Te lo piensas mejor.", "Lanzar eso no va a ayudar.", (_, w) => `Decides no soltar${it(w)}.`],
    wear: ["No puedes ponerte eso.", "Eso no es algo que se pueda llevar puesto."],
    remove: ["No llevas eso puesto.", "No hay nada que quitarse."],
    open: [(_, w) => num(w, "No se abre.", "No se abren."), "Eso no es algo que se pueda abrir.", (_, w) => `No hay manera de abrir${it(w)}.`],
    close: [(_, w) => num(w, "No se cierra.", "No se cierran."), "Eso no es algo que se pueda cerrar.", "No hay nada que cerrar."],
    lock: [(_, w) => `No puedes cerrar${it(w)} con llave.`, (_, w) => num(w, "No tiene cerradura.", "No tienen cerradura.")],
    unlock: [(_, w) => `No puedes abrir${it(w)} con llave.`, (_, w) => `${num(w, "No está", "No están")} cerrad${ending(w)}, o no con nada que tengas.`],
    push: ["No pasa nada.", (_, w) => num(w, "No se mueve.", "No se mueven."), (_, w) => `Empujar${it(w)} no sirve de nada.`],
    pull: ["No pasa nada.", (_, w) => num(w, "No cede.", "No ceden."), "Tirar de ello no sirve de nada."],
    turn: [(_, w) => num(w, "No gira.", "No giran."), "No pasa nada.", (_, w) => `No hay manera de girar${it(w)}.`],
    move: [(_, w) => num(w, "No se mueve.", "No se mueven."), (_, w) => num(w, "Se queda donde está.", "Se quedan donde están."), (_, w) => `No puedes mover${it(w)}.`],
    switch_on: ["No puedes encender eso.", "Ahí no hay nada que encender."],
    switch_off: ["No puedes apagar eso.", "Ahí no hay nada que apagar."],
    attack: ["La violencia no va a ayudar aquí.", "Te lo piensas mejor.", "Eso no resolvería nada."],
    knock: ["Llamas. No pasa nada.", "Un golpe sordo. Nadie contesta.", "Nadie responde."],
    use: ["Eso no parece servir para nada.", "No sale nada de ahí.", (_, w) => `Le das vueltas. No se te ocurre cómo usar${it(w)}.`],
    eat: ["Eso no se come.", (_, w) => num(w, "No es comestible.", "No son comestibles."), (_, w) => `Decides no comérte${it(w)}.`],
    drink: ["Eso no se bebe.", "Ahí no hay nada que beber."],
    enter: ["No puedes entrar ahí.", "No hay forma de entrar."],
    exit: ["No hay una salida clara desde aquí.", "No puedes salir por ahí."],
    climb: ["No puedes trepar por ahí.", "No hay nada a lo que subir.", "No se puede escalar."],
    jump: ["Saltas en el sitio. No pasa nada.", "Saltas. Aterrizas.", "Un saltito. Nada cambia."],
    sit: ["Prefieres seguir de pie.", "No hay dónde sentarse a gusto.", "Decides no sentarte."],
    lie: ["No es sitio para tumbarse.", "Prefieres seguir de pie."],
    stand: ["Ya estás de pie.", "Estás de pie."],
    sleep: ["No tienes sueño.", "No es momento de dormir.", "Cierras los ojos un momento. Nada cambia."],
    wake: ["Ya estás despierto.", "Aquí no duerme nadie."],
    wait: ["Pasa el tiempo.", "Esperas.", "Pasa un momento."],
    talk: ["No hay nadie con quien hablar.", "Nadie contesta.", "Silencio."],
    ask: ["No hay nadie a quien preguntar.", "Nadie contesta.", "Ninguna respuesta."],
    say: ["Hablas. Nadie contesta.", "Tus palabras se apagan.", "Nada responde."],
    shout: ["Gritas. Nada responde.", "Tu voz resuena y se apaga.", "Un grito, y luego silencio."],
    sing: ["Tarareas unos compases.", "Cantas bajito para ti.", "Unas notas, y luego silencio."],
    wave: ["Agitas la mano. Nadie te devuelve el saludo.", "Nadie ve tu gesto."],
    kiss: ["Mejor no.", "Te guardas el cariño para ti.", "No es el momento."],
    think: ["Piensas mucho. No se te ocurre nada.", "Ordenas tus ideas.", "Pensar ayuda un poco. No mucho."],
    pray: ["Rezas. No pasa nada, que tú sepas.", "Una oración en voz baja. Ninguna respuesta."]
  },

  // Las palabras para las cosas, por id de objeto (js/parser.js). g: género ("m"/"f"), para lo/la/los/las.
  names: {},

  // Las palabras del intérprete en español (PARSER.md capas 1–2). Verbos: infinitivo, imperativo (tú y usted)
  // y primera persona, que algunos jugadores escriben. Sin tildes: se quitan al leer (la ñ se queda).
  words: {
    verbs: {
      look: ["mirar", "mira", "mire", "miro", "m", "l", "mirar alrededor", "mira alrededor", "otear",
             "echar un vistazo", "echa un vistazo", "eche un vistazo", "echo un vistazo", "echar una mirada", "echa una mirada",
             "echar un ojo", "echa un ojo"],   // (más largas que «echar»: poner)
      examine: ["examinar", "examina", "examine", "examino", "x", "ex", "inspeccionar", "inspecciona", "inspeccione",
                "observar", "observa", "observe", "observo", "describir", "describe", "estudiar", "estudia", "ver", "veo",
                "mirar bien", "mira bien"],
      read: ["leer", "lee", "lea", "leo", "ojear", "ojea"],
      search: ["buscar", "busca", "busque", "busco", "registrar", "registra", "registre", "registro", "rebuscar",
               "rebusca", "mirar dentro", "mira dentro", "mirar debajo", "mira debajo", "mirar detras", "mira detras",
               "explorar", "explora"],
      listen: ["escuchar", "escucha", "escuche", "escucho", "oir", "oye", "oiga", "oigo"],
      smell: ["oler", "huele", "huela", "huelo", "olfatear", "olfatea", "olisquear", "olisquea"],
      taste: ["probar", "prueba", "pruebe", "pruebo", "saborear", "saborea", "lamer", "lame", "lama", "lamo"],
      touch: ["tocar", "toca", "toque", "toco", "palpar", "palpa", "acariciar", "acaricia", "frotar", "frota",
              "rozar", "roza", "tantear", "tantea"],
      take: ["coger", "coge", "coja", "cojo", "tomar", "toma", "tome", "tomo", "agarrar", "agarra", "agarre", "agarro",
             "recoger", "recoge", "recoja", "recojo", "guardar", "guarda", "guarde", "guardo", "pillar", "pilla",
             "llevar", "lleva", "lleve", "llevo", "llevarse", "llevate", "robar", "roba", "sacar", "saca"],
      drop: ["dejar", "deja", "deje", "dejo", "soltar", "suelta", "suelte", "suelto", "tirar", "tira", "tire", "tiro",
             "abandonar", "abandona", "desechar"],
      put: ["poner", "pon", "ponga", "pongo", "meter", "mete", "meta", "meto", "colocar", "coloca", "coloque", "coloco",
            "introducir", "introduce", "dejar en", "deja en", "echar", "echa", "eche", "echo"],   // «echa el pan en la caja», «echa la foto a la lámpara»
      give: ["dar", "da", "doy", "entregar", "entrega", "entregue", "entrego", "ofrecer", "ofrece", "ofrezca",
             "ofrezco", "regalar", "regala", "pasar", "pasa"],
      show: ["mostrar", "muestra", "muestre", "muestro", "enseñar", "enseña", "enseñe", "enseño"],
      throw: ["lanzar", "lanza", "lance", "lanzo", "arrojar", "arroja", "arroje", "arrojo", "tirar a", "tira a",
              "tirar contra", "tira contra"],
      wear: ["ponerse", "ponte", "pongase", "me pongo", "vestir", "vestirse", "vistete", "calzarse",
             // probarse una prenda; «probar» y «prueba» solos siguen siendo el sabor. Con pronombre ("pruébatela", "probársela",
             // "pruébesela") se leen como verbo + pronombre: «probarse» + «la».
             "probarse", "probarme", "probarte", "pruebate", "pruebese", "me pruebo"],
      remove: ["quitarse", "quitate", "quitese", "me quito", "desvestirse", "descalzarse", "sacarse"],
      inventory: ["inventario", "inv", "i"],
      time: ["hora", "fecha", "que hora es"],
      status: ["estado", "yo", "diagnostico", "diagnosticar", "como estoy"],
      open: ["abrir", "abre", "abra", "abro", "destapar", "destapa", "desenvolver"],
      close: ["cerrar", "cierra", "cierre", "cierro", "tapar"],
      lock: ["cerrar con llave", "cierra con llave", "echar la llave", "echa la llave"],
      unlock: ["abrir con llave", "abre con llave", "desbloquear", "desbloquea"],
      push: ["empujar", "empuja", "empuje", "empujo", "pulsar", "pulsa", "pulse", "pulso", "apretar", "aprieta",
             "apriete", "presionar", "presiona", "hacer sonar", "haz sonar"],   // "haz sonar la campanilla"
      pull: ["tirar de", "tira de", "tire de", "tiro de", "arrastrar", "arrastra", "arrastre", "jalar", "jala", "estirar",
             "estira"],
      turn: ["girar", "gira", "gire", "giro", "dar la vuelta", "da la vuelta", "dale la vuelta", "darle la vuelta",
             "dar cuerda", "da cuerda", "dale cuerda", "darle cuerda", "voltear", "voltea", "rotar", "rota",
             "torcer", "tuerce", "enroscar", "desenroscar"],
      move: ["mover", "mueve", "mueva", "muevo", "desplazar", "desplaza", "levantar", "levanta", "levante", "alzar",
             "alza"],
      switch_on: ["encender", "enciende", "encienda", "enciendo", "prender", "prende", "activar", "activa", "conectar",
                  "conecta"],
      switch_off: ["apagar", "apaga", "apague", "apago", "desactivar", "desactiva", "desconectar", "desconecta",
                   "soplar", "sopla"],
      attack: ["atacar", "ataca", "ataque", "ataco", "golpear", "golpea", "golpee", "golpeo", "pegar", "pega", "pegue",
               "pego", "romper", "rompe", "rompa", "rompo", "patear", "patea", "dar una patada", "da una patada",
               "dar un golpe", "da un golpe", "dar un puñetazo", "da un puñetazo", "destrozar", "destroza", "machacar",
               "machaca", "matar", "mata", "luchar", "lucha", "abofetear"],
      knock: ["llamar", "llama", "llame", "llamo", "aporrear", "aporrea", "golpear la puerta"],
      use: ["usar", "usa", "use", "uso", "utilizar", "utiliza", "utilice", "utilizo", "emplear", "emplea", "manejar",
            "maneja"],
      eat: ["comer", "come", "coma", "como", "tragar", "traga", "trague", "trago", "tragarse", "tragate", "comerse",
            "comete", "devorar", "devora", "masticar", "mastica", "engullir"],
      drink: ["beber", "bebe", "beba", "bebo", "beberse", "sorber", "sorbe", "tragar agua"],
      go: ["ir", "ve", "vaya", "voy", "andar", "anda", "ande", "ando", "caminar", "camina", "camine", "camino", "dirigirse",
           "dirigete", "avanzar", "avanza", "correr", "corre", "gatear", "gatea", "visitar", "visita", "visite", "visito",
           "volver", "vuelve", "vuelva", "vuelvo", "regresar", "regresa", "regrese", "regreso"],
      enter: ["entrar", "entra", "entre", "entro", "meterse", "metete", "pasar dentro", "pasa dentro", "embarcar", "embarca",
              "embarque", "embarco", "subir a bordo", "sube a bordo", "montarse en", "montate en"],
      exit: ["salir", "sal", "salga", "salgo", "irse", "vete", "marcharse", "marchate", "bajarse", "bajate", "apearse", "apeate"],
      climb: ["trepar", "trepa", "trepe", "trepo", "escalar", "escala", "escale", "escalo", "subir a", "sube a", "montar", "monta", "montate",
              "subirse", "subete", "encaramarse"],
      jump: ["saltar", "salta", "salte", "salto", "brincar", "brinca"],
      sit: ["sentarse", "sientate", "sientese", "me siento", "sentar"],
      lie: ["tumbarse", "tumbate", "tumbese", "me tumbo", "acostarse", "acuestate", "echarse", "echate", "tenderse",
            "tiendete"],
      stand: ["levantarse", "levantate", "levantese", "me levanto", "ponerse de pie", "ponte de pie", "incorporarse"],
      sleep: ["dormir", "duerme", "duerma", "duermo", "dormirse", "duermete", "echar una siesta", "descansar", "descansa"],
      wake: ["despertar", "despierta", "despierte", "despertarse", "despiertate"],
      wait: ["esperar", "espera", "espere", "espero", "z", "aguardar", "aguarda", "quedarse", "quedate"],
      talk: ["hablar", "habla", "hable", "hablo", "hablar con", "habla con", "charlar", "charla", "conversar",
             "saludar", "saluda", "salude", "hola", "platicar", "platica", "platique", "platico"],   // (platicar: lo escribe quien lo dice así)
      ask: ["preguntar", "pregunta", "pregunte", "pregunto", "consultar", "consulta", "interrogar", "interroga"],
      say: ["decir", "di", "diga", "digo", "contestar", "contesta", "responder", "responde", "susurrar", "susurra",
            "murmurar", "murmura"],
      shout: ["gritar", "grita", "grite", "grito", "chillar", "chilla", "vociferar", "aullar", "aulla"],
      sing: ["cantar", "canta", "cante", "canto", "tararear", "tararea", "silbar", "silba"],
      wave: ["agitar la mano", "agita la mano", "hacer señas", "haz señas", "señalar", "señala", "gesticular"],
      kiss: ["besar", "besa", "bese", "beso", "abrazar", "abraza", "abrace", "abrazo"],
      think: ["pensar", "piensa", "piense", "pienso", "recordar", "recuerda", "reflexionar", "reflexiona", "meditar",
              "medita"],
      pray: ["rezar", "reza", "rece", "rezo", "orar", "ora", "bendecir"],
      help: ["ayuda", "ayudar", "ayudame"],
      hint: ["pista", "pistas"]
    },
    // Empezar la historia de nuevo: solo se entiende tras el final (js/parser.js), donde la última línea de la historia lo ofrece.
    restart: ["empezar de nuevo", "empezar otra vez", "empezar de cero", "empezar otra partida", "empieza de nuevo",
              "empieza otra vez", "empieza de cero", "comenzar de nuevo", "comenzar otra vez", "comienza de nuevo",
              "volver a empezar", "reiniciar", "reinicia", "reiniciar partida", "partida nueva", "nueva partida",
              "otra partida", "jugar de nuevo", "jugar otra vez", "juega de nuevo"],
    meta: {
      earlier: ["otra vez", "g", "repetir", "repite"],   // sin orden propia: la respuesta señala la flecha arriba (useUp)
      undo: ["deshacer", "deshaz"],
      oops: ["ups", "uy"],
      save: ["grabar", "graba", "salvar", "guardar partida"],
      load: ["cargar", "carga", "recuperar"],
      clear: ["limpiar", "limpia", "borrar", "borra", "cls"],
      map: ["mapa"],                        // el mapa de por dónde has estado (ui/map.js)
      quit: ["salir del juego", "abandonar partida", "salir"]   // vuelve a la lista de juegos. Las más largas primero. «salir» es también el camino hacia fuera: mientras dura la historia sigue siendo eso, y solo sale del juego tras el final (js/parser.js)
    },
    dirs: { n: ["n", "norte"], s: ["s", "sur"], e: ["e", "este"], w: ["o", "oeste", "w"], u: ["u", "arriba", "sube", "subir", "suba", "subo", "escaleras arriba", "sube escaleras", "subir escaleras",
                 "suba escaleras", "subo escaleras"],
            d: ["d", "abajo", "baja", "bajar", "baje", "escaleras abajo", "baja escaleras", "bajar escaleras",
                 "baje escaleras"],   // ("bajo" is "under": a preposition, not a direction)
            // Hacia dentro / hacia fuera de un lugar (un coche, una cabaña). Los verbos (entra, sal…) se leen primero como
            // verbos y significan lo mismo solos en una sala con esa salida (js/parser.js).
            in: ["dentro", "adentro", "entra", "entrar", "entre", "metete", "meterse"],
            out: ["fuera", "afuera", "sal", "salir", "salga", "bajate"] },
    // Lo que dice el texto de una sala cuando invita a entrar o salir (el verificador avisa si nada en la sala responde a
    // "dentro" / "fuera": js/check.js). Palabras enteras; `not` antes de una frase la vuelve una negativa ("no entres").
    invites: {
      in: ["entra", "entrar", "entras", "pasa dentro", "pasar dentro", "adentro", "métete", "metete", "meterte"],
      out: ["salir", "sal de", "sales de", "sal fuera", "salir fuera", "sálte"],
      not: ["no", "nunca", "jamas", "jamás", "tampoco"],
      // Lo que va justo antes de un verbo que el texto ofrece («puedes nadar», «podrías remar»): el verificador avisa si lo que se
      // ofrece es un decorado al que nada responde (js/check.js).
      can: ["puedes", "podrías", "podrias", "podrás", "podras", "debes", "deberías", "deberias", "quieres"]
    },
    // El español de España es el del juego: lo que el juego escribe (descripciones, líneas, nombres, pistas, finales) lleva las palabras
    // de la Península. `avoid`: palabras solo latinoamericanas; `prefer`: la de España para cada una. El verificador AVISA (nunca
    // rechaza) cuando un mundo en español usa una de `avoid` (js/check.js, regionalWarnings). Se leen como todas las palabras del
    // paquete (sin tildes, ñ = n), enteras. Lo que escribe el jugador no cambia: el intérprete entiende «agarra», «tomar»,
    // «platica»… y las listas de palabras de cada mundo guardan las dos formas.
    regional: {
      avoid: ["carro", "carros", "boleto", "boletos", "platicar", "plática", "pláticas", "rentar", "celular", "celulares",
              "computadora", "computadoras", "computador", "jugo", "jugos", "departamento", "departamentos", "manejar", "ahorita",
              "lindo", "linda", "lindos", "lindas", "chévere", "estacionar", "estacionamiento", "elevador", "elevadores",
              "frazada", "mesero", "mesera", "durazno", "frutilla", "palta", "frijol", "frijoles", "maní", "cacahuate",
              "pollera", "remera", "chompa", "regadera", "recámara", "cajuela", "popote", "chamaco", "pibe", "bacán", "chido",
              "chida", "órale", "ándale", "híjole", "enojarse", "enojado", "enojada", "vos"],
      prefer: { carro: "coche", carros: "coches", boleto: "billete", boletos: "billetes", platicar: "charlar", plática: "charla",
                pláticas: "charlas", rentar: "alquilar", celular: "móvil", celulares: "móviles", computadora: "ordenador",
                computadoras: "ordenadores", computador: "ordenador", jugo: "zumo", jugos: "zumos", departamento: "piso",
                departamentos: "pisos", manejar: "conducir", ahorita: "ahora mismo", lindo: "bonito", linda: "bonita",
                lindos: "bonitos", lindas: "bonitas", chévere: "genial", estacionar: "aparcar", estacionamiento: "aparcamiento",
                elevador: "ascensor", elevadores: "ascensores", frazada: "manta", mesero: "camarero", mesera: "camarera",
                durazno: "melocotón", frutilla: "fresa", palta: "aguacate", frijol: "judía", frijoles: "judías", maní: "cacahuete",
                cacahuate: "cacahuete", pollera: "falda", remera: "camiseta", chompa: "jersey", regadera: "ducha",
                recámara: "dormitorio", cajuela: "maletero", popote: "pajita", chamaco: "chico", pibe: "chaval", bacán: "genial",
                chido: "guay", chida: "guay", órale: "venga", ándale: "venga", híjole: "vaya", enojarse: "enfadarse",
                enojado: "enfadado", enojada: "enfadada", vos: "tú" }
    },
    articles: ["el", "la", "los", "las", "un", "una", "unos", "unas", "mi", "mis"],
    preps: ["hasta", "a", "al", "de", "del", "en", "con", "sobre", "bajo", "hacia", "para", "por", "dentro", "contra"],
    and: ["y", "e"],
    then: ["luego", "despues", "entonces"],
    it: ["lo", "la", "los", "las", "le", "les", "eso", "el", "ella", "ellos", "ellas"],
    // Lo que prefiere cada pronombre: género (g), número (pl) y si es una persona (person: un personaje, un objeto con
    // temas): «le», «les» y «él», «ella»… (tras una preposición: «habla con él») nunca son una cosa.
    pronouns: { lo: { g: "m", pl: false }, la: { g: "f", pl: false }, los: { g: "m", pl: true }, las: { g: "f", pl: true },
                le: { person: true }, les: { person: true, pl: true },
                el: { person: true, g: "m", pl: false }, ella: { person: true, g: "f", pl: false },
                ellos: { person: true, g: "m", pl: true }, ellas: { person: true, g: "f", pl: true } },
    // Lo particular del español al leer (js/parser.js). Un idioma nuevo pone aquí lo suyo.
    grammar: {
      fold: {},                                    // lo que escribe un teclado sin cierta letra (alemán: ß → ss): al leer, antes de quitar las tildes. La ñ no necesita nada: sin tilde es n, y «enseña» y «ensena» son la misma palabra
      elisions: {},                                // formas cortas que se escriben enteras antes de leer
      secondObject: ["con", "en", "sobre", "a", "al", "del", "contra", "por"],   // "abre la puerta CON la llave", "da la caracola AL portero"
      fromWords: ["de", "del"],                    // "saca la carta DE la botella": de dónde se saca una cosa
      // Pronombres pegados al verbo: "cógelo", "dáselo"; y la r del infinitivo para "tragarse" → "tragar".
      attached: { joined: true, hyphen: false, verbEndings: ["r"],
                  forms: ["selos", "selas", "selo", "sela", "los", "las", "lo", "la", "les", "le", "me", "te", "se", "nos"],
                  // "pregúntale (a)l portero": le solo repite a quien se nombra después
                  doubling: { forms: ["le", "les"], preps: ["a", "al"] },
                  // «dáselo»: se = a él / a ella, lo = la cosa («selo» → «le» + «lo»)
                  pairs: { selo: { person: "le", thing: "lo" }, sela: { person: "le", thing: "la" },
                           selos: { person: "le", thing: "los" }, selas: { person: "le", thing: "las" } } },
      speechTo: ["a", "al"],                       // a quién se dice: "di hola AL portero"
      oneWords: ["uno", "una", "unos", "unas"],    // "la de hierro, UNA": responde a «¿Cuál quieres decir?» sin nombrar nada
      verbPreps: { enter: "en" },                  // lo que lleva un verbo antes de su objeto, en las pistas (`{enter+}`): «Entrar EN puerta»
      nameParts: ["del"],                          // pueden ser parte de un nombre: "la butaca DEL pasillo" es una sola cosa, no dos
      contractions: { al: ["a", "el"], del: ["de", "el"] },   // justo después del verbo se escriben enteras: "sal DEL coche", "sube AL tren"
      lowerNames: true,                            // los nombres dentro de una frase, en minúscula ("lata de caramelos")
      gender: true                                 // las cosas llevan género (`words.g`) y las respuestas normales concuerdan con él
    },
    // Palabras alrededor de una orden que no añaden nada: delante solo si sigue un verbo o una dirección ("puedo
    // subir al tren"), detrás si queda algo ("sube al tren de todos modos").
    filler: {
      start: ["puedo", "podria", "quiero", "quisiera", "me gustaria", "necesito", "voy a", "vamos a", "intento",
              "intentar", "intenta", "trato de", "tratar de", "por favor", "ahora", "solo", "yo"],
      end: ["por favor", "de todos modos", "de todas formas", "igualmente", "ahora", "ya", "gracias", "si puedo", "si es posible"]
    },
    yes: ["si", "s", "vale", "ok", "claro", "venga"],
    no: ["no", "n", "nada"]
  }
};
