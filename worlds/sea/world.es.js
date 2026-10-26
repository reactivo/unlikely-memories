// El mundo de muestra en español: lo que viene después del Pasillo 7-B, escrito (no traducido) como lo escribiría la IA
// (WRITING-DIRECTION.md para la voz, ARCHITECTURE.md §3–6 para los datos, ART-DIRECTION.md para los dibujos).
// Es un único conjunto de cambios: los efectos que convierten el pasillo de apertura en el juego entero, aplicados todos o
// ninguno por las comprobaciones del motor (js/engine.js applyChangeSet). Los textos son literales (un juego se escribe en
// un solo idioma, ARCHITECTURE.md §8); los ids y las listas de dibujo no se enseñan al jugador.
//
// Los ids, la estructura, las reglas, los tiempos y los dibujos son los de world.en.js; solo cambia lo que lleva lengua:
// los textos, las palabras para el intérprete (con su género) y las órdenes que resuelven los puzles.

import pictures, { endings } from "./pictures.js";
import sprites from "./sprites.js";

// ---- La biblia del juego (lo que escribiría el autor; aquí escrita para que case con el pasillo) -------------------
// Se guarda con el mundo para que el director pueda leerla después; el motor todavía no la usa.
export const bible = {
  title: "El mar es un rumor",
  blurb: "Tras una puertecita verde que respira, un pueblo de costa en un domingo que no termina, donde la vida que no viviste ha guardado tu abrigo.",
  thumbnail: { picture: "pier_end", x: 40 },   // la tarjeta de la página de inicio: el dibujo de esta sala, recortado a 225 píxeles desde la columna x (0–95)
  synopsis: "Alguien que trabaja en una oficina del Ministerio de la Felicidad Suficiente encuentra una puertecita verde que " +
    "respira. Detrás, un pueblo de costa en un domingo que no termina, donde espera la vida que no vivió: una " +
    "habitación de hotel con su abrigo, una carta con su letra, una caseta de baño con su número. Al otro lado del agua, " +
    "un faro apagado solo quema lo que alguien acepta olvidar.",
  tone: "WRITING-DIRECTION.md: lo cotidiano, ligeramente torcido; sereno, conciso, con ecos de lo que pudo ser.",
  opening: "Pasillo 7-B del Ministerio, una mañana de lunes: un sello de goma (para empezar de nuevo), un buzón de " +
    "sugerencias (las pistas), un memorando que ya llevas encima (por qué has venido). La puertecita verde que respira " +
    "es el camino.",
  rules: [
    "Una vez entregado, tu nombre se queda con la puerta. Nadie aquí puede devolvértelo.",
    "Siempre son las cinco y cuarto de un domingo. A nadie del pueblo le parece raro.",
    "El mar devuelve las cosas, despacio.",
    "La lámpara del faro solo quema lo que aceptes olvidar."
  ],
  endings: [
    "Quemar la fotografía: olvidar la vida que pudo ser; despertar en tu mesa, planta menos cuatro, conforme.",
    "Quemar la caracola: que el Ministerio te olvide; la puerta se cierra, los relojes echan a andar, llega el lunes.",
    "Quedarte demasiado: la puerta se cierra sola. Si estás en el pasillo cuando ocurre, ahí te quedas.",
    "Ahogarte: el mar te lleva, y te devuelve, a su tiempo."
  ],
  chaos: 0.3
};

// ---- Pequeños ayudantes para las condiciones (se leen como las palabras de las propias reglas) ----------------------
const at = (room) => ({ "player.at": room });
const holding = (id) => ({ [id + ".at"]: "player" });
const notAsking = { "$topic": null };                 // sin preguntar por nada (entonces contestan sus temas)
const tension = (n) => ({ set: "game.tension", add: n });

// Cada objeto que se puede llevar trae su sprite (16 × 16, números de la paleta en hexadecimal) y, si puede quedar en un
// dibujo, una versión pequeña para el suelo (content/sample.sprites.js).
const item = (id) => ({ img: id, sprite: sprites[id], ...(sprites[id + "_floor"] ? { floorSprite: sprites[id + "_floor"] } : {}) });

// Lo que lleva lengua en pictures.js (las descripciones para lectores de pantalla) se escribe aquí, sin tocar ese archivo:
// las cuatro imágenes de los finales y lo que dice cada objeto dibujado sobre una sala.
const endingAlt = {
  photograph: "Una oficina vista desde muy arriba: filas de mesas grises idénticas entre tabiques grises, y en una de ellas una figura diminuta, sentada, muy quieta.",
  shell: "A lo lejos, sobre el agua negra de la noche, un faro en su roca lanza un ancho barrido de luz amarilla sobre el mar y el pueblo. En la playa oscura, cerca de la izquierda, donde había una puerta, solo hay un trozo de madera de deriva.",
  drowned: "Visto desde debajo del agua, mirando hacia arriba: una luna pálida y quebrada en la superficie, muy lejos, y largos haces de luz que bajan hacia la oscuridad, donde flotan despacio un zapatito rojo y un guante gris.",
  died: "Una mano, muy cerca de la cámara, yace abierta sobre la arena mojada, en el borde de la marea, alargada hacia el mar. Más allá, una franja delgada de agua gris bajo un cielo pálido de amanecer."
};
const overlayAlt = {
  "corridor:stamp": "Un sello de goma yace en el linóleo, junto al charco.",
  "corridor:suggestion_box": "Un pequeño buzón de sugerencias de madera cuelga de la pared, bajo el cartel.",
  "tideline:shell": "Una caracola pálida yace cerca de la hoja.",
  "pier_end:boat": "Una pequeña barca azul está atada al poste.",
  "room11:letter": "Una carta yace sobre la almohada.",
  "cafe:coffee": "Una taza de café humea sobre la mesa.",
  "lighthouse_base:boat": "La barca está atada a la argolla de amarre."
};
const localized = (id) => {
  const p = pictures[id];
  return p.overlays ? { ...p, overlays: p.overlays.map(o => ({ ...o, alt: overlayAlt[id + ":" + o.object] ?? o.alt })) } : p;
};

// Textos de sala que los cambios ponen y quitan (la playa y la linterna). Un cambio reescribe todo el texto de una sala; cuando
// dos cambios pueden tocar la misma sala, el posterior tiene en cuenta al anterior (GUIDE.md §6): encender la lámpara
// cuando la puerta ya es madera de deriva usa los textos con los dos.
const sand = "La línea de la marea sigue hacia el oeste. Al este, rocas negras y la boca de una cueva. Al sur, las dunas.";
const doorStands = "Una playa de noche. La arena aún está tibia, como si el sol acabara de irse. La {puerta verde|beach_door} se alza sola, sin nada que la sujete, respirando.";
const doorGone = "Una playa de noche. La arena aún está tibia, como si el sol acabara de irse. Donde estaba la puerta verde hay un trozo de {madera de deriva|beach_door} clavado en la arena, del tamaño de una puertecita.";
const seaDark = "El mar está en calma y es muy grande. Un muelle de madera echa a andar hacia el norte. A lo lejos, sobre una roca, un {faro|lighthouse_far} a oscuras.";
const seaLit = "El mar está en calma y es muy grande. Un muelle de madera echa a andar hacia el norte. A lo lejos, sobre su roca, el {faro|lighthouse_far} está encendido y su haz da vueltas despacio sobre el agua.";
const lampCold = "Cristal por los cuatro costados y, tras el cristal, el mar por los cuatro costados. En el centro se yergue la {lámpara|lamp}, con su gran lente fría.";
const lampLit = "Cristal por los cuatro costados y, tras el cristal, el mar por los cuatro costados. En el centro, la {lámpara|lamp} arde tras su gran lente y la luz sale por encima del agua.";
const farDoor = "A lo lejos, la playa. La puerta verde es un cuadradito de luz en la arena.";
const farSand = "A lo lejos, la playa. Donde estaba la puerta no hay más que arena oscura.";
const down = "La escalera baja.";

// ---- Salas --------------------------------------------------------------------------------------------------------
// area + at: dónde está (js/space.js). Costa: x crece hacia el este, y hacia el sur (el mar queda al norte). El faro es un
// área aparte, a la que solo se llega en barca. exits: un id de sala; true = hay camino, pero lo contesta una regla; false = ninguno.

