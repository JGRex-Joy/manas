const chatForm = document.getElementById('chatForm');
const userInput = document.getElementById('userInput');
const chatBox = document.getElementById('chatBox');
const sendBtn = document.getElementById('sendBtn');
const typingIndicator = document.getElementById('typingIndicator');

function addMessage(text, sender) {
    const msgDiv = document.createElement('div');
    msgDiv.classList.add('message', sender);
    msgDiv.textContent = text;
    chatBox.insertBefore(msgDiv, typingIndicator);
    scrollToBottom();
}

function scrollToBottom() {
    chatBox.scrollTop = chatBox.scrollHeight;
}

chatForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    
    const text = userInput.value.trim();
    if (!text) return;

    addMessage(text, 'user');
    userInput.value = '';
    
    sendBtn.disabled = true;
    userInput.disabled = true;
    typingIndicator.style.display = 'flex';
    scrollToBottom();

    try {
        const response = await fetch('/ask', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ query: text })
        });

        if (!response.ok) throw new Error('Тармак катасы');

        const data = await response.json();
        addMessage(data.answer, 'bot');

    } catch (error) {
        console.error('Ошибка:', error);
        addMessage("Кечиресиз, сервер менен байланышууда ката кетти.", 'bot');
    } finally {
        typingIndicator.style.display = 'none';
        sendBtn.disabled = false;
        userInput.disabled = false;
        userInput.focus();
        scrollToBottom();
    }
});