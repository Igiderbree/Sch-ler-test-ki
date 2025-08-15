function init() {
  const user = JSON.parse(localStorage.getItem('user'));
  if (!user) {
    window.location.href = '/';
    return;
  }
  document.getElementById('accountUsername').textContent = user.username;
  document.getElementById('accountRole').textContent = user.role;
  const cls = user.class ? user.class : '-';
  const grade = user.grade ? user.grade : '-';
  document.getElementById('accountClass').textContent = `${cls} / ${grade}`;

  if (user.role !== 'admin') {
    document.querySelectorAll('.admin-only').forEach(el => el.style.display = 'none');
  }
  if (user.role !== 'teacher' && user.role !== 'admin') {
    document.querySelectorAll('.teacher-only').forEach(el => el.style.display = 'none');
  }

  document.querySelectorAll('.sidebar a').forEach(link => {
    link.addEventListener('click', e => {
      e.preventDefault();
      showSection(link.dataset.section);
    });
  });
}

function showSection(id) {
  document.querySelectorAll('.section').forEach(sec => sec.classList.add('hidden'));
  document.getElementById(id).classList.remove('hidden');
}

document.addEventListener('DOMContentLoaded', init);
