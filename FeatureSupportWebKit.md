Author: [Mark Birbeck](http://code.google.com/u/mark.birbeck@webBackplane.com/)

Status: The first requirement is awaiting code review at [r941](https://code.google.com/p/ubiquity-xforms/source/detail?r=941).

# Introduction #

It's always been the intention to have UX running in Webkit, since it puts XForms into Safari, Android, the iPhone, Mac OX Dashboard widgets, and so on. But the recent interest in Google's browser -- _Chrome_ -- has made this an even more desirable goal.

# Issues #

The current technique of using CSS to 'bootstrap' the object decoration process -- and to add new decorators dynamically during form operation -- will not work in Webkit. This means that some other approach, such as walking the DOM, or maintaining a list of rules and applying them jQuery-style, will need to be worked out.

# Requirements #

  1. A first step towards this will be to [remove the need to express classes in the decorator URI](WorkItemRemoveNeedForListOfClassesInDecoratorUri.md), which then breaks the current connection between the bootstrapping and the step that works out which classes to use to decorate an object.
  1. Once this is complete, a good next step would be to [provide a test for whether a browser needs to fall back to using DOM-walking](WorkItemCreateTestForDomWalkerFallback.md). One simple way to do this without having to know the browser name would be to attempt to attach a simple XBL (or HTC) file to the HTML element, which contains one line of code that sets a flag on the HTML element. This flag would indicate that the CSS or dynamic property technique is supported by the browser, and of course its absence would indicate that to support the browser type, UX needs to fall back to the DOM-walking technique. With this in place, the first thing the DOM-walker code would do is to check for the flag on the HTML element, and if it's present, abort the DOM-walking.
  1. The final step is to [create a bootstrapping mechanism that walks the DOM](WorkItemCreateDomWalkingBootstrapper.md), and so is independent of the use of `-moz-binding` (in Firefox 2 and 3) or dynamic CSS properties (in IE). Note that this code should work in _all_ browsers, not just Webkit, so we will need to be able to 'force' a DOM-walk, even on FF and IE, for testing purposes.

(Another way to look at this combination of steps is that DOM-walking is the default mode of operation, unless the browser provides some cunning way to speed up the process. So UX will _always_ start walking the DOM, but if there is a flag set to indicate that the walking is unnecessary, it can abort the process.)