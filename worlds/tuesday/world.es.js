// «El tren del martes»: el mundo de "The Train to Tuesday" escrito en español (no traducido): el mismo argumento, las mismas
// salas, objetos, personajes, reglas, enigmas y finales, con las mismas ids, pero cada línea pensada en español. Un solo
// conjunto de cambios, aplicado tras la apertura, todo o nada (WRITING-DIRECTION.md, GUIDE.md, ARCHITECTURE.md §3–6).
// Las imágenes y los sprites son los del mundo inglés; aquí solo se reescribe el texto que describe imágenes (alt).

import pictures, { endings } from "./pictures.js";
import sprites from "./sprites.js";

// ---- La biblia del juego -------------------------------------------------------------------------------------------
export const bible = {
  title: "El tren del martes",
  blurb: "Un pueblo de colinas que abolió los lunes. Cada noche, a las doce menos veinte, sale un tren hacia el martes, y nadie vuelve.",
  thumbnail: { picture: "halt", x: 95 },   // la tarjeta de la página de inicio: la imagen de esta sala, recortada a 225 píxeles desde la columna x (0–95)
  synopsis: "Llegas, vengas de donde vengas, un domingo por la tarde, a un pueblo de colinas que abolió los lunes " +
    "hace años. Cada noche, a las doce menos veinte, sale un tren hacia el martes, y nadie vuelve. Arriba, en el " +
    "ayuntamiento, alguien ha guardado el último lunes, por si acaso.",
  tone: "WRITING-DIRECTION.md. Melancolía de pueblo ferroviario: horarios, cosas perdidas, un decreto enmarcado en la estación.",
  start: "Domingo, 19:30, en la oficina de objetos perdidos de la estación.",
  opening: "Un apeadero de vía secundaria, un domingo por la tarde: un despertador de viaje (para empezar de nuevo), una lata de " +
    "cacao con un cordel (las pistas), una página de agenda que ya llevas encima (por qué has venido). La puerta abierta del " +
    "único vagón es el camino.",
  rules: [
    "El lunes quedó abolido por decreto. El pueblo pasa del domingo por la noche al martes en tren.",
    "Lo que queda en la oficina de objetos perdidos espera a quien sepa decir de quién es.",
    "El reloj de la estación no miente. El pueblo lleva sus horas por él.",
    "Se puede volver atrás una vez: el reloj del revés del relojero te da el ayer, y se queda con algo a cambio."
  ],
  endings: [
    "Martes: tomas el tren de las 23:40 con un billete comprado con una moneda antigua. Te saltas tu lunes, y todos los lunes que vengan.",
    "Lunes: das a la archivera algo que perdiste en tu último lunes; devuelves el lunes al calendario de la estación. El pueblo despierta en lunes, y tú también, en tu mesa.",
    "Domingo: dejas que la espera se alargue demasiado (tensión). El camino por el que viniste se cierra y sigue siendo domingo, para ti, para siempre."
  ],
  chaos: 0.3
};

// ---- Ayudas (se leen como las palabras de las propias reglas) ----------------------------------------------------------
const at = (...rooms) => ({ "player.at": rooms.length > 1 ? { in: rooms } : rooms[0] });
const holding = (id) => ({ [id + ".at"]: "player" });
const notAsking = { "$topic": null };
const hours = (from, to) => ({ "time.hour": { between: [from, to] } });
const notHours = (from, to) => ({ "time.hour": { between: [to, from] } });   // las demás horas del día
const tension = (n) => (n > 0 ? { unsettle: 1 } : { calm: 1 });   // one step of your mood (tension 0–5: INTERFACE.md §6c)
const item = (id) => ({ img: id, sprite: sprites[id], ...(sprites[id + "_floor"] ? { floorSprite: sprites[id + "_floor"] } : {}) });

// ---- Textos que cambian -------------------------------------------------------------------------------------------------
const squareDusk = [
  "La plaza de la estación, empedrada, con una {fuente|fountain} en el centro y una estatua del {Ministro|statue} que abolió los lunes. Las farolas aún no están encendidas. Una escalera de farolero se apoya en la primera.",
  "Al norte, la estación. Al oeste, el Hotel Término. Al este, el café, con las ventanas amarillas. La calle Mayor sigue hacia el sur."
];
const squareNight = [
  "La plaza de la estación, empedrada, con una {fuente|fountain} en el centro y una estatua del {Ministro|statue} que abolió los lunes. Las farolas están encendidas, y también la lamparita bajo el agua.",
  "Al norte, la estación. Al oeste, el Hotel Término. Al este, el café. La calle Mayor sigue hacia el sur."
];
const squareDay = [
  "La plaza de la estación, empedrada, con una {fuente|fountain} en el centro y una estatua del {Ministro|statue} que abolió los lunes. Las palomas se turnan para posarse en su sombrero.",
  "Al norte, la estación. Al oeste, el Hotel Término. Al este, el café. La calle Mayor sigue hacia el sur."
];

// ---- Los dibujos de los finales ---------------------------------------------------------------------------------------------
// Los dibujos no llevan lengua (pictures.js); lo que cada uno dice a un lector de pantalla (alt) se dice aquí, en español.
const endingPictures = {
  tuesday: { alt: "Por la ventanilla de un tren: un túnel oscuro que pasa a toda velocidad en anillos y, al fondo, una luz blanca y amarilla que crece. En el cristal, tenue, tu propia cara.", picture: endings.tuesday },
  monday: { alt: "Primer plano de un calendario de hojas sobre una pared marrón. La hoja de arriba tiene una ancha franja roja y el borde inferior rasgado, con unas pocas líneas grises de letra impresa. Junto al borde derecho del calendario, la esfera redonda de un reloj.", picture: endings.monday },
  sunday: { alt: "A lo lejos, en una llanura vacía, una pequeña estación de ferrocarril y su torre del reloj bajo un cielo pálido y plano. Dos raíles llegan hasta ella. Nada se mueve. Las agujas del reloj están paradas.", picture: endings.sunday },
  died: { alt: "La vía y el borde del andén vistos desde muy arriba: dos raíles sobre traviesas marrones, un andén pálido con una línea amarilla, una luz roja de señal y una figura diminuta tendida junto al borde mientras unas luces brillantes bajan por la vía desde lo alto de la imagen.", picture: endings.died }
};

