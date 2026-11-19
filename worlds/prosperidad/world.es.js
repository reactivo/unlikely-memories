// «El emperador de la costra»: el mundo, en español. No es una traducción: está escrito como lo escribiría un autor
// de aquí. Mismos ids, mismas salas, mismas reglas y mismos finales que world.en.js; cambian las palabras. Un solo conjunto de cambios,
// todo o nada; datos llanos. Las imágenes, los sprites y la música se comparten (pictures.js, sprites.js, music.js): no llevan palabras.
// Reescrito el 2026-11-19 con los cambios de Diego: la Prosperidad real de Madrid en un año sin nombre, más oscuro (oscuridad 3), el Ministro
// camello con su libro de deudas, la cerveza en la barra, una tanda mala con su remedio, la portada sobre el Emperador.

import pictures, { endings } from "./pictures.js?v=0.70.1";
import music, { rooms as roomMusic } from "./music.js?v=0.70.1";
import levels from "./levels.js?v=0.70.1";
import sprites from "./sprites.js?v=0.70.1";
import plan from "./plan.js?v=0.70.1";

// ---- La biblia del juego -----------------------------------------------------------------------------------------------
export const bible = {
  title: "El emperador de la costra",
  blurb: "Una noche en Prosperidad, Madrid. El Emperador debe dinero al Ministro, un camello que hace su ronda de bares y no vende nada con la página sin pagar.",
  thumbnail: { picture: "avenida", x: 40 },   // la tarjeta de la página de inicio: la imagen de esta sala, recortada 225 píxeles desde la columna x (0-95)
  style: "flat",
  palettes: "neon: la avenida, El Charlie, la esquina, la plaza y el callejón (la noche como un resplandor suave); lamplight: las salas con bombilla o vela (la trastienda, La Ópera, la pensión, la habitación siete, la casa tomada); institution: las salas de fluorescente (la estafeta y la lavandería); moonlight: la oscuridad abierta por encima y más allá de las luces (el patio, la azotea, el terraplén); ember: la fábrica, con un solo horno encendido",
  genre: "novela picaresca: la ronda de favores de una noche por un barrio duro",
  strangeness: "0 (pedida: nada imposible en ninguna parte; la sorpresa viene de la gente y del lugar)",
  darkness: "3 (pedida: Diego la quiso más áspera, con drogas, heroína y prostitución; la gente sale herida, engañada y muere, y hasta el buen final cuesta algo)",
  humour: "3 (sorteada; no movida: la semilla apunta a la oscuridad, no al humor, y una comedia negra es oscura y graciosa; el humor está en la gente y en lo que pasa)",
  feeling: "1 (sorteada; no movida: el entierro, una cinta y un nombre importan, y se ven en lo que la gente guarda y hace, nunca en lo que dice)",
  tension: "0 (sorteada; no movida: la ronda del Ministro es un horario, no una amenaza; el único peligro es una dosis que el jugador puede elegir)",
  size: "large",
  ingredient: "un catálogo de venta por correo; un deshollinador",
  discarded: [
    "reglas: un camello que vende horas de la noche; un camello que es policía; un barrio gris de día por algo que debe",
    "extrañeza 0: un camello que es cura; una redada en los bares como final; una sobredosis trágica como moraleja",
    "sala del comienzo: una celda que se abre con una llave bajo el felpudo; una puerta que cede a un hombro en su abolladura; un ascensor atascado entre dos pisos"
  ],
  synopsis: "Eres Emperador, un punk de Prosperidad, en Madrid, en un año que nadie nombra. Esta noche te tiemblan las manos y tu página en el libro del Ministro está sin pagar. " +
    "El Ministro es un camello que hace cada noche la misma ronda de bares y vende a toda la calle, por dinero o a deber. Lo único que " +
    "quiere es una corbata negra de seda para el entierro de su hermana al amanecer. Tienes una noche de favores por un club, una lavandería y " +
    "una azotea, y el nombre que decidas darle al final.",
  stuff: "monedas de cien pesetas, un libro de deudas, papel de aluminio y un mechero, una radio de transistores con un programa de llamadas, fichas de lavandería, el cepillo de un deshollinador y un bote de hollín, " +
    "un bote de kohl, cinta americana en una batería, una pensión que alquila por horas, los casilleros de una sala de clasificación nocturna, una portería, anís y un carajillo, una corbata negra de seda, un autobús al amanecer",
  tone: "Picaresco, contado llano y deprisa por un narrador que apunta lo que cuestan las cosas y quién debe a quién: frases cortas que acaban en el hecho, francas con los cuerpos, las drogas y el trabajo, " +
    "sin juzgar nunca, cariñosas con la gente. Se fija en los precios, los portales, las manos, las deudas y lo que la gente lleva en los bolsillos, y deja fuera sermones y adornos. " +
    "«Un escenario de un palmo, una batería remendada con cinta americana, un suelo que se queda con tus zapatos». " +
    "«Marisol tiene la esquina y la farola, y nadie le quita el sitio». " +
    "«Correos deja abierto el mostrador lateral para los clasificadores de la noche».",
  start: "Sábado, 01:00, en el callejón sin salida de detrás de El Charlie.",
  rules: [
    "El Ministro hace cada noche la misma ronda: El Charlie, la avenida, La Ópera, la avenida, la estafeta, la avenida. Da a cada puerta unos minutos, y vende en todas, por dinero o a deber en su libro.",
    "En la avenida nadie da nada por nada y nadie olvida lo que le deben. Todo lo que brilla se paga, con dinero o con favores.",
    "El Ministro no vende nada con una página sin pagar. Una deuda se salda con dinero o con algo que él necesita.",
    "Pasada la medianoche cada cual va por el nombre que le puso la calle. El de los papeles es para el día y para quien te conoció de pequeño.",
    "Desde el miércoles corre una tanda verde, cortada con algo que no es heroína. Ha mandado a dos al hospital y a uno a la casa tomada."
  ],
  opening: "El callejón sin salida de detrás de El Charlie: una radio de transistores sobre un cajón (pistas, un programa de llamadas de madrugada) y una palanca junto al contenedor. La puerta de incendios del extremo sur está pintada contra su marco, y la palanca la fuerza. La introducción: el posavasos, la página sin pagar, las manos que tiemblan.",
  music: "un chacachá frigio nervioso, oído a través de la pared de un club; un bombo que se salta un golpe, una guitarra barata sobre un solo acorde y el silbido de un deshollinador; la radio entre dos emisoras",
  characters: ["Cuco, que lleva el sonido de El Charlie", "Pelayo, que lleva su barra", "doña Aurora, dueña y cantante de La Ópera", "Marisol, que trabaja la esquina",
    "doña Remedios, de la sala de clasificación de noche", "Tomás, el deshollinador", "don Nicanor, de la Pensión Esperanza", "Marga, la batería de la fábrica",
    "el Ministro, que hace su ronda y vende"],
  endings: [
    "Emperador: cambia la corbata, da el nombre que te puso la calle, quédate la papelina y la corona y vuelve a la ronda.",
    "Javier: cambia la corbata, da el nombre de los papeles y coge el primer autobús, que va a un entierro, con la papelina en el puño."
  ],
  chaos: 0.3
};

// Las cosas llevadas tienen sus sprites (sprites.js).
const item = (id) => ({ sprite: sprites[id], ...(sprites[id + "_floor"] ? { floorSprite: sprites[id + "_floor"] } : {}) });

// Lo que el Ministro acepta cuando pregunta a nombre de quién escribe el recibo (reglas sign_*), también como «soy …», «me llamo …» o «a nombre de …».
const dicho = (nombres) => nombres.flatMap(n => [n, "soy " + n, "me llamo " + n, "a nombre de " + n, "es " + n, "apunta " + n, "pon " + n]);
const CORONA = dicho(["emperador", "el emperador", "emperador de prosperidad", "el emperador de prosperidad"]);
const NOMBRE = dicho(["javier", "javier maza", "javi"]);

// ---- Las imágenes de los finales ----------------------------------------------------------------------------------------------
// Los dibujos no llevan lenguaje (pictures.js); lo que cada uno dice a quien usa un lector de pantalla (alt) se dice aquí, en el idioma del mundo.
const endingPictures = {
  crowned: { alt: "La avenida de noche vista desde la acera de enfrente: una figura pequeña con una corona de cartón dorado está subida a un cajón en medio de la calle, con un corro de siluetas oscuras alrededor y neón en todos los escaparates.", picture: endings.crowned },
  named: { alt: "Una parada de autobús en el amanecer gris: el primer autobús con las ventanillas amarillas y, en el escalón, una figura pequeña con abrigo gris y una maleta marrón lisa, y detrás la ciudad, gris.", picture: endings.named },
  died: { alt: "La avenida de noche desde el bordillo: una figura negra tendida en la acera mojada bajo una farola naranja, neón de todos los colores en la calzada y nadie cerca.", picture: endings.died }
};

