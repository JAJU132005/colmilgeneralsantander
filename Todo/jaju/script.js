document.addEventListener('DOMContentLoaded', function() {
    // Establecer año actual en el footer
    document.getElementById('current-year').textContent = new Date().getFullYear();

    // Toggle del menú móvil
    const mobileMenuBtn = document.querySelector('.mobile-menu-btn');
    const mobileNav = document.querySelector('.mobile-nav');

    mobileMenuBtn.addEventListener('click', function() {
        mobileNav.classList.toggle('active');
        const icon = mobileMenuBtn.querySelector('i');
        icon.classList.toggle('fa-times');
        icon.classList.toggle('fa-bars');
    });

    // Funcionalidad del Chatbot
    const chatbotToggle = document.getElementById('chatbot-toggle');
    const chatbotPopup = document.getElementById('chatbot-popup');
    const chatbotClose = document.getElementById('chatbot-close');
    const chatbotInput = document.getElementById('chatbot-input');
    const chatbotSend = document.getElementById('chatbot-send');
    const chatbotMessages = document.getElementById('chatbot-messages');
    const suggestionBtns = document.querySelectorAll('.suggestion-btn');

    // Mostrar chatbot automáticamente al cargar
    setTimeout(() => chatbotPopup.classList.add('active'), 1000);

    // Respuestas predefinidas
    const botResponses = {
        admisiones: {
            message: `🎖️ *PROCESO DE ADMISIONES 2025*\n\nRequisitos:\n- Registro civil\n- Fotocopia de cédula de padres\n- Certificados académicos\n- Examen médico\n- Entrevista psicológica\n\n*Proceso militar:*\n1. Entrega documentación\n2. Revisión\n3. Entrevista familiar\n4. Evaluación de perfil\n5. Inducción`,
            suggestions: ['Más información', 'Proceso entrevista', 'Horarios']
        },
        horarios: {
            message: `⏰ *HORARIOS*\n\n- Lunes a Viernes: 6:30am - 3:30pm\n- Secretaría: 7:00am - 2:00pm\n- Biblioteca: 7:00am - 3:00pm\n- Teléfono: 7:00am - 4:00pm`,
            suggestions: ['Secretaría', 'Actividades', 'Festivos']
        },
        contacto: {
            message: `📞 *CONTACTO*\n\nDirección: Diagonal 32 #30a-05, Bucaramanga\nTel: (607) 7008460\nWhatsApp: +57 301 718 9949\nCorreos:\n- info@colmilgeneralsantander.edu.co\n- secretaria@...`,
            suggestions: ['Horario atención', 'Rutas', 'Consultas']
        },
        formacionMilitar: {
            message: `⚔️ *FORMACIÓN MILITAR*\n\n- Entrenamientos diarios\n- Desarrollo de liderazgo\n- Preparación física\n- Valores y disciplina`,
            suggestions: ['Actividades', 'Requisitos', 'Detalles']
        },
        PQR: {
            message: `📄 *PQR*\n\n1. Solicitud escrita\n2. Formato oficial\n3. Documentos soporte\n4. Respuesta en 5 días\n📧 pqrs@colmilgeneralsantander.edu.co`,
            suggestions: ['Formatos', 'Tiempos', 'Seguimiento']
        },
        FAQ: {
            message: `❓ *FAQ*\n\n1. Horario: 7am-4pm\n2. Transporte: Sí\n3. Becas: Militares\n4. Phidias: Plataforma académica`,
            suggestions: ['Becas', 'Transporte', 'Phidias']
        },
        Certificados: {
            message: `📜 *CERTIFICADOS*\n\nTipos:\n- Estudios\n- Conducta\n- Graduación\n⏳ Proceso: 3 días\n⏰ Retiro: 8am-12pm`,
            suggestions: ['Costos', 'Digital', 'Autorizaciones']
        },
        default: {
            message: "¿En qué puedo ayudarte? Opciones: Admisiones, Horarios, Contacto, Formación militar, PQR, FAQ, Certificados",
            suggestions: ['Admisiones', 'Horarios', 'Contacto', 'Formación militar', 'PQR', 'FAQ', 'Certificados']
        }
    };

    function getCurrentTime() {
        return new Date().toLocaleTimeString('es-CO', { hour: '2-digit', minute: '2-digit' });
    }

    function addMessage(content, isUser = false, showSuggestions = false, suggestions = []) {
        const messageDiv = document.createElement('div');
        messageDiv.className = `chatbot-message ${isUser ? 'user-message' : 'bot-message'}`;
        
        messageDiv.innerHTML = `
            <div class="message-avatar">
                <i class="fas fa-${isUser ? 'user' : 'graduation-cap'}"></i>
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
                btn.addEventListener('click', () => handleSuggestionClick(suggestion));
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
        if (typingMessage) typingMessage.remove();
    }

    function getBotResponse(userMessage) {
        const message = userMessage.toLowerCase();
        if (message.includes('admisiones')) return botResponses.admisiones;
        if (message.includes('horario')) return botResponses.horarios;
        if (message.includes('contacto')) return botResponses.contacto;
        if (message.includes('formación militar')) return botResponses.formacionMilitar;
        if (message.includes('pqr')) return botResponses.PQR;
        if (message.includes('faq')) return botResponses.FAQ;
        if (message.includes('certificado')) return botResponses.Certificados;
        return botResponses.default;
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

        addMessage(message, true);
        chatbotInput.value = '';

        const typingIndicator = showTypingIndicator();
        setTimeout(() => {
            removeTypingIndicator();
            const response = getBotResponse(message);
            addMessage(response.message, false, true, response.suggestions);
        }, 1000 + Math.random() * 1000);
    }

    // Event Listeners
    chatbotToggle.addEventListener('click', () => {
        chatbotPopup.classList.toggle('active');
        if (!chatbotPopup.classList.contains('active')) {
            setTimeout(() => chatbotMessages.scrollTop = chatbotMessages.scrollHeight, 300);
        }
    });
    
    chatbotClose.addEventListener('click', () => chatbotPopup.classList.remove('active'));
    chatbotSend.addEventListener('click', sendMessage);
    chatbotInput.addEventListener('keypress', (e) => e.key === 'Enter' && sendMessage());

    suggestionBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            handleSuggestionClick(btn.dataset.message);
            document.querySelector('.chatbot-suggestions').style.display = 'none';
        });
    });

    document.addEventListener('click', (e) => {
        if (!chatbotPopup.contains(e.target) && !chatbotToggle.contains(e.target)) {
            chatbotPopup.classList.remove('active');
        }
    });
});