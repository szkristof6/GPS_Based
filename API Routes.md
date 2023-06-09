### HANDLERS

## VERIFY

INPUT: token COOKIE, refreshToken COOKIE (JWT Tokens)
OUTPUT:
ERROR: request.verified = FALSE
SUCCESS: request.verified = TRUE

## CAPTCHA

INPUT: token BODY
OUTPUT:
ERROR: request.captchaVerify = FALSE
SUCCESS: request.captchaVerify = TRUE

### ROUTES

# Védett oldalak ellenörzése

METHOD: GET
URL: /page/verify
HANDLER: VERIFY
OUTPUT: { status: "allowed" : "disallowed" }

## User Paths

# Facebook belépés

METHOD: POST
URL: /login/facebook
HANDLER: CAPTCHA
INPUT SOURCE: FACEBOOK OAUTH, reCAPTCHA
INPUT: { status: String, accessToken: String, token: String }
OUTPUT:
ERROR: { status: "error", message: String }
SUCCESS: { status: "success" }, SET token COOKIE, refreshToken COOKIE

# Google belépés

METHOD: POST
URL: /login/google
HANDLER: CAPTCHA
INPUT SOURCE: GOOGLE OAUTH, reCAPTCHA
INPUT: { credential: String, token: String }
OUTPUT:
ERROR: { status: "error", message: String }
SUCCESS: { status: "success" }, SET token COOKIE, refreshToken COOKIE

# Email belépés

METHOD: POST
URL: /login/user
HANDLER: CAPTCHA
INPUT SOURCE: reCAPTCHA
INPUT: { email: String, password: String, token: String }
OUTPUT:
ERROR: { status: "error", message: String }
SUCCESS: { status: "success" }, SET token COOKIE, refreshToken COOKIE

# Regisztráció

METHOD: POST
URL: /register
HANDLER: CAPTCHA
INPUT SOURCE: reCAPTCHA
INPUT: { firstname: String, lastname: String email: String, password: String, passwordre: String, token: String }
OUTPUT:
ERROR: { status: "error", message: String }
SUCCESS: { status: "success", message: "Please verify your e-mail address!" }

# Visszaállítás kérés

METHOD: POST
URL: /user/reset/password/request
HANDLER: CAPTCHA
INPUT SOURCE: reCAPTCHA
INPUT: { email: String, token: String }
OUTPUT:
ERROR: { status: "error", message: String }
SUCCESS: { status: "success", message: "The e-mail has been sent!" }

# Jelszó visszaállítása

METHOD: POST
URL: /user/reset/password
HANDLER: CAPTCHA
INPUT SOURCE: reCAPTCHA
INPUT: { user_id: String, user_token: String, email: String, password: String, passwordre: String, token: String }
OUTPUT:
ERROR: { status: "error", message: String }
SUCCESS: { status: "success" }

# Felhasználói fiók megerősítése

METHOD: POST
URL: /user/verify
HANDLER: CAPTCHA
INPUT SOURCE: reCAPTCHA
INPUT: { user_id: String, user_token: String, token: String }
OUTPUT:
ERROR: { status: "error", message: String }
SUCCESS: { status: "success" }

# Kilépés

METHOD: POST
URL: /user/logout
HANDLER: VERIFY
OUTPUT:
ERROR: { status: "error", message: String }
SUCCESS: { status: "success" }

## Game paths

# Játék létrehozása

METHOD: POST
URL: /game/create
HANDLER: VERIFY, CAPTCHA
INPUT SOURCE: reCAPTCHA.
INPUT: { name: String, password: String, date: DateTime, map: Array(Object(x: Number, y: Number)), images: Array(String), objects: Array(Object(type: String, team: Number, location: Object(x: Number, y: Number) )) token: String }
OUTPUT:
ERROR: { status: "error", message: String }
SUCCESS: { status: "success" }

# Csatlakozás a játékba

METHOD: POST
URL: /game/join
HANDLER: VERIFY, CAPTCHA
INPUT SOURCE: reCAPTCHA
INPUT: { id: String, password: String, token: String }
OUTPUT:
ERROR: { status: "error", message: String }
SUCCESS: { status: "success" }, SET g_id COOKIE = GAME.\_ID

# Pozició frissítés

