To add a new snippet:

1. define snippet in src/snippets.code-snippets
2. thats it lol

To add a new quick action:

1. Define new command in package.json
2. Create and register new command in extension.js
3. Add new action to defeinitions in src/actionsProvider.js. Make sure the command property is set to the ID of the new command you made
