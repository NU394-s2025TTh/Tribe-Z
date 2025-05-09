# What are the folders within the repository the team is using?

```
+ functions
  + src
  + lib
  + firebase.json
  + ...
+ libs
  + shared
    + src
    + lib
    + ...
+ pizza
  + src
    + components
      + ui
      + ...
  + dist
  + firebase.json
  + ...
```

The project is structured as 3 nx projects: functions, libs, and pizza.
- Pizza contains the main app and is deployed to firebase hosting
- Functions contains firebase functinos and is deployed to firebase functions
- Shared contains utilities and types that are useful in both (e.g., types for firebase function req/res)
