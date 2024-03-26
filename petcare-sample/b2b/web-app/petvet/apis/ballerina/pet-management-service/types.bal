type PetItem record {|
    string name;
    string breed;
    string dateOfBirth;
    Vaccination[] vaccinations?;
|};

type Pet record {|
    *PetItem;
    readonly string id;
    *OwnerInfo;
|};

type Thumbnail record {|
    string fileName;
    string content;
|};

type Vaccination record {|
    string name;
    string lastVaccinationDate;
    string nextVaccinationDate?;
    boolean enableAlerts?;
|};

type PetRecord record {|
    *Pet;
    record {
        *Thumbnail;
    } thumbnail?;
    MedicalReport[] medicalReports?;
|};

type PetVaccinationRecord record {|
    *OwnerInfo;
    string id;
    string name;
    string breed;
    string dateOfBirth;
    string vaccinationName?;
    string lastVaccinationDate?;
    string nextVaccinationDate?;
    boolean enableAlerts?;
|};

type Notifications record {|
    boolean enabled;
    string emailAddress?;
|};

type Settings record {|
    Notifications notifications;
|};

type SettingsRecord record {|
    *OwnerInfo;
    *Settings;
|};

type PetAlert record {|
    *Pet;
    string emailAddress;
|};

type OwnerInfo record {|
    readonly string owner;
    readonly string org;
|};

type EmailContent record {|
    EmailType emailType;
    Property[] properties;
    string receipient;
    string emailSubject;
|};

type Property record {|
    string name;
    string value;
|};

enum EmailType {
    VACCINATION_ALERT = "Vaccination Alert"
}

type MedicalReportItem record {|
    string diagnosis;
    string treatment?;
    Medication[] medications?;
|};

type MedicalReport record {|
    *MedicalReportItem;
    string createdAt;
    string updatedAt;
    readonly string reportId;
|};

type Medication record {|
    string drugName;
    string dosage;
    string duration;
|};

type MedicalReportRecord record {|
    *Medication;
    *MedicalReport;
|};
