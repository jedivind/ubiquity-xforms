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

var EventTarget = null;

	
		function mapclick2domactivate(elmnt,e)
		{
			var oEvt = elmnt.ownerDocument.createEvent("UIEvents");

			oEvt.initUIEvent("DOMActivate", true, true, null, 1);
			//There is no need to run this event in line, and doing so may cause a stack overflow,
			//	if it invokes other actions. 
			//oEvt._actionDepth = -1;
			FormsProcessor.dispatchEvent(elmnt,oEvt);
			//spawn(function(){elmnt.dispatchEvent(oEvt)});
			if(document.all)
			{
				elmnt.document.parentWindow.event.cancelBubble = true;
				elmnt.document.parentWindow.event.returnValue = false;
			}
			else
			{
				e.stopPropagation();
			}
		}

		function mapdblclick2domactivate(elmnt,e)
		{
			var oEvt = elmnt.ownerDocument.createEvent("UIEvents");

			oEvt.initUIEvent("DOMActivate", true, true, null, 2);
			//There is no need to run this event in line, and doing so may cause a stack overflow,
			//	if it invokes other actions. 
		//	oEvt._actionDepth = -1;
			FormsProcessor.dispatchEvent(elmnt,oEvt);
			if(document.all) {
				elmnt.document.parentWindow.event.cancelBubble = true;
				elmnt.document.parentWindow.event.returnValue = false;
			}
			else {
				e.stopPropagation();
			}
		}

function StyleHoverishly(elmnt) {
	if(elmnt.className.indexOf("pc-hover") == -1) {
		elmnt.className += " pc-hover";
	}
	
	// This code is for dispatching a xforms-hint event on IE.
	var evt = document.createEvent('UIEvents');
	evt.initUIEvent("xforms-hint", true, false, window, 1);
	elmnt.dispatchEvent(evt);
}

function StyleUnhoverishly(elmnt) {
	var s = elmnt.className;
	var i = s.indexOf("pc-hover");
	if(i != -1) {
		elmnt.className = s.substr(0,i-1) + s.substr(i+8);
	}
}

function StyleFocussedly(elmnt)
{
	if(elmnt.className.indexOf("pc-focus") == -1) {
		elmnt.className += " pc-focus";
	}
}

function StyleUnfocussedly(elmnt)
{
	var s = elmnt.className;
	var i = s.indexOf("pc-focus");
	if(i != -1) {
		elmnt.className = s.substr(0,i-1) + s.substr(i+8);
	}
}

