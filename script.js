// Налаштовуємо клієнтську частину для зв'язку з сервером через WebSocket.

// Підключення до WebSocket-сервера:
const socket = io('http://localhost:3000')

// Отримання HTML елементів:
const messageContainer = document.getElementById('message-container')
const messageForm = document.getElementById('send-container')
const messageInput = document.getElementById('message-input')

// Запит імені користувача:
const name = prompt('What is your name?')
appendMessage('You joined')
socket.emit('new-user', name)

// Коли приходить нове повідомлення в чат
socket.on('chat-message', data => {
    appendMessage(`${data.name}: ${data.message}`);
});

// Коли новий користувач підключається
socket.on('user-connected', name => {
    appendMessage(`${name} connected`);
});

// Коли користувач відключається
socket.on('user-disconnected', name => {
    appendMessage(`${name} disconnected`);
});

// Відправка повідомлень:
messageForm.addEventListener('submit', e => {
    e.preventDefault()
    const message = messageInput.value
    appendMessage(`You: ${message}`)
    socket.emit('send-chat-message', message)
    messageInput.value = ''
})

// Функція для додавання повідомлень в HTML:
function appendMessage(message) {
    const messageElement = document.createElement('div')
    messageElement.innerText = message
    messageContainer.append(messageElement)
}