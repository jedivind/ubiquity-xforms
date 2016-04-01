# Introduction #

The submssion component should be enhanced to support the [XForms 1.1 spec](http://www.w3.org/TR/xforms11/#submit).


# Stories #
  * Attributes
    * resource
    * mode
    * validate
    * relevant
    * version
    * indent
    * mediatype
    * encoding
    * omit-xml-declarations
    * standalone
    * cdata-section-elements
    * replace=text (all, instance, none are supported)
    * target
    * separator
    * includenamespaceprefixes
  * method element implementation
    * support "delete"
    * support "multipart-post"
    * support "form-data-post"
    * support "urlencoded-post"
  * resource element implementation
  * header element implementation
    * name element
    * value element
  * implement serialization
    * dispatch xforms-submit-serialization event
    * submission-body property
  * xforms-submit-error with context
    * property=resource-uri
    * property=response-status-code
    * property=response-headers
    * property=response-reason-phrase
    * property=response-body
    * property=error-type
      * submission-in-progress
      * no-data
      * validation-error
      * parse-error
      * target-error
      * resource-error
  * xforms-submit-done with context
    * property=resource-uri
    * property=response-status-code
    * property=response-headers
    * property=response-reason-phrase

# See Also #
  * [SampleLoanForm](SampleLoanForm.md)
  * [FeatureValidation](FeatureValidation.md)