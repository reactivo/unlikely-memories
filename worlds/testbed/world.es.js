// «Testbed»: un mundo que guarda todos los mecanismos que tiene el motor, en pocas salas, en español. Una herramienta, no una
// historia: escrito a mano a partir de los documentos del motor (BRIEF.md, ARCHITECTURE.md, MUSIC.md), corto y llano, con un
// ejemplo de cada cosa que el motor acepta. No es una traducción: mismos ids, mismas salas, mismas reglas y mismos finales que
// world.en.js; cambian las palabras. Un solo conjunto de cambios, todo o nada; datos llanos.
//
// El mapa: la apertura (una sala de admisión), luego un centro con un camino corto a la sala de cada mecanismo. Todos los ids
// de sala empiezan por `tb-`. Es el mismo mapa que el de world.en.js (cabecera de ese archivo).

import pictures, { endings, visions } from "./pictures.js";
import music, { rooms as roomMusic } from "./music.js";
import levels from "./levels.js";
import sprites from "./sprites.js";

// ---- La biblia del juego -----------------------------------------------------------------------------------------------
export const bible = {
  title: "Testbed",
  blurb: "Todos los mecanismos del juego, en pocas salas: para probar cosas y para las comprobaciones. Aquí no hay historia; todo lo que hay funciona.",
  thumbnail: { picture: "tb-hub", x: 48 },
  synopsis: "Eres quien prueba, y esto es el piso de pruebas: un centro con un camino corto hasta cada cosa que el juego sabe hacer. " +
    "Salud y daños, bebidas y estados, sueño y sueños, un gato que te sigue y un vigilante en su ronda, puertas, cerraduras y " +
    "recipientes, gente y preguntas, una palanca, una azotea. Aquí no hay historia. Todo lo que hay funciona.",
  tone: "Llano y corto. Cada sala dice para qué sirve y enseña una sola cosa. Ninguna broma que estorbe a la prueba.",
  start: "Lunes, mediodía, en el centro (la apertura, en la sala de admisión, también a mediodía).",
  opening: "Una sala de admisión con un torniquete: un auricular (pistas), una papeleta que ya llevas, y el torniquete hacia el centro.",
  music: "dórico lento; un hilo de señal y una campana de banco; un tono de prueba que nunca se asienta",
  rules: [
    "Cada sala sirve para un mecanismo, y lo enseña una vez.",
    "Todo lo que el motor acepta está en algún sitio de este piso.",
    "Aquí nada es una historia, y nada está escondido.",
    "Todos los finales se alcanzan solo con los puzles."
  ],
  characters: ["Dot, que lleva el bar", "La señora Oduya, que lleva el libro", "un gato, un vigilante, un pájaro y un oficinista de noche"],
  endings: ["Luz: pon el fusible en el zócalo del laboratorio y tira de la palanca", "Nombrada: di cuyo nombre va en el libro",
    "Caída: salta desde la azotea", "Muerte: te quedas sin salud"],
  chaos: 0
};

// Las cosas llevadas tienen sus sprites (sprites.js): el que se ve al examinarlas y el que se dibuja en el suelo.
const item = (id) => ({ sprite: sprites[id], ...(sprites[id + "_floor"] ? { floorSprite: sprites[id + "_floor"] } : {}) });
const hours = (a, b) => ({ "time.hour": { between: [a, b] } });

// ---- Las imágenes de los finales y la visión -------------------------------------------------------------------------------
const endingPictures = {
  lit: { alt: "Muy de cerca, una palanca echada en su ranura de acero, una luz verde encendida encima y una gruesa línea de chispas blancas que se aleja por un cable.", picture: endings.lit },
  named: { alt: "Muy de cerca, un libro mayor abierto sobre un escritorio de madera, una columna de nombres en tinta negra y un nombre escrito el último, con una pluma a su lado.", picture: endings.named },
  fell: { alt: "Desde muy arriba, una azotea plana y una figura oscura y pequeña en su borde, con la calle muy abajo, gris en el crepúsculo.", picture: endings.fell },
  died: { alt: "Muy de cerca, una placa de púas cortas de acero sobre un suelo blanco, una sola gota roja en la más cercana.", picture: endings.died }
};
const visionPictures = {
  hammock_dream: { alt: "Un sueño del piso de pruebas visto desde arriba: cada sala, un cuadrado iluminado en una cuadrícula, una fina línea amarilla que los une, y un cuadrado, el centro, brillando en blanco.", picture: visions.hammock_dream }
};

