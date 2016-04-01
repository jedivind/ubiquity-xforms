# Introduction #

Implementation details for the XForms [Upload](http://www.w3.org/TR/xforms11/#ui-upload) Element.

## Implementation ##

@mediatype & @incremental (both optional) should be supported.

The form only works with the datatypes of xsd:anyURI, xsd:base64Binary, or xsd:hexBinary.

The implementation will probably have its own javascript file.  In that file, there will be support for a text field and a Browse... button.  The text field will probably be added in a similar way to how input adds its text field.  When the Browse... button is clicked, a window with the local file system will come up (which may be really tricky to do).  The window may be a "modal" or "modeless" dialog window. The window will probably have a Open button.  When a file is selected and the Open button is clicked, then the window will go away, the file's full path filename will become the pe-value, the filename element's @ref will have the local filename (which includes the extension) and the mediatype element's @ref will have the file's type (based on the file's extension).

More implementation will come when I start working on it.

## Stories ##

  * A user will be allowed to upload a file from the local file system.