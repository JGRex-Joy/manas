// ==========================================
// ССЫЛКА НА ТВОЙ ИИ БЭКЕНД
// ==========================================
const API_URL = ""; 

const chatForm = document.getElementById('chatForm');
const userInput = document.getElementById('userInput');
const chatBox = document.getElementById('chatBox');
const sendBtn = document.getElementById('sendBtn');
const typingIndicator = document.getElementById('typingIndicator');

// Функция добавления сообщения
function addMessage(text, sender) {
    const msgDiv = document.createElement('div');
    msgDiv.classList.add('message', sender);
    msgDiv.textContent = text;
    chatBox.insertBefore(msgDiv, typingIndicator);
    scrollToBottom();
}

// Прокрутка чата вниз
function scrollToBottom() {
    chatBox.scrollTop = chatBox.scrollHeight;
}

// Обработка отправки сообщения
chatForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    
    const text = userInput.value.trim();
    if (!text) return;

    // 1. Показываем вопрос пользователя
    addMessage(text, 'user');
    userInput.value = '';
    
    // 2. Блокируем интерфейс и показываем индикатор печати
    sendBtn.disabled = true;
    userInput.disabled = true;
    typingIndicator.style.display = 'flex';
    scrollToBottom();

    try {
        if (!API_URL) {
            // Заглушка, если API еще не подключен
            await new Promise(r => setTimeout(r, 1200));
            addMessage("API шилтемеси бош. Бэкендге туташуу үчүн кодго URL киргизиңиз!", 'bot');
        } else {
            // 3. Запрос к бэкенду
            const response = await fetch(`${API_URL}/ask`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ query: text }) 
            });

            if (!response.ok) throw new Error('Тармак катасы');

            // 4. Вывод ответа от ИИ
            const data = await response.json();
            addMessage(data.answer, 'bot');
        }
    } catch (error) {
        console.error('Ошибка:', error);
        addMessage("Кечиресиз, сервер менен байланышууда ката кетти.", 'bot');
    } finally {
        // 5. Разблокировка интерфейса
        typingIndicator.style.display = 'none';
        sendBtn.disabled = false;
        userInput.disabled = false;
        userInput.focus();
        scrollToBottom();
    }
});