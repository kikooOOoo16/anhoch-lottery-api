import {Injectable, Logger} from '@nestjs/common';
import {InjectModel} from "@nestjs/mongoose";
import {Model} from "mongoose";
import {UserDocument} from "../models/user";
import {CreateUserDTO} from "../dtos/create-user.dto";

@Injectable()
export class UsersService {

    constructor(@InjectModel('User') private readonly userModel: Model<UserDocument>) {}

    async create(createUserDTO: CreateUserDTO): Promise<UserDocument> {
        const newUser = new this.userModel(createUserDTO);

        try {
            return await newUser.save();
        } catch (e) {
            Logger.error(e, 'users.service.ts: crate()');
        }
    }

    async findByEmail(email: string): Promise<UserDocument> {
        let user: UserDocument;
        try {
            user = await this.userModel.findOne({email});
        } catch (e) {
            Logger.error(e, 'users.service.ts: findByEmail()');
        }

        if (!user) {

        }

        return user;
    }
}
