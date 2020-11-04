# BZX UI Framework

## Usage
The framework will be imported in the apps.

Example with staking dashboard:

__Importing styles__

In `staking-dashboard/src/styles/index.scss`

```scss
@import 'base/variables';
@import '../../../ui-framework/src/styles/index.scss';
// ^^^
@import 'base/base';
@import 'base/typography';
```

__Importing a UI component__

Generic: `import {Button} from '@bzxnetwork/ui-framework'`

```jsx
import React from 'react'
import {Button} from '@bzxnetwork/ui-framework'

export default function MyComponent (props) {
  return <Button variant="blue">Stake</Button>
}
```

## Development

* Built with [react-styleguidist](https://react-styleguidist.js.org/)

* run `yarn run dev` or `npx styleguidist server`


## Css styles code structure

* Built with sass
* In styles folder


## Creating a dist

__Note with typescript and transpiling__

There is an issue with the combination of Lerna, Create React App, Yarn workspace and the framework tools. We currently write in ES6 and transpile everything in `dist` which is included in the repo.

We also need to add `declare module '@bzxnetwork/ui-framework'
` to make typescript happy.
