| SVN: | [hint-work](http://code.google.com/p/ubiquity-xforms/source/browse/branches/hint-work) |
|:-----|:---------------------------------------------------------------------------------------|
| Owner: | [mdmcente](http://code.google.com/u/mdmcente/)                                         |
| Discussion: | To discuss implementation details on this branch, use the [ubiquity-xforms-eng group](http://groups.google.com/group/ubiquity-xforms-eng/), and add `[BranchHintWork]` to your comments. |
| Features: | One of the features to consider are FeatureTooltip.                                    |

For setup, I created a lib/xforms/Hint.js file to have most of the hint code go in there.

So, when a mouseover event happens, it is recognized in the behaviours/decorator.xml file.
The code dispatches a xforms-hint event next always.

The Hint's contructor is called next and checks to see if the hint element has a @for attribute on it.  If it does, it will use that context for the hint.  Then, an EventListener is activated because the xforms-hint event occurred.  The Hint's eventHandler is called next, which calls the performAction method after that.

The performAction method makes sure that the event that was handled was actually a xforms-hint event.  Then, the method checks to see if the hint element has a @ref attribute.  If the element does, then that XPath's value is used for the hint's string.  If the element does not, then the hint's string is the hint element's inline text data.  Then, the method creates a message by using YAHOO.widget.Tooltip.  It's context is the context of the element.  It's text is the hint's string that was just gotten.  And it's autodismissdelay is 2 seconds (which makes the hint message go away after 2 seconds).

I also added some display code in the default.css file to make the hint message look good.

There is a no problem anymore with the hint.  An input should display a message when the input has an action element that is looking for the "xforms-hint" event even when that input does not have a hint element in it.