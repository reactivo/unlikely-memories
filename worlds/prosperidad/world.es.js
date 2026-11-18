// «El emperador de la costra»: el mundo, en español. No es una traducción: está escrito como lo escribiría un autor
// de aquí. Mismos ids, mismas salas, mismas reglas y mismos finales que world.en.js; cambian las palabras. Un solo conjunto de cambios,
// todo o nada; datos llanos. Las imágenes, los sprites y la música se comparten (pictures.js, sprites.js, music.js): no llevan palabras.
// Reescrito el 2026-11-15 (extrañeza 0): ahora la historia es la caza de un camello que hace su ronda por las salas de la avenida.

import pictures, { endings } from "./pictures.js?v=0.66.0";
import music, { rooms as roomMusic } from "./music.js?v=0.66.0";
import levels from "./levels.js?v=0.66.0";
import sprites from "./sprites.js?v=0.66.0";
import plan from "./plan.js?v=0.66.0";

// ---- La biblia del juego -----------------------------------------------------------------------------------------------
export const bible = {
  title: "El emperador de la costra",
  blurb: "Prosperidad, 1985. El Emperador busca al Ministro, un camello que hace su ronda de bares, no acepta dinero y pide un favor antes que nada. Va a ser larga.",
  thumbnail: { picture: "avenida", x: 40 },   // la tarjeta de la página de inicio: la imagen de esta sala, recortada 225 píxeles desde la columna x (0-95)
  style: "flat",
  palettes: "neon: la avenida, El Charlie, la esquina, la plaza y el callejón (la noche como un resplandor suave); lamplight: las salas con bombilla o vela (la trastienda, La Ópera, la pensión, la habitación siete, la casa tomada); institution: las salas de fluorescente (la estafeta y la lavandería); moonlight: la oscuridad abierta por encima y más allá de las luces (el patio, la azotea, el terraplén); ember: la fábrica, con un solo horno encendido",
  genre: "novela picaresca",
  strangeness: "0 (pedida: nada imposible en ninguna parte; la sorpresa viene de la gente y del lugar)",
  size: "large",
  ingredient: "un catálogo de venta por correo; un deshollinador",
  discarded: [
    "reglas: un camello que vende horas de la noche; un camello que es policía; una ciudad que es gris de día por algo que debe",
    "extrañeza 0: un camello que es cura; una redada en los bares a las cuatro como final; una sobredosis trágica como moraleja",
    "sala del comienzo: una celda que se abre con una llave bajo el felpudo; una puerta que cede a un hombro en su abolladura (la primera versión); un ascensor atascado entre dos pisos"
  ],
  synopsis: "Eres el Emperador, un punk de la calle en Prosperidad, una ciudad gris de 1985 que vive de noche, y esta noche tienes una sola gestión: " +
    "dar con el Ministro, un camello que recorre cada noche las mismas salas y no acepta nunca dinero. Acepta favores, y quiere algo que " +
    "ninguna tienda te va a vender a estas horas. Así que te buscas la vida entre la avenida, las casas ocupadas, dos bares y una lavandería, " +
    "cambiando pequeños favores con la gente que sigue despierta, y descubres por el camino quién eras antes de ser el emperador de nadie.",
  stuff: "pesetas y duros, una radio de transistores sintonizada en un programa de llamadas, fichas de lavandería, el cepillo de un deshollinador y un bote de hollín, el kohl, un juego de cuerdas de bajo, " +
    "cinta americana en una batería, una pensión que alquila por horas, una estafeta de casilleros, una boa de plumas, una cuchilla y un espejo, un lazo de luto en la portería, anís, una corbata negra de seda, el primer autobús",
  tone: "Picaresco: un narrador socarrón y con hambre que le pone precio a todo y lleva la cuenta de quién debe a quién, frases cortas y rápidas con " +
    "el aguijón al final, franco con los cuerpos, el trabajo y la química y sin juzgar nunca, cariñoso con la gente, aficionado a la trapacería. " +
    "Se fija en lo que cuestan las cosas y en quién está en los portales; no suelta sermones ni sentimentalismos. El ánimo es irónico y tierno, " +
    "una noche dura para todos y graciosa de todos modos. " +
    "«La avenida vende todo dos veces: una al cliente y otra al que dice que lo vio». " +
    "«Marisol trabaja la esquina con la paciencia de un banco y los modales de una duquesa». " +
    "«En Prosperidad el color se enciende de noche, y siempre hay alguien que pasa la factura».",
  start: "Sábado, 01:00, en el callejón sin salida de detrás de El Charlie; la una y diez al cruzar su puerta de incendios.",
  rules: [
    "Prosperidad es gris de día y vive del neón de noche, y todo lo que brilla se ha pagado, con dinero o con favores.",
    "El Ministro no para quieto: hace cada noche la misma ronda, El Charlie, la avenida, La Ópera, la estafeta y otra vez la avenida, una copa en cada puerta, y no acepta dinero.",
    "En la avenida nadie da nada por nada y nadie olvida lo que le deben: un favor es una deuda con mejores modales.",
    "Pasada la medianoche cada cual va por el nombre que le puso la calle; el de los papeles es para el día y para quien te conoció de pequeño."
  ],
  opening: "Un callejón sin salida detrás de un club, la sala del comienzo, al norte de su trastienda: una radio de transistores sobre un cajón (pistas, un programa de llamadas de madrugada), la introducción, el mensaje de un posavasos sobre el Ministro (por qué has venido). La puerta de incendios del fondo está pintada contra su marco: una palanca apoyada en el contenedor la fuerza.",
  music: "un chacachá dórico nervioso, oído a través de la pared de un club; un bombo que se salta un golpe, una guitarra barata sobre un solo acorde y el silbido de un deshollinador; la radio entre dos emisoras",
  characters: ["Cuco, que lleva el sonido de El Charlie", "Pelayo, que lleva su barra", "doña Aurora, dueña y cantante de La Ópera", "Marisol, que trabaja la esquina",
    "doña Remedios, de la estafeta", "Tomás, el deshollinador", "don Nicanor, de la Pensión Esperanza", "Marga, la batería de la fábrica",
    "el Ministro, que hace su ronda"],
  endings: [
    "Emperador: cambia la corbata, da el nombre que te puso la calle y sal a que te coronen.",
    "Javier: cambia la corbata, da el nombre de los papeles y coge el primer autobús, que va a un entierro."
  ],
  chaos: 0.3
};

// Las cosas llevadas tienen sus sprites (sprites.js).
const item = (id) => ({ sprite: sprites[id], ...(sprites[id + "_floor"] ? { floorSprite: sprites[id + "_floor"] } : {}) });

// Lo que el Ministro acepta cuando pregunta a nombre de quién lo apunta (reglas sign_*), también como «soy …», «me llamo …» o «a nombre de …».
const dicho = (nombres) => nombres.flatMap(n => [n, "soy " + n, "me llamo " + n, "a nombre de " + n, "es " + n, "apunta " + n, "pon " + n]);
const CORONA = dicho(["emperador", "el emperador", "emperador de prosperidad", "el emperador de prosperidad"]);
const NOMBRE = dicho(["javier", "javier ortega", "javi"]);

// ---- Las imágenes de los finales ----------------------------------------------------------------------------------------------
// Los dibujos no llevan lenguaje (pictures.js); lo que cada uno dice a quien usa un lector de pantalla (alt) se dice aquí, en el idioma del mundo.
const endingPictures = {
  crowned: { alt: "La avenida de noche vista desde la acera de enfrente: una figura pequeña con una corona de cartón dorado está subida a un cajón en medio de la calle, con un corro de siluetas oscuras alrededor y neón en todos los escaparates.", picture: endings.crowned },
  named: { alt: "Una parada de autobús en el amanecer gris: el primer autobús con las ventanillas amarillas y, en el escalón, una figura pequeña con abrigo gris y una maleta marrón lisa, y detrás la ciudad, gris.", picture: endings.named }
};

