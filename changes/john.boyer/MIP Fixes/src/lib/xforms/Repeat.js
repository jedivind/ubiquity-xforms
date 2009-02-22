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
/*global DECORATOR, NamespaceManager, UX, document, window, getModelFor*/

function Repeat(elmnt) {
  this.element = elmnt;
  var sStartIndex;
  if (this.element) {
    this.element.iterationTagName = "group";

    sStartIndex = elmnt.getAttribute("startindex");
    
    this.m_nIndex = (sStartIndex === null || isNaN(sStartIndex))?1:this.m_nIndex = Number(sStartIndex);
  }
  
  this.m_CurrentIterationCount = 0;
  this.m_offset = 0;
  this.m_iterationNodesetLength = 0;
}    
    
Repeat.prototype.onDocumentReady = function () {
  this.storeTemplate();
  this.addcontroltomodel();
  this.element.addEventListener(
    "DOMActivate",
    {
      control: this,
      handleEvent: function (evt) {
        this.control.Activate(evt.target);
      }
    },
    true
  );
};

Repeat.prototype.Activate  = function (o) {
  var coll = this.element.childNodes,
  len = coll.length,
  i;
  for (i = 0; i < len; ++i) {
    if (coll[i].contains(o)) {
      this.m_nIndex = i + 1;
      break;
    }
  }
};

Repeat.prototype.storeTemplate = function () {
  this.sTemplate = this.element.cloneNode(true);
  while (this.element.childNodes.length) {
    this.element.removeChild(this.element.firstChild); 
  }
  UX.addClassName(this.element, "repeat-ready");
};

//register this element with the model
//
Repeat.prototype.addcontroltomodel = function ()	{
  if (!this.m_bAddedToModel) {
    var oModel = getModelFor(this);
    if (oModel) {
      oModel.addControl(this);
    } else {
      debugger;
    }
  } else { /* shouldn't be called twice */
    debugger;
  }    
};

Repeat.prototype.refresh = function () {

};

Repeat.prototype.getRequestedIterationCount = function () {
  //Alter the number of iterations, if appropriate
  var sNumber = this.getAttribute("number"),
  desiredIterationCount = 0;
  
  if (sNumber === null || isNaN(sNumber)) {
      //without a number attribute, vary the repeat with the size of the nodeset.
    desiredIterationCount = this.m_iterationNodesetLength;
  } else {
    desiredIterationCount =  Number(sNumber);
  }
  return desiredIterationCount;
};

Repeat.prototype.putIterations = function (desiredIterationCount) {

  var formerOffset, i, currentOrdinal, sDefaultPrefix, iterations, oIterationElement, templateClone;
  if (desiredIterationCount < this.m_CurrentIterationCount) {
    //Trim any superfluous iterations if desired.
    while (this.element.childNodes.length > desiredIterationCount) {
      this.element.removeChild(this.element.lastChild);
    }
    this.m_CurrentIterationCount = this.element.childNodes.length;
  }
  //hold the current offset, to determine whether it is necessary to change
  //  the ordinals of the various iterations.
  formerOffset = this.m_offset;
  
  //Fix the viewport so that the desired index will be visible.
  if (this.m_nIndex < this.m_offset) {
    //If offset is later than index, move the viewport such that index is the last visible iteration
    this.m_offset = 1 + this.m_nIndex - desiredIterationCount;
  } else if (this.m_nIndex > (desiredIterationCount + this.m_offset)) {
    //If there are fewer iterations than would allow the current index to be visible
    //Set the offset and index to match.
    this.m_offset = this.m_nIndex - 1;
  }
  
  //Offset has changed, iterate through extant iterations, altering their ordinals accordingly.
  if (formerOffset !== this.m_offset) {
    iterations = this.element.childNodes;
    
    for (i = 0; i < this.m_CurrentIterationCount; ++i) {
      currentOrdinal = i + this.m_offset;
      if (iterations[i]) {
        iterations[i].setAttribute("ordinal", currentOrdinal);
      } 
    }
  }
  
  sDefaultPrefix = NamespaceManager.getOutputPrefixesFromURI("http://www.w3.org/2002/xforms")[0] + ":";
  while (desiredIterationCount > this.m_CurrentIterationCount) {
    //In the absence of an iteration corresponding to this index, insert one.
    oIterationElement = (UX.isXHTML) ? 
      document.createElementNS("http://www.w3.org/2002/xforms", sDefaultPrefix + this.element.iterationTagName) :
      document.createElement(sDefaultPrefix + this.element.iterationTagName);
    oIterationElement.setAttribute("ref", ".");
    oIterationElement.setAttribute("ordinal", this.m_offset + this.m_CurrentIterationCount + 1);
    UX.addClassName(oIterationElement, "repeat-iteration");
    
    templateClone = this.element.sTemplate.cloneNode(true);

    //Move each child of templateClone to oIterationElement, maintaining order.
    while (templateClone.hasChildNodes()) {
      oIterationElement.appendChild(templateClone.firstChild);
    }
    this.element.appendChild(oIterationElement);
    window.status = "";
    //set the status bar, to fix the progress bar.
    //See: http://support.microsoft.com/default.aspx?scid=kb;en-us;Q320731 
    
    this.m_CurrentIterationCount++;
  }
  
  
};


/**
  function: normaliseIndex
  returns: The result of constraining val within the range of 1 to the length of the iteration nodeset.
*/

Repeat.prototype.normaliseIndex = function (val) {
  return Math.max(Math.min(val,this.m_iterationNodesetLength),1);
};

Repeat.prototype.rewire = function () {
  var arrNodes = null,
      sExpr,
      sBind = this.element.getAttribute("bind"),
      oBind,
      oContext,
      r;
  
  if (sBind) {
    oBind = document.getElementById(sBind);

    if (!oBind || !NamespaceManager.compareFullName(oBind, "bind", "http://www.w3.org/2002/xforms")) {
      //bind not found with this ID
      UX.dispatchEvent(this.element, "xforms-binding-exception", false, true, true);
    } else {
      arrNodes = oBind.boundNodeSet;
      this.m_model = oBind.ownerModel;
    }
  } else {
    sExpr = this.element.getAttribute("nodeset");
    
    if (sExpr) {
      document.logger.log("Rewiring: " + this.element.tagName + ":" + this.element.uniqueID + ":" + sExpr, "info");
      
      oContext = this.element.getEvaluationContext();
      this.m_model = oContext.model;
      r = this.m_model.EvaluateXPath(sExpr, oContext);
      
      arrNodes = r.value;
    } else {
      document.logger.log("Element: " + this.element.tagName + ":" + this.element.uniqueID + " lacks binding attributes.", "warn");
    }
  }
  
  if (arrNodes) {
    this.m_iterationNodesetLength = arrNodes.length;
    this.m_nIndex = this.normaliseIndex(this.m_nIndex);
    this.putIterations(this.getRequestedIterationCount());

    if (!UX.hasDecorationSupport) {
      DECORATOR.applyDecorationRules(this.element);
    }
  }

  return false;
};


Repeat.prototype.getIndex = function () {
  return this.m_nIndex;
};

Repeat.prototype.setIndex = function (newIndex) {
  var ix = this.normaliseIndex(newIndex)
  if (ix !== this.m_nIndex) {
    this.m_nIndex = ix;
    if (this.m_nIndex > newIndex) {
      UX.dispatchEvent(this.element, "xforms-scroll-first", true, false, true);
    } else if (this.m_nIndex < newIndex){
      UX.dispatchEvent(this.element, "xforms-scroll-last", true, false, true);
    }
    this.m_context.model.flagRebuild();
  }
};
