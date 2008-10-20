// Ubiquity provides a standards-based suite of browser enhancements for
// building a new generation of internet-related applications.
//
// The Ubiquity XForms module adds XForms support to the Ubiquity library.
//
// Copyright (C) 2008 Backplane Ltd.
//
// Licensed under the Apache License, Version 2.0 (the "License");
// you may not use this file except in compliance with the License.
// You may obtain a copy of the License at
//
//  http://www.apache.org/licenses/LICENSE-2.0
//
// Unless required by applicable law or agreed to in writing, software
// distributed under the License is distributed on an "AS IS" BASIS,
// WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
// See the License for the specific language governing permissions and
// limitations under the License.

document.notify = document.notify || { };

// To enable and disable notifications we simply add and remove CSS
// classes.
//
document.notify.activate = function( el ) {
    UX.replaceClassName(el, "inactive", "active");
    return;
};

document.notify.deactivate = function( el ) {
    UX.replaceClassName(el, "active", "inactive");
    return;
};

// An ephemeral message is one that will be removed automatically.
//
document.notify.ephemeral = function(message, activate) {
    if (activate === undefined || activate) {
        document.notify.activate( message );
        
        setTimeout(
            function() {
                document.notify.deactivate( message );
                return;
            },
            10000
        );
    } else {
        document.notify.deactivate( message );
    }
    return;
}

// A SimpleDialog message is one that shows up in a dialog window
// and goes away when click on the OK button.
//
document.notify.SimpleDialog = function(pThis, activate) {
    // Ideally we'd register on the close event and delete the panel
    // at that point, but I can't get it working. :)
    
    if (pThis.yahooPanel) {
        pThis.yahooPanel.destroy();
        pThis.yahooPanel = null;
    }
    
    pThis.yahooPanel = new YAHOO.widget.SimpleDialog(
        "dialog-window",
        {
            icon: YAHOO.widget.SimpleDialog.ICON_WARN, 
            fixedcenter: true,
            constraintoviewport: false,
            modal: activate,
            visible: false,
            width: getStyle(pThis.element, "width", "300px"),
            height: getStyle(pThis.element, "height", "150px")
        }
    );
    
    var handleOK = function() {
        this.hide(); 
    };
    var myButtons = [ { text:"OK", handler:handleOK } ];
    pThis.yahooPanel.cfg.queueProperty("buttons", myButtons);
    
    pThis.yahooPanel.setHeader("[XForms]");
    if (UX.isIE) {
        pThis.yahooPanel.setBody(pThis.element.innerHTML);
    } else {
        pThis.yahooPanel.setBody(pThis.element.textContent);
    }
    pThis.yahooPanel.render(document.body);
    
    pThis.yahooPanel.show();
    return;
}

function getStyle(elmnt, property_name, default_property)
{
    var propertySTR = "";
    // The property_name could be at the beginning of the styleSTR or in the middle.
    var propertyREG = new RegExp("^" + property_name + ":[^;]*|;" + property_name + ":[^;]*");
    var styleSTR = elmnt.getAttribute("style");
    
    if (!styleSTR) {
        return default_property;
    }
    // These two if statements are for IE to work correctly.
    if (elmnt.style && styleSTR[property_name]) {
        return styleSTR[property_name];
    }
    if (typeof styleSTR !== 'string') {
        return default_property;
    }
    styleSTR = styleSTR.replace(/\s/g, "");
    
    // If property_name is found in the styleSTR, then get the property_name and its value, and only return its value.
    if (styleSTR.match(propertyREG)) {
        propertySTR = styleSTR.match(propertyREG)[0];
        propertySTR = propertySTR.replace(";", "");
        return propertySTR.replace(property_name + ":", "");
    }
    // If property_name is not found in the styleSTR, then return the default property;
    return default_property;
}
