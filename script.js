// script.js

// Case Management
document.addEventListener('DOMContentLoaded', () => {
  const caseList = document.querySelector('.case-list');
  let cases = JSON.parse(localStorage.getItem('cases')) || [];

  function renderCases() {
    caseList.innerHTML = '';
    cases.forEach(caseItem => {
      const card = `
        <div class="case-card">
          <div class="case-details">
            <h3>${caseItem.name}</h3>
            <p>Case No: ${caseItem.number}</p>
            <p>Client: ${caseItem.client}</p>
            <p>Court: ${caseItem.court}</p>
            <p><i class="fa fa-calendar"></i> Upcoming: ${caseItem.nextHearing}</p>
          </div>
          <div class="status">${caseItem.status}</div>
        </div>
      `;
      caseList.insertAdjacentHTML('beforeend', card);
    });
  }

  // Add Case Form
  document.getElementById('addCaseForm').addEventListener('submit', e => {
    e.preventDefault();
    const formData = new FormData(e.target);
    const newCase = Object.fromEntries(formData);
    cases.push(newCase);
    localStorage.setItem('cases', JSON.stringify(cases));
    renderCases();
    e.target.reset();
  });

  renderCases();
});

// AI Integration
async function askGemini(input) {
  try {
    const response = await fetch("https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=YOUR_GEMINI_API_KEY", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        contents: [{ parts: [{ text: input }] }]
      })
    });

    const data = await response.json();
    return data.candidates[0].content.parts[0].text;
  } catch (error) {
    console.error(error);
    return "Sorry, there was an error communicating with the AI.";
  }
}

document.getElementById('chatForm').addEventListener('submit', async e => {
  e.preventDefault();
  const input = document.getElementById('chatInput').value;
  const chatHistory = document.querySelector('.chat-history');

  // User Message
  chatHistory.innerHTML += `<div class="message user"><strong>You:</strong> ${input}</div>`;

  // AI Response
  const aiResponse = await askGemini(input);
  chatHistory.innerHTML += `<div class="message system"><strong>System:</strong> ${aiResponse}</div>`;
  chatHistory.scrollTop = chatHistory.scrollHeight;

  document.getElementById('chatInput').value = '';
});
