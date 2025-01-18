import { addEntry } from './export.js';

document.getElementById('loginButton').addEventListener('click', () => {
    const username = document.getElementById('username').value;
    const password = document.getElementById('password').value;
    const loginMessage = document.getElementById('loginMessage');

    if (username === 'fizyacademy' && password === '123456') {
        document.getElementById('loginForm').classList.add('hidden');
        document.getElementById('adminContent').classList.remove('hidden');
        loginMessage.classList.add('hidden');
    } else {
        loginMessage.textContent = 'اسم المستخدم أو كلمة المرور غير صحيحة';
        loginMessage.classList.remove('hidden');
    }
});

document.getElementById('addEntryButton').addEventListener('click', () => {
    const form = document.getElementById('namingForm');

    // Check if the form is valid
    if (form.checkValidity()) {
        const formData = new FormData(form);
        
        const availabilityDate = document.getElementById('availabilityDate').value;
        const formattedDate = formatArabicDate(availabilityDate);

        formData.append('formattedDate', formattedDate);
        
        for (let pair of formData.entries()) {
            console.log(pair[0] + ': ' + pair[1]); // Log form data for debugging
        }
        addEntry(formData);
    } else {
        form.reportValidity(); // Show validation messages
    }
});

function formatArabicDate(dateString) {
    const months = [
        "يناير", "فبراير", "مارس", "أبريل", "مايو", "يونيو", "يوليو", "أغسطس", 
        "سبتمبر", "أكتوبر", "نوفمبر", "ديسمبر"
    ];

    const [year, month, day] = dateString.split('-');
    const arabicMonth = months[parseInt(month) - 1];
    return `${parseInt(day)}-${arabicMonth}-${year}`;
}


let type = document.getElementById('type');
let fileLabel = document.querySelector('label[for="file"]');

type.addEventListener('change', typefinder);
window.addEventListener('DOMContentLoaded', typefinder);

function typefinder() {
    if (type.value === 'video') {
        fileLabel.textContent = 'الفيديو:';
    } else if (type.value === 'exam') {
        fileLabel.textContent = 'الإختبار:';
    } else if (type.value === 'sheet') {
        fileLabel.textContent = 'المذكرة:';
    } else {
        fileLabel.textContent = 'الملف:';
    }
}

let CurrentTerm = document.getElementById('CTerm');

CurrentTerm.addEventListener('change', () => {
    window.localStorage.setItem('CurrentTerm', CurrentTerm.value);
    saveTermToServer(CurrentTerm.value);
});

window.addEventListener('DOMContentLoaded', () => {
    const storedTerm = window.localStorage.getItem('CurrentTerm');
    if (storedTerm) {
        CurrentTerm.value = storedTerm;
    }
    fetchTermFromServer();
});

function saveTermToServer(term) {
    fetch('/save-term', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ term })
    })
    .then(response => response.json())
    .then(data => {
        if (data.status === 'success') {
            console.log('Term saved successfully');
        } else {
            console.error('Error saving term:', data.message);
        }
    })
    .catch(error => {
        console.error('Error:', error);
    });
}

function fetchTermFromServer() {
    fetch('/get-term')
        .then(response => response.json())
        .then(data => {
            if (data.term) {
                CurrentTerm.value = data.term;
                window.localStorage.setItem('CurrentTerm', data.term);
            }
        })
        .catch(error => {
            console.error('Error fetching term:', error);
        });
}

function getArabicOrdinalLesson(number) {
    const ordinalNumbers = [
        "", "الأولى", "الثانية", "الثالثة", "الرابعة", "الخامسة", "السادسة",
        "السابعة", "الثامنة", "التاسعة", "العاشرة", "الحادية عشرة", "الثانية عشرة",
        "الثالثة عشرة", "الرابعة عشرة", "الخامسة عشرة", "السادسة عشرة",
        "السابعة عشرة", "الثامنة عشرة", "التاسعة عشرة", "العشرون",
        "الحادية والعشرون", "الثانية والعشرون", "الثالثة والعشرون",
        "الرابعة والعشرون", "الخامسة والعشرون", "السادسة والعشرون",
        "السابعة والعشرون", "الثامنة والعشرون", "التاسعة والعشرون", "الثلاثون"
    ];

    return ordinalNumbers[number];
}

const directoryName = document.getElementById("directory");
const order = document.getElementById("order");
const directoryOrder = document.getElementById('directoryOrder');

function populateSelect(element, format) {
    element.innerHTML = '';

    for (let i = 1; i <= 30; i++) {
        const option = document.createElement("option");
        if (format === 'directory') {
            const text = getArabicOrdinalLesson(i);
            option.value = `الحصة ${text}`;
            option.text = `الحصة ${text}`;
            option.setAttribute('data-order', i);
        } else if (format === 'order') {
            option.value = i;
            option.text = i;
        }
        element.appendChild(option);
    }

    const defaultOption = document.createElement("option");
    defaultOption.text = "";
    defaultOption.disabled = true;
    defaultOption.selected = true;
    element.insertBefore(defaultOption, element.firstChild);
}

function storeDirectoryIndex(directoryElement, storageElement) {
    directoryElement.addEventListener('change', () => {
        const selectedOption = directoryElement.options[directoryElement.selectedIndex];
        const orderValue = selectedOption.getAttribute('data-order');
        storageElement.value = orderValue; // Store the value in the desired element
    });
}

storeDirectoryIndex(directoryName, directoryOrder);
directoryName.addEventListener('change', () => {
    console.log(directoryOrder.value); // Log directory order for debugging
});

populateSelect(directoryName, 'directory');
populateSelect(order, 'order');
