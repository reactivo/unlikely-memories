// «Hartley's, después del cierre»: el mundo después de la apertura, en español. Escrito, no traducido: la misma trama, las mismas
// salas, cosas, personajes, reglas y finales que world.en.js, con la voz de un autor español (WRITING-DIRECTION.md §8).
// Un solo conjunto de cambios, aplicado tras la apertura, todo o nada. Los ids, las coordenadas, las cifras, los dibujos y los
// sprites son los de la versión inglesa; solo cambia lo que lleva lenguaje.

import pictures, { endings } from "./pictures.js";
import sprites from "./sprites.js";

// ---- La biblia del juego ------------------------------------------------------------------------------------------------
export const bible = {
  title: "Hartley's, después del cierre",
  blurb: "Unos grandes almacenes a punto de cerrar. Pasada cierta hora todo se paga con un recuerdo, y en la cuarta planta se venden las tardes que la gente dejó pasar.",
  thumbnail: { picture: "front_hall", x: 48 },   // la tarjeta de la página de inicio: el dibujo de esta sala, recortado a 225 píxeles desde la columna x (0–95)
  synopsis: "Te encuentras en Hartley's, los viejos grandes almacenes, un sábado poco antes de la hora de cierre. " +
    "Hartley's vende de todo y, pasada cierta hora, el precio de todo es un recuerdo. En la cuarta planta, " +
    "solo con cita previa, vende tardes: las que la gente dejó pasar.",
  tone: "WRITING-DIRECTION.md. Modales de grandes almacenes: caoba, latón, jefes de planta, el correo neumático de la caja, " +
    "un comercio que nunca ha logrado cerrar del todo.",
  start: "Sábado, 17:10, en la planta baja.",
  opening: "El pasaje de atrás de los almacenes, a las cinco menos diez: una bolsa de caramelos de menta (para empezar de nuevo), una " +
    "radio (pistas), una lista de la compra que ya llevas (por qué viniste). La puerta giratoria es la entrada.",
  rules: [
    "Todo en Hartley's tiene un precio, y el precio es un recuerdo.",
    "Los pagos van a la caja por tubo, y solo por tubo.",
    "Los maniquíes solo se mueven mientras nadie los mira.",
    "Hartley's cierra a las seis y nunca se vacía: el cliente que se queda demasiado se convierte en parte del escaparate."
  ],
  endings: [
    "La tarde: paga con un recuerdo que tengas y pruébate la tarde que dejaste pasar. Entras en ella, y la que tenías desaparece.",
    "Tuyo: sube el recuerdo a la azotea y suéltalo. Hartley's ya no tiene nada que venderte.",
    "El escaparate: quédate demasiado (tensión). Por la mañana estás en el escaparate principal, con un precio en la manga."
  ],
  chaos: 0.3
};

// ---- Ayudas (se leen como las palabras de las reglas) ----------------------------------------------------------------------
const at = (...rooms) => ({ "player.at": rooms.length > 1 ? { in: rooms } : rooms[0] });
const holding = (id) => ({ [id + ".at"]: "player" });
const tension = (n) => ({ set: "game.tension", add: n });
const item = (id) => ({ img: id, sprite: sprites[id], ...(sprites[id + "_floor"] ? { floorSprite: sprites[id + "_floor"] } : {}) });

// ---- Los dibujos de los finales ---------------------------------------------------------------------------------------------
// Los dibujos no llevan lengua (pictures.js); lo que cada uno dice a un lector de pantalla (alt) se dice aquí, en español.
const endingPictures = {
  afternoon: { alt: "A través de la ventanilla bajada de un autobús: un mar brillante a lo largo del horizonte, un talud verde que pasa y un codo apoyado en el marco.", picture: endings.afternoon },
  kept: { alt: "Una azotea al atardecer, vista desde abajo, entre las chimeneas. Un frasquito abierto, y de él sube una columna alta de luz dorada y pálida, muy por encima de los tejados.", picture: endings.kept },
  window: { alt: "El escaparate principal de unos grandes almacenes al amanecer, visto desde la acera. Tres figuras inmóviles dentro: dos maniquíes y, entre ellos, tú, con un abrigo algo más cálido que el tuyo y una pequeña etiqueta roja con el precio en la manga.", picture: endings.window },
  died: { alt: "El techo de la tienda, visto desde el suelo: un haz de tubos neumáticos que se alejan hacia una sola lámpara amarilla y, abajo, la punta de tus zapatos.", picture: endings.died }
};