// ---- Salas ---------------------------------------------------------------------------------------------------------------
// Zona "town" (x crece al este, y crece al sur, z es la planta); a la zona "train" solo se llega cuando el tren está en el andén.
const rooms = {
  // La apertura (GUIDE.md §8): un apeadero de la línea secundaria, al que no se vuelve. La zona "branch" es solo suya.
  halt: {
    name: "APEADERO LUNES", area: "branch", at: [0, 0, 0],
    describe: [
      "Un apeadero de vía secundaria, un domingo por la tarde: un banco, una farola y un cartel con el nombre, «Lunes», aunque la línea no va a ninguna parte después de él. El horario anuncia un tren a la semana, y salió ayer.",
      "Un único vagón espera al final del andén, al este, con la {puerta del vagón|carriage_door} abierta y la luz encendida."
    ],
    exits: { e: true },
    scenery: [
      { words: ["banco", "asiento", "farola", "andén", "anden", "apeadero", "cartel", "letrero", "nombre", "plataforma"], name: "el apeadero", says: "Un banco, una farola, un cartel con el nombre. Alguien ha pintado el banco desde que cerraron la línea, y no hace mucho." },
      { words: ["horario", "tren", "línea", "linea", "vía", "via", "vías", "vias", "raíles", "railes", "carriles"], name: "el horario", says: "Un tren a la semana, hacia un lugar cuyo nombre han raspado del cartel y vuelto a escribir a lápiz: Martes." }
    ],
    mentions: ["banco", "farola", "cartel", "horario", "puerta del vagón"],
    ambience: { lines: ["La farola sobre el banco zumba una nota y la sostiene.", "Un hilo del telégrafo hace tic, una sola vez, como un reloj que se lo está pensando.", "Muy lejos, línea abajo, algo que no es un tren hace sonar su silbato y se arrepiente.", "El cartel con el nombre gira un poco con el viento, y vuelve a su sitio."], every: [30, 70] },
    alt: "Un pequeño apeadero al anochecer: un andén con un banco y una farola, un cartel con el nombre y, al fondo, un único vagón iluminado con la puerta abierta.",
    overlayAlt: {
      alarm: "Un despertador de latón sobre el banco.",
      tin: "Una lata de cacao sobre el banco, con un cordel que sale de ella por el borde del andén."
    }
  },
  lost_property: {
    name: "OBJETOS PERDIDOS", area: "town", at: [0, 0, 0],
    describe: [
      "Una sala larga de estanterías: paraguas, guantes, una jaula, un vestido de novia en su caja, todas las etiquetas con la misma letra paciente. Estás en medio de todo ello, como si alguien te hubiera olvidado aquí.",
      "Tras el mostrador, el {señor Ambrose|ambrose} lleva el {libro de registro|ledger}. Un {cajón|sea_crate} húmedo dice MAR, UNO, SIN RECLAMAR. El vestíbulo de la estación queda al este."
    ],
    exits: { e: "station_hall" },
    scenery: [{ words: ["estanterías", "estanterias", "estantería", "estanteria", "estantes", "paraguas", "guantes", "jaula", "vestido", "novia", "caja", "etiquetas", "fechas"], name: "las estanterías", says: "Cosas que la gente dejó de buscar. Cada una tiene una etiqueta, y cada etiqueta una fecha. Ninguna fecha es un lunes posterior al decreto." },
              { words: ["mostrador"], name: "el mostrador", says: "Un mostrador largo, gastado donde se ha apoyado un siglo de reclamantes." }],
    mentions: ["estanterías", "jaula", "mostrador", "señor Ambrose", "libro de registro", "cajón"],
    alt: "Una sala larga de estanterías atestadas de paraguas, cajas y una jaula. Un mostrador con un libro de registro y un viejo empleado; un cajón húmedo junto a la pared."
  },
  station_hall: {
    name: "VESTÍBULO", area: "town", at: [1, 0, 0],
    describe: [
      "Un vestíbulo de azulejos bajo un techo de cristal. El {reloj de la estación|station_clock} marca [time]. Debajo, un {calendario|calendar} de hojas y, enmarcado, el {decreto|decree}.",
      "La {ventanilla|window} tiene una reja de latón y un postigo. El {horario|timetable} ocupa una pared entera y anuncia un solo tren.",
      "El andén queda al norte, la plaza al sur. Objetos perdidos está al oeste; la sala de espera, al este."
    ],
    exits: { n: "platform", s: { to: "square", out: true }, w: "lost_property", e: "waiting_room" },
    waitFor: { time: "next 21:00", says: "Esperas bajo el reloj. No miente en ningún minuto.", if: [hours(6, 21)] },
    scenery: [{ words: ["techo", "cristal", "azulejos", "azulejo", "vestíbulo", "vestibulo", "palomas", "paloma"], name: "el vestíbulo", says: "Azulejos verdes y crema, y un cristal tan alto que las palomas de debajo parecen pensamientos." }],
    mentions: ["reloj", "calendario", "decreto", "ventanilla", "reja", "postigo", "horario", "techo"],
    alt: "Un vestíbulo de estación con azulejos verdes y crema bajo un techo de cristal. Un gran reloj con un calendario debajo y un aviso enmarcado. A la derecha, una ventanilla de billetes con reja de latón; en la pared de la izquierda, un horario."
  },
  waiting_room: {
    name: "SALA DE ESPERA", area: "town", at: [2, 0, 0],
    describe: [
      "Bancos, una estufa fría y carteles de balnearios que han cerrado. En un rincón, un {fotomatón|booth} con la cortina echada.",
      "En el banco más cercano a la estufa, la {señora Oduya|oduya} está sentada con la maleta sobre las rodillas, igual que desde el último lunes.",
      "El vestíbulo queda al oeste."
    ],
    exits: { w: "station_hall" },
    scenery: [{ words: ["bancos", "banco", "estufa", "carteles", "cartel", "balnearios"], name: "la sala de espera", says: "La estufa lleva mucho tiempo fría. Los carteles prometen aire de mar, aire de montaña, cualquier aire menos este." }],
    mentions: ["bancos", "estufa", "carteles", "fotomatón", "cortina", "señora Oduya", "maleta"],
    alt: "Una sala de espera en penumbra, con bancos de madera y una estufa negra. Una anciana sentada con una maleta sobre las rodillas. Un fotomatón con la cortina echada en un rincón."
  },
  platform: {
    name: "ANDÉN 1", area: "town", at: [1, -1, 0],
    describe: [
      "Un andén, una vía, un {banco|bench}. Los raíles corren al este hacia un túnel y al oeste, pasada la caseta de señales. El {panel de horarios|board} cuelga de la marquesina.",
      "El vestíbulo queda al sur. El final del andén, al este; la caseta de señales, al oeste."
    ],
    exits: { s: "station_hall", e: "platform_end", w: "signal_box", n: true },
    scenery: [{ words: ["raíles", "railes", "riel", "rieles", "vía", "via", "vías", "vias", "línea", "linea", "carriles", "marquesina", "túnel", "tunel"], name: "la vía", says: "Una sola vía, pulida por un solo tren, que va en un solo sentido." },
              { words: ["caseta", "casilla", "garita", "señales", "senales", "pilotes"], name: "la caseta de señales", says: "Una caja de madera sobre pilotes, toda ventanas, al oeste del andén. Alguien dentro vigila la vía." }],
    mentions: ["banco", "caseta de señales", "panel de horarios", "raíles", "marquesina", "túnel"],
    // Vale la pena esperar mientras el tren no está; cuando ya ha estado, las palabras cambian (train_out).
    waitFor: { time: "next 23:30", says: "Esperas en el andén. Las horas vuelven como vuelven los trenes, todas de golpe.", if: [{ "train.at": { "!=": "platform" } }] },
    alt: "Un único andén bajo una marquesina de hierro, con un banco y un panel de horarios colgado. Los raíles se curvan al este hacia un túnel; al oeste hay una caseta de señales."
  },
  platform_end: {
    name: "FINAL DEL ANDÉN", area: "town", at: [2, -1, 0],
    describe: [
      "El andén termina en una rampa y un cartel con un hombre tachando a otro hombre. Los raíles siguen al este, hacia el {túnel|tunnel}. De él sale un aire tibio, y un zumbido.",
      "El andén queda al oeste."
    ],
    exits: { w: "platform", e: true },
    scenery: [{ words: ["cartel", "rampa", "raíles", "railes", "hombre"], name: "el cartel", says: "Nadie puede ir más allá. El cartel lo dice sin palabras, y por eso sabes que va en serio." }],
    mentions: ["cartel", "túnel", "raíles"],
    alt: "El final de un andén que baja en rampa hacia los raíles, los cuales se pierden en la boca oscura de un túnel. Un cartel de advertencia en un poste."
  },
  signal_box: {
    name: "CASETA DE SEÑALES", area: "town", at: [0, -1, 0],
    describe: [
      "Una caja de madera sobre pilotes, toda ventanas. Una hilera de palancas se alinea como un coro. El {guardagujas|signalman} tiene la mano en la que importa y los ojos en el {esquema|diagram} de la línea, que es un solo trazo.",
      "El andén queda al este, bajando los escalones."
    ],
    exits: { e: { to: "platform", out: true } },
    scenery: [{ words: ["palancas", "palanca", "ventanas", "ventana", "pilotes", "escalones"], name: "las palancas", says: "Más altas que tú, pulidas en la empuñadura, y no te toca tirar de ellas." }],
    mentions: ["palancas", "guardagujas", "esquema", "ventanas"],
    alt: "El interior de una caseta de señales: una hilera de palancas altas, ventanas por todas partes, un hombre en mangas de camisa con una mano en una palanca y un esquema de una sola línea en la pared."
  },
  square: {
    name: "PLAZA DE LA ESTACIÓN", area: "town", at: [1, 1, 0],
    describe: squareDusk,
    exits: { n: "station_hall", w: "hotel", e: { to: "cafe", if: hours(7, 22), closed: "El café está a oscuras, con las sillas sobre las mesas. Un cartel en la puerta: DE 7 A 22." }, s: "high_street" },
    scenery: [{ words: ["farolas", "farola", "escalera", "adoquines", "palomas", "sombrero", "farolero"], name: "las farolas", says: "Farolas de hierro con sombreritos de cristal. Alguien las enciende a las ocho, y también la que está bajo el agua de la fuente." }],
    mentions: ["fuente", "estatua", "farolas", "escalera"],
    // Vale la pena esperar desde las siete de la mañana hasta que se encienden las farolas, a las ocho; desde la primera mañana las palabras cambian (daybreak).
    waitFor: { time: "next 20:00", says: "Esperas junto a la fuente mientras se va la luz.", if: [hours(7, 20)] },
    alt: "Una plaza empedrada al anochecer: una fuente redonda con la estatua de un hombre de chistera, farolas de hierro todavía apagadas y una escalera apoyada en una. Al norte la fachada de la estación, a la izquierda un hotel, a la derecha un café de ventanas amarillas."
  },
  hotel: {
    name: "HOTEL TÉRMINO", area: "town", at: [0, 1, 0],
    describe: [
      "Un vestíbulo estrecho que huele a cera y a col hervida. Tras el mostrador, el {conserje de noche|porter} lee el periódico de ayer, que siempre es el del sábado.",
      "Una escalera sube a las habitaciones. La plaza queda al este."
    ],
    exits: { e: { to: "square", out: true }, u: { to: "hotel_room", if: { "room_key.at": "player" },
      closed: "El conserje carraspea. «Las habitaciones son para los huéspedes», dice. «Los huéspedes las piden.»" } },
    scenery: [{ words: ["mostrador", "periódico", "periodico", "vestíbulo", "vestibulo", "col", "cera", "recepción", "recepcion"], name: "el vestíbulo", says: "Latón, cera, un timbre que nadie toca. El periódico es el del sábado; los domingos no hay periódico, y tampoco hay lunes." },
              { words: ["escalera", "escaleras"], name: "la escalera", says: "Una escalera estrecha que sube a las habitaciones.", leads: "u" }],
    mentions: ["conserje de noche", "periódico", "escalera", "mostrador"],
    alt: "Un vestíbulo de hotel estrecho con un mostrador de madera, un hombre leyendo el periódico tras él, ganchos con llaves en la pared y una escalera que sube a la derecha."
  },
  hotel_room: {
    name: "HABITACIÓN 4", area: "town", at: [0, 1, 1],
    describe: [
      "Una habitación con una {cama|bed}, un lavabo y una ventana sobre las vías. La cama está abierta, preparada para alguien que nunca sube.",
      "La escalera baja al vestíbulo."
    ],
    exits: { d: "hotel" },
    scenery: [{ words: ["lavabo", "palangana", "jarra", "ventana", "vías", "vias", "raíles", "railes"], name: "la ventana", says: "Desde aquí ves la línea y el túnel en el que desaparece. De noche el túnel respira." },
              { words: ["escalera", "escaleras"], name: "la escalera", says: "Una escalera estrecha que baja al vestíbulo.", leads: "d" }],
    mentions: ["cama", "lavabo", "ventana", "escalera"],
    alt: "Una pequeña habitación de hotel: una cama de hierro abierta, un lavabo con una jarra, una ventana que da a las vías del tren."
  },
  cafe: {
    name: "CAFÉ DOMINGO", area: "town", at: [2, 1, 0],
    describe: [
      "Seis mesas, una barra de zinc, una radio que pone el mismo vals. {Inés|ines} limpia la barra con círculos lentos. Una {pizarra|menu} de tiza anuncia lo que hay, que es café.",
      "La plaza queda al oeste."
    ],
    exits: { w: { to: "square", out: true } },
    scenery: [{ words: ["mesas", "mesa", "barra", "zinc", "radio", "vals", "sillas"], name: "el café", says: "El vals termina y vuelve a empezar sin una pausa, como alguien a quien nunca han interrumpido." }],
    mentions: ["mesas", "barra", "radio", "Inés", "pizarra"],
    alt: "Un pequeño café con mesas redondas, una barra de zinc y una radio en un estante. Una mujer limpia la barra. Una pizarra de tiza con la carta en la pared. Luz amarilla y cálida."
  },
  high_street: {
    name: "CALLE MAYOR", area: "town", at: [1, 2, 0],
    describe: [
      "Tiendas con las persianas bajadas: una mercería, una farmacia, una tienda que solo vende calendarios. El ayuntamiento queda al oeste, con una {placa|plate} de latón junto a la puerta. La relojería está al este, y su escaparate está lleno de horas distintas.",
      "La plaza queda al norte. El parque, al sur."
    ],
    exits: { n: "square", w: { to: "town_hall", if: hours(9, 17), closed: "Las puertas están cerradas. La placa de latón da el horario: de nueve a cinco." }, e: "clock_shop", s: "park" },
    scenery: [{ words: ["tiendas", "tienda", "persianas", "mercería", "merceria", "farmacia", "calendarios", "calendario"], name: "las tiendas", says: "En el escaparate de la tienda de calendarios hay calendarios de seis días por semana. Se venden bien." },
              { words: ["ayuntamiento", "columnas", "escalones", "escalinata"], name: "el ayuntamiento", says: "Columnas, escalones y puertas que cumplen horario de oficina. La placa de latón lo da.", leads: "w" },
              { words: ["relojería", "relojeria", "relojes", "escaparate", "esferas"], name: "la relojería", says: "Un escaparate lleno de relojes, cada uno con una hora distinta, y todos en lo cierto en algún sitio.", leads: "e" }],
    mentions: ["tiendas", "ayuntamiento", "placa", "relojería", "calendarios"],
    waitFor: { time: "next 09:00", says: "Te sientas en los escalones del ayuntamiento. La noche pasa sin ninguna prisa. A las nueve un empleado abre las puertas, te mira y decide no preguntar.", if: [notHours(9, 17)] },
    alt: "Una calle de tiendas con las persianas bajadas. A la izquierda, un ayuntamiento con columnas y una placa de latón junto a la puerta; a la derecha, el escaparate de una relojería lleno de esferas de reloj."
  },
  town_hall: {
    name: "AYUNTAMIENTO", area: "town", at: [0, 2, 0],
    describe: [
      "Un vestíbulo de mármol con una ventanilla para cada trámite y nadie detrás de la mayoría. Un cartel señala arriba: ARCHIVO. Otro no señala a ninguna parte: QUEJAS.",
      "La calle Mayor queda al este."
    ],
    exits: { e: { to: "high_street", out: true }, u: "archive" },
    scenery: [{ words: ["escalera", "escaleras", "archivo"], name: "la escalera", says: "Una escalera de mármol, gastada en el centro, que sube al archivo.", leads: "u" },
              { words: ["ventanillas", "ventanilla", "mostradores", "mostrador", "mármol", "marmol", "cartel", "carteles", "quejas", "trámite", "tramite"], name: "las ventanillas", says: "Cada ventanilla tiene un timbre y un cartelito. MATRIMONIOS. DEFUNCIONES. TIEMPO. El timbre de QUEJAS se lo han llevado." }],
    mentions: ["ventanillas", "cartel", "archivo"],
    alt: "Un vestíbulo de mármol con una larga hilera de ventanillas vacías, una escalera que sube a la izquierda y dos carteles sobre pies."
  },
  archive: {
    name: "EL ARCHIVO", area: "town", at: [0, 2, 1],
    describe: [
      "Estanterías de registros hasta el techo, y un olor a polvo conservado a propósito. La {archivera|archivist} trabaja en una mesa bajo la única ventana, con una rebeca del color de un archivador.",
      "La escalera baja al vestíbulo."
    ],
    exits: { d: "town_hall" },
    scenery: [{ words: ["estanterías", "estanterias", "estantería", "estanteria", "registros", "registro", "libros", "polvo", "ventana", "mesa"], name: "las estanterías", says: "Cada año del pueblo, encuadernado y en orden. A las encuadernaciones les falta un día a la semana, y los huecos están tapados con cinta." },
              { words: ["escalera", "escaleras"], name: "la escalera", says: "Una escalera de mármol que baja al vestíbulo.", leads: "d" }],
    mentions: ["estanterías", "registros", "archivera", "mesa", "ventana", "escalera"],
    alt: "Una sala de estanterías altas llenas de registros encuadernados. Una mujer con una rebeca gris en una mesa bajo una ventana, con una lámpara a su lado."
  },
  clock_shop: {
    name: "LA RELOJERÍA", area: "town", at: [2, 2, 0],
    describe: [
      "Relojes en todas las paredes, cada uno con la hora de alguien, ninguno con la tuya. El {relojero|clockmaker} está sentado con una lupa en un ojo, arreglando un minuto.",
      "Sobre el mostrador hay un {reloj|backwards_clock} que anda hacia atrás. La calle Mayor queda al oeste."
    ],
    exits: { w: { to: "high_street", out: true } },
    scenery: [{ words: ["mostrador", "banco", "pinzas"], name: "el mostrador" },
              { words: ["relojes", "paredes", "tictac", "lupa", "esferas"], name: "los relojes", says: "Laten a velocidades distintas. Juntos suenan como una lluvia que no se decide." }],
    mentions: ["relojes", "relojero", "lupa", "reloj del revés", "mostrador"],
    alt: "Una tienda pequeña atestada de relojes de todos los tamaños en las paredes. Un anciano en un banco con una lupa de joyero; sobre el mostrador, un reloj con las manecillas girando al revés."
  },
  park: {
    name: "EL PARQUE", area: "town", at: [1, 3, 0],
    describe: [
      "Caminos de grava, un quiosco de música sin banda y un seto recortado con la forma de una semana a la que le falta un día.",
      "La calle Mayor queda al norte. La capilla, al oeste; el estanque, al este."
    ],
    exits: { n: "high_street", w: { to: "chapel", in: true }, e: "pond" },
    scenery: [
      { words: ["caminos", "camino", "grava"], name: "los caminos" },
      { words: ["quiosco", "banda", "atriles", "batuta"], name: "el quiosco de música", says: "Atriles plegados. Alguien ha dejado una batuta de director en la barandilla, apuntando a nada." },
      { words: ["seto", "semana", "día", "dia", "forma"], name: "el seto", says: "Siete bloques verdes, luego seis. El jardinero cuida el hueco con el mismo esmero que el resto." }
    ],
    mentions: ["caminos", "quiosco", "seto"],
    ambience: { lines: ["Un búho dice una palabra y se lo piensa mejor antes de la segunda.", "La grava cruje, aunque nadie la pisa.", "A lo lejos, en el túnel, algo canturrea una nota y la sostiene."],
                if: [hours(20, 7)] },
    alt: "Un pequeño parque: caminos de grava, un quiosco de música redondo y vacío, un largo seto recortado en bloques con un solo hueco. Árboles detrás."
  },
  chapel: {
    name: "LA CAPILLA", area: "town", at: [0, 3, 0],
    describe: [
      "Una capilla pequeña y fría, con un cementerio de {lápidas|gravestones} sencillas tras unas puertas de cristal. Cada lápida lleva una fecha y nada más. Todas las fechas son lunes.",
      "El parque queda al este."
    ],
    exits: { e: { to: "park", out: true } },
    scenery: [{ words: ["puertas", "puerta", "cristal", "capilla", "cementerio", "bancos"], name: "la capilla", says: "Bancos fríos, olor a cera. Las puertas de cristal del cementerio no están cerradas con llave; nadie viene." }],
    mentions: ["lápidas", "puertas", "cementerio"],
    alt: "El interior de una capilla pequeña y fría: bancos sencillos y, a través de altas puertas de cristal, un cementerio de lápidas pequeñas e iguales."
  },
  pond: {
    name: "EL ESTANQUE", area: "town", at: [2, 3, 0],
    describe: [
      "Un {estanque|pond_water} redondo con un borde de piedra. El pueblo cuelga cabeza abajo en él, un poco más nítido que el de verdad.",
      "El parque queda al oeste."
    ],
    exits: { w: "park" },
    scenery: [{ words: ["borde", "piedra", "pueblo"], name: "el borde" }],
    mentions: ["estanque", "borde", "pueblo"],
    alt: "Un estanque redondo con un borde de piedra, que refleja cabeza abajo los tejados y la torre del reloj de la estación."
  },
  compartment: {
    name: "EL COMPARTIMENTO", area: "train", at: [0, 0, 0],
    describe: [
      "Seis asientos de felpa verde, una redecilla para el equipaje, una {ventanilla|train_window} con una correa de cuero. Un cartel en la pared dice MARTES, con letras gastadas suavemente por los pulgares.",
      "El coche comedor queda al este. El andén, al sur, mientras el tren está en él."
    ],
    exits: { e: "dining_car", s: "platform" },
    scenery: [{ words: ["asientos", "asiento", "felpa", "redecilla", "portaequipajes", "equipaje", "cartel", "martes"], name: "el compartimento", says: "Los asientos recuerdan a otras personas. El cartel dice MARTES y, debajo, más pequeño: NO SE EXPIDEN BILLETES DE VUELTA." }],
    mentions: ["asientos", "redecilla", "ventanilla", "cartel", "correa"],
    waitFor: { time: "next 23:40", says: "Te sientas. El asiento está caliente. Por todo el tren se cierran puertas, una tras otra, como una frase al acabar." },
    alt: "El interior de un compartimento de tren: asientos de felpa verde, una redecilla para el equipaje, una ventanilla con una correa de cuero, un cartelito en la pared."
  },
  dining_car: {
    name: "EL COCHE COMEDOR", area: "train", at: [1, 0, 0],
    describe: [
      "Manteles blancos, una lámpara en cada mesa y cubiertos puestos para una comida que llega el martes. El {revisor|guard} está sentado en la última mesa, haciendo sus cuentas.",
      "El compartimento queda al oeste."
    ],
    exits: { w: "compartment" },
    scenery: [{ words: ["manteles", "mantel", "mesas", "mesa", "lámpara", "lampara", "lámparas", "lamparas", "cubiertos", "cubierto", "comida"], name: "las mesas", says: "Cada cubierto lleva una carta. Bajo MARTES hay una lista de platos y, bajo LUNES, una raya." }],
    mentions: ["manteles", "lámpara", "revisor", "mesas"],
    alt: "Un coche comedor de tren: manteles blancos, pequeñas lámparas en cada mesa y un revisor de uniforme al fondo con una libreta."
  }
};

