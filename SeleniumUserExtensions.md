# Introduction #

Selenium allows extensions to be added. This page documents the extensions added to make UXF easier to test with Selenium.

# Extensions #

## ModelReady ##

The _ModelReady_ extension can be used to verify and wait for a single model to be ready, or all models.

Waiting for all models to be ready, looks like this:

```
<tr>
  <td>waitForModelReady</td>
  <td></td>
  <td></td>
  <td></td>
</tr>
```

Waiting for a single model makes use of any of the Selenium selectors, like this:

```
<tr>
  <td>waitForModelReady</td>
  <td>xpath=/html/body/xf:model[1]</td>
  <td></td>
  <td></td>
</tr>
```

## XformsControlValue ##

The _XformsControlValue_ extension allows the test to verify or wait for the value of an XForms control to be set, hiding the actual implementation details of the control.

For example, to test that a particular `xf:select1` control has the value 'cc', we might do this:

```
<tr>
  <td>verifyXformsControlValue</td>
  <td>xpath=/html/body/xf:select1[@ref='method']</td>
  <td>cc</td>
  <td>Checks that the select1 has the right value</td>
</tr>
```