// ---- Salas -----------------------------------------------------------------------------------------------------------------
// Área "store" (x crece al este, y al sur, z es la planta: -1 el sótano, 0 la planta baja, hasta 3, la azotea).
// Área "fourth": la cuarta planta, a la que solo se llega en ascensor.
const rooms = {
  // La apertura (GUIDE.md §8): el pasaje de atrás de los almacenes, cerrado por los dos extremos, adonde no se vuelve. El área "arcade" es solo suya.
  pavement: {
    name: "EL PASAJE", area: "arcade", at: [0, 0, 0],
    describe: [
      "El pasaje de atrás de Hartley's, a las cinco menos diez de un sábado: un corredor de baldosas bajo un techo de cristal, con la persiana echada a tu espalda. Todos los escaparates están encendidos, y los vestidos se han vuelto un poco hacia ti. Huele a paraguas mojados.",
      "La única entrada es la {puerta giratoria|street_door}, al norte."
    ],
    exits: { n: true },
    scenery: [
      { words: ["escaparate", "escaparates", "cristal", "cristales", "vitrina", "vitrinas", "vestidos", "vestido"], name: "los escaparates", says: "Vestidos sobre sus bustos, de colores de antes de que nacieras, cada uno vuelto unos grados hacia ti. Los del fondo, unos grados más." },
      { words: ["repisa", "repisas", "borde", "saliente", "alféizar", "alfeizar"], name: "la repisa", says: "Una repisa de piedra, lo bastante ancha para una bolsa de caramelos, pulida por gente que se paró a mirar vestidos y ya no se marchó." },
      { words: ["pasaje", "galería", "galeria", "techo", "baldosas", "baldosa", "suelo", "persiana", "calle"], name: "el pasaje", says: "Baldosas mojadas, aunque no ha llovido, y un techo de cristal con los últimos restos de luz. La persiana a tu espalda no tiene tirador, y la calle de más allá es el sábado de otro." }
    ],
    mentions: ["escaparates", "vestidos", "repisa", "puerta giratoria"],
    ambience: { lines: ["En el escaparate más cercano, un vestido ha cambiado las manos de sitio y mira al cristal como si no lo hubiera hecho.", "Al otro lado de la persiana arrastran algo pesado, y nadie pide perdón.", "En algún lugar, dentro, alguien se ríe de un precio.", "La radio de la repisa encuentra una emisora, la pierde y pide disculpas."], every: [30, 70] },
    alt: "Un pasaje cubierto, con techo de cristal, al anochecer, visto desde el suelo y cerrado por los dos extremos: escaparates iluminados y llenos de vestidos a lo largo de las dos paredes, una puerta giratoria en el muro ciego del fondo y una lámpara a su lado.",
    overlayAlt: {
      wireless: "Una pequeña radio color crema en la repisa.",
      mints: "Una bolsa de papel con caramelos de menta en la repisa."
    }
  },
  front_hall: {
    name: "HARTLEY'S", area: "store", at: [1, 1, 0],
    describe: [
      "La planta baja de Hartley's, toda caoba y latón, como lo es desde que a tu abuela le tomaron medidas para su primer abrigo. Estás de pie sobre el mosaico, junto al {directorio|directory}, como si siempre hubieras estado a punto de entrar.",
      "La {puerta giratoria|revolving_door} gira despacio, sola. El {señor Gage|gage}, jefe de planta, lleva un clavel y lo vigila todo. Perfumería queda al oeste, guantería al este, los ascensores al norte."
    ],
    exits: { w: "perfumery", e: "gloves", n: "lift_lobby", s: true },
    scenery: [{ words: ["mosaico", "caoba", "latón", "laton", "mostradores", "mostrador", "techo", "araña", "arana", "vestíbulo", "vestibulo"], name: "el vestíbulo", says: "Un mosaico de un barco a toda vela, gastado en la proa por cien años de gente que se ha puesto donde tú te pones." }],
    mentions: ["mosaico", "directorio", "puerta giratoria", "señor Gage", "clavel"],
    ambience: { lines: ["En algún lugar suena una caja registradora, aunque nadie ha comprado nada.", "Una cápsula pasa por encima de ti, por su tubo, con prisa, como un pensamiento camino de alguien.", "La puerta giratoria da una vuelta vacía y se detiene."], every: [45, 90] },
    alt: "Un gran vestíbulo de almacén: mostradores de caoba, latón y un suelo de mosaico con un barco. Un panel de directorio sobre un pie, un jefe de planta con un clavel y una puerta giratoria al frente."
  },
  perfumery: {
    name: "PERFUMERÍA", area: "store", at: [0, 1, 0],
    describe: [
      "Mostradores de frascos alineados como un coro a punto de cantar. Cada frasco huele a una tarde concreta. {Madame Corre|corre} está entre ellos, con guantes blancos.",
      "Sobre el mostrador, una {muestra|tester} con una etiqueta escrita de su puño y letra. El vestíbulo queda al este."
    ],
    exits: { e: "front_hall" },
    scenery: [{ words: ["frascos", "frasco", "mostradores", "mostrador", "coro", "perfumes", "botellas", "estantes"], name: "los frascos", says: "Frasquitos con etiquetas escritas a mano: EL ÚLTIMO DÍA DE LAS VACACIONES. UN PASILLO DE HOSPITAL POR LA NOCHE. LA NIEVE, ANTES DE CAER. No están en venta. Son la materia prima de Madame Corre." }],
    mentions: ["frascos", "Madame Corre", "guantes", "muestra", "etiqueta", "mostrador"],
    smell: "Veinte tardes a la vez, ninguna tuya, todas casi.",
    alt: "Un mostrador de perfumería abarrotado de frasquitos en estantes de cristal. Una mujer alta con guantes blancos detrás; un solo frasco de muestra sobre el mostrador, delante."
  },
  gloves: {
    name: "GUANTERÍA", area: "store", at: [2, 1, 0],
    describe: [
      "Cajones de guantes hasta el techo, cada par dormido entre papel de seda. Una cartulina sobre el mostrador dice VUELVO EN CINCO MINUTOS, con una letra que hace mucho que pasó de moda.",
      "Sobre el mostrador yace un {guante|glove} solo, con los dedos cerrados, como se cierra una mano sobre algo que lleva en el bolsillo. El vestíbulo queda al oeste."
    ],
    exits: { w: "front_hall" },
    scenery: [{ words: ["cajones", "cajón", "cajon", "papel", "seda", "pares", "mostrador", "cartulina", "letrero", "minutos"], name: "los cajones", says: "Cada cajón lleva una talla y un sentimiento: SIETE Y MEDIO, NERVIOSA. OCHO, PARA ENTIERROS. La cartulina del mostrador se ha puesto amarilla de esperar." }],
    mentions: ["cajones", "papel de seda", "guante", "mostrador"],
    alt: "Un mostrador de guantería con paredes altas de cajoncitos de madera. Sobre el mostrador, un guante color crema solo, con los dedos curvados y cerrados."
  },
  lift_lobby: {
    name: "LOS ASCENSORES", area: "store", at: [1, 0, 0],
    describe: [
      "Puertas de ascensor, de latón, bajo un {indicador|indicator} que señala plantas que nadie pide desde hace años: S, PB, 1, 2, 4.",
      "El ascensor está al norte, con la reja abierta. Una escalera sube a la primera planta; unos escalones bajan al sótano. El vestíbulo queda al sur."
    ],
    exits: { n: { to: "lift", in: true }, s: "front_hall", u: "first_landing", d: "basement" },
    scenery: [{ words: ["escalera", "escaleras", "barandilla", "pasamanos"], name: "la escalera", says: "Una escalera ancha, con barandilla de caoba, que sube.", leads: "u" },
              { words: ["escalones", "escalón", "escalon", "sótano", "sotano"], name: "los escalones", says: "Escalones de piedra que bajan al sótano, con un olor a jabón que sube por ellos.", leads: "d" },
              { words: ["puertas", "puerta", "reja", "ascensor", "ascensores"], name: "las puertas del ascensor", says: "Puertas de latón y, tras ellas, una reja de latón, plegada.", leads: "n" }],
    mentions: ["ascensor", "indicador", "escalera", "escalones", "reja"],
    alt: "Un vestíbulo de ascensores: puertas de latón con una reja plegable abierta, un indicador semicircular de plantas encima, una escalera que sube a un lado y escalones de piedra que bajan al otro."
  },
  lift: {
    name: "EL ASCENSOR", area: "store", at: [1, -1, 0],
    describe: [
      "Un ascensor como un pequeño salón: un espejo, un banco de terciopelo, una reja de latón. El {señor Pell|pell} está sentado en su taburete junto a la {palanca|lift_lever} y mira al techo, donde estarían las plantas.",
      "La reja se abre al sur, al vestíbulo."
    ],
    exits: { s: { to: "lift_lobby", out: true }, u: true, d: false },
    scenery: [{ words: ["espejo", "banco", "terciopelo", "taburete", "techo", "botones", "boton", "botón", "reja", "ascensor"], name: "el ascensor", says: "No hay botones. Está el señor Pell, y la palanca, y una pequeña cerradura de latón junto al número 4. La reja está plegada, abierta al vestíbulo.", leads: "s" }],
    mentions: ["espejo", "banco", "reja", "señor Pell", "taburete", "palanca"],
    alt: "El interior de un ascensor antiguo: un espejo, un banco de terciopelo rojo, una reja plegable de latón y un hombre de uniforme sentado en un taburete, con una mano cerca de una palanca de latón."
  },
  first_landing: {
    name: "PRIMERA PLANTA", area: "store", at: [1, 0, 1],
    describe: [
      "El descansillo de la primera planta: una palmera en una maceta de latón y una alfombra gastada hasta la trama por quienes dudan hacia dónde ir.",
      "Mercería queda al oeste, juguetes al este. La escalera sube y baja."
    ],
    exits: { w: "haberdashery", e: "toys", u: "second_landing", d: "lift_lobby" },
    scenery: [{ words: ["palmera", "maceta", "alfombra", "hilos", "trama"], name: "la palmera", says: "Una palmera que lleva en la primera planta más tiempo que nadie. Se inclina hacia la escalera, como si pensara irse." },
              { words: ["escalera", "escaleras", "barandilla"], name: "la escalera", says: "Una escalera de caoba que sube a la segunda planta y baja a la planta baja." }],
    mentions: ["palmera", "maceta", "alfombra", "escalera"],
    alt: "Un descansillo ancho con alfombra roja gastada, una palmera en una maceta de latón y escaleras que suben y bajan. Arcos a izquierda y derecha."
  },
  haberdashery: {
    name: "MERCERÍA", area: "store", at: [0, 0, 1],
    describe: [
      "Cintas en carretes, botones en cajones y un mostrador donde la {señorita Thimble|thimble} lo mide todo dos veces. Sobre ella, los {tubos|tubes} de latón del correo neumático suben hasta el techo.",
      "Una {cápsula|canister} espera en su soporte, bajo un {tirador|handle}. El descansillo queda al este."
    ],
    exits: { e: "first_landing" },
    scenery: [{ words: ["cintas", "cinta", "carretes", "carrete", "botones", "cajones", "mostrador", "metro"], name: "las cintas", says: "Cintas de todos los colores, en carretes, y un metro de latón atornillado al borde del mostrador, gastado en la primera vara." }],
    mentions: ["cintas", "botones", "mostrador", "señorita Thimble", "tubos", "cápsula", "tirador"],
    alt: "Un mostrador de mercería con carretes de cinta de colores y cajoncitos de botones. Una mujer con un metro. Sobre ella, tubos de latón suben hasta el techo; una cápsula descansa en su soporte, bajo un tirador."
  },
  toys: {
    name: "JUGUETES", area: "store", at: [2, 0, 1],
    describe: [
      "Caballitos de balancín, soldados de plomo, un tren eléctrico que da vueltas a una mesa en un bucle que no lleva a ninguna parte. Un {oso de cuerda|bear} espera en un estante a que le den cuerda.",
      "El descansillo queda al oeste."
    ],
    exits: { w: "first_landing" },
    scenery: [{ words: ["soldados", "soldado", "tren", "trenecito", "mesa", "bucle", "juguetes", "estante", "estantes", "caballitos"], name: "los juguetes", says: "Los soldados forman en filas, de cara a la escalera. El tren da vueltas. Nadie ha comprado aquí un juguete desde que los niños crecieron." }],
    mentions: ["soldados", "tren", "oso de cuerda", "estante"],
    alt: "Una sección de juguetes: estantes de soldados y caballitos de balancín, un tren en miniatura que rodea una mesa y un pequeño oso marrón de cuerda sentado en un estante."
  },
  second_landing: {
    name: "SEGUNDA PLANTA", area: "store", at: [1, 0, 2],
    describe: [
      "El descansillo de la segunda planta, más tranquilo, con olor a moqueta nueva. Una {puerta|roof_door} al final de un tramo corto de escalones dice JARDÍN DE LA AZOTEA, CERRADO POR INVIERNO. Lleva cerrada muchos inviernos.",
      "Muebles queda al oeste, abrigos al este. La escalera baja."
    ],
    exits: { w: "furniture", e: "coats", d: "first_landing", u: true },
    scenery: [{ words: ["escalera", "escaleras", "barandilla", "moqueta"], name: "la escalera", says: "La escalera principal baja a la primera planta.", leads: "d" },
              { words: ["tramo", "escalones", "peldaños", "peldanos"], name: "el tramo", says: "Un tramo corto sube hasta la puerta de la azotea.", leads: "u" }],
    mentions: ["moqueta", "puerta", "tramo", "escalera"],
    alt: "Un descansillo tranquilo con moqueta nueva. Un corto tramo de escalones sube a una puerta pintada con un letrero. Arcos a izquierda y derecha."
  },
  furniture: {
    name: "MUEBLES", area: "store", at: [0, 0, 2],
    describe: [
      "Habitaciones sin paredes: un comedor, un dormitorio, una sala de estar, cada una dispuesta para una familia que no ha llegado. El {sofá|sofa} de la sala de estar aún conserva la forma de alguien.",
      "El descansillo queda al este; el salón de té, al oeste."
    ],
    exits: { e: "second_landing", w: "tea_room" },
    scenery: [{ words: ["habitaciones", "habitación", "habitacion", "comedor", "dormitorio", "sala", "estar", "mesa", "cama", "lámpara", "lampara", "familia"], name: "las habitaciones", says: "Cubiertos puestos en la mesa, una lámpara en la mesilla, zapatillas junto a la cama. Todo está esperando a ser de alguien." }],
    mentions: ["comedor", "dormitorio", "sala de estar", "sofá"],
    alt: "Una planta de muebles dispuesta como habitaciones sin paredes: una mesa de comedor puesta para cuatro, una cama con una lámpara y un sofá hondo con un hueco en los cojines."
  },
  tea_room: {
    name: "SALÓN DE TÉ", area: "store", at: [-1, 0, 2],
    describe: [
      "Doce mesas, palmeras, un carrito de pasteles bajo campanas de plata. {Dot|dot}, la camarera, lleva desde la guerra sirviendo la misma tetera en la misma mesa vacía.",
      "Una ventana da a los tejados de la ciudad. Muebles queda al este."
    ],
    exits: { e: "furniture" },
    scenery: [{ words: ["mesas", "mesa", "palmeras", "carrito", "pasteles", "campanas", "ventana", "tejados", "tetera"], name: "el salón de té", says: "Desde la ventana, los tejados de la ciudad se alejan en todas direcciones. Por encima de la tienda, una azotea que nadie visita." }],
    mentions: ["mesas", "palmeras", "carrito", "pasteles", "Dot", "ventana", "tejados"],
    alt: "Un salón de té: mesitas redondas con manteles blancos, palmeras en macetas, un carrito de pasteles con campanas de plata, una camarera con una tetera y una ventana alta sobre los tejados."
  },
  coats: {
    name: "ABRIGOS", area: "store", at: [2, 0, 2],
    describe: [
      "Abrigos en las barras y abrigos puestos a los {maniquíes|mannequins}, en fila, de cara a la puerta. Cuando miras a otro lado, se vuelven hacia ti.",
      "Uno lleva un abrigo exactamente como el tuyo, solo que algo más cálido. El descansillo queda al oeste."
    ],
    exits: { w: "second_landing" },
    scenery: [{ words: ["barras", "barra", "abrigos", "perchas"], name: "las barras", says: "Abrigos para todos los climas, y una barra al fondo para los climas que aún no se han inventado." }],
    mentions: ["barras", "maniquíes", "abrigo"],
    ambience: { lines: ["Por el rabillo del ojo, un maniquí baja la mano.", "Una percha tintinea contra una barra, una vez, sin que nadie esté cerca.", "Los maniquíes están exactamente donde estaban. Casi lo podrías jurar."], every: [40, 80] },
    alt: "Una sección de abrigos: barras de abrigos y una fila de maniquíes pálidos con abrigos y sombreros, todos de cara a la puerta."
  },
  basement: {
    name: "SÓTANO", area: "store", at: [1, 0, -1],
    describe: [
      "El sótano: ollas, escobas, olor a jabón. En el centro se alza la caja, una cabina de latón y cristales esmerilados donde desembocan todos los tubos de la tienda.",
      "Dentro, la {señorita Ruth|ruth} ordena las cápsulas según caen. Los escalones suben."
    ],
    exits: { u: "lift_lobby" },
    scenery: [{ words: ["ollas", "cazuelas", "escobas", "jabón", "jabon", "cabina", "caja", "cristales", "tubos", "latón", "laton"], name: "la caja", says: "Una cabina de latón con cristales esmerilados y un cartelito: TODOS LOS PAGOS POR TUBO. Los tubos de todas las plantas bajan hasta ella como las raíces de algo." },
              { words: ["escalones", "escalera"], name: "los escalones", says: "Escalones de piedra que suben a los ascensores.", leads: "u" }],
    mentions: ["ollas", "escobas", "caja", "señorita Ruth", "escalones", "cristales"],
    alt: "Un sótano de estantes con ollas y escobas. En el centro, una cabina de latón con cristales esmerilados, tubos que bajan del techo hasta su tejado y la silueta de una mujer dentro."
  },
  roof_garden: {
    name: "LA AZOTEA", area: "store", at: [1, 0, 3],
    describe: [
      "Grava, rosales desnudos en tinas y un {banco|roof_bench} frente a la ciudad. Los tejados se pierden en todas direcciones, con las chimeneas de pie, como gente esperando el autobús.",
      "Nadie se ha sentado aquí desde que cerraron el jardín. La puerta de la escalera está abajo."
    ],
    exits: { d: "second_landing" },
    scenery: [{ words: ["grava", "rosales", "rosal", "tinas", "tejados", "chimeneas", "ciudad", "cielo"], name: "los tejados", says: "Pizarra y chimeneas, la fábrica de gas, el chapitel de una iglesia. Desde aquí arriba la ciudad parece algo que se podría doblar y guardar." },
              { words: ["puerta", "escalera"], name: "la puerta", says: "La puerta de la azotea, abierta, y la escalera que baja.", leads: "d" }],
    mentions: ["grava", "rosales", "tinas", "banco", "tejados", "chimeneas", "puerta"],
    alt: "Un jardín en la azotea: grava, rosales desnudos en tinas, un banco de madera frente a un horizonte de tejados y chimeneas bajo un cielo azul oscuro."
  },
  fourth_floor: {
    name: "LA CUARTA PLANTA", area: "fourth", at: [0, 0, 4],
    describe: [
      "Una sala larga de barras y, en las barras, tardes, colgadas como abrigos, cada una con una etiqueta de letra cuidadosa. Una lluviosa, de un gris que te favorecería. Una azul que huele a mar.",
      "Bajo su propia lámpara cuelga la {tarde|afternoon} a la que no fuiste. La {modista|fitter} espera con alfileres en la boca. El ascensor queda al sur."
    ],
    exits: { s: { to: "lift", in: true } },
    scenery: [{ words: ["barras", "barra", "tardes", "etiquetas", "etiqueta", "gris", "azul", "lámpara", "lampara"], name: "las tardes", says: "AGOSTO DE 1958, LA FERIA. UN DOMINGO SIN VISITAS. EL AUTOBÚS QUE SE DEJÓ PASAR. Cada una cortada a la medida de alguien, y ninguna recogida." }],
    mentions: ["barras", "tardes", "etiqueta", "tarde", "modista", "lámpara"],
    alt: "Una sala larga y en penumbra, con barras de ropa de las que cuelgan formas blandas de distintos colores, como abrigos hechos de tiempo. Al fondo, una cuelga bajo una lámpara y una mujer con un acerico espera a su lado."
  }
};