// ---- Salas -----------------------------------------------------------------------------------------------------------------
// Una cuadrícula por planta (plan.js). El callejón, la sala del comienzo, queda al norte de la trastienda; su salida es el sur.
const rooms = {
  callejon: {
    name: "CALLEJÓN SIN SALIDA",
    describe: [
      "Un callejón sin salida detrás de El Charlie, ladrillo por tres lados: cajones, un contenedor, un charco que guarda el rosa de un tubo de neón. La mitad del tubo está muerta.",
      "Miras al sur. Al final del callejón está la {puerta de incendios|puerta}, pintada contra su marco. El bajo atraviesa el ladrillo."
    ],
    exits: { s: "way" },
    scenery: [
      { words: ["contenedor", "basura", "basuras", "tapa"], name: "el contenedor", says: "Lleno, y nadie lo ha vaciado esta semana. Bajo la tapa, una jeringuilla vieja y muchas botellas." },
      { words: ["cajones", "cajon", "cajón", "botellas", "cajas"], name: "los cajones", says: "Cajones de cerveza, vacíos, apilados hasta la altura de un hombre. Uno tiene la tapa plana." },
      { words: ["charco", "charcos", "agua", "rosa"], name: "el charco", says: "Agua de lluvia, rosa bajo el tubo." },
      { words: ["tubo", "rotulo", "rótulo", "neon", "neón"], name: "el tubo de neón", says: "Cristal rosa en la pared, encendido por un extremo y muerto por el otro." },
      { words: ["pared", "paredes", "ladrillo", "ladrillos", "pintadas"], name: "las paredes", says: "Ladrillo gris con nombres a rotulador, fechas y un teléfono tachado dos veces." }
    ],
    ambience: { lines: [
      "A través del ladrillo, la línea de bajo da la vuelta y empieza otra vez.",
      "Un gato cruza el final del callejón y no mira la puerta.",
      "El tubo de neón chasquea dos veces.",
      "Alguien al otro lado de la pared se ríe un buen rato y se calla."
    ], every: [25, 60] },
    alt: "Un callejón sin salida de noche entre dos paredes de ladrillo gris: un tubo de neón rosa en la pared izquierda, un contenedor y cajones apilados contra el ladrillo, y una puerta de incendios de acero que cierra el fondo.",
    overlayAlt: { radio: "Una pequeña radio de transistores sobre un cajón, con la antena fuera.", palanca: "Una palanca apoyada en el contenedor." }
  },
  trastienda: {
    name: "TRASTIENDA",
    describe: [
      "La trastienda de El Charlie: cajas de amplificadores, una barra de chaquetas de lentejuelas, un espejo con bombillas alrededor, la mitad muertas. Una {funda de guitarra|funda} yace en el suelo, cerrada con un cinturón.",
      "La cortina del este tiembla con el bajo. La {puerta de incendios|puerta_trasera} al callejón está abierta sobre su barra, al norte."
    ],
    exits: { e: "way", n: "way" },
    scenery: [
      { words: ["amplificadores", "amplificador", "amplis", "ampli", "cajas", "altavoces"], name: "las cajas de amplificadores", says: "Cajas negras con el nombre del club estarcido. Debajo del nombre, un teléfono, tachado." },
      { words: ["barra", "chaquetas", "chaqueta", "lentejuelas", "perchero"], name: "la barra de chaquetas", says: "Chaquetas de lentejuelas de talla pequeña, de un grupo glam que se deshizo en los servicios." },
      { words: ["espejo", "bombillas", "bombilla"], name: "el espejo", says: "Tu cara, cortada en trozos del tamaño de una bombilla. Nadie lo ha limpiado desde que se fue el grupo." },
      { words: ["cortina", "terciopelo"], name: "la cortina", says: "Terciopelo negro, gris a la altura de la mano.", leads: "e" }
    ],
    ambience: { lines: [
      "Una bombilla del espejo se apaga.",
      "En la pista, al otro lado de la cortina, alguien vitorea, tarde, algo que ya pasó.",
      "La barra de chaquetas se estremece con el bajo."
    ], every: [30, 70] },
    alt: "Una trastienda desordenada de noche: un espejo con bombillas alrededor, una barra de chaquetas de lentejuelas, cajas de amplificadores apiladas, una funda de guitarra en el suelo y una cortina negra a la derecha que da al bar."
  },
  charlie: {
    name: "EL CHARLIE",
    describe: [
      "El Charlie, hasta los topes: un escenario bajo, una batería remendada con cinta americana, las paredes cubiertas de pegatinas, un suelo que se queda con tus zapatos. En la mesa del fondo, dos chavales cortan rayas sobre un espejo.",
      "{Cuco|cuco} lleva el sonido desde un tablón sobre dos cajones y {Pelayo|pelayo} la barra. La trastienda queda al oeste, la puerta de la calle al sur."
    ],
    exits: { w: "way", s: "way" },
    scenery: [
      { words: ["escenario", "bateria", "batería", "bateria", "tambores", "cinta", "americana", "baterista"], name: "el escenario", says: "A la altura de la rodilla y pegajoso. El batería toca un instrumento que es sobre todo cinta." },
      { words: ["paredes", "pared", "pegatinas", "carteles"], name: "las paredes", says: "Pegatinas sobre pegatinas: grupos, fiestas, un gato perdido, el teléfono de un abogado." },
      { words: ["punks", "publico", "público", "gente", "chavales", "cuerpos", "suelo"], name: "los punks", says: "Cuero, imperdibles, pelo de colores. La mitad no ha cumplido los dieciocho y la otra mitad finge no haberlos cumplido." },
      { words: ["mesa", "espejo", "rayas", "cuchilla", "billete", "polvo", "fondo"], name: "la mesa del fondo", says: "Un espejo, una cuchilla, un billete enrollado. Anfetamina, por las rayas y las mandíbulas. Te miran y vuelven a mirar abajo." },
      { words: ["mesa de mezclas", "tablon", "tablón", "sonido", "mandos", "faders", "cajones"], name: "la mesa de sonido", says: "Una mesa de mezclas más vieja que el grupo, sobre un tablón. Funcionan tres deslizadores." },
      { words: ["entrada", "calle", "sello", "cola"], name: "la puerta de la calle", says: "Una puerta con un punk a cada lado y un sello para el dorso de la mano.", leads: "s" },
      { words: ["imperdible", "rotulo", "rótulo", "neon", "neón"], name: "el rótulo del imperdible", says: "Un imperdible grande de tubo magenta claro sobre la barra, con un tramo que se apaga." }
    ],
    ambience: { lines: [
      "El bajo te encuentra las costillas y se queda.",
      "Se oye un vítor por algo que no sobrevive a la siguiente canción.",
      "Alguien hace pogo solo, y lo hace bien.",
      "Se rompe una botella y el grupo sigue tocando.",
      "Un chico deja la mesa del fondo camino de los servicios, blanco, con la mano en la boca."
    ], every: [30, 70] },
    alt: "Un bar punk de noche: un escenario bajo con una batería a la izquierda, una mesa de sonido con un hombre de cresta inclinado sobre ella, una barra larga con un barman enorme a la derecha, una mesa del fondo con un espejo y rayas blancas, y una multitud de figuras oscuras.",
    overlayAlt: { ministro: "El Ministro, de pie junto a la mesa del fondo con su abrigo de camello y su sombrero gris, un maletín de cuero en una mano." }
  },
  avenida: {
    name: "LA AVENIDA",
    describe: [
      "La avenida de América de noche, mirando al norte: persianas grises a medio subir, neón rosa y cian, una calzada mojada. El frente negro de El Charlie queda al fondo, con una cola en la puerta.",
      "La estafeta, al este, y La Ópera, al oeste. La avenida se dobla al sur hacia la esquina."
    ],
    exits: { n: "way", e: "way", w: "way", s: "way" },
    scenery: [
      { words: ["persianas", "persiana", "escaparates", "tiendas", "locales"], name: "las persianas", says: "A medio subir, a medio bajar. Detrás de las que están subidas, alguien vende algo que no figura en el rótulo." },
      { words: ["neon", "neón", "rotulos", "rótulos", "tubos", "color", "colores"], name: "el neón", says: "Una copa rosa, una flecha cian, un rojo que se alquila por meses." },
      { words: ["calzada", "calle", "asfalto", "bordillo", "acera", "coche"], name: "la calzada", says: "Negra y mojada, con los rótulos en ella como regueros. Un coche pasa a paso lento y no se detiene." },
      { words: ["club", "charlie", "frente", "ojo", "cola"], name: "El Charlie", says: "Un frente negro con una ventana redonda encendida. Fue una sala de baile.", leads: "n" },
      { words: ["gente", "portales", "portal", "figuras", "hombres", "mujeres"], name: "la gente de los portales", says: "Esperan a cubierto y miran la calle. Unos esperan a un cliente, otros a un amigo y otros al Ministro." }
    ],
    ambience: { lines: [
      "Un coche baja por la avenida a paso lento, lo mira todo y no se lleva nada.",
      "Una persiana sube con ruido de tos y queda a la venta un cuarto lleno de luz rosa.",
      "Alguien se ríe en un portal, y otro alguien se detiene.",
      "Suena una radio tras una ventana, una canción que casi conoces."
    ], every: [30, 70] },
    alt: "La avenida de noche, mirando al norte por una calle mojada: persianas y rótulos de neón a ambos lados en rosa, cian y magenta, al fondo el frente negro de un club con una ventana redonda como un ojo de buey, y gente de pie en los portales.",
    overlayAlt: { ministro: "El Ministro, de pie en medio de la acera con su abrigo de camello y su sombrero gris, un maletín de cuero en una mano.", monedas: "Tres monedas yacen en la acera, delante de la puerta del club." }
  },
  esquina: {
    name: "LA ESQUINA",
    describe: [
      "La esquina de López de Hoyos, con la única farola que funciona. {Marisol|marisol} está debajo, con un abrigo corto y un corte sobre una ceja que el maquillaje no tapa.",
      "La Pensión Esperanza queda al este, la Lavandería al oeste, la avenida al norte. Al sur se abre una plazuela."
    ],
    exits: { n: "way", e: "way", w: "way", s: "way" },
    scenery: [
      { words: ["farola", "poste", "luz", "globo"], name: "la farola", says: "Un poste gris y un globo naranja. La acera de debajo está gastada en un círculo pálido." },
      { words: ["pension", "pensión", "esperanza", "cartel"], name: "la Pensión Esperanza", says: "Una fachada estrecha con un cartel verde: HABITACIONES POR HORAS.", leads: "e" },
      { words: ["lavanderia", "lavandería", "lavadoras", "escaparate"], name: "la Lavandería", says: "Un escaparate muy iluminado lleno de máquinas blancas, encendido toda la noche.", leads: "w" },
      { words: ["acera", "bordillo", "esquina", "calle"], name: "la acera", says: "Pálida bajo la farola y mojada en el bordillo." },
      { words: ["coches", "coche", "trafico", "tráfico"], name: "los coches", says: "Dan la vuelta despacio, con las ventanillas bajadas. Marisol dice que no a casi todos." }
    ],
    ambience: { lines: [
      "Un coche aminora junto al bordillo. Marisol mira al conductor, niega con la cabeza y el coche acelera.",
      "Alguien tira de la cadena en la pensión y toda la esquina lo oye.",
      "Una mujer sale de la Lavandería con una sábana limpia al brazo y sube por la avenida.",
      "Un hombre con gabardina sale solo de la pensión, se palpa los bolsillos y se va."
    ], every: [30, 70] },
    sleep: "En la esquina, no. Es el lugar de trabajo de alguien.",
    alt: "Una esquina de noche bajo una farola naranja: una mujer con abrigo corto junto al poste a la izquierda, una pensión de cartel verde a la derecha, el escaparate iluminado de una lavandería más allá y el color del neón sobre la calzada mojada."
  },
  estafeta: {
    name: "LA ESTAFETA",
    describe: [
      "El mostrador lateral de la sala de clasificación de Correos, de noche: casilleros hasta el techo, un fluorescente que parpadea, un mostrador largo. {Doña Remedios|remedios} sella cartas detrás.",
      "Un saco de lona espera en una estantería a la furgoneta de la noche. La avenida queda al oeste."
    ],
    exits: { w: "way" },
    scenery: [
      { words: ["saco", "bolsa", "lona", "furgoneta"], name: "el saco de correo", says: "Lona con CORREO estarcido. Reclamaciones, multas y una carta por semana de la misma mano a la misma dirección, devuelta cada vez." },
      { words: ["casilleros", "casillero", "huecos", "cartas", "correo", "correos"], name: "los casilleros", says: "Cientos, casi todos llenos. Los que llevan tarjeta con nombre son los que alguien todavía recoge." },
      { words: ["mostrador", "sellos", "sello", "tampon", "tampón", "tinta"], name: "el mostrador", says: "Con el canto de latón y rayado, y un tampón del color de un cardenal." },
      { words: ["luz", "fluorescente", "tubo", "techo"], name: "el fluorescente", says: "Parpadea sobre una nota gris y larga." },
      { words: ["cartel", "aviso", "horario", "normas"], name: "el aviso", says: "«MOSTRADOR ABIERTO PARA EL TURNO DE NOCHE. NO SE ADMITEN PAQUETES». Alguien ha añadido a lápiz «NI COMPASIÓN»." }
    ],
    ambience: { lines: [
      "Un sello cae sobre algo, una nota plana.",
      "Un casillero suelta una carta y doña Remedios la devuelve a su sitio sin leerla.",
      "El fluorescente parpadea, y en el hueco no se ha movido nada."
    ], every: [30, 70] },
    alt: "Una oficina de correos de noche bajo un fluorescente: casilleros por toda la pared del fondo, un mostrador largo con una mujer corpulenta de rebeca detrás, a la izquierda, y un saco de lona de correo muy lleno sobre una estantería a la derecha.",
    overlayAlt: { ministro: "El Ministro, de pie al final del mostrador con su abrigo de camello y su sombrero gris, esperando su correo." }
  },
  opera: {
    name: "LA ÓPERA",
    describe: [
      "La Ópera, un bar de terciopelo rojo vuelto marrón y un espejo dorado. {Doña Aurora|aurora} canta en el escenario diminuto, desnuda de cintura para arriba bajo una boa de plumas, para una sala de viejos con abrigo.",
      "Gaspar sirve en la barra corta, donde una cafetera silba al fondo. Una mesa redonda con una vela está junto al escenario. La avenida queda al este."
    ],
    exits: { e: "way" },
    scenery: [
      { words: ["escenario", "lampara", "lámpara", "bombillas", "boa", "plumas"], name: "el escenario", says: "Un escenario diminuto bajo una lámpara de siete bombillas, tres encendidas." },
      { words: ["terciopelo", "cortinas", "reservados", "asientos", "butacas"], name: "el terciopelo", says: "Rojo en otro tiempo, marrón ahora, brillante en los brazos." },
      { words: ["espejo", "espejos", "dorado"], name: "el espejo", says: "Un marco dorado alrededor de un cristal oscuro. La sala que se ve dentro está dos veces más llena." },
      { words: ["viejos", "habituales", "abrigos", "publico", "público", "caballeros"], name: "los habituales", says: "Viejos con una copa cada uno, escuchando con los ojos cerrados. La mayoría está en el libro de alguien." },
      { words: ["barra", "mostrador", "botellas", "anis", "anís", "copas", "gaspar", "barman", "cafetera"], name: "la barra", says: "Una barra corta de caoba. Gaspar, el camarero, nunca ha hablado. El anís viene en copas pequeñas, y un café cuesta una moneda." },
      { words: ["mesa", "vela"], name: "la mesa redonda", says: "Una vela en una botella, y un asiento de espaldas a la pared con vista a la puerta." }
    ],
    ambience: { lines: [
      "Doña Aurora toma una nota alta un poco tarde y la sostiene.",
      "Un hombre de buen abrigo llora en silencio. Nadie mira.",
      "La lámpara pierde una bombilla, y doña Aurora sigue cantando."
    ], every: [30, 70] },
    alt: "Un bar de terciopelo desvaído de noche: un escenario diminuto bajo una lámpara de siete bombillas con una mujer con boa de plumas, desnuda de cintura para arriba, cantando, viejos de buen abrigo en los reservados, un espejo dorado y una mesa redonda con una vela a la derecha.",
    overlayAlt: { ministro: "El Ministro, de pie junto a la mesa redonda al lado del escenario con su abrigo de camello y su sombrero gris, un maletín de cuero en una mano." }
  },
  pension: {
    name: "PENSIÓN ESPERANZA",
    describe: [
      "El vestíbulo de una pensión que alquila habitaciones por horas, por noches o por meses: un tablero de llaves, un timbre de latón, una alfombra roja gastada hasta la trama camino de la escalera.",
      "{Don Nicanor|nicanor} lleva el mostrador y un libro de registro. La {escalera|escalera_pension} sube a las habitaciones. La esquina queda al oeste."
    ],
    exits: { w: "way", u: "way" },
    scenery: [
      { words: ["mostrador", "timbre", "latón", "laton", "lampara", "lámpara"], name: "el mostrador", says: "Barnizado, con una lámpara verde y un timbre que nadie toca." },
      { words: ["llaves", "llave", "tablero", "ganchos"], name: "el tablero de llaves", says: "Doce ganchos, diez llaves. Dos ganchos tienen un nombre a lápiz debajo en lugar de un número." },
      { words: ["alfombra", "trama", "pasillo"], name: "la alfombra", says: "Roja en otro tiempo, gastada hasta la trama por el medio." },
      { words: ["libro", "registro", "horas", "nombres"], name: "el libro de registro", says: "El Libro de Horas: nombres, habitaciones, duración de la estancia, con letra de oficinista." }
    ],
    ambience: { lines: [
      "Arriba una cama golpea contra una pared, y don Nicanor pasa una página.",
      "El timbre suena una vez al rozarlo una manga, y nadie viene a ver qué ha sido.",
      "Una pareja baja la escalera sin mirarse y sale a la avenida."
    ], every: [30, 70] },
    sleep: "En el vestíbulo, no. Don Nicanor alquila las camas de arriba, por horas, y no el suelo.",
    alt: "El vestíbulo estrecho de una pensión iluminado por una sola lámpara: un mostrador barnizado con un hombre delgado detrás, a la derecha, un tablero de llaves en la pared y una escalera con una alfombra roja gastada a la izquierda que sube hacia la oscuridad."
  },
  pension_hab: {
    name: "HABITACIÓN SIETE",
    describe: [
      "La habitación siete es la de Marisol: una cama hecha a tirantez con una manta roja, un armario con la puerta entornada, un lavabo con la palangana rota. La ventana da a un rótulo rosa que se enciende y se apaga.",
      "Un {bote de kohl|kohl} en el lavabo está rascado hasta el fondo. Junto a la cama, una {pintada|pintada} de pintalabios en el papel de la pared. La escalera baja."
    ],
    exits: { d: "way" },
    scenery: [
      { words: ["cama", "manta", "sabanas", "sábanas", "almohada"], name: "la cama", says: "Hecha a tirantez. Las sábanas están limpias, que en esta casa es lo que importa." },
      { words: ["armario", "ropa", "vestidos", "vestido", "perchas"], name: "el armario", says: "Unos cuantos vestidos en perchas de alambre. Al fondo, una chaqueta de hombre que nadie vino a reclamar." },
      { words: ["palangana", "lavabo", "jarra", "agua", "espejo"], name: "el lavabo", says: "Una palangana rota, una jarra, un espejo del tamaño de una mano." },
      { words: ["ventana", "rotulo", "rótulo", "neon", "neón", "cortina"], name: "la ventana", says: "Un rótulo rosa al otro lado de la calle: HOTEL, con la O muerta. Ilumina el cuarto y lo apaga cada cuatro segundos." },
      { words: ["silla", "chal"], name: "la silla", says: "Una silla de cocina con un chal doblado encima." }
    ],
    ambience: { lines: [
      "El rótulo de enfrente se pone rosa, se apaga, se pone rosa.",
      "A través del suelo, una cama de la habitación de abajo golpea contra la pared.",
      "El armario cruje, y la chaqueta del fondo se balancea una vez."
    ], every: [30, 70] },
    sleep: "En la habitación de otra persona, no, y menos sin que te lo hayan pedido.",
    alt: "Una habitación pequeña de pensión iluminada de rosa por un rótulo de neón en la ventana: una cama hecha a tirantez con una manta roja, un armario, un lavabo con palangana y un espejito, y una pintada de pintalabios en el papel de la pared junto a la cama."
  },
  lavanderia: {
    name: "LA LAVANDERÍA",
    describe: [
      "Una lavandería abierta toda la noche: una hilera de lavadoras blancas, un banco atornillado al suelo y una {secadora|secadora} grande con la puerta de cristal redonda y una ranura para fichas.",
      "Una forma larga y oscura yace dentro de la secadora, contra el cristal, sujeta por el pestillo. La esquina queda al este."
    ],
    exits: { e: "way" },
    scenery: [
      { words: ["lavadoras", "lavadora", "maquinas", "máquinas", "tambores", "tambor"], name: "las lavadoras", says: "Diez tambores blancos, casi todos girando. Junto al abierto espera un cesto con las sábanas de alguien." },
      { words: ["banco", "asiento", "tornillos"], name: "el banco", says: "Listones grises sobre tornillos. La gente duerme en él hasta que llega el sobrino del dueño a por la caja." },
      { words: ["cartel", "aviso", "instrucciones"], name: "el cartel", says: "«SOLO FICHAS. NO NOS HACEMOS RESPONSABLES DE LO QUE SE QUEDE OLVIDADO»." },
      { words: ["luz", "luces", "tubo", "tubos", "fluorescentes"], name: "los tubos", says: "Blancos y fríos, iguales a cualquier hora." }
    ],
    ambience: { lines: [
      "Un tambor acaba su ciclo y sigue temblando.",
      "Un calcetín da vueltas en el ojo de una lavadora, una y otra vez.",
      "Una mujer dobla una sábana en un rincón sin levantar la vista, y se marcha con ella."
    ], every: [30, 70] },
    alt: "Una lavandería de noche bajo tubos blancos y fríos: una hilera de lavadoras blancas en la pared del fondo, un banco atornillado a la izquierda y una secadora grande con una puerta de cristal redonda a la derecha, con un cepillo negro y largo apoyado contra su cristal.",
    overlayAlt: { cepillo: "El largo cepillo negro de un deshollinador, sobre la puerta abierta de la secadora." }
  },
  plaza: {
    name: "PLAZA DEL CARBÓN",
    describe: [
      "Una plazuela con una fuente de piedra seca llena de macetas y una farola naranja. Las corralas la rodean, y una chimenea lejana asoma sobre los tejados. De vez en cuando una rata cruza los adoquines.",
      "La esquina queda al norte, el portal de la casa tomada al sur, el terraplén al este."
    ],
    exits: { n: "way", s: "way", e: "way" },
    scenery: [
      { words: ["fuente", "pilon", "pilón", "seca", "pez"], name: "la fuente", says: "Un pilón de piedra con un pez por caño, seco desde hace años. Alguien lo ha llenado de macetas y chapas de botella." },
      { words: ["farola", "sodio", "lampara", "lámpara"], name: "la farola de sodio", says: "Naranja, la única luz del barrio que es del mismo color todo el día." },
      { words: ["bloques", "bloque", "ventanas", "ventana", "edificios", "colada", "balcones"], name: "los bloques", says: "Bloques de ladrillo de cinco plantas, con balcones llenos de colada. Una ventana de cada piso está encendida en verde, rojo o azul." },
      { words: ["rata", "desague", "desagüe", "portal"], name: "la rata", says: "Una rata gris, un desagüe, un portal, por ese orden, y se ha ido." },
      { words: ["casa", "portal", "okupas", "edificio"], name: "la casa tomada", says: "Un bloque alto condenado a derribo, con una bicicleta encadenada en el portal y una bandera en una ventana. Los inquilinos no se quieren ir, y han entrado otros.", leads: "s" },
      { words: ["terraplen", "terraplén", "via", "vía", "vias", "vías", "trinchera"], name: "el terraplén", says: "Un hueco entre dos bloques por donde corría un ramal de mercancías. Al fondo, una chimenea alta.", leads: "e" }
    ],
    ambience: { lines: [
      "Se abre una ventana, cae un barreño de fregadura sobre los adoquines, y la ventana se cierra.",
      "La farola chasquea al enfriarse.",
      "Una niña, despierta a una hora que no es, se sienta en la fuente y le dice algo."
    ], every: [30, 70] },
    alt: "Una plazuela de noche: una fuente de piedra seca con macetas en el centro, una farola de sodio naranja a la derecha y bloques altos alrededor con ventanas encendidas en verde, rojo y azul."
  },
  casa: {
    name: "LA CASA TOMADA",
    describe: [
      "El portal de la casa tomada, mirando al sur: una pared de buzones, una bicicleta encadenada a un radiador, una vela en el primer escalón. Un colchón yace en el suelo con una sábana sobre lo que hay encima, y dos botas que asoman.",
      "El zaguán sigue hasta el patio y su luz. La plaza queda a tu espalda, al norte."
    ],
    exits: { n: "way", s: "way" },
    scenery: [
      { words: ["buzones", "buzon", "buzón", "cartas", "correo"], name: "los buzones", says: "Cuarenta buzones con nombres a rotulador, llenos de folletos y multas. Uno dice «Maza, 3.º», tachado." },
      { words: ["bicicleta", "bici", "radiador", "cadena"], name: "la bicicleta", says: "Una rueda pinchada y un buen candado, encadenada a un radiador que lleva años frío." },
      { words: ["vela", "escalon", "escalón", "escalera", "platillo"], name: "la vela", says: "Un cabo en un platillo. Un papel al lado dice quién ha pagado la cera." },
      { words: ["carteles", "pintadas", "pared", "paredes", "lemas"], name: "las paredes", says: "Carteles sobre carteles, y un lema en rojo: LO QUE SE VENDE NO ES TUYO." },
      { words: ["colchon", "colchón", "sabana", "sábana", "botas", "chico", "cuerpo", "toni"], name: "el colchón", says: "Toni, diecinueve años, del segundo. Murió aquí el miércoles por la noche, de la tanda verde, antes de que la ambulancia diera con la calle. Los vecinos están haciendo una colecta para el entierro." },
      { words: ["zaguan", "zaguán", "pasillo", "baldosas"], name: "el zaguán", says: "Baldosas blancas y negras, sobre todo negras, hacia la luz del patio, al sur." }
    ],
    ambience: { lines: [
      "Arriba llora un bebé, y alguien le canta por encima.",
      "La vela se inclina con una corriente que viene del patio.",
      "Un portazo en el tercero, y la bicicleta tintinea en su cadena.",
      "Alguien baja la escalera, echa una moneda en un bote junto al colchón y sale."
    ], every: [30, 70] },
    alt: "El zaguán de una casa tomada de noche, mirando al sur: buzones llenos a la izquierda, una bicicleta encadenada a un radiador a la derecha, una vela en el primer escalón, un colchón con una sábana encima contra la pared y, al fondo, un cuadrado luminoso del patio.",
    overlayAlt: { verde: "Una papelina doblada yace en las baldosas, junto al colchón." }
  },
  patio: {
    name: "EL PATIO",
    describe: [
      "Un patio abierto al cielo, cinco plantas de tendederos y ventanas con velas. Las paredes las pintó de azul alguien que quería un cielo, y la lluvia se ha llevado casi todo.",
      "Una {escalera de hierro|escalera_patio} sube por la pared norte hasta la azotea. El zaguán queda al norte."
    ],
    exits: { n: "way", u: "way" },
    scenery: [
      { words: ["colada", "tendederos", "tendedero", "sabanas", "sábanas", "ropa", "pantalones"], name: "la colada", says: "Sábanas, camisas y unos pantalones muy grandes, tendidos con la esperanza de un sol." },
      { words: ["ventanas", "ventana", "velas", "vela", "plantas"], name: "las ventanas", says: "Velas en las ventanas, cinco plantas de ellas. El bloque no tiene luz desde el invierno." },
      { words: ["paredes", "pared", "pintura"], name: "las paredes", says: "Azul cielo, a parches, con regueros negros por donde corre la lluvia." },
      { words: ["cielo", "estrellas", "estrella"], name: "el cielo", says: "Un cuadrado de noche con unas pocas estrellas." },
      { words: ["losas", "piedras", "charcos", "rayuela", "tiza"], name: "las losas", says: "Agrietadas, con una rayuela de tiza que sube hasta un número que no existe." }
    ],
    ambience: { lines: [
      "Una sábana se agita en su cuerda.",
      "Desde una ventana alta, una guitarra toca otra vez los mismos cuatro acordes.",
      "Empieza a llover, lo piensa mejor y para.",
      "Un hombre en el rellano del tercero tiembla, abrazado a sí mismo. Alguien le da un cigarrillo."
    ], every: [30, 70] },
    alt: "Un patio alto de noche visto desde el suelo: cinco plantas de pared gris con ventanas de velas y tendederos, un trozo de cielo oscuro arriba y una escalera de hierro que sube por la pared de la derecha."
  },
  azotea: {
    name: "LA AZOTEA",
    describe: [
      "La azotea de la casa tomada: alquitrán, antenas, una hilera de chimeneas a lo largo de la cumbrera. Todo el barrio queda abajo, color mojado sobre gris.",
      "{Tomás|tomas} está sentado en la cumbrera, negro de pies a cabeza, con solo el blanco de los ojos limpio. La escalera baja."
    ],
    exits: { d: "way" },
    scenery: [
      { words: ["chimeneas", "chimenea", "tubos", "hilera"], name: "las chimeneas", says: "Once chimeneas de barro, cada una con un casquete de hollín." },
      { words: ["antenas", "antena", "alambres", "cables"], name: "las antenas", says: "Perchas de alambre y varillas dobladas, atadas a las chimeneas. Casi todas apuntan a nada." },
      { words: ["ciudad", "barrio", "luces", "color", "abajo"], name: "el barrio", says: "Neón en cada calle que te puedas permitir, y detrás el gris de los bloques." },
      { words: ["alquitran", "alquitrán", "tejado", "cumbrera", "tejas"], name: "el alquitrán", says: "Blando bajo los pies y tibio del día." },
      { words: ["luna", "cielo", "nubes", "humo"], name: "el cielo", says: "Una luna baja en un velo de humo de la fábrica." }
    ],
    ambience: { lines: [
      "Una paloma se posa en una chimenea y se va.",
      "Tomás silba tres notas entre los dientes y espera.",
      "Una racha sube por la pared el ruido de todo el barrio y lo suelta."
    ], every: [30, 70] },
    sleep: "En la cumbrera, no. Tomás tendría que bajarte a cuestas.",
    alt: "Una azotea de noche bajo una luna baja: una hilera de chimeneas como figuras oscuras a la izquierda, un deshollinador de negro con chistera sentado contra una chimenea en el tercio izquierdo, un horizonte de color de neón abajo a la derecha y antenas contra el cielo."
  },
  terraplen: {
    name: "EL TERRAPLÉN",
    describe: [
      "Una trinchera de ferrocarril bajo una luna baja: balasto gris, dos raíles oxidados y un vagón de mercancías en un apartadero, con la puerta corredera cubierta de pintadas. Hace años que no baja un tren por esta línea.",
      "Al este, los raíles siguen hasta la fábrica y su gran chimenea. La plaza queda al oeste."
    ],
    exits: { w: "way", e: "way" },
    scenery: [
      { words: ["raíles", "railes", "rail", "vía", "via", "vias", "vías", "traviesas", "balasto"], name: "los raíles", says: "Dos líneas oxidadas que corren al este, hacia la fábrica." },
      { words: ["vagon", "vagón", "puerta", "pintadas", "apartadero"], name: "el vagón", says: "Las pintadas de su puerta dicen SALARIOS, PAN, ESTO NO. Debajo, en pintura más vieja, PROSPERIDAD S.A." },
      { words: ["chimenea", "fabrica", "fábrica"], name: "la fábrica", says: "Una nave negra de la que sale una chimenea más alta que los bloques." },
      { words: ["luna", "cielo", "nubes"], name: "la luna", says: "Baja y amarilla, en el humo de la fábrica." },
      { words: ["farol", "señal", "senal", "lampara", "lámpara"], name: "la señal", says: "Una señal de ferrocarril, roja. Nadie la ha apagado." }
    ],
    ambience: { lines: [
      "La señal chasquea, roja, y sigue roja.",
      "El viento recorre la trinchera, levanta un periódico, le pasa las hojas y lo suelta.",
      "En algún lugar de la fábrica un tambor empieza un ritmo, lo pierde y empieza otra vez."
    ], every: [30, 70] },
    alt: "Una trinchera de ferrocarril de noche bajo una luna baja: dos raíles oxidados que corren al este hacia una nave negra de fábrica en el tercio derecho, con una chimenea muy alta contra el cielo, y un vagón de mercancías en un apartadero a la izquierda."
  },
  fabrica: {
    name: "LA FÁBRICA",
    describe: [
      "La vieja fábrica de Prosperidad S.A., que imprimió catálogos de venta por correo hasta que se acabó el dinero. Un horno sigue encendido al fondo de la nave, alimentado con palés, y la gran chimenea se alza en medio del suelo.",
      "{Marga|marga} está sentada a su batería junto al horno. El camino de vuelta es al oeste, por la vía."
    ],
    exits: { w: "way" },
    scenery: [
      { words: ["horno", "fuego", "brasas", "rescoldo", "palés", "pales"], name: "el horno", says: "Una boca de ladrillo con un solo resplandor rojo, alimentada con palés. Es la única calefacción del grupo." },
      { words: ["ceniza", "suelo", "cenizas", "hollin", "hollín", "paginas", "páginas"], name: "la ceniza", says: "Tibia y honda, y debajo, un suelo de páginas de catálogo quemadas." },
      { words: ["prensas", "prensa", "maquinas", "máquinas", "rodillos", "correas"], name: "las prensas", says: "Rodillos de hierro altos como un hombre, todavía grises de tinta." },
      { words: ["techo", "agujero", "cielo", "nube"], name: "el techo", says: "Un agujero redondo por donde pasa la chimenea, y por él sale el humo de los palés." },
      { words: ["nave", "paredes", "pared", "ladrillos", "mano"], name: "la nave", says: "Ladrillo alto, chamuscado en una pared con la forma de una mano, donde reventó una caldera." },
      { words: ["chimenea", "conducto", "fuste", "trampilla"], name: "la gran chimenea", says: "Una columna de ladrillo ancha como una casa, negra del suelo al techo. Una trampilla de hierro en la base lleva años sin abrirse." }
    ],
    ambience: { lines: [
      "El horno chasquea y se asienta.",
      "Una hoja de papel quemado se levanta de la ceniza con la corriente y vuelve a tenderse.",
      "La gran chimenea cruje de arriba abajo, una nota larga."
    ], every: [30, 70] },
    alt: "El interior de una vieja fábrica iluminado de rojo por un solo horno: la boca de ladrillo de un horno brillando a la izquierda, una chica en una batería a su lado, la gran chimenea negra subiendo por el centro de la nave hasta un agujero del techo a la derecha, prensas de hierro y un suelo de ceniza gris."
  }
};

