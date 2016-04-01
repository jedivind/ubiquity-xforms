## Introduction ##

Ubiquity XForms supports a partial implementation of the [XSLT 2.0 format-number() function](http://www.w3.org/TR/xslt20/#function-format-number). The following examples are also available in a [live sample](http://ubiquity-xforms.googlecode.com/svn/trunk/samples/xforms-format-number.html).

## Details ##

A basic version of `format-number()` has been implemented, which supports using a prefix, suffix and formatting decimal places.

The function can be used as follows:

### Prefixes: ###

```
<xf:output value="format-number(100, '$#')">
  <xf:label>Payment:</xf:label>
</xf:output>

<xf:output value="format-number(100, 'CAN #')">
  <xf:label>Payment:</xf:label>
</xf:output>
```

### Suffixes: ###

```
<xf:output value="format-number(16, '#¢')">
	<xf:label>Payment:</xf:label>
</xf:output>

<xf:output value="format-number(25, '# DEM')">
	<xf:label>Payment:</xf:label>
</xf:output>
```

### Prefixes and suffixes: ###

```
<xf:output value="format-number(23.16, '$#¢')">
	<xf:label>Payment:</xf:label>
</xf:output>

<xf:output value="format-number(25.89, '£#p')">
	<xf:label>Payment:</xf:label>
</xf:output>
```

### Decimal places: ###

```
<xf:output value="format-number(23.1534, '#.')">
	<xf:label>Payment:</xf:label>
</xf:output>

<xf:output value="format-number(23.1534, '#.#')">
	<xf:label>Payment:</xf:label>
</xf:output>

<xf:output value="format-number(23.1534, '#.##')">
	<xf:label>Payment:</xf:label>
</xf:output>

<xf:output value="format-number(23.1534, '#.######')">
	<xf:label>Payment:</xf:label>
</xf:output>
```

### Decimal places, prefixes and suffixes: ###

```
<xf:output value="format-number(23.4567, '$#.##¢')">
	<xf:label>Payment:</xf:label>
</xf:output>

<xf:output value="format-number(23.4, '£#.##p')">
	<xf:label>Payment:</xf:label>
</xf:output>
```