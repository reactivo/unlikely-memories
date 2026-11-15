// «El emperador de Prosperidad»: el mundo, en español. No es una traducción: está escrito como lo escribiría un autor
// de aquí. Mismos ids, mismas salas, mismas reglas y mismos finales que world.en.js; cambian las palabras. Un solo conjunto de cambios,
// todo o nada; datos llanos. Las imágenes, los sprites y la música se comparten (pictures.js, sprites.js, music.js): no llevan palabras.

import pictures, { endings } from "./pictures.js?v=0.55.1";
import music, { rooms as roomMusic } from "./music.js?v=0.55.1";
import levels from "./levels.js?v=0.55.1";
import sprites from "./sprites.js?v=0.55.1";

// ---- La biblia del juego -----------------------------------------------------------------------------------------------
export const bible = {
  title: "El emperador de Prosperidad",
  blurb: "Prosperidad, 1985: una ciudad gris que solo tiene color de noche. Para la avenida eres Emperador, un punk sin corona, hasta que llega un paquete a tu nombre.",
  thumbnail: { picture: "avenida", x: 40 },   // la tarjeta de la página de inicio: la imagen de esta sala, recortada 225 píxeles desde la columna x (0-95)
  style: "flat",
  palettes: "neon: la avenida, la pista del club, la esquina, la plaza y el callejón (la noche como un resplandor suave); lamplight: las salas con bombilla o vela (la trastienda, el bar, la pensión, la habitación siete, la casa tomada); institution: las salas de fluorescente (la estafeta y la lavandería); moonlight: la oscuridad abierta por encima y más allá de las luces (el patio, la azotea, el terraplén); ember: la fábrica, con un solo horno encendido",
  genre: "novela picaresca",
  strangeness: "3 (sorteado 3: la semilla es una ciudad con aire de real en un año con aire de real, pero inventada, así que se queda)",
  size: "large",
  ingredient: "un catálogo de venta por correo; un deshollinador",
  discarded: [
    "un camello que vende horas de la noche, con una cuenta atrás hasta el amanecer",
    "una redada de la policía en el club como final, y la avenida dispersándose",
    "una caída trágica en la adicción contada como advertencia, con un final triste que demuestra algo"
  ],
  synopsis: "Eres Emperador, un punk de la calle en Prosperidad, una ciudad gris de mediados de los ochenta que solo tiene color de noche, " +
    "y solo para quien puede pagarlo. Esta noche te espera en la estafeta, que no cierra nunca, un paquete de venta por correo con tu " +
    "nombre, y en una ciudad donde nadie pide nada al catálogo y nadie rechaza un paquete, te echas a la avenida, a las casas ocupadas " +
    "y al club para averiguar cuánto cuesta la entrega y quién debe a quién.",
  stuff: "pesetas y duros, una radio de transistores, fichas de lavandería, el cepillo de un deshollinador y un bote de hollín, el kohl, un sello de mano con tinta ultravioleta, " +
    "una bola de espejos, una pensión que alquila por horas, una estafeta de casilleros, persianas que se levantan ya entrada la noche, una fuente seca en la plaza del Carbón, una cinta sin etiqueta, " +
    "chaquetas de lentejuelas en un perchero, anís, un billete para el autobús de las cinco y diez",
  tone: "Picaresco: un narrador socarrón y con hambre que le pone precio a todo y lleva la cuenta de quién debe a quién, frases cortas y rápidas con " +
    "el aguijón al final, franco con los cuerpos, el trabajo y la química y sin juzgar nunca, cariñoso con la gente, aficionado a la trapacería. " +
    "Se fija en lo que cuestan las cosas y en quién está en los portales; no suelta sermones ni sentimentalismos. El ánimo es irónico y tierno, " +
    "una noche dura para todos y graciosa de todos modos. " +
    "«La avenida vende todo dos veces: una al cliente y otra al que dice que lo vio». " +
    "«Marisol trabaja la esquina con la paciencia de un banco y los modales de una duquesa». " +
    "«En Prosperidad el color se enciende de noche, y siempre hay alguien que pasa la factura».",
  start: "Sábado, 01:00, en el callejón sin salida de detrás del Submarino; la una y diez al cruzar su puerta de incendios.",
  rules: [
    "Prosperidad es gris de día y solo tiene color de noche, y todo lo que brilla se ha pagado.",
    "Las máquinas de la lavandería devuelven lo que te falta, limpio y equivocado.",
    "El catálogo entrega a quien nombra; nadie le ha pedido nunca nada, y nadie ha rechazado nunca un paquete.",
    "Las chimeneas guardan el gris de la ciudad, y quien deshollina una se queda con el hollín."
  ],
  opening: "Un callejón sin salida detrás de un club, la sala del comienzo, al sur de su trastienda: una radio de transistores sobre un cajón (pistas), una página de catálogo arrancada que ya llevas (por qué has venido). La puerta de incendios del fondo es la salida: cede con un hombro en su abolladura, o a una llamada.",
  music: "un chacachá dórico nervioso, oído a través de la pared de un club; un bombo que se salta un golpe, una guitarra barata sobre un solo acorde y el silbido de un deshollinador; la radio entre dos emisoras",
  characters: ["Cuco, el pinchadiscos del Submarino", "Marisol, que trabaja la esquina", "Doña Remedios, de la estafeta", "Tomás, el deshollinador",
    "Don Nicanor, de la Pensión Esperanza", "la boticaria, de Los Galgos"],
  endings: [
    "Coronado: paga el paquete y fírmalo como Emperador.",
    "Con nombre: paga el paquete y fírmalo con el nombre que te puso tu madre, y coge el autobús de las cinco y diez.",
    "Color: sube el cepillo del deshollinador por la gran chimenea de la fábrica."
  ],
  chaos: 0.3
};

// Las cosas llevadas tienen sus sprites (sprites.js).
const item = (id) => ({ sprite: sprites[id], ...(sprites[id + "_floor"] ? { floorSprite: sprites[id + "_floor"] } : {}) });

// Lo que la estafeta acepta cuando pregunta a nombre de quién se firma (reglas sign_*), también como «soy …», «me llamo …» o «a nombre de …».
const dicho = (nombres) => nombres.flatMap(n => [n, "soy " + n, "me llamo " + n, "a nombre de " + n, "es " + n, "firma " + n, "firmo " + n]);
const CORONA = dicho(["emperador", "el emperador", "emperador de prosperidad"]);
const NOMBRE = dicho(["dani"]);

// ---- Las imágenes de los finales ----------------------------------------------------------------------------------------------
// Los dibujos no llevan lenguaje (pictures.js); lo que cada uno dice a quien usa un lector de pantalla (alt) se dice aquí, en el idioma del mundo.
const endingPictures = {
  crowned: { alt: "La avenida de noche vista desde la acera de enfrente: una figura pequeña con una corona de papel dorado está subida a un cajón en medio de la calle, con un corro de siluetas oscuras alrededor y neón en todos los escaparates.", picture: endings.crowned },
  named: { alt: "Una parada de autobús en el amanecer gris: un autobús nocturno con las ventanillas amarillas y, en el escalón, una figura pequeña con una maleta lisa, y detrás la ciudad, gris.", picture: endings.named },
  colour: { alt: "La gran chimenea de la fábrica vista desde el terraplén por la mañana, con el hollín deshaciéndose en una nube gris por arriba, y debajo toda la ciudad volviéndose amarilla, roja y verde.", picture: endings.colour }
};

