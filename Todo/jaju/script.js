document.addEventListener('DOMContentLoaded', function() {
    // Set current year in footer
    document.getElementById('current-year').textContent = new Date().getFullYear();
  
    // Mobile menu toggle
    const mobileMenuBtn = document.querySelector('.mobile-menu-btn');
    const mobileNav = document.querySelector('.mobile-nav');
  
    mobileMenuBtn.addEventListener('click', function() {
        mobileNav.classList.toggle('active');
        const icon = mobileMenuBtn.querySelector('i');
        if (mobileNav.classList.contains('active')) {
            icon.classList.remove('fa-bars');
            icon.classList.add('fa-times');
        } else {
            icon.classList.remove('fa-times');
            icon.classList.add('fa-bars');
        }
    });
  
    // Chatbot functionality
    const chatbotToggle = document.getElementById('chatbot-toggle');
    const chatbotPopup = document.getElementById('chatbot-popup');
    const chatbotClose = document.getElementById('chatbot-close');
    const chatbotInput = document.getElementById('chatbot-input');
    const chatbotSend = document.getElementById('chatbot-send');
    const chatbotMessages = document.getElementById('chatbot-messages');
    const suggestionBtns = document.querySelectorAll('.suggestion-btn');

    // Predefined responses with full knowledge info for admisiones, horarios, contacto, formacion militar
    const botResponses = {
        admisiones: {
            message: `🎖️ *PROCESO DE ADMISIONES 2025*\n\nEl Colegio Militar General Santander ofrece cupos para:\n- Preescolar: Jardín y Transición\n- Básica Primaria: 1° a 5° grado\n- Básica Secundaria: 6° a 9° grado\n- Media Vocacional: 10° y 11° grado\n\n*Requisitos fundamentales:*\n- Registro civil de nacimiento (original)\n- Fotocopia de cédula de los padres\n- Certificados académicos de años anteriores\n- Examen médico general y factor RH\n- Entrevista psicológica obligatoria\n- Carpeta azul tamaño oficio con gancho\n\n*Proceso militar:*\n1. Entrega de documentación en Secretaría Académica\n2. Revisión y verificación de requisitos\n3. Citación a entrevista familiar\n4. Evaluación de perfil militar del aspirante\n5. Proceso de inducción y compromiso disciplinario\n\n*Fechas importantes 2025:*\nLas inscripciones están abiertas. Los aspirantes serán citados conforme entreguen y se verifique la documentación.\n\n⚠️ Estos requerimientos aplican tanto para cadetes nuevos como antiguos.`,
            suggestions: ['Más información sobre requisitos', 'Proceso de entrevista', 'Horarios de atención']
        },
        horarios: {
            message: `⏰ *HORARIOS DEL COLEGIO MILITAR GENERAL SANTANDER*\n\n- Lunes a Viernes: 6:30am - 3:30pm\n- Atención Secretaría Académica: 7:00am - 2:00pm\n- Biblioteca: 7:00am - 3:00pm\n- Actividades deportivas y culturales: Después de clases\n- Atención telefónica: 7:00am - 4:00pm\n\nSe recomienda puntualidad y respeto a los horarios para la formación integral y disciplina.`,
            suggestions: ['Horario Secretaría', 'Actividades extracurriculares', 'Días festivos']
        },
        contacto: {
            message: `📞 *CONTACTO DEL COLEGIO MILITAR GENERAL SANTANDER*\n\n*Dirección:*\nDiagonal 32 #30a-05, Salida a Pamplona, Bucaramanga, Santander, Colombia\n\n*Teléfonos:*\n- Principal: (607) 7008460\n- Secretaría Académica: Ext. 2006\n- Celular/WhatsApp: +57 301 718 9949\n\n*Correos electrónicos:*\n- General: info@colmilgeneralsantander.edu.co\n- Admisiones: secretaria@colmilgeneralsantander.edu.co\n- Rectoría: rectoria@colmilgeneralsantander.edu.co\n\n*Directivos:*\n- Rector: Mayor William Parada Gómez\n- Coordinador de Convivencia: Disponible en horario escolar\n- Coordinadora Académica: Disponible en horario escolar\n- Secretario Académico: Atención directa\n\n*Redes Sociales:*\n- Facebook: Colegio Militar General Santander\n- Instagram: @colmilgeneralsantander\n- Sitio web: colmilgeneralsantander.edu.co\n\n*Transporte escolar:* Rutas cubren sectores de Bucaramanga.`,
            suggestions: ['Horario atención', 'Rutas transporte', 'Consultas específicas']
        },
        formacionMilitar: {
            message: `⚔️ *FORMACIÓN MILITAR EN EL COLEGIO MILITAR GENERAL SANTANDER*\n\n- Formación integral que combina excelencia académica con disciplina militar.\n- Entrenamientos diarios y formación en valores patrios.\n- Desarrollo de liderazgo, hábitos de orden, respeto y compromiso.\n- Actividades que fomentan la preparación física y aptitud militar para jóvenes.\n- Preparación para el ingreso a las fuerzas militares o vocación profesional.\n\nLa formación militar es un pilar fundamental que distingue a nuestros estudiantes y contribuye a su desarrollo personal y educativo.`,
            suggestions: ['Más detalles de formación', 'Actividades militares', 'Requisitos especiales']
        },
        default: {
            message: "Gracias por comunicarte con el Colegio Militar General Santander. ¿En qué puedo ayudarte? Puedes consultar sobre admisiones, horarios, contacto o formación militar.",
            suggestions: ['Admisiones', 'Horarios', 'Contacto', 'Formación militar']
        }
    };

    function getCurrentTime() {
        const now = new Date();
        return now.toLocaleTimeString('es-CO', { hour: '2-digit', minute: '2-digit' });
    }

    function addMessage(content, isUser  = false, showSuggestions = false, suggestions = []) {
        const messageDiv = document.createElement('div');
        messageDiv.className = `chatbot-message ${isUser  ? 'user-message' : 'bot-message'}`;
        
        messageDiv.innerHTML = `
            <div class="message-avatar">
                <i class="fas fa-${isUser  ? 'user' : 'graduation-cap'}"></i>
            </div>
            <div class="message-content">
                <p>${content.replace(/\n/g, '<br>')}</p>
                <span class="message-time">${getCurrentTime()}</span>
            </div>
        `;

        chatbotMessages.appendChild(messageDiv);

        if (showSuggestions && suggestions.length > 0) {
            const suggestionsDiv = document.createElement('div');
            suggestionsDiv.className = 'chatbot-suggestions';
            
            suggestions.forEach(suggestion => {
                const btn = document.createElement('button');
                btn.className = 'suggestion-btn';
                btn.textContent = suggestion;
                btn.addEventListener('click', () => {
                    handleSuggestionClick(suggestion);
                });
                suggestionsDiv.appendChild(btn);
            });

            chatbotMessages.appendChild(suggestionsDiv);
        }

        chatbotMessages.scrollTop = chatbotMessages.scrollHeight;
    }

    function showTypingIndicator() {
        const typingDiv = document.createElement('div');
        typingDiv.className = 'chatbot-message bot-message typing-message';
        typingDiv.innerHTML = `
            <div class="message-avatar">
                <i class="fas fa-graduation-cap"></i>
            </div>
            <div class="typing-indicator">
                <div class="typing-dot"></div>
                <div class="typing-dot"></div>
                <div class="typing-dot"></div>
            </div>
        `;
        
        chatbotMessages.appendChild(typingDiv);
        chatbotMessages.scrollTop = chatbotMessages.scrollHeight;
        
        return typingDiv;
    }

    function removeTypingIndicator() {
        const typingMessage = document.querySelector('.typing-message');
        if (typingMessage) {
            typingMessage.remove();
        }
    }

    function getBotResponse(userMessage) {
        const message = userMessage.toLowerCase();
        
        if (message.includes('admisiones') || message.includes('inscripción') || message.includes('matricula') || message.includes('admision')) {
            return botResponses.admisiones;
        } else if (message.includes('horario')) {
            return botResponses.horarios;
        } else if (message.includes('contacto') || message.includes('telefono') || message.includes('direccion') || message.includes('correo')) {
            return botResponses.contacto;
        } else if (message.includes('formación militar') || message.includes('militar')) {
            return botResponses.formacionMilitar;
        } else {
            return botResponses.default;
        }
    }

    function handleSuggestionClick(suggestion) {
        addMessage(suggestion, true);
        
        const typingIndicator = showTypingIndicator();
        
        setTimeout(() => {
            removeTypingIndicator();
            const response = getBotResponse(suggestion);
            addMessage(response.message, false, true, response.suggestions);
        }, 1000 + Math.random() * 1000);
    }

    function sendMessage() {
        const message = chatbotInput.value.trim();
        if (!message) return;

        // Add user message
        addMessage(message, true);
        chatbotInput.value = '';

        // Show typing indicator
        const typingIndicator = showTypingIndicator();

        // Bot response after delay
        setTimeout(() => {
            removeTypingIndicator();
            const response = getBotResponse(message);
            addMessage(response.message, false, true, response.suggestions);
        }, 1000 + Math.random() * 1000);
    }

    // Event listeners
    chatbotToggle.addEventListener('click', () => {
        chatbotPopup.classList.toggle('active');
    });

    chatbotClose.addEventListener('click', () => {
        chatbotPopup.classList.remove('active');
    });

    chatbotSend.addEventListener('click', sendMessage);

    chatbotInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') {
            sendMessage();
        }
    });

    // Handle initial suggestion buttons
    suggestionBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            const message = btn.getAttribute('data-message');
            handleSuggestionClick(message);
            
            // Hide initial suggestions
            const suggestionsContainer = document.querySelector('.chatbot-suggestions');
            if (suggestionsContainer) {
                suggestionsContainer.style.display = 'none';
            }
        });
    });

    // Close chatbot when clicking outside
    document.addEventListener('click', (e) => {
        if (!chatbotPopup.contains(e.target) && !chatbotToggle.contains(e.target)) {
            chatbotPopup.classList.remove('active');
        }
    });
});
