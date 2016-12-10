var StudentFilterControl = (function () {
    function StudentFilterControl(testFile) {
        var _this = this;
        this.create = function (elementName, callback) {
            var container = document.getElementById(elementName);
            _this.addCustomGroupFiler(container, callback);
            if (_this.testFile.isUnisex) {
                _this.addGenderFiler(container, callback);
            }
        };
        this.addCustomGroupFiler = function (container, callback) {
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
                        var classItem = val.classItem;
                        if (classItem) {
                            tmpCallback(_this.testFile.filterTestByGroup(classItem));
                        }
                    }
                }
            });
            var groupList = $("#" + groupElementName).data("kendoDropDownList");
            groupList.list.width(350);
        };
        this.addGenderFiler = function (container, callback) {
            var genderElementName = "gender-filter";
            var genderCombobox = document.createElement("div");
            genderCombobox.id = genderElementName;
            genderCombobox.setAttribute("style", "width: 90px");
            container.appendChild(genderCombobox);
            var genders = [
                { "name": "CoEd", "gender": Gender.All },
                { "name": "Female", "gender": Gender.Girls },
                { "name": "Male", "gender": Gender.Boys }
            ];
            $("#" + genderElementName)
                .kendoDropDownList({
                dataSource: genders,
                dataTextField: "name",
                dataValueField: "gender",
                change: function (e) {
                    var tmpCallback = callback;
                    if (tmpCallback) {
                        var control = e.sender;
                        var val = control.dataItem();
                        var gender = val.gender;
                        if (gender) {
                            tmpCallback(_this.testFile.filterByGender(gender));
                        }
                    }
                }
            });
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
    return StudentFilterControl;
}());
//# sourceMappingURL=StudentFilterControl.js.map