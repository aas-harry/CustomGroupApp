var StudentClassListControl = (function () {
    function StudentClassListControl() {
        var _this = this;
        this.kendoHelper = new KendoHelper();
        this.groupHelper = new GroupingHelper();
        this.editClassMode = false;
        this.createStudentClassInputContainer = function (cell, classItem, editGroupNameCallback, updateStudentsCallback, hideClassCallback, dragdropCallback, editClassMode) {
            if (editClassMode === void 0) { editClassMode = false; }
            _this.editGroupNameCallback = editGroupNameCallback;
            _this.updateStudentsCallback = updateStudentsCallback;
            _this.dragdropCallback = dragdropCallback;
            _this.editClassMode = editClassMode;
            _this.hideClassCallback = hideClassCallback;
            _this.classItem = classItem;
            var classGridHeight = classItem.parent.classes.length > 3 && classItem.parent.bandType === BandType.None
                ? "500px"
                : "700px";
            var classGridWidth = classItem.parent.parent.parent.testFile.isUnisex ? "400px" : "300px";
            var container = document.createElement("div");
            container.setAttribute("style", "width: " + classGridWidth + "; height: " + classGridHeight + "; margin: 5px 0 0 0;");
            container.id = "class-" + classItem.uid + "-container";
            var gridElement = document.createElement("div");
            gridElement.setAttribute("style", "height: 100%;");
            gridElement.id = "class-" + classItem.uid;
            var summaryElement = _this.createClassSummary(classItem);
            container.appendChild(gridElement);
            cell.appendChild(container);
            cell.appendChild(summaryElement);
            return _this.createStudentClassGrid(gridElement.id, classItem);
            ;
        };
        this.createStudentClassGrid = function (element, classItem) {
            var grid = _this.createClassGrid(element, classItem);
            $("#" + element)
                .kendoDraggable({
                filter: "tr",
                hint: function (e) {
                    var studentId = e[0].cells[1].textContent;
                    var studentName = e[0].cells[0].textContent;
                    return $("<div id=\"student-" + studentId + "\" style=\"background-color: DarkOrange; color: black\"><div class=\"k-grid k-widget\" style=\"padding=15px\">" + studentName + "</div></div>");
                },
                group: "classGroup"
            });
            var dropCallback = _this.dragdropCallback;
            grid.table.kendoDropTarget({
                drop: function (e) {
                    var targetObject = (Object)(e.draggable.currentTarget[0]);
                    var studentId = parseInt(targetObject.cells[1].textContent);
                    var sourceClass = $(e.draggable.element).attr('id');
                    if (dropCallback("class-" + classItem.uid, sourceClass, studentId)) {
                        var sourceGrid = $("#" + sourceClass).data("kendoGrid");
                        var targetGrid = $("#class-" + classItem.uid).data("kendoGrid");
                        var sourceDatasource = sourceGrid.dataSource.view();
                        var targetDatasource = targetGrid.dataSource.view();
                        for (var i = 0; i < sourceDatasource.length; i++) {
                            if (sourceDatasource[i].id === studentId) {
                                var student = sourceDatasource[i];
                                sourceDatasource.remove(student);
                                targetDatasource.push(student);
                                sourceGrid.refresh();
                                targetGrid.refresh();
                            }
                        }
                    }
                },
                group: "classGroup"
            });
            // Populate the grid
            var students = [];
            Enumerable.From(classItem.students).ForEach(function (x) { return students.push(new StudentClassRow(x)); });
            grid.dataSource.data(students);
            grid.refresh();
            grid.resize();
            return grid;
        };
        this.createClassGrid = function (element, classItem) {
            var self = _this;
            var groupNameElementId = "groupname-" + classItem.uid;
            var updateClassElementId = "updateclass" + classItem.uid;
            var hideClassElementId = "hideclass" + classItem.uid;
            var isUniSex = classItem.parent.parent.parent.testFile.isUnisex;
            var columns;
            if (isUniSex) {
                columns = [
                    { field: "name", title: "Name", width: "200px", attributes: { 'class': "text-nowrap" } },
                    { field: "id", title: "", width: "0px", attributes: { 'class': "text-nowrap" } },
                    { field: "gender", title: "Sex", width: "80px", attributes: { 'class': "text-center" } },
                    { field: "score", title: "Score", width: "80px", attributes: { 'class': "text-center" } }
                ];
            }
            else {
                columns = [
                    { field: "name", title: "Name", width: "200px", attributes: { 'class': "text-nowrap" } },
                    { field: "id", title: "", width: "0px", attributes: { 'class': "text-nowrap" } },
                    { field: "score", title: "Score", width: "80px", attributes: { 'class': "text-center" } }
                ];
            }
            var btnStyle = "style = 'margin-right: 5px'";
            $("#" + element)
                .kendoGrid({
                columns: columns,
                sortable: {
                    mode: "single",
                    allowUnsort: true
                },
                toolbar: [
                    {
                        template: kendo.template(("Group: <input id='" + groupNameElementId + "' style='margin: 0 5px 0 5px' />") +
                            (_this.editClassMode
                                ? "<button id='" + updateClassElementId + "' " + btnStyle + "'>Edit</button>"
                                : "<button id='" + hideClassElementId + "' " + btnStyle + "'>Hide</button>"))
                    }
                ],
                selectable: "row",
                dataSource: []
            });
            // create edit button to add and remove students
            _this.kendoHelper.createKendoButton(updateClassElementId, function (e) {
                var callback = self.updateStudentsCallback;
                if (callback) {
                    callback(classItem, true);
                }
            });
            // Crerate hide button
            _this.kendoHelper.createKendoButton(hideClassElementId, function (e) {
                var callback = self.hideClassCallback;
                if (callback) {
                    callback(classItem);
                }
            });
            // create group name field
            $("#" + groupNameElementId)
                .kendoMaskedTextBox({
                value: classItem.name,
                change: function (e) {
                    var inputControl = e.sender;
                    classItem.name = inputControl.value();
                    if (self.editClassMode) {
                        self.groupHelper.updateGroupName(classItem, function (status) { return self.editGroupNameCallback(classItem, status); });
                    }
                    else {
                        self.editGroupNameCallback(classItem, true);
                    }
                }
            });
            // Create name tooltip
            $("#" + element)
                .kendoTooltip({
                filter: "td:nth-child(1)",
                position: "center",
                content: function (e) {
                    var dataItem = $("#" + element).data("kendoGrid").dataItem(e.target.closest("tr"));
                    var student = dataItem;
                    var tooltipText = "<strong>" + student
                        .name + "</strong><br>Gender: " + student.gender + "<br>Composite Score: " + student.score;
                    if (student.hasLanguagePrefs) {
                        tooltipText += "<br><br>1st Language Pref: " + (student.langPref1 === "" ? "None" : student.langPref1);
                        tooltipText += "<br>2nd Language Pref: " + (student.langPref2 === "" ? "None" : student.langPref2);
                        tooltipText += "<br>3rd Language Pref: " + (student.langPref3 === "" ? "None" : student.langPref3);
                    }
                    return "<div style='background-color: lightgoldenrodyellow'><div style='text-align: left; padding: 15px;'>" + tooltipText + "</div></div>";
                }
            })
                .data("kendoTooltip");
            return $("#" + element).data("kendoGrid");
        };
        this.createClassSummary = function (classItem) {
            var element = document.createElement("div");
            element.id = "summary-" + classItem.uid;
            element.setAttribute("style", "border-style: solid; border-color: #bfbfbf; border-width: 1px; padding: 5px 5px 5px 10px; margin: 5px 0 0 0");
            return _this.createClassSummaryContent(classItem, element);
        };
        this.updateClassSummaryContent = function (classItem) {
            var element = document.getElementById("summary-" + classItem.uid);
            if (element) {
                _this.createClassSummaryContent(classItem, element);
            }
        };
        this.createClassSummaryContent = function (classItem, container) {
            if (container.childElementCount > 0) {
                while (container.hasChildNodes()) {
                    container.removeChild(container.lastChild);
                }
            }
            if (classItem.parent.parent.parent.testFile.isUnisex) {
                var table = document.createElement("table");
                var header = table.createTHead();
                var headerRow = header.insertRow();
                _this.kendoHelper.createLabel(headerRow.insertCell(), "", 400);
                _this.kendoHelper.createLabel(headerRow.insertCell(), "Count", 100, "center");
                _this.kendoHelper.createLabel(headerRow.insertCell(), "Average", 100, "center");
                var body = table.createTBody();
                var schoolRow = body.insertRow();
                _this.kendoHelper.createLabel(schoolRow.insertCell(), "Composite Score Avg.", 400);
                _this.kendoHelper.createNumberLabel(schoolRow.insertCell(), classItem.count, 100);
                _this.kendoHelper.createLabel(schoolRow.insertCell(), classItem.average.toFixed(0), 100);
                schoolRow = body.insertRow();
                _this.kendoHelper.createLabel(schoolRow.insertCell(), "Girls Comp. Score Avg.", 400);
                _this.kendoHelper.createNumberLabel(schoolRow.insertCell(), classItem.girlsCount, 100);
                _this.kendoHelper.createLabel(schoolRow.insertCell(), classItem.girlsAverage.toFixed(0), 100);
                schoolRow = body.insertRow();
                _this.kendoHelper.createLabel(schoolRow.insertCell(), "Boys Comp. Score Avg.", 400);
                _this.kendoHelper.createNumberLabel(schoolRow.insertCell(), classItem.boysCount, 100);
                _this.kendoHelper.createLabel(schoolRow.insertCell(), classItem.boysAverage.toFixed(0), 100);
                container.appendChild(table);
            }
            else {
                var elementCnt = document.createElement("div");
                elementCnt.textContent = "No. of Students: " + classItem.count;
                var elementAvg = document.createElement("div");
                elementAvg.textContent = "Composite Score Avg.: " + Math.round(classItem.average);
                container.appendChild(elementCnt);
                container.appendChild(elementAvg);
            }
            return container;
        };
    }
    return StudentClassListControl;
}());
//# sourceMappingURL=StudentClassListControl.js.map