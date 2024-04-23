const { google } = require('googleapis');
const readline = require('readline');
const fs = require('fs');
const path = require('path');
const { calendar, calendar_v3 } = require('googleapis/build/src/apis/calendar');
const { encodeBase64 } = require('bcryptjs');
const { v4: uuidv4 } = require('uuid');
const interviewSchedule = require('../models/interviewSchedule.model');
const { User, Organization, JobOpening, JobRole } = require('../models');
const emailService = require('../services/email.service');
const Resumes = require('../models/resume.model');

// Load client secrets from a file downloaded from the Google Cloud Console
const credentialsPath = path.join(__dirname, '../seeder/data/credentials.json');
const credentials = JSON.parse(fs.readFileSync(credentialsPath));

// console.log(credentials, 'credentials');

const SCOPES = ['https://www.googleapis.com/auth/calendar.events'];

// Create an OAuth2 client
const { client_secret, client_id, redirect_uris } = credentials.installed;

function getAccessToken(oAuth2Client, str) {
  return new Promise((res, _) => {
    const authUrl = oAuth2Client.generateAuthUrl({
      access_type: 'offline',
      scope: SCOPES,
    });
    console.log('Authorize this app by visiting this URL:', authUrl);

    res(authUrl + '&state=' + str);
  });
}

async function authorize(id, redirectEndpoint) {
  console.log('authorize');
  let oAuth2Client = new google.auth.OAuth2(client_id, client_secret, redirect_uris[0]);
  let ps;
  ps = getAccessToken(oAuth2Client, JSON.stringify({ id: id, endPoint: redirectEndpoint }));

  return ps;
}


function getgoogleToken(code, state, createEventValue) {
  return new Promise((res, rej) => {
    let oAuth2Client = new google.auth.OAuth2(client_id, client_secret, redirect_uris[0]);
    console.log(code, state, 'code..');
    oAuth2Client.getToken(code, (err, token) => {
      if (err) {
        rej(err);
        return console.error('Error retrieving access token', err);
      }
      oAuth2Client.setCredentials(token);
      if (createEventValue === true) {
        (deleteEvent(oAuth2Client, state, res));
      } else {
        res(createEvent(oAuth2Client, state));
      }
    });
  });
}

async function deleteEvent(auth, state, res) {
  console.log(auth, state);
  const calendar = google.calendar({ version: 'v3', auth });
  const interviewEventData = await interviewSchedule.findById(state);
  console.log(interviewEventData, 'interviewEventData');
  if (!interviewEventData) {
    throw new ApiError(httpStatus.NOT_FOUND, 'There is no schedule Interview');
  }

  await interviewEventData.remove();
  try {
    await calendar.events.delete({
      calendarId: 'primary', // or the calendar ID where the event is located
      eventId: interviewEventData.eventId, // specify the event ID you want to delete
    });
    console.log('Meeting deleted successfully.');
    res('Meeting deleted successfully.')
  } catch (error) {
    console.error('Error:', error.message);
  }
}

async function createEvent(auth, state) {
  const emailIds = [];
  const eventData = await interviewSchedule.findById(state);
  const user = await User.findById(eventData.scheduleByUserid);
  const organization = await Organization.findById(user.organization);
  const jobOpening = await JobOpening.findById(eventData.jobId);
  const jobRole = await JobRole.findById(jobOpening.jobRole)
  const timeZone = Intl.DateTimeFormat().resolvedOptions().timeZone;
  const calendar = google.calendar({ version: 'v3', auth });
  eventData.Attendee.forEach((element) => {
    emailIds.push(element);
  });
  emailIds.push(eventData.candidateEmail);
  console.log(eventData,'location');
  let resumeId = eventData.resumeId;
  let cvLink = await Resumes.findById(resumeId);
let description;
  if(eventData.provider === 'zoom meeting') {
    description = `Zoom Meeting Link: ${eventData.meetingLink} \n,CV Link: ${cvLink.cv_url}`;
  }
  else {
    description = `CV Link: ${cvLink.cv_url}`;
  }
  
  const event = {
    summary: `Interaction with ${organization.name} for ${jobRole.name}`,
    location: eventData.location,
    description: description,
    start: {
      dateTime: eventData.date+'T'+eventData.time.start,
      timeZone: timeZone,
    },
    end: {
      dateTime: eventData.date+'T'+eventData.time.end,
      timeZone: timeZone,
    },
    conferenceData: eventData.provider === 'zoom meeting'? `Zoom Meeting Link: ${eventData.meetingLink}` : {
      createRequest: {
        requestId: uuidv4(), // Generates a unique UUID
        conferenceSolutionKey: {
          type: 'hangoutsMeet',
        },
      },
    },
    attendees: emailIds,
  };

  return new Promise((resolve, reject) => {
    calendar.events.insert(
      {
        calendarId: 'primary',
        resource: event,
        conferenceDataVersion: 1,
      },
      async (err, res) => {
        if (err) {
          console.error('Error creating event:', err);
          reject(err); // Reject the promise on error
        } else {
          console.log('Event created: %s', res.data);
          await interviewSchedule.updateOne({ _id: state }, { $set: { eventId: res.data.id } });
          // console.log(res,auth);
          let meeting = eventData.provider === 'zoom meeting' ? eventData.meetingLink : res.data.hangoutLink;
          resolve(meeting); // Resolve the promise with the link
        }
      }
    );
  });
}


const getinterviewDataById = (async(id,queryValue) => {
  if(queryValue) {
      await interviewSchedule.updateOne({_id: id},{$set: {isGenerateQA: queryValue}});
    } else {
      await interviewSchedule.updateOne({_id: id},{$set: {isGenerateQA: false}});
    }
  console.log(id);
  return interviewSchedule.findById(id);
})


const SendingMail = async (body, deleteMsg) => {
  console.log(body, deleteMsg);
  let emailIds = [];
  body.Attendee.forEach((element) => {
    emailIds.push(Object.values(element));
  });
  const profile = await Resumes.findOne({email: body.candidateEmail.email});
  const mergedArray = emailIds.reduce((acc, currentArray) => acc.concat(currentArray), []);
  const currUser = await User.findById(body.scheduleByUserid);
  const currUserOrg = await Organization.findById(currUser.organization);
  const jobOpening = await JobOpening.findById(body.jobId);
  const jobRole = await JobRole.findById(jobOpening.jobRole);
  await emailService.googleMeetEmail(
    body.candidateEmail.email,
    body.candidateFirstname,
    mergedArray,
    currUserOrg.name,
    jobRole.name,
    body.meetingLink,
    body.date,
    body.time,
    profile,
    deleteMsg
  );
};

module.exports = { authorize, getgoogleToken,getinterviewDataById,SendingMail };
