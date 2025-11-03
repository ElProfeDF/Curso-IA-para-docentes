// app.js
// Depende de data_base.js (CLASS_COLORS, CLASS_CONTENT, ACTIVITY_CONTENT_MAP)

// Constantes de DOM (Inicializadas tras la carga)
const contentContainer = document.getElementById('content-container');
const dashboardBtn = document.getElementById('dashboard-btn');
const progressDisplay = document.getElementById('progress-display');
const currentClassDisplay = document.getElementById('current-class-display');
const quizModal = document.getElementById('quiz-modal');
const contentModal = document.getElementById('content-modal');

let currentView = 'dashboard'; 
let currentClassId = null;
let currentBlockIndex = 0; 
let currentStepIndex = 0; // Para navegar dentro del modal de Actividad

// Función para renderizar íconos de Lucide
function renderIcons() {
    if (typeof lucide !== 'undefined' && lucide.createIcons) {
        lucide.createIcons();
    }
}

// Lógica de progreso y estado
function checkCompletion() {
    const completedCount = Object.values(courseProgress).filter(p => p).length;
    progressDisplay.textContent = `${completedCount} / ${CLASS_CONTENT.length} (${Math.round((completedCount / CLASS_CONTENT.length) * 100)}%)`;
    
    // Si completó todas las clases y el modal de felicitación no se ha mostrado
    if (completedCount === CLASS_CONTENT.length && !certificationModalShown) {
        setTimeout(showCertificationModal, 500);
    }
}

function markClassComplete(classId) {
    courseProgress[classId] = true;
    checkCompletion();
    renderDashboard();
}

function isClassCompleted(classId) {
    return courseProgress[classId] === true;
}

function closeModal(modalId) {
    document.getElementById(modalId).classList.add('hidden');
    if (modalId === 'content-modal') {
        // Si cierras el modal de contenido, vuelve al menú de bloques de la clase
        renderClassBlocks(); 
    }
}

// --- GESTIÓN DEL CERTIFICADO ---

// Función para simular la descarga del certificado con datos del usuario
function downloadCertificate(name, documentId) {
    // Es esencial esperar a que jsPDF esté disponible.
    if (typeof window.jspdf === 'undefined') {
        alert("Error: Las librerías de generación de certificado (jsPDF) aún no están cargadas. Intenta recargar la página.");
        return;
    }

    // eslint-disable-next-line no-undef
    const { jsPDF } = window.jspdf;
    
    // Dimensiones A4 en mm (horizontal: 297 x 210)
    const doc = new jsPDF('l', 'mm', 'a4');
    const pageWidth = doc.internal.pageSize.getWidth();
    const pageHeight = doc.internal.pageSize.getHeight();

    const imagePath = 'certificado_base.png'; // Ruta confirmada
    const image = new Image();
    image.src = imagePath;

    image.onload = function() {
        // Añadir la imagen como fondo (ajustada para cubrir toda la página)
        // Usamos PNG, por lo que el formato 'PNG' es clave.
        doc.addImage(image, 'PNG', 0, 0, pageWidth, pageHeight);

        // --- INCRUSTACIÓN DE DATOS DEL USUARIO ---
        
        // 1. Título (Datos Personales)
        doc.setFont('Helvetica', 'bold');
        doc.setFontSize(28); // Tamaño grande para el nombre
        doc.setTextColor(0, 0, 0); // Color Negro

        // Coordenadas AJUSTADAS para el espacio debajo de "Otorgado a" y sobre la línea horizontal.
        const textY = 105; // Ajuste final para subirlo
        
        // Dibuja el nombre y apellido
        doc.text(name.toUpperCase(), pageWidth / 2, textY, { align: 'center' });

        // 2. Información Adicional (Documento)
        doc.setFont('Helvetica', 'normal');
        doc.setFontSize(14);
        doc.setTextColor(50, 50, 50); // Color gris oscuro
        
        // Dibuja el DNI/CI justo debajo del nombre
        const documentText = `DNI/CI: ${documentId}`;
        doc.text(documentText, pageWidth / 2, textY + 6, { align: 'center' });


        // Guardar el PDF
        doc.save(`Certificado_IA_Docentes_${name.replace(/\s/g, '_')}.pdf`);
    };

    image.onerror = function() {
        alert(`Error: No se pudo cargar la imagen del certificado en la ruta: ${imagePath}.`);
    };
}