// ---- Salas -----------------------------------------------------------------------------------------------------------
// Área "club": el callejón sin salida, la sala del comienzo, al sur de la trastienda tras su puerta de incendios; la trastienda y la pista. Área "calle" (x crece al este, y al sur):
// la avenida con la estafeta al este y Los Galgos al oeste, la esquina al sur con la pensión al este y la lavandería al oeste, y la plaza más abajo.
// Área "casa": el portal, el patio y la azotea. Área "vias": el terraplén y la fábrica.
const rooms = {
  callejon: {
    name: "CALLEJÓN SIN SALIDA", area: "club", at: [0, 1, 0],
    describe: [
      "Ladrillo gris a los lados y una pared al fondo: la parte de atrás de un club, con cajones, un contenedor y charcos que guardan el rosa de un tubo de neón. El tubo lleva desde la primavera diciendo media palabra.",
      "La única salida es la {puerta de incendios|puerta}, al final. No tiene pomo por este lado, solo una barra y una abolladura donde otros han llamado."
    ],
    exits: { n: { to: "trastienda", if: false, closed: "La puerta de incendios no se mueve con la mano. Tiene una abolladura a la altura del hombro donde otros han llamado más fuerte." } },
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
      "Una lluvia que aún no ha caído se decide sobre la tapa del contenedor."
    ], every: [25, 60] },
    alt: "Un callejón sin salida de noche entre dos paredes de ladrillo gris: un tubo de neón rosa en la pared de la izquierda, un contenedor y cajones apilados contra el ladrillo, y una puerta de incendios de acero cerrando el fondo.",
    overlayAlt: { radio: "Una pequeña radio de transistores sobre un cajón, con la antena fuera." }
  },
  trastienda: {
    name: "TRASTIENDA", area: "club", at: [0, 0, 0],
    describe: [
      "La trastienda del Submarino: cajas de amplificadores, un perchero de chaquetas de lentejuelas y un espejo rodeado de bombillas, la mitad fundidas. Una {funda de guitarra|funda} yace boca arriba en el suelo, de nadie que mire.",
      "El ritmo llega por la cortina del este, con los graves subidos y los agudos mirando para otro lado. La {puerta de incendios|puerta_trasera} del callejón queda al sur, abierta sobre su barra."
    ],
    exits: { e: "pista", s: "callejon" },
    scenery: [
      { words: ["amplificadores", "amplificador", "amplis", "cajas", "altavoces"], name: "las cajas de los amplificadores", says: "Cajas negras con el nombre del club en plantilla y, debajo, el teléfono de alguien tachado dos veces." },
      { words: ["perchero", "chaquetas", "chaqueta", "lentejuelas", "abrigos"], name: "el perchero", says: "Chaquetas de lentejuelas en tallas de gente que ya no las necesita. Devuelven las bombillas en calderilla." },
      { words: ["espejo", "bombillas", "bombilla"], name: "el espejo", says: "Tienes pinta de alguien a quien le deben dinero y no piensa mencionarlo. El espejo se pone de tu parte." },
      { words: ["cortina", "terciopelo"], name: "la cortina", says: "Terciopelo negro, gris a la altura de las manos. Respira al compás del bombo.", leads: "e" }
    ],
    ambience: { lines: [
      "Una bombilla del espejo se apaga, y las demás se miran.",
      "Alguien en la pista aplaude, muy lejos, algo que pasó hace un minuto.",
      "El perchero se estremece con el bombo y reparte lentejuelas por el techo."
    ], every: [30, 70] },
    alt: "Una trastienda abarrotada de noche: un espejo rodeado de bombillas, un perchero de chaquetas de lentejuelas, cajas de amplificadores apiladas, una funda de guitarra en el suelo y una cortina negra a la derecha que da al club."
  },
  pista: {
    name: "LA SUBMARINO", area: "club", at: [1, 0, 0],
    describe: [
      "El Submarino a la una de la madrugada: techo bajo y negro, una bola de espejos que convierte el gris en rosa y unas trescientas personas que han acordado no mirar el reloj. Una bailarina, desnuda de cintura para arriba, trabaja la tarima como quien cumple un turno.",
      "{Cuco|cuco} lleva la cabina, con un plato menos de los que necesita la noche. La cortina de la trastienda queda al oeste. La salida a la calle, al sur."
    ],
    exits: { w: "trastienda", s: "avenida" },
    scenery: [
      { words: ["bailarina", "tarima", "baile", "bailando"], name: "la bailarina", says: "Desnuda de cintura para arriba y tan tranquila, una mujer con la postura de un metrónomo y cara de ir contando el aforo." },
      { words: ["bola", "espejos", "techo"], name: "la bola de espejos", says: "Le faltan la mitad de los espejos. Los que quedan echan rosa sobre la gente, y la gente lo agradece." },
      { words: ["gente", "publico", "público", "pista", "cuerpos", "bailarines"], name: "la gente", says: "Punks, marineros de permiso de una ciudad sin mar, parejas que no son pareja. Todo el mundo ha pagado, de un modo u otro." },
      { words: ["cabina", "platos", "plato", "tocadiscos", "discos"], name: "la cabina", says: "Una caja de contrachapado y dos tocadiscos. Uno de ellos calla de una manera que le cuesta algo a alguien." },
      { words: ["salida", "calle", "sello", "sellos", "cuerda"], name: "la salida a la calle", says: "Una cuerda de terciopelo y un sello de mano con tinta que brilla. Todo el que sale lleva en el dorso un fantasma azul.", leads: "s" }
    ],
    ambience: { lines: [
      "El bajo te encuentra las costillas y se instala.",
      "Se alza un grito por una razón que no sobrevive a la siguiente canción.",
      "Alguien baila solo, y bien, y nadie lo menciona.",
      "La bola de espejos te echa una moneda rosa en la mano y te la quita."
    ], every: [30, 70] },
    alt: "La pista de baile de un club de noche: una bola de espejos sobre una multitud de siluetas oscuras, una bailarina con el torso desnudo en una tarima a la izquierda y un pinchadiscos en una cabina de contrachapado a la derecha, con luz magenta y cian sobre todo.",
  },
  avenida: {
    name: "LA AVENIDA", area: "calle", at: [0, 0, 0],
    describe: [
      "La avenida: una calle larga de persianas grises que, ya entrada la noche, se abren a todos los colores que cuestan dinero. El neón corre mojado por la calzada, y la acera es de quien la pisa.",
      "El frente negro del Submarino queda al norte. La estafeta, al este, y el bar Los Galgos, al oeste. Al sur la avenida se dobla hacia la esquina."
    ],
    exits: { n: "pista", e: "estafeta", w: "bar", s: "esquina" },
    scenery: [
      { words: ["persianas", "persiana", "escaparates", "tiendas", "locales"], name: "las persianas", says: "Medio subidas, medio bajadas, como párpados. Detrás, alguien vende algo que no figura en el rótulo." },
      { words: ["neon", "neón", "rotulos", "rótulos", "tubos", "color", "colores"], name: "el neón", says: "Rosa, cian, un rojo que se alquila por meses. Cada tubo de aquí es el alquiler de alguien." },
      { words: ["calzada", "calle", "asfalto", "bordillo", "acera"], name: "la calzada", says: "Negra y mojada, con los rótulos repetidos en ella como manchas blandas. Hace una hora que no pasa nadie por encima." },
      { words: ["club", "submarino", "frente", "ojo"], name: "el Submarino", says: "Una fachada negra con una ventana redonda como un ojo de buey y una cola que avanza cuando le apetece.", leads: "n" },
      { words: ["gente", "portales", "portal", "figuras", "hombres", "mujeres"], name: "la gente de los portales", says: "Esperan a cubierto y vigilan la calle como tenderos. La mayoría lo son." }
    ],
    ambience: { lines: [
      "Un coche baja por la avenida a paso de tortuga, lo mira todo y no se lleva nada.",
      "Una persiana sube con ruido de tos y queda a la venta una habitación llena de rosa.",
      "Alguien se ríe en un portal, y otro alguien se detiene.",
      "Suena una radio en una ventana, una canción que casi conoces, en un tono que no es el de la calle."
    ], every: [30, 70] },
    sleep: "En la avenida, no. Alguien te vendería, y no verías el dinero.",
    alt: "La avenida de noche, mirando al norte por una calle mojada: persianas y rótulos de neón a ambos lados en rosa, cian y magenta, al fondo el frente negro de un club con una ventana redonda como un ojo de buey, y gente de pie en los portales."
  },
  esquina: {
    name: "LA ESQUINA", area: "calle", at: [0, 1, 0],
    describe: [
      "La esquina donde se dobla la avenida, con la única farola que funciona. {Marisol|marisol} lleva once años debajo y habla de ella como otras hablan de un contrato de alquiler.",
      "La Pensión Esperanza queda al este, la Lavandería al oeste, la avenida al norte. Al sur se abre una plazuela."
    ],
    exits: { n: "avenida", e: "pension", w: "lavanderia", s: "plaza" },
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
    name: "LA ESTAFETA", area: "calle", at: [1, 0, 0],
    describe: [
      "Una oficina de correos que no cerró nunca, porque nadie le explicó cómo. Casilleros hasta el techo, un fluorescente que tartamudea y un mostrador largo donde {doña Remedios|remedios} sella cosas que todavía no se han enviado.",
      "En el estante de detrás, un paquete marrón espera, dirigido a Emperador. La avenida queda al oeste."
    ],
    exits: { w: "avenida" },
    scenery: [
      { words: ["paquete", "bulto", "caja", "etiqueta"], name: "el paquete", says: "Un paquete marrón con cuerda y lacre, y una etiqueta con tu nombre en una letra que nunca te ha conocido. Doña Remedios lo guarda para quien pague." },
      { words: ["casilleros", "casillero", "cartas", "correo", "huecos"], name: "los casilleros", says: "Miles, y todos llenos. Nadie recoge. El correo espera a que la gente aprenda a tener dirección." },
      { words: ["mostrador", "sellos", "sello", "tampon", "tampón", "tinta"], name: "el mostrador", says: "Con cantos de latón y arañado, y en medio un tampón del color de un cardenal." },
      { words: ["fluorescente", "tubo", "luz", "techo"], name: "el fluorescente", says: "Tartamudea sobre una nota gris y larga. Debajo, todo el mundo parece un impreso." },
      { words: ["aviso", "cartel", "normas", "reglas"], name: "el aviso", says: "«ENTREGAS CONTRA PAGO. SIN PAGO, NO HAY FIRMA. SIN NOMBRE, NO HAY PAQUETE». Alguien ha añadido a lápiz: «EN SERIO»." }
    ],
    ambience: { lines: [
      "Un sello cae sobre algo, una nota limpia y plana, como una puerta pequeña que se cierra.",
      "Un casillero escupe una carta, y doña Remedios la vuelve a archivar sin leerla.",
      "El fluorescente tartamudea, y en el hueco el paquete del estante se ha movido un dedo, y vuelve."
    ], every: [30, 70] },
    alt: "Una oficina de correos de noche bajo un fluorescente: casilleros por toda la pared del fondo, un mostrador largo con una mujer robusta en rebeca detrás, a la izquierda, y un paquete marrón atado con cuerda en un estante a la derecha."
  },
  bar: {
    name: "LOS GALGOS", area: "calle", at: [-1, 0, 0],
    describe: [
      "Los Galgos: una barra de cinc, una máquina de discos con una sola canción dentro y olor a anís y a abrigos mojados. Los parroquianos se apoyan en fila como galgos en sus cajones de salida, que es todo el chiste del nombre.",
      "{La boticaria|boticaria} ocupa el taburete del fondo con una bolsita de cuero y despacha con voz de quien vende aspirinas. La avenida queda al este."
    ],
    exits: { e: "avenida" },
    scenery: [
      { words: ["barra", "cinc", "mostrador", "camarero", "vasos", "anis", "anís"], name: "la barra", says: "Cinc abollado por un siglo de codos y un aniversario. El anís llega en vasitos del tamaño de un dedal y cuesta del tamaño de un cubo." },
      { words: ["maquina", "máquina", "discos", "cancion", "canción", "musica", "música"], name: "la máquina de discos", says: "Una sola canción, una y otra vez, sobre una chica que siempre está en el próximo tren. Los parroquianos la conocen a todas." },
      { words: ["parroquianos", "galgos", "hombres", "bebedores", "taburetes"], name: "los parroquianos", says: "Una fila de espaldas con anorak, cada una con su vaso y su agravio, nunca el mismo dos veces seguidas." },
      { words: ["bolsa", "bolsita", "papelinas", "papeles", "papel", "polvo", "pastillas"], name: "la bolsita de cuero", says: "Papelinas cuadradas, dobladas con cuidado, y unos cuantos frascos marrones. El negocio es tranquilo, regular y nunca es el primer tema." },
      { words: ["rotulo", "rótulo", "cartel", "cerveza"], name: "el rótulo de cerveza", says: "Una botella de neón verde, medio encendida. Le pone a todo el mundo cara de haber oído ya la noticia." }
    ],
    ambience: { lines: [
      "La máquina empieza la misma canción por cuarta vez y los parroquianos suspiran a coro.",
      "Alguien deja un vaso en la barra con el cuidado de quien deja una discusión.",
      "La boticaria apunta una cifra en una servilleta de papel y la dobla hasta hacerla muy pequeña."
    ], every: [30, 70] },
    alt: "Un bar con humo de noche: una barra de cinc al fondo, una fila de espaldas con anorak en taburetes a la izquierda, una máquina de discos encendida en la esquina y una mujer con una bolsita de cuero en el taburete del fondo, a la derecha."
  },
  pension: {
    name: "PENSIÓN ESPERANZA", area: "calle", at: [1, 1, 0],
    describe: [
      "El vestíbulo de una pensión que alquila por horas, por noches y, una vez, por años. Un tablero de llaves, un timbre de latón, una alfombra gastada hasta la trama en el camino hacia la escalera.",
      "{Don Nicanor|nicanor} atiende el mostrador, y un libro de registro al que llama el Libro de Horas. La {escalera|escalera_pension} sube a las habitaciones. La esquina queda al oeste."
    ],
    exits: { w: "esquina", u: "pension_hab" },
    scenery: [
      { words: ["mostrador", "timbre", "latón", "laton", "recepcion", "recepción"], name: "el mostrador", says: "Un mostrador barnizado con un timbre que nadie toca. A todo el que viene aquí lo esperan." },
      { words: ["llaves", "llave", "tablero", "ganchos"], name: "el tablero de llaves", says: "Doce ganchos, diez llaves. Dos ganchos tienen un nombre a lápiz debajo en vez de un número." },
      { words: ["alfombra", "trama", "pasillo"], name: "la alfombra", says: "Antes roja. Ahora, del color de una costumbre larga." },
      { words: ["libro", "libro de horas", "registro", "horas"], name: "el libro de registro", says: "El Libro de Horas, con letra de oficinista: nombres, habitaciones, duración de la estancia. Don Nicanor lo lee en voz alta cuando se siente solo." }
    ],
    ambience: { lines: [
      "Arriba, una cama contesta a una pregunta, y don Nicanor pasa una página.",
      "El timbre del mostrador suena una vez, sin que nadie lo toque, y no viene nadie a ver por qué.",
      "Una pareja baja la escalera sin mirarse y sale a la avenida sin mirar nada."
    ], every: [30, 70] },
    sleep: "En el vestíbulo, no. Don Nicanor vende las camas de arriba, por horas, y el suelo no lo regala.",
    alt: "El vestíbulo estrecho de una pensión con una sola lámpara: un mostrador barnizado con un hombre delgado detrás, a la derecha, un tablero de llaves en la pared y una escalera con alfombra roja gastada a la izquierda que sube a la oscuridad."
  },
  pension_hab: {
    name: "HABITACIÓN SIETE", area: "calle", at: [1, 1, 1],
    describe: [
      "La habitación siete: una cama hecha a tensión, un armario, un lavabo con la palangana rota y una ventana a un rótulo de neón, de modo que toda la habitación se pone rosa y deja de estarlo cada cuatro segundos. Está limpia, y es de alguien.",
      "Un {tarro de kohl|kohl} reposa en el lavabo, rascado hasta el fondo. En el papel de la pared, junto a la cama, hay una {pintada|pintada} de pintalabios. La escalera baja."
    ],
    exits: { d: "pension" },
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
    name: "LA LAVANDERÍA", area: "calle", at: [-1, 1, 0],
    describe: [
      "Una lavandería abierta toda la noche, porque las máquinas no duermen y nadie se atreve a decírselo. Una pared de lavadoras, un banco atornillado al suelo y, al fondo, una {secadora grande|secadora} con una ranura para fichas y un ojo de buey por ventana.",
      "Lo que se mete en las máquinas sale limpio, y a veces sale convertido en otra cosa: el cartel no dice nada de eso. La esquina queda al este."
    ],
    exits: { e: "esquina" },
    scenery: [
      { words: ["lavadoras", "lavadora", "maquinas", "máquinas", "tambores", "tambor"], name: "las lavadoras", says: "Diez tambores blancos girando en diez mares pequeños. Cada uno va lleno de la semana de alguien." },
      { words: ["banco", "asiento", "tornillos"], name: "el banco", says: "Atornillado al suelo por razones que la lavandería se reserva. Buen sitio para esperar y mal sitio para que te pidan que te muevas." },
      { words: ["cartel", "aviso", "instrucciones", "ranura"], name: "el cartel", says: "«SOLO FICHAS. SIN FICHAS, NO HAY LAVADO. NO NOS HACEMOS RESPONSABLES DE LO QUE VUELVA»." },
      { words: ["ojo", "ventanilla", "cristal", "escotilla"], name: "el ojo de buey", says: "Un cristal redondo en la tapa de la secadora. Dentro, algo da vueltas despacio, y no es ropa." },
      { words: ["luz", "luces", "fluorescentes", "tubos"], name: "los fluorescentes", says: "Blanco frío, la luz de un sitio que quiere que te vayas pero no tiene nada en contra de que te quedes." }
    ],
    ambience: { lines: [
      "Un tambor termina su ciclo con un largo suspiro y toda la pared lo considera.",
      "La secadora da vueltas a algo en su ventana y lo llama por un nombre que casi se te escapa.",
      "Un calcetín pasa por el ojo de buey y la secadora se ve orgullosa."
    ], every: [30, 70] },
    sleep: "En el banco, no. Las máquinas te lavarían.",
    alt: "Una lavandería de noche bajo tubos de luz blanca fría: una fila de lavadoras blancas en la pared del fondo, un banco atornillado a la izquierda y una secadora grande con una tapa redonda de cristal a la derecha."
  },
  plaza: {
    name: "PLAZA DEL CARBÓN", area: "calle", at: [0, 2, 0],
    describe: [
      "Una plaza con una fuente seca y una sola farola de sodio, naranja en una ciudad que gasta el color de noche. Aquí se vendió carbón. El nombre sobrevivió al carbón, como suelen los nombres.",
      "Las casas de vecinos la rodean, cada ventana de un tono distinto. La esquina queda al norte; a tu espalda, al sur, el portal de la casa tomada, y al este, el terraplén."
    ],
    exits: { n: "esquina", s: "casa", e: "terraplen" },
    scenery: [
      { words: ["fuente", "pilon", "pilón", "seca"], name: "la fuente", says: "Un pilón de piedra con un pez muerto de surtidor, seco desde antes de que se fueran los marineros. Alguien lo ha llenado de macetas y chapas de botella." },
      { words: ["farola", "sodio"], name: "la farola de sodio", says: "Naranja. La única luz de Prosperidad que es del mismo color todo el día, por lo que nadie se fía de ella." },
      { words: ["casas", "casa de vecinos", "ventanas", "ventana", "edificios", "colada"], name: "las casas de vecinos", says: "Seis pisos de gris y una ventana en cada piso encendida de otro color: verde con televisión, rojo con bombilla, azul con algo que nadie quiere ver." },
      { words: ["casa tomada", "portal", "ocupa", "okupa"], name: "la casa tomada", says: "Una casa alta y gris con una bicicleta encadenada en el portal y una bandera en una ventana. Doce familias, alguna con parentesco.", leads: "s" },
      { words: ["terraplen", "terraplén", "via", "vía", "vias", "vías"], name: "el terraplén", says: "Un hueco entre dos casas por donde antes pasaba el tren. Al fondo, una chimenea altísima contra el cielo.", leads: "e" }
    ],
    ambience: { lines: [
      "Se abre una ventana en una casa de vecinos, llega un barreño de agua sucia y se cierra la ventana.",
      "La farola de sodio chasca al enfriarse y toda la plaza escucha.",
      "Un niño, despierto a deshoras, se sienta en la fuente seca y le cuenta algo."
    ], every: [30, 70] },
    sleep: "En la plaza, no. La farola no se apaga nunca, y los vecinos tampoco.",
    alt: "Una plaza pequeña de noche: una fuente de piedra seca con macetas dentro en el centro, una farola de sodio naranja a la izquierda y casas de vecinos altas alrededor con ventanas encendidas en verde, rojo y azul."
  },
  casa: {
    name: "LA CASA TOMADA", area: "casa", at: [0, 0, 0],
    describe: [
      "El portal de la casa tomada, mirando al sur: una pared de buzones, todos reventados, y una bicicleta encadenada a un radiador que dejó el edificio en 1979. En el primer escalón arde una vela, pagada por turnos.",
      "El zaguán sigue hacia el patio y su luz. La plaza queda a tu espalda, al norte."
    ],
    exits: { n: "plaza", s: "patio" },
    scenery: [
      { words: ["buzones", "buzon", "buzón", "correo", "cartas"], name: "los buzones", says: "Cuarenta buzones con nombres en rotulador. Todos reventados con el mismo folleto: el de venta por correo, sin abrir, un ejemplar nuevo para cada vecino, cada temporada." },
      { words: ["bicicleta", "bici", "radiador", "cadena"], name: "la bicicleta", says: "Encadenada a un radiador que dejó de calentar el edificio en 1979. La bicicleta tiene una rueda pinchada y un candado buenísimo, que es lo normal en esta ciudad." },
      { words: ["vela", "escalon", "escalón", "escalones", "turno", "turnos"], name: "la vela", says: "Un cabo en un platillo sobre el primer escalón. Un papel al lado apunta quién ha pagado la cera de esta noche, y la lista es más larga que la vela." },
      { words: ["pintadas", "lemas", "pared", "paredes", "carteles"], name: "las paredes", says: "Lemas sobre lemas y carteles sobre carteles, tantas capas que el edificio es sobre todo papel. Uno dice, en rojo: LO QUE SE VENDE NO ES TUYO." },
      { words: ["zaguan", "zaguán", "pasillo", "baldosas"], name: "el zaguán", says: "Baldosas blancas y negras, sobre todo negras. Sigue al sur, hacia la luz fría y limpia del patio." }
    ],
    ambience: { lines: [
      "Un bebé llora arriba, y alguien le canta por encima en un idioma que nadie de aquí habla.",
      "La vela se inclina, como si le hubieran preguntado algo.",
      "Un portazo en el tercero, y la bicicleta del zaguán hace sonar su timbre, una vez."
    ], every: [30, 70] },
    sleep: "En el portal, no. Hay turnos para el suelo, y tu nombre no figura en ninguno.",
    alt: "El zaguán de una casa ocupada de noche, mirando al sur: una pared de buzones reventados a la izquierda, una bicicleta encadenada a un radiador a la derecha, una vela en el primer escalón y, al fondo, un cuadrado luminoso que es el patio."
  },
  patio: {
    name: "EL PATIO", area: "casa", at: [0, 1, 0],
    describe: [
      "Un patio abierto al cielo, seis pisos de cuerdas de tender y ventanas con velas. Alguien ha pintado las paredes del color de un cielo que no ve, y la lluvia se ha llevado casi todo.",
      "Una {escalera de hierro|escalera_patio} sube por la pared norte hasta el tejado. El zaguán queda al norte."
    ],
    exits: { n: "casa", u: "azotea" },
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
    name: "LA AZOTEA", area: "casa", at: [0, 1, 1],
    describe: [
      "El tejado de la casa tomada: alquitrán, antenas y una fila de chimeneas en la oscuridad como una congregación. Toda la ciudad se extiende abajo, gris de día y de color mojado ahora.",
      "{Tomás|tomas} está sentado en el caballete, negro de pies a cabeza. Lo único limpio que tiene son los blancos de los ojos. La escalera baja."
    ],
    exits: { d: "patio" },
    scenery: [
      { words: ["chimeneas", "chimenea", "tubos", "fila", "congregacion", "congregación"], name: "las chimeneas", says: "Once, de ladrillo y barro, cada una con un capuchón de hollín. Solo la duodécima, más lejos, tira todavía." },
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
    alt: "Una azotea plana de noche bajo una luna baja: una fila de chimeneas como figuras oscuras a la izquierda, un deshollinador de negro con una vara larga sentado contra una chimenea en el primer tercio izquierdo, un horizonte de neón de colores abajo a la derecha y antenas contra el cielo."
  },
  terraplen: {
    name: "EL TERRAPLÉN", area: "vias", at: [0, 0, 0],
    describe: [
      "Un terraplén de ferrocarril bajo una luna baja: balasto gris, dos raíles oxidados y un vagón en una vía muerta con el portón cegado por lemas que nadie ha leído. No pasa un tren desde que cambió el tiempo.",
      "Al este, los raíles siguen hasta la fábrica y su gran chimenea. La plaza queda al oeste."
    ],
    exits: { w: "plaza", e: "fabrica" },
    scenery: [
      { words: ["railes", "raíles", "rail", "carril", "carriles", "vias", "vías", "balasto", "traviesas"], name: "los raíles", says: "Dos líneas oxidadas hasta el horizonte, y el horizonte es una fábrica. Nada ha rodado sobre ellas desde que cambió el tiempo." },
      { words: ["vagon", "vagón", "porton", "portón", "lemas", "apartadero"], name: "el vagón", says: "Un vagón de mercancías con el portón cubierto de lemas: SUELDOS, PAN, ESTO NO. Debajo, en pintura más vieja: PROSPERIDAD S.A., VENTA POR CORREO." },
      { words: ["chimenea", "fabrica", "fábrica", "nave"], name: "la fábrica", says: "Una nave negra y, saliendo de ella, una chimenea más alta que las casas de vecinos. Es lo único de Prosperidad que es más grande que su fama." },
      { words: ["luna", "cielo", "nubes"], name: "la luna", says: "Baja y amarilla, envuelta en un velo del humo de la fábrica." },
      { words: ["farol", "senal", "señal", "semaforo", "semáforo"], name: "la señal", says: "Una señal de ferrocarril, en rojo, que lleva mucho tiempo diciendo alto a nadie." }
    ],
    ambience: { lines: [
      "Una señal chasca, roja, y sigue roja.",
      "El viento recorre el terraplén, levanta un folleto de venta por correo, le da vuelta a las hojas y lo suelta.",
      "En algún lugar de la fábrica algo pesado se asienta, como un animal grande que cambia de idea."
    ], every: [30, 70] },
    sleep: "En el balasto, no. Los raíles están fríos, y la fábrica no.",
    alt: "Un terraplén de ferrocarril de noche bajo una luna baja: dos raíles oxidados que corren hacia el este, hacia una nave negra de fábrica en el tercio derecho con una chimenea altísima contra el cielo, y un vagón de mercancías en una vía muerta a la izquierda."
  },
  fabrica: {
    name: "LA FÁBRICA", area: "vias", at: [1, 0, 0],
    describe: [
      "La vieja fábrica de Prosperidad S.A., que imprimía el catálogo de venta por correo y quemaba lo que no vendía. Un horno sigue encendido al fondo de la nave, y la {gran chimenea|gran_chimenea} se alza en medio del suelo como un árbol que hubiera crecido a través de su propio techo, negro desde la base hasta la nube.",
      "La ceniza del suelo está tibia. El camino de vuelta queda al oeste, por la vía."
    ],
    exits: { w: "terraplen" },
    scenery: [
      { words: ["horno", "fuego", "brasas", "resplandor", "parrilla"], name: "el horno", says: "Una boca de ladrillo con un ojo rojo. Hace años que no lo alimentan. Nadie se lo ha dicho." },
      { words: ["ceniza", "cenizas", "suelo", "hollin", "hollín", "escoria"], name: "la ceniza", says: "Tibia, gris y tan honda que se traga un zapato. Debajo, un suelo con la última tirada de catálogos, quemada en pliegos." },
      { words: ["maquinas", "máquinas", "imprenta", "rodillos", "cintas", "prensas"], name: "las prensas", says: "Rodillos de hierro altos como un hombre, todavía entintados en un gris que no sale de las paredes." },
      { words: ["techo", "agujero", "cielo", "nube"], name: "el techo", says: "Un gran agujero por donde sube la chimenea, y por el agujero, una nube que lleva ahí desde que se dejó de imprimir." },
      { words: ["nave", "paredes", "pared", "ladrillos", "ladrillo"], name: "la nave", says: "Ladrillo alto como una catedral, chamuscado con la forma de una mano muy grande." }
    ],
    ambience: { lines: [
      "El horno chasca y suspira, como si soltara algo que se había guardado.",
      "Un pliego de papel quemado se pone en pie sobre la ceniza, se lo piensa y vuelve a tumbarse.",
      "La gran chimenea cruje de arriba abajo, una nota larga, y luego nada."
    ], every: [30, 70] },
    sleep: "En la ceniza, no. Te retendría.",
    alt: "El interior de una vieja fábrica iluminado de rojo por un horno: la boca de ladrillo de un horno brillando a la izquierda, la gran chimenea negra subiendo por el centro de la nave hasta un agujero del techo, a la derecha, prensas de hierro y un suelo de ceniza gris."
  }
};