// ---- Objetos ---------------------------------------------------------------------------------------------------------------
const objects = {
  // La apertura: las dos cosas que se cogen, la que llevas, y el camino (BRIEF.md §3).
  alarm: { at: "halt", portable: true, name: "Despertador de viaje", note: "Dale cuerda para empezar de nuevo.", actions: ["Coger despertador", "Dar cuerda al despertador"], heldActions: ["Dar cuerda al despertador", "Examinar despertador"],
    words: { nouns: ["despertador", "campanillas", "alarma"], adj: ["latón", "laton", "viaje", "pequeño", "pequeno", "reloj"], g: "m" }, ...item("alarm"),
    here: "Sobre el banco hay un {despertador|alarm} de latón, con la alarma puesta para mañana.",
    examine: "Un despertador de viaje, de latón, con dos campanillas arriba y una llave detrás. Está puesto para mañana por la mañana, y lleva ya algún tiempo siendo mañana por la mañana." },
  tin: { at: "halt", portable: true, name: "Lata de cacao", note: "Alguien al otro lado.", actions: ["Coger lata", "Escuchar lata"], heldActions: ["Escuchar lata", "Examinar lata"],
    words: { nouns: ["lata", "cordel", "cuerda", "cacao", "bote"], adj: ["cacao", "fría", "fria", "larga"], g: "f" }, ...item("tin"),
    here: "Al lado, una {lata|tin} de cacao tiende su cordel más allá del borde del andén.",
    examine: "Una lata de cacao con un agujero en el fondo y un cordel que sale de él, a lo largo del andén y por el borde hacia la oscuridad. El cordel está tenso, como si hubiera algo en el otro extremo." },
  diary_leaf: { at: "player", portable: true, name: "Página de agenda", note: "Rayada para una semana.", actions: ["Leer página"], heldActions: ["Leer página"],
    words: { nouns: ["página", "pagina", "agenda", "diario"], adj: ["hoja", "doblada", "amarilla", "rayada"], g: "f" }, ...item("diary_leaf"),
    examine: "Una página de agenda, rayada para una semana. El domingo y el martes están escritos, de tu puño y letra; donde debería estar el lunes hay un hueco limpio y cuidadoso, frotado hasta gastar el papel." },
  carriage_door: { at: "halt", scenery: true, name: "Puerta del vagón", note: "Abierta, esperando.", actions: ["Examinar puerta", "Entrar vagón"],
    words: { nouns: ["vagón", "vagon", "puerta", "coche"], adj: ["abierta", "única", "unica", "verde"], g: "f" },
    examine: "Un vagón verde, uno solo, con la puerta abierta y un escalón hasta la grava. La luz de dentro es la amarilla de una habitación de la que alguien acaba de levantarse." },

  // Objetos perdidos
  ambrose: { at: "lost_property", scenery: true, name: "Señor Ambrose", note: "El empleado de objetos perdidos.", actions: ["Hablar con Ambrose"],
    words: { nouns: ["ambrose", "señor", "senor", "empleado", "hombre"], adj: ["viejo", "pequeño", "pequeno", "don"], g: "m" },
    examine: "Un hombre pequeño con manguitos. Te mira como si intentara recordar dónde te dejaron.",
    talk: ["«¿Has perdido algo?», dice. «Todo el mundo. Di qué, y lo busco en el libro.»", "«Descríbelo», dice, «y si es tuyo, él lo sabrá.»"],
    topics: {
      umbrella: { words: ["paraguas", "sombrilla"], says: "«Paraguas gris», lee. Te mira a ti. Mira el paraguas." },
      you: { open: true, label: "mi llegada", words: ["llegada", "mismo", "camino", "origen"], says: "«Llegaste esta tarde», dice. «Nadie te ha reclamado todavía. Suele pasar.»" },
      monday: { label: "lunes", words: ["lunes", "decreto"], says: "«Ya no nos llegan lunes. Nos llega lo que quedó en ellos.» Da un golpecito al libro." },
      sea: { about: "sea_crate", label: "cajón", words: ["mar", "cajón", "cajon"], says: "«Alguien lo perdió hace años. Gotea. Le pongo un cubo debajo los jueves.»" },
      default: "Pasa una hoja del libro, no encuentra nada y la devuelve a su sitio."
    } },
  ledger: { at: "lost_property", scenery: true, name: "Libro de registro", note: "Todo lo perdido, en orden.", actions: ["Leer libro"], opens: ["monday", "umbrella"],
    words: { nouns: ["libro", "registro"], adj: ["grande", "negro"], g: "m" },
    examine: "Columnas de cosas perdidas. Hacia el final, con la misma letra paciente: «Un paraguas, gris. Dejado un lunes. Sin reclamar». Al lado, el nombre del dueño se ha corrido con la lluvia, en una letra que es la tuya.",
    parts: [{ words: ["columnas", "columna", "letra", "anotación", "anotacion", "anotaciones", "entradas"], name: "las anotaciones" }], mentions: ["paraguas", "columnas"] },
  umbrella: { at: "lost_property", portable: false, unnoticed: true, name: "Paraguas gris", note: "Tuyo, según la etiqueta.", actions: ["Examinar paraguas"], heldActions: ["Examinar paraguas", "Dar paraguas a archivera"],
    words: { nouns: ["paraguas"], adj: ["gris"], g: "m" }, ...item("umbrella"),
    examine: "Un paraguas gris con mango de madera y una etiqueta de papel. Huele a la última lluvia del último lunes.",
    parts: [{ words: ["etiqueta", "mango"], name: "la etiqueta", says: "Un nombre, corrido por la lluvia. Con tu letra, aunque no recuerdas haberlo escrito." }], mentions: ["etiqueta", "mango"] },
  sea_crate: { at: "lost_property", scenery: true, name: "Cajón", note: "MAR, UNO, SIN RECLAMAR.", actions: ["Escuchar cajón", "Abrir cajón"],
    words: { nouns: ["cajón", "cajon", "mar"], adj: ["húmedo", "humedo", "mojado", "madera"], g: "m" },
    examine: "Un cajón de madera, rotulado con plantilla: MAR, UNO, SIN RECLAMAR. El agua perla sus junturas y corre, despacio, hacia tus pies.",
    listen: "Dentro, muy pequeñas, las olas se dan la vuelta mientras duermen.",
    locked: true, lock: { says: "La tapa está clavada. Alguien decidió que el mar debía seguir perdido." },
    parts: [{ words: ["junturas", "juntura", "agua", "tapa", "clavos", "plantilla"], name: "las junturas", says: "Agua salada. Te encuentra los pies cada vez, como si tuviera adónde ir." }], mentions: ["junturas", "agua", "tapa"] },

  // Vestíbulo
  station_clock: { at: "station_hall", scenery: true, name: "Reloj de la estación", note: "No miente en ningún minuto.", actions: ["Examinar reloj"],
    words: { nouns: ["reloj"], adj: ["estación", "estacion", "grande", "honrado", "sincero"], g: "m" },
    examine: "Un reloj grande y sencillo. Marca [time]. El pueblo lleva sus horas por él, y las lleva bien." },
  calendar: { at: "station_hall", scenery: true, name: "Calendario", note: "Arrancado hasta el domingo.", actions: ["Examinar calendario"], opens: ["monday"],
    words: { nouns: ["calendario", "almanaque", "taco", "hojas"], adj: ["pared"], g: "m" },
    examine: "Un calendario de hojas que marca DOMINGO. Entre la hoja del domingo y la siguiente, la del martes, queda el resto de una que arrancaron, y un poco de cola, todavía pegajosa.",
    parts: [{ words: ["cola", "pegamento", "resto", "hueco"], name: "el hueco", says: "Sitio para una hoja. La cola sigue pegajosa, después de tantos años." }], mentions: ["hueco", "cola"] },
  decree: { at: "station_hall", scenery: true, name: "Decreto", note: "Enmarcado y firmado.", actions: ["Leer decreto"], opens: ["monday"],
    words: { nouns: ["decreto", "aviso", "marco", "cuadro"], adj: ["enmarcado"], g: "m" },
    examine: "«Por decreto: queda abolido el lunes en este pueblo, con efecto desde el próximo. El último lunes se guardará en el ayuntamiento, por si acaso.» Firmado por el Ministro, con una rúbrica que se alarga demasiado.",
    parts: [{ words: ["rúbrica", "rubrica", "firma", "ministro"], name: "la firma" }], mentions: ["firma"] },
  window: { at: "station_hall", scenery: true, name: "Ventanilla de billetes", note: "Billetes desde las nueve de la noche.", actions: ["Examinar ventanilla", "Comprar billete"],
    words: { nouns: ["ventanilla", "taquilla", "reja", "rejilla", "postigo", "cartel", "tarjeta"], adj: ["billetes", "billete", "latón", "laton"], g: "f" },
    examine: "Una reja de latón, un postigo y un cartel: BILLETES DESDE LAS 21:00. UN VIAJE, UNA MONEDA. SOLO MONEDA ANTIGUA.",
    mentions: ["reja", "postigo", "cartel"] },
  booking_clerk: { at: null, scenery: true, name: "Taquillera", note: "Tras la reja.", actions: ["Comprar billete"],
    words: { nouns: ["taquillera", "mujer", "empleada"], adj: ["billetes", "billete"], g: "f" },
    examine: "Una mujer con un sacabocados y ninguna expresión de sobra.",
    here: "El postigo está levantado. Tras la reja, la {taquillera|booking_clerk} espera con su sacabocados.",
    talk: "«Un viaje, una moneda», dice. «De las antiguas. Martes es el único sitio al que vamos.»",
    topics: { coin: { about: "window", label: "monedas", words: ["moneda", "monedas", "dinero", "precio", "tarifa", "viaje"], says: "«De las antiguas. Dejaron de acuñarlas cuando dejaron de hacer lunes. La gente las tiraba a la fuente de la plaza, para dar suerte.»" },
              default: "«Billetes», dice, como si eso fuera la respuesta." } },
  timetable: { at: "station_hall", scenery: true, name: "Horario", note: "Un solo tren.", actions: ["Leer horario"],
    words: { nouns: ["horario", "pared"], adj: [], g: "m" },
    examine: "Una pared entera de horario para una sola línea: MARTES, SALIDA 23:40, DIARIO. El tren llega diez minutos antes. Bajo REGRESOS, alguien ha pintado una raya limpia." },

  // Sala de espera
  booth: { at: "waiting_room", scenery: true, name: "Fotomatón", note: "Con la cortina echada.", actions: ["Entrar en fotomatón"],
    words: { nouns: ["fotomatón", "fotomaton", "cabina", "cortina"], adj: ["foto", "fotográfica", "fotografica"], g: "m" }, enterable: "in",
    enter: "Corres la cortina y te sientas en el taburete. Hay un botón y un espejo que anda un poco retrasado.",
    examine: "Un fotomatón con un taburete y un botón rojo. Un cartel avisa de que revela las fotos de MAÑANA, NO SE ADMITEN DEVOLUCIONES.",
    parts: [{ words: ["taburete", "espejo", "cartel", "aviso"], name: "el espejo", says: "Tu cara llega a él un instante después que tú." }],
    mentions: ["taburete", "botón", "cartel"] },
  button: { at: "booth", scenery: true, name: "Botón", note: "Rojo, gastado.", actions: ["Pulsar botón"],
    words: { nouns: ["botón", "boton", "pulsador"], adj: ["rojo"], g: "m" }, examine: "Un botón rojo, gastado y pálido en el centro." },
  photograph: { at: null, portable: true, name: "Fotografía", note: "De mañana, aún mojada.", actions: ["Examinar fotografía"],
    words: { nouns: ["fotografía", "fotografia", "foto", "fotos", "tira"], adj: ["mojada", "húmeda", "humeda"], g: "f" }, ...item("photograph"),
    examine: "Una tira de cuatro fotografías, todavía mojada, a la luz del día: los escalones del ayuntamiento; luego una mujer con rebeca gris, arriba, en una ventana, enseñando una hoja de calendario que dice LUNES. En el último fotograma la coges tú." },
  oduya: { at: "waiting_room", scenery: true, name: "Señora Oduya", note: "Esperando, con una maleta.", actions: ["Hablar con Oduya"],
    words: { nouns: ["oduya", "señora", "senora", "mujer", "viajera", "anciana", "maleta"], adj: ["vieja", "mayor"], g: "f" },
    examine: "Una anciana pulcra con un sombrero cuya pluma se ha rendido. Su billete es para el de las ocho y doce a Lunes. Es muy antiguo.",
    talk: "«Espero al de las ocho y doce», dice. «Ya no circula. Soy muy paciente.»",
    topics: {
      coin: { about: "window", label: "monedas", words: ["moneda", "monedas", "dinero", "tarifa", "tarifas", "billete", "billetes"], says: "«Necesitarás una moneda antigua para el billete. La fuente de la plaza está llena. No se ven hasta que se enciende la lámpara bajo el agua, a las ocho.»" },
      monday: { label: "lunes", words: ["lunes", "decreto"], says: "«Guardaron el último en el ayuntamiento, por si acaso. Por si acaso qué, nunca lo dijeron. La archivera lo sabrá. De nueve a cinco.»" },
      train: { about: "timetable", words: ["tren", "martes", "medianoche"], says: "«El tren del martes. A las doce menos veinte. Dicen que en martes ni te cases ni te embarques, y del martes no vuelve nadie. No se lo reprocho.»" },
      default: "«Ay, yo qué sé», dice. «Yo solo espero.»"
    } },

  // Andén
  bench: { at: "platform", scenery: true, name: "Banco", note: "Para esperar.", actions: ["Sentarse en banco"], opens: ["monday"],
    words: { nouns: ["banco", "asiento"], adj: ["madera"], g: "m" }, enterable: "on",
    examine: "Un banco con una placa de latón: EN MEMORIA DEL LUNES, QUE NOS TENÍA ENTRETENIDOS.",
    parts: [{ words: ["placa"], name: "la placa", says: "EN MEMORIA DEL LUNES, QUE NOS TENÍA ENTRETENIDOS." }], mentions: ["placa"] },
  board: { at: "platform", scenery: true, name: "Panel de horarios", note: "Una sola línea.", actions: ["Leer panel"],
    words: { nouns: ["panel", "cuadro", "horario", "horarios"], adj: ["colgante"], g: "m" },
    examine: "MARTES, SALIDA 23:40. El tren llega diez minutos antes. Solo pasajeros con billete." },
  train: { at: null, scenery: true, name: "Tren", note: "Para el martes.", actions: ["Subir al tren"],
    words: { nouns: ["tren", "vagón", "vagon", "vagones", "locomotora", "coche"], adj: ["martes", "noche", "verde"], g: "m" }, enterable: "in",
    examine: "Tres vagones verdes y una locomotora que respira vapor en bocanadas lentas y deliberadas. Todas las ventanillas están encendidas. Nadie mira hacia fuera.",
    here: "El {tren|train} está en el andén, respirando. Al norte, tiene las puertas abiertas." },

  // Final del andén
  tunnel: { at: "platform_end", scenery: true, name: "Túnel", note: "Tibio. Zumbando.", actions: ["Escuchar túnel"],
    words: { nouns: ["túnel", "tunel", "boca", "oscuridad"], adj: ["tibio", "cálido", "calido"], g: "m" },
    examine: "Ladrillo, y luego nada. El aire tibio huele a hollín y a algo dulce, como un día que has estado esperando.",
    listen: "Un zumbido bajo y paciente. Suena como una multitud diciendo una palabra que aún no ha aprendido." },

  // Caseta de señales
  signalman: { at: "signal_box", scenery: true, name: "Guardagujas", note: "La mano en la palanca.", actions: ["Hablar con guardagujas"],
    words: { nouns: ["guardagujas", "señalero", "senalero", "hombre"], adj: [], g: "m" },
    examine: "Mangas de camisa, brazalete, un bigote adiestrado durante muchos años. No aparta la mano de la palanca.",
    talk: "«A las doce menos veinte», dice. «Todas las noches. Nunca he dejado salir tarde a la máquina.»",
    topics: {
      train: { about: "board", words: ["tren", "martes", "medianoche"], says: "«Entra a las once y media y sale a las doce menos veinte. Te hará falta billete. El revisor es muy suyo.»" },
      tunnel: { words: ["túnel", "tunel", "oscuridad", "línea", "linea"], says: "«No entres. Ni cuando le toca pasar. Ni cuando no.»" },
      monday: { label: "lunes", words: ["lunes"], says: "«Antes salía el de las ocho y doce a Lunes. Yo mismo tiré de la palanca la última vez.» Se mira la mano." },
      default: "«No es de mi línea», dice. Lo dice con buena intención."
    } },
  diagram: { at: "signal_box", scenery: true, name: "Esquema", note: "Un solo trazo.", actions: ["Examinar esquema"],
    words: { nouns: ["esquema", "plano", "trazo", "diagrama"], adj: [], g: "m" },
    examine: "Toda la línea, dibujada sobre esmalte: un solo trazo desde aquí hasta MARTES. Un segundo trazo, hacia LUNES, ha sido pintado encima con el mismo crema que la pared." },

  // Plaza
  fountain: { at: "square", scenery: true, name: "Fuente", note: "Con monedas dentro.", actions: ["Examinar fuente", "Coger moneda"],
    words: { nouns: ["fuente", "pilón", "pilon", "agua"], adj: ["piedra"], g: "f" },
    examine: "Un pilón de piedra con el agua quieta. En el fondo hay monedas, de una moneda que ya nadie usa. En el suelo del pilón hay empotrada una lamparita.",
    parts: [{ words: ["lámpara", "lampara", "lamparita", "fondo"], name: "la lámpara bajo el agua", says: "Una lámpara de latón en el fondo del pilón. Se enciende a las ocho, con las demás." }], mentions: ["monedas", "lámpara"] },
  coin: { at: "fountain", portable: true, name: "Moneda antigua", note: "La moneda de antes.", actions: ["Examinar moneda"], heldActions: ["Examinar moneda", "Comprar billete"],
    words: { nouns: ["moneda", "monedas", "dinero", "pieza"], adj: ["antigua", "vieja", "pesada"], g: "f" }, ...item("coin"),
    examine: "Una moneda antigua y pesada. Por una cara, un perfil con los ojos cerrados. Por la otra, la semana, con sus siete días." },
  statue: { at: "square", scenery: true, name: "Estatua", note: "El Ministro.", actions: ["Examinar estatua"],
    words: { nouns: ["estatua", "ministro", "bronce"], adj: [], g: "f" },
    examine: "El Ministro que abolió los lunes, en bronce, con una mano en el corazón y la otra sosteniendo una pluma como un cuchillo. En el pedestal: NOS DEVOLVIÓ LOS DOMINGOS.",
    parts: [{ words: ["pedestal", "pluma", "mano"], name: "el pedestal" }], mentions: ["pedestal", "pluma"] },

  // Hotel
  porter: { at: "hotel", scenery: true, name: "Conserje de noche", note: "Leyendo el sábado.", actions: ["Hablar con conserje"],
    words: { nouns: ["conserje", "portero", "recepcionista"], adj: ["noche", "nocturno"], g: "m" },
    examine: "Un hombre largo, plegado tras un mostrador corto. Lee el mismo periódico todas las noches y sigue sorprendiéndose.",
    talk: "«¿Una habitación?», dice, sin levantar la vista. «Pídela, entonces.»",
    topics: {
      room: { open: true, label: "una habitación", words: ["habitación", "habitacion", "habitaciones", "cuarto", "llave", "cama", "dormir"], says: "«La cuatro», dice." },
      train: { open: true, words: ["tren", "martes"], says: "«Los huéspedes se van en el tren del martes. Dejan el equipaje. Está todo en el desván.»" },
      default: "«No sabría decirte», dice. «El periódico del sábado no lo menciona.»"
    } },
  room_key: { at: null, portable: true, name: "Llave de la habitación", note: "La cuatro.", actions: ["Examinar llave"],
    words: { nouns: ["llave", "habitación", "habitacion", "cuarto"], adj: ["hotel", "latón", "laton"], g: "f" }, ...item("room_key"),
    examine: "Una llave de latón colgada de una pera de madera con un 4 marcado a fuego." },
  bed: { at: "hotel_room", scenery: true, name: "Cama", note: "Abierta.", actions: ["Dormir"],
    words: { nouns: ["cama", "sábanas", "sabanas", "almohada", "colchón", "colchon"], adj: ["hierro"], g: "f" }, enterable: "on",
    examine: "Una cama de hierro, abierta. La almohada está fresca. Quien debía acostarse en ella se hace esperar desde hace años." },

  // Café
  ines: { at: "cafe", scenery: true, name: "Inés", note: "Tras la barra.", actions: ["Hablar con Inés", "Pedir café"],
    words: { nouns: ["ines", "camarera", "mujer"], adj: [], g: "f" },
    examine: "Una mujer con las mangas remangadas y un lápiz detrás de cada oreja, por si uno se rinde.",
    talk: "«¿Café?», dice. Es la única pregunta que hace.",
    topics: {
      monday: { label: "lunes", words: ["lunes", "archivo", "archivera"], says: "«¿El último lunes? En el ayuntamiento. De nueve a cinco. La archivera no le da nada a quien no pruebe que lo perdió.»" },
      train: { open: true, words: ["tren", "martes"], says: "«La gente toma aquí su último café», dice. «Luego se van. Yo lavo la taza.»" },
      coin: { about: "fountain", label: "monedas", words: ["moneda", "monedas", "dinero"], says: "«¿Monedas antiguas? En la fuente de la plaza. Las verás cuando se encienda la lámpara del agua.»" },
      coffee: { open: true, words: ["café", "cafe", "taza", "beber"], says: "«Café», dice." },
      default: "«Café», dice. «De café sí entiendo.»"
    } },
  menu: { at: "cafe", scenery: true, name: "Pizarra", note: "Café, y nada más.", actions: ["Leer pizarra"],
    words: { nouns: ["pizarra", "carta", "menú", "menu", "tiza"], adj: [], g: "f" },
    examine: "En tiza: CAFÉ. Debajo, borrado pero legible: CHURROS (SOLO LOS LUNES)." },
  coffee: { at: null, portable: false, name: "Taza de café", note: "Caliente, y gratis.", actions: ["Beber café"],
    words: { nouns: ["café", "cafe", "taza"], adj: [], g: "f" },
    examine: "Pequeño, negro, muy caliente. Huele a mañanas en las que no tuviste que madrugar." },

  // Calle Mayor, ayuntamiento, archivo
  plate: { at: "high_street", scenery: true, name: "Placa de latón", note: "Horario de oficina.", actions: ["Leer placa"], opens: ["monday"],
    words: { nouns: ["placa", "horario", "horas"], adj: ["latón", "laton", "oficina"], g: "f" },
    examine: "AYUNTAMIENTO, ABIERTO DE 09:00 A 17:00, ARCHIVO ARRIBA, CERRADO LOS LUNES. La última línea está más pulida que las otras." },
  archivist: { at: "archive", scenery: true, name: "Archivera", note: "Guarda el último lunes.", actions: ["Hablar con archivera"],
    words: { nouns: ["archivera", "archivista", "mujer", "señora", "senora"], adj: [], g: "f" },
    examine: "Una rebeca gris, gafas de media luna y la paciencia de quien archiva por orden alfabético de sentimientos.",
    talk: "«¿Sí?», dice, que en el archivo es un párrafo entero.",
    topics: {
      monday: { label: "lunes", words: ["lunes", "página", "pagina", "decreto", "último", "ultimo"], says: "«El último lunes», dice. «Guardado, por si acaso. Es de quien perdió uno. Tráeme algo que perdieras en el tuyo, y será tuyo para devolverlo a su sitio.»" },
      umbrella: { words: ["paraguas", "etiqueta", "mesa"], says: "«Algo que perdiste», dice. «No algo de lo que te hayan hablado.»" },
      default: "Lo busca bajo una letra que elige ella, y no encuentra nada."
    } },
  monday_page: { at: null, portable: true, name: "Lunes", note: "El último.", actions: ["Examinar lunes"], heldActions: ["Examinar lunes", "Poner lunes en calendario"],
    words: { nouns: ["lunes", "hoja"], adj: ["último", "ultimo", "última", "ultima", "calendario", "página", "pagina"], g: "m" }, ...item("monday_page"),
    examine: "Una hoja de calendario: LUNES, en negro, sin nada escrito debajo. Pesa más de lo que debería pesar un papel. Está todo por hacer." },

  // Relojería
  clockmaker: { at: "clock_shop", scenery: true, name: "Relojero", note: "Arreglando un minuto.", actions: ["Hablar con relojero"],
    words: { nouns: ["relojero", "hombre", "anciano"], adj: ["viejo"], g: "m" },
    examine: "Un anciano con una lupa enroscada en un ojo y un minuto entre las pinzas. El minuto se resiste un poco.",
    talk: "«Cada reloj de aquí lleva la hora de alguien», dice. «El del mostrador lleva la de ayer. Dale cuerda, si necesitas que te devuelva uno.»",
    topics: {
      clock: { about: "backwards_clock", words: ["reloj", "atrás", "atras", "revés", "reves", "ayer"], says: "«Dale cuerda y tendrás otra vez el ayer. Solo vuelve el día. Lo que hicieras en él, lo hiciste.»" },
      monday: { label: "lunes", words: ["lunes", "calendario"], says: "«Pon la hoja donde la arrancaron», dice, «y todos los relojes del pueblo sabrán qué hacer.»" },
      default: "«Eso no es una cuestión de relojes», dice, y vuelve a su minuto."
    } },
  backwards_clock: { at: "clock_shop", scenery: true, name: "Reloj del revés", note: "La hora de ayer.", actions: ["Dar cuerda al reloj"],
    words: { nouns: ["reloj"], adj: ["revés", "reves", "atrás", "atras", "atrasado", "contrario", "inverso"], g: "m" },
    examine: "Un reloj de sobremesa, de latón, cuyas manecillas giran al revés, sin prisa. Lleva una llave en la espalda." },

  // Capilla, estanque
  gravestones: { at: "chapel", scenery: true, name: "Lápidas", note: "Todas lunes.", actions: ["Examinar lápidas"], opens: ["monday"],
    words: { nouns: ["lápidas", "lapidas", "lápida", "lapida", "piedras", "tumbas", "fechas"], adj: ["sencillas"], g: "f", pl: true },
    examine: "Lápidas pequeñas y sencillas, cada una con una fecha, todas lunes. La más nueva dice solo: AQUÍ NO ESTÁ EL ÚLTIMO. SE GUARDA EN EL AYUNTAMIENTO, POR SI ACASO.",
    parts: [{ words: ["fecha", "nueva", "reciente", "última", "ultima"], name: "la lápida más nueva", says: "AQUÍ NO ESTÁ EL ÚLTIMO. SE GUARDA EN EL AYUNTAMIENTO, POR SI ACASO." }], mentions: ["fecha"] },
  pond_water: { at: "pond", scenery: true, name: "Estanque", note: "El pueblo, cabeza abajo.", actions: ["Examinar estanque"],
    words: { nouns: ["estanque", "agua", "reflejo"], adj: ["redondo"], g: "m" },
    examine: "En el agua el reloj de la estación está cabeza abajo y marcha en el sentido correcto. En el calendario que hay debajo, en el reflejo, hay una hoja entre el domingo y el martes." },

  // El tren
  train_window: { at: "compartment", scenery: true, name: "Ventanilla", note: "Con correa de cuero.", actions: ["Mirar por ventanilla"],
    words: { nouns: ["ventanilla", "ventana", "correa"], adj: ["cuero", "tren"], g: "f" },
    examine: "Tu cara en el cristal, y detrás el andén, y detrás el pueblo, que ya se ve más pequeño." },
  guard: { at: "dining_car", scenery: true, name: "Revisor", note: "Haciendo cuentas.", actions: ["Hablar con revisor"],
    words: { nouns: ["revisor", "interventor", "jefe", "hombre"], adj: [], g: "m" },
    examine: "Un revisor con un abrigo de demasiados botones, sumando una columna que no acaba nunca.",
    talk: "«Billetes», dice, y luego, al ver el tuyo, «Ah. Solo de ida.»",
    topics: {
      tuesday: { open: true, label: "martes", words: ["martes", "tren", "vuelta", "regreso", "volver"], says: "«El martes es precioso», dice. «Nadie vuelve. Nadie ha escrito nunca para decir que quería.»" },
      monday: { label: "lunes", words: ["lunes"], says: "Deja de sumar. «Ahí no paramos», dice, y vuelve a empezar desde arriba." },
      default: "«No consta en el horario», dice."
    } }
};