// ---- Objetos -----------------------------------------------------------------------------------------------------------------
const objects = {
  // La sala del comienzo: la cosa de las pistas, la salida (una puerta de incendios pintada) y la palanca que la abre (BRIEF.md §3).
  radio: { at: "callejon", portable: true, material: "metal", name: "Radio de transistores", note: "Un programa de madrugada.",
    words: { nouns: ["radio", "transistor", "transistores"], adj: ["pequeña", "pequena", "vieja", "de"], g: "f" }, ...item("radio"),
    here: "Una {radio de transistores|radio} está sobre un cajón, sintonizada en un programa de llamadas de madrugada.",
    examine: "Una radio de transistores pequeña, sujeta con esparadrapo. Desconocidos llaman al programa de noche para aconsejarse unos a otros, y algunos consejos son buenos." },
  puerta: { at: "callejon", material: "metal", name: "Puerta de incendios", note: "Pintada contra el marco.", door: "s", locked: true,
    lock: { key: "palanca",
      says: "La puerta de incendios está pintada contra su marco. Hay una rendija por el lado de las bisagras, lo bastante ancha para el filo de algo plano y fuerte.",
      opens: "Metes el filo de la palanca en la rendija y te apoyas. La pintura cede, la puerta de incendios se abre sobre su barra y el bajo sale a tu encuentro.",
      then: "arrival" },
    shut: "Apoyas el hombro en la abolladura. La puerta de incendios no se mueve.",
    words: { nouns: ["puerta"], adj: ["incendios", "acero", "metal", "gris", "de"], g: "f" },
    parts: [{ words: ["rendija", "pintura", "marco", "bisagra", "bisagras", "abolladura"], name: "la rendija", says: "Una línea negra de pintura vieja por el lado de las bisagras, y una abolladura a la altura del hombro donde otros lo intentaron." }],
    examine: "Una puerta de acero con barra antipánico y sin pomo por este lado, pintada contra su marco por años de capas. Una abolladura a la altura del hombro, y una rendija por el lado de las bisagras." },
  palanca: { at: "callejon", portable: true, material: "metal", name: "Palanca", note: "Pesada, plana en un extremo.",
    words: { nouns: ["palanca", "barra"], adj: ["hierro", "oxidada", "pesada"], g: "f" }, ...item("palanca"),
    here: "Una {palanca|palanca} está apoyada en el contenedor, negra de la pintura de otras puertas.",
    examine: "Una palanca oxidada, con el filo de la uña tapado por pintura de otras puertas." },

  // Trastienda
  puerta_trasera: { at: "trastienda", material: "metal", name: "Puerta trasera", note: "Al callejón.", door: "n",
    words: { nouns: ["puerta"], adj: ["trasera", "incendios", "acero", "metal", "gris"], g: "f" },
    examine: "La puerta de incendios vista desde dentro: una barra, calzada abierta, y los charcos rosas del callejón detrás." },
  funda: { at: "trastienda", container: true, open: false, material: "wood", name: "Funda de guitarra", note: "Suena al inclinarla.",
    words: { nouns: ["funda", "estuche"], adj: ["guitarra", "negra", "vieja", "de"], g: "f" },
    examine: "Una funda de guitarra negra con el cierre roto, sujeta con un cinturón. Al inclinarla suena algo pequeño y numeroso, y no es una guitarra." },
  cuerdas: { at: "funda", portable: true, material: "paper", name: "Cuerdas de bajo", note: "Todavía en su sobre.",
    words: { nouns: ["cuerdas", "cuerda", "sobre", "juego"], adj: ["bajo", "nuevas", "precintadas", "de"], pl: true, g: "f" }, ...item("cuerdas"),
    examine: "Un sobre de papel con cuerdas de bajo, precintado, con el nombre de un grupo a bolígrafo: NADA PERSONAL." },

  // El Charlie
  cuco: { portrait: sprites.cuco_portrait, at: "charlie", name: "Cuco", note: "Lleva el sonido.",
    words: { nouns: ["cuco", "sonido", "técnico", "tecnico"], adj: [], proper: true, g: "m" },
    examine: "Un hombre flaco con chupa de cuero y una cresta como una raya de pintura negra, inclinado sobre una mesa de sonido. Pone una sola cinta entre grupo y grupo y no mira a nadie.",
    talk: "«No me pidas canciones —dice Cuco sin volverse—. Tengo media noche».",
    topics: {
      deck: { open: true, label: "la cinta", words: ["cinta", "casete", "cassette", "musica", "música", "mesa", "noche", "sonido"], says: "«Entre grupo y grupo pongo una cinta, siempre la misma, y esta noche es la equivocada —dice Cuco—. La buena la tiene Marisol, en la esquina. No pienso pedírsela»." },
      marisol: { label: "Marisol", words: ["marisol", "esquina", "mujer"], says: "Algo le cruza la cara y lo guarda. «Marisol me guardó la cinta de mi hermano la noche de después, y yo nunca fui a recogerla. Eso es todo»." },
      tie: { label: "una corbata negra", words: ["corbata", "negra", "seda", "entierro", "funeral"], says: "«¿Una corbata negra? —Cuco te mira como si le hubieras pedido el hígado—. Tengo una en el cajón de la mesa. La de mi padre, para su entierro y el mío. La daría por esa cinta y por nada más»." },
      dealer: { open: true, label: "el Ministro", words: ["ministro", "camello", "libro", "deuda", "debo", "debes"], says: "«Se pone junto a la mesa del fondo, y los chavales que miran el espejo lo miran a él —dice Cuco—. Yo también estoy en su libro, por un amplificador que nunca pagué. Todo el que lleva una puerta lo está. Pregunta a Pelayo cuándo le toca»." },
      default: "«Perdona —dice Cuco, por encima del bajo—. Solo oigo lo que llega por los auriculares»."
    },
    give: "«Es muy amable —dice Cuco—. Pero esa no es mi cinta»." },
  pelayo: { portrait: sprites.pelayo_portrait, at: "charlie", name: "Pelayo", note: "Lleva la barra.",
    words: { nouns: ["pelayo", "barman", "camarero", "portero"], adj: ["grande"], proper: true, g: "m" },
    examine: "Un hombre enorme con un collar de pinchos, con brazos como dos perros dormidos y un lápiz detrás de cada oreja. Pone una cerveza sin dejar una gota en la madera.",
    talk: "«¿Qué? —dice Pelayo, que es su forma de saludar—. ¿Cerveza o ruido?».",
    topics: {
      band: { open: true, label: "el grupo", words: ["grupo", "banda", "nacho", "cuerda", "cuerdas", "fabrica", "fábrica", "bajo", "bajista"], says: "«Nada Personal están esta noche en la fábrica, ensayando junto a un horno —dice Pelayo—. Nacho rompió una cuerda de bajo el martes y se enfurruña sin ella. Hay un juego de repuesto en la funda de guitarra de la trastienda, si alguien quisiera hacer algo útil»." },
      bar: { open: true, label: "la barra", words: ["barra", "cerveza", "cervezas", "beber", "precio", "fiado", "moneda"], says: "«Una cerveza es una moneda de cien pesetas —dice Pelayo—. Los punks las sueltan en la acera, delante, al entrar, y yo recojo lo que queda. No pidas fiado. Tu cara la he visto en el libro del Ministro»." },
      dealer: { open: true, label: "el Ministro", words: ["ministro", "camello", "ronda", "cuando", "cuándo"], says: "«Puntual como el correo —dice Pelayo—. Hace El Charlie, luego la avenida hasta La Ópera, vuelta por la estafeta a por su carta y otra vez la avenida. Cuatro minutos por puerta. Vende, lo apunta y se va»." },
      verde: { label: "la tanda verde", words: ["verde", "tanda", "papelina", "toni", "hospital"], says: "«Desde el miércoles —dice Pelayo—. Dos de los míos salieron de aquí en camilla, y uno no llegó ni a la camilla. Nadie que la venda dice de dónde viene. Si alguien es tan tonto de tomarla, que vaya a don Nicanor y su leche. Lo ha hecho tres veces esta semana»." },
      default: "«No es asunto mío —dice Pelayo—. Mi asunto es ese vaso»."
    },
    give: "«O monedas o nada —dice Pelayo, y lo devuelve»." },

  // La cerveza de El Charlie: una cerveza es una moneda de cien pesetas, y las tres monedas de la acera de la avenida se gastan de una en una (`remains`:
  // tres monedas, dos monedas, una moneda; el `requires` de la cerveza es la primera). La segunda cerveza te emborracha (los `doses` de la condición).
  cerveza: { at: null, from: "pelayo", requires: "monedas", spends: true, times: 3, material: "glass", name: "Cerveza", note: "Fría, en un vaso.",
    lacking: "«Una cerveza es una moneda —dice Pelayo, y espera—. Sin fiado».",
    brought: ["Pelayo coge una moneda, tira una {cerveza|cerveza} y la deja delante.", "Pelayo coge otra moneda y tira otra {cerveza|cerveza}.", "Pelayo coge la última moneda y tira la última {cerveza|cerveza}, mirándote todo el rato."],
    already: "«Bébete esa primero —dice Pelayo»", again: "«Con tres ya vale —dice Pelayo—. Pasadas tres, cantan, luego lloran, y luego friego yo»." ,
    consumable: true, starts: "drunk", drink: ["Fría y amarga, lo primero de esta noche que ha sido tuyo.", "Más tibia, y algo más lejos del suelo.", "Baja como un reto."],
    words: { nouns: ["cerveza", "vaso", "caña", "cana"], adj: ["fría", "fria"], g: "f" },
    examine: "Un vaso de cerveza, fría, con la espuma rasada a ras con el plano de un cuchillo." },
  // El café de La Ópera: también una moneda (las mismas de la cerveza), servido por palabra de doña Aurora y manos de Gaspar. Acaba con la condición
  // «drunk» (`stops`). Un café en total (`times: 1`). La borrachera también acaba con el tiempo (el `lasts`) y con un sueño de cuatro horas o más
  // (del motor), así que el mundo no escribe nada para dormir.
  cafe: { at: null, from: "aurora", requires: "monedas", spends: true, times: 1, material: "glass", name: "Café", note: "Negro, en una taza pequeña.",
    lacking: "«Un café es una moneda, cariño —dice doña Aurora, entre dos compases—. A mi coro no le pago con buenas intenciones».",
    brought: "Doña Aurora te coge la moneda de la mano sin perder la nota y hace un gesto a Gaspar, que pone delante un {café|cafe}, negro, sin decir palabra.",
    already: "«Bébete ese primero, cariño —dice doña Aurora»", again: "«Con uno basta —dice doña Aurora—. Con dos te pones a cantar, y yo no comparto escenario»." ,
    consumable: true, stops: "drunk", drink: "Negro, amargo y hirviendo. Sabe a café, y a final de noche.",
    words: { nouns: ["cafe", "café", "taza", "cafecito"], adj: ["negro", "caliente", "pequeño", "pequeno"], g: "m" },
    examine: "Una taza pequeña de café negro sobre un platillo, humeante, con el desportillado del borde vuelto hacia el otro lado." },
  monedas: { at: "avenida", portable: true, material: "metal", name: "Tres monedas", note: "Una copa cada una.", remains: "monedas_2",
    words: { nouns: ["monedas", "moneda", "dinero", "suelto"], adj: ["tres", "cien", "plateadas"], pl: true, g: "f" }, ...item("monedas"),
    here: "Tres {monedas|monedas} yacen en la acera, delante de la puerta de El Charlie, donde hace cola la gente.",
    lies: "Tres monedas yacen donde las dejaste.",
    examine: "Tres monedas de cien pesetas, tibias del bolsillo de alguien. Una moneda es una cerveza en El Charlie, o un café en La Ópera." },
  monedas_2: { at: null, portable: true, material: "metal", name: "Dos monedas", note: "Una copa cada una.", remains: "moneda_1",
    words: { nouns: ["monedas", "moneda", "dinero", "suelto"], adj: ["dos", "cien", "plateadas"], pl: true, g: "f" }, ...item("monedas_2"),
    lies: "Dos monedas yacen donde las dejaste.", examine: "Dos monedas de cien pesetas. Una moneda es una cerveza en El Charlie, o un café en La Ópera." },
  moneda_1: { at: null, portable: true, material: "metal", name: "Moneda", note: "Una copa.",
    words: { nouns: ["moneda", "dinero", "suelto"], adj: ["ultima", "última", "cien", "plateada"], g: "f" }, ...item("moneda_1"),
    lies: "Una moneda yace donde la dejaste.", examine: "Una moneda de cien pesetas. Una copa más: una cerveza en El Charlie, un café en La Ópera." },

  // El Ministro: un camello en su ronda (las salas por orden, un paso cada cuatro movimientos tuyos). Vende en cada puerta: sus llegadas y la regla
  // temporizada ministro_sells lo muestran; su libro de deudas es una parte de él; tu propia página está sin pagar.
  ministro: { portrait: sprites.ministro_portrait, at: "opera", name: "El Ministro", note: "En su ronda.",
    rounds: { rooms: ["charlie", "avenida", "opera", "avenida", "estafeta", "avenida"], every: [4, 4] },
    arrives: [
      "El Ministro entra con su maletín y su libreta. Ya le espera alguien: un apretón de manos, un papel doblado, billetes que cambian de mano sin contarse.",
      "Llega el Ministro. Una mujer le pone una mano en el brazo y él abre el maletín un palmo. Ella se va con el puño cerrado. Él anota algo en la libreta.",
      "Llega el Ministro. Un hombre con prisa le enseña las manos vacías. El Ministro abre la libreta, anota y lo despacha con un gesto."
    ],
    leaves: ["El Ministro se abrocha el abrigo, da la última mano y sigue hacia la puerta siguiente.", "El Ministro mira la muñeca, donde no hay reloj, y se va."],
    words: { nouns: ["ministro", "camello", "ildefonso"], adj: ["el", "viejo", "alto"], g: "m" }, ...item("ministro"), figure: sprites.ministro_figure,
    parts: [{ words: ["libro", "libreta", "cuaderno", "deudas", "pagina", "página", "paginas", "páginas"], name: "su libro",
      says: "Una libreta negra de hule, con nombres en columnas y una suma al final de cada uno, la esquina de cada página sin pagar doblada. La tuya está doblada dos veces." }],
    here: "{El Ministro|ministro} está aquí, con un abrigo de camello y un sombrero gris, un maletín de cuero en una mano y una libreta negra abierta en la otra.",
    examine: "Un hombre alto y delgado de sesenta años con abrigo de camello, sombrero gris y gafas de montura dorada. Lleva el cuello abierto y no hay corbata en él. Da la mano como un obispo y cuenta como un banco, y fue farmacéutico hasta que el Colegio lo expulsó.",
    talk: "«Buenas noches —dice el Ministro, como a una delegación—. Tengo cuatro minutos, y vendo en todos»." ,
    topics: {
      want: { open: true, label: "una papelina", words: ["papelina", "papelinas", "heroina", "heroína", "comprar", "vender", "vende", "precio", "fiado", "debo", "debes", "pagina", "página", "dinero"], opens: ["tie"], says: "«Una papelina es una papelina —dice el Ministro—. Dinero, o una línea en el libro. Has usado el libro: jueves, viernes, dos el sábado, y ni una peseta en contra. No apunto una deuda sobre una deuda. Tráeme lo que necesito esta noche y te arranco la página y te vendo una más. Necesito una corbata negra, de seda si el barrio da para tanto. Las tiendas están cerradas y la mía está donde no debe»." },
      book: { open: true, label: "su libro", words: ["libro", "libreta", "cuaderno", "deudas", "nombres", "pagina", "página"], says: "«Nombres, sumas, fechas —dice el Ministro—. Media avenida está en él, y buena parte de esa mitad no verá la Navidad. Una deuda es lo único que vendo que nunca se gasta. Todo lo que brilla se paga, Emperador, y yo guardo los recibos»." },
      sell: { open: true, label: "lo que vende", words: ["vende", "vender", "genero", "género", "maletin", "maletín", "limpio", "farmaceutico", "farmacéutico", "calidad"], says: "«Heroína, de mis propias manos, una papelina cada vez, cortada por fórmula y no a ojo —dice el Ministro—. Fui farmacéutico veinte años. No le pongo nada que no pueda nombrar ante un magistrado»." },
      tie: { label: "la corbata", words: ["corbata", "seda", "negra", "entierro", "cuello", "funeral"], opens: ["matilde"], says: "«El entierro es al amanecer. Una corbata negra, o me quedo en el portal —dice el Ministro—. Pregunta a quien haya enterrado a alguien: un hombre siempre guarda una corbata que odia. Y tráemela en mi ronda, no a mi casa. No tengo casa»." },
      matilde: { label: "el entierro", words: ["entierro", "funeral", "matilde", "hermana", "iglesia", "misa", "judas"], says: "«Mi hermana. Matilde Peláez, treinta años portera del número nueve, la casa tomada ahora —dice el Ministro—. Dio de comer a media escalera con un sueldo que no alimentaría a un gato. Misa en San Judas, a primera hora. Estuvo nueve años sin hablarme. Yo vendía a sus vecinos, y lo sabía»." },
      verde: { label: "la tanda verde", words: ["verde", "tanda", "papelina", "toni", "corte", "veneno"], says: "«No es mía —dice el Ministro, y por una vez no está vendiendo—. La mía nunca ha sido verde. Alguien la corta con lo que encuentra bajo el fregadero. Quien la fuma se envenena en menos de una hora. Leche y carbón, deprisa. Nicanor tiene las dos cosas»." },
      round: { open: true, label: "su ronda", words: ["ronda", "paseo", "rondas", "donde", "dónde", "estafeta", "carta"], says: "«El Charlie, la avenida, La Ópera, la avenida, la estafeta a por mi carta, la avenida otra vez —dice el Ministro—. Cuatro minutos por puerta. Llevo once años haciéndola y nunca me han robado, porque nadie puede planear nada contra un hombre del todo previsible»." },
      default: "«Una pregunta agradable —dice el Ministro—, pero solo tengo cuatro minutos»."
    },
    give: "«Un detalle amable —dice el Ministro—, pero no. Esta noche quiero una sola cosa, y no es esa»." },

  // La avenida y la esquina
  marisol: { portrait: sprites.marisol_portrait, at: "esquina", name: "Marisol", note: "Trabaja la esquina.",
    words: { nouns: ["marisol", "mujer", "señora", "senora"], adj: [], proper: true, g: "f" },
    examine: "Una mujer con abrigo corto y buenos zapatos, el pelo recogido, la cara cansada bajo el maquillaje. Un corte sobre una ceja, de hace un día. Mira cada coche como si leyera su matrícula.",
    talk: "«Buenas, Emperador —dice Marisol—. Si vienes a trabajar, trabaja en la otra acera. Si vienes a mirar, mira la farola».",
    topics: {
      work: { open: true, label: "su trabajo", words: ["trabajo", "trabajar", "esquina", "farola", "precio", "clientes", "habitacion", "habitación"], says: "«Veinte minutos en la siete, Nicanor se queda su hora, y el cliente paga después, no antes. Antes es como te roban —lo dice como un horario—. Once años bajo una farola. Es un oficio. Nadie le pregunta a la panadera si le da vergüenza»." },
      eyes: { open: true, label: "sus ojos", words: ["ojos", "cara", "kohl", "maquillaje", "cansada", "corte"], opens: ["tape"], says: "«El corte es el anillo de un cliente —dice—. Se irá. El kohl no: el bote está vacío y la tienda que vendía ese negro cerró. El hollín de un deshollinador hace el mismo trabajo, y el único que queda está en la azotea de la casa tomada»." },
      tape: { label: "la cinta", words: ["cinta", "casete", "cassette", "cuco"], says: "«La cinta del hermano de Cuco —dice—. La de Quique. Hace dos inviernos, la noche de después, Cuco me la dio para que la guardara y no volvió a por ella. Si alguien me trajera un poco de ese negro para los ojos, podría prestársela»." },
      name: { label: "tu nombre", words: ["nombre", "javier", "emperador"], says: "«Te llaman Emperador desde que eras un chiste que alguien contó —dice—. Antes eras Javier, el del tercero, el de la tos. Matilde, la portera, te daba de comer en la escalera. Nicanor lo tiene apuntado en alguna parte»." },
      dealer: { open: true, label: "el Ministro", words: ["ministro", "camello", "libro"], says: "«¿El Ministro? Mira el dinero como un cura mira un bikini —dice Marisol—. La mitad estamos en su libro. Está en su ronda: pregunta en El Charlie, que tienen sus horas»." },
      verde: { label: "la tanda verde", words: ["verde", "tanda", "papelina", "toni", "veneno"], says: "«Desde el miércoles corre una verde, y Toni está en un colchón en la casa por su culpa —dice Marisol—. Si alguien la toma igual, que lo lleven a Nicanor. Leche y carbón. Es lo único que funciona»." },
      default: "«De eso no sé, cariño —dice Marisol—, pero si te enteras, díselo a la farola»."
    },
    give: "«Para mí no, cariño —dice Marisol—. Solo cojo lo que puedo usar»." },
  hollin: { at: null, portable: true, material: "soft", name: "Bote de hollín", note: "Fino y negro.",
    words: { nouns: ["hollin", "hollín", "bote", "tarro", "negro"], adj: ["fino", "negro"], g: "m" }, ...item("hollin"),
    examine: "Un tarro de mermelada con hollín de chimenea, fino como harina. Sirve para los ojos, y para nada más." },

  // La estafeta
  remedios: { portrait: sprites.remedios_portrait, at: "estafeta", name: "Doña Remedios", note: "Lo sella todo.",
    words: { nouns: ["remedios", "dona", "doña", "empleada", "mujer"], adj: ["doña", "corpulenta"], proper: true, g: "f" },
    examine: "Una mujer corpulenta con rebeca verde y redecilla, con un sello en cada mano y un tercero detrás de la oreja. No levanta la vista ante nada que no haya archivado ya.",
    talk: "«Siguiente —dice doña Remedios, aunque no hay nadie más—. Nombre, calle, piso, por ese orden. No: piso primero».",
    topics: {
      post: { open: true, label: "el correo", words: ["correo", "cartas", "carta", "saco", "sello", "trabajo", "furgoneta"], says: "«Clasifico lo que llega, sello lo que sale, devuelvo lo que no tiene a quién ir —dice doña Remedios—. Nueve de cada diez son devoluciones. La gente se muda más deprisa que sus direcciones»." },
      dealer: { open: true, label: "el Ministro", words: ["ministro", "camello", "carta", "correo"], says: "«Cada sábado, una carta certificada del Colegio de Farmacéuticos —dice doña Remedios—. El único dinero que coge sin contarlo delante de mí. Firma con letra de receta, y toda la sala de clasificación sabe lo que hace el resto de la semana»." },
      matilde: { label: "Matilde", words: ["matilde", "portera", "peláez", "pelaez", "entierro", "funeral"], says: "«Treinta años de cartas de Matilde a un chico del tercero del número nueve, y treinta años de Devuélvase al remitente: desconocido —dice doña Remedios—. Javier Maza. No dejó de escribir. Yo no dejé de devolverlas. Yo sello lo que está sellado»." },
      default: "«Eso no lo puedo sellar —dice doña Remedios, y sella otra cosa»."
    },
    give: "«Cojo cartas y cojo sellos —dice doña Remedios—, y eso no es ninguna de las dos cosas»." },

  // La pensión
  nicanor: { portrait: sprites.nicanor_portrait, at: "pension", name: "Don Nicanor", note: "Lleva el mostrador.",
    words: { nouns: ["nicanor", "don", "casero", "recepcionista", "dueño", "dueno"], adj: ["don"], proper: true, g: "m" },
    examine: "Un hombre delgado con un bigote que ha sobrevivido a dos esposas, con una rebeca verde. Detrás del mostrador, al alcance, una jarra de leche y un bote de carbón. Tiene el don de no enterarse, y lo usa como oficio.",
    talk: "«Habitaciones por horas, por noches o por meses —dice don Nicanor—. Lo de los meses es para quien ha tirado la toalla. No lo recomiendo».",
    topics: {
      rooms: { open: true, label: "una habitación", words: ["habitacion", "habitación", "habitaciones", "cama", "noche", "hora", "alquiler"], says: "«Doscientas la hora, seiscientas la noche, y sin preguntas a ninguna de las dos tarifas. La única habitación que no alquilo es la siete. Esa es de una señora que paga el día uno»." },
      book: { open: true, opens: ["name"], label: "el Libro de Horas", words: ["libro", "registro", "horas", "nombres"], says: "«Todo nombre que se ha alojado aquí está en el Libro —dice don Nicanor—. Hasta el tuyo. Javier Maza, habitación siete, un invierno de hace mucho: un bebé con tos, en un cuarto sin calefacción, y una madre en el turno de tarde. La portera del bloque de al lado subió una olla de sopa por la escalera. Me acuerdo porque dormías mejor que tu madre»." },
      marisol: { label: "Marisol", words: ["marisol", "siete", "inquilina"], says: "«La siete es de Marisol —dice don Nicanor—. Paga el día uno y nunca ha dado un portazo. Si quieres ver cómo vive una señora, sube a mirar. Deja la puerta abierta»." },
      dealer: { open: true, label: "el Ministro", words: ["ministro", "camello"], says: "«Un caballero —dice don Nicanor—. Alquiló la habitación de la esquina por noches durante años, hasta que dejó de hacerlo. No pregunto qué lleva un caballero en su maletín, y él no me lo cuenta. Diré que nunca dejó en mi cama a nadie que no se despertara»." },
      verde: { label: "la tanda verde", words: ["verde", "tanda", "papelina", "veneno", "leche", "carbon", "carbón", "toni"], says: "«La cuatro, tres veces esta semana —dice don Nicanor—. Un vaso de leche con carbón, bebido enseguida, y luego la escalera y el aire. Lo hago gratis. Sale más barato que un entierro, y ya he ido a bastantes. Pídeme la leche si alguien se pone gris»." },
      default: "«No sabría decirle —dice don Nicanor, y anota algo en el Libro»."
    },
    give: "«Gracias, pero llevo una casa seria —dice don Nicanor, y lo devuelve»." },
  // El remedio de la tanda verde: gratis de don Nicanor (PEDIR, PREGUNTAR); acaba con el veneno y cura uno.
  leche: { at: null, from: "nicanor", times: 2, material: "glass", name: "Leche con carbón", note: "Gris y arenosa.",
    brought: "Don Nicanor llena un vaso de la jarra, echa una cucharada de carbón del bote, remueve y pone delante un vaso de {leche con carbón|leche}.",
    already: "«Bébete ese primero —dice don Nicanor»", again: "«No hay más —dice don Nicanor—. La jarra es para toda la casa»." ,
    consumable: true, heals: 1, stops: "poisoned", drink: "Gris, espesa y arenosa. Se queda dentro.",
    words: { nouns: ["leche", "carbon", "carbón", "vaso", "mezcla", "antidoto", "antídoto", "remedio"], adj: ["gris", "arenosa"], g: "f" },
    examine: "Un vaso de leche vuelta gris por el carbón, con una cucharilla de pie." },
  escalera_pension: { at: "pension", leads: "u", name: "Escalera", note: "Sube a las habitaciones.",
    words: { nouns: ["escalera", "escaleras", "escalones"], adj: ["estrecha", "gastada"], g: "f" },
    examine: "Una escalera estrecha con una alfombra roja gastada, que sube a un rellano y una hilera de puertas con número." },
  kohl: { at: "pension_hab", name: "Bote de kohl", note: "Rascado hasta el fondo.",
    words: { nouns: ["bote", "kohl", "lapiz", "lápiz"], adj: ["kohl", "negro", "vacío", "vacio"], g: "m" },
    examine: "Un bote pequeño y redondo, rascado hasta el fondo con una uña. No queda ni una escama." },
  pintada: { at: "pension_hab", name: "Pintada", note: "De pintalabios, en la pared.",
    words: { nouns: ["pintada", "letras", "papel", "pintalabios", "mensaje"], adj: ["pintalabios"], g: "f" },
    examine: "De pintalabios en el papel de la pared, con letra grande y redonda: «CUCO. LA CINTA DE QUIQUE ESTÁ AQUÍ CUANDO VENGAS A POR ELLA TÚ MISMO». Debajo, más pequeño: «Antes no»." },
  escalera_pension_hab: { at: "pension_hab", leads: "d", name: "Escalera", note: "De vuelta abajo.",
    words: { nouns: ["escalera", "escaleras", "escalones"], adj: ["estrecha", "gastada"], g: "f" },
    examine: "La escalera baja al vestíbulo." },

  // La Ópera
  aurora: { portrait: sprites.aurora_portrait, at: "opera", name: "Doña Aurora", note: "Dueña del escenario.",
    words: { nouns: ["aurora", "dona", "doña", "cantante", "mujer", "duena", "dueña"], adj: ["doña"], proper: true, g: "f" },
    examine: "Una mujer de cincuenta y ocho años con el pelo teñido de rojo, una boa de plumas verde y nada más de cintura para arriba, de pie en su escenario como en un púlpito. Canta como quien una vez fue tomada en serio y ha decidido seguir siéndolo.",
    talk: "«Cariño —dice doña Aurora entre dos compases—, si has venido a escuchar, cállate. Si has venido a beber, Gaspar es sordo».",
    topics: {
      room: { open: true, label: "la sala", words: ["sala", "bar", "ópera", "opera", "escenario", "cantar", "canta"], says: "«Hace cuarenta años esto era el café de enfrente del teatro de la ópera, y toda corista de Madrid tomaba su café en esa mesa —dice doña Aurora—. El teatro de la ópera es ahora un banco. Las coristas son abuelas. Yo soy la última que sigue con plumas»." },
      coffee: { open: true, label: "el café", words: ["cafe", "café", "taza", "gaspar", "cafetera", "sobrio"], says: "«Una moneda, cariño, como antes de que el teatro fuera un banco —dice doña Aurora—. Gaspar lo hace negro y no lo discute. Ha espabilado a hombres mejores que tú»." },
      dealer: { open: true, label: "el Ministro", words: ["ministro", "camello", "mesa", "caballero", "libro"], says: "«¿Don Ildefonso? La mesa redonda, de espaldas a la pared, un carajillo que nunca acaba —dice doña Aurora—. Lleva la cuenta de mis caballeros, y un caballero que debe vuelve el viernes. Yo estoy en el libro, por las medias de mis chicas. Espera unos minutos y llegará. A mí me da cuatro»." },
      tie: { label: "una corbata negra", words: ["corbata", "negra", "seda", "entierro"], says: "«¿Una corbata negra? Anoche me pidió una, con su hermana todavía sin enterrar —dice doña Aurora—. Las que tengo son pajaritas y amarillas. Pregunta por los bares, cariño. Alguien ha enterrado a alguien»." },
      matilde: { label: "Matilde", words: ["matilde", "hermana", "portera", "entierro"], says: "«Matilde Peláez, la portera del número nueve. Nunca dijo a nadie que tenía una hermana, hasta que fue una muerta —dice doña Aurora—. Mantuvo con vida a un chico del tercero con sopa y le escribió cartas treinta años. Él nunca contestó. Lo dice el propio Ministro sobre su carajillo, todas las noches de esta semana»." },
      default: "«No sabría decirte, cariño —dice doña Aurora—, y querría un coro que lo dijera por mí»."
    },
    give: "«Precioso —dice doña Aurora—. Pero yo solo colecciono corazones y deudas»." },

  // La lavandería
  secadora: { at: "lavanderia", name: "Secadora grande", note: "Quiere fichas.",
    words: { nouns: ["secadora", "maquina", "máquina", "ojo", "ranura"], adj: ["grande", "del", "fondo"], g: "f" },
    parts: [{ words: ["forma", "pestillo", "cristal", "tambor", "cepillo", "cerdas"], name: "la forma del tambor", says: "Algo largo y oscuro yace contra el cristal, sujeto por el pestillo. El pestillo solo suelta al final de un ciclo pagado." }],
    examine: "Una secadora enorme y vieja con una puerta de cristal redonda y una ranura que dice FICHAS. Algo largo y oscuro yace dentro, sujeto por un pestillo que solo suelta al final de un ciclo.",
    switch_on: "La secadora no hace nada. La ranura dice FICHAS.",
    push: "La secadora no hace nada. La ranura dice FICHAS.",
    take: "Está atornillada al suelo." },
  cepillo: { at: null, portable: true, material: "wood", name: "Cepillo de deshollinador", note: "Largo, negro, rígido.",
    words: { nouns: ["cepillo"], adj: ["deshollinador", "chimenea", "largo", "negro", "de"], g: "m" }, ...item("cepillo"),
    examine: "El cepillo de un deshollinador en una caña articulada, negro hasta el mango. Quemado en la madera con un clavo candente: T. H." },
  fichas: { at: null, portable: true, material: "metal", name: "Fichas de lavandería", note: "De latón, con un agujero.",
    words: { nouns: ["fichas", "ficha", "monedas"], adj: ["lavandería", "lavanderia", "latón", "laton", "de"], pl: true, g: "f" }, ...item("fichas"),
    examine: "Un puñado de fichas de latón con LAVANDERÍA estampado, cada una con un agujero. Las justas para una máquina." },

  // La cinta y la corbata
  cinta: { at: null, portable: true, material: "paper", name: "Cinta", note: "Sin etiqueta.",
    words: { nouns: ["cinta", "casete", "cassette"], adj: ["sin", "etiqueta", "lisa", "barata"], g: "f" }, ...item("cinta"),
    examine: "Un casete barato sin etiqueta, solo con una huella de dedo en lápiz de ojos. Las bobinas están muy parejas." },
  corbata: { at: null, portable: true, material: "soft", name: "Corbata negra", note: "De seda, arrugada.",
    words: { nouns: ["corbata"], adj: ["negra", "seda", "estrecha", "de"], g: "f" }, ...item("corbata"),
    examine: "Una corbata estrecha de seda negra, arrugada por el medio de un entierro de más." },
  papelina: { at: null, portable: true, material: "paper", name: "Papelina", note: "Doblada pequeña.",
    words: { nouns: ["papelina", "papel", "paquete"], adj: ["doblada", "pequeña", "pequena"], g: "f" }, ...item("papelina"),
    examine: "Un cuadrado de papel doblado al tamaño de una uña, y más pesado de lo que parece. Heroína, limpia, de las manos del Ministro. Es a lo que has venido." },

  // La tanda mala (fuera del hilo): una papelina junto al colchón de Toni. Fumarla es una elección, y envenena (la condición `poisoned`).
  verde: { at: "casa", portable: true, material: "paper", name: "Papelina verde", note: "Doblada, verdosa.", use: "smoke",
    actions: ["Fumar papelina"], heldActions: ["Fumar papelina"],
    words: { nouns: ["papelina", "papel", "paquete", "papelote", "tanda", "dosis"], adj: ["verde", "verdosa", "doblada", "mala"], g: "f" }, ...item("verde"),
    here: "Una {papelina|verde} doblada yace en las baldosas, junto al colchón, donde una mano la soltó.",
    lies: "Una papelina verde yace donde la dejaste.",
    examine: "Un cuadrado de papel doblado pequeño. El polvo de dentro es marrón con un tinte verdoso, y los labios de Toni, bajo la sábana, estaban azules. Es la tanda que corre desde el miércoles." },

  // La casa tomada
  escalera_patio: { at: "patio", leads: "u", name: "Escalera de hierro", note: "Sube a la azotea.",
    words: { nouns: ["escalera", "peldaños", "peldanos"], adj: ["hierro", "oxidada", "de"], g: "f" },
    examine: "Una escalera de hierro atornillada a la pared norte, con los peldaños gastados y brillantes a la altura de la mano." },
  escalera_azotea: { at: "azotea", leads: "d", name: "Escalera de hierro", note: "De vuelta abajo.",
    words: { nouns: ["escalera", "peldaños", "peldanos"], adj: ["hierro", "oxidada", "de"], g: "f" },
    examine: "La escalera por la que has subido, que baja a la luz de velas del patio." },
  tomas: { portrait: sprites.tomas_portrait, at: "azotea", name: "Tomás", note: "El deshollinador.",
    words: { nouns: ["tomas", "tomás", "deshollinador", "hombre"], adj: [], proper: true, g: "m" },
    examine: "Un deshollinador de la chistera para abajo, negro salvo el blanco de los ojos. Hay un hueco en su cinturón donde debería colgar un cepillo. Tose como quien lleva cuarenta años deshollinando.",
    talk: "«Cuidado con las chimeneas —dice Tomás—. Están calientes, y se quedan con lo que les das».",
    topics: {
      sweeping: { open: true, label: "el deshollinar", words: ["deshollinar", "deshollinador", "chimenea", "chimeneas", "trabajo", "hollin", "hollín"], says: "«Once chimeneas aquí arriba, y una duodécima en la fábrica más grande que todas juntas —dice Tomás—. Cuarenta años llevo deshollinándolas. Quien deshollina una chimenea se queda con el hollín. Esa es toda la ley»." },
      brush: { open: true, label: "su cepillo", words: ["cepillo", "perdido", "caña", "cana"], says: "«Lo dejé en la secadora de la Lavandería el invierno pasado, en mis monos —dice Tomás—. El pestillo se cerró, no tenía ficha para el ciclo y el sobrino del dueño no me la abre. Un deshollinador sin cepillo es un hombre con una chimenea en la cabeza»." },
      dealer: { open: true, label: "el Ministro", words: ["ministro", "camello", "libro"], says: "«¿Don Ildefonso? Estoy en su libro por un jarabe para la tos que nunca pagué —dice Tomás—. Le pago con hollín. Se sienta bajo cada chimenea que he deshollinado. Eso es un ministro, supongo»." },
      default: "«No sé decir —dice Tomás—. Yo solo sé de hollín»."
    },
    give: "«Eso no es mío —dice Tomás—, pero gracias»." },

  // La fábrica
  marga: { portrait: sprites.marga_portrait, at: "fabrica", name: "Marga", note: "Batería, Nada Personal.",
    words: { nouns: ["marga", "baterista", "batería", "bateria", "chica"], adj: [], proper: true, g: "f" },
    examine: "Una chica de diecinueve años ante una batería hecha de un tom y un cubo, con el pelo negro cortado al rape, una camiseta rota y las baquetas en el cinturón como cuchillos. Duerme en esta nave, sobre palés, desde que su madre cambió la cerradura.",
    talk: "«Si has venido a decirme que baje el volumen, la respuesta es el horno —dice Marga—. Suena más fuerte que yo».",
    topics: {
      band: { open: true, opens: ["strings"], label: "el grupo", words: ["grupo", "banda", "nada", "personal", "nacho", "ensayo", "bateria", "batería", "baquetas"], says: "«Nada Personal. Cuatro, tres aquí: Nacho se ha enfurruñado. Rompió una cuerda de bajo el martes y la tienda de música no abre hasta el lunes, y dice que no puede tocar sin ella, que es mentira, pero testaruda —dice Marga»." },
      strings: { label: "las cuerdas", words: ["cuerdas", "cuerda", "bajo", "sobre", "juego"], says: "«¿Cuerdas de bajo? ¿Tienes un juego de repuesto? Tráelo, y te doy el fondo de colada del grupo. Catorce fichas en una lata de café. Nacho puede lavarse los calcetines el lunes —dice Marga»." },
      dealer: { open: true, label: "el Ministro", words: ["ministro", "camello"], says: "«¿El Ministro? Vino una vez, a escucharnos. Se quedó al fondo tres canciones con el sombrero puesto y dejó propina en la lata. Cien pesetas, en monedas, como un sombrero en una iglesia —dice Marga»." },
      default: "«Ni idea —dice Marga, y golpea el cubo»."
    },
    give: "«No es mío —dice Marga—. Cuerdas sí cojo»." }
};

