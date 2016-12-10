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
        this.classViewModels = new Array();
        this._selectedLanguageOption = 1;
        this._genderOption = "All";
        this.gender = Gender.All;
        this.selectedGroupingOption = "MixedAbility";
        this.selectedStreamingOption = "OverallAbilty";
        this.selectedTopClassGroupingOption = "Streaming";
        this.selectedLowestClassGroupingOption = "Streaming";
        this.mixGirlsBoysOption = false;
        this.splitOtherGroup = true;
        this.currentGroupStep = 1;
        this.isSaved = false;
        this.isLastStep = false;
        this.isFirstStep = true;
        this.isCoedSchool = true;
        this.studentCountInAllClasses = 0;
        this.incorrectTotalStudentsInClass = false;
        this.studentCountInAllClassesColor = "black";
        this.classCount = 3;
        this.bandCount = 2;
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
            _this.set("hasErrors", false);
            _this.set("errorMessage", "");
            _super.prototype.set.call(_this, "currentGroupStep", _this.currentGroupStep - 1);
            _this.callGetViewStep(_this.currentGroupStep, _this.containerElementName);
        };
        this.startOver = function () {
            _this.reset();
            _super.prototype.set.call(_this, "currentGroupStep", 1);
            _this.callGetViewStep(_this.currentGroupStep, _this.containerElementName);
        };
        this.saveStudentSets = function () {
            var studentSets = Enumerable.From(_this.pairedStudentsControl.studentSets)
                .Union(_this.separatedStudentsControl.studentSets)
                .ToArray();
            _this.groupingHelper.updateStudentSets(_this.testInfo.fileNumber, studentSets, function (e) { });
        };
        this.loadStudentSets = function () {
            var self = _this;
            _this.groupingHelper.getStudentSets(_this.testInfo.fileNumber, function (status, results) {
                var joinedStudents = _this.convertStudentSets(results, StudentSetType.Paired, 2);
                var separatedStudents = _this.convertStudentSets(results, StudentSetType.Separated, 2);
                self.pairedStudentsControl.loadStudentSets(joinedStudents);
                self.separatedStudentsControl.loadStudentSets(separatedStudents);
            });
        };
        this.convertStudentSets = function (results, type, minStudents) {
            var ret = new Array();
            for (var _i = 0, results_1 = results; _i < results_1.length; _i++) {
                var s = results_1[_i];
                if (s.groupType !== type) {
                    continue;
                }
                var studentSet = new StudentSet(type);
                studentSet.rowId = s.rowId;
                studentSet.type = s.groupType;
                var students = _this.getStudents(s.students);
                if (students && students.length >= minStudents) {
                    studentSet.students = students;
                    ret.push(studentSet);
                }
            }
            return ret;
        };
        this.getStudents = function (studentIds) {
            var lookup = Enumerable.From(studentIds).ToDictionary(function (x) { return x; }, function (x) { return x; });
            var students = new Array();
            for (var _i = 0, _a = _this.classesDefn.students; _i < _a.length; _i++) {
                var s = _a[_i];
                if (lookup.Contains(s.studentId)) {
                    students.push(s);
                }
            }
            return students;
        };
        this.showStudentGroupingOption = function (joinedStudentsCell, separatedStudentsCell) {
            _this.pairedStudentsControl.createStudentSetContainer(joinedStudentsCell, StudentSetType.Paired, _this.classesDefn.testFile.isUnisex);
            _this.separatedStudentsControl.createStudentSetContainer(separatedStudentsCell, StudentSetType.Separated, _this.classesDefn.testFile.isUnisex);
        };
        this.showAllClasses = function (e) {
            _this.generateCustomGroupViewModel.showAllClasses();
            _this.set("hasHiddenClasses", false);
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
            var studentSelector = new StudentSelector();
            studentSelector.openDialog(document.getElementById("popup-window-container"), _this.classesDefn.genderStudents(_this.gender), _this.leavingStudents, function (students) {
                _this.leavingStudents = students;
                _this.set("leavingStudentsCount", _this.leavingStudents.length);
                _this.setStudentCount();
            }, 30);
        };
        this.openCustomGroups = function () {
            $.ajax({
                url: "..\\Customgroup\\CustomGroupListView",
                type: 'POST',
                success: function (html) {
                    $("#reportContent").replaceWith(html);
                    $(window).trigger('resize');
                }
            });
        };
        this.exportToCsv = function () {
            _this.groupingHelper.exportGroupSet(_this.classesDefn.testFile, _this.selectedClassDefinitionViewModel.getBandSet(), "csv", function (status, msg) { });
        };
        this.exportToExcel = function () {
            _this.groupingHelper.exportGroupSet(_this.classesDefn.testFile, _this.selectedClassDefinitionViewModel.getBandSet(), "excel", function (status, msg) { });
        };
        this.downloadLanguagePreferenceTemplate = function () {
            _this.groupingHelper.downloadTemplateFile("DownloadLanguagePreferenceTemplate", _this.classesDefn.testFile.fileNumber);
        };
        this.downloadPreAllocatedClassTemplate = function () {
            _this.groupingHelper.downloadTemplateFile("DownloadPreAllocatedClassTemplate", _this.classesDefn.testFile.fileNumber);
        };
        this.downloadSchoolGroupTemplate = function () {
            _this.groupingHelper.downloadTemplateFile("DownloadSchoolGroupTemplate", _this.classesDefn.testFile.fileNumber);
        };
        this.reset = function () {
            _this.preAllocatedBandset = _this.classesDefn.createPreAllocatedClassBandSet("class", _this.studentCount);
            _this.pairedStudentsControl.clear();
            _this.separatedStudentsControl.clear();
            for (var _i = 0, _a = _this.classesDefn.students; _i < _a.length; _i++) {
                var s = _a[_i];
                s.setClass(null);
            }
            for (var _b = 0, _c = _this.classViewModels; _b < _c.length; _b++) {
                var vm = _c[_b];
                if (vm) {
                    vm.reset();
                }
            }
            // this.set("selectedClassDefinitionViewModel", this.classDefinitionViewModel);
        };
        //
        this.setDatasource = function (testFile, groupSetIds) {
            if (groupSetIds === void 0) { groupSetIds = []; }
            var regroup = groupSetIds && groupSetIds.length > 0;
            _this.testInfo = testFile;
            _this.isCoedSchool = _this.testInfo.isUnisex;
            var groupSetStudents = new Array();
            if (regroup) {
                // Get the students in the class
                var _loop_1 = function(groupSetId) {
                    var groupSet = Enumerable.From(testFile.customGroups)
                        .FirstOrDefault(null, function (x) { return x.groupSetid === groupSetId; });
                    if (groupSet) {
                        var studentLookup = Enumerable.From(groupSet.students).ToDictionary(function (x) { return x.studentId; }, function (x) { return x; });
                        for (var _i = 0, _a = testFile.students; _i < _a.length; _i++) {
                            var s = _a[_i];
                            if (studentLookup.Contains(s.studentId)) {
                                groupSetStudents.push(s);
                            }
                        }
                    }
                };
                for (var _b = 0, groupSetIds_1 = groupSetIds; _b < groupSetIds_1.length; _b++) {
                    var groupSetId = groupSetIds_1[_b];
                    _loop_1(groupSetId);
                }
                _this.studentCount = groupSetStudents.length;
                _this.studentCountInAllClasses = groupSetStudents.length;
            }
            else {
                _this.studentCount = _this.testInfo.studentCount - _this.leavingStudentsCount;
                _this.studentCountInAllClasses = _this.testInfo.studentCount - _this.leavingStudentsCount;
            }
            _this.classesDefn = new ClassesDefinition(_this.testInfo, regroup ? groupSetStudents : null);
            _this.pairedStudentsControl = new StudentSetListControl("Paired", _this.classesDefn.students, document.getElementById("popup-window-container"));
            _this.separatedStudentsControl = new StudentSetListControl("Separated", _this.classesDefn.students, document.getElementById("popup-window-container"));
            _this.reset();
        };
        this.onClassCountChanged = function (e) {
            var vm = _this.selectedClassDefinitionViewModel;
            if (vm && e.sender) {
                _this.classCount = e.sender.value();
                vm.onClassCountChanged(_this.classCount);
            }
        };
        this.onBandCountChanged = function (e) {
            var vm = _this.selectedClassDefinitionViewModel;
            if (vm && e.sender) {
                _this.bandCount = e.sender.value();
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
                var diff = Math.abs(_this.studentCount - _this.studentCountInAllClasses);
                _this.set("incorrectTotalStudentsInClass", true);
                _this.set("studentCountInAllClassesColor", "red");
                _this.set("hasErrors", true);
                var studentText = diff === 1 ? "student" : "students";
                _this.set("errorMessage", "Please fix the errors before continue to the next step.");
                if (_this.studentCount > _this.studentCountInAllClasses) {
                    _this.set("diffTotalStudentsInClass", (" (add " + diff + " more ") + studentText + ")");
                }
                else {
                    _this.set("diffTotalStudentsInClass", (" (remove " + diff + " ") + studentText + ")");
                }
                return false;
            }
            _this.set("incorrectTotalStudentsInClass", false);
            _this.set("studentCountInAllClassesColor", "black");
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
    Object.defineProperty(CustomGroupViewModel.prototype, "selectedLanguageOption", {
        get: function () {
            return this._selectedLanguageOption;
        },
        set: function (val) {
            this._selectedLanguageOption = val;
        },
        enumerable: true,
        configurable: true
    });
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
                this.classViewModels.push(this._classDefinitionViewModel);
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
                this.classViewModels.push(this._preAllocatedClassDefinitionViewModel);
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
                this.classViewModels.push(this._topMiddleLowestBandClassDefinitionViewModel);
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
                this.classViewModels.push(this._bandClassDefinitionViewModel);
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
                this.classViewModels.push(this._languageClassDefinitionViewModel);
            }
            return this._languageClassDefinitionViewModel;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(CustomGroupViewModel.prototype, "schoolGroupClassDefinitionViewModel", {
        get: function () {
            if (this._schoolGroupClassDefinitionViewModel === undefined) {
                this._schoolGroupClassDefinitionViewModel = new SchoolGroupClassDefinitionViewModel(this.classesDefn, this.onStudentCountInAllClassesChanged);
                this.classViewModels.push(this._schoolGroupClassDefinitionViewModel);
            }
            return this._schoolGroupClassDefinitionViewModel;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(CustomGroupViewModel.prototype, "generateCustomGroupViewModel", {
        get: function () {
            if (this._generateCustomGroupViewModel === undefined) {
                this._generateCustomGroupViewModel = new GenerateCustomGroupViewModel(this);
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
            url: "..\\Customgroup\\" + viewName,
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
                this.languageClassDefinitionViewModel.numberOfLanguage = this._selectedLanguageOption;
                break;
            case GroupingMethod.Preallocated:
                this.set("selectedClassDefinitionViewModel", this.preAllocatedClassDefinitionViewModel);
                break;
            case GroupingMethod.SchoolGroup:
                this.set("selectedClassDefinitionViewModel", this.schoolGroupClassDefinitionViewModel);
                break;
            default:
                this.set("selectedClassDefinitionViewModel", this.classDefinitionViewModel);
                break;
        }
        this.selectedClassDefinitionViewModel.loadOptions();
    };
    CustomGroupViewModel.prototype.saveClasses = function () {
        var self = this;
        var bandSet = this.selectedClassDefinitionViewModel.getBandSet();
        this.groupingHelper.saveClasses(bandSet, function (status, classItems) {
            var element = document.getElementById("message-text");
            element.textContent = "Custom groups have been saved successfully.";
            for (var _i = 0, classItems_1 = classItems; _i < classItems_1.length; _i++) {
                var classItem = classItems_1[_i];
                self.testInfo.customGroups.push(classItem);
            }
            self.set("isSaved", status);
        });
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
                bandSet.prepare(!this.groupName || this.groupName === "" ? "Class" : this.groupName, students, this.pairedStudentsControl.studentSets, this.separatedStudentsControl.studentSets);
                break;
            case GroupingMethod.TopMiddleLowest:
                bandSet.groupType = GroupingMethod.Streaming;
                bandSet.bands[0].groupType = this.topClassGroupingOption;
                bandSet.bands[0].bandType = BandType.Top;
                bandSet.bands[1].groupType = GroupingMethod.MixedAbility; // Middle class always using mixed ability
                bandSet.bands[0].bandType = BandType.Middle;
                bandSet.bands[2].groupType = this.lowestClassGroupingOption;
                bandSet.bands[0].bandType = BandType.Lowest;
                for (var _b = 0, _c = bandSet.bands; _b < _c.length; _b++) {
                    var band = _c[_b];
                    band.streamType = this.streamType;
                    band.mixBoysGirls = this.mixGirlsBoysOption;
                }
                bandSet.prepare(!this.groupName || this.groupName === "" ? "Class" : this.groupName, students, this.pairedStudentsControl.studentSets, this.separatedStudentsControl.studentSets);
                break;
            case GroupingMethod.Language:
                var _loop_2 = function(band) {
                    var studentCountInClasses = Enumerable.From(band.classes).Sum(function (x) { return x.count; });
                    var needMoreStudents = studentCountInClasses - band.studentCount;
                    if (needMoreStudents > 0) {
                        // Need to get studens in other bands
                        for (var _d = 0, _e = bandSet.bands; _d < _e.length; _d++) {
                            var otherBand = _e[_d];
                            if (otherBand.uid === band.uid) {
                                continue;
                            }
                            var totalStudents = Enumerable.From(otherBand.classes).Sum(function (x) { return x.count; });
                            if (totalStudents >= otherBand.studentCount) {
                                continue;
                            }
                            var newStudents = this_1.groupingHelper.getStudentsFromOtherBand(otherBand, needMoreStudents, function (s) { return s.langPref2 === band.languageSet.language1; });
                            if (newStudents.length > 0) {
                                band.studentCount += newStudents.length;
                                needMoreStudents -= newStudents.length;
                                for (var _f = 0, newStudents_1 = newStudents; _f < newStudents_1.length; _f++) {
                                    var s = newStudents_1[_f];
                                    band.students.push(s);
                                }
                            }
                        }
                    }
                    if (needMoreStudents > 0) {
                        // Need to get studens in other bands
                        for (var _g = 0, _h = bandSet.bands; _g < _h.length; _g++) {
                            var otherBand = _h[_g];
                            if (otherBand.uid === band.uid) {
                                continue;
                            }
                            var totalStudents = Enumerable.From(otherBand.classes).Sum(function (x) { return x.count; });
                            if (totalStudents <= otherBand.studentCount) {
                                continue;
                            }
                            var newStudents = this_1.groupingHelper.getStudentsFromOtherBand(otherBand, needMoreStudents, function (s) { return s.langPref3 === band.languageSet.language1; });
                            if (newStudents.length > 0) {
                                band.studentCount += newStudents.length;
                                needMoreStudents -= newStudents.length;
                                for (var _j = 0, newStudents_2 = newStudents; _j < newStudents_2.length; _j++) {
                                    var s = newStudents_2[_j];
                                    band.students.push(s);
                                }
                            }
                        }
                    }
                };
                var this_1 = this;
                for (var _k = 0, _l = bandSet.bands; _k < _l.length; _k++) {
                    var band = _l[_k];
                    _loop_2(band);
                }
                for (var _m = 0, _o = bandSet.bands; _m < _o.length; _m++) {
                    var band = _o[_m];
                    band.groupType = GroupingMethod.MixedAbility;
                    band.bandType = BandType.Language;
                    band.streamType = this.streamType;
                    band.mixBoysGirls = this.mixGirlsBoysOption;
                    band.prepare(this.groupName ? this.groupName + " " + band.bandName : band.bandName, band.students, this.pairedStudentsControl.studentSets, this.separatedStudentsControl.studentSets);
                }
                break;
            case GroupingMethod.SchoolGroup:
                {
                    for (var _p = 0, _q = bandSet.bands; _p < _q.length; _p++) {
                        var band = _q[_p];
                        band.groupType = GroupingMethod.MixedAbility;
                        band.bandType = BandType.SchoolGroup;
                        band.streamType = this.streamType;
                        band.mixBoysGirls = this.mixGirlsBoysOption;
                        band.prepare(this.groupName ? this.groupName + " " + band.bandName : band.bandName, band.students, this.pairedStudentsControl.studentSets, this.separatedStudentsControl.studentSets);
                    }
                    break;
                }
            case GroupingMethod.Preallocated:
                bandSet.groupType = GroupingMethod.MixedAbility;
                bandSet.bands[0].groupType = GroupingMethod.MixedAbility;
                bandSet.bands[0].bandType = BandType.None;
                bandSet.bands[0].streamType = this.streamType;
                bandSet.bands[0].mixBoysGirls = this.mixGirlsBoysOption;
                for (var _r = 0, _s = bandSet.bands[0].classes; _r < _s.length; _r++) {
                    var classItem = _s[_r];
                    this.groupingHelper.calculateTotalScore(classItem.students, this.streamType);
                }
                bandSet.prepare(!this.groupName || this.groupName === "" ? "Class" : this.groupName, bandSet.bands[0].students, this.pairedStudentsControl.studentSets, this.separatedStudentsControl.studentSets, false);
                break;
            default:
                bandSet.groupType = GroupingMethod.Streaming;
                bandSet.bands[0].groupType = this.groupingOption;
                bandSet.bands[0].bandType = BandType.None;
                bandSet.bands[0].streamType = this.streamType;
                bandSet.bands[0].mixBoysGirls = this.mixGirlsBoysOption;
                bandSet.prepare(!this.groupName || this.groupName === "" ? "Class" : this.groupName, students, this.pairedStudentsControl.studentSets, this.separatedStudentsControl.studentSets);
                break;
        }
        this.generateCustomGroupViewModel.showClasses(bandSet);
    };
    ;
    return CustomGroupViewModel;
}(kendo.data.ObservableObject));
//# sourceMappingURL=CustomGroupViewModel.js.map