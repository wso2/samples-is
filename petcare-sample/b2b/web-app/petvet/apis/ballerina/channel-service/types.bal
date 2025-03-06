type DoctorItem record {|
    string name;
    string gender;
    string registrationNumber;
    string specialty;
    string emailAddress;
    string dateOfBirth?;
    string address?;
    Availability[] availability;
|};

type Doctor record {|
    *DoctorItem;
    readonly string id;
    readonly string org;
    readonly string createdAt;
|};

type DoctorAvailabilityRecord record {|
    string name;
    string gender;
    string registrationNumber;
    string specialty;
    string emailAddress;
    string dateOfBirth?;
    string address?;
    string id;
    string org;
    string createdAt;
    string date;
    string startTime;
    string endTime;
    int availableBookingCount;
|};

type Thumbnail record {|
    string fileName;
    string content;
|};

type Availability record {|
    string date;
    TimeSlot[] timeSlots;
|};

type TimeSlot record {|
    string startTime;
    string endTime;
    int availableBookingCount;
|};

type BookingItem record {|
    string petOwnerName;
    string mobileNumber?;
    string doctorId;
    string petId;
    string petName;
    string petType;
    string petDoB;
    *AppointmentItem;
|};

type BookingItemUpdated record {|
    *BookingItem;
    BookingStatus|string status;
|};

enum Status {
    CONFIRMED = "Confirmed",
    COMPLETED = "Completed"
}

type BookingStatus CONFIRMED|COMPLETED;

type Appointment record {|
    *AppointmentItem;
    int appointmentNumber;
    BookingStatus|string status;
|};

type AppointmentItem record {|
    string date;
    string sessionStartTime;
    string sessionEndTime;
|};

type NextAppointment record {|
    string doctorId;
    string date;
    string sessionStartTime;
    string sessionEndTime;
    int activeBookingCount;
    int nextAppointmentNumber;
|};

type Booking record {|
    *BookingItem;
    int appointmentNumber;
    BookingStatus|string status;
    readonly string id;
    readonly string org;
    readonly string referenceNumber;
    readonly string emailAddress;
    readonly string createdAt;
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
    BOOKING_CONFIRMED = "Booking Confirmed"
}

type OrgInfo record {|
    *OrgInfoItem;
    readonly string orgName;
|};

type OrgInfoItem record {|
    string name;
    string address?;
    string telephoneNumber?;
    string registrationNumber?;
|};
