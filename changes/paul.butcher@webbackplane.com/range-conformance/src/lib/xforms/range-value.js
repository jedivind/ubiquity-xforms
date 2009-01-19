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

/*global spawn, FormsProcessor, YAHOO*/

var rangecount = 0;

function RangeValue(elmnt)
{
	this.element = elmnt;
	this.currValue = "";
	this.m_bFirstSetValue = true;
	var rangeElement = elmnt.parentNode;
	this.start = Number(rangeElement.getAttribute("start")) || 0;
	this.end = Number(rangeElement.getAttribute("end")) || (this.start + 10);
	this.step = Number(rangeElement.getAttribute("step")) || 1;
}


function rangeValueChanged(pThis, sNewValue)
{
	var oEvt = pThis.element.ownerDocument.createEvent("MutationEvents");
	if (oEvt.initMutationEvent === undefined) {
		oEvt.initMutationEvent = oEvt.initEvent;
	}
		
	oEvt.initMutationEvent("control-value-changed", true, true, null, pThis.currValue, sNewValue, null, null);

	spawn(function () {
			FormsProcessor.dispatchEvent(pThis.element, oEvt);
	  });
}

RangeValue.prototype.onDocumentReady = function ()
{
	if (this.element.ownerDocument.media !== "print")
	{
		this.element.innerHTML = "<div id='slider-bg" + rangecount + "' class='slider-bg'><div class='slider-thumb' id='slider-thumb" + rangecount + "'> </div></div>";
		this.tickCount = this.end - this.start;
		this.trackWidth = 200;
		this.tickWidthInPixels = this.trackWidth / this.tickCount; 
		this.m_value = YAHOO.widget.Slider.getHorizSlider("slider-bg" + rangecount, "slider-thumb" + rangecount, 0, this.trackWidth);
		rangecount++;
		
		var pThis = this;
		this.m_value.subscribe(
			"slideEnd",
			function () {
			  var val = pThis.quantizeValue(pThis.dataValueFromSliderPosition(pThis.m_value.getValue()));
    		rangeValueChanged(pThis, val);
      }
   );
	}
};

RangeValue.prototype.setValue = function (sValue)
{
	var bRet = false, valueAsSliderPosition = this.sliderPositionFromDataValue(sValue);
	if (this.m_value.getValue() !== valueAsSliderPosition)
	{
		this.m_value.setValue(valueAsSliderPosition, true, true, true);
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

RangeValue.prototype.getStepGranularity = function () {
  var retVal, sVal;
  sVal = String(this.step);
  sVal = sVal.slice(sVal.indexOf("."));
  if (sVal.charAt(0) === ".") {
    retVal = sVal.length - 1;      
  } else {
    retVal = 0;
  }
  return retVal;
};

RangeValue.prototype.quantizeValue = function (value) {

  var quantizedValue, mod, offsetValue, stepGranularityModifier;
  //round value to same number of decimal places as step.
  //This helps remove rounding issues at the edges
  stepGranularityModifier = Math.pow(10, this.getStepGranularity());
  value = Math.round(value * stepGranularityModifier) / stepGranularityModifier;
  
  //Edge values shouldn't be quantized to the step width.
  if (value === this.end || quantizedValue === this.start) {
    quantizedValue = value;
  } else {
    //round to nearest step.
    offsetValue = value - this.start;
    mod = offsetValue % this.step;
    if (mod > this.step / 2) {
      quantizedValue = value + this.step - mod;
    } else {
      quantizedValue = value - mod;
    }
    //round the quantized value into line with the step, to prevent rounding errors from mod
    quantizedValue = Math.round(quantizedValue * stepGranularityModifier) / stepGranularityModifier;
  }
  return quantizedValue;
  
};

RangeValue.prototype.dataValueFromSliderPosition = function (sliderPos) {
  var positionWithinRange = (sliderPos / this.tickWidthInPixels);
  return this.start + positionWithinRange;
};

RangeValue.prototype.sliderPositionFromDataValue = function (value) {
  return (value - this.start) * this.tickWidthInPixels;
};