// ---- Cosas -----------------------------------------------------------------------------------------------------------------
const objects = {
  // La apertura: las dos cosas que se cogen, la que ya llevas y el camino hacia dentro (BRIEF.md §3).
  mints: { at: "pavement", portable: true, name: "Bolsa de caramelos", note: "Toma uno para volver a empezar.", actions: ["Coger bolsa", "Comer caramelo"], heldActions: ["Comer caramelo", "Examinar bolsa"],
    words: { nouns: ["bolsa", "caramelos", "caramelo", "mentas", "menta", "bolsita", "dulces", "dulce"], adj: ["papel", "rayada", "de"], g: "f" }, ...item("mints"),
    here: "En la repisa del escaparate más cercano hay una {bolsa|mints} de papel, llena de caramelos de menta.",
    examine: "Una bolsa de papel rayada, retorcida por arriba. Dentro, caramelos de menta, cada uno en su envoltorio, cada uno todavía tibio de una mano. La bolsa nunca pesa menos." },
  wireless: { at: "pavement", portable: true, name: "Radio", note: "Anunciando las secciones.", actions: ["Coger radio", "Escuchar radio"], heldActions: ["Escuchar radio", "Examinar radio"],
    words: { nouns: ["radio", "transistor", "aparato", "receptor", "emisora"], adj: ["crema", "pequeña", "pequena", "vieja"], g: "f" }, ...item("wireless"),
    here: "A su lado, una {radio|wireless} pequeña murmura para sí.",
    examine: "Una radio color crema, del tamaño de una hogaza, sintonizada entre dos emisoras. Una voz de mujer anuncia las secciones de Hartley's, planta por planta, y vuelve a empezar por arriba." },
  shopping_list: { at: "player", portable: true, name: "Lista de la compra", note: "Casi borrada.", actions: ["Leer lista"], heldActions: ["Leer lista"],
    words: { nouns: ["lista", "papelito", "apunte"], adj: ["compra", "lapiz", "doblada"], g: "f" }, ...item("shopping_list"),
    examine: "Con tu propio lápiz: «Algo que debería recordar». Debajo, borrada tantas veces que el papel se ha gastado hasta romperse, una segunda línea." },
  street_door: { at: "pavement", scenery: true, name: "Puerta giratoria", note: "Girando, sin nadie dentro.", actions: ["Examinar puerta", "Entrar en la puerta"],
    words: { nouns: ["puerta"], adj: ["giratoria", "latón", "laton", "principal", "delantera"], g: "f" },
    examine: "Latón y cristal, girando despacio sin nadie dentro. Cada vidrio muestra una tarde un poco posterior a la del anterior." },

  // Planta baja
  directory: { at: "front_hall", scenery: true, name: "Directorio", note: "Todas las plantas, en oro.", actions: ["Leer directorio"], opens: ["fourth", "roof"],
    words: { nouns: ["directorio", "panel", "cartel", "índice", "indice", "letras"], adj: ["tienda", "dorado", "negro"], g: "m" },
    examine: "Letras doradas sobre fondo negro: SÓTANO, ARTÍCULOS PARA EL HOGAR Y CAJA. BAJA, PERFUMERÍA, GUANTERÍA. PRIMERA, MERCERÍA, JUGUETES. SEGUNDA, MUEBLES, ABRIGOS, SALÓN DE TÉ. AZOTEA (CERRADA). CUARTA, TARDES PERDIDAS, CON CITA PREVIA. Entre la SEGUNDA y la CUARTA no hay nada, y nadie ha preguntado nunca por qué." },
  indicator: { at: "lift_lobby", scenery: true, name: "Indicador", note: "De la S al 4.", actions: ["Examinar indicador"], opens: ["fourth"],
    words: { nouns: ["indicador", "flecha", "letras", "esfera", "números", "numeros"], adj: ["planta", "latón", "laton"], g: "m" },
    examine: "Una media luna de latón con una flecha: S, PB, 1, 2 y luego, tras un hueco, 4. La flecha descansa en el 4 y lleva años así. Bajo el 4, grabado: TARDES PERDIDAS. CON CITA PREVIA." },
  revolving_door: { at: "front_hall", scenery: true, name: "Puerta giratoria", note: "Girando sola.", actions: ["Empujar puerta giratoria"],
    words: { nouns: ["puerta", "puertas"], adj: ["giratoria", "principal", "delantera", "entrada"], g: "f" },
    examine: "Cuatro hojas de caoba y cristales biselados, girando despacio. A través de ellas, el pasaje tiene el color del té.",
    push: "Empujas. La puerta te da la vuelta entera y te deja otra vez dentro, algo más cortésmente que antes. Hartley's no deja marchar a nadie sin quedarse con algo." },
  gage: { at: "front_hall", scenery: true, name: "Señor Gage", note: "El jefe de planta.", actions: ["Hablar con Gage"],
    words: { nouns: ["gage", "encargado", "jefe", "hombre", "clavel"], adj: ["señor", "senor", "planta"], g: "m" },
    examine: "Un hombre alto, de chaqué, con un clavel que lleva treinta años fresco. Te mira como mira la mercancía.",
    talk: ["«¿La atienden, señora?», dice, y luego, mirándote otra vez, «¿Y a usted, caballero?». No se decide por ninguno. «Todo tiene su precio en Hartley's. Échele un vistazo».", "«Cerramos a las seis», dice. «Nunca hemos conseguido estar cerrados del todo»."],
    topics: {
      fourth: { label: "la cuarta planta", words: ["cuarta", "planta", "tardes", "cita", "citas"], says: "«Tardes perdidas. Con cita previa. La caja expide las citas; el pago, por tubo, desde mercería»." },
      roof: { about: "roof_door", label: "la azotea", words: ["azotea", "jardín", "jardin", "invierno"], says: "«Cerrada por invierno. La llave fue a Guantería a que la arreglaran y no ha vuelto. Los guantes guardan lo que les dan»." },
      price: { label: "los precios", words: ["precio", "precios", "pagar", "pago", "dinero", "recuerdo", "recuerdos"], says: "«Antes de las seis, lo de siempre. Después de las seis, un recuerdo». Consulta su reloj. «Más o menos las seis»." },
      closing: { open: true, label: "el cierre", words: ["cierre", "cerrar", "cerramos", "seis", "hora", "salir", "marcharse"], says: "«Las seis en punto. Los clientes que se quedan se colocan donde son útiles. En los escaparates, casi siempre»." },
      default: "«No sabría decírselo», dice, «y estoy seguro de que lo tenemos en existencias»."
    } },

  // Perfumería
  corre: { at: "perfumery", scenery: true, name: "Madame Corre", note: "Perfumista. Guantes blancos.", actions: ["Hablar con Madame Corre"],
    words: { nouns: ["corre", "perfumista", "señora", "senora", "madame", "mujer"], adj: ["madame"], g: "f" },
    examine: "Una mujer alta, con el pelo recogido en lo alto, curvo como una pregunta. Sus guantes blancos nunca han tocado nada que no quisiera ser tocado.",
    parts: [{ words: ["guantes", "guante", "moño", "mono", "pelo"], name: "sus guantes", says: "Guantes blancos, abotonados en la muñeca. No se los quita por nadie." }], mentions: ["guantes"],
    talk: "«Huela la muestra», dice. «Yo embotello lo que usted recuerda. Es lo único que aceptan aquí como pago».",
    topics: {
      tester: { about: "tester", label: "la muestra", words: ["muestra", "probador", "perfume", "oler", "frasco"], says: "«El número siete. Le recuerda a todo el mundo algo que tuvo. Una por cabeza; los recuerdos no son muestras»." },
      price: { label: "los precios", words: ["precio", "precios", "pagar", "pago", "dinero", "recuerdos"], says: "«Todo en Hartley's se paga con algo que se recuerda. La caja no es sentimental»." },
      keeping: { about: "memory", label: "el recuerdo", words: ["recuerdo", "guardar", "conservar", "quedarse", "libre", "azotea", "alto", "cielo", "soltar", "destapar"], says: "«Podría conservarlo, claro. Llévelo a un sitio alto, bajo el cielo, y suéltelo. Entonces será suyo para siempre y nadie podrá volver a vendérselo»." },
      default: "Alza un frasco, lo huele y lo devuelve a su sitio. «No», dice. «Eso no»."
    } },
  tester: { at: "perfumery", scenery: true, name: "Muestra", note: "N.º 7.", actions: ["Oler muestra", "Leer etiqueta"], opens: ["price"],
    words: { nouns: ["muestra", "probador", "tester", "perfume", "pulverizador", "atomizador", "etiqueta", "pera", "frasco"], adj: ["cristal", "número", "numero", "siete", "de"], g: "f" },
    examine: "Un frasco de cristal tallado con una pera de goma. La etiqueta dice: N.º 7. UNA TARDE EN CASA. Y debajo, más pequeño: PRECIO A CONSULTAR." },
  memory: { at: null, portable: true, name: "Recuerdo", note: "Una tarde embotellada.", actions: ["Examinar recuerdo"], heldActions: ["Oler recuerdo", "Abrir recuerdo"],
    words: { nouns: ["recuerdo", "frasquito", "frasco", "botellita", "tapón", "tapon", "corcho"], adj: ["pequeño", "pequeno", "taponado"], g: "m" }, ...item("memory"),
    here: "Un {frasquito|memory} con tapón de corcho está aquí, con una tarde dentro.",
    examine: "Un frasquito con tapón de corcho. Dentro, muy pequeños, la lluvia en la ventana de una cocina y alguien a quien querías, dormido en una butaca. Está tibio al sostenerlo.",
    smell: "Lluvia, tostadas, una radio en la habitación de al lado. Tuviste esa tarde. Habías olvidado que la tenías." },

  // Guantería
  glove: { at: "gloves", scenery: true, name: "Guante", note: "Sujetando algo.", actions: ["Examinar guante", "Estrechar la mano al guante"],
    words: { nouns: ["guante", "dedos"], adj: ["crema", "solo", "suelto", "cabritilla", "izquierdo", "único", "unico", "solitario"], g: "m" },
    examine: "Un guante de cabritilla color crema, izquierdo, con los dedos cerrados en torno a algo. Está tibio, como una mano que acabara de sostener otra.",
    take: "No se deja llevar. Prefiere que le den la mano.",
    talk: "El guante no dice nada. Los dedos se mueven apenas, como los de una mano que espera que se la tomen." },
  roof_key: { at: null, portable: true, name: "Llave de la azotea", note: "Larga, de latón, arreglada.", actions: ["Examinar llave"],
    words: { nouns: ["llave", "llavín", "llavin"], adj: ["azotea", "latón", "laton", "larga", "arreglada", "de"], g: "f" }, ...item("roof_key"),
    here: "Una {llave|roof_key} larga de latón yace aquí, con una etiqueta que dice AZOTEA.",
    examine: "Una llave larga de latón con una etiqueta de papel: AZOTEA. ARREGLADA. La han arreglado con tanto cuidado que cuesta decir dónde." },

  // El ascensor
  pell: { at: "lift", scenery: true, name: "Señor Pell", note: "El ascensorista.", actions: ["Hablar con Pell"],
    words: { nouns: ["pell", "ascensorista", "hombre", "operador", "empleado"], adj: ["señor", "senor", "ascensor"], g: "m" },
    examine: "Un hombrecillo de uniforme granate, con una franja en cada pernera. Ha subido y bajado en el ascensor durante tanto tiempo que ya no cree en las escaleras.",
    talk: "«Solo la cuarta», dice el señor Pell. «Para el resto, escaleras. Con cita previa».",
    topics: {
      fourth: { label: "la cuarta planta", words: ["cuarta", "planta", "tardes", "cita", "citas", "subir"], says: "«Tardes perdidas. Necesitará un volante de cita. El pago, por tubo, desde mercería, y la caja le devuelve uno»." },
      lift: { open: true, label: "el ascensor", words: ["ascensor", "palanca", "pisos", "piso"], says: "«Solo llega hasta la cuarta», dice, dando unas palmadas a la palanca. «No le gustan las otras plantas. A mí tampoco»." },
      default: "«No sabría decírselo», dice el señor Pell. «Yo siempre estoy entre dos plantas»."
    } },
  lift_lever: { at: "lift", scenery: true, name: "Palanca", note: "La del señor Pell.", actions: ["Examinar palanca"],
    words: { nouns: ["palanca", "manija"], adj: ["latón", "laton", "ascensor", "de"], g: "f" },
    examine: "Una palanca de latón sobre una media luna de números. El 4 tiene una cerradura al lado, en lugar de una muesca.",
    pull: "El señor Pell pone su mano sobre la tuya, con amabilidad, y la aparta de la palanca. «Mía», dice." },

  // Mercería
  thimble: { at: "haberdashery", scenery: true, name: "Señorita Thimble", note: "Mide dos veces.", actions: ["Hablar con Thimble"],
    words: { nouns: ["thimble", "dedal", "mercera", "dependienta", "mujer"], adj: ["señorita", "senorita"], g: "f" },
    examine: "Una mujer menuda con un metro al cuello y alfileres en la solapa, por orden de tamaño.",
    talk: "«Se mide dos veces y se paga una», dice la señorita Thimble. «Los pagos suben por el tubo».",
    topics: {
      tubes: { about: "tubes", label: "los tubos", words: ["tubo", "tubos", "correo", "neumático", "neumatico", "cápsula", "capsula", "tirador", "pago", "pagar"], says: "«Meta el pago en la cápsula, tire del tirador y la caja hace el resto. Cuidado con los dedos en los tubos: son glotones»." },
      fourth: { label: "la cuarta planta", words: ["cuarta", "tardes", "cita"], says: "«¿Tardes? Eso es la cuarta. Primero tendrán que pagarlas»." },
      default: "«Eso no lo tenemos», dice, «pero puedo tomarle las medidas»."
    } },
  tubes: { at: "haberdashery", scenery: true, name: "Tubos", note: "El correo neumático.", actions: ["Examinar tubos"],
    words: { nouns: ["tubos", "tubo", "correo", "tuberías", "tuberia", "tuberias"], adj: ["latón", "laton", "caja", "neumático", "neumatico", "de"], g: "m", pl: true },
    examine: "Tubos de latón, pulidos por el aire que corre dentro. De vez en cuando uno aspira, con fuerza, y toda la planta lo oye." },
  canister: { at: "haberdashery", scenery: true, container: true, open: true, name: "Cápsula", note: "En su soporte.", actions: ["Examinar cápsula", "Tirar del tirador"],
    words: { nouns: ["cápsula", "capsula", "cilindro", "soporte", "cartucho"], adj: ["latón", "laton", "caja", "de"], g: "f" },
    examine: "Una cápsula de latón con fieltro en cada extremo, abierta, esperando algo que llevar. Ha ido a la caja y ha vuelto más veces de las que nadie ha ido a ninguna parte." },
  handle: { at: "haberdashery", scenery: true, name: "Tirador", note: "Envía la cápsula.", actions: ["Tirar del tirador"],
    words: { nouns: ["tirador", "cadena", "asa", "manilla"], adj: ["latón", "laton", "madera", "de"], g: "m" },
    examine: "Un tirador de madera en una cadena de latón, con un pequeño rótulo esmaltado: TIRAR PARA ENVIAR." },

  // Juguetes
  bear: { at: "toys", scenery: true, name: "Oso de cuerda", note: "Espera a que le den cuerda.", actions: ["Dar cuerda al oso"],
    words: { nouns: ["oso", "osito", "peluche", "juguete"], adj: ["cuerda", "marrón", "marron", "pequeño", "pequeno", "de"], g: "m" },
    examine: "Un oso marrón de cuerda, con una llave en la espalda y una oreja cosida otra vez con un color que no es el suyo. Tiene botones por ojos, y han visto mucho de la primera planta." },

  // Segunda planta
  roof_door: { at: "second_landing", scenery: true, name: "Puerta de la azotea", note: "Cerrada por invierno.", actions: ["Examinar puerta", "Abrir puerta con llave"], opens: ["roof"],
    words: { nouns: ["puerta", "letrero", "cartel", "rótulo", "rotulo"], adj: ["azotea", "jardín", "jardin", "pintada", "de"], g: "f" },
    examine: "Una puerta pintada al final de un tramo corto. JARDÍN DE LA AZOTEA, CERRADO POR INVIERNO. Cerrada con llave; el ojo de la cerradura es largo y color latón, como si echara algo de menos.",
    locked: true, lock: { key: "roof_key", says: "Cerrada con llave. La cerradura pide una llave larga de latón.", opens: "La llave larga gira como si nunca se hubiera ido. La puerta se abre a un aire frío y a un olor a ciudad.", then: "roof_open" } },
  sofa: { at: "furniture", scenery: true, name: "Sofá", note: "Guarda la forma de alguien.", actions: ["Sentarse en el sofá"], enterable: "on",
    words: { nouns: ["sofá", "sofa", "canapé", "canape", "diván", "divan", "cojines", "cojín", "cojin", "hueco"], adj: ["hondo", "verde", "sala", "estar"], g: "m" },
    examine: "Un sofá hondo, de un verde desteñido. El hueco de los cojines tiene la forma de alguien sentado con los pies recogidos, leyendo.",
    enter: "Te sientas. El hueco te sienta casi bien, como un abrigo prestado. Desde aquí la tienda suena muy lejos." },
  dot: { at: "tea_room", scenery: true, name: "Dot", note: "La camarera.", actions: ["Hablar con Dot", "Pedir té"],
    words: { nouns: ["dot", "camarera", "mujer"], adj: [], g: "f" },
    examine: "Una camarera de vestido negro y cofia blanca, con una tetera que no ha soltado ni una vez.",
    talk: "«¿Té?», dice Dot. «Siempre hay té».",
    topics: {
      tea: { open: true, words: ["té", "te", "tetera", "taza", "pastel", "pasteles"], says: "«Una tetera por persona», dice Dot. «Con más, dejarías de notar el té»." },
      afternoon: { about: "fourth", label: "las tardes", words: ["tarde", "tardes", "cuarta", "perdida", "perdidas"], says: "«La mía fue un jueves de 1961. No fui al baile». Sirve. «Si me la devolvieran, no la compraría. La subiría a la azotea y la soltaría, como a un pájaro»." },
      roof: { about: "roof_door", label: "la azotea", words: ["azotea", "jardín", "jardin"], says: "«Qué bonito era aquello antes de cerrarlo. Allí arriba se podía soltar cualquier cosa»." },
      default: "«Yo solo sirvo el té», dice Dot."
    } },
  tea: { at: null, portable: false, name: "Taza de té", note: "Caliente.", actions: ["Beber té"],
    words: { nouns: ["té", "te", "taza", "tetera", "infusión", "infusion"], adj: ["caliente", "rosa"], g: "f" },
    examine: "Una tetera pequeña y una taza con una rosa. Huele a las meriendas de tu infancia." },
  mannequins: { at: "coats", scenery: true, name: "Maniquíes", note: "De cara a la puerta. Casi siempre.", actions: ["Examinar maniquíes", "Registrar abrigo"], opens: ["fourth", "price"],
    words: { nouns: ["maniquíes", "maniquies", "maniquí", "maniqui", "figuras", "figura", "abrigo"], adj: ["pálido", "palido", "pálidos", "palidos", "tuyo"], g: "m", pl: true },
    examine: "Figuras pálidas con abrigo y sombrero. La del abrigo como el tuyo lleva una etiqueta prendida en la manga: CUARTA PLANTA. PAGADO POR COMPLETO, POR TUBO. El bolsillo está abotonado.",
    search: "En el bolsillo del abrigo como el tuyo hay una nota a lápiz: «Mercería. La cápsula y luego el tirador. Paga con lo que tengas. Dicen que merece la pena». La letra es la tuya.",
    parts: [{ words: ["manga", "bolsillo", "nota", "sombreros", "sombrero", "alfiler"], name: "el abrigo", says: "El abrigo como el tuyo. Tiene el bolsillo abotonado, y algo cruje dentro." },
            { words: ["etiqueta", "cartulina", "talón", "talon"], name: "la etiqueta de la manga", says: "CUARTA PLANTA. PAGADO POR COMPLETO, POR TUBO. Prendida como se prende un precio." }], mentions: ["manga", "bolsillo", "sombreros", "etiqueta"] },

  // Sótano
  ruth: { at: "basement", scenery: true, name: "Señorita Ruth", note: "La caja.", actions: ["Hablar con Ruth"],
    words: { nouns: ["ruth", "cajera", "mujer", "silueta", "sombra"], adj: ["señorita", "senorita"], g: "f" },
    examine: "Una silueta tras los cristales esmerilados, rápida y pulcra, que atrapa las cápsulas al caer y las devuelve hacia arriba con el cambio.",
    talk: "La señorita Ruth no te oye a través de los cristales. Señala, sin levantar la vista, el cartel: TODOS LOS PAGOS POR TUBO.",
    give: "En la cabina no hay hueco para eso. Golpea con un dedo el cartel: TODOS LOS PAGOS POR TUBO." },

  // Azotea
  roof_bench: { at: "roof_garden", scenery: true, name: "Banco", note: "Frente a la ciudad.", actions: ["Sentarse en el banco"], enterable: "on",
    words: { nouns: ["banco", "asiento"], adj: ["madera", "jardín", "jardin", "de"], g: "m" },
    examine: "Un banco de madera con una placa de latón: PARA QUIENES YA TUVIERON BASTANTE. Los listones están tibios, aunque nadie se sienta aquí desde hace años." },

  // Cuarta planta
  afternoon: { at: "fourth_floor", scenery: true, name: "La tarde a la que no fuiste", note: "A tu medida.", actions: ["Examinar tarde", "Ponerse la tarde"],
    words: { nouns: ["tarde"], adj: ["perdida", "tuya", "lámpara", "lampara", "mar"], g: "f" },
    examine: "Suave como un abrigo viejo, del color de la ventanilla de un autobús en junio. La etiqueta dice: EL MAR. TE QUEDASTE EN CASA. Huele a sal y a alguien que te llama por tu nombre desde lo alto de una playa.",
    take: "«Pruébesela», dice la modista, entre los alfileres. «Las tardes no se llevan en la mano»." },
  fitter: { at: "fourth_floor", scenery: true, name: "La modista", note: "Alfileres en la boca.", actions: ["Hablar con la modista"],
    words: { nouns: ["modista", "costurera", "sastra", "probadora", "mujer"], adj: [], g: "f" },
    examine: "Una mujer con bata gris, un acerico en la muñeca y la boca llena de alfileres. Ha arreglado tardes para todas las tallas de arrepentimiento.",
    talk: "«Pagada», dice, con los alfileres entre los labios. «Pruébesela. Se la meto un poco de cintura».",
    topics: {
      afternoon: { about: "afternoon", label: "la tarde", words: ["tarde", "mar", "perdida", "autobús", "autobus"], says: "«Lleva tiempo esperándola. Siempre esperan. Póngasela y estará dentro, y la otra, aquella con la que pagó, no volverá a molestarla»." },
      price: { label: "el precio", words: ["precio", "pagado", "pagada", "recuerdo", "pago", "coste", "cuesta"], says: "«Una tarde por una tarde», dice. «Lo justo es lo justo. Y Hartley's siempre lo es»." },
      default: "Se saca un alfiler de la boca para contestar, se lo piensa mejor y se lo vuelve a poner."
    } }
};

