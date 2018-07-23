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

#### Redux
I have used REDUX for state management. This allows for a single source of truth about application state. As there is scope for functionality addition which will require state to be maintained at application level, this is good to have addition in this project.
Specifically, I have added REDUX for having a central and out of the box support for error handling of network requests. As all network requests have 3 states, namely in-progress, success, and failed, having a REDUX middleware at the application level that will handle all network calls allows to write error handling logic only once and the listen for different states to update UI.
Whenever a remote call is made, it has to be done through REDUX action creators, which will dispatch the relevant actions on state change of network call.

#### Using Redux DevTools

[Redux Devtools](https://github.com/gaearon/redux-devtools) are enabled by default in development.

- <kbd>CTRL</kbd>+<kbd>H</kbd> Toggle DevTools Dock
- <kbd>CTRL</kbd>+<kbd>Q</kbd> Move DevTools Dock Position
- see [redux-devtools-dock-monitor](https://github.com/gaearon/redux-devtools-dock-monitor) for more detailed information.

If you have the
[Redux DevTools chrome extension](https://chrome.google.com/webstore/detail/redux-devtools/lmhkpmbekcpmknklioeibfkpmmfibljd) installed it will automatically be used on the client-side instead.

DevTools are not enabled during production.

#### Fetch
I have used new [Fetch](https://developer.mozilla.org/en-US/docs/Web/API/Fetch_API) API for network calls in this project instead of AJAX. Since Fetch is relatively newer API, it is not supported on older browsers.
To overcome this limitation I have used a [polyfill](https://github.com/developit/unfetch) for Fetch. This just wraps older XMLHttp method in Promise and exposes interface similar to native Fetch.
Please note that this does not simplify or modify the interface that of native Fetch. It just adds support for older browsers.

#### Storybook
[Storybook](https://github.com/storybooks/storybook) is a UI development and testing library. I have integrated storybook as this will provide required support
for developing new UI components. To run storybook, type this command  -> `yarn run storybook`, and it will run a development server
for storybook. For more options visit the link mentioned above.
This development server will load files with extension `.stories.js` inside src directory