// ---- Los puzles -----------------------------------------------------------------------------------------------------------------
const puzzles = {
  // La salida de la sala del comienzo va primero (BRIEF.md §3): las primeras pistas de la radio son sobre ella.
  way_out: { where: "callejon", needs: [], solve: ["{take} palanca", "abrir puerta con palanca", "sur"], reaches: "trastienda", clues: ["puerta", "palanca"],
    hints: ["La puerta de incendios está pintada contra su marco, con una rendija por el lado de las bisagras, y algo pesado se apoya en el contenedor.", "Coge la palanca, fuerza con ella la puerta de incendios y ve al sur."] },
  take_strings: { where: "trastienda", needs: [], solve: ["abrir funda", "{take} cuerdas"], gives: ["cuerdas"], clues: ["funda", "pelayo"],
    hints: ["La funda de guitarra de la trastienda suena al inclinarla, y a un grupo le falta algo.", "Abre la funda de guitarra y coge las cuerdas de bajo."] },
  strings_for_tokens: { where: "fabrica", needs: ["cuerdas"], solve: ["dar cuerdas a marga"], gives: ["fichas"], clues: ["marga", "pelayo"],
    hints: ["Al grupo de Marga le falta una cuerda, y guardan el dinero de la colada en una lata.", "Da las cuerdas de bajo a Marga, en la fábrica, y te dará las fichas de lavandería."] },
  run_dryer: { where: "lavanderia", needs: ["fichas"], solve: ["meter fichas en secadora", "{take} cepillo"], gives: ["cepillo"], clues: ["secadora", "tomas"],
    hints: ["La secadora de la Lavandería admite fichas, y algo largo espera tras su pestillo.", "Mete las fichas en la secadora y coge lo que salga."] },
  sweep_roof: { where: "azotea", needs: ["cepillo"], solve: ["dar cepillo a tomas"], gives: ["hollin"], clues: ["tomas", "cepillo", "marisol"],
    hints: ["Al deshollinador de la azotea de la casa tomada le falta el cepillo.", "Da el cepillo a Tomás, en la azotea, y deshollinará una chimenea y te dará el hollín."] },
  line_eyes: { where: "esquina", needs: ["hollin"], solve: ["dar hollin a marisol"], gives: ["cinta"], clues: ["marisol", "hollin", "kohl"],
    hints: ["El bote de kohl de Marisol está vacío, y el hollín de un deshollinador hace lo que un bote no puede.", "Da el hollín a Marisol, en la esquina, y te dará la cinta del hermano de Cuco."] },
  tape_for_tie: { where: "charlie", needs: ["cinta"], solve: ["dar cinta a cuco"], gives: ["corbata"], clues: ["cuco", "pintada"],
    hints: ["La cinta de Cuco está en la esquina, y él tiene la única corbata negra que necesita el Ministro.", "Da la cinta a Cuco, en El Charlie, y coge la corbata negra."] },
  corona: { where: "avenida", needs: ["corbata"], solve: ["dar corbata a ministro", "decir emperador"], ending: true, clues: ["ministro", "cuco"],
    hints: ["El Ministro quiere una corbata negra para un entierro, y te saldará la página por ella. Preguntará a nombre de quién escribe el recibo.", "Da la corbata al Ministro y dile que eres Emperador."] },
  nombre: { where: "avenida", needs: ["corbata"], solve: ["dar corbata a ministro", "decir javier"], ending: true, clues: ["ministro", "marisol", "nicanor"],
    hints: ["Marisol y don Nicanor recuerdan un nombre que no es el de Emperador.", "Da la corbata al Ministro y dile que eres Javier."] }
};

