class CustomGroupViewModel extends kendo.data.ObservableObject {

    constructor() {
        super();
    }

    // Html elements
    standardClassesSettingsElement: HTMLElement;

    customGroupSteps: Array<string> = [
        "SelectGroupingTypeStep",
        "enterClassConfigurationsStep",
        "StudentGroupingOptionsStep",
        "SaveCustomGroupStep"
    ];

    groupingOptions = new kendo.data.ObservableArray([
        { caption: "Mixed Ability", value: GroupingMethod.MixedAbility, id: "mixed-ability" },
        { caption: "Streaming", value: GroupingMethod.Streaming, id: "streaming" },
        { caption: "Banding", value: GroupingMethod.Banding, id: "banding" },
        { caption: "Top, Mixed Middle, Lowest", value: GroupingMethod.TopMiddleLowest, id: "top-middle-lowest" },
        { caption: "Language", value: GroupingMethod.Language, id: "languages" }
    ]);


    streamingOptions = new kendo.data.ObservableArray([
        { caption: "Overall Ability", value: StreamType.OverallAbilty, id: "overall-ability" },
        { caption: "English", value: StreamType.English, id: "english" },
        { caption: "Maths Achievement", value: StreamType.MathsAchievement, id: "maths-Achievement" }
    ]);

    topMiddleLowestGroupingOptions = [
        { caption: "Streaming", value: BandStreamType.Streaming, id: "streaming-tml" },
        { caption: "Parallel", value: BandStreamType.Parallel, id: "parallel-tml" }
    ];

    selectedGroupingOption = 0;
    selectedStreamingOption = 0;
    selectedTopClassGroupingOption = 0;
    selectedLowestClassGroupingOption = 0;
    selectedGenderOption = 1;
    currentGroupStep = 0;
    isLastStep = false;
    isFirstStep = true;
    isCoedSchool = true;
    studentCount = 200;
    classCount = 1;

    onClassCountChanged = () => {
        
    }

    nextStep = () => {
        super.set("isFirstStep", false);
        super.set("currentGroupStep", this.currentGroupStep + 1);

        console.log("Step : ", this.currentGroupStep, this.customGroupSteps[this.currentGroupStep]);
        if (this.currentGroupStep < this.customGroupSteps.length) {
            $.ajax({
                type: "POST",
                url: this.customGroupSteps[this.currentGroupStep],
                dataType: "html",
                success: data => {
                    $("#custom-group-content").html(data);
                    kendo.unbind("#custom-group-container");
                    kendo.bind($("#custom-group-container"), this);
                }
            });
        } else {
            super.set("isLastStep", true);
        }
    };
    previousStep = () => {
        super.set("isLastStep", false);
        super.set("currentGroupStep", this.currentGroupStep - 1);

        console.log("Step : ", this.currentGroupStep, this.customGroupSteps[this.currentGroupStep]);
        if (this.currentGroupStep > 0) {
            $.ajax({
                type: "POST",
                url: this.customGroupSteps[this.currentGroupStep],
                dataType: "html",
                success: data => {
                    $("#custom-group-content").html(data);
                    kendo.unbind("#custom-group-container");
                    kendo.bind($("#custom-group-container"), this);
                }
            });
        } else {
            super.set("isFirstStep", true);
        }
    };
    cancelStep = () => {
        console.log("cancelStep");
    };

}