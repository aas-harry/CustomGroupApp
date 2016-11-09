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
        };
        this.setStudents = function (data, langPrefs) {
            if (langPrefs === void 0) { langPrefs = []; }
            _this.students = [];
            _this.hasGirls = false;
            _this.hasBoys = false;
            var hasStudentLangPrefs = langPrefs && langPrefs.length > 0;
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
                if (hasStudentLangPrefs) {
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
            _this.studentCount = _this.students.length;
            _this.isUnisex = _this.hasGirls && _this.hasBoys;
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
        this.genab = new Score(r.Genab, r.Iqs, r.t_genab, r.Sgenab, new RangeScore(r.Iq1, r.Iq2), null);
        this.verbal = new Score(r.Verb, r.Vis, r.t_verbal, r.Sverb, new RangeScore(r.Vil, r.Vih), null);
        this.nonverbal = new Score(r.Nverb, r.Nvis, r.t_nverbal, r.Snverb, new RangeScore(r.Nvil, r.Nvih), null);
        this.mathPerformance = new Score(r.Prs, r.Pst, r.t_pst, r.Smath, null, r.NpiMath);
        this.reading = new Score(r.Rrs, r.Rst, r.t_rst, r.Sread, null, r.NpiRead);
        this.spelling = new Score(r.Srs, r.Sst, r.t_sst, r.Sspell, null, null);
        this.writing = new Score(r.Wrs, r.Wrt, r.t_wr, r.Swrit, null, r.NpiWrit);
        this.raven = new Score(r.Raven, r.Iqs2, r.Tmst, null, new RangeScore(r.Iq12, r.Iq22), null);
        this.serialno = r.snow;
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