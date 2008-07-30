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

function Select1(elmnt)
{

	this.element = elmnt;
	this.element.addEventListener("fp-select",this,false);
	this.element.addEventListener("fp-deselect",this,false);
	this.element.addEventListener("data-value-changed",this,false);
	this.element.addEventListener("xforms-select",this,false);
	this.element.addEventListener("xforms-deselect",this,false);
}

		Select1.prototype.handleEvent = function(oEvt)
		{
			switch(oEvt.type)
			{
				case "fp-select":
					var oEvt1 = this.element.ownerDocument.createEvent("MutationEvents");
					oEvt1.initEvent("control-value-changed", false, true,null, "",oEvt.target.getvalue(), 1);
					oEvt1._actionDepth = oEvt._actionDepth;
					FormsProcessor.dispatchEvent(this.element.m_value,oEvt1);
					break;
				case "fp-deselect":
					break;
				case "data-value-changed":
					this.onSelectionChanged(oEvt.newValue);
					break;
				case "xforms-select":
				case "xforms-deselect":
					oEvt.stopPropagation();
			}			
		};
		
	
Select1.prototype.focusOnValuePseudoElement = function()
{
	if(this.m_value && event.srcElement != this.m_value)
	{
		if(!this.m_value.contains(event.srcElement) && ( this.m_choices && event.srcElement !=this.m_choices && !this.m_choices.contains(event.srcElement)))
		{
			this.m_value.focus();
		}
	}
};
	
		Select1.prototype.onSelectionChanged = function (s)
		{
			var oEvt1 = this.element.ownerDocument.createEvent("MutationEvents");
			oEvt1.initEvent("selection-changed", false, false,	null, "",s, 1);
			FormsProcessor.dispatchEvent(this.element,oEvt1);
			return;
		};
		
		Select1.prototype.onContentReady = function()
		{
			var s = this.getAttribute("appearance");
			if(s !== undefined && s !== "")
			{
				this.className += "appearance-" + s;
			}
		};
		
		Select1.prototype.onDocumentReady = function()
		{
				if(!this.m_choices)
				{
					var oPeChoices = this.element.ownerDocument.createElement("pe-choices");
					this.element.appendChild(oPeChoices);
					var nl = this.childNodes;
					for(var i = 0;i < nl.length; ++i)
					{
						var n = nl[i];
						switch(n.tagName)
						{
							case "item":
							case "itemset":
							case "choices":
								//shift to pc-choices.
								oPeChoices.appendChild(n);
								--i;
							break;
							default:
							//leave in situ
						}
						
					}
					this.m_choices = oPeChoices;
				}
		};
		
	function Select(elmnt)
	{	
		this.element = elmnt;
		this.element.addEventListener("fp-select",this,false);
		this.element.addEventListener("fp-deselect",this,false);
		this.element.addEventListener("xforms-select",this,false);
		this.element.addEventListener("xforms-deselect",this,false);
		this.element.addEventListener("data-value-changed",this,false);
		this.m_values = [];
	}
	
		Select.prototype.handleEvent = function(oEvt)
		{
			var oEvt1;
			switch(oEvt.type)
			{
				case "fp-select":
					this.m_values.push(oEvt.target.getvalue());
					oEvt1 = this.element.ownerDocument.createEvent("MutationEvents");
					oEvt1.initEvent("control-value-changed", false, true,
						null, "",this.m_values.join(" "), 1);
					oEvt1._actionDepth = oEvt._actionDepth;
					FormsProcessor.dispatchEvent(this.element.m_value,oEvt1);
					break;
					
				case "fp-deselect":
					var s = oEvt.target.getvalue();
					for(var i = 0;i < m_values.length;++i)
					{
						if(s == m_values[i])
						{
							this.m_values.splice(i,1);

							oEvt1 = this.element.ownerDocument.createEvent("MutationEvents");
							oEvt1.initEvent("control-value-changed", false, true,
								null, "",this.m_values.join(" "), 1);
							oEvt1._actionDepth = oEvt._actionDepth;
							FormsProcessor.dispatchEvent(this.element.m_value,oEvt1);
							break;
						}
					}
					break;
				case "data-value-changed":
					this.m_values = oEvt.newValue.split(" ");
					onSelectionChanged(oEvt.newValue);
					oEvt.stopPropagation();
					break;
				case "xforms-select":
				case "xforms-deselect":
					oEvt.stopPropagation();
				break;
			}				
		};
		
		Select.prototype.onSelectionChanged = function(s)
		{
			var oEvt1 = this.element.ownerDocument.createEvent("MutationEvents");
			oEvt1.initEvent("selection-changed", false, false,null, "",s.split(" "), 1);
			FormsProcessor.dispatchEvent(element,oEvt1);
			return;
		};
		
		
		