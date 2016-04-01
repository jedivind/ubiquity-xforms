# Introduction #

Part of the Ubiquity XForms loading sequence is to add required functionality to document elements. This is done by processing a list of items and adding the right JavaScript objects.

# Details #

This information will hopefully change soon, as we continue to refactor. However, the following description is of what needs to be done at the moment.

## generated-css.css ##

The element to be added should be placed in `generated-css.css` to bootstrap the loading process.

Try to group elements together, as much as possible. For example, when adding `xf:help` we change this:
```
xf\:setvalue, xforms\:setvalue,
xf\:hint, xforms\:hint {
  -moz-binding: url("decorator.xml#decorator");
}
```
to this:
```
xf\:setvalue, xforms\:setvalue,
xf\:help, xforms\:help,
xf\:hint, xforms\:hint {
  -moz-binding: url("decorator.xml#decorator");
}
```

## xforms-defs.js ##

At the top of the file is a call to `DECORATOR.addDecoerationRules` with a parameter of an object with two properties; a namespace (in this case the XForms namespace) and a list of rules:
```
DECORATOR.addDecorationRules({
  "namespaceURI" : "http://www.w3.org/2002/xforms",
  "rules" : {
    ...
  }
});
```
The properties of the `rules` object are element names for the elements to map. A typical entry looks like this:
```
// Help is a type of message.
//
"help" : [
  {
    "name": "help-element",
    "apply" : function(arrBehaviours) {
      return arrBehaviours.concat([Listener, EventTarget, Context, Control, Help, Message]);
    }
  }
],
.
.
.
```
The entry tells the loader that when it finds an element with the local name of `help` it should add the classes `Listener`, `EventTarget`, `Context`, `Control`, `Help`, and `Message`.

A new entry needs to be added to the list of rules, for each new element.