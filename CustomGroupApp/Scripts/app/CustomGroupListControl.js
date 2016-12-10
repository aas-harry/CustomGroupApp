var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var CustomGroupRowViewModel = (function (_super) {
    __extends(CustomGroupRowViewModel, _super);
    function CustomGroupRowViewModel(classItem) {
        var _this = this;
        _super.call(this);
        this.updateProperties = function (classItem) {
            _this.set("name", classItem.name);
            _this.set("groupSetId", classItem.groupSetid);
            _this.set("studentCount", classItem.count);
        };
        this.source = classItem;
        this.updateProperties(classItem);
    }
    return CustomGroupRowViewModel;
}(kendo.data.ObservableObject));
// Create a custom group list control
var CustomGroupListControl = (function () {
    function CustomGroupListControl() {
        var _this = this;
        this.kendoHelper = new KendoHelper();
        this.dataSource = new Array();
        this._selectedItems = new Array();
        this.resetSelectedItems = function () {
            _this._selectedItems = [];
            for (var _i = 0, _a = _this.classItems; _i < _a.length; _i++) {
                var classItem = _a[_i];
                classItem.isSelected = false;
            }
        };
        this.create = function (parentElement, classItems, selectedItemsCallback, selectedItemCallback) {
            _this.classItems = classItems;
            _this.resetSelectedItems();
            _this.selectedItemCallback = selectedItemCallback;
            _this.selectedItemsCallback = selectedItemsCallback;
            var gridElement = document.createElement("div");
            gridElement.setAttribute("style", "width: 370px; height: 100%;");
            gridElement.id = "class-list";
            parentElement.appendChild(gridElement);
            return _this.createClassList(gridElement.id);
            ;
        };
        this.deleteClassItems = function (classItems) {
            _this.resetSelectedItems();
            _this.classItems = Enumerable.From(_this.classItems).Except(classItems, function (x) { return x.groupSetid; }).ToArray();
            _this.setDatasouce();
        };
        this.addClassItems = function (classItems) {
            _this.resetSelectedItems();
            for (var _i = 0, classItems_1 = classItems; _i < classItems_1.length; _i++) {
                var classItem = classItems_1[_i];
                _this.classItems.push(classItem);
            }
            _this.setDatasouce(classItems.length > 0 ? classItems[0] : null);
        };
        this.updateClassItem = function (classItem) {
            var item = Enumerable.From(_this.classItems).FirstOrDefault(null, function (x) { return x.groupSetid === classItem.groupSetid; });
            if (item) {
                item.name = classItem.name;
                item.count = classItem.count;
                item.copy(classItem);
            }
            var row = Enumerable.From(_this.dataSource).FirstOrDefault(null, function (x) { return x.groupSetId === classItem.groupSetid; });
            if (row) {
                row.updateProperties(classItem);
            }
        };
        this.showSelectedItems = function () {
            _this._selectedItems = Enumerable.From(_this.classItems)
                .Where(function (s) { return s.isSelected; })
                .ToArray();
            if (_this._selectedItems.length > 0) {
                _this.selectedItemsCallback(Enumerable.From(_this._selectedItems).Select(function (x) { return x.groupSetid; }).ToArray());
            }
            else {
                if (_this._selectedItem) {
                    _this.selectedItemsCallback(Enumerable.From([_this._selectedItem]).Select(function (x) { return x.groupSetid; }).ToArray());
                }
            }
        };
        //on click of the checkbox:
        this.toggleSelectedItem = function (e) {
            var checkBox = e.target;
            if (!checkBox) {
                return;
            }
            var self = _this;
            var row = $(checkBox).closest("tr");
            var item = _this.gridControl.dataItem(row);
            var classDefn = Enumerable.From(self.classItems)
                .FirstOrDefault(null, function (s) { return s.groupSetid === item.get("groupSetId"); });
            if (!classDefn) {
                return;
            }
            classDefn.isSelected = checkBox.checked;
            self.showSelectedItems();
        };
        this.createClassList = function (element) {
            var self = _this;
            $("#" + element)
                .kendoGrid({
                columns: [
                    {
                        width: "30px",
                        template: "<input type='checkbox' class='checkbox-select' />",
                        headerTemplate: '<input type="checkbox" id="check-all" />'
                    },
                    {
                        field: "name", title: "Select All", width: "200px",
                        attributes: { 'class': "text-nowrap" }
                    },
                    {
                        field: "studentCount",
                        title: "Count",
                        width: "50px",
                        attributes: { 'class': "text-nowrap", 'style': "text-align: center" }
                    }
                ],
                sortable: {
                    mode: "single",
                    allowUnsort: true
                },
                selectable: "row",
                dataSource: [],
                dataBound: function (e) {
                    this.element.find("tbody tr:first").addClass("k-state-selected");
                    var row = this.select().closest("tr");
                    var value = this.dataItem(row);
                    self.selectedItem = (value)
                        ? Enumerable.From(self.classItems)
                            .FirstOrDefault(null, function (s) { return s.groupSetid === value.get("groupSetId"); })
                        : null;
                },
                change: function (e) {
                    var gridControl = e.sender;
                    var row = gridControl.select().closest("tr");
                    var value = gridControl.dataItem(row);
                    self.selectedItem = (value)
                        ? Enumerable.From(self.classItems)
                            .FirstOrDefault(null, function (s) { return s.groupSetid === value.get("groupSetId"); })
                        : null;
                }
            });
            _this.gridControl = $("#" + element).data("kendoGrid");
            //bind click event to the checkbox
            _this.gridControl.table.on("click", ".checkbox-select", _this.toggleSelectedItem);
            $("#check-all")
                .click(function (e) {
                var checkBox = e.target;
                if (!checkBox) {
                    return;
                }
                _this.toggleAllItemsSelections(checkBox.checked);
            });
            _this.setDatasouce();
            return _this.gridControl;
        };
        this.setDatasouce = function (classItem) {
            if (classItem === void 0) { classItem = null; }
            _this.dataSource = [];
            Enumerable.From(_this.classItems)
                .ForEach(function (s) { return _this.dataSource.push(new CustomGroupRowViewModel(s)); });
            // Populate the grid
            _this.gridControl.dataSource.data(_this.dataSource);
            _this.gridControl.refresh();
            _this.gridControl.resize();
            if (classItem) {
                var self_1 = _this;
                var foundIt_1 = false;
                $.each(_this.gridControl.tbody.find('tr'), function () {
                    var foundItem = self_1.gridControl.dataItem(this);
                    if (foundItem.get("groupSetId") === classItem.groupSetid) {
                        $('[data-uid=' + foundItem.uid + ']').addClass('k-state-selected');
                        self_1.selectedItem = (foundItem)
                            ? Enumerable.From(self_1.classItems)
                                .FirstOrDefault(null, function (s) { return s.groupSetid === foundItem.get("groupSetId"); })
                            : null;
                        foundIt_1 = true;
                        return false;
                    }
                });
                //calculate scrollTop distance
                if (foundIt_1) {
                    var scrollContentOffset = _this.gridControl.element.find("tbody").offset().top;
                    var selectContentOffset = _this.gridControl.select().offset().top;
                    var distance = selectContentOffset - scrollContentOffset;
                    _this.gridControl.element.find(".k-grid-content")
                        .animate({
                        scrollTop: distance
                    }, 400);
                }
            }
        };
    }
    Object.defineProperty(CustomGroupListControl.prototype, "selectedItems", {
        get: function () {
            return this._selectedItems;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(CustomGroupListControl.prototype, "selectedItem", {
        get: function () {
            return this._selectedItem;
        },
        set: function (newValue) {
            if (this._selectedItem === newValue) {
                return;
            }
            this._selectedItem = newValue;
            // an item has been selected from check box, do not display the selected item
            if (this.selectedItems.length > 0 || !newValue) {
                return;
            }
            var tmpCallback = this.selectedItemCallback;
            if (tmpCallback != null) {
                tmpCallback(newValue);
            }
        },
        enumerable: true,
        configurable: true
    });
    CustomGroupListControl.prototype.toggleAllItemsSelections = function (checked) {
        var self = this;
        for (var _i = 0, _a = self.classItems; _i < _a.length; _i++) {
            var classItem = _a[_i];
            classItem.isSelected = checked;
        }
        $(".checkbox-select").prop("checked", checked);
        self.showSelectedItems();
    };
    return CustomGroupListControl;
}());
//# sourceMappingURL=CustomGroupListControl.js.map