// ---- Salas -----------------------------------------------------------------------------------------------------------
// Área "club": el callejón sin salida, la sala del comienzo, al norte de la trastienda tras su puerta de incendios; la trastienda y la sala de El Charlie. Área "calle" (x crece al este, y al sur):
// la avenida con la estafeta al este y La Ópera al oeste, la esquina al sur con la pensión al este y la lavandería al oeste, y la plaza más abajo.
// Área "casa": el portal, el patio y la azotea. Área "vias": el terraplén y la fábrica.
const rooms = {
  callejon: {
    name: "CALLEJÓN SIN SALIDA",
    describe: [
      "Ladrillo gris a los lados y una pared al fondo: la parte de atrás de El Charlie, con cajones, un contenedor y charcos que guardan el rosa de un tubo de neón. El tubo lleva desde la primavera diciendo media palabra.",
      "La única salida es la {puerta de incendios|puerta} del fondo, pintada contra su marco. El bajo atraviesa el acero como un pulso a través de una pared."
    ],
    exits: { s: "way" },
    scenery: [
      { words: ["contenedor", "basura", "basuras", "tapa"], name: "el contenedor", says: "Lleno. Lleva lleno desde antes de que el club tuviera nombre, y se guarda sus opiniones." },
      { words: ["cajones", "cajon", "cajón", "botellas", "cajas"], name: "los cajones", says: "Cajones de cerveza, vacíos, apilados por alguien con mejor memoria para la pila que para la cerveza." },
      { words: ["charcos", "charco", "agua", "rosa"], name: "los charcos", says: "Agua de lluvia del color del rótulo. En Prosperidad hasta los charcos se ponen de color de noche." },
      { words: ["tubo", "neon", "neón", "rotulo", "rótulo", "palabra"], name: "el tubo de neón", says: "Media palabra en cristal rosa, y la otra media apagada. Fuera lo que fuese lo que vendía, ya lo ha dejado." },
      { words: ["pared", "paredes", "ladrillo", "ladrillos", "pintadas", "club"], name: "las paredes", says: "Ladrillo gris, y encima, en rotulador negro, los nombres de otros que estuvieron aquí esperando también algo." }
    ],
    ambience: { lines: [
      "Detrás del ladrillo, el bajo de alguien da la vuelta y se vuelve a dormir.",
      "Un gato cruza el fondo del callejón, mira la puerta de incendios y lo piensa mejor.",
      "El tubo de neón chisporrotea. Es lo único de aquí que tiene ambiciones.",
      "Alguien se ríe al otro lado de la pared durante un buen rato y se calla de golpe, como si le hubieran dicho algo."
    ], every: [25, 60] },
    alt: "Un callejón sin salida de noche entre dos paredes de ladrillo gris: un tubo de neón rosa en la pared de la izquierda, un contenedor y cajones apilados contra el ladrillo, y una puerta de incendios de acero cerrando el fondo.",
    overlayAlt: { radio: "Una pequeña radio de transistores sobre un cajón, con la antena fuera.", palanca: "Una palanca apoyada en el contenedor." }
  },
  trastienda: {
    name: "TRASTIENDA",
    describe: [
      "La trastienda de El Charlie: cajas de amplificadores, un perchero de chaquetas de lentejuelas que dejó un grupo glam que no le gustó a nadie y un espejo rodeado de bombillas, la mitad fundidas. Una {funda de guitarra|funda} yace boca arriba en el suelo, de nadie que mire.",
      "El ruido llega por la cortina del este, todo graves y ningún agudo. La {puerta de incendios|puerta_trasera} del callejón queda al norte, abierta sobre su barra."
    ],
    exits: { e: "way", n: "way" },
    scenery: [
      { words: ["amplificadores", "amplificador", "amplis", "cajas", "altavoces"], name: "las cajas de los amplificadores", says: "Cajas negras con el nombre del club en plantilla y, debajo, el teléfono de alguien tachado dos veces." },
      { words: ["perchero", "chaquetas", "chaqueta", "lentejuelas", "abrigos"], name: "el perchero", says: "Chaquetas de lentejuelas en tallas de gente que ya no las necesita. Devuelven las bombillas en calderilla." },
      { words: ["espejo", "bombillas", "bombilla"], name: "el espejo", says: "Tienes pinta de alguien a quien le deben dinero y no piensa mencionarlo. El espejo se pone de tu parte." },
      { words: ["cortina", "terciopelo"], name: "la cortina", says: "Terciopelo negro, gris a la altura de las manos. Tiembla al compás del bombo.", leads: "e" }
    ],
    ambience: { lines: [
      "Una bombilla del espejo se apaga, y las demás se miran.",
      "Alguien en la sala aplaude, muy lejos, algo que pasó hace un minuto.",
      "El perchero se estremece con el bombo y reparte lentejuelas por el techo."
    ], every: [30, 70] },
    alt: "Una trastienda abarrotada de noche: un espejo rodeado de bombillas, un perchero de chaquetas de lentejuelas, cajas de amplificadores apiladas, una funda de guitarra en el suelo y una cortina negra a la derecha que da al bar."
  },
  charlie: {
    name: "EL CHARLIE",
    describe: [
      "El Charlie a la una: un escenario bajo, una batería sujeta con cinta americana, paredes negras de pegatinas y un suelo que se queda con tus zapatos. Ochenta punks y, en la mesa del fondo, dos cortando rayas sobre un espejo.",
      "{Cuco|cuco} lleva el sonido desde un tablón; {Pelayo|pelayo}, la barra, otro tablón más largo. La cortina queda al oeste, la calle al sur."
    ],
    exits: { w: "way", s: "way" },
    scenery: [
      { words: ["escenario", "bateria", "batería", "bombo", "cinta", "americana"], name: "el escenario", says: "A la altura de la rodilla y pegajoso. La batería es más cinta que batería, y el batería le pega como si le debiera dinero." },
      { words: ["paredes", "pared", "pegatinas", "carteles", "pintadas"], name: "las paredes", says: "Pegatinas sobre pegatinas: grupos, fiestas, un partido, un gato perdido. El negro de debajo no se ve desde 1981." },
      { words: ["punks", "gente", "publico", "público", "chavales", "cuerpos", "suelo"], name: "los punks", says: "Cuero, imperdibles, pelos de colores que cuestan más que la cerveza. Todos son hijos de alguien y han decidido no mencionarlo." },
      { words: ["mesa", "espejo", "rayas", "cuchilla", "billete", "polvo", "fondo"], name: "la mesa del fondo", says: "Un espejo, una cuchilla, un billete enrollado y dos amigos que se han puesto de acuerdo en el precio. Aquí nadie juzga; el espejo se limpia cuando acaban." },
      { words: ["mesa de sonido", "tablon", "tablón", "faders", "mezclador", "consola"], name: "la mesa de sonido", says: "Un tablón sobre dos cajones de cerveza, con una mesa de mezclas más vieja que el grupo. Tiene tres potenciómetros que funcionan y toda la opinión de Cuco sobre el mundo." },
      { words: ["entrada", "calle", "sello", "puerta"], name: "la puerta de la calle", says: "Una puerta con un punk a cada lado y un sello para el dorso de la mano. Un portero mira y otro cobra.", leads: "s" }
    ],
    ambience: { lines: [
      "El bajo te encuentra las costillas y se instala.",
      "Se alza un grito por una razón que no sobrevive a la siguiente canción.",
      "Alguien pogea solo, y bien, y nadie lo menciona.",
      "Se rompe una botella en algún lado y el grupo sigue tocando, que para eso están los grupos."
    ], every: [30, 70] },
    alt: "Un bar punk de noche: un escenario bajo con una batería a la izquierda, una mesa de sonido con un hombre de cresta doblado sobre ella, una barra larga con un barman enorme a la derecha, una mesa al fondo con un espejo y rayas blancas, y una multitud de figuras oscuras.",
    overlayAlt: { ministro: "El Ministro, de pie junto a la mesa del fondo con su abrigo de camello y su sombrero gris, un maletín de cuero en una mano." }
  },
  avenida: {
    name: "LA AVENIDA",
    describe: [
      "La avenida: una calle larga de persianas grises que, ya entrada la noche, se abren a todos los colores que cuestan dinero. El neón corre mojado por la calzada, y la acera es de quien la pisa.",
      "El frente negro de El Charlie queda al norte, con su ojo de buey encendido. La estafeta, al este, y La Ópera, al oeste. Al sur la avenida se dobla hacia la esquina."
    ],
    exits: { n: "way", e: "way", w: "way", s: "way" },
    scenery: [
      { words: ["persianas", "persiana", "escaparates", "tiendas", "locales"], name: "las persianas", says: "Medio subidas, medio bajadas, como párpados. Detrás, alguien vende algo que no figura en el rótulo." },
      { words: ["neon", "neón", "rotulos", "rótulos", "tubos", "color", "colores"], name: "el neón", says: "Rosa, cian, un rojo que se alquila por meses. Cada tubo de aquí es el alquiler de alguien." },
      { words: ["calzada", "calle", "asfalto", "bordillo", "acera"], name: "la calzada", says: "Negra y mojada, con los rótulos repetidos en ella como manchas blandas. Hace una hora que no pasa nadie por encima." },
      { words: ["club", "charlie", "frente", "ojo"], name: "El Charlie", says: "Una fachada negra que fue una sala de baile llamada el Submarino, con una ventana redonda encendida y una cola que avanza cuando le apetece.", leads: "n" },
      { words: ["gente", "portales", "portal", "figuras", "hombres", "mujeres"], name: "la gente de los portales", says: "Esperan a cubierto y vigilan la calle como tenderos. La mayoría lo son." }
    ],
    ambience: { lines: [
      "Un coche baja por la avenida a paso de tortuga, lo mira todo y no se lleva nada.",
      "Una persiana sube con ruido de tos y queda a la venta una habitación llena de rosa.",
      "Alguien se ríe en un portal, y otro alguien se detiene.",
      "Suena una radio en una ventana, una canción que casi conoces, en un tono que no es el de la calle."
    ], every: [30, 70] },
    sleep: "En la avenida, no. Alguien te vendería, y no verías el dinero.",
    alt: "La avenida de noche, mirando al norte por una calle mojada: persianas y rótulos de neón a ambos lados en rosa, cian y magenta, al fondo el frente negro de un club con una ventana redonda como un ojo de buey, y gente de pie en los portales.",
    overlayAlt: { ministro: "El Ministro, de pie en medio de la acera con su abrigo de camello y su sombrero gris, un maletín de cuero en una mano.", monedas: "Tres monedas yacen en la acera, delante de la puerta del club." }
  },
  esquina: {
    name: "LA ESQUINA",
    describe: [
      "La esquina donde se dobla la avenida, con la única farola que funciona. {Marisol|marisol} lleva once años debajo y habla de ella como otras hablan de un contrato de alquiler.",
      "La Pensión Esperanza queda al este, la Lavandería al oeste, la avenida al norte. Al sur se abre una plazuela."
    ],
    exits: { n: "way", e: "way", w: "way", s: "way" },
    scenery: [
      { words: ["farola", "poste", "luz", "globo"], name: "la farola", says: "Un poste y un globo naranja. Alumbra un círculo de acera cuyo alquiler Marisol paga con buenos modales." },
      { words: ["pension", "pensión", "esperanza", "cartel"], name: "la Pensión Esperanza", says: "Una fachada estrecha con un cartel verde: HABITACIONES POR HORAS, en letras que lo han oído todo.", leads: "e" },
      { words: ["lavanderia", "lavandería", "lavadoras", "escaparate"], name: "la Lavandería", says: "Un escaparate muy iluminado lleno de máquinas blancas, abierto toda la noche, como si alguien tuviera que quitarse la noche de encima a base de jabón.", leads: "w" },
      { words: ["acera", "bordillo", "esquina", "calle"], name: "la acera", says: "Desgastada en un punto hasta formar un óvalo pálido, del tamaño de la paciencia de una persona." },
      { words: ["coches", "coche", "trafico", "tráfico"], name: "los coches", says: "Dan la vuelta despacio, con las ventanillas bajadas y la decisión a medio tomar." }
    ],
    ambience: { lines: [
      "Un coche aminora junto al bordillo, Marisol niega con la cabeza sin volverse, y el coche acelera.",
      "Alguien tira de la cadena en la pensión y toda la esquina lo oye.",
      "La farola zumba, se atenúa y vuelve a brillar, como si se hubiera acordado del alquiler.",
      "Una mujer sale de la Lavandería con una sábana limpia al brazo y se aleja por la avenida como un fantasma con factura."
    ], every: [30, 70] },
    sleep: "En la esquina, no. Es el lugar de trabajo de alguien.",
    alt: "Una esquina de noche bajo una farola naranja: una mujer con abrigo corto junto al poste a la izquierda, una pensión de cartel verde a la derecha, el escaparate iluminado de una lavandería más allá y el color del neón sobre la calzada mojada."
  },
  estafeta: {
    name: "LA ESTAFETA",
    describe: [
      "Una oficina de correos que no cerró nunca, porque nadie le explicó cómo. Casilleros hasta el techo, un fluorescente que tartamudea y un mostrador largo donde {doña Remedios|remedios} sella cartas de gente que se ha mudado.",
      "Un saco de lona se hunde en un rincón, esperando a la furgoneta de la noche. La avenida queda al oeste."
    ],
    exits: { w: "way" },
    scenery: [
      { words: ["saco", "lona", "furgoneta", "bolsa"], name: "el saco de correo", says: "Lona con CORREOS estampado, hinchada con la correspondencia de la avenida: reclamaciones, cartas de amor y cartas de la misma letra cada semana a la misma dirección, devueltas." },
      { words: ["casilleros", "casillero", "cartas", "correo", "huecos"], name: "los casilleros", says: "Miles, y todos llenos. Nadie recoge. El correo espera a que la gente aprenda a tener dirección." },
      { words: ["mostrador", "sellos", "sello", "tampon", "tampón", "tinta"], name: "el mostrador", says: "Con cantos de latón y arañado, y en medio un tampón del color de un cardenal." },
      { words: ["fluorescente", "tubo", "luz", "techo"], name: "el fluorescente", says: "Tartamudea sobre una nota gris y larga. Debajo, todo el mundo parece un impreso." },
      { words: ["aviso", "cartel", "normas", "horario"], name: "el aviso", says: "«ABIERTO MIENTRAS HAYA CORREO. SIEMPRE HAY CORREO». Alguien ha añadido a lápiz: «MENOS PARA TI»." }
    ],
    ambience: { lines: [
      "Un sello cae sobre algo, una nota limpia y plana, como una puerta pequeña que se cierra.",
      "Un casillero escupe una carta, y doña Remedios la vuelve a archivar sin leerla.",
      "El fluorescente tartamudea, y en el hueco doña Remedios no se ha movido en absoluto."
    ], every: [30, 70] },
    alt: "Una oficina de correos de noche bajo un fluorescente: casilleros por toda la pared del fondo, un mostrador largo con una mujer robusta en rebeca detrás, a la izquierda, y un saco de correo de lona hinchado en un estante a la derecha.",
    overlayAlt: { ministro: "El Ministro, de pie al final del mostrador con su abrigo de camello y su sombrero gris, esperando su correo." }
  },
  opera: {
    name: "LA ÓPERA",
    describe: [
      "La Ópera: terciopelo rojo vuelto marrón, espejos sin dorado, un escenario diminuto bajo una lámpara de siete bombillas. Doña Aurora canta en él cada noche, desnuda de cintura para arriba bajo una boa de plumas, para hombres de buen abrigo a los que se les cerraron los teatros.",
      "{Doña Aurora|aurora} es dueña de la sala, del escenario y de las deudas, y su voz las ha sobrevivido. La avenida queda al este."
    ],
    exits: { e: "way" },
    scenery: [
      { words: ["escenario", "lampara", "lámpara", "bombillas", "boa", "plumas"], name: "el escenario", says: "Un escenario diminuto con una lámpara de siete bombillas, tres encendidas. Doña Aurora está debajo con una boa de plumas y nada más, con la dignidad de quien ha visto lo peor de la ópera y lo mejor del público." },
      { words: ["terciopelo", "cortinas", "reservados", "asientos"], name: "el terciopelo", says: "Rojo en otro tiempo, marrón ahora, con un brillo en los brazos donde mil codos han apoyado sus opiniones." },
      { words: ["espejos", "espejo", "dorado"], name: "los espejos", says: "Marcos dorados con cristal viejo, y en el cristal una sala el doble de llena y el doble de joven. Es una mentira piadosa." },
      { words: ["hombres", "parroquianos", "abrigos", "publico", "público", "caballeros"], name: "los parroquianos", says: "Hombres mayores de buen abrigo, cada uno con su copa y su asiento, escuchando con los ojos cerrados como si el aria la cantara alguien a quien quisieron." },
      { words: ["barra", "mostrador", "botellas", "anis", "anís", "vasos"], name: "la barra", says: "Una barra corta de caoba con un espejo detrás y un camarero llamado Gaspar al que nadie ha oído hablar. El anís llega en vasitos del tamaño de un dedal y cuesta del tamaño de un cubo. Una cafetera silba al fondo de la barra, y un café es una moneda." },
      { words: ["mesa", "vela", "asiento"], name: "la mesa del escenario", says: "Una mesa redonda con una vela en una botella y vistas a la puerta. No se sienta nadie que no sea esperado." }
    ],
    ambience: { lines: [
      "Doña Aurora llega a una nota alta un poco tarde y se agarra a ella como a un sombrero con viento.",
      "Un hombre de buen abrigo llora bajito, y nadie mira, y esa es la norma de la casa.",
      "La lámpara pierde una bombilla. La sala no lo menciona."
    ], every: [30, 70] },
    alt: "Un bar de terciopelo gastado de noche: un escenario diminuto bajo una lámpara de siete bombillas con una mujer con boa de plumas, desnuda de cintura para arriba, cantando, hombres mayores de buen abrigo en los reservados, un espejo dorado y, a la derecha, una mesa redonda con una vela.",
    overlayAlt: { ministro: "El Ministro, de pie junto a la mesa redonda del escenario con su abrigo de camello y su sombrero gris, un maletín de cuero en una mano." }
  },
  pension: {
    name: "PENSIÓN ESPERANZA",
    describe: [
      "El vestíbulo de una pensión que alquila por horas, por noches y, una vez, por años. Un tablero de llaves, un timbre de latón, una alfombra gastada hasta la trama en el camino hacia la escalera.",
      "{Don Nicanor|nicanor} atiende el mostrador, y un libro de registro al que llama el Libro de Horas. La {escalera|escalera_pension} sube a las habitaciones. La esquina queda al oeste."
    ],
    exits: { w: "way", u: "way" },
    scenery: [
      { words: ["mostrador", "timbre", "latón", "laton", "recepcion", "recepción"], name: "el mostrador", says: "Un mostrador barnizado con un timbre que nadie toca. A todo el que viene aquí lo esperan." },
      { words: ["llaves", "llave", "tablero", "ganchos"], name: "el tablero de llaves", says: "Doce ganchos, diez llaves. Dos ganchos tienen un nombre a lápiz debajo en vez de un número." },
      { words: ["alfombra", "trama", "pasillo"], name: "la alfombra", says: "Antes roja. Ahora, del color de una costumbre larga." },
      { words: ["libro", "libro de horas", "registro", "horas"], name: "el libro de registro", says: "El Libro de Horas, con letra de oficinista: nombres, habitaciones, duración de la estancia. Don Nicanor lo lee en voz alta cuando se siente solo." }
    ],
    ambience: { lines: [
      "Arriba, una cama contesta a una pregunta, y don Nicanor pasa una página.",
      "El timbre del mostrador suena una vez, al rozarlo una manga, y no viene nadie a ver por qué.",
      "Una pareja baja la escalera sin mirarse y sale a la avenida sin mirar nada."
    ], every: [30, 70] },
    sleep: "En el vestíbulo, no. Don Nicanor vende las camas de arriba, por horas, y el suelo no lo regala.",
    alt: "El vestíbulo estrecho de una pensión con una sola lámpara: un mostrador barnizado con un hombre delgado detrás, a la derecha, un tablero de llaves en la pared y una escalera con alfombra roja gastada a la izquierda que sube a la oscuridad."
  },
  pension_hab: {
    name: "HABITACIÓN SIETE",
    describe: [
      "La habitación siete: una cama hecha a tensión, un armario, un lavabo con la palangana rota y una ventana a un rótulo de neón, de modo que toda la habitación se pone rosa y deja de estarlo cada cuatro segundos. Está limpia, y es de alguien.",
      "Un {tarro de kohl|kohl} reposa en el lavabo, rascado hasta el fondo. En el papel de la pared, junto a la cama, hay una {pintada|pintada} de pintalabios. La escalera baja."
    ],
    exits: { d: "way" },
    scenery: [
      { words: ["cama", "manta", "sabanas", "sábanas", "almohada"], name: "la cama", says: "Hecha con tanta tensión que botaría un duro. Las sábanas están limpias, y ese es el punto." },
      { words: ["armario", "ropa", "vestidos", "vestido", "perchas"], name: "el armario", says: "Unos cuantos vestidos en perchas de alambre, cada uno una noche distinta. Al fondo, una chaqueta de hombre que nadie ha tenido el valor de devolver." },
      { words: ["palangana", "lavabo", "jarra", "agua", "espejo"], name: "el lavabo", says: "Una palangana rota, una jarra, un espejo del tamaño de una mano. Quien vive aquí se pinta la cara a tientas." },
      { words: ["ventana", "rotulo", "rótulo", "neon", "neón", "cortina"], name: "la ventana", says: "Un rótulo rosa al otro lado de la calle: HOTEL, con la O muerta. Es la única luz de la habitación y se enciende y se apaga como un pulso." }
    ],
    ambience: { lines: [
      "El rótulo de enfrente se pone rosa, luego se apaga, luego rosa, como un pulso lento.",
      "Por el suelo sube la respuesta de una cama de la habitación de abajo.",
      "El armario se asienta. La chaqueta del fondo se balancea en su percha, una vez."
    ], every: [30, 70] },
    sleep: "En la habitación de otra persona, no. Y menos sin que te hayan invitado.",
    alt: "Una pequeña habitación de pensión teñida de rosa por un rótulo de neón en la ventana: una cama hecha a tensión con una manta roja, un armario, un lavabo con palangana y un espejito, y letras de pintalabios en el papel de la pared junto a la cama."
  },
  lavanderia: {
    name: "LA LAVANDERÍA",
    describe: [
      "Una lavandería abierta toda la noche, porque el dueño está en Valencia y nadie se lo ha dicho a las máquinas. Una pared de lavadoras, un banco atornillado al suelo y, al fondo, una {secadora grande|secadora} con una ranura para fichas y un ojo de buey.",
      "Algo largo y oscuro descansa contra el cristal de la secadora, detrás de un pestillo que no suena desde hace un año. La esquina queda al este."
    ],
    exits: { e: "way" },
    scenery: [
      { words: ["lavadoras", "lavadora", "maquinas", "máquinas", "tambores", "tambor"], name: "las lavadoras", says: "Diez tambores blancos girando en diez mares pequeños. Cada uno va lleno de la semana de alguien." },
      { words: ["banco", "asiento", "tornillos"], name: "el banco", says: "Atornillado al suelo por razones que la lavandería se reserva. Buen sitio para esperar y mal sitio para que te pidan que te muevas." },
      { words: ["cartel", "aviso", "instrucciones"], name: "el cartel", says: "«SOLO FICHAS. SIN FICHAS, NO HAY LAVADO. NO NOS HACEMOS RESPONSABLES DE LO QUE SE QUEDE»." },
      { words: ["luz", "luces", "fluorescentes", "tubos"], name: "los fluorescentes", says: "Blanco frío, la luz de un sitio que quiere que te vayas pero no tiene nada en contra de que te quedes." }
    ],
    ambience: { lines: [
      "Un tambor termina su ciclo con un largo suspiro y toda la pared lo considera.",
      "Un calcetín da vueltas en la ventana de una lavadora, una y otra vez, como alguien que busca su parada.",
      "En alguna máquina cae una moneda, y nadie ha echado ninguna."
    ], every: [30, 70] },
    sleep: "En el banco, no. Las máquinas te lavarían.",
    alt: "Una lavandería de noche bajo tubos de luz blanca fría: una fila de lavadoras blancas en la pared del fondo, un banco atornillado a la izquierda y una secadora grande con una tapa redonda de cristal a la derecha, con un cepillo largo y negro apoyado contra el cristal.",
    overlayAlt: { cepillo: "El cepillo largo y negro de un deshollinador, sobre la puerta abierta de la secadora." }
  },
  plaza: {
    name: "PLAZA DEL CARBÓN",
    describe: [
      "Una plaza con una fuente seca y una sola farola de sodio, naranja en una ciudad que guarda el color para la noche. Aquí se vendió carbón. El nombre sobrevivió al carbón, como suelen los nombres.",
      "Las casas de vecinos la rodean, cada ventana de un tono, y de vez en cuando una rata cruza los adoquines, del desagüe a un portal. La esquina al norte, la casa tomada al sur, el terraplén al este."
    ],
    exits: { n: "way", s: "way", e: "way" },
    scenery: [
      { words: ["fuente", "pilon", "pilón", "seca", "pez"], name: "la fuente", says: "Un pilón de piedra con un pez de piedra de surtidor, seco desde antes de que se fueran los marineros. Alguien lo ha llenado de macetas y chapas de botella." },
      { words: ["farola", "sodio"], name: "la farola de sodio", says: "Naranja. La única luz de Prosperidad que es del mismo color todo el día, por lo que nadie se fía de ella." },
      { words: ["casas", "casa de vecinos", "ventanas", "ventana", "edificios", "colada"], name: "las casas de vecinos", says: "Seis pisos de gris y una ventana en cada piso encendida de otro color: verde con una tele, roja con una bombilla, azul con algo que nadie quiere ver." },
      { words: ["rata", "desague", "desagüe", "portal"], name: "la rata", says: "Se ha ido antes de que hayas mirado: una rata gris, un desagüe, un portal, por ese orden." },
      { words: ["casa tomada", "ocupa", "okupa"], name: "la casa tomada", says: "Una casa alta y gris con una bicicleta encadenada en el portal y una bandera en una ventana. Doce familias, algunas emparentadas.", leads: "s" },
      { words: ["terraplen", "terraplén", "via", "vía", "vias", "vías"], name: "el terraplén", says: "Un hueco entre dos casas por donde antes pasaba el tren. Al fondo, una chimenea altísima contra el cielo.", leads: "e" }
    ],
    ambience: { lines: [
      "Se abre una ventana en una casa de vecinos, llega un barreño de agua sucia y se cierra la ventana.",
      "La farola de sodio chasca al enfriarse y toda la plaza escucha.",
      "Un niño, despierto a deshoras, se sienta en la fuente seca y le cuenta algo."
    ], every: [30, 70] },
    sleep: "En la plaza, no. La farola no se apaga nunca, y los vecinos tampoco.",
    alt: "Una plaza pequeña de noche: una fuente de piedra seca con macetas dentro en el centro, una farola de sodio naranja a la derecha y casas de vecinos altas alrededor con ventanas encendidas en verde, rojo y azul."
  },
  casa: {
    name: "LA CASA TOMADA",
    describe: [
      "El portal de la casa tomada, mirando al sur: una pared de buzones, todos reventados, y una bicicleta encadenada a un radiador que dejó el edificio en 1979. En el primer escalón arde una vela, pagada por turnos.",
      "El zaguán sigue hacia el patio y su luz. La plaza queda a tu espalda, al norte."
    ],
    exits: { n: "way", s: "way" },
    scenery: [
      { words: ["buzones", "buzon", "buzón", "correo", "cartas"], name: "los buzones", says: "Cuarenta buzones con nombres en rotulador, todos reventados de folletos, multas y catálogos que nadie abrirá. En uno pone «Maza, 3.º», tachado." },
      { words: ["bicicleta", "bici", "radiador", "cadena"], name: "la bicicleta", says: "Encadenada a un radiador que dejó de calentar el edificio en 1979. La bicicleta tiene una rueda pinchada y un candado buenísimo, que es lo normal en esta ciudad." },
      { words: ["vela", "escalon", "escalón", "escalones", "turno", "turnos"], name: "la vela", says: "Un cabo en un platillo sobre el primer escalón. Un papel al lado apunta quién ha pagado la cera de esta noche, y la lista es más larga que la vela." },
      { words: ["pintadas", "lemas", "pared", "paredes", "carteles"], name: "las paredes", says: "Lemas sobre lemas y carteles sobre carteles, tantas capas que el edificio es sobre todo papel. Uno dice, en rojo: LO QUE SE VENDE NO ES TUYO." },
      { words: ["zaguan", "zaguán", "pasillo", "baldosas"], name: "el zaguán", says: "Baldosas blancas y negras, sobre todo negras. Sigue al sur, hacia la luz fría y limpia del patio." }
    ],
    ambience: { lines: [
      "Un bebé llora arriba, y alguien le canta por encima en un idioma que nadie de aquí habla.",
      "La vela se inclina con una corriente del patio.",
      "Un portazo en el tercero, y la bicicleta del zaguán suena en su cadena."
    ], every: [30, 70] },
    sleep: "En el portal, no. Hay turnos para el suelo, y tu nombre no figura en ninguno.",
    alt: "El zaguán de una casa ocupada de noche, mirando al sur: una pared de buzones reventados a la izquierda, una bicicleta encadenada a un radiador a la derecha, una vela en el primer escalón y, al fondo, un cuadrado luminoso que es el patio."
  },
  patio: {
    name: "EL PATIO",
    describe: [
      "Un patio abierto al cielo, seis pisos de cuerdas de tender y ventanas con velas. Alguien ha pintado las paredes del color de un cielo que no ve, y la lluvia se ha llevado casi todo.",
      "Una {escalera de hierro|escalera_patio} sube por la pared norte hasta el tejado. El zaguán queda al norte."
    ],
    exits: { n: "way", u: "way" },
    scenery: [
      { words: ["colada", "cuerdas", "cuerda", "sabanas", "sábanas", "ropa"], name: "la colada", says: "Sábanas, camisas y un par de pantalones enorme, tendidos con la esperanza de un sol." },
      { words: ["ventanas", "ventana", "velas", "vela", "pisos"], name: "las ventanas", says: "Velas en las ventanas, seis pisos. El edificio no tiene luz y tiene mucha claridad." },
      { words: ["paredes", "pared", "pintura"], name: "las paredes", says: "Pintadas de azul por alguien con ambición y poco presupuesto. Hay una nube en blanco, borrada con una manga." },
      { words: ["cielo", "estrellas", "estrella"], name: "el cielo", says: "Un cuadrado gris con el neón de la ciudad iluminado por debajo. Las estrellas tienen la noche libre." },
      { words: ["losas", "suelo", "charcos", "rayuela"], name: "las losas", says: "Agrietadas y verdes en las grietas. Un niño ha pintado una rayuela con tiza, hasta un número que no existe." }
    ],
    ambience: { lines: [
      "Una sábana se agita en su cuerda, y por un momento es un fantasma con buenos modales.",
      "Desde una ventana alta, una guitarra toca los mismos cuatro acordes y vuelve a aprenderlos.",
      "Empieza a llover y se lo piensa mejor."
    ], every: [30, 70] },
    sleep: "A cielo abierto, no. Lo vería toda la casa.",
    alt: "Un patio alto de noche visto desde el suelo: seis plantas de pared gris con ventanas de velas y cuerdas de tender, un trozo de cielo oscuro arriba y una escalera de hierro subiendo por la pared de la derecha."
  },
  azotea: {
    name: "LA AZOTEA",
    describe: [
      "El tejado de la casa tomada: alquitrán, antenas y una fila de chimeneas en la oscuridad como una congregación. Toda la ciudad se extiende abajo, gris de día y de color mojado ahora.",
      "{Tomás|tomas} está sentado en el caballete, negro de pies a cabeza. Lo único limpio que tiene son los blancos de los ojos. La escalera baja."
    ],
    exits: { d: "way" },
    scenery: [
      { words: ["chimeneas", "chimenea", "tubos", "fila", "congregacion", "congregación"], name: "las chimeneas", says: "Once, de ladrillo y barro, cada una con un capuchón de hollín. Solo la duodécima, lejos, en la fábrica, tira todavía." },
      { words: ["antenas", "antena", "cables", "alambres"], name: "las antenas", says: "Un bosque de perchas de alambre y ideas valientes, todas apuntando a una televisión que se mudó." },
      { words: ["ciudad", "horizonte", "luces", "color", "abajo"], name: "la ciudad", says: "Neón de todos los colores que uno puede pagarse, y detrás, si miras, el gris, esperando a la mañana." },
      { words: ["alquitran", "alquitrán", "tejado", "caballete", "tejas"], name: "el alquitrán", says: "Blando bajo los pies y tibio todavía del día. Huele a veranos viejos y a azúcar quemado." },
      { words: ["luna", "nubes", "humo"], name: "la luna", says: "Una luna baja con un velo de humo. El humo sube de las chimeneas, como antes de que a nadie se le ocurriera preguntar." }
    ],
    ambience: { lines: [
      "Una paloma se posa en una chimenea, piensa algo y se va.",
      "Tomás silba entre dientes tres notas y espera una respuesta de algún sitio.",
      "Una ráfaga sube por la pared todo el ruido de la ciudad de golpe, y lo suelta."
    ], every: [30, 70] },
    sleep: "En el caballete, no. El deshollinador tendría que bajarte en brazos.",
    alt: "Una azotea plana de noche bajo una luna baja: una fila de chimeneas como figuras oscuras a la izquierda, un deshollinador de negro con sombrero de copa sentado contra una chimenea en el primer tercio izquierdo, un horizonte de neón de colores abajo a la derecha y antenas contra el cielo."
  },
  terraplen: {
    name: "EL TERRAPLÉN",
    describe: [
      "Un terraplén de ferrocarril bajo una luna baja: balasto gris, dos raíles oxidados y un vagón en una vía muerta con el portón cegado por lemas que nadie ha leído. No pasa un tren desde hace diez años.",
      "Al este, los raíles siguen hasta la fábrica y su gran chimenea. La plaza queda al oeste."
    ],
    exits: { w: "way", e: "way" },
    scenery: [
      { words: ["railes", "raíles", "rail", "carril", "carriles", "vias", "vías", "balasto", "traviesas"], name: "los raíles", says: "Dos líneas oxidadas hasta el horizonte, y el horizonte es una fábrica. Nada ha rodado sobre ellas desde hace diez años." },
      { words: ["vagon", "vagón", "porton", "portón", "lemas", "apartadero"], name: "el vagón", says: "Un vagón de mercancías con el portón cubierto de lemas: SUELDOS, PAN, ESTO NO. Debajo, en pintura más vieja: PROSPERIDAD S.A." },
      { words: ["chimenea", "fabrica", "fábrica", "nave"], name: "la fábrica", says: "Una nave negra y, saliendo de ella, una chimenea más alta que las casas de vecinos. Es lo único de Prosperidad que es más grande que su fama." },
      { words: ["luna", "cielo", "nubes"], name: "la luna", says: "Baja y amarilla, envuelta en un velo del humo de la fábrica." },
      { words: ["farol", "senal", "señal", "semaforo", "semáforo"], name: "la señal", says: "Una señal de ferrocarril, en rojo, que lleva mucho tiempo diciendo alto a nadie." }
    ],
    ambience: { lines: [
      "Una señal chasca, roja, y sigue roja.",
      "El viento recorre el terraplén, levanta un periódico, le da vuelta a las hojas y lo suelta.",
      "En algún lugar de la fábrica una batería arranca un ritmo, lo pierde y vuelve a empezar."
    ], every: [30, 70] },
    sleep: "En el balasto, no. Los raíles están fríos, y la fábrica no.",
    alt: "Un terraplén de ferrocarril de noche bajo una luna baja: dos raíles oxidados que corren hacia el este, hacia una nave negra de fábrica en el tercio derecho con una chimenea altísima contra el cielo, y un vagón de mercancías en una vía muerta a la izquierda."
  },
  fabrica: {
    name: "LA FÁBRICA",
    describe: [
      "La vieja fábrica de Prosperidad S.A., que imprimía catálogos hasta que se acabó el dinero. Un horno sigue encendido al fondo de la nave, alimentado con palés por quien duerme aquí, y la gran chimenea se alza en medio del suelo, negra desde la base hasta el techo, el tiro alrededor del cual se levantó el edificio.",
      "{Marga|marga} está sentada a su batería junto al horno. El camino de vuelta queda al oeste, por la vía."
    ],
    exits: { w: "way" },
    scenery: [
      { words: ["horno", "fuego", "brasas", "resplandor", "parrilla", "pales", "palés"], name: "el horno", says: "Una boca de ladrillo con un ojo rojo, alimentada con palés. Es la única calefacción del grupo, y el grupo está en deuda con el horno." },
      { words: ["ceniza", "cenizas", "suelo", "hollin", "hollín", "escoria"], name: "la ceniza", says: "Tibia, gris y tan honda que se traga un zapato. Debajo, un suelo de viejas páginas de catálogo, quemadas en pliegos." },
      { words: ["maquinas", "máquinas", "imprenta", "rodillos", "cintas", "prensas"], name: "las prensas", says: "Rodillos de hierro altos como un hombre, todavía entintados en un gris que no sale de las paredes." },
      { words: ["techo", "agujero", "cielo", "nube"], name: "el techo", says: "Un gran agujero por donde sube la chimenea, y por el agujero, el humo de los palés." },
      { words: ["nave", "paredes", "pared", "ladrillos", "ladrillo"], name: "la nave", says: "Ladrillo alto como una catedral, chamuscado con la forma de una mano muy grande allí donde reventó una caldera." },
      { words: ["chimenea", "tiro", "gran chimenea"], name: "la gran chimenea", says: "Una chimenea de ladrillo ancha como una casa, que sube por la nave y sale por el techo, negra del suelo a la nube. Una compuerta de hierro a su pie lleva ochenta años sin abrirse." }
    ],
    ambience: { lines: [
      "El horno chasca y suspira, como si soltara algo que se había guardado.",
      "Un pliego de papel quemado se pone en pie sobre la ceniza con la corriente, y vuelve a tumbarse.",
      "La gran chimenea cruje de arriba abajo, una nota larga, y luego nada."
    ], every: [30, 70] },
    sleep: "En la ceniza, no. Marga dice que se queda con quien se tumba.",
    alt: "El interior de una vieja fábrica iluminado de rojo por un horno: la boca de ladrillo de un horno brillando a la izquierda, una chica junto a una batería a su lado, la gran chimenea negra subiendo por el centro de la nave hasta un agujero del techo, a la derecha, prensas de hierro y un suelo de ceniza gris."
  }
};

