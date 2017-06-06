var SubjectInfo = (function () {
    function SubjectInfo(subject, index, count, isAchievement, isAbility) {
        this.subject = subject;
        this.index = index;
        this.count = count;
        this.isAchievement = isAchievement;
        this.isAbility = isAbility;
        if (subject) {
            subject.count = count;
        }
    }
    return SubjectInfo;
}());
var SubjectPerformanceScore = (function () {
    function SubjectPerformanceScore(subject, testNumber, testDate) {
        this.subject = subject;
        this.testNumber = testNumber;
        this.testDate = testDate;
        var subjectHelper = new SubjectHelper();
        this.name = subjectHelper.description(subject);
    }
    return SubjectPerformanceScore;
}());
var SubjectHelper = (function () {
    function SubjectHelper() {
    }
    SubjectHelper.prototype.description = function (subjectType) {
        switch (subjectType) {
            case SubjectType.Genab:
                return "General Reasoning";
            case SubjectType.Verbal:
                return "Verbal Reasoning";
            case SubjectType.NonVerbal:
                return "Non Verbal Reasoning";
            case SubjectType.Ravens:
                return "Ravens SPM";
            case SubjectType.MathReasoning:
                return "Maths Reasoning";
            case SubjectType.MathPerformance:
                return "Maths Performance";
            case SubjectType.Reading:
                return "Reading Comprehension";
            case SubjectType.Writing:
                return "Writing Expression";
            case SubjectType.Spelling:
                return "Spelling";
            case SubjectType.MathQr:
                return "Math Reasoning";
            default:
                return "Unknown test subject";
        }
    };
    return SubjectHelper;
}());
var SubjectSummary = (function () {
    function SubjectSummary(subject) {
        var _this = this;
        this.set = function (students) {
            var scores = Enumerable.From(students).Select(function (s) { return _this.subject.getScore(s); }).ToArray();
            _this.stanineAverage = Enumerable.From(scores).Average(function (s) { return s.stanine; });
            _this.rawScoreAverage = Enumerable.From(scores).Average(function (s) { return _this.subject.getRawScore(s); });
            if (_this.subject.hasNaplanScore) {
                _this.naplanAverage = Enumerable.From(scores).Average(function (s) { return s.naplan; });
            }
        };
        this.subject = subject;
    }
    return SubjectSummary;
}());
var SubjectType;
(function (SubjectType) {
    SubjectType[SubjectType["Unknown"] = 0] = "Unknown";
    SubjectType[SubjectType["Genab"] = 1] = "Genab";
    SubjectType[SubjectType["Verbal"] = 2] = "Verbal";
    SubjectType[SubjectType["NonVerbal"] = 3] = "NonVerbal";
    SubjectType[SubjectType["MathReasoning"] = 4] = "MathReasoning";
    SubjectType[SubjectType["MathPerformance"] = 5] = "MathPerformance";
    SubjectType[SubjectType["Reading"] = 6] = "Reading";
    SubjectType[SubjectType["Writing"] = 7] = "Writing";
    SubjectType[SubjectType["Spelling"] = 8] = "Spelling";
    SubjectType[SubjectType["Ravens"] = 9] = "Ravens";
    SubjectType[SubjectType["MathQr"] = 10] = "MathQr";
})(SubjectType || (SubjectType = {}));
var GenabSubject = (function () {
    function GenabSubject() {
        this.getScore = function (student) {
            return student.genab;
        };
        this.getRawScore = function (score) {
            return score.range.mid;
        };
        this.name = "General Reasoning";
        this.count = 0;
        this.subject = SubjectType.Genab;
        this.hasRangeScore = true;
        this.hasNaplanScore = false;
        this.hasCorrelationScore = true;
        this.isTested = false;
        this.summary = new SubjectSummary(this);
    }
    return GenabSubject;
}());
var VerbalSubject = (function () {
    function VerbalSubject() {
        this.getScore = function (student) {
            return student.verbal;
        };
        this.name = "Verbal Reasoning";
        this.count = 0;
        this.subject = SubjectType.Verbal;
        this.getRawScore = function (score) {
            return score.range.mid;
        };
        this.hasRangeScore = true;
        this.hasNaplanScore = false;
        this.hasCorrelationScore = true;
        this.isTested = false;
        this.summary = new SubjectSummary(this);
    }
    return VerbalSubject;
}());
var NonVerbalSubject = (function () {
    function NonVerbalSubject() {
        this.getScore = function (student) {
            return student.nonverbal;
        };
        this.name = "Non Verbal Reasoning";
        this.count = 0;
        this.getRawScore = function (score) {
            return score.range.mid;
        };
        this.subject = SubjectType.NonVerbal;
        this.hasRangeScore = true;
        this.hasNaplanScore = false;
        this.hasCorrelationScore = true;
        this.isTested = false;
        this.summary = new SubjectSummary(this);
    }
    return NonVerbalSubject;
}());
var MathReasoningSubject = (function () {
    function MathReasoningSubject() {
        this.getScore = function (student) {
            return student.mathReasoning;
        };
        this.getRawScore = function (score) {
            return score.range.mid;
        };
        this.name = "Maths Reasoning";
        this.count = 0;
        this.subject = SubjectType.MathReasoning;
        this.hasRangeScore = false;
        this.hasNaplanScore = true;
        this.hasCorrelationScore = true;
        this.isTested = false;
        this.summary = new SubjectSummary(this);
    }
    return MathReasoningSubject;
}());
var MathPerformanceSubject = (function () {
    function MathPerformanceSubject() {
        this.getScore = function (student) {
            return student.mathPerformance;
        };
        this.name = "Maths Performance";
        this.count = 0;
        this.getRawScore = function (score) {
            return score.raw;
        };
        this.subject = SubjectType.MathPerformance;
        this.hasRangeScore = false;
        this.hasNaplanScore = true;
        this.hasCorrelationScore = false;
        this.isTested = false;
        this.summary = new SubjectSummary(this);
    }
    return MathPerformanceSubject;
}());
var ReadingSubject = (function () {
    function ReadingSubject() {
        this.getScore = function (student) {
            return student.reading;
        };
        this.name = "Reading Comprehension";
        this.count = 0;
        this.getRawScore = function (score) {
            return score.raw;
        };
        this.subject = SubjectType.Reading;
        this.hasRangeScore = false;
        this.hasNaplanScore = true;
        this.hasCorrelationScore = false;
        this.isTested = false;
        this.summary = new SubjectSummary(this);
    }
    return ReadingSubject;
}());
var SpellingSubject = (function () {
    function SpellingSubject() {
        this.getScore = function (student) {
            return student.spelling;
        };
        this.name = "Spelling";
        this.count = 0;
        this.getRawScore = function (score) {
            return score.raw;
        };
        this.subject = SubjectType.Spelling;
        this.hasRangeScore = false;
        this.hasNaplanScore = false;
        this.hasCorrelationScore = false;
        this.isTested = false;
        this.summary = new SubjectSummary(this);
    }
    return SpellingSubject;
}());
var WritingSubject = (function () {
    function WritingSubject() {
        this.getScore = function (student) {
            return student.writing;
        };
        this.name = "Writing Comprehension";
        this.count = 0;
        this.getRawScore = function (score) {
            return score.raw;
        };
        this.subject = SubjectType.Writing;
        this.hasRangeScore = false;
        this.hasNaplanScore = true;
        this.hasCorrelationScore = false;
        this.isTested = false;
        this.summary = new SubjectSummary(this);
    }
    return WritingSubject;
}());
var RavenSubject = (function () {
    function RavenSubject() {
        this.getScore = function (student) {
            return student.raven;
        };
        this.name = "Ravens SPM";
        this.getRawScore = function (score) {
            return score.raw;
        };
        this.count = 0;
        this.subject = SubjectType.Ravens;
        this.hasRangeScore = false;
        this.hasNaplanScore = true;
        this.hasCorrelationScore = false;
        this.isTested = false;
        this.summary = new SubjectSummary(this);
    }
    return RavenSubject;
}());
//# sourceMappingURL=Subject.js.map