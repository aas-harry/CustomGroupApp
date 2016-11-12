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
        this.groupingHelper = new GroupingHelper();
        this.customGroupListControl = new CustomGroupListControl();
        this.customClassGridCollection = new CustomClassGridCollection();
        this.splitgroup = function () {
            $.ajax({
                type: "POST",
                url: "CustomGroup\\SplitCustomGroupView",
                contentType: "application/json",
                data: JSON.stringify({ 'groupSetId': _this.selectedClass.groupSetid }),
                success: function (html) {
                    $("#content").replaceWith("<div id='content'></div>");
                    $("#content").append(html);
                },
                error: function (e) {
                }
            });
        };
        this.create = function () {
            $.ajax({
                type: "POST",
                url: "CustomGroup\\CustomGroupWizard",
                success: function (html) {
                    $("#content").replaceWith("<div id='content'></div>");
                    $("#content").append(html);
                },
                error: function (e) {
                }
            });
        };
        this.delete = function () {
            var self = _this;
            var selectedItems = _this.customGroupListControl.selectedItems;
            if (selectedItems.length === 0) {
                var selectedItem = _this.customGroupListControl.selectedItem;
                if (selectedItem) {
                    selectedItems.push(selectedItem);
                }
            }
            if (selectedItems.length === 0) {
                return;
            }
            _this.set("message", "Deleting selected custom groups...");
            _this.set("hasMessage", true);
            _this.groupingHelper.deleteClasses(Enumerable.From(selectedItems).Select(function (x) { return x.groupSetid; }).ToArray(), _this.classesDefn.testFile.fileNumber, function (status) {
                if (status) {
                    self.customGroupListControl.deleteClassItems(selectedItems);
                }
                self.set("message", null);
                _this.set("hasMessage", false);
            });
        };
        this.showCustomGroups = function (elementName) {
            _this.customGroupListControl.create(document.getElementById(elementName), _this.testInfo.customGroups, _this.onSelectedCustomGroups, _this.onSelectedCustomGroup);
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