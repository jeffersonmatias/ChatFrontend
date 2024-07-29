const login = document.querySelector(".login");
const loginForm = document.querySelector(".login__form");
const loginInput = document.querySelector(".login__input");

const chat = document.querySelector(".chat");
const chatForm = document.querySelector(".chat__form");
const chatInput = document.querySelector(".chat__input");
const chatMessages = document.querySelector(".chat__messages");

const colors = [
  "aqua",
  "aquamarine",
  "yellow",
  "LightPink",
  "blueviolet",
  "greenyellow",
  "PeachPuff",
  "PowderBlue",
  "LightSkyBlue",
  "red",
  "green",
];

const user = { id: "", name: "", color: "" };

let websocket;

const createMessageSelfElement = (content) => {
  const div = document.createElement("div");
  div.classList.add("message__self");
  div.innerHTML = content;
  return div;
};

const createMessageOtherElement = (content, sender, senderColor) => {
  const div = document.createElement("div");
  const span = document.createElement("div");

  div.classList.add("message__other");
  span.classList.add("message__sender");
  span.style.color = senderColor;

  div.appendChild(span);

  span.innerHTML = sender;
  div.innerHTML += content;
  return div;
};

const createMessageNotifyElement = (message) => {
  const div = document.createElement("div");
  div.classList.add("message__notify");
  div.innerHTML = `${message}`;
  return div;
};

const getRandomColor = () => {
  const randomIndex = Math.floor(Math.random() * colors.length);
  return colors[randomIndex];
};

const scrollScreen = () => {
  window.scrollTo({
    top: document.body.scrollHeight,
    behavior: "smooth",
  });
};

const processMessage = ({ data }) => {
  try {
    const { userId, userName, userColor, content } = JSON.parse(data);
    const message =
      userId == user.id
        ? createMessageSelfElement(content)
        : createMessageOtherElement(content, userName, userColor);
    chatMessages.appendChild(message);
  } catch {
    const message = createMessageNotifyElement(data);
    chatMessages.appendChild(message);
  }
  scrollScreen();
};

const handleLogin = (event) => {
  event.preventDefault();

  user.id = crypto.randomUUID();
  user.name = loginInput.value;
  user.color = getRandomColor();

  login.style.display = "none";
  chat.style.display = "flex";

  websocket = new WebSocket("wss://chatbackend-xqax.onrender.com");
  websocket.onmessage = processMessage;
  websocket.onopen = () => websocket.send(`${user.name} entrou no chat !`);
};

const sendMessage = (event) => {
  event.preventDefault();

  const message = {
    userId: user.id,
    userName: user.name,
    userColor: user.color,
    content: chatInput.value,
  };
  websocket.send(JSON.stringify(message));
  chatInput.value = "";
};

loginForm.addEventListener("submit", handleLogin);

chatForm.addEventListener("submit", sendMessage);
