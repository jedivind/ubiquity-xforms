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

UX.yuicalendarcount = 0;

function YUICalendarValue    (elmnt)
{
    this.element = elmnt;
    this.currValue = "";
    this.m_bFirstSetValue = true;
}


function yuiCalendarValueChanged(pThis, sNewValue)
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

YUICalendarValue.prototype.currentCalendarValue = function()
{
    var date = this.m_value.getSelectedDates()[0];
    var yr = date.getYear();
    yr = (yr > 1900) ? yr : (1900 + yr); // TODO, Calendar may return year modulo 1900 to begin with
    var mn = date.getMonth() + 1;
    var da = date.getDate();
    currValue = (mn < 10 ? '0' + mn : mn) + '/' + (da < 10 ? '0' + da : da) + '/' + yr;
    return currValue;
}

YUICalendarValue.prototype.onDocumentReady = function()
{
    if (this.element.ownerDocument.media != "print")
    {
        this.element.innerHTML = "<div id='ux-calendar-bg" + UX.yuicalendarcount + "' class='ux-calendar-bg'></div>";
        this.m_value = new YAHOO.widget.Calendar("ux-calendar-" + UX.yuicalendarcount, "ux-calendar-bg" + UX.yuicalendarcount);
        UX.yuicalendarcount++;
        
        var pThis = this;
        this.m_value.selectEvent.subscribe(
            function() {
                yuiCalendarValueChanged(pThis, pThis.currentCalendarValue());
            }
         );

         this.m_value.render();
    }
};

YUICalendarValue.prototype.setValue = function(sValue)
{
    var bRet = false;

    if (this.currValue != sValue || m_bFirstSetValue)
    {
        this.m_value.setYear(sValue.substring(6,10));
        this.m_value.setMonth(sValue.substring(0,2) - 1);
        this.m_value.select(sValue);
        this.m_value.render();
        this.currValue = sValue;
        bRet = true;
        if (m_bFirstSetValue) {
            m_bFirstSetValue = false;
        }
    }

    return bRet;
    
};

