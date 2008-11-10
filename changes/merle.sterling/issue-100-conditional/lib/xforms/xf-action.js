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

		//I knew this solution was too good to be true.  Aside from those situations described below,
		//	the other situations for which this causes trouble, and are used in our forms, are:
		//	(a) actions nested within actions.
		//	(b) the despatch action.

		function _handleEvent(evt)
		{
			//Events which cause further events to occur, which in turn cause actions to be invoked
			//	appear to be the cause of the annoying "stack overflow" dialogs.  A quick way of solving
			//	this is to spawn the handleEvent call, rather than performing it inline.  This executes it
			//	from the top of a new stack, when the outermost calling function exits.
			//
			//Ideally, this should probably be under the control of the form author, who could decide whether to 
			//	run action handlers synchronously, or asynchronously, and inform the processor by means of some attribute.
			//	For now, this can be the default (only) behaviour, as it doesn't seem to cause ill effects.  
			//	
			//Note that with this method, each action within an <xf:action /> block is processed sequentially, but each 
			//	<xf:action /> block	is processed asynchronously.
			//
			//The only situations that I can currently foresee that would lead to ill effects are:
			//(1) The use of multiple sequential <xf:action /> blocks, 
			//		where actions within the second require the successful completion of actions in the first.
			//(2) The use of bubble and capture phases, in which 
			//		(a) Actions on an ancestor are expected to occur before (capture) or after (bubble) actions on a descendent.
			//		(b) Actions which are expected to prevent the default behaviour or the propogation of an event.

			
			//Prevent scope rules from messing with the event within the spawn.
			var e = evt;
			
			//spawn a function call which passes evt (now e) to the internal _handleEvent method.
			spawn(function(){handleEvent(e)});
		}
		
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