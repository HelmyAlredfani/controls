// إعداد البيانات الافتراضية
const defaultAdmin = {
  username: 'alredfani',
  password: '73345'
};

// تهيئة localStorage إذا لم تكن موجودة
if (!localStorage.getItem('students')) {
  localStorage.setItem('students', JSON.stringify([]));
}
if (!localStorage.getItem('results')) {
  localStorage.setItem('results', JSON.stringify([]));
}

// تسجيل الدخول
document.getElementById('loginForm')?.addEventListener('submit', (e) => {
  e.preventDefault();
  const username = document.getElementById('username').value;
  const password = document.getElementById('password').value;
  const errorMessage = document.getElementById('errorMessage');

  if (username === defaultAdmin.username && password === defaultAdmin.password) {
    localStorage.setItem('isLoggedIn', 'true');
    window.location.href = 'dashboard.html';
  } else {
    errorMessage.textContent = 'اسم المستخدم أو كلمة المرور غير صحيحة';
  }
});

// التحقق من تسجيل الدخول
function checkAuth() {
  if (!localStorage.getItem('isLoggedIn')) {
    window.location.href = 'index.html';
  }
}

// تسجيل الخروج
function logout() {
  localStorage.removeItem('isLoggedIn');
  window.location.href = 'index.html';
}

// إضافة طالب
document.getElementById('studentForm')?.addEventListener('submit', (e) => {
  e.preventDefault();
  checkAuth();

  const name = document.getElementById('studentName').value;
  const secretId = document.getElementById('secretId').value;
  const students = JSON.parse(localStorage.getItem('students'));

  if (students.find(student => student.secretId === secretId)) {
    alert('الرقم السري موجود مسبقًا');
    return;
  }

  students.push({ name, secretId });
  localStorage.setItem('students', JSON.stringify(students));
  document.getElementById('studentForm').reset();
  loadStudents();
  loadStudentSelect();
});

// تحميل قائمة الطلاب
function loadStudents() {
  checkAuth();
  const students = JSON.parse(localStorage.getItem('students'));
  const tbody = document.querySelector('#studentsTable tbody');
  tbody.innerHTML = '';

  students.forEach((student, index) => {
    const row = document.createElement('tr');
    row.innerHTML = `
      <td>${student.name}</td>
      <td>${student.secretId}</td>
      <td>< tbody.appendChild(row);
  });
}

// تحميل الطلاب في القائمة المنسدلة
function loadStudentSelect() {
  checkAuth();
  const select = document.getElementById('studentSelect');
  const students = JSON.parse(localStorage.getItem('students'));
  select.innerHTML = '<option value="">اختر الطالب</option>';

  students.forEach(student => {
    const option = document.createElement('option');
    option.value = student.secretId;
    option.textContent = student.name;
    select.appendChild(option);
  });
}

// إضافة نتيجة
document.getElementById('resultForm')?.addEventListener('submit', (e) => {
  e.preventDefault();
  checkAuth();

  const secretId = document.getElementById('studentSelect').value;
  const subject = document.getElementById('subject').value;
  const score = parseInt(document.getElementById('score').value);
  const results = JSON.parse(localStorage.getItem('results'));

  results.push({ secretId, subject, score });
  localStorage.setItem('results', JSON.stringify(results));
  document.getElementById('resultForm').reset();
});

// البحث عن النتائج
function searchResults() {
  const searchInput = document.getElementById('searchInput').value.toLowerCase();
  const students = JSON.parse(localStorage.getItem('students'));
  const results = JSON.parse(localStorage.getItem('results'));
  const student = students.find(s => s.secretId === searchInput || s.name.toLowerCase() === searchInput);

  if (!student) {
    alert('لم يتم العثور على الطالب');
    return;
  }

  const studentResults = results.filter(r => r.secretId === student.secretId);
  const tbody = document.querySelector('#resultsTable tbody');
  tbody.innerHTML = '';

  let totalScore = 0;
  studentResults.forEach(result => {
    const row = document.createElement('tr');
    row.innerHTML = `
      <td>${result.subject}</td>
      <td>${result.score}</td>
    `;
    tbody.appendChild(row);
    totalScore += result.score;
  });

  document.getElementById('studentInfo').textContent = `اسم الطالب: ${student.name} | الرقم السري: ${student.secretId}`;
  document.getElementById('totalScore').textContent = `المجموع: ${totalScore} | النسبة: ${(totalScore / (studentResults.length * 100) * 100).toFixed(2)}%`;
}

// تصدير إلى CSV
function exportToCSV() {
  const searchInput = document.getElementById('searchInput').value.toLowerCase();
  const students = JSON.parse(localStorage.getItem('students'));
  const results = JSON.parse(localStorage.getItem('results'));
  const student = students.find(s => s.secretId === searchInput || s.name.toLowerCase() === searchInput);

  if (!student) return;

  const studentResults = results.filter(r => r.secretId === student.secretId);
  let csvContent = "data:text/csv;charset=utf-8,\uFEFF";
  csvContent += "المادة,الدرجة\n";

  studentResults.forEach(result => {
    csvContent += `${result.subject},${result.score}\n`;
  });

  const encodedUri = encodeURI(csvContent);
  const link = document.createElement('a');
  link.setAttribute('href', encodedUri);
  link.setAttribute('download', `نتائج_${student.name}.csv`);
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
}

// تهيئة الصفحات
if (window.location.pathname.includes('dashboard.html')) {
  loadStudents();
  loadStudentSelect();
}