// ---- Cambios con nombre ---------------------------------------------------------------------------------------------------
// La noche y el día llegan a todas las salas de fuera: el texto de la plaza, los cielos de las imágenes al aire libre.
// (y el cielo por las ventanas de la caseta de señales, la habitación del hotel, el archivo y la capilla)
const OUTDOOR_SKIES = { platform: "sky", platform_end: "sky", square: "sky", high_street: "sky", park: "sky", pond: "sky",
                        signal_box: "sky", hotel_room: "sky", archive: "sky", chapel: "sky" };
const sky = (top, bottom, h = 60) => ({ fade: [top, bottom], from: [0, 0], to: [0, h] });
const skies = (top, bottom) => Object.entries(OUTDOOR_SKIES).map(([room, id]) => ({ draw: room, restyle: [{ id, fill: sky(top, bottom) }] }));
const changes = {
  nightfall: [
    { set: "square.describe", to: squareNight },
    ...skies(0, 1),
    { draw: "pond", restyle: [{ id: "pond", fill: { fade: [0, 1], from: [0, 60], to: [0, 126] } }] },
    { draw: "station_hall", restyle: [{ id: "roof", fill: { mix: [1, 8], level: 0.6 } }] },
    { draw: "square", restyle: [{ id: "lamp_a", fill: 14 }, { id: "lamp_b", fill: 14 }, { id: "lamp_c", fill: 14 }, { id: "lamp_d", fill: 14 }, { id: "water_lamp", fill: { mix: [3, 11], level: 0.5 } }] }
  ],
  daybreak: [
    { set: "square.describe", to: squareDay }, { set: "square.waitFor.says", to: "Te sientas en el borde de la fuente y dejas pasar el día. Ya entrada la tarde, un hombre con una pértiga enciende las farolas, y la última, la que está bajo el agua." },
    ...skies(9, 11),
    { draw: "pond", restyle: [{ id: "pond", fill: { fade: [9, 11], from: [0, 60], to: [0, 126] } }] },
    { draw: "station_hall", restyle: [{ id: "roof", fill: { mix: [11, 8], level: 0.6 } }] },
    { draw: "square", restyle: [{ id: "lamp_a", fill: 8 }, { id: "lamp_b", fill: 8 }, { id: "lamp_c", fill: 8 }, { id: "lamp_d", fill: 8 }, { id: "water_lamp", fill: 1 }] }
  ],
  // El tren llega y se va.
  train_in: [
    // El vagón es la entrada del andén ("dentro", "entrar") y la salida del compartimento; la caseta de señales, también junto al
    // andén, no está marcada: se entra por su dirección, y un "entrar" sin tren es la pista del tren.
    { move: "train", to: "platform" }, { connect: "platform", dir: "n", to: "compartment", passage: true, in: true },
    { connect: "compartment", dir: "s", to: "platform", passage: true, out: true },
    { draw: "platform", add: "rect train_body 0,50,300,26 2 e0 after:rails\nrect train_windows 10,56,280,10 stripes:14,6 after:train_body" }
  ],
  train_out: [
    { move: "train", to: null }, { disconnect: "platform", dir: "n" }, { disconnect: "compartment", dir: "s" },
    { set: "platform.waitFor.says", to: "Esperas en el andén. La hora llega como llega el tren, de golpe. A las once y media salen luces del túnel." },
    { draw: "platform", remove: ["train_body", "train_windows"] }
  ],
  yesterday: [
    { say: "Giras la llave. Las manecillas corren hacia atrás, los relojes de las paredes se callan uno a uno, y la luz de la ventana cruza el suelo en sentido contrario. Es ayer. Lo que hicieras en él, lo hiciste." },
    { time: "-1d" }, { calm: 2 }
  ],
  // Los finales
  tuesday_ending: [
    { say: "El tren se mueve. El andén se desliza hacia atrás, luego el pueblo, luego el túnel te traga. Durante mucho rato solo hay el zumbido y tu cara en la ventanilla. Entonces la ventanilla se llena de luz. Es martes. A partir de ahora siempre va a ser martes, y en algún sitio un lunes espera todo el día a alguien que se ha adelantado." },
    { end: true, picture: "tuesday" }
  ],
  monday_ending: [
    { move: "monday_page", to: null }, { set: "calendar.examine", to: "Un calendario de hojas que marca LUNES." },
    { say: "Aprietas la hoja contra el hueco. La cola agarra. Un momento no pasa nada. Luego el reloj de la estación da la hora, y todos los relojes del pueblo le responden, el del relojero el último y el más fuerte. El calendario marca LUNES." },
    { say: "En algún lugar a tus espaldas, [way] se abre de nuevo. Vuelves por donde viniste, a través de objetos perdidos, y al otro lado es lunes por la mañana. Es tuyo, todo entero, y está por hacer." },
    { end: true, picture: "monday" }
  ],
  sunday_ending: [
    { say: "En algún lugar a tus espaldas, [way] se cierra, con suavidad, como se cierra un libro. En objetos perdidos, el señor Ambrose escribe algo en el libro de registro. El reloj de la estación no da la hora. Es domingo, y va a seguir siendo domingo, y al cabo de un rato dejas de darle importancia, que es lo peor." },
    { end: true, picture: "sunday" }
  ]
};