// Modal para ingresar datos del certificado
function showCertificationInputModal() {
    const modalHtml = `
        <div class="relative w-11/12 max-w-lg bg-white rounded-lg shadow-2xl p-8 text-center">
            <button onclick="closeModal('quiz-modal')" class="absolute top-2 right-2 text-gray-800 hover:text-red-600 transition">
                <i data-lucide="x" class="w-6 h-6"></i>
            </button>
            <h3 class="text-2xl font-bold text-gray-800 mb-4">Ingresa tus Datos para el Certificado</h3>
            <p class="text-gray-600 mb-6">Por favor, escribe tu nombre completo y número de documento. Estos datos aparecerán en el certificado oficial del curso.</p>
            
            <form id="certificate-form" onsubmit="event.preventDefault(); submitCertificateData();">
                <div class="mb-4 text-left">
                    <label for="fullName" class="block text-sm font-medium text-gray-700">Nombre y Apellido:</label>
                    <input type="text" id="fullName" required class="mt-1 block w-full rounded-md border-gray-300 shadow-sm p-2 border" placeholder="Ej: Juan Pérez">
                </div>
                <div class="mb-6 text-left">
                    <label for="documentId" class="block text-sm font-medium text-gray-700">Número de Documento (DNI/CI):</label>
                    <input type="text" id="documentId" required class="mt-1 block w-full rounded-md border-gray-300 shadow-sm p-2 border" placeholder="Ej: 99.999.999">
                </div>
                <button type="submit" class="bg-accent text-white font-bold py-2 px-8 rounded-full hover:bg-opacity-90 transition transform hover:scale-105 shadow-md">
                    Descargar Certificado
                </button>
            </form>
        </div>
    `;
    quizModal.innerHTML = modalHtml;
    quizModal.classList.remove('hidden');
    renderIcons();
}

function submitCertificateData() {
    const fullName = document.getElementById('fullName').value.trim();
    const documentId = document.getElementById('documentId').value.trim();
    
    if (fullName && documentId) {
        closeModal('quiz-modal');
        // Llama a la función de descarga REAL con los datos
        downloadCertificate(fullName, documentId); 
    } else {
        alert("Por favor, completa todos los campos.");
    }
}

// Modal de Felicitación por Finalización del Curso
function showCertificationModal() {
    certificationModalShown = true; // Marcar que ya se mostró
    const completedClasses = Object.values(courseProgress).filter(p => p).length;
    
    const summaryHtml = `
        <div class="text-center p-8">
            <i data-lucide="trophy" class="w-24 h-24 mx-auto text-yellow-500 mb-4"></i>
            <h2 class="text-3xl font-extrabold text-gray-800 mb-2">¡Felicidades, Curso Completado!</h2>
            <p class="text-lg text-gray-600 mb-6">Has completado con éxito todas las clases de IA para Docentes.</p>
            
            <div class="bg-gray-100 p-4 rounded-lg mb-8">
                <h3 class="text-xl font-bold mb-2">Resumen de tu Logro:</h3>
                <p class="text-gray-700">Clases completadas: <strong>${completedClasses} de ${CLASS_CONTENT.length}</strong></p>
                <p class="text-gray-700">¡Ahora eres un <strong>Agente de Cambio</strong> potencial en el aula!</p>
            </div>
            
            <div class="flex flex-col sm:flex-row justify-center space-y-4 sm:space-y-0 sm:space-x-4">
                <button onclick="closeModal('quiz-modal');" class="bg-gray-600 text-white font-bold py-3 px-8 rounded-full hover:bg-gray-700 transition transform hover:scale-105 shadow-lg">
                    Volver y Navegar
                </button>
                <button onclick="showCertificationInputModal()" class="bg-green-600 text-white font-bold py-3 px-8 rounded-full hover:bg-green-700 transition transform hover:scale-105 shadow-lg">
                    <i data-lucide="download" class="w-5 h-5 inline-block mr-2"></i> Obtener Certificado
                </button>
            </div>
        </div>
    `;
    
    quizModal.innerHTML = `
        <div class="relative w-11/12 max-w-2xl bg-white rounded-lg shadow-2xl">
            ${summaryHtml}
        </div>
    `;
    quizModal.classList.remove('hidden');
    renderIcons();
}

// --- RENDERING DE VISTAS (resto del código) ---

