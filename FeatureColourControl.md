The YUI library contains a color-picker, as illustrated [here](http://developer.yahoo.com/yui/examples/button/btn_example11.html).

# Indicating the control #

The color-picker could be invoked in XForms using any of the following techniques:
```
<xf:input ref="x" datatype="xhd:Color">
  ...
</xf:input>
```
```
<xf:range ref="x" datatype="xhd:Color">
  ...
</xf:range>
```
```
<xf:select1 ref="x" datatype="xhd:Color">
  ...
</xf:select1>
```
Note that the datatype indicator is based on the [XHTML Modularisation 1.1](http://www.w3.org/TR/xhtml-modularization/) datatype for color, which is `http://www.w3.org/1999/xhtml/datatypes/Color`.

# Appearance #

The color-picker can appear in a fully expanded mode, or compact, waiting for the user to interact with the control. This can be indicated using `appearance="full"` and `@appearance="compact"` respectively, with the latter being the default setting.

# Using palettes #

An enhancement to the basic color-picker would be to include predefined values. This would allow the user to choose any color from the palette, or to pick a saved one from the list:
```
<xf:select1 ref="x" datatype="xhd:Color">
  <xf:label>Background colour:</xf:label>
  <xf:itemset nodeset="saved-colors">
    <xf:label ref="label"></xf:label>
    <xf:value ref="value"></xf:value>
  </xf:itemset>
</xf:select1>
```