// ---- Reglas ----------------------------------------------------------------------------------------------------------------
// Pasado el revisor: igual si subes al tren por su nombre («sube al tren») o por su camino («dentro», «entrar», «n»).
const pastTheGuard = [{ say: "El revisor mira tu billete, lo pica otra vez, por si acaso, y se hace a un lado." }, { travel: "compartment" }, { describe: "$here" }];

// Subir al tren, en español: «entra en el tren», «sube al tren», «coge el tren», «toma el tren», «abordar el tren».
const BOARD = ["enter", "board", "take", "climb"];

const rules = [
  // Objetos perdidos: el paraguas, cuando lo pides.
  { id: "claim_umbrella", match: { verb: "ask", obj: "ambrose", topic: "umbrella" }, if: [{ "umbrella.at": "lost_property" }],
    do: [{ say: "«Paraguas gris», lee. Te mira las manos, luego la etiqueta, y lo baja del estante. «Tu letra», dice. «Las cosas suelen saberlo.»" },
         { set: "umbrella.portable", to: true }, { move: "umbrella", to: "player" }, tension(-5)] },
  { id: "claim_umbrella_order", match: { verb: "order", obj: "umbrella" }, if: [at("lost_property"), { "umbrella.at": "lost_property" }],
    do: [{ say: "«Paraguas gris», lee. Te mira las manos, luego la etiqueta, y lo baja del estante. «Tu letra», dice. «Las cosas suelen saberlo.»" },
         { set: "umbrella.portable", to: true }, { move: "umbrella", to: "player" }, tension(-5)] },
  { id: "take_umbrella_early", match: { verb: "take", obj: "umbrella" }, if: [{ "umbrella.portable": false }],
    do: [{ say: "Está detrás del mostrador. El señor Ambrose no entrega nada a quien no lo ha pedido." }] },
  { id: "claim_umbrella_say", match: { verb: "say", obj: [null, "ambrose"] }, if: [at("lost_property"), { "umbrella.at": "lost_property" }],
    do: [{ say: "«Si es algo que perdiste», dice el señor Ambrose, «pídemelo por su nombre. Así se hace: pidiéndolo.»" }] },

  // El café: abierto de siete de la mañana a diez de la noche; el café te serena.
  { id: "cafe_closes", when: "at", at: "22:00", if: [at("cafe")],
    do: [{ say: "Inés apaga la radio en mitad del vals. «Cerramos», dice, y te encuentras en la plaza." }, { travel: "square" }, { describe: "$here" }] },
  { id: "order_coffee", match: { verb: ["order", "buy", "ask"], obj: [null, "coffee", "ines"] }, if: [at("cafe"), { "$topic": { in: [null, "coffee"] } }, { "coffee.at": null }, { "coffee.day": { "!=": "$time.day" } }],
    do: [{ say: "Inés deja ante ti un {café|coffee} pequeño y negro sin decir palabra. «Invita la casa», dice. «Los domingos siempre invita.»" }, { move: "coffee", to: "cafe" }, { set: "coffee.day", to: "$time.day" }] },
  { id: "coffee_served", match: { verb: ["order", "buy", "ask"], obj: [null, "coffee", "ines"] }, if: [at("cafe"), { "coffee.at": "cafe" }, { "$topic": { in: [null, "coffee"] } }], do: [{ say: "«Primero ese», dice Inés." }] },
  { id: "coffee_done", match: { verb: ["order", "buy", "ask"], obj: [null, "coffee", "ines"] }, if: [at("cafe"), { "$topic": { in: [null, "coffee"] } }], do: [{ say: "«Uno al día», dice Inés. «Con más empezarías a esperar cosas.»" }] },
  { id: "drink_coffee", match: { verb: "drink", obj: "coffee" }, if: [{ "coffee.at": "cafe" }],
    do: [{ say: "Está muy bueno. Por un momento no recuerdas nada a lo que hayas llegado tarde." }, { move: "coffee", to: null }, tension(-15)] },

  // La ventanilla de billetes tiene su horario (de nueve de la noche a seis de la mañana).
  { id: "window_open_look", match: { verb: "examine", obj: "window" }, if: [hours(21, 6)],
    do: [{ say: "El postigo está levantado. Tras la reja, la taquillera espera con su sacabocados. El cartel dice: UN VIAJE, UNA MONEDA. SOLO MONEDA ANTIGUA." }] },
  { id: "buy_ticket_have", match: { verb: "buy" }, if: [holding("ticket")], do: [{ say: "Ya tienes uno. Con uno basta." }] },
  { id: "buy_ticket", match: { verb: "buy", obj: [null, "ticket", "window", "booking_clerk"] }, if: [at("station_hall"), hours(21, 6), holding("coin")],
    do: [{ say: "Deslizas la moneda antigua bajo la reja. La taquillera la muerde, asiente, pica un billete y te lo devuelve. «Martes», dice. «Solo ida.»" },
         { move: "coin", to: null }, { move: "ticket", to: "player" }] },
  { id: "buy_ticket_poor", match: { verb: "buy", obj: [null, "ticket", "window", "booking_clerk"] }, if: [at("station_hall"), hours(21, 6), { "ticket.at": { "!=": "player" } }],
    do: [{ say: "«Un viaje, una moneda», dice la taquillera. «De las antiguas.»" }] },
  { id: "buy_ticket_shut", match: { verb: "buy", obj: [null, "ticket", "window", "booking_clerk"] }, if: [at("station_hall"), notHours(21, 6)],
    do: [{ say: "El postigo está bajado. El cartel dice: BILLETES DESDE LAS 21:00." }] },
  { id: "buy_elsewhere", match: { verb: "buy" }, do: [{ say: "Aquí nada está en venta, salvo en la ventanilla de billetes." }] },
  // La taquillera está en su ventanilla mientras está abierta.
  { id: "clerk_in", when: "at", at: "21:00", do: [{ move: "booking_clerk", to: "station_hall" }] },
  { id: "clerk_in_say", when: "at", at: "21:00", if: [at("station_hall")], do: [{ say: "Se levanta el postigo de la ventanilla de billetes. Una mujer tras la reja dispone su sacabocados." }] },
  { id: "clerk_out", when: "at", at: "06:00", do: [{ move: "booking_clerk", to: null }] },

  // Las monedas de la fuente: solo con la lámpara bajo el agua encendida (de ocho de la tarde a siete de la mañana).
  { id: "coin_dark", match: { verb: ["take", "search", "examine"], obj: ["coin", "fountain"] }, if: [at("square"), notHours(20, 7), { "coin.at": "fountain" }],
    do: [{ say: "El agua solo devuelve el cielo. Sea lo que sea lo que hay en el fondo, no se distingue. La lámpara del pilón no está encendida." }] },
  { id: "coin_take", match: { verb: "take", obj: ["coin", "fountain"] }, if: [at("square"), { "coin.at": "fountain" }],
    do: [{ say: "Te remangas. El agua está más fría de lo que parece. Sacas una moneda antigua; las demás se asientan de nuevo." }, { move: "coin", to: "player" }] },
  { id: "coin_more", match: { verb: "take", obj: ["coin", "fountain"] }, if: [at("square"), { "coin.at": { "!=": "square" } }],
    do: [{ say: "Una es un viaje. Las demás son la suerte de otros." }] },

  // Anochece a las ocho, amanece a las siete: el texto de la plaza y todos los cielos de fuera.
  { id: "nightfall", when: "at", at: "20:00", do: [{ change: "nightfall" }] },
  { id: "nightfall_say", when: "at", at: "20:00", if: [at("square")],
    do: [{ say: "Un hombre con una pértiga va de farola en farola. Al final se inclina sobre la fuente, y bajo el agua se enciende una luz." }] },
  { id: "nightfall_say_out", when: "at", at: "20:00", if: [at("high_street", "platform", "platform_end", "park", "pond")],
    do: [{ say: "Por todo el pueblo se encienden las farolas." }] },
  { id: "daybreak", when: "at", at: "07:00", do: [{ change: "daybreak" }] },
  { id: "daybreak_say", when: "at", at: "07:00", if: [at("square", "high_street", "platform", "platform_end", "park", "pond")],
    do: [{ say: "Se hace de día. Las farolas se apagan." }] },

  // El tren: llega a las 23:30, sale a las 23:40, todas las noches.
  { id: "train_arrives", when: "at", at: "23:30", do: [{ change: "train_in" }] },
  { id: "train_arrives_say", when: "at", at: "23:30", if: [at("platform", "platform_end", "signal_box", "station_hall")],
    do: [{ say: "Salen luces del túnel, y luego el tren, despacio, como si tuviera cuidado contigo. Se detiene en el andén y respira." }] },
  { id: "train_leaves_aboard", when: "at", at: "23:40", if: [at("compartment", "dining_car")], do: [{ change: "tuesday_ending" }] },
  { id: "train_leaves_say", when: "at", at: "23:40", if: [at("platform", "platform_end", "signal_box", "station_hall")],
    do: [{ say: "Se cierran puertas de golpe. El tren sale y el túnel se lo traga. El andén queda muy callado después." }] },
  { id: "train_leaves", when: "at", at: "23:40", do: [{ change: "train_out" }] },
  // Subir: con billete, pasado el revisor.
  { id: "board_no_ticket", match: { verb: [...BOARD, "go"], obj: [null, "train"] }, if: [at("platform"), { "train.at": "platform" }, { "ticket.at": { "!=": "player" } }, { "$exit": { in: ["compartment", null] } }],
    do: [{ say: "El revisor baja y se planta en la puerta. «Billetes», dice, y espera, y tú no tienes ninguno." }] },
  { id: "board", match: { verb: BOARD, obj: "train" }, if: [at("platform"), holding("ticket")], do: pastTheGuard },
  // El vagón está marcado como la entrada del andén, así que «dentro» y un «entrar» a secas van al norte (el motor convierte lo uno en lo otro).
  { id: "board_by_way", match: { verb: "go", dir: "n" }, if: [at("platform"), { "train.at": "platform" }, holding("ticket")], do: pastTheGuard },
  { id: "no_train", match: { verb: [...BOARD, "go"], obj: [null, "train"] }, if: [at("platform"), { "train.at": { "!=": "platform" } }, { "$exit": { in: [true, null] } }],
    do: [{ say: "Los raíles están vacíos. El panel dice que el tren llega a las once y media." }] },
  { id: "wait_train", match: { verb: "wait" }, if: [at("platform"), { "train.at": "platform" }, { "$text": { "!=": null } }],
    do: [{ say: "El tren está aquí. No esperará mucho más que tú." }] },

  // El túnel: primero la advertencia, luego el daño.
  { id: "tunnel_warn", match: { verb: ["go", "enter"], obj: [null, "tunnel"] }, if: [at("platform_end"), { "$exit": { in: [true, null] } }], once: true,
    do: [{ say: "Bajas a los raíles. El zumbido se te mete en los dientes. Dentro, la oscuridad se inclina hacia ti. Subes de nuevo. La próxima vez quizá no puedas." }, tension(10)] },
  { id: "tunnel_hurt", match: { verb: ["go", "enter"], obj: [null, "tunnel"] }, if: [at("platform_end"), { "$exit": { in: [true, null] } }],
    do: [{ say: "Entras. El aire tibio se espesa hasta que es como abrirse paso entre una multitud. Algo pasa muy cerca, a toda velocidad, y desaparece. Sales a gatas, sin una parte de la tarde." },
         { hurt: 2, says: "Algo te ha alcanzado al pasar." }, tension(15)] },

  // El ayuntamiento tiene horario de oficina (de nueve a cinco); puedes esperar en sus escalones, o dormir en el hotel.
  { id: "hall_closes", when: "at", at: "17:00", if: [at("town_hall", "archive")],
    do: [{ say: "Una campana da las cinco. Un empleado te acompaña a la salida, con educación, como si fueras una corriente de aire." }, { travel: "high_street" }, { describe: "$here" }] },

  // La archivera: el último lunes, por algo que perdiste en el tuyo.
  { id: "give_umbrella", match: { verb: ["give", "show"], obj: "umbrella", obj2: "archivist" }, if: [holding("umbrella")],
    do: [{ say: "La archivera da la vuelta al paraguas y lee la etiqueta. Lo abre un poco, y unas gotas de la lluvia de un lunes caen sobre su mesa. «Sí», dice. Saca una hoja de un cajón y te la da. «Devuélvela al lugar de donde salió.»" },
         { move: "umbrella", to: null }, { move: "monday_page", to: "player" }, tension(-10)] },
  { id: "give_other_archivist", match: { verb: ["give", "show"], obj2: "archivist" }, do: [{ say: "«Eso no es de un lunes», dice, amable, y te lo devuelve." }] },

  // Devolver el lunes a su sitio.
  { id: "restore_monday", match: { verb: ["put", "use", "attach", "stick"], obj: "monday_page", obj2: [null, "calendar"] }, if: [at("station_hall"), holding("monday_page")],
    do: [{ change: "monday_ending" }] },
  { id: "restore_monday_glue", match: { verb: "attack", obj: "monday_page", obj2: "calendar" }, if: [at("station_hall"), holding("monday_page")],   // «pega la hoja en el calendario»
    do: [{ change: "monday_ending" }] },
  { id: "restore_monday_use", match: { verb: "use", obj: "calendar", obj2: "monday_page" }, if: [at("station_hall"), holding("monday_page")],   // (USAR, en cualquier orden)
    do: [{ change: "monday_ending" }] },
  { id: "restore_elsewhere", match: { verb: ["put", "use", "attach", "stick"], obj: "monday_page" }, if: [holding("monday_page")],
    do: [{ say: "Quiere volver al sitio de donde la arrancaron: el calendario bajo el reloj de la estación." }] },

  // El hotel: una habitación para quien la pide; dormir hasta la mañana.
  { id: "ask_room", match: { verb: "ask", obj: "porter", topic: "room" }, if: [{ "room_key.at": null }],
    do: [{ say: "«La cuatro», dice, y deja una llave sobre el mostrador sin levantar la vista. «El desayuno es los martes.»" }, { move: "room_key", to: "player" }] },
  { id: "order_room", match: { verb: "order", obj: ["room_key", "porter"] }, if: [at("hotel"), { "room_key.at": null }],
    do: [{ say: "«La cuatro», dice, y deja una llave sobre el mostrador sin levantar la vista. «El desayuno es los martes.»" }, { move: "room_key", to: "player" }] },
  { id: "sleep", match: { verb: ["sleep", "lie"], obj: [null, "bed"] }, if: [at("hotel_room"), { "bed.slept": { "!=": "$time.day" } }],
    do: [{ say: "Te tumbas. La cama te recibe como si te hubiera estado esperando. Pasan trenes que no oyes. Cuando despiertas es de mañana, y la habitación huele a la tostada de otro." }, { time: "next 07:30" }, tension(-15), { set: "bed.slept", to: "$time.day" }] },
  { id: "sleep_again", match: { verb: ["sleep", "lie"], obj: [null, "bed"] }, if: [at("hotel_room")],
    do: [{ say: "No tienes sueño. En esa cama ya se ha dormido hoy, y has sido tú." }] },
  { id: "sleep_elsewhere", match: { verb: "sleep" }, do: [{ say: "Aquí no. Hay un hotel en la plaza." }] },

  // El fotomatón: la fotografía de mañana, una vez.
  { id: "photo", match: { verb: ["push", "use"], obj: ["button", "booth"], obj2: [null] }, if: [{ "player.in": "booth" }, { "photograph.at": null }],
    do: [{ say: "El flash se dispara cuatro veces. Esperas. Una tira cae en la ranura de fuera, y vas a buscarla, todavía mojada." }, { move: "photograph", to: "player" }, tension(-5)] },
  { id: "photo_again", match: { verb: ["push", "use"], obj: ["button", "booth"], obj2: [null] }, if: [{ "player.in": "booth" }],
    do: [{ say: "El fotomatón zumba y no devuelve nada. NO SE ADMITEN DEVOLUCIONES, dice el cartel. El mañana solo ocurre una vez." }] },
  { id: "photo_outside", match: { verb: "push", obj: "button" }, if: [{ "player.in": { "!=": "booth" } }],
    do: [{ say: "El botón está dentro. Primero tienes que sentarte en el fotomatón." }] },

  // El reloj del revés: el ayer, cuando ya hay uno.
  // (No hasta antes de que llegaras: un día atrás desde el día 2 solo pasadas las siete y media de esta tarde.)
  { id: "wind_back", match: { verb: ["wind", "turn", "use"], obj: "backwards_clock", obj2: [null] }, if: [{ "time.day": { ">=": 3 } }], do: [{ change: "yesterday" }] },
  { id: "wind_back_2", match: { verb: ["wind", "turn", "use"], obj: "backwards_clock", obj2: [null] }, if: [{ "time.day": 2 }, { "time.hour": { ">=": 20 } }], do: [{ change: "yesterday" }] },
  { id: "wind_back_first", match: { verb: ["wind", "turn", "use"], obj: "backwards_clock" },
    do: [{ say: "La llave gira y se detiene. «Todavía no», dice el relojero. «Aquí aún no hay ayer. Al menos, no uno en el que estuvieras.»" }] },

  // Tensión: cuanto más te quedas, más cuesta irse; primero el aviso, luego la puerta se cierra.
  { id: "creep_0", when: "every", every: { seconds: [100, 140] }, if: [{ "game.tension": 0 }],
    do: [{ say: "En algún sitio un reloj da la hora. Cuentas las campanadas y te pierdes." }, { unsettle: 1 }] },
  { id: "creep_1", when: "every", every: { seconds: [100, 140] }, if: [{ "game.tension": 1 }],
    do: [{ say: "Se te ocurre que no recuerdas bien qué día fue ayer." }, { unsettle: 1 }] },
  { id: "creep_2", when: "every", every: { seconds: [100, 140] }, if: [{ "game.tension": 2 }],
    do: [{ say: "En algún lugar a tus espaldas, [way] suelta el aire, largo y lento, como si se preparase para detenerse." }, { unsettle: 1 }] },
  { id: "creep_3", when: "every", every: { seconds: [100, 140] }, if: [{ "game.tension": 3 }],
    do: [{ say: "Piensas en [way], por donde viniste. No sabes si aún podrías encontrarla. Un café, un sueño, cualquier cosa que detenga la espera, quizá ayude." }, { set: "game.wayLastWarned", to: true }, { unsettle: 1 }] },
  { id: "creep_4", when: "every", every: { seconds: [100, 140] }, if: [{ "game.tension": 4 }],
    do: [{ say: "La espera se te ha metido en los zapatos, y los zapatos ya no quieren ir a ninguna parte." }, { set: "game.wayLastWarned", to: true }, { unsettle: 1 }] },
  { id: "tension_end", when: "every", every: { seconds: [5, 5] }, if: [{ "game.tension": { ">=": 5 } }, { "game.wayLastWarned": true }],
    do: [{ change: "sunday_ending" }] }
];