// ---- Salas ---------------------------------------------------------------------------------------------------------------
const rooms = {
  "tb-start": {
    name: "ADMISIÓN", area: "start", at: [0, 0, 0],
    describe: [
      "Una sala blanca y pequeña, con una luz en el techo y nada en las paredes. Aquí dejan entrar a quien viene a probar.",
      "La única salida es el {torniquete|gate} de la pared norte."
    ],
    exits: { n: true },
    scenery: [
      { words: ["pared", "paredes", "suelo", "techo"], name: "las paredes", says: "Blancas, limpias, y iguales por todas partes." },
      { words: ["luz", "lampara", "bombilla"], name: "la luz", says: "Una luz blanca y plana, sin foco y sin sombra." }
    ],
    ambience: { lines: ["La luz zumba en una sola nota.", "Detrás de la pared alguien acciona un interruptor, y lo devuelve."], every: [25, 60] },
    alt: "Una sala blanca y pequeña vista desde la puerta: una luz plana en el techo, las paredes desnudas y, al fondo, un torniquete de barras de acero.",
    overlayAlt: { handset: "Un auricular gris cuelga de un gancho junto al torniquete." }
  },
  "tb-hub": {
    name: "EL CENTRO", area: "hub", at: [0, 0, 0],
    describe: [
      "Una sala redonda con una puerta en cada pared. Un {tablón|board} anuncia lo que hay detrás de cada una: la clínica al norte, el bar al este, el dormitorio al sur, el patio al oeste.",
      "Unas escaleras de hierro suben a los accesos, y unos escalones de piedra bajan al sótano."
    ],
    exits: { n: "tb-clinic", e: { to: "tb-bar", in: true }, s: "tb-bedroom", w: "tb-yard", u: "tb-ways", d: "tb-cellar" },
    scenery: [
      { words: ["escaleras", "escalera"], name: "las escaleras", says: "Escaleras de hierro que suben a un descansillo y una puerta.", leads: "u" },
      { words: ["escalones", "escalon", "peldanos"], name: "los escalones", says: "Escalones de piedra, gastados en el centro, que bajan al frío.", leads: "d" },
      { words: ["puertas", "puerta", "paredes", "pared"], name: "las puertas", says: "Seis puertas del mismo gris liso. Encima de cada una hay un nombre pintado." }
    ],
    ambience: { lines: ["Todas las puertas del centro hacen clic, una tras otra.", "Una corriente de aire recorre el centro y prueba cada puerta."], every: [30, 70], chance: 0.6 },
    sleep: "En el centro no: las puertas no dejarían de abrirse.",
    listen: "Seis puertas, respirando despacio.",
    smell: "Cera de suelo y un poco de ozono.",
    alt: "Una sala redonda vista desde el medio: una hilera de puertas de colores en una pared curva, cada una con una forma pintada encima, unas escaleras de hierro que suben a la izquierda y unos escalones de piedra que bajan a la derecha.",
    overlayAlt: { badge: "Una chapa de latón yace en el suelo junto al tablón.", cat: "Un gato gris camina a tu lado." }
  },

  // La clínica: salud, daños y curas, muerte. Al este, el laboratorio.
  "tb-clinic": {
    name: "CLÍNICA", area: "hub", at: [0, -1, 0],
    describe: [
      "Una sala de azulejos con una cama, un {armario|cabinet} de acero y una {rejilla|vent} en la pared. Una placa cuadrada de {púas|spike} cortas está hundida en el suelo, con un cartel que dice Prohibido Pisar.",
      "El centro está al sur. El laboratorio, al este."
    ],
    exits: { n: false, s: "tb-hub", e: "tb-lab" },
    scenery: [
      { words: ["cama", "camilla", "catre"], name: "la cama", says: "Una cama estrecha con la manta doblada en cuadro. Nadie se ha echado en ella." },
      { words: ["cartel", "placa"], name: "el cartel", says: "Prohibido Pisar, en rojo." },
      { words: ["azulejos", "azulejo", "suelo"], name: "los azulejos", says: "Azulejos blancos, con juntas grises. Están fríos." }
    ],
    ambience: { lines: ["La rejilla suspira.", "Cae una gota sobre un azulejo, y nadie la seca."], every: [30, 70] },
    alt: "Una sala de azulejos blancos: un armario de acero a la derecha, una rejilla cuadrada alta en la pared, una cama estrecha al fondo y, delante, una placa de púas cortas de acero hundida en el suelo.",
    overlayAlt: { pill: "Una pastilla blanca y pequeña yace sobre la cama." }
  },
  "tb-lab": {
    name: "LABORATORIO", area: "hub", at: [1, -1, 0],
    describe: [
      "Una sala de banco, llena de cables. Una {palanca|lever} se alza en una ranura de acero junto a un {zócalo|socket} abierto, un {dial} está en la pared y un {botón|button} brilla junto a la puerta. Una {radio} sisea en una balda.",
      "Un gancho cuelga del techo. La clínica está al oeste."
    ],
    exits: { w: { to: "tb-clinic", out: true } },
    scenery: [
      { words: ["gancho", "techo"], name: "el gancho", id: "hook", says: "Un gancho de hierro en el techo, para algo largo." },
      { words: ["cables", "cable", "banco", "balda"], name: "los cables", says: "Cables negros, pegados con cinta al banco y entre sí." }
    ],
    ambience: { lines: ["Algo en la pared hace tic, y se calma.", "Un cable se calienta, y se enfría."], every: [30, 70] },
    alt: "Una sala baja de banco llena de cables negros: una palanca alta de acero en una ranura a la derecha, un zócalo abierto a su lado, un dial redondo en la pared, un botón verde encendido junto a la puerta y una radio pequeña en una balda.",
    overlayAlt: { wire: "Un rollo de hilo yace sobre el banco." }
  },

  // El bar: estados, y cosas que vienen de alguien. Al este, el despacho.
  "tb-bar": {
    name: "EL BAR", area: "hub", at: [1, 0, 0],
    describe: [
      "Un bar largo y bajo con un solo taburete. {Dot|dot} lo lleva. Una {estufa|stove} brilla en un rincón, y un {cubo de hielo|ice} está junto a la puerta.",
      "El centro está al oeste, y el despacho al este."
    ],
    exits: { w: "tb-hub", e: "tb-office" },
    scenery: [
      { words: ["barra", "mostrador", "taburete"], name: "la barra", says: "Un tablón largo sobre dos barriles. Un taburete, que no usa nadie." },
      { words: ["puerta"], name: "la puerta", says: "La puerta al centro.", leads: "w" }
    ],
    ambience: { lines: ["La estufa cruje al enfriarse y al calentarse.", "Dejan un vaso, lo recogen y lo dejan otra vez."], every: [25, 60], chance: 0.8 },
    sleep: "En el bar no, con Dot mirándote.",
    alt: "Un bar largo y bajo con luz cálida: un mostrador de madera en medio con una camarera detrás, una estufa al rojo vivo en el rincón y un cubo de hielo blanco junto a la puerta, a la derecha.",
    overlayAlt: { coin: "Una moneda yace sobre la barra.", green: "Un vaso alto y verde está sobre la barra." }
  },
  "tb-office": {
    name: "DESPACHO", area: "hub", at: [2, 0, 0],
    describe: [
      "Un despacho pequeño con un escritorio alto. {La señora Oduya|oduya} se sienta detrás con un {libro mayor|ledger} y no levanta la vista.",
      "Un día de la semana está en un marco de la pared. El bar está al oeste."
    ],
    exits: { w: "tb-bar" },
    scenery: [
      { words: ["escritorio", "mesa"], name: "el escritorio", says: "Un escritorio alto, demasiado ordenado." },
      { words: ["marco", "pared"], name: "el marco", says: "Un marco con una sola palabra y una fina línea de polvo en lo alto." }
    ],
    mentions: ["lunes"],
    sleep: "En el despacho no. La señora Oduya lo apuntaría.",
    alt: "Un despacho pequeño: un escritorio alto de madera ocupa la sala, detrás una mujer con una rebeca gris y, delante de ella, un libro grueso abierto; en la pared, un marco pequeño.",
    overlayAlt: {}
  },

  // El dormitorio: sueño, sueños, visiones, tiempo.
  "tb-bedroom": {
    name: "DORMITORIO", area: "hub", at: [0, 1, 0],
    describe: [
      "Una sala en penumbra con una {litera|bunk} contra una pared y una {hamaca|hammock} tendida contra la otra. Una {lámpara|lamp} arde sobre una mesa, y un {reloj|clock} hace tictac encima.",
      "El centro está al norte."
    ],
    exits: { n: "tb-hub" },
    scenery: [{ words: ["mesa"], name: "la mesa", says: "Una mesa pequeña con sitio para una lámpara y poco más." }],
    ambience: { lines: ["El reloj hace tictac, y tictac, y se le ocurre algo.", "La hamaca se mece, como si alguien acabara de bajarse."], every: [30, 70] },
    waitFor: { time: "next 07:00", says: "Te tumbas en la litera, despierto, hasta que se hace de día.", if: [hours(22, 7)] },
    dream: { says: "Sueñas con un piso vacío, con una luz encendida y una sola puerta abierta." },
    alt: "Una sala en penumbra: una litera baja a la izquierda, una hamaca tendida al fondo, una mesa pequeña en medio con una lámpara amarilla y un reloj redondo en la pared, encima.",
    overlayAlt: {}
  },

  // El patio y el callejón: cosas que se mueven.
  "tb-yard": {
    name: "EL PATIO", area: "hub", at: [-1, 0, 0],
    describe: [
      "Un patio pelado de tierra apisonada, con un {banco|bench} contra el muro y una verja pequeña al callejón. El cielo es bajo y la luz, plana.",
      "El centro está al este. El callejón, al oeste, y un hueco en el muro lleva al norte, rodeándolo."
    ],
    exits: { e: "tb-hub", w: "tb-lane", n: { to: "tb-lane", passage: true } },
    scenery: [
      { words: ["verja", "reja"], name: "la verja", says: "Una verja de hierro pequeña, abierta.", leads: "w" },
      { words: ["muro", "tierra", "cielo"], name: "el muro", says: "Un muro de ladrillo, sin nada encima." },
      { words: ["hueco", "agujero"], name: "el hueco", says: "Un hueco en el muro, justo de ancho, que da la vuelta hasta el callejón.", leads: "n" }
    ],
    ambience: { lines: ["Una ráfaga cruza el patio y se va.", "El polvo da vueltas junto al banco."], every: [30, 70] },
    alt: "Un patio pelado de tierra marrón apisonada bajo un cielo gris y bajo, con un banco de madera contra un muro de ladrillo a la izquierda y una verja de hierro abierta al fondo, a la derecha.",
    overlayAlt: { cat: "Un gato gris está sentado en la tierra.", watchman: "Un vigilante de abrigo largo está junto al muro.", bird: "Un pajarillo salta a lo largo del muro." }
  },
  "tb-lane": {
    name: "EL CALLEJÓN", area: "hub", at: [-2, 0, 0],
    describe: [
      "Un callejón estrecho entre muros en blanco, con una ventana iluminada al fondo. Está tranquilo.",
      "El patio está al este."
    ],
    exits: { e: "tb-yard" },
    scenery: [{ words: ["muros", "muro", "callejon", "pared", "paredes"], name: "los muros", says: "Ladrillo liso a ambos lados, rascado hasta quedar limpio." }],
    ambience: { lines: ["La luz de la ventana parpadea, y se queda.", "Algo pequeño roza el muro."], every: [30, 60], if: [hours(20, 6)] },
    waitFor: { time: "next 20:00", says: "Esperas en el callejón, y la luz tras la ventana sube un poco.", if: [hours(6, 20)] },
    sleep: "En el callejón no, con una ventana vigilando.",
    alt: "Un callejón estrecho entre dos muros de ladrillo lisos, que se aleja hacia una ventana amarilla iluminada al fondo, con el suelo empedrado.",
    overlayAlt: { cat: "Un gato gris está sentado en los adoquines.", watchman: "Un vigilante de abrigo largo recorre el callejón.", bird: "Un pajarillo está posado en un muro.", clerk: "Un oficinista de noche, con visera verde, está bajo la ventana." }
  },

  // Los accesos: todas las clases de salida.
  "tb-ways": {
    name: "LOS ACCESOS", area: "hub", at: [0, 0, 1],
    describe: [
      "Un descansillo con una salida de distinta clase a cada lado. Una gran {rueda|wheel} de hierro está en la pared, y una {escalera de mano|ladder} sube.",
      "Al norte está el anexo, tras un guardia. Al este, el rellano, y al oeste, el tobogán. Hay un armario en el rincón. El centro está abajo."
    ],
    exits: {
      n: { to: "tb-annex", requires: "pass", spends: true, lacking: "El guardia mira tus manos vacías y no se mueve." },
      e: { to: "tb-landing", if: hours(8, 20), closed: "La persiana está bajada. Un cartel dice ocho." },
      w: "tb-chute",
      in: "tb-closet",
      u: "tb-roof",
      d: "tb-hub"
    },
    scenery: [
      { words: ["guardia"], name: "el guardia", says: "Un guardia de gris está en la puerta del norte, con una mano tendida." },
      { words: ["persiana", "cartel"], name: "la persiana", says: "Una persiana de acero, con un cartel: Abierto de Ocho a Ocho." },
      { words: ["armario", "rincon"], name: "el armario", says: "Un armario bajo, con sitio para meterse.", leads: "in" },
      { words: ["tobogan", "agujero", "conducto"], name: "el tobogán", says: "Un conducto redondo en la pared del oeste, que baja y se aleja.", leads: "w" }
    ],
    ambience: { lines: ["La rueda da una vuelta sola, una vez.", "El guardia cambia el peso de pie y mantiene la mano tendida."], every: [30, 70] },
    sleep: "En los accesos no: el guardia pasaría por encima de ti.",
    alt: "Un descansillo desnudo con una rueda de hierro en la pared del fondo, una persiana de acero a la derecha, un conducto redondo a la izquierda, un guardia de gris en la puerta del fondo y una escalera de mano que sube.",
    overlayAlt: { pass: "Un pase blanco yace en el suelo." }
  },
  "tb-annex": {
    name: "ANEXO", area: "hub", at: [0, -1, 1],
    describe: [
      "Un anexo estrecho forrado de estanterías. Un gancho de latón cuelga del techo sobre el medio de la sala.",
      "Los accesos están al sur."
    ],
    exits: { s: "tb-ways" },
    scenery: [
      { words: ["gancho"], name: "el gancho", id: "annex_hook", says: "Un gancho de latón en el techo, sobre el medio de la sala." },
      { words: ["estanterias", "estanteria", "baldas"], name: "las estanterías", says: "Estanterías vacías, sin polvo." }
    ],
    alt: "Una sala larga y estrecha forrada de estanterías vacías, vista de frente, con un gancho de latón en el techo y una pértiga larga de madera tendida en el suelo.",
    overlayAlt: {}
  },
  "tb-landing": {
    name: "RELLANO", area: "hub", at: [1, 0, 1],
    describe: [
      "Un rellano corto con una barandilla. Un tramo de {escaleras|landing_stairs} sube.",
      "Los accesos están al oeste."
    ],
    exits: { w: "tb-ways", u: "tb-roof" },
    scenery: [{ words: ["barandilla", "rellano"], name: "la barandilla", says: "Una barandilla de acero, fría." }],
    alt: "Un rellano corto con una barandilla de acero al frente y un tramo estrecho de escaleras que sube por la pared del fondo hacia la oscuridad.",
    overlayAlt: {}
  },
  "tb-chute": {
    name: "EL TOBOGÁN", area: "hub", at: [-1, 0, 1],
    describe: [
      "Un tubo redondo de acero, inclinado. Hay una manija en el lado este que ya no gira.",
      "Sigue hacia abajo, hasta el patio."
    ],
    exits: { e: { to: "tb-ways", if: false, closed: "El camino de vuelta no tiene manija por este lado." }, d: "tb-yard" },
    scenery: [{ words: ["tubo", "manija", "acero"], name: "el tubo", says: "Acero pulido, con una pendiente suave hacia abajo." }],
    alt: "El interior de un tubo redondo de acero, inclinado, mirando hacia abajo, hacia un pequeño círculo brillante de tierra apisonada.",
    overlayAlt: {}
  },
  "tb-closet": {
    name: "ARMARIO", area: "hub", at: [0, 0, 2],
    placeholder: "Un armario con nada dentro, todavía.",
    exits: { out: "tb-ways" },
    alt: "El interior de un armario: tablas desnudas y una fina línea de luz bajo la puerta.",
    overlayAlt: {}
  },
  "tb-pit": {
    name: "EL FOSO", area: "hub", at: [0, 1, 1],
    describe: [
      "Un agujero cuadrado en el suelo de los accesos, cavado por una rueda. Está seco, y llega luz desde arriba.",
      "Un camino va al norte."
    ],
    exits: {},
    scenery: [{ words: ["agujero", "foso", "suelo", "hoyo"], name: "el foso", says: "Tierra seca y olor a monedas." }],
    alt: "Un foso cuadrado visto desde el fondo, con paredes de tierra rectas y un cuadrado de luz brillante muy arriba.",
    overlayAlt: {}
  },
  "tb-roof": {
    name: "LA AZOTEA", area: "hub", at: [0, 0, 3],
    describe: [
      "Una azotea plana con un parapeto bajo, y todo el piso extendido muy abajo. El viento es constante.",
      "El borde está cerca. Los accesos están abajo."
    ],
    exits: { d: "tb-ways" },
    scenery: [
      { words: ["borde", "parapeto", "vacio"], name: "el borde", says: "Un parapeto bajo y luego nada durante mucho trecho." },
      { words: ["viento"], name: "el viento", says: "Constante, del oeste, sin tiempo dentro." }
    ],
    ambience: { lines: ["El viento se apoya en ti, con educación.", "Muy abajo, una puerta se abre y se cierra."], every: [25, 60] },
    sleep: "En la azotea no, al borde.",
    alt: "Una azotea plana y gris con una luz fina de tarde, un parapeto bajo a lo largo del frente y la cuadrícula del piso de pruebas extendida muy abajo, como un plano.",
    overlayAlt: {}
  },

  // El sótano: puertas, cerraduras, pares, recipientes.
  "tb-cellar": {
    name: "EL SÓTANO", area: "hub", at: [0, 0, -1],
    describe: [
      "Un sótano bajo de piedra con tres puertas. La {puerta de la cámara|vault_door} está al este, y la {puerta de la despensa|cellar_door} al oeste. Un {cofre|chest} está junto a la pared, una {caja|box} en una balda y un {cubo|bin} debajo. Un {bote|boat} descansa sobre calzos.",
      "El centro está arriba. Un arco al norte lleva a un sonido de agua."
    ],
    exits: { u: "tb-hub", n: "tb-falls", e: "tb-vault", w: "tb-pantry" },
    scenery: [{ words: ["calzos", "pared", "balda", "piedra"], name: "la pared", says: "Piedra labrada, húmeda al tacto." }],
    mentions: ["trozo"],
    ambience: { lines: ["Gotea agua en algún sitio, y cuenta.", "El bote cruje sobre sus calzos, sin ir a ninguna parte."], every: [25, 60] },
    sleep: "En el sótano no: hay demasiada humedad.",
    alt: "Un sótano bajo de piedra con una puerta de cámara redonda de acero en la pared derecha, una puerta pequeña de madera a la izquierda, un cofre grande y oscuro junto a la pared del fondo y un bote pequeño sobre calzos en medio.",
    overlayAlt: {}
  },
  // La cascada: un cuadro que se mueve (una cascada que corre, destellos que parpadean cada uno a su aire, una antorcha, una bandera y una onda).
  "tb-falls": {
    name: "LA CASCADA", area: "hub", at: [0, -1, -1],
    describe: [
      "Una cueva húmeda con una cascada que cae por la pared del fondo a una charca ancha y negra. Una antorcha arde en un soporte a la izquierda, y una bandera cuelga de un asta a la derecha.",
      "El sótano está al sur."
    ],
    exits: { s: "tb-cellar" },
    scenery: [
      { words: ["cascada", "agua", "catarata"], name: "la cascada", says: "Agua, toda yendo hacia el mismo sitio." },
      { words: ["charca", "destellos"], name: "la charca", says: "Negra y ancha, con lucecitas que van y vienen." },
      { words: ["antorcha", "soporte", "llama"], name: "la antorcha", says: "Una antorcha, que arde baja y despareja." },
      { words: ["bandera", "asta", "banderín"], name: "la bandera", says: "Una bandera roja en un asta gris, que se mueve aunque no hay viento." }
    ],
    ambience: { lines: ["La cascada sigue, el mismo ruido en otro orden.", "La antorcha vacila, y se recupera."], every: [25, 60] },
    sleep: "Junto al agua no: el ruido se metería en el sueño.",
    alt: "Una cueva húmeda de piedra con una cascada alta que cae por el centro de la pared del fondo a una charca ancha y oscura, lucecitas que destellan en el agua, una antorcha en un soporte de la pared izquierda y una bandera roja en un asta a la derecha.",
    overlayAlt: {}
  },
  "tb-vault": {
    name: "LA CÁMARA", area: "hub", at: [1, 0, -1],
    describe: [
      "Una sala de acero pequeña, vacía y brillante.",
      "El sótano está al oeste."
    ],
    exits: { w: "tb-cellar" },
    scenery: [{ words: ["sala", "acero", "paredes"], name: "las paredes", says: "Acero por todos lados, cepillado." }],
    alt: "Una sala pequeña y brillante de acero cepillado con una puerta redonda abierta a la izquierda, un suelo liso y nada en las paredes.",
    overlayAlt: { tin: "Una lata abollada está en el suelo." }
  },
  "tb-pantry": {
    name: "LA DESPENSA", area: "hub", at: [-1, 0, -1],
    describe: [
      "Una despensa estrecha de estantes de madera, iluminada por una rendija en la pared. Un {tarro|jar} está entre telarañas.",
      "El sótano está al este."
    ],
    exits: { e: "tb-cellar" },
    scenery: [{ words: ["estantes", "estante", "telaranas", "telarana", "rendija"], name: "los estantes", says: "Estantes de madera, colgados de telarañas viejas." }],
    alt: "Una despensa estrecha de estantes oscuros de madera con una rendija de luz blanca en la pared del fondo y un tarro pequeño de cristal en el estante del medio.",
    overlayAlt: {}
  }
};