//There is no need for this in firefox.
if(document.all)
{
	EventTarget = EventTargetProxy;

/*
* P R I V A T E
* =============
*/

		function _addEventListener(sType, oListener, iPhase)
		{
			/*
			 * If this is the first listener of this type then create
			 * an empty list
			 */
			if(typeof(iPhase) == "boolean") {
				iPhase = (iPhase) ? this.PHASE_CAPTURE : this.PHASE_BUBBLE;
			}
			
			if (this.arrListener[sType] == null) {
				this.arrListener[sType] =  [];
			}

			/*
			 * Each type can have listeners for different phases
			 */

			if (this.arrListener[sType][iPhase] == null) {
				this.arrListener[sType][iPhase] =  [];
			}

			/*
			 * Check to see if we already have this listener, and if not,
			 * add it to the end
			 */

			var arr = this.arrListener[sType][iPhase];
			var iNext = arr.length;

			for (var i = 0; i < iNext; i++)
			{
				if (arr[i] == oListener) {
					break;
				}
			}

			if (i == iNext)
			{
				arr[iNext] = oListener;
			}
		} //_addEventListener

		function _removeEventListener(sType, oListener, iPhase)
		{
			if(typeof(iPhase) == "boolean")
			{
				iPhase = (iPhase) ? this.PHASE_CAPTURE : this.PHASE_BUBBLE;
			}
			/*
			 * First see if we have a list of listeners for this type
			 */

			var arr = this.arrListener[sType][iPhase];

			if (arr)
			{

				/*
				 * Now find the specific listener, and if successful, remove it
				 */

				for (var i = 0; i < arr.length; i++)
				{
					if (arr[i] == oListener)
					{
						arr[i] = null;
						this.element.document.logger.log("Removed listener for " + sType + ", phase " + iPhase, "evnt");
						break;
					}// if ( we have found the listener we are looking for )
				}// for ( each listener in the list )
			}// if ( some listeners exist for this type and phase )
		}//_removeEventListener

		function __notifyListeners(oEvt)
		{

			/*
			 * First get the list of listeners for this type
			 */
			var arr = this.arrListener[oEvt.type];

			if (arr)
			{
				/*
				 * Next, narrow it down to just those listeners
				 * for the correct phase
				 */
		
				var iPhase;
		
				switch (oEvt.eventPhase)
				{
					case oEvt.AT_TARGET:
						iPhase = this.PHASE_BUBBLE;
						break;
		
					case oEvt.BUBBLING_PHASE:
						iPhase = this.PHASE_BUBBLE;
						break;
		
					case oEvt.CAPTURING_PHASE:
						iPhase = this.PHASE_CAPTURE;
						break;
		
					case oEvt.DEFAULT_PHASE:
						iPhase = this.PHASE_DEFAULT;
						break;
		
					default:
						throw "[CEventTarget._notifyListeners] Invalid phase: " + oEvt.eventPhase;
						break;
				}// switch ( on the event phase )

				/*
				 * For each phase there will be one or more groups
				 */

				arr = arr[iPhase];
				if (arr && arr.length)
				{
		
					//theApp.message("   Notifying " + arr.length + " groups");
					//for (var iGroup = 0; i < arr.length; i++)
					//{
					//	arr = arr[iGroup];
					//	if (arr && arr.length)
					//	{
		
							/*
							* If we have a list of listeners then invoke their
							* handlers
							*/
		
							this.element.document.logger.log(oEvt.type + ": Notifying " + arr.length + " handlers", "evnt");

							for (var i = 0; i < arr.length; i++)
							{
								//flush any events that have been added prior to this loop
								//	either in the previous iteration, or before the first iteration.
								FlushEventQueue();
								var oListener = arr[i];
								var bInvoke = true;

								/*
								 * If @ev:target is present then the listener is only
								 * invoked if event target has the same ID.
								 */

								if (oListener["ev:target"])
								{
									if (oEvt.target.id != oListener["ev:target"])
										bInvoke = false;
								}
								
								if(typeof(oListener.handleEvent) == "undefined")
								{
									//prevents ghost listeners being invoked.
									bInvoke = false;
									//remove ghost listener from the list.
									//(enable later, too pressing to test now)
									//arr.splice(i,1);
									//debugger;
								}
									
								if (bInvoke)
								{
									oListener.handleEvent(oEvt);
								}

								/*
								 * If @ev:preventDefault is set then the default
								 * handler is to be cancelled.
								 */

								var sDefaultAction = this.element["ev:defaultAction"];
								var bPreventDefault;

								switch (sDefaultAction)
								{
									case "cancel":
										bPreventDefault = true;
										break;

									case "perform":
									default:
										bPreventDefault = false;
										break;
								}

								if (bPreventDefault) {
									oEvt.preventDefault();
								}

								/*
								 * If @ev:propagate is set then we need to
								 * stop propagation.
								 */

								var sPropagate = this.element["ev:propagate"];
								var bStopPropagation;

								switch (sPropagate)
								{
									case "stop":
										bPreventDefault = true;
										break;

									case "continue":
									default:
										bPreventDefault = false;
										break;
								}

								if (bStopPropagation)
									oEvt.stopPropagation();

								/*
								 * Stop propagation doesn't stop a group,
								 * but "stop immediate" does
								 */
		
								if (oEvt._stopImmediatePropagation) {
									break;
								}
							}//for ( each listener in this group )								
							
							//flush any events that were added to the queue by the last iteration.
							FlushEventQueue();

					//	}//if ( there are listeners in this group )
								
						/*
						 * Stop propagation let's the current group complete
						 * before stopping all other listeners
						 */
		
					//	if (oEvt._stopPropagation)
					//		break;
					//}//for ( each group in this phase )
				}// if ( there are groups for this phase )
			}// if ( there are listeners for this event )
		}//_notifyListeners()
		
		function getTargetList(oEvt)
		{
			var bRet = new Array();
			var oNode = oEvt.target.parentElement;

			while (oNode)
			{
				var sTypeOfAddEventListener = typeof oNode.addEventListener;
				if ( sTypeOfAddEventListener == "function" || sTypeOfAddEventListener == "unknown") {
					bRet.push(oNode);
				}
				oNode = oNode.parentElement;
			}
			return bRet;
		}

		function capture(oEvt,arrTargetList)
		{
				/*
			 * CAPTURE PHASE
			 * In the capture phase we target ancestors in order
			 * from the root to our target.
			 *
			 * After notifying each listener we check oEvt._stopPropogation
			 * to see if the process should continue, although for
			 * each target we carry out all listeners, uninterrupted.
			 *
			 * Note that capturing does *not* happen on the target of the
			 * event.
			 */	
			oEvt.eventPhase = oEvt.CAPTURING_PHASE;
			var i;

			for (i = arrTargetList.length - 1; i >= 0 ; i--)
			{
				oNode = arrTargetList[i];
				oNode.currentTarget = oNode;
		
				oNode._notifyListeners(oEvt);
				if (oEvt._stopPropagation) {
					break;
				}
			}// for ( each ancestor )
		}
		
		function bubble(oEvt,arrTargetList)		
		{
			/*
			 * BUBBLE PHASE
			 * In the bubble phase we target ancestors in reverse order,
			 * i.e., from the target up to the root. Begin with the
			 * 'current' target.
			 */
			if (!oEvt._stopPropagation)
			{
				oEvt.eventPhase = oEvt.AT_TARGET;
				oEvt.currentTarget = this.element;
		
				this._notifyListeners(oEvt);
			}

			if (!oEvt._stopPropagation)
			{
				if (oEvt.bubbles)
				{
					oEvt.eventPhase = oEvt.BUBBLING_PHASE;
		
					for (i = 0; i < arrTargetList.length; i++)
					{
						oNode = arrTargetList[i];
						oEvt.currentTarget = oNode;
		
						oNode._notifyListeners(oEvt);
						if (oEvt._stopPropagation) {
							break;
						}
					}// for ( each ancestor )
				}// if ( the event is a bubbling event )
			}// if ( propogation has not been stopped )
		}
		
		function notifydefault(oEvt)
		{
			/*
			 * Finally, perform the default handlers if not cancelled
			 */
		
			if (!oEvt._cancelled)
			{
				oEvt.eventPhase = oEvt.DEFAULT_PHASE;
				oEvt.currentTarget = this.element;
		
				this._notifyListeners(oEvt);
			}
		}		
		var g_iEventsInProgress = 0;
		var g_pendingEvents = new Array();
		function _dispatchEvent(oEvt)
		{
			if(g_iEventsInProgress > 0)
			{
				g_pendingEvents.push({target:this,evt:oEvt});
				return false;
			}
			else {
				return this._dispatchEvent(oEvt);
			}
		}
		
		function FlushEventQueue()
		{
			var oPendingEvent = g_pendingEvents.pop();
			while(oPendingEvent)
			{
				oPendingEvent.target._dispatchEvent(oPendingEvent.evt);
				oPendingEvent = g_pendingEvents.pop();
			}
		}
		
		function __dispatchEvent(oEvt)
		{
			++g_iEventsInProgress;
			try
			{
				var sType = oEvt.type;

				/*
				* The 'target' is always the same, although the 'currentTarget' will
				* change as bubbling and capture take place.
				*/

				oEvt.target = this.element;

				this.element.document.logger.log("Dispatching: " + sType + " to " + oEvt.target.tagName + ":" + oEvt.target.uniqueID, "evnt");

				/*
				* Increase the action depth, since we don't
				* want to update the models until we exit
				* the top-level action handler.
				*/

				if (oEvt._actionDepth == undefined) {
					oEvt._actionDepth = 0;
				}

				if (oEvt._actionDepth != -1) {
					oEvt._actionDepth++;
				}

				/*
				* First build a list of the node's ancestors. Since the
				* list of event targets that is used in the bubble and capture
				* phases is set at the beginning of the event, we can use
				* the same list twice
				*/
			
				var arrTargetList = getTargetList(oEvt);


				this.capture(oEvt,arrTargetList);
				//atTarget(oEvt);
				this.bubble(oEvt,arrTargetList);
				
				if (oEvt._stopPropagation)
					this.element.document.logger.log("*** Propagation stopped ***", "evnt");

				if (oEvt._cancelled)
					this.element.document.logger.log("*** Cancelled ***", "evnt");
			
				this.element.document.logger.log("End of dispatchEvent: " + sType, "evnt");
			
			}
			catch(e)
			{
				//debugger;
			}
			finally
			{
				--g_iEventsInProgress;
			}
			/*
			* Let the caller know if the default handlers were
			* cancelled
			*/
				
			return !oEvt._cancelled;
		}//dispatchEvent


function EventTargetProxy(elmnt)
{
	this.arrListener = new Object();
	this.element = elmnt;
	this.element.onclick = function(evt){mapclick2domactivate(elmnt);};
	this.element.ondblclick = function(evt){mapdblclick2domactivate(elmnt);};
	this.element.onmouseover = function(evt){StyleHoverishly(elmnt);};
	this.element.onmouseout = function(evt){StyleUnhoverishly(elmnt);};
	this.element.onfocusin = function(evt){StyleFocussedly(elmnt);};
	this.element.onfocusout = function(evt){StyleUnfocussedly(elmnt);};
}

/*
* There are essentially 4 phases:
*	1. capturing
*	2. at target
*	3. bubbling
*	4. processing defaults
*
* However, from the point of view of storing the listeners
* we can keep the target and bubbling listeners in the
* same place.
*/

EventTargetProxy.prototype.PHASE_CAPTURE =0;
EventTargetProxy.prototype.PHASE_BUBBLE = 1;
EventTargetProxy.prototype.PHASE_DEFAULT = 2;
EventTargetProxy.prototype.addEventListener = _addEventListener;
EventTargetProxy.prototype.removeEventListener = _removeEventListener;
EventTargetProxy.prototype._notifyListeners = __notifyListeners;
EventTargetProxy.prototype.dispatchEvent = _dispatchEvent;
EventTargetProxy.prototype._dispatchEvent = __dispatchEvent;
EventTargetProxy.prototype.capture = capture;
EventTargetProxy.prototype.bubble = bubble;


}
else
{

	EventTarget = function (elmnt)
	{
		this.element = elmnt;
		this.element.onclick = function(evt){mapclick2domactivate(elmnt,evt);};
		this.element.ondblclick = function(evt){mapdblclick2domactivate(elmnt,evt);};
		this.element.onmouseover = function(evt){StyleHoverishly(elmnt);};
		this.element.onmouseout = function(evt){StyleUnhoverishly(elmnt);};
		this.element.onfocusin = function(evt){StyleFocussedly(elmnt);};
		this.element.onfocusout = function(evt){StyleUnfocussedly(elmnt);};
	};
}

