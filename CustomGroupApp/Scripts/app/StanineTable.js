var Stanine = (function () {
    function Stanine(subject, stanine, score) {
        this.subject = subject;
        this.stanine = stanine;
        this.score = score;
    }
    return Stanine;
}());
var StanineTables = (function () {
    function StanineTables() {
        var _this = this;
        this.stanines = new Array();
        this.setStanines = function (data) {
            _this.stanines = [];
            for (var _i = 0, data_1 = data; _i < data_1.length; _i++) {
                var table = data_1[_i];
                for (var i = 0; i < table.Stanines.length; i++) {
                    _this.stanines.push(new Stanine(table.Subject, i + 1, table.Stanines[i]));
                }
            }
        };
        this.getStanine = function (score, subject) {
            var table = Enumerable.From(_this.stanines).Where(function (s) { return s.subject === subject; }).OrderBy(function (s) { return s.score; }).ToArray();
            for (var _i = 0, table_1 = table; _i < table_1.length; _i++) {
                var s = table_1[_i];
                if (score <= s.score) {
                    return s.stanine;
                }
            }
            return 0;
        };
        this.getStanineRangeScore = function (score, subject, maxScore) {
            var table = Enumerable.From(_this.stanines).Where(function (s) { return s.subject === subject; }).OrderBy(function (s) { return s.score; }).ToArray();
            var stanine = 1;
            var x1 = 0;
            var x2 = table[0].score;
            for (var i = 0; i < table.length; i++) {
                if (score <= table[i].score) {
                    stanine = i + 1;
                    x2 = stanine === 9 ? maxScore : table[i].score;
                    break;
                }
                x1 = table[i].score;
            }
            if ((x2 - x1) === 0)
                return (stanine - 1);
            return (stanine - 1) + (score - x1) / (x2 - x1);
        };
    }
    return StanineTables;
}());
//# sourceMappingURL=StanineTable.js.map