// ---- Objetos ---------------------------------------------------------------------------------------------------------------
const objects = {
  // La apertura: lo que se coge, lo que ya llevas y el camino (BRIEF.md §3).
  handset: { at: "tb-start", portable: true, material: "stone", name: "Auricular", note: "Una voz, esperando.",
    words: { nouns: ["auricular", "telefono"], adj: ["gris"], g: "m" }, ...item("handset"),
    here: "Un {auricular|handset} cuelga de un gancho junto al torniquete, crepitando para sí.",
    examine: "Un auricular gris con un cable enroscado. Escúchalo, y te dice qué probar." },
  slip: { at: "player", portable: true, material: "paper", name: "Papeleta", note: "Tu papeleta de prueba.",
    words: { nouns: ["papeleta", "hoja"], adj: ["prueba", "blanca"], g: "f" }, ...item("slip"),
    examine: "Una papeleta blanca: «Probador. Prueba todo. Informa de lo que se rompa»." },
  gate: { at: "tb-start", name: "Torniquete", note: "Hacia el centro.",
    words: { nouns: ["torniquete", "puerta"], adj: ["acero"], g: "m" },
    examine: "Un torniquete de tres barras de acero. Gira en un solo sentido." },

  // El centro
  board: { at: "tb-hub", name: "Tablón", note: "Qué hay dónde.",
    words: { nouns: ["tablon", "tablero"], adj: ["anuncios"], g: "m" },
    examine: "Un tablón con seis líneas: Clínica, Bar, Dormitorio, Patio, Accesos, Sótano. Una séptima línea está borrada.",
    read: "$board.examine" },
  badge: { at: "tb-hub", portable: true, droppable: false, material: "metal", name: "Chapa", note: "Probador, primera clase.",
    words: { nouns: ["chapa", "placa"], adj: ["laton", "probador"], g: "f" }, ...item("badge"),
    here: "Una {chapa|badge} de latón yace en el suelo junto al tablón.", lies: "La chapa yace donde la dejaste, si la dejaste.",
    drop: "Querrás quedarte la chapa. Dice quién eres.",
    examine: "Una chapa de latón: Probador, Primera Clase." },

  parrot: { at: "tb-hub", name: "Loro", note: "Responde a todos los verbos.",
    words: { nouns: ["loro", "papagayo", "ave"], adj: ["verde", "gris"], g: "m" },
    here: "Un {loro|parrot} está posado en el borde del tablón, respondiendo a todo.",
    examine: "Un loro con una línea para cada verbo al que puede responder una cosa. Pruébalos con él.",
    search: "El loro te deja mirar entre sus plumas. No hay nada.",
    taste: "Sabe a pipas.",
    take: "No se deja coger. Tiene percha.",
    put: "En el loro no cabe nada.",
    show: "El loro lo mira, y desvía la vista.",
    throw: "No lo harías.",
    wear: "No es esa clase de loro.",
    remove: "No hay nada en el loro que quitar.",
    close: "Nada del loro se abre ni se cierra.",
    unlock: "El loro no tiene cerradura.",
    push: "El loro se baja de la punta de tu dedo, y vuelve a subirse.",
    pull: "Se agarra más fuerte a la percha.",
    turn: "El loro gira la cabeza del todo, y luego vuelve.",
    move: "Se mueve él solo, gracias.",
    switch_on: "El loro ya está encendido.",
    switch_off: "No se puede apagar a un loro.",
    attack: "El loro muerde primero.",
    knock: "El loro llama de vuelta, con el pico.",
    exit: "El loro no es un lugar.",
    climb: "No trepas a nada; el loro trepa por tu manga.",
    jump: "El loro salta, y tú no.",
    sit: "El loro no tiene sitio para ti.",
    lie: "En el loro no.",
    stand: "El loro se pone de pie. Tú también puedes.",
    wake: "El loro nunca estuvo dormido.",
    wait: "El loro espera contigo.",
    ask: "El loro te devuelve la misma pregunta.",
    say: "El loro lo repite, un poco mal.",
    shout: "El loro grita más fuerte.",
    sing: "El loro se une, con la nota equivocada.",
    wave: "El loro saluda con un ala.",
    kiss: "El loro te deja.",
    think: "El loro piensa en pipas.",
    pray: "El loro agacha la cabeza y se pone a comer algo." },

  // La clínica: salud
  spike: { at: "tb-clinic", name: "Púas", note: "Prohibido pisar.",
    words: { nouns: ["puas", "pua"], adj: ["acero", "cortas"], pl: true, g: "f" },
    examine: "Una placa cuadrada de púas cortas de acero, hundida en el suelo. Algo de óxido y algo de otra cosa más oscura.",
    touch: "Pones un dedo en las púas, y ellas ponen uno de vuelta." },
  cabinet: { at: "tb-clinic", name: "Armario", note: "De acero, y ruidoso.", material: "metal",
    words: { nouns: ["armario"], adj: ["acero"], g: "m" },
    examine: "Un armario de acero con la parte de arriba plana. Suena cuando lo golpean." },
  vent: { at: "tb-clinic", name: "Rejilla", note: "Aire limpio.",
    words: { nouns: ["rejilla"], adj: ["pared"], g: "f" },
    examine: "Una rejilla cuadrada alta en la pared. El aire que sale de ella es claro y fresco." },
  pill: { at: "tb-clinic", portable: true, material: "soft", name: "Pastilla", note: "Blanca, y amarga.",
    consumable: true, heals: 1, stops: "poisoned", eat: "Es amarga, y luego ya no.",
    words: { nouns: ["pastilla", "comprimido"], adj: ["blanca", "pequena", "pequeña"], g: "f" }, ...item("pill"),
    here: "Una {pastilla|pill} blanca y pequeña yace sobre la cama.",
    examine: "Una pastilla blanca y pequeña. Una etiqueta en la cama dice que cura el veneno." },

  // El laboratorio
  lever: { at: "tb-lab", name: "Palanca", note: "En una ranura de acero.", use: "pull",
    words: { nouns: ["palanca", "manivela"], adj: ["acero", "alta"], g: "f" },
    examine: "Una palanca alta de acero, metida en una ranura. Encima, una lámpara verde está apagada." },
  socket: { at: "tb-lab", container: true, open: "always", name: "Zócalo", note: "Abierto, y vacío.", material: "metal",
    words: { nouns: ["zocalo", "enchufe"], adj: ["abierto", "acero"], g: "m" },
    examine: "Un zócalo abierto del tamaño de un puño, con dos contactos de latón." },
  dial: { at: "tb-lab", name: "Dial", note: "En nada.",
    words: { nouns: ["dial", "rueda"], adj: ["redondo"], g: "m" },
    examine: "Un dial redondo con seis marcas. Gira solo cuando se lo pides, y la imagen cambia." },
  button: { at: "tb-lab", name: "Botón", note: "Verde, y encendido.",
    words: { nouns: ["boton", "pulsador"], adj: ["verde", "encendido"], g: "m" },
    examine: "Un botón verde en la pared, iluminado por dentro. Una tarjeta dice que lleva al rellano." },
  radio: { at: "tb-lab", name: "Radio", note: "Entre emisoras.",
    words: { nouns: ["radio"], adj: ["pequena", "pequeña"], g: "f" },
    examine: "Una radio pequeña entre emisoras, sisea.", listen: "Un siseo y, debajo, una palabra." },

  wire: { at: null, portable: true, material: "soft", name: "Hilo", note: "Un rollo.",
    words: { nouns: ["hilo", "rollo", "cable"], adj: ["cobre"], g: "m" }, ...item("wire"),
    here: "Un rollo de {hilo|wire} de cobre yace en el banco.",
    examine: "Un rollo de hilo de cobre, aún caliente de la radio." },

  // El bar
  dot: { at: "tb-bar", name: "Dot", note: "Lleva el bar.",
    words: { nouns: ["dot", "camarera"], adj: [], g: "f", proper: true },
    examine: "Una mujer alta con delantal blanco, secando un vaso que ya está seco.",
    talk: "«¿Qué va a ser?», dice Dot. «Cerveza, té, un bollo, o una llave, si tienes la moneda».",
    give: "«No es mío», dice Dot, y te lo devuelve.",
    topics: {
      menu: { open: true, label: "la carta", words: ["carta", "menu", "bebidas", "comida", "cerveza", "te", "bollo"], says: "«Cerveza, tres al día, y la tercera se sube a la cabeza. Té, uno al día. Un bollo, entre las seis y las diez. Una llave, por una moneda»." },
      coin: { about: "coin", label: "la moneda", words: ["moneda", "dinero", "pagar"], says: "«La moneda de la barra. No es mía, y no es tuya, y es justo lo que vale una llave»." },
      default: "«No puedo ayudarte con eso», dice Dot, y pule el vaso."
    } },
  beer: { at: null, from: "dot", times: 3, material: "glass", name: "Cerveza", note: "Fría, en un vaso.",
    brought: ["Dot tira una {cerveza|beer} y te la desliza.", "Dot tira otra {cerveza|beer}.", "Dot tira una tercera {cerveza|beer}, y te mira un momento."],
    already: "«Bébete esa primero», dice Dot.", again: "«No hay más cerveza», dice Dot. «Tres es el límite».",
    consumable: true, starts: "drunk", drink: ["Fría y sencilla.", "Fría y sencilla, y algo más tibia.", "Se te va directa a las rodillas."],
    words: { nouns: ["cerveza", "vaso", "birra"], adj: ["fria"], g: "f" },
    examine: "Un vaso de cerveza, fría, con muy poca espuma." },
  tea: { at: null, from: "dot", daily: true, times: 1, material: "stone", name: "Té", note: "Caliente, en una taza.",
    brought: "Dot deja una taza de {té|tea}.", already: "«Ese todavía está caliente», dice Dot.", again: "«Uno al día», dice Dot. «Vuelve mañana».",
    consumable: true, heals: 1, stops: "drunk", drink: "Está exactamente tan fuerte como te gusta.",
    words: { nouns: ["te", "taza"], adj: ["caliente"], g: "m" },
    examine: "Una taza de té caliente, del color de una mesa." },
  bun: { at: null, from: "dot", if: [hours(6, 22)], material: "soft", name: "Bollo", note: "Caliente, con un corte.",
    brought: "Dot pone un {bollo|bun} en la barra.", again: "«Los hornos están fríos», dice Dot. «Entre las seis y las diez».",
    consumable: true, heals: 1, eat: "Está caliente, y se acabó.",
    words: { nouns: ["bollo", "panecillo"], adj: ["caliente"], g: "m" },
    examine: "Un bollo caliente con un corte por el medio." },
  chest_key: { at: null, from: "dot", requires: "coin", spends: true, lacking: "«Una llave es una moneda», dice Dot, y espera.", material: "metal",
    name: "Llave del cofre", note: "Pequeña, para el cofre.", portable: true,
    brought: "Dot coge la moneda y te da una {llave|chest_key} pequeña.", again: "«Una llave», dice Dot. «Solo tengo una».",
    words: { nouns: ["llave"], adj: ["cofre", "pequena", "pequeña", "lata"], g: "f" }, ...item("chest_key"),
    examine: "Una llave pequeña en un aro de hilo, con una etiqueta: Cofre." },
  coin: { at: "tb-bar", portable: true, material: "metal", name: "Moneda", note: "Exactamente una.",
    words: { nouns: ["moneda"], adj: ["cobre"], g: "f" }, ...item("coin"),
    here: "Una {moneda|coin} de cobre yace junto al vaso.", lies: "Una moneda de cobre yace donde la dejaron.",
    examine: "Una moneda de cobre, gastada por un lado." },
  green: { at: "tb-bar", portable: true, material: "glass", name: "Brebaje verde", note: "Un vaso alto y verde.",
    consumable: true, starts: "poisoned", drink: "Sabe a monedas, y luego a nada en absoluto.",
    words: { nouns: ["brebaje", "vaso"], adj: ["verde", "alto"], g: "m" }, ...item("green"),
    here: "Un {brebaje|green} verde está sobre la barra.",
    examine: "Un vaso alto de líquido verde. Una tarjeta dice: Veneno, para pruebas." },
  stove: { at: "tb-bar", name: "Estufa", note: "Brillante, y caliente.",
    words: { nouns: ["estufa"], adj: ["roja"], g: "f" },
    examine: "Una estufa achaparrada con la puerta abierta. Es lo más caliente del piso." },
  ice: { at: "tb-bar", name: "Hielo", note: "Un cubo lleno.",
    words: { nouns: ["hielo", "cubo"], adj: ["blanco"], g: "m" },
    examine: "Un cubo largo lleno de hielo. No se derrite. Nadie se lo ha pedido." },

  // El despacho
  oduya: { at: "tb-office", name: "La señora Oduya", note: "Lleva el libro.",
    words: { nouns: ["oduya", "senora", "registradora"], adj: ["senora"], g: "f", proper: true },
    examine: "Una mujer con una rebeca gris, escribiendo en un libro mayor. Lleva escribiendo desde que se abrió el piso.",
    talk: "«¿Sí?», dice la señora Oduya, sin levantar la vista.",
    give: "«Póngalo en el escritorio», dice la señora Oduya, y luego: «No. Lléveselo».",
    topics: {
      herself: { open: true, label: "ella", words: ["ella", "quien", "registradora"], says: "«Yo llevo el libro», dice la señora Oduya. «En él se apuntan nombres»." },
      ledger: { label: "el libro", words: ["libro", "mayor", "registro"], opens: ["debt"], says: "«El libro dice quién debe qué. No es un libro largo, y no es un libro corto»." },
      debt: { about: "debt", label: "quién debe", words: ["deuda", "deudas", "debe", "deben", "deber"], opens: ["verdict"], says: "«Siempre hay alguien que debe», dice la señora Oduya. «El libro guarda el nombre hasta que se paga»." },
      verdict: { about: "verdict", label: "de quién", words: ["veredicto", "nombre", "quien", "cuyo"], says: "«Pregúntemelo como es debido»." },
      monday: { about: "monday", label: "el lunes", words: ["lunes", "dia", "semana"], says: "«Los lunes son un hecho. Yo no discuto con los hechos»." },
      default: "«Eso no está en el libro», dice la señora Oduya."
    } },
  ledger: { at: "tb-office", name: "Libro mayor", note: "Quién debe qué.", opens: ["debt"],
    words: { nouns: ["libro", "mayor", "registro"], adj: ["grueso", "negro"], g: "m" },
    parts: [{ words: ["columnas", "columna", "pagina", "paginas"], name: "las columnas", says: "Nombres a la izquierda, sumas a la derecha, y nada en el medio." }],
    mentions: ["lunes"],
    examine: "Un libro mayor grueso y negro. Cada página tiene dos columnas: un nombre y lo que se debe. Un día de la semana está aplastado entre dos páginas.", read: "$ledger.examine" },
  monday: { at: "tb-office", unnoticed: true, name: "Lunes", note: "El día enmarcado.",
    words: { nouns: ["lunes"], proper: true, g: "m" },
    examine: "La palabra del marco es Lunes." },
  poster: { at: "tb-office", name: "Cartel", note: "Muestra una moneda.", img: "coin",
    words: { nouns: ["cartel", "poster"], adj: ["pequeno", "pequeño"], g: "m" },
    examine: "Un cartel pequeño con una moneda, y la palabra Gasta debajo. Su imagen es la de la moneda." },

  // El dormitorio
  bunk: { at: "tb-bedroom", enterable: "on", name: "Litera", note: "Para dormir.",
    words: { nouns: ["litera", "cama"], adj: ["baja"], g: "f" },
    enter: "Subes a la litera y te tumbas.",
    examine: "Una litera baja con una manta gris. Una tarjeta pone: Túmbate para dormir hasta las siete y media." },
  hammock: { at: "tb-bedroom", enterable: "in", name: "Hamaca", note: "Tiene un sueño dentro.",
    dream: { says: "Estás en una hamaca sobre el piso de pruebas, y cada sala está iluminada, y cada una tiene una puerta abierta.", picture: "hammock_dream", opens: "floor", once: true },
    words: { nouns: ["hamaca"], adj: ["lona"], g: "f" },
    enter: "Te metes en la hamaca, y te sostiene con un suspiro.",
    examine: "Una hamaca de lona colgada de dos ganchos. Dormir en ella da un sueño, una vez." },
  lamp: { at: "tb-bedroom", name: "Lámpara", note: "Amarilla, y encendida.",
    words: { nouns: ["lampara", "luz"], adj: ["amarilla"], g: "f" },
    examine: "Una lámpara amarilla sobre la mesa. Cuando se apaga, los bordes de todo se oscurecen." },
  clock: { at: "tb-bedroom", name: "Reloj", note: "Mueve el tiempo.",
    waitFor: { time: "next 12:00", says: "Miras el reloj hasta que marca el mediodía.", if: [{ "time.hour": { "!=": 12 } }] },
    actions: ["Dar cuerda al reloj"],
    words: { nouns: ["reloj"], adj: ["redondo"], g: "m" },
    examine: "Un reloj redondo con una llave de cuerda. Marca [time]. Darle cuerda adelanta el día una hora." },

  // El patio y el callejón: cosas que se mueven
  cat: { at: "tb-yard", name: "Gato", note: "Vaga, y te sigue.",
    rounds: { rooms: ["tb-yard", "tb-lane"], every: [3, 5], random: true },
    places: [{ at: "player", if: [{ "cat.stroked": true }], within: ["tb-yard", "tb-lane", "tb-hub"] }],
    arrives: "El gato entra con paso suave.", leaves: "El gato se escabulle.",
    words: { nouns: ["gato"], adj: ["gris"], g: "m" }, ...item("cat"),
    here: "Un {gato|cat} gris está ahí, como si siempre hubiera estado.",
    examine: "Un gato gris. Vaga por el patio y el callejón hasta que lo acarician, y entonces te sigue por el centro, el patio y el callejón. Ahúyentalo, y vuelve a vagar.",
    talk: "El gato te mira, y luego mira algo detrás de ti." },
  watchman: { at: "tb-yard", name: "Vigilante", note: "En su ronda.",
    rounds: { rooms: ["tb-yard", "tb-lane"], every: [4, 4] },
    words: { nouns: ["vigilante", "guardia"], adj: ["largo"], g: "m" }, ...item("watchman"),
    here: "Un {vigilante|watchman} hace su ronda.",
    examine: "Un vigilante de abrigo largo. Recorre el patio y el callejón, un paso cada cuatro movimientos tuyos." },
  bird: { at: "tb-lane", name: "Pájaro", note: "Se mueve solo.",
    rounds: { rooms: ["tb-yard", "tb-lane"], every: { seconds: [30, 50] }, random: true },
    arrives: ["Un pájaro entra revoloteando."], leaves: ["El pájaro se va revoloteando."],
    words: { nouns: ["pajaro", "gorrion", "pajarillo"], adj: ["pequeno", "pequeño", "marron"], g: "m" }, ...item("bird"),
    here: "Un {pajarillo|bird} salta de un lado a otro.",
    examine: "Un pajarillo marrón. Se mueve solo, cada medio minuto más o menos, lo estés leyendo o no." },
  clerk: { at: "tb-lane", name: "Oficinista de noche", note: "Solo después de las ocho.",
    places: [{ at: "tb-lane", if: [hours(20, 6)] }],
    arrives: "El oficinista de noche entra de turno.", leaves: "El oficinista de noche sale de turno.",
    words: { nouns: ["oficinista", "empleado"], adj: ["noche", "verde"], g: "m" }, ...item("clerk"),
    here: "Un {oficinista|clerk} de noche está bajo la ventana.",
    examine: "Un oficinista con una visera verde. Está en el callejón desde las ocho de la noche hasta las seis de la mañana." },
  bench: { at: "tb-yard", enterable: "on", name: "Banco", note: "Para sentarse.",
    words: { nouns: ["banco"], adj: ["madera"], g: "m" },
    enter: "Te sientas en el banco.",
    examine: "Un banco de madera. Puedes sentarte en él, y la sala lo dice." },

  // Los accesos
  pass: { at: "tb-ways", portable: true, material: "paper", name: "Pase", note: "Para el guardia.",
    words: { nouns: ["pase"], adj: ["blanco", "guardia"], g: "m" }, ...item("pass"),
    here: "Un {pase|pass} blanco yace en el suelo.",
    examine: "Un pase blanco: «Anexo. Un uso»." },
  wheel: { at: "tb-ways", name: "Rueda", note: "Cava, y rellena.",
    words: { nouns: ["rueda"], adj: ["hierro", "grande"], g: "f" },
    examine: "Una gran rueda de hierro en la pared. Gírala, y se abre un camino a un foso; gírala otra vez, y el camino se cierra." },
  ladder: { at: "tb-ways", leads: ["u", "d"], name: "Escalera de mano", note: "Arriba, o abajo.",
    words: { nouns: ["escalera"], adj: ["hierro", "mano"], g: "f" },
    examine: "Una escalera de mano de hierro. Subir lleva arriba; bajar, abajo." },
  pole: { at: "tb-annex", portable: true, material: "wood", shape: "pole_shape", name: "Pértiga", note: "Larga, para el gancho.",
    here: "Una pértiga larga de madera yace a lo largo del suelo, de pared a pared.",
    words: { nouns: ["pertiga", "palo"], adj: ["larga", "madera"], g: "f" }, ...item("pole"),
    examine: "Una pértiga larga de madera, tan larga como la sala." },
  landing_stairs: { at: "tb-landing", leads: "u", name: "Escaleras", note: "Hasta la azotea.",
    words: { nouns: ["escaleras", "tramo"], adj: ["estrechas"], pl: true, g: "f" },
    examine: "Un tramo estrecho de escaleras que sube." },

  // El sótano
  vault_door: { at: "tb-cellar", door: "e", material: "metal", locked: true, name: "Puerta de la cámara", note: "Redonda, y de acero.",
    shut: "Te acercas a la puerta de la cámara y pones la mano en ella. Cerrada con llave.",
    lock: { key: "vault_key", says: "La cerradura quiere una llave larga de latón.", opens: "La llave gira, y la puerta de la cámara se abre de par en par a una sala brillante.", then: "vault_open" },
    words: { nouns: ["puerta de la camara", "puerta"], adj: ["camara", "redonda", "acero"], g: "f" },
    examine: "Una puerta redonda de acero con una cerradura." },
  cellar_door: { at: "tb-cellar", door: "w", pair: "pantry_door", material: "wood", locked: true, name: "Puerta de la despensa", note: "Cerrada desde aquí.",
    shut: "La puerta de la despensa está cerrada con llave.",
    lock: { key: "pantry_key", says: "La puerta de la despensa quiere una llave diminuta.", opens: "La llave diminuta gira, y la puerta de la despensa se abre." },
    words: { nouns: ["puerta de la despensa", "puerta"], adj: ["despensa", "madera", "pequena", "pequeña"], g: "f" },
    examine: "Una puerta pequeña de madera, cerrada con llave. Tiene una gemela al otro lado." },
  pantry_door: { at: "tb-pantry", door: "e", pair: "cellar_door", material: "wood", locked: true, name: "Puerta del sótano", note: "Cerrada también desde aquí.",
    shut: "La puerta del sótano está cerrada con llave.",
    lock: { key: "pantry_key", says: "La puerta del sótano está cerrada también por este lado.", opens: "La llave diminuta gira, y la puerta del sótano se abre." },
    words: { nouns: ["puerta del sotano", "puerta"], adj: ["sotano", "madera"], g: "f" },
    examine: "Una puerta pequeña de madera, la misma vista desde el otro lado." },
  chest: { at: "tb-cellar", container: true, open: false, locked: true, material: "wood", name: "Cofre", note: "Cerrado, con un fusible dentro.",
    lock: { key: "chest_key", says: "El cofre está cerrado con llave. La cerradura es pequeña." },
    words: { nouns: ["cofre", "baul"], adj: ["grande", "oscuro"], g: "m" },
    examine: "Un cofre grande y oscuro, cerrado con llave." },
  fuse: { at: "chest", portable: true, material: "metal", name: "Fusible", note: "Encaja en el zócalo.",
    words: { nouns: ["fusible"], adj: ["laton"], g: "m" }, ...item("fuse"),
    examine: "Un fusible de latón del tamaño de un pulgar." },
  vault_key: { at: "chest", portable: true, material: "metal", name: "Llave de la cámara", note: "Larga, y de latón.",
    words: { nouns: ["llave"], adj: ["camara", "laton", "larga"], g: "f" }, ...item("vault_key"),
    examine: "Una llave larga de latón, con una etiqueta: Cámara." },
  box: { at: "tb-cellar", container: true, open: true, material: "wood", name: "Caja", note: "Abierta, con tapa.",
    words: { nouns: ["caja"], adj: ["pequena", "pequeña", "lata"], g: "f" },
    examine: "Una caja pequeña abierta, con una tapa que cierra." },
  pantry_key: { at: "box", portable: true, material: "metal", name: "Llave de la despensa", note: "Diminuta.",
    words: { nouns: ["llave"], adj: ["despensa", "diminuta"], g: "f" }, ...item("pantry_key"),
    examine: "Una llave diminuta, con una etiqueta: Despensa." },
  bin: { at: "tb-cellar", container: true, open: "always", material: "wood", name: "Cubo", note: "Abierto para siempre.",
    words: { nouns: ["cubo"], adj: ["madera"], g: "m" },
    examine: "Un cubo de madera sin tapa. Se pueden meter cosas y sacarlas." },
  boat: { at: "tb-cellar", enterable: "in", container: true, open: "always", material: "wood", name: "Bote", note: "Sobre calzos.",
    words: { nouns: ["bote", "barca"], adj: ["pequeno", "pequeño"], g: "m" },
    enter: "Subes al bote y te sientas en él.",
    examine: "Un bote pequeño sobre calzos, muy lejos de cualquier agua." },
  scrap: { at: "tb-cellar", unnoticed: true, name: "Trozo", note: "De papel.",
    words: { nouns: ["trozo", "pedazo", "papel"], adj: ["papel"], g: "m" },
    examine: "Un trozo de papel con media palabra." },
  jar: { at: "tb-pantry", container: true, open: false, material: "glass", name: "Tarro", note: "Cerrado.",
    words: { nouns: ["tarro", "bote"], adj: ["cristal"], g: "m" },
    examine: "Un tarro de cristal con tapa de rosca, vacío." },
  tin: { at: "tb-vault", portable: true, material: "metal", name: "Lata", note: "Suena.",
    heldActions: ["Agitar la lata"],
    words: { nouns: ["lata"], adj: ["abollada"], g: "f" }, ...item("tin"),
    here: "Una {lata|tin} abollada está en el suelo.",
    examine: "Una lata abollada que suena cuando se agita." }
};