// ---- Cambios con nombre ------------------------------------------------------------------------------------------------------
const changes = {
  roof_open: [
    { connect: "second_landing", dir: "u", to: "roof_garden" },
    { set: "roof_door.examine", to: "La puerta de la azotea, abierta. Por el tramo baja un aire frío y el rumor de la ciudad." },
    { draw: "second_landing", restyle: [{ id: "roof_door", fill: 0 }] }
  ],
  // Los finales
  afternoon_ending: [
    { say: "Te la pones. Te queda como si te hubiera estado esperando, y así era. La modista te la mete por los hombros, y la cuarta planta se vuelve fina como papel de seda." },
    { say: "Es junio, hace años, y vas en el autobús hacia el mar, después de todo, con la ventanilla bajada. En algún lugar una versión de ti se queda en casa, en una cocina, con la lluvia, y nunca llega a saberlo. No vuelves a pensar en ella. No puedes." },
    { end: true, picture: "afternoon" }
  ],
  kept_ending: [
    { move: "memory", to: null },
    { say: "Sacas el corcho. La tarde sale de golpe: una cocina, la lluvia en la ventana, una radio en la habitación de al lado, alguien a quien querías, dormido en una butaca. Sube por encima de los tejados y se queda, como se queda el humo en una tarde sin viento." },
    { say: "Debajo de ti la tienda sigue vendiendo. Ya no tiene nada que venderte. En algún lugar, muy a tu espalda, [way] vuelve a abrirse, y descubres que conoces el camino." },
    { end: true, picture: "kept" }
  ],
  window_ending: [
    { say: "Las luces se apagan planta por planta, de arriba abajo, como un edificio que cerrara los ojos. El señor Gage hace la ronda con su libro. Cuenta los maniquíes. Te cuenta a ti." },
    { say: "Por la mañana los escaparatistas te encuentran de pie en el escaparate principal, entre dos maniquíes, con un abrigo algo más cálido que el tuyo y un precio en la manga. La gente se para a mirar. En algún lugar, muy a tu espalda, [way] se cierra, sin ruido." },
    { end: true, picture: "window" }
  ]
};

