# Introduction #

Implementation details for the XForms [Dispatch](http://www.w3.org/TR/xforms11/#action-dispatch) Element.

## Implementation ##

This element dispatches an XML Event to a specific target element, basically by this code:
FormsProcessor.dispatchEvent(oTarget, oEvt);

@target, @name, @delay are all supported.
@target is the IDREF where the event is dispatched to.
@name is the name of the event being dispatched.
@delay is the time to wait before the event can be dispatched.

These attributes could be elements.  Should they be xf: elements or not?  Right now, they are xf: elements.

If target or name are not defined (by attribute or element), nothing is dispatched.

The @delay was not supported before, now it is supported.

## Stories ##