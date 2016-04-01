# Introduction #

Implementation details for the XForms [Message](http://www.w3.org/TR/xforms11/#action-message) Element.

## Implementation ##

xf:message elements have an @level attribute that can be "modal", "modeless", or "ephemeral".  The default is "modal".

There already is an ephemeral function that creates an ephemeral message in lib/backplane/notify.js.  There is a SimpleDialog function that creates a modal or modeless message using YAHOO.widget.SimpleDialog in lib/platform/yui/message-yui.js.

So, the xf:message's performAction function checks the xf:message's @level and calls one of these functions to show or hide the message.

A "modal" xf:message displays pretty nicely in a dialog window.  Since it is "modal", you have to click on the OK button before you can do anything else on the page.  Also, there is a background-shadow that will only appear when the message is "modal".  This is useful because users will know that they can not do other things on the page until they click on the OK button.

A "modeless" xf:message displays pretty nicely in a dialog window.  Since it is "modeless", you can still select on other buttons and type words on the page.  So, there is not a background-shadow for "modeless" messages.

I made the xf:message's OK button visible with the code that I added in lib/platform/yui/message-yui.js. I also made the xf:message display similarly to yui-skin-sam with the code that I added in lib/platform/yui/yui-style.css.  The xf:message and it's header look a lot better with these settings.

A "ephemeral" xf:message works exactly as a xf:hint does (not in a dialog window), because they are both using the same function in lib/backplane/notify.js to do it.

@ref is supported.

xf:output elements inside a xf:message is supported.

## Stories ##

For "modal" messages, a user can only do other things on the page when the OK button is clicked on.

For "modeless" messages, a user can do other things while the "modeless" message is on the page.

For "ephemeral" messages, a user should think that they are similar to hint messages.