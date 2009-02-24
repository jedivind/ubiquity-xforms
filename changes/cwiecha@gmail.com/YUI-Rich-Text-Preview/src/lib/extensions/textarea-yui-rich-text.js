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

UX.richtextcount = 0;

function TextareaValueRichText (elmnt) {
    this.element = elmnt;
    this.currValue = "";
	this.m_bRenderDone = false;
    this.m_sInputId = '';
}

function richTextValueChanged(pThis, sNewValue) {
    var oEvt = pThis.element.ownerDocument.createEvent("MutationEvents");
    if(oEvt.initMutationEvent === undefined) {
        oEvt.initMutationEvent = oEvt.initEvent;
    }
        
    oEvt.initMutationEvent("control-value-changed", true, true,
        null, pThis.currValue, sNewValue, null, null);

    spawn(function() {
            FormsProcessor.dispatchEvent(pThis.element, oEvt);
    });
}

TextareaValueRichText.prototype.onDocumentReady = function() {
    if (this.element.ownerDocument.media != "print") {
        var pThis = this; 
        this.m_sInputId = "ux-richtext-input-" + UX.richtextcount;
		// hardcoded CSS in simpleeditor causes line break...wrap in display:inline-block to avoid this
        this.element.innerHTML = "<div style='display:inline-block'><textarea id='" + this.m_sInputId + "'></textarea></div>";

        this.m_value = new YAHOO.widget.SimpleEditor(this.m_sInputId, { 
			height: '50px', 
			width: '200px', 
			dompath: false, //Turns off the bar at the bottom 
			animate: false  //Turns off animation for the opening, closing and moving of Editor windows 
		});              
		this.m_value.on('editorContentLoaded', function(ev) { // rendering is not synchronous...wait for editor to be available 
				pThis.m_bRenderDone = true;
				var iFrameWindow = pThis.m_value._getWindow(); // YUI events for editor focus and blur seem broken in UX, use window events
				iFrameWindow.addEventListener( "blur", function() {
						var newValue = pThis.m_value.getEditorHTML();
						richTextValueChanged( pThis, newValue );	
					}, false );
				pThis.m_value.setEditorHTML(pThis.currValue); // set initial value once editor iframe has been built
			});
		
		this.m_value.render();
        
		UX.richtextcount++;
    }
};

TextareaValueRichText.prototype.setValue = function(sValue) {
	this.currValue = sValue;
	if (this.m_bRenderDone) {  // first one comes too early...wait for editor to be ready
		this.m_value.setEditorHTML( sValue );
	}
};
