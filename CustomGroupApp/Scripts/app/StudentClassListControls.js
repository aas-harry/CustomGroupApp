var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var StudentClassRow = (function (_super) {
    __extends(StudentClassRow, _super);
    function StudentClassRow(student) {
        var _this = this;
        _super.call(this, null);
        this.hasLanguagePrefs = false;
        this.convert = function (student) {
            _this.id = student.id;
            _this.name = student.name;
            _this.gender = student.gender;
            _this.score = student.score;
            _this.class = student.classNo;
            _this.langPref1 = student.langPref1;
            _this.langPref2 = student.langPref2;
            _this.langPref3 = student.langPref3;
            if (_this.langPref1 !== "" || _this.langPref2 !== "" || _this.langPref3 !== "") {
                _this.hasLanguagePrefs = true;
            }
        };
        this.convert(student);
    }
    return StudentClassRow;
}(kendo.data.ObservableObject));
var StudentClassListControls = (function () {
    function StudentClassListControls() {
        var _this = this;
        this.kendoHelper = new KendoHelper();
        this.createStudentClassInputContainer = function (cell, classItem, editGroupNameCallback, dropCallback) {
            var classGridHeight = classItem.parent.classes.length > 3 && classItem.parent.bandType === BandType.None ? "500px" : "700px";
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
            return _this.createStudentClassGrid(gridElement.id, classItem, editGroupNameCallback, dropCallback);
            ;
        };
        this.createStudentClassGrid = function (element, classItem, editGroupNameCallback, dropCallback) {
            var grid = _this.createClassGrid(element, classItem, editGroupNameCallback);
            $("#" + element).kendoDraggable({
                filter: "tr",
                hint: function (e) {
                    var studentId = e[0].cells[1].textContent;
                    var studentName = e[0].cells[0].textContent;
                    return $("<div id=\"student-" + studentId + "\" style=\"background-color: DarkOrange; color: black\"><div class=\"k-grid k-widget\" style=\"padding=15px\">" + studentName + "</div></div>");
                },
                group: "classGroup"
            });
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
        this.createClassGrid = function (element, classItem, editGroupCallback) {
            var groupNameElementId = "groupname-" + classItem.uid;
            var isUniSex = classItem.parent.parent.parent.testFile.isUnisex;
            var columns;
            if (isUniSex) {
                columns = [
                    { field: "name", title: "Name", width: "200px", attributes: { 'class': "text-nowrap" } },
                    { field: "id", title: "Id", width: "0px", attributes: { 'class': "text-nowrap" } },
                    { field: "gender", title: "Sex", width: "80px", attributes: { 'class': "text-center" } },
                    { field: "score", title: "Score", width: "80px", attributes: { 'class': "text-center" } }
                ];
            }
            else {
                columns = [
                    { field: "name", title: "Name", width: "200px", attributes: { 'class': "text-nowrap" } },
                    { field: "id", title: "Id", width: "0px", attributes: { 'class': "text-nowrap" } },
                    { field: "score", title: "Score", width: "80px", attributes: { 'class': "text-center" } }
                ];
            }
            $("#" + element)
                .kendoGrid({
                columns: columns,
                sortable: {
                    mode: "single",
                    allowUnsort: true
                },
                toolbar: [{ template: kendo.template("Group Name: <input id='" + groupNameElementId + "' style='margin: 0 5px 0 5px' />") }],
                selectable: "row",
                dataSource: []
            });
            $("#" + groupNameElementId)
                .kendoMaskedTextBox({
                value: classItem.name,
                change: editGroupCallback
            });
            // Create name tooltip
            $("#" + element).kendoTooltip({
                filter: "td:nth-child(1)",
                position: "center",
                content: function (e) {
                    var dataItem = $("#" + element).data("kendoGrid").dataItem(e.target.closest("tr"));
                    var student = dataItem;
                    var tooltipText = "<strong>" + student.name + "</strong><br>Gender: " + student.gender + "<br>Composite Score: " + student.score;
                    if (student.hasLanguagePrefs) {
                        tooltipText += "<br><br>1st Language Pref: " + (student.langPref1 === "" ? "None" : student.langPref1);
                        tooltipText += "<br>2nd Language Pref: " + (student.langPref2 === "" ? "None" : student.langPref2);
                        tooltipText += "<br>3rd Language Pref: " + (student.langPref3 === "" ? "None" : student.langPref3);
                    }
                    return "<div style='background-color: lightgoldenrodyellow'><div style='text-align: left; padding: 15px;'>" + tooltipText + "</div></div>";
                }
            }).data("kendoTooltip");
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
    return StudentClassListControls;
}());
var StudentSetListControls = (function () {
    function StudentSetListControls() {
        var _this = this;
        this.kendoHelper = new KendoHelper();
        this.commonUtils = new CommonUtils();
        this.createStudentSetContainer = function (name, cell, studentSets, isCoedSchool, width, height) {
            if (width === void 0) { width = 500; }
            if (height === void 0) { height = 200; }
            _this.uid = _this.commonUtils.createUuid();
            var container = document.createElement("div");
            container.setAttribute("style", "width: " + width + "px; height: " + height + "px; margin: 5px 0 0 0;");
            container.id = name + "-studentsets-" + _this.uid + "-container";
            var gridElement = document.createElement("div");
            gridElement.setAttribute("style", "height: 100%;");
            gridElement.id = name + "-studentsets-" + _this.uid;
            container.appendChild(gridElement);
            cell.appendChild(container);
            return _this.createStudentSetGrid(name, gridElement.id, studentSets, isCoedSchool);
            ;
        };
        this.createStudentSetGrid = function (name, element, studentSets, isCoedSchool) {
            var grid = _this.createStudentSetGridControl(name, element);
            // Populate the grid
            var students = [];
            Enumerable.From(studentSets).ForEach(function (x) { return students.push({ 'names': x.studentList }); });
            grid.dataSource.data(students);
            grid.refresh();
            grid.resize();
            return grid;
        };
        this.createStudentSetGridControl = function (name, element) {
            var columns = [
                { field: "names", title: name + " Students", width: "200px", attributes: { 'class': "text-nowrap" } }
            ];
            $("#" + element)
                .kendoGrid({
                columns: columns,
                sortable: {
                    mode: "single",
                    allowUnsort: true
                },
                selectable: "row",
                dataSource: []
            });
            var grid = $("#" + element).data("kendoGrid");
            return grid;
        };
    }
    return StudentSetListControls;
}());
