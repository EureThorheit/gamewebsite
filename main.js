let bot = document.getElementById("bot");

localStorage.setItem("bot", "false");

bot.addEventListener('input', () => {
    localStorage.setItem("bot", bot.checked);
})