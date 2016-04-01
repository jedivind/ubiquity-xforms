# Introduction #

The Ubiquity XForms module can be loaded by adding a script tag which points to the loader, and by placing the XForms namespace on the root element.

# Deployment scenarios #

The loader will generally reside on the Google Code servers, and your XForms can refer to it from there. However, there is an issue at the moment that an HTC file is required in IE, that prevents inline instance data from being mangled, but due to cross-domain security issues, this HTC file must reside in the same location as the XForm.

This problem should be solved at some point, but it is not a top priority yet. Until it is addressed, we recommend that if you want to develop forms without needing your own server or copying the files, you use Firefox in the manner described below. And if you need to test and deploy with IE, you will have to obtain a copy of the library.

# How to write an XForm to use the Ubiquity XForms processor #

The two parts of the form that **must** be present are the XForms namespace, and the reference to the loader script.

## Adding the right namespaces ##

The root of the document needs to contain the XForms namespace, as follows:

```
<html
 xmlns="http://www.w3.org/1999/xhtml"
 xmlns:xf="http://www.w3.org/2002/xforms"
>
  ...
</html>
```

## Referencing the library ##

To load the library simply refer to the `ubiquity-loader.js` file in the version of the library that you want to use. The currently recommended release is 0.7.0, which is referenced as follows:
```
  <head>
    <title>XForms input and output controls</title>
    <script src="http://ubiquity-xforms.googlecode.com/svn/tags/0.7.0/src/ubiquity-loader.js" type="text/javascript">/**/</script>
  </head>
```

The library will provide some default CSS rules for XForms elements, so if you want to override these, place any stylesheet references or style rules _after_ the library loader. For example, if you want all triggers to have a blue background, rather than the standard grey, you might do this:
```
  <head>
    <title>XForms input and output controls</title>
    <script src="http://ubiquity-xforms.googlecode.com/svn/tags/0.7.0/src/ubiquity-loader.js" type="text/javascript">/**/</script>
    <style type="text/css">
      xf\:trigger xf\:label {
        background-color: blue;
      }
    </style>
  </head>
```

## Placing the mark-up ##

Conventionally, XForms authors place the `xf:model` element in the `head` of the document. However, for the library to work in Firefox, all XForms elements must be placed in the `body`:
```
  </head>
  <body>
    <xf:model ...>

    <xf:input ...>

    <xf:output ...>
  </body>
```

# A complete example #

A simple XForm that allows a name to be edited, can be created as follows:
```
<html
 xmlns="http://www.w3.org/1999/xhtml"
 xmlns:xf="http://www.w3.org/2002/xforms"
>
  <head>
    <title>XForms input and output controls</title>
    <script src="http://ubiquity-xforms.googlecode.com/svn/tags/0.7.0/src/ubiquity-loader.js" type="text/javascript">/**/</script>
  </head>
  <body>
    <xf:model>
      <xf:instance>
        <data xmlns="">
          <firstname>John</firstname>
          <surname>Doe</surname>
        </data>
      </xf:instance>
    </xf:model>

    <xf:input ref="firstname">
      <xf:label>First Name:</xf:label>
    </xf:input>
    
    <xf:input ref="surname">
      <xf:label>Surname:</xf:label>
    </xf:input>

    <xf:output ref="firstname"><xf:label>First Name:</xf:label></xf:output>
    <xf:output ref="surname"><xf:label>Surname:</xf:label></xf:output>
  </body>
</html>
```

# More samples #

See the [samples directory in SVN](http://code.google.com/p/ubiquity-xforms/source/browse/tags/0.7.0/samples) for more.