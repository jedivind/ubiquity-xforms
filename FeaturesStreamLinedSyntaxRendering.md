# Introduction #

Approaches on how to render the XForms Streamlined Syntax within the current ubiquity-xforms framework.


# Detail #

The basic idea is simple, we need to gather all the XForms Streamlined elements from the document, process it, and then generate the following:

  1. XForms Model and Data Instance
  1. XForms UI element(s) for each Streamlined UI element
  1. XForms bindings and constraints

There are numerous way to implement the rendering of the syntax, and here are the some of the ideas that have been discussed.

## I. Rendering Streamlined Element ##

### CSS Selectors expansion ###
The idea is same as how ubiquity-xforms renders xforms element. We define a streamlined definition of css selectors for each streamlined element.

### DOM Walkining expansion ###

## II. XForms Element ##

### Ubiquity Behavior Attachment ###

### DOM Element Creation and Replacement ###

## III. XForms Model and Binding Generation ##