// ---- Objetos -----------------------------------------------------------------------------------------------------------
const objects = {
  // La sala del comienzo: las pistas, la salida (una puerta pintada contra su marco) y la palanca que la abre (BRIEF.md §3).
  radio: { at: "callejon", portable: true, material: "metal", name: "Radio", note: "Un programa de madrugada.",
    words: { nouns: ["radio", "transistor", "transistores"], adj: ["transistor", "pequeña", "vieja"], g: "f" }, ...item("radio"),
    here: "Una {radio} de transistores sobre un cajón está sintonizada en un programa de llamadas de madrugada.",
    examine: "Una radio de transistores pequeña, sujeta con esparadrapo. Está puesta en un programa donde, de noche, desconocidos llaman para darse consejos unos a otros, y algunos son buenos." },
  puerta: { at: "callejon", material: "metal", name: "Puerta de incendios", note: "Pintada contra el marco.", door: "s", locked: true,
    lock: { key: "palanca",
      says: "La puerta de incendios está pintada contra su marco. Hay una rendija por el lado de las bisagras, lo bastante ancha para el pico de algo plano y fuerte.",
      opens: "Metes el pico de la palanca en la rendija y haces fuerza. La pintura cede como hielo, la puerta de incendios se abre hacia dentro sobre su barra y el bajo sale a recibirte.",
      then: "arrival" },
    shut: "Le echas el hombro a la abolladura. La puerta de incendios ni siquiera vibra.",
    words: { nouns: ["puerta"], adj: ["incendios", "acero", "metálica", "metalica", "gris"], g: "f" },
    parts: [{ words: ["rendija", "pintura", "marco", "bisagras", "bisagra", "abolladura"], name: "la rendija", says: "Una línea negra de pintura vieja por el lado de las bisagras, y una abolladura a la altura del hombro donde otros lo han intentado." }],
    examine: "Una puerta de incendios de acero con barra y sin pomo por este lado, pintada contra su marco por una década de capas. Una abolladura a la altura del hombro dice que otros lo han intentado; una rendija por el lado de las bisagras dice que debieron traer algo." },
  palanca: { at: "callejon", portable: true, material: "metal", name: "Palanca", note: "Pesada, plana en la punta.",
    words: { nouns: ["palanca", "palanqueta", "barra"], adj: ["hierro", "oxidada", "pesada"], g: "f" }, ...item("palanca"),
    here: "Una {palanca} apoyada en el contenedor, negra de la pintura de otras puertas.",
    examine: "Una palanca oxidada, con el pico atascado de pintura de otras puertas. Lo bastante pesada para ser un argumento." },

  // Trastienda
  puerta_trasera: { at: "trastienda", material: "metal", name: "Puerta trasera", note: "Al callejón.", door: "n",
    words: { nouns: ["puerta"], adj: ["trasera", "incendios", "acero", "metálica", "metalica", "gris"], g: "f" },
    examine: "La puerta de incendios por dentro: una barra, abierta y calzada, y al otro lado los charcos rosas del callejón." },
  funda: { at: "trastienda", container: true, open: false, material: "wood", name: "Funda de guitarra", note: "Suena al inclinarla.",
    words: { nouns: ["funda"], adj: ["guitarra", "negra", "vieja"], g: "f" },
    examine: "Una funda de guitarra negra con el cierre roto, sujeta con un cinturón. Al inclinarla suena algo pequeño y abundante, y no es una guitarra." },
  cuerdas: { at: "funda", portable: true, material: "paper", name: "Cuerdas de bajo", note: "Todavía en su sobre.",
    words: { nouns: ["cuerdas", "cuerda", "sobre", "juego"], adj: ["bajo", "nuevas", "precintadas"], g: "f", pl: true }, ...item("cuerdas"),
    examine: "Un sobre de papel con cuerdas de bajo, precintado, con el nombre de un grupo a boli: NADA PERSONAL. Alguien las guardaba para una noche como esta." },

  // El Charlie
  cuco: { portrait: sprites.cuco_portrait, at: "charlie", name: "Cuco", note: "Lleva el sonido.",
    words: { nouns: ["cuco", "sonido", "técnico", "tecnico"], adj: [], proper: true, g: "m" },
    examine: "Un hombre flaco con chupa de cuero y una cresta como un trazo de pintura negra, doblado sobre una mesa de sonido con tres potenciómetros que funcionan. Tiene aire de hombre cuya música se ha ido de casa.",
    talk: "«No me pidas canciones —dice Cuco sin volverse—. Solo me queda media noche».",
    topics: {
      deck: { open: true, label: "la cinta", words: ["cinta", "casete", "cassette", "musica", "música", "mesa", "noche", "sonido"], says: "«Entre grupo y grupo pongo una cinta, siempre la misma, y esta noche es la que no es —dice Cuco—. La que es se la quedó alguien a quien no sé cómo pedírsela. El orgullo es mala tarima para bailar»." },
      marisol: { label: "Marisol", words: ["marisol", "esquina", "mujer"], says: "Algo le cruza la cara y lo guarda enseguida. «¿Marisol? En la esquina, donde siempre. Fuimos amigos. Tiene mi cinta, y no pienso pedírsela»." },
      tie: { label: "una corbata negra", words: ["corbata", "negra", "seda", "entierro", "funeral"], says: "«¿Una corbata negra?». Cuco te mira como si le hubieras pedido el hígado. «Tengo una, en el cajón de la mesa. La de mi padre, para su entierro y para el mío. De seda, por cierto. La daría por la cinta, y por nada más»." },
      dealer: { open: true, label: "el Ministro", words: ["ministro", "camello", "dealer"], says: "«¿Él? Se planta junto a la mesa del fondo cuando viene, y no mira el espejo, y los chavales que sí lo miran lo miran a él —dice Cuco—. Pregunta a Pelayo cuándo toca. Pelayo lleva el reloj»." },
      default: "«Perdona —dice Cuco, por encima del bajo—. Solo oigo lo que me llega por los cascos»."
    },
    give: "«Qué detalle —dice Cuco—. Pero esa no es mi cinta»." },
  pelayo: { portrait: sprites.pelayo_portrait, at: "charlie", name: "Pelayo", note: "Lleva la barra.",
    words: { nouns: ["pelayo", "barman", "camarero", "portero"], adj: ["grande"], proper: true, g: "m" },
    examine: "Un hombre enorme con un collar de pinchos, brazos como dos perros dormidos y un lápiz detrás de cada oreja. Sirve la cerveza como quien pone la mesa a los muertos, y no derrama nunca.",
    talk: "«¿Qué? —dice Pelayo, que es como saluda—. ¿Cerveza o ruido?».",
    topics: {
      band: { open: true, label: "el grupo", words: ["grupo", "nacho", "cuerda", "cuerdas", "fabrica", "fábrica", "bajo", "bajista"], says: "«Nada Personal están esta noche en la fábrica, ensayando con un horno —dice Pelayo—. A Nacho se le rompió una cuerda del bajo el martes y se pone borde sin ella. Hay un juego de recambio en la funda de guitarra de la trastienda, por si alguien quisiera hacerse el héroe»." },
      bar: { open: true, label: "la barra", words: ["barra", "cerveza", "copa", "precio", "fiado"], says: "«Una cerveza es una moneda —dice Pelayo—. Ni treinta pelas ni un favor: una moneda. Los chavales las pierden en la acera de ahí fuera, al entrar, y para eso están. Y no pidas fiado, que he visto tu cara en un cartel de se busca»." },
      dealer: { open: true, label: "el Ministro", words: ["ministro", "camello", "dealer", "ronda", "cuando"], says: "«Puntual como el correo —dice Pelayo—. Hace El Charlie, una cerveza, baja por la avenida a La Ópera, vuelve por la avenida a la estafeta a por su carta, otra vez la avenida y vuelta conmigo. Cuatro minutos por puerta y ni un segundo más, porque quien se queda es quien llama la atención»." },
      default: "«No es cosa mía —dice Pelayo—. Lo mío es ese vaso»."
    },
    give: "«Yo cobro en efectivo o no cobro —dice Pelayo, y te lo devuelve»." },

  // La cerveza de El Charlie: una cerveza es una moneda, y las tres monedas de la acera de la avenida se gastan una a una (`remains`: tres
  // monedas, dos monedas, una moneda; el `requires` de la cerveza es la primera). La segunda cerveza te emborracha (las `doses` de la condición).
  cerveza: { at: null, from: "pelayo", requires: "monedas", spends: true, times: 3, material: "glass", name: "Cerveza", note: "Fría, en un vaso.",
    lacking: "«Una cerveza es una moneda —dice Pelayo, y espera—. Yo no fío».",
    brought: ["Pelayo coge una moneda, tira una {cerveza} y la deja en la barra como quien pone la mesa a los muertos.", "Pelayo coge otra moneda y tira otra {cerveza}.", "Pelayo coge la última moneda, tira la última {cerveza} y te mira como quien cuenta la sala."],
    already: "«Bébete esa primero», dice Pelayo.", again: "«Son tres —dice Pelayo—. Pasadas las tres cantan, luego lloran, y luego friego yo».",
    consumable: true, starts: "drunk", drink: ["Fría y amarga, y lo primero de esta noche que ha sido tuyo.", "Más templada, y un poco más lejos del suelo.", "Baja como un reto."],
    words: { nouns: ["cerveza", "vaso", "caña", "cana"], adj: ["fria", "fría"], g: "f" },
    examine: "Un vaso de cerveza, fría, con una espuma que Pelayo ha cortado con el canto de un cuchillo." },
  // El café de La Ópera: también una moneda (las mismas que las de la cerveza), servido por la palabra de doña Aurora y las manos de Gaspar. Acaba con
  // la condición de borracho (`stops`); borracho o no, sabe a café. Un café en total (`times: 1`). Borracho se acaba también con el tiempo (el `lasts` de
  // la condición) y con un sueño de cuatro horas o más (el del motor: js/sleep.js, SOBERS), así que el mundo no escribe nada para dormir.
  cafe: { at: null, from: "aurora", requires: "monedas", spends: true, times: 1, material: "glass", name: "Café", note: "Solo, en una taza pequeña.",
    lacking: "«Un café es una moneda, cariño —dice doña Aurora entre dos compases—. A mi coro no lo pago con buenas intenciones».",
    brought: "Doña Aurora te coge la moneda de la mano sin perder el compás y hace una seña a Gaspar, que deja un {café|cafe} negro en la barra sin decir palabra.",
    already: "«Bébete ese primero, cariño», dice doña Aurora.", again: "«Con uno basta —dice doña Aurora—. Con dos te da por cantar, y yo el escenario no lo comparto».",
    consumable: true, stops: "drunk", drink: "Negro, amargo y hirviendo. Sabe a café, y al lado bueno de la noche.",
    words: { nouns: ["cafe", "café", "taza", "cafecito"], adj: ["negro", "caliente", "pequeña", "pequena"], g: "m" },
    examine: "Una taza pequeña de café negro sobre un platillo, humeante, con la desportilladura del borde vuelta con educación hacia el otro lado." },
  monedas: { at: "avenida", portable: true, material: "metal", name: "Tres monedas", note: "Una consumición cada una.", remains: "monedas_2",
    words: { nouns: ["monedas", "moneda", "dinero", "calderilla", "suelto"], adj: ["tres", "cobre"], g: "f", pl: true }, ...item("monedas"),
    here: "Tres {monedas} yacen en la acera, delante de la puerta de El Charlie, donde hace cola la gente y los bolsillos van sueltos.",
    lies: "Tres monedas yacen donde las dejaron.",
    examine: "Tres monedas de cobre, tibias del bolsillo de alguien, gastadas de tanto andar. Una moneda es una cerveza en El Charlie, o un café en La Ópera." },
  monedas_2: { at: null, portable: true, material: "metal", name: "Dos monedas", note: "Una consumición cada una.", remains: "moneda_1",
    words: { nouns: ["monedas", "moneda", "dinero", "calderilla", "suelto"], adj: ["dos", "cobre"], g: "f", pl: true }, ...item("monedas_2"),
    lies: "Dos monedas yacen donde las dejaron.", examine: "Dos monedas de cobre, gastadas. Una moneda es una cerveza en El Charlie, o un café en La Ópera." },
  moneda_1: { at: null, portable: true, material: "metal", name: "Moneda", note: "Una consumición.",
    words: { nouns: ["moneda", "dinero", "calderilla", "suelto"], adj: ["ultima", "última", "cobre"], g: "f" }, ...item("moneda_1"),
    lies: "Una moneda yace donde la dejaron.", examine: "Una moneda de cobre, gastada. Una consumición más: una cerveza en El Charlie, un café en La Ópera." },

  // El Ministro: en su ronda (las salas, por orden, un paso cada cuatro movimientos tuyos)
  ministro: { portrait: sprites.ministro_portrait, at: "opera", name: "El Ministro", note: "En su ronda.",
    rounds: { rooms: ["charlie", "avenida", "opera", "avenida", "estafeta", "avenida"], every: [4, 4] },
    arrives: ["El Ministro entra, saluda a la sala como a un auditorio de provincias y se coloca en el mejor sitio que hay.", "El Ministro llega con su maletín, su sombrero y sus cuatro minutos."],
    leaves: ["El Ministro apura su copa, se abotona el abrigo y sigue a la siguiente puerta.", "El Ministro mira un reloj que no lleva y se va."],
    words: { nouns: ["ministro", "camello", "dealer", "ildefonso"], adj: ["el", "viejo", "alto"], g: "m" }, ...item("ministro"),
    here: "{El Ministro|ministro} está aquí, con abrigo de camello y sombrero gris, un maletín de cuero en una mano y aire de quien visita las provincias.",
    examine: "Un hombre alto y delgado de sesenta años, con abrigo de camello, sombrero gris y gafas de montura dorada, y un maletín de cuero que no suelta nunca. Lleva el cuello abierto y sin corbata. Da la mano como un obispo y cuenta como un banco.",
    talk: "«Buenas noches —dice el Ministro, como a una delegación—. Tengo cuatro minutos y no los gasto nunca mal».",
    topics: {
      want: { open: true, label: "lo que acepta", words: ["acepta", "dinero", "precio", "quiere", "favor", "favores", "pago"], opens: ["tie"], says: "«El dinero es un rastro de papel, y yo no dejo papeles —dice el Ministro—. Acepto cosas. Esta noche necesito una, y es una corbata negra, buena, de seda si la ciudad da para tanto. Las tiendas están cerradas, la mía está donde no debería y no pienso ir a un entierro con el cuello abierto»." },
      coat: { open: true, label: "lo que has venido a buscar", words: ["maletin", "maletín", "mercancia", "mercancía", "papelina", "papelinas", "polvo", "buscar", "venido"], says: "«Lo que has venido a buscar está en este maletín, y seguirá en este maletín cuando tenga mi corbata —dice el Ministro—. Antes, no. No he vendido nunca a crédito y no me he arrepentido nunca»." },
      tie: { label: "la corbata", words: ["corbata", "seda", "negra", "entierro", "cuello"], opens: ["matilde"], says: "«El entierro es por la mañana. Una corbata negra, amigo mío, o me quedo en el portal —dice el Ministro—. Pregunta a los que entierran y a los que casan: siempre queda una corbata que se odia. Y tráemela en mi ronda, no a mi casa. No tengo casa»." },
      matilde: { label: "el entierro", words: ["entierro", "matilde", "hermana", "iglesia", "misa", "judas"], says: "«Mi hermana. Matilde Peláez, treinta años portera del número nueve de la calle Hierro, hoy la casa tomada —dice el Ministro—. Dio de comer a media escalera con un sueldo que no daba para un gato. Misa en San Judas, a primera hora. El primer autobús para delante, y yo estaré allí, con la corbata puesta»." },
      round: { open: true, label: "su ronda", words: ["ronda", "camina", "rondas", "donde", "dónde", "correo", "carta"], says: "«Hago El Charlie, la avenida, La Ópera, la avenida, la estafeta a por mi carta, la avenida otra vez —dice el Ministro—. Cuatro minutos por puerta. Llevo once años y no me han robado nunca, porque nadie puede prever a un hombre del todo previsible»." },
      default: "«Una pregunta agradable —dice el Ministro—, pero solo tengo cuatro minutos»."
    },
    give: "«Un detalle —dice el Ministro—, pero no. Esta noche quiero una sola cosa, y no es esa»." },

  // La avenida y la esquina
  marisol: { portrait: sprites.marisol_portrait, at: "esquina", name: "Marisol", note: "Trabaja la esquina.",
    words: { nouns: ["marisol", "mujer", "señora", "senora"], adj: [], proper: true, g: "f" },
    examine: "Una mujer con abrigo corto y buenos zapatos, el pelo recogido, la cara sin pintar y cansada. Tiene la paciencia de un banco y los modales de una duquesa, y no ha fingido nunca ser otra cosa.",
    talk: "«Buenas, Emperador —dice Marisol—. Si vienes a trabajar, trabaja en la otra acera. Si vienes a mirar, mira la farola».",
    topics: {
      work: { open: true, label: "su trabajo", words: ["trabajo", "oficio", "esquina", "farola", "precio", "clientes"], says: "«Un cuarto de hora, cien pesetas, sin besos. Once años, una farola y nadie al que haya tenido que sacar a rastras —lo dice como el horario de un tren—. Es un oficio. Nadie se avergüenza de vender pan»." },
      eyes: { open: true, label: "sus ojos", words: ["ojos", "cara", "kohl", "maquillaje", "cansada"], opens: ["tape"], says: "«Tengo mala cara porque se me ha acabado el kohl —dice—. Quince años con el mismo negro, y la tienda que lo vendía ha quebrado. El hollín de un deshollinador hace por una señora lo que no hace un tarro, y el único deshollinador que queda está en la azotea de la casa tomada»." },
      tape: { label: "la cinta", words: ["cinta", "casete", "cassette", "cuco"], says: "«La cinta de Cuco —dice, sin sonreír—. La dejó conmigo la noche que dejó de hablarme. Lleva la canción que no puede tocar ni puede dejar de tocar. Si alguien me trajera un poco de ese negro para los ojos, podría prescindir de ella»." },
      name: { label: "tu nombre", words: ["nombre", "javier", "emperador", "papeles"], says: "«Eres el Emperador desde que fuiste un chiste que alguien contó —dice—. Antes eras Javier, el del tercero, el de la tos. Doña Matilde, la portera, te daba de comer en la escalera. Nicanor lo tiene apuntado en algún sitio»." },
      dealer: { open: true, label: "el Ministro", words: ["ministro", "camello", "dealer"], says: "«¿El Ministro? No intentes comprarle. Mira el dinero como un cura mira una cuenta atrás —dice Marisol—. Acepta favores. Y va de ronda: pregunta en El Charlie, que le llevan el horario»." },
      default: "«De eso no sé, cariño —dice Marisol—, pero si lo averiguas, cuéntaselo a la farola»."
    },
    give: "«Para mí no, cariño —dice Marisol—. Yo solo cojo lo que puedo usar»." },
  hollin: { at: null, portable: true, material: "soft", name: "Bote de hollín", note: "Fino y negro.",
    words: { nouns: ["hollin", "hollín", "bote", "tarro"], adj: ["fino", "negro"], g: "m" }, ...item("hollin"),
    examine: "Un tarro de mermelada con hollín de chimenea, fino como harina y negro como un juramento. Bueno para los ojos, si conoces a las señoras, y para los pulmones de nadie." },

  // La estafeta
  remedios: { portrait: sprites.remedios_portrait, at: "estafeta", name: "Doña Remedios", note: "Lo sella todo.",
    words: { nouns: ["remedios", "dona", "doña", "empleada", "mujer"], adj: ["doña", "robusta"], proper: true, g: "f" },
    examine: "Una mujer robusta con rebeca y redecilla, un sello en cada mano y un tercero detrás de la oreja. No levanta la vista a nada que no haya archivado ya.",
    talk: "«El siguiente —dice doña Remedios, aunque no hay nadie más—. Nombre, calle, piso, por ese orden. Por ese no. Primero el piso».",
    topics: {
      post: { open: true, label: "el correo", words: ["correo", "cartas", "saco", "sello", "trabajo", "furgoneta"], says: "«Clasifico lo que llega, sello lo que sale, devuelvo lo que no tiene a quién ir —dice doña Remedios—. Nueve de cada diez son devoluciones. La gente se muda más deprisa que sus direcciones»." },
      dealer: { open: true, label: "el Ministro", words: ["ministro", "camello", "dealer", "carta", "correo"], says: "«Cada sábado una carta certificada, su pensión del Colegio de Farmacéuticos —dice doña Remedios—. El único dinero que acepta, y lo llama devolución. Firma con letra de receta. Un boticario expulsado, si quiere mi opinión, y nadie me la ha pedido»." },
      matilde: { label: "Matilde", words: ["matilde", "portera", "peláez", "pelaez", "entierro"], says: "«Treinta años de cartas de Matilde a un chico del tercero del nueve, y treinta años de devueltas con el sello de desconocido —dice doña Remedios—. Javier Maza, calle Hierro, nueve. No dejó de escribir. Yo no dejé de devolverlas. No me mires a mí: yo sello lo que viene sellado»." },
      default: "«Eso no lo puedo sellar —dice doña Remedios, y sella otra cosa»."
    },
    give: "«Yo cojo cartas y cojo sellos —dice doña Remedios—, y eso no es ninguna de las dos cosas»." },

  // La pensión
  nicanor: { portrait: sprites.nicanor_portrait, at: "pension", name: "Don Nicanor", note: "Atiende el mostrador.",
    words: { nouns: ["nicanor", "don", "casero", "recepcionista", "encargado"], adj: ["don"], proper: true, g: "m" },
    examine: "Un hombre delgado con un bigote que ha sobrevivido a dos esposas, con una rebeca del color del vestíbulo. Tiene el don de no enterarse, y lo usa como oficio.",
    talk: "«Habitaciones por horas, por noches o por años —dice don Nicanor—. Lo de los años es para quien se ha rendido. No lo recomiendo».",
    topics: {
      rooms: { open: true, label: "una habitación", words: ["habitacion", "habitación", "habitaciones", "cama", "noche", "hora", "alquiler"], says: "«Ocho pesetas la hora, treinta la noche, y sin preguntas a ninguna de las dos tarifas. La única habitación que no alquilo es la siete. Esa está ocupada, por una señora que paga el día uno»." },
      book: { open: true, opens: ["name"], label: "el Libro de Horas", words: ["libro", "registro", "horas", "nombres"], says: "«Todo nombre que se ha alojado aquí está en el Libro —dice don Nicanor—. También el tuyo. Javier Maza, número siete, 1979, tercera noche. Un bebé con tos, en una habitación sin calefacción, y una madre en el turno de noche. La portera de la calle Hierro subió una cazuela de sopa por la escalera. Lo recuerdo porque dormías mejor que tu madre»." },
      marisol: { label: "Marisol", words: ["marisol", "siete", "inquilina"], says: "«La siete es de Marisol —dice don Nicanor—. Paga el día uno y no ha dado un portazo en su vida. Si quiere ver cómo vive una señora, suba y mire. No le importa. Deja la puerta abierta»." },
      dealer: { open: true, label: "el Ministro", words: ["ministro", "camello", "dealer"], says: "«Un caballero —dice don Nicanor—. Alquiló la habitación del rincón por noches durante veinte años, hasta la noche en que dejó de hacerlo. No pregunto qué lleva un caballero en el maletín, y un caballero no me lo dice»." },
      default: "«No sabría decirle —dice don Nicanor, y anota algo en el Libro»."
    },
    give: "«Se lo agradezco, pero llevo un establecimiento muy serio —dice don Nicanor, y te lo devuelve»." },
  escalera_pension: { at: "pension", leads: "u", name: "Escalera", note: "Sube a las habitaciones.",
    words: { nouns: ["escalera", "escaleras", "peldaños", "peldanos"], adj: ["estrecha", "gastada"], g: "f" },
    examine: "Una escalera estrecha con una alfombra roja gastada, que sube a un rellano y a una fila de habitaciones con número y sin nombre." },
  kohl: { at: "pension_hab", name: "Tarro de kohl", note: "Rascado hasta el fondo.",
    words: { nouns: ["tarro", "kohl", "bote", "lápiz", "lapiz"], adj: ["kohl", "negro", "vacío", "vacio"], g: "m" },
    examine: "Un tarro redondo pequeño, rascado hasta el fondo con una uña. Ni una escama. Quien lo usa lo usa con el cuidado de quien hace cuentas." },
  pintada: { at: "pension_hab", name: "Pintada", note: "De pintalabios, en la pared.",
    words: { nouns: ["pintada", "letras", "papel", "pintalabios", "mensaje"], adj: ["pintalabios"], g: "f" },
    examine: "De pintalabios, en el papel de la pared junto a la cama, con letra grande y decidida: «CUCO. TU CINTA ESTÁ AQUÍ CUANDO VENGAS A POR ELLA TÚ MISMO». Debajo, más pequeño: «Antes, no»." },
  escalera_pension_hab: { at: "pension_hab", leads: "d", name: "Escalera", note: "De vuelta abajo.",
    words: { nouns: ["escalera", "escaleras", "peldaños", "peldanos"], adj: ["estrecha", "gastada"], g: "f" },
    examine: "La escalera baja al vestíbulo, donde un reloj no acaba de dar bien la hora." },

  // La Ópera
  aurora: { portrait: sprites.aurora_portrait, at: "opera", name: "Doña Aurora", note: "Dueña del escenario.",
    words: { nouns: ["aurora", "dona", "doña", "cantante", "mujer", "dueña", "duena"], adj: ["doña", "emplumada"], proper: true, g: "f" },
    examine: "Una mujer de cincuenta y ocho años con una mata de pelo teñido de rojo, una boa de plumas verde y nada más por encima de la cintura, que se planta como si el escenario fuera un púlpito y la sala una congregación de sus deudores. Canta como quien fue tomada en serio una vez y ha decidido tomarse así ella.",
    talk: "«Cariño —dice doña Aurora entre dos compases—, si has venido a escuchar, calla. Si has venido a beber, Gaspar es sordo».",
    topics: {
      room: { open: true, label: "la sala", words: ["sala", "bar", "ópera", "opera", "escenario", "cantar", "canta"], says: "«Hace cuarenta años esto era el café de enfrente de la ópera, y todas las coristas de la ciudad tomaban el café en esa mesa —dice doña Aurora—. La ópera es un banco ahora. Las coristas son abuelas. Yo soy la última que sigue con plumas»." },
      coffee: { open: true, label: "el café", words: ["cafe", "café", "taza", "gaspar", "maquina", "máquina", "sobrio"], says: "«Una moneda, cariño, igual que antes de que la ópera fuera un banco —dice doña Aurora—. Gaspar lo hace negro y no lo discute nunca. Ha despejado a hombres mejores que tú»." },
      dealer: { open: true, label: "el Ministro", words: ["ministro", "camello", "dealer", "mesa", "caballero"], says: "«¿Don Ildefonso? Mesa redonda, espalda a la pared, un carajillo que no acaba nunca —dice doña Aurora—. Es un caballero y lleva once años de ministro, porque visita sus circunscripciones con puntualidad. Espera un poco y llegará, a mí me da cuatro minutos»." },
      tie: { label: "una corbata negra", words: ["corbata", "negra", "seda", "entierro"], says: "«¿Una corbata negra? Anoche me pidió una, pobre hombre, con su hermana aún sin enterrar —dice doña Aurora—. Las que tengo son pajaritas y amarillas. Pregunta por los bares, cariño. Alguien habrá enterrado a alguien»." },
      matilde: { label: "Matilde", words: ["matilde", "hermana", "portera", "entierro"], says: "«Matilde Peláez, la portera de la calle Hierro nueve. No dijo nunca a nadie que tenía una hermana, hasta que fue una muerta —dice doña Aurora—. Mantuvo vivo a un chico del tercero a base de sopa, y le escribió cartas durante treinta años que no lo encontraron nunca. El Ministro lo cuenta él mismo, con su carajillo, todas las noches de esta semana»." },
      default: "«No sabría decirte, cariño —dice doña Aurora—, y me haría falta un coro para decirlo por mí»."
    },
    give: "«Qué amable —dice doña Aurora—. Pero yo solo colecciono corazones y deudas»." },

  // La lavandería
  secadora: { at: "lavanderia", name: "Secadora grande", note: "Quiere fichas.",
    words: { nouns: ["secadora", "maquina", "máquina", "ojo", "ranura"], adj: ["grande", "gran"], g: "f" },
    parts: [{ words: ["forma", "pestillo", "cristal", "tambor"], name: "la forma del tambor", says: "Algo largo y oscuro descansa contra el cristal, sujeto por el pestillo. El pestillo solo suelta al final de un ciclo pagado." }],
    examine: "Una secadora enorme y vieja con una tapa redonda de cristal y una ranura que dice FICHAS. Dentro hay algo largo y oscuro, sujeto por un pestillo que solo suelta al terminar un ciclo.",
    switch_on: "La secadora no hace nada. La ranura dice FICHAS, y lo dice como un alguacil.",
    push: "La secadora no hace nada. La ranura dice FICHAS.",
    take: "Está atornillada al suelo, y lo está desde la Guerra Civil." },
  cepillo: { at: null, portable: true, material: "wood", name: "Cepillo de deshollinador", note: "Largo, negro, rígido.",
    words: { nouns: ["cepillo", "escobillón", "escobillon"], adj: ["deshollinador", "largo", "negro"], g: "m" }, ...item("cepillo"),
    examine: "Un cepillo de deshollinador con un mango articulado, negro como el interior de una olla. En el mango, quemado con un clavo al rojo: T. H." },
  fichas: { at: null, portable: true, material: "metal", name: "Fichas de lavandería", note: "De latón, con un agujero.",
    words: { nouns: ["fichas", "ficha"], adj: ["lavandería", "lavanderia", "latón", "laton"], g: "f", pl: true }, ...item("fichas"),
    examine: "Un puñado de fichas de latón con LAVANDERÍA estampado y un agujerito en medio. Las justas para una máquina, y la máquina sabe cuántas." },

  // La cinta y la corbata
  cinta: { at: null, portable: true, material: "paper", name: "Cinta", note: "Sin etiqueta.",
    words: { nouns: ["cinta", "casete", "cassette"], adj: ["sin", "etiqueta", "barata"], g: "f" }, ...item("cinta"),
    examine: "Un casete barato sin etiqueta, solo con una huella de pulgar en algo que podría ser lápiz de ojos. Las bobinas están muy parejas, como si la cinta se hubiera guardado para algo." },
  corbata: { at: null, portable: true, material: "soft", name: "Corbata negra", note: "De seda, arrugada.",
    words: { nouns: ["corbata"], adj: ["negra", "seda", "estrecha"], g: "f" }, ...item("corbata"),
    examine: "Una corbata negra y estrecha de seda, arrugada por el medio de tanto entierro y todavía, de algún modo, lo mejor del bar." },
  papelina: { at: null, portable: true, material: "paper", name: "Papelina", note: "Doblada pequeña.",
    words: { nouns: ["papelina", "papel", "sobre", "paquetito"], adj: ["doblada", "pequeña"], g: "f" }, ...item("papelina"),
    examine: "Un cuadradito de papel doblado al tamaño de una uña, y más pesado de lo que parece. Es lo que has venido a buscar, y nadie te ha dicho qué haces con ello después." },

  // La casa tomada
  escalera_patio: { at: "patio", leads: "u", name: "Escalera", note: "Sube al tejado.",
    words: { nouns: ["escalera", "peldaños", "peldanos"], adj: ["hierro", "oxidada"], g: "f" },
    examine: "Una escalera de hierro atornillada a la pared norte, con los peldaños pulidos a la altura de las manos. Sube hacia el humo." },
  escalera_azotea: { at: "azotea", leads: "d", name: "Escalera", note: "De vuelta abajo.",
    words: { nouns: ["escalera", "peldaños", "peldanos"], adj: ["hierro", "oxidada"], g: "f" },
    examine: "La escalera por la que has subido, bajando hacia la luz de velas del patio." },
  tomas: { portrait: sprites.tomas_portrait, at: "azotea", name: "Tomás", note: "El deshollinador.",
    words: { nouns: ["tomas", "tomás", "deshollinador", "hombre"], adj: [], proper: true, g: "m" },
    examine: "Un deshollinador de pies a sombrero de copa, que también es negro, y una cara tan tiznada que cuando sonríe parece un defecto de la oscuridad. Un hueco con forma de cepillo en el cinturón marca el sitio donde estaba su cepillo.",
    talk: "«Cuidado con las chimeneas —dice Tomás—. Están tibias, y se quedan con lo que les das».",
    topics: {
      sweeping: { open: true, label: "el deshollinado", words: ["deshollinar", "deshollinado", "chimenea", "chimeneas", "trabajo", "hollin", "hollín", "oficio"], says: "«Hay once chimeneas aquí arriba y una duodécima en la fábrica que es más grande que todas —dice Tomás—. Llevo cuarenta años deshollinándolas. Quien deshollina una chimenea se queda con el hollín. Esa es toda la ley»." },
      brush: { open: true, label: "su cepillo", words: ["cepillo", "perdido", "mango"], says: "«Lo dejé en la secadora de la Lavandería el invierno pasado, en el mono —dice Tomás—. El pestillo se cerró sobre él y no tenía ficha para dar el ciclo, y el dueño está en Valencia. Un deshollinador sin cepillo es un hombre con una chimenea en la cabeza»." },
      dealer: { open: true, label: "el Ministro", words: ["ministro", "camello", "dealer"], says: "«¿Don Ildefonso? A mí me paga con amabilidad y yo le pago con hollín —dice Tomás—. Cada chimenea bajo la que se ha sentado la ha deshollinado un hombre que le debía algo. Eso es un ministro, supongo»." },
      default: "«No sé decirle —dice Tomás—. Yo solo sé de hollín»."
    },
    give: "«Eso no es mío —dice Tomás—, pero gracias»." },

  // La fábrica
  marga: { portrait: sprites.marga_portrait, at: "fabrica", name: "Marga", note: "Batería, Nada Personal.",
    words: { nouns: ["marga", "batería", "bateria", "chica"], adj: [], proper: true, g: "f" },
    examine: "Una chica de diecinueve años ante una batería hecha de dos tambores y un cubo, con el pelo negro a trasquilones, la camiseta rota y las baquetas en el cinturón como cuchillos. Te mira con la paciencia de quien ha aprendido a esperar por todo.",
    talk: "«Si vienes a decirme que baje el volumen, la respuesta es el horno —dice Marga—. Hace más ruido que yo».",
    topics: {
      band: { open: true, opens: ["strings"], label: "el grupo", words: ["grupo", "nada", "personal", "nacho", "ensayo", "bateria", "batería", "baquetas"], says: "«Nada Personal. Cuatro, y tres aquí: Nacho se ha ido a ponerse borde. Se le rompió una cuerda del bajo el martes y la tienda de música no abre hasta el lunes, y dice que sin ella no puede tocar, lo cual es mentira, pero testaruda —dice Marga»." },
      strings: { label: "las cuerdas", words: ["cuerdas", "cuerda", "bajo", "sobre", "juego"], says: "«¿Cuerdas de bajo? ¿Tienes un juego de recambio? Tráelo y te doy el fondo de la colada del grupo. Catorce fichas en una lata de café. Nacho puede lavar los calcetines el lunes, y se alegrará —dice Marga»." },
      dealer: { open: true, label: "el Ministro", words: ["ministro", "camello", "dealer"], says: "«¿El Ministro? Vino una vez a oírnos. Se quedó al fondo tres canciones, con el sombrero puesto. Dejó una propina en la lata: cien pesetas, en monedas, como un sombrero en una iglesia —dice Marga»." },
      default: "«Ni idea —dice Marga, y golpea el cubo»."
    },
    give: "«No es mío —dice Marga—. Las cuerdas, en cambio, sí las cojo»." }
};

