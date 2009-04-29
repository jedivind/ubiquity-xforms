/*
 * Copyright © 2009 Backplane Ltd.
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

function NavigableControlList() {
	this.list = [];
}

NavigableControlList.prototype.addControl = function (control) {
	if (this.isNavigableControl(control)) {
		this.prepareListItem(control);

		this.list[control.navIndex].push(control);
	}
};

NavigableControlList.prototype.getFirstControl = function () {
	return this.getFirstControlAtIndex(1) || this.getFirstControlAfterIndex(1);
};

NavigableControlList.prototype.getLastControl = function () {
	return this.getLastControlAtIndex(0) || this.getLastControlBeforeIndex(this.list.length);
};

NavigableControlList.prototype.getNextControl = function (control) {
	if (this.isNavigableControl(control) && this.hasListItem(control.navIndex)) {
		return this.getNextControlAtSameIndex(control) || this.getFirstControlAfterIndex(control.navIndex);
	}

	return null;
};

NavigableControlList.prototype.getPreviousControl = function (control) {
	if (this.isNavigableControl(control) && this.hasListItem(control.navIndex)) {
		return this.getPreviousControlAtSameIndex(control) || this.getLastControlBeforeIndex(control.navIndex);
	}

	return null;
};

NavigableControlList.prototype.isNavigableControl = function (control) {
	return typeof control === 'object' && control && control.isNavigableControl && typeof control.navIndex === 'number';
};

NavigableControlList.prototype.prepareListItem = function (control) {
	if (!this.hasListItem(control.navIndex)) {
		this.list[control.navIndex] = [];
	}
};

NavigableControlList.prototype.hasListItem = function (index) {
	return this.list[index] ? true : false;
};

NavigableControlList.prototype.getNextControlAtSameIndex = function (control) {
	var foundControl = false, nextControl;
	for (var i = 0; i < this.list[control.navIndex].length; ++i) {
		if (foundControl) {
			nextControl = this.list[control.navIndex][i];
			if (nextControl.isEnabled()) {
				return nextControl;
			}
		}

		foundControl = control === this.list[control.navIndex][i];
	}

	return null;
};

NavigableControlList.prototype.getPreviousControlAtSameIndex = function (control) {
	var foundControl = false, previousControl;
	for (var i = this.list[control.navIndex].length; i >= 0; --i) {
		if (foundControl) {
			previousControl = this.list[control.navIndex][i];
			if (previousControl.isEnabled()) {
				return previousControl;
			}
		}

		foundControl = control === this.list[control.navIndex][i];
	}

	return null;
};

NavigableControlList.prototype.getFirstControlAfterIndex = function (index) {
	var i, control;

	for (i = this.incrementIndex(index); i < this.list.length; i = this.incrementIndex(i)) {
		control = this.getFirstControlAtIndex(i);
		if (control) {
			if (control.isEnabled()) {
				return control;
			}

			control = this.getNextControlAtSameIndex(control);
			if (control) {
				return control;
			}
		}
	}

	return null;
};

NavigableControlList.prototype.getLastControlBeforeIndex = function (index) {
	var i, control;

	for (i = this.decrementIndex(index); i >= 0; i = this.decrementIndex(i)) {
		control = this.getLastControlAtIndex(i);
		if (control) {
			if (control.isEnabled()) {
				return control;
			}

			control = this.getPreviousControlAtSameIndex(control);
			if (control) {
				return control;
			}
		}
	}

	return null;
};

NavigableControlList.prototype.incrementIndex = function (index) {
	// As per section 4.3.6 of XForms 1.1, controls with an index of zero come
	// after controls with an index greater than zero in the navigation order.
	return index === 0 ? this.list.length : (index >= this.list.length - 1 ? 0 : index + 1);
};

NavigableControlList.prototype.decrementIndex = function (index) {
	// As per section 4.3.6 of XForms 1.1, controls with an index of zero come
	// after controls with an index greater than zero in the navigation order.
	return index === 0 ? this.list.length - 1 : (index === 1 ? -1 : index - 1);
};

NavigableControlList.prototype.getFirstControlAtIndex = function (index) {
	var i;
	if (this.hasListItem(index)) {
		for (i = 0; i < this.list[index].length; ++i) {
			if (this.list[index][i].isEnabled()) {
				return this.list[index][i];
			}
		}
	}

	return null;
};

NavigableControlList.prototype.getLastControlAtIndex = function (index) {
	var i;
	if (this.hasListItem(index)) {
		for (i = this.list[index].length - 1; i >= 0; --i) {
			if (this.list[index][i].isEnabled()) {
				return this.list[index][i];
			}
		}
	}

	return null;
};
