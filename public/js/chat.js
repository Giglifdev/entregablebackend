const socket = io();
const emailRegex =
  /^[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*@(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?$/;

let user;

const chatInput = document.getElementById("chat-input");
const sendButton = document.getElementById("send-button");
const chatForm = document.getElementById("chat-form");
const messageLogs = document.getElementById("message-logs");

let messageUser = { user: "", message: "" };

Swal.fire({
  title: "Identification",
  input: "text",
  text: "Enter your email to identify yourself in the chat",
  inputValidator: (value) => {
    return !value.match(emailRegex) && "You need to enter a valid email";
  },
  allowOutsideClick: false,
  allowEscapeKey: false,
}).then((result) => {
  user = result.value;
  messageUser.user = user;
  socket.emit("authenticated", user);
});

socket.on("messageLogs", (data) => {
  let messages = "";
  data.forEach((message) => {
    messages += `<li>${message.user} dice: ${message.message}</li>`;

    messageLogs.innerHTML = messages;
  });
  messageLogs.scrollTop = messageLogs.scrollHeight;
});

socket.on("newUserConnected", (data) => {
  if (user) {
    Swal.fire({
      toast: true,
      position: "top-end",
      showConfirmButton: false,
      timer: 3000,
      timerProgressBar: true,
      didOpen: (toast) => {
        toast.addEventListener("mouseenter", Swal.stopTimer);
        toast.addEventListener("mouseleave", Swal.resumeTimer);
      },
      title: `${data} has joined the chat`,
      icon: "success",
    });
  }
});

chatForm.addEventListener("submit", (e) => {
  e.preventDefault();
  if (chatInput.value) {
    messageUser.message = chatInput.value;
    socket.emit("message", messageUser);
    chatInput.value = "";
  }
});
