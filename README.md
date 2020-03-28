# lexybee-react-native-graphql-demo
A Spelling Bee game clone to show professional React Native - GraphQL - Serverless app architecture

This is a clone of the NYTimes Spelling Bee app, meant to demonstrate some advanced features of
React in a context larger than the typical demo but smaller than a full-blown app.

## Mechanics to adopt:

* We evaluated NativeBase, VueNative and React Native. RN was the clear
  winner in documentation and lack of weird library incompatibilities
* We chose not to use a typing system. For a small team the number of
  bugs it catches just isn't worth the increase in verbosity. We want
  simple, readable code that you can dive right in to.
* After testing multiple backend strategies I am firmly in favor of
  pure Apollo to Serverless. Redux was much too wordy and esoteric;
  again, we want a codebase that any junior engineer can walk up to
  and get to work on.
* Versioning with Conventional Commits
  - Keeps a single version number in help/about screens, app
    manifests, and git tags.
  - see the custom updater to stuff the version number into the About
    screen
  - creates a CHANGELOG and forces people to be considerate with
    commit messages.
* Always prefer functional components over class components.
  - State handling is cleaner and simpler
  - Hooks are awesome and the future
  - Less code


## Code to Steal

Things that were hard to figure out:

* Handling cache updates of array responses from GraphQL.
  - You must ensure that objects are deep copied (i.e. that you do not update arrays in place) for updates to work correctly
* Cursor'ed loading of lists on scroll, with debounce and timeout to prevent repeated calls.
  - use a state variable to track refreshing status, along with a timeout in case of problems
  - must chain resetting the refresh sentinel with a `.finally` on the GraphQL promise
* Navigation to a single screen that has various navigation header values. (BeeListScreen -> BeeScreen)
* React-native-elements theming and Night mode handling (at least, the start of it -- it's pretty bad). This is terrible enough we have switched to Paper
* Form validation with Yup but not Formik -- Formik might be OK for large forms but is very heavyweight on the code
* Screen controls within the Navigation header (`React.useLayoutEffect` in BeeScreen)
* Showing/Hiding elements in other components (BeeScreen => WordLists to toggle the wrong answers with the hints)
* KeyboardAvoidingView in BeeScreen. Top-level SafeAreaView and other wrappers in AppWrapper
* Getting a handle to another component with Callback Ref (BeeScreen -> WordLists) or with useRef Hook (NewBee)
  - Can only use `ref=` on a class Component, not on a function component
  - You can only use hooks such as useRef in a function component.
  - You can pass a callback ref through any kinds of components;
    `BeeScreen` reaches into the guts of the WordList to force it to
    scroll to a newly-added word. (Note, though, that is ugly at best
    and quite possibly done wrong: The enclosing component shouldn't
    know those details of its child. Also there is a race condition
    between adding the word to the list and scrolling to it -- but
    this works well enough. If a person reading this knows better
    please let me know.)
* Scrolling within a SectionList
* List Performance:
  - Use `React.memo`, not `PureComponent`
  - Use `getItemLayout`; to find the height of the element, add this to the wrapping element:
      `onLayout={(event) => (console.log(event.nativeEvent.layout))}`
* `esm` lets you use modern Javascript everywhere, without require vs module conflicts.
* Use the functional form of setState -- `setFoo((foo) => (foo + letter))` -- if the new state depends on the old state. `setFoo(foo+letter)` is a race condition.


## Links

* [RN Layout Cheat Sheet](https://medium.com/wix-engineering/the-full-react-native-layout-cheat-sheet-a4147802405c)
* [Apollo GraphQL Docs](https://www.apollographql.com/docs/react/v3.0-beta/data/queries/)
* [Expo Docs](https://docs.expo.io/versions/v36.0.0/sdk/overview/)
* [React Native Docs](https://reactnative.dev/docs/textinput)
* [React Navigation Docs](https://reactnavigation.org/docs/tab-based-navigation)
* [Material Icons Catalog](https://material.io/resources/icons/?icon=visibility_off&style=baseline)
* [Lodash Docs](https://lodash.com/docs/4.17.15#assign)
* [Javascript Docs](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects)
* Local server frontends (only work once you've started the servers locally)
  - [Local DynamoDB shell](http://localhost:8000/shell/)
  - [Local GraphQL playground](http://localhost:4000/graphql) (
  - [Expo Dev Tools](http://localhost:19002/)
  - [Expo Web View](http://localhost:19006/Inventory/Inventory)

## TODO

Things you should know are imperfect:

* We've settled on Paper as a better component library than react-native-elements:
  - Uniform appearance between platforms. This is a feature-not-bug for a small team unwilling to risk bugs from platform geometry variations.
  - Theming is significantly better; much less styling carried around with components
* We are still selecting a test library and methodology
* There's still too much intertwingling of the screens and logic.
  - specifically, the amount of GraphQL logic in the screens.
* The array handling and re-handling in Bee is way too duplicative and inefficient.
