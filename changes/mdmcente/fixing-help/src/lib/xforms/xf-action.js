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

function XFAction(elmnt)
{
	this.element = elmnt;
}

XFAction.prototype.handleEvent = DeferToConditionalInvocationProcessor;

XFAction.prototype.performAction = function(evt)
{
	/*
	 * An action handler simply supports a handleEvent method,
	 * so loop through executing them all.
	 */
	var oColl = this.element.childNodes;

	for (var i = 0; i < oColl.length; i++)
	{
		try
		{
			if(oColl.item(i).nodeType == 1)
				ActionExecutor.invokeListener(oColl.item(i), evt);	
		}
		catch(e)
		{
			/*
			 * If an action handler isn't yet implemented then
			 * it needs to be added.
			 */
			//debugger;
		}
	}
	return;
}