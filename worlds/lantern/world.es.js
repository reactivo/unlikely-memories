// «La última palabra en Lantern Row»: el mundo después de la apertura, en español. No es una traducción: está escrito
// como lo escribiría un autor de aquí (WRITING-DIRECTION.md §8). Mismos ids, mismas salas, mismas reglas, mismos finales
// que world.en.js; cambian las palabras y los juegos de palabras. Un solo conjunto de cambios, todo o nada; datos llanos.

import pictures, { endings } from "./pictures.js";
import sprites from "./sprites.js";

// ---- La biblia del juego -----------------------------------------------------------------------------------------------
export const bible = {
  title: "La última palabra en Lantern Row",
  blurb: "Una niebla de Londres que guarda lo que se dice en ella. Un farolero muerto bajo el único farol que no encendió, en su puesto. La investigación es a medianoche.",
  thumbnail: { picture: "row", x: 60 },   // la tarjeta de la página de inicio: la imagen de esta sala, recortada 225 píxeles desde la columna x (0–95)
  synopsis: "Bajas de un coche de punto detenido a una niebla de Londres tan espesa que guarda lo que se dice en ella. " +
    "Te han citado como testigo en la investigación de la muerte de Albert Fenn, farolero, que murió esta noche bajo el " +
    "único farol de Lantern Row que no encendió, y que sigue allí sentado, esperando a que lo releven. El tribunal se " +
    "reúne a medianoche, y querrá un nombre.",
  tone: "WRITING-DIRECTION.md. Londres en la niebla, de faroles de gas, tiendas de pasteles e investigaciones; modales " +
    "de policía; una muerte sin una sola marca en el cuerpo. Tierno: el crimen es una bondad dicha a destiempo.",
  start: "Jueves, 22:30, en Lantern Row (la apertura, en el coche, a las 22:20).",
  opening: "Dentro de un coche de punto detenido en la niebla: un canario en " +
    "una jaula (pistas), una citación que ya llevas (por qué has venido). La niebla al otro lado de las portezuelas " +
    "plegables es el camino.",
  rules: [
    "Las palabras dichas en la niebla quedan colgadas donde se dijeron hasta que alguien las oye hasta el final.",
    "Los muertos conservan su puesto hasta que alguien los releva.",
    "Un nombre dicho en el tribunal del forense es la verdad desde ese momento; la niebla se encarga de ello.",
    "Cada farol de la calle se enciende a mano, el último al final."
  ],
  characters: ["El señor Fenn, el farolero muerto", "El agente Pye", "La señora Halloran, de la tienda de pasteles",
    "El señor Voss, de la Compañía Eléctrica", "El señor Cotter, de The Bell", "El doctor Mabbott, el forense",
    "Pip, una niña que rebusca en el fango"],
  endings: [
    "La verdad: lleva a la investigación las últimas palabras oídas junto al farol; vuelven con quien las dijo, y la niebla se levanta.",
    "Relevado: enciende tú el último farol y ocupa el puesto del farolero.",
    "El nombre equivocado: nombra al señor Voss ante el tribunal. La niebla lo guarda, y no se levanta nunca.",
    "Muerto: el río se te lleva, si vuelves a bajar a él después de su aviso."
  ],
  chaos: 0.2
};

// Las cosas llevadas tienen sus sprites (sprites.js): el que se ve al examinarlas y el que se dibuja en el suelo.
const item = (id) => ({ img: id, sprite: sprites[id], ...(sprites[id + "_floor"] ? { floorSprite: sprites[id + "_floor"] } : {}) });

// Lo que se puede decir ante el tribunal para nombrar a alguien, como lo deja el intérprete (sin tildes, la ñ se queda, sin
// artículos quitados: lo dicho se guarda tal cual). Combina las formas de nombrarlo con las maneras de decirlo.
const named = (names, opening = ["", "el ", "fue ", "fue el ", "ha sido ", "ha sido el ", "es ", "es el ", "lo hizo ", "lo hizo el ",
  "el culpable es ", "el culpable es el ", "culpable ", "culpable el ", "que fue ", "que fue el ", "que ha sido ", "que ha sido el ",
  "que es ", "que es el ", "que lo hizo ", "que lo hizo el ", "fue culpa de ", "fue culpa de el ", "es culpa de ", "es culpa de el "]) => [...new Set(opening.flatMap(a => names.map(n => a + n)))];

// Los nombres que el tribunal acepta cuando pregunta «¿De quién?» (reglas name_*), también como «de …», «fue …»,
// «acuso a …», «nombro a …» o «di …» (la respuesta se compara sin mayúsculas, tildes ni puntuación: «¡La señora Halloran!»).
const answered = (names) => named(names, ["", "el ", "la ", "de ", "del ", "de la ", "fue ", "fue el ", "fue la ", "el de ", "la de ",
  "acuso a ", "acuso al ", "acuso a la ", "acusa a ", "acusa al ", "acusa a la ", "nombro a ", "nombro al ", "nombro a la ",
  "nombra a ", "nombra al ", "nombra a la ", "di ", "digo ", "culpable "]);
const HALLORAN = answered(["halloran", "señora halloran", "doña halloran", "pastelera", "la pastelera", "la de los pasteles"]);
const VOSS = answered(["voss", "señor voss", "don voss", "compañía", "la compañía", "compañía eléctrica", "la compañía eléctrica", "la eléctrica"]);
const FENN = answered(["fenn", "señor fenn", "albert", "albert fenn", "farolero", "el farolero", "difunto", "el difunto", "muerto", "el muerto"]);

// ---- Los dibujos de los finales ---------------------------------------------------------------------------------------------
// Los dibujos no llevan lengua (pictures.js); lo que cada uno dice a un lector de pantalla (alt) se dice aquí, en español.
const endingPictures = {
  truth: { alt: "Lantern Row desde muy arriba, al amanecer, sin niebla: tejados en filas, una línea de doce faroles encendidos a lo largo de la calle y el río curvándose, rosa con el cielo. Dos figuras pequeñas se alejan por la orilla, del brazo.", picture: endings.truth },
  relieved: { alt: "De cerca, la linterna del último farol, encendida: cuatro cristales de luz amarilla alrededor de una llama blanca, la tapa de hierro arriba y, abajo, junto a la llave del gas, el gancho de latón de una pértiga de farolero.", picture: endings.relieved },
  blamed: { alt: "Desde muy arriba, un mar gris y liso de niebla sobre Londres, con las chimeneas asomando en filas y una pequeña luz blanca y dura donde debería estar Lantern Row.", picture: endings.blamed },
  died: { alt: "De cerca, una pequeña jaula de latón en la niebla gris. El canario está en su percha con la cabeza bajo el ala, y la niebla se cuela entre los barrotes.", picture: endings.died }
};