// ---- Cambios con nombre ------------------------------------------------------------------------------------------------------
const changes = {
  vault_open: [{ say: "La puerta de la cámara se abre del todo, y sale de ella una luz fresca y brillante." }],
  nap: [
    { say: "Te tumbas, y la sala se queda en silencio." },
    { set: "bunk.slept", to: "$time.day" },
    { sleep: "next 07:30" }
  ]
};

// ---- Reglas ----------------------------------------------------------------------------------------------------------------
const rules = [
  // Daños y curas.
  { id: "touch_spike", match: { verb: "touch", obj: "spike" }, do: [{ hurt: 1, says: "Las púas entran un poco, y salen otra vez." }] },
  { id: "smell_vent", match: { verb: "smell", obj: "vent" }, once: true, again: "El aire de la rejilla es fresco, y nada más.",
    do: [{ heal: 1, says: "Respiras aire fresco y limpio, y se te despeja la cabeza." }] },
  { id: "kick_cabinet", match: { verb: "attack", obj: "cabinet" },
    do: [{ say: "El armario suena como una campana, y toda la sala da un salto." }, { filter: "shake" }] },
  { id: "read_gauge", match: { verb: "think", obj: "vent" }, do: [{ say: "Piensas en la rejilla." }, { echo: "Notas la cabeza un poco más clara", kind: "clear" }] },
  { id: "breathe_wave", match: { verb: "wait" }, if: [{ "player.at": "tb-clinic" }], once: true,
    do: [{ say: "Te quedas quieto respirando, y la sala se asienta." }, { filter: "wave" }] },
  // El laboratorio: USE, viaje, la palanca y su pregunta, el dial.
  { id: "pull_lever_ready", match: { verb: "pull", obj: "lever" }, if: [{ "fuse.at": "socket" }],
    do: [{ say: "La palanca está dura. El zócalo zumba, y la lámpara verde sobre la ranura está encendida." },
         { confirm: "¿La echas para siempre?", style: "sys", yes: [{ say: "Echas la palanca. El fusible destella, y todas las luces del piso se encienden a la vez." }, { end: true, picture: "lit" }],
           no: [{ say: "Sueltas la palanca, despacio, y se queda donde está." }] }] },
  { id: "pull_lever_empty", match: { verb: "pull", obj: "lever" },
    do: [{ say: "La palanca se mueve, y no pasa nada. El zócalo de al lado está vacío." }] },
  { id: "push_button", match: { verb: "push", obj: "button" }, do: [{ say: "El botón hace clic, y el suelo se te va de debajo, con educación." }, { travel: "tb-landing" }] },
  { id: "use_pole_hook", match: { verb: "use", obj: "pole", scenery: "annex_hook" }, if: [{ "player.at": "tb-annex" }],
    do: [{ say: "Cuelgas la pértiga del gancho, y se balancea una vez, y se queda ahí." }, { move: "pole", to: "tb-annex" }] },
  { id: "put_coin_socket", match: { verb: "put", obj: "coin", obj2: "socket", prep: "in" }, if: [{ "$obj2": "socket" }],
    do: [{ say: "La moneda es demasiado fina para los contactos, y vuelve rodando a tu mano." }] },
  { id: "tune_radio", match: { verb: "tune", obj: "radio" },
    do: [{ say: "Sintonizas la radio, y el siseo cesa, y llega una palabra: Testbed." }, { set: "radio.tuned", to: true }, { remove: "rule", id: "radio_hiss" },
         { move: "wire", to: "tb-lab" },
         { draw: "tb-lab", overlays: [{ object: "wire", at: [236, 108] }], cycles: [{ name: "the lamp", areas: ["lever_lamp"], colors: [10, 2], style: "pingpong", ms: 1600 }],
           loops: [{ name: "sparks", at: [226, 98], style: "random", ms: 150, frames: [["..f.", ".fef", "..f.", "...."], ["....", ".f..", "fef.", ".f.."]] }] }] },
  { id: "radio_hiss", when: "every", every: { turns: [4, 6] }, chance: 1, if: [{ "player.at": "tb-lab" }, { "radio.tuned": false }],
    do: [{ say: "La radio sisea, y casi sale una palabra." }] },
  { id: "whistle_note", match: { verb: "whistle" }, do: [{ say: "Silbas una nota fina. Los cables responden." }] },
  { id: "intone_open", match: { verb: "intone", text: "abrete sesamo" }, do: [{ say: "Lo dices exactamente así, y la sala lo toma por una broma." }] },
  { id: "intone_any", match: { verb: "intone" }, if: [{ "$text": { in: ["testbed", "el testbed"] } }],
    do: [{ say: "«[player.rank]», dices, y el laboratorio parece darte la razón." }] },
  { id: "summon_dot", match: { verb: "summon", obj: "dot" }, if: [{ "dot.place": { "!=": "$here" } }, { "$here": { "!=": "tb-bar" } }],
    do: [{ say: "Dot está en el bar, al este del centro. Desde aquí no puede oírte." }] },
  { id: "shake_tin", match: { verb: "shake", obj: "tin" }, once: true, again: "La lata suena otra vez, de la misma manera.",
    do: [{ say: "La lata suena: una moneda muy pequeña, o una alubia muy grande." }] },
  { id: "dial_0", match: { verb: "turn", obj: "dial" }, if: [{ "dial.setting": 0 }],
    do: [{ filter: "vignette" }, { set: "dial.setting", add: 1 }, { say: "La imagen se oscurece por los bordes." }] },
  { id: "dial_1", match: { verb: "turn", obj: "dial" }, if: [{ "dial.setting": 1 }],
    do: [{ unfilter: "vignette" }, { filter: "mosaic" }, { set: "dial.setting", add: 1 }, { say: "La imagen se vuelve bloques gruesos." }] },
  { id: "dial_2", match: { verb: "turn", obj: "dial" }, if: [{ "dial.setting": { "=": 2 } }],
    do: [{ unfilter: "mosaic" }, { filter: "static" }, { set: "dial.setting", add: 1 }, { say: "Unos cuantos píxeles empiezan a parpadear, como una señal mala." }] },
  { id: "dial_3", match: { verb: "turn", obj: "dial" }, if: [{ "dial.setting": 3 }],
    do: [{ unfilter: "static" }, { filter: "tint:sepia" }, { set: "dial.setting", add: 1 }, { say: "La imagen toma el color de una foto vieja." }] },
  { id: "dial_4", match: { verb: "turn", obj: "dial" }, if: [{ "dial.setting": 4 }],
    do: [{ filter: "tint:faint" }, { set: "dial.setting", add: 1 }, { say: "La imagen se desvaiece." }] },
  { id: "dial_5", match: { verb: "turn", obj: "dial" }, if: [{ "dial.setting": { "<=": 5 } }],
    do: [{ unfilter: "tint" }, { set: "dial.setting", to: 0 }, { say: "El dial vuelve a nada con un clic, y la imagen es otra vez normal." }] },
  // El bar: estados.
  { id: "warm_hands", match: { verb: "touch", obj: "stove" }, if: [{ "player.conditions": { has: "cold" } }],
    do: [{ say: "Acercas las manos a la estufa hasta que se va el frío." }, { stop: "cold" }] },
  { id: "touch_stove", match: { verb: "touch", obj: "stove" }, once: true, again: "La estufa está tan caliente como antes.",
    do: [{ say: "Acercas las manos a la estufa, y el calor entra y se queda." }, { start: "warm" }] },
  { id: "touch_ice", match: { verb: "touch", obj: "ice" },
    do: [{ say: "Metes la mano en el cubo, y el frío sube hasta el codo." }, { start: "cold" }] },
  { id: "take_coin_say", match: { verb: "smell", obj: "coin" }, if: [{ any: [{ "player.conditions": { has: "drunk" } }, { "player.conditions": { has: "cold" } }] }],
    do: [{ say: "Hueles la moneda, que es más de lo que hace la mayoría, en tu estado." }] },
  // El dormitorio: la lámpara, el reloj, la litera. Tiempo.
  { id: "lamp_off", match: { verb: "switch_off", obj: "lamp" }, do: [{ say: "La lámpara se apaga, y los bordes de la sala se oscurecen." }, { filter: "vignette" }, { draw: "tb-bedroom", replace: ["ellipse lamp_glow 150,70,20,16 mix:,0@0.6"] }] },
  { id: "lamp_on", match: { verb: "switch_on", obj: "lamp" }, do: [{ say: "La lámpara se enciende, y la sala vuelve a tener su tamaño." }, { unfilter: "vignette" }, { draw: "tb-bedroom", replace: ["ellipse lamp_glow 150,70,20,16 mix:,14@0.4"] }] },
  { id: "wind_clock", match: { verb: "turn", obj: "clock" }, if: [{ "clock.rang": { "<": 3 } }],
    do: [{ time: "+1h" }, { set: "clock.rang", add: 1 }, { say: "Das cuerda al reloj, y el día avanza una hora. La cuenta es [clock.rang]." }] },
  { id: "wind_clock_late", match: { verb: "turn", obj: "clock" }, if: [{ "clock.rang": { ">=": 3 } }],
    do: [{ time: "next 06:00" }, { say: "El reloj, con cuerda de sobra, da la vuelta hasta las seis de la mañana." }] },
  { id: "lie_bunk", match: { verb: "lie", obj: "bunk" }, do: [{ change: "nap" }] },
  // El patio: el gato.
  { id: "stroke_cat", match: { verb: "touch", obj: "cat" }, do: [{ say: "Acaricias al gato, y se apoya en tu mano, y ahora viene contigo." }, { set: "cat.stroked", to: true }] },
  { id: "shoo_cat", match: { verb: "attack", obj: "cat" }, if: [{ "cat.stroked": true }],
    do: [{ say: "Ahuyentas al gato, y se va otra vez por su cuenta." }, { set: "cat.stroked", to: false }] },
  { id: "bench_sit_line", match: { verb: "look" }, if: [{ "player.in": "bench" }], do: [{ say: "Estás en el banco, y el patio sigue sin ti." }, { describe: "$here" }] },
  // Los accesos: andar, la rueda, la azotea.
  { id: "go_west_ways", match: { verb: "go", dir: "w" }, if: [{ "player.at": "tb-ways" }, { "$exit": "tb-chute" }], then: "default",
    do: [{ say: "El tobogán te lleva con un breve grito de aire." }] },
  { id: "go_east_shut", match: { verb: "go", dir: "e" }, if: [{ "player.at": "tb-ways" }, { "$exit": false }], then: "default",
    do: [{ say: "La persiana es algo que se ve desde aquí." }] },
  { id: "wheel_dig", match: { verb: "turn", obj: "wheel" }, if: [{ "wheel.stage": 0 }],
    do: [{ say: "La rueda gira, y una trampilla del suelo, al sur de ti, se desliza sobre un foso." },
         { draw: "tb-ways", add: ["rect hatch 130,112,60,14 0 e8"] },
         { connect: "tb-ways", dir: "s", to: "tb-pit" },
         { connect: "tb-pit", dir: "s", to: "tb-closet", passage: true, in: true },
         { connect: "tb-pit", dir: "n", to: "tb-ways", out: true },
         { connect: "tb-pit", dir: "e", to: "tb-landing", passage: true, if: { "wheel.stage": { ">=": 1 } }, closed: "El muro es macizo hasta que la rueda haya girado." },
         { connect: "tb-pit", dir: "w", to: "tb-chute", passage: true, requires: "pass", spends: true, lacking: "Necesitarías un pase." },
         { change: "no_such_change", optional: true },
         { set: "wheel.stage", to: 1 }] },
  { id: "wheel_fill", match: { verb: "turn", obj: "wheel" }, if: [{ "wheel.stage": 1 }],
    do: [{ say: "La rueda gira hacia atrás, y la trampilla se cierra sobre el foso." },
         { draw: "tb-ways", remove: ["hatch"] },
         { disconnect: "tb-ways", dir: "s" }, { disconnect: "tb-pit", dir: "s" }, { disconnect: "tb-pit", dir: "n" }, { disconnect: "tb-pit", dir: "e" }, { disconnect: "tb-pit", dir: "w" },
         { set: "wheel.stage", to: 0 }] },
  { id: "jump_roof", match: { verb: "jump" }, if: [{ "player.at": "tb-roof" }],
    do: [{ say: "Te lanzas por el borde. El suelo sube, bastante despacio, y luego nada despacio." }, { hurt: 5, says: "El suelo es muy duro." },
         { end: true, picture: "fell" }] },
  // El despacho: temas que abren temas, y la pregunta.
  { id: "ask_verdict", match: { verb: "ask", obj: "oduya", topic: "verdict" },
    do: [{ say: "«¿Cuyo nombre va en el libro?», dice la señora Oduya, con la pluma en alto." }, { ask: "verdict" }] },
  { id: "verdict_right", match: { verb: "answer", question: "verdict" },
    if: [{ "player.answers.verdict": { in: ["oduya", "senora oduya", "la senora oduya", "la señora oduya", "señora oduya", "registradora", "la registradora"] } }],
    do: [{ say: "«[player.answers.verdict]», dice la señora Oduya, y lo apunta. «Por fin. Ya empezaba a pensar que tendría que hacerlo yo»." },
         { end: true, picture: "named" }] },
  { id: "verdict_blank", match: { verb: "answer", question: "verdict", blank: true },
    do: [{ say: "No dices nada. La señora Oduya espera, y apunta la nada." }] },
  { id: "verdict_other", match: { verb: "answer", question: "verdict" },
    do: [{ say: "«[player.answers.verdict]», dice la señora Oduya, y lo prueba en el margen. «No. Ese no es quien debe»." }] },
  { id: "think_ledger", match: { verb: "think", obj: "ledger" }, do: [{ say: "Piensas en el libro mayor, y te viene a la cabeza una deuda.", style: "sys" }, { know: "debt" }] },
  { id: "think_absent", match: { verb: "think", absent: "wire" }, do: [{ say: "Piensas en el alambre, pero no está aquí." }] },
  { id: "ask_default", match: { verb: "ask", obj: "dot" }, if: [{ "$topic": null }], do: [{ say: "Dot espera a que le preguntes por algo." }] },
  { id: "read_ledger", match: { verb: "read", obj: "ledger" }, do: [{ say: "$ledger.examine", img: "coin" }] },
  { id: "tear_scrap", match: { verb: "attack", obj: "scrap" }, do: [{ say: "Rompes el trozo, y la media palabra desaparece." }, { remove: "object", id: "scrap" }] },
  // El centro: el tablón lee de vuelta el estado, y una o dos reglas programadas.
  { id: "board_status", match: { verb: "read", obj: "board" },
    if: [{ "game.turn": { ">=": 0 } }, { "game.clock": { ">=": 0 } }, { "game.entrance": "tb-hub" }, { "game.ended": false }, { "time.day": { ">=": 1 } },
         { "time.minute": { ">=": 0 } }, { "time.second": { ">=": 0 } }, { "time.weekday": { "!=": "sun" } }, { "player.health": { ">": 0 } },
         { "player.carrying": { has: "slip" } }, { "player.at": "tb-hub" }, { "$in": null }, { "$obj.at": "tb-hub" }, { "badge.place": "tb-hub" }, { "oduya.person": true },
         { "badge.holder": null }, { "$exits": { "!=": null } }, { "game.ending": null }, { "fuse.chain": { has: "fuse" } }],
    do: [{ say: "El tablón lee de vuelta lo que sabe el juego: el turno, el reloj, el día y la hora, y tu salud.", img: "coin" }] },
  { id: "board_plain", match: { verb: "read", obj: "board" }, do: [{ say: "$board.examine" }] },
  { id: "dusk_sky", when: "at", at: "19:00", do: [{ draw: "tb-yard", restyle: [{ id: "sky", fill: 8 }] }] },
  { id: "bell_tower", when: "at", at: "day 2 08:00", once: true, do: [{ say: "En algún lugar sobre el piso, una campana da las ocho, y a nadie le sorprende." }] },
  { id: "hub_tick", when: "every", every: { turns: [8, 12] }, chance: 0.5, if: [{ "player.at": "tb-hub" }], do: [{ say: "Las puertas del centro hacen clic, una tras otra." }] },
  // Una regla añadida en juego, antes de otra (BRIEF §8, «Rules»): el tablón se lee primero de la manera llana una vez apagada la lámpara.
  { id: "board_dim", match: { verb: "read", obj: "board" }, if: [{ "tb-hub.dim": true }], do: [{ say: "El tablón cuesta de leer en la oscuridad." }] }
];
// ---- Puzles ------------------------------------------------------------------------------------------------------------------
const puzzles = {
  take_coin: { where: "tb-bar", needs: [], solve: ["{take} moneda"], gives: ["coin"], clues: ["dot", "coin"],
    hints: ["Hay una moneda junto al vaso, en la barra.", "Coge la moneda del bar."] },
  buy_key: { where: "tb-bar", needs: ["take_coin"], solve: ["pide llave pequeña"], gives: ["chest_key"], clues: ["dot", "chest_key"],
    hints: ["Dot vende una llave pequeña por una sola moneda.", "Pide a Dot la llave del cofre, con la moneda."] },
  open_chest: { where: "tb-cellar", needs: ["buy_key"], solve: ["abre el cofre con la llave pequeña", "saca el fusible del cofre"], gives: ["fuse"], clues: ["chest", "chest_key"],
    hints: ["La llave pequeña encaja en el cofre grande del sótano.", "Abre el cofre con la llave del cofre, y saca el fusible."] },
  take_vault_key: { where: "tb-cellar", needs: ["open_chest"], solve: ["saca la llave larga del cofre"], gives: ["vault_key"], clues: ["chest", "vault_door"],
    hints: ["El cofre guarda también una llave larga de latón.", "Saca la llave de la cámara del cofre."] },
  open_vault: { where: "tb-cellar", needs: ["take_vault_key"], solve: ["abre la puerta de la cámara con la llave larga", "este"], reaches: "tb-vault", clues: ["vault_door", "vault_key"],
    hints: ["La llave de latón encaja en la puerta de la cámara.", "Abre la puerta de la cámara con la llave larga, y ve al este."] },
  open_pantry: { where: "tb-cellar", needs: [], solve: ["saca la llave diminuta de la caja", "abre la puerta de la despensa con la llave diminuta", "oeste"], reaches: "tb-pantry", clues: ["box", "cellar_door"],
    hints: ["La caja guarda una llave diminuta.", "Saca la llave diminuta de la caja, abre con ella la puerta de la despensa, y ve al oeste."] },
  light: { where: "tb-lab", needs: ["open_chest"], solve: ["pon el fusible en el zocalo", "tira de la palanca", "si"], ending: true, clues: ["lever", "socket", "fuse"],
    hints: ["El zócalo está vacío, y la palanca no hace nada sin un fusible dentro.", "Pon el fusible en el zócalo, tira de la palanca, y di que sí."] },
  named: { where: "tb-office", needs: [], solve: ["examina el libro mayor", "pregunta a oduya por el libro", "pregunta a oduya por la deuda", "pregunta a oduya por el veredicto", "oduya"], ending: true,
    clues: ["oduya", "ledger"],
    hints: ["La señora Oduya lleva el libro, y el libro guarda un nombre.", "Pregúntale por el libro, luego por la deuda, luego por el veredicto, y responde con su propio nombre."] },
  meet_clerk: { where: "tb-yard", needs: [], solve: ["oeste"], reaches: "tb-lane", time: "next 20:00", clues: ["clerk", "watchman"],
    hints: ["El callejón tiene un oficinista de noche, pasadas las ocho.", "Espera a que anochezca, y ve al oeste."] },
  fell: { where: "tb-roof", needs: [], solve: ["salta"], ending: true, clues: ["ladder", "landing_stairs"],
    hints: ["La azotea tiene un borde, y el borde tiene una caída.", "Sube a la azotea, y salta."] }
};

