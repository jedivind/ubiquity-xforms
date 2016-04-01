# Introduction #

UX should allow for styling core form controls, custom controls, and container controls. There may be one or more predefined themes to allow for quick skinning of RIAs.

# Details #

Some of the requirements are:

  * UX should specify a default homogeneous style for various controls.
  * It should be possible for developers to define their own _themes_ or _skins_.

Styling should be possible at various levels of granularity:

  * It should be possible to apply themes to entire applications / pages.
  * It should be possible to apply styles to controls individually.
  * It should be possible to style pieces within controls. For example, it should be possible to style the label of a control differently from the control itself.

**Notes:** Great comments. Just on the last one, this is already possible, and is a crucial part of the architecture. We have a pseudo element that represents the 'active' part of the control, and this can not only be styled independently of the label, hint, alert, help, etc., but can also have a distinct custom control attached. We'll try to get some of this documented, but in the meantime see [anatomy of a control](http://www.formsplayer.com/node/121) on the formsPlayer site.

# Feature pages #

  * FeatureControlElementsStyle
  * FeatureControlSize
  * FeatureControlStyle