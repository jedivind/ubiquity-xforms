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

function XFormsOutputValue(elmnt) {
    this.element = elmnt;
    if (this.element.parentNode.m_sValue) {
        this.setValue(this.element.parentNode.m_sValue);
    }
}

if (document.all) {
    XFormsOutputValue.prototype.setValue = function(sValue) {
        this.element.innerText = sValue;
        return;
    };

    XFormsOutputValue.prototype.getValue = function() {
        return this.element.innerText;
    };
} else {
    XFormsOutputValue.prototype.setValue = function(sValue) {
        this.element.textContent = sValue;
        return;
    };
    
    XFormsOutputValue.prototype.getValue = function() {
        return this.element.textContent;
    };
}