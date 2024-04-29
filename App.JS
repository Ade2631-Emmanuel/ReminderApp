//To retriwve elements from the DOM
const reminderForm = document.getElementById('Reminder-form');
const titleInput = document.getElementById('title');
const descriptionInput = document.getElementById('description');
const datePicker = document.getElementById('date-picker');
const timePicker = document.getElementById('time-picker');
const reminderCardsContainer = document.getElementById('reminder-card');


//load reminders from local storage on page load
document.addEventListener('DOMContentLoaded', loadReminders); 


//Event listener for form submission
reminderForm.addEventListener('submit', function(event) {
   
    //This prevents a default form submission
    event.preventDefault();
    

    //This creates a reminder object to store the input values from the form
    const reminder = {
        //Unique ID for each reminder
        id: Date.now(),
        title: titleInput.value,
        description: descriptionInput.value,
        date: datePicker.value,
        time: timePicker.value
    };

    //This saves reminder to local storage
    saveReminder(reminder);

    //This displays reminder card
    displayReminderCard(reminder);

    //This resets the form
    reminderForm.reset();

    
 });

    
//function to save reminder to local storage
function saveReminder(reminder) {
    
    //This retrieves the existing reminders from the browser's local storage
    let reminders = JSON.parse(localStorage.getItem('reminders')) || [];
    
    //This line adds the new 'reminder' object to the 'reminders' array
    reminders.push(reminder);

    //This line updates the value assciated with the key 'reminders' in the local storage
    localStorage.setItem('reminders', JSON.stringify(reminders));
}

//Function to load reminders from local storage
function loadReminders() {
    const reminders = JSON.parse(localStorage.getItem('reminders')) || [];
    reminders.forEach(reminder => {
        displayReminderCard(reminder);
    });
}

//function to display reminder card
function displayReminderCard(reminder) {

    //This line creates a new '<div>' (card) element in the document and stores it in a variable called 'card'
    const card = document.createElement('div');
    
    //This line adds the css class 'card' to the newly created '<div>' element
    card.classList.add('card');

    //This code sets the inner HTML content of the card element
    card.innerHTML =  `
        <h3>${reminder.title}</h3>  
        <p>${reminder.description}</p>  
        <p>Date: ${reminder.date}</p>  
        <p>Time: ${reminder.time}</p>
        <button class="remove-btn" onclick="removeReminder(${reminder.id})">Remove</button>
        <button class="edit-btn" onclick="editReminder(${reminder.id})">Edit</button>
    `;
    
    //This line appends the newly created element to the reminder cards container('reminderCardsContainer')
    reminderCardsContainer.appendChild(card);    
}



//function to remove reminders from local storage and UI
function removeReminder(id) {

    //This line retrieves the parent element of the button  
    //const card = button.parentElement;

    //This line extracts the reminder title (the text f the <h3> element)
    //const reminderTitle = card.querySelector('h3').textContent;

    //This lines of code removes reminder from local storage
    let reminders = JSON.parse(localStorage.getItem('reminders')) || [];
    reminders = reminders.filter(reminder => reminder.id !== id);
    localStorage.setItem('reminders', JSON.stringify(reminders));
    
    //This line removes card from UI
    //card.remove(); 
    const reminderCard = document.getElementById('reminder-' + id);
    if (reminderCard) {
        reminderCard.remove();
    }
}

//Function to edit reminder
function editReminder(id) {
    let reminders = JSON.parse(localStorage.getItem('reminders')) || [];
    const reminder = reminders.find(r => r.id == id);

    //Populate form with reminder detais for editimg
    titleInput.value = reminder.title;
    descriptionInput.value = reminder.description;
    datePicker.value = reminder.date;
    timePicker.value = reminder.time;

    //Remove existing reminder from local storage and UI
    removeReminder(id);

    //Resets form after editing
    reminderForm.reset();
}


//Set timeout to alert when reminder elapses
function checkDueReminders() {
    const reminders = JSON.parse(localStorage.getItem('reminders')) || [];
    const currentDate = new Date();

    reminders.forEach(reminder => {
        const reminderDate = new Date(reminder.date + 'T' + reminder.time);
        if (currentDate >= reminderDate) {
            alert('Reminder: ${reminder.title} is due now!');
            playReminderSound();
            removeReminderFromList(reminder);
        }
    });

}

function playReminderSound() {
    const audioElement = document.getElementById('reminderAudio');
    audioElement.play();

}


function removeReminderFromList(reminder) {
    let reminders = JSON.parse(localStorage.getItem('reminders')) || [];
    reminders = reminders.filter(r => r.title !== reminder.title);
    localStorage.setItem('reminders', JSON.stringify(reminders));
}

setInterval(checkDueReminders, 60000);