var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var CustomGroupViewModel = (function (_super) {
    __extends(CustomGroupViewModel, _super);
    function CustomGroupViewModel(containerElementName, studentCount, rootSite) {
        var _this = this;
        _super.call(this);
        this.containerElementName = containerElementName;
        this.studentCount = studentCount;
        this.stepCollection = new StepCollection();
        this.testInfo = new TestFile();
        this._genderOption = "All";
        this.selectedGroupingOption = "MixedAbility";
        this.selectedStreamingOption = "OverallAbilty";
        this.selectedTopClassGroupingOption = "Streaming";
        this.selectedLowestClassGroupingOption = "Streaming";
        this.mixGirlsBoysOption = false;
        this.currentGroupStep = 1;
        this.isLastStep = false;
        this.isFirstStep = true;
        this.isCoedSchool = true;
        this.studentCountInAllClasses = 0;
        this.classCount = 1;
        this.joinedStudents = [];
        this.separatedStudents = [];
        this.hasErrors = false;
        this.hasHiddenClasses = false;
        this.commonUtils = new CommonUtils();
        this.groupingHelper = new GroupingHelper();
        this.nextStep = function () {
            _super.prototype.set.call(_this, "currentGroupStep", _this.currentGroupStep + 1);
            _this.callGetViewStep(_this.currentGroupStep, _this.containerElementName);
        };
        this.previousStep = function () {
            _super.prototype.set.call(_this, "currentGroupStep", _this.currentGroupStep - 1);
            _this.callGetViewStep(_this.currentGroupStep, _this.containerElementName);
        };
        this.startOver = function () {
            _this.reset();
            _super.prototype.set.call(_this, "currentGroupStep", 1);
            _this.callGetViewStep(_this.currentGroupStep, _this.containerElementName);
        };
        this.showStudentGroupingOption = function (joinedStudentsCell, separatedStudentsCell) {
            _this.pairedStudentsControl.createStudentSetContainer(joinedStudentsCell, _this.classesDefn.testFile.isUnisex);
            _this.separatedStudentsControl.createStudentSetContainer(separatedStudentsCell, _this.classesDefn.testFile.isUnisex);
        };
        this.showAllClasses = function (e) {
            var vm = _this.selectedClassDefinitionViewModel;
            if (vm) {
                vm.showAllClasses();
                _this.set("hasHiddenClasses", false);
                kendo.bind($("#custom-group-container"), _this);
            }
        };
        this.hideClass = function (e) {
            var vm = _this.selectedClassDefinitionViewModel;
            if (vm) {
                vm.hideClass(_this.commonUtils.getUid(e.target.id));
                _this.set("hasHiddenClasses", true);
                kendo.bind($("#custom-group-container"), _this);
            }
        };
        this.addPairStudent = function (e) {
            if (!_this.pairedStudentsControl.onAddPairStudent(e.target.id)) {
                _this.separatedStudentsControl.onAddPairStudent(e.target.id);
            }
        };
        this.editPairStudent = function (e) {
            if (!_this.pairedStudentsControl.onEditPairStudent(e.target.id)) {
                _this.separatedStudentsControl.onEditPairStudent(e.target.id);
            }
        };
        this.deletePairStudent = function (e) {
            if (!_this.pairedStudentsControl.onDeletePairStudent(e.target.id)) {
                _this.separatedStudentsControl.onDeletePairStudent(e.target.id);
            }
        };
        this.reset = function () {
            _this.bandSet = _this.classesDefn.createBandSet("class", _this.studentCount);
            _this.bandSet.bands[0].setClassCount(3);
            _this.preAllocatedBandset = _this.classesDefn.createBandSet("class", _this.studentCount);
            _this.bandSet.bands[0].setClassCount(1);
            _this.customBandSet = _this.classesDefn.createBandSet("Band", _this.studentCount, 2);
            _this.languageBandSet = _this.classesDefn.createBandSet("Band", _this.studentCount, 1);
            _this.topMiddleLowestBandSet = _this.classesDefn.createTopMiddleBottomBandSet("class", _this.studentCount);
            _this.set("selectedClassDefinitionViewModel", _this.classDefinitionViewModel);
        };
        //
        this.setDatasource = function (test, results, languages) {
            var testInfo = new TestFile();
            testInfo.set(test, results, languages);
            _this.isCoedSchool = testInfo.isUnisex;
            _this.studentCount = testInfo.studentCount;
            _this.studentCountInAllClasses = testInfo.studentCount;
            _this.classesDefn = new ClassesDefinition(testInfo);
            _this.pairedStudentsControl = new StudentSetListControl("Paired", _this.joinedStudents, _this.classesDefn.students, document.getElementById("popup-window-container"));
            _this.separatedStudentsControl = new StudentSetListControl("Separated", _this.separatedStudents, _this.classesDefn.students, document.getElementById("popup-window-container"));
            _this.reset();
        };
        this.onStudentCountChanged = function (count) {
            // set the total number students in all classes
            _this.set("studentCountInAllClasses", count);
            if (_this.studentCount !== _this.studentCountInAllClasses) {
                _this.set("hasErrors", true);
                _this.set("errorMessage", "The total number students in all classes doesn't match with number of students in test file");
            }
            else {
                _this.set("hasErrors", false);
                _this.set("errorMessage", "");
            }
        };
        this.rootSite = rootSite;
        this.studentCount = studentCount;
    }
    Object.defineProperty(CustomGroupViewModel.prototype, "selectedGenderOption", {
        // ReSharper restore InconsistentNaming
        get: function () {
            return this._genderOption;
        },
        set: function (value) {
            this._genderOption = value;
            var gender = this.commonUtils.genderFromString(value);
            this.set("studentCount", this.classesDefn.genderStudentCount(gender));
            this.set("studentCountInAllClasses", this.studentCount);
            this.selectedClassDefinitionViewModel.genderChanged(gender, this.studentCount);
        },
        enumerable: true,
        configurable: true
    });
    ;
    ;
    Object.defineProperty(CustomGroupViewModel.prototype, "testNumber", {
        get: function () {
            return this.testInfo ? this.testInfo.fileNumber : 0;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(CustomGroupViewModel.prototype, "topClassGroupingOption", {
        // Radio button value is string type and they need to be converted to enum
        get: function () {
            var selectedTopClassGroupingOption = this.selectedTopClassGroupingOption;
            return this.groupingHelper.convertGroupingOptionFromString(selectedTopClassGroupingOption);
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(CustomGroupViewModel.prototype, "lowestClassGroupingOption", {
        get: function () {
            var selectedLowestClassGroupingOption = this.selectedLowestClassGroupingOption;
            return this.groupingHelper.convertGroupingOptionFromString(selectedLowestClassGroupingOption);
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(CustomGroupViewModel.prototype, "groupingOption", {
        get: function () {
            var selectedGroupingOption = this.selectedGroupingOption;
            return this.groupingHelper.convertGroupingOptionFromString(selectedGroupingOption);
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(CustomGroupViewModel.prototype, "streamType", {
        get: function () {
            return this.groupingHelper.convertStreamTypeFromString(this.selectedStreamingOption);
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(CustomGroupViewModel.prototype, "genderOption", {
        get: function () {
            return this.groupingHelper.convertGenderFromString(this.selectedGenderOption);
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(CustomGroupViewModel.prototype, "classDefinitionViewModel", {
        get: function () {
            if (this._classDefinitionViewModel === undefined) {
                this._classDefinitionViewModel = new ClassDefinitionViewModel(this.studentCount, this.onStudentCountChanged);
            }
            return this._classDefinitionViewModel;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(CustomGroupViewModel.prototype, "preAllocatedClassDefinitionViewModel", {
        get: function () {
            if (this._preAllocatedClassDefinitionViewModel === undefined) {
                this._preAllocatedClassDefinitionViewModel = new PreallocatedClassDefinitionViewModel(this.studentCount, this.onStudentCountChanged);
            }
            return this._preAllocatedClassDefinitionViewModel;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(CustomGroupViewModel.prototype, "topMiddleLowestBandClassDefinitionViewModel", {
        get: function () {
            if (this._topMiddleLowestBandClassDefinitionViewModel === undefined) {
                this._topMiddleLowestBandClassDefinitionViewModel = new TopMiddleLowestBandClassDefinitionViewModel(this.studentCount, this.onStudentCountChanged);
            }
            return this._topMiddleLowestBandClassDefinitionViewModel;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(CustomGroupViewModel.prototype, "bandClassDefinitionViewModel", {
        get: function () {
            if (this._bandClassDefinitionViewModel === undefined) {
                this._bandClassDefinitionViewModel = new BandClassDefinitionViewModel(this.studentCount, this.onStudentCountChanged);
            }
            return this._bandClassDefinitionViewModel;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(CustomGroupViewModel.prototype, "languageBandClassDefinitionViewModel", {
        get: function () {
            if (this._languageBandClassDefinitionViewModel === undefined) {
                this._languageBandClassDefinitionViewModel = new LanguageBandClassDefinitionViewModel(this.studentCount, this.onStudentCountChanged);
            }
            return this._languageBandClassDefinitionViewModel;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(CustomGroupViewModel.prototype, "generateCustomGroupViewModel", {
        get: function () {
            if (this._generateCustomGroupViewModel === undefined) {
                this._generateCustomGroupViewModel = new GenerateCustomGroupViewModel(this.studentCount, this.onStudentCountChanged);
            }
            return this._generateCustomGroupViewModel;
        },
        enumerable: true,
        configurable: true
    });
    CustomGroupViewModel.prototype.callGetViewStep = function (stepNo, containerElementName) {
        _super.prototype.set.call(this, "isFirstStep", this.stepCollection.isFirstStep(stepNo));
        _super.prototype.set.call(this, "isLastStep", this.stepCollection.isLastStep(stepNo));
        var viewName = this.stepCollection.getStepView(this.groupingOption, stepNo);
        console.log("View: ", viewName);
        if (!viewName) {
            return;
        }
        $.ajax({
            type: "POST",
            url: "Customgroup\\" + viewName,
            dataType: "html",
            success: function (data) {
                $("#" + containerElementName).html(data);
            }
        });
    };
    CustomGroupViewModel.prototype.loadGroupingViewModel = function () {
        switch (this.groupingOption) {
            case GroupingMethod.Banding:
                this.bandClassDefinitionViewModel.loadOptions(this.customBandSet);
                this.set("selectedClassDefinitionViewModel", this.bandClassDefinitionViewModel);
                break;
            case GroupingMethod.TopMiddleLowest:
                this.topMiddleLowestBandClassDefinitionViewModel.loadOptions(this.topMiddleLowestBandSet);
                this.set("selectedClassDefinitionViewModel", this.topMiddleLowestBandClassDefinitionViewModel);
                break;
            case GroupingMethod.Language:
                if (!this.languageBandClassDefinitionViewModel.students ||
                    this.languageBandClassDefinitionViewModel.students.length === 0) {
                    this.languageBandClassDefinitionViewModel.students = this.classesDefn.students;
                }
                this.languageBandClassDefinitionViewModel.loadOptions(this.languageBandSet);
                this.set("selectedClassDefinitionViewModel", this.languageBandClassDefinitionViewModel);
                break;
            case GroupingMethod.Preallocated:
                this.preAllocatedClassDefinitionViewModel.loadOptions(this.preAllocatedBandset);
                this.set("selectedClassDefinitionViewModel", this.preAllocatedClassDefinitionViewModel);
                break;
            default:
                this.classDefinitionViewModel.loadOptions(this.bandSet);
                this.set("selectedClassDefinitionViewModel", this.classDefinitionViewModel);
                break;
        }
    };
    CustomGroupViewModel.prototype.saveClasses = function () {
        var bandSet = this.selectedClassDefinitionViewModel.getBandSet();
        var groupSet = {
            'TestNumber': this.classesDefn.testFile.fileNumber,
            'Name': this.groupName,
            'Classes': []
        };
        for (var _i = 0, _a = bandSet.bands; _i < _a.length; _i++) {
            var bandItem = _a[_i];
            for (var _b = 0, _c = bandItem.classes; _b < _c.length; _b++) {
                var classItem = _c[_b];
                var classes = Enumerable.From(classItem.students).Select(function (x) { return x.id; }).ToArray();
                groupSet.Classes.push(classes);
            }
        }
        $.ajax({
            type: "POST",
            url: "Customgroup\\SaveClasses",
            contentType: "application/json",
            data: JSON.stringify({ 'groupSet': groupSet }),
            success: function (data) {
                var element = document.getElementById("message-text");
                element.textContent = "Custom groups have been saved successfully.";
            }
        });
    };
    CustomGroupViewModel.prototype.generateClasses = function () {
        var bandSet = this.selectedClassDefinitionViewModel.getBandSet();
        var students = this.classesDefn.genderStudents(this.genderOption);
        switch (this.groupingOption) {
            case GroupingMethod.Banding:
                bandSet.groupType = GroupingMethod.Streaming;
                bandSet.streamType = this.streamType;
                for (var _i = 0, _a = bandSet.bands; _i < _a.length; _i++) {
                    var band = _a[_i];
                    band.bandType = BandType.Custom;
                    band.groupType = GroupingMethod.MixedAbility;
                    band.streamType = this.streamType;
                    band.mixBoysGirls = this.mixGirlsBoysOption;
                }
                bandSet.prepare(!this.groupName || this.groupName === "" ? "Class" : this.groupName, students, this.joinedStudents, this.separatedStudents);
                break;
            case GroupingMethod.TopMiddleLowest:
                bandSet.groupType = GroupingMethod.Streaming;
                bandSet.bands[0].groupType = this.topClassGroupingOption;
                bandSet.bands[1].groupType = GroupingMethod.MixedAbility; // Middle class always using mixed ability
                bandSet.bands[2].groupType = this.lowestClassGroupingOption;
                for (var _b = 0, _c = bandSet.bands; _b < _c.length; _b++) {
                    var band = _c[_b];
                    band.streamType = this.streamType;
                    band.mixBoysGirls = this.mixGirlsBoysOption;
                }
                bandSet.prepare(!this.groupName || this.groupName === "" ? "Class" : this.groupName, students, this.joinedStudents, this.separatedStudents);
                break;
            case GroupingMethod.Language:
                for (var _d = 0, _e = bandSet.bands; _d < _e.length; _d++) {
                    var band = _e[_d];
                    band.groupType = GroupingMethod.MixedAbility;
                    band.bandType = BandType.Language;
                    band.streamType = this.streamType;
                    band.mixBoysGirls = this.mixGirlsBoysOption;
                    band.prepare(band.bandName, band.students, this.joinedStudents, this.separatedStudents);
                }
                break;
            case GroupingMethod.Preallocated:
                bandSet.groupType = GroupingMethod.MixedAbility;
                bandSet.bands[0].groupType = GroupingMethod.MixedAbility;
                bandSet.bands[0].streamType = this.streamType;
                bandSet.bands[0].mixBoysGirls = this.mixGirlsBoysOption;
                for (var _f = 0, _g = bandSet.bands[0].classes; _f < _g.length; _f++) {
                    var classItem = _g[_f];
                    this.groupingHelper.calculateTotalScore(classItem.students, this.streamType);
                }
                bandSet.prepare(!this.groupName || this.groupName === "" ? "Class" : this.groupName, bandSet.bands[0].students, this.joinedStudents, this.separatedStudents, false);
                break;
            default:
                bandSet.groupType = GroupingMethod.Streaming;
                bandSet.bands[0].groupType = this.groupingOption;
                bandSet.bands[0].streamType = this.streamType;
                bandSet.bands[0].mixBoysGirls = this.mixGirlsBoysOption;
                bandSet.prepare(!this.groupName || this.groupName === "" ? "Class" : this.groupName, students, this.joinedStudents, this.separatedStudents);
                break;
        }
        this.set("selectedClassDefinitionViewModel", this.generateCustomGroupViewModel);
        this.selectedClassDefinitionViewModel.loadOptions(bandSet);
    };
    ;
    return CustomGroupViewModel;
}(kendo.data.ObservableObject));
//# sourceMappingURL=CustomGroupViewModel.js.map