function renderDashboard() {
    currentView = 'dashboard';
    currentClassId = null;
    currentBlockIndex = 0;
    dashboardBtn.classList.add('hidden');
    currentClassDisplay.classList.add('hidden');
    
    checkCompletion(); // Llama a checkCompletion que ahora usa certificationModalShown

    const welcomeMessage = `
        <div class="p-8 md:p-12 mb-8 bg-white rounded-xl shadow-lg border-t-4 border-accent">
            <div class="flex flex-col items-center text-center">
                <div class="w-full max-w-xl h-24 bg-accent rounded-lg mb-4 shadow-md flex items-center justify-center">
                    <h3 class="text-3xl font-extrabold text-white">Lidera la Transformación Educativa con IA</h3>
                </div>
                <h2 class="text-3xl sm:text-4xl font-extrabold text-gray-800 mb-1">¡Bienvenido al Panel de Liderazgo!</h2>
                <p id="typing-text" class="text-xl text-gray-600 font-light typing-animation max-w-lg mx-auto border-r-2 border-gray-600">
                    Tu camino hacia la maestría en IA comienza aquí.
                </p>
            </div>

            <div class="text-left max-w-xl mx-auto mt-6 p-4 bg-gray-50 rounded-lg">
                <h3 class="font-bold text-lg mb-2 text-accent">La Espiral de Aprendizaje: Cómo Cursar</h3>
                <ul class="list-disc pl-5 text-sm mt-2 text-gray-700 space-y-1">
                    <li><strong>Secuencia:</strong> Todas las clases están <strong>desbloqueadas</strong> para tu libre navegación. Sigue el orden recomendado para un mejor aprendizaje.</li>
                    <li><strong>Bloques:</strong> Dentro de cada Clase, navega por los temas (Bloques) usando los botones de colores. Debes recorrer todos los bloques para completar la unidad.</li>
                    <li><strong>Progreso:</strong> La clase se marca como completada automáticamente al finalizar los bloques, o puedes marcarla manualmente con el botón en la cabecera.</li>
                </ul>
            </div>
        </div>
    `;

    // Grid de Clases
    let classesHtml = CLASS_CONTENT.map((cls) => {
        const color = CLASS_COLORS.find(c => c.id === cls.id);
        const isCompleted = isClassCompleted(cls.id);
        
        // Estilos dinámicos para las tarjetas
        let buttonClass = '';
        let iconColorClass = '';
        if (isCompleted) {
            // Estilo para clase completada (usa estilos grises definidos en CSS)
            buttonClass = 'class-completed';
            iconColorClass = 'text-green-600';
        } else {
            // Estilo normal (color de clase + efecto neón)
            // APLICAMOS SIEMPRE block-btn-base AQUÍ para asegurar estilos de color y puntero.
            buttonClass = `${color.name} ${color.shadow} hover:shadow-2xl hover:scale-[1.01] transition transform duration-300 block-btn-base`;
            iconColorClass = 'text-gray-200';
        }

        const icon = isCompleted ? 'check-circle' : 'arrow-right-circle';
        const teaserContent = cls.teaser.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>');

        return `
            <button onclick="enterClass(${cls.id})"
                    class="${buttonClass} p-6 rounded-xl text-left flex flex-col justify-between h-full w-full">
                <div class="flex items-center justify-between mb-4">
                    <span class="text-xs font-bold uppercase opacity-80">Clase ${cls.id}</span>
                    <i data-lucide="${icon}" class="w-6 h-6 ${iconColorClass}"></i>
                </div>
                <h3 class="text-2xl font-bold mb-2">${cls.title}</h3>
                <p class="text-sm opacity-90">${teaserContent}</p>
                <span class="text-sm font-medium pt-3 border-t border-dashed ${isCompleted ? 'border-gray-400' : 'border-white/30'} mt-3">
                    ${isCompleted ? 'Módulo Revisado' : '¡Aprender ahora! →'}
                </span>
            </button>
        `;
    }).join('');

    contentContainer.innerHTML = `
        ${welcomeMessage}
        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            ${classesHtml}
        </div>
    `;

    renderIcons();
}

function enterClass(classId) {
    currentClassId = classId;
    currentView = 'class';
    dashboardBtn.classList.remove('hidden');
    currentClassDisplay.classList.remove('hidden');
    
    // Al entrar a una clase, renderizamos la vista de bloques
    renderClassBlocks();
}

