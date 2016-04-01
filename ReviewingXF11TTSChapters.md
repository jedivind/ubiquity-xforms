# Introduction #

As we get closer to completing XForms 1.1 support, we need to keep track of where the gaps are in our coverage, so that people can get straight to what needs to be done.

# Status files #

We are still in the process of automating our tests, and until that happens, we have two sources of information about which tests pass:

  * manually maintained chapter status files;
  * Selenium-generated chapter status files.

Once the tests are fully automated the test-generated files will always be authoritative.

## Manually maintained chapter status files ##

The first source is a set of XML files, one for each test suite chapter, which contains an entry for each test, and an indicator of whether the tests has passed or not. These documents are used to generate an HTML page which summarises the status of the tests in each chapter.

These files are currently maintained manually, with developers updating the documents whenever they pass a test. Whenever an updated chapter file is checked in to SVN, a Buildbot slave will regenerate the HTML status files.

The source XML files are are maintained for each supported. Currently we have [chapter files for Firefox 3](http://ubiquity-xforms.googlecode.com/svn/trunk/testsuite/W3C-XForms-1.1/Edition1/driverPages/Results/FF3/) and [chapter files for IE 7](http://ubiquity-xforms.googlecode.com/svn/trunk/testsuite/W3C-XForms-1.1/Edition1/driverPages/Results/IE7/).

The HTML status pages are available on the Buildbot server, [one for IE 7](http://uxf-bb.webbackplane.com:8080/Results/IE7/ResultsTable.html) and [one for FF 3](http://uxf-bb.webbackplane.com:8080/Results/FF3/ResultsTable.html).

## Selenium-generated chapter status files ##

Selenium can generate a status file that shows the output of a test run. However, there are currently two problems. The first is that even after breaking the XForms 1.1 test suite file into multiple chapter files, many of them still require human intervention to complete. Secondly, many of the tests have not been written 'defensively', which means they can fail in different environments. The consequence of this is that some of the tests that fail under Selenium are regarded as a 'pass' by developers who run the tests manually, and so the Selenium-generated file cannot be regarded as authoritative.

The generated files come in two flavours -- those that were run under the watchful eye of a human, who helped them to complete, those that have been fully automated and can run under Buildbot.

The human-supervised result files are the ones we are interested in here, and are in the same directories as above ([one for IE 7](http://uxf-bb.webbackplane.com:8080/Results/IE7/) and [one for FF 3](http://uxf-bb.webbackplane.com:8080/Results/FF3/)), with names that follow the following pattern:
```
xforms11-Chapter07-ie-results.html
```

# Reviewing a chapter #

The first step in reviewing a chapter is to see if there are any tests that the automated system says are passed, but which the developers have not manually marked as passed. This could be for a number of reasons, but the main one will be that the test in question hasn't been run; this can happen because when working on an issue, it will not always be clear what other tests might apply to the features you are working on.

## 'Missing' passing tests ##

Since not all tests will necessarily have been run, then it is possible that there are tests listed in the manually maintained documents that could be passed, but are still marked as failing.

We are currently in the process of updating the manually maintained files to include any new information we've obtained by running the automated tests. I.e., if a test shows green on the Selenium-generated files but red on the manual files, we can safely update the manual file.

To illustrate, if we wanted to check chapter 7 for tests that Selenium has passed, but developers hadn't, we would look at the following two files:

|[Manual test results for IE 7](http://uxf-bb.webbackplane.com:8080/Results/IE7/html/XF11_07_Results.html)|
|:--------------------------------------------------------------------------------------------------------|
|[Selenium test results](http://uxf-bb.webbackplane.com:8080/Results/IE7/xforms11-Chapter7-ie-results.html)|

Anything that is red in the first file, but green in the second can be marked as passed in the manual files.

## Tests that are blocking automation because they should pass (false negatives) ##

Any test that is marked as being green in the manual file, but red in the second is preventing the test-suite from being automated, because it is giving the wrong result. Of course there will be other things that are blocking automation, which we'll look at in the next section, but for 'false negatives' we're looking at tests that are successful when run manually (and so have a green entry in the manually-generated file), but fail when run in Selenium (having a red entry in the Selenium-generated file).

Most Selenium driver pages load their test form and then wait 3 seconds before continuing with the tests. Probably the main factor preventing the tests from running successfully when automated is that when many tests are run consecutively, there is a bit of
overhead in the transition from one test to another, and it's often the case that 3 seconds is insufficient.

Also, the tests need to be able to run on lower spec machines, so all in all, the only solution that is guaranteed to result in a wait of sufficient length is to pause until the XForms processor itself becomes ready.

The main change to achieve this is to replace:

```
 <td>pause</td>
 <td>3000</td>
```

which occurs near the beginning of a driver page, with:

```
 <td>waitForModelReady</td>
 <td></td>
```

`isModelReady` is a Selenium extension function that we've added to check that either (a) a particular model is ready (use an XPath expression), or (b) that _all_ models are ready. As with all Selenium commands it can be used in various ways, such as `waitForModelReady`, `verifyModelReady`, `assertModelReady`, and so on.

Without this change just about every test will fail under Buildbot.

## Tests that are blocking automation because they require human intervention ##

There are some tests in the test-suite that require some kind of intervention in order to proceed. There is no general solution to this, and each test needs to be looked at on a case-by-case basis. Types of issues will be:

  * a debugger command that was lurking in the code has been hit. In general we should replace these with `throw`;
  * a bug in the code opening the debugger. In the short term it's probably best to disable the debugger on the Buildbot slave running the tests;
  * an alert message that is not being acknowledged. Selenium allows us to 'click' alert messages (although you would expect them to timeout, so this may no longer be an issue after the recent upgrade to Selenium);
  * _add any other bits of useful information here._