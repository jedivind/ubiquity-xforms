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
if (!UX.webformsa) {

UX.webformsa = {
    bInitialized: false,
    init : function() {
        if (this.bInitialized) {
            return;
        }
        
        console.log("==============webforms-def=================");
        if (UX.isFF || UX.isOpera ) {
            var models = NamespaceManager.getElementsByTagNameNS(document,
                    "http://www.w3.org/2002/xforms", "model");
            
            if (!models || models.length === 0) {
                console.log("create default");
                var modelNode = UX.createElementNS(null, "model", "http://www.w3.org/2002/xforms");
                modelNode.setAttribute("id", "_wfa_gen_default_model");
                document.body.appendChild(modelNode);
                document.defaultModel = modelNode;
            }
        }
    }
};

}

if (!UX.webformsa.html) {
UX.webformsa.html = {};    
}

UX.webformsa.html.rules = {
    "namespaceURI" : "http://www.w3.org/1999/xhtml",
    "rules" : {
        "form" : [
        {
            name: "wfa-form-element",
            apply: function(arrBehaviours) {
                return arrBehaviours;
            }
        }          
        ],
                  
        "fieldset" : [
        {
            "name" : "wfa-fieldset-element",
            "apply" : function(arrBehaviours) {
                UX.webformsa.init();
                return arrBehaviours.concat(["EventTarget", "Context", "Group"]);
            }
        }
        ],
                  
        "input" : [
        {
            "name" : "wfa-input-element",
            "apply" : function(arrBehaviours) {                
                UX.webformsa.init();
                return arrBehaviours.concat(["EventTarget", "Context", "Control"]);
            }
        }
        ],
                  
       "output" : [
       {
           "name" : "wfa-output-element",
           "apply" : function(arrBehaviours) {
               UX.webformsa.init();
               return arrBehaviours.concat(["EventTarget", "Context", "Control"]);
           }
       }
       ]
   }
};


UX.webformsa.html.decorators = [
    {
        selector:"form[wfa|name]",
        objects:[]
    },
    {
        selector:"fieldset[wfa|name]",
        objects:[]
    },
    {
        selector:"input[wfa|name]",
        objects:[]
    },
    {
        selector:"output",
        objects:[]
    }
];