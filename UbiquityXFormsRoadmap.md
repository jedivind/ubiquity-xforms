Currently our attention is focused on completing XForms 1.1 support. The status of stories relating to XForms 1.1 is available [here](http://code.google.com/p/ubiquity-xforms/issues/list?q=Milestone:XForms1.1+Type:Story&can=1&colspec=Milestone+Status+Owner+ID+Blocking+Summary&sort=Status).

# Releases #

## [0.7.0](http://code.google.com/p/ubiquity-xforms/source/browse/tags/0.7.0) ##

Full details of this release are on the [release 0.7 page](http://code.google.com/p/ubiquity-xforms/wiki/Release0Point7).

## [0.6.2](http://code.google.com/p/ubiquity-xforms/source/browse/tags/0.6.2) ##

  * ...

## [0.6.1](http://code.google.com/p/ubiquity-xforms/source/browse/tags/0.6.1) ##

  * Fixed timezone issues with date- and time-related functions.
  * Fixed Firefox 3 cross-domain XBL issue. (See [issue 28](https://code.google.com/p/ubiquity-xforms/issues/detail?id=28).)

## [0.6.0](http://code.google.com/p/ubiquity-xforms/source/browse/tags/0.6.0) ##

  * Added support for `days-from-date()`, `days-to-date()`, `seconds-from-dateTime()`, `seconds-to-dateTime()`, `adjust-dateTime-to-timezone()`, `seconds()`, `months()`, and `property()`.

## [0.5.1](http://code.google.com/p/ubiquity-xforms/source/browse/tags/0.5.1) ##

  * Fixed issue that `choose()` was not returning the correct object type.

## [0.5.0](http://code.google.com/p/ubiquity-xforms/source/browse/tags/0.5.0) ##

  * Added support for `avg()`, `min()`, `max()`, `random()`, `compare()`, and `count-non-empty()`.

## [0.4.0](http://code.google.com/p/ubiquity-xforms/source/browse/tags/0.4.0) ##

  * Added support for `local-date()`, `local-dateTime()`, `now()` and `choose()`.

## [0.3.0](http://code.google.com/p/ubiquity-xforms/source/browse/tags/0.3.0) ##

  * Added unit-testing framework, and improved the integration tests.

[Status of version 0.3 issues](http://code.google.com/p/ubiquity-xforms/issues/list?q=Version:0.3&can=1&colspec=Version+Status+ID+Summary&sort=Status)

## 0.2.0 ##

  * Replaced our own module loader with the YUI one. This is because the YUI loader supports specifying dependencies between modules, which in turn requires an examination of those dependencies. This information is important to have before we try to add more modules, or split apart existing modules. In the longer term we will enable the use of different loaders, such as the Dojo one. (See [issue 4](https://code.google.com/p/ubiquity-xforms/issues/detail?id=4).)

[Status of version 0.2 issues](http://code.google.com/p/ubiquity-xforms/issues/list?q=Version:0.2&can=1&colspec=Version+Status+ID+Summary&sort=Status)

## 0.1.0 ##

[Status of version 0.1 issues](http://code.google.com/p/ubiquity-xforms/issues/list?q=Version:0.1&can=1&colspec=Version+Status+ID+Summary&sort=Status)