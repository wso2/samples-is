import ballerina/task;
import ballerina/time;
import ballerina/log;
import ballerina/email;
import ballerina/regex;

import ballerina/io;

configurable string emailHost = "smtp.email.com";
configurable string emailUsername = "admin";
configurable string emailPassword = "admin";

map<string> emailOutbox = {};

class Job {

    *task:Job;
    string emailTemplate = "";

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
                sendEmail(petAlert, currentDate, vacDate, self.emailTemplate);
            }

        }

    }

    isolated function init(string emailTemplate) {
        self.emailTemplate = emailTemplate;
    }
}

public function main() returns error? {

    decimal jobIntervalInSeconds = 10;
    string filePath = "/home/ballerina/resources/email_template.html";

    string|io:Error emailTemplate = io:fileReadString(filePath);

    if (emailTemplate is io:Error) {
        log:printError("Error while loading the email template: " + emailTemplate.toString());
        log:printError("Please mount the file to the container. Mount location: /home/ballerina/resources/email_template.html");
        emailTemplate = "";
    } else {
        log:printInfo("Email template loaded successfully.");
    }

    task:JobId|task:Error scheduledJob = task:scheduleJobRecurByFrequency(new Job(check emailTemplate), jobIntervalInSeconds);
    if (scheduledJob is task:JobId) {
        log:printInfo("Job scheduled to run every " + jobIntervalInSeconds.toString() + " seconds.");
    } else {
        log:printError("Could not schedule the job due to an error." + scheduledJob.toString());
    }

}

function sendEmail(PetAlert petAlert, string currentDate, string vacDate, string emailTemplate) {

    if emailHost == "smtp.email.com" {
        log:printWarn("Email not configured. Hence not sending the email for the pet alert: " + petAlert.toString());
        updateEmailOutbox(petAlert);
        return;
    }

    do {
        email:SmtpClient smtpClient = check new (emailHost, emailUsername, emailPassword);
        string emailSubject = "[Pet Care App][Reminder] You have to take your " + petAlert.breed + ", " + petAlert.name +
        " to the vaccination on " + vacDate + ".";

        Vaccination[] vaccinations = <Vaccination[]>petAlert.vaccinations;
        string emailAddress = petAlert.emailAddress;
        string petName = petAlert.name;
        string petBreed = petAlert.breed;
        string petDOB = petAlert.dateOfBirth;
        string vaccineName = vaccinations[0].name;
        string lastVaccinationDate = vaccinations[0].lastVaccinationDate;

        string htmlBody = regex:replace(emailTemplate, "\\{emailAddress\\}", emailAddress);
        htmlBody = regex:replace(htmlBody, "\\{currentDate\\}", currentDate);
        htmlBody = regex:replaceAll(htmlBody, "\\{nextVaccinationDate\\}", vacDate);
        htmlBody = regex:replace(htmlBody, "\\{PetName\\}", petName);
        htmlBody = regex:replace(htmlBody, "\\{PetBreed\\}", petBreed);
        htmlBody = regex:replace(htmlBody, "\\{PetDOB\\}", petDOB);
        htmlBody = regex:replace(htmlBody, "\\{vaccineName\\}", vaccineName);
        htmlBody = regex:replace(htmlBody, "\\{lastVaccinationDate\\}", lastVaccinationDate);

        email:Message email = {
            to: petAlert.emailAddress,
            subject: emailSubject,
            htmlBody: htmlBody
        };

        check smtpClient->sendMessage(email);
        log:printInfo("Email sent for the pet: " + petAlert.name);
        updateEmailOutbox(petAlert);
    }
    on fail var e {
        log:printError("Error while sending the email for the pet: " + petAlert.name + ", error: " + e.toString());
    }

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
