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
    this.m_bPopup = false;
    this.m_sInputId = '';
}


function yuiCalendarValueChanged(pThis, sNewValue)
{
    var oEvt = pThis.element.ownerDocument.createEvent("MutationEvents");
    if(oEvt.initMutationEvent === undefined) {
        oEvt.initMutationEvent = oEvt.initEvent;
    }
        
    oEvt.initMutationEvent("control-value-changed", true, true,
        null, pThis.currValue, sNewValue, null, null);

    if (pThis.m_bPopup) {
        YAHOO.util.Dom.get(pThis.m_sInputId).value = sNewValue;
    }
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
        var pThis = this;

        if (this.element.parentNode.getAttribute("appearance") === 'yui:popup-calendar') { // popup

            this.m_bPopup = true;
            this.m_sInputId = "ux-calendar-input-" + UX.yuicalendarcount;
            this.element.innerHTML = "<div id='ux-calendar-bg" + UX.yuicalendarcount + "' class='ux-calendar-bg'>" +
                "<input type='text' disabled='true' size='12' style='background:#ffffff;color:#000000;vertical-align:top' id='" +
                this.m_sInputId + "'></input></div>";

            var calendarMenu = new YAHOO.widget.Overlay("calendarmenu" + UX.yuicalendarcount,
                                                        { visible: false });
            var button = new YAHOO.widget.Button({type: "menu",
                                                  id: "calendarpicker" + UX.yuicalendarcount, 
                                                  label: "", 
                                                  menu: calendarMenu,
                                                  container: "ux-calendar-bg" + UX.yuicalendarcount});
            var calcount = UX.yuicalendarcount;

            button.on("appendTo", function () {
                calendarMenu.setBody("&#32;"); // body is needed, add a space
                calendarMenu.body.id = "calendarcontainer" + calcount;
                calendarMenu.render(this.get("container"));
            });

            button.on("click", function () {
                if (pThis.m_value == null) {

                    pThis.m_value = new YAHOO.widget.Calendar("ux-calendar-" + calcount, calendarMenu.body.id);
                    pThis.m_value.setYear(pThis.currValue.substring(6,10));
                    pThis.m_value.setMonth(pThis.currValue.substring(0,2) - 1);
                    pThis.m_value.select(pThis.currValue);
                    pThis.m_value.render();

                    pThis.m_value.changePageEvent.subscribe(function () {
                        window.setTimeout(function () {
                            calendarMenu.show();
                        }, 0);
                    });

                    pThis.m_value.selectEvent.subscribe(function() {
                        yuiCalendarValueChanged(pThis, pThis.currentCalendarValue());
                        calendarMenu.hide();
                        pThis.m_value.hide(); // Required to avoid bleeding in IE
                    });
                }

                pThis.m_value.show();
                calendarMenu.show();
            });

        } else { // inline

            this.element.innerHTML = "<div id='ux-calendar-bg" + UX.yuicalendarcount + "' class='ux-calendar-bg'></div>";
            this.m_value = new YAHOO.widget.Calendar("ux-calendar-" + UX.yuicalendarcount, "ux-calendar-bg" + UX.yuicalendarcount);

            this.m_value.selectEvent.subscribe(
                function() {
                    yuiCalendarValueChanged(pThis, pThis.currentCalendarValue());
                }
             );

            this.m_value.render();
        }

        UX.yuicalendarcount++;
    }
};

YUICalendarValue.prototype.setValue = function(sValue)
{
    var bRet = false;

    if (this.currValue != sValue || m_bFirstSetValue)
    {
        if (this.m_bPopup) {
            YAHOO.util.Dom.get(this.m_sInputId).value = sValue;
        }
        this.currValue = sValue;
        this.m_value.setYear(sValue.substring(6,10));
        this.m_value.setMonth(sValue.substring(0,2) - 1);
        this.m_value.select(sValue);
        this.m_value.render();
        bRet = true;
        if (m_bFirstSetValue) {
            m_bFirstSetValue = false;
        }
    }

    return bRet;
    
};

