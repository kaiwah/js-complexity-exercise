**Jackys Notes**
================

### Step #1: Fixing IF Calculations

The first task is to fix the bug in the if(s) counting. The main issue of both the wrong initial code result and also the test is due to RegEx matching if/elseif/else for strings as well. Offhand I can think of 2 solutions:

1.  Only match if not encapsulated by quotes ('|")
2.  Sanitize the input by replacing all strings with an arbitrary character as a throwaway

I opted for option 2 as it's easier to perform.

Another issue is when a variable is declared that has if/else in the word. So we fix this by setting a boundary on the word `\b` onto the match expression. (Added this as test #7)

### Step #2: Fixing null.length

In addition, if there is no match for if/elseif/else, the match returns a null. The original return statement returned a .length which threw an error for no-matches. So we added an additional check to make sure that it is not null before returning length. 

### Step #3: Fixing Version Display

I noticed on the bottom of the template there is a empty version number. I had to trace back what are the usage-semantics for "app-version" which led me back to a boilerplate repo called "angular-seed" (also apparent on the bower.json). Looking at how this repo is setup, it seems that the js-complexity repo started as a angular-seed project. But I noticed that the version component was missing. So copy-pasta back into the repo and injecting it into the index seems to work now. 

(This is my 1st time using angular so I'm not sure if I was supposed to create my own component? But for the sake of time, I'll reuse the components written in the boilerplate.)

### Step #4: Adding SWITCH Calculations

Doing a bit of research on cyclomatic complexity for switch statements, there seems to be mixed opinions on case fall-throughs `case 0: case 1: break;` if it equates to 1 or 2. I ended up finding a still-opened jshint issue: [High cyclomatic complexity on switch statements](https://github.com/jshint/jshint/issues/840).

More reference information:

  * [McCabe Structured Testing: Testing Methodology Using Cyclomatic Complexity Metric](http://www.mccabe.com/pdf/mccabe-nist235r.pdf)
  * [GMetrics Cyclomatic Complexity Metric](http://gmetrics.sourceforge.net/gmetrics-CyclomaticComplexityMetric.html)

Just going by jshint's calculation, it seems to be calculating every || as +1 as well as each case +1. So I'll replicate that calculation by doing the same which is a simple switch and case calculation. 


### Step #5: Styling

Since the main purpose of the application is to copy/paste code (and also view metrics), we want a style that is light on the eyes and intuitive for the user to know exactly what part of the application does what (textpad vs console).

What first comes to mind is to research how online code editors/IDE's do their styling as I'm sure they have done tons of user testing on what is best practices in terms of a style guide. Coderpad, and my personal SublimeText theme are my references. 

Dark background paired with a light text seems to have the highest impact for readability (and a common theme throughout virtual IDE's -- CoderPad, CodePen, HackerRank, etc.) So I styled the application to be a 2 column design (70/30), with the text editor most noticeable (since it's the first touchpoint of a user). 

The console is slightly lighter to establish the differentiation from the textarea, and is more "colorful" to aid in the CTA and options of the application.

For the typography, sans-serif for code is almost always a safe choice. I picked the most neutral looking sans-serif on google fonts as the choice pick.

### Step #6: Detailed Report

We want to give a option for the user to view a detailed report that breaks down the individual statements found that give us the overall complexity score. Since the data is already calculated in jsComplexity, we can just modify the function such that we store the complexity into a map with each individual logic (if/case etc). 

In the checkJSCode function, we detect if the checkbox has been selected, and if so we will bind it into the global scoped variable, detailedReport with a statement of what was found.

### Step #7: Responsive Styling

Given the initial wireframe of the application, it was already designed with responsiveness in mind (two column layout). So to make it responsive, we simply have to just `display: block;` the inline-blocked items, and set `width: 100%`. There is also some other slight styling adjustments to be done on each individual component.

I set the breakpoint to be 800px just based on how well I felt the template scales down. At 700px, that is when the console begins its journey into a chopstick. So at that point, it felt most appropriate to collapse the containers into rows.

### Step #8: Re-doing Cyclomatic Complexity

Researching more about cyclomatic complexity, the correct equation is as follows:

`McCabe Complexity = Edges - Nodes + 2`

This equation will give us a single if statement to be 2, two sequential if statements and also two sequential if-else statements have a complexity of 3.

```
if (x) {
  ...
}
if (y) {
  ...
}
E = 5
N = 4
M = 5 - 4 + 2 = 3
```

```
if (x){
  ...
} else {
  ...
}
if (y){
  ...
} else {
  ...
}
E = 8
N = 7
M = 8 - 7 + 2 = 3
```

Mapping this out into equations, I was able to find the following mathematical calculations:

Node Calculation:

  * If block = 2n + 1
  * If/Else block = 3n + 1
  * If/ElseIf/Else block = 2n + (5x - 1)
  * Switch/Case block = 2n + 1

Edge Calculation:

  * If block = 3(n)
  * If/Else block = 4(n)
  * If/ElseIf/Else block = 7(n) + (3x - 3)
  * Switch/Case block = 3(n)

We can further simplify this based on what blocks are within the flow. The pattern is simplified as the following:

`M = D + 1`

Where D = conditional statements. The following are conditional statements:

`['if', 'elseif', 'case', 'for', 'do', 'while']`

Thus a simple calculation can simply be counting the number of occurances of these conditional statements and simply add one to it. But this does not account for nested conditionals. 

With this calculation in mind, we can utilize a syntax parser to better parse the contents instead of using RegEx. 

### Step #9: Adding Esprima Functionality

Before we added a esprima checkbox as a advanced option for the user. Now we can fully implement the functionality with a more proper gameplan on how to tackle the complexity calculation.

So first we install the bower asset, and within the checkJSCode, we will check to see if the option for esprima is checked. If it is, it will go through the esprimaComplexity workflow. First we setup a whitelist of all the conditional statements we want to count. Then within the esprimaComplexity function, we will traverse down the node tree utilizing basic straight-forward recursion. This function will return the 'datasheet' of all found values which the application would parse as normal.

Tests also have to be duplicated to utilize the esprima parsing rather than regex.

*Note*: Ternary logic is horrible. Will need to refactor this to something more efficient that checks all edge cases.

### Step #10: Adding Gulp Automation for Production-Deployment

Unfortunately didn't have enough time doing this :'(

If I were to do this, first I would figure out if there is already any angular tooling for building assets that are ready-for deployment. Otherwise I would utilize whichever is the default method for compiling the assets (specifically the JS assets) into a single minified file. Use gulp to compile -> deploy (to s3 or whichever is holding the assets).






---

**Original README**
===================

## Getting Started

To get you started you can simply clone the repository and install the dependencies:

### Prerequisites

You need git to clone the project repository. You can get git from
[http://git-scm.com/](http://git-scm.com/).

We also use a number of node.js tools to initialize and test the project. You must have node.js and
its package manager (npm) installed.  You can get them from [http://nodejs.org/](http://nodejs.org/).

### Clone the project

Clone the project repository using [git][git]:

```
git clone https://github.com/execthread/js-complexity.git
cd js-complexity
```

### Branch to your solution

Make sure the first thing you do is to branch out, don't make any
changes on `master` branch.

```
git checkout -b YOUR_NAME_HERE
```

### Install Dependencies

We have two kinds of dependencies in this project: tools and angular framework code.  The tools help
us manage and test the application.

* We get the tools we depend upon via `npm`, the [node package manager][npm].
* We get the angular code via `bower`, a [client-side code package manager][bower].

We have preconfigured `npm` to automatically run `bower` so we can simply do:

```
npm install
```

Behind the scenes this will also call `bower install`.  You should find that you have two new
folders in your project.

* `node_modules` - contains the npm packages for the tools we need
* `app/bower_components` - contains the angular framework files

*Note that the `bower_components` folder would normally be installed in the root folder but
the project changes this location through the `.bowerrc` file.  Putting it in the app folder makes
it easier to serve the files by a webserver.*

### Run the Application

We have preconfigured the project with a simple development web server.  The simplest way to start
this server is:

```
npm start
```

Now browse to the app at `http://localhost:8000/index.html`.



## Directory Layout

```
app/                    --> all of the source files for the application
  app.css               --> default stylesheet
  services/             --> all app specific services
    js-complexity/              --> services that checks complexity of JS code
      jsComplexity.js            --> actual service file
      jsComplexityTest.js        --> jasmine test file
  mainView/               --> the mainview template and logic
    view.html             --> the partial template
    mainViewCtrl.js       --> the controller logic
    mainViewCtrlTest.js   --> tests of the controller
  app.js                --> main application module
  index.html            --> app layout file (the main html template file of the app)
karma.conf.js         --> config file for running unit tests with Karma
e2e-tests/            --> end-to-end tests
  protractor-conf.js    --> Protractor config file
  scenarios.js          --> end-to-end scenarios to be run by Protractor
```

## Testing

There are two kinds of tests in the project application: Unit tests and end-to-end tests.

### Running Unit Tests

The project app comes preconfigured with unit tests. These are written in
[Jasmine][jasmine], which we run with the [Karma Test Runner][karma]. We provide a Karma
configuration file to run them.

* the configuration is found at `karma.conf.js`
* the unit tests are found next to the code they are testing and are named as `..._test.js`.

The easiest way to run the unit tests is to use the supplied npm script:

```
npm test
```

### End to end testing

The project app comes with end-to-end tests, again written in [Jasmine][jasmine]. These tests
are run with the [Protractor][protractor] End-to-End test runner.  It uses native events and has
special features for Angular applications.

* the configuration is found at `e2e-tests/protractor-conf.js`
* the end-to-end tests are found in `e2e-tests/scenarios.js`

Protractor simulates interaction with our web app and verifies that the application responds
correctly. Therefore, our web server needs to be serving up the application, so that Protractor
can interact with it.

```
npm start
```

In addition, since Protractor is built upon WebDriver we need to install this.  The project
project comes with a predefined script to do this:

```
npm run update-webdriver
```

This will download and install the latest version of the stand-alone WebDriver tool.

Once you have ensured that the development web server hosting our application is up and running
and WebDriver is updated, you can run the end-to-end tests using the supplied npm script:

```
npm run protractor
```

This script will execute the end-to-end tests against the application being hosted on the
development server.


## Serving the Application Files

While angular is client-side-only technology and it's possible to create angular webapps that
don't require a backend server at all, we recommend serving the project files using a local
webserver during development to avoid issues with security restrictions (sandbox) in browsers. The
sandbox implementation varies between browsers, but quite often prevents things like cookies, xhr,
etc to function properly when an html page is opened via `file://` scheme instead of `http://`.


### Running the App during Development

The project project comes preconfigured with a local development webserver.  It is a node.js
tool called [http-server][http-server].  You can start this webserver with `npm start` but you may choose to
install the tool globally:

```
sudo npm install -g http-server
```

Then you can start your own development web server to serve static files from a folder by
running:

```
http-server -a localhost -p 8000
```

Alternatively, you can choose to configure your own webserver, such as apache or nginx. Just
configure your server to serve the files under the `app/` directory.