// ---- Reglas ------------------------------------------------------------------------------------------------------------------
const rules = [
  // La puerta giratoria: no te deja salir.
  { id: "front_door", match: { verb: ["go", "enter"], obj: [null, "revolving_door"] }, if: [at("front_hall"), { "$exit": { in: [true, null] } }],
    do: [{ say: "Entras en la puerta giratoria. Te da la vuelta entera y te deja otra vez dentro. Hartley's no deja marchar a nadie sin quedarse con algo." }] },

  // La muestra: un recuerdo, embotellado, una sola vez.
  { id: "smell_tester", match: { verb: ["smell", "use", "push"], obj: "tester", obj2: [null] }, if: [{ "memory.at": null }], once: true,
    do: [{ say: "Aprietas la pera. Lluvia en la ventana de una cocina. Tostadas. Una radio en la habitación de al lado y alguien a quien querías, dormido en una butaca, en una tarde que habías olvidado tener." },
         { say: "Madame Corre acerca a tu nariz un frasquito, y la tarde entra en él. Lo tapona con un corcho y te lo da. «Su pago», dice. «O no. Eso lo decide usted»." },
         { move: "memory", to: "player" }, tension(-5)] },
  { id: "smell_tester_again", match: { verb: ["smell", "use", "push"], obj: "tester", obj2: [null] },
    do: [{ say: "Madame Corre tapa la muestra con un dedo enguantado. «Una por cabeza», dice. «Los recuerdos no son muestras»." }] },

  // El correo neumático: el pago a la cápsula, y tirar del tirador.
  { id: "put_canister", match: { verb: "put", obj2: "canister" }, if: [at("haberdashery"), { "$obj.at": "player" }],
    do: [{ move: "$obj", to: "canister" }, { say: "Lo metes en la cápsula. La cápsula da su aprobación." }] },
  { id: "send_memory", match: { verb: ["pull", "use", "send"], obj: ["handle", "canister", "memory"] }, if: [at("haberdashery"), { "memory.at": "canister" }],
    do: [{ say: "Tiras del tirador. El tubo aspira, con fuerza, y la cápsula desaparece hacia el techo con un sonido como el de una palabra que se traga." },
         { say: "Un momento después cae de nuevo en su soporte con un golpe seco. Dentro, un volante de cita rosa y ningún recuerdo. Coges el volante. Por el momento no logras recordar cuánto costó." },
         { move: "memory", to: null }, { move: "lift_ticket", to: "player" }] },
  { id: "send_other", match: { verb: ["pull", "use", "send"], obj: ["handle", "canister"], obj2: [null] }, if: [at("haberdashery")],
    do: [{ say: "La cápsula sube por el tubo y vuelve enseguida con lo que llevaba y un papelito: PAGO NO ADMITIDO. SOLO RECUERDOS." }] },
  { id: "send_away", match: { verb: "send" },
    do: [{ say: "Los pagos van por tubo, desde la cápsula de mercería." }] },

  // Los tubos: primero el aviso, luego el daño.
  { id: "tubes_warn", match: { verb: ["enter", "touch", "climb"], obj: "tubes" }, once: true,
    do: [{ say: "Alzas la mano hacia el tubo. Aspira y te agarra la manga, con fuerza, como un niño que quiere enseñarte algo. La señorita Thimble golpea el mostrador. «Con las manos no, cielo. Se lleva los dedos». Recuperas la manga." }, tension(10)] },
  { id: "tubes_hurt", match: { verb: ["enter", "touch", "climb"], obj: "tubes" },
    do: [{ say: "Metes la mano en el tubo. Se lleva el brazo entero, hasta el hombro, y luego se lo piensa mejor y te suelta." }, { hurt: 30, says: "El tubo tuvo tu brazo un momento." }, tension(15)] },

  // El guante: un apretón de manos, y la llave de la azotea.
  { id: "shake_glove", match: { verb: ["shake", "touch"], obj: "glove" }, if: [{ "roof_key.at": null }], once: true,
    do: [{ say: "Tomas la mano del guante. Se aferra a la tuya, tibio, un largo momento, como se aferra alguien en una estación. Luego los dedos se abren y en tu palma hay una llave larga de latón." },
         { move: "roof_key", to: "player" }, tension(-5)] },
  { id: "shake_glove_again", match: { verb: ["shake", "touch"], obj: "glove" },
    do: [{ say: "El guante te sostiene la mano un poco más de lo necesario y luego te suelta." }] },

  // La puerta de la azotea mantiene cerrada la escalera hasta que se abre.
  { id: "roof_shut", match: { verb: "go", dir: "u" }, if: [at("second_landing"), { "roof_door.locked": true }],
    do: [{ say: "Subes el tramo corto hasta la puerta de la azotea. Cerrada con llave. La cerradura pide una llave larga de latón." }] },

  // El ascensor: la cuarta planta, con un volante de cita.
  { id: "lift_up", match: { verb: ["show", "give"], obj: "lift_ticket", obj2: [null, "pell"] }, if: [at("lift"), holding("lift_ticket")],
    do: [{ say: "El señor Pell lee el volante, lo perfora y te lo devuelve. «A la cuarta», dice. Mueve la palanca. El ascensor sube durante más tiempo del que mide la tienda." },
         { travel: "fourth_floor" }, { describe: "$here" }] },
  { id: "lift_go_up", match: { verb: "go", dir: "u" }, if: [at("lift"), holding("lift_ticket")],
    do: [{ say: "El señor Pell tiende la mano para que le des el volante, y lo perfora. «A la cuarta». El ascensor sube durante más tiempo del que mide la tienda." },
         { travel: "fourth_floor" }, { describe: "$here" }] },
  { id: "lift_lever_up", match: { verb: ["push", "pull", "use"], obj: "lift_lever", obj2: [null] }, if: [at("lift"), holding("lift_ticket")],
    do: [{ say: "El señor Pell tiende la mano para que le des el volante, y lo perfora. «A la cuarta». Mueve la palanca. El ascensor sube durante más tiempo del que mide la tienda." },
         { travel: "fourth_floor" }, { describe: "$here" }] },
  { id: "lift_no_ticket_go", match: { verb: "go", dir: "u" }, if: [at("lift")],
    do: [{ say: "El señor Pell golpea con un dedo la cerradura junto al 4. «Con cita previa», dice. «El pago, por tubo, desde mercería»." }] },
  { id: "lift_no_ticket", match: { verb: ["push", "pull", "use", "show", "give"], obj: ["lift_lever", "pell"] }, if: [at("lift"), { "lift_ticket.at": { "!=": "player" } }],
    do: [{ say: "El señor Pell golpea con un dedo la cerradura junto al 4. «Con cita previa», dice. «El pago, por tubo, desde mercería»." }] },
  { id: "lift_down", match: { verb: "go", dir: "s" }, if: [at("fourth_floor")],
    do: [{ say: "El señor Pell te baja sin decir palabra, que es su forma de ser amable." }, { travel: "lift" }, { describe: "$here" }] },

  // La cuarta planta: la tarde a la que no fuiste.
  { id: "wear_afternoon", match: { verb: ["wear", "tryon", "enter", "use", "taste"], obj: "afternoon", obj2: [null] }, if: [at("fourth_floor")],
    do: [{ change: "afternoon_ending" }] },

  // El recuerdo: se suelta en un sitio alto, bajo el cielo.
  { id: "keep_memory", match: { verb: ["open", "use", "drink", "pull", "uncork"], obj: "memory", obj2: [null] }, if: [at("roof_garden"), holding("memory")],
    do: [{ change: "kept_ending" }] },
  { id: "keep_memory_not_here", match: { verb: ["open", "use", "drink", "pull", "uncork"], obj: "memory", obj2: [null] }, if: [holding("memory")],
    do: [{ say: "Pones el pulgar en el corcho y te detienes. Aquí no, bajo un techo. Necesita un sitio alto, con cielo." }] },

  // El oso: con cuerda, cuenta lo que ha visto la primera planta.
  { id: "wind_bear", match: { verb: ["turn", "use", "push"], obj: "bear", obj2: [null] },
    do: [{ say: ["Das cuerda al oso. Camina hasta el borde del estante y dice, con voz de caja de música que se acaba: «El guante de Guantería guarda la llave de la azotea. Solo la suelta a cambio de un apretón de manos».",
                 "Das cuerda al oso. Asiente tres veces y dice: «Tardes, en la cuarta. Se paga por tubo. Todos pagan con la que más les gustó».",
                 "Das cuerda al oso. «La azotea», dice. «Un sitio alto. Lo que se suelta allí arriba se queda suelto». Se sienta, satisfecho."] }] },

  // El té: una vez, y te serena.
  { id: "order_tea", match: { verb: ["order", "ask"], obj: [null, "tea", "dot"] }, if: [at("tea_room"), { "$topic": { in: [null, "tea"] } }, { "tea.at": null }], once: true,
    do: [{ say: "Dot sirve, sin preguntar, en una taza con una rosa, y la pone delante de ti. «Invita la casa», dice. «El té siempre invita. Lo que sale caro es la casa»." }, { move: "tea", to: "tea_room" }] },
  { id: "tea_once", match: { verb: ["order", "ask"], obj: [null, "tea", "dot"] }, if: [at("tea_room"), { "$topic": { in: [null, "tea"] } }],
    do: [{ say: "«Una tetera por persona», dice Dot. «Con más, dejarías de notar el té»." }] },
  { id: "drink_tea", match: { verb: "drink", obj: "tea" }, if: [{ "tea.at": "tea_room" }],
    do: [{ say: "Está exactamente tan fuerte como te gusta, algo que nadie sabía desde hace años. La tienda se queda en silencio alrededor de la taza." }, { move: "tea", to: null }, tension(-15)] },

  // La hora de cierre, a las seis: se dice en todas partes, y la espera pesa más.
  { id: "closing_bell", when: "at", at: "18:00",
    do: [{ say: "Una campana suena tres veces, en algún lugar de las paredes. «Hartley's cierra sus puertas», dice una voz desde todos los techos. «Se ruega a los clientes que se dirijan a la salida». Nadie lo hace." }, tension(10)] },

  // La tensión: cuanto más te quedas, más perteneces a la tienda; dos avisos, y luego el escaparate.
  { id: "tension_rises", when: "every", every: { seconds: [90, 150] }, do: [tension(2)] },
  { id: "tension_warn", when: "every", every: { seconds: [5, 5] }, if: [{ "game.tension": { ">=": 70 } }], once: true,
    do: [{ say: "En algún lugar, por encima de ti, se apagan las luces de una planta. La voz del señor Gage, muy cerca: «Los clientes que se quedan se colocan donde son útiles»." }] },
  { id: "tension_last", when: "every", every: { seconds: [5, 5] }, if: [{ "game.tension": { ">=": 90 } }, { "game.storeLastWarned": { "!=": true } }],
    do: [{ say: "Te sorprendes de pie, sin moverte, como están los maniquíes. Una taza de té, sentarte un rato, cualquier cosa que no sea esperar, ayudaría." }, { set: "game.storeLastWarned", to: true }] },
  { id: "tension_end", when: "every", every: { seconds: [5, 5] }, if: [{ "game.tension": { ">=": 100 } }, { "game.storeLastWarned": true }],
    do: [{ change: "window_ending" }] }
];

