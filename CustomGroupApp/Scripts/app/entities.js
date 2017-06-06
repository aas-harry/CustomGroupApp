var ReportType;
(function (ReportType) {
    ReportType[ReportType["None"] = 0] = "None";
    ReportType[ReportType["StudentResults"] = 1] = "StudentResults";
    ReportType[ReportType["SchoolStudentRecord"] = 2] = "SchoolStudentRecord";
    ReportType[ReportType["NationalProgressIndex"] = 3] = "NationalProgressIndex";
    ReportType[ReportType["StudentMathsSkillsProfile"] = 4] = "StudentMathsSkillsProfile";
    ReportType[ReportType["StudentMathsSkillsProfileList"] = 5] = "StudentMathsSkillsProfileList";
    ReportType[ReportType["StudentMathsSkillsProfileTable"] = 6] = "StudentMathsSkillsProfileTable";
    ReportType[ReportType["StudentReadingSkillsProfile"] = 7] = "StudentReadingSkillsProfile";
    ReportType[ReportType["StudentReadingSkillsProfileList"] = 8] = "StudentReadingSkillsProfileList";
    ReportType[ReportType["StudentReadingSkillsProfileTable"] = 9] = "StudentReadingSkillsProfileTable";
    ReportType[ReportType["WritingCriteria"] = 10] = "WritingCriteria";
    ReportType[ReportType["StudentWritingCriteria"] = 11] = "StudentWritingCriteria";
    ReportType[ReportType["StudentMarkedWritingScript"] = 12] = "StudentMarkedWritingScript";
    ReportType[ReportType["StudentCareerProfile"] = 13] = "StudentCareerProfile";
    ReportType[ReportType["StudentDetails"] = 14] = "StudentDetails";
    ReportType[ReportType["StudentPortfolio"] = 15] = "StudentPortfolio";
})(ReportType || (ReportType = {}));
var AnswerType;
(function (AnswerType) {
    AnswerType[AnswerType["NotAttempted"] = 0] = "NotAttempted";
    AnswerType[AnswerType["Correct"] = 1] = "Correct";
    AnswerType[AnswerType["Incorrect"] = 2] = "Incorrect";
})(AnswerType || (AnswerType = {}));
var TestCategory;
(function (TestCategory) {
    TestCategory[TestCategory["None"] = 0] = "None";
    TestCategory[TestCategory["Placement"] = 1] = "Placement";
    TestCategory[TestCategory["Scholarship"] = 2] = "Scholarship";
    TestCategory[TestCategory["GandT"] = 3] = "GandT";
    TestCategory[TestCategory["Nwpa"] = 4] = "Nwpa";
})(TestCategory || (TestCategory = {}));
var MeanType;
(function (MeanType) {
    MeanType[MeanType["School"] = 0] = "School";
    MeanType[MeanType["State"] = 1] = "State";
    MeanType[MeanType["National"] = 2] = "National";
})(MeanType || (MeanType = {}));
var TestType;
(function (TestType) {
    TestType[TestType["Aas"] = 0] = "Aas";
    TestType[TestType["Naplan"] = 1] = "Naplan";
})(TestType || (TestType = {}));
var TestInfo = (function () {
    function TestInfo() {
    }
    return TestInfo;
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
var WritingQuestion = (function () {
    function WritingQuestion(writingQuestion) {
        this.title = writingQuestion.Title;
        this.description = writingQuestion.Description;
        this.code = writingQuestion.Code;
        this.answers = writingQuestion.Answers;
        this.sampleDistributions = writingQuestion.SampleDistributions;
    }
    return WritingQuestion;
}());
var Question = (function () {
    function Question(seq, description, strand, difficulty, index) {
        var _this = this;
        this.seq = seq;
        this.description = description;
        this.strand = strand;
        this.difficulty = difficulty;
        this.index = index;
        this.expandDifficulty = function () {
            switch (_this.difficulty) {
                case "L":
                    _this.difficulty = "Low";
                    break;
                case "H":
                    _this.difficulty = "High";
                    break;
                case "I":
                    _this.difficulty = "Intermediate";
                    break;
            }
        };
        this.expandDifficulty();
    }
    return Question;
}());
var TestFile = (function () {
    function TestFile() {
        var _this = this;
        this.school = new School();
        this.students = [];
        this.customGroups = [];
        this.testHistory = [];
        this.pastTestResults = [];
        // Flags
        this.hasBoys = false;
        this.hasGirls = false;
        this.mathsQuestions = [];
        this.readingQuestions = [];
        this.meanScores = [];
        this.stanineTables = new StanineTables();
        this.allSubjects = new Array();
        this.writingCriteria = new WritingCriteria();
        this.description = function () {
            if (_this.fileNumber === 1015049) {
                return _this.fileNumber + " " + _this.category + " Ravens";
            }
            return _this.fileNumber + " " + _this.category;
        };
        this.set = function (test, school, results, languages, customGroupSets, stanineTables, testHistory) {
            if (customGroupSets === void 0) { customGroupSets = []; }
            _this.clear();
            _this.initSubjects(test);
            _this.fileNumber = test.Testnum;
            _this.grade = test.Grade;
            _this.category = test.Category;
            _this.testDate = new Date(parseInt(test.Testdate.substr(6)));
            _this.testYear = _this.testDate.getFullYear();
            _this.mathsQuestionSetId = test.MathProfileId;
            _this.readingQuestionSetId = test.ReadProfileId;
            _this.setStudents(results, languages);
            _this.setStudentLanguagePrefs(languages, _this.students);
            _this.setCustomGroups(customGroupSets, _this.students);
            _this.stanineTables.setStanines(stanineTables);
            _this.setTestHistory(testHistory);
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
            _this.students = [];
            _this.meanScores = [];
            _this.hasWritingCriteria = false;
            _this.hasStudentLanguagePrefs = false;
            _this.hasNaplanResults = false;
            _this.hasMathsQuestions = false;
            _this.hasReadingQuestions = false;
            _this.hasCareerDetails = false;
            _this.hasPastTestResults = false;
            _this.hasBoys = false;
            _this.hasGirls = false;
            _this.isCoopSchoolTest = false;
            _this.customGroups = [];
        };
        this.setCareerDetails = function (items) {
            var studentLookup = Enumerable.From(_this.students).ToDictionary(function (s) { return s.studentId; }, function (s) { return s; });
            for (var _i = 0, items_1 = items; _i < items_1.length; _i++) {
                var item = items_1[_i];
                if (studentLookup.Contains(item.Id)) {
                    var student = studentLookup.Get(item.Id);
                    student.careers.careers = Enumerable.From(item.StudentCareers).Select(function (s) { return new Career(s); }).ToArray();
                    student.careers.careerAwareness = item.CareerAwareness;
                    student.workCharacteristics = Enumerable.From(item.WorkCharacteristics)
                        .Select(function (s) { return new WorkCharacteristic(s); }).ToArray();
                }
            }
            _this.hasCareerDetails = true;
        };
        this.setWritingCriterias = function (writingTask, writingScores, writingQuestions, schoolScoreDistributions) {
            _this.writingCriteria.clear();
            var studentLookup = Enumerable.From(_this.students).ToDictionary(function (s) { return s.studentId; }, function (s) { return s; });
            for (var _i = 0, writingScores_1 = writingScores; _i < writingScores_1.length; _i++) {
                var score = writingScores_1[_i];
                if (studentLookup.Contains(score.StudentId)) {
                    studentLookup.Get(score.StudentId).writingCriteria = new StudentWritingCriteria(score);
                }
            }
            var questions = new Array();
            for (var _a = 0, writingQuestions_1 = writingQuestions; _a < writingQuestions_1.length; _a++) {
                var wq = writingQuestions_1[_a];
                questions.push(new WritingQuestion(wq));
            }
            var lookup = Enumerable.From(questions).ToDictionary(function (x) { return x.code; }, function (x) { return x; });
            for (var _b = 0, _c = writingTask === "P" ? _this.writingCriteria.persuasiveQuestionsOrder : _this.writingCriteria.narativeQuestionsOrder; _b < _c.length; _b++) {
                var code = _c[_b];
                if (lookup.Contains(code)) {
                    _this.writingCriteria.questions.push(lookup.Get(code));
                }
                else {
                    _this.writingCriteria.questions.push(new WritingQuestion({
                        Code: code,
                        Title: "Unknown",
                        Description: "",
                        Asnwers: [],
                        SampleDistributions: []
                    }));
                }
            }
            var _loop_1 = function(i) {
                questions[i].schoolAverage = Enumerable.From(_this.students).Average(function (s) { return s.writingCriteria.scores[i]; });
            };
            for (var i = 0; i < questions.length; i++) {
                _loop_1(i);
            }
            _this.hasWritingCriteria = true;
        };
        this.setNaplanResults = function (data) {
            var tmpNaplanResults = new Array();
            for (var i = 0; i < data.NaplanResults.length; i++) {
                tmpNaplanResults.push(new NaplanScore(data.NaplanResults[i]));
            }
            var naplanResults = Enumerable.From(tmpNaplanResults).GroupBy(function (s) { return s.studentId; }).ToArray();
            var studentLookup = Enumerable.From(_this.students).ToDictionary(function (s) { return s.studentId; }, function (s) { return s; });
            for (var _i = 0, naplanResults_1 = naplanResults; _i < naplanResults_1.length; _i++) {
                var g = naplanResults_1[_i];
                if (studentLookup.Contains(g.Key())) {
                    studentLookup.Get(g.Key()).naplanResults = g.source;
                }
            }
            _this.meanScores = [];
            for (var i = 0; i < data.MeanScores.length; i++) {
                var meanScore = new NaplanMeanScore();
                meanScore.type = data.MeanScores[i].TestType;
                meanScore.source = data.MeanScores[i].Source;
                meanScore.year = data.MeanScores[i].Year;
                meanScore.testNumber = data.MeanScores[i].TestNumber;
                meanScore.reading = data.MeanScores[i].Reading;
                meanScore.numeracy = data.MeanScores[i].Numeracy;
                meanScore.writing = data.MeanScores[i].Writing;
                _this.meanScores.push(meanScore);
            }
            _this.hasNaplanResults = true;
        };
        this.setTestHistory = function (data) {
            _this.testHistory = [];
            if (!data) {
                return;
            }
            for (var _i = 0, data_1 = data; _i < data_1.length; _i++) {
                var item = data_1[_i];
                var testInfo = new TestInfo();
                testInfo.testNumber = item.TestNumber;
                testInfo.testYear = item.TestYear;
                testInfo.category = item.TestNumber;
                testInfo.type = item.Source;
                testInfo.grade = item.Grade;
                testInfo.studentCount = item.Tested;
                _this.testHistory.push(testInfo);
            }
        };
        this.setPastTestResults = function (data) {
            _this.pastTestResults = [];
            for (var _i = 0, data_2 = data; _i < data_2.length; _i++) {
                var item = data_2[_i];
                var result = new SubjectPerformanceScore(item.Subject, item.TestNumber, item.TestDate);
                result.lowCount = item.LowCount;
                result.lowPct = item.LowPct;
                result.avgCount = item.AvgCount;
                result.avgPct = item.AvgPct;
                result.highCount = item.HighCount;
                result.highPct = item.HighPct;
                _this.pastTestResults.push(result);
            }
            _this.hasPastTestResults = true;
        };
        this.setCustomGroups = function (data, students) {
            if (students === null) {
                students = _this.students;
            }
            _this.customGroups = [];
            var studentDict = Enumerable.From(students).ToDictionary(function (x) { return x.studentId; }, function (x) { return x; });
            for (var _i = 0, data_3 = data; _i < data_3.length; _i++) {
                var item = data_3[_i];
                if (item.GroupSetId > 0) {
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
        this.setMathsQuestions = function (data) {
            _this.mathsQuestions = [];
            for (var _i = 0, data_4 = data; _i < data_4.length; _i++) {
                var q = data_4[_i];
                _this.mathsQuestions.push(new Question(q.QuestionNo, q.Description, q.Strand, q.Difficulty, q.StrandIndex));
            }
            _this.hasMathsQuestions = true;
        };
        this.setReadingQuestions = function (data) {
            _this.readingQuestions = [];
            for (var _i = 0, data_5 = data; _i < data_5.length; _i++) {
                var q = data_5[_i];
                _this.readingQuestions.push(new Question(q.QuestionNo, q.Description, q.Strand, q.Difficulty, q.StrandIndex));
            }
            _this.hasReadingQuestions = true;
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
            _this.subjectsTested = [];
            var sampleStudents = Enumerable.From(_this.students).Take(30).ToArray();
            var _loop_2 = function(item) {
                if (!item.subject) {
                    return "continue";
                }
                if (Enumerable.From(sampleStudents).Count(function (student) {
                    var score = item.subject.getScore(student);
                    if (!score) {
                        return false;
                    }
                    return score.stanine ? score.stanine > 1 : false;
                }) > 5) {
                    item.subject.isTested = true;
                    item.subject.summary.set(_this.students);
                    _this.subjectsTested.push(item.subject);
                }
            };
            for (var _i = 0, _a = _this.allSubjects; _i < _a.length; _i++) {
                var item = _a[_i];
                _loop_2(item);
            }
        };
        this.filterTestByGroup = function (classItem) {
            return _this.filterTest(Enumerable.From(classItem.students).Select(function (s) { return s.studentId; }).ToArray());
        };
        this.filterByGender = function (gender) {
            if (!_this.students || _this.students.length === 0) {
                return [];
            }
            if (gender === Gender.Girls) {
                return Enumerable.From(_this.students).Where(function (s) { return s.sex === "F"; }).ToArray();
            }
            if (gender === Gender.Boys) {
                return Enumerable.From(_this.students).Where(function (s) { return s.sex === "M"; }).ToArray();
            }
            return _this.students;
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
    TestFile.prototype.initSubjects = function (test) {
        this.allSubjects = [];
        this.allSubjects.push(new SubjectInfo(null, 0, 0, false, false));
        this.allSubjects.push(new SubjectInfo(new GenabSubject(), 1, test.Nq_genab, false, true));
        this.allSubjects.push(new SubjectInfo(new VerbalSubject(), 2, test.Nq_verbal, false, true));
        this.allSubjects.push(new SubjectInfo(new NonVerbalSubject(), 3, test.Nq_nonverb, false, true));
        this.allSubjects.push(new SubjectInfo(new RavenSubject(), 9, 60, false, true));
        this.allSubjects.push(new SubjectInfo(new MathReasoningSubject(), 4, test.Type === "2" ? 34 : 35, false, true));
        this.allSubjects.push(new SubjectInfo(new MathPerformanceSubject(), 5, test.Nq_maths, true, false));
        this.allSubjects.push(new SubjectInfo(new ReadingSubject(), 6, test.Nq_read, true, false));
        this.allSubjects.push(new SubjectInfo(new SpellingSubject(), 7, test.Nq_spell, true, false));
        this.allSubjects.push(new SubjectInfo(new WritingSubject(), 8, 35, true, false));
    };
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
    Object.defineProperty(RangeScore.prototype, "mid", {
        get: function () {
            return (this.high + this.low) / 2;
        },
        enumerable: true,
        configurable: true
    });
    return RangeScore;
}());
var NaplanMeanScore = (function () {
    function NaplanMeanScore() {
    }
    return NaplanMeanScore;
}());
var NaplanScore = (function () {
    function NaplanScore(data) {
        var _this = this;
        this.set = function (data) {
            _this.studentId = data.Id;
            _this.testNumber = data.TestNumber;
            _this.source = data.Source;
            _this.grade = data.Grade;
            _this.testYear = data.TestYear;
            _this.testDate = data.TestDate ? new Date(parseInt(data.TestDate.substr(6))) : undefined;
            _this.numeracy = data.Numeracy;
            _this.reading = data.Reading;
            _this.writing = data.Writing;
        };
        this.set(data);
    }
    return NaplanScore;
}());
var StudentAnswer = (function () {
    function StudentAnswer(question, answer) {
        this.question = question;
        this.answer = answer;
        this.seq = question.seq;
        this.description = question.description;
        this.strand = question.strand;
        this.difficulty = question.difficulty;
        this.index = question.index;
    }
    return StudentAnswer;
}());
var StrandSummary = (function () {
    function StrandSummary(strand, studentAnswers) {
        this.strand = strand;
        this.correctAnswers = 0;
        this.incorrectAnswers = 0;
        this.attemptedQuestions = 0;
        this.notAttemptedQuestions = 0;
        this.index = 0;
        this.studentAnswers = [];
        this.studentAnswers = studentAnswers;
        this.count = studentAnswers.length;
        this.index = studentAnswers.length > 0 ? studentAnswers[0].index : 0;
        for (var _i = 0, studentAnswers_1 = studentAnswers; _i < studentAnswers_1.length; _i++) {
            var s = studentAnswers_1[_i];
            if (s.answer === AnswerType.Correct) {
                this.correctAnswers++;
                this.attemptedQuestions++;
            }
            if (s.answer == AnswerType.Incorrect) {
                this.incorrectAnswers++;
                this.attemptedQuestions++;
            }
            if (s.answer == AnswerType.NotAttempted) {
                this.notAttemptedQuestions++;
            }
        }
    }
    return StrandSummary;
}());
var WritingCriteria = (function () {
    function WritingCriteria() {
        var _this = this;
        this.questions = new Array();
        this.schoolScoreDistributions = new Array();
        this.narativeQuestionsOrder = ["WRNARDEV", "WRTHMDEV", "WRVOCAB", "WRSENSTR", "WRSYNTEN", "WRPUNCT", "WRSPELL"];
        this.persuasiveQuestionsOrder = ["WRGENRE", "WRARGS", "WRRHTDEV", "WRSENSTR", "WRSYNTEN", "WRPUNCT", "WRSPELL"];
        this.clear = function () {
            _this.taskType = undefined;
            _this.questions = [];
            _this.schoolScoreDistributions = [];
        };
    }
    return WritingCriteria;
}());
var StudentWritingCriteria = (function () {
    function StudentWritingCriteria(data) {
        this.scores = [];
        this.scores.push(data.Score1);
        this.scores.push(data.Score2);
        this.scores.push(data.Score3);
        this.scores.push(data.Score4);
        this.scores.push(data.Score5);
        this.scores.push(data.Score6);
        this.scores.push(data.Score7);
        this.hasMarkedWritingScript = data.HasWritingScript,
            this.markedWritingScriptFile = data.WritingScript,
            this.serialno = data.Serialno;
    }
    return StudentWritingCriteria;
}());
var Career = (function () {
    function Career(data) {
        this.getNotes = function (desc) {
            switch (desc) {
                case "Realistic":
                    return "Work which is generally manual or practical.";
                case "Investigative":
                    return "Work which involves mathematics, science or research.";
                case "Artistic":
                    return "Work which is creative and artistic.";
                case "Social":
                    return "Work which is involves a lot of personal contact.";
                case "Enterprising":
                    return "Work which has an emphasis on business and sales.";
                case "Conventional":
                    return "Work which is administrative or clerical.";
            }
            return "Unknown Type";
        };
        this.code = data.CareerCode;
        this.description = data.Description;
        this.value = data.Value;
        this.notes = this.getNotes(this.description);
    }
    return Career;
}());
var StudentCareer = (function () {
    function StudentCareer() {
        var _this = this;
        // ReSharper disable once InconsistentNaming
        this._careers = new Array();
        this.getCareerPrefs = function () {
            if (!_this.careerPrefs) {
                _this.careerPrefs = Enumerable.From(_this.careers).OrderByDescending(function (x) { return x.value; }).Take(3).ToArray();
            }
            return _this.careerPrefs;
        };
    }
    Object.defineProperty(StudentCareer.prototype, "careers", {
        get: function () {
            return this._careers;
        },
        set: function (val) {
            this._careers = val;
            this.hasCareerData = (val && val.length > 0 && val[0].value > 0);
        },
        enumerable: true,
        configurable: true
    });
    ;
    return StudentCareer;
}());
var WorkCharacteristic = (function () {
    function WorkCharacteristic(data) {
        this.convertCode = function (code) {
            switch (code) {
                case 1:
                    return "Management";
                case 2:
                    return "Independence";
                case 3:
                    return "JobSecurity";
                case 4:
                    return "SelfDevelopment";
            }
            return "Unknown Type";
        };
        this.code = data.WorkCharacteristicType;
        this.value = data.Value;
        this.description = this.convertCode(this.code);
    }
    return WorkCharacteristic;
}());
var ScoreProfile = (function () {
    function ScoreProfile(answers) {
        var _this = this;
        this.count = 0;
        this.correctAnswers = 0;
        this.incorrectAnswers = 0;
        this.attemptedQuestions = 0;
        this.notAttemptedQuestions = 0;
        this.answers = [];
        this.hasProfile = false;
        this.getStudentAnswers = function (questions) {
            var studentAnswers = new Array();
            for (var _i = 0, questions_1 = questions; _i < questions_1.length; _i++) {
                var q = questions_1[_i];
                var index = q.seq - 1;
                var answer = index < _this.answers.length ? _this.answers[index] : AnswerType.NotAttempted;
                studentAnswers.push(new StudentAnswer(q, answer));
            }
            return studentAnswers;
        };
        this.getStrandSummary = function (studentAnswers) {
            return Enumerable.From(studentAnswers)
                .GroupBy(function (s) { return s.strand; })
                .Select(function (strand) { return new StrandSummary(strand.Key(), strand.source); })
                .ToArray();
        };
        if (answers) {
            this.hasProfile = true;
            for (var i = 0; i < answers.length; i++) {
                if (answers[i] === ".") {
                    this.notAttemptedQuestions++;
                    this.answers.push(AnswerType.NotAttempted);
                }
                else {
                    this.attemptedQuestions++;
                    if (answers[i] === "*") {
                        this.answers.push(AnswerType.Correct);
                        this.correctAnswers++;
                    }
                    else {
                        this.answers.push(AnswerType.Incorrect);
                        this.incorrectAnswers++;
                    }
                }
                this.count++;
            }
        }
    }
    return ScoreProfile;
}());
var Score = (function () {
    function Score(raw, stanine, scaledScore, score, range, naplan, answers) {
        this.raw = raw;
        this.stanine = stanine;
        this.scaledScore = scaledScore;
        this.score = score;
        this.range = range;
        this.naplan = naplan;
        this.answers = answers;
        this.scoreProfile = new ScoreProfile(answers);
    }
    return Score;
}());
var Student = (function () {
    function Student(r) {
        var _this = this;
        this.careers = new StudentCareer();
        this.workCharacteristics = [];
        this.naplanResults = [];
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
        this.liveInAust = function (val, shortDesc) {
            if (shortDesc === void 0) { shortDesc = false; }
            if (!val) {
                return "";
            }
            var years = parseInt(val);
            switch (years) {
                case 1:
                    return shortDesc ? "< 2" : "Less than 2 years";
                case 3:
                    return shortDesc ? "< 4" : "Less than 4 years";
                case 5:
                    return shortDesc ? "< 6" : "Less than 6 years";
                case 7:
                    return shortDesc ? "> 6" : "More than 6 years";
                default:
                    return "";
            }
        };
        this.bornInAust = function (val) {
            if (!val) {
                return "Yes";
            }
            var years = parseInt(val);
            return years === 0 ? "Yes" : "No";
        };
        this.languageSpeak = function (speak, shortDesc) {
            if (shortDesc === void 0) { shortDesc = true; }
            if (!speak) {
                return "";
            }
            switch (speak) {
                case "A":
                    return shortDesc ? "Always" : "Always Spoken";
                case "S":
                    return shortDesc ? "Sometimes" : "Sometimes Spoken";
                default:
                    return shortDesc ? "" : "Never Spoken";
            }
        };
        this.studentId = r.Id;
        this.commonId = r.GlobalStudentId;
        this.schoolStudentId = r.Student_id;
        this.name = r.Name;
        this.sex = r.Sex;
        this.dob = new Date(parseInt(r.Dob.substr(6)));
        this.speak = this.languageSpeak(r.Speak);
        this.liveInAus = this.liveInAust(r.Live_in_as);
        this.bornInAus = this.bornInAust(r.Live_in_as);
        this.ca = r.Ca;
        this.notes = r.Notes;
        this.genab = new Score(r.Genab, r.Iqs, r.T_genab, r.S_genab, new RangeScore(r.Iq1, r.Iq2), null, r.Genabcor);
        this.verbal = new Score(r.Verb, r.Vis, r.T_verbal, r.S_verbal, new RangeScore(r.Vil, r.Vih), null, null);
        this.nonverbal = new Score(r.Nverb, r.Nvis, r.T_nverbal, r.S_nonverb, new RangeScore(r.Nvil, r.Nvih), null, null);
        this.mathPerformance = new Score(r.Prs, r.Pst, r.T_pst, r.S_mathper, null, r.Npi_Math, r.Mathcor);
        this.mathQr = new Score(r.Qr, null, null, null, null, null, null);
        this.reading = new Score(r.Rrs, r.Rst, r.T_rst, r.S_reading, null, r.Npi_Read, r.Readcor);
        this.spelling = new Score(r.Srs, r.Sst, r.T_sst, r.S_spelling, null, null, r.Spellcor);
        this.writing = new Score(r.NewWr, r.Wrt, r.T_wr, r.S_written, null, r.Npi_Writing, null);
        this.writing.scoreProfile.correctAnswers = r.NewWr;
        this.raven = new Score(r.Raven, r.Iqs2, r.T_mst, null, new RangeScore(r.Iq12, r.Iq22), null, new Array(65 + 1).join(" "));
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