const rooms = {
  // La apertura (GUIDE.md §8): el pasillo del Ministerio, al que no se vuelve. El área "ministry" es suya.
  corridor: {
    name: "PASILLO 7-B", area: "ministry", at: [0, 0, -4],
    describe: [
      "Ministerio de la Felicidad Suficiente, planta menos cuatro. Paredes grises, linóleo gris, luz gris, como cada mañana desde hace once años. Un {altavoz|loudspeaker} murmura que estás conforme.",
      "Hoy una {puerta verde|green_door} diminuta respira bajito en la pared, con un charco y una raya de luz amarilla por debajo. El ojo del {cartel|poster} te vigila; una {cámara|camera} gira para mirar a otra parte."
    ],
    exits: { e: true },
    scenery: [
      { words: ["pasillo", "pared", "paredes", "techo", "lampara", "lamparas", "luz", "luces", "linoleo", "lino", "suelo"], name: "el pasillo", says: "Linóleo gris, paredes grises, lámparas encendidas en 1987 sin pedirles opinión." },
      { words: ["placa", "letrero", "letras"], name: "la placa", says: "Grabado en letras de otro tiempo: «Llama solo si recuerdas tu nombre»." },
      { words: ["charco", "agua"], name: "el charco", says: "Agua tibia, de ninguna parte. Huele a un lugar donde nunca has estado y que, sin embargo, recuerdas." }
    ],
    mentions: ["altavoz", "cartel", "cámara", "puerta verde"],
    ambience: { lines: [
      "El {altavoz} carraspea. «La satisfacción en la planta menos cuatro se mantiene dentro de lo previsto».",
      "«Recordatorio», murmura el {altavoz}. «Las puertas que ayer no estaban hoy tampoco están».",
      "El {altavoz} tararea unos compases del himno del Ministerio y se lo piensa mejor.",
      "«Estás conforme», murmura el {altavoz}. «Se ruega seguir así hasta nuevo aviso».",
      "«Aviso del Ministerio: cualquier otro lugar es un rumor».",
      "En algún punto del techo, el {altavoz} crepita. «El almuerzo será suficiente»."], every: [40, 90] },
    alt: "Un largo pasillo gris iluminado por lámparas de techo. Un cartel con un ojo rojo cuelga de la pared izquierda; una cámara en la pared derecha mira hacia otro lado. En la parte baja de la pared derecha, una diminuta puerta verde deja escapar luz amarilla y agua sobre el suelo."
  },
  beach: {
    name: "LA PLAYA", area: "coast", at: [0, 0, 0],
    describe: [
      doorStands, seaDark, sand
    ],
    exits: { n: "pier", w: "tideline", e: { to: "cave", in: true }, s: "dunes" },
    ambience: { lines: ["Una gaviota grita una vez y nadie le contesta.", "Una ola sube por la arena más que las otras, toca la puerta y se retira.", "La puerta inspira. En algún lugar muy lejano, un altavoz carraspea."],
                if: [{ "beach_door.shut": { "!=": true } }] },
    alt: "Una playa de noche bajo la luna llena. Una pequeña puerta verde se alza en la arena, con luz que se escapa por sus bordes. A la izquierda, un muelle se adentra en el mar; a lo lejos, un faro apagado sobre una roca. A la derecha, rocas negras y la boca de una cueva.",
    scenery: [
      { words: ["arena", "playa"], name: "la arena" }, { words: ["mar", "agua", "olas", "ola", "oceano"], name: "el mar" },
      { words: ["luna", "cielo", "estrellas"], name: "el cielo" }, { words: ["muelle", "embarcadero"], name: "el muelle" },
      { words: ["rocas", "roca", "cueva", "boca"], name: "las rocas", leads: "e" }, { words: ["dunas", "duna"], name: "las dunas" }
    ]
  },
  tideline: {
    name: "LA LÍNEA DE LA MAREA", area: "coast", at: [-1, 0, 0],
    describe: [
      "La marea ha dejado una raya a lo largo de la arena: algas, un {guante|glove}, un {zapato|shoe} de niño, una {hoja|page} escrita a máquina que se va reblandeciendo. Todo lo que el mar devuelve, lo devuelve despacio.",
      "La playa sigue hacia el este. Al sur, las casetas de baño."
    ],
    exits: { e: "beach", s: "huts" },
    alt: "Arena mojada vista desde arriba. Una línea de algas la cruza, con un guante gris, un zapato rojo pequeño y una hoja mecanografiada empapada.",
    scenery: [
      { words: ["algas", "alga", "linea", "marea"], name: "las algas" }, { words: ["arena", "playa"], name: "la arena" },
      { words: ["mar", "agua", "espuma", "olas"], name: "el mar" }, { words: ["casetas", "caseta"], name: "las casetas" }
    ]
  },
  cave: {
    name: "LA CUEVA", area: "coast", at: [1, 0, 0],
    describe: [
      "La cueva es baja y huele a sal y a monedas viejas. En algún lugar que no ves gotea el agua.",
      "Di cualquier cosa y la cueva te la devuelve, un momento tarde y con otra voz.",
      "Se sale por el oeste, hacia la playa."
    ],
    exits: { w: { to: "beach", out: true } },
    listen: "Gotas. El mar, fuera. Y debajo de todo, muy débil, el sonido de alguien que contiene la respiración.",
    alt: "El interior de una cueva oscura, mirando hacia fuera por su boca: la luna sobre el mar. Un charco en el suelo de la cueva atrapa la luz.",
    scenery: [
      { words: ["roca", "rocas", "paredes", "techo", "sal", "monedas"], name: "la roca" }, { words: ["agua", "gotas", "gota", "charco"], name: "el agua" },
      { words: ["eco", "voz"], name: "el eco" }, { words: ["mar", "luna"], name: "la vista" },
      { words: ["cueva", "boca", "entrada"], name: "la cueva", leads: "w" }
    ]
  },
  pier: {
    name: "EL MUELLE", area: "coast", at: [0, -1, 0],
    describe: [
      "Tablones viejos, grises de sal, con huecos tan anchos que se ve el mar respirando debajo. El muelle sigue hacia el norte, en la oscuridad.",
      "Un {salvavidas|lifebuoy} cuelga de un poste. Alguien pintó en él un nombre y luego lo tapó con pintura.",
      "Al sur, la playa."
    ],
    exits: { s: "beach", n: "pier_end" },
    alt: "Un muelle de madera que se aleja de ti hacia el mar nocturno, con barandas de cuerda y un salvavidas rojo y blanco en el poste más cercano.",
    scenery: [
      { words: ["tablones", "tablon", "tablas", "muelle", "huecos"], name: "los tablones" }, { words: ["mar", "agua"], name: "el mar" },
      { words: ["poste", "postes", "cuerda", "cuerdas", "baranda", "barandas"], name: "los postes" }, { words: ["faro"], name: "el faro" }
    ]
  },
  pier_end: {
    name: "EL EXTREMO DEL MUELLE", area: "coast", at: [0, -2, 0],
    describe: [
      "El muelle se acaba aquí, como si se hubiera arrepentido. El último poste tiene una argolla de hierro para amarrar.",
      "Al otro lado del agua negra, el {faro|lighthouse_near} se alza sobre su roca. Demasiado lejos para ir a nado. No tanto para ir a remo.",
      "El muelle vuelve hacia el sur."
    ],
    exits: { s: "pier", n: true },
    alt: "El final de un muelle de noche. Al otro lado del agua, un faro blanco con una franja roja se alza sobre una roca, con la linterna apagada.",
    scenery: [
      { words: ["poste", "argolla", "anilla", "muelle", "tablones"], name: "el poste" }, { words: ["mar", "agua"], name: "el mar" },
      { words: ["roca"], name: "la roca" }
    ]
  },
  huts: {
    name: "LAS CASETAS DE BAÑO", area: "coast", at: [-1, 1, 0],
    describe: [
      "Una hilera de casetas de baño mira al mar, rayadas, numeradas, cerradas hasta la próxima temporada. La pintura se ha desteñido en todas menos en una: la {caseta 7|hut}, recién pintada, como si esperaran a alguien.",
      "La línea de la marea queda al norte. Las dunas, al este."
    ],
    exits: { n: "tideline", e: "dunes" },
    alt: "Una hilera de seis casetas de baño rayadas, de noche. Cinco están desteñidas y grises; una, en el centro, está recién pintada de blanco y azul, con tejado rojo y un candado en la puerta.",
    scenery: [
      { words: ["casetas", "hilera", "pintura", "rayas"], name: "las casetas" }, { words: ["arena", "playa"], name: "la arena" },
      { words: ["bandera"], name: "la bandera" }, { words: ["dunas", "mar"], name: "la vista" }
    ]
  },
  dunes: {
    name: "LAS DUNAS", area: "coast", at: [0, 1, 0],
    describe: [
      "Un sendero de tablas serpentea entre las dunas. La hierba se mueve un poco, aunque no hay viento.",
      "En algún sitio suena una {radio} con una canción que terminó hace años y sigue terminando.",
      "Al norte, la playa. Al sur, las luces del paseo marítimo. Al oeste, las casetas de baño."
    ],
    exits: { n: "beach", s: "promenade", w: "huts" },
    alt: "Un camino de tablas entre dunas oscuras coronadas de barrón, hacia el débil resplandor de un pueblo.",
    scenery: [
      { words: ["dunas", "duna", "arena"], name: "las dunas" }, { words: ["hierba", "barron", "pasto"], name: "la hierba" },
      { words: ["sendero", "camino", "tablas"], name: "el sendero" }, { words: ["luces", "paseo", "pueblo"], name: "las luces" }
    ]
  },
  promenade: {
    name: "EL PASEO MARÍTIMO", area: "coast", at: [0, 2, 0],
    describe: [
      "Barandillas blancas y farolas encendidas que no dan luz. Todo el mundo ha entrado a merendar.",
      "Al oeste, el hotel Miramar tiene la puerta abierta. Al este, un tiovivo gira sin nadie encima. La plaza queda al sur; las dunas, al norte."
    ],
    exits: { n: "dunes", s: "square", w: { to: "lobby", in: true }, e: "carousel" },
    alt: "Un paseo marítimo de noche: barandillas blancas delante, tres farolas encendidas, un hotel alto a la izquierda con una ventana iluminada y la puerta abierta, un tiovivo a rayas a la derecha.",
    scenery: [
      { words: ["barandillas", "barandilla", "baranda"], name: "las barandillas" }, { words: ["farolas", "farola", "luces", "luz", "lamparas"], name: "las farolas" },
      { words: ["hotel", "miramar", "puerta"], name: "el hotel", leads: "w" }, { words: ["tiovivo", "carrusel", "caballitos"], name: "el tiovivo" },
      { words: ["plaza"], name: "la plaza" }
    ]
  },
  carousel: {
    name: "EL TIOVIVO", area: "coast", at: [1, 2, 0],
    describe: [
      "El tiovivo gira sin nadie encima, al compás de una cajita de música tocada un poco demasiado despacio. Los caballitos suben y bajan.",
      "Uno de ellos, un {caballito gris|horse}, lleva un número pintado en la silla: 7-B.",
      "El paseo marítimo queda al oeste."
    ],
    exits: { w: "promenade" },
    alt: "Primer plano de un tiovivo bajo un toldo rojo y blanco rodeado de bombillas. Delante, un caballito gris con la silla roja; más allá, uno blanco y uno marrón.",
    scenery: [
      { words: ["tiovivo", "carrusel", "toldo", "bombillas", "musica", "melodia", "barra"], name: "el tiovivo" },
      { words: ["caballos", "caballitos"], name: "los otros caballitos" }
    ]
  },
  lobby: {
    name: "HOTEL MIRAMAR", area: "coast", at: [-1, 2, 0],
    describe: [
      "Palmeras en macetones de latón y una alfombra gastada en forma de senderos. Tras el mostrador, el {tablero de llaves|keyboard} tiene un gancho vacío. Una {campanilla|bell} espera sobre el mostrador.",
      "Por las puertas dobles del oeste llega un tintineo de cubiertos. Una escalera sube. El paseo marítimo queda al este."
    ],
    exits: { e: { to: "promenade", out: true }, w: "dining", u: "hallway" },
    alt: "Un vestíbulo de hotel: un mostrador de recepción con una campanilla de latón, un tablero de llaves detrás, palmeras en macetas, puertas dobles luminosas a la izquierda y una escalera con alfombra roja a la derecha.",
    scenery: [
      { words: ["palmeras", "palmera", "macetones", "macetas", "maceta"], name: "las palmeras" }, { words: ["alfombra", "senderos", "suelo"], name: "la alfombra" },
      { words: ["mostrador", "recepcion"], name: "el mostrador" }, { words: ["escalera", "escaleras", "peldanos", "escalones"], name: "la escalera", leads: "u" },
      { words: ["puertas", "cubiertos"], name: "las puertas" }
    ]
  },
  dining: {
    name: "EL COMEDOR", area: "coast", at: [-2, 2, 0],
    describe: [
      "Una mesa larga, un mantel blanco, los restos de un postre. Doce {comensales|guests} de etiqueta se sientan alrededor, hablando en voz baja. Llevan mucho tiempo en el postre. A nadie se le ha ocurrido levantarse.",
      "En la cabecera más cercana hay una {silla|chair} vacía y, en el plato de delante, una {tarjeta|card}.",
      "El vestíbulo queda al este."
    ],
    exits: { e: "lobby" },
    ambience: { lines: ["Alguien propone un brindis. Todos levantan la copa. Nadie bebe.", "Un comensal se ríe de un chiste que se contó antes de que llegaras.", "La sal vuelve a dar la vuelta a la mesa."], every: [30, 70], chance: 0.8 },
    alt: "Una mesa larga de comedor en perspectiva, mantel blanco y velas, comensales de etiqueta a ambos lados bajo una araña. Una silla vacía en el extremo más cercano, con una tarjeta sobre el plato.",
    scenery: [
      { words: ["mesa", "mantel", "velas", "vela", "arana"], name: "la mesa" },
      { words: ["postre", "platos", "plato", "merengue"], name: "el postre" }, { words: ["ventana"], name: "la ventana" },
      { words: ["traje", "trajes", "etiqueta", "vestidos"], name: "los trajes de etiqueta" }
    ]
  },
  hallway: {
    name: "PRIMER PISO", area: "coast", at: [-1, 2, 1],
    describe: [
      "Un pasillo de puertas numeradas. La alfombra se traga tus pasos. Se parece mucho a otro pasillo que conoces, y no se le parece en nada.",
      "La {puerta 11|door11} está entornada, con la llave todavía en la cerradura. La escalera baja."
    ],
    exits: { d: "lobby", w: { to: "room11", in: true } },
    alt: "Un cálido pasillo de hotel en perspectiva, paredes marrones y alfombra roja, puertas a ambos lados. La puerta más cercana de la izquierda está entornada, con luz en el borde.",
    scenery: [
      { words: ["puertas", "pasillo"], name: "las puertas" }, { words: ["alfombra", "suelo"], name: "la alfombra" },
      { words: ["escalera", "escaleras"], name: "la escalera", leads: "d" }, { words: ["ventana"], name: "la ventana" }, { words: ["lamparas", "apliques"], name: "las lámparas" }
    ]
  },
  room11: {
    name: "HABITACIÓN 11", area: "coast", at: [-2, 2, 1],
    describe: [
      "Una habitación pequeña con una {ventana|window} al mar. La cama está hecha. Sobre la silla, un {abrigo|coat} de tu talla y de tu color, aunque nunca has tenido un abrigo así.",
      "La puerta está al este."
    ],
    exits: { e: { to: "hallway", out: true } },
    alt: "Una pequeña habitación de hotel de noche: una ventana al mar oscuro entre cortinas rojas, un abrigo azul sobre una silla, una cama hecha con una almohada blanca.",
    scenery: [
      { words: ["cama", "almohada", "colcha", "sabanas"], name: "la cama" }, { words: ["silla"], name: "la silla" },
      { words: ["cortinas", "cortina"], name: "las cortinas" }, { words: ["puerta", "habitacion"], name: "la puerta", leads: "e" },
      { words: ["mar", "agua"], name: "el mar" }
    ]
  },
  square: {
    name: "LA PLAZA", area: "coast", at: [0, 3, 0],
    describe: [
      "Tiendas cerradas alrededor de una fuente sin agua. El {reloj|clock} del ayuntamiento marca las cinco y cuarto. Es domingo. Lleva un tiempo siendo domingo.",
      "Las palomas pasean con las manos a la espalda.",
      "Correos está al oeste. Al este, un café iluminado. La estación queda al sur; el paseo marítimo, al norte."
    ],
    exits: { n: "promenade", w: "post_office", e: "cafe", s: "station" },
    ambience: { lines: ["Una paloma da la vuelta entera a la fuente y se detiene donde empezó.", "El péndulo tras la esfera del reloj sigue oscilando. Las agujas no se mueven.", "Alguien, en una tienda cerrada, da la vuelta a un cartel: de «Cerrado» a «Cerrado por cierre»."] },
    alt: "Una plaza de noche: un ayuntamiento con una torre de reloj que marca las cinco y cuarto, una fuente seca, tiendas con las persianas bajadas a la izquierda, con la puerta azul de Correos, y un café iluminado a la derecha. Palomas sobre los adoquines.",
    scenery: [
      { words: ["fuente", "pilon"], name: "la fuente" }, { words: ["tiendas", "tienda", "persianas"], name: "las tiendas" },
      { words: ["palomas", "paloma", "pajaros"], name: "las palomas" }, { words: ["ayuntamiento", "torre"], name: "el ayuntamiento" },
      { words: ["correos", "oficina"], name: "Correos", leads: "w" }, { words: ["cafe"], name: "el café", leads: "e" },
      { words: ["estacion"], name: "la estación", leads: "s" }, { words: ["cartel", "letrero"], name: "el cartel" }
    ]
  },
  post_office: {
    name: "CORREOS", area: "coast", at: [-1, 3, 0],
    describe: [
      "Mostradores de madera, olor a cola y a lluvia. Tras la reja, el {administrador|postmaster} clasifica cartas en casillas marcadas con fechas en lugar de nombres. Las casillas se hunden más allá de donde acaba la sala.",
      "La puerta está al este."
    ],
    exits: { e: { to: "square", out: true } },
    alt: "Entre los barrotes de la reja de una oficina de correos: un administrador con gorra azul y gafas bajo una lámpara verde, y casillas llenas de cartas a su espalda.",
    scenery: [
      { words: ["mostrador", "mostradores", "reja", "barrotes"], name: "el mostrador" }, { words: ["casillas", "casilla", "cartas", "fechas"], name: "las casillas" },
      { words: ["lampara", "cola"], name: "la lámpara" }, { words: ["puerta", "umbral"], name: "la puerta", leads: "e" }
    ]
  },
  cafe: {
    name: "EL CAFÉ", area: "coast", at: [1, 3, 0],
    describe: [
      "Cuatro mesas y un {camarero|waiter}, que lleva doblando la misma servilleta desde que se tiene memoria. La servilleta se dobla, se desdobla y se dobla otra vez, un poco distinta cada vez. La cafetera suspira.",
      "La plaza queda al oeste."
    ],
    exits: { w: { to: "square", out: true } },
    alt: "Un pequeño café cálido: una cafetera humeante sobre el mostrador, mesas redondas de mármol, un camarero con delantal blanco doblando una servilleta, una ventana a la plaza oscura.",
    scenery: [
      { words: ["mesas", "mesa", "sillas", "silla"], name: "las mesas" }, { words: ["cafetera", "maquina", "vapor"], name: "la cafetera" },
      { words: ["servilleta"], name: "la servilleta" }, { words: ["ventana", "plaza"], name: "la ventana" },
      { words: ["puerta", "umbral"], name: "la puerta", leads: "w" }
    ]
  },
  station: {
    name: "LA ESTACIÓN", area: "coast", at: [0, 4, 0],
    describe: [
      "Un andén, un banco, un {tren|train} con las puertas abiertas y el motor dormido. El {horario|timetable} anuncia que todos los trenes salen a las 17.15.",
      "Las vías siguen hacia el sur, en la oscuridad, y se detienen poco más allá, como si hubieran olvidado adónde iban. La plaza queda al norte."
    ],
    exits: { n: "square", s: true },
    ambience: { lines: ["El motor da una vuelta en su sueño.", "Un silbato suena, muy lejos, para otro tren.", "La señal del final de la vía pasa del rojo al rojo."], every: [40, 90], chance: 0.6 },
    alt: "Un andén de noche bajo una marquesina. Un tren verde oscuro espera a la derecha con una puerta abierta. Un banco y un tablero blanco de horarios en el andén; una señal roja, lejos, al final de la vía.",
    scenery: [
      { words: ["anden", "marquesina"], name: "el andén" }, { words: ["banco"], name: "el banco" },
      { words: ["vias", "via", "rieles", "railes", "senal"], name: "las vías" }, { words: ["motor", "locomotora"], name: "el motor" }
    ]
  },
  lighthouse_base: {
    name: "LA ROCA DEL FARO", area: "lighthouse", at: [0, 0, 0],
    describe: [
      "Una roca en el mar, justo lo bastante grande para un faro y una argolla de amarre. Las olas llegan de todos lados, sin prisa.",
      "El faro sube, blanco, hacia la oscuridad. Tiene la puerta abierta. Dentro, una escalera de hierro gira hacia arriba. La barca es la única manera de volver."
    ],
    exits: { u: "lantern", s: true },
    alt: "Un alto faro blanco con franjas rojas visto desde abajo, con la linterna oscura contra las estrellas. La espuma rompe en la roca de su pie; la puerta está abierta.",
    scenery: [
      { words: ["faro", "torre", "puerta", "escalera", "escaleras"], name: "el faro", leads: "u" },
      { words: ["roca", "argolla"], name: "la roca" }, { words: ["mar", "olas", "agua", "espuma"], name: "el mar" }
    ]
  },
  lantern: {
    name: "LA LINTERNA", area: "lighthouse", at: [0, 0, 1],
    describe: [
      lampCold, farDoor, down
    ],
    exits: { d: "lighthouse_base" },
    alt: "El interior de la linterna: una gran lente de cristal en el centro, sobre un pedestal de latón; por los marcos de las ventanas, el mar nocturno y una playa lejana y fina con una sola lucecita amarilla.",
    scenery: [
      { words: ["cristal", "cristales", "ventanas", "ventana", "vidrio"], name: "el cristal" }, { words: ["mar", "playa", "puerta", "plaza"], name: "la vista" },
      { words: ["escalera", "escaleras"], name: "la escalera", leads: "d" }
    ]
  }
};