// ---- Puzles (para el verificador; GUIDE.md §3) -------------------------------------------------------------------------------------
const puzzles = {
  get_memory: { where: "perfumery", needs: [], solve: ["oler la muestra"], gives: ["memory"], clues: ["tester", "corre", "gage"],
    hints: ["Madame Corre embotella lo que recuerdas, si hueles su muestra.", "Huele la muestra en perfumería."] },
  pay_by_tube: { where: "haberdashery", needs: ["memory"], solve: ["meter el recuerdo en la cápsula", "tirar del tirador"], gives: ["lift_ticket"], clues: ["thimble", "mannequins", "ruth", "pell"],
    hints: ["Los pagos van a la caja por tubo, desde la cápsula de mercería.", "Mete el recuerdo en la cápsula y tira del tirador."] },
  ride_up: { where: "lift", needs: ["lift_ticket"], solve: ["mostrar el volante a Pell"], reaches: "fourth_floor", clues: ["pell", "directory", "gage"],
    hints: ["El señor Pell solo sube a la cuarta, y solo con cita previa.", "En el ascensor, muestra el volante a Pell."] },
  try_on: { where: "fourth_floor", needs: ["ride_up"], solve: ["ponerse la tarde"], ending: true, clues: ["fitter", "afternoon"],
    hints: ["La modista la tiene lista, a tu medida.", "Ponte la tarde."] },
  get_roof_key: { where: "gloves", needs: [], solve: ["estrechar la mano al guante"], gives: ["roof_key"], clues: ["glove", "gage", "bear"],
    hints: ["El guante de Guantería guarda algo para quien le dé la mano.", "Estrecha la mano al guante."] },
  open_roof: { where: "second_landing", needs: ["roof_key"], solve: ["abrir la puerta con la llave", "arriba"], reaches: "roof_garden", clues: ["roof_door", "directory", "dot"],
    hints: ["La puerta de la azotea, en la segunda planta, pide una llave larga de latón.", "Abre la puerta de la azotea con la llave y sube."] },
  let_it_out: { where: "roof_garden", needs: ["memory", "open_roof"], solve: ["abrir el recuerdo"], ending: true, clues: ["corre", "dot", "bear"],
    hints: ["Madame Corre dijo que un recuerdo soltado en un sitio alto sigue siendo tuyo.", "En la azotea, abre el recuerdo."] }
};