// ---- Los puzles -----------------------------------------------------------------------------------------------------------
const puzzles = {
  // La salida de la sala del comienzo va primero (BRIEF.md §3): las primeras pistas de la radio hablan de ella.
  way_out: { where: "callejon", needs: [], solve: ["{take} palanca", "abrir puerta con palanca", "sur"], reaches: "trastienda", clues: ["puerta", "palanca"],
    hints: ["La puerta de incendios está pintada contra su marco, con una rendija por el lado de las bisagras, y algo pesado se apoya en el contenedor.", "Coge la palanca, fuerza con ella la puerta de incendios y ve al sur."] },
  take_strings: { where: "trastienda", needs: [], solve: ["abrir funda", "{take} cuerdas"], gives: ["cuerdas"], clues: ["funda", "pelayo"],
    hints: ["La funda de guitarra de la trastienda suena al inclinarla, y a un grupo le falta algo.", "Abre la funda de guitarra y coge las cuerdas de bajo."] },
  strings_for_tokens: { where: "fabrica", needs: ["cuerdas"], solve: ["dar cuerdas a marga"], gives: ["fichas"], clues: ["marga", "pelayo"],
    hints: ["Al grupo de Marga le falta una cuerda, y guardan el dinero de la colada en una lata.", "Da las cuerdas de bajo a Marga, en la fábrica, y te dará las fichas de lavandería."] },
  run_dryer: { where: "lavanderia", needs: ["fichas"], solve: ["meter fichas en secadora", "{take} cepillo"], gives: ["cepillo"], clues: ["secadora", "tomas"],
    hints: ["La secadora de la Lavandería acepta fichas, y algo largo espera detrás de su pestillo.", "Mete las fichas en la secadora y coge lo que salga."] },
  sweep_roof: { where: "azotea", needs: ["cepillo"], solve: ["dar cepillo a tomas"], gives: ["hollin"], clues: ["tomas", "cepillo", "marisol"],
    hints: ["Al deshollinador de la azotea de la casa tomada le falta su cepillo.", "Da el cepillo a Tomás, en la azotea, y deshollinará una chimenea y te dará el hollín."] },
  line_eyes: { where: "esquina", needs: ["hollin"], solve: ["dar hollin a marisol"], gives: ["cinta"], clues: ["marisol", "hollin", "kohl"],
    hints: ["El tarro de kohl de Marisol está vacío, y el hollín de deshollinador hace por los ojos lo que no hace un tarro.", "Da el hollín a Marisol, en la esquina, y te dará la cinta de Cuco."] },
  tape_for_tie: { where: "charlie", needs: ["cinta"], solve: ["dar cinta a cuco"], gives: ["corbata"], clues: ["cuco", "pintada"],
    hints: ["La cinta de Cuco está en la esquina, y él tiene la única corbata negra que necesita el Ministro.", "Da la cinta a Cuco, en El Charlie, y coge la corbata negra."] },
  corona: { where: "avenida", needs: ["corbata"], solve: ["dar corbata a ministro", "decir emperador"], ending: true, clues: ["ministro", "cuco"],
    hints: ["El Ministro no acepta dinero y quiere una corbata negra para un entierro por la mañana. Preguntará a nombre de quién lo apunta.", "Da la corbata al Ministro y dile que eres el Emperador."] },
  nombre: { where: "avenida", needs: ["corbata"], solve: ["dar corbata a ministro", "decir javier"], ending: true, clues: ["ministro", "marisol", "nicanor"],
    hints: ["Marisol y don Nicanor recuerdan un nombre que no es el de Emperador.", "Da la corbata al Ministro y dile que eres Javier."] }
};

