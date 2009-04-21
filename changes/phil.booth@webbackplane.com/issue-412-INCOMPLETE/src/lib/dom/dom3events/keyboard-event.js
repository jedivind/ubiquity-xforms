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

if (typeof KeyboardEvent !== 'function') {
	KeyboardEvent = function () {
		var self = UIEvent();

		self.initKeyboardEvent = function (type, bubbles, cancelable, view,
		                                   keyIdentifier, keyLocation, modifiers) {
			self.initUIEvent(type, bubbles, cancelable, view);

			self.keyIdentifier = keyIdentifier || KEY_UNIDENTIFIED;
			self.keyLocation = keyLocation;
			self.altKey = false;
			self.ctrlKey = false;
			self.metaKey = false;
			self.shiftKey = false;

			parseModifiers(modifiers);
		};

		self.getModifierState = function (keyIdentifier) {
			switch (keyIdentifier) {
				case KEY_ALT:
					return self.altKey;
				case KEY_ALTGRAPH:
					return altGraphKey;
				case KEY_CAPSLOCK:
					return capsLockKey;
				case KEY_CTRL:
					return self.ctrlKey;
				case KEY_META:
					return self.metaKey;
				case KEY_NUMLOCK:
					return numLockKey;
				case KEY_SCROLLLOCK:
					return scrollLockKey;
				case KEY_SHIFT:
					return self.shiftKey;
			}

			return false;
		};

		var KEY_ALT = 'Alt',
		    KEY_ALTGRAPH = 'AltGraph',
		    KEY_CAPSLOCK = 'CapsLock',
		    KEY_CTRL = 'Control',
		    KEY_META = 'Meta',
		    KEY_NUMLOCK = 'NumLock',
		    KEY_SCROLLLOCK = 'Scroll',
		    KEY_SHIFT = 'Shift',
		    KEY_UNIDENTIFIED = 'Unidentified',
		    altGraphKey = false,
		    capsLockKey = false,
		    numLockKey = false,
		    scrollLockKey = false,

		parseModifiers = function (modifiers) {
			if (typeof modifiers === 'string') {
				parseModifiersString(modifiers);
			}
		},

		parseModifiersString = function (modifiersString) {
			var modifiersArray = modifiersString.split(' '), i;
			for (i = 0; i < modifiersArray.length; ++i) {
				parseModifierToken(modifiersArray[i]);
			}
		},

		parseModifierToken = function (modifierToken) {
			switch (modifierToken) {
				case KEY_ALT:
					self.altKey = true;
					break;
				case KEY_ALTGRAPH:
					altGraphKey = true;
					break;
				case KEY_CAPSLOCK:
					capsLockKey = true;
					break;
				case KEY_CTRL:
					self.ctrlKey = true;
					break;
				case KEY_META:
					self.metaKey = true;
					break;
				case KEY_NUMLOCK:
					numLockKey = true;
					break;
				case KEY_SCROLLLOCK:
					scrollLockKey = true;
					break;
				case KEY_SHIFT:
					self.shiftKey = true;
					break;
			}
		};

		return self;
	};

	KeyboardEvent.DOM_KEY_LOCATION_STANDARD = 0;
	KeyboardEvent.DOM_KEY_LOCATION_LEFT = 1;
	KeyboardEvent.DOM_KEY_LOCATION_RIGHT = 2;
	KeyboardEvent.DOM_KEY_LOCATION_NUMPAD = 3;
}
