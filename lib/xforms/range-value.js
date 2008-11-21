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

var rangecount = 0;

function RangeValue	(elmnt)
{
	this.element = elmnt;
	this.currValue = "";
	this.m_bFirstSetValue = true;
}


function rangeValueChanged(pThis, sNewValue)
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

RangeValue.prototype.onDocumentReady = function()
{
	if (this.element.ownerDocument.media != "print")
	{
		this.element.innerHTML = "<div id='slider-bg" + rangecount + "' class='slider-bg'><div class='slider-thumb' id='slider-thumb" + rangecount + "'> </div></div>";
		this.m_value = YAHOO.widget.Slider.getHorizSlider("slider-bg" + rangecount, "slider-thumb" + rangecount, 0, 200, 20);
		rangecount++;
		
		var pThis = this;
		this.m_value.subscribe(
			"slideEnd",
			function() {
		    			rangeValueChanged(pThis, pThis.m_value.getValue() / 20);
		      	}
	     	);
	}
};

RangeValue.prototype.setValue = function(sValue)
{
	var bRet = false;

	if (this.m_value.getValue() != (sValue * 20))
	{
		this.m_value.setValue(sValue * 20, true, true, true);
		this.currValue = sValue;
		bRet = true;
	}
	else if (this.m_bFirstSetValue)
	{
		bRet = true;
		this.m_bFirstSetValue = false;
	}
	
	return bRet;
};

