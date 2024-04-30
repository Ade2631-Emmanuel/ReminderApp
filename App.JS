//To retrieve elements from the DOM
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


// Add event listener for click events on the container
reminderCardsContainer.addEventListener('click', function(event) {
    const target = event.target;

    // Check if the clicked element has the class remove-btn
    if (target.classList.contains('remove-btn')) {
        // Get the ID of the reminder from the data-id attribute
        const id = parseInt(target.dataset.id);
        removeReminder(id);
    }

    // Check if the clicked element has the class edit-btn
    if (target.classList.contains('edit-btn')) {
        // Get the ID of the reminder from the data-id attribute
        const id = parseInt(target.dataset.id);
        editReminder(id);
    }
});

// Function to display reminder card
function displayReminderCard(reminder) {
    // This line creates a new '<div>' (card) element in the document and stores it in a variable called 'card'
    const card = document.createElement('div');

    // This line adds the css class 'card' to the newly created '<div>' element
    card.classList.add('card');

    // Set the ID of the card using the reminder's ID
    card.id = 'reminder-' + reminder.id;

    // This code sets the inner HTML content of the card element
    card.innerHTML = `
        <h3>${reminder.title}</h3>  
        <p>${reminder.description}</p>  
        <p>Date: ${reminder.date}</p>  
        <p>Time: ${reminder.time}</p>
        <button class="remove-btn" data-id="${reminder.id}">Remove</button>
        <button class="edit-btn" data-id="${reminder.id}">Edit</button>
    `;

    // This line appends the newly created element to the reminder cards container('reminderCardsContainer')
    reminderCardsContainer.appendChild(card);
}

// Function to remove reminders from local storage and UI
function removeReminder(id) {
    // Remove from localStorage
    let reminders = JSON.parse(localStorage.getItem('reminders')) || [];
    reminders = reminders.filter(reminder => reminder.id !== id);
    localStorage.setItem('reminders', JSON.stringify(reminders));

    // Remove from UI
    const reminderCard = document.getElementById('reminder-' + id);
    if (reminderCard) {
        reminderCard.remove();
    }
}


// Variable to store the ID of the reminder being edited
let editingReminderId = null;

// Function to edit reminder
function editReminder(id) {
    // Store the ID of the reminder being edited
    editingReminderId = id;

    let reminders = JSON.parse(localStorage.getItem('reminders')) || [];
    const reminder = reminders.find(r => r.id === id);

    // Populate form with reminder details for editing
    titleInput.value = reminder.title;
    descriptionInput.value = reminder.description;
    datePicker.value = reminder.date;
    timePicker.value = reminder.time;

    // Remove the reminder card from UI
    removeReminder(id);
}

// Event listener for form submission
reminderForm.addEventListener('submit', function(event) {
    // This prevents a default form submission
    event.preventDefault();

    // This creates a reminder object with the updated details
    const updatedReminder = {
        id: editingReminderId,
        title: titleInput.value,
        description: descriptionInput.value,
        date: datePicker.value,
        time: timePicker.value
    };

    // Update reminder details in local storage
    updateReminder(updatedReminder);

    // Reset the editingReminderId
    editingReminderId = null;

    // Reset form after editing
    reminderForm.reset();
});

// Function to update reminder details in local storage
function updateReminder(reminder) {
    let reminders = JSON.parse(localStorage.getItem('reminders')) || [];
    const index = reminders.findIndex(r => r.id === reminder.id);
    if (index !== -1) {
        reminders[index] = reminder;
        localStorage.setItem('reminders', JSON.stringify(reminders));

        // Update UI if needed
        const reminderCard = document.getElementById('reminder-' + reminder.id);
        if (reminderCard) {
            reminderCard.innerHTML = `
                <h3>${reminder.title}</h3>  
                <p>${reminder.description}</p>  
                <p>Date: ${reminder.date}</p>  
                <p>Time: ${reminder.time}</p>
                <button class="remove-btn" data-id="${reminder.id}">Remove</button>
                <button class="edit-btn" data-id="${reminder.id}">Edit</button>
            `;
        }
    }

}


// Set interval to check due reminders every second
setInterval(checkDueReminders, 1000);

// Function to check due reminders
function checkDueReminders() {
    const reminders = JSON.parse(localStorage.getItem('reminders')) || [];
    const currentDate = new Date();

    reminders.forEach(reminder => {
        if (!reminder.alerted) {
            const reminderDate = new Date(reminder.date + 'T' + reminder.time);
            if (currentDate >= reminderDate) {
                // Mark the reminder as alerted to avoid showing the alert multiple times
                reminder.alerted = true;
                updateReminder(reminder);

                // Play reminder sound
                playReminderSound();

                // Display alert with reminder details after an 8-second delay
                setTimeout(() => {
                    alert(`Reminder: ${reminder.title}\nDescription: ${reminder.description}\nDate: ${reminder.date}\nTime: ${reminder.time}`);

                    // Remove the reminder from the list
                    removeReminderFromList(reminder.id);
                }, 2000);
            }
        }
    });
}

// Function to update reminder details in local storage
function updateReminder(reminder) {
    let reminders = JSON.parse(localStorage.getItem('reminders')) || [];
    const index = reminders.findIndex(r => r.id === reminder.id);
    if (index !== -1) {
        reminders[index] = reminder;
        localStorage.setItem('reminders', JSON.stringify(reminders));
    }
}

// Function to play reminder sound
function playReminderSound() {
    const audioElement = document.getElementById('reminderAudio');
    audioElement.play();
}

// Function to remove reminder from the list and UI
function removeReminderFromList(reminderId) {
    // Remove from localStorage
    let reminders = JSON.parse(localStorage.getItem('reminders')) || [];
    reminders = reminders.filter(r => r.id !== reminderId);
    localStorage.setItem('reminders', JSON.stringify(reminders));

    // Remove from UI
    const reminderCard = document.getElementById('reminder-' + reminderId);
    if (reminderCard) {
        reminderCard.remove();
    }
}

