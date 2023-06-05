const container = document.getElementById('app');
const SERVER_URL = 'http://localhost:3000';
let studentsList = [];

// createStudent(container, 'Будовский', 'Андрей', 'Геннадьевич', new Date(1996, 0, 24), '2022', 'Frontend developer', studentsList)
// createStudent(container, 'Иванов', 'Петр', 'Васильевич', new Date(2000, 4, 15), '2018', 'Back-end developer', studentsList)
// createStudent(container, 'Петров', 'Иван', 'Семенович', new Date(1970, 10, 7), '2010', 'System architect', studentsList)
// createStudent(container, 'Пирогов', 'Аристарх', 'Янович', new Date(2003, 1, 13), '2021', 'Data Science', studentsList)
// createStudent(container, 'Иванов', 'Александр', 'Александрович', new Date(1990, 3, 21), '2019', 'Software Tester', studentsList)

async function serverAdd(obj) {
  const response = await fetch(`${SERVER_URL}/api/students`, {
    method: "POST",
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(obj),
  })
  return await response.json();
}

async function serverGet() {
  const response = await fetch(`${SERVER_URL}/api/students`, {
    method: "GET",
    headers: { 'Content-Type': 'application/json' },
  })
  return await response.json();
}

async function serverDelete(id) {
  let response = await fetch(`${SERVER_URL}/api/students/${id}`, {
    method: "DELETE",
  })
  return await response.json()
}

let serverData = await serverGet();

if (serverData) {
  studentsList = serverData;
  for (const sudent of studentsList) {
    createStudent(container, sudent.surname, sudent.name, sudent.lastname, new Date(sudent.birthday), sudent.studyStart, sudent.faculty, sudent.id);
  }
}

function createStudent(container, surname, name, lastname, birthday, studyStart, faculty, id) {
  const tr = document.createElement('tr');
  const thFullName = document.createElement('th');
  const thBirthday = document.createElement('th');
  const thStudyStart = document.createElement('th');
  const thFaculty = document.createElement('th');
  const thButton = document.createElement('button');

  thButton.textContent = 'УДАЛИТЬ';
  thButton.classList.add('btn', 'btn-warning');


  const date = new Date();
  const fullYear = date.getFullYear();
  const year = birthday.getFullYear();
  const month = birthday.getMonth() + 1;
  const day = birthday.getDate();

  let curs = null;
  const dateCurs = new Date();
  const monthCurs = dateCurs.getMonth() + 1;

  thButton.addEventListener("click", async function () {
    await serverDelete(id)
    tr.remove()
  })


  if (fullYear - studyStart > 4) {
    curs = `Обучение завершино`;
  } else if (monthCurs < 9) {
    curs = `${fullYear - studyStart} курс`;
  } else {
    curs = `${fullYear - studyStart + 1} курс`;
  }

  thFullName.textContent = `${surname} ${name} ${lastname}`;
  thBirthday.textContent = `${day}.${month}.${year} (${fullYear - year})`;
  thStudyStart.textContent = `${studyStart}-${+studyStart + 4} (${curs})`;
  thFaculty.textContent = faculty;

  container.append(tr);
  tr.append(thFullName, thFaculty, thBirthday, thStudyStart, thButton);
}

async function validateForm(container, surname, name, lastname, birthday, studyStart, faculty, studentsArr) {
  const newDate = new Date(birthday.value);

  if (name.value.trim() === '') {
    alert('Заполните обязательное поля для ввода: "Имя"!');
    return;
  }

  if (surname.value.trim() === '') {
    alert('Заполните обязательное поля для ввода: "Фамилия"!');
    return;
  }

  if (lastname.value.trim() === '') {
    alert('Заполните обязательное поля для ввода: "Отчество"!');
    return;
  }

  if (birthday.value.trim() === '') {
    alert('Заполните обязательное поля для ввода: "Дата рождения"!');
    return;
  } else if (newDate.getFullYear() < 1900) {
    alert('Не корректно введена дата рождения!');
    return;
  }

  if (studyStart.value.trim() === '') {
    alert('Заполните обязательное поля для ввода: "Начало обучения"!');
    return;
  } else if (+studyStart.value < 2000) {
    alert('Год начала обучения должен быть не раньше 2000-го года!');
    return;
  }

  if (faculty.value.trim() === '') {
    alert('Заполните обязательное поля для ввода: "Факультет"!');
    return;
  }
  const student = {
    surname: surname.value.trim(),
    name: name.value.trim(),
    lastname: lastname.value.trim(),
    birthday: birthday.value,
    studyStart: studyStart.value.trim(),
    faculty: faculty.value.trim(),
  }

  let servStudent = await serverAdd(student);
  studentsArr.push(servStudent);

  createStudent(container, surname.value.trim(), name.value.trim(), lastname.value.trim(), new Date(birthday.value), studyStart.value.trim(), faculty.value.trim());

  surname.value = '';
  name.value = '';
  lastname.value = '';
  birthday.value = '';
  studyStart.value = '';
  faculty.value = '';
}

