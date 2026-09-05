const fs = require('fs');
const path = require('path');

console.log('[Mega 800 Bank Builder] Constructing full 800 question database (100 per role)...');

// Load current 50 questions per role from existing bank
const current = require('./assessment_questions');
const bank = JSON.parse(JSON.stringify(current.ROLE_QUESTIONS_BANK));

// Helper to create questions
function q(id, question, options, correctIndex = 0, explanation = '') {
  return {
    id,
    question,
    options,
    correctIndex,
    explanation: explanation || `Option ${String.fromCharCode(65 + correctIndex)} provides the verified industry solution for this scenario.`
  };
}

// 1. Extra 50 Questions for Frontend Developer (IDs 151 - 200)
const EXTRA_FRONTEND = [
  q(151, "In React 19 / Server Actions, how do you handle optimistic UI updates before the server responds?", [
    "Using the `useOptimistic` hook which allows you to define a temporary state update while an async action is pending",
    "Writing to `window.localStorage` synchronously",
    "Pausing JavaScript execution using a while loop until the server returns 200 OK",
    "Disabling the browser rendering engine during the mutation"
  ]),
  q(152, "What causes a 'Hydration Mismatch' error in Next.js / React SSR?", [
    "A disparity between the HTML generated on the server and the initial DOM rendered by the client (e.g. rendering `new Date()` or `typeof window`)",
    "Installing two different versions of Node.js on the server",
    "Using CSS modules instead of Tailwind CSS",
    "Having more than 500 lines of code in a single file"
  ]),
  q(153, "In TypeScript, what is the exact behavior of the `satisfies` operator introduced in TS 4.9?",
    [
      "Validates that an expression matches a type without widening or losing the inferred literal type of the expression",
      "Converts an asynchronous Promise into a synchronous value",
      "Suppresses all compiler type-checking errors like `@ts-ignore`",
      "Compiles TypeScript into Python bytecode"
    ]),
  q(154, "How does TanStack Query (React Query) handle 'stale-while-revalidate' caching?", [
    "Serves cached data immediately to the UI while silently refetching fresh data in the background and updating the view when ready",
    "Deletes the cache immediately whenever the user scrolls",
    "Stores all query results in IndexedDB encrypted with AES-256",
    "Blocks user navigation until the backend API completes the fetch"
  ]),
  q(155, "In modern CSS, what is the advantage of `@container` queries over `@media` queries?", [
    "`@container` queries apply styles based on the width or inline-size of a parent container element rather than the full viewport size",
    "`@container` queries only run inside Docker containers",
    "`@container` queries require a WebAssembly polyfill",
    "`@container` queries can only be applied to `<img>` tags"
  ]),
  q(156, "What is the purpose of the `AbortController` API in fetch requests?", [
    "Allows you to programmatically cancel in-flight HTTP requests when a component unmounts or input changes",
    "Forces the server to delete records from the database",
    "Restarts the user's browser in private mode",
    "Blocks all network requests from external third-party scripts"
  ]),
  q(157, "In React performance optimization, when should you use `useCallback`?", [
    "When passing a callback function as a prop to a memoized child component (`React.memo`) to prevent unnecessary re-renders",
    "On every single function in your entire React application by default",
    "Only inside `useEffect` cleanup handlers",
    "To make synchronous functions run in Web Workers"
  ]),
  q(158, "What does the `Intl.NumberFormat` JavaScript API provide?", [
    "Locale-sensitive formatting for currency, percentages, and units without external libraries",
    "Cryptographic hashing for financial credit card numbers",
    "Automatic conversion of floating point numbers into BigInt",
    "Real-time currency exchange rate conversion from live Forex APIs"
  ]),
  q(159, "How do Web Workers communicate with the main browser UI thread?", [
    "Via message passing using `postMessage()` and the `onmessage` event listener with structured cloning",
    "By directly sharing and mutating global window variables",
    "Using synchronous shared memory mutex locks",
    "Through HTTP polling on localhost"
  ]),
  q(160, "In CSS Grid, what does `grid-template-columns: repeat(auto-fit, minmax(250px, 1fr))` achieve?", [
    "Creates a responsive multi-column layout that automatically wraps items into new rows without any media queries",
    "Forces exactly 4 columns regardless of screen size",
    "Hides any items wider than 250px",
    "Centers a single column in the middle of the screen"
  ]),
  q(161, "What is the security risk mitigated by the `rel=\"noopener noreferrer\"` attribute on external links?", [
    "Prevents the newly opened tab from accessing `window.opener` to redirect the parent page to a malicious phishing site (Tabnabbing)",
    "Blocks search engine crawlers from indexing the website",
    "Disables right-click and inspect element on the destination page",
    "Encrypts the URL query parameters using HTTPS"
  ]),
  q(162, "What is the function of the `structuredClone()` global function in modern JavaScript?", [
    "Deeply clones JavaScript objects and arrays, correctly handling circular references, Dates, RegExps, and TypedArrays",
    "Converts HTML DOM nodes into React JSX components",
    "Generates a JSON schema from a TypeScript interface",
    "Creates a shallow copy identical to `Object.assign()`"
  ]),
  q(163, "In Redux Toolkit (RTK), what role does Immer play inside reducers?", [
    "Allows writing 'mutating' logic (e.g. `state.push(item)`) which is automatically converted into safe immutable state updates",
    "Connects Redux to the Redux DevTools browser extension",
    "Automatically dispatches API calls to the server",
    "Persists Redux state to localStorage on page reload"
  ]),
  q(164, "What does the CSS `accent-color` property do?", [
    "Customizes the accent theme color of native form controls (checkboxes, radio buttons, range sliders, progress bars)",
    "Changes the background color of the body tag",
    "Applies a gradient drop shadow to text",
    "Translates font glyphs into uppercase"
  ]),
  q(165, "What is the core difference between Server-Side Rendering (SSR) and Incremental Static Regeneration (ISR)?", [
    "SSR renders HTML on every incoming request; ISR serves pre-built static HTML and updates it in the background on a revalidation timer",
    "ISR requires a Node.js server while SSR runs entirely in client WebAssembly",
    "SSR does not support JavaScript hydration while ISR does",
    "ISR is only compatible with Angular applications"
  ]),
  q(166, "How do you detect if a user has enabled reduced motion preferences in CSS?", [
    "Using the `@media (prefers-reduced-motion: reduce)` media query",
    "Checking `navigator.motionEnabled` in JavaScript",
    "Setting `transition: none` on the root HTML element",
    "Inspecting the `User-Agent` HTTP header"
  ]),
  q(167, "In TypeScript, what is a 'Discriminated Union'?", [
    "A union of object types that share a common literal property (the discriminant) used by TypeScript to narrow the specific type",
    "A type that can only be used inside class constructors",
    "A union between a string and a number without type safety",
    "An enum that contains both numeric and string values"
  ]),
  q(168, "What does the browser `BroadcastChannel` API enable?", [
    "Direct communication and message broadcasting between all open tabs, windows, and iframes on the same origin",
    "Broadcasting live video streams to Twitch or YouTube",
    "Sending push notifications when the browser is closed",
    "Listening to system hardware audio output"
  ]),
  q(169, "What is the key benefit of using CSS Cascade Layers (`@layer`)?", [
    "Gives explicit control over stylesheet specificity order, allowing library or framework overrides without using `!important`",
    "Accelerates CSS parsing using GPU hardware acceleration",
    "Compresses CSS files into binary Gzip format",
    "Generates responsive breakpoints automatically"
  ]),
  q(170, "In React, what problem does `useDeferredValue` solve?", [
    "Defers re-rendering a non-critical part of the UI (like a long filtered list) while keeping high-priority inputs responsive",
    "Delays component mounting by a fixed number of milliseconds",
    "Caches network fetch responses in browser memory",
    "Converts promises into observable streams"
  ]),
  q(171, "What is the exact purpose of the `subgrid` value in CSS Grid Level 2?", [
    "Allows a grid item that is also a grid container to inherit the tracks and column lines of its parent grid",
    "Creates a nested table layout inside a `<div>`",
    "Automatically calculates column widths using JavaScript",
    "Limits grid nesting to a maximum depth of 2 levels"
  ]),
  q(172, "In JavaScript, what does `Object.freeze()` do compared to `Object.seal()`?", [
    "`freeze` prevents adding, removing, or modifying existing property values; `seal` prevents adding or removing properties but allows modifying existing writable properties",
    "`seal` creates a deep clone while `freeze` creates a shallow clone",
    "`freeze` encrypts object values in memory while `seal` does not",
    "`seal` works on arrays while `freeze` only works on objects"
  ]),
  q(173, "What is the purpose of the `popover` HTML attribute in modern HTML5 standards?", [
    "Provides native browser support for popovers, tooltips, and dropdowns with automatic top-layer rendering and click-outside dismissal",
    "Creates an iframe popup window",
    "Opens the print dialog automatically",
    "Triggers an alert popup with custom buttons"
  ]),
  q(174, "How do modern frontend bundlers perform 'Tree Shaking'?", [
    "By analyzing ES6 static `import`/`export` syntax to detect and eliminate dead or unused code from the final production bundle",
    "By compressing PNG images into WebP format",
    "By minifying HTML whitespace in production builds",
    "By converting React JSX into vanilla JavaScript"
  ]),
  q(175, "What does the `navigator.sendBeacon()` method do?", [
    "Asynchronously sends a small amount of telemetry/analytics data to the server without blocking page unload or navigation",
    "Sends Bluetooth beacon signals to nearby devices",
    "Establishes a bi-directional WebSocket connection",
    "Pings the local DNS server for connection health"
  ]),
  q(176, "In React 18, what is the role of `<Suspense>` on the server?", [
    "Enables Selective Hydration and streaming HTML, sending initial shell HTML immediately while slow components stream in as they resolve",
    "Blocks all server requests until all database queries complete",
    "Catches runtime JavaScript errors in event handlers",
    "Prevents CSS files from loading until user interaction"
  ]),
  q(177, "What is a 'Pure Component' or 'Pure Function' in React architecture?", [
    "A function or component that always produces the exact same output for the same input props/state and has no observable side effects",
    "A component written without any JSX tags",
    "A component that does not use any CSS classes",
    "A function that runs exclusively on the backend server"
  ]),
  q(178, "In CSS, what is the `:has()` pseudo-class commonly referred to as?", [
    "The 'parent selector' that allows styling an element based on the existence of specific descendants or siblings inside it",
    "A pseudo-class for checking if a form has validation errors",
    "A selector for detecting whether an image has loaded",
    "A pseudo-class for checking localStorage keys"
  ]),
  q(179, "What is the difference between `sessionStorage` and `localStorage`?", [
    "`sessionStorage` data is cleared when the specific browser tab is closed; `localStorage` persists until explicitly cleared",
    "`localStorage` is limited to 50KB while `sessionStorage` has unlimited storage",
    "`sessionStorage` is transmitted with every HTTP request while `localStorage` is not",
    "`sessionStorage` is encrypted with SSL while `localStorage` is plaintext"
  ]),
  q(180, "What is the primary role of the `Service Worker` in a Progressive Web App (PWA)?", [
    "Acts as a programmable client-side network proxy, intercepting requests to provide offline caching, background sync, and push notifications",
    "Renders 3D graphics using the GPU",
    "Compiles TypeScript into JavaScript in the browser",
    "Scans the user's hard drive for virus threats"
  ]),
  q(181, "In TypeScript, what does `keyof typeof MyObject` produce?", [
    "A union type of all the string/numeric property keys present on the `MyObject` instance",
    "A clone of the `MyObject` prototype",
    "An array of property values at runtime",
    "A boolean indicating if the object has keys"
  ]),
  q(182, "What is the CSS `backdrop-filter` property used for?", [
    "Applies visual effects (like gaussian blur or color saturation) to the area behind an element, enabling glassmorphic UI designs",
    "Adds a gradient border around an element",
    "Filters out invalid HTML elements behind a modal",
    "Replaces background images on mobile viewports"
  ]),
  q(183, "How does the `PerformanceObserver` API help monitor Real User Monitoring (RUM) metrics?", [
    "Passively collects high-precision performance metrics (like LCP, FID, CLS, long tasks) asynchronously without polling or impacting user FPS",
    "Displays a real-time FPS counter in the browser console",
    "Automatically optimizes slow database queries",
    "Limits browser memory usage to 256MB"
  ]),
  q(184, "In React, why should you avoid mutating state directly (e.g. `state.user.name = 'Alex'`)?", [
    "React uses shallow object reference comparison (`Object.is`) to detect state changes; direct mutations keep the same reference, skipping re-renders",
    "Direct mutation causes a browser memory overflow crash",
    "Direct mutation deletes all components from the DOM",
    "Direct mutation converts the state value into a string"
  ]),
  q(185, "What is the function of the `Accept-Encoding: gzip, br, zstd` HTTP request header?", [
    "Informs the server which compression algorithms the client browser supports, allowing the server to transmit compressed response bodies",
    "Encodes the user's login credentials in base64",
    "Forces all images to be converted into WebP format",
    "Specifies the character encoding for HTML documents"
  ]),
  q(186, "In Tailwind CSS, how do you enable Arbitrary Values for custom CSS properties?", [
    "Using square bracket syntax, e.g. `top-[117px]` or `bg-[#1e1b4b]`",
    "Using curly braces, e.g. `top-{117px}`",
    "Writing inline CSS styles in the style attribute",
    "Prefixing class names with `custom-`"
  ]),
  q(187, "What is the purpose of the `requestAnimationFrame()` API in web animations?", [
    "Tells the browser to run a callback function before the next repaint, synchronizing animation updates with the display refresh rate (typically 60Hz/120Hz)",
    "Executes an animation immediately in a background thread",
    "Slows down animations when battery is low",
    "Captures video recordings of the canvas element"
  ]),
  q(188, "In modern web security, what is the role of the `Content-Security-Policy` (CSP) header?", [
    "Restricts the sources from which scripts, styles, images, and fonts can be loaded and executed, mitigating Cross-Site Scripting (XSS) and data injection",
    "Enforces HTTPS on all outgoing requests",
    "Encrypts the HTML response body using public key cryptography",
    "Prevents search engines from reading user passwords"
  ]),
  q(189, "What does the `IntersectionObserver` API do?", [
    "Asynchronously observes changes in the intersection of a target element with an ancestor element or the viewport, ideal for lazy loading and infinite scroll",
    "Detects collisions between 3D canvas objects",
    "Measures the network latency between client and server",
    "Checks if two JavaScript arrays have matching items"
  ]),
  q(190, "In React, what is the purpose of the `forwardRef` API (or React 19 direct `ref` props)?", [
    "Allows a parent component to pass a ref down to a child component's underlying DOM element",
    "Redirects the user to a different URL route",
    "Automatically creates a Redux store reference",
    "Passes React state across different browser tabs"
  ]),
  q(191, "What is the CSS `scroll-behavior: smooth` property used for?", [
    "Enables smooth scrolling animations when navigating between internal page anchor links or calling `window.scrollTo()`",
    "Slows down touch scrolling physics on mobile devices",
    "Removes the browser scrollbar completely",
    "Forces pages to scroll horizontally"
  ]),
  q(192, "In JavaScript, what is the behavior of the Logical Nullish Assignment operator (`??=`)?", [
    "Assigns a value to a variable ONLY if the variable is currently `null` or `undefined` (unlike `||=`, it does not reassign on `0` or `false`)",
    "Checks if two values are strictly equal",
    "Converts `null` values into empty strings",
    "Deletes a property from an object if it is null"
  ]),
  q(193, "What does the `loading=\"lazy\"` attribute do on `<img>` and `<iframe>` HTML elements?", [
    "Defers loading the image or iframe until it reaches a calculated distance from the viewport, saving network bandwidth on initial load",
    "Renders the image with a blur-up placeholder effect",
    "Compresses the image file size on the client",
    "Hides the image if the user is on a slow 3G connection"
  ]),
  q(194, "What is a 'Closure' in JavaScript?", [
    "A function bundled together with references to its surrounding lexical environment, allowing it to access outer variables even after the outer function has executed",
    "A method that closes a database connection",
    "The closing curly brace of a code block",
    "A design pattern for private class methods"
  ]),
  q(195, "In CSS Flexbox, what is the difference between `align-items` and `justify-content`?", [
    "`justify-content` aligns items along the main axis; `align-items` aligns items along the cross axis",
    "`align-items` is for Grid layouts while `justify-content` is for Flexbox layouts",
    "`justify-content` only works on horizontal text while `align-items` works on images",
    "`align-items` controls spacing between flex rows while `justify-content` controls margins"
  ]),
  q(196, "What is the purpose of the `DOMPurify` library in frontend applications?", [
    "Sanitizes untrusted HTML strings against XSS attacks before injecting them into the DOM via `dangerouslySetInnerHTML`",
    "Cleans up unused CSS classes from the DOM tree",
    "Minifies HTML for faster network transfers",
    "Removes broken image links automatically"
  ]),
  q(197, "In TypeScript, what is a `Record<K, T>` utility type?", [
    "Constructs an object type whose property keys are of type `K` and property values are of type `T`",
    "Records browser console logs into an array",
    "Defines an immutable tuple of fixed length",
    "Creates a database table schema in TypeScript"
  ]),
  q(198, "What does the `clamp(min, preferred, max)` CSS function do?", [
    "Clamps a value between an upper and lower bound, allowing responsive fluid typography (e.g. `font-size: clamp(1rem, 2.5vw, 2rem)`) without media queries",
    "Restricts an image aspect ratio to 16:9",
    "Truncates multi-line text with an ellipsis",
    "Locks the browser zoom level at 100%"
  ]),
  q(199, "What is the purpose of the `history.pushState()` and `history.replaceState()` HTML5 APIs?", [
    "Allows Single-Page Applications (SPAs) to manipulate the browser URL and history stack without triggering a full page reload",
    "Clears the user's browsing history from the browser cache",
    "Downloads a copy of the browser history as a JSON file",
    "Enables forward navigation across external domains"
  ]),
  q(200, "What is the 'Event Loop' in JavaScript browsers and how does it prioritize tasks?", [
    "A single-threaded loop that continuously checks the call stack, executes synchronous code, drains the microtask queue (Promises), and then processes macrotasks (Timers, I/O)",
    "A multi-threaded queue that runs all functions in parallel on GPU cores",
    "A recursive loop that monitors DOM mutation events every millisecond",
    "A network listener that waits for WebSocket messages"
  ])
];

console.log('Extra Frontend questions created:', EXTRA_FRONTEND.length);

// We will similarly create EXTRA questions for all 8 roles
// Let's write the complete generator builder that compiles the 800-question engine
module.exports = { EXTRA_FRONTEND };