// ---- Reglas -----------------------------------------------------------------------------------------------------------------
const rules = [
  // La secadora: las fichas dentro, el pestillo suelta.
  { id: "put_tokens", match: { verb: ["put", "use"], obj: "fichas", obj2: "secadora" }, if: [{ "player.at": "lavanderia" }], once: true,
    again: "La secadora ya ha tenido sus fichas y sigue dando vueltas, pensando.",
    do: [{ say: "Las fichas entran una a una, cada una con una notita mojada. La secadora se estremece durante un ciclo, el pestillo suena como un nudillo y la tapa cae abierta sobre un {cepillo|cepillo} largo y negro, caliente como el pan." },
         { draw: "lavanderia", remove: ["cepillo_*"] }, { move: "fichas", to: null }, { move: "cepillo", to: "lavanderia" }] },
  // Marga: cuerdas por las fichas de la colada del grupo.
  { id: "give_strings", match: { verb: ["give", "show", "use", "put"], obj: "cuerdas", obj2: "marga" }, if: [{ "player.at": "fabrica" }], once: true,
    again: "«Con un juego basta, gracias —dice Marga—. Nacho solo rompe una cada vez».",
    do: [{ say: "Marga coge el sobre como si estuviera vivo y besa una vez el nombre del grupo. Busca debajo del cubo una lata de café, vuelca catorce {fichas|fichas} de latón en la palma y te las pasa a la tuya. «Dile a Nacho que lo he hecho yo —dice—. No le digas nada más»." },
         { move: "cuerdas", to: null }, { move: "fichas", to: "player" }] },
  // El deshollinador: el cepillo de vuelta, el hollín fuera.
  { id: "give_brush", match: { verb: ["give", "show", "use", "put"], obj: "cepillo", obj2: "tomas" }, if: [{ "player.at": "azotea" }], once: true,
    again: "«Ya he deshollinado una —dice Tomás—. El bote es todo tuyo».",
    do: [{ say: "Tomás coge el cepillo como otro hombre cogería a un niño. Deshollina la chimenea más cercana, una vez, con un sonido como un suspiro largo, y sale una nube de hollín, negra como una iglesia. Llena un tarro de {hollín|hollin} sin mirar y te lo da. «Guárdalo para los ojos de una señora —dice—. Para eso sirve». El cepillo vuelve al cinturón, y el hueco se cierra." },
         { move: "cepillo", to: null }, { move: "hollin", to: "player" }] },
  // Marisol: hollín para sus ojos, y la cinta.
  { id: "give_soot", match: { verb: ["give", "show", "use", "put"], obj: "hollin", obj2: "marisol" }, if: [{ "player.at": "esquina" }], once: true,
    again: "«Con un bote me basta —dice Marisol—. No me malacostumbres».",
    do: [{ say: "Marisol coge el bote y se moja un dedo. Se traza una raya en cada ojo, un remate en la comisura, sin espejo, en cuatro segundos. Cuando se vuelve hacia la farola parece alguien que no se ha cansado nunca. «Ya —dice—. Ahora estoy abierta al público. Anda, cógela». Busca en el abrigo y saca una {cinta|cinta} con una huella en negro. «Dile que es de la esquina. No le digas nada más»." },
         { move: "hollin", to: null }, { move: "cinta", to: "player" }] },
  // Cuco: la cinta, y la corbata.
  { id: "give_tape", match: { verb: ["give", "show", "use", "put"], obj: "cinta", obj2: "cuco" }, if: [{ "player.at": "charlie" }], once: true,
    again: "«Con una me basta —dice Cuco—. Ya tengo la noche de vuelta».",
    do: [{ say: "Cuco sostiene la cinta como si quemara. La mete en un radiocasete hecho polvo bajo la mesa, y los primeros compases de algo barato y enorme salen por un altavoz, y toda la sala se desplaza un cuarto de vuelta, como si alguien se hubiera acordado de algo. No se vuelve. Abre el cajón de la mesa, saca una {corbata negra|corbata} y te la pasa sin girarse. «La de mi padre. No la manches»." },
         { move: "cinta", to: null }, { move: "corbata", to: "player" }] },
  // El Ministro: la corbata por lo que has venido a buscar, y a nombre de quién lo apunta.
  { id: "trade_tie", match: { verb: ["give", "show", "use", "put"], obj: "corbata", obj2: "ministro" }, if: [{ "ministro.traded": false }],
    do: [{ say: "El Ministro coge la corbata con dos dedos y la pasa entre ellos como un rosario. Se la pone, a oscuras, sin espejo, y el cuello abierto se cierra sobre su garganta como una puerta sobre una discusión. «Servirá —dice—. Servirá muy bien». Del maletín de cuero saca una {papelina|papelina}, doblada al tamaño de una uña, y te la deja en la palma. «Lo que has venido a buscar. Ahora el libro: yo apunto todas las operaciones, y apunto el nombre al que quiero poder reclamar. ¿A nombre de quién?»." },
         { set: "ministro.traded", to: true }, { move: "corbata", to: null }, { move: "papelina", to: "player" }] },
  { id: "sign_crown", match: { verb: "say" }, if: [{ "ministro.traded": true }, { "ministro.at": "$here" }, { $text: { in: CORONA } }],
    do: [{ say: "«El Emperador —dice el Ministro, y lo apunta—. Un título y no un nombre, pero he firmado cosas peores». Cierra el libro. «A reinar, pues. La avenida querrá a su emperador, y le mandará la factura»." },
         { say: "Antes de que cruces la avenida, la noticia ha corrido más deprisa que él. Alguien encuentra un cajón, alguien una corona de cartón dorado de una ópera cerrada hace mucho, y la avenida, que tiene todo en venta, te da esto gratis, que es como sabes que te va a costar. Nadie se ríe. El trabajo sigue." },
         { end: true, picture: "crowned" }] },
  { id: "sign_name", match: { verb: "say" }, if: [{ "ministro.traded": true }, { "ministro.at": "$here" }, { $text: { in: NOMBRE } }],
    do: [{ say: "La pluma se detiene. «Javier —dice el Ministro, y por un momento no está vendiendo nada—. El chico de Matilde, el del tercero. Decía que aparecerías cuando costara algo». Escribe el nombre despacio, el primero de verdad que hay en el libro. «Puedes quedarte con lo que tienes en la mano. Yo no devuelvo el dinero y no doy consejos. El primer autobús sale de la plaza hacia San Judas. Tiene un asiento, y yo, con la corbata puesta, otro»." },
         { say: "Nadie en la avenida te llama Emperador cuando andas hasta la parada. Dicen el otro nombre. Suena pequeño, y raro, y te sienta bien. Marisol, bajo su farola, levanta una mano y no dice nada, y llevas lo que has venido a buscar en un bolsillo y una camisa limpia en el otro." },
         { end: true, picture: "named" }] },
  { id: "sign_early", match: { verb: "say" }, if: [{ "ministro.traded": false }, { "ministro.at": "$here" }, { $text: { in: [...CORONA, ...NOMBRE] } }],
    do: [{ say: "«Los nombres, después del negocio —dice el Ministro, sin acritud—. ¿Qué tienes para mí?»." }] },
  { id: "sign_other", match: { verb: "say" }, if: [{ "ministro.traded": true }, { "ministro.at": "$here" }],
    do: [{ say: "«Eso no lo puedo apuntar —dice el Ministro—. Un nombre es algo a lo que se te puede reclamar. Inténtalo otra vez»." }] }
];

