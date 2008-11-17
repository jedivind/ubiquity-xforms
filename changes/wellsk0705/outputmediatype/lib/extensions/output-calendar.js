/*
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

function OutputValueCalendar(count) {
    this.m_value = new YAHOO.widget.Calendar("ux-calendar-" + count, "ux-calendar-bg" + count);  
}

OutputValueCalendar.prototype.currentCalendarValue = function() { 
    var date = this.m_value.getSelectedDates()[0];
    var yr = date.getYear();
    var mn = date.getMonth() + 1;
    var da = date.getDate();
    var xsdDate;
    yr = (yr > 1900) ? yr : (1900 + yr); // TODO, Calendar may return year modulo 1900 to begin with
    mn = (mn < 10) ? ('0' + mn) : mn;
    da = (da < 10) ? ('0' + da) : da;
    xsdDate = yr + '-' + mn + '-' + da;
    
    return xsdDate;
}

OutputValueCalendar.prototype.setValue = function(sValue) {
    var bRet = false;
    var yr;
    var mn;
    var da;
    var calendarDate;

    if (sValue.match( /^(\d{4})\-(\d{2})\-(\d{2})/ )) {
        yr = RegExp.$1;
        mn = RegExp.$2;
        da = RegExp.$3;
        calendarDate = mn + '/' + da + '/' + yr; // default format used by the calendar implementation
        if (this.m_value) { // avoid race when popup
            this.m_value.setYear(yr);
            this.m_value.setMonth(mn - 1);
            this.m_value.select(calendarDate);
        }
        bRet = true;  
    }

    return bRet;
};

OutputValueCalendar.prototype.render = function() {
   this.m_value.render();
};