// ---- Objetos ------------------------------------------------------------------------------------------------------
// name / note / actions: lo que enseña al hacer clic (heldActions cuando se lleva); words: cómo lo conoce el intérprete
// (nouns, adj, g: género, pl: plural); examine: su descripción; here: una línea que se añade a la sala mientras está ahí.
// (El café empieza fuera de juego; el verbo "pedir" puede nombrarlo igualmente, ARCHITECTURE.md §3.)

const objects = {
  // La apertura: las dos cosas que coger, la que llevas y el camino (BRIEF.md §3).
  stamp: { at: "corridor", portable: true, name: "Sello de goma", note: "Apriétalo para empezar de nuevo.", actions: ["Coger sello", "Apretar sello"], heldActions: ["Apretar sello", "Examinar sello"],
    words: { nouns: ["sello", "tampon", "almohadilla"], adj: ["goma", "caucho", "laton", "tinta"], g: "m" }, ...item("stamp"),
    here: "En el linóleo, junto al charco, hay un {sello|stamp} de goma, con la almohadilla todavía húmeda.",
    examine: "Un sello de goma con mango de latón y una almohadilla de tinta verde, ambos húmedos. El cuño dice, del revés: «Volver a presentar». Lo han usado incontables veces y la almohadilla nunca está seca." },
  suggestion_box: { at: "corridor", portable: true, name: "Buzón de sugerencias", note: "Alguien lee en voz alta.", actions: ["Coger buzón", "Escuchar buzón"], heldActions: ["Escuchar buzón", "Examinar buzón"],
    words: { nouns: ["buzon", "ranura"], adj: ["sugerencias", "madera", "laton"], g: "m" }, ...item("suggestion_box"),
    here: "Bajo el cartel, un {buzón de sugerencias|suggestion_box} cuelga de un solo tornillo.",
    examine: "Un buzoncito de madera con una ranura de latón y una etiqueta: «Sugerencias». No lo han vaciado en tu tiempo y no está lleno. Desde dentro, muy bajito, una voz lee." },
  memo: { at: "player", portable: true, name: "Memorando del Ministerio", note: "Doblado en cuatro.", actions: ["Leer memorando"], heldActions: ["Leer memorando"],
    words: { nouns: ["memorando", "memo"], adj: ["ministerio", "doblado"], g: "m" }, ...item("memo"),
    examine: "Un memorando del Ministerio, doblado en cuatro, con el membrete todavía verde. «Al personal: se ha informado de la existencia de una puerta en la planta menos cuatro. No está ahí. Se ruega no usarla»." },
  green_door: { at: "corridor", scenery: true, name: "Puerta verde", note: "Pequeña, y respira.", actions: ["Examinar puerta", "Llamar"],
    words: { nouns: ["puerta", "puertecita", "cerradura", "madera"], adj: ["verde", "pequeña", "pequena", "chiquita", "respirando", "diminuta"], g: "f" },
    examine: "La madera está tibia, como la piel. Sube y baja despacio, al compás de tu propia respiración. Encima, una placa de latón: «Llama solo si recuerdas tu nombre»." },
  loudspeaker: { at: "corridor", scenery: true, name: "Altavoz", note: "Murmura.", actions: ["Escuchar"],
    words: { nouns: ["altavoz", "megafonia", "voz"], adj: [], g: "m" },
    examine: "«Estás conforme», murmura. «Estás conforme. Siempre has estado aquí»." },
  poster: { at: "corridor", scenery: true, name: "Cartel", note: "Un solo ojo rojo.", actions: ["Examinar cartel"],
    words: { nouns: ["cartel", "poster", "ojo", "palabras"], adj: ["rojo", "solo", "vigilante"], g: "m" },
    examine: "Un solo ojo rojo sobre las palabras «La conformidad es obligatoria». El ojo parpadea cuando no lo miras." },
  camera: { at: "corridor", scenery: true, name: "Cámara", note: "Vuelta hacia otro lado.", actions: ["Examinar cámara"],
    words: { nouns: ["camara"], adj: ["seguridad", "vigilancia"], g: "f" },
    examine: "Ha girado la cara. Por primera vez en once años, nadie te vigila." },
  // La playa
  beach_door: { at: "beach", scenery: true, name: "Puerta verde", note: "En pie en la arena, respirando.", actions: ["Examinar puerta", "Entrar en puerta"],
    words: { nouns: ["puerta", "marco", "cerradura", "madera"], adj: ["verde", "pequeña", "pequena", "respirando", "deriva", "flotante"], g: "f" },
    examine: "La misma puerta. Desde este lado también respira. Por el ojo de la cerradura se ve linóleo gris y se oye un altavoz." },
  lighthouse_far: { at: "beach", scenery: true, name: "Faro", note: "A lo lejos, apagado.",
    words: { nouns: ["faro", "torre", "lampara", "linterna"], adj: ["oscuro", "apagado", "lejano", "lejos"], g: "m" },
    examine: "Tiene la lámpara apagada. Hace mucho que nadie la enciende, y no llega ningún barco." },

  // La línea de la marea
  shell: { at: "tideline", portable: true, ...item("shell"), name: "Caracola", note: "Pálida, enroscada como una oreja.",
    actions: ["Coger caracola", "Escuchar caracola"], heldActions: ["Examinar caracola", "Escuchar caracola"],
    listen: "Te acercas la caracola al oído. Muy pequeño, muy lejano, un altavoz: «Estás conforme. Estás conforme. El almuerzo será suficiente».",
    words: { nouns: ["caracola", "concha"], adj: ["palida", "enroscada", "blanca"], g: "f" },
    examine: "Pálida y acanalada, enroscada como una oreja. Si te la acercas a la tuya, oyes, muy pequeño, un altavoz que murmura que estás conforme.",
    here: "Entre las algas hay una {caracola|shell}, pálida y enroscada como una oreja." },
  glove: { at: "tideline", scenery: true, name: "Guante", note: "Una mano izquierda, lana gris.", take: "Lo dejas donde lo puso el mar. Aún no ha terminado de devolverlo.",
    words: { nouns: ["guante"], adj: ["gris", "lana", "izquierdo", "izquierda"], g: "m" },
    examine: "Un guante de lana gris, de mano izquierda. Todavía está tibio por dentro, como si alguien acabara de quitárselo." },
  shoe: { at: "tideline", scenery: true, name: "Zapato", note: "De niño, rojo.", take: "Lo dejas donde lo puso el mar. Aún no ha terminado de devolverlo.",
    words: { nouns: ["zapato", "zapatito"], adj: ["rojo", "pequeño", "pequeno", "niño", "nino"], g: "m" },
    examine: "Un zapatito rojo, con hebilla. Tuviste un par igual. El tuyo tenía un roce en la punta izquierda. Este también." },
  page: { at: "tideline", scenery: true, name: "Hoja escrita a máquina", note: "Un formulario, reblandecido.", actions: ["Leer hoja"], take: "La dejas donde la puso el mar. Aún no ha terminado de devolverla.",
    words: { nouns: ["hoja", "formulario", "papel", "pagina"], adj: ["mecanografiada", "maquina", "mojada", "empapada", "escrita"], g: "f" },
    examine: "Un formulario del Ministerio. La tinta se ha corrido. Una línea todavía se lee: «Motivo de la baja:». El espacio que sigue está vacío." },

  // La cueva
  echo: { at: "cave", scenery: true, name: "Eco", note: "Responde tarde.", actions: ["Gritar"],
    words: { nouns: ["eco"], g: "m" }, examine: "No se ve. Solo se oye cómo espera." },

  // El muelle
  lifebuoy: { at: "pier", scenery: true, name: "Salvavidas", note: "Un nombre, tapado con pintura.",
    take: "Está atado al poste con un nudo que nadie ha deshecho en años. Tú tampoco.",
    words: { nouns: ["salvavidas", "aro", "flotador", "nombre", "pintura"], adj: ["rojo", "blanco"], g: "m" },
    examine: "Rojo y blanco, agrietado por la sal. Bajo la pintura nueva se transparenta el nombre antiguo. Tiene tantas letras como el tuyo." },
  lighthouse_near: { at: "pier_end", scenery: true, name: "Faro", note: "Sobre su roca, apagado.",
    words: { nouns: ["faro", "torre", "linterna"], adj: ["oscuro", "apagado", "blanco"], g: "m" },
    examine: "Blanco, con una franja roja. Tiene la linterna apagada. Desde aquí se ve que la puerta de su pie está abierta." },
  boat: { at: "pier_end", scenery: true, container: true, name: "Barca", note: "Pequeña, azul, sin remos.",
    actions: ["Examinar barca", "Entrar en barca"], img: "boat", sprite: sprites.boat, floorSprite: sprites.boat_floor,
    words: { nouns: ["barca", "bote", "horquillas", "escalmos"], adj: ["pequeña", "pequena", "azul"], g: "f" },
    examine: "Pequeña y azul, con un charco en el fondo. Tiene horquillas, pero no remos.",
    here: "Una {barca|boat} azul y pequeña golpea con suavidad contra la argolla." },

  // Las casetas
  hut: { at: "huts", scenery: true, container: true, locked: true, name: "Caseta 7", note: "Recién pintada, cerrada con llave.",
    lock: { key: "key", says: "El candado resiste. Es nuevo, y lo han puesto por algo.",
            opens: "La llave gira como si lo hiciera cada mañana. La puerta se abre hacia fuera y los remos que estaban apoyados en ella resbalan despacio hasta la arena. Dentro, colgada de un clavo, una {fotografía|photograph}.",
            then: "open_hut" },
    enter: "Entras. Huele a cuerda y a veranos. No hay nada más aquí que lo que ya ves.",
    actions: ["Examinar caseta", "Abrir caseta"],
    words: { nouns: ["caseta", "7", "siete", "puerta", "candado", "cerradura", "rendija", "grieta"], adj: ["baño", "bano", "recien", "pintada", "nueva", "numero"], g: "f" },
    examine: "El número 7, en azul. El candado es nuevo. Por una rendija entre las tablas se ve el mango de un remo." },
  oars: { at: "hut", portable: true, ...item("oars"), name: "Remos", note: "Dos, gastados y lisos.",
    actions: ["Coger remos"], heldActions: ["Examinar remos"],
    words: { nouns: ["remos", "remo", "palas"], adj: ["madera", "dos", "par"], g: "m", pl: true },
    examine: "Dos remos, lisos y gastados allí donde los han sujetado manos. Tus manos encajan exactamente en los sitios gastados.",
    here: "Un par de {remos|oars} yace en la arena, junto a la caseta abierta." },
  photograph: { at: "hut", portable: true, ...item("photograph"), name: "Fotografía", note: "Una playa a plena luz.",
    actions: ["Coger fotografía"], heldActions: ["Examinar fotografía"],
    words: { nouns: ["fotografia", "foto", "retrato", "imagen", "clavo"], adj: ["vieja"], g: "f" },
    examine: "Una playa a plena luz del día. Alguien con un traje de baño a rayas se ríe de quien sostiene la cámara. Eres tú, once años más joven, en una vida que no recuerdas haber tenido." },

  // Las dunas
  radio: { at: "dunes", scenery: true, name: "Radio", note: "En algún sitio. No la ves.", actions: ["Escuchar"],
    listen: ["La canción llega al verso de volver a casa y empieza otra vez desde el principio.", "Una mujer canta que espera. Lleva un tiempo esperando.", "Entre canción y canción, una voz lee el parte marítimo de mares que no tienen nombre."],
    words: { nouns: ["radio", "cancion", "musica"], g: "f" },
    examine: "No se ve. La canción llega de todas partes entre las dunas a la vez, como un olor." },

  // El tiovivo
  horse: { at: "carousel", scenery: true, name: "Caballito gris", note: "7-B en la silla.", actions: ["Examinar caballito", "Montar caballito"],
    words: { nouns: ["caballito", "caballo", "silla", "montura", "numero"], adj: ["gris", "madera"], g: "m" },
    examine: "Gris, con la silla roja y una oreja desportillada. El número de la silla es el de tu mesa de trabajo. La pintura está fresca." },

  // El hotel
  keyboard: { at: "lobby", scenery: true, name: "Tablero de llaves", note: "Un gancho está vacío.",
    take: "Son las llaves de las habitaciones de otros. Solo una es la tuya, y no está aquí.",
    words: { nouns: ["tablero", "llaves", "gancho", "ganchos", "llavero", "panel"], adj: ["vacio"], g: "m" },
    examine: "Ganchos de latón en filas, con una llave en cada uno menos en uno: el número 11. Bajo el gancho vacío, en letras pequeñas: «El huésped ha dejado la llave en la puerta»." },
  bell: { at: "lobby", scenery: true, name: "Campanilla", note: "De latón, para el servicio.", actions: ["Pulsar campanilla"],
    push: "Tilín. No viene nadie. Arriba, una puerta se abre y se cierra, con educación.",
    words: { nouns: ["campanilla", "timbre", "campana"], adj: ["laton", "servicio", "mostrador"], g: "f" },
    examine: "Una campanilla de latón para el servicio, pulida por muchas manos." },
  guests: { at: "dining", scenery: true, name: "Comensales", note: "En el postre desde hace mucho.", actions: ["Hablar con comensales"],
    topics: {
      postmaster: { words: ["administrador", "correos", "cartas", "paquete", "cartero"], says: "«¿El administrador?», dice una mujer de verde. «No te dará nada sin un nombre. A menos que el mar responda por ti. A veces responde»." },
      lighthouse: { about: "lighthouse_far", words: ["faro", "lampara", "luz"], says: "«El faro», dice un hombre, a nadie. «Mi hermano lo encendió una vez. Quemó su anillo de boda. Ya no recordaba por qué le había importado nunca»." },
      hut: { words: ["caseta", "casetas", "7", "siete"], says: "«La caseta 7», dice alguien. «Qué color tan bonito. ¿Quién la habrá pintado?» Nadie lo sabe. Todos te miran." },
      default: "Lo consideran con educación y vuelven a su postre."
    },
    talk: [
      "«¿El administrador?», dice una mujer de verde. «No te dará nada sin un nombre. A menos que el mar responda por ti. A veces responde».",
      "«El faro», dice un hombre, a nadie. «Mi hermano lo encendió una vez. Quemó su anillo de boda. Ya no recordaba por qué le había importado nunca».",
      "«La caseta 7», dice alguien. «Qué color tan bonito. ¿Quién la habrá pintado?» Nadie lo sabe. Todos te miran.",
      "«¿No te quedas a tomar café?», pregunta el hombre que está junto a la silla vacía. «Nadie se queda nunca a tomar café. En el café lo hacen mejor»."
    ],
    words: { nouns: ["comensales", "comensal", "invitados", "invitado", "gente", "personas", "hombre", "mujer", "hombres", "mujeres", "señor", "señora", "senor", "senora"], adj: ["comedor"], g: "m", pl: true },
    examine: "Doce, de etiqueta, con las costuras ya ablandadas. Se pasan la sal, se ríen y se la devuelven. Ninguno mira hacia la puerta." },
  chair: { at: "dining", scenery: true, name: "Silla vacía", note: "Reservada.", actions: ["Leer tarjeta", "Sentarse"],
    words: { nouns: ["silla", "asiento", "sitio", "lugar"], adj: ["vacia", "cercana"], g: "f" },
    examine: "Una silla vacía, un poco retirada de la mesa, como si alguien acabara de levantarse, o estuviera a punto de sentarse." },
  card: { at: "dining", scenery: true, name: "Tarjeta", note: "Una tarjeta de sitio.", actions: ["Leer tarjeta"],
    words: { nouns: ["tarjeta", "cartulina"], adj: ["sitio", "nombre"], g: "f" },
    examine: "Una tarjeta de sitio. Han escrito un nombre y lo han borrado tantas veces que la cartulina se ha gastado hasta quedarse fina." },
  door11: { at: "hallway", scenery: true, name: "Puerta 11", note: "Entornada, con la llave en la cerradura.", actions: ["Entrar en puerta"], leads: "w",
    words: { nouns: ["puerta", "11", "once", "habitacion"], adj: ["entornada", "abierta", "numero"], g: "f" },
    examine: "El número 11, en latón. Está entornada. La llave de la cerradura lleva una chapa con el nombre del hotel, gastada de tanto tacto." },
  window: { at: "room11", scenery: true, name: "Ventana", note: "Al mar.", actions: ["Mirar por ventana"],
    words: { nouns: ["ventana", "cristal", "vista", "vidrio"], g: "f" },
    examine: "El mar y, sobre su roca, el faro, apagado. Alguien se ha asomado aquí muchas veces: hay un trozo limpio en el cristal, a la altura de tus ojos." },
  coat: { at: "room11", scenery: true, name: "Abrigo", note: "Tu talla, tu color.", actions: ["Registrar abrigo"],
    take: "Te lo pones. Te queda perfecto. Te lo quitas otra vez: es de alguien más valiente.",
    words: { nouns: ["abrigo", "bolsillo", "bolsillos", "billete"], adj: ["azul"], g: "m" },
    examine: "Lana azul, de tu talla. En el bolsillo, un billete de autobús de hace once años, para un pueblo en el que nunca has estado. No llegó a usarse." },
  letter: { at: "room11", portable: true, ...item("letter"), name: "Carta", note: "Con tu letra.",
    actions: ["Coger carta", "Leer carta"], heldActions: ["Leer carta"],
    words: { nouns: ["carta", "sobre", "nota", "letra"], g: "f" },
    examine: "Con tu letra: «Si estás leyendo esto, al final viniste. El administrador guarda lo que es nuestro. No le dará nada a quien no tenga nombre, pero se fía del mar. Caseta 7. La barca. La lámpara quema lo que aceptes olvidar. Yo no supe elegir. Quizá tú sí».",
    here: "Sobre la almohada hay una {carta|letter}." },

  // La plaza
  clock: { at: "square", scenery: true, name: "Reloj", note: "Las cinco y cuarto.",
    turn: "Está demasiado alto. Y no es el reloj lo que se ha parado.",
    words: { nouns: ["reloj", "agujas", "pendulo", "esfera", "manecillas"], adj: ["ayuntamiento", "municipal"], g: "m" },
    examine: "Las agujas siguen en las cinco y cuarto. Tras la esfera, un péndulo oscila de todos modos, marcando el tiempo para nadie." },

  // Correos
  postmaster: { at: "post_office", scenery: true, name: "Administrador de Correos", note: "Tras la reja.", actions: ["Hablar con administrador"],
    topics: {
      name: { open: true, label: "mi nombre", words: ["nombre", "nombres"], says: "«Los nombres son cosa del mar», dice. «Los devuelve cuando está listo. No antes»." },
      sea: { open: true, words: ["mar", "caracola", "playa"], says: "«El mar sabe de dónde es cada uno», dice. «Escucha detrás de la puerta»." },
      default: "Te mira por encima de las gafas. «Eso no es correo»."
    },
    words: { nouns: ["administrador", "funcionario", "cartero", "empleado", "hombre", "señor", "senor"], adj: ["viejo", "correos"], g: "m" },
    examine: "Un hombre pequeño con gorra azul y gafas redondas. Clasifica sin mirar, como si supiera dónde va todo." },
  parcel: { at: null, portable: true, ...item("parcel"), name: "Paquete", note: "Dirigido a ti.",
    actions: ["Abrir paquete"], heldActions: ["Examinar paquete", "Abrir paquete"],
    words: { nouns: ["paquete", "bulto", "cuerda", "cordel"], adj: ["pequeño", "pequeno", "marron", "estraza"], g: "m" },
    examine: "Papel de estraza y cordel, un sello con un faro. Dirigido con tu letra: «Planta menos cuatro. Cuando vengas»." },
  key: { at: null, portable: true, ...item("key"), name: "Llave", note: "De latón, con etiqueta: 7.",
    actions: ["Examinar llave"], heldActions: ["Examinar llave"],
    words: { nouns: ["llave", "etiqueta"], adj: ["laton", "pequeña", "pequena", "7", "siete"], g: "f" },
    examine: "Una llavecita de latón en una etiqueta de cartón. En la etiqueta, con tu letra: 7." },

  // El café
  waiter: { at: "cafe", scenery: true, name: "Camarero", note: "Doblando una servilleta.", actions: ["Hablar con camarero"],
    topics: {
      lighthouse: { about: "lighthouse_far", words: ["faro", "lampara", "luz"], says: "«Te sentabas ahí, junto a la ventana, y lo mirabas», dice. «Decías que algún día lo encenderías. Lo decías como si fuera una broma»." },
      coffee: { words: ["cafe", "habitual", "azucar", "terron"], says: "«Con un terrón», dice. «Siempre tomabas uno. Luego dejaste de venir, y nadie volvió a tomar azúcar»." },
      default: "Dobla la servilleta en forma de cisne mientras lo piensa, y la desdobla. «Solo sé de café y de ti»."
    },
    talk: ["«Tómatelo mientras esté caliente», dice. «Nunca se queda caliente mucho rato. Nada se queda, los domingos».",
           "«Te sentabas junto a la ventana», dice. «Hablabas del faro. Luego un domingo no viniste»."],
    words: { nouns: ["camarero", "mozo", "hombre"], adj: ["viejo"], g: "m" },
    examine: "Chaqueta negra, delantal blanco. Dobla la servilleta en forma de cisne, la desdobla y vuelve a empezar. Te mira como si llegaras tarde." },
  coffee: { at: null, portable: false, ...item("coffee"), name: "Café", note: "Caliente.", actions: ["Beber café"],
    words: { nouns: ["cafe", "taza"], adj: ["caliente", "negro"], g: "m" },
    examine: "Negro, con un terrón. Nunca has tomado azúcar.",
    here: "Una {taza de café|coffee} humea sobre la mesa." },

  // La estación
  train: { at: "station", scenery: true, name: "Tren", note: "Puertas abiertas, motor dormido.", actions: ["Entrar en tren"],
    enter: "Te sientas en el vagón vacío, entre abrigos ajenos. El tren no se mueve. Al cabo de un rato te bajas. Hay salidas que necesitan algo más que un billete.",
    words: { nouns: ["tren", "vagon", "vagones", "puertas", "puerta"], adj: ["verde", "dormido", "vacio"], g: "m" },
    examine: "Vagones verdes, asientos vacíos, los portaequipajes llenos de abrigos ajenos. El motor respira despacio, dormido." },
  timetable: { at: "station", scenery: true, name: "Horario", note: "Todos los trenes: 17.15.", actions: ["Leer horario"],
    words: { nouns: ["horario", "tablero", "horarios", "indicador"], adj: ["blanco"], g: "m" },
    examine: "Tres destinos, todos con salida a las 17.15, solo domingos: «Felicidad Suficiente, vía planta menos cuatro». «La vida que no viviste». «En otra parte»." },

  // La linterna
  lamp: { at: "lantern", scenery: true, container: true, name: "Lámpara", note: "La gran lente, fría.", actions: ["Examinar lámpara", "Encender lámpara"],
    switch_on: "No hay nada que quemar. La mecha espera algo que aceptes olvidar.",
    words: { nouns: ["lampara", "lente", "mecha", "luz", "laton", "copa"], adj: ["gran", "grande", "fria"], g: "f" },
    examine: "Una mecha en una copa de latón, tras una lente tan alta como un hombre. Grabado a arañazos en el latón: «Quemo lo que aceptes olvidar». La mecha está seca." }
};

