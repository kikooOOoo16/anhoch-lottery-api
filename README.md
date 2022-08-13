<!-- PROJECT LOGO -->
<p align="center">
  <h3 align="center">NestJS Lottery API</h3>
  <p align="center">
    A NestJS API for running a Lottery web app
    <br/>
  </p>
</p>
<br/>



<!-- TABLE OF CONTENTS -->
<details open="open">
  <summary>Table of Contents</summary>
  <ol>
    <li>
      <a href="#about-the-project">About The Project</a>
      <ul>
        <li><a href="#built-with">Built With</a></li>
      </ul>
    </li>
    <li>
      <a href="#getting-started">Getting Started</a>
      <ul>
        <li><a href="#prerequisites">Prerequisites</a></li>
        <li><a href="#installation">Installation</a></li>
        <li><a href="#initialization">Initialization</a></li>
      </ul>
    </li>
  </ol>
</details>
<br/>


<!-- ABOUT THE PROJECT -->
## About The Project

An API which allows users to play a game from a set of games once a day and record their score (only metadata about game is saved on the server, game implementation must be provied on the FE app). An Admin has control over which game is active and when.
Currently the API provides the following features:
* Authentication and authorization with cookie-session (guards, middleware).
* User sign in/ sign up.
* User google sign in/ sign up.
* User profile data CRUD with profile and cover image.
* User game session endpoints (start, stop game session).
* User score endpoints (save score, view previous scores).
* User verify account and password reset (with email templates).
* Admin create/ sign in.
* Admin commercials CRUD (commercials files upload, active status, statistics, statistics for specific date, watch duration edit).
* Admin games CRUD (edit active status, set/edit active date, leaderboards).
* Nest cron scheduled tasks (handles users played today status and cleans up possible leftover game sessions for now).

### Built With

* [NodeJS](https://nodejs.org/en/)
* [NestJS](https://nestjs.com/)
* [MongoDB](https://www.mongodb.com/)

<!-- GETTING STARTED -->
## Getting Started

In order to use this app a MongoDB Atlas connection is needed as well as a Mailtrap account (for testing email functionalities).

### Prerequisites

* [MongoDB Atlas](https://www.mongodb.com/atlas/database)
* [Mailtrap](https://mailtrap.io/)

### Installation

1. Clone the repo
   ```sh
   git clone https://github.com/kikooOOoo16/anhoch-lottery-api.git
   ```
3. Install NPM packages
   ```sh
   npm install
   ```
4. Inside the app directory create a .env.development file with the following keys:

`.env.development`
   ```JS
    MONGO_DB_URL=mongodb+srv://lottery-game-development:...'connection string'
    MONGO_DB_NAME=development
    COOKIE_SECRET=lkwl223!sdd%AAch[r
    ADMIN_MASTER_PASSWORD=kSDFG3@$^eww121!!sdxcSFG
    PROFILE_IMG_DIR=/profile-images/
    COVER_IMG_DIR=/cover-images/
    COMMERCIAL_VIDEOS_DIR=/commercial-videos/
    DEFAULT_PROFILE_IMG_DIR=/default-profile-image/
    DEFAULT_COVER_IMG_DIR=/default-cover-image/
    UPLOADED_FILES_DESTINATION=./uploads
    EMAIL_HOST=smtp.mailtrap.io
    EMAIL_PORT=2525
    EMAIL_USER=mailtrap_user_string
    EMAIL_PASS=mailtrap_password
    API_URL=http://localhost:3000
    NG_APP_URL=http://localhost:4200
   ```

### Initialization

1. The API's start scripts are configured inside the package.json file. To start the API in dev mode just run :
   ```sh
   npm run start:dev
   ```

<!-- CONTACT -->
## Contact

Kristijan Pavlevski - kristijan.pavlevski@outlook.com

Project Link: [https://github.com/kikooOOoo16/anhoch-lottery-api](https://github.com/kikooOOoo16/anhoch-lottery-api)
