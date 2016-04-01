Author: [Mark Birbeck](http://code.google.com/u/mark.birbeck@webBackplane.com/)

Status: Rahul has implemented this work-item and it is available for review at [r941](https://code.google.com/p/ubiquity-xforms/source/detail?r=941).

# Introduction #

The decoration process currently involves three steps:

  1. attach an XBL or HTC file to nodes in order to bootstrap;
  1. parse the URL of the XBL or HTC file, so as to obtain a list of classes to add to the selected DOM element;
  1. attach the required functionality and initialise.

Altering the bootstrapping process is part of a separate work-item. This work-item is concerned with removing the need for the classes to be specified in the URL.

# Sequence #

The first step should be to remove the classes for one control, from the list in the URI. This should cause a form containing that control to fail. Then the classes removed should be added back in, but via the function that checks the XBL/HTC URL. This should cause the failing form to work again.

## Remove classes for `output` ##

There are a number of ways this work could go, so here is one suggestion.

In the `xforms-defs.js` file remove the rule for `xf|output`.

In the `generated-css.css` file, change the CSS rule for `xf\:output` and `xforms\:output` so that it only loads `decorator.xml`, but doesn't specify any objects to load:
```
xf\:output, xforms\:output {
  -moz-binding: url("decorator.xml#decorator");
}
```
Running a form that contains an `xf:output` should now fail.

## Add a suitable test to `getDecorationObjectNames()` ##

In `decorate.js`, the function `getDecorationObjectNames()` simply cracks open the URL to get the objects. Since we've removed them from the URL, we now need to add back the 'missing' `xf:output` objects in some other way.

So as to make this as painless as possible, I would retain the current test in `getDecorationObjectNames()`, but at the point where we return the array (obtained with `split()`) I would store that array in a variable, and then supplement the array with additional values.

(Obviously in our example there will only be one source of object names, but as we go forward with this, we might find that we add a test that removes some classes, but leaves others to be obtained from the URL.)

To the array returned from cracking the URL we add further objects depending on the element name. In this case, we test for `xf:output` and simply add three array elements, one for `EventTarget`, one for `Context` and one for `Control`.

At this point, any forms with output controls on them should work again.

## Result ##

By the end of this work-item we would have a mechanism where we can remove items from the URL list, and place a corresponding test into the `getDecorationObjectNames` function.

We would also have a way to decorate an element that was independent of the bootstrapping process.

## Design issues ##

We will need to come up with a way of expressing the rules, a way to add to them when using different languages (like SMIL), a way to allow the author to add their own rules for custom controls, and so on.

But in the first instance, a simple inline test on the element name (such as `xf:output`, if that is used to start us off), is perfectly acceptable. By the time we come to add more tests, some further design work should have been done. (We can use this work-item as a place to discuss how we might add the various features we need.)