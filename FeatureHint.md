# Introduction #

Implementation details of the XForms [hint](http://www.w3.org/TR/xforms11/#ui-commonelems-hint) element.

## Implementation ##

For setup, I created a lib/xforms/Hint.js file to have most of the hint code go in there.

So, when a mouseover event happens, it is recognized in the behaviours/decorator.xml file. The code dispatches a xforms-hint event next always.

The Hint's contructor is called next and checks to see if the hint element has a @for attribute on it. If it does, it will use that context for the hint. Then, an EventListener? is activated because the xforms-hint event occurred. The Hint's eventHandler is called next, which calls the performAction method after that.

The performAction method makes sure that the event that was handled was actually a xforms-hint event. Then, the method checks to see if the hint element has a @ref attribute. If the element does, then that XPath's value is used for the hint's string. If the element does not, then the hint's string is the hint element's inline text data. Then, the method creates a message by using YAHOO.widget.Tooltip. It's context is the context of the element. It's text is the hint's string that was just gotten. And it's autodismissdelay is 3 seconds (which makes the hint message go away after 3 seconds).

I also added some display code in the default.css file to make the hint message look good.

There is a no problem anymore with the hint. An input should display a message when the input has an action element that is looking for the "xforms-hint" event even when that input does not have a hint element in it.

## Using `@for` ##

The `hint` element can use the `for` attribute to indicate which part of the document it should apply to:
```
<input id="sn" name="surname" />

<xf:hint for="sn">Please enter your name</xf:hint>
```

## Stories ##

  * user hovers over a control, a [tooltip](FeatureTooltip.md) is displayed.