METHOD: GET
URL: /game/update/location
HANDLER: VERIFY
INPUT: { location: Object(x, y) }
OUTPUT:
ERROR: { status: "error", message: String }
SUCCESS: { status: "success" }

# Játék adatok lekérdezése

METHOD: GET
URL: /game/data
HANDLER: VERIFY
OUTPUT:
ERROR: { status: "error", message: String }
SUCCESS: { status: "success", map: Array(), objects: Object() }

# Adminként kezelt játékok lekérdezése

METHOD: GET
URL: /game/list/admin
HANDLER: VERIFY
OUTPUT:
ERROR: { status: "error", message: String }
SUCCESS: { status: "success", map: Array(), objects: Object() }

# Kiválasztott játék lekérdezése

METHOD: GET
URL: /game/data/admin/:id
HANDLER: VERIFY
OUTPUT:
ERROR: { status: "error", message: String }
SUCCESS: { status: "success", map: Array(), objects: Object() }

# Játék státus lekérdezés

METHOD: GET
URL: /game/status
HANDLER: VERIFY
OUTPUT:
ERROR: { status: "error", message: String }
SUCCESS: { status: "success", game: Object(count: Number, time: DateTime, status: Boolean ) }

# Játékosok lekérdezése

METHOD: GET
URL: /game/players
HANDLER: VERIFY
OUTPUT:
ERROR: { status: "error", message: String }
SUCCESS: { status: "success", count: Number, players: Array(Object(user: Object( name: String, image: String), team: Object( color: team.color ), location: Object(x: Number, y: Number))) }

# Játék státus: waiting

METHOD: GET
URL: /game/status/waiting
HANDLER: VERIFY, CAPTCHA
OUTPUT:
ERROR: { status: "error", message: String }
SUCCESS: { status: "success" }

# Játék státus: start

METHOD: GET
URL: /game/status/start
HANDLER: VERIFY, CAPTCHA
OUTPUT:
ERROR: { status: "error", message: String }
SUCCESS: { status: "success" }

# Játék státus: stop

METHOD: GET
URL: /game/status/stop
HANDLER: VERIFY, CAPTCHA
OUTPUT:
ERROR: { status: "error", message: String }
SUCCESS: { status: "success" }

# Játék státus: pause

METHOD: GET
URL: /game/status/pause
HANDLER: VERIFY, CAPTCHA
OUTPUT:
ERROR: { status: "error", message: String }
SUCCESS: { status: "success" }

# Játék státus: resume

METHOD: GET
URL: /game/status/resume
HANDLER: VERIFY, CAPTCHA
OUTPUT:
ERROR: { status: "error", message: String }
SUCCESS: { status: "success" }

## Fájlkezelés

# Kép feltőlés

METHOD: POST
URL: /upload/picture
HANDLER: VERIFY, CAPTCHA
INPUT File
OUTPUT:
ERROR: { status: "error", message: String }
SUCCESS: { status: "success", files: Array(String) }

# Kép Megjelenítés

METHOD: GET
URL: /cdn/p/:hash
OPTIONAL: width && height
OUTPUT:
ERROR: { status: "error", message: String }
SUCCESS: Image

## Üzenetes dolgok

# Üzenet küldése

METHOD: POST
URL: /message/send
HANDLER: VERIFY
INPUT: { message: String, receiver_type: String, receiver: String }
OUTPUT:
ERROR: { status: "error", message: String }
SUCCESS: { status: "success" }

# Üzenetek lekérése

METHOD: GET
URL: /message/list
HANDLER: VERIFY
OUTPUT:
ERROR: { status: "error", message: String }
SUCCESS: { count: Number, messages: Array(Object(text: String, type: String, sender: String, time: DateTime )) }

## Player dolgok

# Játékos hozzásadáse

METHOD: GET
URL: /player/add
HANDLER: VERIFY
INPUT: { location: Object(x: Number, y: Number), team_id: String }
OUTPUT:
ERROR: { status: "error", message: String }
SUCCESS: { status: "success" }, SET p_id COOKIE = PLAYER.\_id

# Játékos adatok lekérdezése

METHOD: GET
URL: /player/data
HANDLER: VERIFY
OUTPUT:
ERROR: { status: "error", message: String }
SUCCESS: ??
