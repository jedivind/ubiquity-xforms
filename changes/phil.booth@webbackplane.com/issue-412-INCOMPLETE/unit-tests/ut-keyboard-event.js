/*
 * Copyright (c) 2009 Backplane Ltd.
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

(function(){
	YAHOO.tool.TestRunner.add(new YAHOO.tool.TestCase({
		name: "Testing the KeyboardEvent object",

		setUp: function(){
			this.keyboardEvent = new KeyboardEvent();
		},

		tearDown: function(){
			delete this.keyboardEvent;
		},

		testConstruction: function () {
			YAHOO.util.Assert.isObject(this.keyboardEvent);
			YAHOO.util.Assert.isNotNull(this.keyboardEvent);
			YAHOO.util.Assert.isFunction(this.keyboardEvent.initKeyboardEvent);
			YAHOO.util.Assert.isFunction(this.keyboardEvent.getModifierState);
			this.assertConstantsHaveNotChanged();
		},

		testInitKeyboardEventSetsKeyIdentifierToUnidentified: function () {
			this.initialiseKeyDownEvent();
			this.assertKeyIdentifier('Unidentified');
			this.assertConstantsHaveNotChanged();
		},

		testInitKeyboardEventSetsKeyIdentifierToA: function () {
			this.initialiseKeyDownEvent('U+0041');
			this.assertKeyIdentifier('U+0041');
			this.assertConstantsHaveNotChanged();
		},

		testInitKeyboardEventSetsKeyIdentifierToB: function () {
			this.initialiseKeyDownEvent('U+0042');
			this.assertKeyIdentifier('U+0042');
			this.assertConstantsHaveNotChanged();
		},

		testInitKeyboardEventSetsKeyLocationToStandard: function () {
			this.initialiseKeyDownEvent(0, KeyboardEvent.DOM_KEY_LOCATION_STANDARD);
			this.assertKeyLocation(KeyboardEvent.DOM_KEY_LOCATION_STANDARD);
			this.assertConstantsHaveNotChanged();
		},

		testInitKeyboardEventSetsKeyLocationToLeft: function () {
			this.initialiseKeyDownEvent(0, KeyboardEvent.DOM_KEY_LOCATION_LEFT);
			this.assertKeyLocation(KeyboardEvent.DOM_KEY_LOCATION_LEFT);
			this.assertConstantsHaveNotChanged();
		},

		testInitKeyboardEventSetsKeyLocationToRight: function () {
			this.initialiseKeyDownEvent(0, KeyboardEvent.DOM_KEY_LOCATION_RIGHT);
			this.assertKeyLocation(KeyboardEvent.DOM_KEY_LOCATION_RIGHT);
			this.assertConstantsHaveNotChanged();
		},

		testInitKeyboardEventSetsKeyLocationToNumPad: function () {
			this.initialiseKeyDownEvent(0, KeyboardEvent.DOM_KEY_LOCATION_NUMPAD);
			this.assertKeyLocation(KeyboardEvent.DOM_KEY_LOCATION_NUMPAD);
			this.assertConstantsHaveNotChanged();
		},

		testInitKeyboardEventDoesNotSetAltKey: function () {
			this.initialiseKeyDownEvent(0, 0);
			this.assertAltKey(false);
			this.assertConstantsHaveNotChanged();
		},

		testInitKeyboardEventSetsAltKeyWithAltModifier: function () {
			this.initialiseKeyDownEvent(0, 0, 'Alt');
			this.assertAltKey(true);
			this.assertConstantsHaveNotChanged();
		},

		testInitKeyboardEventDoesNotSetAltKeyWithNonAltModfier: function () {
			this.initialiseKeyDownEvent(0, 0, 'Control');
			this.assertAltKey(false);
			this.assertConstantsHaveNotChanged();
		},

		testInitKeyboardEventSetsAltKeyWithAltInModifiersList: function () {
			this.initialiseKeyDownEvent(0, 0, 'Control Shift foo Alt bar');
			this.assertAltKey(true);
			this.assertConstantsHaveNotChanged();
		},

		testInitKeyboardEventDoesNotSetCtrlKey: function () {
			this.initialiseKeyDownEvent(0, 0);
			this.assertCtrlKey(false);
			this.assertConstantsHaveNotChanged();
		},

		testInitKeyboardEventSetsCtrlKeyWithCtrlModifier: function () {
			this.initialiseKeyDownEvent(0, 0, 'Control');
			this.assertCtrlKey(true);
			this.assertConstantsHaveNotChanged();
		},

		testInitKeyboardEventDoesNotSetCtrlKeyWithNonCtrlModfier: function () {
			this.initialiseKeyDownEvent(0, 0, 'Alt');
			this.assertCtrlKey(false);
			this.assertConstantsHaveNotChanged();
		},

		testInitKeyboardEventSetsCtrlKeyWithCtrlInModifiersList: function () {
			this.initialiseKeyDownEvent(0, 0, 'Alt Meta Shift foo bar Control');
			this.assertCtrlKey(true);
			this.assertConstantsHaveNotChanged();
		},

		testInitKeyboardEventDoesNotSetMetaKey: function () {
			this.initialiseKeyDownEvent(0, 0);
			this.assertMetaKey(false);
			this.assertConstantsHaveNotChanged();
		},

		testInitKeyboardEventSetsMetaKeyWithMetaModifier: function () {
			this.initialiseKeyDownEvent(0, 0, 'Meta');
			this.assertMetaKey(true);
			this.assertConstantsHaveNotChanged();
		},

		testInitKeyboardEventDoesNotSetMetaKeyWithNonMetaModfier: function () {
			this.initialiseKeyDownEvent(0, 0, 'Shift');
			this.assertMetaKey(false);
			this.assertConstantsHaveNotChanged();
		},

		testInitKeyboardEventSetsMetaKeyWithMetaInModifiersList: function () {
			this.initialiseKeyDownEvent(0, 0, 'foo bar Meta');
			this.assertMetaKey(true);
			this.assertConstantsHaveNotChanged();
		},

		testInitKeyboardEventDoesNotSetShiftKey: function () {
			this.initialiseKeyDownEvent(0, 0);
			this.assertShiftKey(false);
			this.assertConstantsHaveNotChanged();
		},

		testInitKeyboardEventSetsShiftKeyWithShiftModifier: function () {
			this.initialiseKeyDownEvent(0, 0, 'Shift');
			this.assertShiftKey(true);
			this.assertConstantsHaveNotChanged();
		},

		testInitKeyboardEventDoesNotSetShiftKeyWithNonShiftModfier: function () {
			this.initialiseKeyDownEvent(0, 0, 'foobar');
			this.assertShiftKey(false);
			this.assertConstantsHaveNotChanged();
		},

		testInitKeyboardEventSetsShiftKeyWithShiftInModifiersList: function () {
			this.initialiseKeyDownEvent(0, 0, 'Shift foo bar');
			this.assertShiftKey(true);
			this.assertConstantsHaveNotChanged();
		},

		testGetModifierStateReturnsFalseWithEmptyString: function () {
			this.initialiseKeyDownEvent(0, 0, 'Alt Control Meta Shift');
			this.assertGetModifierState('', false);
			this.assertConstantsHaveNotChanged();
		},

		testGetModifierStateReturnsTrueWithAlt: function () {
			this.initialiseKeyDownEvent(0, 0, 'Alt');
			this.assertGetModifierState('Alt', true);
			this.assertConstantsHaveNotChanged();
		},

		testGetModifierStateReturnsFalseWithAlt: function () {
			this.initialiseKeyDownEvent(0, 0, 'Control');
			this.assertGetModifierState('Alt', false);
			this.assertConstantsHaveNotChanged();
		},

		testGetModifierStateReturnsTrueWithAltGraph: function () {
			this.initialiseKeyDownEvent(0, 0, 'Alt AltGraph');
			this.assertGetModifierState('AltGraph', true);
			this.assertConstantsHaveNotChanged();
		},

		testGetModifierStateReturnsFalseWithAltGraph: function () {
			this.initialiseKeyDownEvent(0, 0, 'Alt Control Meta Shift');
			this.assertGetModifierState('AltGraph', false);
			this.assertConstantsHaveNotChanged();
		},

		testGetModifierStateReturnsTrueWithCapsLock: function () {
			this.initialiseKeyDownEvent(0, 0, 'Alt CapsLock Control');
			this.assertGetModifierState('CapsLock', true);
			this.assertConstantsHaveNotChanged();
		},

		testGetModifierStateReturnsFalseWithCapsLock: function () {
			this.initialiseKeyDownEvent(0, 0, 'foo bar');
			this.assertGetModifierState('CapsLock', false);
			this.assertConstantsHaveNotChanged();
		},

		testGetModifierStateReturnsTrueWithControl: function () {
			this.initialiseKeyDownEvent(0, 0, 'Control Meta');
			this.assertGetModifierState('Control', true);
			this.assertConstantsHaveNotChanged();
		},

		testGetModifierStateReturnsFalseWithControl: function () {
			this.initialiseKeyDownEvent(0, 0, '');
			this.assertGetModifierState('Control', false);
			this.assertConstantsHaveNotChanged();
		},

		testGetModifierStateReturnsTrueWithMeta: function () {
			this.initialiseKeyDownEvent(0, 0, 'Meta Meta');
			this.assertGetModifierState('Meta', true);
			this.assertConstantsHaveNotChanged();
		},

		testGetModifierStateReturnsFalseWithMeta: function () {
			this.initialiseKeyDownEvent(0, 0, 'foo');
			this.assertGetModifierState('Meta', false);
			this.assertConstantsHaveNotChanged();
		},

		testGetModifierStateReturnsTrueWithNumLock: function () {
			this.initialiseKeyDownEvent(0, 0, 'foo bar NumLock');
			this.assertGetModifierState('NumLock', true);
			this.assertConstantsHaveNotChanged();
		},

		testGetModifierStateReturnsFalseWithNumLock: function () {
			this.initialiseKeyDownEvent(0, 0, 'Alt AltGraph CapsLock Control Meta ScrollLock Shift');
			this.assertGetModifierState('NumLock', false);
			this.assertConstantsHaveNotChanged();
		},

		testGetModifierStateReturnsTrueWithScrollLock: function () {
			this.initialiseKeyDownEvent(0, 0, 'Scroll');
			this.assertGetModifierState('Scroll', true);
			this.assertConstantsHaveNotChanged();
		},

		testGetModifierStateReturnsFalseWithScrollLock: function () {
			this.initialiseKeyDownEvent(0, 0);
			this.assertGetModifierState('Scroll', false);
			this.assertConstantsHaveNotChanged();
		},

		testGetModifierStateReturnsTrueWithShift: function () {
			this.initialiseKeyDownEvent(0, 0, 'ShiftShiftShift Shift');
			this.assertGetModifierState('Shift', true);
			this.assertConstantsHaveNotChanged();
		},

		testGetModifierStateReturnsFalseWithShift: function () {
			this.initialiseKeyDownEvent(0, 0, 'ShiftShiftShift');
			this.assertGetModifierState('Shift', false);
			this.assertConstantsHaveNotChanged();
		},

		initialiseKeyDownEvent: function (keyIdentifier, keyLocation, modifiers) {
			this.keyboardEvent.initKeyboardEvent('keydown', true, true, null, keyIdentifier, keyLocation, modifiers);
		},

		assertConstantsHaveNotChanged: function () {
			this.assertSame(0, KeyboardEvent.DOM_KEY_LOCATION_STANDARD);
			this.assertSame(1, KeyboardEvent.DOM_KEY_LOCATION_LEFT);
			this.assertSame(2, KeyboardEvent.DOM_KEY_LOCATION_RIGHT);
			this.assertSame(3, KeyboardEvent.DOM_KEY_LOCATION_NUMPAD);
		},

		assertKeyIdentifier: function (expectedKeyIdentifier) {
			this.assertSame(expectedKeyIdentifier, this.keyboardEvent.keyIdentifier);
		},

		assertKeyLocation: function (expectedKeyLocation) {
			this.assertSame(expectedKeyLocation, this.keyboardEvent.keyLocation);
		},

		assertAltKey: function (expectedAltKeyState) {
			this.assertSame(expectedAltKeyState, this.keyboardEvent.altKey);
		},

		assertCtrlKey: function (expectedCtrlKeyState) {
			this.assertSame(expectedCtrlKeyState, this.keyboardEvent.ctrlKey);
		},

		assertMetaKey: function (expectedMetaKeyState) {
			this.assertSame(expectedMetaKeyState, this.keyboardEvent.metaKey);
		},

		assertShiftKey: function (expectedShiftKeyState) {
			this.assertSame(expectedShiftKeyState, this.keyboardEvent.shiftKey);
		},

		assertGetModifierState: function (modifier, expectedState) {
			this.assertSame(expectedState, this.keyboardEvent.getModifierState(modifier));
		},

		assertSame: function (expected, actual) {
			YAHOO.util.Assert.areSame(expected, actual);
		}
	}));
}());