// ---- Reglas -------------------------------------------------------------------------------------------------------

// Cambios con nombre: efectos escritos una vez y ejecutados desde cualquier regla con { change: "nombre" } (ARCHITECTURE.md §5).
const changes = {
  // La puerta verde se vuelve madera de deriva: la playa, la vista lejana desde la linterna y los textos de los dos lados.
  driftwood: [
    { set: "beach_door.shut", to: true },
    { set: "beach_door.examine", to: "Un trozo de madera de deriva, clavado en la arena, del tamaño de una puertecita. No respira." },
    { set: "beach_door.note", to: "Ahora, madera de deriva." }, { set: "beach_door.actions", to: ["Examinar puerta"] },
    { set: "beach.describe", to: [doorGone, seaDark, sand] },
    { set: "lantern.describe", to: [lampCold, farSand, down] },
    { draw: "beach", replace: ["poly door 151,101 161,99 160,118 150,120 mix:6,8@0.4 e0"],
      remove: ["knob", "door_light", "spill"],
      cycles: [{ name: "moon on the water", areas: ["moonpath", "moonpath2", "moonpath3", "moonpath4", "moonpath5"], colors: [9, 15, 1], style: "rotate", ms: 600 }] },
    { draw: "lantern", remove: ["far_door"], cycles: [] }
  ],
  // La lámpara prende: la lente en la linterna, y la linterna vista desde la playa y desde el final del muelle.
  // (Los textos de sala los reescriben los finales, que saben si la puerta sigue ahí.)
  lamp_lit: [
    { set: "lamp.note", to: "Encendida." },
    { set: "lamp.examine", to: "La mecha arde tras la gran lente, y la luz sale por encima del agua, y vuelve, y sale otra vez." },
    { set: "lighthouse_far.examine", to: "Encendido. Su haz gira, lento, sobre el agua." },
    { set: "lighthouse_near.examine", to: "Encendido. Su haz gira, lento, sobre el agua." },
    { draw: "lantern", restyle: [{ id: "lamp", fill: { mix: [14, 15], level: 0.5 } }, { id: "wick", fill: 14 }],
      cycles: [{ name: "the lamp", areas: ["lamp"], colors: [14, 15], style: "pingpong", ms: 700 }] },
    { draw: "beach", restyle: [{ id: "lantern", fill: 14 }] },
    { draw: "pier_end", restyle: [{ id: "lantern", fill: 14 }] }
  ],
  // La caseta 7 se abre (la ejecuta su cerradura, cuando gira la llave).
  open_hut: [
    { set: "hut.examine", to: "La caseta 7, con la puerta abierta. Dentro: olor a cuerda y a veranos, un clavo en la pared y, en el polvo, la huella de donde estuvieron los remos." },
    { set: "hut.note", to: "Abierta." }, { set: "hut.actions", to: ["Examinar caseta"] },
    { move: "oars", to: "huts" },
    { draw: "huts", replace: ["rect hut_door 168,74,16,26 0 e1"], remove: ["padlock"], add: ["rect nail_photo 173,80,6,5 15 e8 after:hut_door", "poly oars_shaft 138,110 168,113 168,116 138,113 7", "ellipse oars_blade 172,115,5,2 15"] }
  ],
  // Cruzar al faro y volver.
  row_out: [{ move: "oars", to: "boat" }, { move: "boat", to: "lighthouse_base" },
    { say: "Remas. El muelle se hace pequeño, luego el pueblo, luego la luz verde de la puerta. El faro se hace grande, y más silencioso, y de pronto estás allí." },
    { travel: "lighthouse_base" }, { describe: "$here" }],
  row_back: [{ move: "boat", to: "pier_end" },
    { say: "Remas de vuelta. El pueblo sale de la oscuridad a tu encuentro, exactamente como lo dejaste." },
    { travel: "pier_end" }, { describe: "$here" }],
  // Los dos finales en la lámpara.
  end_photograph: [{ remove: "object", id: "photograph" }, { set: "game.tension", to: 0 },
    { change: "lamp_lit" },
    { set: "beach.describe", to: [doorStands, seaLit, sand] }, { set: "lantern.describe", to: [lampLit, farDoor, down] },
    { say: "La fotografía se enrosca en la copa de latón y prende. La luz es enorme. Sale por encima del agua y barre el pueblo, cada ventana, cada caseta, la cara que hay en cada una. Cuando ha pasado, no recuerdas qué buscabas." },
    { say: "Estás en tu mesa, planta menos cuatro. El pasillo es gris, el linóleo es gris, la luz es gris. El altavoz murmura que estás conforme. Descubres que casi lo estás." },
    { end: true, picture: "photograph" }],
  end_shell: [{ remove: "object", id: "shell" }, { set: "game.tension", to: 0 },
    { change: "lamp_lit" },
    { set: "beach.describe", to: [doorGone, seaLit, sand] }, { set: "lantern.describe", to: [lampLit, farSand, down] },
    { say: "La caracola arde con una llama azul y pequeña, y el altavoz que lleva dentro dice «Estás» y nada más. La luz sale por encima del agua. En la playa, la puerta verde se cierra y es un trozo de madera de deriva." },
    { say: "En el pueblo, el reloj se mueve: las cinco y cuarto, las cinco y veinte. Se acerca el lunes, y nadie aquí sabe qué pasa los lunes. Al otro lado del agua, desde algún lugar cerca de la puerta, tu nombre vuelve a ti." },
    { end: true, picture: "shell" }],
  // La última línea de todos los finales.
  over: []
};
const oarsReady = { "oars.at": { in: ["player", "boat"] } };