// ---- Salas -------------------------------------------------------------------------------------------------------------
// Zona "cab": la apertura, a la que no se vuelve. Zona "row" (la x crece al este, la y al sur): el tribunal al norte de la
// calle, The Bell al oeste y la tienda de pasteles al este; el último farol al sur, con la subestación al oeste, la
// caseta al este y la escalera del río al sur; el puente al este de la escalera.
const rooms = {
  cab: {
    name: "EL COCHE DE PUNTO", area: "cab", at: [0, 0, 0],
    describe: [
      "Dentro de un coche de punto, detenido. El caballo se ha ido, y con él el cochero; las riendas cuelgan junto a la ventanilla como una frase que nadie terminó. Al otro lado del cristal solo hay blanco.",
      "Frente a tus rodillas, las portezuelas plegables están abiertas a la {niebla|cab_fog}, y es el único camino."
    ],
    exits: { out: true },
    scenery: [
      { words: ["riendas", "rienda", "cochero", "caballo", "varas", "limoneras"], name: "las riendas", says: "Riendas de cuero, que suben por encima del techo hasta donde estaba el cochero. Siguen tibias allí donde las sujetó." },
      { words: ["ventanilla", "ventana", "cristal", "vidrio"], name: "la ventanilla", says: "Una pequeña ventanilla lateral, empañada. Al otro lado, blanco, y nada en el blanco." },
      { words: ["asiento", "cojin", "felpa", "banqueta", "coche", "punto"], name: "el asiento", says: "Felpa roja, gastada hasta brillar por muchísima gente que iba a algún sitio con prisa. El tuyo es el único lugar tibio.", leads: "out" },
      { words: ["gancho", "techo", "tejado"], name: "el gancho", says: "Un gancho de latón en el techo, para un farol. Alguien ha colgado en él un pájaro." }
    ],
    mentions: ["riendas", "ventanilla", "cristal", "niebla", "portezuelas", "asiento", "gancho", "techo"],
    ambience: { lines: [
      "El coche se mece un poco sobre sus ballestas, como si el caballo acabara de salir de las varas.",
      "En algún punto del blanco suena una campana, una vez, muy lejos, para otro.",
      "El canario se desplaza por su percha y mira las portezuelas.",
      "Una gota de niebla se forma en el cristal, y decide no resbalar."
    ], every: [25, 60] },
    alt: "Desde el interior de un coche de punto oscuro, con felpa roja a ambos lados, mirando por sus portezuelas abiertas a una espesa niebla blanca. Las riendas cuelgan a través de la abertura; a lo lejos, entre la niebla, la mancha de un farol encendido.",
    overlayAlt: {
      canary: "Un canario en una pequeña jaula de latón cuelga de un gancho del techo.",
    }
  },
  row: {
    name: "LANTERN ROW", area: "row", at: [1, 0, 0],
    describe: [
      "Lantern Row: una calle de tiendas entre el tribunal del forense y el río, alumbrada por gas. Con esta niebla los faroles cuelgan como naranjas envueltas en papel de seda; podría ser cualquier hora.",
      "{El agente Pye|pye} hace su ronda, que es la calle, que es corta. Al norte, tras unas {puertas|court_doors} de roble, el tribunal. El pub The Bell está al oeste, la tienda de pasteles al este. Al sur, la calle baja al último farol y el río."
    ],
    exits: {
      n: { to: "court", if: { "time.hour": { between: [0, 6] } }, closed: "Las puertas del tribunal están cerradas. La cartulina que las cubre dice que la investigación es a medianoche." },
      w: { to: "bell", if: { "time.hour": { between: [11, 23] } }, closed: "The Bell está cerrado. A través de la ventana, las sillas están sobre las mesas con las patas al aire, como algo que se ha dado por vencido." },
      e: "pie_shop", s: "last_lamp"
    },
    scenery: [
      { words: ["faroles", "farol", "farolas", "farola", "gas", "naranjas", "naranja"], name: "los faroles", says: "Faroles de gas sobre postes de hierro, uno cada pocas puertas, cada uno encendido a mano. En la niebla se dan luz a sí mismos y no mucha a nadie más." },
      { words: ["bell", "pub", "campana", "taberna"], name: "el pub The Bell", says: "La fachada baja de un pub, barniz marrón y latón, con un olor a cerveza negra que sale por la puerta.", leads: "w" },
      { words: ["tienda", "pasteleria", "pasteles", "pastel", "halloran"], name: "la tienda de pasteles", says: "El escaparate de la tienda de pasteles está amarillo y empañado.", leads: "e" },
      { words: ["fachadas", "fachada", "tiendas", "escaparates", "calle"], name: "las fachadas", says: "Un estanco, una cerería, una tienda que arregla paraguas y nada más. Todo cerrado, todo alumbrado por el farol de otro." },
      { words: ["niebla", "bruma", "calima"], name: "la niebla", says: "Gris amarillenta y tan espesa que se puede apoyar uno en ella. De vez en cuando pasa una palabra a la altura de la cabeza, demasiado débil para entenderla." },
      { words: ["adoquines", "adoquin", "bordillo"], name: "los adoquines", says: "Adoquines mojados. La niebla lleva tanto tiempo tendida sobre ellos que han tomado su color." }
    ],
    mentions: ["agente Pye", "puertas", "faroles", "fachadas", "niebla", "adoquines"],
    ambience: { lines: [
      "Un farol más abajo tose, y se serena.",
      "Pasan pasos entre la niebla, muy cerca, y nadie los acompaña.",
      "Una palabra pasa flotando a la altura de la cabeza, demasiado débil para entenderla, como una polilla que ha perdido su farol.",
      "El agente Pye se detiene, anota algo en su libreta y sigue andando.",
      "Buscas con la mirada el coche. Solo ves [way], igual que en todas partes."
    ], every: [40, 80] },
    // El tribunal se reúne a medianoche: vale la pena esperarla aquí siempre que no esté reunido.
    waitFor: { time: "next 00:00", says: "Esperas junto a las puertas del tribunal. La niebla viene y se pone a tu lado, y también espera.", if: [{ "time.hour": { between: [6, 24] } }] },
    alt: "Una calle de fachadas de tiendas en espesa niebla gris, vista desde el centro de los adoquines: faroles de gas que se alejan como borrones naranjas, la ventana roja de The Bell a la izquierda, la amarilla de la tienda de pasteles a la derecha, las puertas oscuras del tribunal al fondo y, a la derecha, un policía con casco de pie."
  },
  bell: {
    name: "THE BELL", area: "row", at: [0, 0, 0],
    describe: [
      "The Bell: barniz marrón, vigas bajas y un calor como el del interior del abrigo de alguien. Unos hombres de gorra cantan en la barra, cada uno un poco por detrás del anterior.",
      "{El señor Cotter|cotter}, el tabernero, saca brillo a un vaso que nunca estará lo bastante limpio para él. En la chimenea arde un {fuego|fire}. La calle queda al este."
    ],
    exits: { e: { to: "row", out: true } },
    scenery: [
      { words: ["barra", "mostrador", "grifos", "bomba", "bombas"], name: "la barra", says: "Caoba, marcada por cuarenta años de codos. Las manillas de latón de los grifos están gastadas con la forma de unas manos." },
      { words: ["hombres", "hombre", "gorras", "gorra", "cantores", "canto", "cancion", "coro", "estribillo"], name: "los hombres de la barra", says: "Estibadores y cocheros, cantando sobre un río y una chica que no quiso. Ninguno se sabe toda la letra. Entre todos casi se la saben." },
      { words: ["vigas", "viga", "barniz", "techo"], name: "las vigas", says: "Tan bajas que hay que agacharse. El barniz ha tomado el color del té cargado." },
      { words: ["vaso", "vasos", "copa", "copas"], name: "el vaso", says: "El señor Cotter lo levanta contra el farol, le encuentra un defecto que nadie más sería capaz de ver y sigue sacándole brillo." },
      { words: ["chimenea", "hogar", "rejilla", "parrilla"], name: "la chimenea", says: "Una rejilla de hierro, con el carbón amontonado hasta arriba." }
    ],
    mentions: ["señor Cotter", "fuego", "barra", "hombres", "vaso", "vigas", "chimenea"],
    ambience: { lines: [
      "El canto se detiene el tiempo de un aliento, y vuelve a empezar un poco más adelante.",
      "Alguien en la barra dice el nombre de Fenn, y los demás beben por él sin saber muy bien por qué.",
      "El fuego se asienta. Un hombre de gorra lo mira como si le debiera dinero.",
      "La puerta se abre, la niebla se asoma, y alguien le cierra la puerta en las narices."
    ], every: [35, 70] },
    alt: "Un pub de vigas bajas en silueta: hombres de gorra negros contra el resplandor rojo y naranja de un fuego de carbón a la izquierda, una larga barra oscura y, tras ella, el tabernero sosteniendo en alto un vaso."
  },
  pie_shop: {
    name: "HALLORAN'S", area: "row", at: [2, 0, 0],
    describe: [
      "Una tienda de pasteles tan ancha como un perchero: un mostrador, un escaparate empañado hasta la ceguera y un {horno|oven} que no se ha apagado desde los tiempos de la vieja Reina. Todo huele a masa y a grasa caliente.",
      "{La señora Halloran|halloran} está tras el mostrador con harina hasta los codos, pasando el trapo por un sitio que ya está limpio. La calle queda al oeste."
    ],
    exits: { w: { to: "row", out: true } },
    scenery: [
      { words: ["mostrador", "bandejas", "bandeja", "pasteles", "masa"], name: "el mostrador", says: "Bandejas de pasteles en filas, cada uno con un respiradero cortado en forma de hoja. En una de las filas falta uno." },
      { words: ["escaparate", "ventana", "vaho", "vapor", "letra", "cristal"], name: "el escaparate", says: "Empañado por dentro hasta no ver. Alguien ha escrito con un dedo una sola letra en el vaho, una A, y el vaho casi se la ha llevado de vuelta." }
    ],
    mentions: ["horno", "señora Halloran", "mostrador", "escaparate", "pasteles", "harina"],
    smell: "Masa y grasa caliente, y debajo algo más dulce: el olor de una cocina donde siempre se espera a alguien.",
    alt: "Una tienda de pasteles vista desde arriba: un largo mostrador marrón con bandejas de pasteles dorados en filas, la boca encendida de un horno de hierro arriba, un escaparate empañado a lo largo del borde inferior y una mujer con gorro blanco inclinada sobre el mostrador, a la derecha."
  },
  court: {
    name: "TRIBUNAL DEL FORENSE", area: "row", at: [1, -1, 0],
    describe: [
      "Una sala barnizada con un pupitre alto, un {estrado de testigos|witness_box} y un jurado de doce sillas, ocupadas por la niebla, que escucha. Las investigaciones de la calle se celebran a medianoche, para que el difunto pueda asistir si le apetece.",
      "{El doctor Mabbott|mabbott}, el forense, espera en el pupitre con su pluma. La calle queda al sur."
    ],
    exits: { s: { to: "row", out: true } },
    scenery: [
      { words: ["pupitre", "tribuna", "sitial", "tachuelas", "cuero", "paneles"], name: "el pupitre", says: "Alto y verde, con tachuelas de latón. Lo construyeron para que los forenses miraran las cosas desde arriba, y lo hacen." },
      { words: ["sillas", "silla", "jurado", "niebla"], name: "el jurado", says: "Doce sillas en dos filas. La niebla las ha ocupado todas y está muy quieta, como se queda un jurado que ya ha decidido escuchar." }
    ],
    mentions: ["estrado de testigos", "doctor Mabbott", "pupitre", "sillas", "jurado", "niebla", "pluma"],
    alt: "Mirando hacia arriba desde el estrado de testigos a un alto pupitre verde de forense: un hombre delgado de negro encima con una pluma, una lámpara de pantalla verde a su lado y, a la derecha, doce sillas de jurado con niebla pálida sentada en ellas."
  },
  last_lamp: {
    name: "EL ÚLTIMO FAROL", area: "row", at: [1, 1, 0],
    describe: [
      "El final de la calle, donde los adoquines acaban en el muro del río. Todos los faroles están encendidos menos el último {farol|dark_lamp}. Debajo, en el bordillo, {el señor Fenn|fenn}, el farolero, con las manos en las rodillas. Murió aquí esta noche, y nadie lo ha relevado.",
      "La {niebla|fog_lamp} es aquí más espesa, y murmura. Su {caseta|hut_door} queda al este, la subestación al oeste. Unos escalones bajan al río, al sur; la calle sube al norte."
    ],
    exits: {
      n: "row", w: "substation", s: "river_steps",
      // La caseta es el único edificio al que aquí significa «dentro» (la subestación se entra por su nombre): el camino al este es también el camino dentro.
      e: { to: "hut", in: true, if: { "hut_door.locked": false }, closed: "La puerta de la caseta está cerrada con llave. Necesita la llave del señor Fenn." }
    },
    scenery: [
      { words: ["muro", "bordillo", "adoquines", "rio"], name: "el muro del río", says: "Un muro bajo de piedra negra, y el río chapoteando contra él en algún lugar de abajo. El bordillo está gastado allí donde un solo hombre se sentó una vez." },
      { words: ["escalones", "escalon", "escalera", "peldaños", "peldanos"], name: "los escalones", says: "Escalones de piedra que bajan al río, al sur.", leads: "s" }
    ],
    mentions: ["farol", "señor Fenn", "bordillo", "adoquines", "niebla", "caseta", "muro del río", "escalones"],
    ambience: { lines: [
      "La niebla murmura, una palabra aquí, media palabra allá, como un público en otra sala.",
      "El río chapotea contra el muro, una vez, como para dejar algo claro.",
      "Un farol calle arriba sisea, y el señor Fenn vuelve la cabeza hacia él, por costumbre.",
      "El señor Fenn se aclara la garganta, lo piensa mejor y sigue estando muerto."
    ], every: [35, 70] },
    // Vale la pena esperar hasta que cierre The Bell y la calle se calle.
    waitFor: { time: "next 23:00", says: "Esperas junto al último farol con el señor Fenn. Ninguno de los dos dice nada, que es lo que él prefiere.", if: [{ "time.hour": { between: [11, 23] } }] },
    alt: "Una vista amplia a lo largo de un muro de río en niebla azul oscura. A la izquierda, un alto poste de hierro con el farol apagado, el cristal negro; a su pie, un hombre menudo con gorra sentado en el bordillo. A la derecha, una caseta verde de madera con su puerta. A lo lejos, calle arriba, el débil resplandor de otros faroles."
  },
  hut: {
    name: "LA CASETA DEL FAROLERO", area: "row", at: [2, 1, 0],
    describe: [
      "La caseta del señor Fenn: una caja de madera del tamaño de un armario, con olor a gas y a parafina. Cuarenta años de gorras cuelgan de cuarenta años de clavos, la más vieja arriba.",
      "Su {libro de registro|logbook} está abierto sobre el estante, en la página de hoy. La puerta queda al oeste."
    ],
    exits: { w: { to: "last_lamp", out: true } },
    scenery: [
      { words: ["gorras", "gorra", "clavos", "clavo"], name: "las gorras", says: "La misma gorra cuarenta veces, cada una un poco más verde que la siguiente. El clavo más nuevo está vacío." },
      { words: ["estante", "balda", "lata", "cerillas", "fosforos"], name: "el estante", says: "Una tabla sobre dos escuadras, con el libro de registro y una lata de cerillas que nadie ha necesitado en cuarenta años." },
      { words: ["puerta", "caseta"], name: "la puerta", says: "La puerta de la caseta, abierta, y fuera, al oeste, el último farol.", leads: "w" }
    ],
    mentions: ["gorras", "clavos", "libro de registro", "estante", "puerta"],
    alt: "Dentro de una caseta de madera diminuta, mirando a su pared del fondo: tres filas de gorras viejas en clavos, de un verde vivo arriba y más grises abajo, el último clavo vacío, y un estante con un libro de registro abierto y una lata roja.",
    overlayAlt: { trumpet: "Una trompetilla de latón abollada yace en el suelo." }
  },
  substation: {
    name: "LA SUBESTACIÓN", area: "row", at: [0, 1, 0],
    describe: [
      "La subestación de la Compañía Eléctrica: una sala de ladrillo con la única bombilla eléctrica de la calle y una {dínamo|dynamo} que zumba como un hombre que sabe que tiene razón.",
      "{El señor Voss|voss} está sentado bajo la bombilla, ante un escritorio, con el {libro de cuentas|ledger} abierto y un sombrero hongo que no se ha quitado desde que lo envió la Compañía. El último farol queda al este."
    ],
    exits: { e: { to: "last_lamp", out: true } },
    scenery: [
      { words: ["bombilla", "luz", "foco", "cable"], name: "la bombilla", says: "Una bombilla eléctrica colgada de su cable, muy blanca, muy segura de sí. Hace que el ladrillo parezca sorprendido en falta." },
      { words: ["escritorio", "mesa", "ladrillo", "ladrillos", "cables"], name: "el escritorio", says: "Un escritorio de la Compañía, ladrillo de la Compañía, cables de la Compañía que bajan al suelo, esperando al lunes." }
    ],
    mentions: ["dínamo", "señor Voss", "libro de cuentas", "bombilla", "escritorio", "sombrero hongo"],
    ambience: { lines: [
      "La dínamo cambia un poco de nota, como si se le hubiera ocurrido algo.",
      "La bombilla parpadea una vez, y el señor Voss la mira, dolido.",
      "Bajo el suelo, los cables nuevos de la calle zumban para sí, esperando al lunes."
    ], every: [40, 80] },
    alt: "Una sala de ladrillo iluminada por una sola bombilla eléctrica desnuda: una gran dínamo zumbante a la izquierda y, a la derecha, un hombre con sombrero hongo ante un escritorio con un libro de cuentas abierto."
  },
  river_steps: {
    name: "LA ESCALERA DEL RÍO", area: "row", at: [1, 2, 0],
    describe: [
      "Una escalera de piedra baja desde el muro del río hasta una franja de barro, y más abajo el Támesis pasa, pardo y sin prisa. Lo oyes mejor que lo ves.",
      "Al pie, {Pip|pip}, una niña que rebusca en el fango, remueve las cosas con un palo y guarda las buenas en un cubo. El {río|river} lame el último escalón, como si quisiera el siguiente. El puente queda al este; el último farol, arriba, al norte."
    ],
    exits: { n: "last_lamp", e: "bridge" },
    scenery: [
      { words: ["escalera", "escalones", "escalon", "muro"], name: "la escalera", says: "Escalones de piedra, verdes abajo, que vuelven a subir al último farol, al norte.", leads: "n" },
      { words: ["barro", "fango", "franja", "orilla"], name: "el barro", says: "Barro negro, brillante. Las cosas se hunden en él y, si Pip anda cerca, vuelven a aparecer." }
    ],
    mentions: ["Pip", "río", "barro", "escalera", "cubo", "palo", "Támesis"],
    ambience: { lines: [
      "El río chupa el último escalón y lo suelta.",
      "Pip sostiene algo ante la niebla, lo piensa mejor y lo deja caer otra vez en el barro.",
      "Lejos, sobre el agua, suena la campana de un barco, y nadie le contesta.",
      "Una palabra pasa flotando con la corriente, boca abajo."
    ], every: [35, 75] },
    alt: "Mirando hacia abajo desde un muro de río: una escalera de piedra baja a la izquierda hasta una franja de barro negro, una niña pequeña con un abrigo grande y un cubo sobre el barro, y el río pardo llenando el cuadro hasta una orilla lejana perdida en la niebla."
  },
  bridge: {
    name: "EL PUENTE", area: "row", at: [2, 2, 0],
    describe: [
      "Sobre el puente la niebla se aclara, como si se hubiera parado a tomar aliento. El río pasa por debajo sin un ruido. En la orilla, Lantern Row es un collar corto de faroles encendidos con un hueco al final.",
      "El {parapeto|parapet} está mojado y frío bajo tus manos. La mitad lejana del puente lleva años perdida en la niebla, y nadie va a buscarla. La escalera del río queda al oeste."
    ],
    exits: { w: "river_steps" },
    scenery: [
      { words: ["rio", "agua", "tamesis"], name: "el río", says: "Debajo, el río, pasando bajo el puente como si tuviera una cita." },
      { words: ["faroles", "farol", "collar", "hueco", "orilla", "calle", "lantern", "row"], name: "la calle", says: "Once faroles en fila, pequeños y amarillos, y luego un hueco donde debería estar el duodécimo." },
      { words: ["mitad", "lejana", "otra", "final"], name: "la mitad lejana", says: "Niebla, y más niebla. El puente se mete en ella y no sale. Nadie en la calle ha necesitado nunca la otra orilla." }
    ],
    mentions: ["parapeto", "río", "faroles", "orilla", "mitad lejana"],
    alt: "A lo lejos, sobre una niebla de azul pálido y un agua oscura, una orilla baja con una corta hilera de faroles amarillos diminutos y un hueco al final; un parapeto de piedra a lo largo del borde inferior de la imagen."
  }
};

