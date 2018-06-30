# theory-of-poe

## Setup
Required Software
* [Node.js](https://nodejs.org/en)
* [Yarn](https://yarnpkg.com/lang/en/)
* [Git](https://git-scm.com/)


Cloning and building:
```
git clone git@github.com:jacob-swanson/playground.git
cd playground/theory-of-poe/
yarn install
yarn run bootstrap
```

Installing dependencies:
```
lerna add abc # Add abc to all
lerna add abc --scope=@jacob-swanson/js-utils # Add abc to one module
```

## @jswanson/js-utils
Generating `index.ts`
```
yarn run generate-barrels
```