// ---- Enigmas (para el verificador; GUIDE.md §3) -----------------------------------------------------------------------------
// Las órdenes son las que un jugador escribiría en español.
const puzzles = {
  get_coin: { where: "square", needs: [], solve: ["esperar hasta que se enciendan las farolas", "coger moneda"], gives: ["coin"], clues: ["oduya", "booking_clerk", "ines", "fountain"], hints: ["Las monedas antiguas están en la fuente, pero el agua solo las enseña cuando se enciende su lámpara, a las ocho.", "Espera junto a la fuente hasta que se enciendan las farolas, y coge una moneda."] },
  get_ticket: { where: "station_hall", needs: ["coin"], solve: ["esperar a que abra la ventanilla", "comprar billete"], gives: ["ticket"], clues: ["window", "timetable"], hints: ["La ventanilla de billetes abre a las nueve de la noche, y quiere una moneda antigua.", "Espera en el vestíbulo a que abra la ventanilla y compra un billete."] },
  board_train: { where: "platform", needs: ["get_ticket"], solve: ["esperar al tren", "subir al tren"], reaches: "compartment", clues: ["board", "signalman", "timetable"], hints: ["El tren del martes llega a las once y media. El revisor quiere un billete.", "Espera en el andén al tren y sube a él."] },
  leave_tuesday: { where: "compartment", needs: ["board_train"], solve: ["esperar a que salga el tren"], ending: true, clues: ["guard", "timetable"], hints: ["Sale a las doce menos veinte. Solo tienes que estar en él.", "Siéntate en el compartimento y espera a que salga el tren."] },
  claim_umbrella: { where: "lost_property", needs: [], solve: ["preguntar al señor Ambrose por el paraguas"], gives: ["umbrella"], clues: ["ledger", "ambrose"], hints: ["El libro de objetos perdidos tiene algo dejado un lunes, con tu letra.", "Pregunta al señor Ambrose por el paraguas."] },
  open_hall: { where: "high_street", needs: [], solve: ["esperar hasta que abra el ayuntamiento", "oeste"], reaches: "town_hall", clues: ["plate", "ines", "oduya"], hints: ["El ayuntamiento tiene horario de oficina: de nueve a cinco.", "Espera en la calle Mayor a que abra el ayuntamiento y entra."] },
  get_monday: { where: "archive", needs: ["umbrella", "open_hall"], solve: ["dar paraguas a archivera"], gives: ["monday_page"], clues: ["archivist", "gravestones", "photograph", "decree"], hints: ["La archivera guarda el último lunes para quien perdió algo en uno.", "Dale tu paraguas a la archivera."] },
  restore_monday: { where: "station_hall", needs: ["monday_page"], solve: ["poner lunes en calendario"], ending: true, clues: ["calendar", "clockmaker", "pond_water", "photograph"],
                    hints: ["Al calendario bajo el reloj de la estación le falta una hoja entre el domingo y el martes.", "Pon el lunes en el calendario del vestíbulo."] }
};

