# AINode_chatapp

this app has build with node js and angular with ionic framework

> Install Node js
> Install Angular js [here](https://angular.io/guide/quickstart)

```
npm install -g @angular/cli
ng -v
ng new my-app
cd my-app
ng serve --open
```

> Install Mongodb [here](https://www.mongodb.com/)
> Install Code Editor Like, Vs code, notepad++, sublime etc...

> Check out Angular CLI [here](https://github.com/angular/angular-cli/wiki)

> Install Prettier as Dev Dependency [here](https://www.npmjs.com/package/prettier)

> Install Prettier Extension for vscode
> Ctrl + , for setting in vscode

```
"[javascript]": {
    "editor.formatOnSave": true
},
"[typescript]": {
    "editor.formatOnSave": true
},
"prettier.eslintIntegration": true,
"prettier.singleQuote": true,
```

> Materialize Css [here](https://materializecss.com/). Add CDN to index.html

> Install Materialize Package Or feel free to use CDN

```
npm install materialize-css@next --save
```

> To configure GIT BASH into vs code go to setting.json and add the following:-

```
"terminal.integrated.shell.windows": "C:\\Program Files\\Git\\bin\\bash.exe",
```

> **ng generate component components/authTabs --no-spec --dry-run** for testing which does'nt create actual directory at all

> **ng g module modules/auth --no-spec --flat** create a local auth module for authTabs
> **ng g module modules/auth-routing --no-spec --flat** create a routing related module for route component

> ng g c components/login --no-spec --module=modules/auth.module.ts --dry-run

> ng g c components/login --no-spec --module=modules/auth.module.ts
> ng g c components/signup --no-spec --module=modules/auth.module.ts

> npm install express mongoose --save

> npm install cookie-parser morgan --save

> npm install joi --save

> npm install http-status-codes --save

> npm install bcryptjs --save

> Testing with postman

> npm install jsonwebtoken --save

> ng g service services/auth --no-spec --flat

> npm install cors --save

> ng generate component components/streams --no-spec

> ng g module modules/streams --no-spec --flat

> ng g service services/token --no-spec --flat

> npm install ngx-cookie-service --save

> ng g guard services/auth --no-spec --flat --> choose CanActivate Interface Option

> ng g c components/toolbar --no-spec

> ng g c components/side --no-spec --module=modules/streams.module.ts --dry-run

> ng g c components/side --no-spec --module=modules/streams.module.ts

> ng g c components/postForm --no-spec --module=modules/streams.module.ts

> ng g c components/posts --no-spec --module=modules/streams.module.ts

> ng g service services/post --no-spec --flat --module=modules/streams.module.ts

> ng g class services/token-interceptor --no-spec --flat

> npm install moment --save

> npm install --save socket.io

> npm install socket.io-client --save

> npm install lodash --save

> ng g component components/comments --no-spec --module=modules/streams.module.ts

> ng g component components/people --no-spec --module=modules/streams.module.ts

> config.js

```
module.export = {
    url: `mongodb://localhost:27017/dbname`,
    secret: `yourjsonsecretkeygoeshere_dontShareWithAnyOne`
};
```

##### API Endpoints

1.  User Create
    - /api/chatapp/v1/register - POST
    - /api/chatapp/v1/login - POST
2.  Post Route
    - /api/chatapp/v1/post/add-post - POST (create post)

##### Front End Endpoint

1.  Auth
    - /
2.  Stream aka Home
    - /streams
