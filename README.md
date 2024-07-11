[![Review Assignment Due Date](https://classroom.github.com/assets/deadline-readme-button-24ddc0f5d75046c5622901739e7c5dd533143b0c8e959d652212380cedb1ea36.svg)](https://classroom.github.com/a/J0Dv0VMM)
# Exam #1: "Gioco dei Meme"
## Student: s333968 CICCOMASCOLO ALBERTO 

## React Client Application Routes

- Route `/`: page representing the anonymous user home page. The page contains the actions that an anonymous user can perform, that is, playing a "fast game", logging in and reading game rules.
- Route `/play`: page allowing an anonymous user to play a fast game with a single round. The page contains a single meme image and a group of possible captions to choose as a correct answer.
- Route `/login`: page allowing an anonymous user to login to the platform inserting the correct credentials (made by username and password).
- Route `/users/:id`: page representing the logged in user home page. The page contains the actions that a logged in user can perform, that is, playing a "classic game", logging out and reading the game rules. The `:id` parameter represents the database id of the current logged in user.
- Route `/users/:id/play`: page allowing a logged in user to play a classic game with three rounds. The page contains a meme image and a group of possible captions to choose as a correct answer. The `:id` parameter represents the database id of the current logged in user.
- Route `/users/:id/play/recap`: page showing up when completing a classic game and containing the recap of the correct answers. The `:id` parameter represents the database id of the current logged in user.
- Route `/users/:id/history`: page containing the user history storing information about the games previously played. The `:id` parameter represents the database id of the current logged in user.

## API Server

- GET `/api/images/random`
  - Description: gets a random set of one or three meme images
  - Query parameters: the parameter `quantity` allows to know whether to retrieve one or three images from the database, according to the type of game for which they are required (classic or fast game).
  - Request body content: none
  - Response `200 OK` (on success), `400 Unauthorized` (if not logged in), `500 Internal Server Error` (genric error)
  - Response body content: 
    ```
    [
      {
        id: 2
      },
      ...
    ]
    ```
- GET `/api/images/:id/captions/random`
  - Description: gets a set of seven captions related to a specific meme image
  - Request parameter: the parameter `:id` allows to know to what meme image the captions have to refer to
  - Request body content: none
  - Response: `200 OK` (on success), `500 Internal Server Error` (generic error)
  - Response body content:
    ```
    [
      {
        captionId: 5,
        content: "Quando fai una battuta e nessuno ride",
        correct: 1
      }
      ...
    ]
    ```
- POST `/api/users/:id/history`
  - Description: adds information related to the last played game
  - Request parameter: the parameter `:id` represents the database id of the current logged in user.
  - Request body content:
    ```
    [
      {
        userId: 1,
        imageId: 10,
        score: 5
      }
      ...
    ]
    ```
  - Response: `200 OK` (on success), `400 Unauthorized` (if not logged in), `500 Internal Server Error` (generic error)
  - Response body content: none
- GET `/api/users/:id/history`
  - Description: gets all the game history data related to a specific user
  - Request parameter: the parameter `:id` represents the database id of the current logged in user.
  - Request body content: none
  - Response: `200 OK` (on success), `400 Unauthorized` (if not logged in), `500 Internal Server Error` (generic error)
  - Response body content:
    ```
    [
      {
        roundId: 6,
        userId: 1,
        imageId: 10,
        score: 5
      }
      ...
    ]
    ```
- POST `api/sessions`
  - Description: user login
  - Response: `200 OK` (on success), `400 Unauthorized` (if not logged in)
  - Response body content:
    ```
    {
      id: 1,
      username: "GiacomoColonna"
    }
    ```
- DELETE `api/sessions/current`
  - Description: user logout

## Database Tables

- Table `users` - contains the attributes:
  - `id` (primary key)
  - `username` 
  - `hash`: hashed password 
  - `salt`: password salt
- Table `images` - contains the attribute:
  - `id` (primary key)
- Table `captions` - contains the attributes:
  - `id` (primary key)
  - `content`: caption text
- Table `memes` - contains the attributes:
  - `imageId` (primary key): image of the meme
  - `captionId` (primary key): caption of the meme
- Table `history` - contains the attributes
  - `roundId` (primary key)
  - `userId`: user who played the round
  - `imageId`: meme image of the round
  - `score`: score of the round

## Main React Components

- `History` (in `History.jsx`): the component purpose is to display the user game history after retrieving it from the server.
- `Home` (in `Home.jsx`): the component purpose is to display the home page for both the anonymous and the logged in user according to the client route using it.
- `Login` (in `Login.jsx`): the component purpose is to display and validate the log in form.
- `Match` (in `Match.jsx`): the component purpose is to diplay both the fast and the classic game according to the number of rounds specified when selecting the component in the related client route.
- `Recap` (in `Recap.jsx`): the component purpose is to display the game recap after finishing a classic game.


## Screenshot

![Screenshot](./img/screen_1.bmp)
![Screenshot](./img/screen_2.bmp)

## Users Credentials

- username: `GiacomoColonna`, password: `HelloWorld`
- username: `meme_player`, password: `test`
- username: `ale_`, password: `user_password`