function filter(arr, prop, value) {
  let result = [],
    copy = [...arr];
  for (const item of copy) {
    if (prop === 'fio') {
      const fullName = `${item.surname.toLowerCase()} ${item.name.toLowerCase()}  ${item.lastname.toLowerCase()}`;
      if (fullName.includes(value)) {
        result.push(item);
      }
    } else if (prop === 'faculty') {
      if (item[prop].includes(value)) {
        result.push(item);
      }
    } else if (prop === 'studyStart') {
      if (String(item[prop]).includes(value)) {
        result.push(item);
      }
    } else {
      const end = +item.studyStart + 4
      if (String(end).includes(value)) {
        result.push(item);
      }
    }
  } return result;
}

function render(arr) {
  const list = document.getElementById('app');
  list.innerHTML = '';

  const fioInp = document.getElementById('filter-form__fio-inp').value.trim().toLowerCase();
  const facultyInp = document.getElementById('filter-form__faculty-inp').value.trim().toLowerCase();
  const studyStartInp = document.getElementById('filter-form__studyStart-inp').value.trim().toLowerCase();
  const endInp = document.getElementById('filter-form__end-inp').value.trim().toLowerCase();

  let newArr = [...arr];

  if (fioInp !== '') newArr = filter(newArr, 'fio', fioInp);
  if (facultyInp !== '') newArr = filter(newArr, 'faculty', facultyInp);
  if (studyStartInp !== '') newArr = filter(newArr, 'studyStart', studyStartInp);
  if (endInp !== '') newArr = filter(newArr, 'end', endInp);

  for (const user of newArr) {
    const tr = document.createElement('tr');
    const fioTh = document.createElement('th');
    const facultyTh = document.createElement('th');
    const birthdayTh = document.createElement('th');
    const studyStartTh = document.createElement('th');

    const date = new Date();
    const birth = new Date(user.birthday)
    const fullYear = date.getFullYear();
    const year = birth.getFullYear();
    const month = birth.getMonth() + 1;
    const day = birth.getDate();

    let curs = null;
    const dateCurs = new Date();
    const monthCurs = dateCurs.getMonth() + 1;

    if (fullYear - user.studyStart > 4) {
      curs = `Обучение завершино`;
    } else if (monthCurs < 9) {
      curs = `${fullYear - user.studyStart} курс`;
    } else {
      curs = `${fullYear - user.studyStart + 1} курс`;
    }

    fioTh.textContent = `${user.surname} ${user.name} ${user.lastname}`;
    facultyTh.textContent = `${user.faculty}`;
    birthdayTh.textContent = `${day}.${month}.${year} (${fullYear - year})`;
    studyStartTh.textContent = `${user.studyStart}-${+user.studyStart + 4} (${curs})`;

    list.append(tr);
    tr.append(fioTh, facultyTh, birthdayTh, studyStartTh);
  }
}

document.getElementById('filter-form').addEventListener('submit', (e) => {
  e.preventDefault();
  render(studentsList)
})


document.getElementById('add-form').addEventListener('submit', (e) => {
  e.preventDefault();

  const surname = document.getElementById('add-form__surname-inp');
  const name = document.getElementById('add-form__name-inp');
  const lastname = document.getElementById('add-form__lastname-inp');
  const birthday = document.getElementById('add-form__birthday-inp');
  const studyStart = document.getElementById('add-form__studyStart-inp');
  const faculty = document.getElementById('add-form__faculty-inp');

  validateForm(container, surname, name, lastname, birthday, studyStart, faculty, studentsList);
});

document.getElementById('fio').addEventListener('click', () => {
  const tr = Array.from(container.querySelectorAll('tr'));
  tr.sort((a, b) => {
    const aText = a.querySelector('th:nth-child(1)').textContent;
    const bText = b.querySelector('th:nth-child(1)').textContent;
    return aText.localeCompare(bText);
  });
  for (const item of tr) {
    container.appendChild(item);
  }
})

document.getElementById('faculty').addEventListener('click', () => {
  const tr = Array.from(container.querySelectorAll('tr'));
  tr.sort((a, b) => {
    const aText = a.querySelector('th:nth-child(2)').textContent;
    const bText = b.querySelector('th:nth-child(2)').textContent;
    return aText.localeCompare(bText);
  });
  for (const item of tr) {
    container.appendChild(item);
  }
})

document.getElementById('birthday').addEventListener('click', () => {
  const tr = Array.from(container.querySelectorAll('tr'));
  tr.sort((a, b) => {
    const aText = a.querySelector('th:nth-child(3)').textContent;
    const bText = b.querySelector('th:nth-child(3)').textContent;
    const pattern = /\((\d+)\)/;
    const aMatch = +aText.match(pattern)[1];
    const bMatch = +bText.match(pattern)[1];
    return aMatch - bMatch;
  });
  for (const item of tr) {
    container.appendChild(item);
  }
})

document.getElementById('year').addEventListener('click', () => {
  const tr = Array.from(container.querySelectorAll('tr'));
  tr.sort((a, b) => {
    const aText = a.querySelector('th:nth-child(4)').textContent;
    const bText = b.querySelector('th:nth-child(4)').textContent;
    const aYear = +aText.split('-')[0];
    const bYear = +bText.split('-')[0];
    return aYear - bYear;
  });
  for (const item of tr) {
    container.appendChild(item);
  }
})