// ---- El conjunto de cambios ------------------------------------------------------------------------------------------------------------
// ---- La apertura, declarada (BRIEF.md §3): los ids de su sala y sus cuatro cosas, y las líneas que dice ----------------------------------
const opening = {
  room: "pavement", restart: "mints", hints: "wireless", intro: "shopping_list", way: "street_door",
  lines: {
    notYet: "La puerta pasa de largo sin dejar ningún hueco. Se ruega a los clientes con las manos vacías que aguarden, y en la repisa hay una bolsa y una radio.",
    notYetRestart: "La puerta pasa de largo sin dejar ningún hueco. No tienes nada con lo que volver a empezar, y en la repisa hay una bolsa de caramelos de menta.",
    notYetHints: "La puerta pasa de largo sin dejar ningún hueco. No tienes nada que escuchar, y en la repisa hay una radio.",
    through: "La hoja siguiente llega con un hueco, y te metes en el hueco, y das la vuelta con ella, y sales a la tienda. A tu espalda el pasaje sigue siendo un sábado.",
    askRestart: "¿Te pones un caramelo de menta en la boca y empiezas de nuevo?",
    restartYes: "Desenvuelves un caramelo y te lo pones en la lengua. Sabe a todas las veces que te dieron uno. Los escaparates se van apagando, uno a uno, y…",
    restartNo: "Retuerces la bolsa para cerrarla y te la quedas. Todavía no.",
    hintFrame: "La radio se queda callada entre dos secciones, y una voz, con bastante amabilidad, dice:",
    farewell: "Doblas la lista una vez, y sigue doblándose, cada vez más pequeña, hasta que no sostienes nada, con mucho cuidado."
  }
};

