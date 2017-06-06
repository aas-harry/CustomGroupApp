var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var BandStreamType;
(function (BandStreamType) {
    BandStreamType[BandStreamType["None"] = 0] = "None";
    BandStreamType[BandStreamType["Streaming"] = 1] = "Streaming";
    BandStreamType[BandStreamType["Parallel"] = 2] = "Parallel";
})(BandStreamType || (BandStreamType = {}));
var BandType;
(function (BandType) {
    BandType[BandType["None"] = 0] = "None";
    BandType[BandType["Custom"] = 1] = "Custom";
    BandType[BandType["Top"] = 2] = "Top";
    BandType[BandType["Middle"] = 3] = "Middle";
    BandType[BandType["Lowest"] = 4] = "Lowest";
    BandType[BandType["Language"] = 5] = "Language";
    BandType[BandType["PreallocatedClass"] = 6] = "PreallocatedClass";
    BandType[BandType["SchoolGroup"] = 7] = "SchoolGroup"; // group defined by school. e.g. house
})(BandType || (BandType = {}));
var Gender;
(function (Gender) {
    Gender[Gender["All"] = 0] = "All";
    Gender[Gender["Girls"] = 1] = "Girls";
    Gender[Gender["Boys"] = 2] = "Boys";
})(Gender || (Gender = {}));
var GroupingMethod;
(function (GroupingMethod) {
    GroupingMethod[GroupingMethod["Unknown"] = 0] = "Unknown";
    GroupingMethod[GroupingMethod["MixedAbility"] = 1] = "MixedAbility";
    GroupingMethod[GroupingMethod["Streaming"] = 2] = "Streaming";
    GroupingMethod[GroupingMethod["Banding"] = 3] = "Banding";
    GroupingMethod[GroupingMethod["TopMiddleLowest"] = 4] = "TopMiddleLowest";
    GroupingMethod[GroupingMethod["Language"] = 5] = "Language";
    GroupingMethod[GroupingMethod["SchoolGroup"] = 6] = "SchoolGroup";
    GroupingMethod[GroupingMethod["Preallocated"] = 7] = "Preallocated";
})(GroupingMethod || (GroupingMethod = {}));
var StreamType;
(function (StreamType) {
    StreamType[StreamType["None"] = 0] = "None";
    StreamType[StreamType["OverallAbilty"] = 1] = "OverallAbilty";
    StreamType[StreamType["MathsAchievement"] = 2] = "MathsAchievement";
    StreamType[StreamType["English"] = 3] = "English";
    StreamType[StreamType["MathsAchievementQr"] = 4] = "MathsAchievementQr";
})(StreamType || (StreamType = {}));
function createUuid() {
    var s = [];
    var hexDigits = "0123456789abcdef";
    for (var i = 0; i < 36; i++) {
        s[i] = hexDigits.substr(Math.floor(Math.random() * 0x10), 1);
    }
    s[14] = "4"; // bits 12-15 of the time_hi_and_version field to 0010
    s[19] = hexDigits.substr((s[19] & 0x3) | 0x8, 1); // bits 6-7 of the clock_seq_hi_and_reserved to 01
    s[8] = s[13] = s[18] = s[23] = "-";
    var uuid = s.join("");
    return uuid;
}
var SummaryClass = (function () {
    function SummaryClass() {
    }
    return SummaryClass;
}());
var LanguageSet = (function () {
    function LanguageSet(language1, language2, singleLanguage) {
        if (singleLanguage === void 0) { singleLanguage = false; }
        this.language1 = language1;
        this.language2 = language2;
        this.singleLanguage = singleLanguage;
        this.count = 0;
        this.students = [];
        this.nolanguagePrefs = false;
        this.isNoPrefs = function (language) {
            if (!language) {
                return true;
            }
            language = language.toLowerCase();
            return (language === "" || language === "no" || language === "none");
        };
        this.language1LowerCase = this.isNoPrefs(language1) ? "" : language1.toLowerCase();
        if (!singleLanguage) {
            this.language2LowerCase = this.isNoPrefs(language2) ? "" : language2.toLowerCase();
        }
    }
    Object.defineProperty(LanguageSet.prototype, "description", {
        get: function () {
            if (this.singleLanguage) {
                return this.language1;
            }
            if (!this.isNoPrefs(this.language1) && !this.isNoPrefs(this.language2)) {
                return this.language1 + " / \n" + this.language2;
            }
            if (this.language1 && !this.isNoPrefs(this.language2)) {
                return this.language1;
            }
            if (this.language2 && !this.isNoPrefs(this.language1)) {
                return this.language2;
            }
            this.nolanguagePrefs = true;
            return "No Prefs";
        },
        enumerable: true,
        configurable: true
    });
    LanguageSet.prototype.isEqual = function (language1, language2) {
        language1 = this.isNoPrefs(language1) ? "" : language1;
        language2 = this.isNoPrefs(language2) ? "" : language2;
        if (this.singleLanguage) {
            return (language1.toLowerCase() === this.language1LowerCase);
        }
        if (language1.toLowerCase() === this.language1LowerCase &&
            language2.toLowerCase() === this.language2LowerCase) {
            return true;
        }
        if (language1.toLowerCase() === this.language2LowerCase &&
            language2.toLowerCase() === this.language1LowerCase) {
            return true;
        }
        return false;
    };
    LanguageSet.prototype.addStudent = function (student) {
        this.count++;
        this.students.push(student);
    };
    ;
    return LanguageSet;
}());
var PreAllocatedStudent = (function () {
    function PreAllocatedStudent(student) {
        this.name = student.Name;
        this.studentId = student.StudentId;
        this.className = student.Class;
    }
    Object.defineProperty(PreAllocatedStudent.prototype, "tested", {
        get: function () {
            return this.studentId && this.studentId > 0 ? "Yes" : "No";
        },
        enumerable: true,
        configurable: true
    });
    return PreAllocatedStudent;
}());
var StudentClass = (function () {
    function StudentClass(s) {
        var _this = this;
        this._schoolGroup = "";
        // Need to call this function everytime the student language preferences change in the student property
        this.setLanguagePrefs = function () {
            if (!_this.source) {
                return;
            }
            _this._languagePrefs = _this.source.languagePrefs;
            _this._langPref1 = _this.languagePrefs && _this.languagePrefs.length > 0 ? _this.languagePrefs[0] : "";
            _this._langPref2 = _this.languagePrefs && _this.languagePrefs.length > 1 ? _this.languagePrefs[1] : "";
            _this._langPref3 = _this.languagePrefs && _this.languagePrefs.length > 2 ? _this.languagePrefs[2] : "";
        };
        // Need to call this function everytime the school group change in the student property
        this.setSchoolGroups = function () {
            if (!_this.source) {
                return;
            }
            _this._schoolGroup = _this.source.schoolGroup;
        };
        this.overallAbilityScore = function () {
            return _this.source.overallAbilityScore();
        };
        this.mathsAchievementScore = function () {
            return _this.source.mathsAchievementScore();
        };
        this.mathsAchievementQrScore = function () {
            return _this.source.mathsAchievemenQrScore();
        };
        this.englishScore = function () {
            return _this.source.englishScore();
        };
        this.canMoveToOtherClass = true;
        this.setClass = function (classItem) {
            if (!classItem) {
                _this.canMoveToOtherClass = true;
            }
            _this.class = classItem;
        };
        this.swapWith = function (studentTo) {
            var fromClass = _this.class;
            var toClass = studentTo.class;
            toClass.removeStudent(studentTo);
            fromClass.removeStudent(_this);
            toClass.addStudent(_this);
            fromClass.addStudent(studentTo);
        };
        this.copy = function () {
            return new StudentClass(_this.source);
        };
        this.source = s;
        this.uid = createUuid();
        this._name = s.name;
        this._studentId = s.studentId;
        this._gender = s.sex;
        this._dob = s.dob;
        this.setLanguagePrefs();
    }
    Object.defineProperty(StudentClass.prototype, "name", {
        get: function () {
            return this._name;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(StudentClass.prototype, "dob", {
        get: function () {
            return this._dob;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(StudentClass.prototype, "gender", {
        get: function () {
            return this.source.sex;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(StudentClass.prototype, "studentId", {
        get: function () {
            return this._studentId;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(StudentClass.prototype, "id", {
        get: function () {
            return this._studentId;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(StudentClass.prototype, "languagePrefs", {
        get: function () {
            return this._languagePrefs;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(StudentClass.prototype, "hasLanguagePreferences", {
        get: function () {
            return this.languagePrefs && this.languagePrefs.length > 0;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(StudentClass.prototype, "classNo", {
        get: function () {
            return this.class ? this.class.index : 0;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(StudentClass.prototype, "schoolGroup", {
        get: function () {
            return this._schoolGroup;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(StudentClass.prototype, "langPref1", {
        get: function () {
            return this._langPref1;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(StudentClass.prototype, "langPref2", {
        get: function () {
            return this._langPref2;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(StudentClass.prototype, "langPref3", {
        get: function () {
            return this._langPref3;
        },
        enumerable: true,
        configurable: true
    });
    return StudentClass;
}());
var GroupContext = (function () {
    function GroupContext() {
        this.mixBoysGirls = false;
        this.separatedStudents = [];
        this.joinedStudents = [];
    }
    return GroupContext;
}());
var SearchClassContext = (function () {
    function SearchClassContext(classNo, firstClassNo, lastClassNo, isLastClass) {
        this.classNo = classNo;
        this.firstClassNo = firstClassNo;
        this.lastClassNo = lastClassNo;
        this.isLastClass = isLastClass;
    }
    return SearchClassContext;
}());
var GroupingHelper = (function () {
    function GroupingHelper() {
        var _this = this;
        this.commonUtils = new CommonUtils();
        // This function can be used to convert GroupingMethod and BandStreamType string
        this.convertGroupingOptionFromString = function (groupType) {
            switch (groupType) {
                case "Parallel":
                case "MixedAbility":
                    return GroupingMethod.MixedAbility;
                case "Streaming":
                    return GroupingMethod.Streaming;
                case "Banding":
                    return GroupingMethod.Banding;
                case "TopMiddleLowest":
                    return GroupingMethod.TopMiddleLowest;
                case "Language":
                    return GroupingMethod.Language;
                case "Preallocated":
                    return GroupingMethod.Preallocated;
                case "SchoolGroup":
                    return GroupingMethod.SchoolGroup;
                case "Unknown":
                case "None":
                    return GroupingMethod.Unknown;
                default:
                    alert("incorrect type");
                    return GroupingMethod.Unknown;
            }
        };
        this.convertStreamTypeFromString = function (streamType) {
            switch (streamType) {
                case "OverallAbilty":
                    return StreamType.OverallAbilty;
                case "English":
                    return StreamType.English;
                case "MathsAchievement":
                    return StreamType.MathsAchievement;
                case "MathsAchievementQr":
                    return StreamType.MathsAchievementQr;
                case "None":
                    return StreamType.None;
                default:
                    alert("incorrect type");
                    return StreamType.None;
            }
        };
        this.convertGenderFromString = function (gender) {
            switch (gender) {
                case "All":
                    return Gender.All;
                case "Girls":
                    return Gender.Girls;
                case "Boys":
                    return Gender.Boys;
                default:
                    alert("incorrect type");
                    return Gender.All;
            }
        };
        this.createBlankClasses = function (parent, totalStudents, classCount) {
            var classSizes = _this.calculateClassesSize(totalStudents, classCount);
            var classes = new Array();
            for (var i = 0; i < classCount; i++) {
                classes.push(new ClassDefinition(parent, i + 1, classSizes[i]));
            }
            return classes;
        };
        this.calculateClassesSize = function (totalStudents, classCount) {
            var studentInClass = Math.floor(totalStudents / classCount);
            var remainingStudents = totalStudents - (studentInClass * classCount);
            var classes = new Array();
            for (var i = 0; i < classCount; i++) {
                classes.push(studentInClass + (remainingStudents > 0 ? 1 : 0));
                remainingStudents--;
            }
            return classes;
        };
        this.setOveralAbilityScore = function (students) {
            for (var i = 0; i < students.length; i++) {
                students[i].score = students[i].overallAbilityScore();
            }
        };
        this.setEnglishScore = function (students) {
            for (var i = 0; i < students.length; i++) {
                students[i].score = students[i].englishScore();
            }
        };
        this.setMathAchievementScore = function (students) {
            for (var i = 0; i < students.length; i++) {
                students[i].score = students[i].mathsAchievementScore();
            }
        };
        this.setMathAchievementQrScore = function (students) {
            for (var i = 0; i < students.length; i++) {
                students[i].score = students[i].mathsAchievementQrScore();
            }
        };
        this.calculateTotalScore = function (students, streamType) {
            if (streamType === StreamType.OverallAbilty) {
                _this.setOveralAbilityScore(students);
            }
            if (streamType === StreamType.English) {
                _this.setEnglishScore(students);
            }
            if (streamType === StreamType.MathsAchievement) {
                _this.setMathAchievementScore(students);
            }
            if (streamType === StreamType.MathsAchievementQr) {
                _this.setMathAchievementQrScore(students);
            }
        };
        this.handleSeparatedStudents = function (classes, separatedStudents) {
            var students = Enumerable.From(classes).SelectMany(function (s) { return s.students; }).ToArray();
            for (var _i = 0, separatedStudents_1 = separatedStudents; _i < separatedStudents_1.length; _i++) {
                var studentSet = separatedStudents_1[_i];
                var tmpStudentSet = studentSet.filterStudents(students);
                if (!tmpStudentSet) {
                    continue;
                }
                var allocatedClasses = new Array();
                var studentClasses = Enumerable.From(tmpStudentSet.students)
                    .GroupBy(function (x) { return x.classNo; }, function (x) { return x; })
                    .ToArray();
                // Check if all the students are in different class already
                if (Enumerable.From(studentClasses).All(function (x) { return x.source.length === 1; })) {
                    for (var _a = 0, studentClasses_1 = studentClasses; _a < studentClasses_1.length; _a++) {
                        var s = studentClasses_1[_a];
                        s.source[0].canMoveToOtherClass = false;
                    }
                    continue;
                }
                var flattenedStudentList = Enumerable.From(classes).SelectMany(function (c) { return c.students; }).ToArray();
                for (var _b = 0, studentClasses_2 = studentClasses; _b < studentClasses_2.length; _b++) {
                    var classGroup = studentClasses_2[_b];
                    if (classGroup.source.length === 1) {
                        // he/she is already in separate class
                        classGroup.source[0].canMoveToOtherClass = false;
                        allocatedClasses.push(classGroup.Key());
                        continue;
                    }
                    allocatedClasses.push(classGroup.Key());
                    for (var j = 1; j < classGroup.source.length; j++) {
                        var s = classGroup.source[j];
                        var replacement = _this.findStudentReplacement(s, flattenedStudentList, allocatedClasses, true);
                        // if cannot find the replacement student with the same gender, try again with any gender
                        if (replacement == null &&
                            Enumerable.From(classes).SelectMany(function (c) { return c.students; }).Any(function (x) { return x.gender === "M"; }) &&
                            Enumerable.From(classes).SelectMany(function (c) { return c.students; }).Any(function (x) { return x.gender === "F"; })) {
                            replacement = _this.findStudentReplacement(s, flattenedStudentList, allocatedClasses, false);
                        }
                        //                    console.log("Student: " + s.name, s.classNo, replacement.name, replacement.classNo);
                        if (replacement != null) {
                            s.swapWith(replacement);
                            s.canMoveToOtherClass = false;
                            allocatedClasses.push(s.classNo);
                        }
                    }
                }
            }
        };
        this.handleJoinedStudents = function (classes, joinedStudents) {
            var students = Enumerable.From(classes).SelectMany(function (s) { return s.students; }).ToArray();
            for (var _i = 0, joinedStudents_1 = joinedStudents; _i < joinedStudents_1.length; _i++) {
                var studentSet = joinedStudents_1[_i];
                var tmpStudentSet = studentSet.filterStudents(students);
                if (!tmpStudentSet) {
                    continue;
                }
                var allocatedClasses = new Array();
                var studentClasses = Enumerable.From(tmpStudentSet.students)
                    .GroupBy(function (x) { return x.classNo; }, function (x) { return x; })
                    .ToArray();
                // All students are already in the same class
                if (studentClasses.length === 1) {
                    for (var _a = 0, _b = studentClasses[0].source; _a < _b.length; _a++) {
                        var s = _b[_a];
                        s.canMoveToOtherClass = false;
                    }
                    continue;
                }
                // Find the class with most number of free students (can be moved students)
                var classDest = -1;
                var cnt = 0;
                for (var _c = 0, studentClasses_3 = studentClasses; _c < studentClasses_3.length; _c++) {
                    var classgroup = studentClasses_3[_c];
                    var freeStudentCount = classes[classgroup.Key() - 1].freeStudentCount;
                    if (cnt < freeStudentCount) {
                        classDest = classgroup.Key();
                        cnt = freeStudentCount;
                    }
                }
                // Add all the students to the class which has most of the students already
                for (var _d = 0, studentClasses_4 = studentClasses; _d < studentClasses_4.length; _d++) {
                    var classgroup = studentClasses_4[_d];
                    for (var _e = 0, _f = classgroup.source; _e < _f.length; _e++) {
                        var s = _f[_e];
                        if (s.classNo === classDest) {
                            continue;
                        }
                        var replacement = _this
                            .findStudentReplacement(s, classes[classDest - 1].students, allocatedClasses, true);
                        // if cannot find the replacement student with the same gender, try again with any gender
                        if (replacement == null &&
                            Enumerable.From(classes).SelectMany(function (c) { return c.students; }).Any(function (x) { return x.gender === "M"; }) &&
                            Enumerable.From(classes).SelectMany(function (c) { return c.students; }).Any(function (x) { return x.gender === "F"; })) {
                            replacement = _this
                                .findStudentReplacement(s, classes[classDest - 1].students, allocatedClasses, false);
                        }
                        // console.log("Student: " + s.name, s.classNo, replacement.name, replacement.classNo);
                        if (replacement != null) {
                            s.swapWith(replacement);
                            s.canMoveToOtherClass = false;
                        }
                    }
                }
            }
        };
        this.getStudentsFromOtherBand = function (fromBand, count, condition) {
            var students = new Array();
            var studentCount = Enumerable.From(fromBand.classes).Sum(function (x) { return x.count; });
            var pos = 0;
            while (count > 0 && pos < fromBand.students.length && studentCount < fromBand.students.length) {
                var student = fromBand.students[pos];
                if (!condition(student)) {
                    pos++;
                    continue;
                }
                students.push(student);
                fromBand.students.splice(pos, 1);
                count--;
            }
            return students;
        };
        this.findStudentReplacement = function (student, students, allocatedClasses, sameGender) {
            if (sameGender === void 0) { sameGender = false; }
            var tmpStudents;
            if (sameGender) {
                tmpStudents = Enumerable.From(students)
                    .Where(function (s) { return s.canMoveToOtherClass &&
                    s.gender === student.gender &&
                    !Enumerable.From(allocatedClasses).Contains(s.classNo); })
                    .Select(function (s) { return s; })
                    .ToArray();
            }
            else {
                tmpStudents = Enumerable.From(students)
                    .Where(function (s) { return s.canMoveToOtherClass && !Enumerable.From(allocatedClasses).Contains(s.classNo); })
                    .Select(function (s) { return s; })
                    .ToArray();
            }
            // Try to find students with 10, 20, 30, 40, 50 score difference first before pick any students
            for (var _i = 0, _a = [10, 20, 30, 40, 50, 300]; _i < _a.length; _i++) {
                var diff = _a[_i];
                var replacement = Enumerable.From(tmpStudents)
                    .FirstOrDefault(null, function (x) { return x.canMoveToOtherClass && Math.abs(x.score - student.score) <= diff; });
                if (replacement != null) {
                    return replacement;
                }
            }
            return null;
        };
        this.groupByStreaming = function (classes, students, streamType, mixBoysGirls, joinedStudents, separatedStudents) {
            if (joinedStudents === void 0) { joinedStudents = []; }
            if (separatedStudents === void 0) { separatedStudents = []; }
            _this.calculateTotalScore(students, streamType);
            if (!mixBoysGirls) {
                _this.groupByStreamingInternal(classes, students);
            }
            else {
                var femaleStudents = Enumerable.From(students).Where(function (s) { return (s.gender === "F"); }).Select(function (s) { return s; }).ToArray();
                var maleStudents = Enumerable.From(students).Where(function (s) { return (s.gender === "M"); }).Select(function (s) { return s; }).ToArray();
                var parentBand = classes[0].parent;
                if (femaleStudents.length < maleStudents.length) {
                    _this.genderSplitByStreaming(parentBand, femaleStudents, classes);
                    _this.groupByStreamingInternal(classes, maleStudents);
                }
                else {
                    _this.genderSplitByStreaming(parentBand, maleStudents, classes);
                    _this.groupByStreamingInternal(classes, femaleStudents);
                }
            }
            _this.handleJoinedStudents(classes, joinedStudents);
            _this.handleSeparatedStudents(classes, separatedStudents);
        };
        this.genderSplitByStreaming = function (parentBand, students, classes) {
            var tmpClasses = _this.createBlankClasses(parentBand, students.length, classes.length);
            _this.groupByStreamingInternal(tmpClasses, students);
            for (var i = 0; i < tmpClasses.length; i++) {
                for (var _i = 0, _a = tmpClasses[i].students; _i < _a.length; _i++) {
                    var s = _a[_i];
                    classes[i].addStudent(s);
                }
            }
        };
        this.groupByMixAbility = function (classes, students, streamType, mixBoysGirls, joinedStudents, separatedStudents) {
            if (joinedStudents === void 0) { joinedStudents = []; }
            if (separatedStudents === void 0) { separatedStudents = []; }
            _this.calculateTotalScore(students, streamType);
            if (!mixBoysGirls) {
                _this.groupByMixAbilityInternal(classes, students);
            }
            else {
                var femaleStudents = Enumerable.From(students).Where(function (s) { return (s.gender === "F"); }).Select(function (s) { return s; }).ToArray();
                var maleStudents = Enumerable.From(students).Where(function (s) { return (s.gender === "M"); }).Select(function (s) { return s; }).ToArray();
                if (femaleStudents.length < maleStudents.length) {
                    _this.groupByMixAbilityInternal(classes, femaleStudents);
                    _this.groupByMixAbilityInternal(classes, maleStudents, true);
                }
                else {
                    _this.groupByMixAbilityInternal(classes, maleStudents);
                    _this.groupByMixAbilityInternal(classes, femaleStudents, true);
                }
            }
            _this.handleJoinedStudents(classes, joinedStudents);
            _this.handleSeparatedStudents(classes, separatedStudents);
        };
        this.groupByMixAbilityInternal = function (classes, students, orderReversed) {
            if (orderReversed === void 0) { orderReversed = false; }
            var sortedStudents = orderReversed === false
                ? Enumerable.From(students).OrderByDescending(function (s) { return s.score; }).Select(function (s) { return s; }).ToArray()
                : Enumerable.From(students).OrderBy(function (s) { return s.score; }).Select(function (s) { return s; }).ToArray();
            var classCount = classes.length;
            var nextClass = new SearchClassContext(0, 0, classCount - 1, false);
            /// TODO: Check if no classes allocated
            for (var i = 0; i < sortedStudents.length; i++) {
                classes[nextClass.classNo].addStudent(sortedStudents[i]);
                nextClass = _this.getNextClassToAddNewStudent(classes, nextClass);
            }
            return classes;
        };
        this.getNextClassToAddNewStudent = function (classes, context) {
            // this is the logic to get the next class
            // 1. Get the next available class 
            // 2. If the next class is the last class and then we need to ctart again from the last initial class no + 1
            //    This is will distribute the smarter students evently across all classes.
            var result = new SearchClassContext(-1, context.firstClassNo, context.lastClassNo, false);
            var nextClassNo;
            if (context.isLastClass) {
                nextClassNo = context.firstClassNo;
                result.lastClassNo = nextClassNo < classes.length ? context.firstClassNo : (classes.length - 1);
                result.firstClassNo = nextClassNo < classes.length ? (nextClassNo + 1) : 0;
            }
            else {
                nextClassNo = context.classNo;
            }
            // get the class in the right order to pick up
            var classQueue = [];
            for (var i = nextClassNo + 1; i < classes.length; i++) {
                classQueue.push(classes[i]);
            }
            for (var i = 0; i <= nextClassNo; i++) {
                /// TODO : check this condition
                if (i < classes.length) {
                    classQueue.push(classes[i]);
                }
            }
            for (var i = 0; i < classQueue.length; i++) {
                if (classQueue[i].students.length >= classQueue[i].count) {
                    continue;
                }
                result.classNo = classQueue[i].index - 1;
                // we have reach the last class
                if (result.lastClassNo === (classQueue[i].index - 1)) {
                    result.isLastClass = true;
                }
                break;
            }
            // If all groups have been completed, add the rest of the students into first group
            if (result.classNo === -1) {
                result.classNo = 0;
            }
            return result;
        };
        this.groupByStreamingInternal = function (classes, students) {
            var sortedStudents = Enumerable.From(students).OrderByDescending(function (s) { return s.score; }).Select(function (s) { return s; }).ToArray();
            var classNo = 0;
            for (var i = 0; i < sortedStudents.length; i++) {
                classes[classNo].addStudent(sortedStudents[i]);
                if (classes[classNo].moreStudents <= 0) {
                    classNo++;
                    if (classNo >= classes.length) {
                        break;
                    }
                }
            }
            return classes;
        };
        this.exportGroupSetIds = function (testFile, groupSets, exportType, callback) {
            if (exportType === void 0) { exportType = "csv"; }
            var exportGroupDialog = new ExportCustomGroupDialog();
            exportGroupDialog.openDialog(document.getElementById("popup-window-container"), false, testFile.hasStudentLanguagePrefs, testFile.hasStudentIds, function (status, includeResults, includeLang, includeStudentId) {
                if (status) {
                    _this.exportGroupInternal(testFile.fileNumber, groupSets, exportType, includeResults, includeLang, includeStudentId, callback);
                }
            });
        };
        this.exportGroupSet = function (testFile, bandSet, exportType, callback) {
            if (exportType === void 0) { exportType = "csv"; }
            var groupSets = Enumerable.From(bandSet.bands).SelectMany(function (b) { return b.classes; }).Select(function (c) { return c.groupSetid; }).ToArray();
            _this.exportGroupSetIds(testFile, groupSets, exportType, callback);
        };
        this.exportGroupInternal = function (testNumber, groupSets, exportType, includeResults, includeLang, includeStudentId, callback) {
            if (exportType === void 0) { exportType = "csv"; }
            toastr.info("Exporting custom groups...");
            var exportTypeUrl = exportType === "csv"
                ? "..\\Home\\ExportGroupSetsToCsv"
                : "..\\Home\\ExportGroupSetsToExcel";
            $.ajax({
                url: exportTypeUrl,
                type: "POST",
                contentType: "application/json",
                data: JSON.stringify({
                    testNum: testNumber,
                    groupSets: groupSets,
                    includeResults: includeResults,
                    includeLang: includeLang,
                    includeStudentId: includeStudentId
                }),
                success: function (result) {
                    if (result.status) {
                        toastr.success("Finished exporting custom groups");
                        window.open(result.urlLink);
                    }
                    else {
                        toastr.warning(result.message, "", {
                            "closeButton": true,
                            "positionClass": "toast-top-full-width",
                            "hideDuration": 100,
                            "showDuration": 100,
                            "timeOut": 10000
                        });
                    }
                    var tmpCallback = callback;
                    if (tmpCallback) {
                        tmpCallback(result.status, result.message);
                    }
                },
                error: (function () { })
            });
        };
        this.updateGroupName = function (classDefn, callback) {
            $.ajax({
                type: "POST",
                url: "..\\Customgroup\\UpdateGroupSetName",
                contentType: "application/json",
                data: JSON.stringify({ 'groupSetId': classDefn.groupSetid, 'groupName': classDefn.name }),
                success: function (data) {
                    var tmpCallback = callback;
                    if (tmpCallback) {
                        tmpCallback(true);
                    }
                },
                error: function (e) {
                    var tmpCallback = callback;
                    if (tmpCallback) {
                        tmpCallback(false);
                    }
                }
            });
        };
        this.mergeClasses = function (groupSets, testnum, groupName, callback) {
            $.ajax({
                type: "POST",
                url: "..\\CustomGroup\\MergeCustomGroupSets",
                contentType: "application/json",
                data: JSON.stringify({
                    'groupSets': groupSets,
                    'testnum': testnum,
                    'groupName': groupName
                }),
                success: function (result) {
                    var tmpCallback = callback;
                    if (tmpCallback) {
                        tmpCallback(result.status, result.classItem, result.message);
                    }
                },
                error: function (e) {
                    var tmpCallback = callback;
                    if (tmpCallback) {
                        tmpCallback(e.status, null, null);
                    }
                }
            });
        };
        this.deleteClasses = function (groupSets, testnum, callback) {
            $.ajax({
                type: "POST",
                url: "..\\CustomGroup\\DeleteCustomGroupSets",
                contentType: "application/json",
                data: JSON.stringify({
                    'groupSets': groupSets,
                    'testnum': testnum
                }),
                success: function (status) {
                    var tmpCallback = callback;
                    if (tmpCallback) {
                        tmpCallback(true);
                    }
                },
                error: function (e) {
                    var tmpCallback = callback;
                    if (tmpCallback) {
                        tmpCallback(false);
                    }
                }
            });
        };
        this.getStudentSets = function (testnum, callback) {
            $.ajax({
                type: "POST",
                url: "..\\Customgroup\\GetStudentSets",
                contentType: "application/json",
                data: JSON.stringify({ 'testnum': testnum }),
                success: function (data) {
                    var tmpCallback = callback;
                    if (tmpCallback) {
                        tmpCallback(data.Status, data.Results);
                    }
                },
                error: function (e) {
                    var tmpCallback = callback;
                    if (tmpCallback) {
                        tmpCallback(false, null);
                    }
                }
            });
        };
        this.updateStudentSets = function (testnum, studentSets, callback) {
            var studentGroups = [];
            for (var _i = 0, studentSets_1 = studentSets; _i < studentSets_1.length; _i++) {
                var studentSet = studentSets_1[_i];
                var studentIds = null;
                for (var _a = 0, _b = studentSet.students; _a < _b.length; _a++) {
                    var student = _b[_a];
                    studentIds = studentIds ? studentIds + "," + student.studentId : student.studentId;
                }
                studentGroups.push({
                    Id: studentSet.rowId,
                    Testnum: testnum,
                    GroupType: studentSet.type,
                    Students: studentIds
                });
            }
            $.ajax({
                type: "POST",
                url: "..\\Customgroup\\UpdateStudentSets",
                contentType: "application/json",
                data: JSON.stringify({
                    'testnum': testnum,
                    'studentGroups': studentGroups
                }),
                success: function (data) {
                    var tmpCallback = callback;
                    if (tmpCallback) {
                        tmpCallback(data.Status, data.Results);
                    }
                },
                error: function (e) {
                    var tmpCallback = callback;
                    if (tmpCallback) {
                        tmpCallback(false, null);
                    }
                }
            });
        };
        this.updateStudentsInClass = function (classDefn, callback) {
            $.ajax({
                type: "POST",
                url: "..\\Customgroup\\UpdateStudentsInClass",
                contentType: "application/json",
                data: JSON.stringify({
                    'groupSetId': classDefn.groupSetid,
                    'students': Enumerable.From(classDefn.students).Select(function (s) { return s.studentId; }).ToArray()
                }),
                success: function (data) {
                    var tmpCallback = callback;
                    if (tmpCallback) {
                        tmpCallback(true);
                    }
                },
                error: function (e) {
                    var tmpCallback = callback;
                    if (tmpCallback) {
                        tmpCallback(false);
                    }
                }
            });
        };
        this.addDeleteStudentsInClass = function (addIntoClassId, addStudents, deleteFromClassId, deleteStudents, callback) {
            $.ajax({
                type: "POST",
                url: "..\\Customgroup\\AddDeleteStudentsInClass",
                contentType: "application/json",
                data: JSON.stringify({
                    'addIntoClassId': addIntoClassId,
                    'addStudents': addStudents,
                    'deleteFromClassId': deleteFromClassId,
                    'deleteStudents': deleteStudents
                }),
                success: function (data) {
                    var tmpCallback = callback;
                    if (tmpCallback) {
                        tmpCallback(true);
                    }
                },
                error: function (e) {
                    var tmpCallback = callback;
                    if (tmpCallback) {
                        tmpCallback(false);
                    }
                }
            });
        };
        this.addClass = function (testNumber, classItem, callback) {
            var self = _this;
            // ReSharper disable InconsistentNaming
            var groupsets = Array();
            groupsets.push({
                GroupSetId: 0,
                TestNumber: testNumber,
                Name: classItem.name,
                Students: Enumerable.From(classItem.students).Select(function (x) { return x.studentId; }).ToArray(),
                Streaming: classItem.streamType,
                GroupId: _this.commonUtils.createUid()
            });
            // ReSharper restore InconsistentNaming
            $.ajax({
                type: "POST",
                url: "..\\Customgroup\\SaveCustomGroupSets",
                contentType: "application/json",
                data: JSON.stringify({ 'groupSets': groupsets, 'testNumber': testNumber }),
                success: function (data) {
                    var tmpCallback = callback;
                    if (tmpCallback) {
                        if (data && data.GroupSets.length === 1) {
                            tmpCallback(true, data.GroupSets[0]);
                        }
                        else {
                            tmpCallback(false, null);
                        }
                    }
                },
                error: function (e) {
                    var tmpCallback = callback;
                    if (tmpCallback) {
                        tmpCallback(false, null);
                    }
                }
            });
        };
        this.saveClasses = function (bandSet, callback) {
            var self = _this;
            // ReSharper disable InconsistentNaming
            var groupsets = Array();
            // ReSharper restore InconsistentNaming
            var groupId = _this.commonUtils.createUid();
            for (var _i = 0, _a = bandSet.bands; _i < _a.length; _i++) {
                var bandItem = _a[_i];
                for (var _b = 0, _c = bandItem.classes; _b < _c.length; _b++) {
                    var classItem = _c[_b];
                    groupsets.push({
                        GroupSetId: 0,
                        TestNumber: bandSet.parent.testFile.fileNumber,
                        Name: classItem.name,
                        Students: Enumerable.From(classItem.students).Select(function (x) { return x.studentId; }).ToArray(),
                        Streaming: bandItem.streamType,
                        GroupId: groupId
                    });
                }
            }
            $.ajax({
                type: "POST",
                url: "..\\Customgroup\\SaveCustomGroupSets",
                contentType: "application/json",
                data: JSON.stringify({ 'groupSets': groupsets, 'testNumber': bandSet.parent.testFile.fileNumber }),
                success: function (data) {
                    var lookup = Enumerable.From(data.GroupSets).ToDictionary(function (x) { return x.Name; }, function (x) { return x.Id; });
                    var classItems = new Array();
                    // update the groupset id in classes
                    for (var _i = 0, _a = bandSet.bands; _i < _a.length; _i++) {
                        var bandItem = _a[_i];
                        for (var _b = 0, _c = bandItem.classes; _b < _c.length; _b++) {
                            var classItem = _c[_b];
                            if (lookup.Contains(classItem.name)) {
                                classItem.groupSetid = lookup.Get(classItem.name);
                                classItems.push(classItem);
                            }
                        }
                    }
                    var tmpCallback = callback;
                    if (tmpCallback) {
                        tmpCallback(true, classItems);
                    }
                },
                error: function (e) {
                    var tmpCallback = callback;
                    if (tmpCallback) {
                        tmpCallback(false, null);
                    }
                }
            });
        };
        this.downloadTemplateFile = function (templateName, testNumber) {
            $.ajax({
                type: "POST",
                url: "..\\Customgroup\\" + templateName,
                contentType: "application/json",
                data: JSON.stringify({ 'testNumber': testNumber }),
                success: function (url) {
                    if (url === "Error: Your connection to this website has timed out. Please login again.") {
                        return;
                    }
                    url = url.replace('"', "").replace('"', "");
                    window.open(url, "_blank");
                }
            });
        };
    }
    return GroupingHelper;
}());
var StudentSetType;
(function (StudentSetType) {
    StudentSetType[StudentSetType["None"] = 0] = "None";
    StudentSetType[StudentSetType["Paired"] = 1] = "Paired";
    StudentSetType[StudentSetType["Separated"] = 2] = "Separated";
    StudentSetType[StudentSetType["CustomGroup"] = 3] = "CustomGroup";
})(StudentSetType || (StudentSetType = {}));
var StudentSet = (function () {
    function StudentSet(type) {
        var _this = this;
        this.kendoHelper = new KendoHelper();
        // ReSharper disable InconsistentNaming
        this._students = [];
        // Create a new copy studentset that has students in students list
        this.filterStudents = function (students) {
            var result = new StudentSet(_this.type);
            var lookup = Enumerable.From(students).ToDictionary(function (s) { return s.studentId; }, function (s) { return s; });
            for (var _i = 0, _a = _this.students; _i < _a.length; _i++) {
                var s = _a[_i];
                if (lookup.Contains(s.studentId)) {
                    result.students.push(lookup.Get(s.studentId));
                }
            }
            return result.students.length > 0 ? result : null;
        };
        this.studentSetId = this.kendoHelper.createUuid();
        this.type = type;
    }
    Object.defineProperty(StudentSet.prototype, "students", {
        // ReSharper restore InconsistentNaming
        get: function () {
            return this._students;
        },
        set: function (value) {
            this._students = value;
            this._studentList = Enumerable.From(this._students).Take(5).Select(function (x) { return x.name; }).ToString(",") +
                (this._students.length > 5 ? " and more..." : "");
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(StudentSet.prototype, "studentList", {
        get: function () {
            return this._studentList;
        },
        enumerable: true,
        configurable: true
    });
    return StudentSet;
}());
var ClassDefinition = (function () {
    function ClassDefinition(parent, index, count, notUsed) {
        var _this = this;
        if (count === void 0) { count = 0; }
        if (notUsed === void 0) { notUsed = false; }
        this.parent = parent;
        this.index = index;
        this.count = count;
        this.notUsed = notUsed;
        this.students = [];
        this.preallocatedStudentCount = 0;
        this.addStudent = function (student, canbeMoved) {
            if (canbeMoved === void 0) { canbeMoved = true; }
            if (Enumerable.From(_this.students).Any(function (x) { return x.id === student.id; })) {
                return;
            }
            student.setClass(_this);
            student.canMoveToOtherClass = canbeMoved;
            _this.students.push(student);
        };
        this.removeStudent = function (student) {
            student.setClass(null);
            for (var i = 0; i < _this.students.length; i++) {
                if (_this.students[i].id === student.id) {
                    _this.students.splice(i, 1);
                    return;
                }
            }
        };
        this.padLeft = function (value, length) {
            var str = '' + value;
            while (str.length < length) {
                str = "0" + str;
            }
            return str;
        };
        this.clearAddStudents = function (students) {
            _this.students = [];
            for (var _i = 0, students_1 = students; _i < students_1.length; _i++) {
                var s = students_1[_i];
                _this.addStudent(s);
            }
        };
        this.copy = function (source) {
            _this.groupSetid = source.groupSetid;
            _this.name = source.name;
            _this.streamType = source.streamType;
            _this.clearAddStudents(source.students);
            _this.calculateScore(_this.streamType);
            _this.calculateClassesAverage();
        };
        this.getNumberDigits = function (val) {
            if (val < 10) {
                return 1;
            }
            if (val < 100) {
                return 2;
            }
            return 3;
        };
        this.prepare = function (name) {
            switch (_this.parent.bandType) {
                case BandType.None:
                    _this.name = name + " " + _this.padLeft(_this.index, _this.getNumberDigits(_this.parent.classCount));
                    break;
                case BandType.Language:
                    _this.name = name + " " + _this.padLeft(_this.index, _this.getNumberDigits(_this.parent.classCount));
                    break;
                case BandType.Custom:
                    _this.name = name +
                        " " +
                        _this.padLeft(_this.index, _this.getNumberDigits(_this.parent.classCount)) +
                        " of " +
                        _this.parent.bandNo;
                    break;
                case BandType.Top:
                    _this.name = name + " " + "Top " + _this.padLeft(_this.index, _this.getNumberDigits(_this.parent.classCount));
                    break;
                case BandType.Middle:
                    _this.name = name + " " + "Middle " + _this.padLeft(_this.index, _this.getNumberDigits(_this.parent.classCount));
                    break;
                case BandType.Lowest:
                    _this.name = name + " " + "Lowest " + _this.padLeft(_this.index, _this.getNumberDigits(_this.parent.classCount));
                    break;
                default:
                    _this.name = name + " " + _this.padLeft(_this.index, _this.getNumberDigits(_this.parent.classCount));
                    break;
            }
        };
        this.calculateScore = function (streamType) {
            switch (streamType) {
                case StreamType.English:
                    Enumerable.From(_this.students).ForEach(function (s) { return s.score = s.englishScore(); });
                    break;
                case StreamType.MathsAchievement:
                    Enumerable.From(_this.students).ForEach(function (s) { return s.score = s.mathsAchievementScore(); });
                    break;
                default:
                    Enumerable.From(_this.students).ForEach(function (s) { return s.score = s.overallAbilityScore(); });
                    break;
            }
        };
        this.calculateClassesAverage = function () {
            _this.average = Enumerable.From(_this.students).Average(function (x) { return x.score; });
            _this.count = _this.students.length;
            var boys = Enumerable.From(_this.students).Where(function (x) { return x.gender === "M"; }).ToArray();
            var girls = Enumerable.From(_this.students).Where(function (x) { return x.gender === "F"; }).ToArray();
            _this.boysCount = boys.length;
            if (_this.boysCount === 0) {
                _this.boysAverage = 0;
            }
            else {
                _this.boysAverage = Enumerable.From(boys).Average(function (x) { return x.score; });
            }
            _this.girlsCount = girls.length;
            if (_this.girlsCount === 0) {
                _this.girlsAverage = 0;
            }
            else {
                _this.girlsAverage = Enumerable.From(girls).Average(function (x) { return x.score; });
            }
        };
        this.saveGroupName = function (callback) {
            if (!_this.name || _this.name === "") {
                var tmpCallback = callback;
                if (tmpCallback) {
                    tmpCallback(false);
                }
                return;
            }
        };
        this.uid = createUuid();
    }
    Object.defineProperty(ClassDefinition.prototype, "streamType", {
        get: function () {
            return this._streamType;
        },
        set: function (value) {
            this._streamType = value;
            if (this.students && this.students.length > 0) {
                this.calculateScore(value);
                this.calculateClassesAverage();
            }
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(ClassDefinition.prototype, "notAllocatedStudentCount", {
        get: function () {
            return this._notAllocatedStudentCount;
        },
        set: function (value) {
            this._notAllocatedStudentCount = value;
            this.count = value + this.preallocatedStudentCount;
        },
        enumerable: true,
        configurable: true
    });
    ;
    Object.defineProperty(ClassDefinition.prototype, "freeStudentCount", {
        get: function () {
            return Enumerable.From(this.students).Count(function (x) { return x.canMoveToOtherClass; });
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(ClassDefinition.prototype, "moreStudents", {
        get: function () {
            return this.count - (this.students ? this.students.length : 0);
        },
        enumerable: true,
        configurable: true
    });
    return ClassDefinition;
}());
var BandDefinition = (function () {
    function BandDefinition(parent, bandNo, bandName, studentCount, classCount, bandType, streamType, groupType, mixBoysGirls) {
        var _this = this;
        if (classCount === void 0) { classCount = 1; }
        if (bandType === void 0) { bandType = BandType.None; }
        if (streamType === void 0) { streamType = StreamType.OverallAbilty; }
        if (groupType === void 0) { groupType = GroupingMethod.Streaming; }
        if (mixBoysGirls === void 0) { mixBoysGirls = false; }
        this.parent = parent;
        this.bandNo = bandNo;
        this.bandName = bandName;
        this.studentCount = studentCount;
        this.classCount = classCount;
        this.bandType = bandType;
        this.streamType = streamType;
        this.groupType = groupType;
        this.mixBoysGirls = mixBoysGirls;
        this.students = [];
        this.classes = [];
        // true if the band is used as a bucket for students which are not in other bands and later need to be split to those bands.
        // E.g. language preferences classes, student who don't have language preference will be added to other language bands
        this.commonBand = false;
        this.groupHelper = new GroupingHelper();
        this.setClassCount = function (classCount) {
            _this.classCount = classCount;
            _this.classes = _this.groupHelper.createBlankClasses(_this, _this.studentCount, classCount);
        };
        this.calculateClassesAverage = function () {
            for (var _i = 0, _a = _this.classes; _i < _a.length; _i++) {
                var classDefn = _a[_i];
                classDefn.calculateClassesAverage();
            }
        };
        this.prepare = function (name, students, joinedStudents, separatedStudents, resetClasses) {
            if (students === void 0) { students = null; }
            if (joinedStudents === void 0) { joinedStudents = []; }
            if (separatedStudents === void 0) { separatedStudents = []; }
            if (resetClasses === void 0) { resetClasses = true; }
            if (students) {
                _this.students = students;
            }
            // Reset the students list
            if (resetClasses) {
                for (var _i = 0, _a = _this.classes; _i < _a.length; _i++) {
                    var classItem = _a[_i];
                    classItem.students = [];
                }
            }
            switch (_this.groupType) {
                case GroupingMethod.MixedAbility:
                    _this.groupHelper.groupByMixAbility(_this.classes, _this.students, _this.streamType, _this.mixBoysGirls, joinedStudents, separatedStudents);
                    break;
                case GroupingMethod.Streaming:
                    _this.groupHelper.groupByStreaming(_this.classes, _this.students, _this.streamType, _this.mixBoysGirls);
                    break;
                case GroupingMethod.Banding:
                case GroupingMethod.TopMiddleLowest:
                case GroupingMethod.Language:
                case GroupingMethod.SchoolGroup:
                    break;
            }
            _this.groupHelper.handleJoinedStudents(_this.classes, joinedStudents);
            _this.groupHelper.handleSeparatedStudents(_this.classes, separatedStudents);
            for (var i = 0; i < _this.classes.length; i++) {
                _this.classes[i].prepare(name);
                _this.classes[i].calculateClassesAverage();
            }
        };
        this.calculateClassesSize = function (classCount) {
            var studentInClass = Math.floor(_this.studentCount / classCount);
            var remainingStudents = _this.studentCount - (studentInClass * classCount);
            _this.classes = [];
            for (var i = 0; i < classCount; i++) {
                _this.classes.push(new ClassDefinition(_this, i + 1, studentInClass + (remainingStudents > 0 ? 1 : 0)));
                remainingStudents--;
            }
        };
        this.uid = createUuid();
        this.setClassCount(classCount);
    }
    return BandDefinition;
}());
var BandSet = (function () {
    function BandSet(parent, name, studentCount, bandCount, bandType, bandStreamType, streamType, groupType, mixBoysGirls) {
        var _this = this;
        if (bandCount === void 0) { bandCount = 1; }
        if (bandType === void 0) { bandType = BandType.None; }
        if (bandStreamType === void 0) { bandStreamType = BandStreamType.Streaming; }
        if (streamType === void 0) { streamType = StreamType.OverallAbilty; }
        if (groupType === void 0) { groupType = GroupingMethod.Streaming; }
        if (mixBoysGirls === void 0) { mixBoysGirls = false; }
        this.parent = parent;
        this.name = name;
        this.studentCount = studentCount;
        this.bandType = bandType;
        this.bandStreamType = bandStreamType;
        this.streamType = streamType;
        this.groupType = groupType;
        this.mixBoysGirls = mixBoysGirls;
        this.students = [];
        this.groupingHelper = new GroupingHelper();
        this.prepare = function (name, students, joinedStudents, separatedStudents, resetClasses) {
            if (joinedStudents === void 0) { joinedStudents = []; }
            if (separatedStudents === void 0) { separatedStudents = []; }
            if (resetClasses === void 0) { resetClasses = true; }
            _this.students = students;
            if (_this.bandCount === 1) {
                _this.bands[0].students = _this.students;
                _this.bands[0].prepare(name, _this.students, joinedStudents, separatedStudents, resetClasses);
                return;
            }
            var classes = _this.convertToClasses(_this);
            // Reset the students list
            if (resetClasses) {
                for (var _i = 0, classes_1 = classes; _i < classes_1.length; _i++) {
                    var classItem = classes_1[_i];
                    classItem.students = [];
                }
            }
            if (_this.bandStreamType === BandStreamType.Streaming) {
                _this.groupingHelper.groupByStreaming(classes, _this.students, _this.streamType, _this.mixBoysGirls);
            }
            else {
                _this.groupingHelper.groupByMixAbility(classes, _this.students, _this.streamType, _this.mixBoysGirls);
            }
            _this.groupingHelper.handleJoinedStudents(classes, joinedStudents);
            _this.groupingHelper.handleSeparatedStudents(classes, separatedStudents);
            for (var i = 0; i < _this.bands.length; i++) {
                _this.bands[i].students = classes[i].students;
                _this.bands[i].prepare(name, null, joinedStudents, separatedStudents);
            }
        };
        this.createBands = function (name, studentCount, bandCount, bandType, streamType, groupType, mixBoysGirls) {
            if (bandType === void 0) { bandType = BandType.Custom; }
            if (streamType === void 0) { streamType = StreamType.OverallAbilty; }
            if (groupType === void 0) { groupType = GroupingMethod.Streaming; }
            if (mixBoysGirls === void 0) { mixBoysGirls = false; }
            var tmpBands = _this.groupingHelper.calculateClassesSize(studentCount, bandCount);
            _this.bands = [];
            for (var i = 0; i < bandCount; i++) {
                var bandNo = i + 1;
                var band = new BandDefinition(_this, bandNo, name + " " + bandNo, tmpBands[i], 1, bandType, streamType, groupType, mixBoysGirls);
                _this.bands.push(band);
            }
        };
        this.convertToClasses = function (bandSet) {
            var classes = new Array();
            for (var i = 0; i < bandSet.bands.length; i++) {
                classes.push(new ClassDefinition(null, i + 1, bandSet.bands[i].studentCount));
            }
            return classes;
        };
        this.uid = createUuid();
        this.createBands(name, studentCount, bandCount, bandType, streamType, groupType, mixBoysGirls);
    }
    Object.defineProperty(BandSet.prototype, "bandCount", {
        get: function () {
            return this.bands ? this.bands.length : 0;
        },
        enumerable: true,
        configurable: true
    });
    return BandSet;
}());
var CustomBandSet = (function (_super) {
    __extends(CustomBandSet, _super);
    function CustomBandSet(parent, studentCount, bandCount, bandStreamType, bandType, streamType, groupType, mixBoysGirls) {
        var _this = this;
        if (bandCount === void 0) { bandCount = 1; }
        if (bandStreamType === void 0) { bandStreamType = BandStreamType.Streaming; }
        if (bandType === void 0) { bandType = BandType.None; }
        if (streamType === void 0) { streamType = StreamType.OverallAbilty; }
        if (groupType === void 0) { groupType = GroupingMethod.Streaming; }
        if (mixBoysGirls === void 0) { mixBoysGirls = false; }
        _super.call(this, parent, "Custom", studentCount, bandCount, bandType, bandStreamType, streamType, groupType, mixBoysGirls);
        this.parent = parent;
        this.studentCount = studentCount;
        this.bandCount = bandCount;
        this.prepare = function (name, students) {
            _this.students = students;
            var classes = _this.convertToClasses(_this);
            if (_this.bandStreamType === BandStreamType.Streaming) {
                _this.groupingHelper.groupByStreaming(classes, _this.students, _this.streamType, _this.mixBoysGirls);
            }
            else {
                _this.groupingHelper.groupByMixAbility(classes, _this.students, _this.streamType, _this.mixBoysGirls);
            }
            _this.bands[0].students = _this.students;
            for (var i = 0; i < _this.bands.length; i++) {
                _this.bands[i].students = classes[i].students;
                _this.bands[i].prepare(name);
            }
        };
    }
    return CustomBandSet;
}(BandSet));
var TopMiddleLowestBandSet = (function (_super) {
    __extends(TopMiddleLowestBandSet, _super);
    function TopMiddleLowestBandSet(parent, studentCount, bandStreamType, bandType, streamType, groupType, mixBoysGirls) {
        var _this = this;
        if (bandStreamType === void 0) { bandStreamType = BandStreamType.Streaming; }
        if (bandType === void 0) { bandType = BandType.None; }
        if (streamType === void 0) { streamType = StreamType.OverallAbilty; }
        if (groupType === void 0) { groupType = GroupingMethod.Streaming; }
        if (mixBoysGirls === void 0) { mixBoysGirls = false; }
        _super.call(this, parent, "TopMiddleLowest", studentCount, 3, BandType.Custom, bandStreamType, streamType, groupType, mixBoysGirls);
        this.parent = parent;
        this.studentCount = studentCount;
        this.bandStreamType = bandStreamType;
        this.setStudentCount = function (studentCount) {
            _this.studentCount = studentCount;
            _this.createBands(_this.name, studentCount, _this.bandCount, _this.bandType, _this.streamType, _this.groupType, _this.mixBoysGirls);
        };
        this.bands[0].bandType = BandType.Top;
        this.bands[1].bandType = BandType.Middle;
        this.bands[2].bandType = BandType.Lowest;
        this.bands[0].bandName = "Top";
        this.bands[1].bandName = "Middle";
        this.bands[2].bandName = "Lowest";
    }
    return TopMiddleLowestBandSet;
}(BandSet));
var ClassesDefinition = (function () {
    function ClassesDefinition(testFile, students) {
        var _this = this;
        if (testFile === void 0) { testFile = null; }
        if (students === void 0) { students = null; }
        this.testFile = testFile;
        this.students = [];
        this.spreadBoysGirlsEqually = false;
        this.excludeLeavingStudent = false;
        this.genderStudents = function (gender) {
            switch (gender) {
                case Gender.Girls:
                    return Enumerable.From(_this.students).Where(function (x) { return x.gender === "F"; }).ToArray();
                case Gender.Boys:
                    return Enumerable.From(_this.students).Where(function (x) { return x.gender === "M"; }).ToArray();
            }
            return _this.students;
        };
        this.genderStudentCount = function (gender) {
            var studentCount = _this.studentCount;
            switch (gender) {
                case Gender.Girls:
                    studentCount = _this.girlsCount;
                    break;
                case Gender.Boys:
                    studentCount = _this.boysCount;
                    break;
            }
            return studentCount;
        };
        this.setStudentLanguagePrefs = function () {
            if (!_this.students) {
                return;
            }
            for (var _i = 0, _a = _this.students; _i < _a.length; _i++) {
                var s = _a[_i];
                s.setLanguagePrefs();
            }
        };
        this.setSchoolGroups = function () {
            if (!_this.students) {
                return;
            }
            for (var _i = 0, _a = _this.students; _i < _a.length; _i++) {
                var s = _a[_i];
                s.setSchoolGroups();
            }
        };
        this.createBandSet = function (name, studentCount, bandCount, bandStreamType, bandType, streamType, groupType, mixBoysGirls) {
            if (bandCount === void 0) { bandCount = 1; }
            if (bandStreamType === void 0) { bandStreamType = BandStreamType.Streaming; }
            if (bandType === void 0) { bandType = BandType.None; }
            if (streamType === void 0) { streamType = StreamType.OverallAbilty; }
            if (groupType === void 0) { groupType = GroupingMethod.Streaming; }
            if (mixBoysGirls === void 0) { mixBoysGirls = false; }
            return new BandSet(_this, name, studentCount, bandCount, bandType, bandStreamType, streamType, groupType, mixBoysGirls);
        };
        this.createPreAllocatedClassBandSet = function (name, studentCount, bandCount, bandStreamType, bandType, streamType, groupType, mixBoysGirls) {
            if (bandCount === void 0) { bandCount = 1; }
            if (bandStreamType === void 0) { bandStreamType = BandStreamType.Streaming; }
            if (bandType === void 0) { bandType = BandType.None; }
            if (streamType === void 0) { streamType = StreamType.OverallAbilty; }
            if (groupType === void 0) { groupType = GroupingMethod.Streaming; }
            if (mixBoysGirls === void 0) { mixBoysGirls = false; }
            var bandSet = new BandSet(_this, name, studentCount, bandCount, bandType, bandStreamType, streamType, groupType, mixBoysGirls);
            bandSet.bandType = BandType.PreallocatedClass;
            return bandSet;
        };
        this.createSchoolGroupBandSet = function (name, studentCount, bandCount, bandStreamType, bandType, streamType, groupType, mixBoysGirls) {
            if (bandCount === void 0) { bandCount = 1; }
            if (bandStreamType === void 0) { bandStreamType = BandStreamType.Streaming; }
            if (bandType === void 0) { bandType = BandType.None; }
            if (streamType === void 0) { streamType = StreamType.OverallAbilty; }
            if (groupType === void 0) { groupType = GroupingMethod.Streaming; }
            if (mixBoysGirls === void 0) { mixBoysGirls = false; }
            var bandSet = new BandSet(_this, name, studentCount, bandCount, bandType, bandStreamType, streamType, groupType, mixBoysGirls);
            bandSet.bandType = BandType.SchoolGroup;
            return bandSet;
        };
        this.createCustomBandSet = function (name, studentCount, bandCount) {
            return new CustomBandSet(_this, studentCount, bandCount);
        };
        this.createTopMiddleBottomBandSet = function (name, studentCount, bandStreamType, bandType, streamType, groupType, mixBoysGirls) {
            if (bandStreamType === void 0) { bandStreamType = BandStreamType.Streaming; }
            if (bandType === void 0) { bandType = BandType.None; }
            if (streamType === void 0) { streamType = StreamType.OverallAbilty; }
            if (groupType === void 0) { groupType = GroupingMethod.Streaming; }
            if (mixBoysGirls === void 0) { mixBoysGirls = false; }
            return new TopMiddleLowestBandSet(_this, studentCount, bandStreamType, bandType, streamType, groupType, mixBoysGirls);
        };
        this.uid = createUuid();
        if (testFile != null) {
            this.groupGender = testFile.isUnisex ? Gender.All : (testFile.hasBoys ? Gender.Boys : Gender.Girls);
            this.testFile = testFile;
            this.boysCount = 0;
            this.girlsCount = 0;
            if (!students) {
                students = testFile.students;
            }
            for (var _i = 0, students_2 = students; _i < students_2.length; _i++) {
                var s = students_2[_i];
                this.students.push(new StudentClass(s));
                if (s.sex === "M") {
                    this.boysCount++;
                }
                if (s.sex === "F") {
                    this.girlsCount++;
                }
            }
        }
    }
    Object.defineProperty(ClassesDefinition.prototype, "studentCount", {
        get: function () {
            return this.students.length;
        },
        enumerable: true,
        configurable: true
    });
    return ClassesDefinition;
}());
//# sourceMappingURL=custom-group.js.map