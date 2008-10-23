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
if (!UX.formsa) {

UX.formsa = {
    bInitialized: false,
    init : function() {
        if (this.bInitialized) {
            return;
        }
        
        console.log("==============formsA-def=================");
        if (UX.isFF || UX.isOpera ) {
            var models = NamespaceManager.getElementsByTagNameNS(document,
                    "http://www.w3.org/2002/xforms", "model");
            
            if (!models || models.length === 0) {
                console.log("create default");
                var modelNode = UX.createElementNS(null, "model", "http://www.w3.org/2002/xforms");
                modelNode.setAttribute("id", "_fa_gen_default_model");
                document.body.appendChild(modelNode);
                document.defaultModel = modelNode;
            }
        }
    }
};

}

if (!UX.formsa.html) {
UX.formsa.html = {};    
}

UX.formsa.html.rules = {
    "namespaceURI" : "http://www.w3.org/1999/xhtml",
    "rules" : {
        "form" : [
        {
            name: "fa-form-element",
            apply: function(arrBehaviours) {
                return arrBehaviours;
            }
        }          
        ],
                  
        "fieldset" : [
        {
            "name" : "fa-fieldset-element",
            "apply" : function(arrBehaviours) {
                UX.formsa.init();
                return arrBehaviours.concat(["EventTarget", "Context", "Group"]);
            }
        }
        ],
                  
        "input" : [
        {
            "name" : "fa-input-element",
            "apply" : function(arrBehaviours) {                
                UX.formsa.init();
                return arrBehaviours.concat(["EventTarget", "Context", "Control"]);
            }
        }
        ],
                  
       "output" : [
       {
           "name" : "fa-output-element",
           "apply" : function(arrBehaviours) {
               UX.formsa.init();
               return arrBehaviours.concat(["EventTarget", "Context", "Control"]);
           }
       }
       ]
   }
};


UX.formsa.html.decorators = [
    {
        selector:"form[fa|name]",
        objects:[]
    },
    {
        selector:"fieldset[fa|name]",
        objects:[]
    },
    {
        selector:"input[fa|name]",
        objects:[]
    },
    {
        selector:"output",
        objects:[]
    }
];