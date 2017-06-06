var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var CustomGroupListViewModel = (function (_super) {
    __extends(CustomGroupListViewModel, _super);
    function CustomGroupListViewModel() {
        var _this = this;
        _super.call(this);
        this.popupWindowContainer = "popup-window-container";
        this.groupingHelper = new GroupingHelper();
        this.messageBox = new MessageBoxDialog();
        this.customGroupListControl = new CustomGroupListControl();
        this.customClassGridCollection = new CustomClassGridCollection();
        this.add = function () {
            var self = _this;
            var studentSelector = new AddCustomGroupDialog();
            studentSelector.openDialog(document.getElementById("popup-window-container"), _this.classesDefn.students, function (groupName, students) {
                var classItem = self.testInfo.addCustomGroup({
                    "Name": groupName,
                    "Students": Enumerable.From(students).Select(function (s) { return s.studentId; }).ToArray(),
                    "GroupSetId": 0,
                    "Streaming": StreamType.None
                });
                self.groupingHelper.addClass(self.classesDefn.testFile.fileNumber, classItem, function (status, item) {
                    if (status) {
                        classItem.name = item.Name;
                        classItem.groupSetid = item.Id;
                        self.customGroupListControl.addClassItems([classItem]);
                    }
                    else {
                        toastr.info("Failed to add custom group.");
                    }
                });
            }, 30);
        };
        this.regroup = function () {
            var selectedItems = _this.getSelectedItems();
            if (selectedItems.length === 0) {
                return;
            }
            $.ajax({
                type: "POST",
                url: "..\\CustomGroup\\SplitCustomGroupView",
                contentType: "application/json",
                data: JSON.stringify({ 'groupSetIds': Enumerable.From(selectedItems).Select(function (x) { return x.groupSetid; }).ToArray() }),
                success: function (html) {
                    $("#reportContent").replaceWith(html);
                },
                error: function (e) {
                }
            });
        };
        this.create = function () {
            $.ajax({
                type: "POST",
                url: "..\\CustomGroup\\CustomGroupWizard",
                success: function (html) {
                    $("#reportContent").replaceWith(html);
                },
                error: function (e) {
                }
            });
        };
        this.delete = function () {
            var self = _this;
            var selectedItems = _this.getSelectedItems();
            if (selectedItems.length === 0) {
                _this.messageBox.showInfoDialog(_this.popupWindowContainer, "Please select a custom group to delete.", "Delete Custom Groups", 120, 450, null);
                return;
            }
            _this.messageBox.showYesNoDialog(_this.popupWindowContainer, "Do you want to delete the selected custom groups (" +
                selectedItems.length + (selectedItems.length === 1 ? " item)" : " items)") +
                "?", "Delete Custom Groups", 120, 450, function (status) {
                if (status !== DialogResult.Yes) {
                    return;
                }
                _this.set("message", "Deleting selected custom groups...");
                _this.set("hasMessage", true);
                _this.groupingHelper.deleteClasses(Enumerable.From(selectedItems).Select(function (x) { return x.groupSetid; }).ToArray(), _this.classesDefn.testFile.fileNumber, function (status) {
                    if (status) {
                        self.customClassGridCollection.clear();
                        self.testInfo.customGroups = Enumerable.From(self.testInfo.customGroups).Except(selectedItems, function (x) { return x.groupSetid; }).ToArray();
                        self.customGroupListControl.deleteClassItems(selectedItems);
                    }
                    self.set("message", null);
                    _this.set("hasMessage", false);
                });
            });
        };
        this.merge = function () {
            var self = _this;
            var selectedItems = _this.getSelectedItems();
            if (selectedItems.length <= 1) {
                _this.messageBox.showInfoDialog("popup-window-container", "Please select one or more groups to merge.", "Merge");
                return;
            }
            var initialName = undefined;
            for (var _i = 0, selectedItems_1 = selectedItems; _i < selectedItems_1.length; _i++) {
                var g = selectedItems_1[_i];
                initialName = initialName ? initialName + ", " + g.name : g.name;
            }
            var msg = "You have selected " + selectedItems.length + " custom groups. Please enter new custom group name (max 80 chars).";
            _this.messageBox.showInputDialog("popup-window-container", msg, "Merge", function (e) {
                if (e == DialogResult.No) {
                    return true;
                }
                var input = document.getElementById("input-text");
                var groupName = input.value;
                if (!groupName) {
                    toastr.warning("Custom group name must not be blank.");
                    return false;
                }
                if (groupName.length > 80) {
                    toastr.warning("Custom group name must be less than 80 characters.");
                    return false;
                }
                _this.set("message", "merging selected custom groups...");
                _this.set("hasMessage", true);
                _this.groupingHelper.mergeClasses(Enumerable.From(selectedItems).Select(function (x) { return x.groupSetid; }).ToArray(), _this.classesDefn.testFile.fileNumber, groupName, function (status, item) {
                    if (status) {
                        var classItem = self.testInfo.addCustomGroup(item);
                        self.customGroupListControl.addClassItems([classItem]);
                    }
                    self.set("message", null);
                    _this.set("hasMessage", false);
                });
                return true;
            }, initialName, 135, 520);
        };
        this.exportToCsv = function () {
            var selectedItems = _this.getSelectedItems();
            if (selectedItems.length === 0) {
                return;
            }
            _this.groupingHelper.exportGroupSetIds(_this.classesDefn.testFile, Enumerable.From(selectedItems).Select(function (x) { return x.groupSetid; }).ToArray(), "csv", function (status, msg) { });
        };
        this.exportToExcel = function () {
            var selectedItems = _this.getSelectedItems();
            if (selectedItems.length === 0) {
                return;
            }
            _this.groupingHelper.exportGroupSetIds(_this.classesDefn.testFile, Enumerable.From(selectedItems).Select(function (x) { return x.groupSetid; }).ToArray(), "excel", function (status, msg) { });
        };
        this.getSelectedItems = function () {
            var selectedItems = _this.customGroupListControl.selectedItems;
            if (selectedItems.length === 0) {
                var selectedItem = _this.customGroupListControl.selectedItem;
                if (selectedItem) {
                    selectedItems.push(selectedItem);
                }
            }
            return selectedItems;
        };
        this.showCustomGroups = function (elementName) {
            var customGroupSets = Enumerable.From(_this.testInfo.customGroups).Where(function (s) { return s.groupSetid > 0; }).ToArray();
            _this.customGroupListControl.create(document.getElementById(elementName), customGroupSets, _this.onSelectedCustomGroups, _this.onSelectedCustomGroup);
        };
        this.setDatasource = function (testFile) {
            _this.testInfo = testFile;
            _this.classesDefn = new ClassesDefinition(testFile, null);
            _this.bandSet = new BandSet(_this.classesDefn, "Custom", 0);
        };
        this.onClassChanged = function (classItem) {
            _this.customGroupListControl.updateClassItem(classItem);
        };
        this.onSelectedCustomGroup = function (item) {
            var self = _this;
            self.selectedClass = item;
            self.bandSet.createBands("Custom", _this.selectedClass.count, 1);
            self.bandSet.bands[0].setClassCount(1);
            self.bandSet.bands[0].classes[0].copy(self.selectedClass);
            _this.customClassGridCollection.initTable("#classes-settings-container", _this.bandSet.bands, true, _this.classesDefn.students);
        };
        this.onSelectedCustomGroups = function (items) {
            var self = _this;
            if (items.length > 20) {
                items = Enumerable.From(items).Take(20).ToArray();
            }
            var classItems = new Array();
            var studentCount = 0;
            var itemLookup = Enumerable.From(items).ToDictionary(function (x) { return x; }, function (x) { return x; });
            for (var _i = 0, _a = self.testInfo.customGroups; _i < _a.length; _i++) {
                var item = _a[_i];
                if (itemLookup.Contains(item.groupSetid)) {
                    studentCount += item.count;
                    classItems.push(item);
                }
            }
            self.bandSet.createBands("Custom", studentCount, 1);
            self.bandSet.bands[0].setClassCount(classItems.length);
            var i = 0;
            for (var _b = 0, classItems_1 = classItems; _b < classItems_1.length; _b++) {
                var item = classItems_1[_b];
                self.bandSet.bands[0].classes[i].copy(item);
                i++;
            }
            self.customClassGridCollection.initTable("#classes-settings-container", self.bandSet.bands, true, _this.classesDefn.students);
        };
        this.customClassGridCollection.classChangedCallback = this.onClassChanged;
    }
    return CustomGroupListViewModel;
}(kendo.data.ObservableObject));
//# sourceMappingURL=CustomGroupListViewModel.js.map