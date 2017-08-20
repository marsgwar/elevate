import {ActivityComputer} from "../../plugin/core/scripts/processors/ActivityComputer";
import {IUserSettings} from "../../plugin/common/scripts/interfaces/IUserSettings";
import {IActivityStatsMap, IActivityStream, IAnalysisData} from "../../plugin/common/scripts/interfaces/IActivityData";
import * as _ from "lodash";

fdescribe("ActivityComputer", () => {

    // Cycling
    it("should compute correctly \"Bon rythme ! 33 KPH !\" @ https://www.strava.com/activities/723224273", () => {

        const powerMeter: boolean = false;

        let userSettingsMock: IUserSettings = window.__fixtures__["fixtures/userSettings/2470979"];
        let stream: IActivityStream = window.__fixtures__["fixtures/activities/723224273/stream"];
        let statsMap: IActivityStatsMap = window.__fixtures__["fixtures/activities/723224273/statsMap"];

        stream.watts = stream.watts_calc; // because powerMeter is false

        let activityComputer: ActivityComputer = new ActivityComputer("Ride", powerMeter, userSettingsMock, userSettingsMock.userWeight, powerMeter, statsMap, stream, null, true);
        let result: IAnalysisData = activityComputer.compute();

        expect(result).not.toBeNull();
        expect(result.speedData).not.toBeNull();
        expect(result.cadenceData).not.toBeNull();
        expect(result.heartRateData).not.toBeNull();
        expect(result.powerData).not.toBeNull();
        expect(result.gradeData).not.toBeNull();
        expect(result.elevationData).not.toBeNull();
        expect(result.paceData).not.toBeNull();

        // Test extended stats
        expect(result.moveRatio.toString()).toMatch(/^0.99967362924/);
        expect(result.speedData.genuineAvgSpeed.toString()).toMatch(/^33.0634084231/);
        expect(result.speedData.totalAvgSpeed.toString()).toMatch(/^33.05261749347/);
        expect(result.speedData.avgPace.toString()).toMatch(/^109/);
        expect(result.speedData.lowerQuartileSpeed.toString()).toMatch(/^27.36/);
        expect(result.speedData.medianSpeed.toString()).toMatch(/^33.48000000000/);
        expect(result.speedData.upperQuartileSpeed.toString()).toMatch(/^38.88/);
        expect(result.speedData.varianceSpeed.toString()).toMatch(/^75.007731480/);
        expect(result.speedData.standardDeviationSpeed.toString()).toMatch(/^8.6607004035/);

        expect(result.paceData.avgPace.toString()).toMatch(/^109/);
        expect(result.paceData.lowerQuartilePace.toString()).toMatch(/^131.5789473684/);
        expect(result.paceData.medianPace.toString()).toMatch(/^107.526881720/);
        expect(result.paceData.upperQuartilePace.toString()).toMatch(/^92.592592592/);
        expect(result.paceData.variancePace.toString()).toMatch(/^47.995052362/);

        expect(result.powerData.hasPowerMeter).toEqual(false);
        expect(result.powerData.avgWatts.toString()).toMatch(/^210.708782239/);
        expect(result.powerData.avgWattsPerKg.toString()).toMatch(/^2.93058111598/);
        expect(result.powerData.weightedPower.toString()).toMatch(/^245.240855956/);
        expect(result.powerData.variabilityIndex.toString()).toMatch(/^1.1638853081/);
        expect(result.powerData.punchFactor.toString()).toMatch(/^1.0218368998/);
        expect(result.powerData.weightedWattsPerKg.toString()).toMatch(/^3.4108603053/);
        expect(result.powerData.lowerQuartileWatts.toString()).toMatch(/^92/);
        expect(result.powerData.medianWatts.toString()).toMatch(/^204/);
        expect(result.powerData.upperQuartileWatts.toString()).toMatch(/^304/);

        expect(result.heartRateData.TRIMP.toString()).toMatch(/^228.48086657/);
        expect(result.heartRateData.TRIMPPerHour.toString()).toMatch(/^134.2688736/);
        expect(result.heartRateData.lowerQuartileHeartRate.toString()).toMatch(/^161/);
        expect(result.heartRateData.medianHeartRate.toString()).toMatch(/^167/);
        expect(result.heartRateData.upperQuartileHeartRate.toString()).toMatch(/^174/);
        expect(result.heartRateData.averageHeartRate.toString()).toMatch(/^164.33806725/);
        expect(result.heartRateData.maxHeartRate.toString()).toMatch(/^190/);
        expect(result.heartRateData.activityHeartRateReserve.toString()).toMatch(/^76.9923014/);
        expect(result.heartRateData.activityHeartRateReserveMax.toString()).toMatch(/^93.548387/);

        expect(result.cadenceData.cadencePercentageMoving.toString()).toMatch(/^89.20640104/);
        expect(result.cadenceData.cadenceTimeMoving.toString()).toMatch(/^5463/);
        expect(result.cadenceData.averageCadenceMoving.toString()).toMatch(/^84.1687717/);
        expect(result.cadenceData.standardDeviationCadence.toString()).toMatch(/^15.7/);
        expect(result.cadenceData.crankRevolutions.toString()).toMatch(/^7740.983333/);
        expect(result.cadenceData.lowerQuartileCadence.toString()).toMatch(/^79/);
        expect(result.cadenceData.medianCadence.toString()).toMatch(/^87/);
        expect(result.cadenceData.upperQuartileCadence.toString()).toMatch(/^93/);

        expect(result.gradeData.avgGrade.toString()).toMatch(/^0.016110032/);
        expect(result.gradeData.lowerQuartileGrade.toString()).toMatch(/^-1.3/);
        expect(result.gradeData.medianGrade.toString()).toMatch(/^0/);
        expect(result.gradeData.upperQuartileGrade.toString()).toMatch(/^1.5/);
        expect(result.gradeData.gradeProfile.toString()).toMatch(/^HILLY/);
        expect(result.gradeData.upFlatDownInSeconds.up.toString()).toMatch(/^1745/);
        expect(result.gradeData.upFlatDownInSeconds.flat.toString()).toMatch(/^3278/);
        expect(result.gradeData.upFlatDownInSeconds.down.toString()).toMatch(/^1103/);
        expect(result.gradeData.upFlatDownInSeconds.total.toString()).toMatch(/^6126/);
        expect(result.gradeData.upFlatDownMoveData.up.toString()).toMatch(/^26.355300/);
        expect(result.gradeData.upFlatDownMoveData.flat.toString()).toMatch(/^34.563514/);
        expect(result.gradeData.upFlatDownMoveData.down.toString()).toMatch(/^39.249791/);
        expect(result.gradeData.upFlatDownDistanceData.up.toString()).toMatch(/^12.775/);
        expect(result.gradeData.upFlatDownDistanceData.flat.toString()).toMatch(/^31.47199999/);
        expect(result.gradeData.upFlatDownDistanceData.down.toString()).toMatch(/^12.0257/);

        expect(result.elevationData.avgElevation.toString()).toMatch(/^240/);
        expect(result.elevationData.accumulatedElevationAscent.toString()).toMatch(/^389.8135095/);
        expect(result.elevationData.accumulatedElevationDescent.toString()).toMatch(/^374.231952/);
        expect(result.elevationData.lowerQuartileElevation.toString()).toMatch(/^215/);
        expect(result.elevationData.medianElevation.toString()).toMatch(/^231/);
        expect(result.elevationData.upperQuartileElevation.toString()).toMatch(/^245/);
    });


    it("estimateRunningPower should provide a consistency average power compared to " +
        "real running power meter (based on https://www.strava.com/activities/874762067)", () => {

        // Given
        const weightKg = 54.32; // Kg
        const meters = 6.9 * 1000; // 6.9 km
        const totalSeconds = 39 * 60 + 48; // 39 min + 48 seconds
        const _expectedPower = 148;

        // When
        let power = ActivityComputer.estimateRunningPower(weightKg, meters, totalSeconds);

        // Then
        expect(power).toEqual(_expectedPower);

    });

    fit("createRunningPowerEstimationStream should provide " +
        "power stats estimations near real running power meter  (based on https://www.strava.com/activities/874762067)", () => {

        // Given
        const _expectedPower = 151; // Real Running Average Power = 151 W (From power meter)
        const _tolerance = 10;
        const athleteWeight = 54.32;
        let stream: IActivityStream = window.__fixtures__["fixtures/activities/874762067/stream"]; // Mikala run sample 1/2 NCNR Run Club

        // When
        let powerArray: number[] = ActivityComputer.createRunningPowerEstimationStream(athleteWeight, stream.grade_adjusted_distance, stream.time);
        let estimatedAvgPower: number = _.mean(powerArray);

        console.log(estimatedAvgPower);

        // Then
        expect(estimatedAvgPower).not.toBeNull();
        expect(estimatedAvgPower).toBeGreaterThanOrEqual((_expectedPower - _tolerance));
        expect(estimatedAvgPower).toBeLessThanOrEqual((_expectedPower + _tolerance));

    });

    fit("createRunningPowerEstimationStream should provide " +
        "power stats estimations near real running power meter  (based on https://www.strava.com/activities/852961332)", () => {

        // Given
        const _expectedPower = 287;
        const _tolerance = 10;
        const athleteWeight = 79.4;
        let stream: IActivityStream = window.__fixtures__["fixtures/activities/852961332/stream"]; // Stryd 3/6 lap test .... brrr

        // When
        let powerArray: number[] = ActivityComputer.createRunningPowerEstimationStream(athleteWeight, stream.grade_adjusted_distance, stream.time);
        let estimatedAvgPower: number = _.mean(powerArray);

        console.log(estimatedAvgPower);

        // Then
        expect(estimatedAvgPower).not.toBeNull();
        expect(estimatedAvgPower).toBeGreaterThanOrEqual((_expectedPower - _tolerance));
        expect(estimatedAvgPower).toBeLessThanOrEqual((_expectedPower + _tolerance));
    });

    fit("createRunningPowerEstimationStream should provide " +
        "power stats estimations near real running power meter" +
        "based on https://www.strava.com/activities/878683797", () => {

        // Given
        const _expectedPower = 296;
        const _tolerance = 10;
        const athleteWeight = 79.4;
        let stream: IActivityStream = window.__fixtures__["fixtures/activities/878683797/stream"]; // Two shooting ranges and a road dedicated to the inventor of Velcro

        // When
        let powerArray: number[] = ActivityComputer.createRunningPowerEstimationStream(athleteWeight, stream.grade_adjusted_distance, stream.time);
        let estimatedAvgPower: number = _.mean(powerArray);

        console.log(estimatedAvgPower);

        // Then
        expect(estimatedAvgPower).not.toBeNull();
        expect(estimatedAvgPower).toBeGreaterThanOrEqual((_expectedPower - _tolerance));
        expect(estimatedAvgPower).toBeLessThanOrEqual((_expectedPower + _tolerance));
    });

    // Running power test
    xit("should compute correctly 'Begin Running Ep 1 // Stade 40min' " +
        "@ https://www.strava.com/activities/887284960", () => {

        // Given
        const activityType = "Run";
        const isTrainer = false;
        const hasPowerMeter = false;
        const bounds: number[] = null;
        const returnZones = true;
        let userSettingsMock: IUserSettings = window.__fixtures__["fixtures/userSettings/2470979"]; // Thomas C user settings
        let stream: IActivityStream = window.__fixtures__["fixtures/activities/887284960/stream"];
        let statsMap: IActivityStatsMap = window.__fixtures__["fixtures/activities/887284960/statsMap"];

        // When
        let activityComputer: ActivityComputer = new ActivityComputer(activityType, isTrainer, userSettingsMock, userSettingsMock.userWeight, hasPowerMeter, statsMap, stream, bounds, returnZones);
        let result: IAnalysisData = activityComputer.compute();

        console.log("avgWatts", result.powerData.avgWatts);
        console.log("avgWattsPerKg", result.powerData.avgWattsPerKg);

        // Then
        expect(result.powerData).not.toBeNull();
        // expect(result.powerData).not.toBeNull();
    });

    // Running estimation test
    xit("should compute correctly '1/2 NCNR Run Club' @ https://www.strava.com/activities/874762067", () => {

        // Given
        let userSettingsMock: IUserSettings = window.__fixtures__["fixtures/userSettings/2470979"];
        let stream: IActivityStream = window.__fixtures__["fixtures/activities/874762067/stream"];
        let statsMap: IActivityStatsMap = window.__fixtures__["fixtures/activities/874762067/statsMap"];

        userSettingsMock.userGender = "women";
        userSettingsMock.userWeight = 54.32;

        let activityComputer: ActivityComputer = new ActivityComputer("Run", false, userSettingsMock, userSettingsMock.userWeight, true, statsMap, stream, null, true);
        let resultWithPowerMeter: IAnalysisData = activityComputer.compute();
        expect(resultWithPowerMeter.powerData.avgWatts.toString()).toMatch(/^151/);

        console.log(resultWithPowerMeter.powerData);

        // Test without power data and power meter...
        delete stream.watts;
        delete stream.watts_calc;
        activityComputer = new ActivityComputer("Run", false, userSettingsMock, userSettingsMock.userWeight, false, statsMap, stream, null, true);
        let resultWithoutPowerMeter: IAnalysisData = activityComputer.compute();

        console.log(resultWithoutPowerMeter.powerData);

        // TODO Other examples with real running power data:
        // https://www.strava.com/activities/849522984
        // https://www.strava.com/activities/862889505
        // https://www.strava.com/activities/852961332

    });


});