// Se prueban en orden, antes de los verbos normales. Las reglas añadidas con `before` van delante de la regla del pasillo con ese id.

const rules = [
  // -- Atravesar la puerta, en los dos sentidos ----------------------------------------------------------------
  { id: "beach_door_shut", match: { verb: ["enter", "go", "open", "knock", "push", "pull"], obj: "beach_door" }, if: [{ "beach_door.shut": true }],
    do: [{ say: "Ahora es madera de deriva. Lo que se abría tras ella se ha cerrado." }] },
  { id: "beach_door_knock", match: { verb: "knock", obj: "beach_door" },
    do: [{ say: "Llamas. Del otro lado, al cabo de un rato, responden tres golpes." }] },
  { id: "beach_through", match: { verb: ["enter", "go", "open", "push"], obj: "beach_door" },
    do: [{ say: "Te arrodillas ante la puerta. Solo es una puerta desde el otro lado; desde aquí se abre a la arena." }] },

  // -- Ayuda, fuera del pasillo ----------------------------------------------------------------------------------
  { id: "help_town", match: { verb: "help" },
    do: [{ say: "Mira a tu alrededor y examina lo que menciona el texto: `Examinar caracola`, `Leer carta`. Habla con la gente: `Hablar con camarero`. Se puede dar, enseñar y meter una cosa en otra: `Dar caracola a administrador`, `Meter remos en barca`. `Inventario` muestra lo que llevas." }] },

  // -- La línea de la marea ---------------------------------------------------------------------------------------

  // -- La cueva: lo que dices vuelve, equivocado -----------------------------------------------------------------
  { id: "cave_voice", match: { verb: ["shout", "say", "sing", "talk", "ask", "think"] }, if: [at("cave")],
    do: [{ say: [
      "La cueva responde con un nombre. No es el tuyo. Suena como si pudiera haberlo sido.",
      "Desde la oscuridad, tarde y con tu propia voz: «Quema lo que aceptes olvidar».",
      "La cueva repite lo que has dicho y luego algo que no dijiste, muy bajito: «Caseta 7».",
      "El eco vuelve convertido en risa. La de otra persona, en una playa, a plena luz del día."
    ] }, tension(5)] },

  // -- El muelle -------------------------------------------------------------------------------------------------

  // -- Nadar: primero un aviso, luego el frío ----------------------------------------------------------------------
  { id: "swim_drown", match: { verb: ["swim", "jump"] }, if: [{ "player.at": { in: ["beach", "tideline", "pier", "pier_end", "lighthouse_base"] } },
      { "player.waded": true }, { "player.health": { "<=": 50 } }],
    do: [{ say: "El frío se cierra sobre ti, con suavidad, como se cierra sobre todo. El mar te recibe. A su tiempo, te devolverá." },
         { hurt: 100, says: "El frío se lleva lo último de ti." }, { end: true, picture: "drowned" }] },
  { id: "swim_hurt_last", match: { verb: ["swim", "jump"] }, if: [{ "player.at": { in: ["beach", "tideline", "pier", "pier_end", "lighthouse_base"] } }, { "player.waded": true }, { "player.health": { "<=": 80 } }],
    do: [tension(10),
         { say: "Vuelves a entrar. Esta vez lo que hay debajo tarda más en soltarte. Sales a rastras a la arena sabiendo, como sabes tu propia letra, que la próxima vez no lo hará." },
         { hurt: 30, says: "Esta vez ha tardado más en soltarte." }] },
  { id: "swim_hurt", match: { verb: ["swim", "jump"] }, if: [{ "player.at": { in: ["beach", "tideline", "pier", "pier_end", "lighthouse_base"] } }, { "player.waded": true }],
    do: [tension(10),
         { say: "Entras. El frío es total. Algo, debajo, te agarra el tobillo, te considera y te suelta. Sales a la arena tosiendo, temblando, y con menos de lo que eras." },
         { hurt: 30, says: "Su presa te ha dejado una marca." }] },
  { id: "swim_wade", match: { verb: ["swim", "jump"] }, if: [{ "player.at": { in: ["beach", "tideline", "pier", "pier_end", "lighthouse_base"] } }],
    do: [{ set: "player.waded", to: true }, tension(5),
         { say: "Entras hasta las rodillas y te detienes. El agua es negra y muy fría, y más allá el mar tira, paciente, como algo que tiene todo el tiempo del mundo." }] },
  { id: "swim_dry", match: { verb: "swim" }, do: [{ say: "Aquí no hay agua en la que nadar." }] },

  // -- Las casetas: la llave del paquete abre la caseta 7 ----------------------------------------------------------
  { id: "hut_photo", match: { verb: ["examine", "search", "look"], obj: "hut" }, if: [{ "hut.open": true }, { "photograph.at": "hut" }],
    do: [{ say: "$hut.examine" }, { say: "En un clavo, dentro, cuelga una {fotografía|photograph}." }] },
  { id: "photo_taken", match: { verb: "take", obj: "photograph" }, if: [{ "photograph.at": "hut" }],
    do: [{ move: "photograph", to: "player" }, { draw: "huts", remove: ["nail_photo"] }, { say: "La descuelgas del clavo. Se suelta como si hubiera estado esperando." }] },

  // -- La barca: los remos dentro, y luego remar ---------------------------------------------------------------------
  // Los remos yacen en la arena, junto a la caseta, como formas de su dibujo: cogerlos quita las formas, dejarlos allí las dibuja otra vez.
  { id: "oars_up", match: { verb: "take", obj: "oars" }, if: [{ "player.at": "huts" }, { "oars.at": "huts" }],
    do: [{ draw: "huts", remove: ["oars_shaft", "oars_blade"] }], then: "default" },
  { id: "oars_down", match: { verb: "drop", obj: "oars" }, if: [{ "player.at": "huts" }, { "oars.at": "player" }],
    do: [{ draw: "huts", add: ["poly oars_shaft 138,110 168,113 168,116 138,113 7", "ellipse oars_blade 172,115,5,2 15"] }], then: "default" },
  { id: "oars_in_boat", match: { verb: ["put", "use"], obj: "oars", obj2: "boat" }, if: [holding("oars")],
    do: [{ move: "oars", to: "boat" }, { set: "boat.examine", to: "Pequeña y azul, con los remos en las horquillas, lista." },
         { say: "Pones los remos en las horquillas. Encajan como si llevaran tiempo esperando." }] },
  { id: "oars_from_boat", match: { verb: "take", obj: "oars" }, if: [{ "oars.at": "boat" }],
    do: [{ move: "oars", to: "player" }, { set: "boat.examine", to: "Pequeña y azul, con un charco en el fondo. Tiene horquillas, pero no remos." }, { say: "Recoges los remos." }] },
  { id: "row_out", match: { verb: ["row", "enter"], obj: [null, "boat", "oars"] }, if: [at("pier_end"), oarsReady], do: [{ change: "row_out" }] },
  { id: "row_out_use", match: { verb: "use", obj: ["boat", "oars"], obj2: [null] }, if: [at("pier_end"), oarsReady], do: [{ change: "row_out" }] },   // (USAR con una segunda cosa es poner, abrir con llave o dar)
  { id: "row_out_north", match: { verb: "go", dir: "n" }, if: [at("pier_end"), oarsReady], do: [{ change: "row_out" }] },
  { id: "row_back", match: { verb: ["row", "exit"], obj: [null, "boat", "oars"] }, if: [at("lighthouse_base")], do: [{ change: "row_back" }] },
  { id: "row_back_boat", match: { verb: ["enter", "use"], obj: ["boat", "oars"] }, if: [at("lighthouse_base")], do: [{ change: "row_back" }] },
  { id: "row_back_south", match: { verb: "go", dir: "s" }, if: [at("lighthouse_base")], do: [{ change: "row_back" }] },
  { id: "lighthouse_in", match: { verb: ["enter", "climb"], obj: [null] }, if: [at("lighthouse_base")],
    do: [{ say: "Entras y subes. La escalera da vueltas y más vueltas, y cuentas los peldaños hasta perder la cuenta." }, { travel: "lantern" }, { describe: "$here" }] },
  { id: "row_no_oars", match: { verb: ["row", "enter"], obj: [null, "boat"] }, if: [at("pier_end")],
    do: [{ say: "Te sientas en la barca. Sin remos no va a ninguna parte. El mar la mece, paciente, como una cuna que nadie vigila." }] },
  { id: "row_nowhere", match: { verb: "row" }, do: [{ say: "Aquí no hay dónde remar." }] },

  // -- Las dunas -------------------------------------------------------------------------------------------------

  // -- El tiovivo: una vuelta te calma -----------------------------------------------------------------------
  { id: "ride", match: { verb: ["ride", "climb", "sit", "enter"], obj: [null, "horse"] }, if: [at("carousel"), { "horse.rode": { "!=": true } }],
    do: [tension(-10), { set: "horse.rode", to: true }, { say: [
      "Das una vuelta. Cada vez que pasas frente al paseo marítimo, se enciende una ventana distinta del hotel y en cada una hay alguien que se te parece, asomado.",
      "Montas. La melodía casi se detiene y vuelve a empezar. Durante una vuelta entera tienes cinco años, y alguien te saluda con la mano.",
      "Vas dando vueltas. El faro, el hotel, el mar; el faro, el hotel, el mar. Es muy tranquilizador, para un tiovivo sin nadie encima."
    ] }] },

  { id: "ride_again", match: { verb: ["ride", "climb", "sit", "enter"], obj: [null, "horse"] }, if: [at("carousel")],
    do: [{ say: "Vuelves a montar. Ahora es solo un tiovivo, y gira." }] },

  // -- El hotel ------------------------------------------------------------------------------------------------
  { id: "dining_first", match: { verb: "go", dir: "w" }, if: [at("lobby")], once: true,
    do: [tension(3)], then: "default" },
  { id: "dining_stuck", match: { verb: ["go", "exit", "enter"] }, if: [{ "player.seated": true }],
    do: [{ say: "No se te ocurre una forma educada de marcharte mientras sigues en la silla. La conversación se ha vuelto, cálida, hacia ti." }] },
  { id: "dining_sit", match: { verb: ["sit", "enter"], obj: [null, "chair"] }, if: [at("dining"), { "player.seated": { "!=": true } }],
    do: [{ set: "player.seated", to: true }, tension(10),
         { say: "Te sientas. Alguien te pasa la sal. La conversación se vuelve hacia ti, y es cálida, y cuesta mucho encontrar una razón para levantarse." }] },
  { id: "dining_stand", match: { verb: ["stand", "exit"] }, if: [{ "player.seated": true }],
    do: [{ set: "player.seated", to: false }, { say: "Te levantas. Nadie se opone. Nadie lo nota. Es sorprendentemente fácil, lo cual, de algún modo, es peor." }] },
  { id: "hallway_door", match: { verb: ["enter", "go", "open", "push"], obj: "door11" },
    do: [{ travel: "room11" }, { describe: "$here" }] },
  { id: "letter_read", match: { verb: ["read", "examine"], obj: "letter" }, once: true,
    do: [tension(-5), { say: "$obj.examine" }] },

  // -- Correos: sin nombre no hay correo; la caracola responde por ti -----------------------------------------------
  { id: "post_shell", match: { verb: ["give", "show"], obj: "shell" }, if: [at("post_office"), holding("shell"), { "postmaster.gave": { "!=": true } }],
    do: [{ set: "postmaster.gave", to: true }, { move: "parcel", to: "player" },
         { say: "Se lleva la caracola al oído y escucha un buen rato. «Planta menos cuatro», dice por fin. «Hace años que tenemos algo para ti». Te devuelve la caracola y desliza bajo la reja un {paquete|parcel} pequeño." }] },
  { id: "post_talk_done", match: { verb: ["talk", "ask", "say"], obj: [null, "postmaster"] }, if: [at("post_office"), { "postmaster.gave": true }, notAsking],
    do: [{ say: "«Eso es todo lo que era tuyo», dice. «Lo demás sigue dirigido a otro»." }] },
  { id: "post_talk", match: { verb: ["talk", "ask", "say"], obj: [null, "postmaster"] }, if: [at("post_office"), notAsking],
    do: [{ say: "«¿Nombre?», pregunta. Abres la boca. Tu nombre está con una puerta en la playa. «Sin nombre no hay correo», dice, sin dureza. «A no ser que alguien responda de dónde vienes»." }] },
  { id: "post_shell_again", match: { verb: ["give", "show"], obj: "shell" }, if: [at("post_office"), { "postmaster.gave": true }],
    do: [{ say: "«Ya he escuchado», dice. «Tienes todo lo que era tuyo»." }] },
  { id: "post_give_other", match: { verb: ["give", "show"], obj2: "postmaster" },
    do: [{ say: "Lo mira por encima de las gafas y te lo devuelve. «Eso no dice de dónde vienes»." }] },
  { id: "parcel_open", match: { verb: ["open", "search", "attack"], obj: "parcel" }, if: [holding("parcel")],
    do: [{ remove: "object", id: "parcel" }, { move: "key", to: "player" },
         { say: "Dentro, envuelta en una hoja del boletín del Ministerio, hay una {llave|key} de latón con una etiqueta. En la etiqueta, con tu letra: 7." }] },

  // -- El café: el café te calma ----------------------------------------------------------------------------
  { id: "cafe_order", match: { verb: ["talk", "ask", "order", "say", "drink"], obj: [null, "waiter", "coffee"] }, if: [at("cafe"), { "coffee.at": { "!=": "cafe" } }, { "coffee.had": { "!=": true } }, notAsking],
    do: [{ move: "coffee", to: "cafe" }, { say: "Antes de que digas nada, te pone una {taza de café|coffee} en la mesa. «Lo de siempre», dice. Nunca has estado aquí." }] },
  { id: "coffee_drink", match: { verb: ["drink", "eat", "take", "taste"], obj: "coffee" }, if: [{ "coffee.at": "cafe" }],
    do: [{ move: "coffee", to: null }, { set: "coffee.had", to: true }, tension(-15), { say: "Sabe a una mañana que no tuviste. Las manos dejan de temblarte. No habías notado que temblaban." }] },

  { id: "cafe_again", match: { verb: ["order", "ask"], obj: ["waiter", "coffee"] }, if: [at("cafe"), { "coffee.had": true }, { "coffee.at": null }],
    do: [{ say: "«Lo de siempre», dice, y mira la servilleta. «Ya lo tomaste. Es lo único que hay, los domingos»." }] },

  // -- La plaza y la estación -------------------------------------------------------------------------------------
  { id: "station_south", match: { verb: "go", dir: "s" }, if: [at("station")],
    do: [{ say: "Sigues las vías un trecho. Donde acaban, la oscuridad continúa y no hay dónde pisar. Vuelves." }] },
  { id: "pier_end_north", match: { verb: "go", dir: "n" }, if: [at("pier_end")],
    do: [{ say: "Por ahí solo hay agua. La barca podría llevarte, si tuvieras con qué remar." }] },

  // -- La linterna: lo que aceptas olvidar -----------------------------------------------------------------------
  { id: "burn_photograph", match: { verb: ["put", "burn", "throw", "give", "use"], obj: "photograph", obj2: [null, "lamp"] }, if: [at("lantern"), holding("photograph")], do: [{ change: "end_photograph" }] },
  { id: "light_photograph", match: { verb: "switch_on", obj: "lamp", obj2: "photograph" }, if: [at("lantern"), holding("photograph")], do: [{ change: "end_photograph" }] },
  // (La puerta se vuelve madera de deriva con la caracola, a menos que la tensión ya la haya cerrado: el cambio se negaría.)
  { id: "burn_shell", match: { verb: ["put", "burn", "throw", "give", "use"], obj: "shell", obj2: [null, "lamp"] }, if: [at("lantern"), holding("shell"), { "beach_door.shut": { "!=": true } }], do: [{ change: "driftwood" }, { change: "end_shell" }] },
  { id: "burn_shell_late", match: { verb: ["put", "burn", "throw", "give", "use"], obj: "shell", obj2: [null, "lamp"] }, if: [at("lantern"), holding("shell")], do: [{ change: "end_shell" }] },
  { id: "light_shell", match: { verb: "switch_on", obj: "lamp", obj2: "shell" }, if: [at("lantern"), holding("shell"), { "beach_door.shut": { "!=": true } }], do: [{ change: "driftwood" }, { change: "end_shell" }] },
  { id: "light_shell_late", match: { verb: "switch_on", obj: "lamp", obj2: "shell" }, if: [at("lantern"), holding("shell")], do: [{ change: "end_shell" }] },
  { id: "burn_other", match: { verb: ["put", "burn", "throw", "give"], obj2: "lamp" }, if: [at("lantern")],
    do: [{ say: ["La lámpara no lo acepta. Eso no es algo que pudieras olvidar.", "La mecha sigue seca. Eso no. Algo que echarías de menos."] }] },
  { id: "burn_any", match: { verb: "burn" }, if: [at("lantern")],
    do: [{ say: "La lámpara solo quema lo que aceptes olvidar. Tienes que elegirlo, y ponerlo dentro." }] },
  { id: "burn_nothing", match: { verb: "burn" }, do: [{ say: "No tienes con qué quemarlo." }] },

  // -- Tensión: sube despacio una vez cruzada la puerta; la puerta avisa, luego se cierra ---------------------------
  { id: "tension_creep", when: "every", every: { seconds: [45, 90] },
    do: [tension(3)] },
  { id: "door_warning", when: "every", every: { seconds: [40, 80] }, if: [{ "game.tension": { ">=": 60 } }, { "beach_door.shut": { "!=": true } }],
    do: [{ say: ["A lo lejos, en la playa, algo toma aire, lento y superficial. La puerta respira menos que antes.", "Piensas en [way]. No recuerdas con seguridad en qué dirección estaba.", "La luz de la puerta, en algún lugar a tu espalda, es un poco más tenue. Un poco más pequeña."] }] },
  { id: "door_closes", when: "every", every: { turns: [1, 1] }, if: [{ "game.tension": { ">=": 95 } }, { "beach_door.shut": { "!=": true } }],
    do: [{ change: "driftwood" },
         { say: "A lo lejos, [way] se cierra, con un sonido como de un aliento contenido que se suelta. Lo notas en el pecho, como un escalón que falta. El camino de vuelta ha desaparecido." }] }
];