// ---- Reglas -----------------------------------------------------------------------------------------------------------------
const rules = [
  // La secadora: las fichas dentro, el pestillo suelta.
  { id: "put_tokens", match: { verb: ["put", "use"], obj: "fichas", obj2: "secadora" }, if: [{ "player.at": "lavanderia" }], once: true,
    again: "La secadora ya ha tenido sus fichas y sigue dando vueltas.",
    do: [{ say: "Las fichas entran una a una, cada una con una nota mojada. La secadora se estremece durante un ciclo, el pestillo chasquea y la puerta cae abierta sobre un {cepillo|cepillo} largo y negro, caliente como el pan." },
         { draw: "lavanderia", remove: ["cepillo_*"] }, { move: "fichas", to: null }, { move: "cepillo", to: "lavanderia" }] },
  // Marga: cuerdas por las fichas de la colada del grupo.
  { id: "give_strings", match: { verb: ["give", "show", "use", "put"], obj: "cuerdas", obj2: "marga" }, if: [{ "player.at": "fabrica" }], once: true,
    again: "«Con un juego basta, gracias —dice Marga—. Nacho solo rompe una cada vez».",
    do: [{ say: "Marga coge el sobre con las dos manos y besa una vez el nombre del grupo. Busca debajo del cubo una lata de café, vuelca catorce {fichas|fichas} de latón en la palma y te las pasa a la tuya. «Dile a Nacho que lo he hecho yo —dice—. No le digas nada más»." },
         { move: "cuerdas", to: null }, { move: "fichas", to: "player" }] },
  // El deshollinador: el cepillo de vuelta, el hollín fuera.
  { id: "give_brush", match: { verb: ["give", "show", "use", "put"], obj: "cepillo", obj2: "tomas" }, if: [{ "player.at": "azotea" }], once: true,
    again: "«Ya he deshollinado una —dice Tomás—. El bote es todo tuyo».",
    do: [{ say: "Tomás coge el cepillo como otro hombre cogería a un niño. Deshollina la chimenea más cercana una vez, y sale una nube de hollín. Llena un tarro de {hollín|hollin} sin mirar y te lo da. «Para los ojos de una señora —dice—. Para eso sirve». El cepillo vuelve a su cinturón." },
         { move: "cepillo", to: null }, { move: "hollin", to: "player" }] },
  // Marisol: hollín para sus ojos, y la cinta.
  { id: "give_soot", match: { verb: ["give", "show", "use", "put"], obj: "hollin", obj2: "marisol" }, if: [{ "player.at": "esquina" }], once: true,
    again: "«Con un bote me basta —dice Marisol».",
    do: [{ say: "Marisol se moja un dedo en el bote y se traza una raya en cada ojo, un remate en la comisura, sin espejo, en cuatro segundos. Cuando se vuelve hacia la farola parece que ha dormido. «Ya —dice—. Ahora puedo trabajar. Anda, cógela». Busca en el abrigo y saca una {cinta|cinta} con una huella en negro. «Dile que es de la esquina. No le digas nada más»." },
         { move: "hollin", to: null }, { move: "cinta", to: "player" }] },
  // Cuco: la cinta, y la corbata.
  { id: "give_tape", match: { verb: ["give", "show", "use", "put"], obj: "cinta", obj2: "cuco" }, if: [{ "player.at": "charlie" }], once: true,
    again: "«Con una me basta —dice Cuco».",
    do: [{ say: "Cuco sostiene la cinta como si quemara. La mete en un radiocasete hecho polvo bajo la mesa, y los primeros compases de algo barato y enorme salen por un altavoz. La voz de un chico, una guitarra mala. No se vuelve. Abre el cajón de la mesa, saca una {corbata negra|corbata} y te la pone en la mano sin girarse. «La de mi padre —dice—. No la manches»." },
         { move: "cinta", to: null }, { move: "corbata", to: "player" }] },
  // El Ministro: la corbata por la papelina, y a nombre de quién escribe el recibo.
  { id: "trade_tie", match: { verb: ["give", "show", "use", "put"], obj: "corbata", obj2: "ministro" }, if: [{ "ministro.traded": false }],
    do: [{ say: "El Ministro coge la corbata con dos dedos y la pasa entre ellos como un rosario. Se la pone sin espejo, y el cuello abierto se cierra. «Servirá —dice—. Abre la libreta por tu página, con la esquina doblada dos veces, y saca del maletín una {papelina|papelina}. Tu página queda saldada, y esta es la última de la cuenta vieja. Cada operación la escribo a un nombre al que pienso reclamar. ¿A cuál?»." },
         { set: "ministro.traded", to: true }, { move: "corbata", to: null }, { move: "papelina", to: "player" }] },
  { id: "sign_crown", match: { verb: "say" }, if: [{ "ministro.traded": true }, { "ministro.at": "$here" }, { $text: { in: CORONA } }],
    do: [{ say: "«El Emperador —dice el Ministro, y lo escribe—. Un título y no un nombre, pero he firmado cosas peores». Arranca la página, la dobla y te la mete en el bolsillo. «A reinar, pues. La avenida querrá a su emperador, y le mandará la factura»." },
         { say: "Antes de que cruces la avenida, la noticia ha corrido. Alguien encuentra un cajón, alguien una corona de cartón dorado de una ópera cerrada, y la avenida, que lo vende todo, te da esto gratis, que es como sabes que te va a costar. Nadie se ríe. Mañana estarás en una página nueva del mismo libro." },
         { end: true, picture: "crowned" }] },
  { id: "sign_name", match: { verb: "say" }, if: [{ "ministro.traded": true }, { "ministro.at": "$here" }, { $text: { in: NOMBRE } }],
    do: [{ say: "La pluma se detiene. «Javier —dice el Ministro, y por un momento no está vendiendo nada—. El chico de Matilde, el del tercero. Decía que aparecerías cuando costara algo». Escribe el nombre despacio, el primero de verdad que hay en el libro, y arranca la página. «La papelina es tuya. Yo no devuelvo lo que he vendido, y no doy consejos. El primer autobús a San Judas sale de la plaza. Tiene un asiento, y, con esta corbata, yo también»." },
         { say: "Nadie en la avenida te llama Emperador cuando andas hasta la parada. Dicen el otro nombre. Suena pequeño, y te encaja. Marisol, bajo su farola, levanta una mano y no dice nada. Llevas la papelina en el puño todo el camino hasta el autobús y no lo abres." },
         { end: true, picture: "named" }] },
  { id: "sign_early", match: { verb: "say" }, if: [{ "ministro.traded": false }, { "ministro.at": "$here" }, { $text: { in: [...CORONA, ...NOMBRE] } }],
    do: [{ say: "«Los nombres, después del negocio —dice el Ministro, sin acritud—. ¿Qué tienes para mí?»." }] },
  { id: "sign_drunk", match: { verb: "say" }, if: [{ "ministro.traded": true }, { "ministro.at": "$here" }, { "player.conditions": { has: "drunk" } }],
    do: [{ say: "El Ministro deja la pluma. «No puedo escribir lo que no oigo —dice—. Dilo otra vez, claro, cuando puedas»." }] },
  { id: "sign_other", match: { verb: "say" }, if: [{ "ministro.traded": true }, { "ministro.at": "$here" }],
    do: [{ say: "«Eso no lo puedo apuntar —dice el Ministro—. Un nombre es algo a lo que se te puede reclamar. Inténtalo otra vez»." }] },

  // El Ministro vende: mientras está en la sala, de vez en cuando alguien se le acerca.
  { id: "ministro_sells", when: "every", every: { turns: [3, 3] }, chance: 1, if: [{ "ministro.at": "$here" }],
    do: [{ say: [
      "Un chico con chupa de cuero se acerca al Ministro, le pone billetes en la mano y recibe un papel en un apretón. El Ministro anota en la libreta sin mirarlo.",
      "Una chica con la manga bajada le pide fiado. El Ministro pasa una página y le enseña lo que debe. Ella paga la mitad, y él apunta el resto.",
      "Un hombre de buen abrigo aparta al Ministro, y hablan bajo. El maletín se abre un palmo y se cierra. El hombre se va con la mano en el bolsillo.",
      "Alguien pide al Ministro una papelina a cuenta del libro. Él dice el nombre de la página, y la suma, y la persona se va sin ella."
    ] }] },

  // La papelina verde (fuera del hilo): fumarla es una elección. Duele en el acto, y la condición sigue doliendo hasta el remedio.
  { id: "smoke_green", match: { verb: "smoke", obj: "verde" }, if: [{ any: [{ "verde.at": "player" }, { "verde.at": "$here" }] }],
    do: [{ say: "Abres el papel sobre una tira de aluminio, lo calientas por debajo y aspiras el humo. Sabe a plástico quemado y luego a metal. La lengua se te duerme, y el zaguán se inclina." },
         { hurt: 1, says: "Un calambre te dobla por la cintura, y la boca se te llena de un sabor a monedas." },
         { move: "verde", to: null }, { start: "poisoned" }] }
];

