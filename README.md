## Photon

Sample home automation light controlling system using Resin mock API

> This project was bootstrapped with [Create React App](https://github.com/facebookincubator/create-react-app)
> since it provides simple and battle tested boilerplate with many goodies built in. However this is an ejected version
> as I wanted some features not available by default

#### Modifications done on create-react-app boilerplate
* Added support for css-modules. This avoids major headache of maintaining distinct class names across all the components
* Used Scss instead of css, as I feel using a superset of css will increase my developer productivity. All the SCSS files are compiled to css files only. So in the source code, only css files are imported.
  * This decision allows other developers to switch to css if they like and code will look same

* Add [Flow](https://flow.org/) type checking. This allows writing code more confidently.
* Add [Prettier](https://github.com/prettier/prettier) code formatting. I am using VSCode and there's an excellent plugin for prettier that formats code on save
* I have also added a git pre-commit hook using [Husky](https://github.com/typicode/husky) that formats the code before committing it. So that you don't have to use VSCode to get automatic code formatting ;)
* I have added [Redux](https://redux.js.org/) for simple state management. This will also help in standardizing error handling for remote calls. I'll explain this another section.
* Use [React router](https://github.com/ReactTraining/react-router) for declarative routing. Although, we have a single page right now. But why not use a standardized way of creating route paths?


#### Environment variables
This project uses environment variables for configurations like HTTP endpoint of the light bulb API. This allows the code to be decoupled from the configuration and configurables to be frozen at build time.
At the build time, this project looks for .env file in the project root directory. This setup was done by create-react-app automatically while setting up this project. [Look here](https://github.com/facebook/create-react-app/blob/master/packages/react-scripts/template/README.md#adding-custom-environment-variables) for more info.
This project contains *.env.sample* file to describe environment variables required by project. **Don't add any confidential values in this sample file. Original .env file is not checked in git for security reasons.**
> Create a .env file by copying it from .env.sample before running this project  [`cp .env.sample .env`]