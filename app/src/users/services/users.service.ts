import {Injectable, Logger} from '@nestjs/common';
import {InjectModel} from "@nestjs/mongoose";
import {Model} from "mongoose";
import {UserDocument} from "../models/user.model";
import {CreateUserDTO} from "../dtos/create-user.dto";
import {ProblemCreatingNewUserException} from "../../exceptions/user-related/problem-creating-new-user.exception";
import {ProblemRetrievingUserDataException} from "../../exceptions/user-related/problem-retrieving-user-data.exception";
import {NoUserFoundException} from "../../exceptions/user-related/no-user-found.exception";
import {HelperService} from "../../common/services/helper.service";
import {UpdateUserDTO} from "../dtos/update-user.dto";
import {ProblemUpdatingUserDataException} from "../../exceptions/user-related/problem-updating-user-data.exception";
import {ProblemUpdatingPlayedTodayStatusException} from "../../exceptions/user-related/problem-updating-played-today-status.exception";

@Injectable()
export class UsersService {

    constructor(@InjectModel('User') private readonly userModel: Model<UserDocument>) {}

    async create(createUserDTO: CreateUserDTO): Promise<UserDocument> {
        const newUser: UserDocument = new this.userModel(createUserDTO);

        try {
            return await newUser.save();
        } catch (e) {
            Logger.error(e, 'users.service.ts: create()');
            HelperService.handleDuplicateKeyErr(e);

            throw new ProblemCreatingNewUserException();
        }
    }

    async update(user: UserDocument, updateUserDTO: Partial<UpdateUserDTO>): Promise<UserDocument> {
        HelperService.checkIfObjectIsEmpty(updateUserDTO);

        Object.assign(user, updateUserDTO);

        try {
            return await this.userModel.findByIdAndUpdate(user.id, {...user}, {new: true});
        } catch (e) {
            Logger.error(e, 'users.service.ts: update()');
            HelperService.handleDuplicateKeyErr(e);

            throw new ProblemUpdatingUserDataException();
        }
    }

    async modifyPlayedTodayStatus(user: UserDocument, playedToday: boolean) {
        let updatedUser: UserDocument;
        try {
            updatedUser = await this.userModel.findByIdAndUpdate(user.id, {
                playedToday
            }, {new: true})
        } catch (e) {
            Logger.error(e, 'users.service.ts: modifyPlayedTodayStatus');
            throw new ProblemUpdatingPlayedTodayStatusException();
        }

        if (!updatedUser) {
            throw new NoUserFoundException();
        }

        return updatedUser;
    }

    async findByEmail(email: string): Promise<UserDocument> {
        let user: UserDocument;
        try {
            user = await this.userModel.findOne({email});
        } catch (e) {
            Logger.error(e, 'users.service.ts: findByEmail()');
            throw new ProblemRetrievingUserDataException();
        }

        if (!user) {
            throw new NoUserFoundException();
        }

        return user;
    }

    async findById(id: string): Promise<UserDocument> {
        try {
            return await this.userModel.findById(id);
        } catch (e) {
            Logger.error(e, 'users.service.ts: findByEmail()');
            throw new ProblemRetrievingUserDataException();
        }
    }
}