function renderClassBlocks() {
    const cls = CLASS_CONTENT.find(c => c.id === currentClassId);
    const color = CLASS_COLORS.find(c => c.id === currentClassId);
    const completed = isClassCompleted(currentClassId);

    currentClassDisplay.textContent = `Estás en: Clase ${cls.id}`;

    // Botón de completado manual
    const completionButton = completed 
        ? `<button disabled class="bg-gray-400 text-white font-bold py-2 px-4 rounded-full opacity-70 cursor-not-allowed">
            <i data-lucide="check-circle" class="w-5 h-5 inline-block mr-2"></i> Clase Completada
           </button>`
        : `<button onclick="markClassComplete(${cls.id})" class="bg-white text-gray-800 font-bold py-2 px-4 rounded-full shadow-lg hover:bg-gray-100 transition transform hover:scale-[1.02]">
            <i data-lucide="check" class="w-5 h-5 inline-block mr-2"></i> Marcar como Completada
           </button>`;

    // Aplicar el color y el sombreado dinámico al Header de la clase
    // Se agregan clases responsivas al contenedor del encabezado
    const classHeader = `
        <div class="p-8 md:p-10 mb-8 ${color.name} rounded-xl text-white shadow-xl flex flex-col sm:flex-row justify-between items-start sm:items-center class-header-responsive">
            <div>
                <h2 class="text-3xl sm:text-4xl font-extrabold mb-2">${cls.title}</h2>
                <p class="text-xl opacity-90">${cls.subtitle}</p>
            </div>
            <div class="flex-shrink-0 ml-0 sm:ml-4 class-header-button-wrapper">
                ${completionButton}
            </div>
        </div>
    `;
    
    // Grid de Bloques - Aplicando el color dinámico y el efecto Neón a los botones internos
    let blocksHtml = cls.blocks.map((block, index) => {
        const blockNumber = index + 1;
        const color = CLASS_COLORS.find(c => c.id === currentClassId);
        const buttonClass = `${color.name} ${color.shadow} hover:bg-opacity-90 hover:scale-[1.03] transition transform duration-200`;
        
        // Determinar si el bloque es la actividad práctica para usar la función específica
        const clickAction = block.title.includes('Ahora te toca a vos') ? `showActivityModal(${currentClassId})` : `showContentModal(${currentClassId}, ${index})`;

        return `
            <button onclick="${clickAction}" 
                    class="${buttonClass} p-5 rounded-lg text-left flex items-center justify-between block-btn-base h-full w-full text-lg font-bold">
                <span>${blockNumber}. ${block.title}</span>
                <i data-lucide="${block.icon}" class="w-6 h-6 ml-4"></i>
            </button>
        `;
    }).join('');

    contentContainer.innerHTML = `
        ${classHeader}
        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            ${blocksHtml}
        </div>
    `;
    
    renderIcons();
}

// Función para renderizar contenido con color de fondo de la clase (Adaptada)
function createContentSection(content, colorClassName) {
    // Usamos el color de la clase como fondo del contenedor de contenido
    const blockContentHtml = `<div class="p-6 rounded-xl text-white ${colorClassName} shadow-lg h-full"><div class="text-lg space-y-4 prose max-w-none text-white">${content}</div></div>`;

    return blockContentHtml;
}

// Función central para mostrar CUALQUIER contenido teórico o de "Para saber más"
function showContentModal(classId, blockIndex) {
    currentClassId = classId;
    renderBlockContentInModal(classId, blockIndex);
}

// Nueva función para mostrar la actividad práctica
function showActivityModal(classId) {
    currentClassId = classId;
    renderActivityMenu(classId);
}

