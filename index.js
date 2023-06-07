
//Alarm Sound
var sound = new Audio("Alarm1.wav");
sound.loop = true;

let arr = []
let setHour = document.getElementById("hour")
let setMinutes = document.getElementById("minutes")
let setSeconds = document.getElementById("seconds")
let setAMPM = document.getElementById("ampm")
let colorChange = document.getElementsByClassName("time")
let incompleteAlarmsholder = document.getElementById("incomplete-alarms")


// Setting alarm

let totalHrs = 12
// Range from 1 to 12 hrs
for (let i = 1; i <= totalHrs; i++) {
    setHour.options[setHour.options.length] = new Option(i < 10 ? '0' + i : i)
}

let totalMins = 59
// Range of 00-59 minutes
for (let i = 0; i <= totalMins; i++) {
    setMinutes.options[setMinutes.options.length] = new Option(i < 10 ? '0' + i : i)
}

let totalSecs = 59
// Range of 00-59 seconds
for (let i = 0; i <= totalSecs; i++) {
    setSeconds.options[setSeconds.options.length] = new Option(i < 10 ? '0' + i : i)
}

let ampm = ["AM", "PM"]
// setting the AM, PM
for (let i = 0; i < ampm.length; i++) {
    setAMPM.options[setAMPM.options.length] = new Option(ampm[i])
}


// display time
function realTime() {
    const date = new Date()
    let hour = date.getHours()
    let minutes = date.getMinutes()
    let seconds = date.getSeconds()
    let AMPM = ""

    if (date.getHours() == 0) {
        hour = 12
    }

    if (date.getHours() >= 12) {
        if (date.getHours() == 12) {
            hour = 12
        } else {
            hour = hour - 12
        }

        AMPM = "PM"
    } else {
        AMPM = "AM"
    }

    if (hour.toString().length == 1) {
        hour = '0' + hour
    }
    if (minutes < 10) {
        minutes = '0' + minutes
    }
    if (seconds < 10) {
        seconds = '0' + seconds
    }

    document.getElementById("Time").innerHTML = hour + ":" + minutes + ":" + seconds + AMPM
}
setInterval(realTime, 1500)


// Creating new Alarm using list:
var createNewTaskElement = function (alarmString) {
    let listItem = document.createElement("li")
    let label = document.createElement("label")
    let deleteButton = document.createElement("button")

    deleteButton.innerText = "Delete" + alarmString[0]
    deleteButton.className = "delete"
    label.innerText = alarmString

    listItem.appendChild(label)
    listItem.appendChild(deleteButton)
    return listItem
}


// Clicking the set alarm button 
document.getElementById("setButton").addEventListener("click", function () {
    let selectedHr = setHour.options[setHour.selectedIndex].value;
    let selectedMin = setMinutes.options[setMinutes.selectedIndex].value;
    let selectedSec = setSeconds.options[setSeconds.selectedIndex].value;
    let selectedAMPM = setAMPM.options[setAMPM.selectedIndex].value;
    console.log(selectedHr, selectedMin, selectedSec, selectedAMPM)
    let len = arr.length + 1

    // Getting today's time
    var today = new Date();
    var dd = String(today.getDate()).padStart(2, '0');
    var mm = String(today.getMonth() + 1).padStart(2, '0'); //January is 0!
    var yyyy = today.getFullYear();

    today = mm + '/' + dd + '/' + yyyy;
    let alarmhr = parseInt(selectedHr)
    if (selectedAMPM == "PM") {
        alarmhr = 12 + alarmhr
    }

    if (selectedAMPM == "AM" && alarmhr == 12) {
        alarmhr = 0
    }
    if (alarmhr.toString.length == 1) {
        alarmhr = '0' + alarmhr
    }
    let timeForAlarm = alarmhr + ":" + selectedMin + ":" + selectedSec
    var d = new Date(`${today} ${timeForAlarm}`);

    // Getting time in milliseconds 
    var milliseconds = d.getTime();

    // storing alarm data in an array
    arr.push([selectedHr, selectedMin, selectedSec, selectedAMPM, milliseconds, len])

   
    arr = arr.sort((a, b) => a[4] - b[4])
    let val = len.toString() + ") " + selectedHr + ":" + selectedMin + ":" + selectedSec + ":" + selectedAMPM

    // creating the alarm list with delete button
    var listItem = createNewTaskElement(val)
    incompleteAlarmsholder.appendChild(listItem)
    // to delete alarm
    bindAlarmEvents(listItem)

    // to check alarm time with real time
    setInterval(() => {
        const date = new Date()
        let hour = date.getHours()
        let minutes = date.getMinutes()
        let seconds = date.getSeconds()
        let AMPM = "AM"
        if (date.getHours() == 0) {
            hour = 12
        }

        if (date.getHours() > 12) {
            if (date.getHours() == 12) {
                hour = 12
            } else {
                hour = hour - 12
            }
            AMPM = "PM"
        } else {
            AMPM = "AM"
        }

        if (hour.toString().length == 1) {
            hour = '0' + hour
        }
        if (minutes < 10) {
            minutes = '0' + minutes
        }
        if (seconds < 10) {
            seconds = '0' + seconds
        }

        // When real time matches with alarm time, shows alert msg and then audio
        if (arr.length != 0 && arr[0][0] == hour && arr[0][1] == minutes && arr[0][2] == seconds && arr[0][3] == selectedAMPM) {
            alert("Alarm is ringing")
            sound.play()
        }
    }, 1000)
})

// alarm stops when u click clear button
document.getElementById("setClear").addEventListener("click", function () {
    sound.pause()
})
var indexDel = 0

// To delete  perticular alarm from the recent listed alarms:
var deleteAlarm = function () {
    let listItem = this.parentNode
    var ul = listItem.parentNode
    var deleteButton = listItem.querySelector("button.delete")
    indexDel = parseInt(deleteButton.innerHTML[6])
    for (let i = 0; i < arr.length; i++) {
        if (arr[i][5] == indexDel) {
            arr.splice(i, 1)
        }
    }
    ul.removeChild(listItem)
}
var bindAlarmEvents = function (alarmListItem) {
    var deleteButton = alarmListItem.querySelector("button.delete")
    deleteButton.onclick = deleteAlarm
}