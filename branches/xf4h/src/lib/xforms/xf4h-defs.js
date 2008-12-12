/*
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

if (!UX.formsA) {
UX.formsA = {};
}

if (!UX.formsA.html) {
UX.formsA.html = {};    
}

UX.formsA.html.rules = {
    "namespaceURI" : "http://www.w3.org/1999/xhtml",
    "rules" : {
        "form" : [
        {
            name: "fa-form-element",
            apply: function(arrBehaviours) {
                return arrBehaviours.concat([Form]);
            }
        }          
        ],
                  
        "fieldset" : [
        {
            "name" : "fa-fieldset-element",
            "apply" : function(arrBehaviours) {
                return arrBehaviours.concat([EventTarget, Context, Group]);
            }
        }
        ],
                  
        "input" : [
        {
            "name" : "fa-input-element",
            "match" : function(element) {
                var sName = element.getAttribute("name");
                if (sName) {  
                    return true; 
                }
                return false;
            },
            "apply" : function(arrBehaviours) {
                return arrBehaviours.concat([EventTarget, Context, Control]);
            }
        },       
        {
            "name" : "fa-input-submit-element",
            "match" : function(element) {
                var sType = element.getAttribute("type"); 
                if (sType === "submit") {
                    return true;
                }
                return false;
            },
            "apply" : function(arrBehaviours) {
                return arrBehaviours.concat([EventTarget, Context, Control, Submit]);                
            }
        }      
        ],
                  
       "output" : [
       {
           "name" : "fa-output-element",
           "apply" : function(arrBehaviours) {
               return arrBehaviours.concat([EventTarget, Context, Control]);
           }
       }
       ],
       
       "span" : [
       {
           "name" : "fa-span-element",
           "apply" : function(arrBehaviours) {
               return arrBehaviours.concat([EventTarget, Context, Control]);
           }
       }
       ]
   }
};


UX.formsA.html.decorators = [
    {
        selector :"form[name]",
        objects : []
    }, 
    {
        selector :"fieldset[name]",
        objects : []
    }, 
    {
        selector :"input[name]",
        objects : []
    }, 
    {
        selector :"input[type='submit']",
        objects : []
    },     
    {
        selector :"output[name]",
        objects : []
    }, 
    {
        selector :"span[name]",
        objects : []
    }
];