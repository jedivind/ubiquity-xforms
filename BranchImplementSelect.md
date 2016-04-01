| SVN: | [implement-select](http://code.google.com/p/ubiquity-xforms/source/browse/branches/implement-select) |
|:-----|:-----------------------------------------------------------------------------------------------------|
| Owner: | [paul.butcher](http://code.google.com/u/paul.butcher/)                                               |
| Discussion: | To discuss implementation details on this branch, use the [ubiquity-xforms-eng group](http://groups.google.com/group/ubiquity-xforms-eng/), and add `[BranchImplementSelect]` to your comments. |
| Features: | Some of the features to consider are FeatureMenus and FeatureColourControl.                          |

Ubiquity XForms already contains some code for `select` and `select1`. This feature branch aims to complete it.

The initial goal is to make use of YUI widgets as much as possible, before opening things out to use widgets from other libraries.

The motivation for this is that there are many interesting UI patterns that YUI uses, which we should transpose to XForms patterns. There are also many ways that select lists, menus, sliders, date-pickers, and so on, cross over with each other, and we'd like to capture this as much as possible.