# Introduction #

UX should leverage various existing widgets from AJAX libraries for the RIA experience. Such widgets will constitute the _custom (UI) controls_ extensions within UX.

# Details #

The table below surveys some of the widget landscape, and relates it to XForms.

## YUI (2.5.2) ##

| **Widget (etc.)** | **Equivalence (roughly)** | **Binding/Effect (roughly)** | **Comments** |
|:------------------|:--------------------------|:-----------------------------|:-------------|
|YAHOO.widget.AutoComplete|xf:input (custom)          |xsd:string                    |YUI DataSource enabled|
|YAHOO.widget.Button (all its variants)|xf:trigger(s)              |Executes handler(s)           |              |
|YAHOO.widget.Calendar|xf:input (custom LnF) / xf:select1 / xf:range|xsd:date                      |              |
|YAHOO.widget.LineChart (all chart variants)|SVG                        |Displays inline charts        |YUI DataSource enabled|
|YAHOO.widget.ColorPicker|xf:select1 (custom LnF)    |custom color type             |              |
|YAHOO.widget.DataTable|xf:repeat                  |Displays data table           |YUI DataSource enabled|
|YAHOO.widget.ImageCropper|xf:upload (?)              |multipart content             |              |
|YAHOO.widget.Menu (all menu variants)|xf:triggers (collection)   |Executes handler(s)           |YUI DataSource enabled|
|YAHOO.widget.Editor|xf:textarea (custom LnF)   |xsd:string                    |              |
|YAHOO.widget.Slider (all slider variants)|xf:range                   |various numeric types         |              |
|YAHOO.widget.TreeView|custom                     |Executes various handlers     |YUI DataSource enabled,dynamic loading possible|
|YAHOO.widget.Uploader|xf:upload                  |multipart content             |              |

## Dojo (1.0) ##

| **Widget (etc.)** | **Equivalence (roughly)** | **Binding/Effect (roughly)** | **Comments** |
|:------------------|:--------------------------|:-----------------------------|:-------------|
|dijit.form.ToggleButton|xf:select1                 |xsd:boolean                   |              |
|dijit.form.RadioButton|xf:select1                 |xsd:string                    |              |
|dijit.form.CheckBox|xf:select1 / xf:select     |xsd:string (one or more)      |              |
|dijit.form.ComboBox|xf:select1 / xf:select     |xsd:string (one or more)      |dojo.data enabled|
|dijit.form.TextBox |xf:input                   |xsd:string                    |              |
|dijit.form.DateTextBox|xf:input (custom LnF)      |xsd:date                      |              |
|dijit.form.CurrencyTextBox|xf:input                   |custom type                   |              |
|dijit.form.NumberTextBox|xf:input                   |various numeric types         |              |
|dijit.form.ValidationTextBox|xf:input                   |custom type                   |              |
|dijit.form.FilteringSelect|xf:select1 / xf:select     |xsd:string(s)                 |dojo.data enabled, works well with large sets|
|dijit.Editor       |xf:textarea (custom LnF)   |xsd:string                    |              |
|dijit.Tree         |custom                     |Executes various handlers     |dojo.data enabled (dojo.data.ItemFileReadStore)|
|dojox.widget.Toaster|xf:message (not modal)     |Displays message              |              |
|dojox.image.ThumbnailPicker|custom                     |Displays thumbnails           |dojo.data enabled (dojo.data.ItemFileReadStore)|
|dojox.image.Slideshow|custom                     |Plays slideshow               |dojo.data enabled (dojo.data.ItemFileReadStore)|
|dojox.image.Gallery|custom                     |Displays thumbnails + selected picture|dojo.data enabled (dojo.data.ItemFileReadStore)|
|dojox.image.Lightbox|xf:message (modal)         |Displays image in modal message|              |
|dojox.gfx          |SVG                        |Displays 2D graphics          |              |
|dijit.form.NumberSpinner|xf:range                   |various numeric types         |              |
|dijit.form.HorizontalSlider|xf:range                   |various numeric types         |              |
|dijit.form.VerticalSlider|xf:range                   |various numeric types         |              |
|dijit.form.Textarea|xf:textarea                |xsd:string                    |              |
|dijit.form.Button (all its variants)|xf:trigger / xf:submit     |Executes handler              |              |
|dijit.Menu         |xf:triggers (collection)   |Executes handler(s)           |              |
|dijit.Toolbar      |xf:triggers (collection)   |Executes handler(s)           |              |
|dijit.Dialog       |xf:message (usually modal) |Displays message              |              |
|dijit.Tooltip      |xf:hint                    |Displays hint                 |              |
|dijit.ProgressBar  |xf:range (animated)        |Displays progress             |              |
|dijit.ColorPalette |xf:select1 (custom LnF)    |custom color type             |              |
|dijit.InlineEditBox (custom LnF)|xf:input / xf:textarea     |xsd:string                    |              |
|dijit.Editor       |xf:textarea (custom LnF)   |xsd:string                    |              |
|dijit.Tree         |custom                     |Executes various handlers     |dojo.data enabled (dojo.data.ItemFileReadStore)|
|dojox.widget.Toaster|xf:message (not modal)     |Displays message              |              |
|dojox.image.ThumbnailPicker|custom                     |Displays thumbnails           |dojo.data enabled (dojo.data.ItemFileReadStore)|
|dojox.image.Slideshow|custom                     |Plays slideshow               |dojo.data enabled (dojo.data.ItemFileReadStore)|
|dojox.image.Gallery|custom                     |Displays thumbnails + selected picture|dojo.data enabled (dojo.data.ItemFileReadStore)|
|dojox.image.Lightbox|xf:message (modal)         |Displays image in modal message|              |
|dojox.gfx          |SVG                        |Displays 2D graphics          |              |

## Scriptaculous (1.8.1) ##

| **Widget (etc.)** | **Equivalence (roughly)** | **Binding/Effect (roughly)** | **Comments** |
|:------------------|:--------------------------|:-----------------------------|:-------------|
|Ajax.InPlaceEditor(all variants)|xf:textarea (custom LnF)   |xsd:string                    |              |
|Ajax.Autocompleter(all variants)|xf:input (custom)          |xsd:string                    |DataSource enabled(server or local variants)|
|Control.Slider     |xf:range                   |various numeric types         |              |