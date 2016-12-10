var CustomGroupFilterControl = (function () {
    function CustomGroupFilterControl(testFile) {
        var _this = this;
        this.create = function (elementName, callback) {
            var container = document.getElementById(elementName);
            var groupElementName = "custom-group-list";
            var label = document.createElement("span");
            label.textContent = "Filter:";
            label.setAttribute("style", "margin: 0 0 0 5px");
            container.appendChild(label);
            var customGroupComboBox = document.createElement("div");
            customGroupComboBox.id = groupElementName;
            customGroupComboBox.setAttribute("style", "width: 200px");
            container.appendChild(customGroupComboBox);
            $("#" + groupElementName)
                .kendoDropDownList({
                dataSource: _this.customGroups,
                dataTextField: "groupName",
                dataValueField: "classItem",
                change: function (e) {
                    var tmpCallback = callback;
                    if (tmpCallback) {
                        var control = e.sender;
                        var val = control.dataItem();
                        tmpCallback(val.classItem);
                    }
                }
            });
            var groupList = $("#" + groupElementName).data("kendoDropDownList");
            groupList.list.width(350);
        };
        this.selectedCustomGroupChanged = function () {
        };
        this.setDatasource = function () {
            _this.customGroups = [];
            _this.customGroups.push({ "groupName": "All Students", "classItem": new ClassDefinition(null, 1) });
            if (_this.testFile.hasCustomGroups) {
                Enumerable.From(_this.testFile.customGroups).OrderBy(function (c) { return c.name; })
                    .ForEach(function (c) { return _this.customGroups.push({ "groupName": c.name, "classItem": c }); });
            }
        };
        this.testFile = testFile;
        this.setDatasource();
    }
    return CustomGroupFilterControl;
}());
//# sourceMappingURL=CustomGroupFilterControl.js.map