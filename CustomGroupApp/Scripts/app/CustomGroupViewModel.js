var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var CustomGroupViewModel = (function (_super) {
    __extends(CustomGroupViewModel, _super);
    function CustomGroupViewModel(studentCount, rootSite) {
        var _this = this;
        _super.call(this);
        this.selectedGroupingOption = "MixedAbility";
        this.selectedStreamingOption = "OverallAbilty";
        this.selectedTopClassGroupingOption = "Streaming";
        this.selectedLowestClassGroupingOption = "Streaming";
        this._genderOption = "All";
        this.mixGirlsBoysOption = false;
        this.currentGroupStep = 1;
        this.isLastStep = false;
        this.isFirstStep = true;
        this.isCoedSchool = true;
        this.studentCount = 0;
        this.studentCountInAllClasses = 0;
        this.classCount = 1;
        this.joinedStudents = [];
        this.separatedStudents = [];
        this.hasErrors = false;
        this.stepCollection = new StepCollection();
        this.testInfo = new TestFile();
        this.groupingHelper = new GroupingHelper();
        this.studentSetListControls = new StudentSetListControls();
        this.nextStep = function () {
            _super.prototype.set.call(_this, "currentGroupStep", _this.currentGroupStep + 1);
            _this.callGetViewStep(_this.currentGroupStep);
        };
        this.previousStep = function () {
            _super.prototype.set.call(_this, "currentGroupStep", _this.currentGroupStep - 1);
            _this.callGetViewStep(_this.currentGroupStep);
        };
        this.cancelStep = function () {
            console.log("cancelStep");
        };
        this.showStep = function (data) {
        };
        this.showStudentGroupingOption = function (joinedStudentsCell, separatedStudentsCell) {
            var studentSet1 = new StudentSet();
            studentSet1.students.push(_this.classesDefn.students[0]);
            studentSet1.students.push(_this.classesDefn.students[1]);
            studentSet1.students.push(_this.classesDefn.students[2]);
            studentSet1.students.push(_this.classesDefn.students[3]);
            var studentSet2 = new StudentSet();
            studentSet2.students.push(_this.classesDefn.students[4]);
            studentSet2.students.push(_this.classesDefn.students[5]);
            studentSet2.students.push(_this.classesDefn.students[6]);
            _this.joinedStudents.push(studentSet1);
            _this.joinedStudents.push(studentSet2);
            _this.separatedStudents.push(studentSet1);
            _this.separatedStudents.push(studentSet2);
            _this.studentSetListControls.createStudentSetContainer("Paired", joinedStudentsCell, _this.joinedStudents, _this.classesDefn.testFile.isUnisex);
            _this.studentSetListControls.createStudentSetContainer("Separated", separatedStudentsCell, _this.separatedStudents, _this.classesDefn.testFile.isUnisex);
        };
        //
        this.setDatasource = function (test, results, languages) {
            var testInfo = new TestFile();
            testInfo.set(test, results, languages);
            _this.isCoedSchool = testInfo.isUnisex;
            _this.studentCount = testInfo.studentCount;
            _this.studentCountInAllClasses = testInfo.studentCount;
            _this.classesDefn = new ClassesDefinition(testInfo);
            _this.bandSet = _this.classesDefn.createBandSet("class", _this.studentCount);
            _this.bandSet.bands[0].setClassCount(3);
            _this.customBandSet = _this.classesDefn.createBandSet("Band", _this.studentCount, 2);
            _this.languageBandSet = _this.classesDefn.createBandSet("Band", _this.studentCount, 1);
            _this.topMiddleLowestBandSet = _this.classesDefn.createTopMiddleBottomBandSet("class", _this.studentCount);
            _this.set("selectedClassDefinitionViewModel", _this.classDefinitionViewModel);
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
        //this.classDefinitionViewModel = new ClassDefinitionViewModel(studentCount, this.onStudentCountChanged);
        //this.bandClassDefinitionViewModel = new BandClassDefinitionViewModel(studentCount);
        //this.topMiddleLowestBandClassDefinitionViewModel = new TopMiddleLowestBandClassDefinitionViewModel(studentCount);
    }
    Object.defineProperty(CustomGroupViewModel.prototype, "selectedGenderOption", {
        get: function () {
            return this._genderOption;
        },
        set: function (value) {
            this._genderOption = value;
            console.log("Gender: " + value);
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
        // ReSharper restore InconsistentNaming
        get: function () {
            if (this._classDefinitionViewModel === undefined) {
                this._classDefinitionViewModel = new ClassDefinitionViewModel(this.studentCount, this.onStudentCountChanged);
            }
            return this._classDefinitionViewModel;
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
    CustomGroupViewModel.prototype.callGetViewStep = function (stepNo) {
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
                $("#custom-group-content").html(data);
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
            default:
                this.classDefinitionViewModel.loadOptions(this.bandSet);
                this.set("selectedClassDefinitionViewModel", this.classDefinitionViewModel);
                break;
        }
    };
    CustomGroupViewModel.prototype.generateClasses = function () {
        var bandSet = this.selectedClassDefinitionViewModel.getBandSet();
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
                bandSet.prepare(!this.groupName || this.groupName === "" ? "Class" : this.groupName, this.classesDefn.students, this.joinedStudents, this.separatedStudents);
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
                bandSet.prepare(!this.groupName || this.groupName === "" ? "Class" : this.groupName, this.classesDefn.students, this.joinedStudents, this.separatedStudents);
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
            default:
                bandSet.groupType = GroupingMethod.Streaming;
                bandSet.bands[0].groupType = this.groupingOption;
                bandSet.bands[0].streamType = this.streamType;
                bandSet.bands[0].mixBoysGirls = this.mixGirlsBoysOption;
                bandSet.prepare(!this.groupName || this.groupName === "" ? "Class" : this.groupName, this.classesDefn.students, this.joinedStudents, this.separatedStudents);
                break;
        }
        this.set("selectedClassDefinitionViewModel", this.generateCustomGroupViewModel);
        this.selectedClassDefinitionViewModel.loadOptions(bandSet);
    };
    ;
    return CustomGroupViewModel;
}(kendo.data.ObservableObject));
//# sourceMappingURL=CustomGroupViewModel.js.map