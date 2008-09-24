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
 * object to be activated and deactivated.
 *
 * Accompanying CSS classes are in hint.css.
 */

function Hint( el ) {
  // The context for our hint is the parent element.
  //
  var context = el.parentNode;

  // Hide the hint.
  //
  document.notify.ephemeral(el, false);

  // It's difficult to see how we might not find a context, but it doesn't
  // hurt to check.
  //
  if ( !context ) {
    throw "No context found for hint";
  }

  // Register for the events that enable and disable hint.
  //
  context.addEventListener("xforms-hint", this, true);
  context.addEventListener("xforms-hint-off", this, true);

  // The positioning of the hint is relative to its container so
  // indicate that it's a hint container, so that the CSS styles
  // in hint.css can kick in.
  //
  YAHOO.util.Dom.addClass(context, "xf-hint-container");

  // Save a pointer to the element.
  //
  this.element = el;
};

Hint.prototype.handleEvent = function( evt ) {
  if ( evt.type === "xforms-hint" ) {
    document.notify.ephemeral( this.element );
  } else if ( evt.type === "xforms-hint-off" ) {
    document.notify.ephemeral(this.element, false);
  }
  return;
};
