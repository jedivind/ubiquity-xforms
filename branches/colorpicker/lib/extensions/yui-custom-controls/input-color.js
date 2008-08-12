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

UX.yuicolorcount = 0;

function YUIColorValue    (elmnt)
{
    this.element = elmnt;
    this.currValue = "";
    this.m_bFirstSetValue = true;
}


function yuiColorValueChanged(pThis, sNewValue)
{
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

YUIColorValue.prototype.onDocumentReady = function()
{
    if (this.element.ownerDocument.media != "print")
    {
        this.element.innerHTML = "<div id='ux-color-bg" + UX.yuicolorcount + "' class='ux-color-bg'></div>";
        this.m_value = new YAHOO.widget.ColorPicker("ux-color-bg" + UX.yuicolorcount, {
            images: {
                PICKER_THUMB : "http://yui.yahooapis.com/2.5.2/build/colorpicker/assets/picker_thumb.png",
                HUE_THUMB : "http://yui.yahooapis.com/2.5.2/build/colorpicker/assets/hue_thumb.png"
            }
        });
        UX.yuicolorcount++;
        
        var pThis = this;
        this.m_value.on("rgbChange",
            function(o) {
                yuiColorValueChanged(pThis, pThis.m_value.get("hex"));
            }
         );

    }
};

YUIColorValue.prototype.setValue = function(sValue)
{
    var bRet = false;

    if (this.currValue != sValue || m_bFirstSetValue)
    {
        var rgb = YAHOO.util.Color.hex2rgb(sValue);
        this.m_value.setValue(rgb, true);
        this.currValue = sValue;
        bRet = true;
        if (m_bFirstSetValue) {
            m_bFirstSetValue = false;
        }
    }

    return bRet;
    
};

