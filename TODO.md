## NOW

- [ ] improve loading states (login skeleton -> loading text -> profile)
- [ ] be able to update the user on Edit Profile page
  - [ ] profilePic (do I save in PostgreSQL? or S3 bucket?)
  - [x] isConnecting, firstName, lastName, location, birthDate, favoriteSports
  - [x] GET on component load (Profile and ProfileEdit)
  - [x] PATCH on "Save Changes"
  - [x] PATCH on "Stop/Start Connecting"
- [x] create a user on signup in database
- [x] user schema
- [x] setup database and ORM (local dev)
- [x] setup supabase auth (login and signup and protected routes)
- [x] login and signup page (UI only)
- [x] research design improvements (re-read email)
- [x] deploy to linode server
- [x] switching out fan text on home page
- [x] mobile responsiveness
- [x] hamburger menu on mobile view
- [x] add in Logo and favicon
- [x] add in correct primary and green accent (see email)
- [x] try out primary for nav bg
- [x] work on max width for pages
- [x] finish dynamic sweepstake page
- [x] finish pages
- [x] add lucide react icons
- [x] setup theming with shadcn and tailwind (no dark mode yet)
- [x] add shadcn to frontend
- [x] add linting to frontend and backend (prettier)
- [x] add formatting to frontend and backend (eslint)

## Frontend

1. Setup + tooling (~ 3 hours)
   - new repo with React/Vite/Tailwind/shadcn with linter and formatter
2. Routing and theming (~ 3 hours)
   - React router for different pages and components
   - shadcn + tailwind for theming
3. Home / feed page (~ 3 hours)
4. Find a Fan (~ 3 hours)
5. Rankings (~ 3 hours)
6. Profile pages (~ 6 hours)
7. Sweepstakes (~ 3 hours)
8. Miscellaneous (~ 4 hours)
   - dummy data generation
   - QA and bug fixes
   - app state
   - responsiveness improvements

## Backend

1. Setup and tooling (~ 3 hours)
   - new git repo with Node.js/Express REST API setup
   - linting, formatting and other tooling
2. Database setup (~ 4 hours)
   - PostgreSQL schema design and setup (users, admin, etc)
   - Database migration setup
3. REST API endpoints (~ 10 hours)
   - development of ~ 12 REST endpoints
   - CRUD logic, validation and error handling
4. Authentication and authorization (~ 6 hours)
   - User registration, login, JWT authentication
   - Admin functionality and role-based access control
   - third-party auth OK
5. Business logic and integrations (~ 5 hours)
   - third-party API integrations if needed
   - logic for matching users together
   - hooking frontend up with backend
6. Security and QA (~ 3 hours)
   - basic input validation and sanitization
   - manual user testing and test environment setup
7. Logging and error handling (~ 2 hours)
   - basic logging setup
   - error tracking / reporting setup
8. Miscellaneous (~ 3 hours)
   - bug fixes and environment configuration setup
   - documentation
9. Deployment (~ 8 hours)
   - VPS provisioning (**Linode** server; see email)
   - Dockerized application development
   - SSL setup
   - Domain / DNS configuration
   - CI/CD pipeline
   - smoke-testing deployed app