// ---- Objetos -----------------------------------------------------------------------------------------------------------
const objects = {
  // La sala del comienzo: las pistas, lo que ya llevas y la salida, que cede a un hombro o a una llamada (BRIEF.md §3).
  radio: { at: "callejon", portable: true, material: "metal", name: "Radio", note: "Murmurando entre emisoras.",
    words: { nouns: ["radio", "transistor", "transistores"], adj: ["transistor", "pequeña", "vieja"], g: "f" }, ...item("radio"),
    here: "Una {radio} de transistores sobre un cajón murmura entre dos emisoras.",
    examine: "Una radio de transistores pequeña, sujeta con esparadrapo, clavada entre dos emisoras. En algún punto del ruido hay una voz esperando a que le preguntes." },
  pagina: { at: "player", portable: true, material: "paper", name: "Página de catálogo", note: "Arrancada, con un círculo.",
    words: { nouns: ["pagina", "página", "catalogo", "catálogo"], adj: ["arrancada", "rota", "vieja"], g: "f" }, ...item("pagina"),
    examine: "Una página arrancada de un catálogo de venta por correo, con polvo encima. Una corona de papel dorado rodeada en rotulador rojo: «CORONA DE EMPERADOR. Talla única. Se entrega a quien nombre la ciudad. Pago contra entrega»." },
  puerta: { at: "callejon", material: "metal", name: "Puerta de incendios", note: "La única salida.", door: "n",
    words: { nouns: ["puerta"], adj: ["incendios", "acero", "metálica", "metalica", "gris"], g: "f" },
    examine: "Una puerta de incendios de acero con barra y una abolladura con forma de hombro. Está pintada del mismo gris que la pared, por si a alguien se le ocurría largarse por otro lado." },

  // Trastienda
  puerta_trasera: { at: "trastienda", material: "metal", name: "Puerta de incendios", note: "Al callejón.", door: "s",
    words: { nouns: ["puerta"], adj: ["incendios", "acero", "metálica", "metalica", "gris"], g: "f" },
    examine: "La puerta de incendios por dentro: una barra, abierta y calzada, y al otro lado los charcos rosas del callejón." },
  funda: { at: "trastienda", container: true, open: false, material: "wood", name: "Funda de guitarra", note: "Suena al inclinarla.",
    words: { nouns: ["funda"], adj: ["guitarra", "negra", "vieja"], g: "f" },
    examine: "Una funda de guitarra negra con el cierre roto, sujeta con un cinturón. Al inclinarla suena algo pequeño y abundante, y no es una guitarra." },
  fichas: { at: "funda", portable: true, material: "metal", name: "Fichas de lavandería", note: "De latón, con un agujero.",
    words: { nouns: ["fichas", "ficha"], adj: ["lavandería", "lavanderia", "latón", "laton"], g: "f", pl: true }, ...item("fichas"),
    examine: "Un puñado de fichas de latón con LAVANDERÍA estampado y un agujerito en medio. Las justas para una máquina, y la máquina sabe cuántas." },

  // El Submarino
  cuco: { portrait: sprites.cuco_portrait, at: "pista", name: "Cuco", note: "El pinchadiscos.",
    words: { nouns: ["cuco", "pinchadiscos", "dj"], adj: [], proper: true, g: "m" },
    examine: "Un hombre flaco con chupa de cuero y una cresta como un trazo de pintura negra, doblado sobre dos tocadiscos, de los cuales uno no gira. Tiene aire de hombre cuya música se ha ido de casa.",
    talk: "«No me pidas canciones —dice Cuco sin volverse—. Solo me queda media noche».",
    topics: {
      deck: { open: true, label: "el plato mudo", words: ["plato", "tocadiscos", "mudo", "musica", "música", "discos", "cabina"], says: "«Un plato está muerto y me falta una cinta para tener noche entera —dice Cuco—. La que necesito se la quedó alguien a quien no sé cómo pedírsela. El orgullo es mala tarima para bailar»." },
      funda: { about: "funda", label: "la funda de guitarra", words: ["funda", "guitarra", "fichas", "trastienda"], says: "«¿La funda de atrás? Fichas de lavandería. Ya nadie toca la guitarra, así que las fichas tienen sitio». Piensa. «La Lavandería las acepta. Te devuelve más de lo que metes, si has perdido algo»." },
      marisol: { label: "Marisol", words: ["marisol", "esquina", "mujer"], says: "Algo le cruza la cara y lo guarda enseguida. «¿Marisol? En la esquina, donde siempre. Fuimos amigos. Tiene mi cinta, y no pienso pedírsela»." },
      default: "«Perdona —dice Cuco, por encima del bajo—. Solo oigo lo que me llega por los cascos»."
    },
    give: "«Qué detalle —dice Cuco—. Pero esa no es mi cinta»." },

  // La avenida y la esquina
  marisol: { portrait: sprites.marisol_portrait, at: "esquina", name: "Marisol", note: "Trabaja la esquina.",
    words: { nouns: ["marisol", "mujer", "señora", "senora"], adj: [], proper: true, g: "f" },
    examine: "Una mujer con abrigo corto y buenos zapatos, el pelo recogido, la cara sin pintar y cansada. Tiene la paciencia de un banco y los modales de una duquesa, y nunca ha fingido ser otra cosa.",
    talk: "«Buenas, Emperador —dice Marisol—. Si vienes a trabajar, trabaja en la otra acera. Si vienes a mirar, mira la farola».",
    topics: {
      work: { open: true, label: "su trabajo", words: ["trabajo", "oficio", "esquina", "farola", "precio", "clientes"], says: "«Quince minutos, cien duros, sin besos. Doce años, una farola, y a nadie he tenido que sacarlo en brazos». Lo dice como un horario de trenes. «Es un oficio. Nadie se avergüenza de vender pan»." },
      eyes: { open: true, opens: ["tape"], label: "sus ojos", words: ["ojos", "cara", "kohl", "maquillaje", "cansada"], says: "«Tengo mala cara porque mi tarro de kohl está vacío —dice—. Quince años con el mismo negro, y la tienda que lo vendía ha cerrado. He visto que el hollín de un deshollinador arregla a una señora lo que un tarro no»." },
      tape: { label: "la cinta", words: ["cinta", "casete", "cuco"], says: "«La cinta de Cuco —dice, y no sonríe—. Me la dejó la noche que dejó de hablarme. Tiene la canción que no puede poner y no puede dejar de oír. Si alguien me trajera un poco de ese negro para los ojos, podría prestarla»." },
      name: { label: "tu nombre", words: ["nombre", "dani", "emperador"], says: "«Eres Emperador desde que fuiste una broma que alguien contó —dice—. Antes eras Dani, del tercero, con tos. Nicanor lo tiene apuntado en alguna parte»." },
      default: "«De eso no sé, cariño —dice Marisol—, pero si lo averiguas, cuéntaselo a la farola»."
    },
    give: "«Para mí no, cariño —dice Marisol—. Yo solo cojo lo que puedo usar»." },
  hollin: { at: null, portable: true, material: "soft", name: "Bote de hollín", note: "Fino y negro.",
    words: { nouns: ["hollin", "hollín", "bote", "tarro"], adj: ["fino", "negro"], g: "m" }, ...item("hollin"),
    examine: "Un bote de mermelada con hollín de chimenea, fino como harina y negro como un juramento. Bueno para los ojos, si conoces a las señoras, y bueno para los pulmones de nadie." },

  // La pensión
  nicanor: { portrait: sprites.nicanor_portrait, at: "pension", name: "Don Nicanor", note: "Atiende el mostrador.",
    words: { nouns: ["nicanor", "don", "recepcionista", "dueño", "dueno"], adj: ["don"], proper: true, g: "m" },
    examine: "Un hombre flaco con un bigote que ha sobrevivido a dos esposas, en una rebeca del color del vestíbulo. Tiene el don de no enterarse, y lo ejerce como oficio.",
    talk: "«Habitaciones por horas, por noches o por años —dice don Nicanor—. Lo de los años es para quien se ha rendido. No lo recomiendo».",
    topics: {
      rooms: { open: true, label: "una habitación", words: ["habitacion", "habitación", "habitaciones", "cama", "noche", "hora", "alquiler"], says: "«Ocho pesetas la hora, treinta la noche, y ninguna pregunta a ninguna tarifa. La única que no alquilo es la siete. Esa está ocupada por una señora que paga el día uno»." },
      book: { open: true, label: "el Libro de Horas", words: ["libro", "registro", "horas", "nombres"], says: "«Todos los nombres que han pasado por aquí están en el Libro —dice don Nicanor—. El tuyo también. Dani, de la siete, 1979, tercera noche. Un bebé con tos en una habitación sin calefacción. Me acuerdo porque dormías mejor que tu madre»." },
      marisol: { label: "Marisol", words: ["marisol", "siete", "inquilina"], says: "«La siete es de Marisol —dice don Nicanor—. Paga el día uno y nunca ha dado un portazo. Si quieres ver cómo vive una señora, sube y mira. No le importa. La deja abierta»." },
      default: "«No sabría decirle —dice don Nicanor, y apunta algo en el Libro»."
    },
    give: "«Gracias, pero llevo un establecimiento muy serio —dice don Nicanor, y lo devuelve»." },
  escalera_pension: { at: "pension", leads: "u", name: "Escalera", note: "Sube a las habitaciones.",
    words: { nouns: ["escalera", "escaleras", "peldaños", "peldanos"], adj: ["estrecha", "gastada"], g: "f" },
    examine: "Una escalera estrecha con una alfombra roja gastada, que sube a un rellano y a una fila de habitaciones con número y sin nombre." },
  kohl: { at: "pension_hab", name: "Tarro de kohl", note: "Rascado hasta el fondo.",
    words: { nouns: ["tarro", "kohl", "lapiz", "lápiz"], adj: ["kohl", "negro", "vacío", "vacio"], g: "m" },
    examine: "Un tarro redondo, rascado hasta el fondo con una uña. Ni una escama. Quien lo usa lo usa con el cuidado de alguien que hace cuentas." },
  pintada: { at: "pension_hab", name: "Pintada", note: "De pintalabios, en la pared.",
    words: { nouns: ["pintada", "letras", "mensaje", "pintalabios", "papel"], adj: ["pintalabios"], g: "f" },
    examine: "Con pintalabios, en el papel de la pared junto a la cama, con letra grande y redonda: «CUCO. TU CINTA ESTÁ AQUÍ CUANDO VENGAS A POR ELLA TÚ». Debajo, más pequeño: «Antes, no»." },
  escalera_pension_hab: { at: "pension_hab", leads: "d", name: "Escalera", note: "De vuelta abajo.",
    words: { nouns: ["escalera", "escaleras", "peldaños", "peldanos"], adj: ["estrecha", "gastada"], g: "f" },
    examine: "La escalera baja hasta el vestíbulo, donde un reloj no llega a llevar bien la hora." },

  // La lavandería
  secadora: { at: "lavanderia", name: "Secadora grande", note: "Quiere fichas.",
    words: { nouns: ["secadora", "maquina", "máquina", "ojo"], adj: ["grande", "enorme", "vieja"], g: "f" },
    examine: "Una secadora enorme y vieja con una tapa de cristal redonda y una ranura que dice FICHAS. En el cristal, algo gira despacio, y no se sabe de quién es.",
    switch_on: "La secadora no hace nada. La ranura dice FICHAS, y lo dice como un alguacil.",
    push: "La secadora no hace nada. La ranura dice FICHAS.",
    take: "Está atornillada al suelo, y lo lleva estando desde la guerra." },
  cepillo: { at: null, portable: true, material: "wood", name: "Cepillo de deshollinar", note: "Largo, negro y duro.",
    words: { nouns: ["cepillo"], adj: ["deshollinar", "deshollinador", "largo", "negro"], g: "m" }, ...item("cepillo"),
    examine: "El cepillo de un deshollinador en una caña articulada, negro como el fondo de una olla. Quemado en el mango con un clavo caliente: T. H." },

  // La boticaria
  boticaria: { portrait: sprites.boticaria_portrait, at: "bar", name: "La boticaria", note: "Vende papelinas.",
    words: { nouns: ["boticaria", "mujer", "señora", "senora"], adj: [], g: "f" },
    examine: "Una mujer pequeña y pulcra con abrigo gris, el pelo en una redecilla y la bolsa en el regazo. Tiene pinta de tía que ha dado consejo sobre todo y ha acertado en casi todo.",
    talk: "«Buenas —dice la boticaria, como a alguien de la familia—. No me digas lo que quieres. Dime de qué vas corto».",
    topics: {
      trade: { open: true, label: "su negocio", words: ["negocio", "papelinas", "papel", "vender", "vendes", "bolsa", "polvo", "pastillas"], says: "«Vendo lo que me piden —dice la boticaria—. Algo para aguantar, algo para bajar, algo para el frío. Les digo lo que hace y lo que cuesta, y luego es cosa suya. Nadie me ha dicho nunca que mintiera»." },
      lavanderia: { about: "lavanderia", label: "la Lavandería", words: ["lavanderia", "lavandería", "lavadoras", "secadora", "fichas"], says: "«Las máquinas de ahí te devuelven lo que te falta. No lo que metes: lo que te falta. Una vez metí un abrigo y me devolvió un marido. Pide lo que quieras con fichas, y las manos fuera del tambor»." },
      tomas: { label: "Tomás", words: ["tomas", "tomás", "deshollinador", "chimenea", "tejado", "azotea"], says: "«¿Tomás el deshollinador? En el tejado de la casa tomada. Perdió el cepillo el invierno pasado y desde entonces barre el aire con las manos. No es bonito de ver»." },
      default: "«Si no está en la lista, no puedo ayudar —dice la boticaria—, y la lista es larga»."
    },
    give: "«Yo no cobro en especie —dice la boticaria—. Solo en moneda o en conversación»." },

  // La estafeta
  remedios: { portrait: sprites.remedios_portrait, at: "estafeta", name: "Doña Remedios", note: "Lo sella todo.",
    words: { nouns: ["remedios", "doña", "dona", "señora", "senora", "oficinista"], adj: ["robusta"], proper: true, g: "f" },
    examine: "Una mujer robusta con rebeca y redecilla, un sello en cada mano y un tercero detrás de la oreja. No levanta la vista de nada que no tenga ya archivado.",
    talk: "«Siguiente —dice doña Remedios, aunque no hay nadie más—. Nombre, paquete, pago, por ese orden. Por ese orden no: primero el pago».",
    topics: {
      parcel: { open: true, opens: ["name", "sign"], label: "el paquete", words: ["paquete", "bulto", "caja", "mio", "mío", "emperador", "direccion", "dirección"], says: "«A nombre de Emperador, a la atención de la avenida —lee—. O, según la etiqueta vieja de debajo, Dani, tercero de la casa tomada. Se entrega a quien firme. Se paga contra entrega. Yo no hago las reglas. Las sello»." },
      pay: { open: true, label: "el pago", words: ["pago", "pagar", "dinero", "billete", "precio", "cuesta"], says: "«Contra entrega —dice doña Remedios—. El pago es un billete, cualquiera, mientras sea ganado. No encontrado, no regalado: ganado. El catálogo es muy estricto con lo ganado, aunque no con la cantidad»." },
      sign: { label: "la firma", words: ["firma", "firmar", "nombre", "dani"], says: "«Se firma a nombre de alguien. Lo dices, lo sello y es tuyo. No el nombre que querrías tener. El nombre con el que vas a firmar»." },
      default: "«Eso no puedo sellarlo —dice doña Remedios, y sella otra cosa»."
    },
    give: "«El pago se hace en billetes —dice doña Remedios—, y eso no lo es»." },
  billete: { at: null, portable: true, material: "paper", name: "Billete", note: "Arrugado, ganado.",
    words: { nouns: ["billete", "dinero", "papel"], adj: ["arrugado", "doblado", "ganado", "quinientas"], g: "m" }, ...item("billete"),
    examine: "Un billete de quinientas pesetas arrugado, doblado en cuatro y todavía tibio. Sea lo que sea, se lo ha ganado alguien." },

  // La cinta
  cinta: { at: null, portable: true, material: "paper", name: "Cinta", note: "Sin etiqueta.",
    words: { nouns: ["cinta", "casete", "cassette"], adj: ["sin etiqueta", "lisa", "barata"], g: "f" }, ...item("cinta"),
    examine: "Un casete barato sin etiqueta, solo con una huella de pulgar en algo que debió de ser lápiz de ojos. Las bobinas están enrolladas muy parejas, como si la cinta se hubiera guardado para algo." },

  // La casa tomada
  escalera_patio: { at: "patio", leads: "u", name: "Escalera de hierro", note: "Sube al tejado.",
    words: { nouns: ["escalera", "peldaños", "peldanos"], adj: ["hierro", "oxidada", "de hierro"], g: "f" },
    examine: "Una escalera de hierro atornillada a la pared norte, con los peldaños brillantes a la altura de las manos. Sube hacia el humo." },
  escalera_azotea: { at: "azotea", leads: "d", name: "Escalera de hierro", note: "De vuelta abajo.",
    words: { nouns: ["escalera", "peldaños", "peldanos"], adj: ["hierro", "oxidada", "de hierro"], g: "f" },
    examine: "La escalera por la que has subido, bajando a la luz de las velas del patio." },
  tomas: { portrait: sprites.tomas_portrait, at: "azotea", name: "Tomás", note: "El deshollinador.",
    words: { nouns: ["tomas", "tomás", "deshollinador", "hombre"], adj: [], proper: true, g: "m" },
    examine: "Un deshollinador de la chistera para abajo, que también es negra, y una cara tan tiznada que, cuando sonríe, parece un defecto de la oscuridad. En el cinturón hay un hueco con forma de cepillo, donde estuvo su cepillo.",
    talk: "«Cuidado con las chimeneas —dice Tomás—. Están calientes, y se quedan con lo que les das».",
    topics: {
      sweeping: { open: true, opens: ["works"], label: "el deshollinado", words: ["deshollinar", "deshollinado", "chimenea", "chimeneas", "trabajo", "hollin", "hollín"], says: "«Hay once chimeneas aquí arriba, y una duodécima en la fábrica que es mayor que todas juntas —dice Tomás—. Llevo cuarenta años deshollinándolas. Quien deshollina una chimenea se queda con el hollín. Esa es toda la ley»." },
      brush: { open: true, label: "su cepillo", words: ["cepillo", "perdido", "perdi", "caña", "cana"], says: "«Se me fue a la Lavandería el invierno pasado, en el bolsillo del mono, y las máquinas se quedaron con él —dice Tomás—. Te devuelven lo que te falta. Nunca lo que pides: solo lo que te falta. Si me faltara el cepillo, ya lo tendría»." },
      works: { label: "la fábrica", words: ["fabrica", "fábrica", "gran", "chimenea"], says: "«La gran chimenea de la fábrica se queda con todo el gris —dice Tomás—. Ochenta años, y nadie la ha deshollinado desde que se dejó de imprimir. Si subieras con un cepillo…» Niega con la cabeza. «Claro, es muy larga la subida, y yo solo tengo una espalda»." },
      default: "«No sabría decirte —dice Tomás—. Yo solo entiendo de hollín»." },
    give: "«Eso no es mío —dice Tomás—, pero gracias»." },

  // La fábrica
  gran_chimenea: { at: "fabrica", name: "Gran chimenea", note: "Negra desde la base hasta la nube.",
    words: { nouns: ["chimenea", "tiro", "conducto"], adj: ["gran", "grande", "alta", "negra"], g: "f" },
    examine: "Una chimenea de ladrillo ancha como una casa, que sube por la nave y sale por el techo, negra desde el suelo hasta la nube. A su pie, una pequeña trampilla de hierro y olor a ochenta años de papel quemado.",
    take: "Es una chimenea.",
    push: "Te apoyas en ella, y ella se apoya en ti, un poco, desde mucha altura." }
};