// ---- La sala del comienzo, declarada (BRIEF.md §3) ----------------------------------------------------------------------------------------
const opening = {
  room: "callejon", hints: "radio", way: "puerta",
  intro: "Eres el Emperador de Prosperidad, y esta noche el Emperador quiere algo. Lo tiene el Ministro, que hace cada noche su ronda de bares y no acepta dinero. Te lo dijo un posavasos, en mayúsculas, antes de que se lo llevara el viento. Es la una de la madrugada, y de todos modos no tienes dinero.",
  lines: {
    hintFrame: "Te pones la radio al oído. En el programa de llamadas de madrugada alguien dice:"
  }
};

// ---- El conjunto de cambios -----------------------------------------------------------------------------------------------------
export default {
  because: "Un callejón sin salida detrás de un bar punk, luego la avenida de una ciudad gris, dos bares y una lavandería en un sábado por la noche de 1985, y un camello que hace su ronda y quiere una corbata negra.",
  opening,
  plan,                                   // where every room is (plan.js): exits are made from it
  facts: [
    "El jugador es el Emperador, un punk de la avenida en Prosperidad, 1985; antes de eso se llamaba Javier (Maza, de la calle Hierro nueve, tercero); la sala del comienzo es el callejón de detrás de El Charlie, al norte de la trastienda, tras la puerta de incendios.",
    "El Ministro, don Ildefonso Peláez, es un camello que hace su ronda: El Charlie, la avenida, La Ópera, la avenida, la estafeta, la avenida; no acepta dinero. Quiere una corbata negra para el entierro de su hermana Matilde.",
    "La cadena: la palanca, las cuerdas de bajo de la funda de guitarra, las fichas de Marga, el cepillo del deshollinador de la secadora de la Lavandería, el hollín de Tomás, la cinta de Marisol, la corbata negra de Cuco y la papelina del Ministro.",
    "Dos finales: el Emperador se queda la papelina y la corona; Javier coge el primer autobús al entierro."
  ],
  properties: {
    "ministro.traded": { type: "boolean", start: false }   // el Ministro tiene la corbata y ha preguntado a nombre de quién lo apunta
  },
  effects: [
    { time: "day 1 01:00", weekday: "sat" },                 // la partida empieza a la una de la madrugada, en el callejón
    // Lo que deja entrar la puerta de incendios al abrirse (el `then` de su cerradura): la hora de la avenida, su línea y las palabras de la puerta.
    { add: "change", id: "arrival", effects: [
      { time: "day 1 01:10", weekday: "sat" },
      { set: "puerta.examine", to: "La puerta de incendios, abierta sobre su barra, con una raja limpia de acero desnudo por el lado de las bisagras donde cedió la pintura." },
      { set: "puerta.note", to: "Abierta, sobre su barra." },
      { set: "callejon.describe", to: [
        "Ladrillo gris a los lados y una pared al fondo: la parte de atrás de El Charlie, con cajones, un contenedor y charcos que guardan el rosa de un tubo de neón. El tubo lleva desde la primavera diciendo media palabra.",
        "La {puerta de incendios|puerta} del fondo está abierta sobre su barra, con una raja limpia de acero por el lado de las bisagras, y el bajo sale por ella como un pulso a través de una pared."
      ] },
      { say: "La una y diez, y toda la ciudad está pagando sus colores." }
    ] },
    // Borracho, tras un par de cervezas: la imagen se bambolea y se dobla, las palabras se arrastran, los pies toman otro camino; se pasa con el tiempo.
    { add: "condition", id: "drunk", doses: 2, lasts: { seconds: [60, 90] }, starts: "Se te sube la cerveza", ends: "Se te pasa la borrachera", status: "La cerveza se te ha subido a la cabeza",
      filters: ["sway", "ghost"], speech: { slur: true, answer: "«¿Cómo?», dicen, ante tu balbuceo." },
      movement: { chance: 0.3, says: ["Los pies te llevan por otro camino del que querías.", "Sales por un lado, y la calle te da la vuelta."] } },
    // Verbos que necesita este mundo
    { add: "word", verb: "open", words: ["forzar", "apalancar", "hacer palanca", "palanquear"] },
    { add: "word", verb: "order", reply: "Aquí nadie tiene uso para las pesetas; la avenida las olvidó. Una moneda compra una cerveza o un café, y todo lo demás esta noche se paga con favores." },
    { add: "word", verb: "buy", reply: "Aquí nadie tiene uso para las pesetas; la avenida las olvidó. Una moneda compra una cerveza o un café, y todo lo demás esta noche se paga con favores." },
    { add: "word", verb: "dance", words: ["bailar", "pogear", "mover el esqueleto"], reply: "Te mueves un poco. La avenida lo ve y no le da importancia, que es para lo que sirve bailar en la avenida." },

    ...Object.entries(puzzles).map(([id, p]) => ({ add: "puzzle", id, ...p })),
    ...Object.entries(endingPictures).map(([id, p]) => ({ add: "picture", id, ...p })),
    { add: "music", ...music, levels },   // la música (music.js, compartida por los dos idiomas; sus niveles, levels.js, generados); la de cada sala, como su `music`
    ...Object.entries(rooms).map(([id, r]) => ({ add: "room", id, ...r, picture: pictures[id], ...(roomMusic[id] ? { music: roomMusic[id] } : {}) })),
    ...Object.entries(objects).map(([id, o]) => ({ add: "object", id, ...o })),
    ...rules.map((rule) => ({ add: "rule", rule }))
  ]
};
