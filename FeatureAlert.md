# Introduction #

Implementation details for the XForms [Alert](http://www.w3.org/TR/xforms11/#ui-commonelems-alert) Element.

## Implementation ##

The inline text of an alert will be used to display an alert element and it will be red.

When a control form is valid by its 'constraint', the alert will be hidden. When a control form is invalid by its 'constraint', the alert will to be displayed.

Since the Schema Validation is not supported yet, that part of the alert support is not supported yet either. I did put two test situations in my alert test case that test this and fail. When the Schema Validation is supported, those situations should pass (I think).

The last story already works nicely.

The alert text is after the control by a for loop in Control.js that iterates over the control's children and inserts the 

&lt;pe-value&gt;

 before the first 

&lt;xf:alert&gt;

 child (if none, 

&lt;pe-value&gt;

 goes at the end).

The @ref support works okay for now.  It doesn't work on Firefox 3.

XPaths on IE need to be checked case insensitive. The code was checking case sensitive before, which wasn't working. The new code checks to see if g\_bIsInXHTMLMode is true or false. If it is false (which it is now for IE), then the code will check XPaths case insensitive. If it is true (which I think will be supported sometime later for maybe a different situation), then the code will check XPaths case sensitive.

The xf:alert messages' displays were fixed by css styles. The main css style that fixes this is the one that makes alerts' pe-value have no border and transparent color.

## Stories ##
  * A user enters invalid data into a control, the alert message is shown.
  * A user enters data that cannot be rendered into a control, the alert message is shown.
  * A user enters valid data into a control currently showing an alert message, the alert message is hidden.

> 

&lt;xf:input ref="return"&gt;


> > 

&lt;xf:label&gt;

Return date

&lt;/xf:label&gt;


> > > 

&lt;xf:alert&gt;


> > > > The return date must be <em>after</em> the
> > > > > 

&lt;xf:trigger&gt;


> > > > > > 

&lt;xf:label&gt;

outbound date

&lt;/xf:label&gt;


> > > > > > <xf:setfocus control="outbound" ev:event="DOMActivate" />

> > > > > 

&lt;/xf:trigger&gt;


> > > > > .

> > > 

&lt;/xf:alert&gt;



> 

&lt;/xf:input&gt;


  * This code is used, a user enters invalid data into this control, and the alert message is shown correctly.

## Prerequisites ##
  * [validation](FeatureValidation.md)
  * [xforms-out-of-range](FeatureOutOfRange.md)