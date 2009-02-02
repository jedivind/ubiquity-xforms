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

function XFormsCase(elmnt)
{
	this._case = new Case(elmnt);
}

XFormsCase.prototype.getSwitch = function()
{
	return this._case.element.parentNode;
};

XFormsCase.prototype.deselect = function()
{
	this._case.deselect();

	var elmnt = this._case.element;
	var evt = elmnt.ownerDocument.createEvent("Events");

	evt.initEvent("xforms-deselect", true, false);
	evt._actionDepth = -1;

	//There is no need to run this event in line, and doing so may cause a stack overflow,
	//	if it invokes several other actions. 
	spawn(function(){FormsProcessor.dispatchEvent(elmnt,evt);});
};

XFormsCase.prototype.select = function()
{
	this._case.select();

	var elmnt = this._case.element;
	var evt = elmnt.ownerDocument.createEvent("Events");

	evt.initEvent("xforms-select", true, false);
	evt._actionDepth = -1;

	//There is no need to run this event in line, and doing so may cause a stack overflow,
	//	if it invokes several other actions. 
	spawn(function(){FormsProcessor.dispatchEvent(elmnt,evt);});
};

XFormsCase.prototype.toggle = function()
{
	var oSwitch = this.getSwitch();
	if ( oSwitch && this.id ) {
		oSwitch.toggle(this.id);
	}
};
