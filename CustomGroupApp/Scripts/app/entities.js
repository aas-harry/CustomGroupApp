var subjectTypes = [
    { Subject: "Unknown", Index: 0, IsAchievement: false, IsAbility: false },
    { Subject: "Genab", Index: 1, IsAchievement: false, IsAbility: true },
    { Subject: "Verbal", Index: 2, IsAchievement: false, IsAbility: true },
    { Subject: "NonVerbal", Index: 3, IsAchievement: false, IsAbility: true },
    { Subject: "MathReasoning", Index: 4, IsAchievement: false, IsAbility: true },
    { Subject: "MathPerformance", Index: 5, IsAchievement: true, IsAbility: false },
    { Subject: "Reading", Index: 6, IsAchievement: true, IsAbility: false },
    { Subject: "Writing", Index: 7, IsAchievement: true, IsAbility: false },
    { Subject: "Spelling", Index: 8, IsAchievement: true, IsAbility: false },
    { Subject: "Ravens", Index: 9, IsAchievement: false, IsAbility: true }
];
var ReportType;
(function (ReportType) {
    ReportType[ReportType["None"] = 0] = "None";
    ReportType[ReportType["StudentResults"] = 1] = "StudentResults";
    ReportType[ReportType["SchoolStudentRecord"] = 2] = "SchoolStudentRecord";
    ReportType[ReportType["NationalProgressIndex"] = 3] = "NationalProgressIndex";
    ReportType[ReportType["StudentMathsSkillsProfileList"] = 4] = "StudentMathsSkillsProfileList";
    ReportType[ReportType["StudentMathsSkillsProfileTable"] = 5] = "StudentMathsSkillsProfileTable";
    ReportType[ReportType["StudentReadingSkillsProfileList"] = 6] = "StudentReadingSkillsProfileList";
    ReportType[ReportType["StudentReadingSkillsProfileTable"] = 7] = "StudentReadingSkillsProfileTable";
    ReportType[ReportType["StudentWritingCriteria"] = 8] = "StudentWritingCriteria";
    ReportType[ReportType["StudentMarkedWritingScript"] = 9] = "StudentMarkedWritingScript";
    ReportType[ReportType["StudentCareerProfile"] = 10] = "StudentCareerProfile";
})(ReportType || (ReportType = {}));
var TestCategory;
(function (TestCategory) {
    TestCategory[TestCategory["None"] = 0] = "None";
    TestCategory[TestCategory["Placement"] = 1] = "Placement";
    TestCategory[TestCategory["Scholarship"] = 2] = "Scholarship";
    TestCategory[TestCategory["GandT"] = 3] = "GandT";
    TestCategory[TestCategory["Nwpa"] = 4] = "Nwpa";
})(TestCategory || (TestCategory = {}));
var Subject = (function () {
    function Subject() {
        this.index = 0;
        this.subject = "";
        this.isAchievement = false;
        this.isAbility = false;
    }
    return Subject;
}());
var User = (function () {
    function User() {
        var _this = this;
        this.greeting = function () {
            return "Hi " + _this.name;
        };
    }
    return User;
}());
var School = (function () {
    function School() {
        this.isMainSchool = false;
    }
    return School;
}());
var TestFile = (function () {
    function TestFile() {
        var _this = this;
        this.school = new School();
        this.subjectTypes = [];
        this.students = [];
        this.hasBoys = false;
        this.hasGirls = false;
        this.customGroups = [];
        this.description = function () {
            if (_this.fileNumber === 1015049) {
                return _this.fileNumber + " " + _this.category + " Ravens";
            }
            return _this.fileNumber + " " + _this.category;
        };
        this.set = function (test, school, results, languages, customGroupSets) {
            if (customGroupSets === void 0) { customGroupSets = []; }
            _this.fileNumber = test.Testnum;
            _this.grade = test.Grade;
            _this.category = test.Category;
            _this.testDate = new Date(parseInt(test.Testdate.substr(6)));
            _this.testYear = _this.testDate.getFullYear();
            _this.setStudents(results, languages);
            _this.setStudentLanguagePrefs(languages, _this.students);
            _this.setCustomGroups(customGroupSets, _this.students);
            if (school) {
                _this.school.name = school.Name;
                _this.school.id = school.Id;
                _this.school.scode = test.Scode;
                _this.school.isMainSchool = school.IsMainSchool;
            }
        };
        this.clear = function () {
            _this.fileNumber = undefined;
            _this.grade = undefined;
            _this.category = undefined;
            _this.testDate = undefined;
            _this.testYear = undefined;
            _this.studentCount = undefined;
            _this.published = undefined;
            _this.subjectTypes = [];
            _this.students = [];
        };
        this.setCustomGroups = function (data, students) {
            if (students === null) {
                students = _this.students;
            }
            _this.customGroups = [];
            var studentDict = Enumerable.From(students).ToDictionary(function (x) { return x.studentId; }, function (x) { return x; });
            for (var _i = 0, data_1 = data; _i < data_1.length; _i++) {
                var item = data_1[_i];
                var classItem = new ClassDefinition(null, 0, 0);
                for (var _a = 0, _b = item.Students; _a < _b.length; _a++) {
                    var id = _b[_a];
                    if (studentDict.Contains(id)) {
                        classItem.students.push(new StudentClass(studentDict.Get(id)));
                    }
                }
                classItem.count = classItem.students.length;
                classItem.name = item.Name;
                classItem.groupSetid = item.GroupSetId;
                classItem.streamType = item.Streaming;
                _this.customGroups.push(classItem);
            }
            _this.hasCustomGroups = _this.customGroups.length > 0;
        };
        this.addCustomGroup = function (item) {
            var studentDict = Enumerable.From(_this.students).ToDictionary(function (x) { return x.studentId; }, function (x) { return x; });
            var classItem = new ClassDefinition(null, 0, 0);
            for (var _i = 0, _a = item.Students; _i < _a.length; _i++) {
                var id = _a[_i];
                if (studentDict.Contains(id)) {
                    classItem.students.push(new StudentClass(studentDict.Get(id)));
                }
            }
            classItem.count = classItem.students.length;
            classItem.name = item.Name;
            classItem.groupSetid = item.GroupSetId;
            classItem.streamType = item.Streaming;
            _this.customGroups.push(classItem);
            return classItem;
        };
        this.setStudentLanguagePrefs = function (langPrefs, students) {
            if (students === void 0) { students = null; }
            if (!langPrefs || langPrefs.length === 0) {
                return;
            }
            if (!students) {
                students = _this.students;
            }
            var enumerable = Enumerable.From(langPrefs);
            students.forEach(function (student) {
                var languagePrefs = enumerable.FirstOrDefault(null, function (s) { return s.StudentId === student.studentId; });
                if (languagePrefs != null) {
                    if (languagePrefs.Pref1) {
                        student.languagePrefs.push(languagePrefs.Pref1);
                    }
                    if (languagePrefs.Pref2) {
                        student.languagePrefs.push(languagePrefs.Pref2);
                    }
                    if (languagePrefs.Pref3) {
                        student.languagePrefs.push(languagePrefs.Pref3);
                    }
                }
            });
            _this.hasStudentLanguagePrefs = true;
        };
        this.setSchoolGroup = function (studentGroups, students) {
            if (students === void 0) { students = null; }
            if (!studentGroups || studentGroups.length === 0) {
                return;
            }
            if (!students) {
                students = _this.students;
            }
            var lookup = Enumerable.From(studentGroups).ToDictionary(function (x) { return x.StudentId; }, function (x) { return x.Group; });
            students.forEach(function (student) {
                if (lookup.Contains(student.studentId)) {
                    student.schoolGroup = lookup.Get(student.studentId);
                }
                else {
                    student.schoolGroup = "";
                }
            });
        };
        this.setStudents = function (data, langPrefs) {
            if (langPrefs === void 0) { langPrefs = []; }
            _this.students = [];
            _this.hasGirls = false;
            _this.hasBoys = false;
            _this.hasStudentLanguagePrefs = langPrefs && langPrefs.length > 0;
            var enumerable = Enumerable.From(langPrefs);
            Enumerable.From(data).OrderBy(function (x) { return x.Name; }).ForEach(function (s) {
                var student = new Student(s);
                _this.students.push(student);
                if (!_this.hasBoys && s.Sex === "M") {
                    _this.hasBoys = true;
                }
                if (!_this.hasGirls && s.Sex === "F") {
                    _this.hasGirls = true;
                }
                if (_this.hasStudentLanguagePrefs) {
                    var languagePrefs = enumerable.FirstOrDefault(null, function (s) { return s.StudentId === student.studentId; });
                    if (languagePrefs != null) {
                        if (languagePrefs.Pref1) {
                            student.languagePrefs.push(languagePrefs.Pref1);
                        }
                        if (languagePrefs.Pref2) {
                            student.languagePrefs.push(languagePrefs.Pref2);
                        }
                        if (languagePrefs.Pref3) {
                            student.languagePrefs.push(languagePrefs.Pref3);
                        }
                    }
                }
            });
            _this.hasStudentIds = Enumerable.From(_this.students).Any(function (s) { return s.schoolStudentId !== ""; });
            _this.studentCount = _this.students.length;
            _this.isUnisex = _this.hasGirls && _this.hasBoys;
        };
        this.filterTestByGroup = function (classItem) {
            return _this.filterTest(Enumerable.From(classItem.students).Select(function (s) { return s.studentId; }).ToArray());
        };
        this.filterTest = function (filtered) {
            if (!_this.students || _this.students.length === 0) {
                return [];
            }
            var studentFilter = Enumerable.From(filtered).ToDictionary(function (x) { return x; }, function (x) { return x; });
            return Enumerable.From(_this.students).Where(function (s) { return studentFilter.Contains(s.studentId); }).ToArray();
        };
    }
    Object.defineProperty(TestFile.prototype, "yearLevel", {
        get: function () {
            return this.grade + " / " + this.testYear;
        },
        enumerable: true,
        configurable: true
    });
    return TestFile;
}());
var RangeScore = (function () {
    function RangeScore(low, high) {
        var _this = this;
        this.low = low;
        this.high = high;
        this.range = function () {
            return _this.low + "-" + _this.high;
        };
    }
    return RangeScore;
}());
var Score = (function () {
    function Score(raw, stanine, scaledScore, score, range, naplan) {
        this.raw = raw;
        this.stanine = stanine;
        this.scaledScore = scaledScore;
        this.score = score;
        this.range = range;
        this.naplan = naplan;
    }
    return Score;
}());
var Student = (function () {
    function Student(r) {
        var _this = this;
        this.languagePrefs = [];
        this.overallAbilityScore = function () {
            var total = 0;
            total += _this.genab.scaledScore ? _this.genab.scaledScore : 0;
            total += _this.mathPerformance.scaledScore ? _this.mathPerformance.scaledScore : 0;
            total += _this.reading.scaledScore ? _this.reading.scaledScore : 0;
            total += _this.writing.scaledScore ? _this.writing.scaledScore : 0;
            return total;
        };
        this.mathsAchievementScore = function () {
            return _this.mathPerformance.scaledScore ? _this.mathPerformance.scaledScore : 0;
        };
        this.mathsAchievemenQrScore = function () {
            var total = 0;
            total += _this.mathPerformance.raw ? _this.mathPerformance.raw : 0;
            total += _this.mathQr.raw ? _this.mathQr.raw : 0;
            return total;
        };
        this.englishScore = function () {
            var total = 0;
            total += _this.verbal.scaledScore ? _this.verbal.scaledScore : 0;
            total += _this.reading.scaledScore ? _this.reading.scaledScore : 0;
            total += _this.writing.scaledScore ? _this.writing.scaledScore : 0;
            return total;
        };
        this.studentId = r.Id;
        this.commonId = r.GlobalStudentId;
        this.schoolStudentId = r.Student_id;
        this.name = r.Name;
        this.sex = r.Sex;
        this.dob = new Date(parseInt(r.Dob.substr(6)));
        this.speak = r.Speak;
        this.liveInAus = r.Live_in_as;
        this.ca = r.Ca;
        this.genab = new Score(r.Genab, r.Iqs, r.T_genab, r.S_genab, new RangeScore(r.Iq1, r.Iq2), null);
        this.verbal = new Score(r.Verb, r.Vis, r.T_verbal, r.S_verbal, new RangeScore(r.Vil, r.Vih), null);
        this.nonverbal = new Score(r.Nverb, r.Nvis, r.T_nverbal, r.S_nonverb, new RangeScore(r.Nvil, r.Nvih), null);
        this.mathPerformance = new Score(r.Prs, r.Pst, r.T_pst, r.S_mathper, null, r.NpiMath);
        this.mathQr = new Score(r.Qr, null, null, null, null, null);
        this.reading = new Score(r.Rrs, r.Rst, r.T_rst, r.S_reading, null, r.NpiRead);
        this.spelling = new Score(r.Srs, r.Sst, r.T_sst, r.S_spelling, null, null);
        this.writing = new Score(r.Wrs, r.Wrt, r.T_wr, r.S_written, null, r.NpiWrit);
        this.raven = new Score(r.Raven, r.Iqs2, r.T_mst, null, new RangeScore(r.Iq12, r.Iq22), null);
        this.serialno = r.Serialno;
        this.schoolGroup = "";
    }
    Object.defineProperty(Student.prototype, "hasLanguagePrefs", {
        get: function () {
            return this.languagePrefs && this.languagePrefs.length > 0;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Student.prototype, "hasSchoolStudentId", {
        get: function () {
            return this.schoolStudentId && this.schoolStudentId !== "";
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Student.prototype, "dobString", {
        get: function () {
            return kendo.toString(this.dob, "d");
        },
        enumerable: true,
        configurable: true
    });
    return Student;
}());
//# sourceMappingURL=entities.js.map