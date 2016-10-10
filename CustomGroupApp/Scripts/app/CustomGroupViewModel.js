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
        this.commonUtils = new CommonUtils();
        this.groupingHelper = new GroupingHelper();
        this.stepCollection = new StepCollection();
        this.testInfo = new TestFile();
        this._genderOption = "All";
        this.gender = Gender.All;
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
        this.classCount = 3;
        this.bandCount = 2;
        this.joinedStudents = [];
        this.separatedStudents = [];
        this.hasErrors = false;
        this.hasHiddenClasses = false;
        // leaving students properties
        this.studentLeavingOption = false;
        this.leavingStudents = [];
        this.leavingStudentsCount = 0;
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
            _this.separatedStudentsControl
                .createStudentSetContainer(separatedStudentsCell, _this.classesDefn.testFile.isUnisex);
        };
        this.showAllClasses = function (e) {
            _this.generateCustomGroupViewModel.showAllClasses();
            _this.set("hasHiddenClasses", false);
            kendo.bind($("#custom-group-container"), _this);
        };
        this.hideClass = function (e) {
            _this.generateCustomGroupViewModel.hideClass(_this.commonUtils.getUid(e.target.id));
            _this.set("hasHiddenClasses", true);
            kendo.bind($("#custom-group-container"), _this);
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
        this.studentLeavingOptionChanged = function (e) {
            if (_this.studentLeavingOption) {
                _this.editLeavingStudents();
            }
            else {
                _this.set("leavingStudentCount", 0);
                _this.setStudentCount();
            }
        };
        this.setStudentCount = function () {
            var value = _this.classesDefn.genderStudentCount(_this.gender) - _this.leavingStudentsCount;
            _this.set("studentCount", value);
            _this.selectedClassDefinitionViewModel.studentCount = value;
            _this.validateStudentCount();
        };
        this.editLeavingStudents = function () {
            var studentSelector = new StudentSelector(20);
            studentSelector.openDialog(document.getElementById("popup-window-container"), _this.classesDefn.genderStudents(_this.gender), _this.leavingStudents, function (students) {
                _this.leavingStudents = students;
                _this.set("leavingStudentsCount", _this.leavingStudents.length);
                _this.setStudentCount();
            }, 30);
        };
        this.reset = function () {
            _this.preAllocatedBandset = _this.classesDefn.createBandSet("class", _this.studentCount);
            // this.set("selectedClassDefinitionViewModel", this.classDefinitionViewModel);
        };
        //
        this.setDatasource = function (test, results, languages) {
            var testInfo = new TestFile();
            testInfo.set(test, results, languages);
            _this.isCoedSchool = testInfo.isUnisex;
            _this.studentCount = testInfo.studentCount - _this.leavingStudentsCount;
            _this.studentCountInAllClasses = testInfo.studentCount - _this.leavingStudentsCount;
            _this.classesDefn = new ClassesDefinition(testInfo);
            _this.pairedStudentsControl = new StudentSetListControl("Paired", _this.joinedStudents, _this.classesDefn.students, document.getElementById("popup-window-container"));
            _this.separatedStudentsControl = new StudentSetListControl("Separated", _this.separatedStudents, _this.classesDefn.students, document.getElementById("popup-window-container"));
            _this.reset();
        };
        this.onClassCountChanged = function () {
            var vm = _this.selectedClassDefinitionViewModel;
            if (vm) {
                vm.onClassCountChanged(_this.classCount);
            }
        };
        this.onBandCountChanged = function () {
            var vm = _this.selectedClassDefinitionViewModel;
            if (vm) {
                vm.onBandCountChanged(_this.bandCount);
            }
        };
        this.onStudentCountInAllClassesChanged = function (count) {
            // set the total number students in all classes
            _this.set("studentCountInAllClasses", count);
            _this.validateStudentCount();
        };
        this.validateStudentCount = function () {
            if (_this.studentCount !== _this.studentCountInAllClasses) {
                _this.set("hasErrors", true);
                _this.set("errorMessage", "The total number students in all classes doesn't match with number of students in test file");
                return false;
            }
            _this.set("hasErrors", false);
            _this.set("errorMessage", "");
            return true;
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
            this.set("studentLeavingOption", false);
            this.set("leavingStudentCount", 0);
            this.leavingStudents = [];
            this._genderOption = value;
            this.gender = this.commonUtils.genderFromString(value);
            this.set("studentCount", this.classesDefn.genderStudentCount(this.gender));
            this.set("studentCountInAllClasses", this.studentCount);
            this.selectedClassDefinitionViewModel.genderChanged(this.gender, this.studentCount);
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
                this._classDefinitionViewModel = new ClassDefinitionViewModel(this.classesDefn, this.onStudentCountInAllClassesChanged);
            }
            return this._classDefinitionViewModel;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(CustomGroupViewModel.prototype, "preAllocatedClassDefinitionViewModel", {
        get: function () {
            if (this._preAllocatedClassDefinitionViewModel === undefined) {
                this._preAllocatedClassDefinitionViewModel = new PreallocatedClassDefinitionViewModel(this.classesDefn, this.onStudentCountInAllClassesChanged);
            }
            return this._preAllocatedClassDefinitionViewModel;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(CustomGroupViewModel.prototype, "topMiddleLowestBandClassDefinitionViewModel", {
        get: function () {
            if (this._topMiddleLowestBandClassDefinitionViewModel === undefined) {
                this._topMiddleLowestBandClassDefinitionViewModel = new TopMiddleLowestBandClassDefinitionViewModel(this.classesDefn, this.onStudentCountInAllClassesChanged);
            }
            return this._topMiddleLowestBandClassDefinitionViewModel;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(CustomGroupViewModel.prototype, "bandClassDefinitionViewModel", {
        get: function () {
            if (this._bandClassDefinitionViewModel === undefined) {
                this._bandClassDefinitionViewModel = new BandClassDefinitionViewModel(this.classesDefn, this.onStudentCountInAllClassesChanged);
            }
            return this._bandClassDefinitionViewModel;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(CustomGroupViewModel.prototype, "languageClassDefinitionViewModel", {
        get: function () {
            if (this._languageClassDefinitionViewModel === undefined) {
                this._languageClassDefinitionViewModel = new LanguageClassDefinitionViewModel(this.classesDefn, this.onStudentCountInAllClassesChanged);
            }
            return this._languageClassDefinitionViewModel;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(CustomGroupViewModel.prototype, "generateCustomGroupViewModel", {
        get: function () {
            if (this._generateCustomGroupViewModel === undefined) {
                this._generateCustomGroupViewModel = new GenerateCustomGroupViewModel();
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
                this.set("selectedClassDefinitionViewModel", this.bandClassDefinitionViewModel);
                break;
            case GroupingMethod.TopMiddleLowest:
                this.set("selectedClassDefinitionViewModel", this.topMiddleLowestBandClassDefinitionViewModel);
                break;
            case GroupingMethod.Language:
                this.set("selectedClassDefinitionViewModel", this.languageClassDefinitionViewModel);
                break;
            case GroupingMethod.Preallocated:
                this.set("selectedClassDefinitionViewModel", this.preAllocatedClassDefinitionViewModel);
                break;
            default:
                this.set("selectedClassDefinitionViewModel", this.classDefinitionViewModel);
                break;
        }
        this.selectedClassDefinitionViewModel.loadOptions();
    };
    CustomGroupViewModel.prototype.saveClasses = function () {
        var bandSet = this.selectedClassDefinitionViewModel.getBandSet();
        this.groupingHelper.saveClasses(bandSet);
    };
    CustomGroupViewModel.prototype.generateClasses = function () {
        var bandSet = this.selectedClassDefinitionViewModel.getBandSet();
        var students = Enumerable.From(this.classesDefn.genderStudents(this.genderOption))
            .Except(this.leavingStudents, function (x) { return x.studentId; })
            .ToArray();
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
        this.generateCustomGroupViewModel.showClasses(bandSet);
    };
    ;
    return CustomGroupViewModel;
}(kendo.data.ObservableObject));
//# sourceMappingURL=CustomGroupViewModel.js.map