function renderBlockContentInModal(classId, blockIndex) {
    currentBlockIndex = blockIndex; // Actualizar el índice del bloque actual
    const cls = CLASS_CONTENT.find(c => c.id === classId);
    const block = cls.blocks[blockIndex];
    const totalBlocks = cls.blocks.length;
    const color = CLASS_COLORS.find(c => c.id === classId);

    // Renderiza el contenido dentro del contenedor de color
    const contentHtml = createContentSection(block.content, color.name);

    const navigationHtml = `
        <div class="flex justify-between mt-8 pt-4 border-t border-gray-200">
            <button onclick="navigateContentModal(${blockIndex - 1})" 
                    class="py-2 px-4 ${blockIndex === 0 ? 'opacity-50 cursor-not-allowed' : 'bg-gray-200 hover:bg-gray-300'} rounded-lg transition" 
                    ${blockIndex === 0 ? 'disabled' : ''}>
                <i data-lucide="arrow-left" class="w-5 h-5 inline-block mr-2"></i> Anterior
            </button>
            <button onclick="closeModal('content-modal')" class="py-2 px-4 bg-gray-200 hover:bg-gray-300 rounded-lg transition">
                Volver a Bloques
            </button>
            <button onclick="navigateContentModal(${blockIndex + 1})" 
                    class="py-2 px-4 ${color.shadow} ${blockIndex === totalBlocks - 1 ? `${color.name} text-white` : `${color.name} text-white`} rounded-lg transition">
                ${blockIndex === totalBlocks - 1 ? 'Finalizar Clase' : 'Siguiente'} <i data-lucide="arrow-right" class="w-5 h-5 inline-block ml-2"></i>
            </button>
        </div>
    `;

    const modalHtml = `
        <div class="p-8 md:p-12 bg-white rounded-xl shadow-2xl w-full max-w-4xl relative overflow-y-auto max-h-[90vh]">
            <button onclick="closeModal('content-modal')" class="absolute top-2 right-2 text-gray-800 hover:text-red-600 transition">
                <i data-lucide="x" class="w-6 h-6"></i>
            </button>
            <div class="mb-6 pb-4 border-b border-gray-300">
                <span class="text-sm font-semibold text-gray-500">Clase ${cls.id} / Bloque ${blockIndex + 1} de ${totalBlocks}</span>
                <h3 class="text-3xl font-extrabold mt-1 text-gray-800">${block.title}</h3>
            </div>
            
            ${contentHtml}
            
            ${navigationHtml}
        </div>
    `;

    contentModal.innerHTML = modalHtml;
    contentModal.classList.remove('hidden');
    renderIcons();
}

function navigateContentModal(newIndex) {
    const cls = CLASS_CONTENT.find(c => c.id === currentClassId);
    
    if (newIndex >= 0 && newIndex < cls.blocks.length) {
        const nextBlock = cls.blocks[newIndex];
        
        // Si el siguiente bloque es la actividad práctica, mostramos el menú de actividad
        if (nextBlock.title.includes('Ahora te toca a vos')) {
            showActivityModal(currentClassId);
        } else {
            // Si es un bloque de contenido normal o "Para saber más"
            renderBlockContentInModal(currentClassId, newIndex); 
        }
    } else if (newIndex >= cls.blocks.length) {
        // Lógica de avance de clase: si pasa el último bloque (Bloque 4, índice 3), la marca como completa
        markClassComplete(currentClassId);
        closeModal('content-modal');
    }
}

// Lógica del Modal de Actividad (Implementada con ACTIVITY_CONTENT_MAP)

function renderActivityMenu(classId) {
    const cls = ACTIVITY_CONTENT_MAP[classId];
    const color = CLASS_COLORS.find(c => c.id === classId);
    
    // Si la actividad no existe, usamos el mensaje de fallback
    if (!cls) {
        const classInfo = CLASS_CONTENT.find(c => c.id === classId);
        const menuHtml = `
            <div class="p-8 md:p-12 bg-white rounded-xl shadow-2xl w-11/12 max-w-xl relative text-center">
                <button onclick="closeModal('content-modal')" class="absolute top-2 right-2 text-gray-800 hover:text-red-600 transition">
                    <i data-lucide="x" class="w-6 h-6"></i>
                </button>
                <h2 class="text-3xl font-extrabold text-gray-800 mb-2">${classInfo.title}: ¡Módulo Práctico!</h2>
                <p class="text-lg text-gray-600 mb-6">El contenido detallado para este módulo práctico aún no está cargado.</p>
                <button onclick="closeModal('content-modal')" class="mt-8 py-2 px-4 bg-gray-200 hover:bg-gray-300 rounded-lg transition">
                    Volver al Menú de la Clase
                </button>
            </div>
        `;
        contentModal.innerHTML = menuHtml;
        contentModal.classList.remove('hidden');
        renderIcons();
        return;
    }
    
    // Lógica para renderizar el menú de pasos de la actividad
    const stepsHtml = cls.steps.map((step, index) => {
        const stepClass = `${color.name} ${color.shadow} hover:bg-opacity-90 hover:scale-[1.02] transition transform duration-200`;
        const stepTitle = step.title.includes("Fase") || step.title.includes("Módulo") || step.title.includes("Estructura") ? step.title : `Paso ${index + 1}: ${step.title}`;
        
        return `
            <button onclick="renderActivityStep(${classId}, ${index})" 
                    class="${stepClass} p-4 rounded-lg text-left block-btn-base h-full w-full text-lg font-bold">
                <span>${stepTitle}</span>
                <i data-lucide="chevron-right" class="w-6 h-6 ml-4 inline-block"></i>
            </button>
        `;
    }).join('');

    const menuHtml = `
        <div class="p-8 md:p-12 bg-white rounded-xl shadow-2xl w-full max-w-4xl relative">
            <button onclick="closeModal('content-modal')" class="absolute top-2 right-2 text-gray-800 hover:text-red-600 transition">
                <i data-lucide="x" class="w-6 h-6"></i>
            </button>
            <h2 class="text-3xl font-extrabold text-gray-800 mb-2">${cls.title}</h2>
            <p class="text-lg text-gray-600 mb-6">${cls.summary}</p>

            <h3 class="font-bold text-2xl text-accent mb-4">Selecciona un paso para comenzar:</h3>
            <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                ${stepsHtml}
            </div>
            <button onclick="closeModal('content-modal')" class="mt-8 py-2 px-4 bg-gray-200 hover:bg-gray-300 rounded-lg transition">
                Volver al Menú de la Clase
            </button>
        </div>
    `;
    
    contentModal.innerHTML = menuHtml;
    contentModal.classList.remove('hidden');
    renderIcons();
}

