import ballerina/task;
import ballerina/time;
import ballerina/log;
import ballerina/http;

configurable string emailService = "localhost";

map<string> emailOutbox = {};

class Job {

    *task:Job;

    public function execute() {

        time:Utc currentUtc = time:utcNow();
        time:Civil currentTime = time:utcToCivil(currentUtc);

        string year;
        string month;
        string day;
        string vacDate;
        [year, month, day] = getDateFromCivilTime(currentTime);

        int|error currentDay = int:fromString(day);
        if (currentDay is error) {
            log:printError("Error while converting day to int: " + currentDay.toString());
            return;
        }
        vacDate = year + "-" + month + "-" + (<int>currentDay + 1).toString();

        PetAlert[] petAlerts = getAvailableAlerts(vacDate);
        foreach var petAlert in petAlerts {

            Vaccination[] selectedVaccinations = [];
            Vaccination[] vaccinations = <Vaccination[]>petAlert.vaccinations;

            foreach var vac in vaccinations {
                string key = petAlert.id + "-" + vac.name + "-" + <string>vac.nextVaccinationDate;
                if !emailOutbox.hasKey(key) {
                    selectedVaccinations.push(vac);
                }
            }
            petAlert.vaccinations = selectedVaccinations;

            if selectedVaccinations.length() > 0 {

                int|error currentMonth = int:fromString(month);
                if (currentMonth is error) {
                    log:printError("Error while converting month to int: " + currentMonth.toString());
                    return;
                }
                string currentDate = getMonthName(currentMonth) + " " + day + ", " + year;
                sendEmail(petAlert, currentDate, vacDate);
            }

        }

    }

    isolated function init() {
    }
}

public function main() returns error? {

    decimal jobIntervalInSeconds = 10;

    task:JobId|task:Error scheduledJob = task:scheduleJobRecurByFrequency(new Job(), jobIntervalInSeconds);
    if (scheduledJob is task:JobId) {
        log:printInfo("Job scheduled to run every " + jobIntervalInSeconds.toString() + " seconds.");
    } else {
        log:printError("Could not schedule the job due to an error." + scheduledJob.toString());
    }

}

function sendEmail(PetAlert petAlert, string currentDate, string vacDate) {

    if emailService == "localhost" {
        log:printWarn("Email not configured. Hence not sending the email for the pet alert: " + petAlert.toString());
        updateEmailOutbox(petAlert);
        return;
    }

    error? sendEmail1Result = connectWithEmailService(petAlert, currentDate, vacDate);
    if sendEmail1Result is error {
        log:printError("Error while sending the email for the pet: " + petAlert.name + ", error: " + sendEmail1Result.toString());
    }
    updateEmailOutbox(petAlert);

}

function getDateFromCivilTime(time:Civil time) returns [string, string, string] {

    string year = time.year.toString();
    string month = time.month < 10 ? string `0${time.month}` : time.month.toString();
    string day = time.day < 10 ? string `0${time.day}` : time.day.toString();
    return [year, month, day];
}

function updateEmailOutbox(PetAlert petAlert) {

    Vaccination[] vaccinations = <Vaccination[]>petAlert.vaccinations;
    foreach var vac in vaccinations {
        string key = petAlert.id + "-" + vac.name + "-" + <string>vac.nextVaccinationDate;
        emailOutbox[key] = key;
    }
}

function getMonthName(int index) returns string {
    match index {
        1 => {
            return "January";
        }
        2 => {
            return "February";
        }
        3 => {
            return "March";
        }
        4 => {
            return "April";
        }
        5 => {
            return "May";
        }
        6 => {
            return "June";
        }
        7 => {
            return "July";
        }
        8 => {
            return "August";
        }
        9 => {
            return "September";
        }
        10 => {
            return "October";
        }
        11 => {
            return "November";
        }
        12 => {
            return "December";
        }
        _ => {
            return "";
        }
    }
}

function connectWithEmailService(PetAlert petAlert, string currentDate, string vacDate) returns error? {

    http:Client httpClient = check new (emailService);
    string emailSubject = "[Pet Care App][Reminder] You have to take your " + petAlert.breed + ", " + petAlert.name +
        " to the vaccination on " + vacDate + ".";

    Vaccination[] vaccinations = <Vaccination[]>petAlert.vaccinations;
    string emailAddress = petAlert.emailAddress;
    string petName = petAlert.name;
    string petBreed = petAlert.breed;
    string petDOB = petAlert.dateOfBirth;
    string vaccineName = vaccinations[0].name;
    string lastVaccinationDate = vaccinations[0].lastVaccinationDate;

    Property[] properties = [
        addProperty("emailAddress", emailAddress),
        addProperty("currentDate", currentDate),
        addProperty("nextVaccinationDate", vacDate),
        addProperty("petName", petName),
        addProperty("petBreed", petBreed),
        addProperty("petDOB", petDOB),
        addProperty("vaccineName", vaccineName),
        addProperty("lastVaccinationDate", lastVaccinationDate)
    ];

    EmailContent emailContent = {
        emailType: VACCINATION_ALERT,
        receipient: emailAddress,
        emailSubject: emailSubject,
        properties: properties
    };

    http:Request request = new;
    request.setJsonPayload(emailContent);

    http:Response response = check httpClient->/messages.post(request);

    if (response.statusCode == 200) {
        return;
    } else {
        return error("Error while sending email, " + response.reasonPhrase);
    }
}

function addProperty(string name, string value) returns Property {
    Property prop = {name: name, value: value};
    return prop;
}