// ---- Los puzles -----------------------------------------------------------------------------------------------------------
const puzzles = {
  // La salida de la sala del comienzo va primero (BRIEF.md §3): las primeras pistas de la radio son para ella.
  way_out: { where: "callejon", needs: [], solve: ["empuja la puerta", "norte"], reaches: "trastienda", clues: ["puerta", "shoulder_door"],
    hints: ["La puerta de incendios no tiene pomo por este lado, solo una barra, y una abolladura con forma de hombro donde otros han llamado.", "Apoya el hombro en la puerta de incendios: empújala, y ve al norte."] },
  take_tokens: { where: "trastienda", needs: [], solve: ["abrir funda", "{take} fichas"], gives: ["fichas"], clues: ["funda", "cuco"],
    hints: ["La funda de guitarra de la trastienda suena cuando se inclina.", "Abre la funda de guitarra y coge las fichas."] },
  feed_dryer: { where: "lavanderia", needs: ["fichas"], solve: ["meter fichas en secadora", "{take} cepillo"], gives: ["cepillo"], clues: ["secadora", "boticaria", "tomas"],
    hints: ["La secadora de la Lavandería acepta fichas y te devuelve lo que te falta.", "Mete las fichas en la secadora y coge lo que salga."] },
  sweep_roof: { where: "azotea", needs: ["cepillo"], solve: ["dar cepillo a tomas"], gives: ["hollin"], clues: ["tomas", "cepillo", "boticaria"],
    hints: ["Al deshollinador del tejado de la casa tomada le falta el cepillo.", "Dale el cepillo a Tomás, en la azotea, y deshollinará una chimenea y te dará el hollín."] },
  line_eyes: { where: "esquina", needs: ["hollin"], solve: ["dar hollin a marisol"], gives: ["cinta"], clues: ["marisol", "hollin", "kohl"],
    hints: ["El tarro de kohl de Marisol está vacío, y el hollín del deshollinador arregla los ojos mejor que un tarro.", "Dale el hollín a Marisol, en la esquina, y te dará la cinta de Cuco."] },
  play_tape: { where: "pista", needs: ["cinta"], solve: ["dar cinta a cuco"], gives: ["billete"], clues: ["cuco", "cinta", "pintada"],
    hints: ["El otro plato de Cuco está mudo porque su cinta está en la esquina. Paga bien lo que echa en falta.", "Dale la cinta a Cuco, en el club, y coge el billete."] },
  corona: { where: "estafeta", needs: ["billete"], solve: ["dar billete a remedios", "decir emperador"], ending: true, clues: ["remedios", "billete", "marisol"],
    hints: ["El paquete va a nombre de Emperador, y doña Remedios sella lo pagado.", "Dale el billete a doña Remedios, en la estafeta, y di Emperador."] },
  nombre: { where: "estafeta", needs: ["billete"], solve: ["dar billete a remedios", "decir dani"], ending: true, clues: ["remedios", "nicanor", "marisol"],
    hints: ["El paquete estuvo dirigido antes a otro nombre, y el Libro de don Nicanor lo tiene.", "Dale el billete a doña Remedios y di Dani."] },
  colour: { where: "fabrica", needs: ["cepillo"], solve: ["barrer chimenea con cepillo"], ending: true, clues: ["gran_chimenea", "tomas", "cepillo"],
    hints: ["La gran chimenea de la fábrica guarda el gris de la ciudad, y el cepillo de un deshollinador lo saca.", "Lleva el cepillo a la fábrica, al este del terraplén, y deshollina la gran chimenea."] }
};

