Most Ajax libraries have some kind of tooltip feature, for adding text or images that will be displayed to the user when they mouseover some part of the document.

In XForms this functionality is provided by an 'ephemeral message'. These messages can be invoked using JavaScript calls, or by mark-up, usually using the `hint` element.

# Behaviour #

The ephemeral message is usually a normal message that has the following characteristics:

  * it has no title;
  * it is displayed in response to a user 'hovering' in some way over a control or element;
  * is is usually displayed close to the element that the user is hovering over, although other patterns may be possible;
  * if the mouse is moved away from the context element, the message disappears;
  * if the mouse is not moved, the message still usually disappears, after some set amount of time.

# Usage #

An author can indicate that they would like to use a tooltip in the following ways:

## Script ##

To do

## Mark-up ##

### Using `@for` ###

The `hint` element can use the `for` attribute to indicate which part of the document it should apply to:
```
<input id="sn" name="surname" />

<xf:hint for="sn">Please enter your name</xf:hint>
```

### Using the parent element ###

If there is no `@for` attribute, the hint will apply to its parent element:
```
<div>
  <xf:hint>This is a hint</xf:hint>
</div>
```
```
<xf:input ref="x">
  <xf:label>Name:</xf:label>
  <xf:hint>Please enter your name.</xf:hint>
</xf:input>
```

# Implementation #

The YUI library supports tooltips, as described [here](http://developer.yahoo.com/yui/container/tooltip/).