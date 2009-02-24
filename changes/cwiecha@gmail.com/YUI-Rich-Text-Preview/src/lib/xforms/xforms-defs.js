/*
 * Copyright (C) 2008 Backplane Ltd.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *  http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

// Add XForms decoration rules
DECORATOR.addDecorationRules({
    "namespaceURI" : "http://www.w3.org/2002/xforms",
    "rules" : {
        // model decorations
        "model" : [
        {
            "name" : "model-element",
            "apply" : function(arrBehaviours) {
                return arrBehaviours.concat([EventTarget, Model]);
            }
        }
        ],

        "instance" : [
        {
            "name" : "instance-element",
            "apply" : function(arrBehaviours) {
                return arrBehaviours.concat([EventTarget, Instance]);
            }
        }
        ],

        "submission" : [
        {
            "name" : "submission-element",
            "apply" : function(arrBehaviours) {
                return arrBehaviours.concat([EventTarget, Context, Submission]);
            }
        }
        ],
        
        // end model decorations

        // begin container form control decorations
        "group" : [
        {
            "name" : "group-element",
            "apply" : function(arrBehaviours) {
                return arrBehaviours.concat([EventTarget, Context, Group]);
            }
        }
        ],

        "switch" : [
        {
            "name" : "switch-element",
            "apply" : function(arrBehaviours) {
                return arrBehaviours.concat([EventTarget, Context, Switch]);
            }
        }
        ],

        "case" : [
        {
            "name" : "case-element",
            "apply" : function(arrBehaviours) {
                return arrBehaviours.concat([EventTarget, Context, XFormsCase]);
            }
        }
        ],

        "repeat" : [
        {
            "name" : "repeat-element",
            "apply" : function(arrBehaviours) {
                return arrBehaviours.concat([EventTarget, Context, Repeat]);
            }
        }
        ],
        // end container form control decorations

        // begin core form control decorations
        "submit" : [
        {
            "name" : "submit-element",
            "apply" : function(arrBehaviours) {
                return arrBehaviours.concat([EventTarget, Context, Control, Submit]);
            }
        }
        ],

        "trigger" : [
        {
            "name" : "trigger-element",
            "apply" : function(arrBehaviours) {
                return arrBehaviours.concat([EventTarget, Context, Control]);
            }
        }
        ],

        "input": [
        {
            "name" : "input-element",
            "apply" : function(arrBehaviours) {
                return arrBehaviours.concat([EventTarget, Context, Control]);
            }
        }
        ],

        "output" : [
        {
            "name" : "output-element",
            "apply" : function(arrBehaviours) {
                return arrBehaviours.concat([EventTarget, Context, Control]);
            }
        }
        ],

        "range" : [
        {
            "name" : "range-element",
            "apply" : function(arrBehaviours) {
                return arrBehaviours.concat([EventTarget, Context, Control, FiniteControl]);
            }
        }
        ],

        "textarea" : [
        {
            "name" : "textarea-element",
            "apply" : function(arrBehaviours) {
                return arrBehaviours.concat([EventTarget, Context, Control]);
            }
        }
        ],

        "secret" : [
        {
            "name" : "secret-element",
            "apply" : function(arrBehaviours) {
                return arrBehaviours.concat([EventTarget, Context, Control]);
            }
        }
        ],

        "select" : [
        {
            "name" : "select-element",
            "apply" : function(arrBehaviours) {
                return arrBehaviours.concat([EventTarget, Context, Control, Select]);
            }
        }
        ],

        "select1" : [
        {
            "name" : "select1-element",
            "apply" : function(arrBehaviours) {
                return arrBehaviours.concat([EventTarget, Context, Control, XFormsSelect1, FiniteControl]);
            }
        }
        ],
        
        "mediatype" : [
        {
            "name" : "mediatype-element",
            "apply" : function(arrBehaviours) {
                return arrBehaviours.concat([EventTarget, Context, Control]);
            }
        }
        ],
        // end core form control decorations

        // begin common support decorations
        "label" : [
        {
            "name" : "label-element",
            "apply" : function(arrBehaviours) {
                return arrBehaviours.concat([EventTarget, Context, Control]);
            }
        }
        ],

        "alert" : [
        {
            "name" : "alert-element",
            "apply" : function(arrBehaviours) {
                return arrBehaviours.concat([EventTarget, Context, Control]);
            }
        }
        ],

        "hint" : [
          {
              "name" : "hint",
              "apply" : function(arrBehaviours) {
                  return arrBehaviours.concat([Hint]);
              }
          }
        ],
        // end common support decorations

        // begin common markup for selection controls decorations
        "item" : [
        {
            "name" : "item-element",
            "apply" : function(arrBehaviours) {
                return arrBehaviours.concat([EventTarget, Context, Item]);
            }
        }
        ],

        "itemset" : [
        {
            "name" : "item-element",
            "apply" : function(arrBehaviours) {
                return arrBehaviours.concat([EventTarget, Context, Itemset]);
            }
        }
        ],
        
        "value" : [
        {
            "name" : "value-element",
            "apply" : function(arrBehaviours) {
                return arrBehaviours.concat([EventTarget, Context, Control, Value]);
            }
        }
        ],
        // end common markup for selection controls decorations

        // begin action decorations
        "action" : [
        {
            "name" : "action-element",
            "apply" : function(arrBehaviours) {
                return arrBehaviours.concat([Listener, Context, XFAction]);
            }
        }
        ],

        "message" : [
        {
            "name" : "message-element",
            "apply" : function(arrBehaviours) {
                return arrBehaviours.concat([Listener, EventTarget, Context, Control, Message]);
            }
        }
        ],

        "setindex" : [
        {
            "name" : "setindex-element",
            "apply" : function(arrBehaviours) {
                return arrBehaviours.concat([Listener, Context, SetIndex]);
            }
        }
        ],
        
        "setvalue" : [
        {
            "name" : "setvalue-element",
            "apply" : function(arrBehaviours) {
                return arrBehaviours.concat([Listener, Context, SetValue]);
            }
        }
        ],

        "insert" : [
        {
            "name" : "insert-element",
            "apply" : function(arrBehaviours) {
                return arrBehaviours.concat([Listener, Context, Insert]);
            }
        }
        ],

        "delete" : [
        {
            "name" : "delete-element",
            "apply" : function(arrBehaviours) {
                return arrBehaviours.concat([Listener, Context, Delete]);
            }
        }
        ],

        "send" : [
        {
            "name" : "send-element",
            "apply" : function(arrBehaviours) {
                return arrBehaviours.concat([Listener, Send]);
            }
        }
        ],
        
        "dispatch" : [
        {
            "name" : "dispatch-element",
            "apply" : function(arrBehaviours) {
                return arrBehaviours.concat([Listener, Dispatch]);
            }
        }
        ],

        "toggle" : [
        {
            "name" : "toggle-element",
            "apply" : function(arrBehaviours) {
                return arrBehaviours.concat([Listener, Context, Toggle]);
            }
        }
        ],

        "rebuild" : [
        {
            "name" : "rebuild-element",
            "apply" : function(arrBehaviours) {
                return arrBehaviours.concat([Listener, Rebuild]);
            }
        }
        ],

        "recalculate" : [
        {
            "name" : "recalculate-element",
            "apply" : function(arrBehaviours) {
                return arrBehaviours.concat([Listener, Recalculate]);
            }
        }
        ],

        "revalidate" : [
        {
            "name" : "revalidate-element",
            "apply" : function(arrBehaviours) {
                return arrBehaviours.concat([Listener, Revalidate]);
            }
        }
        ],

        "refresh" : [
        {
            "name" : "refresh-element",
            "apply" : function(arrBehaviours) {
                return arrBehaviours.concat([Listener, Refresh]);
            }
        }
        ],

        "reset" : [
        {
            "name" : "reset-element",
            "apply" : function(arrBehaviours) {
                return arrBehaviours.concat([Listener, Reset]);
            }
        }
        ],
        // end action decorations

        // begin pseudo element value decorations
        "pe-value" : [
        {
            "name" : "value-pevalue",
            "match" : function(element) {
                return NamespaceManager.compareFullName(element.parentNode,"value","http://www.w3.org/2002/xforms");
            },
            "apply" : function(arrBehaviours) {
                return arrBehaviours.concat([EventTarget]);
            }
        },
        {
            "name" : "output-pevalue",
            "match" : function(element) {
                return NamespaceManager.compareFullName(element.parentNode,"output","http://www.w3.org/2002/xforms") ||
                       NamespaceManager.compareFullName(element.parentNode,"label","http://www.w3.org/2002/xforms") ||
                       NamespaceManager.compareFullName(element.parentNode,"alert","http://www.w3.org/2002/xforms") ||
                       NamespaceManager.compareFullName(element.parentNode,"message","http://www.w3.org/2002/xforms") ||
                       NamespaceManager.compareFullName(element.parentNode,"mediatype","http://www.w3.org/2002/xforms");
            },
            "apply" : function(arrBehaviours) {
                return arrBehaviours.concat([EventTarget, XFormsOutputValue]);
            }
        },
        {
            "name" : "input-pevalue",
            "match" : function(element) {
                return NamespaceManager.compareFullName(element.parentNode,"input","http://www.w3.org/2002/xforms") ||
                       NamespaceManager.compareFullName(element.parentNode,"secret","http://www.w3.org/2002/xforms") ||
                       NamespaceManager.compareFullName(element.parentNode,"textarea","http://www.w3.org/2002/xforms");
            },
            "apply" : function(arrBehaviours) {
                return arrBehaviours.concat([EventTarget, XFormsInputValue]);
            }
        },
        {
            "name" : "select-pevalue",
            "match" : function(element) {
                return NamespaceManager.compareFullName(element.parentNode,"select","http://www.w3.org/2002/xforms");
            },
            "apply" : function(arrBehaviours) {
                return arrBehaviours.concat([EventTarget, XFormsSelectValue]);
            }
        },
        {
            "name" : "select1-pevalue",
            "match" : function(element) {
                return NamespaceManager.compareFullName(element.parentNode,"select1","http://www.w3.org/2002/xforms");
            },
            "apply" : function(arrBehaviours) {
                return arrBehaviours.concat([EventTarget, XFormsSelect1Value]);
            }
        },
        {
            "name" : "range-pevalue",
            "match" : function(element) {
                return NamespaceManager.compareFullName(element.parentNode,"range","http://www.w3.org/2002/xforms");
            },
            "apply" : function(arrBehaviours) {
                return arrBehaviours.concat([EventTarget, RangeValue]);
            }
        },
        // custom control pe-values below
        {
            "name" : "inputcalendar-pevalue",
            "match" : function(element) {
                var parent = element.parentNode,
                    datatype = parent.getAttribute("datatype"),
                    appearance = parent.getAttribute("appearance"),
                    xf4hdatatype = XF4HProcessor.getAttribute(parent, "datatype"),
                    prefixes = [],
                    prefix = "",
                    isDate = false,
                    match = false;
                if (NamespaceManager.compareFullName(parent,"input","http://www.w3.org/2002/xforms")) {
                    prefixes = NamespaceManager.getOutputPrefixesFromURI("http://www.w3.org/2002/xforms");
                    prefix = prefixes[prefixes.length-1];
                    isDate = (datatype === "xsd:date" || datatype === (prefix + ":date") || xf4hdatatype === "date");
                    if (isDate && appearance !== "minimal") {
                        match = true;
                    }
                }
                return match;
            },
            "apply" : function(arrBehaviours) {
                UX.replaceArrayElement(arrBehaviours,XFormsInputValue,InputValueCalendar);
                return arrBehaviours;
            }
        },
		{
            "name" : "textarea-richtext-pevalue",
            "match" : function(element) {
                var parent = element.parentNode,
                    datatype = parent.getAttribute("datatype"),
                    mediatype = parent.getAttribute("mediatype"),
                    xf4hmediatype = XF4HProcessor.getAttribute(parent, "mediatype"),
                    prefixes = [],
                    prefix = "",
                    isDate = false,
                    match = false;
                if (NamespaceManager.compareFullName(parent,"textarea","http://www.w3.org/2002/xforms")) {
                    if ((mediatype === "text/html") || (xf4hmediatype === "text/html")){
                        match = true;
                    }
                }
                return match;
            },
            "apply" : function(arrBehaviours) {
                UX.replaceArrayElement(arrBehaviours,XFormsInputValue,TextareaValueRichText);
				return arrBehaviours;
            }
        },
        {
            "name" : "inputcolor-pevalue",
            "match" : function(element) {
                var parent = element.parentNode,
                    datatype = parent.getAttribute("datatype"),
                    appearance = parent.getAttribute("appearance"),
                    match = false;
                if (NamespaceManager.compareFullName(parent,"input","http://www.w3.org/2002/xforms") &&
                    datatype === "xhd:color") {
                        match = true;
                }
                return match;
            },
            "apply" : function(arrBehaviours) {
                UX.replaceArrayElement(arrBehaviours,XFormsInputValue,InputValueColor);
                return arrBehaviours;
            }
        },
        {
            "name" : "rangemap-pevalue",
            "match" : function(element) {
                var parent = element.parentNode,
                    rangeClass = parent.className,
                    match = false;
                if (NamespaceManager.compareFullName(parent,"range","http://www.w3.org/2002/xforms") &&
                    rangeClass && rangeClass.indexOf("geolocation") !== -1) {
                        match = true;
                }
                return match;
            },
            "apply" : function(arrBehaviours) {
                UX.replaceArrayElement(arrBehaviours,RangeValue,RangeValueGMAP);
                return arrBehaviours;
            }
        }
        ],
        // end pseudo element value decorations

        // wildcard decorations (applied irrespective of element name)
        "*" : [
        ]
        // end wildcard decorations
	}
});

UX.replaceArrayElement = function (array,remove,add) {
    var counter;
    for (counter = 0; counter < array.length; counter++) {
        if (array[counter] === remove) {
            array[counter] = add;
            break;
        }
    }
};

//[ISSUE 52] IE6 does not allow CSS attribute selectors. This means those
//  selectors that require attribute selection must conditionally leave
//  those out when the user agent is IE6 and use the mechanism specified in
//  ie6-css-selectors-fixer.js instead.

// UX.selectors below (initial value) must not contain any attribute selectors
UX.selectors = {
    input : {
        color : {
            value : "xf|input.yui-widget-color > pe-value",
            labelvalue : "xf|input.yui-widget-color > xf|label > pe-value"
        },
        date : {
            value : "xf|input.yui-widget-calendar > pe-value",
            labelvalue : "xf|input.yui-widget-calendar > xf|label > pe-value"
        },
        dateminimal : {
            value : "xf|input.minimal-date > pe-value",
            labelvalue : "xf|input.minimal-date > xf|label > pe-value"
        }
    },
     itemset : {
        repeatReady : "xf|itemset.repeat-ready > xf|item"     
    },
    repeat : {
        repeatReady : "xf|repeat.repeat-ready > xf|group"     
    }   
};

// Attribute selectors are added if the user agent supports them
if (!UX.isIE6) {
    UX.selectors.input.color.value += ", xf|input[datatype='xhd:color'] > pe-value";
    UX.selectors.input.color.labelvalue += ", xf|input[datatype='xhd:color'] > xf| label > pe-value";
    UX.selectors.input.date.value += ", xf|input[datatype='xsd:date'] > pe-value, xf|input[datatype='xf:date'] > pe-value";
    UX.selectors.input.date.labelvalue += ", xf|input[datatype='xsd:date'] > xf|label > pe-value, xf|input[datatype='xf:date'] > xf|label > pe-value";
    UX.selectors.input.dateminimal.value += ", xf|input[datatype='xsd:date'][appearance='minimal'] > pe-value, xf|input[datatype='xf:date'][appearance='minimal'] > pe-value";
    UX.selectors.input.dateminimal.labelvalue += ", xf|input[datatype='xsd:date'][appearance='minimal'] > xf|label > pe-value, xf|input[datatype='xf:date'][appearance='minimal'] > xf|label > pe-value";
    UX.selectors.repeat.repeatReady += ", xf|repeat[class~='repeat-ready'] > xf|group";
    UX.selectors.itemset.repeatReady += ", xf|itemset[class~='repeat-ready'] > xf|item";
}
// else, we delegate selection to ie6-css-selectors-fixer.js

//[ISSUE 8] IE does not natively support child selectors, but will ignore ">"
//	if found in css, making a selector such as "x > y", behave as a descendent
//	selector "x y".  This means that the order of occurrence of some of these
//	definitions is critical.  Specifically, the "common child" elements *must*
//	come after any controls that might use them, as (at present, anyway) label
//	is implemented as a control.

NamespaceManager.addSelectionNamespace("xf","http://www.w3.org/2002/xforms");	

DECORATOR.setupDecorator(
	[

    /* Model */

		{
			selector:"xf|instance",
			objects:[]
		},

		{
			selector:"xf|model",
			objects:[]
		},


		{
			selector:"xf|submission",
			objects:[]
		},
        
    /* Container Controls */
        {
            selector:"xf|repeat",
            objects:[]
        },

        {
            selector:"xf|group",
            objects:[]
        },

        {
            selector:"xf|switch",
            objects:[]
        },

        {
            selector:"xf|case",
            objects:[]
        },

    /* Controls */
        {
			selector:"xf|submit",
			objects:[]
		},

        {
			selector:"xf|trigger",
			objects:[]
		},
		
		{
			selector:"xf|output >  pe-value",
			objects:[]
		},
