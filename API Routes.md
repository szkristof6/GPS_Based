### ROUTES

# Védett oldalak ellenörzése

METHOD: GET
URL: /page/verify
QUERY: access_token
OUTPUT: 
ERROR: { status: "disallowed" }
SUCCESS: { status: "allowed", next: "admin" OR "join" }

## User Paths

# Facebook belépés

METHOD: POST
URL: /login/facebook
INPUT SOURCE: FACEBOOK OAUTH, reCAPTCHA
INPUT: { status: String, accessToken: String, token: String }
OUTPUT:
ERROR: { status: "error", message: String }
SUCCESS: { status: "success", access_token: String }

# Google belépés

METHOD: POST
URL: /login/google
INPUT SOURCE: GOOGLE OAUTH, reCAPTCHA
INPUT: { credential: String, token: String }
OUTPUT:
ERROR: { status: "error", message: String }
SUCCESS: { status: "success", access_token: String }


# Email belépés

METHOD: POST
URL: /login/user
INPUT SOURCE: reCAPTCHA
INPUT: { email: String, password: String, token: String }
OUTPUT:
ERROR: { status: "error", message: String }
SUCCESS: { status: "success", access_token: String }


# Regisztráció

METHOD: POST
URL: /register
INPUT SOURCE: reCAPTCHA
INPUT: { firstname: String, lastname: String email: String, password: String, passwordre: String, token: String }
OUTPUT:
ERROR: { status: "error", message: String }
SUCCESS: { status: "success", message: "Please verify your e-mail address!" }

# Visszaállítás kérés

METHOD: POST
URL: /user/reset/password/request
INPUT SOURCE: reCAPTCHA
INPUT: { email: String, token: String }
OUTPUT:
ERROR: { status: "error", message: String }
SUCCESS: { status: "success", message: "The e-mail has been sent!" }

# Jelszó visszaállítása

METHOD: POST
URL: /user/reset/password
INPUT SOURCE: reCAPTCHA
INPUT: { user_id: String, user_token: String, email: String, password: String, passwordre: String, token: String }
OUTPUT:
ERROR: { status: "error", message: String }
SUCCESS: { status: "success" }

# Felhasználói fiók megerősítése

METHOD: POST
URL: /user/verify
INPUT SOURCE: reCAPTCHA
INPUT: { user_id: String, user_token: String, token: String }
OUTPUT:
ERROR: { status: "error", message: String }
SUCCESS: { status: "success" }

# Kilépés

METHOD: GET
URL: /user/logout
QUERY: access_token
OUTPUT:
ERROR: { status: "error", message: String }
SUCCESS: { status: "success" }

## Game paths

# Játék létrehozása

METHOD: POST
URL: /game/create
QUERY: access_token
INPUT SOURCE: reCAPTCHA.
INPUT: { name: String, password: String, date: DateTime, map: Array(Object(x: Number, y: Number)), images: Array(String), objects: Array(Object(type: String, team: Number, location: Object(x: Number, y: Number) )) token: String }
OUTPUT:
ERROR: { status: "error", message: String }
SUCCESS: { status: "success" }

# Csatlakozás a játékba

METHOD: POST
URL: /game/join
QUERY: access_token
INPUT SOURCE: reCAPTCHA
INPUT: { id: String, password: String, token: String }
OUTPUT:
ERROR: { status: "error", message: String }
SUCCESS: { status: "success", g_id: String }

# Pozició frissítés

METHOD: GET
URL: /game/update/location
QUERY: access_token
INPUT: { location: Object(x, y) }
OUTPUT:
ERROR: { status: "error", message: String }
SUCCESS: { status: "success" }

# Játék adatok lekérdezése

METHOD: GET
URL: /game/data
QUERY: access_token
OUTPUT:
ERROR: { status: "error", message: String }
SUCCESS: { status: "success", map: Array(), objects: Object() }

# Adminként kezelt játékok lekérdezése

METHOD: GET
URL: /game/list/admin
QUERY: access_token
OUTPUT:
ERROR: { status: "error", message: String }
SUCCESS: { status: "success", map: Array(), objects: Object() }

# Kiválasztott játék lekérdezése

METHOD: GET
URL: /game/data/admin/:id
QUERY: access_token
OUTPUT:
ERROR: { status: "error", message: String }
SUCCESS: { status: "success", map: Array(), objects: Object() }

# Játék státus lekérdezés

METHOD: GET
URL: /game/status
QUERY: access_token
OUTPUT:
ERROR: { status: "error", message: String }
SUCCESS: { status: "success", game: Object(count: Number, time: DateTime, status: Boolean ) }

# Játékosok lekérdezése

METHOD: GET
URL: /game/players
QUERY: access_token
OUTPUT:
ERROR: { status: "error", message: String }
SUCCESS: { status: "success", count: Number, players: Array(Object(user: Object( name: String, image: String), team: Object( color: team.color ), location: Object(x: Number, y: Number))) }

# Játék státus: waiting

METHOD: GET
URL: /game/status/waiting
QUERY: access_token
OUTPUT:
ERROR: { status: "error", message: String }
SUCCESS: { status: "success" }

# Játék státus: start

METHOD: GET
URL: /game/status/start
QUERY: access_token
OUTPUT:
ERROR: { status: "error", message: String }
SUCCESS: { status: "success" }

# Játék státus: stop

METHOD: GET
URL: /game/status/stop
QUERY: access_token
OUTPUT:
ERROR: { status: "error", message: String }
SUCCESS: { status: "success" }

# Játék státus: pause

METHOD: GET
URL: /game/status/pause
QUERY: access_token
OUTPUT:
ERROR: { status: "error", message: String }
SUCCESS: { status: "success" }

# Játék státus: resume

METHOD: GET
URL: /game/status/resume
QUERY: access_token
OUTPUT:
ERROR: { status: "error", message: String }
SUCCESS: { status: "success" }

## Fájlkezelés

# Kép feltőlés

METHOD: POST
URL: /upload/picture
QUERY: access_token
INPUT File
OUTPUT:
ERROR: { status: "error", message: String }
SUCCESS: { status: "success", files: Array(String) }

# Kép Megjelenítés

METHOD: GET
URL: /cdn/p/:hash
QUERY: access_token
OPTIONAL: width && height
OUTPUT:
ERROR: { status: "error", message: String }
SUCCESS: Image

## Üzenetes dolgok

# Üzenet küldése

METHOD: POST
URL: /message/send
QUERY: access_token
INPUT: { message: String, receiver_type: String, receiver: String }
OUTPUT:
ERROR: { status: "error", message: String }
SUCCESS: { status: "success" }

# Üzenetek lekérése

METHOD: GET
URL: /message/list
QUERY: access_token
OUTPUT:
ERROR: { status: "error", message: String }
SUCCESS: { count: Number, messages: Array(Object(text: String, type: String, sender: String, time: DateTime )) }

## Player dolgok

# Játékos hozzásadáse

METHOD: GET
URL: /player/add
QUERY: access_token
INPUT: { location: Object(x: Number, y: Number), team_id: String }
OUTPUT:
ERROR: { status: "error", message: String }
SUCCESS: { status: "success", p_id: String }

# Játékos adatok lekérdezése

METHOD: GET
URL: /player/data
QUERY: access_token
OUTPUT:
ERROR: { status: "error", message: String }
SUCCESS: ??