// ---- La sala del comienzo, declarada (BRIEF.md §3) ----------------------------------------------------------------------------------------
const opening = {
  room: "callejon", hints: "radio", way: "puerta",
  intro: "Es tarde, en el callejón sin salida de detrás de El Charlie, en Prosperidad. El bajo atraviesa el ladrillo. Un charco guarda el rosa de un tubo medio muerto.\n\nDespiertas sobre un cajón con un posavasos apretado en el puño. La calle te llama Emperador. En el posavasos, con letra de Marisol: el Ministro, su ronda de bares, esta noche. Estás en su libro por cuatro papelinas de heroína, y no te vende nada con la página sin pagar. Has empezado a temblar y llevas los bolsillos vacíos.",
  lines: {
    hintFrame: "Te pones la radio al oído. En el programa de llamadas de madrugada alguien dice:"
  }
};

// ---- El conjunto de cambios -----------------------------------------------------------------------------------------------------
export default {
  because: "Un callejón sin salida detrás de un bar punk en Prosperidad, Madrid, y luego la avenida, dos bares, una lavandería y una azotea un sábado por la noche, y un camello que hace su ronda, lleva un libro de deudas y quiere una corbata negra.",
  opening,
  plan,                                   // dónde está cada sala (plan.js): las salidas se hacen de él
  facts: [
    "El jugador es Emperador, un punk de la calle en Prosperidad, Madrid, en un año sin nombre; su nombre antes era Javier Maza, del número nueve, tercero (hoy la casa tomada); la sala del comienzo es el callejón de detrás de El Charlie, al norte de la trastienda, tras la puerta de incendios.",
    "El Ministro, don Ildefonso Peláez, farmacéutico expulsado, es un camello que hace su ronda: El Charlie, la avenida, La Ópera, la avenida, la estafeta, la avenida. Vende heroína por dinero o a deber en su libro; la página del jugador está sin pagar y él no apunta una deuda sobre una deuda. Quiere una corbata negra para el entierro de su hermana Matilde.",
    "La cadena: palanca, cuerdas de bajo de la funda de guitarra, fichas de Marga, el cepillo de deshollinador de la secadora de la Lavandería, hollín de Tomás, la cinta (de Quique, el hermano de Cuco) de Marisol, la corbata negra de Cuco y la papelina del Ministro.",
    "Dos finales: el Emperador se queda con la papelina y la corona; Javier coge el primer autobús al entierro. Otra forma de acabar: la tanda verde, cuyo remedio es leche con carbón de don Nicanor.",
    "La cerveza de El Charlie es una moneda de cien pesetas y la segunda emborracha al jugador; un café en La Ópera lo espabila."
  ],
  properties: {
    "ministro.traded": { type: "boolean", start: false }   // el Ministro tiene la corbata y ha preguntado a nombre de quién escribe el recibo
  },
  effects: [
    { time: "day 1 01:00", weekday: "sat" },                 // el juego empieza a la una de la madrugada, en el callejón
    // Lo que deja entrar la puerta de incendios al abrirse (el `then` de la cerradura): las palabras de la puerta y el texto del callejón.
    { add: "change", id: "arrival", effects: [
      { set: "puerta.examine", to: "La puerta de incendios, abierta sobre su barra, con una grieta limpia de acero desnudo por el lado de las bisagras donde cedió la pintura." },
      { set: "puerta.note", to: "Abierta, sobre su barra." },
      { set: "callejon.describe", to: [
        "Un callejón sin salida detrás de El Charlie, ladrillo por tres lados: cajones, un contenedor, un charco que guarda el rosa de un tubo de neón. La mitad del tubo está muerta.",
        "Miras al sur. Al final del callejón la {puerta de incendios|puerta} está abierta sobre su barra, y el bajo sale por ella."
      ] }
    ] },
    // Borracho, tras un par de cervezas: la imagen se bambolea y se dobla, las palabras se arrastran, los pies se equivocan de camino; se pasa con el tiempo o con un café.
    { add: "condition", id: "drunk", doses: 2, lasts: { seconds: [60, 90] }, starts: "Te has emborrachado", ends: "Se te ha pasado la borrachera", status: "La cerveza se te ha subido a la cabeza",
      filters: ["sway", "ghost"], speech: { slur: true, answer: "«¿Cómo?», dicen, ante tu balbuceo." },
      movement: { chance: 0.3, says: ["Los pies te llevan por otro camino del que querías.", "Sales por un lado, y la calle te da la vuelta."] } },
    // Envenenado, tras la papelina verde: duele cada pocos turnos hasta la leche con carbón (don Nicanor), o hasta que acabe solo.
    { add: "condition", id: "poisoned", lasts: { turns: [24, 24] }, starts: "Te has envenenado", ends: "El veneno ha pasado", status: "Tienes dentro el veneno de la tanda verde",
      filters: ["tint:poison"],
      health: { every: { turns: [4, 4] }, hurt: 1, says: ["Otro calambre, y sudor frío por la espalda.", "Las manos no te paran quietas, y el corazón va demasiado deprisa y demasiado fuerte.", "El suelo sube, y te agarras a la pared."] } },
    // Verbos que necesita este mundo
    { add: "word", verb: "open", words: ["forzar", "apalancar", "hacer palanca", "palanquear"] },
    { add: "word", verb: "order", reply: "Aquí nadie sirve eso. Una moneda de cien pesetas compra una cerveza en El Charlie o un café en La Ópera, y el resto de la avenida se paga con favores y deudas." },
    { add: "word", verb: "buy", reply: "Aquí nadie sirve eso. Una moneda de cien pesetas compra una cerveza en El Charlie o un café en La Ópera, y el resto de la avenida se paga con favores y deudas." },
    { add: "word", verb: "dance", words: ["bailar", "pogear", "mover el esqueleto"], reply: "Te mueves un poco al ritmo del bajo. Nadie mira." },
    { add: "word", verb: "smoke", words: ["fumar", "chutarse", "pincharse", "esnifar"], reply: "Aquí no hay nada que fumar." },

    ...Object.entries(puzzles).map(([id, p]) => ({ add: "puzzle", id, ...p })),
    ...Object.entries(endingPictures).map(([id, p]) => ({ add: "picture", id, ...p })),
    { add: "music", ...music, levels },   // la música (music.js, compartida por los dos idiomas; sus niveles, levels.js, generados); la de cada sala, como su `music`
    ...Object.entries(rooms).map(([id, r]) => ({ add: "room", id, ...r, picture: pictures[id], ...(roomMusic[id] ? { music: roomMusic[id] } : {}) })),
    ...Object.entries(objects).map(([id, o]) => ({ add: "object", id, ...o })),
    ...rules.map((rule) => ({ add: "rule", rule }))
  ]
};
