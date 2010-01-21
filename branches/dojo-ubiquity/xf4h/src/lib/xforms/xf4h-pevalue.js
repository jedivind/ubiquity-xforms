function XF4HInputValue(elmnt) {    
    this.element = elmnt;
    this.currValue = "";
    this.m_bFirstSetValue = true;
    this._init();    
};


XF4HInputValue.prototype.valueChangeCB = function(oEvent) {
    /*
     * [ISSUE] Not really suitable to use mutation events.
     */
    var oElement = this.element;
    var oMutateEvent = oElement.ownerDocument.createEvent("MutationEvents");
    var newValue = null;
    
    if (UX.isIE) {
        newValue = oEvent.srcElement.value;
    } else {
        newValue = oEvent.target.value;
    }
    
    // console.log(newValue +", " + this.currValue);
    oMutateEvent.initMutationEvent("target-value-changed", true, true,
            null, this.currValue, newValue, null, null);
    spawn(function(){FormsProcessor.dispatchEvent(oElement,oMutateEvent);});

    /*
     * Cancel bubbling but don't cancel the event itself
     * otherwise we never get the value actually changed.
     */

    oEvent.cancelBubble = true;
};

XF4HInputValue.prototype._init = function() {
    var oElement = this.element;
    var oControl = this;
    
    if (document.all) {
        oElement.attachEvent("onchange", function(e) {
            oControl.valueChangeCB(e);
        });
    } else {
        oElement.addEventListener("change", function(e) {
            oControl.valueChangeCB(e);
        }, false);
    }
};

XF4HInputValue.prototype.setValue = function(sValue) {
    var oElement = this.element;    
    var bRet = false;
    // console.log("input element " + oElement.getAttribute("name") +" has value " + sValue);
    
    if (oElement.value !== sValue) {
        oElement.value = sValue;
        this.currValue = sValue;
        bRet = true;
    } else if (this.m_bFirstSetValue) {
        this.m_bFirstSetValue = false;        
        bRet = true;
    }
    
    return bRet
};

function XF4HOutputValue(elmnt) {
    this.element = elmnt;
};

XF4HOutputValue.prototype.setValue = function(sValue) {
    if (UX.isIE) {
        this.element.innerText = sValue;
    } else {
        this.element.textContent = sValue;
    }
}

XF4HOutputValue.prototype.getValue = function() {
    if (UX.isIE) {
        return this.element.innerText;
    } else {
        return this.element.textContent;
    }
}