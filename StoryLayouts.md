# Introduction #

UX should provide easily useable layout management facilities. Note that many cases can be handled with styling, and there is some overlap with StoryStyling, but it seems useful to tease the two apart.

# Details #

The XForms container controls, such as `xf:group`, `xf:repeat` and `xf:switch` should form the basis of many of the layout schemes.

Layered on top, UX should provide facilities that support these requirements:

  * Cross-browser consistency
  * Pixel-perfection
  * Intuitive design and authoring
  * Desirable resize behavior, when required
  * Leverage layout managers from existing libraries (such as YUI [containers](http://developer.yahoo.com/yui/container/) and [layouts](http://developer.yahoo.com/yui/layout/))

Various layouts should be supported:

  * Flow-based
  * Grid-based
  * Constraint-based
  * Free-form or absolute-positioning