// ---- Reglas -----------------------------------------------------------------------------------------------------------------
const rules = [
  // La salida de la sala del comienzo: la puerta de incendios cede a un hombro en su abolladura, o a una llamada (alguien dentro le da a
  // la barra); una regla que conecta la salida, y la hora de la avenida entra por ella (el cambio `arrival`). Se queda abierta.
  { id: "shoulder_door", match: { verb: "push", obj: "puerta" }, if: [{ "puerta.opened": false }],
    do: [{ say: "Apoyas el hombro en la abolladura, como otros antes, y empujas. La puerta de incendios cede con ruido de tapa de contenedor, y el bajo sale a recibirte." },
      { set: "puerta.opened", to: true }, { set: "puerta.note", to: "Abierta, sobre su barra." }, { connect: "callejon", dir: "n", to: "trastienda" }, { change: "arrival" }] },
  { id: "knock_door", match: { verb: "knock", obj: "puerta" }, if: [{ "puerta.opened": false }],
    do: [{ say: "Llamas en la abolladura donde otros han llamado. El bajo se calla un compás; alguien al otro lado le da a la barra, y la puerta de incendios cede con ruido de tapa de contenedor." },
      { set: "puerta.opened", to: true }, { set: "puerta.note", to: "Abierta, sobre su barra." }, { connect: "callejon", dir: "n", to: "trastienda" }, { change: "arrival" }] },
  { id: "door_open_already", match: { verb: ["push", "knock"], obj: "puerta" },
    do: [{ say: "La puerta de incendios está abierta sobre su barra. El bajo espera." }] },
  // La secadora: fichas dentro, lo que te falta fuera.
  { id: "put_tokens", match: { verb: ["put", "use"], obj: "fichas", obj2: "secadora" }, if: [{ "player.at": "lavanderia" }], once: true,
    again: "La secadora ya ha recibido sus fichas y sigue dando vueltas, pensativa.",
    do: [{ say: "Las fichas entran una a una, cada una con una notita húmeda. La secadora gira, el cristal se llena de una vuelta gris y lenta y, con un golpe, por la rampa baja un {cepillo} limpio como un hueso." },
         { move: "fichas", to: null }, { move: "cepillo", to: "lavanderia" }] },
  // El deshollinador: el cepillo de vuelta, el hollín fuera.
  { id: "give_brush", match: { verb: ["give", "show", "use", "put"], obj: "cepillo", obj2: "tomas" }, if: [{ "player.at": "azotea" }], once: true,
    again: "«Ya he deshollinado una —dice Tomás—. Quédate el cepillo hasta que lo necesites».",
    do: [{ say: "Tomás coge el cepillo como otro cogería a un niño. Deshollina la chimenea más cercana, una vez, con un ruido de aliento largo, y sale una nube de hollín negra como una iglesia. Llena un bote de {hollín|hollin} sin mirar y te da el bote y el cepillo juntos. «Para eso sirve —dice—. Para eso sirve todo»." },
         { move: "hollin", to: "player" }] },
  // Marisol: hollín para los ojos, y la cinta.
  { id: "give_soot", match: { verb: ["give", "show", "use", "put"], obj: "hollin", obj2: "marisol" }, if: [{ "player.at": "esquina" }], once: true,
    again: "«Con un bote me basta —dice Marisol—. No me malcríes».",
    do: [{ say: "Marisol coge el bote y se moja un dedo. Se traza una raya en cada ojo, un rabillo, sin espejo, en cuatro segundos. Cuando se vuelve hacia la farola parece alguien que nunca ha estado cansada. «Ya —dice—. Ahora estoy abierta. Anda, cógela». Mete la mano en el abrigo y saca una {cinta} con una huella negra. «Dile que es de la esquina. Y nada más»." },
         { move: "hollin", to: null }, { move: "cinta", to: "player" }] },
  // Cuco: la cinta, y el billete.
  { id: "give_tape", match: { verb: ["give", "show", "use", "put"], obj: "cinta", obj2: "cuco" }, if: [{ "player.at": "pista" }], once: true,
    again: "«Con una me basta —dice Cuco—. Ya tengo la noche entera».",
    do: [{ say: "Cuco sostiene la cinta como si quemara. La mete en el plato mudo, el segundo tocadiscos echa a andar y toda la pista se mueve un cuarto de vuelta, como si alguien se hubiera acordado de algo. No se vuelve. Dobla un {billete} en cuatro y te lo pasa a la mano sin mirar. «De la casa. Ganado»." },
         { move: "cinta", to: null }, { move: "billete", to: "player" }] },
  // La estafeta: se paga, luego se firma.
  { id: "pay_remedios", match: { verb: ["give", "show", "use", "put"], obj: "billete", obj2: "remedios" }, if: [{ "player.at": "estafeta" }, { "remedios.paid": false }],
    do: [{ say: "Doña Remedios acerca el billete al fluorescente, luego a la oreja, luego al sello. Lo baja una vez sobre el papel. «Ganado —dice—. Ahora, ¿a nombre de quién lo firmo?»" },
         { set: "remedios.paid", to: true }, { move: "billete", to: null }] },
  { id: "sign_crown", match: { verb: "say" }, if: [{ "player.at": "estafeta" }, { "remedios.paid": true }, { $text: { in: CORONA } }],
    do: [{ say: "«Emperador», dice doña Remedios, y sella la etiqueta dos veces. Levanta la tapa y saca una corona de cartón y papel dorado, talla única, que resulta ser la tuya. Te la pone ella misma." },
         { say: "Fuera, en la avenida, el neón ya está encendido. Cuando llegas al frente del Submarino, todos han parado a mirar, y nadie se ríe. Es una ciudad gris y tiene un emperador, y el trabajo sigue." },
         { end: true, picture: "crowned" }] },
  { id: "sign_name", match: { verb: "say" }, if: [{ "player.at": "estafeta" }, { "remedios.paid": true }, { $text: { in: NOMBRE } }],
    do: [{ say: "Doña Remedios recorre un impreso con el dedo, encuentra un nombre y lo sella. «Dani —dice, como quien lee una dirección vieja—. Tercero, la casa tomada». Abre el paquete. Dentro hay un billete para el autobús de las cinco y diez, una camisa limpia en papel de seda y olor a otro sitio." },
         { say: "Nadie de la avenida te llama Emperador cuando andas hacia la parada. Te llaman por el otro nombre. Suena pequeño, y raro, y te sienta." },
         { end: true, picture: "named" }] },
  { id: "sign_unpaid", match: { verb: "say" }, if: [{ "player.at": "estafeta" }, { "remedios.paid": false }, { $text: { in: [...CORONA, ...NOMBRE] } }],
    do: [{ say: "«Primero se paga —dice doña Remedios, sin levantar la vista—. Luego se firma. El catálogo es muy suyo para eso»." }] },
  { id: "sign_other", match: { verb: "say" }, if: [{ "player.at": "estafeta" }, { "remedios.paid": true }],
    do: [{ say: "«Ese nombre no está en la etiqueta», dice doña Remedios, y le pone un sello de todos modos, por si acaso. El paquete sigue cerrado." }] },

  // La gran chimenea: el cepillo, y el final.
  { id: "sweep_great", match: { verb: ["sweep", "use"], obj: "gran_chimenea" }, if: [{ "player.at": "fabrica" }, { "cepillo.at": "player" }],
    do: [{ change: "big_sweep" }] },
  { id: "sweep_great_with", match: { verb: ["use", "put", "sweep"], obj: "cepillo", obj2: "gran_chimenea" }, if: [{ "player.at": "fabrica" }],
    do: [{ change: "big_sweep" }] },
  { id: "sweep_nothing", match: { verb: ["sweep", "use"], obj: "gran_chimenea" }, if: [{ "player.at": "fabrica" }],
    do: [{ say: "Agitas las manos hacia la chimenea y te cae un poco de hollín en ellas. Es un comienzo, y no es nada. Una chimenea así pide el cepillo de un deshollinador." }] },
  { id: "sweep_elsewhere", match: { verb: "sweep" }, if: [{ "player.at": "azotea" }],
    do: [{ say: "«No —dice Tomás—. Las chimeneas de aquí son mías. Lleva tu cepillo a la fábrica, si buscas algo que de verdad necesite barrerse»." }] }
];