// ---- El conjunto de cambios ---------------------------------------------------------------------------------------------------
// ---- La apertura, declarada (BRIEF.md §3): las ids de su sala y de sus cuatro cosas, y las líneas que dice ---------------------
const opening = {
  room: "halt", restart: "alarm", hints: "tin", intro: "diary_leaf", way: "carriage_door",
  lines: {
    notYet: "El vagón se aparta de tu pie, con cortesía, un palmo. Se ruega a los pasajeros que traigan algo con que empezar de nuevo y algo que escuchar.",
    notYetRestart: "El vagón se aparta de tu pie, un palmo. No tienes con qué empezar de nuevo, y hay un despertador en el banco.",
    notYetHints: "El vagón se aparta de tu pie, un palmo. No tienes nada que escuchar, y hay una lata en el banco.",
    through: "Subes, y la puerta se cierra tras de ti con un ruidito, como un billete al picarse, y la farola del andén se apaga. Cuando vuelve a abrirse estás entre estanterías.",
    askRestart: "¿Das cuerda al despertador hasta el principio del día y empiezas de nuevo?",
    restartYes: "Das cuerda hasta que ya no gira más. El andén corre hacia atrás bajo tus pies, la farola, el banco, la tarde, y…",
    restartNo: "Sueltas la llave. El despertador sigue su marcha, y todavía es mañana.",
    hintFrame: "Te acercas la lata al oído. Por el cordel, alguien con la paciencia de un jefe de estación dice:",
    farewell: "Alzas la página hacia la farola. La semana se deshace por sus líneas, y desaparece, el domingo primero."
  }
};