// ---- Puzles, descritos como datos (GUIDE.md §3) --------------------------------------------------------------
// Las reglas de arriba hacen el trabajo; esto dice lo que necesita cada puzle, las órdenes que lo resuelven y lo que da, para que
// js/check.js pueda jugar cada final con el intérprete y el motor de verdad. Las pistas nombran los objetos, reglas o puzles
// que lo señalan.
const puzzles = {
  vouch:      { where: "post_office", needs: ["shell"], solve: ["dar caracola a administrador"], gives: ["parcel"],
                clues: ["letter", "guests", "post_talk"],
                hints: ["El administrador no da nada a quien no tiene nombre, pero se fía del mar. Algo que la marea dejó en la arena podría responder por ti.", "Lleva la caracola pálida de la línea de la marea hasta Correos y deja que el administrador la escuche."] },
  open_parcel: { needs: ["parcel"], solve: ["abrir paquete"], gives: ["key"], clues: ["parcel", "post_shell"],
                hints: ["El paquete está dirigido con tu letra, y el cordel es solo cordel.", "Deshaz el paquete entre las manos; lo que hay dentro es pequeño y de latón."] },
  open_hut:   { where: "huts", needs: ["key"], solve: ["abrir caseta con llave"], gives: ["oars", "photograph"],
                clues: ["letter", "cave_voice", "hut"],
                hints: ["Una de las casetas de baño está recién pintada, como si esperaran a alguien, y su candado es nuevo. Tu etiqueta dice siete.", "La llave de latón del paquete es del candado de la caseta 7, en las casetas de baño. Dentro, coge lo que encuentres."] },
  row_out:    { where: "pier_end", needs: ["oars"], solve: ["meter remos en barca", "remar"], reaches: "lighthouse_base",
                clues: ["boat", "letter", "lighthouse_near"],
                hints: ["La barca del extremo del muelle tiene horquillas y nada que poner en ellas. La caseta 7 guardaba algo gastado por manos como las tuyas.", "Lleva los remos de la caseta 7 a la barca del extremo del muelle, ponlos en las horquillas y rema hasta el faro."] },
  forget_photograph: { where: "lantern", needs: ["photograph", "row_out"], solve: ["meter fotografia en lampara"], ending: true,
                clues: ["lamp", "letter", "guests"],
                hints: ["La lámpara solo quema lo que aceptes olvidar. Una de las cosas que llevas es una vida que no tuviste.", "En la linterna, dale a la lámpara la fotografía de la caseta 7."] },
  forget_shell: { where: "lantern", needs: ["shell", "row_out"], solve: ["quemar caracola"], ending: true,
                clues: ["lamp", "letter", "cave_voice"],
                hints: ["A la lámpara le da igual qué sea, con tal de que elijas. Una de las cosas que llevas es el mar hablando por ti, y el Ministerio todavía dentro.", "En la linterna, quema la caracola de la línea de la marea, y deja que el Ministerio te olvide."] }
};

