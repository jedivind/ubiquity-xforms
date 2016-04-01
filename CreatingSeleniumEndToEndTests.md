# Introduction #

Blah blah.

# XForms 1.1 Test Suite #

The XForms 1.1 test suite comprises:

  * a file that lists all of the tests to run, in the form of links to 'driver pages';
  * a driver page for each test, which links to one or more individual test forms;
  * a set of individual test forms;

## List of tests to run ##

The top level list of XForms 1.1 tests to run is located at:
```
testsuite/W3C-XForms-1.1/Edition1/driverPages/SeleniumTests/W3CTestSuite.html
```

This is currently being broken into individual chapters, such as:

```
testsuite/W3C-XForms-1.1/Edition1/driverPages/SeleniumTests/TestSuiteChapter11.html
```

Each entry in the document is a link to driver file to be loaded, plus a title for the test. These entries appear as rows in a table:

```
<table id="suiteTable" cellpadding="1" cellspacing="1" border="1" class="selenium">
  <tbody>
    <tr>
      <td><b>XForms 1.1 Chapter 11 Test Suite</b></td>
    </tr>
    <tr><td><a href="./Chapt11/11.1/11.1.a.html">11.1.a ref attribute of submission element</a></td></tr>
    <tr><td><a href="./Chapt11/11.1/11.1.b.html">11.1.b bind attribute of submission element</a></td></tr>
    .
    .
    .
    <tr><td><a href="./Chapt11/11.11/11.11.4/11.11.4.b.html">11.11.4.b handling SOAP success response</a></td></tr>
  </tbody>
</table>
```

## Driver pages ##

Each driver page is an HTML file that contains a list of instructions that Selenium will understand (for more details see the [Selenium Reference](http://release.seleniumhq.org/selenium-core/0.8.0/reference.html)). These are located in:

```
testsuite/W3C-XForms-1.1/Edition1/driverPages/SeleniumTests
```

The driver pages are broken down by chapter, and then section (and sometimes even sub-section). For example, test `11.1.n` would be in section `11.1` in chapter 11:

```
testsuite/W3C-XForms-1.1/Edition1/driverPages/SeleniumTests/Chapt11/11.1/11.1.n.html
```

## Individual test forms ##

Each of the XForms 1.1 tests has an XForm located in a sub-directory of:

```
testsuite/W3C-XForms-1.1/Edition1
```

The tests are broken down by chapter, and then section (and sometimes even sub-section). For example, test `11.1.n` would be in section `11.1` in chapter 11:

```
testsuite/W3C-XForms-1.1/Edition1/Chapt11/11.1/11.1.n.xhtml
```

The forms are generated from the original W3C forms, located here:

```
Not sure yet!
```

To convert the files for use by UXF, run the following command:

```
testsuite/W3C-XForms-1.1/ant
```

This will run `ant` in the test suite directory, which will use the `build.xml` file to process each file in the test suite. (For information on installing `ant`, see WindowsBuildBotSlave.)

For each file `ant` will run the `ubiquityxforms.xsl` transformation, which does the following:

  * adds the UXF library loader script to the `head` element;
  * moves all `xf:model` elements that appear in the `head` to the `body`.

# Writing a driver page #

The first step in a driver page will be to open the individual test form that will be controlled:

```
<tr>
  <td>open</td>
  <td>../../Chapt11/11.1/11.1.n.xhtml</td>
  <td></td>
  <td></td>
</tr>
```

Once the form is loaded, UXF will initialise. We can't run any tests until this initialisation is complete, so each form should use the UXF Selenium extension command `waitForModelReady` to pause until the form is ready:

```
<tr>
  <td>waitForModelReady</td>
  <td></td>
  <td></td>
  <td></td>
</tr>
```

Sometimes it's only necessary to wait for a specific model to become ready. This can be done using any of the Selenium selector techniques:

```
<tr>
  <td>waitForModelReady</td>
  <td>xpath=/html/body/xf:model[1]</td>
  <td></td>
  <td></td>
</tr>
```

Once the form is loaded, testing usually involves initiating actions and then checking the value of one or more controls. Values can be tested using the UXF Selenium extension `verifyXformsControlValue`. For example, to test that a particular `xf:select1` control has the value 'cc', we might do this:

```
<tr>
  <td>verifyXformsControlValue</td>
  <td>xpath=/html/body/xf:select1[@ref='method']</td>
  <td>cc</td>
  <td>Checks that the select1 has the right value</td>
</tr>
```

For more information on the available extensions, see SeleniumUserExtensions.

# Running the tests #

The Selenium driver file is located at:

```
testsuite/selenium/core/TestRunner.html
```

To run the chapter 11 tests, for example, you would use the following URL in the browser:

```
testsuite/selenium/core/TestRunner.html?test=../../W3C-XForms-1.1/Edition1/driverPages/SeleniumTests/TestSuiteChapter11.html
```

This would open Selenium and the test suite for Chapter 11, ready to run tests individually or the entire suite.

To have Selenium load the tests and then automatically run all of them, add `auto=true`:

```
testsuite/selenium/core/TestRunner.html?auto=true&test=../../W3C-XForms-1.1/Edition1/driverPages/SeleniumTests/TestSuiteChapter11.html
```

To have Selenium save the results of running the tests add `save=true` and `resultsUrl=filename`. For example:

```
testsuite/selenium/core/TestRunner.html?save=true&resultsUrl=..\..\xforms11-ff3-results.html&test=../../W3C-XForms-1.1/Edition1/driverPages/SeleniumTests/TestSuiteChapter11.html
```

To automatically close the browser after the tests have completed, add `close=true`. This is useful when running the tests from the command-line. For example, to load the chapter 11 tests in Firefox on Windows, run them automatically, save the results, and then close, we would use the following command:

```
"C:\Program Files\Mozilla Firefox\firefox.exe" "testsuite\selenium\core\TestRunner.html?test=..\..\W3C-XForms-1.1\Edition1\driverPages\SeleniumTests\TestSuiteChapter11.html&auto=true&save=true&resultsUrl=..\..\xforms11--chapter11-ff3-results.html&close=true"
```

## Using Ant ##

When running on a Buildbot slave (see WindowsBuildBotSlave), the tests will be run by Ant. This can be simulated from the command line in the following way:
  * change to the root directory of your copy of UXF, i.e., the one just above `testsuite`;
  * run the command `ant -f testsuite/build.xml run-selenium-tests -Dsection=02 -Dbrowser=ff`.

This will open the browser, run all of the tests for the specified chapter (the `section` parameter), write the results to a file, and then close the browser. (The results file will be available at `testsuite/xforms11-Chapter02-ff-results.html`.)

If you want to load the tests ready to be run manually, then add `auto=false`:
```
ant -f testsuite/build.xml run-selenium-tests -Dsection=02 -Dbrowser=ff -Dauto=false
```