export default {
  because: "Después de la apertura: unos grandes almacenes a la hora de cierre.",
  opening,
  // Las propiedades que guardan las reglas de este mundo (ARCHITECTURE.md §3, "Fields and properties"); las del motor no se declaran.
  properties: {
    "game.storeLastWarned": { type: "boolean", start: false }   // el último aviso de la tienda: el final lo espera
  },
  facts: [
    "El jugador llega a los grandes almacenes Hartley's un sábado, poco antes de la hora de cierre, a las seis.",
    "En Hartley's el precio de todo es un recuerdo, que se paga por tubo en la caja.",
    "La cuarta planta vende tardes perdidas, con cita previa."
  ],
  effects: [
    { time: "day 1 16:50", weekday: "sat" },                  // la apertura se juega a las cinco menos diez
    // Adonde lleva el camino de la apertura, y lo que hace llegar: la hora de la tienda y su primera línea.
    { set: "game.entrance", to: "front_hall" },
    { add: "change", id: "arrival", effects: [
      { time: "day 1 17:10", weekday: "sat" },
      { say: "Una voz desde el techo, amable y muy cansada, dice que Hartley's cerrará a las seis." }
    ] },
    { set: "game.moods", to: [
      { below: 20, text: "Mirando sin compromiso" }, { below: 40, text: "Esperando turno" }, { below: 60, text: "Dudando" },
      { below: 80, text: "Fuera de hora" }, { below: 101, text: "En el escaparate" }
    ] },
    // Verbos que necesita este mundo
    { add: "word", verb: "shake", words: ["estrechar la mano a", "estrecha la mano a", "estrechar la mano de", "estrecha la mano de", "estrechar la mano", "estrecha la mano", "dar la mano a", "da la mano a", "dale la mano a", "darle la mano a", "dar la mano", "da la mano", "darse la mano con", "estrechale la mano a", "estrechale la mano", "estrechar", "estrecha"] },
    { add: "word", verb: "order", words: ["pedir", "pide", "pida", "pido", "encargar", "encarga"], absent: true },
    // «enseñar» con su ñ: la lista de la lengua lo trae sin ella ("ensenar"), y la ñ se conserva al leer lo que escribe el jugador.
    { add: "word", verb: "show", words: ["mostrar", "muestra", "muestre", "muestro", "ensenar", "ensena", "ensene", "enseno", "enseñar", "enseña", "enseñe", "enseño"] },
    // «probarse» una prenda: lo que dice la modista («Pruébesela») y lo que escribe quien la oye. «Probar» solo es probar el sabor.
    { add: "word", verb: "tryon", words: ["probarse", "pruebate", "pruebatela", "pruebese", "pruebesela", "me pruebo", "pruebo me"] },
    // Sacar el tapón: el gesto natural con un frasquito corchado (el recuerdo). «Sacar» solo ya es coger.
    { add: "word", verb: "uncork", words: ["descorchar", "descorcha", "descorche", "descorcho", "destaponar", "destapona", "quitar el tapon", "quita el tapon", "quitar el corcho", "quita el corcho", "sacar el tapon", "saca el tapon", "sacar el corcho", "saca el corcho"] },
    { add: "word", verb: "send", words: ["enviar", "envía", "envia", "envíe", "envie", "envío", "mandar", "manda", "mande", "despachar", "despacha"] },

    ...Object.entries(puzzles).map(([id, p]) => ({ add: "puzzle", id, ...p })),
    ...Object.entries(changes).map(([id, effects]) => ({ add: "change", id, effects })),
    ...Object.entries(endingPictures).map(([id, p]) => ({ add: "picture", id, ...p })),
    ...Object.entries(rooms).map(([id, r]) => ({ add: "room", id, ...r, picture: pictures[id] })),
    ...Object.entries(objects).map(([id, o]) => ({ add: "object", id, ...o })),
    { add: "object", id: "lift_ticket", at: null, portable: true, name: "Volante de cita", note: "Cuarta planta.", actions: ["Examinar volante"], heldActions: ["Examinar volante", "Mostrar volante a Pell"],
      words: { nouns: ["volante", "cita", "billete", "ticket", "resguardo"], adj: ["rosa", "cita", "ascensor", "previa", "de"], g: "m" }, ...item("lift_ticket"),
      here: "Un {volante|lift_ticket} rosa yace aquí.",
      examine: "Un volante rosa: HARTLEY'S. CUARTA PLANTA. UNA CITA. PAGADO. Al dorso, con la letra de la caja: UNA TARDE, EN CASA, CON LLUVIA." },
    ...rules.map((rule) => ({ add: "rule", rule }))
  ]
};
