var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var GroupingMethod;
(function (GroupingMethod) {
    GroupingMethod[GroupingMethod["Unknown"] = 0] = "Unknown";
    GroupingMethod[GroupingMethod["MixedAbility"] = 1] = "MixedAbility";
    GroupingMethod[GroupingMethod["Streaming"] = 2] = "Streaming";
    GroupingMethod[GroupingMethod["Banding"] = 3] = "Banding";
    GroupingMethod[GroupingMethod["TopMiddleLowest"] = 4] = "TopMiddleLowest";
    GroupingMethod[GroupingMethod["Language"] = 5] = "Language";
    GroupingMethod[GroupingMethod["CustomGroup"] = 6] = "CustomGroup";
})(GroupingMethod || (GroupingMethod = {}));
var SearchDirection;
(function (SearchDirection) {
    SearchDirection[SearchDirection["Forward"] = 0] = "Forward";
    SearchDirection[SearchDirection["Backward"] = 1] = "Backward";
})(SearchDirection || (SearchDirection = {}));
var Gender;
(function (Gender) {
    Gender[Gender["All"] = 0] = "All";
    Gender[Gender["Girls"] = 1] = "Girls";
    Gender[Gender["Boys"] = 2] = "Boys";
})(Gender || (Gender = {}));
var BandType;
(function (BandType) {
    BandType[BandType["None"] = 0] = "None";
    BandType[BandType["Custom"] = 1] = "Custom";
    BandType[BandType["Top"] = 2] = "Top";
    BandType[BandType["Middle"] = 3] = "Middle";
    BandType[BandType["Lowest"] = 4] = "Lowest";
})(BandType || (BandType = {}));
var StreamType;
(function (StreamType) {
    StreamType[StreamType["None"] = 0] = "None";
    StreamType[StreamType["OverallAbilty"] = 1] = "OverallAbilty";
    StreamType[StreamType["English"] = 1] = "English";
    StreamType[StreamType["MathsAchievement"] = 2] = "MathsAchievement";
})(StreamType || (StreamType = {}));
var BandStreamType;
(function (BandStreamType) {
    BandStreamType[BandStreamType["None"] = 0] = "None";
    BandStreamType[BandStreamType["Streaming"] = 1] = "Streaming";
    BandStreamType[BandStreamType["Parallel"] = 2] = "Parallel";
})(BandStreamType || (BandStreamType = {}));
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
var StudentClass = (function () {
    function StudentClass(s) {
        this.s = s;
        this.source = s;
        this.name = s.name;
        this.gender = s.sex;
    }
    return StudentClass;
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
                students[i].score = students[i].source.overallAbilityScore();
            }
        };
        this.setEnglishScore = function (students) {
            for (var i = 0; i < students.length; i++) {
                students[i].score = students[i].source.englishScore();
            }
        };
        this.setMathAchievementScore = function (students) {
            for (var i = 0; i < students.length; i++) {
                students[i].score = students[i].source.mathsAchievementScore();
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
        };
        this.groupByStreaming = function (classes, students, streamType, mixBoysGirls) {
            _this.calculateTotalScore(students, streamType);
            if (!mixBoysGirls) {
                _this.groupByStreamingInternal(classes, students);
                return;
            }
            var femaleStudents = Enumerable.From(students).Where(function (s) { return (s.gender === "F"); }).Select(function (s) { return s; }).ToArray();
            var maleStudents = Enumerable.From(students).Where(function (s) { return (s.gender === "F"); }).Select(function (s) { return s; }).ToArray();
            if (femaleStudents.length < maleStudents.length) {
                _this.groupByStreamingInternal(classes, femaleStudents);
                _this.groupByStreamingInternal(classes, maleStudents);
            }
            else {
                _this.groupByStreamingInternal(classes, maleStudents);
                _this.groupByStreamingInternal(classes, femaleStudents);
            }
        };
        this.groupByMixAbility = function (classes, students, streamType, mixBoysGirls) {
            _this.calculateTotalScore(students, streamType);
            if (!mixBoysGirls) {
                _this.groupByMixAbilityInternal(classes, students);
                return;
            }
            var femaleStudents = Enumerable.From(students).Where(function (s) { return (s.gender === "F"); }).Select(function (s) { return s; }).ToArray();
            var maleStudents = Enumerable.From(students).Where(function (s) { return (s.gender === "F"); }).Select(function (s) { return s; }).ToArray();
            if (femaleStudents.length < maleStudents.length) {
                _this.groupByMixAbilityInternal(classes, femaleStudents);
                _this.groupByMixAbilityInternal(classes, maleStudents, true);
            }
            else {
                _this.groupByMixAbilityInternal(classes, maleStudents);
                _this.groupByMixAbilityInternal(classes, femaleStudents, true);
            }
        };
        this.groupByMixAbilityInternal = function (classes, students, orderReversed) {
            if (orderReversed === void 0) { orderReversed = false; }
            var sortedStudents = orderReversed === false ?
                Enumerable.From(students).OrderByDescending(function (s) { return s.score; }).Select(function (s) { return s; }).ToArray() :
                Enumerable.From(students).OrderBy(function (s) { return s.score; }).Select(function (s) { return s; }).ToArray();
            var classCount = classes.length;
            var nextClass = new SearchClassContext(0, 0, classCount - 1, false);
            for (var i = 0; i < sortedStudents.length; i++) {
                var student = sortedStudents[i];
                student.classNo = nextClass.classNo + 1;
                classes[nextClass.classNo].students.push(student);
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
                classQueue.push(classes[i]);
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
            var numberStudentsInClass = 0;
            for (var i = 0; i < sortedStudents.length; i++) {
                var student = sortedStudents[i];
                student.classNo = classNo + 1;
                classes[classNo].students.push(student);
                numberStudentsInClass++;
                if (classes[classNo].count <= numberStudentsInClass) {
                    classNo++;
                    numberStudentsInClass = 0;
                }
            }
            return classes;
        };
    }
    return GroupingHelper;
}());
var ClassDefinition = (function () {
    function ClassDefinition(parent, index, count) {
        var _this = this;
        this.parent = parent;
        this.index = index;
        this.count = count;
        this.students = [];
        this.prepare = function (name) {
            switch (_this.parent.bandType) {
                case BandType.None:
                    _this.name = name + " " + _this.index;
                    break;
                case BandType.Custom:
                    _this.name = name + " " + _this.index + "/" + _this.parent.bandNo;
                    break;
                case BandType.Top:
                    _this.name = name + " " + "Top " + _this.index;
                    break;
                case BandType.Middle:
                    _this.name = name + " " + "Middle " + _this.index;
                    break;
                case BandType.Lowest:
                    _this.name = name + " " + "Lowest " + _this.index;
                    break;
                default:
                    _this.name = name + " " + _this.index;
                    break;
            }
        };
        this.uid = createUuid();
    }
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
        this.groupHelper = new GroupingHelper();
        this.setClassCount = function (classCount) {
            _this.classCount = classCount;
            _this.calculateClassesSize(classCount);
        };
        this.calculateClassesAverage = function (classes) {
            for (var i = 0; i < classes.length; i++) {
                classes[i].average = Enumerable.From(classes[i].students).Average(function (x) { return x.score; });
                classes[i].average = Enumerable.From(classes[i].students).Average(function (x) { return x.score; });
                classes[i].average = Enumerable.From(classes[i].students).Average(function (x) { return x.score; });
                classes[i].average = Enumerable.From(classes[i].students).Average(function (x) { return x.score; });
            }
        };
        this.prepare = function (name, students) {
            if (students === void 0) { students = null; }
            if (students) {
                _this.students = students;
            }
            switch (_this.groupType) {
                case GroupingMethod.MixedAbility:
                    _this.groupHelper.groupByMixAbility(_this.classes, _this.students, _this.streamType, _this.mixBoysGirls);
                    break;
                case GroupingMethod.Streaming:
                    _this.groupHelper.groupByStreaming(_this.classes, _this.students, _this.streamType, _this.mixBoysGirls);
                    break;
                case GroupingMethod.Banding:
                    break;
                case GroupingMethod.TopMiddleLowest:
                    break;
                case GroupingMethod.Language:
                    break;
                case GroupingMethod.CustomGroup:
                    break;
            }
            for (var i = 0; i < _this.classes.length; i++) {
                _this.classes[i].prepare(name);
            }
            _this.calculateClassesAverage(_this.classes);
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
        this.prepare = function (name, students) {
            _this.students = students;
            if (_this.bandCount === 1) {
                _this.bands[0].students = _this.students;
                _this.bands[0].prepare(name, _this.students);
                return;
            }
            var classes = _this.convertToClasses(_this);
            if (_this.bandStreamType === BandStreamType.Streaming) {
                _this.groupingHelper.groupByStreaming(classes, _this.students, _this.streamType, _this.mixBoysGirls);
            }
            else {
                _this.groupingHelper.groupByMixAbility(classes, _this.students, _this.streamType, _this.mixBoysGirls);
            }
            for (var i = 0; i < _this.bands.length; i++) {
                _this.bands[i].students = classes[i].students;
                _this.bands[i].prepare(name);
            }
        };
        this.createBands = function (name, studentCount, bandCount, bandType, streamType, groupType, mixBoysGirls) {
            if (streamType === void 0) { streamType = StreamType.OverallAbilty; }
            if (groupType === void 0) { groupType = GroupingMethod.Streaming; }
            if (mixBoysGirls === void 0) { mixBoysGirls = false; }
            var tmpBands = _this.groupingHelper.calculateClassesSize(studentCount, bandCount);
            _this.bands = [];
            for (var i = 0; i < bandCount; i++) {
                var bandNo = i + 1;
                var band = new BandDefinition(_this.parent, bandNo, name + " " + bandNo, tmpBands[i], 1, bandType, streamType, groupType, mixBoysGirls);
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
        if (bandStreamType === void 0) { bandStreamType = BandStreamType.Streaming; }
        if (bandType === void 0) { bandType = BandType.None; }
        if (streamType === void 0) { streamType = StreamType.OverallAbilty; }
        if (groupType === void 0) { groupType = GroupingMethod.Streaming; }
        if (mixBoysGirls === void 0) { mixBoysGirls = false; }
        _super.call(this, parent, "TopMiddleLowest", studentCount, 3, BandType.Custom, bandStreamType, streamType, groupType, mixBoysGirls);
        this.parent = parent;
        this.studentCount = studentCount;
        this.bandStreamType = bandStreamType;
        this.bands[0].bandType = BandType.Top;
        this.bands[1].bandType = BandType.Middle;
        this.bands[2].bandType = BandType.Lowest;
    }
    return TopMiddleLowestBandSet;
}(BandSet));
var ClassesDefinition = (function () {
    function ClassesDefinition(testFile) {
        var _this = this;
        this.testFile = testFile;
        this.spreadBoysGirlsEqually = false;
        this.excludeLeavingStudent = false;
        this.createBandSet = function (name, studentCount, bandCount, bandStreamType, bandType, streamType, groupType, mixBoysGirls) {
            if (bandCount === void 0) { bandCount = 1; }
            if (bandStreamType === void 0) { bandStreamType = BandStreamType.Streaming; }
            if (bandType === void 0) { bandType = BandType.None; }
            if (streamType === void 0) { streamType = StreamType.OverallAbilty; }
            if (groupType === void 0) { groupType = GroupingMethod.Streaming; }
            if (mixBoysGirls === void 0) { mixBoysGirls = false; }
            return new BandSet(_this, name, studentCount, bandCount, bandType, bandStreamType, streamType, groupType, mixBoysGirls);
        };
        this.createCustomBandSet = function (name, studentCount, bandCount) {
            return new CustomBandSet(_this, studentCount, bandCount);
        };
        this.createTopMiddleBottomBandSet = function (name, studentCount, bandCount, bandStreamType, bandType, streamType, groupType, mixBoysGirls) {
            if (bandCount === void 0) { bandCount = 1; }
            if (bandStreamType === void 0) { bandStreamType = BandStreamType.Streaming; }
            if (bandType === void 0) { bandType = BandType.None; }
            if (streamType === void 0) { streamType = StreamType.OverallAbilty; }
            if (groupType === void 0) { groupType = GroupingMethod.Streaming; }
            if (mixBoysGirls === void 0) { mixBoysGirls = false; }
            return new TopMiddleLowestBandSet(_this, studentCount, bandStreamType, bandType, streamType, groupType, mixBoysGirls);
        };
        this.uid = createUuid();
        this.groupGender = testFile.isUnisex ? Gender.All : (testFile.hasBoys ? Gender.Boys : Gender.Girls);
        this.testFile = testFile;
        this.students = new Array();
        for (var i = 0; i < testFile.students.length; i++) {
            this.students.push(new StudentClass(testFile.students[i]));
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
