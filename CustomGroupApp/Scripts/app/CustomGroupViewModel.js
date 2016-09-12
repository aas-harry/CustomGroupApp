var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var CustomGroupViewModel = (function (_super) {
    __extends(CustomGroupViewModel, _super);
    function CustomGroupViewModel() {
        var _this = this;
        _super.call(this);
        this.customGroupSteps = [
            "SelectGroupingTypeStep",
            "enterClassConfigurationsStep",
            "StudentGroupingOptionsStep",
            "SaveCustomGroupStep"
        ];
        this.groupingOptions = new kendo.data.ObservableArray([
            { caption: "Mixed Ability", value: GroupingMethod.MixedAbility, id: "mixed-ability" },
            { caption: "Streaming", value: GroupingMethod.Streaming, id: "streaming" },
            { caption: "Banding", value: GroupingMethod.Banding, id: "banding" },
            { caption: "Top, Mixed Middle, Lowest", value: GroupingMethod.TopMiddleLowest, id: "top-middle-lowest" },
            { caption: "Language", value: GroupingMethod.Language, id: "languages" }
        ]);
        this.streamingOptions = new kendo.data.ObservableArray([
            { caption: "Overall Ability", value: StreamType.OverallAbilty, id: "overall-ability" },
            { caption: "English", value: StreamType.English, id: "english" },
            { caption: "Maths Achievement", value: StreamType.MathsAchievement, id: "maths-Achievement" }
        ]);
        this.topMiddleLowestGroupingOptions = [
            { caption: "Streaming", value: BandStreamType.Streaming, id: "streaming-tml" },
            { caption: "Parallel", value: BandStreamType.Parallel, id: "parallel-tml" }
        ];
        this.selectedGroupingOption = 0;
        this.selectedStreamingOption = 0;
        this.selectedTopClassGroupingOption = 0;
        this.selectedLowestClassGroupingOption = 0;
        this.selectedGenderOption = 1;
        this.currentGroupStep = 0;
        this.isLastStep = false;
        this.isFirstStep = true;
        this.isCoedSchool = true;
        this.studentCount = 200;
        this.classCount = 1;
        this.onClassCountChanged = function () {
        };
        this.nextStep = function () {
            _super.prototype.set.call(_this, "isFirstStep", false);
            _super.prototype.set.call(_this, "currentGroupStep", _this.currentGroupStep + 1);
            console.log("Step : ", _this.currentGroupStep, _this.customGroupSteps[_this.currentGroupStep]);
            if (_this.currentGroupStep < _this.customGroupSteps.length) {
                $.ajax({
                    type: "POST",
                    url: _this.customGroupSteps[_this.currentGroupStep],
                    dataType: "html",
                    success: function (data) {
                        $("#custom-group-content").html(data);
                        kendo.unbind("#custom-group-container");
                        kendo.bind($("#custom-group-container"), _this);
                    }
                });
            }
            else {
                _super.prototype.set.call(_this, "isLastStep", true);
            }
        };
        this.previousStep = function () {
            _super.prototype.set.call(_this, "isLastStep", false);
            _super.prototype.set.call(_this, "currentGroupStep", _this.currentGroupStep - 1);
            console.log("Step : ", _this.currentGroupStep, _this.customGroupSteps[_this.currentGroupStep]);
            if (_this.currentGroupStep > 0) {
                $.ajax({
                    type: "POST",
                    url: _this.customGroupSteps[_this.currentGroupStep],
                    dataType: "html",
                    success: function (data) {
                        $("#custom-group-content").html(data);
                        kendo.unbind("#custom-group-container");
                        kendo.bind($("#custom-group-container"), _this);
                    }
                });
            }
            else {
                _super.prototype.set.call(_this, "isFirstStep", true);
            }
        };
        this.cancelStep = function () {
            console.log("cancelStep");
        };
    }
    return CustomGroupViewModel;
}(kendo.data.ObservableObject));
//# sourceMappingURL=CustomGroupViewModel.js.map