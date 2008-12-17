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
 * The Help object provides SimpleDialog message support, by allowing an
 * object to be activated and deactivated.
 *
 * Accompanying CSS classes are in _platform/yui/message-panel.css.
 */

function Help(elmnt) {
    this.element = elmnt;
    var context = elmnt.parentNode;
    
    // It's difficult to see how we might not find a context, but it doesn't
    // hurt to check.
    //
    if ( !context ) {
        throw "No context found for hint";
    }
    context.addEventListener("xforms-help", this, false);
}

Help.prototype.handleEvent = function( evt ) {
    document.notify.messageWindow(this, false);
};
