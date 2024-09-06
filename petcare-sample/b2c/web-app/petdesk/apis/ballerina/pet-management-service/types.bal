type PetItem record {|
    string name;
    string breed;
    string dateOfBirth;
    Vaccination[] vaccinations?;
|};

type Pet record {|
    *PetItem;
    readonly string id;
    readonly string owner;
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
|};

type PetVaccinationRecord record {|
    string id;
    string owner;
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
    readonly string owner;
    *Settings;
|};

type PetAlert record {|
    *Pet;
    string emailAddress;
|};
