When developing,

using npx nx build functions --watch

in order for nx to keep building 'functions' while you are making changes, HUGE sanity check!

then in a seperate terminal, you can run

npx nx serve functions

OR

firebase emulators:start --only functions

and make changes in functions/src/index.ts
or kroger.ts

to develop on the backend!
