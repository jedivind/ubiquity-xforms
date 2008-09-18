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

/*
 * The Hint object provides ephemeral message support, by allowing an
 * object to activated and deactivated.
 *
 * Accompanying CSS classes are in hint.css.
 */

function Hint( el ) {
  // The context for our hint is either the parent element,
  // or the element referred to by @for.
  //
  var forEl= el.getAttribute( "for" ),
      context = ( forEl ) ? document.getElementById( forEl ) : el.parentNode;

  // Hide the hint.
  //
  document.notify.ephemeral(el, false);

  // It's possible we didn't find a context, but if we did,
  // register for the events that enable and disable hint.
  //
  if ( context ) {
    context.addEventListener("xforms-hint", this, true);
    context.addEventListener("xforms-hint-off", this, true);
  }

  // The positioning of the hint is relative to its parent, so
  // indicate that it's a hint container.
  //
  YAHOO.util.Dom.addClass(el.parentNode, "hint-container");


  this.element = el;
  this.context = context;
};

Hint.prototype.handleEvent = DeferToConditionalInvocationProcessor;

Hint.prototype.performAction = function( evt ) {
  if ( evt.type === "xforms-hint" ) {
    document.notify.ephemeral( this.element );
  } else if ( evt.type === "xforms-hint-off" ) {
    document.notify.ephemeral(this.element, false);
  }
  return;
};
