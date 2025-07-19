const chatDiv = document.getElementById('chat');
const synth = window.speechSynthesis;

function startListening() {
  const recognition = new (window.SpeechRecognition || window.webkitSpeechRecognition)();
  recognition.lang = 'en-US';
  recognition.start();

  recognition.onresult = async function(event) {
    const userText = event.results[0][0].transcript;
    appendMessage('You', userText);

    const botText = await getBotResponse(userText); // AI response
    appendMessage('Bot', botText);
    speak(botText); // Speak response
  };

  recognition.onerror = function(event) {
    console.error('Speech error', event);
    alert('Speech recognition failed');
  };
}

function appendMessage(sender, text) {
  const message = document.createElement('div');
  message.className = sender === 'You' ? 'user' : 'bot';
  message.textContent = `${sender}: ${text}`;
  chatDiv.appendChild(message);
}

function speak(text) {
  const utter = new SpeechSynthesisUtterance(text);
  synth.speak(utter);
}

// Mock AI response
async function getBotResponse(message) {
  // Replace this with OpenAI API fetch
  const response = await fetch('https://api.openai.com/v1/chat/completions', {
    method: 'POST',
    headers: {
      'Authorization': 'Bearer YOUR_OPENAI_API_KEY',
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      model: "gpt-3.5-turbo",
      messages: [{ role: "user", content: message }]
    })
  });

  const data = await response.json();
  return data.choices[0].message.content;
}
