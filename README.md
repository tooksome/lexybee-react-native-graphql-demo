# lexybee-react-native-graphql-demo
A Spelling Bee game clone to show professional React Native - GraphQL - Serverless app architecture

This is a clone of the NYTimes Spelling Bee app, meant to demonstrate some advanced features of
React in a context larger than the typical demo but smaller than a full-blown app.

Things that were hard to figure out:

* Handling cache updates of array responses from GraphQL.
  - You must ensure that objects are deep copied (i.e. that you do not update arrays in place) for updates to work correctly
* Cursor'ed loading of lists on scroll, with debounce and timeout to prevent repeated calls.
  - use a state variable to track refreshing status, along with a timeout in case of problems
  - must chain resetting the refresh sentinel with a `.finally` on the GraphQL promise
* Navigation to a single screen that has various navigation header values. (BeeListScreen -> BeeScreen)
* React-native-elements theming and Night mode handling (at least, the start of it -- it's pretty bad)
* Screen controls within the Navigation header (`React.useLayoutEffect` in BeeScreen)
* Showing/Hiding elements in other components (BeeScreen => WordLists to toggle the wrong answers with the hints)
* KeyboardAvoidingView in BeeScreen. Top-level SafeAreaView and other wrappers in AppWrapper
* Form validation with Yup and not Formik -- Formik might be OK for large forms but is very heavyweight on the code
* Getting a handle to another component with Callback Ref (BeeScreen -> WordLists) and useRef (NewBee)
  - Can only use `ref=` on a class Component, not on a function component
* Scrolling within a SectionList
* List Performance:
  - Use `React.memo`, not `PureComponent`
  - Use `getItemLayout`; to find the height of the element, add this to the wrapping element:
      `onLayout={(event) => (console.log(event.nativeEvent.layout))}`

Things you should know are imperfect:

* We've settled on Paper as a better component library than react-native-elements:
  - Uniform appearance between platforms. This is a feature-not-bug for a small team unwilling to risk bugs from platform geometry variations.
  - Theming is significantly better; much less styling carried around with components
* There's still too much intertwingling of the screens and logic.
  - specifically, the amount of GraphQL logic in the screens.
* The array handling and re-handling in Bee is way too duplicative and inefficient.