const changes = {
  big_sweep: [
    { say: "Apoyas el cepillo en la trampilla del pie de la chimenea y lo empujas hacia arriba, hacia la oscuridad, y entra como si lo hubieran invitado. El hollín baja durante un buen rato: un invierno entero, y luego el invierno de antes." },
    { say: "Con el hollín baja todo el color que guardaba. Primero rojo, luego verde, luego un amarillo que no tiene nada que hacer en esta ciudad. Cuando sales de la fábrica el cielo ha pasado del gris al color del rótulo del Submarino, a plena luz, y la avenida está decidiendo si le gusta." },
    { end: true, picture: "colour" }
  ]
};

// ---- La sala del comienzo, declarada (BRIEF.md §3) ----------------------------------------------------------------------------------------
const opening = {
  room: "callejon", hints: "radio", intro: "pagina", way: "puerta",
  lines: {
    hintFrame: "Te pegas la radio a la oreja. Entre dos emisoras, una voz dice:",
    farewell: "El viento te saca la página de la mano, se la lee al callejón y la suelta."
  }
};

// ---- El conjunto de cambios -----------------------------------------------------------------------------------------------------
export default {
  because: "Un callejón sin salida detrás de un club, y luego la avenida, las casas ocupadas y el club de una ciudad gris una noche de sábado de 1985, y un paquete con tu nombre.",
  opening,
  facts: [
    "El jugador es Emperador, un punk de la calle en Prosperidad, 1985; la sala del comienzo es el callejón sin salida detrás del Submarino, al sur de la trastienda tras la puerta de incendios.",
    "Un paquete para Emperador espera en la estafeta; doña Remedios lo entrega a cambio de un billete ganado y un nombre dicho en voz alta.",
    "La secadora de la Lavandería devuelve lo que te falta; a Tomás el deshollinador le falta el cepillo.",
    "El nombre del jugador, antes de Emperador, era Dani.",
    "La gran chimenea de la fábrica guarda el gris de la ciudad; deshollinarla con el cepillo es un final."
  ],
  properties: {
    "puerta.opened": { type: "boolean", start: false },   // la puerta de incendios ha cedido: está abierta sobre su barra
    "remedios.paid": { type: "boolean", start: false }
  },
  effects: [
    { time: "day 1 01:00", weekday: "sat" },                 // el juego empieza a la una de la madrugada, en el callejón
    // Lo que deja entrar la puerta de incendios al ceder (lo ejecutan sus reglas): la hora de la avenida y su línea.
    { add: "change", id: "arrival", effects: [
      { time: "day 1 01:10", weekday: "sat" },
      { say: "La una y diez, y toda la ciudad pagando sus colores." }
    ] },
    // Verbos que este mundo necesita
    { add: "word", verb: "sweep", words: ["barrer", "barre", "deshollinar", "deshollina", "limpiar", "limpia", "fregar", "cepillar"], reply: "Aquí no hay nada que barrer." },
    { add: "word", verb: "order", reply: "La avenida lo vende todo, y esta noche no tienes con qué comprarlo." },
    { add: "word", verb: "buy", reply: "La avenida lo vende todo, y esta noche no tienes con qué comprarlo." },
    { add: "word", verb: "dance", words: ["bailar", "baila", "bailo"], reply: "Te mueves un poco. La avenida lo ve y no le da importancia, que es para lo que sirve bailar en la avenida." },
    { add: "word", verb: "sign", words: ["firmar", "firma", "firmo", "refrendar"], reply: "Firmar es cosa de la estafeta, y de un nombre dicho en voz alta." },

    ...Object.entries(puzzles).map(([id, p]) => ({ add: "puzzle", id, ...p })),
    ...Object.entries(changes).map(([id, effects]) => ({ add: "change", id, effects })),
    ...Object.entries(endingPictures).map(([id, p]) => ({ add: "picture", id, ...p })),
    { add: "music", ...music, levels },   // la música (music.js, compartida por los dos idiomas; sus niveles, levels.js, generados); la de cada sala va en su `music`
    ...Object.entries(rooms).map(([id, r]) => ({ add: "room", id, ...r, picture: pictures[id], ...(roomMusic[id] ? { music: roomMusic[id] } : {}) })),
    ...Object.entries(objects).map(([id, o]) => ({ add: "object", id, ...o })),
    ...rules.map((rule) => ({ add: "rule", rule }))
  ]
};