// ---- Objetos -----------------------------------------------------------------------------------------------------------
const objects = {
  // La apertura: la cosa que coger, la que ya llevas y el camino (BRIEF.md §3).
  canary: { at: "cab", portable: true, name: "Canario", note: "Vigilando la niebla por ti.", actions: ["Coger canario", "Escuchar canario"], heldActions: ["Escuchar canario", "Examinar canario"],
    words: { nouns: ["canario", "pajaro", "ave", "jaula", "pajarito"], adj: ["amarillo", "laton", "pequeno", "pequeño", "dorado"], g: "m" }, ...item("canary"),
    here: "De un gancho del techo cuelga un {canario|canary} en una pequeña jaula de latón, vigilando la niebla por ti.",
    examine: "Un canario amarillo en una jaula de latón del tamaño de un sombrero. Los mineros los bajan a la mina para saber cuándo el aire se echa a perder. A este lo han traído a Londres, donde tiene mucho que decir." },
  summons: { at: "player", portable: true, name: "Citación", note: "Doblada, oficial.", actions: ["Leer citación"], heldActions: ["Leer citación"],
    words: { nouns: ["citacion", "citatorio", "papel", "documento", "carta"], adj: ["doblada", "oficial", "judicial"], g: "f" }, ...item("summons"),
    examine: "«Se cita como testigo en la investigación de la muerte de Albert Fenn, farolero, de Lantern Row. El tribunal se reúne a medianoche». Bajo el sello, con otra letra, más pequeña: «El difunto estará presente»." },
  cab_fog: { at: "cab", scenery: true, name: "Niebla", note: "El único camino.", actions: ["Examinar niebla", "Entrar niebla"],
    words: { nouns: ["niebla", "portezuelas", "portezuela", "puertas", "puerta", "blanco", "bruma"], adj: ["plegables", "abiertas", "espesa", "blanca"], g: "f" },
    examine: "Las portezuelas plegables del coche están abiertas a una niebla tan espesa que tiene veta, como el papel. En algún punto de ella, muy lejos, hay un farol encendido, o recordado." },

  // Lantern Row
  pye: { at: "row", scenery: true, name: "Agente Pye", note: "Haciendo su ronda.", actions: ["Hablar con agente Pye"],
    words: { nouns: ["pye", "agente", "policia", "guardia", "bobby"], adj: ["agente", "policia"], g: "m" },
    examine: "Un agente joven y alto, con capa, con un farol propio y una {libreta|notebook} que sostiene como un devocionario. En la copa del casco se le ha juntado un poco de niebla.",
    parts: [{ words: ["casco", "capa"], name: "su casco", says: "La niebla se ha estancado en la copa. Él no se ha dado cuenta, o es demasiado educado para decirlo." }], mentions: ["libreta", "casco", "capa"],
    talk: "«Buenas noches», dice el agente Pye. «A ti te toca declarar. La investigación es a medianoche, en el tribunal. Tengo apuntados a los presentes, si los quieres».",
    topics: {
      present: { open: true, label: "los presentes", words: ["presentes", "presente", "personas", "lista", "sospechosos", "gente", "libreta"], says: "«Presentes junto al último farol esta noche», lee. «El señor Voss, de la Compañía. La señora Halloran, de los pasteles. El difunto. Es todo lo que la niebla me ha dejado ver»." },
      fog: { open: true, label: "la niebla", words: ["niebla", "palabras", "palabra", "voces", "voz"], says: "«Las palabras se quedan colgadas en esta niebla hasta que alguien las oye hasta el final. Es sabido. Para eso hace falta la trompetilla de un farolero, y silencio. En la calle nunca hay silencio hasta que cierra The Bell, a las once»." },
      fenn: { label: "Fenn", words: ["fenn", "albert", "farolero", "muerte", "cuerpo", "difunto", "muerto"], says: "«Lo encontré en el último farol, sentado. Ni una marca. Dijo buenas noches. Yo dije buenas noches. Luego lo apunté»." },
      voss: { label: "Voss", words: ["voss", "compania", "electrica", "electricidad"], says: "«Le dijo algo desagradable al señor Fenn en el tercer farol. Me lo repitió a mí, para la libreta. Orgulloso, estaba»." },
      halloran: { label: "Halloran", words: ["halloran", "pasteles", "pastel", "pastelera"], says: "«La señora Halloran le dio su pastel, como todas las noches. No ha dicho una palabra desde entonces. Tampoco decía mucho nunca»." },
      inquest: { open: true, label: "la investigación", words: ["investigacion", "tribunal", "forense", "medianoche", "mabbott", "nombre"], says: "«Medianoche, en el tribunal, al norte de aquí. Al doctor Mabbott le gusta un nombre. Procura darle el correcto. Un nombre dicho ahí dentro se queda dicho»." },
      default: "«Lo anotaré», dice el agente Pye, y lo anota."
    } },
  notebook: { at: "pye", scenery: true, name: "Libreta", note: "Los presentes.",
    words: { nouns: ["libreta", "cuaderno", "lista"], adj: ["agente", "policia", "negra"], g: "f" },
    examine: "Con letra cuidada: «Presentes en el último farol, esta noche: señor Voss (Cía. Eléctrica). Señora Halloran (pasteles). El difunto». Debajo, más pequeño: «Niebla muy espesa. No se veían caras. Se oyó una voz»." },
  court_doors: { at: "row", scenery: true, name: "Puertas del tribunal", note: "La investigación es a medianoche.", actions: ["Examinar puertas"], leads: "n",
    words: { nouns: ["puertas", "puerta", "cartulina", "cartel", "aviso"], adj: ["tribunal", "roble", "forense"], g: "f", pl: true },
    examine: "Puertas de roble con una cartulina clavada: «Investigación. A. Fenn, farolero. Medianoche». Se abren cuando el tribunal se reúne, y no antes." },

  // The Bell
  cotter: { at: "bell", scenery: true, name: "Señor Cotter", note: "El tabernero.", actions: ["Hablar con señor Cotter", "Pedir porter"],
    words: { nouns: ["cotter", "tabernero", "posadero", "camarero"], adj: ["señor", "senor"], g: "m" },
    examine: "Un hombre ancho en mangas de camisa y chaleco, que ha oído cada canción de The Bell cantada mal y no ha perdonado ninguna.",
    talk: "«¿Qué te pongo?», dice el señor Cotter. «Cerramos a las once. Después, la calle queda tan quieta que se oye caer una palabra».",
    topics: {
      porter: { open: true, label: "una cerveza", words: ["porter", "cerveza", "pinta", "media", "bebida", "trago", "copa", "jarra"], says: "«Porter», dice el señor Cotter. «Dos medias le sientan bien a cualquiera. De la tercera en adelante, le sientan de otra manera»." },
      closing: { open: true, label: "la hora de cerrar", words: ["cierre", "cerrar", "cierran", "once", "hora", "silencio", "quietud"], says: "«A las once en punto. La calle se queda callada. Fenn decía que era la única hora en que se oye pensar al gas»." },
      fenn: { label: "Fenn", words: ["fenn", "albert", "farolero"], says: "«Nunca puso un pie aquí. Abstemio, cuarenta años. Cenaba su pastel en casa de Halloran, todas las noches, puntual como los faroles»." },
      voss: { label: "Voss", words: ["voss", "compania", "electrica"], says: "«Estuvo aquí antes, cacareando. Le dijo a Fenn que sus faroles estaban acabados, dijo, y Fenn le dio las gracias y se fue a encender el siguiente. A Voss no le gustó»." },
      halloran: { label: "Halloran", words: ["halloran", "pasteles", "pastel"], says: "«Enamorada de Fenn cuarenta años, estaba. Nunca se lo dijo, que se sepa»." },
      default: "«No sabría decirte», dice el señor Cotter. «Yo solo sirvo»."
    } },
  fire: { at: "bell", scenery: true, name: "Fuego", note: "Amontonado hasta arriba.", actions: ["Examinar fuego"],
    words: { nouns: ["fuego", "lumbre", "llamas", "carbon", "brasas"], adj: ["carbon"], g: "m" },
    examine: "Carbón amontonado hasta arriba y rugiendo bajito para sí. La niebla se cuela por la puerta, lo mira una vez y vuelve a salir." },
  porter: { at: null, portable: false, name: "Media pinta de porter", note: "Oscura, con espuma.", actions: ["Examinar porter"],
    words: { nouns: ["porter", "pinta", "cerveza", "trago", "bebida"], adj: ["media", "negra", "oscura"], g: "f" },
    examine: "Oscura como el río y más caliente." },

  // La tienda de pasteles
  halloran: { at: "pie_shop", scenery: true, name: "Señora Halloran", note: "Harina hasta los codos.", actions: ["Hablar con señora Halloran", "Pedir pastel"],
    words: { nouns: ["halloran", "mujer", "pastelera", "panadera"], adj: ["señora", "senora"], g: "f" },
    examine: "Una mujer menuda con gorro blanco y delantal enharinado. Las manos siguen trabajando cuando el resto de ella ha parado.",
    parts: [{ words: ["harina", "delantal", "manos", "gorro"], name: "su delantal", says: "Harina hasta los codos, y en el delantal dos huellas enharinadas de manos, donde ha apretado algo contra él." }], mentions: ["harina", "delantal"],
    talk: "«Estamos cerrados», dice la señora Halloran, aunque la puerta estaba abierta y el horno encendido. «Toma un pastel de todos modos. Alguien tiene que hacerlo».",
    topics: {
      pie: { open: true, label: "un pastel", words: ["pastel", "pasteles", "comida", "cena"], says: "«Con uno basta», dice. «Él solo tomaba uno»." },
      fenn: { label: "Fenn", words: ["fenn", "albert", "farolero", "muerte"], says: "«Cuarenta años cenó aquí su pastel, y bajó con él hasta el último farol, y lo encendió». Pasa el trapo por el mostrador, donde ya está limpio. «Esta noche he bajado con él. La primera vez en cuarenta años»." },
      voss: { label: "Voss", words: ["voss", "compania", "electrica"], says: "«Ese Voss. Le dijo a Albert que sus faroles estaban acabados, bajo mi ventana, en el tercer farol. Albert le dio las gracias. Era de esperar»." },
      fog: { open: true, label: "la niebla", words: ["niebla", "palabras", "palabra", "dicho"], says: "«Lo que se dice en esa niebla se queda dicho», dice. «Por eso yo nunca decía mucho. En cuarenta años»." },
      inquest: { about: "court", label: "la investigación", words: ["investigacion", "tribunal", "forense", "medianoche"], says: "«No iré», dice. «No tengo nada que decir». Tiene harina hasta los codos, y la mira." },
      default: "«Yo solo hago pasteles, criatura», dice la señora Halloran."
    } },
  oven: { at: "pie_shop", scenery: true, name: "Horno", note: "Nunca se apaga.", actions: ["Examinar horno"],
    words: { nouns: ["horno", "cocina", "fogon"], adj: ["hierro", "negro"], g: "m" },
    examine: "Un horno de hierro negro, con la puerta entornada sobre un resplandor del color de una buena tarde. Está encendido desde los tiempos de la vieja Reina, y la señora Halloran le habla cuando la tienda está vacía." },
  pie: { at: null, portable: false, name: "Pastel", note: "Caliente, todavía humeante.", actions: ["Examinar pastel"],
    words: { nouns: ["pastel", "pasteles", "cena"], adj: ["caliente", "carne"], g: "m" },
    examine: "Un pastel envuelto en papel, demasiado caliente para sostenerlo y demasiado bueno para soltarlo." },

  // El tribunal
  mabbott: { at: "court", scenery: true, name: "Doctor Mabbott", note: "El forense.", actions: ["Hablar con doctor Mabbott"],
    words: { nouns: ["mabbott", "forense", "doctor", "juez"], adj: ["doctor", "dr"], g: "m" },
    examine: "Un hombre delgado con abrigo negro, con una pluma detrás de cada oreja y una tercera en la mano. Ha presidido la investigación de cada muerte de la calle desde los tiempos de la vieja Reina, y ha estado de acuerdo con casi todas.",
    parts: [{ words: ["pluma", "plumas", "tinta", "plumilla"], name: "su pluma", says: "De plumilla de acero, y seca. Espera un nombre." }], mentions: ["pluma"],
    talk: "«Ah, vienes a declarar», dice el doctor Mabbott. «Tómate tu tiempo. El tribunal oye palabras, y el tribunal oye nombres. Lo que aquí se dice, aquí se queda dicho».",
    topics: {
      words: { open: true, label: "las pruebas", words: ["pruebas", "prueba", "palabras", "palabra", "testimonio", "testigo", "evidencias"], says: "«Palabras, si las tienes», dice. «La niebla habrá guardado las últimas que se dijeron junto al farol. Tráelas, y el tribunal las oirá hasta el final»." },
      names: { open: true, label: "el culpable", words: ["culpable", "nombre", "nombres", "nombrar", "acusar", "culpar", "quien"], says: "«Un nombre dicho en este tribunal es la verdad desde ese momento. La niebla se encarga de ello. Puedes nombrar a una persona presente junto al farol; el agente tiene la lista. Elige con cuidado. No se puede desdecir»." },
      fenn: { label: "Fenn", words: ["fenn", "albert", "difunto", "farolero", "muerte"], says: "«Ni una marca, y sigue en su puesto. Una muerte por palabras, diría yo. La cuestión es de quién»." },
      verdict: { open: true, label: "el veredicto", words: ["veredicto", "investigacion", "fallo", "sentencia"], says: "«El tribunal da por bueno lo que le cuentan», dice. «Ese es el problema de los tribunales»." },
      default: "«No es asunto de este tribunal», dice el doctor Mabbott, y toma una pequeña nota de todos modos."
    } },
  witness_box: { at: "court", scenery: true, name: "Estrado de testigos", note: "Para ti.", actions: ["Entrar estrado"], enterable: "in",
    words: { nouns: ["estrado"], adj: ["testigo", "testigos", "de"], g: "m" },
    enter: "Entras en el estrado. Es exactamente de tu medida, como si el carpintero lo hubiera sabido.",
    examine: "Un recinto de madera barnizada, con una barandilla gastada hasta quedar clara por las manos de quienes vieron algo. Es exactamente de tu medida." },

  // El último farol
  fenn: { at: "last_lamp", scenery: true, name: "Señor Fenn", note: "Muerto, y de servicio.", actions: ["Hablar con señor Fenn"],
    words: { nouns: ["fenn", "farolero", "albert", "hombre", "cuerpo", "difunto", "cadaver"], adj: ["señor", "senor", "muerto", "viejo"], g: "m" },
    examine: "Un hombre menudo con gorra y un abrigo verdoso en las costuras, sentado muy recto en el bordillo con las manos en las rodillas. Lleva una {llave|hut_key} colgada de un cordel al cuello. Está muerto, y sigue de servicio.",
    take: "Pesa más de lo que parece. Lleva mucho tiempo en su puesto.",
    parts: [{ words: ["abrigo", "costuras", "manos", "rodillas", "gorra"], name: "su abrigo", says: "Verde en las costuras, pulido en los codos por cuarenta años de alcanzar lo alto." }], mentions: ["llave", "abrigo", "gorra"],
    talk: "«Buenas noches», dice el señor Fenn, sin levantarse. «No puedo dejar mi puesto. No hasta que me releven».",
    topics: {
      death: { open: true, label: "la muerte", words: ["muerte", "murio", "muerto", "asesinato", "matado", "quien", "morir"], says: "«No sabría decirte quién», dice. «No sería justo, no antes de la investigación. Pregunta a la niebla. Estaba aquí»." },
      fog: { open: true, label: "la niebla", words: ["niebla", "palabras", "palabra", "escuchar", "escuchando"], says: "«Lo guarda todo, esta niebla. Cada palabra dicha en ella queda colgada donde se dijo hasta que alguien la oye hasta el final. Yo escuchaba el gas con mi vieja trompetilla. Está en la caseta»." },
      hut: { about: "hut_door", label: "la caseta", words: ["caseta", "llave", "trompetilla", "cordel", "cuerda", "garita"], says: "«La llave está al cuello. Cógela. No voy a ir a ninguna parte»." },
      lamp: { about: "dark_lamp", label: "el último farol", words: ["farol", "faroles", "luz", "poste", "relevo", "relevar", "relevado"], says: "«Doce faroles cada noche, el último al final. Quien lo enciende se queda con el puesto. Así lo recibí yo del viejo Dacre, y él de su padre»." },
      voss: { label: "Voss", words: ["voss", "compania", "electrica"], says: "«El señor Voss. Me dijo que mis faroles estaban acabados. Le di las gracias. Es lo que se hace con la Compañía»." },
      halloran: { label: "Halloran", words: ["halloran", "pasteles", "pastel"], says: "Mira calle arriba, hacia la tienda de pasteles, durante mucho rato. «Los mejores pasteles del río», dice. «He tomado uno todas las noches durante cuarenta años, y luego he seguido hasta el último farol»." },
      inquest: { open: true, label: "la investigación", words: ["investigacion", "tribunal", "forense", "medianoche"], says: "«Medianoche. No asistiré. No puedo dejar mi puesto»." },
      default: "«No sabría decirte», dice el señor Fenn. «Yo solo hacía los faroles»."
    } },
  hut_key: { at: "fenn", portable: true, name: "Llave de la caseta", note: "En un cordel.", actions: ["Coger llave"], heldActions: ["Examinar llave", "Abrir puerta con llave"],
    words: { nouns: ["llave", "cordel", "cuerda", "cordon"], adj: ["caseta", "hierro", "pequena", "pequeña"], g: "f" }, ...item("hut_key"),
    here: "Una pequeña {llave|hut_key} de hierro, en su cordel, está donde la dejaste.",
    examine: "Una pequeña llave de hierro en un trozo de cordel, tibia de un cuello que ya no es." },
  dark_lamp: { at: "last_lamp", scenery: true, name: "El último farol", note: "El único apagado.", actions: ["Examinar farol", "Encender farol"],
    words: { nouns: ["farol", "farola", "poste", "linterna", "cristal", "lampara"], adj: ["ultimo", "apagado", "oscuro", "duodecimo", "hierro"], g: "m" },
    examine: "Un poste de hierro y una linterna de cuatro cristales, fría, con la llave del gas cerrada. Es el duodécimo farol de doce, y el único de la calle que nadie encendió esta noche. Está demasiado alto para alcanzarlo sin la pértiga de un farolero.",
    climb: "El poste es de hierro y está mojado, y no hay dónde agarrarse. Los faroleros nunca trepaban. Para eso tenían una pértiga." },
  fog_lamp: { at: "last_lamp", scenery: true, name: "Niebla", note: "Murmurando, palabra a palabra.", actions: ["Escuchar niebla"],
    words: { nouns: ["niebla", "murmullo", "murmullos", "bruma"], adj: ["espesa"], g: "f" },
    examine: "La niebla es aquí más espesa, y murmura: una palabra, media palabra, demasiado débiles para entenderlas, todas dichas aquí y ninguna oída todavía." },
  hut_door: { at: "last_lamp", scenery: true, name: "Puerta de la caseta", note: "La del señor Fenn.", actions: ["Examinar puerta", "Abrir puerta"], leads: "e",
    words: { nouns: ["puerta", "caseta", "garita"], adj: ["madera", "verde"], g: "f" },
    examine: "La puerta de una caseta de madera del tamaño de un armario, pintada de verde muchas veces. Cerrada con llave: necesita la llave del señor Fenn.",
    locked: true, lock: { key: "hut_key", says: "La puerta de la caseta está cerrada con llave. Necesita la llave del señor Fenn.",
      opens: "La llave gira como si lo hiciera todas las noches desde hace cuarenta años. La puerta de la caseta se abre sobre un olor a gas y a parafina.", then: "hut_opened" } },

  // La caseta
  trumpet: { at: "hut", portable: true, name: "Trompetilla", note: "Para escuchar el gas.", actions: ["Coger trompetilla"], heldActions: ["Escuchar trompetilla", "Examinar trompetilla"],
    words: { nouns: ["trompetilla", "trompeta"], adj: ["laton", "abollada", "acustica"], g: "f" }, ...item("trumpet"),
    here: "Hay una {trompetilla|trumpet} de latón, abollada.",
    examine: "Una trompetilla de latón, abollada, de las que los viejos faroleros acercaban a un farol para saber si el gas respiraba. Por dentro del pabellón el latón brilla, como si hubiera estado escuchando algo tibio." },
  pole: { at: "hut", portable: true, name: "Pértiga del farolero", note: "Todavía encendida.", actions: ["Coger pértiga"], heldActions: ["Examinar pértiga"],
    words: { nouns: ["pertiga", "llama", "gancho", "vara"], adj: ["farolero", "larga", "laton", "azul", "de", "del"], g: "f" }, ...item("pole"),
    here: "La larga {pértiga|pole} del señor Fenn está apoyada aquí, con su pequeña llama azul todavía encendida.",
    examine: "Una larga pértiga con un gancho de latón para la llave del gas y una pequeña llama azul en la punta que no se ha apagado en cuarenta años. Pesa más en el extremo que hizo el trabajo." },
  logbook: { at: "hut", scenery: true, name: "Libro de registro", note: "Cada farol, cada noche.",
    words: { nouns: ["libro", "registro", "pagina", "diario"], adj: ["registro", "abierto", "faroles", "de"], g: "m" },
    examine: "Cada farol de cada noche durante cuarenta años, a lápiz. La página de hoy: «Farol uno, encendido. Dos, encendido. Tres, encendido. Visita de Voss, desagradable. Cuatro, encendido», y así hasta once, y luego: «Pastel». Debajo, «Doce», y nada después." },

  // La subestación
  voss: { at: "substation", scenery: true, name: "Señor Voss", note: "La Compañía Eléctrica.", actions: ["Hablar con señor Voss"],
    words: { nouns: ["voss", "hombre", "compania", "empleado"], adj: ["señor", "senor", "electrica"], g: "m" },
    examine: "Un hombre pulcro de cuello de celuloide y un {sombrero hongo|bowler}, que mira la dínamo como otros hombres miran a sus hijos.",
    mentions: ["sombrero hongo"],
    talk: "«Voss, de la Compañía Eléctrica», dice, y te tiende una mano que no has pedido. «El lunes la calle se pasa a la electricidad. Querrás preguntarme por Fenn. Todo el mundo lo hace».",
    topics: {
      fenn: { open: true, label: "Fenn", words: ["fenn", "albert", "farolero", "muerte", "dijo", "palabras"], says: "«Se lo dije claro, en su tercer farol. Se acabaron sus faroles, Fenn. El lunes la calle se pasa a la electricidad». Resopla. «Me dio las gracias y siguió hasta el cuarto. Las gracias»." },
      alibi: { open: true, label: "la coartada", words: ["coartada", "noche", "anoche", "tarde", "donde", "dinamo"], says: "«Volví directo aquí, a mi dínamo, y aquí he estado. Pregúntale a ella». La dínamo zumba, como si prefiriera que no le preguntaran." },
      electric: { open: true, label: "la electricidad", words: ["electricidad", "electrico", "lunes", "bombilla", "luz"], says: "«El lunes», dice. «Doce faroles eléctricos, todos a la vez, desde esta sala. Nadie tendrá que andar a ninguna parte nunca más»." },
      halloran: { label: "Halloran", words: ["halloran", "pasteles", "pastel"], says: "«La de los pasteles. Enamorada de él cuarenta años, y sin decírselo nunca. Cualquiera diría que se lo habría dicho al final». Lo piensa. «Quizá lo hizo»." },
      inquest: { about: "court", label: "la investigación", words: ["investigacion", "tribunal", "forense", "medianoche", "nombre"], says: "«Querrán un nombre», dice. «El mío es bueno para eso, supongo. A todo el mundo le gusta culpar a la Compañía»." },
      default: "«Eso no es asunto de la Compañía», dice el señor Voss."
    } },
  bowler: { at: "voss", scenery: true, name: "Sombrero hongo", note: "Reglamentario de la Compañía.", actions: ["Examinar hongo"],
    words: { nouns: ["hongo", "sombrero", "bombin"], adj: ["negro"], g: "m" },
    examine: "Un hongo negro, cepillado contra la niebla. No se lo ha quitado desde que lo envió la Compañía, por si la Compañía se asoma." },
  dynamo: { at: "substation", scenery: true, name: "Dínamo", note: "Zumbando, muy segura.", actions: ["Escuchar dínamo"],
    words: { nouns: ["dinamo", "maquina", "tambor", "bobina"], adj: ["grande", "zumbante"], g: "f" },
    examine: "Un gran tambor de hierro bobinado de cobre, que zumba. El lunes encenderá doce faroles a la vez y ya ha dejado de pensar en otra cosa.",
    listen: "Un zumbido grave y seguro, sin una sola palabra dentro. Al señor Voss le parece relajante.",
    touch: "Tibia, y muy segura de sí misma. No se da cuenta de que estás ahí." },
  ledger: { at: "substation", scenery: true, name: "Libro de cuentas", note: "Cifras de la Compañía.",
    words: { nouns: ["libro", "cuentas", "cifras", "columnas"], adj: ["compania", "abierto", "de", "cuentas"], g: "m" },
    examine: "Columnas de cifras y, al pie de la de hoy, con letra pulcra: «Informado F. del lunes, en su tercer farol. Me dio las gracias. Regreso aquí». La palabra «gracias» está subrayada dos veces." },

  // La escalera del río
  pip: { at: "river_steps", scenery: true, name: "Pip", note: "Rebusca en el fango.", actions: ["Hablar con Pip"],
    words: { nouns: ["pip", "niña", "nina", "chica", "rebuscadora"], adj: [], g: "f", proper: true },
    examine: "Una niña de unos diez años con un abrigo de hombre, con barro hasta la rodilla, un {cubo|bucket} de cosas perdidas y un palo para encontrar más.",
    parts: [{ words: ["cubo", "palo", "abrigo"], name: "su cubo", says: "Cucharas, botones, un pomo de puerta, medio par de gafas. Y en el fondo, algo pequeño y pálido que tapa con la mano cuando lo miras." }], mentions: ["cubo", "palo"],
    talk: "«Quien lo encuentra se lo queda», dice Pip, sin levantar la vista. «Pregúntame qué he encontrado, si quieres».",
    topics: {
      found: { open: true, label: "los hallazgos", words: ["hallazgos", "hallazgo", "encontrado", "encontrar", "cubo", "cosas", "barro"], says: "«Cucharas. Un botón. Palabras, a veces, cuando caen al río. Se ponen duras en el barro, como galletas. Esta noche nada». Mira escalera arriba. «Esta noche oí»." },
      heard: { open: true, label: "la voz", words: ["voz", "oyo", "oir", "oido", "dama", "señora", "senora", "sonido"], says: "«Una señora, arriba, junto al farol. Voz amable. Enharinada, si una voz puede estarlo. Dijo algo, bajito. Y el señor Fenn se sentó. Le oí crujir las rodillas, como una verja»." },
      fenn: { label: "Fenn", words: ["fenn", "albert", "farolero"], says: "«Me dio un penique por sostenerle la escalera. No tenía escalera. Le gustaba la compañía»." },
      river: { open: true, label: "el río", words: ["rio", "tamesis", "agua", "nadar"], says: "«No te metas. El agua está más fría de lo que parece y no devuelve nada. Salvo a mí»." },
      default: "«Ni idea», dice Pip. «No está en el cubo»."
    } },
  river: { at: "river_steps", scenery: true, name: "Río", note: "Pardo, sin prisa.", actions: ["Examinar río"],
    words: { nouns: ["rio", "tamesis", "agua"], adj: ["pardo", "frio"], g: "m" },
    examine: "Agua parda, que corre deprisa bajo su propia calma, con la niebla tendida encima como una tapa. Parece frío y hambriento, y el último escalón está oscuro donde ya ha alargado la mano hacia ti. No devuelve nada, dice Pip." },

  // El puente
  parapet: { at: "bridge", scenery: true, name: "Parapeto", note: "Piedra fría.", actions: ["Examinar parapeto"],
    words: { nouns: ["parapeto", "piedra", "balaustrada", "barandilla", "baranda"], adj: ["mojado", "frio", "piedra"], g: "m" },
    examine: "Piedra fría, mojada de niebla. Desde aquí se ve la forma que hace la niebla sobre la calle: más espesa alrededor del último farol, y alrededor de la chimenea de la tienda de pasteles, inclinada hacia ella como alguien que escucha." },

  // Lo que llega a las manos más tarde
  last_words: { at: null, portable: true, name: "Últimas palabras", note: "Entre tus manos juntas.", actions: ["Examinar palabras"], heldActions: ["Examinar palabras", "Dar palabras a Mabbott"],
    words: { nouns: ["palabras", "palabra", "frase", "oracion"], adj: ["ultimas", "ultima", "tibias", "tibia"], g: "f", pl: true }, ...item("last_words"),
    here: "Las {últimas palabras|last_words} están aquí, todavía algo tibias.",
    examine: "«Déjalo, Albert. Siéntate un momento. Nadie echará de menos un farol». Una voz de mujer, grave y cálida, con harina encima. Las palabras aún están un poco tibias, y huelen a masa." }
};

