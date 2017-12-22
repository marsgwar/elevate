import { Injectable } from '@angular/core';
import { AthleteProfileDao } from "../../dao/athlete-profile/athlete-profile.dao";
import { AthleteProfileModel } from "../../../../../../common/scripts/models/AthleteProfile";
import { NotImplementedException } from "../../exceptions/not-implemented.exception";

@Injectable()
export class AthleteProfileService {

	constructor(public athleteProfileDao: AthleteProfileDao) {
	}

	public get(): Promise<AthleteProfileModel> {
		return this.athleteProfileDao.get();
	}

	public set(athleteProfileModel: AthleteProfileModel): Promise<AthleteProfileModel> {
		throw new NotImplementedException();
	}
}
