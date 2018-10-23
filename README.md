# Office Hours (pending cool name)

Repo for UA ACM DevTeam Office Hours project

_Mission: To make scheduling office hours not suck!_

The idea is a PWA that allows for scheduling of office hours by students. 

## Use Cases
Actor -> **Student**
* view available slots
* register for slots
* cancel registration
* rate appointment
* view appointment history

Actor -> **Professor**
* create class
* set office hour openings
* edit office hours
* statistics 
****

### How it works 
Professor (or generic user) will register for a office hour board. They will get a link from this (they will be able to use a custom name for this if available). They share this link with their students (or whomever they want blocking off time). 
****

## Architecture
**No Backend** -> The app will make use of AWS Cognito for temporary credentials to directly call AWS service

**Stored in DynamoDB** -> NoSQL object of a structure like

**Infrastructure as Code** -> So it's all clear

### Appointments Table
**Primary Key** -> `classId` + `timeSlot`
```json
{
    "classId": "string",
    "timeSlot": "number",
    "duration": "number",
    "student": {
        "name": "string",
        "email": "string"
    }
}
```

### Classes Table
**Primary Key** -> `classId`
```json
{
    "classId": "string",
    "professorName": {
        "name": "string",
        "email": "string"
    },
    "schedule" : {
        "Mon": [],
        "Tue": [],
        "Wed": [],
        "Thu": [],
        "Fri": [],
        "Sat": [],
        "Sun": []
    },
}
```