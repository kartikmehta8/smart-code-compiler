## What it is capable of doing?
1. Users can program in 4 supported languages - _C, C++, Python & Javascript_.
2. Users can set their default language, stored in the browser's local storage.
3. We can download programs as PDFs on the go.
4. A voice-assisted compiler to whom you can ask your general programming doubts.
5. Detailed Github Repository.
6. If you open an issue on Github, the bot will greet the user to promote Open Source Contribution.

## How do we build it?
1. We used Node.js & Express.js for building the backend.
2. The frontend is built using ReactJs. Axios command was used for result fetching the data & handling the get & post requests.
3. As request occurs, it goes into the states - pending, executing & completed, & jobs are scheduled using MongoDB database.
4. We have used AceEditor as a text editor for our compiler & jsPDF for creating the PDFs instantly.
5. The integrated voice assistant is Alan AI. Alan is an end-to-end conversational AI platform to build robust and reliable in-app voice assistants and chatbots.

## Challenges we ran into?
- Job scheduling and handling API calls were tiresome.
- We have to manage the output file for C & C++ programs, so we have to create a separate folder programmatically and handle the file creations.
- Integration of various NPM modules and third-party software like jsPDF, Alan AI & AceEditor was time-consuming.
- Creating a User Interface that suits the programmer's environment for coding was a challenge for us.

## Our Learnings & Accomplishments:
1. We created a full stack MERN application.
2. Learned about automation using Github.
3. Learned how to handle & inspect API calls by using Postman.
4. Integrated various third-party services in our application like AceEditor & Alan AI.

## What's next for Smart Code Compiler?
- We will try to improve the UI and implement themes.
- As there is no spot for giving test cases, we will implement this feature.
- Train Alan to be smarter.

## Creators
- [Kartik Mehta](https://github.com/kartikmehta8)
- [Manasvi Singh](https://github.com/Alcyone713)

## Getting more from Github!
Open Source Collaborators are welcomed by a bot when they try to open an issue.