export default {
  because: "Tras la apertura: un pueblo sin lunes.",
  opening,
  // Las propiedades que guardan las reglas de este mundo (ARCHITECTURE.md §3, «Fields and properties»); las del motor no se declaran.
  properties: {
    "bed.slept": { type: "number" },    // el día en que se durmió por última vez en la cama
    "coffee.day": { type: "number" },   // el día en que se sirvió por última vez el café
    "game.wayLastWarned": { type: "boolean", start: false }   // el último aviso sobre el camino por el que viniste: el final espera a que se dé
  },
  facts: [
    "El jugador llega un domingo por la tarde a un pueblo que abolió los lunes.",
    "Un tren sale para el martes a las 23:40 todas las noches; nadie vuelve.",
    "El último lunes lo guarda la archivera del ayuntamiento, para quien perdió uno."
  ],
  effects: [
    { time: "day 1 19:00", weekday: "sun" },                  // la apertura se juega a las siete
    // Adónde lleva el camino de la apertura, y qué hace llegar: la hora del pueblo y su primera línea.
    { set: "game.entrance", to: "lost_property" },
    { add: "change", id: "arrival", effects: [
      { time: "day 1 19:30", weekday: "sun" },
      { say: "En algún sitio un reloj da las siete y media, de la tarde, un domingo." }
    ] },
    { set: "game.moods", to: [
      { below: 1, text: "bastante a gusto" }, { below: 2, text: "con ganas de moverte" }, { below: 3, text: "esperando" },
      { below: 4, text: "con retraso" }, { below: 6, text: "en la última llamada" }
    ] },
    // Verbos que este mundo necesita
    { add: "word", verb: "buy", words: ["comprar", "compra", "compre", "compro", "adquirir", "adquiere", "pagar", "paga", "pague", "pago", "sacar billete", "saca billete", "saque billete", "saco billete", "sacar billetes", "sacar un billete", "saca un billete", "saque un billete", "saco un billete", "sacar el billete", "saca el billete"], absent: true },
    { add: "word", verb: "board", words: ["abordar", "aborda", "aborde", "abordo", "embarcarse", "embarcate"] },
    { add: "word", verb: "wind", words: ["rebobinar", "rebobina", "rebobine", "retroceder", "retrocede", "retroceda", "atrasar", "atrasa", "atrase"] },
    { add: "word", verb: "order", words: ["pedir", "pide", "pida", "pido", "encargar", "encarga"], absent: true },
    { add: "word", verb: "attach", words: ["adherir", "adhiere", "adhiera", "encolar", "encola", "reponer", "repon", "repone", "reponga", "devolver", "devuelve", "devuelva", "restituir", "restituye"] },
    { add: "word", verb: "stick", words: ["fijar", "fija", "fije", "enganchar", "engancha"] },

    ...Object.entries(puzzles).map(([id, p]) => ({ add: "puzzle", id, ...p })),
    ...Object.entries(changes).map(([id, effects]) => ({ add: "change", id, effects })),
    ...Object.entries(endingPictures).map(([id, p]) => ({ add: "picture", id, ...p })),
    ...Object.entries(rooms).map(([id, r]) => ({ add: "room", id, ...r, picture: pictures[id] })),
    ...Object.entries(objects).map(([id, o]) => ({ add: "object", id, ...o })),
    { add: "object", id: "ticket", at: null, portable: true, name: "Billete", note: "Martes. Solo ida.", actions: ["Examinar billete"],
      words: { nouns: ["billete", "tarjeta", "boleto"], adj: ["tren", "martes", "cartón", "carton"], g: "m" }, ...item("ticket"),
      examine: "Un billete de cartón rígido: MARTES, SOLO IDA. Picado dos veces. En el reverso: NO VÁLIDO PARA VUELTA, PORQUE NO LA HAY." },
    ...rules.map((rule) => ({ add: "rule", rule }))
  ]
};