// ---- La apertura, declarada (BRIEF.md §3): los ids de su sala y de sus cuatro cosas, y las líneas que dice --------------------
const opening = {
  room: "corridor", restart: "stamp", hints: "suggestion_box", intro: "memo", way: "green_door",
  lines: {
    notYet: "La respiración se detiene. Desde muy lejos, una voz dice: «Con las manos vacías no. Algo con lo que empezar de nuevo y algo a lo que escuchar».",
    notYetRestart: "La respiración se detiene. «Se te ha olvidado algo», dice la voz lejana. «Algo con lo que empezar de nuevo. Está en el suelo».",
    notYetHints: "La respiración se detiene. «Te hará falta alguien con quien hablar», dice la voz lejana. «El buzón de sugerencias todavía escucha».",
    through: "Te arrodillas y llamas tres veces. La respiración cesa. Desde muy lejos, una voz pregunta: «¿Cómo te llamas?». Se lo dices, y se queda con él. La placa de latón se ablanda y gotea sobre el linóleo, y la puerta se abre hacia dentro. Es muy pequeña, y luego ya no lo es.",
    askRestart: "¿Apretar el sello contra tu palma y empezar de nuevo?",
    restartYes: "El sello baja: «Volver a presentar», en verde, sobre tu piel. El pasillo se pliega por sus dobleces como un formulario, y…",
    restartNo: "Apartas el sello. La tinta no te ha tocado. Todavía no.",
    hintFrame: "Pegas la oreja a la ranura. En otro punto del Ministerio, alguien lee en voz alta una sugerencia:",
    farewell: "El memorando se arruga por sus pliegues, uno a uno, como si lo archivaran, y ya no está en tu mano."
  }
};

