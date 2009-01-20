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

/*
 * The Hint object provides ephemeral message support, by allowing an
 * object to be activated and deactivated.
 *
 * Accompanying CSS classes are in hint.css.
 */

function Hint( el ) {
  // The context for our hint is the parent element.
  //
  var context = el.parentNode;

  // Hide the hint.
  //
  document.notify.ephemeral(el, false);

  // It's difficult to see how we might not find a context, but it doesn't
  // hurt to check.
  //
  if ( !context ) {
    throw "No context found for hint";
  }

  // Register for the events that enable and disable hint.
  //
  context.addEventListener("xforms-hint", this, false);
  context.addEventListener("xforms-hint-off", this, false);

  // The positioning of the hint is relative to its container so
  // indicate that it's a hint container, so that the CSS styles
  // in hint.css can kick in.
  //
  UX.addClassName(context, "xf-hint-container");

  // Save a pointer to the element.
  //
  this.element = el;
  this.m_proxy = null;
  this.defaultText = null;
  this.addedToModel = false;
};

Hint.prototype.handleEvent = function( evt ) {
  if ( evt.type === "xforms-hint" ) {
    document.notify.ephemeral( this.element );
  } else if ( evt.type === "xforms-hint-off" ) {
    document.notify.ephemeral(this.element, false);
  }
  return;
};

Hint.prototype.rewire = function() {
    var oPN  = null;
    var ctxBoundNode = null;
        
    if (this.m_proxy) {
       this.m_proxy = null;
    }

    ctxBoundNode = this.getBoundNode(1);
            
    // [ISSUE] In theory even if the model attribute had changed
    // by now, this would still work. This means that the
    // addControl*() methods could perhaps be some kind of global thing.    
    if (ctxBoundNode.node) {
        oPN = getProxyNode(ctxBoundNode.node);
        
        // Make sure our control knows where its associated proxy is.
        if (oPN) {
           this.m_proxy = oPN;            
        }
        return true;
    }    
    return false;
};

Hint.prototype.documentReady = function() {
    var oModel = null;    
    var childNodes = this.element.childNodes;
    this.defaultText = UX.isIE ? 
            this.element.innerText : this.element.textContent;
    
    if (!this.addedToModel) {        
        oModel = getModelFor(this);
        
        if (oModel) {
            oModel.addControl(this);
        } else {
            throw("Could not resolve model for group.");
        }
    } else { /* shouldn't be called twice */
        throw("Second attempt to add group to model as a control.");
    }
};

Hint.prototype.refresh = function() {
    var oProxy = this.element.m_proxy;

    if (oProxy) {
        // [ISSUE] Sometimes a context is being stored when it should be a
        // proxy...don't know how though!

        if (oProxy["node"]) {
            oProxy = oProxy["node"];

            // Now fix it so that we don't get this again. This is obviously a
            // hack since we shouldn't have had this problem in the first place!
            this.element.m_proxy = oProxy;
        }
        this.setInlineText(oProxy.getValue());
    }
    return;
};

Hint.prototype.setInlineText = function(sInlineText) {
    var sText = sInlineText ? sInlineText : this.defaultText;
    
    if (UX.isIE) {
        this.element.innerText = sText;
    } else {
        this.element.textContent = sText;
    }
};

Hint.prototype.onDocumentReady = Hint.prototype.documentReady;