// ---- Cambios con nombre ---------------------------------------------------------------------------------------------------
const changes = {
  key_taken: [
    { set: "fenn.examine", to: "Un hombre menudo con gorra y un abrigo verdoso en las costuras, sentado muy recto en el bordillo con las manos en las rodillas. Sin el cordel, el cuello se le ve desnudo. Está muerto, y sigue de servicio." },
    { set: "fenn.mentions", to: ["abrigo", "gorra"] }
  ],
  hut_opened: [
    { set: "hut_door.examine", to: "La puerta de la caseta del señor Fenn, abierta sobre un olor a gas y a parafina. La llave giró en ella como si te conociera." },
    { draw: "last_lamp", restyle: [{ id: "hut_door", fill: 0 }] }
  ],
  // Los finales
  truth_ending: [
    { move: "last_words", to: null },
    { say: "Abres las manos. Las últimas palabras se elevan de ellas, sobre el jurado de sillas y por las puertas del tribunal, y bajan por la calle. El doctor Mabbott escribe sin mirar. Pasado un rato, las puertas se abren otra vez, y entra la señora Halloran con harina hasta los codos y las palabras apretadas contra el delantal, como se sostiene un guante caído. «Le pedí que se sentara», dice. «Una sola vez»." },
    { say: "«Muerte por cariño», dice el doctor Mabbott, y la seca con el papel. Fuera, por primera vez en años, la niebla se levanta de Lantern Row. En el último farol el señor Fenn se pone en pie, con esfuerzo, y le ofrece el brazo, y se van los dos por la orilla del río, pasando ante cada farol, como lo hacen quienes tienen todo el tiempo que hay." },
    { end: true, picture: "truth" }
  ],
  relieved_ending: [
    { say: "Alzas la pértiga hasta el último farol y abres la llave. El gas respira, prende, y el farol se enciende, amarillo, el duodécimo de doce." },
    { say: "El señor Fenn se levanta del bordillo. Te pone la gorra en la cabeza, asiente una vez y se va calle arriba sin mirar atrás, un hombre que no tiene que estar en ninguna parte. La niebla se cierra tras él. Ahora el puesto es tuyo. Cada noche enciendes doce faroles, el último al final, y nadie te ha pedido nunca que te quedes." },
    { end: true, picture: "relieved" }
  ],
  blamed_ending: [
    { say: "«El señor Voss», dices. El doctor Mabbott lo anota. Las doce sillas del jurado crujen, todas a la vez. La niebla lo ha oído, y lo guarda." },
    { say: "El lunes la calle se pasa a la electricidad, y el señor Voss no está para verlo. La niebla no se levanta nunca más. Abajo, en el último farol, el señor Fenn sigue sentado, sin relevo, y calle arriba, muy débil, una voz que huele a masa sigue pidiéndole que se quede." },
    { end: true, picture: "blamed" }
  ]
};