/*
		{
			selector:"pe-value",
			objects:[EventTarget]
		},
    */
		{
			selector:"xf|input",
			objects:[]
		},

		{
			selector:"xf|range",
			objects:[]
		},

    	{
			selector:"xf|output",
			objects:[]
		},

		{
			selector:"xf|textarea",
			objects:[]
		},
		
		{
			selector:"xf|secret",
			objects:[]
		},
		{
			selector:"xf|label",
			objects:[]
		},
		{
			selector:"xf|alert",
			objects:[]
		},
		{
			selector:"xf|value",
			objects:[]
		},

		{
			selector:"xf|input > pe-value",
			objects:[]
		},
		{
			selector:"xf|secret  > pe-value",
			objects:[]
		},
		{
			selector:"xf|textarea  > pe-value",
			objects:[]
		},
	
		{
			selector:"xf|select > pe-value",
			objects:[]
		},
		{
			selector:"xf|select1 >  pe-value ",
			objects:[]
		},
		{
			selector:"xf|range > pe-value",
			objects:[]
		},
		{
			selector:" xf|alert > pe-value",
			objects:[]
		},
		{
			selector:" xf|message > pe-value",
			objects:[]
		},

		{
			selector:"xf|label",
			objects:[]
		},
		{
            selector:"xf|mediatype",
            objects:[]
        },
        
		{
			selector:"xf|value > pe-value",
			objects:[]
		},
		{
			selector:"xf|item",
			objects:[]
		},
		{
			selector:"xf|itemset",
			objects:[]
		},
		{
			selector:"xf|range.geolocation > pe-value",
			objects:[]
		},
		//HACK: re-override the value binding for rangemap/label, because IE does not support child selectors.
		{
			selector:"xf|range.geolocation > xf|label > pe-value",
			objects:[]
		},

        // YUI ColorPicker as <xf:input>
        {
            selector: UX.selectors.input.color.value,
            objects:[]
        },
        //HACK: IE does not support child selectors.
        {
            selector: UX.selectors.input.color.labelvalue,
            objects:[]
        },

		// YUI Calendar as <xf:input>
		{
			selector: UX.selectors.input.date.value,
			objects:[]
		},
		//HACK: IE does not support child selectors.
		{
			selector: UX.selectors.input.date.labelvalue,
			objects:[]
		},
		// Calendar with "minimal" appearance resorts to regular xf:input appearance
		{
			selector: UX.selectors.input.dateminimal.value,
			objects:[]
		},
		//HACK: IE does not support child selectors.
		{
			selector: UX.selectors.input.dateminimal.labelvalue,
			objects:[]
		},

		{
			selector:"xf|select",
			objects:[]
		},				
		
		{
			selector:"xf|select1",
			objects:[]
		},

    /* Actions */

		{
			selector:"xf|action",
			objects:[]
		},

		{
    		selector:"xf|hint",
    		objects:[]
		},

		{
    		selector:"xf|message",
    		objects:[]
		},

		{
			selector:"xf|setindex",
			objects:[]
		},
		
		{
			selector:"xf|setvalue",
			objects:[]
		},

        {
            selector:"xf|insert",
            objects:[]
        },

        {
            selector:"xf|delete",
            objects:[]
        },

		{
			selector:"xf|send",
			objects:[]
		},
		
		{
			selector:"xf|dispatch",
			objects:[]
		},

		{
			selector:"xf|toggle",
			objects:[]
		},

		{
			selector:"xf|rebuild",
			objects:[]
		},
		{
			selector:"xf|recalculate",
			objects:[]
		},
		{
			selector:"xf|revalidate",
			objects:[]
		},
		{
			selector:"xf|refresh",
			objects:[]
		},
		{
			selector:"xf|reset",
			objects:[]
		},
	//Common child elements
		{
			selector:"xf|label >  pe-value",
			objects:[],
			important:true
		},       
        {
            selector:"xf|mediatype >  pe-value",
            objects:[]
        },       
        {
            selector:"xf|select1 > xf|item, xf|select1 > xf|itemset",
            cssText:"-moz-binding:url();"
        },        
        {
            selector:"xf|select1 > xf|item *, xf|select1 > xf|itemset *",
            cssText:"-moz-binding:url();"
        },
        
    //Switch off bindings within repeat, during load-time (FF )
        {
            selector:"xf|repeat > *,  xf|itemset > *",
            cssText:"-moz-binding:url();"
        },
        {
            selector: UX.selectors.itemset.repeatReady,
            objects:[]
        }, 
        
    //Switch bindings repeat back on within repeat.  (FF )
        {
            selector: UX.selectors.repeat.repeatReady,
            objects:[]
        }, 
            
	//Switch off bindings within repeat,itemset during load-time (IE )
		{
			selector:"xf|repeat *, xf|itemset *", 
			cssText:"-binding-ignore:true;"
		},
        
   	//Switch bindings repeat back on within repeat.  (IE )
         {
            selector:"xf|repeat.repeat-ready *",
            cssText:"-binding-ignore:false;"
        },
    //Switch bindings itemset back on within itemset.  (IE )        
        {
            selector:"xf|itemset.repeat-ready *",
            cssText:"-binding-ignore:false;"
        }
	],
	"http://www.w3.org/2002/xforms"); //to tell the decorator so that it doesn't need to write these definitions again

