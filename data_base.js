// data_base.js

// Colores de las clases para botones
const CLASS_COLORS = [
    { id: 1, name: 'class-color-1', dark: 'class-dark-1', shadow: 'neon-shadow-1' }, // Teal
    { id: 2, name: 'class-color-2', dark: 'class-dark-2', shadow: 'neon-shadow-2' }, // Fuchsia
    { id: 3, name: 'class-color-3', dark: 'class-dark-3', shadow: 'neon-shadow-3' }, // Amber
    { id: 4, name: 'class-color-4', dark: 'class-dark-4', shadow: 'neon-shadow-4' }, // Blue
    { id: 5, name: 'class-color-5', dark: 'class-dark-5', shadow: 'neon-shadow-5' }, // Purple
    { id: 6, name: 'class-color-6', dark: 'class-dark-6', shadow: 'neon-shadow-6' }  // Emerald Green
];

// Estado global de progreso y flags
let courseProgress = { 1: false, 2: false, 3: false, 4: false, 5: false, 6: false };
let quizCompleted = false; 
// Bandera para controlar la aparición del modal de felicitación.
let certificationModalShown = false; 

// Arrays que serán poblados por los archivos JS de cada clase (js/ClaseX.js)
let CLASS_CONTENT = [];
let CERTIFICATION_QUIZ = [];