// ---- Reglas ---------------------------------------------------------------------------------------------------------------
const rules = [
  // La llave que cuelga del cuello del señor Fenn.
  { id: "take_key", match: { verb: "take", obj: "hut_key" }, if: [{ "hut_key.at": "fenn" }],
    do: [{ say: "El señor Fenn inclina la cabeza para que puedas pasarle el cordel por encima. «Cuidado con la gorra», dice." }, { change: "key_taken" }], then: "default" },
  { id: "ask_key", match: { verb: "ask", obj: "fenn", topic: "hut" }, if: [{ "hut_key.at": "fenn" }],
    do: [{ say: "«La llave está al cuello», dice el señor Fenn, e inclina la cabeza para que puedas pasarle el cordel por encima. «No voy a ir a ninguna parte»." }, { move: "hut_key", to: "player" }, { change: "key_taken" }] },

  // Escuchar la niebla en el último farol: con la trompetilla, cuando The Bell ha cerrado y la calle está en silencio.
  { id: "hear_noisy", match: { verb: ["listen", "use", "put"], obj: [null, "fog_lamp", "trumpet"] },
    if: [{ "player.at": "last_lamp" }, { "trumpet.at": "player" }, { "time.hour": { between: [11, 23] } }],
    do: [{ say: "Acercas la trompetilla a la niebla. Se llena hasta el borde con el coro de The Bell, una docena de hombres, cada uno un poco por detrás del siguiente. Debajo, muy pequeño, algo intenta que lo oigan. Tendrá que esperar a que cierre The Bell." }] },
  { id: "hear_words", match: { verb: ["listen", "use", "put"], obj: [null, "fog_lamp", "trumpet"] },
    if: [{ "player.at": "last_lamp" }, { "trumpet.at": "player" }, { "last_words.at": null }],
    do: [{ say: "Acercas la trompetilla a la niebla y escuchas. Casi todo lo que guarda la niebla es tiempo. Luego, cerca del farol, grave: una voz de mujer, cálida, con harina encima. «Déjalo, Albert. Siéntate un momento. Nadie echará de menos un farol»." },
         { say: "Las palabras bajan de la niebla y se posan en tus manos juntas, ligeras como una polilla, todavía algo tibias." },
         { move: "last_words", to: "player" }] },
  { id: "heard_already", match: { verb: ["listen", "use", "put"], obj: [null, "fog_lamp", "trumpet"] },
    if: [{ "player.at": "last_lamp" }, { "trumpet.at": "player" }],
    do: [{ say: "La niebla no tiene nada más que decir aquí. Ya ha dicho bastante." }] },
  { id: "listen_fog_bare", match: { verb: "listen", obj: [null, "fog_lamp"] }, if: [{ "player.at": "last_lamp" }],
    do: [{ say: "La niebla murmura: una palabra aquí, media palabra allá, demasiado débiles para entenderlas. El señor Fenn escuchaba el gas con una trompetilla; ella lo oiría." }] },
  { id: "trumpet_elsewhere", match: { verb: ["listen", "use"], obj: "trumpet", obj2: [null] }, if: [{ "trumpet.at": "player" }],
    do: [{ say: ["Acercas la trompetilla a la niebla. Está llena de cosas pequeñas y corrientes: una tos, una puerta, el «bueno, pues» de alguien. Nada de lo que se dijo aquí importa.",
                 "La trompetilla te trae una tos, a dos calles, y el hervidor de alguien. Las palabras que importan se dijeron junto al último farol."] }] },

  // Las últimas palabras: son para el tribunal, y para ningún otro sitio.
  { id: "words_to_court", match: { verb: ["give", "show", "drop", "open", "throw"], obj: "last_words" },
    if: [{ "player.at": "court" }, { "last_words.at": "player" }],
    do: [{ change: "truth_ending" }] },
  { id: "words_to_halloran", match: { verb: ["give", "show"], obj: "last_words", obj2: "halloran" }, if: [{ "last_words.at": "player" }],
    do: [{ say: "La señora Halloran mira lo que tienes en las manos durante un largo momento, y esconde las suyas a la espalda. «Aquí no», dice. «Delante de los pasteles, no»." }] },
  { id: "words_kept", match: { verb: ["give", "show", "drop", "open", "throw", "put"], obj: "last_words" }, if: [{ "last_words.at": "player" }],
    do: [{ say: "Mantienes las manos juntas alrededor de ellas. Si las sueltas aquí, la niebla las recuperaría sin más. Quieren decirse donde se oigan como es debido: en el tribunal, al norte de la calle, cuando se reúna." }] },

  // La investigación: nombrar a alguien. Un nombre dicho aquí se queda dicho, así que el tribunal pregunta primero.
  { id: "accuse_halloran", match: { verb: "accuse", obj: "halloran" }, if: [{ "player.at": "court" }, { "last_words.at": "player" }],
    do: [{ confirm: "¿Nombrar a la señora Halloran ante el tribunal? Un nombre dicho aquí se queda dicho.", yes: [{ change: "truth_ending" }],
           no: [{ say: "Cierras la boca sobre él. La niebla de las sillas del jurado se recuesta, decepcionada." }] }] },
  { id: "accuse_halloran_bare", match: { verb: "accuse", obj: "halloran" }, if: [{ "player.at": "court" }],
    do: [{ say: "«¿Con qué pruebas?», dice el doctor Mabbott, con suavidad. «El tribunal oye palabras, no sentimientos. La niebla habrá guardado las últimas que se dijeron junto al farol»." }] },
  { id: "accuse_voss", match: { verb: "accuse", obj: "voss" }, if: [{ "player.at": "court" }],
    do: [{ confirm: "¿Nombrar al señor Voss ante el tribunal? Un nombre dicho aquí se queda dicho.", yes: [{ change: "blamed_ending" }],
           no: [{ say: "Cierras la boca sobre él. La niebla de las sillas del jurado se recuesta, decepcionada." }] }] },
  { id: "accuse_nobody", match: { verb: "accuse", obj: [null] }, if: [{ "player.at": "court" }],
    do: [{ say: "«¿A quién?», dice el doctor Mabbott, con la pluma en alto. «Presentes junto al farol: el señor Voss, la señora Halloran y el difunto»." }] },
  { id: "accuse_fenn", match: { verb: "accuse", obj: "fenn" }, if: [{ "player.at": "court" }],
    do: [{ say: "«El difunto no puede ser nombrado en su propia investigación», dice el doctor Mabbott. «Les sienta mal»." }] },
  { id: "accuse_other", match: { verb: "accuse" }, if: [{ "player.at": "court" }],
    do: [{ say: "«No consta en la lista del agente», dice el doctor Mabbott. «Presentes junto al farol: el señor Voss, la señora Halloran y el difunto»." }] },
  { id: "accuse_elsewhere", match: { verb: "accuse" },
    do: [{ say: "Los nombres son para la investigación: el tribunal del forense, al norte de la calle, cuando se reúne a medianoche." }] },
  { id: "say_words_in_court", match: { verb: "say" }, if: [{ "player.at": "court" }, { "last_words.at": "player" },
      { "$text": { in: ["palabras", "las palabras", "ultimas palabras", "las ultimas palabras", "ellas", "estas palabras", "dejalo albert", "dejalo albert sientate un momento"] } }],
    do: [{ change: "truth_ending" }] },
  { id: "say_voss", match: { verb: "say" }, if: [{ "player.at": "court" }, { "$text": { in: named(["voss", "señor voss", "senor voss"]) } }],
    do: [{ confirm: "¿Nombrar al señor Voss ante el tribunal? Un nombre dicho aquí se queda dicho.", yes: [{ change: "blamed_ending" }],
           no: [{ say: "Cierras la boca sobre él. La niebla de las sillas del jurado se recuesta, decepcionada." }] }] },
  { id: "say_halloran", match: { verb: "say" }, if: [{ "player.at": "court" }, { "last_words.at": "player" }, { "$text": { in: named(["halloran", "señora halloran", "senora halloran"]) } }],
    do: [{ confirm: "¿Nombrar a la señora Halloran ante el tribunal? Un nombre dicho aquí se queda dicho.", yes: [{ change: "truth_ending" }],
           no: [{ say: "Cierras la boca sobre él. La niebla de las sillas del jurado se recuesta, decepcionada." }] }] },
  { id: "say_halloran_bare", match: { verb: "say" }, if: [{ "player.at": "court" }, { "$text": { in: named(["halloran", "señora halloran", "senora halloran"]) } }],
    do: [{ say: "«¿Con qué pruebas?», dice el doctor Mabbott, con suavidad. «El tribunal oye palabras, no sentimientos. La niebla habrá guardado las últimas que se dijeron junto al farol»." }] },
  { id: "say_in_court", match: { verb: "say" }, if: [{ "player.at": "court" }],
    do: [{ say: "«Si nombras a alguien», dice el doctor Mabbott, «nómbralo con claridad, y el tribunal lo anotará»." }] },

  // El propio tribunal pide el nombre: en el estrado (cada vez que subes a él), o al hablar con el doctor Mabbott con las
  // últimas palabras en las manos. Una respuesta, y el juego sigue. (Solo se puede estar en el tribunal mientras se reúne;
  // una respuesta escrita después de levantarse la sesión, ya en la calle, no la recoge nadie.)
  { id: "box_asks", match: { verb: ["enter", "sit", "climb", "lie"], obj: "witness_box" }, if: [{ "player.in": { "!=": "witness_box" } }],
    do: [{ set: "player.in", to: "witness_box" }, { say: "$obj.enter" },
         { say: "«El tribunal oirá un nombre», dice el doctor Mabbott, con la pluma en alto. «¿De quién?»" }, { ask: "name" }] },
  { id: "box_asks_again", match: { verb: ["enter", "sit", "climb", "lie"], obj: "witness_box" },
    do: [{ say: "«El tribunal oirá un nombre», dice el doctor Mabbott, con la pluma en alto. «¿De quién?»" }, { ask: "name" }] },
  { id: "mabbott_asks", match: { verb: "talk", obj: "mabbott" }, if: [{ "last_words.at": "player" }],
    do: [{ say: "«El tribunal oirá un nombre», dice el doctor Mabbott, con la pluma en alto. «¿De quién?»" }, { ask: "name" }] },
  // La respuesta: lo mismo que nombrarlos (ACUSAR, DECIR), así que las mismas preguntas y frases.
  { id: "name_blank", match: { verb: "answer", question: "name", blank: true }, if: [{ "player.at": "court" }],
    do: [{ say: "No dices nada. La niebla de las sillas del jurado se inclina hacia delante, y espera contigo." }] },
  { id: "name_halloran", match: { verb: "answer", question: "name" }, if: [{ "player.at": "court" }, { "last_words.at": "player" }, { "player.answers.name": { in: HALLORAN } }],
    do: [{ confirm: "¿Nombrar a la señora Halloran ante el tribunal? Un nombre dicho aquí se queda dicho.", yes: [{ change: "truth_ending" }],
           no: [{ say: "Cierras la boca sobre él. La niebla de las sillas del jurado se recuesta, decepcionada." }] }] },
  { id: "name_halloran_bare", match: { verb: "answer", question: "name" }, if: [{ "player.at": "court" }, { "player.answers.name": { in: HALLORAN } }],
    do: [{ say: "«¿Con qué pruebas?», dice el doctor Mabbott, con suavidad. «El tribunal oye palabras, no sentimientos. La niebla habrá guardado las últimas que se dijeron junto al farol»." }] },
  { id: "name_voss", match: { verb: "answer", question: "name" }, if: [{ "player.at": "court" }, { "player.answers.name": { in: VOSS } }],
    do: [{ confirm: "¿Nombrar al señor Voss ante el tribunal? Un nombre dicho aquí se queda dicho.", yes: [{ change: "blamed_ending" }],
           no: [{ say: "Cierras la boca sobre él. La niebla de las sillas del jurado se recuesta, decepcionada." }] }] },
  { id: "name_fenn", match: { verb: "answer", question: "name" }, if: [{ "player.at": "court" }, { "player.answers.name": { in: FENN } }],
    do: [{ say: "«El difunto no puede ser nombrado en su propia investigación», dice el doctor Mabbott. «Les sienta mal»." }] },
  { id: "name_other", match: { verb: "answer", question: "name" }, if: [{ "player.at": "court" }],
    do: [{ say: "«No consta en la lista del agente», dice el doctor Mabbott. «Presentes junto al farol: el señor Voss, la señora Halloran y el difunto»." }] },

  // La pértiga yace en la caseta como una forma en su imagen: al cogerla desaparece la forma; al dejarla de nuevo allí, se redibuja.
  { id: "pole_up", match: { verb: "take", obj: "pole" }, if: [{ "player.at": "hut" }, { "pole.at": "hut" }],
    do: [{ draw: "hut", remove: ["pole_shape", "pole_flame"] }], then: "default" },
  { id: "pole_down", match: { verb: "drop", obj: "pole" }, if: [{ "player.at": "hut" }, { "pole.at": "player" }],
    do: [{ draw: "hut", add: ["line pole_shape 256,112 244,26 c14", "ellipse pole_flame 244,22,2,3 9"] }], then: "default" },

  // El último farol: quien lo enciende ocupa el puesto.
  { id: "light_lamp", match: { verb: ["switch_on", "use"], obj: ["dark_lamp", "pole"], obj2: [null, "dark_lamp", "pole"] },
    if: [{ "player.at": "last_lamp" }, { "pole.at": "player" }],
    do: [{ confirm: "¿Encender el último farol de Lantern Row? Quien lo enciende se queda con el puesto.", yes: [{ change: "relieved_ending" }],
           no: [{ say: "Bajas la pértiga. El señor Fenn suelta un aliento que no necesita." }] }] },
  { id: "light_lamp_bare", match: { verb: ["switch_on", "use"], obj: "dark_lamp" }, if: [{ "player.at": "last_lamp" }, { "pole.at": { "!=": "player" } }],
    do: [{ say: "El farol está demasiado alto para alcanzarlo, y no tienes con qué encenderlo. La pértiga del señor Fenn está en su caseta, al este de aquí." }] },
  { id: "relieve_fenn", match: { verb: "relieve" }, if: [{ "player.at": "last_lamp" }, { "pole.at": "player" }],
    do: [{ confirm: "¿Encender el último farol de Lantern Row? Quien lo enciende se queda con el puesto.", yes: [{ change: "relieved_ending" }],
           no: [{ say: "Bajas la pértiga. El señor Fenn suelta un aliento que no necesita." }] }] },
  { id: "relieve_fenn_bare", match: { verb: "relieve" }, if: [{ "player.at": "last_lamp" }],
    do: [{ say: "«Así no», dice el señor Fenn. «Quien enciende el último farol se queda con el puesto. Mi pértiga está en la caseta, al este de aquí»." }] },
  { id: "relieve_elsewhere", match: { verb: "relieve" },
    do: [{ say: "El señor Fenn guarda su puesto en el último farol, al final de la calle, al sur. Solo quien lo encienda puede relevarlo." }] },
  { id: "light_elsewhere", match: { verb: ["switch_on", "use"], obj: "pole", obj2: [null] }, if: [{ "pole.at": "player" }],
    do: [{ say: "Todos los faroles de aquí están ya encendidos. Solo el último, al final de la calle, espera." }] },

  // La porter de The Bell: las dos primeras medias te sientan bien; la tercera, y las siguientes, te emborrachan (el estado de
  // más abajo). Un pastel te despeja; el tiempo, también. Un pastel, un respiro de aire más claro: uno cada uno.
  { id: "order_porter", match: { verb: ["order", "ask"], obj: [null, "porter", "cotter"] }, if: [{ "player.at": "bell" }, { "$topic": { in: [null, "porter"] } }, { "cotter.poured": 0 }],
    do: [{ set: "cotter.poured", add: 1 }, { heal: 1, says: "El señor Cotter te sirve media pinta de porter sin preguntar cuál. Te la bebes junto al fuego. La niebla del pecho se va a sentarse a otro sitio un rato." }] },
  { id: "porter_second", match: { verb: ["order", "ask"], obj: [null, "porter", "cotter"] }, if: [{ "player.at": "bell" }, { "$topic": { in: [null, "porter"] } }, { "cotter.poured": 1 }],
    do: [{ set: "cotter.poured", add: 1 }, { heal: 1, says: "El señor Cotter te sirve otra media. «Esta es la buena», dice. «La tercera es la que habla por ti». Te la bebes junto al fuego, y la niebla del pecho se aleja un poco más." }] },
  { id: "porter_drunk", match: { verb: ["order", "ask"], obj: [null, "porter", "cotter"] }, if: [{ "player.at": "bell" }, { "$topic": { in: [null, "porter"] } }],
    do: [{ set: "cotter.poured", add: 1 },
         { say: ["El señor Cotter te sirve otra media y te mira bebértela como quien vigila un cazo al fuego. La lumbre se arrima un poco. La canción de la barra empieza a tener sentido.",
                 "El señor Cotter te sirve otra sin decir nada, que es peor. Los hombres de la barra te hacen sitio en el estribillo."] },
         { start: "drunk" }] },
  { id: "order_pie", match: { verb: ["order", "ask"], obj: [null, "pie", "halloran"] }, if: [{ "player.at": "pie_shop" }, { "$topic": { in: [null, "pie"] } }], once: true,
    do: [{ heal: 1, says: "La señora Halloran envuelve un pastel en papel y te lo da caliente. Te lo comes de pie. Sabe a que te esperan." }, { stop: "drunk" }] },
  { id: "pie_again", match: { verb: ["order", "ask"], obj: [null, "pie", "halloran"] }, if: [{ "player.at": "pie_shop" }, { "$topic": { in: [null, "pie"] } }],
    do: [{ say: "«Con uno basta», dice la señora Halloran. «Él solo tomaba uno»." }] },
  { id: "order_elsewhere", match: { verb: "order" },
    do: [{ say: "Hay porter en The Bell, al oeste de la calle, y pasteles en Halloran's, al este." }] },
  { id: "breathe_bridge", match: { verb: "breathe" }, if: [{ "player.at": "bridge" }], once: true,
    do: [{ heal: 1, says: "Respiras. Aquí fuera el aire es solo medio niebla; la otra mitad es el río que pasa. Por un momento, el pecho es tuyo." }] },
  { id: "breathe_again", match: { verb: "breathe" }, if: [{ "player.at": "bridge" }],
    do: [{ say: "Respiras. Ayuda menos la segunda vez. Sigue siendo niebla, solo que más fina." }] },
  { id: "breathe_elsewhere", match: { verb: "breathe" },
    do: [{ say: "Respiras niebla, y ella te respira a ti. Fuera, en el puente, pasada la escalera del río, el aire es más fino." }] },

  // Las palabras dichas en la niebla se quedan donde se dijeron.
  { id: "sing_bell", match: { verb: "sing" }, if: [{ "player.at": "bell" }],
    do: [{ say: ["Te unes al coro. A nadie le importa. Entre todos casi os sabéis la letra.", "Cantas el estribillo con los hombres de la barra, un poco por detrás del anterior, como es costumbre."] }] },
  { id: "shout_fog", match: { verb: ["shout", "sing"] }, if: [{ "player.at": { in: ["row", "last_lamp", "river_steps", "bridge", "court"] } }],
    do: [{ say: ["Tus palabras salen a la niebla y se detienen un poco más allá, colgadas, avergonzadas. Alguien las oirá hasta el final algún día.",
                 "La niebla coge lo que dijiste y lo guarda, un poco por encima de tu cabeza, donde no puedes recuperarlo."] }] },

  // El río: te agarra, a la primera. (Su peligro está en la sala y en el texto del río; Pip también lo dice.)
  { id: "river_hurt", match: { verb: ["enter", "swim"], obj: [null, "river"] }, if: [{ "player.at": "river_steps" }],
    do: [{ say: "Bajas al río. Está más frío de lo que nada tiene derecho a estar, y te tiene por las piernas, y luego, como si hubiera cambiado de idea, te suelta. Subes a gatas la escalera." },
         { hurt: 2, says: "El río te tuvo un momento, y se quedó con parte de ti." }] },

  // The Bell cierra a las once; el tribunal se reúne a medianoche y se levanta a las seis.
  { id: "bell_shuts_inside", when: "at", at: "23:00", if: [{ "player.at": "bell" }],
    do: [{ say: "El señor Cotter hace sonar la campanilla de la barra. «Hora», dice, y el canto se corta en mitad de una palabra. Te encuentras en la calle con los demás, que se van en distintas direcciones por la niebla y no salen de ella." },
         { travel: "row" }, { describe: "$here" }] },
  { id: "bell_shuts", when: "at", at: "23:00", if: [{ "player.at": { in: ["row", "last_lamp", "pie_shop", "substation", "hut", "river_steps"] } }],
    do: [{ say: "Calle arriba suena una campanilla en The Bell, y el canto se corta en mitad de una palabra. Lantern Row se queda callada, lo bastante para oír caer una palabra." }] },
  // Lo que la imagen de la calle muestra: la ventana de The Bell se oscurece a las once y se enciende a las once de la mañana; las
  // puertas del tribunal están abiertas de medianoche a las seis.
  { id: "bell_dark", when: "at", at: "23:00", do: [{ draw: "row", restyle: [{ id: "bell_window", fill: "mix:0,4@0.2" }] }] },
  { id: "bell_lit", when: "at", at: "11:00", do: [{ draw: "row", restyle: [{ id: "bell_window", fill: "mix:4,12@0.45" }] }] },
  { id: "court_open", when: "at", at: "00:00", do: [{ draw: "row", restyle: [{ id: "court_doors", fill: "mix:6,14@0.5" }] }] },
  { id: "court_shut", when: "at", at: "06:00", do: [{ draw: "row", restyle: [{ id: "court_doors", fill: "mix:6,0@0.5" }] }] },
  { id: "court_sits", when: "at", at: "00:00", if: [{ "player.at": "row" }],
    do: [{ say: "En algún lugar por encima de la niebla un reloj da la medianoche. Las puertas del tribunal se abren solas, y la niebla pasa la primera." }] },
  { id: "court_rises", when: "at", at: "06:00", if: [{ "player.at": "court" }],
    do: [{ say: "Amanece, en algún lugar por encima de la niebla. El doctor Mabbott cierra su libro. «El tribunal volverá a reunirse a medianoche», dice, y te acompañan a la salida." },
         { travel: "row" }, { describe: "$here" }] },

];

