## NOW

### HOMEPAGE

- [x] if user is connecting, has tagline, and ratings filled out, then show 6 user recs (random users if needed)
  - [x] therefore, finish profile tasks first
  - [x] improve styling (like match reason placement)

### FIND A FAN PAGE

- [x] search for users based on name or location
  - [x] fetch all sports for dropdown
  - [x] other two fields: user LOVES Sport or Team (after profile tasks)
- [x] same rec system as homepage (for now)

### RANKINGS PAGE

- [x] search for team and/or player with filters on team/player/sport
  - [x] fetch all sports for dropdown
- [x] show top 5 and bottom 5 teams/players based on users' ratings
  - [x] change player text to athletes
- [x] need ratings first, so do after profile page

### SWEEPSTAKES PAGE

- [x] show active sweepstakes in database
- [x] show past sweepstakes

### SWEEPSTAKES/ID PAGE

- [x] details of sweepstake
- [x] show regular games (sport, teams, date) => user has to pick one selection
- [x] show final game (sport, teams, date) => user has to pick one selection
- [x] submit locks in user's selections

### PROFILE PAGE

- [x] tagline component needs backend connection and persistence for current user
- [x] build profile component needs backend connection and persistence for current user
- [x] have select dropdown populate 10 random entries for Teams/Athletes/Sports

### PROFILE/ID PAGE

- [x] show user's ratings in build profile component table (no edit)
- [x] show user's tagline (no edit)

### Add Friend Feature

#### Backend

- [x] Database Schema Updates (~ 2 hours)
  - [x] Create friendship/connection tables and relationships
  - [x] Implement migration scripts
- [x] API Endpoints (~ 4 hours)
  - [x] Send friend request endpoint
  - [x] Accept/reject request endpoints
  - [x] List pending requests endpoint
  - [x] List friends endpoint
  - [x] Remove friend endpoint
- [x] Business Logic (~ 2 hours)
  - [x] Friend request validation
  - [x] Status handling (pending, accepted, rejected)
- [x] Testing & QA (~ 1 hour)
  - [x] Manual testing in production

#### Frontend

- [x] UI Components (~ 3 hours)
  - [x] Friend request button component
  - [x] Friends list component
- [x] Profile Page Updates (~ 2 hours)
  - [x] Add friend button on other profiles
  - [x] Friends tab/section on user profile
  - [x] Friends tab/section on others' profile
- [x] Friend Request Management (~ 3 hours)
  - [x] Pending requests view
  - [x] Accept/reject UI
  - [x] State management for requests
- [x] Friends List View (~ 2 hours)
  - [x] Friends list on profile page
  - [x] Friend filtering/sorting options
- [x] Testing & Responsive Design (~ 2 hours)
  - [x] Mobile responsiveness
  - [x] UI/UX refinements

### MISC

- [x] enforce selection from list for location autocomplete input on Profile Edit page form
  - [x] hide predictions list on esc and click away
  - [ ] ASK ARTHUR: should location be required before saving form changes?
- [ ] Friend Func.
  - [ ] look into sending an email notification when a user receives a friend request
  - [x] add ability to remove a friend
    - [ ] ASK ARTHUR: confirmation box before removing friend?
  - [ ] disallow friend requests to user's that aren't "connecting" (either by no btn or return a response/toast)
  - [ ] add view permissions for friend vs public users (show friends list and birthdate only if user is a friend of current user)
- [ ] remove `name` field from User model
- [ ] add Zod for type validation

- [x] bug: have user card route to current user if current user
- [x] add keydown event handler for location predictions
- [x] customize email template in Supabase
- [x] add reset password flow
  - [x] create reset password page
  - [x] configure Supabase Auth reset method and redirect url
  - [x] change password page
  - [x] navigation integration
  - [x] think about / ask Arthur about email verification on initial sign up
- [x] add Google Places Autocomplete for profile edit location
- [x] add autocomplete search for Rankings team/athlete search
- [x] add autocomplete search for Find a Fan team search
- [x] look at TODO comments in codebase
- [x] move all frontend types (referenced more than once) to lib/types file
- [x] improve loading states (login skeleton -> loading text -> profile)
  - [x] why is fetch called on Profile page when changing tabs (useAuth was triggering session b/c of supabase signed_in event on tab refocus)
- [x] add autocomplete search (all teams and athletes) for single select dropdown
- [x] add all sports from tagline dropdown to database
  - [x] fetch those sports from backend for dropdown
- [x] add 10 dummy users
- [x] add Teams and Athletes to database schema (should they be separate?)
  - [x] add in initial data from Arthur
- [x] other (non-self) user profile page
- [x] be able to update the user on Edit Profile page
  - [x] profilePic (save to Supabase Storage)
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
