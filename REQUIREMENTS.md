PI Touch Calendar
====================================================

This project is setup to create a solution for my wife to help in managing our
home by integrating with Google Calendar as well as creating a chore setup for
the kids that will be a mix of the chores for a given individual as well as a
task list that has been setup for each of them for one-off and non-daily recurring
efforts.  This application is going to focus on being touch first, running as
a kiosk style app.

Specific Requirements
----------------------------------------------------

### Authentication

* The application can have a pincode (4-8 digits) that is used to open the app but will not have a "username" or support multiple users.
* The application will have the code supplied via a credential file stored on disk under the user's home directory (`.config/pi-touch-calendar/`)
* The application will authenticate with google using OAuth, when this is setup it will display a QR code for scanning so that a phone can authenticate the application and the user.
* The application will keep a log of authenticated requests, this log should be rotated on a daily basis and delete the logs that are older then 90 days.

### Interface

* This application should use a basic setup that is clean, with a primary color of pink (or rose gold) and accents to match.
* The interface should focus on larger buttons that are easy to touch, and have all navigation being able to be driven by buttons on the page.
* The interface should not have open text boxes, all changes to modify the flow will be done by modifying a google sheet that outlines the configuration.

### Tie in to Google OAuth

* The application will use google apis to access data including: email, calendar, tasks and drive (specifically a google sheet).
* The application should add instructions in the README.md that outline how to create a google project, oauth and process for user to authenticate.
* The application will store the oauth token locally on disk in the application configuration directory.
* The application should start with a pincode only if the user is not authenticated with google, if there is an active oauth token for google, it will just go to the landing page.
* The application will show a QR code for a user to connect the application using their mobile device.
* The application will not be accessible over the internet, but should assume the phone and the application are on the same local network.

### Calendar page

* The landing page should be a calendar view that consists of a sinle view of all the calendar items from the specific calendars the user has selected.
* The user can select any calendars that are part of the authenticated account, by default include all the calenders.
* The calendar landing page should have a gear icon that can be used to add or remove calendars to be used.
* The calendar landing page should also have a smaller calendar view on the side that is the schedule for tomorrow.
* The calendar landing page should also have navigation buttons at the bottom that will act as a carousel to view other days (past and next).
* The calendar landing page should also have a refresh button that will pull the latest calendar information.

### Chore page

* There is another page that should exist (and have easy navigation from and back to the calendar app).  This page is the list of chores for the children.
* The children list and the chores are stored in an google sheet.  Each sheet is a unique individual.
* The google sheet default should be called `pi-touch-calendar-chores`, it should be created if one does not exist and the first sheet should be an example with common chores such as brush teeth, make bed.
* The google sheet name can be configured by an environment variable, use `PI_CHORE_SHEET_NAME`.
* There is another google sheet where statistics are to be stored for tasks completed.
* The chore page should include the title of the chore, and then have 7 columns that represent each day of the week (starting with sunday).  If the cell is not empty, then the chore
  should be shown on that day, otherwise the chore will not appear for that day.
* Each day, the list of chores should be pulled from the sheet for all users automatically (around 2:00am)
* There should be a sqlite database that stores the chores that are pulled for a given day for each user and if the chore is complete and when it was completed, the key for the chore should
  be the title of the chore.

### Tracking completed chores

* During the next day, when pulling the list of chores, there should be an update that pushes the details of the chores completed the day before to a google sheet.
* This google sheet should be called `pi-touch-calendar-chores-stats`, it should be created if one does not exist.
* The google sheet name can be configured by an environment variable, use `PI_CHORE_RESULTS_SHEET_NAME`