// ---- Rompecabezas (para el verificador y las pistas; GUIDE.md §3). Los finales, en el orden en que las pistas deben alcanzarlos. ----
const puzzles = {
  take_key: { where: "last_lamp", needs: [], solve: ["{take} llave"], gives: ["hut_key"], clues: ["fenn", "hut_door"],
    hints: ["El señor Fenn guarda la llave de su caseta en un cordel, al cuello.", "Coge la llave del señor Fenn, junto al último farol."] },
  open_hut: { where: "last_lamp", needs: ["hut_key"], solve: ["abre la puerta con la llave", "este"], reaches: "hut", clues: ["hut_door", "fenn"],
    hints: ["Su caseta está justo al este del último farol, y la llave encaja.", "Abre la puerta de la caseta con la llave, y ve al este."] },
  take_trumpet: { where: "hut", needs: ["open_hut"], solve: ["{take} trompetilla"], gives: ["trumpet"], clues: ["fenn", "pye"],
    hints: ["El señor Fenn escuchaba el gas con una vieja trompetilla. La guarda en su caseta.", "En la caseta, coge la trompetilla."] },
  hear_words: { where: "last_lamp", needs: ["trumpet"], solve: ["espera hasta que cierre The Bell", "escucha la niebla"], gives: ["last_words"], clues: ["pye", "fenn", "trumpet", "cotter"],
    hints: ["La niebla guarda lo que se dijo en ella, pero hace falta la trompetilla de un farolero para oírlo, y silencio. En la calle nunca hay silencio hasta que cierra The Bell, a las once.",
            "Con la trompetilla de la caseta, espera junto al último farol hasta que cierre The Bell, y luego escucha la niebla."] },
  open_court: { where: "row", needs: [], solve: ["espera hasta medianoche", "norte"], reaches: "court", clues: ["court_doors", "pye", "fenn"],
    hints: ["La investigación es a medianoche, en el tribunal, al norte de la calle.", "Espera en la calle hasta medianoche, y luego ve al norte, al tribunal."] },
  truth: { where: "court", needs: ["last_words", "open_court"], solve: ["da las palabras a Mabbott"], ending: true, clues: ["mabbott", "halloran", "pip", "logbook", "parapet"],
    hints: ["El tribunal oye palabras, y tú tienes las últimas que se dijeron junto al farol.", "En el tribunal, da las últimas palabras al doctor Mabbott."] },
  relieve: { where: "last_lamp", needs: ["pole"], solve: ["enciende el farol", "si"], ending: true, clues: ["fenn", "pole", "logbook"],
    hints: ["Quien enciende el último farol ocupa el puesto del farolero.", "Con la pértiga de la caseta, enciende el último farol, y di que sí."] },
  blame_voss: { where: "court", needs: ["open_court"], solve: ["acusa a Voss", "si"], ending: true, clues: ["pye", "voss", "notebook", "mabbott"],
    hints: ["El doctor Mabbott quiere un nombre, y el señor Voss espera que sea el suyo.", "En el tribunal, acusa al señor Voss, y di que sí."] }
};

