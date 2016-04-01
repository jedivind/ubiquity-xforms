The team is working on running all tests in the [Selenium TestRunner](http://ubiquity-xforms.googlecode.com/svn/trunk/testsuite/selenium/core/TestRunner.html?test=..%2F..%2Fxforms%2FTestSuite.html)

# W3C XForms 1.1 Test Suite Compliance Results Table #
| **Browser Results** | **Results By Chapter** | **Latest** | **Latest-1** |
|:--------------------|:-----------------------|:-----------|:-------------|
| [Test Results for IE7](http://ubiquity-xforms.googlecode.com/svn/trunk/testsuite/W3C-XForms-1.1/Edition1/driverPages/Results/IE7/ResultsTable.html) | [Test Status for IE7](http://ubiquity-xforms.googlecode.com/svn/trunk/testsuite/W3C-XForms-1.1/Edition1/driverPages/Results/counterIE7.xhtml) | [321 Passed out of 417](http://code.google.com/p/ubiquity-xforms/source/detail?r=2455) | **240 Passed out of 417** |
| [Test Results for Firefox 3](http://ubiquity-xforms.googlecode.com/svn/trunk/testsuite/W3C-XForms-1.1/Edition1/driverPages/Results/FF3/ResultsTable.html) | [Test Status for Firefox 3](http://ubiquity-xforms.googlecode.com/svn/trunk/testsuite/W3C-XForms-1.1/Edition1/driverPages/Results/counterFF3.xhtml) | [317 Passed out of 417](http://code.google.com/p/ubiquity-xforms/source/detail?r=2455) | **242 Passed out of 417** |

_Note: Only "Normative" test cases counted_

_Note: Chapter 1, Appendix G and H tests not included_

# **Legend** #
**wiki:** _Wiki Feature Page_

**Implemented:** _Code Implemented but not yet Verified_

**Browser Columns:** _Verified on IE6, IE7, IE8(beta), Firefox 2, Firefox 3, Chrome, Safari, and Opera_

| **wiki** | **Element** | **Implemented** | **IE 6** | **IE 7** | **IE 8** | **Firefox 2** | **Firefox 3** | **FF 2(XML)** | **FF 3(XML)** | **Chrome** | **Chrome(XML)** | **Safari** | **Safari(XML)** | **Opera** |
|:---------|:------------|:----------------|:---------|:---------|:---------|:--------------|:--------------|:--------------|:--------------|:-----------|:----------------|:-----------|:----------------|:----------|
| [FeatureValidation](FeatureValidation.md) |             | yes             |          |          |          |               |               |               |               |            |                 |            |                 |           |

# Structure #
| **wiki** | **Structure** | **Implemented** | **IE 6** | **IE 7** | **IE 8** | **Firefox 2** | **Firefox 3** | **FF 2(XML)** | **FF 3(XML)** | **Chrome** | **Chrome(XML)** | **Safari** | **Safari(XML)** | **Opera** |
|:---------|:--------------|:----------------|:---------|:---------|:---------|:--------------|:--------------|:--------------|:--------------|:-----------|:----------------|:-----------|:----------------|:----------|
|          | [model](http://www.w3.org/TR/xforms11/#structure-model) | yes             |          |          |          |               |               |               |               |            |                 |            |                 |           |
|          | [instance](http://www.w3.org/TR/xforms11/#structure-model-instance) | yes             |          |          |          |               |               |               |               |            |                 |            |                 |           |
| [FeatureSubmission](FeatureSubmission.md) | [submission](http://www.w3.org/TR/xforms11/#structure-model-submission) | **Partially**   |          |          |          |               |               |               |               |            |                 |            |                 |           |
|          | [bind](http://www.w3.org/TR/xforms11/#structure-model-bind) | yes             |          |          |          |               |               |               |               |            |                 |            |                 |           |
|          | [extension](http://www.w3.org/TR/xforms11/#structure-extension) |                 |          |          |          |               |               |               |               |            |                 |            |                 |           |

# Core Form Controls #
| **wiki** | **Control** | **Implemented** | **IE 6** | **IE 7** | **IE 8** | **Firefox 2** | **Firefox 3** | **FF 2(XML)** | **FF 3(XML)** | **Chrome** | **Chrome(XML)** | **Safari** | **Safari(XML)** | **Opera** |
|:---------|:------------|:----------------|:---------|:---------|:---------|:--------------|:--------------|:--------------|:--------------|:-----------|:----------------|:-----------|:----------------|:----------|
|          | [input](http://www.w3.org/TR/xforms11/#ui-input) | yes             |          |          |          |               |               |               |               |            |                 |            |                 |           |
|          | [secret](http://www.w3.org/TR/xforms11/#ui-secret) |                 |          |          |          |               |               |               |               |            |                 |            |                 |           |
|          | [textarea](http://www.w3.org/TR/xforms11/#ui-textarea) |                 |          |          |          |               |               |               |               |            |                 |            |                 |           |
|          | [output](http://www.w3.org/TR/xforms11/#ui-output) | yes             |          |          |          |               |               |               |               |            |                 |            |                 |           |
|          | [upload](http://www.w3.org/TR/xforms11/#ui-upload) | **no**          |          |          |          |               |               |               |               |            |                 |            |                 |
|          | [range](http://www.w3.org/TR/xforms11/#ui-range) | yes             |          |          |          |               |               |               |               |            |                 |            |                 |           |
|          | [trigger](http://www.w3.org/TR/xforms11/#ui-trigger) | yes             |          |          |          |               |               |               |               |            |                 |            |                 |           |
|          | [submit](http://www.w3.org/TR/xforms11/#ui-submit) | yes             |          |          |          |               |               |               |               |            |                 |            |                 |           |
|          | [select](http://www.w3.org/TR/xforms11/#ui-select) | yes             |          |          |          |               |               |               |               |            |                 |            |                 |           |
| [FeatureSelect1](FeatureSelect1.md) | [select1](http://www.w3.org/TR/xforms11/#ui-select1) | yes             |          |          |          |               |               |               |               |            |                 |            |                 |
|          | [label](http://www.w3.org/TR/xforms11/#ui-commonelems-label) | yes             |          |          |          |               |               |               |               |            |                 |            |                 |           |
|          | [help](http://www.w3.org/TR/xforms11/#ui-commonelems-help) |                 |          |          |          |               |               |               |               |            |                 |            |                 |           |
|          | [hint](http://www.w3.org/TR/xforms11/#ui-commonelems-hint) | yes             |          |          |          |               |               |               |               |            |                 |            |                 |
|          | [alert](http://www.w3.org/TR/xforms11/#ui-commonelems-alert) | yes             |          |          |          |               |               |               |               |            |                 |            |                 |           |
| [FeatureSelect1](FeatureSelect1.md) | [choices](http://www.w3.org/TR/xforms11/#ui-selection-commonelems-choices) | **in-progress** |          |          |          |               |               |               |               |            |                 |            |                 |           |
| [FeatureSelect1](FeatureSelect1.md) | [item](http://www.w3.org/TR/xforms11/#ui-selection-commonelems-item) | yes             |          |          |          |               |               |               |               |            |                 |            |                 |           |
| [FeatureSelect1](FeatureSelect1.md) | [value](http://www.w3.org/TR/xforms11/#ui-selection-commonelems-value) | yes             |          |          |          |               |               |               |               |            |                 |            |                 |           |
| [FeatureSelect1](FeatureSelect1.md) | [itemset](http://www.w3.org/TR/xforms11/#ui-selection-commonelems-itemset) | **in-progress** |          |          |          |               |               |               |               |            |                 |            |                 |           |
| [FeatureSelect1](FeatureSelect1.md) | [copy](http://www.w3.org/TR/xforms11/#ui-selection-commonelems-copy) | **in-progress** |          |          |          |               |               |               |               |            |                 |            |                 |           |

# Container Elements #
| **wiki** | **Control** | **Implemented** | **IE 6** | **IE 7** | **IE 8** | **Firefox 2** | **Firefox 3** | **FF 2(XML)** | **FF 3(XML)** | **Chrome** | **Chrome(XML)** | **Safari** | **Safari(XML)** | **Opera** |
|:---------|:------------|:----------------|:---------|:---------|:---------|:--------------|:--------------|:--------------|:--------------|:-----------|:----------------|:-----------|:----------------|:----------|
|          | [group](http://www.w3.org/TR/xforms11/#ui-group) | yes             |          |          |          |               |               |               |               |            |                 |            |                 |           |
|          | [switch](http://www.w3.org/TR/xforms11/#ui-switch) | yes             |          |          |          |               |               |               |               |            |                 |            |                 |           |
|          | [case](http://www.w3.org/TR/xforms11/#ui-case) | yes             |          |          |          |               |               |               |               |            |                 |            |                 |           |
|          | [repeat](http://www.w3.org/TR/xforms11/#ui-repeat) | yes             |          |          |          |               |               |               |               |            |                 |            |                 |           |

# Actions #
|**wiki** | **Action** | **Implemented** | **IE 6** | **IE 7** | **IE 8** | **Firefox 2** | **Firefox 3** | **FF 2(XML)** | **FF 3(XML)** | **Chrome** | **Chrome(XML)** | **Safari** | **Safari(XML)** | **Opera** |
|:--------|:-----------|:----------------|:---------|:---------|:---------|:--------------|:--------------|:--------------|:--------------|:-----------|:----------------|:-----------|:----------------|:----------|
|         | [conditional](http://www.w3.org/TR/xforms11/#action-conditional) | yes             |          |          |          |               |               |               |               |            |                 |            |                 |           |
|         | [iteration](http://www.w3.org/TR/xforms11/#action-iteration) |                 |          |          |          |               |               |               |               |            |                 |            |                 |           |
|         | [action](http://www.w3.org/TR/xforms11/#action-action) | yes             |          |          |          |               |               |               |               |            |                 |            |                 |           |
|         | [setvalue](http://www.w3.org/TR/xforms11/#action-setvalue) | **Partially**   |          |          |          |               |               |               |               |            |                 |            |                 |           |
|         | [setindex](http://www.w3.org/TR/xforms11/#action-setindex) | **no**          |          |          |          |               |               |               |               |            |                 |            |                 |           |
|         | [insert](http://www.w3.org/TR/xforms11/#action-insert) | yes             |          |          |          |               |               |               |               |            |                 |            |                 |           |
|         | [delete](http://www.w3.org/TR/xforms11/#action-delete) | yes             |          |          |          |               |               |               |               |            |                 |            |                 |           |
|         | [toggle](http://www.w3.org/TR/xforms11/#action-toggle) | yes             |          |          |          |               |               |               |               |            |                 |            |                 |           |
|         | [setfocus](http://www.w3.org/TR/xforms11/#action-setfocus) |                 |          |          |          |               |               |               |               |            |                 |            |                 |           |
|         | [dispatch](http://www.w3.org/TR/xforms11/#action-dispatch) | yes             |          |          |          |               |               |               |               |            |                 |            |                 |           |
|         | [rebuild](http://www.w3.org/TR/xforms11/#action-rebuild) | yes             |          |          |          |               |               |               |               |            |                 |            |                 |           |
|         | [recalculate](http://www.w3.org/TR/xforms11/#action-recalculate) | yes             |          |          |          |               |               |               |               |            |                 |            |                 |           |
|         | [refresh](http://www.w3.org/TR/xforms11/#action-refresh) | yes             |          |          |          |               |               |               |               |            |                 |            |                 |           |
|         | [reset](http://www.w3.org/TR/xforms11/#action-reset) | yes             |          |          |          |               |               |               |               |            |                 |            |                 |           |
|         | [load](http://www.w3.org/TR/xforms11/#action-load) | yes             |          |          |          |               |               |               |               |            |                 |            |                 |           |
|         | [send](http://www.w3.org/TR/xforms11/#action-send) | yes             |          |          |          |               |               |               |               |            |                 |            |                 |           |
|         | [message](http://www.w3.org/TR/xforms11/#action-message) | yes             |          |          |          |               |               |               |               |            |                 |            |                 |           |

# XPath Functions #

| **wiki** | **Function** | **Implemented** | **IE 6** | **IE 7** | **IE 8** | **Firefox 2** | **Firefox 3** | **FF 2(XML)** | **FF 3(XML)** | **Chrome** | **Chrome(XML)** | **Safari** | **Safari(XML)** | **Opera** |
|:---------|:-------------|:----------------|:---------|:---------|:---------|:--------------|:--------------|:--------------|:--------------|:-----------|:----------------|:-----------|:----------------|:----------|
|          | [boolean-from-string](http://www.w3.org/TR/xforms11/#fn-boolean-from-string)| yes             |          |
|          | [is-card-number](http://www.w3.org/TR/xforms11/#fn-is-card-number)| yes             |          |
|          | [avg](http://www.w3.org/TR/xforms11/#fn-avg) | yes             |          |
|          | [min](http://www.w3.org/TR/xforms11/#fn-min) | yes             |          |
|          | [max](http://www.w3.org/TR/xforms11/#fn-max) | yes             |          |
|          | [count-non-empty](http://www.w3.org/TR/xforms11/#fn-count-non-empty) | yes             |          |
|          | [index](http://www.w3.org/TR/xforms11/#fn-index) | yes             |          |
|          | [power](http://www.w3.org/TR/xforms11/#fn-power) | yes             |          |
|          | [random ](http://www.w3.org/TR/xforms11/#fn-random) | yes             |          |
|          | [compare](http://www.w3.org/TR/xforms11/#fn-compare) | yes             |          |
|          | [local-date](http://www.w3.org/TR/xforms11/#fn-local-date) | yes             |          |
|          | [property](http://www.w3.org/TR/xforms11/#fn-property) | yes             |          |
|          | [digest](http://www.w3.org/TR/xforms11/#fn-digest) | yes             |
|          | [hmac](http://www.w3.org/TR/xforms11/#fn-hmac) | yes             |
|          | [if](http://www.w3.org/TR/xforms11/#fn-if) | yes             |          |
|          | [local-dateTime](http://www.w3.org/TR/xforms11/#fn-local-dateTime) | yes             |          |
|          | [now](http://www.w3.org/TR/xforms11/#fn-now) | yes             |          |
|          | [days-from-date](http://www.w3.org/TR/xforms11/#fn-days-from-date) | yes             |          |
|          | [days-to-date](http://www.w3.org/TR/xforms11/#fn-days-to-date) | yes             |          |
|          | [seconds-from-dateTime](http://www.w3.org/TR/xforms11/#fn-seconds-from-dateTime) | yes             |          |
|          | [seconds-to-dateTime](http://www.w3.org/TR/xforms11/#fn-seconds-to-dateTime) | yes             |          |
|          | [adjust-dateTime-to-timezone](http://www.w3.org/TR/xforms11/#fn-adjust-dateTime-to-timezone) | yes             |          |
|          | [seconds](http://www.w3.org/TR/xforms11/#fn-seconds) | yes             |          |
|          | [months](http://www.w3.org/TR/xforms11/#fn-months) | yes             |          |
|          | [instance](http://www.w3.org/TR/xforms11/#fn-instance) | yes             |          |
|          | [current](http://www.w3.org/TR/xforms11/#fn-current) | yes             |
|          | [id](http://www.w3.org/TR/xforms11/#fn-id) |                 |          |
|          | [context](http://www.w3.org/TR/xforms11/#fn-context) | yes             |
|          | [choose](http://www.w3.org/TR/xforms11/#fn-choose) | yes             |          |
|          | [event](http://www.w3.org/TR/xforms11/#fn-event) | yes             |

# Events #

## Initialization Events ##
| **wiki** | **Event** | **Implemented** | **IE 6** | **IE 7** | **IE 8** | **Firefox 2** | **Firefox 3** | **FF 2(XML)** | **FF 3(XML)** | **Chrome** | **Chrome(XML)** | **Safari** | **Safari(XML)** | **Opera** |
|:---------|:----------|:----------------|:---------|:---------|:---------|:--------------|:--------------|:--------------|:--------------|:-----------|:----------------|:-----------|:----------------|:----------|
|          | [xforms-model-construct](http://www.w3.org/TR/xforms11/#evt-modelConstruct) | yes             | |          |          |               |               |               |               |
|          | [xforms-model-construct-done](http://www.w3.org/TR/xforms11/#evt-modelConstructDone) | yes             | |          |          |               |               |               |               |
|          | [xforms-ready](http://www.w3.org/TR/xforms11/#evt-ready) | yes             | |          |          |               |               |               |               |
|          | [xforms-model-destruct](http://www.w3.org/TR/xforms11/#evt-modelDestruct) | **no**          | |          |          |               |               |               |               |


## Interaction Events ##
| **wiki** | **Event** | **Implemented** | **IE 6** | **IE 7** | **IE 8** | **Firefox 2** | **Firefox 3** | **FF 2(XML)** | **FF 3(XML)** | **Chrome** | **Chrome(XML)** | **Safari** | **Safari(XML)** | **Opera** |
|:---------|:----------|:----------------|:---------|:---------|:---------|:--------------|:--------------|:--------------|:--------------|:-----------|:----------------|:-----------|:----------------|:----------|
|          | [xforms-rebuild](http://www.w3.org/TR/xforms11/#evt-rebuild) | **Partially, because [issue 103](https://code.google.com/p/ubiquity-xforms/issues/detail?id=103)** |          |          |          |               |               |               |               |
|          | [xforms-recalculate](http://www.w3.org/TR/xforms11/#evt-recalculate) | **Partially, because [issue 103](https://code.google.com/p/ubiquity-xforms/issues/detail?id=103)** |          |          |          |               |               |               |               |
|          | [xforms-revalidate](http://www.w3.org/TR/xforms11/#evt-revalidate) | **Partially, because [issue 103](https://code.google.com/p/ubiquity-xforms/issues/detail?id=103)** |          |          |          |               |               |               |               |
|          | [xforms-refresh](http://www.w3.org/TR/xforms11/#evt-refresh) | **Partially, because [issue 103](https://code.google.com/p/ubiquity-xforms/issues/detail?id=103)** |          |          |          |               |               |               |               |
|          | [xforms-reset](http://www.w3.org/TR/xforms11/#evt-reset) | yes             |          |          |          |               |               |               |               |
|          | [xforms-next and xforms-previous](http://www.w3.org/TR/xforms11/#evt-next) |                 |          |          |          |               |               |               |               |
|          | [xforms-focus](http://www.w3.org/TR/xforms11/#evt-focus) |                 |          |          |          |               |               |               |               |
|          | [xforms-help](http://www.w3.org/TR/xforms11/#evt-help) |                 |          |          |          |               |               |               |               |
|          | [xforms-hint](http://www.w3.org/TR/xforms11/#evt-help) | yes             |          |          |          |               |               |               |               |
|          | [xforms-submit](http://www.w3.org/TR/xforms11/#evt-submit) | yes             |          |          |          |               |               |               |               |
|          | [xforms-submit-serialize](http://www.w3.org/TR/xforms11/#evt-submit-serialize) |                 |          |          |          |               |               |               |               |

## Notification Events ##
| **wiki** | **Event** | **Implemented** | **IE 6** | **IE 7** | **IE 8** | **Firefox 2** | **Firefox 3** | **FF 2(XML)** | **FF 3(XML)** | **Chrome** | **Chrome(XML)** | **Safari** | **Safari(XML)** | **Opera** |
|:---------|:----------|:----------------|:---------|:---------|:---------|:--------------|:--------------|:--------------|:--------------|:-----------|:----------------|:-----------|:----------------|:----------|
|          | [xforms-insert](http://www.w3.org/TR/xforms11/#evt-insert) | **Partially**   |          |          |          |               |               |               |               |
|          | [xforms-delete](http://www.w3.org/TR/xforms11/#evt-delete) | **Partially**   |          |          |          |               |               |               |               |
|          | [xforms-value-changed](http://www.w3.org/TR/xforms11/#evt-valueChanged) | yes             |          |          |          |               |               |               |               |
|          | [xforms-valid](http://www.w3.org/TR/xforms11/#evt-valid) | **no**          |          |          |          |               |               |               |               |
|          | [xforms-invalid](http://www.w3.org/TR/xforms11/#evt-invalid) | **Partially, because [issue 103](https://code.google.com/p/ubiquity-xforms/issues/detail?id=103)** |          |          |          |               |               |               |               |
|          | [xforms-readonly](http://www.w3.org/TR/xforms11/#evt-readonly) | **no**          |          |          |          |               |               |
|          | [xforms-readwrite](http://www.w3.org/TR/xforms11/#evt-readwrite) | **no**          |          |          |          |               |               |
|          | [xforms-required](http://www.w3.org/TR/xforms11/#evt-required) | **no**          |          |          |          |               |               |
|          | [xforms-optional](http://www.w3.org/TR/xforms11/#evt-optional) | **no**          |          |          |          |               |               |
|          | [xforms-enabled](http://www.w3.org/TR/xforms11/#evt-enabled) | **no**          |          |          |          |               |               |
|          | [xforms-disabled](http://www.w3.org/TR/xforms11/#evt-disabled) | **no**          |          |          |          |               |               |
|          | [DOMActivate](http://www.w3.org/TR/xforms11/#evt-activate) | yes             |          |          |          |               |               |
|          | [DOMFocusIn](http://www.w3.org/TR/xforms11/#evt-DOMFocusIn) | **no**          |          |          |          |               |               |
|          | [DOMFocusOut](http://www.w3.org/TR/xforms11/#evt-DOMFocusOut) | **no**          |          |          |          |               |               |
|          | [xforms-select and xforms-deselect](http://www.w3.org/TR/xforms11/#evt-select) | **no**          |          |          |          |               |               |
|          | [xforms-in-range](http://www.w3.org/TR/xforms11/#evt-in-range) | **no**          |          |          |          |               |               |
|          | [xforms-out-of-range](http://www.w3.org/TR/xforms11/#evt-out-of-range) | **no**          |          |          |          |               |               |
|          | [xforms-scroll-first and xforms-scroll-last](http://www.w3.org/TR/xforms11/#evt-scroll) | **no**          |          |          |          |               |               |
|          | [xforms-submit-done](http://www.w3.org/TR/xforms11/#evt-submit-done) | yes             |          |          |          |               |               |

## Error Indication Events ##
| **wiki** | **Event** | **Implemented** | **IE 6** | **IE 7** | **IE 8** | **Firefox 2** | **Firefox 3** | **FF 2(XML)** | **FF 3(XML)** | **Chrome** | **Chrome(XML)** | **Safari** | **Safari(XML)** | **Opera** |
|:---------|:----------|:----------------|:---------|:---------|:---------|:--------------|:--------------|:--------------|:--------------|:-----------|:----------------|:-----------|:----------------|:----------|
|          | [xforms-binding-exception](http://www.w3.org/TR/xforms11/#evt-bindingException) |                 |          |          |          |               |               |
|          | [xforms-compute-exception](http://www.w3.org/TR/xforms11/#evt-computeException) |                 |          |          |          |               |               |
|          | [xforms-link-error](http://www.w3.org/TR/xforms11/#evt-linkError) |                 |          |          |          |               |               |
|          | [xforms-link-exception](http://www.w3.org/TR/xforms11/#evt-linkException) |                 |          |          |          |               |               |
|          | [xforms-output-error](http://www.w3.org/TR/xforms11/#evt-output-error) |                 |          |          |          |               |               |
|          | [xforms-submit-error](http://www.w3.org/TR/xforms11/#evt-submit-error) |                 |          |          |          |               |               |
|          | [xforms-version-exception](http://www.w3.org/TR/xforms11/#evt-versionException) |                 |          |          |          |               |               |


# Priority for Missing Features for XForms 1.1 #
  * FeatureValidation
  * Implement missing features
  * xforms-rebuild event not dispatched
  * xforms-refresh event not dispatched
  * xforms-recalculate event not dispatched
  * xforms-revalidate event not dispatched
  * xforms-model-destruct event not dispatched

## Missing Features for XForms 1.1 ##
  * Setindex
  * Upload
    * @mediatype
    * @incremental
    * @appearance
    * `<filename/>`
    * `<mediatype/>`
  * Help Element
  * Input/secret/textarea Control
    * @incremental
    * @inputmode
    * type-based rendering
      * type=xsd:date
  * Secret/Textarea do not work
  * Output
    * @appearance
    * ?currency format/decimal format?
  * Range
    * @incremental
  * Trigger/Submit
    * @appearance(full:compact:minimal)
  * Select
    * Not successful in testing
    * @incremental
    * @appearance(full[checkbox](checkbox.md):compact[list](list.md):minimal[checks](checks.md))
  * Select1
    * @incremental
    * @appearance(full[radiobox](radiobox.md):compact[list](list.md))
  * Switch/Case do not work on XHTML, they work on IE and FF(HTML)
  * Delete
    * The delete-nodes event context info for xforms-delete event
  * Reset causes the script to run forever causing an error
  * Repeat
    * @startindex not working
  * Copy
    * unsuccessful testing
  * Load
    * `<resource/>`
  * Submission
    * @mode
    * @version
    * @indent
    * @encoding
    * @omit-xml-declarations
    * @standalone
    * @cdata-section-elements
    * @replace=text (all, instance, none are supported)
    * @target
    * @separator
    * @includenamespaceprefixes
