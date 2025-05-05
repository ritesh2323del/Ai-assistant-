
// ✅ Case Management with LocalStorage
document.addEventListener('DOMContentLoaded', () => {
  const form = document.getElementById('caseForm');
  const caseList = document.getElementById('caseList');

  let cases = JSON.parse(localStorage.getItem('cases')) || [];

  function displayCases() {
    caseList.innerHTML = '';
    cases.forEach((c, i) => {
      caseList.innerHTML += `
        <div class="case-card">
          <strong>${c.name
