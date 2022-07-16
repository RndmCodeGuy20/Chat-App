const chatForm = document.getElementById('chat-form');
const chatMessages = document.querySelector('#chat-messages');
const roomName = document.getElementById('room-name');
const userList = document.getElementById('users');

// Get username and room from url
const { username, room } = Qs.parse(location.search, {
	ignoreQueryPrefix: true,
});

const socket = io();

// Join chat room
socket.emit('joinRoom', { username, room });

socket.on('roomUsers', ({ room, users }) => {
	outputRoomName(room);
	outputUsers(users);
});

// broadcast message from server to client
socket.on('message', (message) => {
	console.log(message);

	// message to DOM
	opMsg(message);

	// Scroll down to latest message
	chatMessages.scrollTop = chatMessages.scrollHeight;
});

// Message submit
chatForm.addEventListener('submit', (e) => {
	e.preventDefault();

	// get message text
	const msg = e.target.elements.msg.value;

	// emitting message to server
	socket.emit('chatMessage', msg);

	// Clear input
	e.target.elements.msg.value = '';
	e.target.elements.msg.focus();
});

function opMsg(message) {
	const div = document.createElement('div');
	div.classList.add('message');
	div.innerHTML = `<p class="meta">${message.username} <span>${message.time}</span></p>
    <p class="text">
      ${message.text}
    </p>`;

	document.querySelector('#chat-messages').appendChild(div);
}

function outputRoomName(room) {
	roomName.innerText = room;
}

function outputUsers(users) {
	userList.innerHTML = `
		${users.map((user) => `<li>${user.username}</li>`).join('')}
	`;
}