// ---- La apertura, declarada (BRIEF.md §3) ------------------------------------------------------------------------------------
const opening = {
  room: "tb-start", hints: "handset", intro: "slip", way: "gate",
  lines: {
    notYet: "El torniquete no gira. El auricular sigue en su gancho, y quiere que lo lleves contigo primero.",
    through: "Empujas el torniquete. Gira una vez, y vuelve a ser una pared cuando miras atrás.",
    hintFrame: "El auricular crepita. Una voz plana dice:",
    farewell: "La papeleta se lee, y se pone gris, y desaparece."
  }
};

// ---- El conjunto de cambios ------------------------------------------------------------------------------------------------
export default {
  because: "Después de la apertura: el piso de pruebas, un centro con un camino a cada mecanismo del motor.",
  opening,
  facts: [
    "El jugador llega al centro del piso de pruebas, un lunes, a mediodía.",
    "Cada sala sirve para un mecanismo; un gato, un vigilante, un pájaro y un oficinista de noche se mueven solos.",
    "Tres finales: luz (el laboratorio), nombrada (el despacho), caída (la azotea), y muerte cuando se acaba la salud."
  ],
  properties: {
    "cat.stroked": { type: "boolean", start: false },
    "dial.setting": { type: "number", min: 0, max: 5, start: 0 },
    "wheel.stage": { type: "number", min: 0, max: 1, start: 0 },
    "clock.rang": { type: "number", min: 0, max: 9, start: 0 },
    "bunk.slept": { type: "number", min: 0, max: 99, start: 0 },
    "radio.tuned": { type: "boolean", start: false },
    "tb-hub.dim": { type: "boolean", start: false },
    "player.rank": { type: "string", start: "Pruebas" }
  },
  effects: [
    { time: "day 1 12:00", weekday: "mon" },                  // la apertura se juega a mediodía
    { set: "game.entrance", to: "tb-hub" },
    { add: "change", id: "arrival", effects: [
      { time: "day 1 12:00", weekday: "mon" },
      { say: "El centro está iluminado, y todas las puertas están cerradas menos una." }
    ] },
    // Verbos que añade este mundo
    { add: "word", verb: "tune", words: ["sintonizar", "sintoniza", "sintonice", "sintonizo", "ajustar", "ajusta", "ajuste", "ajusto"], object: "required", reply: "Eso no se sintoniza." },
    { add: "word", verb: "whistle", words: ["silbar", "silba", "silbe", "silbo"], object: "none", reply: "Silbas. Nadie responde." },
    { add: "word", verb: "intone", words: ["entonar", "entona", "entone", "entono", "recitar", "recita", "recite", "recito"], speech: true, reply: "Entonas, y la sala no hace caso." },
    { add: "word", verb: "summon", words: ["convocar", "convoca", "convoque", "convoco", "avisar", "avisa", "avise", "aviso"], absent: true, reply: "No viene nadie." },
    { add: "word", verb: "shake", words: ["agitar", "agita", "agite", "agito", "sacudir", "sacude", "sacuda", "sacudo"], object: "required", reply: "Eso no se agita." },
    ...Object.entries(puzzles).map(([id, p]) => ({ add: "puzzle", id, ...p })),
    ...Object.entries(changes).map(([id, effects]) => ({ add: "change", id, effects })),
    ...Object.entries(endingPictures).map(([id, p]) => ({ add: "picture", id, ...p })),
    ...Object.entries(visionPictures).map(([id, p]) => ({ add: "picture", id, ...p })),
    // Estados: drunk (segundos, dosis), poisoned (turnos, daños), cold (segundos, hasta, daños), warm (turnos, curas).
    { add: "condition", id: "drunk", doses: 3, lasts: { seconds: [60, 90] }, starts: "Se te sube la cerveza", ends: "Se te pasa la borrachera", status: "La cerveza se te ha subido a la cabeza",
      filters: ["sway", "ghost"], speech: { slur: true, answer: "«¿Cómo?», dicen, ante tu balbuceo." },
      movement: { chance: 0.3, says: ["Los pies te llevan por otro camino del que querías.", "Sales por un lado, y la sala te da la vuelta."] } },
    { add: "condition", id: "poisoned", lasts: { turns: [8, 10] }, starts: "Te corre el veneno", ends: "El veneno pasa", status: "El veneno te recorre",
      filters: ["tint:poison"], health: { every: { turns: [3, 3] }, hurt: 1, says: ["El veneno te da vueltas por dentro.", "El estómago se te encoge alrededor del veneno."] } },
    { add: "condition", id: "cold", lasts: { seconds: [40, 60] }, until: [{ "player.at": "tb-hub" }], starts: "Tienes frío", ends: "Vuelves a entrar en calor", status: "Tienes un frío que cala hasta los huesos",
      filters: ["tint:cold"], health: { every: { seconds: [25, 35] }, hurt: 1, says: "El frío te muerde las manos." } },
    { add: "condition", id: "warm", lasts: { turns: [6, 8] }, starts: "El calor se te queda en las manos", ends: "Las manos se te enfrían otra vez", status: "Aún tienes en las manos el calor de la estufa",
      health: { every: { turns: [3, 3] }, heal: 1, says: "El calor llega a un sitio donde hacía falta." } },
    { add: "music", ...music, levels },   // la música (music.js, compartida por los dos idiomas; sus niveles, levels.js, generados); la de cada sala, como su `music`
    ...Object.entries(rooms).map(([id, r]) => ({ add: "room", id, ...r, picture: pictures[id], ...(roomMusic[id] ? { music: roomMusic[id] } : {}) })),
    ...Object.entries(objects).map(([id, o]) => ({ add: "object", id, ...o })),
    ...rules.map((rule) => ({ add: "rule", rule })),
    { add: "rule", rule: { id: "board_first", match: { verb: "examine", obj: "board" }, do: [{ say: "$board.examine" }] }, before: "board_status" }
  ]
};
