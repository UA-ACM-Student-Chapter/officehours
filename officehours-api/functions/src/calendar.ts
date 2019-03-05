import * as functions from 'firebase-functions';0
import * as admin from "firebase-admin";
import {google} from 'googleapis';

const calendar = google.calendar('v3');
admin.initializeApp();
const db = admin.firestore();

export const bookTimeSlot = functions
    .https
    .onCall((data, context) => {
    // For the reservation we need:
    // - Reserver object (name, email, other contact info) reservation.reserver
    // - Reservation time (startTime, timezone) reservation.time
    // - Class id reservation.classId
    //take a reservation item for input and return a reservation for response
    const reservation = data.reservation;

    db.collection('classes').doc(reservation.classId).get()
        .then((classObj) => {
            // The class object in the database has a few properties
            // classId, defaultDuration, name, calendarId
            const data = classObj.data();
            let endTime = new Date(reservation.time.startTime.valueOf + data.defaultDuration);
            const event = {
                'summary': `${reservation.reserver.name} for ${data.name}`,
                'description': `Office hours with ${reservation.reserver.name} for ${data.name}`,
                'start': {
                    'dateTime': reservation.time.startTime.toLocaleString(),
                    'timeZone': reservation.time.timezone
                },
                'end': {
                    'dateTime': endTime.toLocaleString(),
                    'timeZone': reservation.time.timezone
                },
                'attendees' : [
                    {
                        "email": reservation.reserver.email,
                        "displayName": reservation.reserver.name,
                        "organizer": false
                    }
                ]
            };
        
            calendar.events.insert({
                calendarId: data.calendarId,
                requestBody: event
            }).then((event) => {
                console.log(event);
                return {
                    'responseCode': 210,
                    'event': event.data
                }
            }).catch(err => {
                console.log(err)
                return {
                    'responseCode': 500,
                    'error': true,
                    'errorDescription': err.message
                }
            });

        }).catch(error => {
            console.log(error)
            return {
                'responseCode': 500,
                'error': true,
                'erroDescription': error.message
            }
        });
});