// ---- La apertura, declarada (BRIEF.md §3): los ids de su sala y sus tres cosas, y las líneas que dice ------------------
const opening = {
  room: "cab", hints: "canary", intro: "summons", way: "cab_fog",
  lines: {
    notYet: "Pones un pie en el estribo, y la niebla te lo devuelve, con educación, como lo haría un portero. Todavía no: el canario sigue en su gancho, y a una niebla así no se sale sin canario.",
    through: "Bajas a la niebla. Se cierra sobre el coche a tus espaldas como el agua sobre una moneda que cae, y los adoquines suben a encontrar tus pies.",
    hintFrame: "El canario ladea la cabeza y canta, con una voz de agente de policía muy pequeño:",
    farewell: "La niebla se asoma por las portezuelas y lee la citación por encima de tu hombro. Cuando termina, se la lleva, y la dejas."
  }
};

// ---- El conjunto de cambios ------------------------------------------------------------------------------------------------
export default {
  because: "Después de la apertura: una calle envuelta en niebla, la noche de la investigación de un farolero.",
  opening,
  properties: {
    "cotter.poured": { type: "number", min: 0, max: 9, start: 0 }       // las medias de porter que te ha servido el señor Cotter
  },
  facts: [
    "El jugador llega a Lantern Row, en Londres, en una niebla espesa, un jueves a las diez y media de la noche.",
    "Albert Fenn, farolero, murió esta noche bajo el único farol que no encendió, y sigue allí sentado, muerto, hasta que lo releven.",
    "La investigación se celebra a medianoche en el tribunal del forense, al norte de la calle; The Bell cierra a las once.",
    "Las palabras de la señora Halloran, «Déjalo, Albert. Siéntate un momento», cuelgan en la niebla del último farol."
  ],
  effects: [
    { time: "day 1 22:20", weekday: "thu" },                 // la apertura se juega a las diez y veinte
    { set: "game.entrance", to: "row" },
    { add: "change", id: "arrival", effects: [
      { time: "day 1 22:30", weekday: "thu" },
      { say: "En algún lugar por encima de la niebla un reloj de iglesia da las diez y media, y no suena muy seguro." }
    ] },
    // Verbos que este mundo necesita
    { add: "word", verb: "accuse", words: ["acusar", "acusa", "acuse", "acuso", "culpar", "culpa", "inculpar", "inculpa", "denunciar", "denuncia", "nombrar", "nombra"], absent: true },
    { add: "word", verb: "order", words: ["pedir", "pide", "pida", "pido", "comprar", "compra", "compro", "encargar", "encarga", "pagar", "paga"], absent: true },
    { add: "word", verb: "breathe", words: ["respirar", "respira", "respire", "respiro", "inspirar", "inspira", "aspirar", "aspira", "tomar aire", "toma aire", "coger aire", "coge aire"] },
    { add: "word", verb: "swim", words: ["nadar", "nade", "nado", "bucear", "bucea", "chapotear", "chapotea", "vadear", "vadea", "zambullirse", "zambullete"] },
    { add: "word", verb: "relieve", words: ["relevar", "releva", "releve", "relevo", "sustituir", "sustituye", "reemplazar", "reemplaza", "tomar el relevo", "toma el relevo"] },

    ...Object.entries(puzzles).map(([id, p]) => ({ add: "puzzle", id, ...p })),
    ...Object.entries(changes).map(([id, effects]) => ({ add: "change", id, effects })),
    ...Object.entries(endingPictures).map(([id, p]) => ({ add: "picture", id, ...p })),
    // Borracho de porter (la tercera media en The Bell, y las siguientes): la calle se mece y se ve doble, las palabras salen trabadas y, al
    // salir de un sitio, a veces tomas otro camino. Se pasa solo; un pastel lo pasa antes.
    { add: "condition", id: "drunk", lasts: { seconds: [120, 180] }, starts: "Te has emborrachado", ends: "Se te ha pasado la borrachera",
      status: "La cerveza se te ha subido a la cabeza", filters: ["sway", "ghost"], speech: { slur: true },
      movement: { chance: 0.3, says: ["Los pies te llevan por otro camino del que querías.", "Echas a andar hacia un lado, y la niebla te da la vuelta."] } },
    ...Object.entries(rooms).map(([id, r]) => ({ add: "room", id, ...r, picture: pictures[id] })),
    ...Object.entries(objects).map(([id, o]) => ({ add: "object", id, ...o })),
    ...rules.map((rule) => ({ add: "rule", rule }))
  ]
};
