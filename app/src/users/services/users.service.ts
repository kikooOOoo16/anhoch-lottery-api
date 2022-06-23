import {Injectable, Logger} from '@nestjs/common';
import {InjectModel} from "@nestjs/mongoose";
import {Model} from "mongoose";
import {UserDocument} from "../models/user";
import {CreateUserDTO} from "../dtos/create-user.dto";
import {ProblemCreatingNewUserException} from "../../exceptions/user-related/problem-creating-new-user.exception";
import {ProblemRetrievingUserDataException} from "../../exceptions/user-related/problem-retrieving-user-data.exception";
import {NoUserFoundException} from "../../exceptions/user-related/no-user-found.exception";

@Injectable()
export class UsersService {

    constructor(@InjectModel('User') private readonly userModel: Model<UserDocument>) {}

    async create(createUserDTO: CreateUserDTO): Promise<UserDocument> {
        const newUser = new this.userModel(createUserDTO);

        try {
            return await newUser.save();
        } catch (e) {
            Logger.error(e, 'users.service.ts: create()');
            throw new ProblemCreatingNewUserException();
        }
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
}
