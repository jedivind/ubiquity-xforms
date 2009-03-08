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
var MIPTester = {
	isDirtyMIP : function (self, sMIPName) {
		var state = self.getMIPState(sMIPName);
		return self.m_MIPSCurrentlyShowing[sMIPName] === undefined ||
			(state.isSet && self.m_MIPSCurrentlyShowing[sMIPName] !== state.value);
	},
	
	testMIPChange : function (self, mip) {
		if (this.isDirtyMIP(self, mip)) {
			self.dirtyState.setDirty(mip);
		}
	},
	
	testMIPChanges : function (self) {
		this.testMIPChange(self, "enabled");
		this.testMIPChange(self, "readonly");
		this.testMIPChange(self, "required");
		this.testMIPChange(self, "valid");
	}
};