// ---- El conjunto de cambios ---------------------------------------------------------------------------------------
export default {
  because: "El jugador dio su nombre en la puerta verde; el mundo de detrás está construido.",
  opening,
  // Las propiedades que guardan las reglas de este mundo (ARCHITECTURE.md §3, "Fields and properties"); las del motor no se declaran.
  properties: {
    "coffee.had": { type: "boolean", start: false },        // ya se ha tomado el único café
    "horse.rode": { type: "boolean", start: false },        // ya se ha dado la única vuelta que calma
    "beach_door.shut": { type: "boolean", start: false },   // la puerta de la playa se ha cerrado a tu espalda
    "player.waded": { type: "boolean", start: false },   // has entrado en el mar
    "player.seated": { type: "boolean", start: false },   // estás sentado a la mesa del comedor
    "postmaster.gave": { type: "boolean", start: false }   // el administrador ha entregado el paquete
  },
  facts: [
    "Tras la puerta verde: una playa de noche, un pueblo de costa en un domingo sin fin, un faro apagado.",
    "El nombre del jugador se queda con la puerta; nadie en el pueblo puede oírlo.",
    "La lámpara del faro solo quema lo que el jugador acepta olvidar: la fotografía o la caracola."
  ],
  effects: [
    { time: "day 1 08:55", weekday: "mon" },                 // la apertura es una mañana de lunes en el Ministerio
    // Lo que hace llegar: la hora del pueblo y su primera línea.
    { add: "change", id: "arrival", effects: [
      { time: "day 1 17:15", weekday: "sun" },
      { say: "El aire es salado. En algún sitio un reloj marca [time], y es domingo, y a nadie le importa." }
    ] },
    // El humor del mundo, según la tensión
    { set: "game.moods", to: [
      { below: 20, text: "Suficientemente conforme" }, { below: 40, text: "Algo añorante" }, { below: 60, text: "En vilo" },
      { below: 80, text: "Sin aliento" }, { below: 101, text: "A punto de quedarte sin domingo" }
    ] },
    // Verbos que solo necesita este mundo
    { add: "word", verb: "row", words: ["remar", "rema", "reme", "bogar", "boga", "remar hacia", "rema hacia", "remar hasta", "rema hasta", "remar de vuelta", "rema de vuelta"] },
    { add: "word", verb: "swim", words: ["nadar", "nada", "nade", "nado", "bañarse", "bañate", "me baño", "darse un baño", "zambullirse", "zambullete", "bucear", "bucea", "vadear", "vadea", "ir a nadar", "nadar en", "nada en"], object: "optional" },
    { add: "word", verb: "burn", words: ["quemar", "quema", "queme", "quemo", "incinerar", "incinera", "prender fuego a", "prende fuego a", "dar fuego a", "da fuego a", "sacrificar", "sacrifica", "olvidar", "olvida", "olvide", "olvido"] },
    { add: "word", verb: "ride", words: ["cabalgar", "cabalga", "cabalgo", "dar una vuelta", "da una vuelta", "dar vueltas", "da vueltas"] },
    { add: "word", verb: "order", words: ["pedir", "pide", "pida", "pido", "encargar", "encarga"], absent: true },   // "pide un café": todavía no está aquí

    // Puzles (descripciones, para el verificador)
    ...Object.entries(puzzles).map(([id, p]) => ({ add: "puzzle", id, ...p })),

    // Cambios con nombre (los ejecutan las reglas con { change: nombre })
    ...Object.entries(changes).map(([id, effects]) => ({ add: "change", id, effects })),

    // Salas, objetos y reglas
    ...Object.entries(endings).map(([id, e]) => ({ add: "picture", id, ...e, alt: endingAlt[id] ?? e.alt })),
    ...Object.entries(rooms).map(([id, r]) => ({ add: "room", id, ...r, picture: localized(id) })),
    ...Object.entries(objects).map(([id, o]) => ({ add: "object", id, ...o })),
    ...rules.map((rule) => ({ add: "rule", rule })),

    // Adónde lleva el camino de la apertura.
    { set: "game.entrance", to: "beach" }
  ]
};