// Contenido de los Módulos Prácticos (Bloque 3 de cada Clase)
let ACTIVITY_CONTENT_MAP = {
    // Clase 1: IMPLEMENTACIÓN DE IA EN EL FLUJO DOCENTE
    1: {
        title: "MÓDULO PRÁCTICO 1: Implementación de IA en el Flujo Docente",
        summary: "Implementa un ciclo de mejora continua asistido por IA, identificando tareas de bajo valor pedagógico para su automatización y liberando tiempo para actividades de alto impacto.",
        steps: [
            {
                title: "Fase 1: Planificación y Diseño Curricular",
                content: `
                    <h4 class="text-xl font-bold mb-2">Paso 1: Identificación del Vacío</h4>
                    <p>Define exactamente qué necesitas crear: plan anual, secuencia de 5 clases, rúbrica compleja. Evita prompts vagos (Clase 3).</p>
                    <div class="mt-4 p-4 class-dark-1 rounded-lg text-white">
                        <strong>Ejemplo:</strong> Necesito una secuencia didáctica para un proyecto interdisciplinario de 4 semanas.
                    </div>
                    <h4 class="text-xl font-bold mt-4 mb-2">Paso 2: Creación del Borrador Base</h4>
                    <p>Usa un LLM (ChatGPT, Gemini) con un prompt de Rol y Restricción para generar el primer esqueleto.</p>
                    <h4 class="text-xl font-bold mt-4 mb-2">Paso 3: Localización y Contexto</h4>
                    <p>El docente revisa el borrador y pide a la IA que lo adapte al contexto local o curricular específico (Ej: "ajusta la geografía a la Provincia de Buenos Aires").</p>
                `
            },
            {
                title: "Fase 2: Ejecución y Creación de Recursos",
                content: `
                    <h4 class="text-xl font-bold mb-2">Paso 4: Generación Diferenciada</h4>
                    <p>Toma un texto o concepto complejo y utiliza la IA para crear 3 niveles de lectura distintos para atender la diversidad del aula.</p>
                    <h4 class="text-xl font-bold mt-4 mb-2">Paso 5: Diseño de Visuals Rápido</h4>
                    <p>Usa herramientas de Texto a Imagen (Canva, Midjourney) para crear ilustraciones específicas (Clase 5). Incluye el estilo (arte digital, acuarela).</p>
                    <h4 class="text-xl font-bold mt-4 mb-2">Paso 6: Creación de Consignas</h4>
                    <p>Usa la IA para transformar preguntas básicas en consignas de análisis crítico, siguiendo la fórmula R-T-E-F (Clase 3).</p>
                `
            },
            {
                title: "Fase 3: Evaluación y Feedback",
                content: `
                    <h4 class="text-xl font-bold mb-2">Paso 7: Generación de Rúbricas</h4>
                    <p>Crea rúbricas detalladas y objetivas para proyectos complejos. Asegúrate de que los criterios se alineen con los objetivos curriculares.</p>
                    <h4 class="text-xl font-bold mt-4 mb-2">Paso 8: Borrador de Informe</h4>
                    <p>Usa la IA para sintetizar datos de rendimiento y crear borradores de comunicación con las familias (Clase 4). <strong>Recuerda: siempre anonimiza y revisa el tono.</strong></p>
                `
            }
        ]
    },
    // Clase 2: AUDITORÍA Y GESTIÓN CONSCIENTE DE LA HUELLA DIGITAL
    2: {
        title: "MÓDULO PRÁCTICO 2: Auditoría y Gestión Consciente de la Huella Digital",
        summary: "Ejecuta una auditoría completa de la huella digital personal y profesional, identificando puntos de riesgo y aplicando estrategias de saneamiento para proteger la privacidad.",
        steps: [
            {
                title: "Fase 1: Detección y Escaneo (El Rastro Digital)",
                content: `
                    <h4 class="text-xl font-bold mb-2">Paso 1: Búsqueda de Identidad</h4>
                    <p>Busca tu nombre completo, nombre de usuario más común y tu email entre comillas en buscadores. Repite la búsqueda con variantes (Ej: "Tu Nombre" + "Nombre de la Escuela").</p>
                    <h4 class="text-xl font-bold mt-4 mb-2">Paso 2: Rastreo de Brechas</h4>
                    <p>Utiliza herramientas como Have I Been Pwned? para verificar si tu correo o contraseña han sido comprometidos. Si aparece, cambia inmediatamente la contraseña y habilita la autenticación de dos factores.</p>
                    <h4 class="text-xl font-bold mt-4 mb-2">Paso 3: Rastreo de Cuentas Públicas</h4>
                    <p>Busca tu nombre de usuario común en redes y plataformas antiguas (Flickr, Myspace).</p>
                    <h4 class="text-xl font-bold mt-4 mb-2">Paso 4: Geolocalización/Bienes Raíces</h4>
                    <p>Revisa si sitios de directorios exponen tu número de teléfono o dirección de casa.</p>
                `
            },
            {
                title: "Fase 2: Evaluación y Saneamiento (La Desintoxicación Digital)",
                content: `
                    <h4 class="text-xl font-bold mb-2">Paso 5: Evaluación de Contenido</h4>
                    <p>Audita las publicaciones antiguas. Eliminar/Archivar/Ocultar el contenido que pueda perjudicarte profesionalmente. Cierra cuentas abandonadas.</p>
                    <h4 class="text-xl font-bold mt-4 mb-2">Paso 6: Eliminación de Directorios</h4>
                    <p>Si encuentras información en directorios (Paso 4), utiliza las herramientas de exclusión (opt-out) para solicitar la eliminación de tus datos.</p>
                    <h4 class="text-xl font-bold mt-4 mb-2">Paso 7: Gestión de Permisos de Apps</h4>
                    <p>Revisa la configuración de tu cuenta de Google y/o Facebook para revocar el acceso a aplicaciones de terceros que no uses o en las que no confíes.</p>
                `
            },
            {
                title: "Fase 3: Concientización Docente (Prácticas Proactivas)",
                content: `
                    <h4 class="text-xl font-bold mb-2">Paso 8: Principio de Minimización</h4>
                    <p>Solo comparte lo estrictamente necesario. Usa seudónimos o nombres ficticios para ejemplos en IA; no uses datos reales en plantillas públicas.</p>
                    <h4 class="text-xl font-bold mt-4 mb-2">Paso 9: Uso Ético de la IA</h4>
                    <p>Cuando uses LLMs, nunca subas documentos con información sensible (notas reales, historiales de alumnos). Siempre anonimizar los datos.</p>
                    <h4 class="text-xl font-bold mt-4 mb-2">Paso 10: Concientización en el Aula</h4>
                    <p>Utiliza este ejercicio para enseñarle a tus estudiantes a auditar y gestionar su propia huella digital.</p>
                `
            }
        ]
    },
    // Clase 3: PROMPT ENGINEERING AVANZADO PARA DOCENTES
    3: {
        title: "MÓDULO PRÁCTICO 3: Prompt Engineering Avanzado para Docentes",
        summary: "Dominar las técnicas avanzadas de prompting para generar contenido de alta calidad y adaptado (texto, imágenes conceptuales, guiones de video), transformando la IA en un verdadero co-creador de recursos educativos.",
        steps: [
            {
                title: "Estructura 1: Zero-Shot y Few-Shot Prompting (LLMs - Texto)",
                content: `
                    <h4 class="text-xl font-bold mb-2">Zero-Shot Prompting</h4>
                    <p>El modelo debe resolver la tarea sin ejemplos previos, confiando en su conocimiento general. Requiere instrucciones muy claras.</p>
                    <div class="mt-4 p-4 class-dark-3 rounded-lg text-white">
                        <strong>Ejemplo (Prompt):</strong> Actúa como corrector de estilo de nivel universitario. Reescribe el siguiente párrafo para lograr un tono más formal y académico. Párrafo: [pegar aquí].
                    </div>
                    <h4 class="text-xl font-bold mt-4 mb-2">Few-Shot Prompting</h4>
                    <p>Se proporciona al modelo un ejemplo (o varios) de la entrada y la salida esperada. Ideal para tareas de clasificación o formateo.</p>
                    <div class="mt-4 p-4 class-dark-3 rounded-lg text-white">
                        <strong>Ejemplo (Prompt):</strong> Clasifica la siguiente lista de verbos como Transitivos (T) o Intransitivos (I), siguiendo este formato: Ejemplo: Correr: (I), Comprar: (T). Lista: $$saltar, comer, viajar, leer$$.
                    </div>
                    <h4 class="text-xl font-bold mt-4 mb-2">Cadena de Pensamiento (CoT)</h4>
                    <p>Se pide a la IA que explique su razonamiento antes de dar la respuesta final. Esto mejora la precisión en tareas complejas.</p>
                    <div class="mt-4 p-4 class-dark-3 rounded-lg text-white">
                        <strong>Ejemplo (Prompt):</strong> Resuelve el siguiente problema matemático. Antes de dar el resultado final, explica paso a paso el método de resolución y justifica cada elección.
                    </div>
                `
            },
            {
                title: "Estructura 2: Prompting para Imágenes (Control Estético)",
                content: `
                    <p>El éxito en la imagen depende de la descripción exhaustiva de la estética y la técnica. Utiliza estas palabras clave:</p>
                    <ul class="list-disc pl-5 space-y-2 mt-4">
                        <li><strong>Sujeto/Tema:</strong> Descripción clara del concepto (un biólogo, un átomo, un evento histórico).</li>
                        <li><strong>Estilo Artístico (Clave):</strong> Define la técnica visual (Pixel Art, estilo Pixar, Acuarela, Dibujo 3D).</li>
                        <li><strong>Iluminación:</strong> Define el ambiente (Luz volumétrica, luz tenue de atardecer, iluminación dramática).</li>
                        <li><strong>Composición:</strong> Define el encuadre y la perspectiva (Vista cenital, primer plano, plano general).</li>
                    </ul>
                    <h4 class="text-xl font-bold mt-4 mb-2">Ejemplo Avanzado:</h4>
                    <div class="mt-4 p-4 class-dark-3 rounded-lg text-white">
                        <strong>Ejemplo:</strong> "Ilustración de una célula vegetal con estilo Pixel Art, colores vibrantes y neón, con una composición de vista microscópica que muestre un organelo como una pequeña fábrica."
                    </div>
                `
            },
            {
                title: "Estructura 3: Prompting para Guiones de Video y Audio",
                content: `
                    <p>Para generar un recurso multimedia, la IA debe estructurar el contenido en un formato de guion técnico/narrativo.</p>
                    <h4 class="text-xl font-bold mb-2">Guion de Video Explicativo (Ejemplo)</h4>
                    <p><strong>R:</strong> "Eres un guionista de YouTube para educación." <strong>T:</strong> "Crea un guion técnico de 60 segundos." <strong>E:</strong> "Tema: 'Las 3 leyes de Newton'. Divide el guion en 4 escenas. Cada escena debe incluir: Título, Diálogo y Descripción Visual de la animación." <strong>F:</strong> "El video debe ser atractivo para adolescentes."</p>
                    <h4 class="text-xl font-bold mt-4 mb-2">Audio de Práctica (Ejemplo)</h4>
                    <p><strong>R:</strong> "Eres un locutor profesional con voz clara." <strong>T:</strong> "Escribe un audio-quiz interactivo de 2 minutos." <strong>E:</strong> "Tema: 'El ciclo del agua'. El audio debe pausar y pedir al oyente que responda antes de revelar la respuesta." <strong>F:</strong> "Reforzar el aprendizaje autónomo."</p>
                `
            }
        ]
    },
    // Clase 4: GOOGLE AI (GEMINI Y NOTEBOOKLM) PARA LA GESTIÓN DOCENTE
    4: {
        title: "MÓDULO PRÁCTICO 4: Google AI (Gemini y NotebookLM) para la Gestión Docente",
        summary: "Integra Gemini y NotebookLM en las tareas cotidianas del docente (planificación, comunicación y análisis de documentos) para maximizar la productividad.",
        steps: [
            {
                title: "Estrategia 1: Planificación y Borradores con Gemini",
                content: `
                    <h4 class="text-xl font-bold mb-2">Generación de Ideas</h4>
                    <div class="mt-4 p-4 class-dark-4 rounded-lg text-white">
                        <strong>Prompt:</strong> R: "Actúa como experto en pedagogía por proyectos." T: "Genera 5 ideas de proyectos interdisciplinarios para el tema 'Inteligencia Artificial y Ética'." E: "Los proyectos deben ser de 3 semanas, evaluables y aptos para estudiantes de 17 años."
                    </div>
                    <h4 class="text-xl font-bold mt-4 mb-2">Planificación Detallada</h4>
                    <div class="mt-4 p-4 class-dark-4 rounded-lg text-white">
                        <strong>Prompt:</strong> R: "Eres un planificador de clases." T: "Crea un plan de 90 minutos para la Clase 3." E: "Incluye: objetivo de aprendizaje, una actividad de inicio (15 min), un desarrollo interactivo (50 min) y un cierre reflexivo (25 min)."
                    </div>
                    <h4 class="text-xl font-bold mt-4 mb-2">Diferenciación de Lectura</h4>
                    <div class="mt-4 p-4 class-dark-4 rounded-lg text-white">
                        <strong>Prompt:</strong> T: "Toma el siguiente texto sobre [pegar texto académico] y adaptalo a un nivel de lectura de 12 años, reemplazando el 50% de las palabras complejas."
                    </div>
                `
            },
            {
                title: "Estrategia 2: Organización y Análisis Profundo con NotebookLM",
                content: `
                    <h4 class="text-xl font-bold mb-2">Paso 1: Carga de Fuentes</h4>
                    <p>Sube el Diseño Curricular Anual de tu materia, un artículo clave de la bibliografía o tus apuntes de clase a un Notebook. Esto crea un contexto privado.</p>
                    <h4 class="text-xl font-bold mt-4 mb-2">Paso 2: Análisis Rápido</h4>
                    <div class="mt-4 p-4 class-dark-4 rounded-lg text-white">
                        <strong>Prompt:</strong> "Basándote únicamente en el Diseño Curricular 2024.pdf, lista los 5 objetivos de aprendizaje obligatorios para el primer trimestre."
                    </div>
                    <h4 class="text-xl font-bold mt-4 mb-2">Paso 3: Conexión de Conceptos</h4>
                    <p>Pídele a la IA que encuentre relaciones entre dos documentos cargados.</p>
                    <div class="mt-4 p-4 class-dark-4 rounded-lg text-white">
                        <strong>Prompt:</strong> "Encuentra 3 puntos en común entre el Artículo sobre IA y el Diseño Curricular que puedan formar la base de una nueva unidad didáctica."
                    </div>
                    <h4 class="text-xl font-bold mt-4 mb-2">Paso 4: Generación de Cuestionario</h4>
                    <p>Pídele que genere material de estudio basado en una de las fuentes.</p>
                    <div class="mt-4 p-4 class-dark-4 rounded-lg text-white">
                        <strong>Prompt:</strong> "Genera 15 preguntas de opción múltiple basadas en el contenido de Apuntes de Clase 4."
                    </div>
                `
            },
            {
                title: "Estrategia 3: Comunicación Asistida (Gmail)",
                content: `
                    <h4 class="text-xl font-bold mb-2">Respuesta a un Padre</h4>
                    <div class="mt-4 p-4 class-dark-4 rounded-lg text-white">
                        <strong>Instrucción:</strong> "Redacta una respuesta formal, alentadora y breve, confirmando la hora de la reunión y ofreciendo un punto de agenda sobre el progreso del estudiante."
                    </div>
                    <h4 class="text-xl font-bold mt-4 mb-2">Anuncio de Proyecto</h4>
                    <div class="mt-4 p-4 class-dark-4 rounded-lg text-white">
                        <strong>Instrucción:</strong> "Genera un comunicado por correo a los estudiantes anunciando el Proyecto Final. Tono: motivador, profesional. Incluye la fecha límite y dónde encontrar la rúbrica."
                    </div>
                `
            }
        ]
    },
    // Clase 5: MANUAL DE USO Y VERIFICACIÓN DE CANVA PARA DOCENTES
    5: {
        title: "MÓDULO PRÁCTICO 5: Manual de Uso y Verificación de Canva para Docentes",
        summary: "Obtener la cuenta gratuita de Canva para Educación (Pro) y dominar el uso de sus herramientas de IA (Magic Design, Magic Write, Texto a Imagen) para la creación ágil de materiales didácticos.",
        steps: [
            {
                title: "Fase 1: Guía de Verificación de Canva para Educación (Argentina)",
                content: `
                    <h4 class="text-xl font-bold mb-2">Paso 1: Requisitos de Elegibilidad</h4>
                    <p>Necesitas ser docente en ejercicio en una institución educativa. La documentación necesaria es una prueba de tu estado docente (recibo de sueldo, carta de la institución o credencial/ID de docente con fecha válida).</p>
                    <h4 class="text-xl font-bold mt-4 mb-2">Paso 2: Inicio del Registro</h4>
                    <ol class="list-decimal pl-5 space-y-2">
                        <li><strong>Acceso:</strong> Ve al sitio de Canva para Educación.</li>
                        <li><strong>Registro:</strong> Regístrate con tu correo institucional (recomendado) o personal, seleccionando "Soy docente".</li>
                        <li><strong>Datos:</strong> Completa los datos personales, el nombre de tu escuela y el país (Argentina).</li>
                    </ol>
                    <h4 class="text-xl font-bold mt-4 mb-2">Paso 3: Verificación Documental</h4>
                    <p>Si la verificación no es automática con tu dominio de correo, sube el documento de prueba (recibo de sueldo, credencial). La verificación tarda entre 24 y 72 horas (o hasta 7 días en períodos de alta demanda).</p>
                `
            },
            {
                title: "Fase 2: Creación Rápida de Contenido con IA (Magic Studio)",
                content: `
                    <h4 class="text-xl font-bold mb-2">Herramienta: Magic Write (Texto de Diapositiva)</h4>
                    <div class="mt-4 p-4 class-dark-5 rounded-lg text-white">
                        <strong>Uso:</strong> Redacción de introducciones, títulos y descripciones concisas. Abre un documento, selecciona Magic Write, y usa un prompt. Ejemplo: "Genera una introducción de 3 frases para una presentación sobre los derechos de autor en la era digital."
                    </div>
                    <h4 class="text-xl font-bold mt-4 mb-2">Herramienta: Texto a Imagen (Ilustraciones Únicas)</h4>
                    <div class="mt-4 p-4 class-dark-5 rounded-lg text-white">
                        <strong>Uso:</strong> Crear ilustraciones únicas. Ve a Apps > Texto a Imagen. Prompt: Sé muy específico sobre el estilo que quieres (ej. "Un algoritmo en forma de cerebro con estilo dibujo animado, colores azules y verdes, vista isométrica.").
                    </div>
                    <h4 class="text-xl font-bold mt-4 mb-2">Herramienta: Magic Design (Diseño de Plantillas/Infografías)</h4>
                    <div class="mt-4 p-4 class-dark-5 rounded-lg text-white">
                        <strong>Uso:</strong> Crear un diseño base profesional en segundos. En la página de inicio, selecciona Magic Design. Sube una imagen clave o escribe un tema (ej. "Infografía sobre los riesgos de la IA").
                    </div>
                `
            }
        ]
    },
    // Clase 6: DERECHOS DE AUTOR, REGISTRO Y LICENCIAS CREATIVE COMMONS
    6: {
        title: "MÓDULO PRÁCTICO 6: Derechos de Autor, Registro y Licencias Creative Commons",
        summary: "Comprender el marco legal de derechos de autor, aplicar las licencias Creative Commons (CC) más adecuadas para el ámbito educativo y conocer el procedimiento de registro formal en Argentina (DNDA).",
        steps: [
            {
                title: "Estrategia 1: La Cuestión de la Autoría en la Era de la IA",
                content: `
                    <h4 class="text-xl font-bold mb-2">Paso 1: Determinar la Intervención Humana</h4>
                    <p>Evalúa si tu trabajo fue más allá de un prompt simple (50 iteraciones, edición, adición de texto original). Si tu trabajo va más allá del simple comando, eres el autor del resultado. Si la IA lo hizo todo sola, el material es de dominio público.</p>
                    <h4 class="text-xl font-bold mt-4 mb-2">Paso 2: Revisar T&C de la Plataforma</h4>
                    <p>Las plataformas de IA (DALL-E, Midjourney, ChatGPT) tienen sus propias políticas. Revisa si la plataforma te cede los derechos de uso comercial y autoría (la mayoría lo hacen en sus planes de pago).</p>
                    <h4 class="text-xl font-bold mt-4 mb-2">Resultado Ideal: CC BY-NC-SA</h4>
                `
            },
            {
                title: "Estrategia 2: Aplicación de Licencias Creative Commons (CC)",
                content: `
                    <h4 class="text-xl font-bold mb-2">Componentes Clave para el Docente:</h4>
                    <ul class="list-disc pl-5 space-y-2">
                        <li><strong>BY (Reconocimiento):</strong> SIEMPRE OBLIGATORIO. El autor debe ser citado.</li>
                        <li><strong>NC (No Comercial):</strong> Recomendada para proteger tu material de usos comerciales por terceros.</li>
                        <li><strong>SA (Compartir Igual):</strong> Recomendada para mantener los recursos educativos abiertos (las obras derivadas deben mantener la misma licencia).</li>
                        <li><strong>ND (Sin Derivadas):</strong> Desaconsejada en educación, ya que limita la adaptación curricular.</li>
                    </ul>
                `
            },
            {
                title: "Estrategia 3: Registro Formal en Argentina (DNDA)",
                content: `
                    <h4 class="text-xl font-bold mb-2">Paso 1: Acceso a TAD (Trámites a Distancia)</h4>
                    <p>Ingresa a la plataforma Trámites a Distancia. Busca el servicio de la Dirección Nacional del Derecho de Autor (DNDA).</p>
                    <h4 class="text-xl font-bold mt-4 mb-2">Paso 2: Completar Formulario</h4>
                    <p>Rellena los datos del autor y de la obra (título, género, mención de ISBN si aplica, etc.).</p>
                    <h4 class="text-xl font-bold mt-4 mb-2">Paso 3: Subida y Pago</h4>
                    <p>Sube el archivo de tu obra digital (PDF, DOC). Realiza el pago de la tasa vigente.</p>
                    <h4 class="text-xl font-bold mt-4 mb-2">Paso 4: Finalización</h4>
                    <p>Recibirás un número de expediente y, posteriormente, el certificado de registro.</p>
                `
            }
        ]
    }
};