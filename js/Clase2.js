// js/Clase2.js

// Añade los bloques de la Clase 2 a la matriz global CLASS_CONTENT
CLASS_CONTENT.push({
    id: 2,
    title: "Clase 2: Riesgos, sesgos y desafíos éticos",
    subtitle: "La IA no es neutra. Aprende a identificar sus fallas y sus sesgos para proteger la ciudadanía digital.",
    teaser: "Desnaturaliza la IA. Analiza las <strong>'alucinaciones'</strong> (errores) del sistema, los diferentes tipos de sesgos y los riesgos de privacidad en plataformas cotidianas.",
    blocks: [
        { 
            title: "1. Conociendo sobre el tema: Alucinaciones y Sesgos", 
            icon: "shield-alert",
            content: `<p class="mb-4">La IA atraviesa nuestra vida cotidiana. El primer paso es <strong>desnaturalizar</strong> y cuestionar esta tecnología. Las mal llamadas <strong>alucinaciones</strong> son fallas donde la IA produce resultados inesperados, sin sentido o **datos completamente inventados**. Esto cuestiona la fiabilidad, ya que a veces ni siquiera los diseñadores entienden por qué ocurren los errores.</p><h4 class="text-xl font-bold mt-4 mb-2">Sesgos:</h4><p class="mb-4">Un sesgo es como tener una balanza que se inclina hacia un lado, replicando prejuicios humanos presentes en los datos. <strong>La calidad del resultado es directamente proporcional a la calidad de sus datos.</strong></p><p class="mt-4 font-semibold italic">Profundiza sobre estos temas: <a href="https://www.educ.ar/recursos/159082/sesgos-citas-falsas-y-alucinaciones-fallas-en-la-ia" target="_blank" class="text-accent underline hover:text-blue-700">Sesgos, citas falsas y alucinaciones</a>.</p>`,
            keywords: "riesgos, sesgos, alucinaciones, verificación"
        },
        { 
            title: "2. Tipos de Sesgos y la Huella Digital", 
            icon: "balance-horizontal",
            content: `<h4 class="text-xl font-bold mt-4 mb-2">Tipos de Sesgos (Ampliación):</h4><p class="mb-4">Los sesgos reflejan fallas en la calidad de los datos.</p><ul class="list-disc pl-5 space-y-2"><li><strong>Sesgo de Medición:</strong> Surge por datos incompletos, que no incluyen a toda la población relevante.</li><li><strong>Sesgo Estereotipador:</strong> Refuerza estereotipos nocivos (ej. asociar ciertos idiomas con géneros).</li><li><strong>Sesgo de Confirmación:</strong> La IA se basa demasiado en tendencias preexistentes, duplicando sesgos existentes.</li></ul><h4 class="text-xl font-bold mt-6 mb-2">Huella Digital y Privacidad:</h4><p class="mb-4">Cada comentario, like y búsqueda conforma nuestra **huella digital**. Es fundamental revisar los avisos de privacidad y entender las cookies para proteger nuestros datos.</p><p class="mt-4 font-semibold italic">Artículo sobre cookies: <a href="https://www.argentina.gob.ar/justicia/convosenlaweb/situaciones/tengo-que-aceptar-las-cookies-cuando-navego-en-internet" target="_blank" class="text-accent underline hover:text-blue-700">Tengo que aceptar las cookies cuando navego en internet</a>.</p>`,
            keywords: "tipos, sesgos, huella, datos"
        },
        { 
            title: "3. Ahora te toca a vos: Protocolo de Auditoría de Huella Digital", 
            icon: "footprints",
            content: `<p class="mb-4">Este módulo práctico se centra en la **auditoría y gestión consciente de la huella digital**, un riesgo potencial para la privacidad y reputación profesional.</p><h4 class="text-xl font-bold mt-4 mb-2">Fase 1: Detección y Escaneo (Protocolo de Auditoría):</h4><ul class="list-disc pl-5 space-y-2"><li><strong>Búsqueda de Identidad:</strong> Busca tu nombre completo y email entre comillas en Google/Bing.</li><li><strong>Rastreo de Brechas:</strong> Usa herramientas como **Have I Been Pwned?** para verificar si tu correo fue comprometido.</li><li><strong>Rastreo de Cuentas Públicas:</strong> Lista las cuentas activas y obsoletas.</li></ul><h4 class="text-xl font-bold mt-6 mb-2">Fase 2: Evaluación y Saneamiento:</h4><p class="mb-4">Audita publicaciones antiguas, elimina/desactiva cuentas obsoletas y **revoca el acceso a aplicaciones de terceros**.</p><p class="font-semibold"><strong>Práctica Proactiva:</strong> Cuando uses IA generativa para tareas laborales, nunca ingreses datos personales identificables de estudiantes en IA generativa (Anonimización obligatoria).</p>`,
            keywords: "huella, gestion, auditoria, privacidad"
        },
        {
            title: "4. Para saber más: Riesgos y Recursos",
            icon: "lock",
            content: `<p class="mb-4"><strong>Riesgos de Privacidad:</strong> Los chats de **WhatsApp** están encriptados de extremo a extremo, pero los de Facebook Messenger e Instagram no lo están por defecto, lo que permite a Meta acceder a las conversaciones para fines de moderación, publicidad y mejora de servicios.</p><p class="mb-4"><strong>Políticas:</strong> Es crucial que los desarrolladores implementen medidas estrictas como **anonimizar los datos** y obtener el **consentimiento explícito** del usuario.</p><p class="mt-4 font-semibold italic">Video Recomendado: Inteligencia Artificial: ¿Amiga o Enemiga? | Diego Fernández Slezak | TEDxRiodelaPlata</p><div class="aspect-video mt-4"><iframe class="w-full h-full rounded-lg shadow-xl" src="https://www.youtube.com/embed/znq3ql6wqnE" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe></div><p class="mt-4 font-semibold italic">Video de Debate: Foro de Debate: ¿Y CUÁLES SON LOS RIESGOS Y OPORTUNIDADES?</p><div class="aspect-video mt-4"><iframe class="w-full h-full rounded-lg shadow-xl" src="https://www.youtube.com/embed/GA_t5vfgK8g" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe></div>`,
            keywords: "privacidad, meta, riesgos, datos"
        }
    ]
});