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
	//this.ctor();
}


function ieRangeValueChanged(pThis, sNewValue)
{
	/*
	 * [ISSUE] Not really suitable to use mutation events.
	 */

	var oEvt = pThis.element.ownerDocument.createEvent("MutationEvents");
	
	oEvt.initEvent("control-value-changed", true, true,
		null, pThis.currValue, sNewValue, null, null);

	spawn(function(){FormsProcessor.dispatchEvent(pThis.element, oEvt);});

	/*
	 * Cancel bubbling but don't cancel the event itself
	 * otherwise we never get the value actually changed.
	 */

	 //evt.cancelBubble = true;

}

function ffRangeValueChanged(pThis, sNewValue)
{
	/*
	 * [ISSUE] Not really suitable to use mutation events.
	 */
	var oEvt = pThis.element.ownerDocument.createEvent("MutationEvents");
	
	oEvt.initMutationEvent("control-value-changed", true, true,
		null, pThis.currValue, sNewValue, null, null);

	FormsProcessor.dispatchEvent(pThis.element, oEvt);
	/*
	 * Cancel bubbling but don't cancel the event itself
	 * otherwise we never get the value actually changed.
	 */

	 //evt.cancelBubble = true;

}

RangeValue.prototype.onDocumentReady = function()
{
	if (this.element.ownerDocument.media != "print")
	{
		this.element.innerHTML = "<div id='slider-bg" + rangecount + "' class='slider-bg'><div class='slider-thumb' id='slider-thumb" + rangecount + "'><img src='thumb-n.gif' /></div></div>";
		this.m_value = YAHOO.widget.Slider.getHorizSlider("slider-bg" + rangecount, "slider-thumb" + rangecount, 0, 200, 20);
		rangecount++;
		
		var pThis = this;
		this.m_value.subscribe(
			"slideEnd",
			function() {
			    	if(document.all){
		    			ieRangeValueChanged(pThis, pThis.m_value.getValue() / 20);
		    		}
		    		else{
		    			ffRangeValueChanged(pThis,pThis.m_value.getValue() / 20);
		    		}
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
	else if(m_bFirstSetValue)
	{
		bRet = true;
		m_bFirstSetValue = false;
	}
	
	return bRet;
};

