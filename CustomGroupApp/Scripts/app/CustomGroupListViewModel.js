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
        this.customGroupListControl = new CustomGroupListControl();
        this.customClassGridCollection = new CustomClassGridCollection();
        this.create = function () {
            var myself = _this;
            $.ajax({
                type: "POST",
                url: "CustomGroup\\SplitCustomGroupView",
                data: { 'groupSetId': myself.selectedClass.groupSetid },
                success: function (html) {
                    $("#content").replaceWith("<div id='content'></div>");
                    $("#content").append(html);
                },
                error: function (e) {
                }
            });
        };
        this.regroup = function () {
        };
        this.edit = function () {
        };
        this.delete = function () {
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
            console.log("onClassChanged: " + classItem.groupSetid, classItem.name);
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