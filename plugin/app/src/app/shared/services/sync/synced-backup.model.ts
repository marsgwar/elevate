import { SyncedActivityModel } from "../../../../../../shared/models/sync/synced-activity.model";
import { DatedAthleteSettingsModel } from "../../../../../../shared/models/athlete-settings/dated-athlete-settings.model";

export class SyncedBackupModel {
	public lastSyncDateTime: number;
	public syncedActivities: SyncedActivityModel[];
	public pluginVersion: string;
	public datedAthleteSettings: DatedAthleteSettingsModel[];
}