function renderActivityStep(classId, stepIndex) {
    currentClassId = classId;
    currentStepIndex = stepIndex;
    const cls = ACTIVITY_CONTENT_MAP[currentClassId];
    const step = cls.steps[stepIndex];
    const totalSteps = cls.steps.length;
    const color = CLASS_COLORS.find(c => c.id === currentClassId);
    
    // Utilizamos el color principal de la clase para el fondo del contenido del paso
    const contentHtml = `<div class="p-6 rounded-xl text-white ${color.name} shadow-lg h-full"><div class="text-lg space-y-4 prose max-w-none text-white">${step.content}</div></div>`;

    // Lógica para marcar la clase como completa al finalizar la actividad y cerrar el modal
    const finalStepAction = stepIndex === totalSteps - 1 
        ? `markClassComplete(${currentClassId}); closeModal('content-modal');` 
        : `renderActivityStep(${currentClassId}, ${stepIndex + 1})`;

    const navigationHtml = `
        <div class="flex justify-between mt-8 pt-4 border-t border-gray-200">
            <button onclick="renderActivityStep(${currentClassId}, ${stepIndex - 1})" 
                    class="py-2 px-4 ${stepIndex === 0 ? 'opacity-50 cursor-not-allowed' : 'bg-gray-200 hover:bg-gray-300'} rounded-lg transition" 
                    ${stepIndex === 0 ? 'disabled' : ''}>
                <i data-lucide="arrow-left" class="w-5 h-5 inline-block mr-2"></i> Anterior
            </button>
            <button onclick="renderActivityMenu(${currentClassId})" class="py-2 px-4 bg-gray-200 hover:bg-gray-300 rounded-lg transition">
                Volver al Menú
            </button>
            <button onclick="${finalStepAction}" 
                    class="py-2 px-4 ${color.shadow} ${color.name} text-white rounded-lg transition">
                ${stepIndex === totalSteps - 1 ? 'Finalizar Módulo y Volver' : 'Siguiente Paso'} <i data-lucide="chevron-right" class="w-5 h-5 inline-block ml-2"></i>
            </button>
        </div>
    `;

    const stepHtml = `
        <div class="p-8 md:p-12 bg-white rounded-xl shadow-2xl w-full max-w-4xl relative overflow-y-auto max-h-[90vh]">
            <button onclick="closeModal('content-modal')" class="absolute top-2 right-2 text-gray-800 hover:text-red-600 transition">
                <i data-lucide="x" class="w-6 h-6"></i>
            </button>
            <h2 class="text-3xl font-extrabold text-gray-800 mb-2">${cls.title}</h2>
            <p class="text-lg text-accent mb-6 font-bold">${step.title} (${stepIndex + 1} de ${totalSteps})</p>

            ${contentHtml}
            
            ${navigationHtml}
        </div>
    `;

    contentModal.innerHTML = stepHtml;
    contentModal.classList.remove('hidden');
    renderIcons();
}

// --- INICIALIZACIÓN ---

document.addEventListener('DOMContentLoaded', () => {
    renderDashboard();

    // Navegación rápida al dashboard
    dashboardBtn.addEventListener('click', renderDashboard);
    
    renderIcons();
});